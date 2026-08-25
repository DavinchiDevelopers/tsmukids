'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { onAuthStateChanged, signOut } from '@/lib/firebase';
import { auth } from '@/lib/firebase';
import Logo from '@/components/layout/Logo';
import { SITE_NAME_RU } from '@/lib/branding';
import { Settings, Stethoscope, Users, Building2, LogOut, LayoutDashboard, Menu, Monitor, Images, Inbox } from 'lucide-react';

const navItems = [
  { href: '/admin/dashboard', label: 'Главная', icon: LayoutDashboard },
  { href: '/admin/appointments', label: 'Заявки', icon: Inbox },
  { href: '/admin/settings', label: 'Настройки', icon: Settings },
  { href: '/admin/services', label: 'Услуги', icon: Stethoscope },
  { href: '/admin/doctors', label: 'Врачи', icon: Users },
  { href: '/admin/departments', label: 'Отделения', icon: Building2 },
  { href: '/admin/equipment', label: 'Оборудование', icon: Monitor },
  { href: '/admin/gallery', label: 'Галерея', icon: Images },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, user => {
      if (!user) {
        router.replace('/admin');
      } else {
        setReady(true);
      }
    });
    return unsub;
  }, [router]);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const handleLogout = async () => {
    await signOut(auth);
    router.replace('/admin');
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-xl flex flex-col transition-transform duration-200
        lg:translate-x-0 lg:static lg:shadow-none
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <Logo alt={`Логотип ${SITE_NAME_RU}`} size="sm" />
            <div className="min-w-0">
              <p className="font-bold text-gray-900 text-sm leading-tight">TSMU</p>
              <p className="text-xs text-gray-500 leading-tight">Детская клиника</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                pathname === href
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors w-full"
          >
            <LogOut size={18} />
            Выйти
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <header className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
          <button onClick={() => setSidebarOpen(true)} className="p-1.5 rounded-lg hover:bg-gray-100">
            <Menu size={20} />
          </button>
          <span className="font-semibold text-gray-900 text-sm">Панель управления</span>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
