'use client';

import Link from 'next/link';
import { ArrowLeft, User } from 'lucide-react';
import Image from 'next/image';
import { Lang } from '@/types';
import { getT } from '@/i18n';
import { useSiteData } from '@/contexts/SiteDataContext';
import AppointmentButton from '@/components/ui/AppointmentButton';
import DeptIcon from '@/components/ui/DeptIcon';

interface Props {
  lang: string;
  slug: string;
}

export default function DepartmentPageClient({ lang: langStr, slug }: Props) {
  const lang = langStr as Lang;
  const t = getT(lang);
  const { departments, doctors, loaded } = useSiteData();

  const dept = departments.find(d => d.slug === slug);

  if (!dept && !loaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">{lang === 'ru' ? 'Загрузка...' : 'Yuklanmoqda...'}</p>
        </div>
      </div>
    );
  }

  if (!dept && loaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {lang === 'ru' ? 'Направление не найдено' : "Yo'nalish topilmadi"}
          </h1>
          <p className="text-gray-500 mb-6">
            {lang === 'ru'
              ? 'Проверьте ссылку или вернитесь к списку направлений.'
              : "Havolani tekshiring yoki yo'nalishlar ro'yxatiga qayting."}
          </p>
          <Link
            href={`/${lang}/departments`}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft size={16} />
            {lang === 'ru' ? 'К направлениям' : "Yo'nalishlar ro'yxatiga"}
          </Link>
        </div>
      </div>
    );
  }

  const currentDept = dept as NonNullable<typeof dept>;
  const deptDoctors = doctors.filter(d => d.department === currentDept.slug);
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
        <div className="container mx-auto px-3 sm:px-4">
          <Link href={`/${lang}/departments`} className="inline-flex items-center gap-2 text-blue-300 hover:text-white transition-colors text-sm mb-6">
            <ArrowLeft size={16} />
            {lang === 'ru' ? 'Назад к направлениям' : 'Yo\'nalishlarga qaytish'}
          </Link>
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
            {lang === 'ru' ? 'О направлении' : "Yo'nalish haqida"}
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
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {deptDoctors.map(doctor => (
                <Link
                  key={doctor.slug}
                  href={`/${lang}/doctors/${doctor.slug}`}
                  className="group bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-lg transition-all flex items-center gap-4"
                >
                  <div className="w-16 h-16 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                    <User size={28} className="text-blue-300" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">
                      {lang === 'ru' ? doctor.nameRu : doctor.nameUz}
                    </p>
                    <p className="text-blue-600 text-xs mt-0.5">
                      {lang === 'ru' ? doctor.specialtyRu : doctor.specialtyUz}
                    </p>
                    <p className="text-gray-400 text-xs mt-1">
                      {t.doctors.experience}: {lang === 'ru' ? doctor.experienceRu : doctor.experienceUz}
                    </p>
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
