import { ClinicSettings } from '@/lib/firestore';
import { defaultSettings } from '@/contexts/SiteDataContext';

export function mergeSettings(partial: Partial<ClinicSettings> | null | undefined): ClinicSettings {
  return { ...defaultSettings, ...(partial ?? {}) };
}

export function phoneTelHref(phone?: string): string {
  return `tel:${(phone || defaultSettings.phone1).replace(/\s/g, '')}`;
}
