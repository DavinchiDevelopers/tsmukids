/** Нормализует телефон к формату +998XXXXXXXXX */
export function normalizeUzPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('998') && digits.length === 12) {
    return `+${digits}`;
  }
  if (digits.length === 9) {
    return `+998${digits}`;
  }
  if (digits.startsWith('998')) {
    return `+${digits.slice(0, 12)}`;
  }
  return phone.trim();
}

export function isValidUzPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, '');
  if (/^998\d{9}$/.test(digits)) return true;
  if (/^\d{9}$/.test(digits)) return true;
  return false;
}

export function formatUzPhoneInput(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 12);
  if (!digits) return '';

  let local = digits;
  if (local.startsWith('998')) {
    local = local.slice(3);
  }
  local = local.slice(0, 9);

  if (local.length === 0) return '+998 ';
  if (local.length <= 2) return `+998 ${local}`;
  if (local.length <= 5) return `+998 ${local.slice(0, 2)} ${local.slice(2)}`;
  if (local.length <= 7) return `+998 ${local.slice(0, 2)} ${local.slice(2, 5)} ${local.slice(5)}`;
  return `+998 ${local.slice(0, 2)} ${local.slice(2, 5)} ${local.slice(5, 7)} ${local.slice(7)}`;
}
