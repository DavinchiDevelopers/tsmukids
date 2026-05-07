import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FloatingButtons from '@/components/layout/FloatingButtons';
import AppointmentModal from '@/components/forms/AppointmentModal';
import SiteDataProvider from '@/contexts/SiteDataContext';
import { langs } from '@/i18n';
import { Lang } from '@/types';

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

export async function generateStaticParams() {
  return langs.map(lang => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const isRu = lang === 'ru';
  return {
    title: {
      default: isRu ? 'MedCare Clinic — Многопрофильная клиника в Ташкенте' : 'MedCare Clinic — Toshkentdagi ko\'p tarmoqli klinika',
      template: '%s | MedCare Clinic',
    },
    description: isRu
      ? 'Современная многопрофильная клиника в Ташкенте. МРТ, КТ, УЗИ, анализы, хирургия, консультации специалистов. Запись онлайн.'
      : 'Toshkentdagi zamonaviy ko\'p tarmoqli klinika. MRT, KT, UZI, tahlillar, jarrohlik, mutaxassis maslahatlari. Onlayn yozilish.',
    keywords: isRu
      ? ['клиника Ташкент', 'МРТ Ташкент', 'врач Ташкент', 'анализы Ташкент', 'хирургия Ташкент']
      : ['klinika Toshkent', 'MRT Toshkent', 'shifokor Toshkent'],
    openGraph: {
      siteName: 'MedCare Clinic',
      locale: lang === 'ru' ? 'ru_UZ' : 'uz_UZ',
    },
  };
}

export default async function LangLayout({ children, params }: LayoutProps) {
  const { lang } = await params;

  if (!langs.includes(lang as Lang)) {
    notFound();
  }

  return (
    <SiteDataProvider>
      <Header lang={lang as Lang} />
      <main className="pt-16 pb-24 md:pb-8">
        {children}
      </main>
      <Footer lang={lang as Lang} />
      <FloatingButtons />
      <AppointmentModal lang={lang as Lang} />
    </SiteDataProvider>
  );
}
