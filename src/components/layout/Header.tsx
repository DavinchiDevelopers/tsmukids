'use client';

import { Suspense, useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Menu, X, Phone, Calendar } from 'lucide-react';
import { Lang } from '@/types';
import { getT } from '@/i18n';
import { useSiteData } from '@/contexts/SiteDataContext';
import { useAppointmentModal } from '@/contexts/AppointmentModalContext';
import Logo from '@/components/layout/Logo';
import { langSwitchHref } from '@/lib/cmsPath';
import clsx from 'clsx';

interface HeaderProps {
  lang: Lang;
}

function LangSwitchLink({
  lang,
  className,
  onClick,
}: {
  lang: Lang;
  className?: string;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const otherLang = lang === 'ru' ? 'uz' : 'ru';
  const qs = searchParams.toString();
  const href = langSwitchHref(pathname, lang, otherLang, qs);

  return (
    <Link href={href} onClick={onClick} className={className}>
      {otherLang.toUpperCase()}
    </Link>
  );
}

export default function Header({ lang }: HeaderProps) {
  const t = getT(lang);
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { settings } = useSiteData();
  const { open: openAppointment } = useAppointmentModal();
  const otherLang = lang === 'ru' ? 'uz' : 'ru';
  // SSR / до гидрации — без query; LangSwitchLink поправит ?slug=
  const switchPathFallback = langSwitchHref(pathname, lang, otherLang);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const phone1 = settings.phone1;
  const phone2 = settings.phone2;
  const phone3 = settings.phone3;
  const phone1Href = `tel:${phone1.replace(/\s/g, '')}`;
  const phone2Href = phone2 ? `tel:${phone2.replace(/\s/g, '')}` : '';
  const phone3Href = phone3 ? `tel:${phone3.replace(/\s/g, '')}` : '';

  const logoLine1 = lang === 'ru' ? settings.nameShortRu : settings.nameShortUz;
  const navLinks = [
    { href: `/${lang}`, label: t.nav.home },
    { href: `/${lang}/about`, label: t.nav.about },
    { href: `/${lang}/departments`, label: t.nav.departments },
    { href: `/${lang}/doctors`, label: t.nav.doctors },
    { href: `/${lang}/services`, label: t.nav.services },
    { href: `/${lang}/prices`, label: t.nav.prices },
    { href: `/${lang}/gallery`, label: t.nav.gallery },
    { href: `/${lang}/vacancies`, label: t.nav.vacancies },
    { href: `/${lang}/contacts`, label: t.nav.contacts },
  ];

  const langSwitchClass =
    'flex items-center gap-1 px-3 py-1.5 rounded-full border border-gray-200 text-sm font-medium text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors';

  return (
    <header className={clsx(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
      scrolled || menuOpen ? 'bg-white shadow-md py-2' : 'bg-white/95 backdrop-blur-sm py-3'
    )}>
      <div className="mx-auto max-w-[1600px] px-3 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between gap-2 min-w-0">
          {/* Logo */}
          <Link href={`/${lang}`} className="flex items-center gap-2 min-w-0 flex-1 xl:flex-none xl:shrink-0 pr-2">
            <Logo alt={lang === 'ru' ? 'Логотип клиники' : 'Klinika logotipi'} />
            <div className="min-w-0 max-w-[min(52vw,22rem)] sm:max-w-none">
              <span className="font-bold text-gray-900 text-[10px] sm:text-sm leading-tight block whitespace-normal sm:whitespace-nowrap">{logoLine1}</span>
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
          <div className="flex items-center gap-1.5 sm:gap-2 xl:gap-3 shrink-0">
            <Suspense
              fallback={
                <Link href={switchPathFallback} className={langSwitchClass}>
                  {otherLang.toUpperCase()}
                </Link>
              }
            >
              <LangSwitchLink lang={lang} className={langSwitchClass} />
            </Suspense>

            {/* Phones */}
            <div className="hidden md:flex items-center gap-2 text-gray-700">
              <Phone size={18} className="text-blue-600 shrink-0" />
              <div className="leading-tight whitespace-nowrap">
                <a href={phone1Href} className="block text-sm font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                  {phone1}
                </a>
                {phone2 && (
                  <a href={phone2Href} className="block text-sm font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                    {phone2}
                  </a>
                )}
                {phone3 && (
                  <a href={phone3Href} className="block text-sm font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                    {phone3}
                  </a>
                )}
                <div className="text-[11px] text-gray-500">{t.header.workingShort}</div>
              </div>
            </div>

            {/* CTA */}
            <button
              type="button"
              onClick={openAppointment}
              className="hidden sm:flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors whitespace-nowrap"
            >
              <Calendar size={16} />
              {t.hero.appointmentBtn}
            </button>

            {/* Burger — высокий контраст на белой шапке */}
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="xl:hidden inline-flex items-center justify-center w-11 h-11 rounded-xl border-2 border-gray-800 bg-white text-gray-900 shadow-sm hover:bg-gray-50 active:bg-gray-100"
              aria-label="Menu"
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={24} strokeWidth={2.5} /> : <Menu size={24} strokeWidth={2.5} />}
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
                <Suspense
                  fallback={
                    <Link
                      href={switchPathFallback}
                      onClick={() => setMenuOpen(false)}
                      className="px-3 py-1.5 rounded-full border border-gray-200 text-sm font-medium text-gray-600"
                    >
                      {otherLang.toUpperCase()}
                    </Link>
                  }
                >
                  <LangSwitchLink
                    lang={lang}
                    onClick={() => setMenuOpen(false)}
                    className="px-3 py-1.5 rounded-full border border-gray-200 text-sm font-medium text-gray-600"
                  />
                </Suspense>
                <div className="flex flex-col gap-1 text-sm text-gray-700">
                  <a href={phone1Href} className="flex items-center gap-1">
                    <Phone size={14} /> {phone1}
                  </a>
                  {phone2 && (
                    <a href={phone2Href} className="flex items-center gap-1 pl-4">
                      {phone2}
                    </a>
                  )}
                  {phone3 && (
                    <a href={phone3Href} className="flex items-center gap-1 pl-4">
                      {phone3}
                    </a>
                  )}
                </div>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
