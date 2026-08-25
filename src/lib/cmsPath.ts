/** Пути к CMS-страницам через существующий /fallback/ (нужно на nginx без rewrite). */
export function cmsHref(
  lang: string,
  kind: 'services' | 'doctors' | 'departments',
  slug: string,
): string {
  const s = (slug || '').trim();
  if (!s) return `/${lang}/${kind}/`;
  return `/${lang}/${kind}/fallback/?slug=${encodeURIComponent(s)}`;
}
