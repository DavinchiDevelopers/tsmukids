'use client';

import { createContext, useCallback, useContext, useState, ReactNode } from 'react';

interface AppointmentModalContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const AppointmentModalContext = createContext<AppointmentModalContextValue | null>(null);

export function AppointmentModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  return (
    <AppointmentModalContext.Provider value={{ isOpen, open, close }}>
      {children}
    </AppointmentModalContext.Provider>
  );
}

export function useAppointmentModal() {
  const ctx = useContext(AppointmentModalContext);
  if (!ctx) {
    throw new Error('useAppointmentModal must be used within AppointmentModalProvider');
  }
  return ctx;
}
