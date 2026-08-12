import { ClinicSettings } from '@/lib/firestore';
import { absoluteAssetUrl, absolutePageUrl } from '@/lib/metadata';
import { SITE_LOGO_PATH, SITE_OG_IMAGE_PATH, SITE_NAME_RU } from '@/lib/branding';
import { defaultSettings } from '@/contexts/SiteDataContext';

interface OrganizationJsonLdProps {
  settings?: ClinicSettings | null;
  lang: 'ru' | 'uz';
}

export default function OrganizationJsonLd({ settings, lang }: OrganizationJsonLdProps) {
  const s = settings ?? defaultSettings;
  const name = lang === 'ru' ? s.nameShortRu : s.nameShortUz;
  const description =
    lang === 'ru' ? s.aboutDescription1Ru : s.aboutDescription1Uz;

  const sameAs = [s.whatsapp ? `https://wa.me/${s.whatsapp}` : ''].filter(Boolean);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'MedicalClinic',
    name,
    alternateName: SITE_NAME_RU,
    description,
    url: absolutePageUrl(`/${lang}/`),
    logo: absoluteAssetUrl(SITE_LOGO_PATH),
    image: absoluteAssetUrl(SITE_OG_IMAGE_PATH),
    telephone: (s.phone1 || '').replace(/\s/g, '') || undefined,
    email: s.email || undefined,
    address: {
      '@type': 'PostalAddress',
      streetAddress: s.address,
      addressLocality: 'Salar',
      addressRegion: 'Tashkent Region',
      addressCountry: 'UZ',
    },
    openingHours: s.workingHours,
    medicalSpecialty: 'Pediatric',
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
