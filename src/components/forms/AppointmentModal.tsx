'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';
import { Lang } from '@/types';
import { getT } from '@/i18n';
import { useSiteData } from '@/contexts/SiteDataContext';
import { useAppointmentModal } from '@/contexts/AppointmentModalContext';
import { saveAppointmentRequest } from '@/lib/firestore';
import { formatUzPhoneInput, isValidUzPhone, normalizeUzPhone } from '@/lib/phone';

interface AppointmentModalProps {
  lang: Lang;
}

export default function AppointmentModal({ lang }: AppointmentModalProps) {
  const t = getT(lang);
  const { settings } = useSiteData();
  const { isOpen, close } = useAppointmentModal();
  const dialogRef = useRef<HTMLDivElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [form, setForm] = useState({ name: '', phone: '', message: '' });
  const [consent, setConsent] = useState(false);
  const [consentError, setConsentError] = useState(false);
  const [phoneError, setPhoneError] = useState('');

  const handleClose = () => {
    close();
    setTimeout(() => {
      setSubmitted(false);
      setSubmitError('');
      setPhoneError('');
      setConsentError(false);
    }, 300);
  };

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    firstFieldRef.current?.focus();

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, close]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) {
      setConsentError(true);
      return;
    }
    if (!isValidUzPhone(form.phone)) {
      setPhoneError(t.appointment.phoneInvalid);
      return;
    }

    setConsentError(false);
    setPhoneError('');
    setLoading(true);
    setSubmitError('');

    const payload = {
      name: form.name.trim(),
      phone: normalizeUzPhone(form.phone),
      message: form.message.trim(),
      lang,
      consentGiven: true,
      consentAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    try {
      await saveAppointmentRequest(payload);

      const webhooks = [settings.appointmentEmailWebhook].filter(Boolean);
      if (webhooks.length > 0) {
        await Promise.allSettled(
          webhooks.map(url =>
            fetch(url as string, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload),
            })
          )
        );
      }

      setSubmitted(true);
      setForm({ name: '', phone: '', message: '' });
      setConsent(false);
    } catch {
      setSubmitError(t.appointment.submitError);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      onClick={e => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true" />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="appointment-modal-title"
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 id="appointment-modal-title" className="text-xl font-bold text-gray-900">
            {t.appointment.title}
          </h2>
          <button
            type="button"
            onClick={handleClose}
            aria-label={t.common.close}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
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
                <label htmlFor="appointment-name" className="block text-sm font-medium text-gray-700 mb-1">
                  {t.appointment.name} *
                </label>
                <input
                  ref={firstFieldRef}
                  id="appointment-name"
                  type="text"
                  required
                  placeholder={t.appointment.namePlaceholder}
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
              <div>
                <label htmlFor="appointment-phone" className="block text-sm font-medium text-gray-700 mb-1">
                  {t.appointment.phone} *
                </label>
                <input
                  id="appointment-phone"
                  type="tel"
                  required
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder={t.appointment.phonePlaceholder}
                  value={form.phone}
                  onChange={e => {
                    setForm({ ...form, phone: formatUzPhoneInput(e.target.value) });
                    if (phoneError) setPhoneError('');
                  }}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
                {phoneError && <p className="text-sm text-red-500 mt-1">{phoneError}</p>}
              </div>
              <div>
                <label htmlFor="appointment-message" className="block text-sm font-medium text-gray-700 mb-1">
                  {t.appointment.message}
                </label>
                <textarea
                  id="appointment-message"
                  rows={3}
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
                />
              </div>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={e => {
                    setConsent(e.target.checked);
                    if (e.target.checked) setConsentError(false);
                  }}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 shrink-0"
                />
                <span className="text-sm text-gray-600 leading-relaxed">
                  {t.appointment.consentPrefix}{' '}
                  <Link
                    href={`/${lang}/privacy`}
                    className="text-blue-600 hover:text-blue-700 underline underline-offset-2"
                    onClick={e => e.stopPropagation()}
                  >
                    {t.appointment.consentLink}
                  </Link>
                  .
                </span>
              </label>
              {consentError && <p className="text-sm text-red-500">{t.appointment.consentRequired}</p>}
              <button
                type="submit"
                disabled={loading || !consent}
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
              {submitError && <p className="text-sm text-red-500">{submitError}</p>}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
