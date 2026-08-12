import type { Metadata } from 'next';
import Link from 'next/link';
import { Lang } from '@/types';
import { getT } from '@/i18n';
import { buildPageMetadata } from '@/lib/metadata';
import { getPageSeo } from '@/lib/seo-pages';

interface PrivacyPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: PrivacyPageProps): Promise<Metadata> {
  const { lang } = await params;
  const seo = getPageSeo('privacy', lang as Lang);
  return buildPageMetadata({ lang: lang as Lang, ...seo });
}

export default async function PrivacyPage({ params }: PrivacyPageProps) {
  const { lang: langStr } = await params;
  const lang = langStr as Lang;
  const t = getT(lang);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-blue-900 to-blue-950 text-white py-16">
        <div className="container mx-auto px-3 sm:px-4">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">{t.privacy.title}</h1>
          <p className="text-blue-200 max-w-3xl">{t.privacy.subtitle}</p>
        </div>
      </div>

      <div className="container mx-auto px-3 sm:px-4 py-10">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 space-y-8 text-gray-700 leading-relaxed">
          {t.privacy.sections.map(section => (
            <section key={section.title}>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">{section.title}</h2>
              <div className="space-y-3">
                {section.paragraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
          <div className="pt-2 border-t border-gray-100">
            <Link href={`/${lang}`} className="text-blue-600 hover:text-blue-700 font-medium">
              {t.privacy.backHome}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
