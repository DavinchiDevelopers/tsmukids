'use client';

import { Phone, Calendar } from 'lucide-react';
import { Lang } from '@/types';
import { getT } from '@/i18n';
import { useSiteData } from '@/contexts/SiteDataContext';
import { useAppointmentModal } from '@/contexts/AppointmentModalContext';

interface CTASectionProps {
  lang: Lang;
}

export default function CTASection({ lang }: CTASectionProps) {
  const t = getT(lang);
  const { settings } = useSiteData();
  const { open } = useAppointmentModal();
  const phoneHref = `tel:${settings.phone1.replace(/\s/g, '')}`;

  return (
    <section className="py-12 sm:py-20 bg-gradient-to-r from-blue-600 to-blue-700">
      <div className="container mx-auto px-3 sm:px-4 text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 text-balance">{t.cta.title}</h2>
        <p className="text-blue-100 text-base sm:text-lg mb-8 sm:mb-10 max-w-2xl mx-auto text-pretty px-1">{t.cta.subtitle}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            type="button"
            onClick={open}
            className="flex items-center justify-center gap-2 bg-white text-blue-700 px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-blue-50 transition-colors shadow-lg"
          >
            <Calendar size={20} />
            {t.cta.appointmentBtn}
          </button>
          <a
            href={phoneHref}
            className="flex items-center justify-center gap-2 border-2 border-white text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-white/10 transition-colors"
          >
            <Phone size={20} />
            {t.cta.callBtn}
          </a>
        </div>
      </div>
    </section>
  );
}
