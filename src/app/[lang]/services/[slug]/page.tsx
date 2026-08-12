import type { Metadata } from 'next';
import { services as staticServices } from '@/data/services';
import { buildPageMetadata } from '@/lib/metadata';
import { Lang } from '@/types';
import ServicePageClient from './ServicePageClient';

interface ServicePageProps {
  params: Promise<{ lang: string; slug: string }>;
}

/** Только услуги из кода — остальные открываются через /services/fallback + rewrite в firebase.json */
export async function generateStaticParams() {
  return staticServices.map(s => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { lang, slug } = await params;
  const isRu = lang === 'ru';
  return buildPageMetadata({
    lang: lang as Lang,
    title: isRu ? 'Услуга' : 'Xizmat',
    description: isRu ? 'Медицинская услуга детской клиники ТГМУ' : 'TSMU Bolalar Klinikasi tibbiy xizmati',
    path: `/services/${slug}`,
  });
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { lang, slug } = await params;
  return <ServicePageClient lang={lang} slug={slug} />;
}
