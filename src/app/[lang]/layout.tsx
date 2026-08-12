import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FloatingButtons from '@/components/layout/FloatingButtons';
import AppointmentModal from '@/components/forms/AppointmentModal';
import SiteDataProvider from '@/contexts/SiteDataContext';
import { AppointmentModalProvider } from '@/contexts/AppointmentModalContext';
import OrganizationJsonLd from '@/components/seo/OrganizationJsonLd';
import { buildPageMetadata } from '@/lib/metadata';
import { getPageSeo } from '@/lib/seo-pages';
import { getSiteDataServer } from '@/lib/firestore-server';
import { langs } from '@/i18n';
import { Lang } from '@/types';
import { SITE_NAME_RU, SITE_NAME_UZ } from '@/lib/branding';

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

export async function generateStaticParams() {
  return langs.map(lang => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const seo = getPageSeo('home', lang as Lang);
  const siteName = lang === 'ru' ? SITE_NAME_RU : SITE_NAME_UZ;

  return {
    ...buildPageMetadata({ lang: lang as Lang, ...seo }),
    title: {
      default: seo.title,
      template: `%s | ${siteName}`,
    },
    keywords: lang === 'ru'
      ? ['ТГМУ клиника', 'TSMU', 'детская клиника Ташкент', 'детский врач Ташкент', 'хирургия детей']
      : ['TSMU', 'TSMU Kids', 'bolalar klinikasi Toshkent', 'bolalar shifokori', 'bolalar jarrohligi'],
  };
}

export default async function LangLayout({ children, params }: LayoutProps) {
  const { lang } = await params;

  if (!langs.includes(lang as Lang)) {
    notFound();
  }

  const siteData = await getSiteDataServer().catch(() => undefined);
  const initialData = siteData
    ? {
        ...siteData,
        settings: siteData.settings ?? undefined,
      }
    : undefined;

  return (
    <SiteDataProvider initialData={initialData}>
      <AppointmentModalProvider>
        <OrganizationJsonLd settings={initialData?.settings} lang={lang as Lang} />
        <Header lang={lang as Lang} />
        <main className="pt-16 pb-24 md:pb-8">
          {children}
        </main>
        <Footer lang={lang as Lang} />
        <FloatingButtons />
        <AppointmentModal lang={lang as Lang} />
      </AppointmentModalProvider>
    </SiteDataProvider>
  );
}

