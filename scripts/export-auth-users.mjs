#!/usr/bin/env node
/**
 * Export Firebase Auth users metadata into the latest Firestore backup folder.
 * Passwords are NOT exported.
 *
 *   node scripts/export-auth-users.mjs
 *   node scripts/export-auth-users.mjs backups/firestore-...
 */
import fs from 'fs';
import path from 'path';
import admin from 'firebase-admin';
import {
  findLatestBackupDir,
  initFirestore,
  resolveServiceAccountPath,
} from './firestore-backup-utils.mjs';

const backupsRoot = path.join(process.cwd(), 'backups');
const backupArg = process.argv[2];
const backupDir = backupArg
  ? path.resolve(backupArg)
  : findLatestBackupDir(backupsRoot);

if (!backupDir) {
  throw new Error('No backup directory found');
}

initFirestore(); // ensures admin app is initialized
const auth = admin.auth();
const users = [];
let nextPageToken;

do {
  const res = await auth.listUsers(1000, nextPageToken);
  for (const u of res.users) {
    users.push({
      uid: u.uid,
      email: u.email || null,
      emailVerified: u.emailVerified,
      displayName: u.displayName || null,
      phoneNumber: u.phoneNumber || null,
      disabled: u.disabled,
      providerData: u.providerData.map(p => ({
        providerId: p.providerId,
        uid: p.uid,
        email: p.email || null,
      })),
      customClaims: u.customClaims || null,
      metadata: {
        creationTime: u.metadata.creationTime,
        lastSignInTime: u.metadata.lastSignInTime,
      },
    });
  }
  nextPageToken = res.pageToken;
} while (nextPageToken);

const outPath = path.join(backupDir, 'auth-users.json');
fs.writeFileSync(
  outPath,
  JSON.stringify(
    {
      exportedAt: new Date().toISOString(),
      projectId: admin.app().options.projectId,
      credentials: resolveServiceAccountPath(),
      note:
        'Passwords are NOT included. Create admin user(s) again in the new project (Email/Password), or use Identity Toolkit bulk export/import for password hashes.',
      users,
    },
    null,
    2
  )
);

console.log(`Auth users: ${users.length}`);
users.forEach(u => console.log(` - ${u.email || u.uid}${u.disabled ? ' (disabled)' : ''}`));
console.log(`Wrote ${outPath}`);
