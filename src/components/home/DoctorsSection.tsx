'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, User } from 'lucide-react';
import { Lang } from '@/types';
import { getT } from '@/i18n';
import { useSiteData } from '@/contexts/SiteDataContext';
import { doctorPhotoThumb } from '@/lib/doctorPhoto';
import { cmsHref } from '@/lib/cmsPath';

interface DoctorsSectionProps {
  lang: Lang;
}

function DoctorSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse flex sm:block">
      <div className="w-24 h-28 sm:w-auto sm:h-auto sm:aspect-[3/4] bg-gray-100 shrink-0" />
      <div className="p-4 space-y-2 flex-1">
        <div className="h-4 bg-gray-100 rounded w-3/4" />
        <div className="h-3 bg-gray-100 rounded w-1/2" />
        <div className="h-8 sm:h-3 bg-gray-100 rounded-lg sm:rounded w-1/3 mt-3" />
      </div>
    </div>
  );
}

export default function DoctorsSection({ lang }: DoctorsSectionProps) {
  const t = getT(lang);
  const { doctors, loaded } = useSiteData();
  // Prefer doctors with photos on the homepage so the section doesn't look empty
  const displayed = [...doctors]
    .sort((a, b) => Number(Boolean(b.photo)) - Number(Boolean(a.photo)))
    .slice(0, 4);

  return (
    <section id="doctors" className="py-20 bg-white">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="text-center mb-12">
          <span className="inline-block bg-blue-50 text-blue-600 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            {t.doctors.badge}
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 text-balance">{t.doctors.title}</h2>
          <p className="text-gray-500 max-w-xl mx-auto">{t.doctors.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {!loaded
            ? Array.from({ length: 4 }).map((_, i) => <DoctorSkeleton key={i} />)
            : displayed.map((doctor) => (
              <Link
                key={doctor.id}
                href={cmsHref(lang, 'doctors', doctor.slug)}
                className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl sm:hover:-translate-y-1 transition-all duration-300 flex sm:block"
              >
                {/* Photo */}
                <div className="w-24 h-32 sm:w-auto sm:h-auto sm:aspect-[3/4] bg-gradient-to-br from-blue-50 to-blue-100 relative overflow-hidden shrink-0">
                  {doctor.photo ? (
                    <Image
                      src={doctorPhotoThumb(doctor.photo)}
                      alt={lang === 'ru' ? doctor.nameRu : doctor.nameUz}
                      fill
                      className="object-cover object-top"
                      sizes="(max-width: 640px) 96px, 25vw"
                      unoptimized
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <User size={40} className="text-blue-200 sm:w-16 sm:h-16" />
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 hidden sm:block bg-gradient-to-t from-black/50 to-transparent p-4">
                    <span className="text-white text-xs font-medium bg-blue-600/80 px-3 py-1 rounded-full">
                      {t.doctors.experience}: {lang === 'ru' ? doctor.experienceRu : doctor.experienceUz}
                    </span>
                  </div>
                </div>
                {/* Info */}
                <div className="p-4 flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 mb-1 leading-tight text-sm sm:text-base">
                    {lang === 'ru' ? doctor.nameRu : doctor.nameUz}
                  </h3>
                  <p className="text-blue-600 text-sm mb-3 line-clamp-2">
                    {lang === 'ru' ? doctor.specialtyRu : doctor.specialtyUz}
                  </p>
                  <p className="text-gray-400 text-xs mb-3 sm:hidden">
                    {t.doctors.experience}: {lang === 'ru' ? doctor.experienceRu : doctor.experienceUz}
                  </p>
                  <div className="w-full py-2 sm:py-2.5 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium group-hover:bg-blue-600 group-hover:text-white transition-colors flex items-center justify-center gap-1">
                    {t.common.learnMore}
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))
          }
        </div>

        {loaded && doctors.length === 0 && (
          <p className="text-center text-gray-400 py-8">
            {lang === 'ru' ? 'Врачи скоро появятся' : "Shifokorlar tez orada qo'shiladi"}
          </p>
        )}

        {loaded && doctors.length > 0 && (
          <div className="text-center mt-8">
            <Link
              href={`/${lang}/doctors`}
              className="inline-flex items-center gap-2 border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-xl font-medium hover:bg-blue-600 hover:text-white transition-colors"
            >
              {t.doctors.viewAll}
              <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
