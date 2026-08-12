'use client';

import { Phone, Calendar, ChevronDown, Users, UserRound, ShieldCheck, HeartPulse, Clock, MapPin, MessageCircle } from 'lucide-react';
import { Lang } from '@/types';
import { getT } from '@/i18n';
import { useSiteData } from '@/contexts/SiteDataContext';
import { useAppointmentModal } from '@/contexts/AppointmentModalContext';

interface HeroSectionProps {
  lang: Lang;
}

export default function HeroSection({ lang }: HeroSectionProps) {
  const t = getT(lang);
  const { settings } = useSiteData();
  const { open: openAppointment } = useAppointmentModal();

  const stats = [
    { key: 'doctors', value: settings.statsDoctors, icon: UserRound, color: 'bg-blue-50 text-blue-600' },
    { key: 'patients', value: settings.statsPatients, icon: Users, color: 'bg-emerald-50 text-emerald-600' },
    { key: 'experience', value: settings.statsExperience, icon: ShieldCheck, color: 'bg-indigo-50 text-indigo-600' },
    { key: 'departments', value: settings.statsDepartments, icon: HeartPulse, color: 'bg-orange-50 text-orange-600' },
  ];

  const features = [
    { key: 'hours', icon: Clock, desc: t.hero.features.hours.desc },
    { key: 'location', icon: MapPin, desc: settings.address },
    { key: 'safety', icon: ShieldCheck, desc: t.hero.features.safety.desc },
    { key: 'support', icon: MessageCircle, desc: t.hero.features.support.desc },
  ];

  const phoneHref = `tel:${settings.phone1.replace(/\s/g, '')}`;

  return (
    <section className="relative flex items-center overflow-hidden bg-white pt-24 sm:pt-28 xl:pt-32">
      {/* Photo background — mobile/tablet: cropped to the doctor+child half, faded into white */}
      <div
        className="absolute inset-x-0 top-0 h-[420px] sm:h-[520px] md:h-[620px] lg:hidden opacity-30"
        style={{
          backgroundImage: "url('/hero/hero-doctor-mobile.webp')",
          backgroundSize: 'cover',
          backgroundPosition: 'center 20%',
        }}
      />
      <div className="absolute inset-x-0 top-0 h-[420px] sm:h-[520px] md:h-[620px] lg:hidden bg-gradient-to-b from-white/10 via-white/70 to-white" />

      {/* Photo background — desktop: full photo on the right */}
      <div
        className="absolute inset-0 hidden lg:block"
        style={{
          backgroundImage: "url('/hero/hero-doctor.webp')",
          backgroundSize: 'cover',
          backgroundPosition: 'right center',
        }}
      />
      {/* Legibility gradient over the photo */}
      <div className="absolute inset-0 hidden lg:block bg-gradient-to-r from-white via-white/85 to-transparent" />

      <div className="relative w-full container mx-auto px-3 sm:px-4 pt-8 sm:pt-10 pb-10 sm:pb-16">
        <div className="max-w-xl">
          {/* Badge */}
          <div className="inline-flex flex-wrap items-center gap-2 bg-white border border-blue-100 text-blue-700 text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-full mb-6 sm:mb-8 shadow-sm">
            <HeartPulse size={16} className="text-blue-500 shrink-0" />
            <span className="text-balance">{t.hero.badge}</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-slate-900 mb-5 sm:mb-6 leading-tight text-balance">
            {t.hero.title}
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
              {t.hero.titleAccent}
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 mb-8 sm:mb-10 max-w-md leading-relaxed text-pretty">
            {t.hero.subtitle}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 mb-10 sm:mb-14">
            <button
              onClick={openAppointment}
              className="flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
            >
              <Calendar size={20} />
              {t.hero.appointmentBtn}
            </button>
            <a
              href={phoneHref}
              className="flex items-center justify-center gap-2 bg-white text-slate-800 px-8 py-4 rounded-2xl font-semibold text-lg border border-slate-200 hover:bg-slate-50 transition-all shadow-sm"
            >
              <Phone size={20} />
              {t.hero.callBtn}
            </a>
          </div>

        </div>

        {/* Stats */}
        <div className="max-w-3xl grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {stats.map((stat) => (
            <div key={stat.key} className="bg-white border border-slate-100 rounded-xl sm:rounded-2xl p-3 sm:p-4 min-w-0 shadow-sm">
              <div className={`inline-flex items-center justify-center w-8 h-8 rounded-lg mb-2 ${stat.color}`}>
                <stat.icon size={16} />
              </div>
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 mb-1 tabular-nums whitespace-nowrap">{stat.value}</div>
              <div className="text-[11px] sm:text-sm text-slate-500 leading-snug text-balance">{t.hero.stats[stat.key as keyof typeof t.hero.stats]}</div>
            </div>
          ))}
        </div>

        {/* Feature strip */}
        <div className="relative mt-10 sm:mt-16 bg-white border border-slate-100 rounded-2xl shadow-lg shadow-slate-900/5 px-4 sm:px-8 py-5 sm:py-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4 lg:divide-x lg:divide-slate-100">
            {features.map((feature) => (
              <div key={feature.key} className="flex items-center gap-3 lg:pl-4 lg:first:pl-0">
                <div className="flex items-center justify-center w-10 h-10 shrink-0 rounded-xl bg-blue-50 text-blue-600">
                  <feature.icon size={18} />
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-slate-900 text-sm sm:text-base">
                    {t.hero.features[feature.key as keyof typeof t.hero.features].title}
                  </div>
                  <div className="text-slate-500 text-xs sm:text-sm leading-snug">{feature.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="hidden sm:flex absolute bottom-4 left-1/2 -translate-x-1/2 text-slate-400 animate-bounce pointer-events-none">
        <ChevronDown size={28} />
      </div>
    </section>
  );
}
