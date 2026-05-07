'use client';

import Link from 'next/link';
import { ArrowLeft, Clock } from 'lucide-react';
import { Lang } from '@/types';
import { getT } from '@/i18n';
import { useSiteData } from '@/contexts/SiteDataContext';
import AppointmentButton from '@/components/ui/AppointmentButton';

interface Props {
  lang: string;
  slug: string;
}

export default function ServicePageClient({ lang: langStr, slug }: Props) {
  const lang = langStr as Lang;
  const t = getT(lang);
  const { services, settings, loaded } = useSiteData();

  const service = services.find(s => s.slug === slug);

  const phoneHref = `tel:${settings.phone1.replace(/\s/g, '')}`;

  if (!loaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">{lang === 'ru' ? 'Загрузка...' : 'Yuklanmoqda...'}</p>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {lang === 'ru' ? 'Услуга не найдена' : 'Xizmat topilmadi'}
          </h1>
          <Link
            href={`/${lang}/services`}
            className="inline-flex items-center gap-2 text-blue-600 hover:underline mt-4"
          >
            <ArrowLeft size={16} />
            {lang === 'ru' ? 'К списку услуг' : "Ro'yxatga qaytish"}
          </Link>
        </div>
      </div>
    );
  }

  const relatedServices = services
    .filter(s => s.category === service.category && s.slug !== service.slug)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-blue-900 to-blue-950 text-white py-12">
        <div className="container mx-auto px-4">
          <Link href={`/${lang}/services`} className="inline-flex items-center gap-2 text-blue-300 hover:text-white text-sm mb-6 transition-colors">
            <ArrowLeft size={16} />
            {lang === 'ru' ? 'Назад к услугам' : 'Xizmatlarga qaytish'}
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-balance">
            {lang === 'ru' ? service.nameRu : service.nameUz}
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {lang === 'ru' ? 'Описание' : 'Tavsif'}
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {lang === 'ru' ? service.descriptionRu : service.descriptionUz}
              </p>

              {service.durationRu && (
                <div className="mt-5 flex items-center gap-3 text-gray-600">
                  <Clock size={18} className="text-blue-500" />
                  <span className="text-sm">
                    {t.servicePage.duration}: <strong>{lang === 'ru' ? service.durationRu : service.durationUz}</strong>
                  </span>
                </div>
              )}
            </div>

            {relatedServices.length > 0 && (
              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  {lang === 'ru' ? 'Похожие услуги' : 'O\'xshash xizmatlar'}
                </h2>
                <div className="space-y-3">
                  {relatedServices.map(s => (
                    <Link
                      key={s.slug}
                      href={`/${lang}/services/${s.slug}`}
                      className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between py-3 border-b border-gray-50 hover:text-blue-600 transition-colors group"
                    >
                      <span className="text-sm text-gray-700 group-hover:text-blue-600 min-w-0">
                        {lang === 'ru' ? s.nameRu : s.nameUz}
                      </span>
                      {s.price != null ? (
                        <span className="text-blue-600 font-semibold text-sm whitespace-nowrap shrink-0 sm:text-right">
                          {t.common.from} {s.price.toLocaleString('ru-RU')} {t.common.currency}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-sm italic whitespace-nowrap shrink-0">
                          {lang === 'ru' ? 'По запросу' : 'So\'rov bo\'yicha'}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div>
            <div className="bg-white rounded-2xl p-6 border border-gray-100 lg:sticky lg:top-24">
              <div className="mb-5 pb-5 border-b border-gray-100">
                <p className="text-sm text-gray-500 mb-1">{t.servicePage.price}</p>
                {service.price != null ? (
                  <p className="text-3xl font-bold text-blue-600">
                    {service.price.toLocaleString('ru-RU')}
                    <span className="text-lg font-medium text-gray-500 ml-1">{t.common.currency}</span>
                  </p>
                ) : (
                  <p className="text-xl font-semibold text-gray-500 italic">
                    {lang === 'ru' ? 'По запросу' : 'So\'rov bo\'yicha'}
                  </p>
                )}
              </div>
              <AppointmentButton label={t.servicePage.makeAppointment} className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 mb-3" />
              <a
                href={phoneHref}
                className="w-full border border-gray-200 text-gray-700 py-3 rounded-xl font-medium hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center gap-2 text-sm"
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
