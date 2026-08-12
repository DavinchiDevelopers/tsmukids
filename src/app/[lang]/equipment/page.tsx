'use client';

import { use, useState } from 'react';
import Image from 'next/image';
import { Monitor, X } from 'lucide-react';
import { Lang } from '@/types';
import { getT } from '@/i18n';
import { useSiteData } from '@/contexts/SiteDataContext';
import { EquipmentDoc } from '@/lib/firestore';
import PageBackButton from '@/components/ui/PageBackButton';

export default function EquipmentPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: langStr } = use(params);
  const lang = langStr as Lang;
  const t = getT(lang);
  const { equipment } = useSiteData();
  const [selected, setSelected] = useState<EquipmentDoc | null>(null);

  const getDescription = (item: EquipmentDoc) => {
    const raw = lang === 'ru' ? item.descriptionRu : item.descriptionUz;
    const fallback = lang === 'ru' ? item.descriptionUz : item.descriptionRu;
    return (raw || fallback || '').replace(/\r/g, '').trim();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-blue-900 to-blue-950 text-white py-16">
        <div className="container mx-auto px-3 sm:px-4">
          <PageBackButton href={`/${lang}`} label={t.common.backToHome} className="mb-6" />
          <div className="text-center">
            <span className="inline-block bg-blue-800/50 text-blue-300 text-sm px-4 py-1.5 rounded-full mb-4">
              {t.equipment.badge}
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold mb-3 text-balance px-1">{t.equipment.title}</h1>
            <p className="text-blue-200">{t.equipment.subtitle}</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-3 sm:px-4 py-12">
        {equipment.length === 0 ? (
          <p className="text-center text-gray-400 py-8">
            {lang === 'ru' ? 'Оборудование скоро появится' : "Uskunalar tez orada qo'shiladi"}
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {equipment.map(item => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelected(item)}
                className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300 text-left"
              >
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
                  <h2 className="font-bold text-gray-900 mb-2">
                    {lang === 'ru' ? item.nameRu : item.nameUz}
                  </h2>
                  <p className="text-sm text-gray-500 leading-relaxed line-clamp-4">
                    {getDescription(item)}
                  </p>
                  <span className="mt-4 inline-flex w-full items-center justify-center rounded-lg bg-blue-50 px-4 py-2.5 text-sm font-medium text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                    {t.common.learnMore}
                  </span>
                </div>
              </button>
            ))}
          </div>
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
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
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
    </div>
  );
}
