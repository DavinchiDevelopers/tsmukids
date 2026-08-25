'use client';

import { Suspense, use, useMemo } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import DepartmentPageClient from '../[slug]/DepartmentPageClient';

interface Props {
  params: Promise<{ lang: string }>;
}

function DepartmentFallbackInner({ lang }: { lang: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const slug = useMemo(() => {
    const fromQuery = searchParams.get('slug')?.trim();
    if (fromQuery) return fromQuery;
    const raw = pathname.split('/departments/')[1]?.replace(/\/$/, '') ?? '';
    return raw === 'fallback' ? '' : raw.split('?')[0];
  }, [pathname, searchParams]);

  return <DepartmentPageClient lang={lang} slug={slug} />;
}

export default function DepartmentFallbackPage({ params }: Props) {
  const { lang } = use(params);
  return (
    <Suspense fallback={null}>
      <DepartmentFallbackInner lang={lang} />
    </Suspense>
  );
}
