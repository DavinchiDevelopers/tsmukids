import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/metadata';
import { getPageSeo, type SeoPageKey } from '@/lib/seo-pages';
import { Lang } from '@/types';

export function createPageMetadata(page: SeoPageKey) {
  return async function generateMetadata({
    params,
  }: {
    params: Promise<{ lang: string }>;
  }): Promise<Metadata> {
    const { lang } = await params;
    const seo = getPageSeo(page, lang as Lang);
    return buildPageMetadata({ lang: lang as Lang, ...seo });
  };
}
