import type { CardBrand } from '@/shared/types';

export function onlyDigits(value: string): string {
  return value.replace(/\D/g, '');
}

/** Detecta la marca por el prefijo del número (IIN). */
export function detectBrand(number: string): CardBrand {
  const n = onlyDigits(number);
  if (/^4/.test(n)) return 'visa';
  if (/^3[47]/.test(n)) return 'amex';
  if (/^5[1-5]/.test(n) || /^2(2[2-9]|[3-6]\d|7[01]|720)/.test(n)) return 'mastercard';
  return 'other';
}

/** Validación Luhn (checksum) del número de tarjeta. */
export function luhnValid(number: string): boolean {
  const n = onlyDigits(number);
  if (n.length < 13 || n.length > 19) return false;
  let sum = 0;
  let alt = false;
  for (let i = n.length - 1; i >= 0; i -= 1) {
    let d = Number(n[i]);
    if (alt) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    alt = !alt;
  }
  return sum % 10 === 0;
}

/** Formatea el número en grupos de 4 para mostrarlo mientras se escribe. */
export function formatCardNumber(value: string): string {
  return onlyDigits(value)
    .slice(0, 19)
    .replace(/(\d{4})(?=\d)/g, '$1 ')
    .trim();
}

export const BRAND_LABEL: Record<CardBrand, string> = {
  visa: 'Visa',
  mastercard: 'Mastercard',
  amex: 'American Express',
  other: 'Tarjeta',
};
