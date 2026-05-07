'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Monitor, X } from 'lucide-react';
import { Lang } from '@/types';
import { getT } from '@/i18n';
import { useSiteData } from '@/contexts/SiteDataContext';
import { EquipmentDoc } from '@/lib/firestore';

interface EquipmentSectionProps {
  lang: Lang;
}

function EquipSkeleton() {
  return (
    <div className="bg-gray-50 rounded-2xl overflow-hidden animate-pulse">
      <div className="aspect-video bg-gray-200" />
      <div className="p-5 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-2/3" />
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-4/5" />
      </div>
    </div>
  );
}

export default function EquipmentSection({ lang }: EquipmentSectionProps) {
  const INITIAL_VISIBLE = 6;
  const t = getT(lang);
  const { equipment, loaded } = useSiteData();
  const [selected, setSelected] = useState<EquipmentDoc | null>(null);
  const getDescription = (item: EquipmentDoc) => {
    const raw = lang === 'ru' ? item.descriptionRu : item.descriptionUz;
    const fallback = lang === 'ru' ? item.descriptionUz : item.descriptionRu;
    return (raw || fallback || '').replace(/\r/g, '').trim();
  };
  const visibleEquipment = equipment.slice(0, INITIAL_VISIBLE);

  return (
    <section id="equipment" className="py-20 bg-white">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="text-center mb-12">
          <span className="inline-block bg-blue-50 text-blue-600 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            {t.equipment.badge}
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 text-balance">{t.equipment.title}</h2>
          <p className="text-gray-500 max-w-xl mx-auto">{t.equipment.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {!loaded
            ? Array.from({ length: 6 }).map((_, i) => <EquipSkeleton key={i} />)
            : visibleEquipment.map((item) => (
              <div key={item.id} className="group bg-gray-50 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300">
                <div className="aspect-video relative overflow-hidden bg-gradient-to-br from-blue-100 to-blue-200">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={lang === 'ru' ? item.nameRu : item.nameUz}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      unoptimized
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Monitor size={56} className="text-blue-300" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-gray-900 mb-2">
                    {lang === 'ru' ? item.nameRu : item.nameUz}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed line-clamp-3">
                    {getDescription(item)}
                  </p>
                  <button
                    onClick={() => setSelected(item)}
                    className="mt-4 w-full py-2.5 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium group-hover:bg-blue-600 group-hover:text-white transition-colors"
                  >
                    {t.common.learnMore}
                  </button>
                </div>
              </div>
            ))
          }
        </div>

        {loaded && equipment.length > INITIAL_VISIBLE && (
          <div className="flex justify-center mt-8">
            <Link
              href={`/${lang}/equipment`}
              className="px-5 py-2.5 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-600 hover:text-white transition-colors"
            >
              {t.equipment.showMore}
            </Link>
          </div>
        )}

        {loaded && equipment.length === 0 && (
          <p className="text-center text-gray-400 py-8">
            {lang === 'ru' ? 'Оборудование скоро появится' : "Uskunalar tez orada qo'shiladi"}
          </p>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 z-[90] bg-black/60 p-3 sm:p-4 flex items-center justify-center">
          <div
            className="absolute inset-0"
            onClick={() => setSelected(null)}
            aria-hidden
          />
          <div className="relative bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-900 text-lg">
                {lang === 'ru' ? selected.nameRu : selected.nameUz}
              </h3>
              <button onClick={() => setSelected(null)} className="p-2 rounded-lg hover:bg-gray-100">
                <X size={18} />
              </button>
            </div>
            <div className="p-4 sm:p-5">
              <div className="aspect-video rounded-xl overflow-hidden bg-gray-100 relative mb-4">
                {selected.image ? (
                  <Image
                    src={selected.image}
                    alt={lang === 'ru' ? selected.nameRu : selected.nameUz}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Monitor size={48} className="text-gray-300" />
                  </div>
                )}
              </div>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line break-words">
                {getDescription(selected)}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
