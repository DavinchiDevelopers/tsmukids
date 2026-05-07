import { doctors as staticDoctors } from '@/data/doctors';
import { getDoctorsFS } from '@/lib/firestore';
import DoctorPageClient from './DoctorPageClient';

interface DoctorPageProps {
  params: Promise<{ lang: string; slug: string }>;
}

export async function generateStaticParams() {
  const legacySlugs = [
    'yusupov-otabek',
    'rashidov-bobur',
    'hasanova-nilufar',
    'karimova-zulayho',
  ];
  const fromStatic = staticDoctors.map(d => d.slug);
  let fromFirestore: string[] = [];
  try {
    const docs = await getDoctorsFS();
    fromFirestore = docs.map(d => (d.slug || '').trim()).filter(Boolean);
  } catch {
    /* офлайн-сборка или недоступен Firestore */
  }
  const unique = new Set([...fromStatic, ...legacySlugs, ...fromFirestore]);
  return Array.from(unique).map(slug => ({ slug }));
}

export default async function DoctorPage({ params }: DoctorPageProps) {
  const { lang, slug } = await params;
  return <DoctorPageClient lang={lang} slug={slug} />;
}
