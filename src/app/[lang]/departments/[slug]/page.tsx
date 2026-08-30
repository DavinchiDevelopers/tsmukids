import type { Metadata } from 'next';
import { departments as staticDepartments } from '@/data/departments';
import { DEPARTMENT_PRESET_NAMES } from '@/data/departmentPresets';
import { slugifyDepartmentSlug } from '@/lib/slugify';
import { buildPageMetadata } from '@/lib/metadata';
import { Lang } from '@/types';
import DepartmentPageClient from './DepartmentPageClient';

interface DepartmentPageProps {
  params: Promise<{ lang: string; slug: string }>;
}

export async function generateStaticParams() {
  const fromStatic = staticDepartments.map(d => d.slug);
  const fromPresets = DEPARTMENT_PRESET_NAMES.map(name => slugifyDepartmentSlug(name, ''));
  const unique = new Set([...fromStatic, ...fromPresets]);
  return Array.from(unique)
    .filter(slug => slug && /^[a-z0-9-]+$/i.test(slug))
    .map(slug => ({ slug }));
}

export async function generateMetadata({ params }: DepartmentPageProps): Promise<Metadata> {
  const { lang, slug } = await params;
  const isRu = lang === 'ru';
  return buildPageMetadata({
    lang: lang as Lang,
    title: isRu ? 'Отделение' : "Bo'lim",
    description: isRu ? 'Отделение детской клиники ТГМУ' : "TDTU Bolalar Klinikasi bo'limi",
    path: `/departments/${slug}`,
  });
}

export default async function DepartmentPage({ params }: DepartmentPageProps) {
  const { lang, slug } = await params;
  return <DepartmentPageClient lang={lang} slug={slug} />;
}
