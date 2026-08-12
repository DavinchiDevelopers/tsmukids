'use client';

import { use } from 'react';
import { usePathname } from 'next/navigation';
import ServicePageClient from '../[slug]/ServicePageClient';

interface Props {
  params: Promise<{ lang: string }>;
}

/** Для услуг из Firestore (svc-*) без статической страницы — slug берётся из URL. */
export default function ServiceFallbackPage({ params }: Props) {
  const { lang } = use(params);
  const pathname = usePathname();
  const raw = pathname.split('/services/')[1]?.replace(/\/$/, '') ?? '';
  const slug = raw === 'fallback' ? '' : raw;

  return <ServicePageClient lang={lang} slug={slug} />;
}
