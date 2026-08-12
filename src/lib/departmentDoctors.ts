import { DepartmentDoc, DoctorDoc } from '@/lib/firestore';

const specialtyTermsByDepartment: Record<string, string[]> = {
  'cardiac-surgery': ['кардиохирург', 'kardiojarroh', 'kardiojarrohlik'],
  'thoracic-surgery': ['грудн', 'торакал', 'torakal', 'ko\'krak jarroh'],
  'plastic-surgery': ['пластическ', 'plastik'],
  'purulent-surgery': ['гнойн', 'yiringli'],
  ophthalmology: ['офтальмолог', 'oftalmolog'],
  traumatology: ['травматолог', 'travmatolog'],
  ent: ['лор', 'оториноларинголог', 'lor', 'otorinolaringolog'],
  urology: ['уролог', 'urolog'],
  gynecology: ['гинеколог', 'ginekolog'],
  pulmonology: ['пульмонолог', 'pulmonolog'],
  cardiorheumatology: ['кардио-ревматолог', 'кардиоревматолог', 'kardiorevmatolog'],
  neurology: ['невролог', 'nevrolog'],
  dermatology: ['дерматолог', 'dermatolog'],
  pediatrics: ['педиатр', 'pediatr'],
  diagnostics: [
    'диагност',
    'diagnost',
    'узи',
    'uzi',
    'эхокг',
    'эхо',
    'ehokg',
    'ehokardiograf',
    'эхограф',
    'ekograf',
    'sonograf',
    'sonographer',
  ],
  reanimation: ['реаниматолог', 'анестезиолог', 'reanimatolog', 'anesteziolog'],
  surgery: ['хирург', 'jarroh'],
};

const generalSurgeryExclusions = [
  'пластическ',
  'кардиохирург',
  'кардио',
  'гнойн',
  'грудн',
  'торакал',
  'torakal',
  'plastik',
  'kardio',
  'yiringli',
];

/** Старые slug из демо-данных → канонические slug направлений */
const legacyDepartmentSlugMap: Record<string, string> = {
  cardiology: 'cardiac-surgery',
  gastroenterology: 'diagnostics',
  endocrinology: 'diagnostics',
};

function normalizeText(value?: string) {
  return (value ?? '').trim().toLowerCase();
}

export function inferCanonicalDepartmentSlug(dept: DepartmentDoc) {
  const value = normalizeText(`${dept.slug} ${dept.nameRu} ${dept.nameUz}`);
  const rules: Array<{ slug: string; terms: string[] }> = [
    { slug: 'cardiac-surgery', terms: ['cardiac-surgery', 'kardiojarrohlik', 'кардиохирург', 'kardiohirurg'] },
    { slug: 'thoracic-surgery', terms: ['thoracic-surgery', 'grudnaya-hirurgiya', 'грудн', 'torakal', 'торакал', 'ko\'krak'] },
    { slug: 'plastic-surgery', terms: ['plastic-surgery', 'plasticheskaya-hirurgiya', 'пластическ', 'plastik'] },
    { slug: 'purulent-surgery', terms: ['purulent-surgery', 'gnoynaya-hirurgiya', 'гнойн', 'yiringli'] },
    { slug: 'ophthalmology', terms: ['ophthalmology', 'oftalmologiya', 'офтальмолог'] },
    { slug: 'traumatology', terms: ['traumatology', 'travmatologiya', 'травматолог'] },
    { slug: 'ent', terms: ['ent', 'lor', 'otorinolaringologiya', 'оториноларинголог', 'лор'] },
    { slug: 'urology', terms: ['urology', 'urologiya', 'уролог'] },
    { slug: 'gynecology', terms: ['gynecology', 'ginekologiya', 'гинеколог'] },
    { slug: 'pulmonology', terms: ['pulmonology', 'pulmonologiya', 'пульмонолог'] },
    { slug: 'cardiorheumatology', terms: ['cardiorheumatology', 'kardiorevmatologiya', 'кардиоревматолог'] },
    { slug: 'neurology', terms: ['neurology', 'nevrologiya', 'невролог'] },
    { slug: 'dermatology', terms: ['dermatology', 'dermatologiya', 'дерматолог'] },
    { slug: 'pediatrics', terms: ['pediatrics', 'pediatriya', 'педиатр'] },
    {
      slug: 'diagnostics',
      terms: ['diagnostics', 'diagnostika', 'диагност', 'узи', 'uzi', 'эхокг', 'ehokg', 'эхограф', 'ekograf'],
    },
    { slug: 'reanimation', terms: ['reanimation', 'reanimatsiya', 'реанимац'] },
    { slug: 'surgery', terms: ['surgery', 'hirurgiya', 'хирург'] },
  ];

  return rules.find(rule => rule.terms.some(term => value.includes(term)))?.slug ?? dept.slug;
}

function departmentAliases(dept: DepartmentDoc, canonicalSlug: string) {
  return [...new Set([dept.slug, canonicalSlug, dept.nameRu, dept.nameUz].map(normalizeText).filter(Boolean))];
}

function normalizeDoctorDepartment(department?: string) {
  const normalized = normalizeText(department);
  if (!normalized) return '';
  return legacyDepartmentSlugMap[normalized] ?? normalized;
}

function matchesDepartmentBySpecialty(doctor: DoctorDoc, deptSlug: string) {
  const terms = specialtyTermsByDepartment[deptSlug] ?? [];
  if (terms.length === 0) return false;

  const specialty = normalizeText(`${doctor.specialtyRu} ${doctor.specialtyUz}`);
  if (deptSlug === 'surgery' && generalSurgeryExclusions.some(term => specialty.includes(term))) {
    return false;
  }

  return terms.some(term => specialty.includes(term));
}

export function getDoctorsForDepartment(dept: DepartmentDoc, doctors: DoctorDoc[]): DoctorDoc[] {
  const canonicalDeptSlug = inferCanonicalDepartmentSlug(dept);
  const currentDeptNames = departmentAliases(dept, canonicalDeptSlug);
  const doctorSlugs = ((dept as { doctorSlugs?: string[] }).doctorSlugs ?? []).map(normalizeText);

  return doctors.filter(doctor => {
    const doctorDepartment = normalizeDoctorDepartment(doctor.department);
    const doctorSlug = normalizeText(doctor.slug);

    if (doctorDepartment && currentDeptNames.includes(doctorDepartment)) return true;
    if (doctorSlugs.includes(doctorSlug)) return true;
    if (doctorDepartment) return false;

    return matchesDepartmentBySpecialty(doctor, canonicalDeptSlug);
  });
}
