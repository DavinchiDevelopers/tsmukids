'use client';

import Link from 'next/link';
import { ArrowLeft, ArrowRight, User } from 'lucide-react';
import Image from 'next/image';
import { Lang } from '@/types';
import { getT } from '@/i18n';
import { useSiteData } from '@/contexts/SiteDataContext';
import AppointmentButton from '@/components/ui/AppointmentButton';
import DeptIcon from '@/components/ui/DeptIcon';
import PageBackButton from '@/components/ui/PageBackButton';
import { getDoctorsForDepartment } from '@/lib/departmentDoctors';
import { doctorPhotoThumb } from '@/lib/doctorPhoto';
import { cmsHref } from '@/lib/cmsPath';

interface Props {
  lang: string;
  slug: string;
}

export default function DepartmentPageClient({ lang: langStr, slug }: Props) {
  const lang = langStr as Lang;
  const t = getT(lang);
  const { departments, doctors, loaded, refreshing } = useSiteData();

  const dept = departments.find(d => d.slug === slug);

  if (!dept && (!loaded || refreshing)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">{lang === 'ru' ? 'Загрузка...' : 'Yuklanmoqda...'}</p>
        </div>
      </div>
    );
  }

  if (!dept && loaded && !refreshing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {lang === 'ru' ? 'Отделение не найдено' : "Bo'lim topilmadi"}
          </h1>
          <p className="text-gray-500 mb-6">
            {lang === 'ru'
              ? 'Проверьте ссылку или вернитесь к списку отделений.'
              : "Havolani tekshiring yoki bo'limlar ro'yxatiga qayting."}
          </p>
          <Link
            href={`/${lang}/departments`}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft size={16} />
            {lang === 'ru' ? 'К отделениям' : "Bo'limlar ro'yxatiga"}
          </Link>
        </div>
      </div>
    );
  }

  const currentDept = dept as NonNullable<typeof dept>;
  const deptDoctors = getDoctorsForDepartment(currentDept, doctors);
  const diseases = lang === 'ru' ? currentDept.diseasesRu : currentDept.diseasesUz;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-blue-900 to-blue-950 text-white py-12 relative overflow-hidden">
        {currentDept.image && (
          <>
            <Image
              src={currentDept.image}
              alt={lang === 'ru' ? currentDept.nameRu : currentDept.nameUz}
              fill
              className="object-cover opacity-25"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 to-blue-950/90" />
          </>
        )}
        <div className="container mx-auto px-3 sm:px-4 relative z-10">
          <PageBackButton href={`/${lang}/departments`} label={t.common.backToDepartments} className="mb-6" />
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5 relative z-10">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-800/50 rounded-2xl flex items-center justify-center shrink-0">
              <DeptIcon name={currentDept.icon} size={32} className="text-blue-300" />
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold mb-1 text-balance">
                {lang === 'ru' ? currentDept.nameRu : currentDept.nameUz}
              </h1>
              <p className="text-blue-200 text-sm sm:text-base text-pretty">
                {lang === 'ru' ? currentDept.descriptionRu : currentDept.descriptionUz}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-3 sm:px-4 py-12 space-y-8">
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {lang === 'ru' ? 'Об отделении' : "Bo'lim haqida"}
          </h2>
          <p className="text-gray-600 leading-relaxed">
            {lang === 'ru' ? currentDept.descriptionRu : currentDept.descriptionUz}
          </p>

          {(currentDept.beds || currentDept.hasEmergency !== undefined) && (
            <div className="grid sm:grid-cols-2 gap-3 mt-5">
              {currentDept.beds ? (
                <div className="rounded-xl bg-blue-50 px-4 py-3">
                  <p className="text-xs text-blue-500 uppercase tracking-wide mb-1">
                    {lang === 'ru' ? 'Койко-места' : "O'rinlar soni"}
                  </p>
                  <p className="text-lg font-semibold text-blue-900">{currentDept.beds}</p>
                </div>
              ) : null}
              {currentDept.hasEmergency !== undefined ? (
                <div className="rounded-xl bg-blue-50 px-4 py-3">
                  <p className="text-xs text-blue-500 uppercase tracking-wide mb-1">
                    {lang === 'ru' ? 'Неотложная помощь' : 'Shoshilinch yordam'}
                  </p>
                  <p className="text-sm font-semibold text-blue-900">
                    {currentDept.hasEmergency
                      ? (lang === 'ru' ? 'Доступна' : 'Mavjud')
                      : (lang === 'ru' ? 'Нет' : "Yo'q")}
                  </p>
                </div>
              ) : null}
            </div>
          )}
        </div>

        {diseases && diseases.length > 0 && (
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {lang === 'ru' ? 'Что лечим' : 'Davolash yo\'nalishlari'}
            </h2>
            <div className="flex flex-wrap gap-2">
              {diseases.map((item, i) => (
                <span key={`${item}-${i}`} className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm">
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Doctors */}
        {deptDoctors.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-5">{t.departmentPage.ourDoctors}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {deptDoctors.map(doctor => (
                <Link
                  key={doctor.slug}
                  href={cmsHref(lang, 'doctors', doctor.slug)}
                  className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl sm:hover:-translate-y-1 transition-all duration-300 flex sm:block"
                >
                  <div className="w-24 h-32 sm:w-auto sm:h-auto sm:aspect-[3/4] bg-gradient-to-br from-blue-50 to-blue-100 relative overflow-hidden shrink-0">
                    {doctor.photo ? (
                      <Image
                        src={doctorPhotoThumb(doctor.photo)}
                        alt={lang === 'ru' ? doctor.nameRu : doctor.nameUz}
                        fill
                        className="object-cover object-top group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 96px, 25vw"
                        loading="lazy"
                        unoptimized
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <User size={40} className="text-blue-200 sm:w-14 sm:h-14" />
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 hidden sm:block bg-gradient-to-t from-black/55 to-transparent p-4">
                      <span className="text-white text-xs font-medium bg-blue-600/85 px-3 py-1 rounded-full">
                        {t.doctors.experience}: {lang === 'ru' ? doctor.experienceRu : doctor.experienceUz}
                      </span>
                    </div>
                  </div>
                  <div className="p-4 sm:p-5 flex-1 min-w-0">
                    <p className="font-bold text-gray-900 mb-1 leading-tight text-sm sm:text-base">
                      {lang === 'ru' ? doctor.nameRu : doctor.nameUz}
                    </p>
                    <p className="text-blue-600 text-sm mb-3 line-clamp-2">
                      {lang === 'ru' ? doctor.specialtyRu : doctor.specialtyUz}
                    </p>
                    <p className="text-gray-400 text-xs mb-3 sm:hidden">
                      {t.doctors.experience}: {lang === 'ru' ? doctor.experienceRu : doctor.experienceUz}
                    </p>
                    <div className="w-full py-2 sm:py-2.5 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium group-hover:bg-blue-600 group-hover:text-white transition-colors flex items-center justify-center gap-1">
                      {lang === 'ru' ? 'Выбрать врача' : 'Shifokorni tanlash'}
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-2">{t.cta.title}</h3>
          <p className="text-blue-100 mb-6">{t.cta.subtitle}</p>
          <AppointmentButton
            label={t.common.makeAppointment}
            className="inline-flex items-center gap-2 bg-white text-blue-700 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors"
          />
        </div>
      </div>
    </div>
  );
}
