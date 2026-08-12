'use client';

import { use } from 'react';
import { usePathname } from 'next/navigation';
import DepartmentPageClient from '../[slug]/DepartmentPageClient';

interface Props {
  params: Promise<{ lang: string }>;
}

export default function DepartmentFallbackPage({ params }: Props) {
  const { lang } = use(params);
  const pathname = usePathname();
  const raw = pathname.split('/departments/')[1]?.replace(/\/$/, '') ?? '';
  const slug = raw === 'fallback' ? '' : raw;

  return <DepartmentPageClient lang={lang} slug={slug} />;
}
