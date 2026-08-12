'use client';

import { use } from 'react';
import { Phone, MapPin, Clock } from 'lucide-react';
import { Lang } from '@/types';
import { getT } from '@/i18n';
import { useSiteData } from '@/contexts/SiteDataContext';

export default function ContactsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = use(params);
  const t = getT(lang as Lang);
  const { settings } = useSiteData();
  const phoneLines = [settings.phone1, settings.phone2].filter(Boolean).join('\n');
  const phone1Href = `tel:${(settings.phone1 || '').replace(/\s/g, '')}`;
  const phone2Href = `tel:${(settings.phone2 || '').replace(/\s/g, '')}`;

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
                        <a href={`mailto:${settings.email}`} className="block text-gray-600 hover:text-blue-600 mt-1">{settings.email}</a>
                      </div>
                    ) : (
                      <p className="text-gray-600 text-sm whitespace-pre-line">{content}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {settings.mapEmbedUrl ? (
            <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 min-h-[400px]">
              <iframe
                src={settings.mapEmbedUrl}
                className="w-full h-full min-h-[400px]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          ) : (
            <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 min-h-[400px] flex items-center justify-center">
              <div className="text-center text-gray-300">
                <MapPin size={64} />
                <p className="mt-3 text-sm text-gray-400">Google Maps / Yandex карта</p>
                <p className="text-xs text-gray-300 mt-1">{settings.mapLabel || settings.address}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
