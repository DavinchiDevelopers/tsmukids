'use client';

import { Phone, MapPin, Clock, Mail } from 'lucide-react';
import { Lang } from '@/types';
import { getT } from '@/i18n';
import { useSiteData } from '@/contexts/SiteDataContext';
import MapEmbed from '@/components/shared/MapEmbed';

interface ContactsSectionProps {
  lang: Lang;
}

export default function ContactsSection({ lang }: ContactsSectionProps) {
  const t = getT(lang);
  const { settings } = useSiteData();
  const phone1Href = `tel:${(settings.phone1 || '').replace(/\s/g, '')}`;
  const phone2Href = `tel:${(settings.phone2 || '').replace(/\s/g, '')}`;
  const phone3Href = `tel:${(settings.phone3 || '').replace(/\s/g, '')}`;

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
                  {settings.phone1 && (
                    <div className="mb-2">
                      <p className="text-xs text-gray-500 mb-0.5">{t.contacts.phoneAdmission}</p>
                      <a href={phone1Href} className="block text-blue-600 hover:underline text-sm">{settings.phone1}</a>
                    </div>
                  )}
                  {settings.phone2 && (
                    <div className="mb-2">
                      <p className="text-xs text-gray-500 mb-0.5">{t.contacts.phonePolyclinic}</p>
                      <a href={phone2Href} className="block text-blue-600 hover:underline text-sm">{settings.phone2}</a>
                    </div>
                  )}
                  {settings.phone3 && (
                    <div className="mb-2">
                      <p className="text-xs text-gray-500 mb-0.5">{t.contacts.phoneMobile}</p>
                      <a href={phone3Href} className="block text-blue-600 hover:underline text-sm">{settings.phone3}</a>
                    </div>
                  )}
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

          <MapEmbed
            src={settings.mapEmbedUrl}
            label={settings.mapLabel || settings.address}
            lang={lang}
            heightClass="h-[350px] sm:h-[400px] lg:h-full lg:min-h-[420px]"
          />
        </div>
      </div>
    </section>
  );
}
