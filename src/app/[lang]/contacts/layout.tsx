import { createPageMetadata } from '@/lib/page-metadata';

export const generateMetadata = createPageMetadata('contacts');

export default function ContactsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
