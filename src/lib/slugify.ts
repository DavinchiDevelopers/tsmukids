/** Латиница для URL: кириллица (рус/узб кирил) → латиница, остальное убираем */
const CYR_TO_LAT: Record<string, string> = {
  а: 'a',
  б: 'b',
  в: 'v',
  г: 'g',
  д: 'd',
  е: 'e',
  ё: 'yo',
  ж: 'zh',
  з: 'z',
  и: 'i',
  й: 'y',
  к: 'k',
  л: 'l',
  м: 'm',
  н: 'n',
  о: 'o',
  п: 'p',
  р: 'r',
  с: 's',
  т: 't',
  у: 'u',
  ф: 'f',
  х: 'h',
  ц: 'ts',
  ч: 'ch',
  ш: 'sh',
  щ: 'sch',
  ъ: '',
  ы: 'y',
  ь: '',
  э: 'e',
  ю: 'yu',
  я: 'ya',
  ў: 'o',
  қ: 'q',
  ғ: 'g',
  ҳ: 'h',
  ӣ: 'i',
  ӯ: 'u',
};

function transliterateChar(c: string): string {
  const lower = c.toLowerCase();
  const mapped = CYR_TO_LAT[lower];
  if (mapped !== undefined) return mapped;
  if (/[a-z0-9]/.test(lower)) return lower;
  return '';
}

export type CmsSlugKind = 'doctor' | 'dept';

/**
 * Slug для URL (врач, отделение и т.д.): кириллица → латиница, без пустых / только дефисов.
 */
export function slugifyCmsSlug(
  nameRu: string,
  explicitSlug: string,
  kind: CmsSlugKind,
  fallbackId?: string
): string {
  const raw = (explicitSlug || '').trim() || nameRu;
  let s = raw
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/_/g, '-')
    .split('')
    .map(c => (c === '-' ? '-' : transliterateChar(c)))
    .join('')
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60);

  const prefix = kind === 'doctor' ? 'doctor' : 'dept';
  if (!s || /^-+$/.test(s)) {
    s = fallbackId ? `${prefix}-${fallbackId.slice(0, 20)}` : `${prefix}-${Date.now().toString(36)}`;
  }
  return s;
}

export function slugifyDoctorSlug(nameRu: string, explicitSlug: string, fallbackId?: string): string {
  return slugifyCmsSlug(nameRu, explicitSlug, 'doctor', fallbackId);
}

export function slugifyDepartmentSlug(nameRu: string, explicitSlug: string, fallbackId?: string): string {
  return slugifyCmsSlug(nameRu, explicitSlug, 'dept', fallbackId);
}
