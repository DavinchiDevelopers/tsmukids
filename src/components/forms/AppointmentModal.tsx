'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Lang } from '@/types';
import { getT } from '@/i18n';
import { useSiteData } from '@/contexts/SiteDataContext';
import { saveAppointmentRequest } from '@/lib/firestore';

interface AppointmentModalProps {
  lang: Lang;
}

export default function AppointmentModal({ lang }: AppointmentModalProps) {
  const t = getT(lang);
  const { services, doctors, settings } = useSiteData();
  const [visible, setVisible] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [form, setForm] = useState({ name: '', phone: '', service: '', doctor: '', message: '' });

  useEffect(() => {
    const modal = document.getElementById('appointment-modal');
    if (!modal) return;
    const observer = new MutationObserver(() => {
      setVisible(modal.style.display === 'flex');
    });
    observer.observe(modal, { attributes: true, attributeFilter: ['style'] });
    return () => observer.disconnect();
  }, []);

  const close = () => {
    const el = document.getElementById('appointment-modal');
    if (el) el.style.display = 'none';
    setTimeout(() => setSubmitted(false), 500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSubmitError('');

    const serviceName = services.find(s => s.slug === form.service);
    const doctorName = doctors.find(d => d.slug === form.doctor);
    const payload = {
      ...form,
      lang,
      serviceLabel: serviceName ? (lang === 'ru' ? serviceName.nameRu : serviceName.nameUz) : '',
      doctorLabel: doctorName ? (lang === 'ru' ? doctorName.nameRu : doctorName.nameUz) : '',
      createdAt: new Date().toISOString(),
    };

    try {
      await saveAppointmentRequest({
        name: form.name,
        phone: form.phone,
        service: payload.serviceLabel || form.service,
        doctor: payload.doctorLabel || form.doctor,
        message: form.message,
        lang,
        createdAt: payload.createdAt,
      });

      const webhooks = [settings.appointmentTelegramWebhook, settings.appointmentEmailWebhook].filter(Boolean);
      if (webhooks.length > 0) {
        await Promise.allSettled(
          webhooks.map((url) =>
            fetch(url as string, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload),
            })
          )
        );
      }

      setSubmitted(true);
      setForm({ name: '', phone: '', service: '', doctor: '', message: '' });
    } catch {
      setSubmitError(lang === 'ru' ? 'Не удалось отправить заявку. Попробуйте еще раз.' : "So'rov yuborilmadi. Qayta urinib ko'ring.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="appointment-modal"
      style={{ display: 'none' }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      onClick={(e) => { if (e.target === e.currentTarget) close(); }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={close} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">{t.appointment.title}</h2>
          <button onClick={close} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {submitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-gray-700 font-medium">{t.appointment.success}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.appointment.name} *</label>
                <input
                  type="text"
                  required
                  placeholder={t.appointment.namePlaceholder}
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.appointment.phone} *</label>
                <input
                  type="tel"
                  required
                  placeholder={t.appointment.phonePlaceholder}
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.appointment.service}</label>
                <select
                  value={form.service}
                  onChange={e => setForm({ ...form, service: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
                >
                  <option value="">{t.appointment.selectService}</option>
                  {services.map(s => (
                    <option key={s.slug} value={s.slug}>
                      {lang === 'ru' ? s.nameRu : s.nameUz}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.appointment.doctor}</label>
                <select
                  value={form.doctor}
                  onChange={e => setForm({ ...form, doctor: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
                >
                  <option value="">{t.appointment.selectDoctor}</option>
                  {doctors.map(d => (
                    <option key={d.slug} value={d.slug}>
                      {lang === 'ru' ? d.nameRu : d.nameUz}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.appointment.message}</label>
                <textarea
                  rows={3}
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : null}
                {t.appointment.submit}
              </button>
              {submitError && (
                <p className="text-sm text-red-500">{submitError}</p>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
