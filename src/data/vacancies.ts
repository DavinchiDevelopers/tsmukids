export interface Vacancy {
  id: string;
  titleRu: string;
  titleUz: string;
  departmentRu?: string;
  departmentUz?: string;
  descriptionRu: string;
  descriptionUz: string;
  /** кундузги | навбатчи */
  schedule?: 'day' | 'duty';
  /** Ставка, например 1 или 0.5 */
  rate?: number;
  /** Оклад в сумах (число) */
  salary?: number;
  /** Ссылка на вакансию / форму отклика */
  url?: string;
  published?: boolean;
}

/** Список вакансий. Добавляйте сюда новые позиции или укажите url на внешнюю страницу. */
export const vacancies: Vacancy[] = [
  {
    id: 'anti-corruption',
    titleRu: 'Главный специалист по противодействию коррупции',
    titleUz: 'Korrupsiyaga qarshi kurashish bo‘yicha bosh mutaxassis',
    departmentRu: 'Администрация',
    departmentUz: 'Ma’muriyat',
    descriptionRu: 'Дневной график. Ставка 1,0. Оклад 2 382 490 сум.',
    descriptionUz: 'Kunduzgi ish. Stavka 1,0. Oylik maosh 2 382 490 so‘m.',
    schedule: 'day',
    rate: 1,
    salary: 2382490,
    published: true,
  },
  {
    id: 'epidemiologist',
    titleRu: 'Эпидемиолог',
    titleUz: 'Epidemiolog',
    departmentRu: 'Эпидемиология',
    departmentUz: 'Epidemiologiya',
    descriptionRu: 'Дневной график. Ставка 1,0. Оклад 4 338 689 сум.',
    descriptionUz: 'Kunduzgi ish. Stavka 1,0. Oylik maosh 4 338 689 so‘m.',
    schedule: 'day',
    rate: 1,
    salary: 4338689,
    published: true,
  },
  {
    id: 'sterilization-nurse',
    titleRu: 'Медицинская сестра',
    titleUz: 'Hamshira',
    departmentRu: 'Централизованная стерилизация',
    departmentUz: 'Markazlashgan sterilizatsiya',
    descriptionRu: 'Дневной график. Ставка 0,75. Оклад 2 222 101 сум.',
    descriptionUz: 'Kunduzgi ish. Stavka 0,75. Oylik maosh 2 222 101 so‘m.',
    schedule: 'day',
    rate: 0.75,
    salary: 2222101,
    published: true,
  },
  {
    id: 'neurology-eeg',
    titleRu: 'Врач ЭЭГ',
    titleUz: 'EEG shifokori',
    departmentRu: 'Неврология',
    departmentUz: 'Nevrologiya',
    descriptionRu: 'Дневной график. Ставка 0,5. Оклад 1 886 386 сум.',
    descriptionUz: 'Kunduzgi ish. Stavka 0,5. Oylik maosh 1 886 386 so‘m.',
    schedule: 'day',
    rate: 0.5,
    salary: 1886386,
    published: true,
  },
  {
    id: 'reanimatologist',
    titleRu: 'Анестезиолог-реаниматолог',
    titleUz: 'Anesteziolog-reanimatolog',
    departmentRu: 'Реанимация',
    departmentUz: 'Reanimatsiya',
    descriptionRu: 'Дежурство. Ставка 0,5. Оклад 2 905 035 сум.',
    descriptionUz: 'Navbatchi. Stavka 0,5. Oylik maosh 2 905 035 so‘m.',
    schedule: 'duty',
    rate: 0.5,
    salary: 2905035,
    published: true,
  },
  {
    id: 'ophthalmologist',
    titleRu: 'Врач',
    titleUz: 'Shifokor',
    departmentRu: 'Офтальмология',
    departmentUz: 'Oftalmologiya',
    descriptionRu: 'Дежурство. Ставка 0,5. Оклад 2 169 344 сум.',
    descriptionUz: 'Navbatchi. Stavka 0,5. Oylik maosh 2 169 344 so‘m.',
    schedule: 'duty',
    rate: 0.5,
    salary: 2169344,
    published: true,
  },
];

export function getPublishedVacancies(): Vacancy[] {
  return vacancies.filter(v => v.published !== false);
}

export function formatSalary(amount: number, lang: 'ru' | 'uz'): string {
  const formatted = amount.toLocaleString('ru-RU').replace(/\u00A0/g, ' ');
  return lang === 'ru' ? `${formatted} сум` : `${formatted} so‘m`;
}

export function formatRate(rate: number): string {
  return rate.toLocaleString('ru-RU', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}
