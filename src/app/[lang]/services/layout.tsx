import { createPageMetadata } from '@/lib/page-metadata';

export const generateMetadata = createPageMetadata('services');

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
