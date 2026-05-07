import { departments as staticDepartments } from '@/data/departments';
import { getDepartmentsFS } from '@/lib/firestore';
import DepartmentPageClient from './DepartmentPageClient';

interface DepartmentPageProps {
  params: Promise<{ lang: string; slug: string }>;
}

export async function generateStaticParams() {
  const fromStatic = staticDepartments.map(d => d.slug);
  let fromFirestore: string[] = [];
  try {
    const docs = await getDepartmentsFS();
    fromFirestore = docs.map(d => (d.slug || '').trim()).filter(Boolean);
  } catch {
    /* офлайн-сборка или недоступен Firestore */
  }
  const unique = new Set([...fromStatic, ...fromFirestore]);
  return Array.from(unique).map(slug => ({ slug }));
}

export default async function DepartmentPage({ params }: DepartmentPageProps) {
  const { lang, slug } = await params;
  return <DepartmentPageClient lang={lang} slug={slug} />;
}
