'use client';

import { Calendar } from 'lucide-react';
import { useAppointmentModal } from '@/contexts/AppointmentModalContext';

interface AppointmentButtonProps {
  label: string;
  className?: string;
}

export default function AppointmentButton({ label, className }: AppointmentButtonProps) {
  const { open } = useAppointmentModal();

  return (
    <button
      type="button"
      onClick={open}
      className={
        className ||
        'w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2'
      }
    >
      <Calendar size={18} />
      {label}
    </button>
  );
}
