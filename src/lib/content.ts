import { doctors as staticDoctors } from '@/data/doctors';
import { services as staticServices } from '@/data/services';
import { departments as staticDepartments } from '@/data/departments';
import type { DoctorDoc, ServiceDoc, DepartmentDoc } from '@/lib/firestore';
import {
  getDoctorsServer,
  getServicesServer,
  getDepartmentsServer,
} from '@/lib/firestore-server';

const LEGACY_DOCTOR_SLUGS = [
  'yusupov-otabek',
  'rashidov-bobur',
  'hasanova-nilufar',
  'karimova-zulayho',
];

function normalizeSlug(value: string) {
  return value.trim().toLowerCase().replace(/_/g, '-');
}

// Module-level cache: each worker fetches Firestore data only once per build
let doctorsCache: Promise<DoctorDoc[]> | null = null;
let servicesCache: Promise<ServiceDoc[]> | null = null;
let departmentsCache: Promise<DepartmentDoc[]> | null = null;

export function getCachedDoctors(): Promise<DoctorDoc[]> {
  if (!doctorsCache) doctorsCache = getDoctorsServer().catch(() => []);
  return doctorsCache;
}

export function getCachedServices(): Promise<ServiceDoc[]> {
  if (!servicesCache) servicesCache = getServicesServer().catch(() => []);
  return servicesCache;
}

export function getCachedDepartments(): Promise<DepartmentDoc[]> {
  if (!departmentsCache) departmentsCache = getDepartmentsServer().catch(() => []);
  return departmentsCache;
}

export async function findDoctorBySlug(slug: string): Promise<DoctorDoc | undefined> {
  const target = normalizeSlug(slug);
  const staticMatch = staticDoctors.find(d => normalizeSlug(d.slug) === target);
  const docs = await getCachedDoctors();
  const firestoreMatch = docs.find(d => normalizeSlug(d.slug) === target);
  if (firestoreMatch) return firestoreMatch;
  if (staticMatch) {
    return {
      id: staticMatch.slug,
      slug: staticMatch.slug,
      nameRu: staticMatch.nameRu,
      nameUz: staticMatch.nameUz,
      specialtyRu: staticMatch.specialtyRu,
      specialtyUz: staticMatch.specialtyUz,
      experienceRu: staticMatch.experienceRu,
      experienceUz: staticMatch.experienceUz,
      bioRu: staticMatch.bioRu,
      bioUz: staticMatch.bioUz,
      department: staticMatch.department,
      photo: staticMatch.photo,
    };
  }
  if (LEGACY_DOCTOR_SLUGS.includes(target)) return undefined;
  return undefined;
}

export async function findServiceBySlug(slug: string): Promise<ServiceDoc | undefined> {
  const target = normalizeSlug(slug);
  const docs = await getCachedServices();
  const firestoreMatch = docs.find(s => normalizeSlug(s.slug) === target);
  if (firestoreMatch) return firestoreMatch;
  const staticMatch = staticServices.find(s => normalizeSlug(s.slug) === target);
  if (!staticMatch) return undefined;
  return {
    id: staticMatch.slug,
    slug: staticMatch.slug,
    nameRu: staticMatch.nameRu,
    nameUz: staticMatch.nameUz,
    descriptionRu: staticMatch.descriptionRu,
    descriptionUz: staticMatch.descriptionUz,
    category: staticMatch.category,
    price: staticMatch.price,
    durationRu: staticMatch.durationRu,
    durationUz: staticMatch.durationUz,
  };
}

export async function findDepartmentBySlug(slug: string): Promise<DepartmentDoc | undefined> {
  const target = normalizeSlug(slug);
  const docs = await getCachedDepartments();
  const firestoreMatch = docs.find(d => normalizeSlug(d.slug) === target);
  if (firestoreMatch) return firestoreMatch;
  const staticMatch = staticDepartments.find(d => normalizeSlug(d.slug) === target);
  if (!staticMatch) return undefined;
  return {
    id: staticMatch.slug,
    slug: staticMatch.slug,
    nameRu: staticMatch.nameRu,
    nameUz: staticMatch.nameUz,
    descriptionRu: staticMatch.descriptionRu,
    descriptionUz: staticMatch.descriptionUz,
    icon: staticMatch.icon,
    diseasesRu: staticMatch.diseases,
    diseasesUz: staticMatch.diseases,
  };
}
