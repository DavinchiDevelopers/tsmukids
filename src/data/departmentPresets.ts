export interface DepartmentPreset {
  nameRu: string;
  nameUz: string;
  icon: string;
  beds: number;
  hasEmergency: boolean;
}

export const DEPARTMENT_PRESETS: DepartmentPreset[] = [
  { nameRu: 'Хирургия 1', nameUz: 'Jarrohlik 1', icon: 'scissors', beds: 25, hasEmergency: true },
  { nameRu: 'Хирургия 2', nameUz: 'Jarrohlik 2', icon: 'scissors', beds: 25, hasEmergency: true },
  { nameRu: 'Кардиохирургия', nameUz: 'Kardiojarrohlik', icon: 'heart', beds: 25, hasEmergency: false },
  { nameRu: 'Грудная хирургия', nameUz: 'Ko\'krak jarrohligi', icon: 'activity', beds: 25, hasEmergency: true },
  { nameRu: 'Офтальмология', nameUz: 'Oftalmologiya', icon: 'eye', beds: 25, hasEmergency: true },
  { nameRu: 'Травматология', nameUz: 'Travmatologiya', icon: 'bone', beds: 25, hasEmergency: true },
  { nameRu: 'ЛОР', nameUz: 'LOR', icon: 'ear', beds: 20, hasEmergency: true },
  { nameRu: 'Пластическая хирургия', nameUz: 'Plastik jarrohlik', icon: 'scissors', beds: 25, hasEmergency: false },
  { nameRu: 'Урология', nameUz: 'Urologiya', icon: 'activity', beds: 25, hasEmergency: true },
  { nameRu: 'Гнойная хирургия', nameUz: 'Yiringli jarrohlik', icon: 'shield', beds: 20, hasEmergency: false },
  { nameRu: 'Детская гинекология', nameUz: 'Bolalar ginekologiyasi', icon: 'baby', beds: 20, hasEmergency: false },
  { nameRu: 'Пульмонология', nameUz: 'Pulmonologiya', icon: 'activity', beds: 20, hasEmergency: true },
  { nameRu: 'Кардиоревматология', nameUz: 'Kardiorevmatologiya', icon: 'heart', beds: 25, hasEmergency: true },
  { nameRu: 'Неврология', nameUz: 'Nevrologiya', icon: 'brain', beds: 20, hasEmergency: true },
  { nameRu: 'Дерматология', nameUz: 'Dermatologiya', icon: 'shield', beds: 20, hasEmergency: false },
  { nameRu: 'Педиатрия (0–3 года)', nameUz: 'Pediatriya (0–3 yosh)', icon: 'baby', beds: 20, hasEmergency: false },
  { nameRu: 'Диагностика', nameUz: 'Diagnostika', icon: 'activity', beds: 20, hasEmergency: false },
  { nameRu: 'Детская реанимация', nameUz: 'Bolalar reanimatsiyasi', icon: 'activity', beds: 18, hasEmergency: true },
  { nameRu: 'Кардиореанимация', nameUz: 'Kardioreanimatsiya', icon: 'heart', beds: 6, hasEmergency: true },
];

export const DEPARTMENT_PRESET_NAMES = DEPARTMENT_PRESETS.map(p => p.nameRu);
