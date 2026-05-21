import type { CurrencyCode } from '@/shared/types';

/** Locale por moneda para que el simbolo y los decimales salgan correctos. */
const LOCALE_BY_CURRENCY: Record<CurrencyCode, string> = {
  USD: 'en-US',
  EUR: 'es-ES',
  GBP: 'en-GB',
  MXN: 'es-MX',
  COP: 'es-CO',
  CRC: 'es-CR',
  BRL: 'pt-BR',
};

/** Formatea un monto con su simbolo de moneda. Ej: $1,250.00 / ₡125,400. */
export function formatMoney(amount: number, currency: CurrencyCode): string {
  return new Intl.NumberFormat(LOCALE_BY_CURRENCY[currency] ?? 'en-US', {
    style: 'currency',
    currency,
    currencyDisplay: 'narrowSymbol',
  }).format(amount);
}

/** Monto sin simbolo, util cuando ya se muestra el codigo de moneda aparte. */
export function formatAmount(amount: number, currency: CurrencyCode): string {
  return new Intl.NumberFormat(LOCALE_BY_CURRENCY[currency] ?? 'en-US', {
    minimumFractionDigits: currencyDecimals(currency),
    maximumFractionDigits: currencyDecimals(currency),
  }).format(amount);
}

/** Decimales convencionales por moneda (COP y CRC se manejan sin decimales). */
export function currencyDecimals(currency: CurrencyCode): number {
  return currency === 'COP' || currency === 'CRC' ? 0 : 2;
}

/** Redondea respetando los decimales de la moneda destino. */
export function roundToCurrency(amount: number, currency: CurrencyCode): number {
  const factor = 10 ** currencyDecimals(currency);
  return Math.round(amount * factor) / factor;
}

export function formatRate(rate: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(rate);
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('es-CR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(iso));
}

export function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat('es-CR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso));
}

/** Tiempo relativo simple: "hace 5 min", "hace 2 h", "hace 3 d". */
export function formatRelative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const sec = Math.round(diff / 1000);
  if (sec < 45) return 'hace un momento';
  const min = Math.round(sec / 60);
  if (min < 60) return `hace ${min} min`;
  const hours = Math.round(min / 60);
  if (hours < 24) return `hace ${hours} h`;
  const days = Math.round(hours / 24);
  if (days < 30) return `hace ${days} d`;
  return formatDate(iso);
}
