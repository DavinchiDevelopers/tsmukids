import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/siteUrl';
import { SITE_LOGO_PATH, SITE_OG_IMAGE_PATH, SITE_NAME_RU, SITE_NAME_UZ } from '@/lib/branding';
import { Lang } from '@/types';

/** URL страницы с завершающим слэшем (trailingSlash: true) */
export function absolutePageUrl(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  if (normalized === '/') return `${SITE_URL}/`;
  return normalized.endsWith('/') ? `${SITE_URL}${normalized}` : `${SITE_URL}${normalized}/`;
}

/** URL статического файла без лишнего слэша */
export function absoluteAssetUrl(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${normalized}`;
}

/** @deprecated Используйте absolutePageUrl или absoluteAssetUrl */
export function absoluteUrl(path: string): string {
  return absolutePageUrl(path);
}

function buildPath(lang: Lang, path: string): string {
  const suffix = path ? (path.startsWith('/') ? path : `/${path}`) : '';
  return `/${lang}${suffix}`;
}

function sharedSocialMetadata(opts: {
  lang: Lang;
  title: string;
  description: string;
  url: string;
  image?: string;
}): Pick<Metadata, 'openGraph' | 'twitter'> {
  const siteName = opts.lang === 'ru' ? SITE_NAME_RU : SITE_NAME_UZ;
  const imageUrl = absoluteAssetUrl(opts.image ?? SITE_OG_IMAGE_PATH);

  return {
    openGraph: {
      title: opts.title,
      description: opts.description,
      url: opts.url,
      siteName,
      locale: opts.lang === 'ru' ? 'ru_UZ' : 'uz_UZ',
      type: 'website',
      images: [{ url: imageUrl, width: 1200, height: 630, alt: siteName }],
    },
    twitter: {
      card: 'summary_large_image',
      title: opts.title,
      description: opts.description,
      images: [imageUrl],
    },
  };
}

export function buildPageMetadata(opts: {
  lang: Lang;
  title: string;
  description: string;
  path: string;
  image?: string;
}): Metadata {
  const pagePath = buildPath(opts.lang, opts.path);
  const url = absolutePageUrl(pagePath);
  const ruPath = buildPath('ru', opts.path);
  const uzPath = buildPath('uz', opts.path);

  return {
    title: opts.title,
    description: opts.description,
    alternates: {
      canonical: url,
      languages: {
        ru: absolutePageUrl(ruPath),
        uz: absolutePageUrl(uzPath),
      },
    },
    ...sharedSocialMetadata({
      lang: opts.lang,
      title: opts.title,
      description: opts.description,
      url,
      image: opts.image,
    }),
  };
}

export function buildRootMetadata(): Metadata {
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: `${SITE_NAME_RU} — в Ташкенте`,
      template: `%s | ${SITE_NAME_RU}`,
    },
    description:
      'Многопрофильная детская клиника ТГМУ (TSMU — Tashkent State Medical University) в Ташкенте. Диагностика, хирургия, консультации специалистов для детей от 3 месяцев до 18 лет.',
    icons: {
      icon: SITE_LOGO_PATH,
      shortcut: SITE_LOGO_PATH,
      apple: SITE_LOGO_PATH,
    },
  };
}
