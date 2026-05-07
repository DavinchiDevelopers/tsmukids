import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { SITE_LOGO_PATH } from '@/lib/branding';

const inter = Inter({ subsets: ['latin', 'cyrillic'] });

export const metadata: Metadata = {
  title: {
    default: 'MedCare Clinic — Многопрофильная клиника в Ташкенте',
    template: '%s | MedCare Clinic',
  },
  description: 'Современная многопрофильная клиника в Ташкенте. МРТ, КТ, УЗИ, анализы, хирургия, консультации специалистов.',
  icons: {
    icon: [{ url: SITE_LOGO_PATH, type: 'image/svg+xml' }],
    shortcut: SITE_LOGO_PATH,
    apple: SITE_LOGO_PATH,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
