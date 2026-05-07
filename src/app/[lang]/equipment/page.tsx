'use client';

import { use } from 'react';
import Image from 'next/image';
import { Monitor } from 'lucide-react';
import { Lang } from '@/types';
import { getT } from '@/i18n';
import { useSiteData } from '@/contexts/SiteDataContext';

export default function EquipmentPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: langStr } = use(params);
  const lang = langStr as Lang;
  const t = getT(lang);
  const { equipment } = useSiteData();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-blue-900 to-blue-950 text-white py-16">
        <div className="container mx-auto px-3 sm:px-4 text-center">
          <span className="inline-block bg-blue-800/50 text-blue-300 text-sm px-4 py-1.5 rounded-full mb-4">
            {t.equipment.badge}
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3 text-balance px-1">{t.equipment.title}</h1>
          <p className="text-blue-200">{t.equipment.subtitle}</p>
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
              <div key={item.id} className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300">
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
                    {(lang === 'ru' ? item.descriptionRu : item.descriptionUz) || (lang === 'ru' ? item.descriptionUz : item.descriptionRu)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
