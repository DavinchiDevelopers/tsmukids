'use client';

import Link from 'next/link';
import { Phone, MapPin, Clock, Mail } from 'lucide-react';
import { Lang } from '@/types';
import { getT } from '@/i18n';
import { useSiteData } from '@/contexts/SiteDataContext';
import Logo from '@/components/layout/Logo';

interface FooterProps {
  lang: Lang;
}

export default function Footer({ lang }: FooterProps) {
  const t = getT(lang);
  const { settings } = useSiteData();

  const clinicName = lang === 'ru' ? settings.nameShortRu : settings.nameShortUz;
  const whatsappHref = `https://wa.me/${settings.whatsapp || '998901234567'}`;

  const navLinks = [
    { href: `/${lang}`, label: t.nav.home },
    { href: `/${lang}/about`, label: t.nav.about },
    { href: `/${lang}/departments`, label: t.nav.departments },
    { href: `/${lang}/doctors`, label: t.nav.doctors },
    { href: `/${lang}/services`, label: t.nav.services },
    { href: `/${lang}/prices`, label: t.nav.prices },
    { href: `/${lang}/gallery`, label: t.nav.gallery },
    { href: `/${lang}/contacts`, label: t.nav.contacts },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-3 sm:px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Logo
                alt={lang === 'ru' ? `Логотип ${clinicName}` : `${clinicName} logotipi`}
              />
              <div>
                <span className="font-bold text-white text-lg leading-none block">{clinicName}</span>
                <span className="text-blue-400 text-xs">{t.header.tagline}</span>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-gray-400">{t.footer.description}</p>
            <div className="flex gap-3 mt-4">
              <a href={whatsappHref} className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors" aria-label="WhatsApp">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t.footer.links}</h3>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacts */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t.nav.contacts}</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MapPin size={16} className="text-blue-400 mt-0.5 shrink-0" />
                <span className="text-sm text-gray-400">{settings.address}</span>
              </li>
              <li className="flex items-start gap-2">
                <Phone size={16} className="text-blue-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">{t.contacts.phoneAdmission}</p>
                  <a href={`tel:${settings.phone1.replace(/\s/g, '')}`} className="text-sm text-gray-400 hover:text-white transition-colors">{settings.phone1}</a>
                </div>
              </li>
              {settings.phone2 && (
                <li className="flex items-start gap-2">
                  <Phone size={16} className="text-blue-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500">{t.contacts.phonePolyclinic}</p>
                    <a href={`tel:${settings.phone2.replace(/\s/g, '')}`} className="text-sm text-gray-400 hover:text-white transition-colors">{settings.phone2}</a>
                  </div>
                </li>
              )}
              {settings.phone3 && (
                <li className="flex items-start gap-2">
                  <Phone size={16} className="text-blue-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500">{t.contacts.phoneMobile}</p>
                    <a href={`tel:${settings.phone3.replace(/\s/g, '')}`} className="text-sm text-gray-400 hover:text-white transition-colors">{settings.phone3}</a>
                  </div>
                </li>
              )}
              {settings.email && (
                <li className="flex items-center gap-2">
                  <Mail size={16} className="text-blue-400 shrink-0" />
                  <a href={`mailto:${settings.email}`} className="text-sm text-gray-400 hover:text-white transition-colors">{settings.email}</a>
                </li>
              )}
            </ul>
          </div>

          {/* Working hours */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t.footer.workingHours}</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Clock size={16} className="text-blue-400 shrink-0" />
                <span className="text-sm text-gray-400">{t.footer.workingHoursValue}</span>
              </li>
              {t.footer.workingHoursWeekend ? (
                <li className="flex items-center gap-2">
                  <Clock size={16} className="text-blue-400 shrink-0" />
                  <span className="text-sm text-gray-400">{t.footer.workingHoursWeekend}</span>
                </li>
              ) : null}
              <li className="mt-3 px-3 py-2 bg-red-900/30 border border-red-800 rounded-lg">
                <span className="text-sm text-red-400 font-medium">{t.footer.emergency}</span>
              </li>
            </ul>
          </div>
        </div>

        <p className="text-xs text-gray-500 text-center mt-8 leading-relaxed max-w-3xl mx-auto">
          {t.disclaimer.text}
        </p>

        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-gray-500">© {new Date().getFullYear()} {settings.nameShortRu}. {t.footer.rights}</p>
          <Link href={`/${lang}/privacy`} className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
            {t.footer.privacy}
          </Link>
        </div>
      </div>
    </footer>
  );
}
