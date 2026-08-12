import { Lang } from '@/types';
import { SITE_NAME_RU, SITE_NAME_UZ } from '@/lib/branding';

export type SeoPageKey =
  | 'home'
  | 'about'
  | 'departments'
  | 'doctors'
  | 'services'
  | 'equipment'
  | 'prices'
  | 'gallery'
  | 'contacts'
  | 'privacy';

interface PageSeo {
  title: string;
  description: string;
  path: string;
}

const SEO: Record<SeoPageKey, Record<Lang, PageSeo>> = {
  home: {
    ru: {
      title: `${SITE_NAME_RU} — Детская клиника в Ташкенте`,
      description:
        'Многопрофильная детская клиника ТГМУ (TSMU — Tashkent State Medical University) в Ташкенте. Диагностика, хирургия, консультации специалистов для детей от 3 месяцев до 18 лет. Запись онлайн.',
      path: '',
    },
    uz: {
      title: `${SITE_NAME_UZ} — Toshkentdagi bolalar klinikasi`,
      description:
        "TSMU (Toshkent State Medical University) ko'p tarmoqli bolalar klinikasi. 3 oylikdan 18 yoshgacha bolalar uchun diagnostika, jarrohlik va mutaxassis maslahatlari. Onlayn yozilish.",
      path: '',
    },
  },
  about: {
    ru: {
      title: 'О клинике',
      description:
        'Детская клиника ТГМУ — современная многопрофильная клиника с 15 отделениями, 340 койками и командой из 100+ специалистов.',
      path: '/about',
    },
    uz: {
      title: 'Klinika haqida',
      description:
        "TSMU Bolalar Klinikasi — 15 bo'lim, 340 o'rin va 100+ mutaxassisdan iborat zamonaviy ko'p tarmoqli klinika.",
      path: '/about',
    },
  },
  departments: {
    ru: {
      title: 'Направления и отделения',
      description:
        '15 профильных отделений: хирургия, кардиохирургия, офтальмология, неврология, педиатрия и другие направления детской медицины.',
      path: '/departments',
    },
    uz: {
      title: "Yo'nalishlar va bo'limlar",
      description:
        "15 ta ixtisoslashtirilgan bo'lim: jarrohlik, kardiojarrohlik, oftalmologiya, nevrologiya, pediatriya va boshqa bolalar tibbiyoti yo'nalishlari.",
      path: '/departments',
    },
  },
  doctors: {
    ru: {
      title: 'Врачи',
      description:
        'Команда опытных детских врачей детской клиники ТГМУ. Специалисты с многолетним стажем в хирургии, диагностике и педиатрии.',
      path: '/doctors',
    },
    uz: {
      title: 'Shifokorlar',
      description:
        "TSMU Bolalar Klinikasi tajribali bolalar shifokorlari jamoasi. Jarrohlik, diagnostika va pediatriya bo'yicha ko'p yillik tajriba.",
      path: '/doctors',
    },
  },
  services: {
    ru: {
      title: 'Услуги и анализы',
      description:
        'Полный перечень медицинских услуг, анализов и диагностики для детей. Актуальные цены и запись на приём онлайн.',
      path: '/services',
    },
    uz: {
      title: 'Xizmatlar va tahlillar',
      description:
        "Bolalar uchun tibbiy xizmatlar, tahlillar va diagnostika ro'yxati. Dolzarb narxlar va onlayn yozilish.",
      path: '/services',
    },
  },
  equipment: {
    ru: {
      title: 'Оборудование',
      description:
        'Современное диагностическое и хирургическое оборудование клиники: МРТ, КТ, УЗИ и другие технологии для точной диагностики.',
      path: '/equipment',
    },
    uz: {
      title: 'Uskunalar',
      description:
        "Klinikaning zamonaviy diagnostika va jarrohlik uskunalari: MRT, KT, UTT va aniq diagnostika uchun boshqa texnologiyalar.",
      path: '/equipment',
    },
  },
  prices: {
    ru: {
      title: 'Прайс-лист',
      description:
        'Актуальные цены на услуги, анализы и консультации в детской клинике ТГМУ. Прозрачное ценообразование.',
      path: '/prices',
    },
    uz: {
      title: 'Narxlar',
      description:
        "TSMU Bolalar Klinikasidagi xizmatlar, tahlillar va maslahatlar bo'yicha dolzarb narxlar.",
      path: '/prices',
    },
  },
  gallery: {
    ru: {
      title: 'Галерея',
      description:
        'Фотографии клиники, палат, оборудования и команды детской клиники ТГМУ.',
      path: '/gallery',
    },
    uz: {
      title: 'Galereya',
      description:
        "TSMU Bolalar Klinikasi binosi, palatalar, uskunalar va jamoa fotosuratlari.",
      path: '/gallery',
    },
  },
  contacts: {
    ru: {
      title: 'Контакты',
      description:
        'Адрес, телефоны и часы работы детской клиники ТГМУ в Ташкенте. Как добраться и записаться на приём.',
      path: '/contacts',
    },
    uz: {
      title: 'Aloqa',
      description:
        "TSMU Bolalar Klinikasining manzili, telefonlari va ish vaqti. Toshkentda qanday topish va qabulga yozilish.",
      path: '/contacts',
    },
  },
  privacy: {
    ru: {
      title: 'Политика конфиденциальности',
      description:
        'Политика обработки персональных данных пациентов и посетителей сайта детской клиники ТГМУ.',
      path: '/privacy',
    },
    uz: {
      title: 'Maxfiylik siyosati',
      description:
        "TSMU Bolalar Klinikasi sayti va bemorlar shaxsiy ma'lumotlarini qayta ishlash siyosati.",
      path: '/privacy',
    },
  },
};

export function getPageSeo(page: SeoPageKey, lang: Lang): PageSeo {
  return SEO[page][lang];
}
