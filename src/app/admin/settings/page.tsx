'use client';

import { useState, useEffect } from 'react';
import AdminShell from '@/components/admin/AdminShell';
import { getSettings, saveSettings, ClinicSettings } from '@/lib/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Save, CheckCircle } from 'lucide-react';

const defaultSettings: ClinicSettings = {
  nameRu: 'Ташкентский государственный медицинский университет (TSMU) — многопрофильная детская клиника',
  nameUz: "Toshkent State Medical University (TSMU) — ko'p tarmoqli bolalar klinikasi",
  nameShortRu: 'Детская клиника ТГМУ',
  nameShortUz: 'TSMU Bolalar klinikasi',
  address: 'Ташкентская область, Кибрайский район, гп. Салар, ул. Богишамол, 223А/1',
  phone1: '',
  phone2: '',
  email: 'info@tsmukids.uz',
  workingHours: 'Пн–Пт: 8:00–20:00, Сб–Вс: 9:00–17:00',
  statsDoctors: '100+',
  statsPatients: '15 000+',
  statsExperience: '20+',
  statsDepartments: '16',
  aboutDescription1Ru: 'Многопрофильная детская клиника ТГМУ (TSMU, Tashkent State Medical University) — специализированное учреждение, в котором проходят лечение дети от 3 месяцев до 18 лет. Клиника оснащена современным диагностическим и хирургическим оборудованием.',
  aboutDescription1Uz: "TSMU (Toshkent State Medical University) ko'p tarmoqli bolalar klinikasi — 3 oylikdan 18 yoshgacha bo'lgan bolalar davolanadigan ixtisoslashtirilgan muassasa. Klinika zamonaviy diagnostik va jarrohlik uskunalari bilan jihozlangan.",
  aboutDescription2Ru: 'В нашей клинике функционируют 15 профильных отделений на 340 коек (включая 24 реанимационных). Работают более 100 врачей различных специальностей с опытом более 20 лет.',
  aboutDescription2Uz: "Klinikamizda 340 o'rinli (24 ta reanimatsiya o'rni bilan) 15 ta ixtisoslashtirilgan bo'lim faoliyat yuritadi. 20 yildan ortiq tajribaga ega 100 dan ortiq turli ixtisoslikdagi shifokorlar ishlaydi.",
  licenseInfo: 'Лицензия МЗ РУз',
  logoLetter: 'T',
  whatsapp: '998901234567',
  mapEmbedUrl: 'https://yandex.ru/map-widget/v1/?oid=138576287211&ol=biz&ll=69.363348%2C41.377527&z=16&lang=ru_RU',
  mapLabel: 'Ташкентская область, Кибрайский район, гп. Салар, ул. Богишамол, 223А/1',
  appointmentEmailWebhook: '',
};

function Field({
  label,
  value,
  onChange,
  multiline = false,
  placeholder = '',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  placeholder?: string;
}) {
  const cls =
    'w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white';
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
        {label}
      </label>
      {multiline ? (
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          rows={3}
          placeholder={placeholder}
          className={cls + ' resize-none'}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className={cls}
        />
      )}
    </div>
  );
}

export default function SettingsPage() {
  const [data, setData] = useState<ClinicSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, user => {
      if (user) {
        getSettings().then(s => {
          if (s) setData(s);
          setLoading(false);
        });
      }
    });
    return unsub;
  }, []);

  const set = (key: keyof ClinicSettings) => (v: string) =>
    setData(prev => ({ ...prev, [key]: v }));

  const handleSave = async () => {
    setSaving(true);
    await saveSettings(data);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (loading) {
    return (
      <AdminShell>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Настройки клиники</h1>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm"
          >
            {saved ? <CheckCircle size={16} /> : <Save size={16} />}
            {saving ? 'Сохранение...' : saved ? 'Сохранено!' : 'Сохранить'}
          </button>
        </div>

        <div className="space-y-6">
          {/* Название */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <h2 className="font-semibold text-gray-900 mb-4">Название клиники</h2>
            <div className="space-y-4">
              <Field label="Название (RU)" value={data.nameRu} onChange={set('nameRu')} multiline />
              <Field label="Название (UZ)" value={data.nameUz} onChange={set('nameUz')} multiline />
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Короткое название (для шапки) (RU)" value={data.nameShortRu} onChange={set('nameShortRu')} placeholder="Детская клиника ТГМУ" />
                <Field label="Короткое название (для шапки) (UZ)" value={data.nameShortUz} onChange={set('nameShortUz')} placeholder="TSMU Bolalar Klinikasi" />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Буква лого" value={data.logoLetter} onChange={set('logoLetter')} placeholder="T" />
                <Field label="Лицензия" value={data.licenseInfo} onChange={set('licenseInfo')} placeholder="Лицензия МЗ РУз №12345" />
              </div>
            </div>
          </div>

          {/* Контакты */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <h2 className="font-semibold text-gray-900 mb-4">Контакты</h2>
            <div className="space-y-4">
              <Field label="Адрес" value={data.address} onChange={set('address')} placeholder="Ташкентская область, Кибрайский район, гп. Салар, ул. Богишамол, 223А/1" />
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Телефон 1" value={data.phone1} onChange={set('phone1')} placeholder="+998 71 XXX XX XX" />
                <Field label="Телефон 2" value={data.phone2} onChange={set('phone2')} placeholder="+998 90 XXX XX XX" />
              </div>
              <Field label="Email" value={data.email} onChange={set('email')} placeholder="info@clinic.uz" />
              <Field label="Режим работы" value={data.workingHours} onChange={set('workingHours')} />
              <Field label="WhatsApp" value={data.whatsapp} onChange={set('whatsapp')} placeholder="998901234567" />
              <Field
                label="Карта (URL iframe src)"
                value={data.mapEmbedUrl ?? ''}
                onChange={set('mapEmbedUrl')}
                placeholder="https://www.google.com/maps/embed?..."
              />
              <Field
                label="Подпись к карте"
                value={data.mapLabel ?? ''}
                onChange={set('mapLabel')}
                placeholder="Ташкентская область, Кибрайский район, гп. Салар, ул. Богишамол, 223А/1"
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <h2 className="font-semibold text-gray-900 mb-4">Интеграция записи на прием</h2>
            <div className="space-y-4">
              <Field
                label="Webhook Email"
                value={data.appointmentEmailWebhook ?? ''}
                onChange={set('appointmentEmailWebhook')}
                placeholder="https://... (ваш endpoint для отправки email)"
              />
              <p className="text-xs text-gray-500">
                Форма отправляет заявку на webhook URL и сохраняет в Firestore коллекцию appointments.
              </p>
            </div>
          </div>

          {/* Статистика */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <h2 className="font-semibold text-gray-900 mb-4">Статистика (отображается на главной)</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Field label="Врачей" value={data.statsDoctors} onChange={set('statsDoctors')} placeholder="100+" />
              <Field label="Пациентов в год" value={data.statsPatients} onChange={set('statsPatients')} placeholder="15 000+" />
              <Field label="Лет опыта" value={data.statsExperience} onChange={set('statsExperience')} placeholder="20+" />
              <Field label="Направлений" value={data.statsDepartments} onChange={set('statsDepartments')} placeholder="16" />
            </div>
          </div>

          {/* О клинике */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <h2 className="font-semibold text-gray-900 mb-4">О клинике (раздел «О нас»)</h2>
            <div className="space-y-4">
              <Field label="Описание 1 (RU)" value={data.aboutDescription1Ru} onChange={set('aboutDescription1Ru')} multiline />
              <Field label="Описание 1 (UZ)" value={data.aboutDescription1Uz} onChange={set('aboutDescription1Uz')} multiline />
              <Field label="Описание 2 (RU)" value={data.aboutDescription2Ru} onChange={set('aboutDescription2Ru')} multiline />
              <Field label="Описание 2 (UZ)" value={data.aboutDescription2Uz} onChange={set('aboutDescription2Uz')} multiline />
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
