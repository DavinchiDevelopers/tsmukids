#!/usr/bin/env node
/**
 * Создаёт обязательные направления в Firestore, если ещё нет.
 * GOOGLE_APPLICATION_CREDENTIALS=/path/to/key.json node scripts/seed-required-departments.mjs
 */

import { initFirestore } from './firestore-backup-utils.mjs';

const REQUIRED = [
  {
    slug: 'grudnaya-hirurgiya',
    nameRu: 'Грудная хирургия',
    exists: d => {
      const slug = (d.slug || '').trim();
      const name = (d.nameRu || '').toLowerCase();
      return slug === 'grudnaya-hirurgiya' || name.includes('грудн');
    },
    payload: order => ({
      slug: 'grudnaya-hirurgiya',
      nameRu: 'Грудная хирургия',
      nameUz: "Ko'krak jarrohligi",
      descriptionRu:
        'Грудная хирургия — хирургическое лечение заболеваний органов грудной клетки у детей: врождённые пороки, опухоли, травмы, патология лёгких и плевры.',
      descriptionUz:
        "Ko'krak jarrohligi — bolalarda ko'krak qafasi organlari kasalliklarini jarrohlik davolash: tug'ma nuqsonlar, o'smalar, jarohatlar, o'pka va plevra patologiyasi.",
      icon: 'activity',
      beds: 25,
      hasEmergency: true,
      image: '/oborudovanie/Бронхоскопия.jpg',
      order,
    }),
  },
  {
    slug: 'diagnostika',
    nameRu: 'Диагностика',
    exists: d => {
      const slug = (d.slug || '').trim();
      const name = (d.nameRu || '').toLowerCase();
      return (
        slug === 'diagnostika' ||
        name === 'диагностика' ||
        (name.includes('диагност') && !name.includes('лаборатор'))
      );
    },
    payload: order => ({
      slug: 'diagnostika',
      nameRu: 'Диагностика',
      nameUz: 'Diagnostika',
      descriptionRu:
        'Диагностика — УЗИ, эхокардиография (ЭхоКГ), функциональные и инструментальные исследования для точной постановки диагноза у детей.',
      descriptionUz:
        "Diagnostika — bolalarda aniq tashxis qo'yish uchun UZI, exokardiografiya (EhoKG) va asbob-uskunalar yordamida tekshiruvlar.",
      icon: 'activity',
      beds: 20,
      hasEmergency: false,
      image: '/oborudovanie/УЗИ (всех органов и систем).jpg',
      order,
    }),
  },
];

async function main() {
  const db = initFirestore();
  const snap = await db.collection('departments').get();
  const existing = snap.docs.map(doc => doc.data());
  let order = snap.size;
  let added = 0;

  for (const dept of REQUIRED) {
    if (existing.some(dept.exists)) {
      console.log(`«${dept.nameRu}» уже есть — пропуск.`);
      continue;
    }

    await db.collection('departments').add(dept.payload(order));
    console.log(`Добавлено направление «${dept.nameRu}» (slug: ${dept.slug})`);
    order += 1;
    added += 1;
  }

  if (added === 0) {
    console.log('Все обязательные направления уже в Firestore.');
  }
}

main().catch(err => {
  console.error(err.message || err);
  process.exit(1);
});
