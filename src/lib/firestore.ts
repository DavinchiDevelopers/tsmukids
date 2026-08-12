import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from './firebase';

/** Firestore не принимает `undefined` в полях документа */
export function stripUndefined<T extends Record<string, unknown>>(data: T): Record<string, unknown> {
  return Object.fromEntries(Object.entries(data).filter(([, v]) => v !== undefined));
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
  const snap = await getDoc(doc(db, 'settings', 'clinic'));
  return snap.exists() ? (snap.data() as ClinicSettings) : null;
}

export async function saveSettings(data: ClinicSettings): Promise<void> {
  await setDoc(doc(db, 'settings', 'clinic'), stripUndefined(data as unknown as Record<string, unknown>));
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
  const q = query(collection(db, 'services'), orderBy('order', 'asc'));
  const snap = await getDocs(q).catch(() => getDocs(collection(db, 'services')));
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as ServiceDoc));
}

export async function saveService(data: Omit<ServiceDoc, 'id'>): Promise<string> {
  const ref = await addDoc(collection(db, 'services'), stripUndefined(data as Record<string, unknown>));
  return ref.id;
}

export async function updateService(id: string, data: Partial<ServiceDoc>): Promise<void> {
  await updateDoc(doc(db, 'services', id), stripUndefined(data as Record<string, unknown>));
}

export async function deleteService(id: string): Promise<void> {
  await deleteDoc(doc(db, 'services', id));
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
  const q = query(collection(db, 'doctors'), orderBy('order', 'asc'));
  const snap = await getDocs(q).catch(() => getDocs(collection(db, 'doctors')));
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as DoctorDoc));
}

export async function saveDoctor(data: Omit<DoctorDoc, 'id'>): Promise<string> {
  const ref = await addDoc(collection(db, 'doctors'), stripUndefined(data as Record<string, unknown>));
  return ref.id;
}

export async function updateDoctor(id: string, data: Partial<DoctorDoc>): Promise<void> {
  await updateDoc(doc(db, 'doctors', id), stripUndefined(data as Record<string, unknown>));
}

export async function deleteDoctor(id: string): Promise<void> {
  await deleteDoc(doc(db, 'doctors', id));
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
  const q = query(collection(db, 'departments'), orderBy('order', 'asc'));
  const snap = await getDocs(q).catch(() => getDocs(collection(db, 'departments')));
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as DepartmentDoc));
}

export async function saveDepartment(data: Omit<DepartmentDoc, 'id'>): Promise<string> {
  const ref = await addDoc(collection(db, 'departments'), stripUndefined(data as Record<string, unknown>));
  return ref.id;
}

export async function updateDepartment(id: string, data: Partial<DepartmentDoc>): Promise<void> {
  await updateDoc(doc(db, 'departments', id), stripUndefined(data as Record<string, unknown>));
}

export async function deleteDepartment(id: string): Promise<void> {
  await deleteDoc(doc(db, 'departments', id));
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
  const q = query(collection(db, 'equipment'), orderBy('order', 'asc'));
  const snap = await getDocs(q).catch(() => getDocs(collection(db, 'equipment')));
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as EquipmentDoc));
}

export async function saveEquipment(data: Omit<EquipmentDoc, 'id'>): Promise<string> {
  const ref = await addDoc(collection(db, 'equipment'), stripUndefined(data as Record<string, unknown>));
  return ref.id;
}

export async function updateEquipment(id: string, data: Partial<EquipmentDoc>): Promise<void> {
  await updateDoc(doc(db, 'equipment', id), stripUndefined(data as Record<string, unknown>));
}

export async function deleteEquipment(id: string): Promise<void> {
  await deleteDoc(doc(db, 'equipment', id));
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
  const ref = await addDoc(collection(db, 'appointments'), stripUndefined(data as Record<string, unknown>));
  return ref.id;
}

export async function getAppointmentsFS(): Promise<AppointmentRequestDoc[]> {
  const snap = await getDocs(collection(db, 'appointments'));
  return snap.docs
    .map(d => ({ id: d.id, ...d.data() } as AppointmentRequestDoc))
    .sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
}

export async function deleteAppointment(id: string): Promise<void> {
  await deleteDoc(doc(db, 'appointments', id));
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
  const q = query(collection(db, 'gallery'), orderBy('order', 'asc'));
  const snap = await getDocs(q).catch(() => getDocs(collection(db, 'gallery')));
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as GalleryDoc));
}

export async function saveGalleryItem(data: Omit<GalleryDoc, 'id'>): Promise<string> {
  const ref = await addDoc(collection(db, 'gallery'), stripUndefined(data as Record<string, unknown>));
  return ref.id;
}

export async function updateGalleryItem(id: string, data: Partial<GalleryDoc>): Promise<void> {
  await updateDoc(doc(db, 'gallery', id), stripUndefined(data as Record<string, unknown>));
}

export async function deleteGalleryItem(id: string): Promise<void> {
  await deleteDoc(doc(db, 'gallery', id));
}
