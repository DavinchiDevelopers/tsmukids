'use client';

import { useState, use } from 'react';
import { Lang } from '@/types';
import { getT } from '@/i18n';
import { useSiteData } from '@/contexts/SiteDataContext';
import clsx from 'clsx';
import PageBackButton from '@/components/ui/PageBackButton';

const categories = ['all', 'analyses', 'diagnostics', 'consultations', 'surgery', 'procedures'] as const;

export default function PricesPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: langStr } = use(params);
  const lang = langStr as Lang;
  const t = getT(lang);
  const { services } = useSiteData();
  const [active, setActive] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = services.filter(s => {
    const matchCat = active === 'all' || s.category === active;
    const name = lang === 'ru' ? s.nameRu : s.nameUz;
    return matchCat && name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-blue-900 to-blue-950 text-white py-16">
        <div className="container mx-auto px-3 sm:px-4">
          <PageBackButton href={`/${lang}`} label={t.common.backToHome} className="mb-6" />
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-bold mb-3 text-balance px-1">{t.prices.title}</h1>
            <p className="text-blue-200">{t.prices.subtitle}</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <div className="max-w-md mx-auto mb-6">
          <input
            type="text"
            placeholder={t.common.search}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm"
          />
        </div>

        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={clsx(
                'px-4 py-2 rounded-full text-sm font-medium transition-all',
                active === cat ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300'
              )}
            >
              {t.prices.categories[cat]}
            </button>
          ))}
        </div>

        <div className="max-w-3xl mx-auto bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
          <div className="hidden sm:grid grid-cols-[1fr_auto] bg-gray-50 px-4 sm:px-6 py-3 border-b border-gray-100 gap-4">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              {lang === 'ru' ? 'Услуга' : 'Xizmat'}
            </span>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide text-right">
              {lang === 'ru' ? 'Цена' : 'Narx'}
            </span>
          </div>
          {filtered.map((service, i) => (
            <div
              key={service.slug}
              className={clsx(
                'flex flex-col gap-1 sm:grid sm:grid-cols-[1fr_auto] sm:items-center px-3 sm:px-6 py-3 sm:py-4 hover:bg-blue-50 transition-colors sm:gap-4',
                i > 0 && 'border-t border-gray-50'
              )}
            >
              <span className="text-gray-800 text-sm min-w-0">
                {lang === 'ru' ? service.nameRu : service.nameUz}
              </span>
              {service.price != null ? (
                <span className="text-blue-600 font-semibold text-sm whitespace-nowrap shrink-0 sm:text-right">
                  {t.common.from} {service.price.toLocaleString('ru-RU')} {t.common.currency}
                </span>
              ) : (
                <span className="text-gray-400 text-sm italic whitespace-nowrap shrink-0">
                  {lang === 'ru' ? 'По запросу' : 'So\'rov bo\'yicha'}
                </span>
              )}
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              {lang === 'ru' ? 'Ничего не найдено' : 'Hech narsa topilmadi'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
