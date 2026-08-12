'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Lang } from '@/types';
import { getT } from '@/i18n';
import { useSiteData } from '@/contexts/SiteDataContext';
import { DepartmentDoc } from '@/lib/firestore';
import DeptIcon from '@/components/ui/DeptIcon';

interface DepartmentsSectionProps {
  lang: Lang;
}

function DeptSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 animate-pulse">
      <div className="w-14 h-14 bg-gray-100 rounded-2xl mb-4" />
      <div className="h-4 bg-gray-100 rounded w-2/3 mb-2" />
      <div className="h-3 bg-gray-100 rounded w-full mb-1" />
      <div className="h-3 bg-gray-100 rounded w-3/4 mb-4" />
      <div className="h-3 bg-gray-100 rounded w-1/3" />
    </div>
  );
}

export default function DepartmentsSection({ lang }: DepartmentsSectionProps) {
  const t = getT(lang);
  const { departments, loaded } = useSiteData();
  const displayed = departments.slice(0, 8);

  const getDescription = (dept: DepartmentDoc) => {
    const raw = lang === 'ru' ? dept.descriptionRu : dept.descriptionUz;
    const fallback = lang === 'ru' ? dept.descriptionUz : dept.descriptionRu;
    return (raw || fallback || '').replace(/\r/g, '').trim();
  };

  return (
    <section id="departments" className="py-20 bg-gray-50">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="text-center mb-12">
          <span className="inline-block bg-blue-50 text-blue-600 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            {t.departments.badge}
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 text-balance">{t.departments.title}</h2>
          <p className="text-gray-500 max-w-xl mx-auto">{t.departments.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {!loaded
            ? Array.from({ length: 8 }).map((_, i) => <DeptSkeleton key={i} />)
            : displayed.map((dept) => (
              <div
                key={dept.id}
                className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300"
              >
                <div className="aspect-video relative bg-gradient-to-br from-blue-100 to-blue-200">
                  {dept.image ? (
                    <Image
                      src={dept.image}
                      alt={lang === 'ru' ? dept.nameRu : dept.nameUz}
                      fill
                      className="object-cover group-hover:scale-[1.02] transition-transform duration-300"
                      unoptimized
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center">
                        <DeptIcon name={dept.icon} size={26} />
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-gray-900 mb-2">
                    {lang === 'ru' ? dept.nameRu : dept.nameUz}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4 line-clamp-3 leading-relaxed">
                    {getDescription(dept)}
                  </p>
                  <Link
                    href={`/${lang}/departments/${dept.slug}`}
                    className="flex w-full items-center justify-center py-2.5 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium group-hover:bg-blue-600 group-hover:text-white transition-colors"
                  >
                    {t.departments.learnMore}
                  </Link>
                </div>
              </div>
            ))
          }
        </div>

        {loaded && departments.length > 0 && (
          <div className="flex justify-center mt-10">
            <Link
              href={`/${lang}/departments`}
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
            >
              {t.departments.viewAll}
            </Link>
          </div>
        )}

        {loaded && departments.length === 0 && (
          <p className="text-center text-gray-400 py-8">
            {lang === 'ru' ? 'Отделения скоро появятся' : "Bo'limlar tez orada qo'shiladi"}
          </p>
        )}
      </div>
    </section>
  );
}
