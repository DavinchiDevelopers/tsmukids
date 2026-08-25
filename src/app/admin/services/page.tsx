'use client';

import { useState, useEffect } from 'react';
import AdminShell from '@/components/admin/AdminShell';
import {
  getServicesFS,
  saveService,
  updateService,
  deleteService,
  ServiceDoc,
} from '@/lib/firestore';
import { deleteAllServicesInFirestore, importServicesBatched, type ServiceSeed } from '@/lib/servicesImport';
import { onAuthStateChanged } from '@/lib/firebase';
import { auth } from '@/lib/firebase';
import { Plus, Pencil, Trash2, X, Save, Database } from 'lucide-react';

const CATEGORIES = [
  { value: 'consultations', label: 'Консультации' },
  { value: 'analyses', label: 'Анализы' },
  { value: 'diagnostics', label: 'Диагностика' },
  { value: 'surgery', label: 'Хирургия' },
  { value: 'procedures', label: 'Процедуры' },
];

const empty: Omit<ServiceDoc, 'id'> = {
  slug: '',
  nameRu: '',
  nameUz: '',
  descriptionRu: '',
  descriptionUz: '',
  category: 'consultations',
  price: undefined,
  durationRu: '',
  durationUz: '',
  order: 0,
};

function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[а-яёa-z0-9]+/gi, m => m)
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/gi, '')
    .slice(0, 60);
}

export default function ServicesAdminPage() {
  const [items, setItems] = useState<ServiceDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCat, setFilterCat] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [modal, setModal] = useState<null | 'new' | ServiceDoc>(null);
  const [form, setForm] = useState<Omit<ServiceDoc, 'id'>>(empty);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [bulkImporting, setBulkImporting] = useState(false);

  const load = async (showLoader = true) => {
    if (showLoader) setLoading(true);
    const data = await getServicesFS().catch(() => []);
    setItems(data);
    if (showLoader) setLoading(false);
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

  const openEdit = (item: ServiceDoc) => {
    setForm({
      slug: item.slug,
      nameRu: item.nameRu,
      nameUz: item.nameUz,
      descriptionRu: item.descriptionRu,
      descriptionUz: item.descriptionUz,
      category: item.category,
      price: item.price,
      durationRu: item.durationRu || '',
      durationUz: item.durationUz || '',
      order: item.order ?? 0,
    });
    setModal(item);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const slug = form.slug || slugify(form.nameRu);
      const data = { ...form, slug };
      if (modal === 'new') {
        await saveService(data);
      } else if (modal && typeof modal === 'object') {
        await updateService(modal.id, data);
      }
      setModal(null);
      await load(false);
    } catch (e) {
      console.error(e);
      const msg = e instanceof Error ? e.message : String(e);
      alert(`Ошибка сохранения: ${msg}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteService(id);
    setDeleteId(null);
    await load(false);
  };

  const handleDeleteAllAndImportPricelist = async () => {
    const msg =
      'Удалить ВСЕ текущие услуги и загрузить полный прайс из /import/services-seed.json? Это действие нельзя отменить.';
    if (typeof window !== 'undefined' && !window.confirm(msg)) return;
    setBulkImporting(true);
    try {
      const r = await fetch('/import/services-seed.json', { cache: 'no-store' });
      if (!r.ok) throw new Error('Не найден /import/services-seed.json — сгенерируйте: python3 scripts/build_services_import.py');
      const raw = (await r.json()) as ServiceSeed[];
      if (!Array.isArray(raw) || raw.length === 0) {
        throw new Error('Пустой или неверный JSON');
      }
      const items: ServiceSeed[] = raw.map((row, i) => ({
        ...row,
        order: row.order ?? i,
        descriptionRu: row.descriptionRu || '',
        descriptionUz: row.descriptionUz || '',
        durationRu: '',
        durationUz: '',
      }));
      const removed = await deleteAllServicesInFirestore();
      await importServicesBatched(items);
      if (typeof window !== 'undefined') {
        window.alert(
          `Готово. Удалено из базы: ${removed}, загружено позиций: ${items.length}.`
        );
      }
      await load(false);
    } catch (e) {
      console.error(e);
      const m = e instanceof Error ? e.message : String(e);
      if (typeof window !== 'undefined') window.alert(`Ошибка импорта: ${m}`);
    } finally {
      setBulkImporting(false);
    }
  };

  const f = (key: keyof typeof form) => (v: string | number | undefined) =>
    setForm(prev => ({ ...prev, [key]: v }));

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filtered = items.filter(s => {
    if (filterCat !== 'all' && s.category !== filterCat) return false;
    if (!normalizedQuery) return true;
    return (
      s.nameRu.toLowerCase().includes(normalizedQuery) ||
      s.nameUz.toLowerCase().includes(normalizedQuery) ||
      s.slug.toLowerCase().includes(normalizedQuery)
    );
  });

  return (
    <AdminShell>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <h1 className="text-2xl font-bold text-gray-900">Услуги ({items.length})</h1>
          <div className="flex gap-2 flex-wrap">
            <button
              type="button"
              onClick={handleDeleteAllAndImportPricelist}
              disabled={bulkImporting}
              className="flex items-center gap-2 bg-amber-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-amber-700 transition-colors disabled:opacity-50"
            >
              <Database size={16} />
              {bulkImporting ? 'Импорт…' : 'Прайс: очистить и загрузить'}
            </button>
            <button
              type="button"
              onClick={openNew}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              <Plus size={16} />
              Добавить
            </button>
          </div>
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap gap-2 mb-5">
          <button
            type="button"
            onClick={() => setFilterCat('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${filterCat === 'all' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-200'}`}
          >
            Все ({items.length})
          </button>
          {CATEGORIES.map(c => (
            <button
              type="button"
              key={c.value}
              onClick={() => setFilterCat(c.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${filterCat === c.value ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-200'}`}
            >
              {c.label} ({items.filter(s => s.category === c.value).length})
            </button>
          ))}
        </div>

        <div className="mb-5">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Поиск по названию или slug..."
            className="w-full sm:max-w-md px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm bg-white"
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
            <p className="text-gray-400">
              Нет услуг. {items.length === 0 ? 'Нажмите «Прайс: очистить и загрузить» или добавьте вручную.' : 'Смените фильтр.'}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase">Название (RU)</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase hidden sm:table-cell">Категория</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-500 text-xs uppercase hidden md:table-cell">Цена</th>
                  <th className="px-4 py-3 w-20"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item, i) => (
                  <tr key={item.id} className={`border-t border-gray-50 hover:bg-gray-50 ${i === 0 ? 'border-t-0' : ''}`}>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{item.nameRu}</p>
                      <p className="text-xs text-gray-400 mt-0.5 truncate max-w-xs">{item.nameUz}</p>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs">
                        {CATEGORIES.find(c => c.value === item.category)?.label || item.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right hidden md:table-cell">
                      {item.price != null
                        ? <span className="text-blue-600 font-medium">{item.price.toLocaleString('ru-RU')} сум</span>
                        : <span className="text-gray-400 italic">По запросу</span>
                      }
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        <button
                          type="button"
                          onClick={() => openEdit(item)}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteId(item.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit/New Modal */}
      {modal !== null && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white">
              <h2 className="font-bold text-gray-900">{modal === 'new' ? 'Новая услуга' : 'Редактировать услугу'}</h2>
              <button type="button" onClick={() => setModal(null)} className="p-1.5 rounded-lg hover:bg-gray-100">
                <X size={18} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Название (RU)</label>
                  <input value={form.nameRu} onChange={e => f('nameRu')(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Название (UZ)</label>
                  <input value={form.nameUz} onChange={e => f('nameUz')(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Описание (RU)</label>
                  <textarea value={form.descriptionRu} onChange={e => f('descriptionRu')(e.target.value)} rows={2} className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm resize-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Описание (UZ)</label>
                  <textarea value={form.descriptionUz} onChange={e => f('descriptionUz')(e.target.value)} rows={2} className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm resize-none" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Категория</label>
                  <select value={form.category} onChange={e => f('category')(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm bg-white">
                    {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">
                    Цена (сум, пусто = по запросу)
                  </label>
                  <input
                    type="number"
                    value={form.price ?? ''}
                    onChange={e => f('price')(e.target.value === '' ? undefined : Number(e.target.value))}
                    placeholder="Оставьте пустым"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                  />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Длительность (RU)</label>
                  <input value={form.durationRu || ''} onChange={e => f('durationRu')(e.target.value)} placeholder="30 минут" className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Длительность (UZ)</label>
                  <input value={form.durationUz || ''} onChange={e => f('durationUz')(e.target.value)} placeholder="30 daqiqa" className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm" />
                </div>
              </div>
            </div>
            <div className="p-5 border-t border-gray-100 flex justify-end gap-3">
              <button type="button" onClick={() => setModal(null)} className="px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50">
                Отмена
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving || !form.nameRu}
                className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <Save size={14} />
                {saving ? 'Сохранение...' : 'Сохранить'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h2 className="font-bold text-gray-900 mb-2">Удалить услугу?</h2>
            <p className="text-gray-500 text-sm mb-5">Это действие нельзя отменить.</p>
            <div className="flex gap-3 justify-end">
              <button type="button" onClick={() => setDeleteId(null)} className="px-4 py-2 rounded-xl border border-gray-200 text-sm">Отмена</button>
              <button
                type="button"
                onClick={() => handleDelete(deleteId)}
                className="px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-medium hover:bg-red-700"
              >
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
