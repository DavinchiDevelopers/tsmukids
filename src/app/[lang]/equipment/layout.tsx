import { createPageMetadata } from '@/lib/page-metadata';

export const generateMetadata = createPageMetadata('equipment');

export default function EquipmentLayout({ children }: { children: React.ReactNode }) {
  return children;
}
