'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  getSettings, getDoctorsFS, getServicesFS, getDepartmentsFS, getEquipmentFS,
  getGalleryFS,
  ClinicSettings, DoctorDoc, ServiceDoc, DepartmentDoc, EquipmentDoc, GalleryDoc,
} from '@/lib/firestore';

export const defaultSettings: ClinicSettings = {
  nameRu: 'Ташкентский государственный медицинский университет, многопрофильная детская клиника',
  nameUz: "Toshkent Davlat Tibbiyot Universiteti Bolalar Ko'p Tarmoqli Klinikasi",
  nameShortRu: 'ТГМУ Детская Клиника',
  nameShortUz: 'TDTU Bolalar Klinikasi',
  address: 'г. Ташкент, ул. Богишамол, 223',
  phone1: '+998 71 234 56 78',
  phone2: '+998 90 123 45 67',
  email: 'info@medcare.uz',
  workingHours: 'Пн–Пт: 8:00–20:00, Сб–Вс: 9:00–17:00',
  statsDoctors: '100+',
  statsPatients: '15 000+',
  statsExperience: '20+',
  statsDepartments: '16',
  aboutDescription1Ru: 'Многопрофильная детская клиника ТГМУ — специализированное учреждение, в котором проходят лечение дети от 3 месяцев до 18 лет. Клиника оснащена современным диагностическим и хирургическим оборудованием.',
  aboutDescription1Uz: "TDTU ko'p tarmoqli bolalar klinikasi — 3 oylikdan 18 yoshgacha bo'lgan bolalar davolanadigan ixtisoslashtirilgan muassasa.",
  aboutDescription2Ru: 'В клинике функционируют 15 профильных отделений на 340 коек. Работают более 100 врачей с опытом более 20 лет.',
  aboutDescription2Uz: "Klinikada 340 o'rinli 15 ta ixtisoslashtirilgan bo'lim faoliyat yuritadi. 100 dan ortiq tajribali shifokorlar ishlaydi.",
  licenseInfo: 'Лицензия МЗ РУз',
  logoLetter: 'Т',
  telegram: 'https://t.me/medcare_uz',
  whatsapp: '998901234567',
  mapEmbedUrl: '',
  mapLabel: 'г. Ташкент, ул. Богишамол, 223',
  appointmentTelegramWebhook: '',
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
}

const defaultData: SiteData = {
  settings: defaultSettings,
  doctors: [],
  services: [],
  departments: [],
  equipment: [],
  gallery: [],
  loaded: false,
};

const SiteDataContext = createContext<SiteData>(defaultData);

export function useSiteData() {
  return useContext(SiteDataContext);
}

export default function SiteDataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<SiteData>(defaultData);

  useEffect(() => {
    Promise.all([
      getSettings().catch(() => null),
      getDoctorsFS().catch(() => [] as DoctorDoc[]),
      getServicesFS().catch(() => [] as ServiceDoc[]),
      getDepartmentsFS().catch(() => [] as DepartmentDoc[]),
      getEquipmentFS().catch(() => [] as EquipmentDoc[]),
      getGalleryFS().catch(() => [] as GalleryDoc[]),
    ]).then(([settings, doctors, services, departments, equipment, gallery]) => {
      setData({
        settings: settings ?? defaultSettings,
        doctors,
        services,
        departments,
        equipment,
        gallery,
        loaded: true,
      });
    });
  }, []);

  return (
    <SiteDataContext.Provider value={data}>
      {children}
    </SiteDataContext.Provider>
  );
}
