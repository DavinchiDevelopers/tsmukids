'use client';

import { useCallback, useEffect, useState, use } from 'react';
import Image from 'next/image';
import { Image as ImageIcon, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Lang } from '@/types';
import { getT } from '@/i18n';
import clsx from 'clsx';
import { useSiteData } from '@/contexts/SiteDataContext';

const colors = [
  'from-blue-100 to-blue-200', 'from-sky-100 to-sky-200', 'from-indigo-100 to-indigo-200',
  'from-slate-100 to-slate-200', 'from-cyan-50 to-cyan-100', 'from-blue-50 to-blue-100',
  'from-teal-100 to-teal-200', 'from-blue-200 to-blue-300', 'from-indigo-50 to-indigo-100',
  'from-sky-50 to-sky-100', 'from-blue-100 to-indigo-100', 'from-slate-50 to-slate-100',
];

const categories = ['all', 'clinic', 'rooms', 'equipment', 'team'] as const;

export default function GalleryPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: langStr } = use(params);
  const lang = langStr as Lang;
  const t = getT(lang);
  const [active, setActive] = useState('all');
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { gallery, loaded } = useSiteData();

  const filtered = active === 'all' ? gallery : gallery.filter(i => i.category === active);
  const current = openIndex != null ? filtered[openIndex] : null;

  const close = useCallback(() => setOpenIndex(null), []);
  const showPrev = useCallback(() => {
    setOpenIndex(i => (i == null || filtered.length === 0 ? i : (i - 1 + filtered.length) % filtered.length));
  }, [filtered.length]);
  const showNext = useCallback(() => {
    setOpenIndex(i => (i == null || filtered.length === 0 ? i : (i + 1) % filtered.length));
  }, [filtered.length]);

  useEffect(() => {
    if (openIndex == null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') showPrev();
      if (e.key === 'ArrowRight') showNext();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [openIndex, close, showPrev, showNext]);

  // If filter changes while lightbox open, keep index in range or close
  useEffect(() => {
    if (openIndex == null) return;
    if (filtered.length === 0) setOpenIndex(null);
    else if (openIndex >= filtered.length) setOpenIndex(filtered.length - 1);
  }, [filtered.length, openIndex]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-blue-900 to-blue-950 text-white py-16">
        <div className="container mx-auto px-3 sm:px-4 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3 text-balance px-1">{t.gallery.title}</h1>
        </div>
      </div>

      <div className="container mx-auto px-3 sm:px-4 py-10">
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {categories.map(cat => (
            <button
              key={cat}
              type="button"
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

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
          {!loaded ? Array.from({ length: 12 }).map((_, idx) => (
            <div
              key={`skeleton-${idx}`}
              className={`aspect-video bg-gradient-to-br ${colors[idx % colors.length]} rounded-2xl animate-pulse`}
            />
          )) : filtered.map((item, idx) => (
            <button
              key={item.id}
              type="button"
              onClick={() => item.image && setOpenIndex(idx)}
              className={`aspect-video bg-gradient-to-br ${colors[idx % colors.length]} rounded-2xl flex items-center justify-center relative overflow-hidden group cursor-pointer text-left`}
              aria-label={lang === 'ru' ? item.titleRu : item.titleUz}
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
                <ImageIcon size={36} className="text-white/40" />
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/50 to-transparent translate-y-full group-hover:translate-y-0 transition-transform">
                <p className="text-white text-sm font-medium">
                  {lang === 'ru' ? item.titleRu : item.titleUz}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {current?.image && openIndex != null && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex flex-col"
          role="dialog"
          aria-modal="true"
          aria-label={lang === 'ru' ? current.titleRu : current.titleUz}
        >
          <div className="flex items-center justify-between gap-3 px-3 sm:px-4 py-3 text-white shrink-0">
            <p className="text-sm sm:text-base font-medium truncate min-w-0">
              {lang === 'ru' ? current.titleRu : current.titleUz}
              <span className="text-white/50 font-normal ml-2">
                {openIndex + 1}/{filtered.length}
              </span>
            </p>
            <button
              type="button"
              onClick={close}
              className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-white/10 hover:bg-white/20 text-white shrink-0"
              aria-label={lang === 'ru' ? 'Закрыть' : 'Yopish'}
            >
              <X size={24} />
            </button>
          </div>

          <div className="relative flex-1 min-h-0 flex items-center justify-center px-12 sm:px-16 pb-4">
            <button
              type="button"
              onClick={showPrev}
              className="absolute left-2 sm:left-4 z-10 inline-flex items-center justify-center w-11 h-11 rounded-full bg-white/15 hover:bg-white/25 text-white"
              aria-label={lang === 'ru' ? 'Предыдущее' : 'Oldingi'}
            >
              <ChevronLeft size={28} />
            </button>

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={current.image}
              alt={lang === 'ru' ? current.titleRu : current.titleUz}
              className="max-w-full max-h-[calc(100dvh-6rem)] w-auto h-auto object-contain rounded-lg select-none"
              draggable={false}
            />

            <button
              type="button"
              onClick={showNext}
              className="absolute right-2 sm:right-4 z-10 inline-flex items-center justify-center w-11 h-11 rounded-full bg-white/15 hover:bg-white/25 text-white"
              aria-label={lang === 'ru' ? 'Следующее' : 'Keyingi'}
            >
              <ChevronRight size={28} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
