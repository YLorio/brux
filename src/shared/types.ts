// Tipos de dominio de brux. Espejan el esquema previsto en Supabase
// (profiles, wallets_demo, payment_orders, ledger_entries) para que el
// cambio del data-layer mock a Supabase sea directo.

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'MXN' | 'COP' | 'CRC' | 'BRL';

/** Ciclo de vida de una orden de pago en la capa de orquestacion. */
export type OrderStatus =
  | 'created'
  | 'pending_route'
  | 'processing'
  | 'completed'
  | 'failed';

export const ORDER_STATUS_FLOW: OrderStatus[] = [
  'created',
  'pending_route',
  'processing',
  'completed',
];

export type LedgerType = 'debit' | 'credit' | 'fee';

/** Identidad de pago: el @username es la "cuenta" publica del usuario. */
export interface Profile {
  id: string;
  username: string; // sin el prefijo @
  display_name: string;
  country: string;
  country_code: string; // ISO-3166 alpha-2
  id_number: string | null; // documento (cédula/DUI/DNI/CURP/CPF)
  avatar_url: string | null; // foto (URL o data URL)
  verified: boolean;
  currency: CurrencyCode;
  last_username_change_at: string | null;
  created_at: string;
}

/** Historial de cambios de @username, para mapear contactos al usuario nuevo. */
export interface UsernameHistory {
  id: string;
  profile_id: string;
  old_username: string;
  new_username: string;
  changed_at: string;
}

export interface Wallet {
  id: string;
  profile_id: string;
  currency: CurrencyCode;
  balance: number;
}

export interface PaymentOrder {
  id: string;
  reference: string; // BRX-XXXXXX
  sender_profile_id: string;
  sender_username: string;
  sender_country_code: string;
  receiver_username: string;
  receiver_profile_id: string | null;
  receiver_country_code: string;
  amount: number;
  source_currency: CurrencyCode; // moneda del pago (sin FX, origen = destino)
  target_currency: CurrencyCode;
  fee: number; // comision brux, en source_currency
  amount_received: number; // == amount (sin conversión)
  note: string | null;
  status: OrderStatus;
  manual_override: OrderStatus | null; // forzado por admin
  settled: boolean; // ledger y saldos ya conciliados
  created_at: string;
}

export interface LedgerEntry {
  id: string;
  payment_order_id: string;
  profile_id: string | null;
  type: LedgerType;
  amount: number;
  currency: CurrencyCode;
  description: string;
  created_at: string;
}

/** Cuenta bancaria (IBAN) donde se liquidan los fondos del usuario. */
export interface PayoutAccount {
  id: string;
  profile_id: string;
  iban: string;
  holder: string;
  alias: string | null;
  is_default: boolean;
  active: boolean; // soft delete
  created_at: string;
}

export type CardBrand = 'visa' | 'mastercard' | 'amex' | 'other';

/** Tarjeta bancaria tokenizada: nunca se guarda el PAN completo ni el CVV. */
export interface BankCard {
  id: string;
  profile_id: string;
  brand: CardBrand;
  last4: string;
  holder: string;
  exp_month: number;
  exp_year: number; // 2 dígitos
  is_default: boolean;
  active: boolean; // soft delete
  created_at: string;
}
