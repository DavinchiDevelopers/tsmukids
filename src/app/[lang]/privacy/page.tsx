'use client';

import { use } from 'react';
import Link from 'next/link';
import { Lang } from '@/types';
import { getT } from '@/i18n';

export default function PrivacyPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: langStr } = use(params);
  const lang = langStr as Lang;
  const t = getT(lang);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-blue-900 to-blue-950 text-white py-16">
        <div className="container mx-auto px-3 sm:px-4">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">
            {lang === 'ru' ? 'Политика конфиденциальности' : 'Maxfiylik siyosati'}
          </h1>
          <p className="text-blue-200 max-w-3xl">
            {lang === 'ru'
              ? 'Мы бережно относимся к персональным данным пациентов и используем их только для медицинского обслуживания и обратной связи.'
              : "Biz bemorlarning shaxsiy ma'lumotlariga ehtiyotkorlik bilan yondashamiz va ularni faqat tibbiy xizmat hamda aloqa uchun ishlatamiz."}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-3 sm:px-4 py-10">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 space-y-5 text-gray-700 leading-relaxed">
          <p>
            {lang === 'ru'
              ? 'Оставляя заявку на сайте, вы соглашаетесь на обработку персональных данных (имя, телефон, комментарий) для записи на приём и обратной связи.'
              : "Saytda ariza qoldirish orqali siz qabulga yozish va qayta aloqa uchun shaxsiy ma'lumotlaringizni (ism, telefon, izoh) qayta ishlashga rozilik bildirasiz."}
          </p>
          <p>
            {lang === 'ru'
              ? 'Мы не передаём ваши данные третьим лицам, за исключением случаев, предусмотренных законодательством.'
              : "Qonunchilikda nazarda tutilgan holatlardan tashqari, ma'lumotlaringiz uchinchi shaxslarga berilmaydi."}
          </p>
          <p>
            {lang === 'ru'
              ? 'По вопросам обработки данных вы можете обратиться по контактам, указанным на сайте.'
              : "Ma'lumotlarni qayta ishlash bo'yicha savollar bilan sayt kontaktlari orqali murojaat qilishingiz mumkin."}
          </p>
          <div className="pt-2">
            <Link href={`/${lang}`} className="text-blue-600 hover:text-blue-700 font-medium">
              {lang === 'ru' ? 'Вернуться на главную' : 'Bosh sahifaga qaytish'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
