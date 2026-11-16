'use client';

import { use } from 'react';
import Link from 'next/link';
import { Phone, MapPin, Clock, ShieldCheck } from 'lucide-react';
import { Lang } from '@/types';
import { getT } from '@/i18n';
import { useSiteData } from '@/contexts/SiteDataContext';
import MapEmbed from '@/components/shared/MapEmbed';

export default function ContactsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = use(params);
  const t = getT(lang as Lang);
  const { settings } = useSiteData();
  const phoneLines = [settings.phone1, settings.phone2, settings.phone3].filter(Boolean).join('\n');
  const phone1Href = `tel:${(settings.phone1 || '').replace(/\s/g, '')}`;
  const phone2Href = `tel:${(settings.phone2 || '').replace(/\s/g, '')}`;
  const phone3Href = `tel:${(settings.phone3 || '').replace(/\s/g, '')}`;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-blue-900 to-blue-950 text-white py-16">
        <div className="container mx-auto px-3 sm:px-4 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3 text-balance px-1">{t.contacts.title}</h1>
        </div>
      </div>

      <div className="container mx-auto px-3 sm:px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-10">
          <div className="space-y-5">
            {[
              {
                icon: MapPin,
                title: t.contacts.address,
                content: settings.address,
              },
              {
                icon: Phone,
                title: t.contacts.phones,
                content: `${phoneLines}\n${settings.email}`.trim(),
              },
              {
                icon: Clock,
                title: t.contacts.workingHours,
                content: settings.workingHours + '\n\n' + t.contacts.emergency,
              },
            ].map(({ icon: Icon, title, content }) => (
              <div key={title} className="bg-white rounded-2xl p-6 border border-gray-100">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                    <Icon size={22} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                    {title === t.contacts.phones ? (
                      <div className="text-sm">
                        {settings.phone1 && (
                          <div className="mb-2">
                            <p className="text-xs text-gray-500 mb-0.5">{t.contacts.phoneAdmission}</p>
                            <a href={phone1Href} className="block text-blue-600 hover:underline">{settings.phone1}</a>
                          </div>
                        )}
                        {settings.phone2 && (
                          <div className="mb-2">
                            <p className="text-xs text-gray-500 mb-0.5">{t.contacts.phonePolyclinic}</p>
                            <a href={phone2Href} className="block text-blue-600 hover:underline">{settings.phone2}</a>
                          </div>
                        )}
                        {settings.phone3 && (
                          <div className="mb-2">
                            <p className="text-xs text-gray-500 mb-0.5">{t.contacts.phoneMobile}</p>
                            <a href={phone3Href} className="block text-blue-600 hover:underline">{settings.phone3}</a>
                          </div>
                        )}
                        <a href={`mailto:${settings.email}`} className="block text-gray-600 hover:text-blue-600 mt-1">{settings.email}</a>
                      </div>
                    ) : (
                      <p className="text-gray-600 text-sm whitespace-pre-line">{content}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}

            <div className="bg-gradient-to-br from-blue-50/60 to-white rounded-2xl p-6 border border-blue-100">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center shrink-0">
                  <ShieldCheck size={22} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {lang === 'ru' ? 'Комплаенс и телефоны доверия' : 'Komplaens va ishonch telefonlari'}
                  </h3>
                  <p className="text-xs text-gray-500 mb-3">
                    {t.antiCorruption.lawBasis}
                  </p>
                  <div className="space-y-1.5 text-sm">
                    <div>
                      <span className="text-xs text-gray-500 block">{t.antiCorruption.hotlineClinic}:</span>
                      <a href="tel:+998909168999" className="text-blue-600 hover:underline font-medium mr-3">+998 (90) 916-89-99</a>
                      <a href="tel:+998712603116" className="text-blue-600 hover:underline font-medium">+998 (71) 260-31-16</a>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 block">{t.antiCorruption.complianceTitle}:</span>
                      <a href="tel:+998916078977" className="text-blue-600 hover:underline font-medium">+998 (91) 607-89-77</a>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 block">{t.antiCorruption.emailTitle}:</span>
                      <a href="mailto:alibek.berdiqulov@mail.ru" className="text-blue-600 hover:underline">alibek.berdiqulov@mail.ru</a>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-blue-100 flex items-center justify-between">
                    <Link href={`/${lang}/anti-corruption`} className="text-xs font-semibold text-blue-600 hover:underline">
                      {lang === 'ru' ? 'Обращение руководителя →' : 'Rahbar murojaatnomasi →'}
                    </Link>
                    <a href="https://t.me/clinica07_bot" target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline font-medium">
                      @clinica07_bot
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <MapEmbed
            src={settings.mapEmbedUrl}
            label={settings.mapLabel || settings.address}
            lang={lang as Lang}
          />
        </div>
      </div>
    </div>
  );
}
