import fs from 'fs';
import path from 'path';
import type {
  ClinicSettings,
  ServiceDoc,
  DoctorDoc,
  DepartmentDoc,
  EquipmentDoc,
  GalleryDoc,
} from './firestore';

const SNAPSHOT_PATH = path.join(
  /* turbopackIgnore: true */ process.cwd(),
  'src/data/site-snapshot.json',
);

const SERVER_SITE_PATH = path.join(
  /* turbopackIgnore: true */ process.cwd(),
  'server/data/site.json',
);

type SiteSnapshot = {
  exportedAt?: string;
  settings: ClinicSettings | null;
  doctors: DoctorDoc[];
  services: ServiceDoc[];
  departments: DepartmentDoc[];
  equipment: EquipmentDoc[];
  gallery: GalleryDoc[];
};

let cache: SiteSnapshot | null | undefined;

function loadLocalSite(): SiteSnapshot | null {
  const candidates = [SERVER_SITE_PATH, SNAPSHOT_PATH];
  for (const file of candidates) {
    if (!fs.existsSync(file)) continue;
    try {
      const raw = JSON.parse(fs.readFileSync(file, 'utf8'));
      return {
        settings: raw.settings ?? null,
        doctors: raw.doctors ?? [],
        services: raw.services ?? [],
        departments: raw.departments ?? [],
        equipment: raw.equipment ?? [],
        gallery: raw.gallery ?? [],
        exportedAt: raw.exportedAt,
      };
    } catch {
      /* try next */
    }
  }
  return null;
}

function getSnapshot(): SiteSnapshot | null {
  if (cache !== undefined) return cache;
  cache = loadLocalSite();
  return cache;
}

export async function getSettingsServer(): Promise<ClinicSettings | null> {
  return getSnapshot()?.settings ?? null;
}

export async function getDoctorsServer(): Promise<DoctorDoc[]> {
  return getSnapshot()?.doctors ?? [];
}

export async function getServicesServer(): Promise<ServiceDoc[]> {
  return getSnapshot()?.services ?? [];
}

export async function getDepartmentsServer(): Promise<DepartmentDoc[]> {
  return getSnapshot()?.departments ?? [];
}

export async function getEquipmentServer(): Promise<EquipmentDoc[]> {
  return getSnapshot()?.equipment ?? [];
}

export async function getGalleryServer(): Promise<GalleryDoc[]> {
  return getSnapshot()?.gallery ?? [];
}

export async function getSiteDataServer(): Promise<{
  settings: ClinicSettings | null;
  doctors: DoctorDoc[];
  services: ServiceDoc[];
  departments: DepartmentDoc[];
  equipment: EquipmentDoc[];
  gallery: GalleryDoc[];
}> {
  const snap = getSnapshot();
  return {
    settings: snap?.settings ?? null,
    doctors: snap?.doctors ?? [],
    services: snap?.services ?? [],
    departments: snap?.departments ?? [],
    equipment: snap?.equipment ?? [],
    gallery: snap?.gallery ?? [],
  };
}
