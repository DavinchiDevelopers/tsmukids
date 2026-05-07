'use client';

import { Phone, MapPin, Clock, Mail } from 'lucide-react';
import { Lang } from '@/types';
import { getT } from '@/i18n';
import { useSiteData } from '@/contexts/SiteDataContext';

interface ContactsSectionProps {
  lang: Lang;
}

export default function ContactsSection({ lang }: ContactsSectionProps) {
  const t = getT(lang);
  const { settings } = useSiteData();
  const phone1Href = `tel:${(settings.phone1 || '').replace(/\s/g, '')}`;
  const phone2Href = `tel:${(settings.phone2 || '').replace(/\s/g, '')}`;

  return (
    <section id="contacts" className="py-20 bg-gray-50">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="text-center mb-12">
          <span className="inline-block bg-blue-50 text-blue-600 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            {t.contacts.badge}
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 text-balance">{t.contacts.title}</h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 items-start">
          {/* Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                  <MapPin size={22} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{t.contacts.address}</h3>
                  <p className="text-gray-600 text-sm whitespace-pre-line">{settings.address}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                  <Phone size={22} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">{t.contacts.phones}</h3>
                  {settings.phone1 && <a href={phone1Href} className="block text-blue-600 hover:underline text-sm mb-1">{settings.phone1}</a>}
                  {settings.phone2 && <a href={phone2Href} className="block text-blue-600 hover:underline text-sm mb-1">{settings.phone2}</a>}
                  <a href={`mailto:${settings.email}`} className="block text-gray-600 hover:text-blue-600 text-sm flex items-center gap-1 mt-2">
                    <Mail size={14} /> {settings.email}
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                  <Clock size={22} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">{t.contacts.workingHours}</h3>
                  <p className="text-gray-600 text-sm whitespace-pre-line">{settings.workingHours}</p>
                  <p className="text-red-500 text-sm font-medium mt-2">{t.contacts.emergency}</p>
                </div>
              </div>
            </div>
          </div>

          {settings.mapEmbedUrl ? (
            <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 aspect-video lg:aspect-auto lg:h-full min-h-[350px]">
              <iframe
                src={settings.mapEmbedUrl}
                className="w-full h-full min-h-[350px]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          ) : (
            <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 aspect-video lg:aspect-auto lg:h-full min-h-[350px] flex items-center justify-center">
              <div className="text-center text-gray-300">
                <MapPin size={64} />
                <p className="mt-3 text-sm text-gray-400">Карта (Google Maps / Yandex)</p>
                <p className="text-xs text-gray-300">{settings.mapLabel || settings.address}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
