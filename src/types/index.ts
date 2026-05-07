export type Lang = 'ru' | 'uz';

export interface Doctor {
  slug: string;
  nameRu: string;
  nameUz: string;
  specialtyRu: string;
  specialtyUz: string;
  experienceRu: string;
  experienceUz: string;
  bioRu: string;
  bioUz: string;
  department: string;
  services: string[];
  photo: string;
}

export interface Department {
  slug: string;
  nameRu: string;
  nameUz: string;
  descriptionRu: string;
  descriptionUz: string;
  icon: string;
  image?: string;
  diseases: string[];
  doctorSlugs: string[];
}

export interface Service {
  slug: string;
  nameRu: string;
  nameUz: string;
  descriptionRu: string;
  descriptionUz: string;
  category: string;
  price?: number;
  durationRu?: string;
  durationUz?: string;
}

export interface Equipment {
  id: string;
  nameRu: string;
  nameUz: string;
  descriptionRu: string;
  descriptionUz: string;
  image: string;
  category?: 'equipment' | 'diagnostics';
}

export interface Disease {
  id: string;
  nameRu: string;
  nameUz: string;
  department: string;
}

export interface PriceItem {
  id: string;
  nameRu: string;
  nameUz: string;
  category: string;
  price: number;
}

export interface GalleryImage {
  id: string;
  src: string;
  altRu: string;
  altUz: string;
  category: string;
}
