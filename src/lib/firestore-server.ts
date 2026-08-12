import fs from 'fs';
import path from 'path';
import admin from 'firebase-admin';
import type {
  ClinicSettings,
  ServiceDoc,
  DoctorDoc,
  DepartmentDoc,
  EquipmentDoc,
  GalleryDoc,
} from './firestore';

const DEFAULT_SERVICE_ACCOUNT = path.join(
  /* turbopackIgnore: true */ process.cwd(),
  'tsmukids-firebase-adminsdk.json',
);

const SNAPSHOT_PATH = path.join(
  /* turbopackIgnore: true */ process.cwd(),
  'src/data/site-snapshot.json',
);

function resolveServiceAccountPath() {
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    return process.env.GOOGLE_APPLICATION_CREDENTIALS;
  }
  return DEFAULT_SERVICE_ACCOUNT;
}

function getDb() {
  const serviceAccountPath = resolveServiceAccountPath();

  if (!admin.apps.length) {
    if (!fs.existsSync(serviceAccountPath)) {
      throw new Error(`Service account not found: ${serviceAccountPath}`);
    }
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: serviceAccount.project_id,
    });
  }

  return admin.firestore();
}

const LIVE_TIMEOUT_MS = Number(process.env.FIRESTORE_TIMEOUT_MS || 4000);

type SiteSnapshot = {
  exportedAt?: string;
  settings: ClinicSettings | null;
  doctors: DoctorDoc[];
  services: ServiceDoc[];
  departments: DepartmentDoc[];
  equipment: EquipmentDoc[];
  gallery: GalleryDoc[];
};

let snapshotCache: SiteSnapshot | null | undefined;

function loadSnapshot(): SiteSnapshot | null {
  if (snapshotCache !== undefined) return snapshotCache;
  try {
    if (!fs.existsSync(SNAPSHOT_PATH)) {
      snapshotCache = null;
      return null;
    }
    snapshotCache = JSON.parse(fs.readFileSync(SNAPSHOT_PATH, 'utf8')) as SiteSnapshot;
    return snapshotCache;
  } catch {
    snapshotCache = null;
    return null;
  }
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`Firestore timeout after ${ms}ms`)), ms);
    promise.then(
      value => {
        clearTimeout(timer);
        resolve(value);
      },
      err => {
        clearTimeout(timer);
        reject(err);
      },
    );
  });
}

function mapDoc<T extends { id: string }>(doc: admin.firestore.QueryDocumentSnapshot): T {
  return { id: doc.id, ...doc.data() } as T;
}

async function getOrderedCollection<T extends { id: string }>(collectionId: string): Promise<T[]> {
  const snap = await getDb()
    .collection(collectionId)
    .orderBy('order', 'asc')
    .get()
    .catch(() => getDb().collection(collectionId).get());
  return snap.docs.map(d => mapDoc<T>(d));
}

async function liveOrSnapshot<T>(live: () => Promise<T>, fromSnapshot: (s: SiteSnapshot) => T): Promise<T> {
  const snap = loadSnapshot();
  const preferSnapshot = process.env.SITE_DATA_SOURCE === 'snapshot';

  if (preferSnapshot && snap) return fromSnapshot(snap);

  try {
    return await withTimeout(live(), LIVE_TIMEOUT_MS);
  } catch (err) {
    if (snap) {
      console.warn(`[firestore-server] live fetch failed, using snapshot:`, (err as Error).message || err);
      return fromSnapshot(snap);
    }
    throw err;
  }
}

export async function getSettingsServer(): Promise<ClinicSettings | null> {
  return liveOrSnapshot(
    async () => {
      const snap = await getDb().doc('settings/clinic').get();
      return snap.exists ? (snap.data() as ClinicSettings) : null;
    },
    s => s.settings,
  );
}

export async function getServicesServer(): Promise<ServiceDoc[]> {
  return liveOrSnapshot(
    () => getOrderedCollection<ServiceDoc>('services'),
    s => s.services ?? [],
  );
}

export async function getDoctorsServer(): Promise<DoctorDoc[]> {
  return liveOrSnapshot(
    () => getOrderedCollection<DoctorDoc>('doctors'),
    s => s.doctors ?? [],
  );
}

export async function getDepartmentsServer(): Promise<DepartmentDoc[]> {
  return liveOrSnapshot(
    () => getOrderedCollection<DepartmentDoc>('departments'),
    s => s.departments ?? [],
  );
}

export async function getEquipmentServer(): Promise<EquipmentDoc[]> {
  return liveOrSnapshot(
    () => getOrderedCollection<EquipmentDoc>('equipment'),
    s => s.equipment ?? [],
  );
}

export async function getGalleryServer(): Promise<GalleryDoc[]> {
  return liveOrSnapshot(
    () => getOrderedCollection<GalleryDoc>('gallery'),
    s => s.gallery ?? [],
  );
}

export async function getSiteDataServer() {
  const [settings, doctors, services, departments, equipment, gallery] = await Promise.all([
    getSettingsServer().catch(() => loadSnapshot()?.settings ?? null),
    getDoctorsServer().catch(() => loadSnapshot()?.doctors ?? []),
    getServicesServer().catch(() => loadSnapshot()?.services ?? []),
    getDepartmentsServer().catch(() => loadSnapshot()?.departments ?? []),
    getEquipmentServer().catch(() => loadSnapshot()?.equipment ?? []),
    getGalleryServer().catch(() => loadSnapshot()?.gallery ?? []),
  ]);

  return { settings, doctors, services, departments, equipment, gallery };
}
