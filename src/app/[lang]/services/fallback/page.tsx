'use client';

import { Suspense, use, useMemo } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import ServicePageClient from '../[slug]/ServicePageClient';

interface Props {
  params: Promise<{ lang: string }>;
}

function ServiceFallbackInner({ lang }: { lang: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const slug = useMemo(() => {
    const fromQuery = searchParams.get('slug')?.trim();
    if (fromQuery) return fromQuery;
    const raw = pathname.split('/services/')[1]?.replace(/\/$/, '') ?? '';
    return raw === 'fallback' ? '' : raw.split('?')[0];
  }, [pathname, searchParams]);

  return <ServicePageClient lang={lang} slug={slug} />;
}

export default function ServiceFallbackPage({ params }: Props) {
  const { lang } = use(params);
  return (
    <Suspense fallback={null}>
      <ServiceFallbackInner lang={lang} />
    </Suspense>
  );
}
