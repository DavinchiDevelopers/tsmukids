'use client';

import { useEffect, useState } from 'react';
import AdminShell from '@/components/admin/AdminShell';
import { getAppointmentsFS, deleteAppointment, AppointmentRequestDoc } from '@/lib/firestore';
import { Phone, Trash2, RefreshCw } from 'lucide-react';

function formatDate(value?: string) {
  if (!value) return '—';
  try {
    return new Date(value).toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return value;
  }
}

export default function AppointmentsAdminPage() {
  const [items, setItems] = useState<AppointmentRequestDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getAppointmentsFS();
      setItems(data);
    } catch {
      setError('Не удалось загрузить заявки. Проверьте правила Firestore и авторизацию.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить заявку?')) return;
    try {
      await deleteAppointment(id);
      setItems(prev => prev.filter(item => item.id !== id));
    } catch {
      alert('Не удалось удалить заявку');
    }
  };

  return (
    <AdminShell>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Заявки на приём</h1>
            <p className="text-gray-500 text-sm mt-1">Заявки с формы записи на сайте</p>
          </div>
          <button
            type="button"
            onClick={load}
            disabled={loading}
            className="inline-flex items-center gap-2 text-sm bg-white border border-gray-200 px-4 py-2 rounded-xl hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Обновить
          </button>
        </div>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-500">
            Заявок пока нет
          </div>
        ) : (
          <div className="space-y-3">
            {items.map(item => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-start gap-4"
              >
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-semibold text-gray-900">{item.name}</h2>
                    <span className="text-xs uppercase tracking-wide bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                      {item.lang}
                    </span>
                  </div>
                  <a
                    href={`tel:${item.phone.replace(/\s/g, '')}`}
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    <Phone size={14} />
                    {item.phone}
                  </a>
                  {item.message && (
                    <p className="text-sm text-gray-600 whitespace-pre-wrap">{item.message}</p>
                  )}
                  <p className="text-xs text-gray-400">
                    {formatDate(item.createdAt)}
                    {item.consentGiven ? ' · согласие на ПДн получено' : ''}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  className="self-start inline-flex items-center gap-1.5 text-sm text-red-600 hover:text-red-700 px-3 py-2 rounded-lg hover:bg-red-50"
                >
                  <Trash2 size={16} />
                  Удалить
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminShell>
  );
}
