export const CLINIC_LON = 69.363348;
export const CLINIC_LAT = 41.377527;

/** Координатный embed — надёжнее, чем oid-виджет организации */
export const DEFAULT_MAP_EMBED_URL =
  'https://yandex.com/map-widget/v1/?ll=69.363348%2C41.377527&z=16&pt=69.363348%2C41.377527%2Cpm2rdm&lang=ru_RU';

export function resolveMapEmbedUrl(url?: string | null): string {
  const trimmed = (url || '').trim();
  if (!trimmed) return DEFAULT_MAP_EMBED_URL;
  return trimmed.replace('://yandex.ru/', '://yandex.com/');
}

export function yandexMapsExternalUrl(lang: 'ru' | 'uz' = 'ru'): string {
  const mapLang = lang === 'uz' ? 'uz_UZ' : 'ru_RU';
  return `https://yandex.com/maps/?ll=${CLINIC_LON}%2C${CLINIC_LAT}&z=16&pt=${CLINIC_LON}%2C${CLINIC_LAT}%2Cpm2rdm&lang=${mapLang}`;
}
