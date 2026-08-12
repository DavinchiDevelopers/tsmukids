#!/usr/bin/env node
/**
 * Build card thumbnails for doctor photos (faster list loading).
 *
 *   node scripts/build-doctor-thumbs.mjs
 */
import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';

const srcDir = path.join(process.cwd(), 'public', 'images', 'doctors');
const thumbDir = path.join(srcDir, 'thumbs');
const tmpDir = path.join(process.cwd(), '.tmp-doctor-thumbs');
const MAX_EDGE = 480;
const QUALITY = '78';

fs.mkdirSync(thumbDir, { recursive: true });
fs.mkdirSync(tmpDir, { recursive: true });

const files = fs.readdirSync(srcDir).filter(f => /\.webp$/i.test(f));
let n = 0;
for (const file of files) {
  const src = path.join(srcDir, file);
  const dest = path.join(thumbDir, file);
  const tmpPng = path.join(tmpDir, `${file}.png`);
  try {
    execFileSync('dwebp', [src, '-o', tmpPng], { stdio: 'pipe' });
    execFileSync(
      'cwebp',
      ['-q', QUALITY, '-m', '6', '-resize', '0', String(MAX_EDGE), tmpPng, '-o', dest],
      { stdio: 'pipe' },
    );
    n++;
    console.log(`✓ thumbs/${file} ${(fs.statSync(dest).size / 1024).toFixed(0)}KB`);
  } catch (err) {
    console.error(`✗ ${file}`, err.message || err);
  }
}
fs.rmSync(tmpDir, { recursive: true, force: true });
console.log(`\nCreated ${n} thumbs in ${thumbDir}`);
