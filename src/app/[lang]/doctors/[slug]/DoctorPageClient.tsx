'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { User, ArrowLeft, Briefcase } from 'lucide-react';
import { Lang } from '@/types';
import { getT } from '@/i18n';
import { useSiteData } from '@/contexts/SiteDataContext';
import AppointmentButton from '@/components/ui/AppointmentButton';
import PageBackButton from '@/components/ui/PageBackButton';
import { doctors as staticDoctors } from '@/data/doctors';
import { departments as staticDepartments } from '@/data/departments';

interface Props {
  lang: string;
  slug: string;
}

const DOCTOR_SLUG_ALIASES: Record<string, string[]> = {
  'yusupov-otabek': ['yusupov-otabek', 'rahimov-bobur', 'yusupova-malika'],
  'rashidov-bobur': ['rashidov-bobur', 'rahimov-bobur'],
  'hasanova-nilufar': ['hasanova-nilufar', 'yusupova-malika'],
  'karimova-zulayho': ['karimova-zulayho', 'karimov-sardor'],
};

const normalizeSlug = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/_/g, '-')
    .replace(/\s+/g, '-');

export default function DoctorPageClient({ lang: langStr, slug }: Props) {
  const lang = langStr as Lang;
  const t = getT(lang);
  const router = useRouter();
  const pathname = usePathname();
  const { doctors, departments, settings, loaded, refreshing } = useSiteData();

  const candidates = DOCTOR_SLUG_ALIASES[slug] ?? [slug];
  const normalizedCandidates = candidates.map(normalizeSlug);
  const doctor =
    doctors.find(d => normalizedCandidates.includes(normalizeSlug(d.slug)))
    ?? staticDoctors.find(d => normalizedCandidates.includes(normalizeSlug(d.slug)));
  const dept = doctor
    ? departments.find(d => d.slug === doctor.department) ?? staticDepartments.find(d => d.slug === doctor.department)
    : undefined;
  const resolvedSlug = doctor?.slug ?? candidates[0];

  const phoneHref = `tel:${settings.phone1.replace(/\s/g, '')}`;

  useEffect(() => {
    if (!loaded || refreshing || !doctor || slug === resolvedSlug) return;
    const targetPath = `/${lang}/doctors/${resolvedSlug}`;
    if (pathname !== targetPath) {
      router.replace(targetPath);
    }
  }, [doctor, lang, loaded, pathname, resolvedSlug, router, slug]);

  if (!doctor && (!loaded || refreshing)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">{lang === 'ru' ? 'Загрузка...' : 'Yuklanmoqda...'}</p>
        </div>
      </div>
    );
  }

  if (!doctor && loaded && !refreshing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {lang === 'ru' ? 'Врач не найден' : 'Shifokor topilmadi'}
          </h1>
          <p className="text-gray-500 mb-6">
            {lang === 'ru'
              ? 'Проверьте ссылку или вернитесь к списку врачей.'
              : "Havolani tekshiring yoki shifokorlar ro'yxatiga qayting."}
          </p>
          <Link
            href={`/${lang}/doctors`}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft size={16} />
            {lang === 'ru' ? 'К списку врачей' : "Shifokorlar ro'yxatiga"}
          </Link>
        </div>
      </div>
    );
  }

  const currentDoctor = doctor as NonNullable<typeof doctor>;
  const details = currentDoctor as {
    educationRu?: string;
    educationUz?: string;
    workExperienceRu?: string;
    workExperienceUz?: string;
    additionalInfoRu?: string;
    additionalInfoUz?: string;
  };
  const education = lang === 'ru' ? details.educationRu : details.educationUz;
  const workExperience = lang === 'ru' ? details.workExperienceRu : details.workExperienceUz;
  const additionalInfo = lang === 'ru' ? details.additionalInfoRu : details.additionalInfoUz;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-blue-900 to-blue-950 text-white py-12">
        <div className="container mx-auto px-3 sm:px-4">
          <PageBackButton href={`/${lang}/doctors`} label={t.common.backToDoctors} className="mb-6" />
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="relative w-32 h-32 md:w-48 md:h-48 bg-blue-800/50 rounded-2xl overflow-hidden shrink-0">
              {currentDoctor.photo ? (
                <Image
                  src={currentDoctor.photo}
                  alt={lang === 'ru' ? currentDoctor.nameRu : currentDoctor.nameUz}
                  fill
                  className="object-cover object-top"
                  unoptimized
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <User size={64} className="text-blue-300" />
                </div>
              )}
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-balance">
                {lang === 'ru' ? currentDoctor.nameRu : currentDoctor.nameUz}
              </h1>
              <p className="text-blue-300 text-lg mb-3">
                {lang === 'ru' ? currentDoctor.specialtyRu : currentDoctor.specialtyUz}
              </p>
              <div className="flex flex-wrap gap-4 text-sm">
                <span className="flex items-center gap-1 text-blue-200">
                  <Briefcase size={14} />
                  {t.doctorPage.experience}: {lang === 'ru' ? currentDoctor.experienceRu : currentDoctor.experienceUz}
                </span>
                {dept && (
                  <span className="flex items-center gap-1 text-blue-200">
                    {t.doctorPage.department}: {lang === 'ru' ? dept.nameRu : dept.nameUz}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-3 sm:px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">{lang === 'ru' ? 'О враче' : 'Shifokor haqida'}</h2>
              <p className="text-gray-600 leading-relaxed">
                {lang === 'ru' ? currentDoctor.bioRu : currentDoctor.bioUz}
              </p>
            </div>

            {education && (
              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  {lang === 'ru' ? 'Образование' : "Ta'lim"}
                </h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">{education}</p>
              </div>
            )}

            {workExperience && (
              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  {lang === 'ru' ? 'Опыт и практика' : 'Tajriba va amaliyot'}
                </h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">{workExperience}</p>
              </div>
            )}

            {currentDoctor.services && currentDoctor.services.length > 0 && (
              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  {lang === 'ru' ? 'Прием и услуги врача' : 'Qabul va shifokor xizmatlari'}
                </h2>
                <ul className="space-y-2">
                  {currentDoctor.services.map((service, i) => (
                    <li key={`${service}-${i}`} className="flex items-start gap-2 text-gray-700 text-sm">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                      <span>{service}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {additionalInfo && (
              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  {lang === 'ru' ? 'Дополнительная информация' : "Qo'shimcha ma'lumot"}
                </h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">{additionalInfo}</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div>
            <div className="bg-white rounded-2xl p-6 border border-gray-100 lg:sticky lg:top-24">
              <h3 className="font-bold text-gray-900 mb-4">{t.doctorPage.makeAppointment}</h3>
              <AppointmentButton label={t.common.makeAppointment} />
              <a
                href={phoneHref}
                className="mt-3 w-full border border-gray-200 text-gray-700 py-3 rounded-xl font-medium hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center gap-2 text-sm"
              >
                {lang === 'ru' ? 'Позвонить' : 'Qo\'ng\'iroq qilish'}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
