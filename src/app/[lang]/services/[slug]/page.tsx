import { services as staticServices } from '@/data/services';
import { getServicesFS } from '@/lib/firestore';
import ServicePageClient from './ServicePageClient';

interface ServicePageProps {
  params: Promise<{ lang: string; slug: string }>;
}

export async function generateStaticParams() {
  const fromStatic = staticServices.map(s => s.slug);
  let fromFirestore: string[] = [];
  try {
    const docs = await getServicesFS();
    fromFirestore = docs.map(d => (d.slug || '').trim()).filter(Boolean);
  } catch {
    /* офлайн-сборка */
  }
  const unique = new Set([...fromStatic, ...fromFirestore]);
  return Array.from(unique).map(slug => ({ slug }));
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { lang, slug } = await params;
  return <ServicePageClient lang={lang} slug={slug} />;
}
