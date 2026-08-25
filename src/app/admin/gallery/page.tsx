'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import AdminShell from '@/components/admin/AdminShell';
import {
  getGalleryFS,
  saveGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
  GalleryDoc,
} from '@/lib/firestore';
import { onAuthStateChanged } from '@/lib/firebase';
import { auth } from '@/lib/firebase';
import { Plus, Pencil, Trash2, X, Save } from 'lucide-react';

const empty: Omit<GalleryDoc, 'id'> = {
  category: 'clinic',
  titleRu: '',
  titleUz: '',
  image: '',
  order: 0,
};

const CATEGORY_OPTIONS: Array<{ value: GalleryDoc['category']; label: string }> = [
  { value: 'clinic', label: 'Клиника' },
  { value: 'rooms', label: 'Палаты' },
  { value: 'equipment', label: 'Оборудование' },
  { value: 'team', label: 'Команда' },
];

export default function GalleryAdminPage() {
  const [items, setItems] = useState<GalleryDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<null | 'new' | GalleryDoc>(null);
  const [form, setForm] = useState<Omit<GalleryDoc, 'id'>>(empty);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const data = await getGalleryFS().catch(() => []);
    setItems(data);
    setLoading(false);
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, user => {
      if (user) load();
    });
    return unsub;
  }, []);

  const openNew = () => {
    setForm({ ...empty, order: items.length });
    setModal('new');
  };

  const openEdit = (item: GalleryDoc) => {
    setForm({
      category: item.category,
      titleRu: item.titleRu,
      titleUz: item.titleUz,
      image: item.image,
      order: item.order ?? 0,
    });
    setModal(item);
  };

  const f = (key: keyof typeof form) => (v: string | number) =>
    setForm(prev => ({ ...prev, [key]: v }));

  const handleSave = async () => {
    setSaving(true);
    if (modal === 'new') {
      await saveGalleryItem(form);
    } else if (modal && typeof modal === 'object') {
      await updateGalleryItem(modal.id, form);
    }
    setSaving(false);
    setModal(null);
    load();
  };

  const handleDelete = async (id: string) => {
    await deleteGalleryItem(id);
    setDeleteId(null);
    load();
  };

  return (
    <AdminShell>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <h1 className="text-2xl font-bold text-gray-900">Галерея ({items.length})</h1>
          <button
            onClick={openNew}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700"
          >
            <Plus size={16} />
            Добавить фото
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
            <p className="text-gray-400 mb-4">Фотографии пока не добавлены.</p>
            <button onClick={openNew} className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700">
              Добавить первое фото
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map(item => (
              <div key={item.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="aspect-video relative bg-gray-100">
                  {item.image ? (
                    <Image src={item.image} alt={item.titleRu} fill className="object-cover" unoptimized />
                  ) : null}
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 text-sm">{item.titleRu}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{CATEGORY_OPTIONS.find(c => c.value === item.category)?.label}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button onClick={() => openEdit(item)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => setDeleteId(item.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {modal !== null && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white">
              <h2 className="font-bold text-gray-900">{modal === 'new' ? 'Новое фото' : 'Редактировать фото'}</h2>
              <button onClick={() => setModal(null)} className="p-1.5 rounded-lg hover:bg-gray-100"><X size={18} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Категория</label>
                <select
                  value={form.category}
                  onChange={e => f('category')(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm bg-white"
                >
                  {CATEGORY_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Название (RU)</label>
                  <input value={form.titleRu} onChange={e => f('titleRu')(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Название (UZ)</label>
                  <input value={form.titleUz} onChange={e => f('titleUz')(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">URL фото</label>
                <input value={form.image} onChange={e => f('image')(e.target.value)} placeholder="https://..." className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm" />
                {form.image && (
                  <div className="mt-2 aspect-video relative rounded-xl overflow-hidden border border-gray-100">
                    <Image src={form.image} alt="preview" fill className="object-cover" unoptimized />
                  </div>
                )}
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Порядок</label>
                <input
                  type="number"
                  value={form.order ?? 0}
                  onChange={e => f('order')(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                />
              </div>
            </div>
            <div className="p-5 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={() => setModal(null)} className="px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-600">Отмена</button>
              <button
                onClick={handleSave}
                disabled={saving || !form.titleRu || !form.image}
                className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
              >
                <Save size={14} />
                {saving ? 'Сохранение...' : 'Сохранить'}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h2 className="font-bold text-gray-900 mb-2">Удалить фото?</h2>
            <p className="text-gray-500 text-sm mb-5">Это действие нельзя отменить.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeleteId(null)} className="px-4 py-2 rounded-xl border border-gray-200 text-sm">Отмена</button>
              <button onClick={() => handleDelete(deleteId)} className="px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-medium hover:bg-red-700">Удалить</button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
