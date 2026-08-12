'use client';

import { useState, useEffect } from 'react';
import AdminShell from '@/components/admin/AdminShell';
import {
  getDepartmentsFS,
  saveDepartment,
  updateDepartment,
  deleteDepartment,
  DepartmentDoc,
} from '@/lib/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { slugifyDepartmentSlug } from '@/lib/slugify';
import { Plus, Pencil, Trash2, X, Save } from 'lucide-react';
import Image from 'next/image';

const ICONS = ['stethoscope', 'heart', 'eye', 'ear', 'brain', 'bone', 'baby', 'scissors', 'activity', 'shield'];

import { DEPARTMENT_PRESETS } from '@/data/departmentPresets';
import { mergeRequiredDepartments, ensureRequiredDepartmentsInFirestore } from '@/lib/requiredDepartments';

const DEPT_PRESETS = DEPARTMENT_PRESETS;

function resolveDeptImage(nameRu: string): string | null {
  const n = nameRu.toLowerCase();

  const rules: Array<{ keys: string[]; image: string }> = [
    { keys: ['гнойн', 'детск'], image: '/napravlenia/Гнойная хирургия (детская).jpg' },
    { keys: ['кардиореаним'], image: '/oborudovanie/Мониторы пациента.jpg' },
    { keys: ['реаним'], image: '/oborudovanie/Аппараты ИВЛ (искусственная вентиляция лёгких).jpg' },
    { keys: ['кардиоревмат'], image: '/oborudovanie/Холтеровское мониторирование ЭКГ.jpg' },
    { keys: ['кардиохир'], image: '/oborudovanie/ЭхоКГ (эхокардиография).jpg' },
    { keys: ['грудн', 'торакал'], image: '/oborudovanie/Бронхоскопия.jpg' },
    { keys: ['кардио'], image: '/oborudovanie/ЭКГ (электрокардиография).jpg' },
    { keys: ['офтальм'], image: '/oborudovanie/Офтальмологическая диагностика (ОКТ, периметрия, авторефрактометрия).jpg' },
    { keys: ['травмат'], image: '/oborudovanie/Рентгенография (цифровая).jpg' },
    { keys: ['лор', 'оторинолар'], image: '/oborudovanie/ЛОР-эндоскопия.jpg' },
    { keys: ['пластическ'], image: '/oborudovanie/Операционные микроскопы.jpg' },
    { keys: ['уролог'], image: '/oborudovanie/Цистоскопия.jpg' },
    { keys: ['гнойн'], image: '/oborudovanie/Эндоскопия (ФГДС, колоноскопия).jpg' },
    { keys: ['гинек'], image: '/oborudovanie/УЗИ (всех органов и систем).jpg' },
    { keys: ['пульмон'], image: '/oborudovanie/Бронхоскопия.jpg' },
    { keys: ['неврол'], image: '/oborudovanie/ЭЭГ (электроэнцефалография).jpg' },
    { keys: ['дермат'], image: '/oborudovanie/ПЦР-диагностика.jpg' },
    { keys: ['педиатр'], image: '/oborudovanie/УЗИ (всех органов и систем).jpg' },
    { keys: ['диагност'], image: '/oborudovanie/УЗИ (всех органов и систем).jpg' },
    { keys: ['хирург'], image: '/oborudovanie/Лапароскопическое оборудование.jpg' },
  ];

  for (const rule of rules) {
    if (rule.keys.every(k => n.includes(k))) return rule.image;
  }
  return null;
}

const empty: Omit<DepartmentDoc, 'id'> = {
  slug: '',
  nameRu: '',
  nameUz: '',
  descriptionRu: '',
  descriptionUz: '',
  icon: 'stethoscope',
  image: '',
  beds: undefined,
  hasEmergency: false,
  order: 0,
};

export default function DepartmentsAdminPage() {
  const [items, setItems] = useState<DepartmentDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<null | 'new' | DepartmentDoc>(null);
  const [form, setForm] = useState<Omit<DepartmentDoc, 'id'>>(empty);
  const [saving, setSaving] = useState(false);
  const [importing, setImporting] = useState(false);
  const [syncingPresets, setSyncingPresets] = useState(false);
  const [fillingImages, setFillingImages] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    let data = await getDepartmentsFS().catch(() => []);

    try {
      const added = await ensureRequiredDepartmentsInFirestore(data, saveDepartment);
      if (added) {
        data = await getDepartmentsFS().catch(() => []);
      }
    } catch (e) {
      console.error('ensureRequiredDepartments', e);
    }

    setItems(mergeRequiredDepartments(data));
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

  const openEdit = (item: DepartmentDoc) => {
    setForm({
      slug: item.slug,
      nameRu: item.nameRu,
      nameUz: item.nameUz,
      descriptionRu: item.descriptionRu,
      descriptionUz: item.descriptionUz,
      icon: item.icon,
      image: item.image ?? '',
      beds: item.beds,
      hasEmergency: item.hasEmergency,
      order: item.order ?? 0,
    });
    setModal(item);
  };

  const f = (key: keyof typeof form) => (v: string | number | boolean | undefined) =>
    setForm(prev => ({ ...prev, [key]: v }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const fallbackId = modal && typeof modal === 'object' ? modal.id : undefined;
      const slug = slugifyDepartmentSlug(form.nameRu, form.slug, fallbackId);
      const data = { ...form, slug };
      if (modal === 'new') {
        await saveDepartment(data);
      } else if (modal && typeof modal === 'object') {
        await updateDepartment(modal.id, data);
      }
      setModal(null);
      load();
    } catch (e) {
      console.error(e);
      const msg = e instanceof Error ? e.message : String(e);
      alert(`Ошибка сохранения: ${msg}`);
    } finally {
      setSaving(false);
    }
  };

  const handleImportPresets = async () => {
    setImporting(true);
    for (let i = 0; i < DEPT_PRESETS.length; i++) {
      const p = DEPT_PRESETS[i];
      await saveDepartment({
        slug: slugifyDepartmentSlug(p.nameRu, ''),
        nameRu: p.nameRu,
        nameUz: p.nameUz,
        descriptionRu: '',
        descriptionUz: '',
        icon: p.icon,
        beds: p.beds,
        hasEmergency: p.hasEmergency,
        order: i,
      });
    }
    setImporting(false);
    load();
  };

  const handleSyncMissingPresets = async () => {
    setSyncingPresets(true);
    const existingNames = new Set(items.map(item => item.nameRu.trim().toLowerCase()));
    let added = 0;

    for (let i = 0; i < DEPT_PRESETS.length; i++) {
      const p = DEPT_PRESETS[i];
      if (existingNames.has(p.nameRu.trim().toLowerCase())) continue;

      await saveDepartment({
        slug: slugifyDepartmentSlug(p.nameRu, ''),
        nameRu: p.nameRu,
        nameUz: p.nameUz,
        descriptionRu: '',
        descriptionUz: '',
        icon: p.icon,
        beds: p.beds,
        hasEmergency: p.hasEmergency,
        order: items.length + added,
      });
      added += 1;
    }

    setSyncingPresets(false);
    alert(added > 0 ? `Добавлено направлений: ${added}` : 'Все направления из списка уже есть');
    load();
  };

  const handleDelete = async (id: string) => {
    await deleteDepartment(id);
    setDeleteId(null);
    load();
  };

  const handleFillImages = async () => {
    setFillingImages(true);
    let updated = 0;
    for (const item of items) {
      if (item.image) continue;
      const mapped = resolveDeptImage(item.nameRu);
      if (!mapped) continue;
      await updateDepartment(item.id, { image: mapped });
      updated += 1;
    }
    setFillingImages(false);
    alert(updated > 0 ? `Фото заполнены: ${updated}` : 'Нечего заполнять: либо всё уже заполнено, либо не нашлось совпадений');
    load();
  };

  return (
    <AdminShell>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <h1 className="text-2xl font-bold text-gray-900">Отделения ({items.length})</h1>
          <div className="flex gap-2 flex-wrap">
            {items.length > 0 && (
              <>
                <button
                  onClick={handleSyncMissingPresets}
                  disabled={syncingPresets}
                  className="flex items-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-green-700 disabled:opacity-50"
                >
                  {syncingPresets ? 'Добавляю...' : 'Добавить недостающие'}
                </button>
                <button
                  onClick={handleFillImages}
                  disabled={fillingImages}
                  className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-emerald-700 disabled:opacity-50"
                >
                  {fillingImages ? 'Заполняю фото...' : 'Подставить фото'}
                </button>
              </>
            )}
            {items.length === 0 && (
              <button
                onClick={handleImportPresets}
                disabled={importing}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-green-700 disabled:opacity-50"
              >
                {importing ? 'Импорт...' : 'Загрузить структуру клиники'}
              </button>
            )}
            <button onClick={openNew} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700">
              <Plus size={16} />
              Добавить
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
            <p className="text-gray-400 mb-4">Нажмите «Загрузить структуру клиники» чтобы добавить все 17 отделений автоматически.</p>
            <button onClick={handleImportPresets} disabled={importing} className="bg-green-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-green-700 disabled:opacity-50">
              {importing ? 'Загрузка...' : 'Загрузить структуру клиники'}
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase">#</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase">Отделение</th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-500 text-xs uppercase hidden sm:table-cell">Коек</th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-500 text-xs uppercase hidden md:table-cell">Экстренный</th>
                  <th className="px-4 py-3 w-20"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, i) => (
                  <tr key={item.id} className={`border-t border-gray-50 hover:bg-gray-50 ${i === 0 ? 'border-t-0' : ''}`}>
                    <td className="px-4 py-3 text-gray-400 text-xs">{i + 1}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{item.nameRu}</p>
                      <p className="text-xs text-gray-400">{item.nameUz}</p>
                    </td>
                    <td className="px-4 py-3 text-center hidden sm:table-cell">
                      <span className="text-gray-600">{item.beds ?? '—'}</span>
                    </td>
                    <td className="px-4 py-3 text-center hidden md:table-cell">
                      {item.hasEmergency
                        ? <span className="px-2 py-0.5 bg-red-50 text-red-600 rounded-full text-xs font-medium">Да</span>
                        : <span className="text-gray-300">—</span>
                      }
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        <button onClick={() => openEdit(item)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => setDeleteId(item.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
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

      {/* Modal */}
      {modal !== null && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white">
              <h2 className="font-bold text-gray-900">{modal === 'new' ? 'Новое отделение' : 'Редактировать отделение'}</h2>
              <button onClick={() => setModal(null)} className="p-1.5 rounded-lg hover:bg-gray-100"><X size={18} /></button>
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
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Slug (URL, латиница)</label>
                <input
                  value={form.slug}
                  onChange={e => f('slug')(e.target.value)}
                  placeholder="Авто из названия (RU), если пусто"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none text-xs font-mono"
                />
                <p className="text-xs text-gray-400 mt-1">Пустое поле — slug из русского названия (транслит).</p>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Описание (RU)</label>
                  <textarea value={form.descriptionRu} onChange={e => f('descriptionRu')(e.target.value)} rows={3} className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm resize-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Описание (UZ)</label>
                  <textarea value={form.descriptionUz} onChange={e => f('descriptionUz')(e.target.value)} rows={3} className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm resize-none" />
                </div>
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Иконка</label>
                  <select value={form.icon} onChange={e => f('icon')(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm bg-white">
                    {ICONS.map(i => <option key={i} value={i}>{i}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Количество коек</label>
                  <input type="number" value={form.beds ?? ''} onChange={e => f('beds')(e.target.value === '' ? undefined : Number(e.target.value))} className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm" />
                </div>
                <div className="flex items-end pb-0.5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!form.hasEmergency}
                      onChange={e => f('hasEmergency')(e.target.checked)}
                      className="w-4 h-4 accent-blue-600"
                    />
                    <span className="text-sm text-gray-700">Экстренный пост</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">URL фото</label>
                <input
                  value={form.image ?? ''}
                  onChange={e => f('image')(e.target.value)}
                  placeholder="/oborudovanie/your-image.jpg или https://..."
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                />
                {form.image && (
                  <div className="mt-2 aspect-video relative rounded-xl overflow-hidden border border-gray-100">
                    <Image src={form.image} alt="preview" fill className="object-cover" unoptimized />
                  </div>
                )}
              </div>
            </div>
            <div className="p-5 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={() => setModal(null)} className="px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-600">Отмена</button>
              <button
                onClick={handleSave}
                disabled={saving || !form.nameRu}
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
            <h2 className="font-bold text-gray-900 mb-2">Удалить отделение?</h2>
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
