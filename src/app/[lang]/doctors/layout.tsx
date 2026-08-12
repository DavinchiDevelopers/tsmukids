import { createPageMetadata } from '@/lib/page-metadata';

export const generateMetadata = createPageMetadata('doctors');

export default function DoctorsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
