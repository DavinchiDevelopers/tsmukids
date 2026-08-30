'use client';

import { use } from 'react';
import Link from 'next/link';
import { Briefcase, ExternalLink, Mail } from 'lucide-react';
import { Lang } from '@/types';
import { getT } from '@/i18n';
import { formatRate, formatSalary, getPublishedVacancies } from '@/data/vacancies';
import { useSiteData } from '@/contexts/SiteDataContext';
import PageBackButton from '@/components/ui/PageBackButton';

export default function VacanciesPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: langStr } = use(params);
  const lang = langStr as Lang;
  const t = getT(lang);
  const { settings } = useSiteData();
  const items = getPublishedVacancies();
  const mail = settings.email || 'info@tsmukids.uz';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-blue-900 to-blue-950 text-white py-16">
        <div className="container mx-auto px-3 sm:px-4">
          <PageBackButton href={`/${lang}`} label={t.common.backToHome} className="mb-6 text-blue-100 hover:text-white" />
          <h1 className="text-3xl sm:text-4xl font-bold mb-3 text-balance">{t.vacancies.title}</h1>
          <p className="text-blue-200 max-w-2xl">{t.vacancies.subtitle}</p>
        </div>
      </div>

      <div className="container mx-auto px-3 sm:px-4 py-10">
        {items.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-8 sm:p-12 text-center max-w-2xl mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
              <Briefcase size={28} />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">{t.vacancies.emptyTitle}</h2>
            <p className="text-gray-500 mb-6">{t.vacancies.emptyText}</p>
            <a
              href={`mailto:${mail}?subject=${encodeURIComponent(lang === 'ru' ? 'Отклик на вакансию' : 'Vakansiyaga ariza')}`}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              <Mail size={16} />
              {t.vacancies.writeUs}
            </a>
          </div>
        ) : (
          <div className="grid gap-4 max-w-3xl mx-auto">
            {items.map(item => {
              const title = lang === 'ru' ? item.titleRu : item.titleUz;
              const dept = lang === 'ru' ? item.departmentRu : item.departmentUz;
              const href = item.url || `mailto:${mail}?subject=${encodeURIComponent(`${lang === 'ru' ? 'Вакансия' : 'Vakansiya'}: ${title}`)}`;
              const external = Boolean(item.url && /^https?:\/\//i.test(item.url));
              const scheduleLabel =
                item.schedule === 'duty'
                  ? t.vacancies.scheduleDuty
                  : item.schedule === 'day'
                    ? t.vacancies.scheduleDay
                    : null;

              return (
                <article
                  key={item.id}
                  className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 hover:border-blue-100 hover:shadow-sm transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="min-w-0">
                      {dept && <p className="text-xs font-medium text-blue-600 mb-1">{dept}</p>}
                      <h2 className="text-lg font-semibold text-gray-900 mb-3">{title}</h2>
                      <dl className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-gray-600">
                        {scheduleLabel && (
                          <div>
                            <dt className="text-xs text-gray-400">{t.vacancies.schedule}</dt>
                            <dd className="font-medium text-gray-800">{scheduleLabel}</dd>
                          </div>
                        )}
                        {item.rate != null && (
                          <div>
                            <dt className="text-xs text-gray-400">{t.vacancies.rate}</dt>
                            <dd className="font-medium text-gray-800">{formatRate(item.rate)}</dd>
                          </div>
                        )}
                        {item.salary != null && (
                          <div>
                            <dt className="text-xs text-gray-400">{t.vacancies.salary}</dt>
                            <dd className="font-medium text-gray-800">{formatSalary(item.salary, lang)}</dd>
                          </div>
                        )}
                      </dl>
                    </div>
                    <a
                      href={href}
                      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      className="inline-flex items-center justify-center gap-2 shrink-0 bg-blue-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      {t.vacancies.apply}
                      {external ? <ExternalLink size={14} /> : <Mail size={14} />}
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        <p className="text-center text-sm text-gray-400 mt-10">
          <Link href={`/${lang}/contacts`} className="text-blue-600 hover:underline">
            {t.nav.contacts}
          </Link>
        </p>
      </div>
    </div>
  );
}
