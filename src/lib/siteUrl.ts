/** Базовый URL сайта для SEO (robots, sitemap, canonical). Задаётся через NEXT_PUBLIC_SITE_URL при деплое. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://tsmukids.uz').replace(/\/$/, '');
