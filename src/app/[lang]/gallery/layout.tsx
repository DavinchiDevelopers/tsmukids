import { createPageMetadata } from '@/lib/page-metadata';

export const generateMetadata = createPageMetadata('gallery');

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
