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

/** Смена языка с сохранением path и ?slug= (иначе fallback теряет врача/отделение). */
export function langSwitchHref(pathname: string, fromLang: string, toLang: string, search = ''): string {
  const base = pathname.replace(new RegExp(`^/${fromLang}(?=/|$)`), `/${toLang}`);
  if (!search) return base;
  const qs = search.startsWith('?') ? search : `?${search}`;
  return `${base}${qs}`;
}
