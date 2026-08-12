#!/usr/bin/env node
/**
 * Match photos/*.jpg to Firestore doctors by name, copy to public/images/doctors,
 * update doctor.photo, move unmatched photos to photos/not-on-site/.
 *
 * Usage:
 *   node scripts/match-doctor-photos.mjs          # dry run
 *   node scripts/match-doctor-photos.mjs --apply  # write files + Firestore
 */
import fs from 'fs';
import path from 'path';
import { initFirestore } from './firestore-backup-utils.mjs';

const APPLY = process.argv.includes('--apply');

const db = initFirestore();
const snap = await db.collection('doctors').get();
const doctors = snap.docs.map(d => ({ id: d.id, ...d.data() }));

const photoDir = path.join(process.cwd(), 'photos');
const notOnSiteDir = path.join(photoDir, 'not-on-site');
const publicDoctorsDir = path.join(process.cwd(), 'public', 'images', 'doctors');
const photos = fs.readdirSync(photoDir).filter(f => /\.(jpe?g|png|webp)$/i.test(f));

function translitMap(s) {
  const map = {
    а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'yo', ж: 'j', з: 'z', и: 'i', й: 'y',
    к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f',
    х: 'x', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'sh', ъ: '', ы: 'i', ь: '', э: 'e', ю: 'yu', я: 'ya',
    қ: 'q', ғ: 'g', ў: 'o', ҳ: 'h', ґ: 'g',
  };
  return [...s].map(c => map[c] ?? c).join('');
}

function fold(s) {
  return translitMap(String(s || '').toLowerCase())
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[‘’ʻʼ`´]/g, '')
    .replace(/kh/g, 'x')
    .replace(/zh/g, 'j')
    .replace(/dj/g, 'j')
    .replace(/ye/g, 'e')
    .replace(/yo/g, 'o')
    .replace(/yu/g, 'u')
    .replace(/ya/g, 'a')
    .replace(/iy/g, 'i')
    .replace(/yi/g, 'i')
    .replace(/w/g, 'v')
    // keep plain "h" (sh/ch/ovich) — do not map h→x
    .replace(/o['']g['']li|ogli|ugli|qizi|kizi|\buli\b/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Extra fold for comparing x/h variants without breaking patronymic suffixes */
function softFold(s) {
  return fold(s).replace(/h/g, 'x');
}

function tokens(s) {
  return fold(s).split(' ').filter(t => t.length > 1);
}

function lev(a, b) {
  if (a === b) return 0;
  const m = a.length;
  const n = b.length;
  if (Math.abs(m - n) > 3) return 99;
  const dp = Array.from({ length: m + 1 }, (_, i) => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
  }
  return dp[m][n];
}

function vowelsFold(s) {
  return s.replace(/[ao]/g, 'a').replace(/[ue]/g, 'u');
}

function isPatronymicToken(t) {
  return /(ovich|evich|ovna|evna|ogli|ugli|qizi|kizi)$/.test(t);
}

function tokenSimilar(a, b) {
  if (a === b) return 1;
  if (vowelsFold(a) === vowelsFold(b)) return 0.97;

  // Never treat given name ≈ patronymic root (shavkat ≠ shavkatovich)
  if (isPatronymicToken(a) !== isPatronymicToken(b)) {
    const [short, long] = a.length <= b.length ? [a, b] : [b, a];
    if (isPatronymicToken(long) && (long.startsWith(short) || vowelsFold(long).startsWith(vowelsFold(short)))) {
      return 0;
    }
  }

  const [short, long] = a.length <= b.length ? [a, b] : [b, a];
  if (long.startsWith(short) && short.length >= 5 && long.length - short.length <= 3) return 0.92;
  if (
    vowelsFold(long).startsWith(vowelsFold(short)) &&
    short.length >= 4 &&
    long.length - short.length <= 4
  ) {
    return 0.88;
  }

  const min = Math.min(a.length, b.length);
  if (min >= 4) {
    let pref = 0;
    while (pref < min && a[pref] === b[pref]) pref++;
    if (pref >= 4 && pref / Math.max(a.length, b.length) >= 0.55) return 0.85;
    const va = vowelsFold(a);
    const vb = vowelsFold(b);
    let vpref = 0;
    const vmin = Math.min(va.length, vb.length);
    while (vpref < vmin && va[vpref] === vb[vpref]) vpref++;
    if (vpref >= 4 && vpref / Math.max(va.length, vb.length) >= 0.55) return 0.82;
  }

  const d = Math.min(lev(a, b), lev(vowelsFold(a), vowelsFold(b)));
  const maxl = Math.max(a.length, b.length);
  if (d <= 1 && maxl >= 4) return 0.95;
  if (d <= 2 && maxl >= 6) return 0.85;
  if (d <= 3 && maxl >= 9) return 0.75;
  return 0;
}

function matchScore(pTokens, dTokens) {
  const used = new Set();
  let sum = 0;
  let pairs = 0;
  const pairDetails = [];
  for (const p of pTokens) {
    let best = 0;
    let bestJ = -1;
    for (let j = 0; j < dTokens.length; j++) {
      if (used.has(j)) continue;
      const s = tokenSimilar(p, dTokens[j]);
      if (s > best) {
        best = s;
        bestJ = j;
      }
    }
    if (best >= 0.75) {
      used.add(bestJ);
      sum += best;
      pairs++;
      pairDetails.push([p, dTokens[bestJ], best]);
    }
  }
  return { score: sum, pairs, pairDetails };
}

function photoBaseName(file) {
  return file.replace(/\.(jpe?g|png|webp)$/i, '').replace(/\s*\(\d+\)\s*$/, '').trim();
}

function slugifyFile(name, ext) {
  const base = fold(name).replace(/\s+/g, '-') || 'doctor';
  const e = ext.toLowerCase() === '.jpeg' ? '.jpg' : ext.toLowerCase();
  return `${base}${e}`;
}

const photoGroups = new Map();
for (const f of photos) {
  const base = photoBaseName(f);
  if (!photoGroups.has(base)) photoGroups.set(base, []);
  photoGroups.get(base).push(f);
}

const candidates = [];
for (const [base, files] of photoGroups) {
  const pTokens = tokens(base);
  if (pTokens.length < 2) continue;
  const photoSurname = pTokens[0];

  for (const doc of doctors) {
    const dTokens = [...new Set([...tokens(doc.nameRu), ...tokens(doc.nameUz)])];
    // Surname must match strongly (photo files are SURNAME FIRST ...)
    const surnameHit = Math.max(...dTokens.map(t => tokenSimilar(photoSurname, t)), 0);
    if (surnameHit < 0.85) continue;

    const { score, pairs, pairDetails } = matchScore(pTokens, dTokens);
    // Given name (2nd photo token) must match a doctor given name, not only surname+patronymic
    const given = pTokens[1];
    const givenHit = Math.max(
      ...dTokens.filter(t => !isPatronymicToken(t)).map(t => tokenSimilar(given, t)),
      0
    );
    if (givenHit < 0.75) continue;

    // Need surname + first name at least
    if (pairs >= 2 && score >= 1.8) {
      candidates.push({
        base,
        files,
        doc,
        score: score + surnameHit * 0.1 + givenHit * 0.1,
        pairs,
        pairDetails,
        pTokens,
        dTokens,
      });
    }
  }
}

candidates.sort((a, b) => b.score - a.score || b.pairs - a.pairs);

const usedDocs = new Set();
const usedPhotos = new Set();
const matched = [];
for (const c of candidates) {
  if (usedDocs.has(c.doc.id) || usedPhotos.has(c.base)) continue;
  usedDocs.add(c.doc.id);
  usedPhotos.add(c.base);
  const preferred = c.files.find(f => !/\(\d+\)/.test(f)) || c.files[0];
  matched.push({ ...c, preferred });
}

const unmatchedDoctors = doctors.filter(d => !usedDocs.has(d.id));
const unmatchedPhotos = [...photoGroups.entries()].filter(([b]) => !usedPhotos.has(b));

console.log('=== MATCHED', matched.length, '===');
matched.sort((a, b) => a.doc.nameRu.localeCompare(b.doc.nameRu, 'ru'));
for (const m of matched) {
  console.log(
    `✓ ${m.doc.nameRu.trim()}  <=  ${m.preferred}  (score=${m.score.toFixed(2)}, pairs=${m.pairs})`
  );
}

console.log('\n=== DOCTORS WITHOUT PHOTO', unmatchedDoctors.length, '===');
for (const d of unmatchedDoctors) {
  console.log(`✗ ${d.nameRu.trim()}`);
}

console.log('\n=== PHOTOS NOT ON SITE', unmatchedPhotos.length, '===');
for (const [base, files] of unmatchedPhotos.sort((a, b) => a[0].localeCompare(b[0]))) {
  console.log(`? ${base} (${files.join(', ')})`);
}

console.log(
  `\nSUMMARY: matched ${matched.length}/${doctors.length} doctors; ${unmatchedPhotos.length} people only in photos; ${photos.length} photo files`
);

if (!APPLY) {
  console.log('\nDry run only. Re-run with --apply to copy photos, update Firestore, and move leftovers.');
  process.exit(0);
}

fs.mkdirSync(publicDoctorsDir, { recursive: true });
fs.mkdirSync(notOnSiteDir, { recursive: true });

const updates = [];
for (const m of matched) {
  const ext = path.extname(m.preferred);
  const destName = slugifyFile(m.base, ext);
  fs.copyFileSync(path.join(photoDir, m.preferred), path.join(publicDoctorsDir, destName));

  m.files
    .filter(f => f !== m.preferred)
    .forEach((f, i) => {
      const aExt = path.extname(f);
      const altName = slugifyFile(m.base, aExt).replace(/(\.[^.]+)$/, `-${i + 2}$1`);
      fs.copyFileSync(path.join(photoDir, f), path.join(publicDoctorsDir, altName));
    });

  updates.push({ id: m.doc.id, photo: `/images/doctors/${destName}`, nameRu: m.doc.nameRu });
}

for (const { id, photo } of updates) {
  await db.collection('doctors').doc(id).update({ photo });
}

for (const [, files] of unmatchedPhotos) {
  for (const f of files) {
    const from = path.join(photoDir, f);
    const to = path.join(notOnSiteDir, f);
    if (fs.existsSync(from)) fs.renameSync(from, to);
  }
}

console.log(`\nApplied: updated ${updates.length} doctors in Firestore`);
console.log(`Copied matched photos to ${publicDoctorsDir}`);
console.log(`Moved unmatched photos to ${notOnSiteDir}`);
