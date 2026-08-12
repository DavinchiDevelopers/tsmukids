import { createPageMetadata } from '@/lib/page-metadata';

export const generateMetadata = createPageMetadata('departments');

export default function DepartmentsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
