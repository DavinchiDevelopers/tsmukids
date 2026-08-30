'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { mergeSettings } from '@/lib/settings-utils';
import { mergeRequiredDepartments } from '@/lib/requiredDepartments';
import type {
  ClinicSettings, DoctorDoc, ServiceDoc, DepartmentDoc, EquipmentDoc, GalleryDoc,
} from '@/lib/firestore';

export const defaultSettings: ClinicSettings = {
  nameRu: 'Ташкентский государственный медицинский университет (TSMU) — многопрофильная детская клиника',
  nameUz: "Toshkent Davlat Tibbiyot Universiteti (TDTU) — ko'p tarmoqli bolalar klinikasi",
  nameShortRu: 'Многопрофильная детская клиника ТГМУ',
  nameShortUz: "TDTU Bolalar ko'p tarmoqli klinikasi",
  address: 'Ташкентская область, Кибрайский район, гп. Салар, ул. Богишамол, 223А/1',
  phone1: '+998 71 260 31 16',
  phone2: '+998 71 260 37 51',
  phone3: '+998 95 555 20 50',
  email: 'info@tsmukids.uz',
  workingHours: 'Круглосуточно',
  statsDoctors: '100+',
  statsPatients: '15 000+',
  statsExperience: '20+',
  statsDepartments: '16',
  aboutDescription1Ru: 'Многопрофильная детская клиника ТГМУ (TSMU, Tashkent State Medical University) — специализированное учреждение, в котором проходят лечение дети от 3 месяцев до 18 лет. Клиника оснащена современным диагностическим и хирургическим оборудованием.',
  aboutDescription1Uz: "TDTU (Toshkent Davlat Tibbiyot Universiteti) ko'p tarmoqli bolalar klinikasi — 3 oylikdan 18 yoshgacha bo'lgan bolalar davolanadigan ixtisoslashtirilgan muassasa.",
  aboutDescription2Ru: 'В клинике функционируют 15 профильных отделений на 340 коек. Работают более 100 врачей с опытом более 20 лет.',
  aboutDescription2Uz: "Klinikada 340 o'rinli 15 ta ixtisoslashtirilgan bo'lim faoliyat yuritadi. 100 dan ortiq tajribali shifokorlar ishlaydi.",
  licenseInfo: 'Лицензия МЗ РУз',
  logoLetter: 'T',
  whatsapp: '998901234567',
  mapEmbedUrl: 'https://yandex.ru/map-widget/v1/?oid=138576287211&ol=biz&ll=69.363348%2C41.377527&z=16&lang=ru_RU',
  mapLabel: 'Ташкентская область, Кибрайский район, гп. Салар, ул. Богишамол, 223А/1',
  appointmentEmailWebhook: '',
};

export interface SiteData {
  settings: ClinicSettings;
  doctors: DoctorDoc[];
  services: ServiceDoc[];
  departments: DepartmentDoc[];
  equipment: EquipmentDoc[];
  gallery: GalleryDoc[];
  loaded: boolean;
  refreshing: boolean;
}

const defaultData: SiteData = {
  settings: defaultSettings,
  doctors: [],
  services: [],
  departments: [],
  equipment: [],
  gallery: [],
  loaded: false,
  refreshing: false,
};

const SiteDataContext = createContext<SiteData>(defaultData);

export function useSiteData() {
  return useContext(SiteDataContext);
}

export default function SiteDataProvider({
  children,
  initialData,
}: {
  children: ReactNode;
  initialData?: Partial<SiteData>;
}) {
  const [data, setData] = useState<SiteData>(() => {
    if (!initialData) return defaultData;
    return {
      ...defaultData,
      ...initialData,
      settings: mergeSettings(initialData.settings ?? null),
      departments: mergeRequiredDepartments(initialData.departments ?? []),
      loaded: true,
      refreshing: true,
    };
  });

  useEffect(() => {
    setData(prev => ({ ...prev, refreshing: true }));
    import('@/lib/firestore').then(({ getSiteData }) =>
      getSiteData()
        .then(site => {
          setData(prev => ({
            settings: site.settings ? mergeSettings(site.settings) : prev.settings,
            doctors: site.doctors.length ? site.doctors : prev.doctors,
            services: site.services.length ? site.services : prev.services,
            departments: site.departments.length
              ? mergeRequiredDepartments(site.departments)
              : prev.departments,
            equipment: site.equipment.length ? site.equipment : prev.equipment,
            gallery: site.gallery.length ? site.gallery : prev.gallery,
            loaded: true,
            refreshing: false,
          }));
        })
        .catch(() => {
          setData(prev => ({ ...prev, loaded: true, refreshing: false }));
        }),
    );
  }, []);

  return (
    <SiteDataContext.Provider value={data}>
      {children}
    </SiteDataContext.Provider>
  );
}
