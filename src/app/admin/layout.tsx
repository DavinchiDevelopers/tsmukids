import type { Metadata } from 'next';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: 'Админ-панель',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100">
      {children}
    </div>
  );
}
