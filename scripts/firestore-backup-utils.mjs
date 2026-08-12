import fs from 'fs';
import path from 'path';
import admin from 'firebase-admin';

export const DEFAULT_SERVICE_ACCOUNT = path.join(
  process.cwd(),
  'tsmukids-firebase-adminsdk.json'
);

export function resolveServiceAccountPath() {
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    return process.env.GOOGLE_APPLICATION_CREDENTIALS;
  }
  return DEFAULT_SERVICE_ACCOUNT;
}

export function initFirestore(projectIdOverride) {
  const serviceAccountPath = resolveServiceAccountPath();
  const useAdc = process.env.FIREBASE_USE_ADC === '1' || process.env.GOOGLE_CLOUD_PROJECT;

  if (!admin.apps.length) {
    if (useAdc || !fs.existsSync(serviceAccountPath)) {
      const projectId =
        projectIdOverride ||
        process.env.FIREBASE_PROJECT_ID ||
        process.env.GOOGLE_CLOUD_PROJECT ||
        'tsmukids';
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        projectId,
      });
    } else {
      const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: projectIdOverride || serviceAccount.project_id,
      });
    }
  }

  return admin.firestore();
}

export function serializeFirestoreValue(value) {
  if (value === null || value === undefined) return value;

  if (value instanceof admin.firestore.Timestamp) {
    return {
      __firestoreType: 'Timestamp',
      seconds: value.seconds,
      nanoseconds: value.nanoseconds,
      iso: value.toDate().toISOString(),
    };
  }

  if (value instanceof admin.firestore.GeoPoint) {
    return {
      __firestoreType: 'GeoPoint',
      latitude: value.latitude,
      longitude: value.longitude,
    };
  }

  if (value instanceof admin.firestore.DocumentReference) {
    return {
      __firestoreType: 'DocumentReference',
      path: value.path,
    };
  }

  if (Array.isArray(value)) {
    return value.map(serializeFirestoreValue);
  }

  if (typeof value === 'object') {
    const out = {};
    for (const [key, nested] of Object.entries(value)) {
      out[key] = serializeFirestoreValue(nested);
    }
    return out;
  }

  return value;
}

export function deserializeFirestoreValue(value) {
  if (value === null || value === undefined) return value;

  if (Array.isArray(value)) {
    return value.map(deserializeFirestoreValue);
  }

  if (typeof value === 'object' && value.__firestoreType === 'Timestamp') {
    return new admin.firestore.Timestamp(value.seconds, value.nanoseconds);
  }

  if (typeof value === 'object' && value.__firestoreType === 'GeoPoint') {
    return new admin.firestore.GeoPoint(value.latitude, value.longitude);
  }

  if (typeof value === 'object' && value.__firestoreType === 'DocumentReference') {
    return admin.firestore().doc(value.path);
  }

  if (typeof value === 'object' && !Array.isArray(value)) {
    const out = {};
    for (const [key, nested] of Object.entries(value)) {
      if (key === '__firestoreType') continue;
      out[key] = deserializeFirestoreValue(nested);
    }
    return out;
  }

  return value;
}

export async function exportCollectionTree(collectionRef) {
  const snapshot = await collectionRef.get();
  const documents = [];

  for (const docSnap of snapshot.docs) {
    const subcollections = await docSnap.ref.listCollections();
    const subcollectionData = {};

    for (const subRef of subcollections) {
      subcollectionData[subRef.id] = await exportCollectionTree(subRef);
    }

    documents.push({
      id: docSnap.id,
      path: docSnap.ref.path,
      data: serializeFirestoreValue(docSnap.data()),
      subcollections: subcollectionData,
    });
  }

  return documents;
}

export async function exportAllRootCollections(db) {
  const rootCollections = await db.listCollections();
  const collections = {};

  for (const collectionRef of rootCollections) {
    collections[collectionRef.id] = await exportCollectionTree(collectionRef);
  }

  return collections;
}

export function writeBackupToDir(backupDir, payload) {
  fs.mkdirSync(backupDir, { recursive: true });

  const manifest = {
    version: 1,
    exportedAt: payload.exportedAt,
    projectId: payload.projectId,
    serviceAccountHint: path.basename(resolveServiceAccountPath()),
    collectionIds: Object.keys(payload.collections),
    documentCounts: Object.fromEntries(
      Object.entries(payload.collections).map(([name, docs]) => [name, countDocuments(docs)])
    ),
    totalDocuments: countDocuments(Object.values(payload.collections).flat()),
  };

  fs.writeFileSync(path.join(backupDir, 'manifest.json'), JSON.stringify(manifest, null, 2), 'utf8');
  fs.writeFileSync(
    path.join(backupDir, 'firestore-backup.json'),
    JSON.stringify(payload, null, 2),
    'utf8'
  );

  for (const [collectionId, documents] of Object.entries(payload.collections)) {
    fs.writeFileSync(
      path.join(backupDir, `${collectionId}.json`),
      JSON.stringify({ collectionId, documents }, null, 2),
      'utf8'
    );
  }

  return manifest;
}

function countDocuments(docs) {
  if (!Array.isArray(docs)) {
    return Object.values(docs).reduce((sum, nested) => sum + countDocuments(nested), 0);
  }

  return docs.reduce((sum, doc) => {
    const subCount = doc.subcollections
      ? Object.values(doc.subcollections).reduce((s, nested) => s + countDocuments(nested), 0)
      : 0;
    return sum + 1 + subCount;
  }, 0);
}

export async function importCollectionTree(collectionRef, documents, { merge }) {
  let written = 0;

  for (const docEntry of documents) {
    const docRef = collectionRef.doc(docEntry.id);
    const data = deserializeFirestoreValue(docEntry.data);
    await docRef.set(data, { merge });

    written += 1;

    if (docEntry.subcollections) {
      for (const [subId, subDocs] of Object.entries(docEntry.subcollections)) {
        written += await importCollectionTree(docRef.collection(subId), subDocs, { merge });
      }
    }
  }

  return written;
}

export async function importFromPayload(db, collections, { merge }) {
  let totalWritten = 0;

  for (const [collectionId, documents] of Object.entries(collections)) {
    const written = await importCollectionTree(db.collection(collectionId), documents, { merge });
    totalWritten += written;
    console.log(`  ${collectionId}: ${written} document(s)`);
  }

  return totalWritten;
}

export function loadBackupPayload(backupDir) {
  const fullPath = path.join(backupDir, 'firestore-backup.json');
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Backup file not found: ${fullPath}`);
  }

  const payload = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
  if (!payload.collections || typeof payload.collections !== 'object') {
    throw new Error('Invalid backup: missing collections');
  }

  return payload;
}

export function findLatestBackupDir(backupsRoot) {
  if (!fs.existsSync(backupsRoot)) return null;

  const dirs = fs
    .readdirSync(backupsRoot, { withFileTypes: true })
    .filter(d => d.isDirectory() && d.name.startsWith('firestore-'))
    .map(d => path.join(backupsRoot, d.name))
    .filter(dir => fs.existsSync(path.join(dir, 'firestore-backup.json')))
    .sort()
    .reverse();

  return dirs[0] ?? null;
}
