'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Image as ImageIcon } from 'lucide-react';
import { Lang } from '@/types';
import { getT } from '@/i18n';
import clsx from 'clsx';
import { useSiteData } from '@/contexts/SiteDataContext';

interface GallerySectionProps {
  lang: Lang;
}

const colors = [
  'from-blue-100 to-blue-200',
  'from-indigo-100 to-indigo-200',
  'from-sky-100 to-sky-200',
  'from-blue-50 to-blue-150',
  'from-slate-100 to-slate-200',
  'from-cyan-100 to-cyan-200',
];

const categories = ['all', 'clinic', 'rooms', 'equipment', 'team'] as const;

export default function GallerySection({ lang }: GallerySectionProps) {
  const t = getT(lang);
  const [active, setActive] = useState('all');
  const { gallery, loaded } = useSiteData();
  const displayed = gallery.slice(0, 6);

  const filtered = active === 'all' ? displayed : displayed.filter(i => i.category === active);

  return (
    <section id="gallery" className="py-20 bg-gray-50">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="text-center mb-10">
          <span className="inline-block bg-blue-50 text-blue-600 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            {t.gallery.badge}
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-balance">{t.gallery.title}</h2>

          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={clsx(
                  'px-4 py-2 rounded-full text-sm font-medium transition-all',
                  active === cat ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300'
                )}
              >
                {t.gallery.categories[cat]}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {!loaded ? Array.from({ length: 6 }).map((_, i) => (
            <div
              key={`skeleton-${i}`}
              className={`aspect-video bg-gradient-to-br ${colors[i % colors.length]} rounded-2xl animate-pulse`}
            />
          )) : filtered.map((item, i) => (
            <div
              key={item.id}
              className={`aspect-video bg-gradient-to-br ${colors[i % colors.length]} rounded-2xl flex items-center justify-center relative overflow-hidden group cursor-pointer`}
            >
              {item.image ? (
                <Image
                  src={item.image}
                  alt={lang === 'ru' ? item.titleRu : item.titleUz}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <ImageIcon size={40} className="text-white/40" />
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-white text-sm font-medium">{lang === 'ru' ? item.titleRu : item.titleUz}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            href={`/${lang}/gallery`}
            className="inline-flex items-center gap-2 border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-xl font-medium hover:bg-blue-600 hover:text-white transition-colors"
          >
            {lang === 'ru' ? 'Смотреть всю галерею' : 'Barcha galereyani ko\'rish'}
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
