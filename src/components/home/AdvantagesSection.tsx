import { Monitor, UserCheck, Zap, BedDouble, BadgeDollarSign, Award } from 'lucide-react';
import { Lang } from '@/types';
import { getT } from '@/i18n';

interface AdvantagesSectionProps {
  lang: Lang;
}

const icons = [Monitor, UserCheck, Zap, BedDouble, BadgeDollarSign, Award];

export default function AdvantagesSection({ lang }: AdvantagesSectionProps) {
  const t = getT(lang);

  return (
    <section className="py-20 bg-gradient-to-br from-blue-900 to-blue-950 text-white">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="text-center mb-12">
          <span className="inline-block bg-blue-800/50 text-blue-300 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            {t.advantages.badge}
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 text-balance">{t.advantages.title}</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {t.advantages.items.map((item, i) => {
            const Icon = icons[i] ?? Monitor;
            return (
              <div key={i} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors">
                <div className="w-12 h-12 bg-blue-700/50 rounded-xl flex items-center justify-center mb-4">
                  <Icon size={24} className="text-blue-300" />
                </div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-blue-200 text-sm leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
