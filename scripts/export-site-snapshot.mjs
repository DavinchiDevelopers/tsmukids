#!/usr/bin/env node
/**
 * Export Firestore site data to src/data/site-snapshot.json for fast SSG / SSR.
 *
 *   node scripts/export-site-snapshot.mjs
 */
import fs from 'fs';
import path from 'path';
import { initFirestore } from './firestore-backup-utils.mjs';

const outPath = path.join(process.cwd(), 'src', 'data', 'site-snapshot.json');
const db = initFirestore();

async function getOrdered(collectionId) {
  try {
    const snap = await db.collection(collectionId).orderBy('order', 'asc').get();
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch {
    const snap = await db.collection(collectionId).get();
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  }
}

const [settingsSnap, doctors, services, departments, equipment, gallery] = await Promise.all([
  db.doc('settings/clinic').get(),
  getOrdered('doctors'),
  getOrdered('services'),
  getOrdered('departments'),
  getOrdered('equipment'),
  getOrdered('gallery'),
]);

const payload = {
  exportedAt: new Date().toISOString(),
  settings: settingsSnap.exists ? settingsSnap.data() : null,
  doctors,
  services,
  departments,
  equipment,
  gallery,
};

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(payload));

const withPhoto = doctors.filter(d => d.photo).length;
console.log(`Wrote ${outPath}`);
console.log(
  `doctors=${doctors.length} (photo=${withPhoto}), services=${services.length}, departments=${departments.length}`
);
