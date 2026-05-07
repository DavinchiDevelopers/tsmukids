'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Lang } from '@/types';
import { getT } from '@/i18n';
import { useSiteData } from '@/contexts/SiteDataContext';
import clsx from 'clsx';

interface PricesSectionProps {
  lang: Lang;
}

const categories = ['all', 'analyses', 'diagnostics', 'consultations', 'procedures'] as const;

export default function PricesSection({ lang }: PricesSectionProps) {
  const t = getT(lang);
  const { services } = useSiteData();
  const [active, setActive] = useState('all');

  const filtered = (active === 'all' ? services : services.filter(s => s.category === active))
    .filter(s => s.price != null)
    .slice(0, 10);

  return (
    <section id="prices" className="py-20 bg-white">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="text-center mb-10">
          <span className="inline-block bg-blue-50 text-blue-600 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            {t.prices.badge}
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 text-balance">{t.prices.title}</h2>
          <p className="text-gray-500">{t.prices.subtitle}</p>
        </div>

        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={clsx(
                'px-4 py-2 rounded-full text-sm font-medium transition-all',
                active === cat ? 'bg-blue-600 text-white' : 'bg-gray-50 text-gray-600 border border-gray-200 hover:border-blue-300'
              )}
            >
              {t.prices.categories[cat]}
            </button>
          ))}
        </div>

        <div className="max-w-3xl mx-auto bg-gray-50 rounded-2xl overflow-hidden border border-gray-100">
          {filtered.map((service, i) => (
            <div
              key={service.slug}
              className={clsx(
                'flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between px-3 sm:px-6 py-3 sm:py-4 hover:bg-blue-50 transition-colors',
                i > 0 && 'border-t border-gray-100'
              )}
            >
              <span className="text-gray-800 text-sm font-medium min-w-0 pr-0 sm:pr-3">
                {lang === 'ru' ? service.nameRu : service.nameUz}
              </span>
              <span className="text-blue-600 font-semibold text-sm whitespace-nowrap shrink-0 sm:text-right">
                {t.common.from} {service.price!.toLocaleString('ru-RU')} {t.common.currency}
              </span>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            href={`/${lang}/prices`}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
          >
            {t.prices.viewAll}
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
