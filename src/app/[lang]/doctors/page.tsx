'use client';

import { use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { User, ArrowRight } from 'lucide-react';
import { Lang } from '@/types';
import { getT } from '@/i18n';
import { useSiteData } from '@/contexts/SiteDataContext';
import PageBackButton from '@/components/ui/PageBackButton';
import { doctorPhotoThumb } from '@/lib/doctorPhoto';
import { cmsHref } from '@/lib/cmsPath';

function DoctorSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse flex sm:block">
      <div className="w-24 h-28 sm:w-auto sm:h-auto sm:aspect-[3/4] bg-gray-100 shrink-0" />
      <div className="p-4 sm:p-5 space-y-2 flex-1">
        <div className="h-4 bg-gray-100 rounded w-3/4" />
        <div className="h-3 bg-gray-100 rounded w-1/2" />
        <div className="h-8 sm:h-9 bg-gray-100 rounded-lg mt-3" />
      </div>
    </div>
  );
}

export default function DoctorsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: langStr } = use(params);
  const lang = langStr as Lang;
  const t = getT(lang);
  const { doctors, loaded } = useSiteData();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-900 to-blue-950 text-white py-16">
        <div className="container mx-auto px-3 sm:px-4">
          <PageBackButton href={`/${lang}`} label={t.common.backToHome} className="mb-6" />
          <div className="text-center">
            <span className="inline-block bg-blue-800/50 text-blue-300 text-sm px-4 py-1.5 rounded-full mb-4">
              {t.doctors.badge}
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold mb-3 text-balance px-1">{t.doctors.title}</h1>
            <p className="text-blue-200">{t.doctors.subtitle}</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-3 sm:px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {!loaded
            ? Array.from({ length: 8 }).map((_, i) => <DoctorSkeleton key={i} />)
            : doctors.map((doctor) => (
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
                      className="object-cover object-top group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 96px, (max-width: 1024px) 33vw, 25vw"
                      loading="lazy"
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
                <div className="p-4 sm:p-5 flex-1 min-w-0">
                  <h2 className="font-bold text-gray-900 mb-1 leading-tight text-sm sm:text-base">
                    {lang === 'ru' ? doctor.nameRu : doctor.nameUz}
                  </h2>
                  <p className="text-blue-600 text-sm mb-3 line-clamp-2">
                    {lang === 'ru' ? doctor.specialtyRu : doctor.specialtyUz}
                  </p>
                  <p className="text-gray-400 text-xs mb-3 sm:hidden">
                    {t.doctors.experience}: {lang === 'ru' ? doctor.experienceRu : doctor.experienceUz}
                  </p>
                  <div className="w-full py-2 sm:py-2.5 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium group-hover:bg-blue-600 group-hover:text-white transition-colors flex items-center justify-center gap-1">
                    {t.common.learnMore}
                    <ArrowRight size={14} />
                  </div>
                </div>
              </Link>
            ))
          }
        </div>

        {loaded && doctors.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <User size={48} className="mx-auto mb-4 opacity-30" />
            <p>{lang === 'ru' ? 'Врачи скоро появятся' : "Shifokorlar tez orada qo'shiladi"}</p>
          </div>
        )}
      </div>
    </div>
  );
}
