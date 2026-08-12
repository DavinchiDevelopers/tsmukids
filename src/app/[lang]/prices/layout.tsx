import { createPageMetadata } from '@/lib/page-metadata';

export const generateMetadata = createPageMetadata('prices');

export default function PricesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
