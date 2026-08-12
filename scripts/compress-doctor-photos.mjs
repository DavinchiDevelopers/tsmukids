#!/usr/bin/env node
/**
 * Compress doctor photos used on the site to WebP and update Firestore paths.
 *
 *   node scripts/compress-doctor-photos.mjs
 */
import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';
import { initFirestore } from './firestore-backup-utils.mjs';

const doctorsDir = path.join(process.cwd(), 'public', 'images', 'doctors');
const tmpDir = path.join(process.cwd(), '.tmp-doctor-compress');
const MAX_EDGE = 1000;
const WEBP_QUALITY = '80';

fs.mkdirSync(tmpDir, { recursive: true });
fs.mkdirSync(doctorsDir, { recursive: true });

const db = initFirestore();
const snap = await db.collection('doctors').get();
const doctors = snap.docs.map(d => ({ id: d.id, ref: d.ref, ...d.data() }));

const used = doctors.filter(d => d.photo && String(d.photo).startsWith('/images/doctors/'));
console.log(`Doctors with local photos: ${used.length}`);

const keepWebp = new Set();
let ok = 0;
let failed = 0;

for (const doc of used) {
  const rel = String(doc.photo).replace(/^\//, '');
  const srcAbs = path.join(process.cwd(), 'public', ...rel.split('/'));
  const base = path.basename(srcAbs).replace(/\.(jpe?g|png|webp)$/i, '');
  const destName = `${base}.webp`;
  const destAbs = path.join(doctorsDir, destName);
  const publicPath = `/images/doctors/${destName}`;

  if (!fs.existsSync(srcAbs)) {
    // maybe already webp or alternate spelling
    const webpTry = path.join(doctorsDir, destName);
    if (fs.existsSync(webpTry)) {
      keepWebp.add(destName);
      if (doc.photo !== publicPath) {
        await doc.ref.update({ photo: publicPath });
      }
      ok++;
      continue;
    }
    console.warn(`missing: ${doc.photo} (${doc.nameRu})`);
    failed++;
    continue;
  }

  try {
    const tmpJpg = path.join(tmpDir, `${base}-resized.jpg`);
    // Resize longest edge to MAX_EDGE, force jpeg intermediate
    execFileSync('sips', ['-Z', String(MAX_EDGE), srcAbs, '--out', tmpJpg], { stdio: 'pipe' });
    // Ensure jpeg
    execFileSync('sips', ['-s', 'format', 'jpeg', tmpJpg, '--out', tmpJpg], { stdio: 'pipe' });
    execFileSync('cwebp', ['-q', WEBP_QUALITY, '-m', '6', tmpJpg, '-o', destAbs], { stdio: 'pipe' });

    const before = fs.statSync(srcAbs).size;
    const after = fs.statSync(destAbs).size;
    keepWebp.add(destName);

    if (doc.photo !== publicPath) {
      await doc.ref.update({ photo: publicPath });
    }

    console.log(
      `✓ ${destName}  ${(before / 1024 / 1024).toFixed(1)}MB → ${(after / 1024).toFixed(0)}KB`
    );
    ok++;
  } catch (err) {
    console.error(`✗ ${doc.photo}:`, err.message || err);
    failed++;
  }
}

// Remove originals / alternates not needed on site
const allFiles = fs.readdirSync(doctorsDir);
let removed = 0;
for (const f of allFiles) {
  if (!keepWebp.has(f)) {
    fs.unlinkSync(path.join(doctorsDir, f));
    removed++;
  }
}

fs.rmSync(tmpDir, { recursive: true, force: true });

const du = execFileSync('du', ['-sh', doctorsDir], { encoding: 'utf8' }).trim();
console.log(`\nDone: ${ok} compressed, ${failed} failed, ${removed} removed`);
console.log(`Folder size: ${du}`);
console.log(`Kept files: ${keepWebp.size}`);
