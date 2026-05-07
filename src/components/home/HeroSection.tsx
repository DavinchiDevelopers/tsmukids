'use client';

import { Phone, Calendar, ChevronDown } from 'lucide-react';
import { Lang } from '@/types';
import { getT } from '@/i18n';
import { useSiteData } from '@/contexts/SiteDataContext';

interface HeroSectionProps {
  lang: Lang;
}

export default function HeroSection({ lang }: HeroSectionProps) {
  const t = getT(lang);
  const { settings } = useSiteData();

  const stats = [
    { key: 'doctors', value: settings.statsDoctors },
    { key: 'patients', value: settings.statsPatients },
    { key: 'experience', value: settings.statsExperience },
    { key: 'departments', value: settings.statsDepartments },
  ];

  const openModal = () => {
    const el = document.getElementById('appointment-modal');
    if (el) el.style.display = 'flex';
  };

  const phoneHref = `tel:${settings.phone1.replace(/\s/g, '')}`;

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-400 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600 rounded-full blur-3xl opacity-20" />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
        backgroundSize: '50px 50px'
      }} />

      <div className="relative container mx-auto px-3 sm:px-4 pt-20 sm:pt-24 pb-20 sm:pb-16">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex flex-wrap items-center justify-center gap-2 bg-blue-600/20 border border-blue-500/30 text-blue-300 text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-full mb-6 sm:mb-8 backdrop-blur-sm max-w-full text-center">
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse shrink-0" />
            <span className="text-balance">{t.hero.badge}</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-white mb-5 sm:mb-6 leading-tight text-balance">
            {t.hero.title}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
              {t.hero.titleAccent}
            </span>
          </h1>

          <p className="text-base sm:text-lg text-gray-300 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed text-pretty px-1">
            {t.hero.subtitle}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <a
              href={phoneHref}
              className="flex items-center justify-center gap-2 bg-white text-blue-700 px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-blue-50 transition-all shadow-lg shadow-white/10"
            >
              <Phone size={20} />
              {t.hero.callBtn}
            </a>
            <button
              onClick={openModal}
              className="flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/30 border border-blue-500/50"
            >
              <Calendar size={20} />
              {t.hero.appointmentBtn}
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
            {stats.map((stat) => (
              <div key={stat.key} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl sm:rounded-2xl p-3 sm:p-4 min-w-0">
                <div className="text-2xl sm:text-3xl font-bold text-white mb-1 tabular-nums">{stat.value}</div>
                <div className="text-[11px] sm:text-sm text-gray-400 leading-snug text-balance">{t.hero.stats[stat.key as keyof typeof t.hero.stats]}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 text-gray-400 animate-bounce pointer-events-none">
        <ChevronDown size={28} />
      </div>
    </section>
  );
}
