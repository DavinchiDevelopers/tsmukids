'use client';

import { Suspense, use, useMemo } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import DoctorPageClient from '../[slug]/DoctorPageClient';

interface Props {
  params: Promise<{ lang: string }>;
}

function DoctorFallbackInner({ lang }: { lang: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const slug = useMemo(() => {
    const fromQuery = searchParams.get('slug')?.trim();
    if (fromQuery) return fromQuery;
    const raw = pathname.split('/doctors/')[1]?.replace(/\/$/, '') ?? '';
    return raw === 'fallback' ? '' : raw.split('?')[0];
  }, [pathname, searchParams]);

  return <DoctorPageClient lang={lang} slug={slug} />;
}

export default function DoctorFallbackPage({ params }: Props) {
  const { lang } = use(params);
  return (
    <Suspense fallback={null}>
      <DoctorFallbackInner lang={lang} />
    </Suspense>
  );
}
