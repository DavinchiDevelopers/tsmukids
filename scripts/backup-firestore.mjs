#!/usr/bin/env node
/**
 * Full Firestore backup for tsmukids.
 *
 * Usage:
 *   npm run backup:firebase
 *   node scripts/backup-firestore.mjs
 *   GOOGLE_APPLICATION_CREDENTIALS=/path/to/key.json node scripts/backup-firestore.mjs
 */

import fs from 'fs';
import path from 'path';
import {
  exportCollectionTree,
  initFirestore,
  resolveServiceAccountPath,
  writeBackupToDir,
} from './firestore-backup-utils.mjs';

const backupsRoot = path.join(process.cwd(), 'backups');
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const backupDir = path.join(backupsRoot, `firestore-${timestamp}`);

async function main() {
  console.log('Firestore backup');
  console.log(`  Credentials: ${resolveServiceAccountPath()}`);

  const db = initFirestore();
  const projectId = db.projectId;

  console.log(`  Project: ${projectId}`);
  const rootCollections = await db.listCollections();
  const collectionIds = rootCollections.map(ref => ref.id);
  console.log(`  Found ${collectionIds.length} root collection(s): ${collectionIds.join(', ') || '(none)'}`);

  const collections = {};
  for (const collectionRef of rootCollections) {
    const started = Date.now();
    process.stdout.write(`  Exporting ${collectionRef.id}...`);
    collections[collectionRef.id] = await exportCollectionTree(collectionRef);
    console.log(` ${collections[collectionRef.id].length} doc(s) (${Date.now() - started}ms)`);
  }

  if (collectionIds.length === 0) {
    console.warn('  Warning: no collections found.');
  }

  const payload = {
    version: 1,
    exportedAt: new Date().toISOString(),
    projectId,
    collections,
  };

  const manifest = writeBackupToDir(backupDir, payload);

  console.log(`\nBackup saved to:\n  ${backupDir}\n`);
  console.log('Collections:');
  for (const id of manifest.collectionIds) {
    console.log(`  - ${id}: ${manifest.documentCounts[id]} document(s)`);
  }
  console.log(`\nTotal documents: ${manifest.totalDocuments}`);
  console.log('\nRestore later:');
  console.log(`  npm run restore:firebase -- "${backupDir}"`);
}

main().catch(err => {
  console.error('\nBackup failed:', err.message || err);
  process.exit(1);
});
