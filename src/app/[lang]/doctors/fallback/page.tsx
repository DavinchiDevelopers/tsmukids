'use client';

import { use } from 'react';
import { usePathname } from 'next/navigation';
import DoctorPageClient from '../[slug]/DoctorPageClient';

interface Props {
  params: Promise<{ lang: string }>;
}

export default function DoctorFallbackPage({ params }: Props) {
  const { lang } = use(params);
  const pathname = usePathname();
  const raw = pathname.split('/doctors/')[1]?.replace(/\/$/, '') ?? '';
  const slug = raw === 'fallback' ? '' : raw;

  return <DoctorPageClient lang={lang} slug={slug} />;
}
