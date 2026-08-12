'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Lang } from '@/types';
import { getT } from '@/i18n';
import { useSiteData } from '@/contexts/SiteDataContext';
import clsx from 'clsx';
import PageBackButton from '@/components/ui/PageBackButton';

const categories = ['all', 'analyses', 'diagnostics', 'consultations', 'surgery', 'procedures'] as const;

export default function ServicesPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: langStr } = use(params);
  const lang = langStr as Lang;
  const t = getT(lang);
  const { services } = useSiteData();
  const [active, setActive] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = services.filter(s => {
    const matchCat = active === 'all' || s.category === active;
    const name = lang === 'ru' ? s.nameRu : s.nameUz;
    const matchSearch = name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-blue-900 to-blue-950 text-white py-16">
        <div className="container mx-auto px-3 sm:px-4">
          <PageBackButton href={`/${lang}`} label={t.common.backToHome} className="mb-6" />
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-bold mb-3 text-balance px-1">{t.services.title}</h1>
            <p className="text-blue-200">{t.services.subtitle}</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        {/* Search */}
        <div className="max-w-md mx-auto mb-6">
          <input
            type="text"
            placeholder={t.common.search}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm"
          />
        </div>

        {/* Filters */}
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
              {t.services.categories[cat]}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(service => (
            <Link
              key={service.slug}
              href={`/${lang}/services/${service.slug}`}
              className="group bg-white rounded-xl p-5 border border-gray-100 hover:shadow-lg hover:border-blue-100 transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors text-sm">
                    {lang === 'ru' ? service.nameRu : service.nameUz}
                  </h3>
                  <p className="text-xs text-gray-400 line-clamp-2">
                    {lang === 'ru' ? service.descriptionRu : service.descriptionUz}
                  </p>
                </div>
                <ArrowRight size={16} className="text-gray-300 group-hover:text-blue-500 shrink-0 mt-0.5 transition-colors" />
              </div>
              <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between">
                {service.price != null ? (
                  <span className="text-blue-600 font-semibold text-sm">
                    {t.common.from} {service.price.toLocaleString('ru-RU')} {t.common.currency}
                  </span>
                ) : (
                  <span className="text-gray-400 text-sm italic">
                    {lang === 'ru' ? 'Цена по запросу' : 'Narx so\'rov bo\'yicha'}
                  </span>
                )}
                {service.durationRu && (
                  <span className="text-xs text-gray-400">{lang === 'ru' ? service.durationRu : service.durationUz}</span>
                )}
              </div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-lg">{lang === 'ru' ? 'Ничего не найдено' : 'Hech narsa topilmadi'}</p>
          </div>
        )}
      </div>
    </div>
  );
}
