import type { Metadata } from 'next';
import Link from 'next/link';
import { Shield, Clock, Zap, Activity, Award, ArrowRight, Monitor } from 'lucide-react';
import { Lang } from '@/types';
import { getT } from '@/i18n';
import { getSettingsServer } from '@/lib/firestore-server';
import type { ClinicSettings } from '@/lib/firestore';
import { defaultSettings } from '@/contexts/SiteDataContext';
import { buildPageMetadata } from '@/lib/metadata';
import { getPageSeo } from '@/lib/seo-pages';

interface AboutPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: AboutPageProps): Promise<Metadata> {
  const { lang } = await params;
  const seo = getPageSeo('about', lang as Lang);
  return buildPageMetadata({ lang: lang as Lang, ...seo });
}

async function loadSettings(): Promise<ClinicSettings> {
  try {
    return (await getSettingsServer()) ?? defaultSettings;
  } catch {
    return defaultSettings;
  }
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { lang: langStr } = await params;
  const lang = langStr as Lang;
  const t = getT(lang);
  const settings = await loadSettings();

  const stats = [
    { value: settings.statsDoctors, label: t.hero.stats.doctors },
    { value: settings.statsPatients, label: t.hero.stats.patients },
    { value: settings.statsExperience, label: t.hero.stats.experience },
    { value: settings.statsDepartments, label: t.hero.stats.departments },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-blue-900 to-blue-950 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3 text-balance px-1">{t.about.title}</h1>
          <p className="text-blue-200 max-w-2xl mx-auto">{t.about.description1}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 space-y-10">
        <div className="bg-white rounded-2xl p-5 sm:p-8 border border-gray-100">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 text-balance">
            {lang === 'ru' ? 'О клинике' : 'Klinika haqida'}
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">{t.about.description1}</p>
          <p className="text-gray-600 leading-relaxed">{t.about.description2}</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { icon: Shield, key: 'license' as const },
            { icon: Clock, key: 'stationery' as const },
            { icon: Zap, key: 'emergency' as const },
            { icon: Activity, key: 'equipment' as const, href: `/${lang}/equipment` },
          ].map(({ icon: Icon, key, href }) => {
            const body = (
              <>
                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Icon size={26} className="text-blue-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">
                  {t.about.features[key].title}
                </h3>
                <p className="text-gray-500 text-sm">
                  {t.about.features[key].desc}
                </p>
              </>
            );
            return href ? (
              <Link
                key={key}
                href={href}
                className="bg-white rounded-2xl p-6 border border-gray-100 text-center hover:border-blue-200 hover:shadow-sm transition-all block"
              >
                {body}
              </Link>
            ) : (
              <div key={key} className="bg-white rounded-2xl p-6 border border-gray-100 text-center">
                {body}
              </div>
            );
          })}
        </div>

        <div
          id="equipment"
          className="bg-white rounded-2xl p-5 sm:p-8 border border-gray-100 flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-8"
        >
          <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center shrink-0">
            <Monitor size={28} className="text-blue-600" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{t.about.equipmentTitle}</h2>
            <p className="text-gray-600 leading-relaxed">{t.about.equipmentText}</p>
          </div>
          <Link
            href={`/${lang}/equipment`}
            className="inline-flex items-center justify-center gap-2 shrink-0 bg-blue-600 text-white px-5 py-3 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            {t.about.equipmentLink}
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-5 sm:p-8 text-white">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center">
            {stats.map((stat, i) => (
              <div key={i}>
                <div className="text-2xl sm:text-4xl font-bold mb-1 tabular-nums">{stat.value}</div>
                <div className="text-blue-200 text-xs sm:text-sm leading-snug text-balance px-0.5">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {lang === 'ru' ? 'Лицензия' : 'Litsenziya'}
          </h2>
          <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl max-w-xl">
            <Award size={20} className="text-blue-600 shrink-0" />
            <span className="text-sm text-gray-700 font-medium">
              {settings.licenseInfo ||
                (lang === 'ru'
                  ? 'Лицензия Министерства здравоохранения Республики Узбекистан'
                  : "O'zbekiston Respublikasi Sog'liqni saqlash vazirligi litsenziyasi")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
