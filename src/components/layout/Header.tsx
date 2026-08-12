'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Phone, Calendar } from 'lucide-react';
import { Lang } from '@/types';
import { getT } from '@/i18n';
import { useSiteData } from '@/contexts/SiteDataContext';
import { useAppointmentModal } from '@/contexts/AppointmentModalContext';
import Logo from '@/components/layout/Logo';
import clsx from 'clsx';

interface HeaderProps {
  lang: Lang;
}

export default function Header({ lang }: HeaderProps) {
  const t = getT(lang);
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { settings } = useSiteData();
  const { open: openAppointment } = useAppointmentModal();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const otherLang = lang === 'ru' ? 'uz' : 'ru';
  const switchPath = pathname.replace(`/${lang}`, `/${otherLang}`);

  const phone = settings.phone1;
  const phoneHref = `tel:${phone.replace(/\s/g, '')}`;

  const [logoLine1, logoLine2] = lang === 'ru'
    ? ['Детская клиника ТГМУ', 'TSMU Kids']
    : ['TSMU Bolalar klinikasi', 'TSMU Kids'];

  const navLinks = [
    { href: `/${lang}`, label: t.nav.home },
    { href: `/${lang}/about`, label: t.nav.about },
    { href: `/${lang}/departments`, label: t.nav.departments },
    { href: `/${lang}/doctors`, label: t.nav.doctors },
    { href: `/${lang}/services`, label: t.nav.services },
    { href: `/${lang}/equipment`, label: t.nav.equipment },
    { href: `/${lang}/prices`, label: t.nav.prices },
    { href: `/${lang}/gallery`, label: t.nav.gallery },
    { href: `/${lang}/contacts`, label: t.nav.contacts },
  ];

  return (
    <header className={clsx(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
      scrolled || menuOpen ? 'bg-white shadow-md py-2' : 'bg-white/95 backdrop-blur-sm py-3'
    )}>
      <div className="mx-auto max-w-[1600px] px-3 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between gap-2 min-w-0">
          {/* Logo */}
          <Link href={`/${lang}`} className="flex items-center gap-2 min-w-0 shrink-0">
            <Logo alt={lang === 'ru' ? 'Логотип клиники' : 'Klinika logotipi'} />
            <div className="min-w-0">
              <span className="font-bold text-gray-900 text-[11px] sm:text-sm leading-tight block truncate">{logoLine1}</span>
              <span className="font-bold text-gray-900 text-[11px] sm:text-sm leading-tight block truncate">{logoLine2}</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden xl:flex flex-1 flex-wrap items-center justify-center gap-x-1 gap-y-1 px-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={clsx(
                  'px-2 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap',
                  pathname === link.href
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2 xl:gap-3">
            {/* Language switch */}
            <Link
              href={switchPath}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-gray-200 text-sm font-medium text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors"
            >
              {otherLang.toUpperCase()}
            </Link>

            {/* Phone */}
            <a
              href={phoneHref}
              className="hidden md:flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              <Phone size={18} className="text-blue-600 shrink-0" />
              <div className="leading-tight whitespace-nowrap">
                <div className="text-sm font-semibold text-gray-900">{phone}</div>
                <div className="text-[11px] text-gray-500">{t.header.workingShort}</div>
              </div>
            </a>

            {/* CTA */}
            <button
              type="button"
              onClick={openAppointment}
              className="hidden sm:flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors whitespace-nowrap"
            >
              <Calendar size={16} />
              {t.hero.appointmentBtn}
            </button>

            {/* Burger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="xl:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
              aria-label="Menu"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="xl:hidden mt-3 pb-3 border-t border-gray-100 bg-white">
            <nav className="flex flex-col gap-1 pt-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={clsx(
                    'px-4 py-3 rounded-md text-sm font-medium transition-colors',
                    pathname === link.href
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex items-center gap-3 px-4 pt-3 border-t border-gray-100 mt-2">
                <Link
                  href={switchPath}
                  onClick={() => setMenuOpen(false)}
                  className="px-3 py-1.5 rounded-full border border-gray-200 text-sm font-medium text-gray-600"
                >
                  {otherLang.toUpperCase()}
                </Link>
                <a href={phoneHref} className="text-sm text-gray-700 flex items-center gap-1">
                  <Phone size={14} /> {phone}
                </a>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
