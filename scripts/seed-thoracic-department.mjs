#!/usr/bin/env node
/**
 * Создаёт «Грудная хирургия» в Firestore, если ещё нет.
 * GOOGLE_APPLICATION_CREDENTIALS=/path/to/key.json node scripts/seed-thoracic-department.mjs
 */

import { initFirestore } from './firestore-backup-utils.mjs';

const THORACIC = {
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
};

async function main() {
  const db = initFirestore();
  const snap = await db.collection('departments').get();

  const exists = snap.docs.some(doc => {
    const d = doc.data();
    const slug = (d.slug || '').trim();
    const name = (d.nameRu || '').toLowerCase();
    return slug === THORACIC.slug || name.includes('грудн');
  });

  if (exists) {
    console.log('Грудная хирургия уже есть в Firestore — ничего не делаем.');
    return;
  }

  const order = snap.size;
  await db.collection('departments').add({ ...THORACIC, order });
  console.log(`Добавлено направление «${THORACIC.nameRu}» (slug: ${THORACIC.slug})`);
}

main().catch(err => {
  console.error(err.message || err);
  process.exit(1);
});
