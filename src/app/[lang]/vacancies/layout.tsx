import { createPageMetadata } from '@/lib/page-metadata';

export const generateMetadata = createPageMetadata('vacancies');

export default function VacanciesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
