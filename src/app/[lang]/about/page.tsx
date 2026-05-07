import { Shield, Clock, Zap, Activity, Award, Users } from 'lucide-react';
import { Lang } from '@/types';
import { getT } from '@/i18n';

interface AboutPageProps {
  params: Promise<{ lang: string }>;
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { lang } = await params;
  const t = getT(lang as Lang);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-blue-900 to-blue-950 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3 text-balance px-1">{t.about.title}</h1>
          <p className="text-blue-200 max-w-2xl mx-auto">{t.about.description1}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 space-y-10">
        {/* Mission */}
        <div className="bg-white rounded-2xl p-5 sm:p-8 border border-gray-100">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 text-balance">
            {lang === 'ru' ? 'О клинике' : 'Klinika haqida'}
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">{t.about.description1}</p>
          <p className="text-gray-600 leading-relaxed">{t.about.description2}</p>
        </div>

        {/* Features grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { icon: Shield, key: 'license' },
            { icon: Clock, key: 'stationery' },
            { icon: Zap, key: 'emergency' },
            { icon: Activity, key: 'equipment' },
          ].map(({ icon: Icon, key }) => (
            <div key={key} className="bg-white rounded-2xl p-6 border border-gray-100 text-center">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Icon size={26} className="text-blue-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{t.about.features[key as keyof typeof t.about.features].title}</h3>
              <p className="text-gray-500 text-sm">{t.about.features[key as keyof typeof t.about.features].desc}</p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-5 sm:p-8 text-white">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center">
            {[
              { value: '40+', label: t.hero.stats.doctors },
              { value: '15 000+', label: t.hero.stats.patients },
              { value: '10+', label: t.hero.stats.experience },
              { value: '8', label: t.hero.stats.departments },
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-2xl sm:text-4xl font-bold mb-1 tabular-nums">{stat.value}</div>
                <div className="text-blue-200 text-xs sm:text-sm leading-snug text-balance px-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Licenses */}
        <div className="bg-white rounded-2xl p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {lang === 'ru' ? 'Лицензии и сертификаты' : 'Litsenziyalar va sertifikatlar'}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              lang === 'ru' ? 'Лицензия Министерства здравоохранения РУз' : 'O\'zbekiston Sog\'liqni saqlash vazirligi litsenziyasi',
              lang === 'ru' ? 'Сертификат ISO 9001:2015' : 'ISO 9001:2015 sertifikati',
              lang === 'ru' ? 'Аккредитация по стандартам JCI' : 'JCI standartlari bo\'yicha akkreditatsiya',
            ].map((cert, i) => (
              <div key={i} className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
                <Award size={20} className="text-blue-600 shrink-0" />
                <span className="text-sm text-gray-700 font-medium">{cert}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
