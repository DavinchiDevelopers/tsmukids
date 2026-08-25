/** Типы CMS + клиент к PHP API (/api/index.php) вместо Firebase. */

export function stripUndefined<T extends Record<string, unknown>>(data: T): Record<string, unknown> {
  return Object.fromEntries(Object.entries(data).filter(([, v]) => v !== undefined));
}

function apiBase(): string {
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/api/index.php`;
  }
  return process.env.NEXT_PUBLIC_API_BASE?.replace(/\/$/, '') || 'http://127.0.0.1/api/index.php';
}

async function api<T>(
  route: string,
  options: RequestInit & { query?: Record<string, string> } = {},
): Promise<T> {
  const { query, ...init } = options;
  const url = new URL(apiBase());
  url.searchParams.set('r', route);
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      url.searchParams.set(k, v);
    }
  }
  const res = await fetch(url.toString(), {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
    ...init,
  });
  if (!res.ok) {
    let message = res.statusText;
    try {
      const body = await res.json();
      if (body?.error) message = body.error;
    } catch {
      /* ignore */
    }
    throw new Error(message || `API ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

// ── Settings ──────────────────────────────────────────────────────────────────

export interface ClinicSettings {
  nameRu: string;
  nameUz: string;
  nameShortRu: string;
  nameShortUz: string;
  address: string;
  phone1: string;
  phone2: string;
  phone3?: string;
  email: string;
  workingHours: string;
  statsDoctors: string;
  statsPatients: string;
  statsExperience: string;
  statsDepartments: string;
  aboutDescription1Ru: string;
  aboutDescription1Uz: string;
  aboutDescription2Ru: string;
  aboutDescription2Uz: string;
  licenseInfo: string;
  logoLetter: string;
  whatsapp: string;
  mapEmbedUrl?: string;
  mapLabel?: string;
  appointmentEmailWebhook?: string;
}

export async function getSettings(): Promise<ClinicSettings | null> {
  return api<ClinicSettings>('settings');
}

export async function saveSettings(data: ClinicSettings): Promise<void> {
  await api('settings', { method: 'PUT', body: JSON.stringify(stripUndefined(data as unknown as Record<string, unknown>)) });
}

export async function getSiteData(): Promise<{
  settings: ClinicSettings;
  doctors: DoctorDoc[];
  services: ServiceDoc[];
  departments: DepartmentDoc[];
  equipment: EquipmentDoc[];
  gallery: GalleryDoc[];
}> {
  return api('site');
}

// ── Services ──────────────────────────────────────────────────────────────────

export interface ServiceDoc {
  id: string;
  slug: string;
  nameRu: string;
  nameUz: string;
  descriptionRu: string;
  descriptionUz: string;
  category: string;
  price?: number;
  durationRu?: string;
  durationUz?: string;
  order?: number;
}

export async function getServicesFS(): Promise<ServiceDoc[]> {
  return api<ServiceDoc[]>('collection', { query: { name: 'services' } });
}

export async function saveService(data: Omit<ServiceDoc, 'id'>): Promise<string> {
  const res = await api<{ id: string }>('collection', {
    method: 'POST',
    query: { name: 'services' },
    body: JSON.stringify(stripUndefined(data as Record<string, unknown>)),
  });
  return res.id;
}

export async function updateService(id: string, data: Partial<ServiceDoc>): Promise<void> {
  await api('collection', {
    method: 'PUT',
    query: { name: 'services', id },
    body: JSON.stringify(stripUndefined(data as Record<string, unknown>)),
  });
}

export async function deleteService(id: string): Promise<void> {
  await api('collection', { method: 'DELETE', query: { name: 'services', id } });
}

export async function replaceServices(items: Omit<ServiceDoc, 'id'>[] | ServiceDoc[]): Promise<void> {
  await api('collection/replace', {
    method: 'POST',
    query: { name: 'services' },
    body: JSON.stringify({ items }),
  });
}

// ── Doctors ───────────────────────────────────────────────────────────────────

export interface DoctorDoc {
  id: string;
  slug: string;
  nameRu: string;
  nameUz: string;
  specialtyRu: string;
  specialtyUz: string;
  experienceRu: string;
  experienceUz: string;
  bioRu: string;
  bioUz: string;
  educationRu?: string;
  educationUz?: string;
  workExperienceRu?: string;
  workExperienceUz?: string;
  additionalInfoRu?: string;
  additionalInfoUz?: string;
  services?: string[];
  department: string;
  photo: string;
  order?: number;
}

export async function getDoctorsFS(): Promise<DoctorDoc[]> {
  return api<DoctorDoc[]>('collection', { query: { name: 'doctors' } });
}

export async function saveDoctor(data: Omit<DoctorDoc, 'id'>): Promise<string> {
  const res = await api<{ id: string }>('collection', {
    method: 'POST',
    query: { name: 'doctors' },
    body: JSON.stringify(stripUndefined(data as Record<string, unknown>)),
  });
  return res.id;
}

export async function updateDoctor(id: string, data: Partial<DoctorDoc>): Promise<void> {
  await api('collection', {
    method: 'PUT',
    query: { name: 'doctors', id },
    body: JSON.stringify(stripUndefined(data as Record<string, unknown>)),
  });
}

export async function deleteDoctor(id: string): Promise<void> {
  await api('collection', { method: 'DELETE', query: { name: 'doctors', id } });
}

// ── Departments ───────────────────────────────────────────────────────────────

export interface DepartmentDoc {
  id: string;
  slug: string;
  nameRu: string;
  nameUz: string;
  descriptionRu: string;
  descriptionUz: string;
  icon: string;
  image?: string;
  beds?: number;
  hasEmergency?: boolean;
  diseasesRu?: string[];
  diseasesUz?: string[];
  order?: number;
}

export async function getDepartmentsFS(): Promise<DepartmentDoc[]> {
  return api<DepartmentDoc[]>('collection', { query: { name: 'departments' } });
}

export async function saveDepartment(data: Omit<DepartmentDoc, 'id'>): Promise<string> {
  const res = await api<{ id: string }>('collection', {
    method: 'POST',
    query: { name: 'departments' },
    body: JSON.stringify(stripUndefined(data as Record<string, unknown>)),
  });
  return res.id;
}

export async function updateDepartment(id: string, data: Partial<DepartmentDoc>): Promise<void> {
  await api('collection', {
    method: 'PUT',
    query: { name: 'departments', id },
    body: JSON.stringify(stripUndefined(data as Record<string, unknown>)),
  });
}

export async function deleteDepartment(id: string): Promise<void> {
  await api('collection', { method: 'DELETE', query: { name: 'departments', id } });
}

// ── Equipment ─────────────────────────────────────────────────────────────────

export interface EquipmentDoc {
  id: string;
  nameRu: string;
  nameUz: string;
  descriptionRu: string;
  descriptionUz: string;
  image: string;
  category?: 'equipment' | 'diagnostics';
  order?: number;
}

export async function getEquipmentFS(): Promise<EquipmentDoc[]> {
  return api<EquipmentDoc[]>('collection', { query: { name: 'equipment' } });
}

export async function saveEquipment(data: Omit<EquipmentDoc, 'id'>): Promise<string> {
  const res = await api<{ id: string }>('collection', {
    method: 'POST',
    query: { name: 'equipment' },
    body: JSON.stringify(stripUndefined(data as Record<string, unknown>)),
  });
  return res.id;
}

export async function updateEquipment(id: string, data: Partial<EquipmentDoc>): Promise<void> {
  await api('collection', {
    method: 'PUT',
    query: { name: 'equipment', id },
    body: JSON.stringify(stripUndefined(data as Record<string, unknown>)),
  });
}

export async function deleteEquipment(id: string): Promise<void> {
  await api('collection', { method: 'DELETE', query: { name: 'equipment', id } });
}

// ── Appointments ──────────────────────────────────────────────────────────────

export interface AppointmentRequestDoc {
  id: string;
  name: string;
  phone: string;
  service?: string;
  doctor?: string;
  message?: string;
  lang: 'ru' | 'uz';
  consentGiven?: boolean;
  consentAt?: string;
  createdAt: string;
}

export async function saveAppointmentRequest(data: Omit<AppointmentRequestDoc, 'id'>): Promise<string> {
  const res = await api<{ id: string }>('appointments', {
    method: 'POST',
    body: JSON.stringify(stripUndefined(data as Record<string, unknown>)),
  });
  return res.id;
}

export async function getAppointmentsFS(): Promise<AppointmentRequestDoc[]> {
  return api<AppointmentRequestDoc[]>('appointments');
}

export async function deleteAppointment(id: string): Promise<void> {
  await api('appointments', { method: 'DELETE', query: { id } });
}

// ── Gallery ───────────────────────────────────────────────────────────────────

export interface GalleryDoc {
  id: string;
  category: 'clinic' | 'rooms' | 'equipment' | 'team';
  titleRu: string;
  titleUz: string;
  image: string;
  order?: number;
}

export async function getGalleryFS(): Promise<GalleryDoc[]> {
  return api<GalleryDoc[]>('collection', { query: { name: 'gallery' } });
}

export async function saveGalleryItem(data: Omit<GalleryDoc, 'id'>): Promise<string> {
  const res = await api<{ id: string }>('collection', {
    method: 'POST',
    query: { name: 'gallery' },
    body: JSON.stringify(stripUndefined(data as Record<string, unknown>)),
  });
  return res.id;
}

export async function updateGalleryItem(id: string, data: Partial<GalleryDoc>): Promise<void> {
  await api('collection', {
    method: 'PUT',
    query: { name: 'gallery', id },
    body: JSON.stringify(stripUndefined(data as Record<string, unknown>)),
  });
}

export async function deleteGalleryItem(id: string): Promise<void> {
  await api('collection', { method: 'DELETE', query: { name: 'gallery', id } });
}
