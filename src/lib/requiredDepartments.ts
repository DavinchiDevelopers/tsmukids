import { DepartmentDoc } from '@/lib/firestore';
import { slugifyDepartmentSlug } from '@/lib/slugify';
import { DEPARTMENT_PRESETS } from '@/data/departmentPresets';

export const THORACIC_DEPARTMENT_SLUG = 'grudnaya-hirurgiya';
export const DIAGNOSTICS_DEPARTMENT_SLUG = 'diagnostika';

type SaveDepartment = (data: Omit<DepartmentDoc, 'id'>) => Promise<string>;

interface RequiredDepartmentConfig {
  slug: string;
  exists: (departments: DepartmentDoc[]) => boolean;
  build: (order: number) => DepartmentDoc;
  toFirestore: (order: number) => Omit<DepartmentDoc, 'id'>;
}

function preset(nameRu: string) {
  return DEPARTMENT_PRESETS.find(p => p.nameRu === nameRu);
}

const REQUIRED_DEPARTMENTS: RequiredDepartmentConfig[] = [
  {
    slug: THORACIC_DEPARTMENT_SLUG,
    exists: departments =>
      departments.some(
        d =>
          d.slug === THORACIC_DEPARTMENT_SLUG ||
          d.nameRu.trim().toLowerCase() === 'грудная хирургия' ||
          d.nameRu.toLowerCase().includes('грудн')
      ),
    build: order => {
      const p = preset('Грудная хирургия') ?? {
        nameRu: 'Грудная хирургия',
        nameUz: "Ko'krak jarrohligi",
        icon: 'activity',
        beds: 25,
        hasEmergency: true,
      };
      return {
        id: `preset-${THORACIC_DEPARTMENT_SLUG}`,
        slug: THORACIC_DEPARTMENT_SLUG,
        nameRu: p.nameRu,
        nameUz: p.nameUz,
        descriptionRu:
          'Грудная хирургия — хирургическое лечение заболеваний органов грудной клетки у детей: врождённые пороки, опухоли, травмы, патология лёгких и плевры.',
        descriptionUz:
          "Ko'krak jarrohligi — bolalarda ko'krak qafasi organlari kasalliklarini jarrohlik davolash: tug'ma nuqsonlar, o'smalar, jarohatlar, o'pka va plevra patologiyasi.",
        icon: p.icon,
        beds: p.beds,
        hasEmergency: p.hasEmergency,
        order,
      };
    },
    toFirestore: order => ({
      slug: THORACIC_DEPARTMENT_SLUG,
      nameRu: preset('Грудная хирургия')?.nameRu ?? 'Грудная хирургия',
      nameUz: preset('Грудная хирургия')?.nameUz ?? "Ko'krak jarrohligi",
      descriptionRu:
        'Грудная хирургия — хирургическое лечение заболеваний органов грудной клетки у детей: врождённые пороки, опухоли, травмы, патология лёгких и плевры.',
      descriptionUz:
        "Ko'krak jarrohligi — bolalarda ko'krak qafasi organlari kasalliklarini jarrohlik davolash: tug'ma nuqsonlar, o'smalar, jarohatlar, o'pka va plevra patologiyasi.",
      icon: preset('Грудная хирургия')?.icon ?? 'activity',
      beds: preset('Грудная хирургия')?.beds ?? 25,
      hasEmergency: preset('Грудная хирургия')?.hasEmergency ?? true,
      order,
      image: '/oborudovanie/Бронхоскопия.jpg',
    }),
  },
  {
    slug: DIAGNOSTICS_DEPARTMENT_SLUG,
    exists: departments =>
      departments.some(
        d =>
          d.slug === DIAGNOSTICS_DEPARTMENT_SLUG ||
          d.nameRu.trim().toLowerCase() === 'диагностика' ||
          (d.nameRu.toLowerCase().includes('диагност') && !d.nameRu.toLowerCase().includes('лаборатор'))
      ),
    build: order => {
      const p = preset('Диагностика') ?? {
        nameRu: 'Диагностика',
        nameUz: 'Diagnostika',
        icon: 'activity',
        beds: 20,
        hasEmergency: false,
      };
      return {
        id: `preset-${DIAGNOSTICS_DEPARTMENT_SLUG}`,
        slug: DIAGNOSTICS_DEPARTMENT_SLUG,
        nameRu: p.nameRu,
        nameUz: p.nameUz,
        descriptionRu:
          'Диагностика — УЗИ, эхокардиография (ЭхоКГ), функциональные и инструментальные исследования для точной постановки диагноза у детей.',
        descriptionUz:
          "Diagnostika — bolalarda aniq tashxis qo'yish uchun UZI, exokardiografiya (EhoKG) va asbob-uskunalar yordamida tekshiruvlar.",
        icon: p.icon,
        beds: p.beds,
        hasEmergency: p.hasEmergency,
        order,
      };
    },
    toFirestore: order => ({
      slug: DIAGNOSTICS_DEPARTMENT_SLUG,
      nameRu: preset('Диагностика')?.nameRu ?? 'Диагностика',
      nameUz: preset('Диагностика')?.nameUz ?? 'Diagnostika',
      descriptionRu:
        'Диагностика — УЗИ, эхокардиография (ЭхоКГ), функциональные и инструментальные исследования для точной постановки диагноза у детей.',
      descriptionUz:
        "Diagnostika — bolalarda aniq tashxis qo'yish uchun UZI, exokardiografiya (EhoKG) va asbob-uskunalar yordamida tekshiruvlar.",
      icon: preset('Диагностика')?.icon ?? 'activity',
      beds: preset('Диагnostika')?.beds ?? 20,
      hasEmergency: preset('Диагностика')?.hasEmergency ?? false,
      order,
      image: '/oborudovanie/УЗИ (всех органов и систем).jpg',
    }),
  },
];

/** Показываем на сайте и в админке, даже если в Firestore ещё нет записи. */
export function mergeRequiredDepartments(departments: DepartmentDoc[]): DepartmentDoc[] {
  let result = [...departments];
  for (const config of REQUIRED_DEPARTMENTS) {
    if (!config.exists(result)) {
      result = [...result, config.build(result.length)];
    }
  }
  return result;
}

/** Создаёт обязательные направления в Firestore при входе в админку. */
export async function ensureRequiredDepartmentsInFirestore(
  departments: DepartmentDoc[],
  saveDepartment: SaveDepartment
): Promise<boolean> {
  let added = false;
  let order = departments.length;

  for (const config of REQUIRED_DEPARTMENTS) {
    if (config.exists(departments)) continue;
    await saveDepartment(config.toFirestore(order));
    departments.push({ id: `new-${config.slug}`, ...config.toFirestore(order) } as DepartmentDoc);
    order += 1;
    added = true;
  }

  return added;
}

/** @deprecated используйте ensureRequiredDepartmentsInFirestore */
export async function ensureThoracicDepartmentInFirestore(
  departments: DepartmentDoc[],
  saveDepartment: SaveDepartment
) {
  return ensureRequiredDepartmentsInFirestore(departments, saveDepartment);
}

export function isThoracicDepartmentSlug(slug: string) {
  return slug === THORACIC_DEPARTMENT_SLUG || slugifyDepartmentSlug('Грудная хирургия', '') === slug;
}

export function isDiagnosticsDepartmentSlug(slug: string) {
  return slug === DIAGNOSTICS_DEPARTMENT_SLUG || slugifyDepartmentSlug('Диагностика', '') === slug;
}
