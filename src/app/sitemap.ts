import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/siteUrl';
import { getAllSitemapPaths } from '@/lib/sitemap-paths';

export const dynamic = 'force-static';

function pathWithoutLang(fullPath: string): string {
  return fullPath.replace(/^\/(ru|uz)/, '') || '/';
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const paths = await getAllSitemapPaths();
  const grouped = new Map<string, { ru?: string; uz?: string }>();

  for (const path of paths) {
    const lang = path.startsWith('/uz/') ? 'uz' : 'ru';
    const suffix = pathWithoutLang(path);
    const entry = grouped.get(suffix) ?? {};
    entry[lang] = `${SITE_URL}${path}`;
    grouped.set(suffix, entry);
  }

  return paths.map(path => {
    const suffix = pathWithoutLang(path);
    const langs = grouped.get(suffix) ?? {};
    const isHome = suffix === '/';
    const isListing = !path.includes('/doctors/') && !path.includes('/services/') && !path.includes('/departments/');

    return {
      url: `${SITE_URL}${path}`,
      lastModified: new Date(),
      changeFrequency:
        path.includes('/doctors/') || path.includes('/services/') ? 'weekly' : 'monthly',
      priority: isHome ? 1 : isListing && path.split('/').filter(Boolean).length <= 2 ? 0.8 : 0.6,
      alternates: {
        languages: {
          ...(langs.ru ? { ru: langs.ru } : {}),
          ...(langs.uz ? { uz: langs.uz } : {}),
        },
      },
    };
  });
}
