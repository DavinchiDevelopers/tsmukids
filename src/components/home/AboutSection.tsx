'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Shield, Clock, Zap, Activity } from 'lucide-react';
import { Lang } from '@/types';
import { getT } from '@/i18n';
import { useSiteData } from '@/contexts/SiteDataContext';

interface AboutSectionProps {
  lang: Lang;
}

export default function AboutSection({ lang }: AboutSectionProps) {
  const t = getT(lang);
  const { settings } = useSiteData();

  const features = [
    { icon: Shield, key: 'license' as const },
    { icon: Clock, key: 'stationery' as const },
    { icon: Zap, key: 'emergency' as const },
    { icon: Activity, key: 'equipment' as const, href: `/${lang}/equipment` },
  ];

  const description1 = lang === 'ru' ? settings.aboutDescription1Ru : settings.aboutDescription1Uz;
  const description2 = lang === 'ru' ? settings.aboutDescription2Ru : settings.aboutDescription2Uz;

  return (
    <section id="about" className="py-12 sm:py-20 bg-white">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="relative">
            <div className="aspect-[4/3] bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl overflow-hidden shadow-sm">
              <Image
                src="/hero/hero-doctor.webp"
                alt={lang === 'ru' ? 'Врач осматривает ребёнка' : 'Shifokor bolani ko\'rikdan o\'tkazmoqda'}
                fill
                className="object-cover"
                unoptimized
              />
              <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-xs bg-white rounded-2xl p-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{lang === 'ru' ? 'Лицензия' : 'Litsenziya'}</p>
                    <p className="text-sm font-semibold text-gray-800">{settings.licenseInfo || 'Минздрав РУз'}</p>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="absolute -bottom-4 -right-4 w-32 h-32 opacity-20"
              style={{ backgroundImage: 'radial-gradient(circle, #3b82f6 1px, transparent 1px)', backgroundSize: '12px 12px' }}
            />
          </div>

          <div>
            <span className="inline-block bg-blue-50 text-blue-600 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
              {t.about.badge}
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-balance">
              {t.about.title}
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">{description1}</p>
            <p className="text-gray-600 mb-8 leading-relaxed">{description2}</p>

            <div className="grid sm:grid-cols-2 gap-4">
              {features.map(({ icon: Icon, key, href }) => {
                const inner = (
                  <>
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                      <Icon size={20} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">{t.about.features[key].title}</p>
                      <p className="text-gray-500 text-xs mt-0.5">{t.about.features[key].desc}</p>
                    </div>
                  </>
                );
                return href ? (
                  <Link
                    key={key}
                    href={href}
                    className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors"
                  >
                    {inner}
                  </Link>
                ) : (
                  <div key={key} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors">
                    {inner}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
