'use client';

import { useState, useEffect } from 'react';
import AdminShell from '@/components/admin/AdminShell';
import {
  getDoctorsFS,
  getDepartmentsFS,
  saveDoctor,
  saveDepartment,
  updateDoctor,
  deleteDoctor,
  DoctorDoc,
  DepartmentDoc,
} from '@/lib/firestore';
import { onAuthStateChanged } from '@/lib/firebase';
import { auth } from '@/lib/firebase';
import { slugifyDoctorSlug } from '@/lib/slugify';
import { mergeRequiredDepartments, ensureRequiredDepartmentsInFirestore } from '@/lib/requiredDepartments';
import { Plus, Pencil, Trash2, X, Save } from 'lucide-react';

const empty: Omit<DoctorDoc, 'id'> = {
  slug: '',
  nameRu: '',
  nameUz: '',
  specialtyRu: '',
  specialtyUz: '',
  experienceRu: '',
  experienceUz: '',
  bioRu: '',
  bioUz: '',
  department: '',
  photo: '',
  order: 0,
};

export default function DoctorsAdminPage() {
  const [items, setItems] = useState<DoctorDoc[]>([]);
  const [departments, setDepartments] = useState<DepartmentDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<null | 'new' | DoctorDoc>(null);
  const [form, setForm] = useState<Omit<DoctorDoc, 'id'>>(empty);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const [data, depts0] = await Promise.all([
      getDoctorsFS().catch(() => [] as DoctorDoc[]),
      getDepartmentsFS().catch(() => [] as DepartmentDoc[]),
    ]);

    let depts = depts0;
    try {
      const added = await ensureRequiredDepartmentsInFirestore(depts, saveDepartment);
      if (added) {
        depts = await getDepartmentsFS().catch(() => [] as DepartmentDoc[]);
      }
    } catch (e) {
      console.error('ensureRequiredDepartments', e);
    }

    depts = mergeRequiredDepartments(depts);
    setItems(data);
    setDepartments(depts);
    setLoading(false);
  };

  const departmentLabel = (slug: string) =>
    departments.find(d => d.slug === slug)?.nameRu || slug || '—';

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, user => {
      if (user) load();
    });
    return unsub;
  }, []);

  const openNew = () => {
    setForm({
      ...empty,
      order: items.length,
      department: departments[0]?.slug ?? '',
    });
    setModal('new');
  };

  const openEdit = (item: DoctorDoc) => {
    setForm({
      slug: item.slug,
      nameRu: item.nameRu,
      nameUz: item.nameUz,
      specialtyRu: item.specialtyRu,
      specialtyUz: item.specialtyUz,
      experienceRu: item.experienceRu,
      experienceUz: item.experienceUz,
      bioRu: item.bioRu,
      bioUz: item.bioUz,
      department: item.department,
      photo: item.photo,
      order: item.order ?? 0,
    });
    setModal(item);
  };

  const f = (key: keyof typeof form) => (v: string) =>
    setForm(prev => ({ ...prev, [key]: v }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const fallbackId = modal && typeof modal === 'object' ? modal.id : undefined;
      const slug = slugifyDoctorSlug(form.nameRu, form.slug, fallbackId);
      if (!form.department) {
        alert('Выберите направление (отделение) для врача');
        setSaving(false);
        return;
      }
      const data = { ...form, slug };
      if (modal === 'new') {
        await saveDoctor(data);
      } else if (modal && typeof modal === 'object') {
        await updateDoctor(modal.id, data);
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

  const handleDelete = async (id: string) => {
    await deleteDoctor(id);
    setDeleteId(null);
    load();
  };

  return (
    <AdminShell>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <h1 className="text-2xl font-bold text-gray-900">Врачи ({items.length})</h1>
          <button
            onClick={openNew}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <Plus size={16} />
            Добавить врача
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
            <p className="text-gray-400 mb-4">Врачей пока нет. Добавьте первого врача.</p>
            <button onClick={openNew} className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700">
              Добавить врача
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase">ФИО</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase hidden sm:table-cell">Специальность</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase hidden md:table-cell">Направление</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase hidden lg:table-cell">Стаж</th>
                  <th className="px-4 py-3 w-20"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, i) => (
                  <tr key={item.id} className={`border-t border-gray-50 hover:bg-gray-50 ${i === 0 ? 'border-t-0' : ''}`}>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{item.nameRu}</p>
                      <p className="text-xs text-gray-400">{item.nameUz}</p>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="text-gray-600">{item.specialtyRu}</span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-gray-600 text-xs">{departmentLabel(item.department)}</span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="text-gray-500">{item.experienceRu}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        <button
                          onClick={() => openEdit(item)}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
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
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white z-10">
              <h2 className="font-bold text-gray-900">{modal === 'new' ? 'Новый врач' : 'Редактировать врача'}</h2>
              <button onClick={() => setModal(null)} className="p-1.5 rounded-lg hover:bg-gray-100">
                <X size={18} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">ФИО (RU)</label>
                  <input value={form.nameRu} onChange={e => f('nameRu')(e.target.value)} placeholder="Иванов Иван Иванович" className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">ФИО (UZ)</label>
                  <input value={form.nameUz} onChange={e => f('nameUz')(e.target.value)} placeholder="Ivanov Ivan Ivanovich" className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Slug (URL, латиница)</label>
                <input
                  value={form.slug}
                  onChange={e => f('slug')(e.target.value)}
                  placeholder="Авто из ФИО (RU), если пусто"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none text-xs font-mono"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Пример: <span className="font-mono">ivanov-ivan</span>. Оставьте пустым — сформируется из русского ФИО.
                </p>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Специальность (RU)</label>
                  <input value={form.specialtyRu} onChange={e => f('specialtyRu')(e.target.value)} placeholder="Хирург" className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Специальность (UZ)</label>
                  <input value={form.specialtyUz} onChange={e => f('specialtyUz')(e.target.value)} placeholder="Jarroh" className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Стаж (RU)</label>
                  <input value={form.experienceRu} onChange={e => f('experienceRu')(e.target.value)} placeholder="15 лет" className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Стаж (UZ)</label>
                  <input value={form.experienceUz} onChange={e => f('experienceUz')(e.target.value)} placeholder="15 yil" className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Направление *</label>
                <select
                  value={form.department}
                  onChange={e => f('department')(e.target.value)}
                  required
                  disabled={departments.length === 0}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm bg-white disabled:opacity-60"
                >
                  <option value="">
                    {departments.length === 0 ? 'Сначала добавьте направления' : 'Выберите направление'}
                  </option>
                  {departments.map(d => (
                    <option key={d.id} value={d.slug}>{d.nameRu}</option>
                  ))}
                  {form.department &&
                    !departments.some(d => d.slug === form.department) && (
                      <option value={form.department}>{form.department} (устаревшее)</option>
                    )}
                </select>
                <p className="text-xs text-gray-400 mt-1">
                  Slug направления должен совпадать с URL страницы — врач появится в блоке «Врачи отделения».
                </p>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Биография (RU)</label>
                  <textarea value={form.bioRu} onChange={e => f('bioRu')(e.target.value)} rows={3} className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm resize-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Биография (UZ)</label>
                  <textarea value={form.bioUz} onChange={e => f('bioUz')(e.target.value)} rows={3} className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm resize-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">URL фото</label>
                <input value={form.photo} onChange={e => f('photo')(e.target.value)} placeholder="https://... или /images/doctors/..." className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm" />
              </div>
            </div>
            <div className="p-5 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={() => setModal(null)} className="px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50">Отмена</button>
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

      {/* Delete confirm */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h2 className="font-bold text-gray-900 mb-2">Удалить врача?</h2>
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
