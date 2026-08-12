import { langs } from '@/i18n';
import { doctors as staticDoctors } from '@/data/doctors';
import { services as staticServices } from '@/data/services';
import { departments as staticDepartments } from '@/data/departments';
import { DEPARTMENT_PRESET_NAMES } from '@/data/departmentPresets';
import { slugifyDepartmentSlug } from '@/lib/slugify';

const STATIC_PAGES = [
  '',
  'about',
  'departments',
  'doctors',
  'services',
  'equipment',
  'prices',
  'gallery',
  'contacts',
  'privacy',
] as const;

const LEGACY_DOCTOR_SLUGS = [
  'yusupov-otabek',
  'rashidov-bobur',
  'hasanova-nilufar',
  'karimova-zulayho',
];

/** Пути вида `/ru/about/` (с trailing slash, как в next.config). */
export async function getAllSitemapPaths(): Promise<string[]> {
  const doctorSlugs = Array.from(new Set([...staticDoctors.map(d => d.slug), ...LEGACY_DOCTOR_SLUGS]));
  const serviceSlugs = staticServices.map(s => s.slug);
  const departmentSlugs = Array.from(new Set([
    ...staticDepartments.map(d => d.slug),
    ...DEPARTMENT_PRESET_NAMES.map(name => slugifyDepartmentSlug(name, '')),
  ])).filter(Boolean);

  const paths: string[] = [];

  for (const lang of langs) {
    for (const page of STATIC_PAGES) {
      paths.push(page ? `/${lang}/${page}/` : `/${lang}/`);
    }
    for (const slug of doctorSlugs) {
      paths.push(`/${lang}/doctors/${slug}/`);
    }
    for (const slug of serviceSlugs) {
      paths.push(`/${lang}/services/${slug}/`);
    }
    for (const slug of departmentSlugs) {
      paths.push(`/${lang}/departments/${slug}/`);
    }
  }

  return paths;
}
