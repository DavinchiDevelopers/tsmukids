'use client';

import { useEffect, useState } from 'react';
import AdminShell from '@/components/admin/AdminShell';
import Link from 'next/link';
import { defaultSettings } from '@/contexts/SiteDataContext';
import { getSettings } from '@/lib/firestore';
import { SITE_UNIVERSITY_ABBR } from '@/lib/branding';
import { Settings, Stethoscope, Users, Building2, ExternalLink, Monitor, Images, Inbox } from 'lucide-react';

const cards = [
  {
    href: '/admin/settings',
    icon: Settings,
    title: 'Настройки клиники',
    desc: 'Название, адрес, телефоны, статистика',
    color: 'bg-purple-50 text-purple-600',
  },
  {
    href: '/admin/services',
    icon: Stethoscope,
    title: 'Услуги',
    desc: 'Список услуг, операций и анализов',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    href: '/admin/doctors',
    icon: Users,
    title: 'Врачи',
    desc: 'Специалисты клиники',
    color: 'bg-green-50 text-green-600',
  },
  {
    href: '/admin/departments',
    icon: Building2,
    title: 'Отделения',
    desc: 'Отделения и направления',
    color: 'bg-orange-50 text-orange-600',
  },
  {
    href: '/admin/equipment',
    icon: Monitor,
    title: 'Оборудование',
    desc: 'Медицинская техника и описание',
    color: 'bg-cyan-50 text-cyan-600',
  },
  {
    href: '/admin/gallery',
    icon: Images,
    title: 'Галерея',
    desc: 'Фото клиники, палат, команды и оборудования',
    color: 'bg-pink-50 text-pink-600',
  },
  {
    href: '/admin/appointments',
    icon: Inbox,
    title: 'Заявки',
    desc: 'Записи на приём с сайта',
    color: 'bg-yellow-50 text-yellow-700',
  },
];

export default function DashboardPage() {
  const [clinicName, setClinicName] = useState(defaultSettings.nameShortRu);

  useEffect(() => {
    getSettings()
      .then(s => {
        if (s?.nameShortRu?.trim()) setClinicName(s.nameShortRu.trim());
      })
      .catch(() => {
        /* keep default */
      });
  }, []);

  return (
    <AdminShell>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Панель управления</h1>
            <p className="text-gray-500 text-sm mt-1">{SITE_UNIVERSITY_ABBR} — {clinicName}</p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/ru"
              target="_blank"
              className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 bg-blue-50 px-4 py-2 rounded-xl"
            >
              <ExternalLink size={14} />
              Открыть сайт (RU)
            </Link>
            <Link
              href="/uz"
              target="_blank"
              className="flex items-center gap-2 text-sm text-green-600 hover:text-green-700 bg-green-50 px-4 py-2 rounded-xl"
            >
              <ExternalLink size={14} />
              Sayt (UZ)
            </Link>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {cards.map(({ href, icon: Icon, title, desc, color }) => (
            <Link
              key={href}
              href={href}
              className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-md hover:border-blue-100 transition-all group"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${color}`}>
                <Icon size={24} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                {title}
              </h3>
              <p className="text-sm text-gray-500">{desc}</p>
            </Link>
          ))}
        </div>

        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-2xl p-5">
          <h3 className="font-semibold text-yellow-800 mb-2">Инструкция</h3>
          <ul className="text-sm text-yellow-700 space-y-1 list-disc list-inside">
            <li>Все изменения сохраняются в Firebase Firestore в реальном времени</li>
            <li>После изменения настроек данные обновляются на сайте мгновенно</li>
            <li>Для добавления фото врачей — загрузите файлы в Firebase Storage и укажите ссылку</li>
            <li>Новые данные появятся на сайте при следующем открытии страницы</li>
          </ul>
        </div>
      </div>
    </AdminShell>
  );
}
