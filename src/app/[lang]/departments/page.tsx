'use client';

import { use } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { Lang } from '@/types';
import { getT } from '@/i18n';
import { useSiteData } from '@/contexts/SiteDataContext';
import DeptIcon from '@/components/ui/DeptIcon';
import PageBackButton from '@/components/ui/PageBackButton';

export default function DepartmentsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: langStr } = use(params);
  const lang = langStr as Lang;
  const t = getT(lang);
  const { departments } = useSiteData();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-blue-900 to-blue-950 text-white py-16">
        <div className="container mx-auto px-3 sm:px-4">
          <PageBackButton href={`/${lang}`} label={t.common.backToHome} className="mb-6" />
          <div className="text-center">
          <span className="inline-block bg-blue-800/50 text-blue-300 text-sm px-4 py-1.5 rounded-full mb-4">
            {t.departments.badge}
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3 text-balance px-1">{t.departments.title}</h1>
          <p className="text-blue-200">{t.departments.subtitle}</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-3 sm:px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((dept) => (
            <Link
              key={dept.slug}
              href={`/${lang}/departments/${dept.slug}`}
              className="group bg-white rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100"
            >
              <div className="aspect-video relative bg-gradient-to-br from-blue-100 to-blue-200">
                {dept.image ? (
                  <Image
                    src={dept.image}
                    alt={lang === 'ru' ? dept.nameRu : dept.nameUz}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    unoptimized
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center">
                      <DeptIcon name={dept.icon} size={30} />
                    </div>
                  </div>
                )}
              </div>
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-3">
                  {lang === 'ru' ? dept.nameRu : dept.nameUz}
                </h2>
                <p className="text-gray-500 text-sm mb-4 leading-relaxed">
                  {lang === 'ru' ? dept.descriptionRu : dept.descriptionUz}
                </p>
                <div className="w-full py-2.5 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium group-hover:bg-blue-600 group-hover:text-white transition-colors flex items-center justify-center gap-1">
                  {t.departments.learnMore}
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
