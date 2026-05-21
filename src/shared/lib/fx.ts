import type { CurrencyCode } from '@/shared/types';
import { roundToCurrency } from './format';

// brux NO maneja conversión de divisas (FX): cada pago se liquida en la misma
// moneda en que se envía. Las monedas locales se conservan solo para mostrar
// saldos; el destinatario recibe el mismo monto que se envió.

export interface CurrencyMeta {
  code: CurrencyCode;
  symbol: string;
  name: string;
  country: string;
  countryCode: string; // ISO alpha-2, para la bandera
}

/** Monedas y países soportados por el sandbox de brux. */
export const CURRENCIES: CurrencyMeta[] = [
  { code: 'USD', symbol: '$', name: 'Dolar estadounidense', country: 'Estados Unidos', countryCode: 'US' },
  { code: 'CRC', symbol: '₡', name: 'Colon costarricense', country: 'Costa Rica', countryCode: 'CR' },
  { code: 'MXN', symbol: '$', name: 'Peso mexicano', country: 'Mexico', countryCode: 'MX' },
  { code: 'COP', symbol: '$', name: 'Peso colombiano', country: 'Colombia', countryCode: 'CO' },
  { code: 'EUR', symbol: '€', name: 'Euro', country: 'Espana', countryCode: 'ES' },
  { code: 'BRL', symbol: 'R$', name: 'Real brasileno', country: 'Brasil', countryCode: 'BR' },
  { code: 'GBP', symbol: '£', name: 'Libra esterlina', country: 'Reino Unido', countryCode: 'GB' },
];

export interface Country {
  code: string; // ISO alpha-2
  name: string;
}

/** Países de lanzamiento. La moneda de liquidación siempre es USD. */
export const COUNTRIES: Country[] = [
  { code: 'CR', name: 'Costa Rica' },
  { code: 'SV', name: 'El Salvador' },
  { code: 'AR', name: 'Argentina' },
  { code: 'MX', name: 'México' },
  { code: 'BR', name: 'Brasil' },
  { code: 'CO', name: 'Colombia' },
];

export function getCountry(code: string): Country {
  return COUNTRIES.find((c) => c.code === code) ?? { code, name: code };
}

/** Comision variable de brux sobre el monto enviado (0.9%). */
export const FEE_RATE = 0.009;

/** Comision minima por moneda (sin FX, no se puede derivar de un valor en USD). */
const MIN_FEE: Record<CurrencyCode, number> = {
  USD: 0.99,
  EUR: 0.95,
  GBP: 0.85,
  MXN: 18,
  COP: 4000,
  CRC: 500,
  BRL: 5,
};

/** Saldo demo inicial por moneda al crear una cuenta nueva. */
const DEMO_GRANT: Record<CurrencyCode, number> = {
  USD: 1000,
  EUR: 950,
  GBP: 850,
  MXN: 18_000,
  COP: 4_000_000,
  CRC: 500_000,
  BRL: 5_000,
};

export function getCurrency(code: CurrencyCode): CurrencyMeta {
  const found = CURRENCIES.find((c) => c.code === code);
  if (!found) throw new Error(`Moneda no soportada: ${code}`);
  return found;
}

export function initialDemoBalance(currency: CurrencyCode): number {
  return DEMO_GRANT[currency] ?? 1000;
}

export interface Quote {
  amount: number; // monto a enviar
  currency: CurrencyCode; // moneda del pago (origen = destino, sin FX)
  fee: number; // comision brux
  totalDebit: number; // amount + fee
  amountReceived: number; // == amount (sin conversión)
}

/**
 * Cotiza una transferencia: calcula la comisión y el total a debitar. Sin FX,
 * el destinatario recibe exactamente el monto enviado en la misma moneda.
 */
export function quote(amount: number, currency: CurrencyCode): Quote {
  const amt = roundToCurrency(amount, currency);
  const min = amount > 0 ? MIN_FEE[currency] ?? 0 : 0;
  const fee = roundToCurrency(Math.max(min, amt * FEE_RATE), currency);
  return {
    amount: amt,
    currency,
    fee,
    totalDebit: roundToCurrency(amt + fee, currency),
    amountReceived: amt,
  };
}
