'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Lang } from '@/types';
import { getT } from '@/i18n';
import { useSiteData } from '@/contexts/SiteDataContext';
import clsx from 'clsx';

interface ServicesSectionProps {
  lang: Lang;
}

const categories = ['all', 'analyses', 'diagnostics', 'consultations', 'procedures', 'surgery'] as const;

export default function ServicesSection({ lang }: ServicesSectionProps) {
  const t = getT(lang);
  const { services } = useSiteData();
  const [activeCategory, setActiveCategory] = useState('all');

  const filtered = activeCategory === 'all'
    ? services.slice(0, 12)
    : services.filter(s => s.category === activeCategory).slice(0, 12);

  const formatPrice = (price: number) =>
    price.toLocaleString('ru-RU') + ' ' + t.common.currency;

  return (
    <section id="services" className="py-20 bg-gray-50">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="text-center mb-10">
          <span className="inline-block bg-blue-50 text-blue-600 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            {t.services.badge}
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 text-balance">{t.services.title}</h2>
          <p className="text-gray-500">{t.services.subtitle}</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={clsx(
                'px-4 py-2 rounded-full text-sm font-medium transition-all',
                activeCategory === cat
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300'
              )}
            >
              {t.services.categories[cat]}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((service) => (
            <Link
              key={service.slug}
              href={`/${lang}/services/${service.slug}`}
              className="group bg-white rounded-xl p-5 border border-gray-100 hover:shadow-lg hover:border-blue-100 transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                    {lang === 'ru' ? service.nameRu : service.nameUz}
                  </h3>
                  <p className="text-xs text-gray-400 line-clamp-2">
                    {lang === 'ru' ? service.descriptionRu : service.descriptionUz}
                  </p>
                </div>
                <ArrowRight size={16} className="text-gray-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
              </div>
              <div className="mt-3 pt-3 border-t border-gray-50">
                {service.price != null ? (
                  <span className="text-blue-600 font-semibold text-sm">
                    {t.common.from} {formatPrice(service.price)}
                  </span>
                ) : (
                  <span className="text-gray-400 text-sm italic">
                    {lang === 'ru' ? 'Цена по запросу' : 'Narx so\'rov bo\'yicha'}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            href={`/${lang}/services`}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
          >
            {t.services.viewAll}
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
