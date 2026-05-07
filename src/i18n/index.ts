import ru from './ru';
import uz from './uz';
import { Lang } from '@/types';

export const translations = { ru, uz };

export function getT(lang: Lang) {
  return translations[lang] ?? translations.ru;
}

export const defaultLang: Lang = 'ru';
export const langs: Lang[] = ['ru', 'uz'];
