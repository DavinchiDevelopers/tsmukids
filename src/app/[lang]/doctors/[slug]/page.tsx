import type { Metadata } from 'next';
import { doctors as staticDoctors } from '@/data/doctors';
import { buildPageMetadata } from '@/lib/metadata';
import { Lang } from '@/types';
import DoctorPageClient from './DoctorPageClient';

interface DoctorPageProps {
  params: Promise<{ lang: string; slug: string }>;
}

export async function generateStaticParams() {
  const legacySlugs = [
    'yusupov-otabek',
    'rashidov-bobur',
    'hasanova-nilufar',
    'karimova-zulayho',
  ];
  const fromStatic = staticDoctors.map(d => d.slug);
  const unique = new Set([...fromStatic, ...legacySlugs]);
  return Array.from(unique).map(slug => ({ slug }));
}

export async function generateMetadata({ params }: DoctorPageProps): Promise<Metadata> {
  const { lang, slug } = await params;
  const isRu = lang === 'ru';
  return buildPageMetadata({
    lang: lang as Lang,
    title: isRu ? 'Врач' : 'Shifokor',
    description: isRu ? 'Страница врача детской клиники ТГМУ' : 'TSMU Bolalar Klinikasi shifokor sahifasi',
    path: `/doctors/${slug}`,
  });
}

export default async function DoctorPage({ params }: DoctorPageProps) {
  const { lang, slug } = await params;
  return <DoctorPageClient lang={lang} slug={slug} />;
}
