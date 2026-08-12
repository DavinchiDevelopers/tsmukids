#!/usr/bin/env node
/**
 * Restore Firestore from a backup created by backup-firestore.mjs
 *
 * Usage:
 *   npm run restore:firebase -- backups/firestore-2026-05-23T12-00-00-000Z
 *   npm run restore:firebase -- --latest
 *   npm run restore:firebase -- backups/firestore-... --merge
 */

import path from 'path';
import {
  findLatestBackupDir,
  importFromPayload,
  initFirestore,
  loadBackupPayload,
  resolveServiceAccountPath,
} from './firestore-backup-utils.mjs';

const backupsRoot = path.join(process.cwd(), 'backups');

function parseArgs(argv) {
  const args = argv.slice(2);
  const merge = args.includes('--merge');
  const useLatest = args.includes('--latest');
  const backupArg = args.find(a => !a.startsWith('--'));

  let backupDir = backupArg ? path.resolve(backupArg) : null;
  if (useLatest) {
    backupDir = findLatestBackupDir(backupsRoot);
    if (!backupDir) {
      throw new Error(`No backups found in ${backupsRoot}`);
    }
  }

  if (!backupDir) {
    throw new Error(
      'Specify backup directory or --latest\n' +
        'Example: npm run restore:firebase -- backups/firestore-2026-05-23T12-00-00-000Z'
    );
  }

  return { backupDir, merge };
}

async function main() {
  const { backupDir, merge } = parseArgs(process.argv);

  console.log('Firestore restore');
  console.log(`  Credentials: ${resolveServiceAccountPath()}`);
  console.log(`  Backup: ${backupDir}`);
  console.log(`  Mode: ${merge ? 'merge (keep fields not in backup)' : 'overwrite documents'}`);

  const payload = loadBackupPayload(backupDir);
  const db = initFirestore();

  if (db.projectId !== payload.projectId) {
    console.warn(
      `  Warning: backup project "${payload.projectId}" != current "${db.projectId}"`
    );
  }

  console.log(`  Exported at: ${payload.exportedAt}`);
  console.log('  Importing collections...\n');

  const total = await importFromPayload(db, payload.collections, { merge });

  console.log(`\nDone. Imported ${total} document(s).`);
}

main().catch(err => {
  console.error('\nRestore failed:', err.message || err);
  process.exit(1);
});
