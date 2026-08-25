'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import SiteDataProvider from '@/contexts/SiteDataContext';
import { AppointmentModalProvider } from '@/contexts/AppointmentModalContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FloatingButtons from '@/components/layout/FloatingButtons';
import AppointmentModal from '@/components/forms/AppointmentModal';
import DepartmentPageClient from '@/app/[lang]/departments/[slug]/DepartmentPageClient';
import DoctorPageClient from '@/app/[lang]/doctors/[slug]/DoctorPageClient';
import ServicePageClient from '@/app/[lang]/services/[slug]/ServicePageClient';
import { Lang } from '@/types';

function parseCmsPath(pathname: string): {
  lang: Lang;
  kind: 'departments' | 'doctors' | 'services' | null;
  slug: string;
} {
  const parts = pathname.split('/').filter(Boolean);
  const lang: Lang = parts[0] === 'uz' ? 'uz' : 'ru';
  const kind = parts[1];
  const slug = parts[2] ?? '';

  if (
    (kind === 'departments' || kind === 'doctors' || kind === 'services') &&
    slug &&
    slug !== 'fallback'
  ) {
    return { lang, kind, slug };
  }

  return { lang, kind: null, slug: '' };
}

function CmsBody() {
  const nextPath = usePathname() || '';
  // nginx error_page отдаёт 404.html, но URL в браузере остаётся /ru/departments/...
  const [pathname, setPathname] = useState(nextPath);
  useEffect(() => {
    setPathname(window.location.pathname);
  }, []);
  const { lang, kind, slug } = parseCmsPath(pathname || nextPath);

  let content: React.ReactNode;
  if (kind === 'departments') {
    content = <DepartmentPageClient lang={lang} slug={slug} />;
  } else if (kind === 'doctors') {
    content = <DoctorPageClient lang={lang} slug={slug} />;
  } else if (kind === 'services') {
    content = <ServicePageClient lang={lang} slug={slug} />;
  } else {
    content = (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <p className="text-6xl font-bold text-blue-600 mb-4">404</p>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Страница не найдена</h1>
          <p className="text-gray-500 mb-6">Sahifa topilmadi</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/ru/"
              className="inline-flex items-center justify-center bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-colors"
            >
              На главную (RU)
            </Link>
            <Link
              href="/uz/"
              className="inline-flex items-center justify-center border border-gray-200 text-gray-700 px-5 py-2.5 rounded-xl font-medium hover:bg-gray-100 transition-colors"
            >
              Bosh sahifa (UZ)
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header lang={lang} />
      <main className="pt-16 pb-24 md:pb-8">{content}</main>
      <Footer lang={lang} />
      <FloatingButtons />
      <AppointmentModal lang={lang} />
    </>
  );
}

/** Универсальный 404: для CMS-URL (услуги/врачи/отделения) рисует страницу, иначе — «не найдено». */
export default function CmsOrNotFound() {
  return (
    <SiteDataProvider>
      <AppointmentModalProvider>
        <CmsBody />
      </AppointmentModalProvider>
    </SiteDataProvider>
  );
}
