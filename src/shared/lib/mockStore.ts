// Data-layer mock de brux. Simula el backend de orquestacion de pagos
// (profiles, wallets, payment_orders, ledger_entries) en localStorage.
//
// Diseno: cada funcion exportada es async (devuelve Promise) e imita la API
// que tendria un cliente Supabase, de modo que migrar consista en reemplazar
// el cuerpo de estas funciones por llamadas a `supabase.from(...)`.

import type {
  BankCard,
  CurrencyCode,
  LedgerEntry,
  OrderStatus,
  PaymentOrder,
  PayoutAccount,
  Profile,
  UsernameHistory,
  Wallet,
} from '@/shared/types';
import { quote } from './fx';
import { roundToCurrency } from './format';
import { orderReference, uid } from './id';
import { detectBrand, onlyDigits } from './cards';
import { normalizeIban } from './iban';

interface DbShape {
  version: number;
  profiles: Profile[];
  wallets: Wallet[];
  orders: PaymentOrder[];
  ledger: LedgerEntry[];
  cards: BankCard[];
  username_history: UsernameHistory[];
  payout_accounts: PayoutAccount[];
}

const DB_KEY = 'brux:db:v6';
const SESSION_KEY = 'brux:session';

/** Umbrales (ms desde created_at) que controlan el avance de estado. */
const STAGE_MS = {
  pending_route: 1400,
  processing: 3200,
  completed: 5400,
};

// ----------------------------------------------------------------------------
// Persistencia
// ----------------------------------------------------------------------------

function read(): DbShape {
  if (typeof window === 'undefined') return seed();
  const raw = window.localStorage.getItem(DB_KEY);
  if (!raw) {
    const fresh = seed();
    write(fresh);
    return fresh;
  }
  try {
    const parsed = JSON.parse(raw) as DbShape;
    if (!parsed.cards) parsed.cards = []; // migración suave
    if (!parsed.username_history) parsed.username_history = [];
    if (!parsed.payout_accounts) parsed.payout_accounts = [];
    return parsed;
  } catch {
    const fresh = seed();
    write(fresh);
    return fresh;
  }
}

function write(db: DbShape): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(DB_KEY, JSON.stringify(db));
}

const delay = (ms = 140) => new Promise<void>((r) => setTimeout(r, ms));

// ----------------------------------------------------------------------------
// Orquestacion: avance de estado + conciliacion de ledger/saldos
// ----------------------------------------------------------------------------

function deriveStatus(order: PaymentOrder, now: number): OrderStatus {
  if (order.manual_override) return order.manual_override;
  const elapsed = now - new Date(order.created_at).getTime();
  if (elapsed >= STAGE_MS.completed) return 'completed';
  if (elapsed >= STAGE_MS.processing) return 'processing';
  if (elapsed >= STAGE_MS.pending_route) return 'pending_route';
  return 'created';
}

function findWallet(
  db: DbShape,
  profileId: string,
  currency: CurrencyCode,
): Wallet | undefined {
  return db.wallets.find((w) => w.profile_id === profileId && w.currency === currency);
}

function ensureWallet(
  db: DbShape,
  profileId: string,
  currency: CurrencyCode,
): Wallet {
  let wallet = findWallet(db, profileId, currency);
  if (!wallet) {
    wallet = { id: uid(), profile_id: profileId, currency, balance: 0 };
    db.wallets.push(wallet);
  }
  return wallet;
}

function pushLedger(db: DbShape, entry: Omit<LedgerEntry, 'id' | 'created_at'>): void {
  db.ledger.push({ ...entry, id: uid(), created_at: new Date().toISOString() });
}

/** Aplica los efectos finales (saldos + ledger) de una orden terminal. */
function settleOrder(db: DbShape, order: PaymentOrder): void {
  if (order.settled) return;

  if (order.status === 'completed') {
    if (order.receiver_profile_id) {
      const wallet = ensureWallet(db, order.receiver_profile_id, order.target_currency);
      wallet.balance = roundToCurrency(
        wallet.balance + order.amount_received,
        order.target_currency,
      );
      pushLedger(db, {
        payment_order_id: order.id,
        profile_id: order.receiver_profile_id,
        type: 'credit',
        amount: order.amount_received,
        currency: order.target_currency,
        description: `Pago recibido de @${order.sender_username} · ${order.reference}`,
      });
    }
    pushLedger(db, {
      payment_order_id: order.id,
      profile_id: null,
      type: 'fee',
      amount: order.fee,
      currency: order.source_currency,
      description: `Comision brux · ${order.reference}`,
    });
  } else if (order.status === 'failed') {
    // Reverso: devuelve el monto reservado al remitente.
    const wallet = ensureWallet(db, order.sender_profile_id, order.source_currency);
    const refund = roundToCurrency(order.amount + order.fee, order.source_currency);
    wallet.balance = roundToCurrency(wallet.balance + refund, order.source_currency);
    pushLedger(db, {
      payment_order_id: order.id,
      profile_id: order.sender_profile_id,
      type: 'credit',
      amount: refund,
      currency: order.source_currency,
      description: `Reverso por orden fallida · ${order.reference}`,
    });
  }

  order.settled = true;
}

/** Recalcula estados por tiempo y concilia ordenes terminales pendientes. */
function reconcile(db: DbShape, now = Date.now()): boolean {
  let changed = false;
  for (const order of db.orders) {
    if (order.settled && (order.status === 'completed' || order.status === 'failed')) {
      continue;
    }
    const next = deriveStatus(order, now);
    if (next !== order.status) {
      order.status = next;
      changed = true;
    }
    if ((next === 'completed' || next === 'failed') && !order.settled) {
      settleOrder(db, order);
      changed = true;
    }
  }
  return changed;
}

function load(): DbShape {
  const db = read();
  if (reconcile(db)) write(db);
  return db;
}

// ----------------------------------------------------------------------------
// Sesion (auth mock — separada de las "tablas", como en Supabase)
// ----------------------------------------------------------------------------

export function getSessionProfileId(): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(SESSION_KEY);
}

export function setSessionProfileId(id: string | null): void {
  if (typeof window === 'undefined') return;
  if (id) window.localStorage.setItem(SESSION_KEY, id);
  else window.localStorage.removeItem(SESSION_KEY);
}

// ----------------------------------------------------------------------------
// API publica del store
// ----------------------------------------------------------------------------

export async function getProfile(id: string): Promise<Profile | null> {
  const db = load();
  return db.profiles.find((p) => p.id === id) ?? null;
}

export async function getProfileByUsername(username: string): Promise<Profile | null> {
  const db = load();
  const clean = username.replace(/^@/, '').trim().toLowerCase();
  const direct = db.profiles.find((p) => p.username.toLowerCase() === clean);
  if (direct) return direct;
  // Alias: si fue un @username anterior, se mapea al perfil actual (contactos).
  const alias = db.username_history.find((h) => h.old_username.toLowerCase() === clean);
  if (alias) return db.profiles.find((p) => p.id === alias.profile_id) ?? null;
  return null;
}

export async function listProfiles(): Promise<Profile[]> {
  const db = load();
  return [...db.profiles].sort((a, b) => a.username.localeCompare(b.username));
}

export async function isUsernameAvailable(username: string): Promise<boolean> {
  const existing = await getProfileByUsername(username);
  return !existing;
}

export interface CreateProfileInput {
  username: string;
  display_name: string;
  currency: CurrencyCode;
  country: string;
  country_code: string;
  id_number?: string;
  initialBalance?: number;
}

export async function createProfile(input: CreateProfileInput): Promise<Profile> {
  await delay();
  const db = read();
  const clean = input.username.replace(/^@/, '').trim().toLowerCase();
  if (db.profiles.some((p) => p.username.toLowerCase() === clean)) {
    throw new Error(`El usuario @${clean} ya esta registrado.`);
  }
  const profile: Profile = {
    id: uid(),
    username: clean,
    display_name: input.display_name.trim(),
    country: input.country,
    country_code: input.country_code,
    id_number: input.id_number?.trim() || null,
    avatar_url: null,
    verified: false,
    currency: input.currency,
    last_username_change_at: null,
    created_at: new Date().toISOString(),
  };
  db.profiles.push(profile);
  db.wallets.push({
    id: uid(),
    profile_id: profile.id,
    currency: input.currency,
    balance: roundToCurrency(input.initialBalance ?? 0, input.currency),
  });
  write(db);
  return profile;
}

export async function updateAvatar(
  profileId: string,
  avatarUrl: string | null,
): Promise<Profile> {
  await delay(120);
  const db = read();
  const profile = db.profiles.find((p) => p.id === profileId);
  if (!profile) throw new Error('Perfil no encontrado.');
  profile.avatar_url = avatarUrl;
  write(db);
  return profile;
}

export const USERNAME_COOLDOWN_DAYS = 15;
const USERNAME_RE = /^[a-z0-9_]{3,20}$/;

export interface UsernameChangeStatus {
  allowed: boolean;
  nextAvailableAt: string | null;
}

/** Indica si el perfil ya puede cambiar su @username (cada 15 días). */
export function usernameChangeStatus(profile: Profile): UsernameChangeStatus {
  if (!profile.last_username_change_at) return { allowed: true, nextAvailableAt: null };
  const next =
    new Date(profile.last_username_change_at).getTime() +
    USERNAME_COOLDOWN_DAYS * 86_400_000;
  return { allowed: Date.now() >= next, nextAvailableAt: new Date(next).toISOString() };
}

export async function changeUsername(profileId: string, newUsername: string): Promise<Profile> {
  await delay();
  const db = read();
  const profile = db.profiles.find((p) => p.id === profileId);
  if (!profile) throw new Error('Perfil no encontrado.');

  const clean = newUsername.replace(/^@/, '').trim().toLowerCase();
  if (!USERNAME_RE.test(clean)) {
    throw new Error('Usuario inválido (3-20: minúsculas, números o guion bajo).');
  }
  if (clean === profile.username) throw new Error('Ese ya es tu usuario actual.');

  if (!usernameChangeStatus(profile).allowed) {
    throw new Error(`Solo puedes cambiar tu usuario cada ${USERNAME_COOLDOWN_DAYS} días.`);
  }

  // No permitir tomar un username actual ni un alias de otra persona.
  const taken =
    db.profiles.some((p) => p.id !== profileId && p.username.toLowerCase() === clean) ||
    db.username_history.some(
      (h) => h.profile_id !== profileId && h.old_username.toLowerCase() === clean,
    );
  if (taken) throw new Error(`@${clean} no está disponible.`);

  const old = profile.username;
  db.username_history.push({
    id: uid(),
    profile_id: profileId,
    old_username: old,
    new_username: clean,
    changed_at: new Date().toISOString(),
  });
  profile.username = clean;
  profile.last_username_change_at = new Date().toISOString();
  write(db);
  return profile;
}

export async function listUsernameHistory(profileId: string): Promise<UsernameHistory[]> {
  const db = load();
  return db.username_history
    .filter((h) => h.profile_id === profileId)
    .sort((a, b) => b.changed_at.localeCompare(a.changed_at));
}

export async function listWallets(profileId: string): Promise<Wallet[]> {
  const db = load();
  return db.wallets.filter((w) => w.profile_id === profileId);
}

export interface CreateOrderInput {
  senderProfileId: string;
  receiverUsername: string;
  amount: number;
  sourceCurrency: CurrencyCode;
  note?: string;
}

export async function createOrder(input: CreateOrderInput): Promise<PaymentOrder> {
  await delay(260);
  const db = read();

  const sender = db.profiles.find((p) => p.id === input.senderProfileId);
  if (!sender) throw new Error('Remitente no encontrado.');

  const cleanReceiver = input.receiverUsername.replace(/^@/, '').trim().toLowerCase();
  if (!cleanReceiver) throw new Error('Indica el @usuario del destinatario.');
  if (cleanReceiver === sender.username) {
    throw new Error('No puedes enviarte un pago a ti mismo.');
  }

  const receiver = db.profiles.find((p) => p.username.toLowerCase() === cleanReceiver);
  if (!receiver) {
    throw new Error(`No se pudo resolver la identidad @${cleanReceiver}.`);
  }

  if (!(input.amount > 0)) throw new Error('El monto debe ser mayor a cero.');

  const q = quote(input.amount, input.sourceCurrency);

  const wallet = findWallet(db, sender.id, input.sourceCurrency);
  if (!wallet || wallet.balance < q.totalDebit) {
    throw new Error('Saldo insuficiente para cubrir el monto mas la comision.');
  }

  // Reserva de fondos al crear la orden (debito inmediato).
  wallet.balance = roundToCurrency(wallet.balance - q.totalDebit, input.sourceCurrency);

  const order: PaymentOrder = {
    id: uid(),
    reference: orderReference(),
    sender_profile_id: sender.id,
    sender_username: sender.username,
    sender_country_code: sender.country_code,
    receiver_username: receiver.username,
    receiver_profile_id: receiver.id,
    receiver_country_code: receiver.country_code,
    amount: q.amount,
    source_currency: q.currency,
    target_currency: q.currency,
    fee: q.fee,
    amount_received: q.amountReceived,
    note: input.note?.trim() || null,
    status: 'created',
    manual_override: null,
    settled: false,
    created_at: new Date().toISOString(),
  };
  db.orders.push(order);

  pushLedger(db, {
    payment_order_id: order.id,
    profile_id: sender.id,
    type: 'debit',
    amount: q.totalDebit,
    currency: q.currency,
    description: `Reserva de fondos · ${order.reference} → @${receiver.username}`,
  });

  write(db);
  return order;
}

export async function getOrder(id: string): Promise<PaymentOrder | null> {
  const db = load();
  return db.orders.find((o) => o.id === id) ?? null;
}

/** Ordenes en las que el perfil participa (como remitente o destinatario). */
export async function listOrdersForProfile(profileId: string): Promise<PaymentOrder[]> {
  const db = load();
  return db.orders
    .filter(
      (o) => o.sender_profile_id === profileId || o.receiver_profile_id === profileId,
    )
    .sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export async function listAllOrders(): Promise<PaymentOrder[]> {
  const db = load();
  return [...db.orders].sort((a, b) => b.created_at.localeCompare(a.created_at));
}

/** Forza el estado de una orden (panel admin). */
export async function adminSetStatus(
  orderId: string,
  status: OrderStatus,
): Promise<PaymentOrder> {
  await delay(180);
  const db = read();
  const order = db.orders.find((o) => o.id === orderId);
  if (!order) throw new Error('Orden no encontrada.');
  order.manual_override = status;
  order.status = status;
  if ((status === 'completed' || status === 'failed') && !order.settled) {
    settleOrder(db, order);
  }
  write(db);
  return order;
}

export async function listLedgerForProfile(profileId: string): Promise<LedgerEntry[]> {
  const db = load();
  return db.ledger
    .filter((e) => e.profile_id === profileId)
    .sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export async function listLedgerForOrder(orderId: string): Promise<LedgerEntry[]> {
  const db = load();
  return db.ledger
    .filter((e) => e.payment_order_id === orderId)
    .sort((a, b) => a.created_at.localeCompare(b.created_at));
}

/** Cuenta cuantas ordenes del perfil aun no han llegado a estado terminal. */
export async function countInFlight(profileId?: string): Promise<number> {
  const db = load();
  return db.orders.filter(
    (o) =>
      o.status !== 'completed' &&
      o.status !== 'failed' &&
      (!profileId ||
        o.sender_profile_id === profileId ||
        o.receiver_profile_id === profileId),
  ).length;
}

// ----------------------------------------------------------------------------
// Tarjetas (métodos de pago) — solo se guardan los últimos 4 dígitos
// ----------------------------------------------------------------------------

export async function listCards(profileId: string): Promise<BankCard[]> {
  const db = load();
  return db.cards
    .filter((c) => c.profile_id === profileId && c.active)
    .sort(
      (a, b) =>
        Number(b.is_default) - Number(a.is_default) ||
        b.created_at.localeCompare(a.created_at),
    );
}

export interface AddCardInput {
  profileId: string;
  number: string;
  holder: string;
  expMonth: number;
  expYear: number;
  makeDefault?: boolean;
}

export async function addCard(input: AddCardInput): Promise<BankCard> {
  await delay();
  const db = read();
  const digits = onlyDigits(input.number);
  const existing = db.cards.filter((c) => c.profile_id === input.profileId && c.active);
  const makeDefault = input.makeDefault || existing.length === 0;
  if (makeDefault) {
    db.cards.forEach((c) => {
      if (c.profile_id === input.profileId) c.is_default = false;
    });
  }
  const card: BankCard = {
    id: uid(),
    profile_id: input.profileId,
    brand: detectBrand(digits),
    last4: digits.slice(-4),
    holder: input.holder.trim().toUpperCase(),
    exp_month: input.expMonth,
    exp_year: input.expYear,
    is_default: makeDefault,
    active: true,
    created_at: new Date().toISOString(),
  };
  db.cards.push(card);
  write(db);
  return card;
}

export async function setDefaultCard(cardId: string): Promise<void> {
  await delay(120);
  const db = read();
  const card = db.cards.find((c) => c.id === cardId);
  if (!card) throw new Error('Tarjeta no encontrada.');
  db.cards.forEach((c) => {
    if (c.profile_id === card.profile_id) c.is_default = c.id === cardId;
  });
  write(db);
}

/** Soft delete: se marca inactiva, nunca se borra físicamente. */
export async function removeCard(cardId: string): Promise<void> {
  await delay(120);
  const db = read();
  const card = db.cards.find((c) => c.id === cardId);
  if (!card) return;
  card.active = false;
  if (card.is_default) {
    card.is_default = false;
    const next = db.cards.find(
      (c) => c.profile_id === card.profile_id && c.active && c.id !== cardId,
    );
    if (next) next.is_default = true;
  }
  write(db);
}

export interface TopUpInput {
  profileId: string;
  currency: CurrencyCode;
  amount: number;
  cardLast4: string;
}

/** Recarga el saldo de una wallet desde una tarjeta (registra en el ledger). */
export async function topUpWallet(input: TopUpInput): Promise<Wallet> {
  await delay(260);
  if (!(input.amount > 0)) throw new Error('El monto debe ser mayor a cero.');
  const db = read();
  const wallet = ensureWallet(db, input.profileId, input.currency);
  const amount = roundToCurrency(input.amount, input.currency);
  wallet.balance = roundToCurrency(wallet.balance + amount, input.currency);
  pushLedger(db, {
    payment_order_id: '',
    profile_id: input.profileId,
    type: 'credit',
    amount,
    currency: input.currency,
    description: `Recarga con tarjeta ····${input.cardLast4}`,
  });
  write(db);
  return wallet;
}

// ----------------------------------------------------------------------------
// Cuentas de liquidación (IBAN)
// ----------------------------------------------------------------------------

export interface AddPayoutInput {
  profileId: string;
  iban: string;
  holder: string;
  alias?: string;
}

export async function listPayoutAccounts(profileId: string): Promise<PayoutAccount[]> {
  const db = load();
  return db.payout_accounts
    .filter((a) => a.profile_id === profileId && a.active)
    .sort(
      (a, b) =>
        Number(b.is_default) - Number(a.is_default) || b.created_at.localeCompare(a.created_at),
    );
}

export async function addPayoutAccount(input: AddPayoutInput): Promise<PayoutAccount> {
  await delay();
  const db = read();
  const existing = db.payout_accounts.filter((a) => a.profile_id === input.profileId && a.active);
  const makeDefault = existing.length === 0;
  if (makeDefault) {
    db.payout_accounts.forEach((a) => {
      if (a.profile_id === input.profileId) a.is_default = false;
    });
  }
  const acct: PayoutAccount = {
    id: uid(),
    profile_id: input.profileId,
    iban: normalizeIban(input.iban),
    holder: input.holder.trim().toUpperCase(),
    alias: input.alias?.trim() || null,
    is_default: makeDefault,
    active: true,
    created_at: new Date().toISOString(),
  };
  db.payout_accounts.push(acct);
  write(db);
  return acct;
}

export async function setDefaultPayoutAccount(accountId: string): Promise<void> {
  await delay(120);
  const db = read();
  const acct = db.payout_accounts.find((a) => a.id === accountId);
  if (!acct) throw new Error('Cuenta no encontrada.');
  db.payout_accounts.forEach((a) => {
    if (a.profile_id === acct.profile_id) a.is_default = a.id === accountId;
  });
  write(db);
}

export async function removePayoutAccount(accountId: string): Promise<void> {
  await delay(120);
  const db = read();
  const acct = db.payout_accounts.find((a) => a.id === accountId);
  if (!acct) return;
  acct.active = false;
  if (acct.is_default) {
    acct.is_default = false;
    const next = db.payout_accounts.find(
      (a) => a.profile_id === acct.profile_id && a.active && a.id !== accountId,
    );
    if (next) next.is_default = true;
  }
  write(db);
}

/** Reinicia el sandbox a su estado sembrado (util durante demos). */
export async function resetDemo(): Promise<void> {
  const fresh = seed();
  write(fresh);
  setSessionProfileId(null);
}

// ----------------------------------------------------------------------------
// Semilla de datos demo
// ----------------------------------------------------------------------------

function seed(): DbShape {
  const now = Date.now();
  const iso = (offsetMs: number) => new Date(now - offsetMs).toISOString();

  const mk = (
    username: string,
    display_name: string,
    country: string,
    country_code: string,
    id_number: string,
    verified: boolean,
  ): Profile => ({
    id: `seed_${username}`,
    username,
    display_name,
    country,
    country_code,
    id_number,
    avatar_url: `https://i.pravatar.cc/240?u=${username}`,
    verified,
    currency: 'USD',
    last_username_change_at: null,
    created_at: iso(1000 * 60 * 60 * 24 * 30),
  });

  const jose = mk('jose', 'Jose Guevara', 'Costa Rica', 'CR', '1-2345-6789', true);
  const ana = mk('ana', 'Ana Torres', 'El Salvador', 'SV', '12345678-9', true);
  const maria = mk('maria', 'Maria Lopez', 'México', 'MX', 'GOMC900101MDFXXX09', true);
  const carlos = mk('carlos', 'Carlos Ruiz', 'Colombia', 'CO', '1.234.567.890', false);
  const lucia = mk('lucia', 'Lucia Fernandez', 'Argentina', 'AR', '12.345.678', false);
  const bruno = mk('bruno', 'Bruno Silva', 'Brasil', 'BR', '123.456.789-09', false);

  const profiles = [jose, ana, maria, carlos, lucia, bruno];

  const wallet = (
    profileId: string,
    currency: CurrencyCode,
    balance: number,
  ): Wallet => ({ id: uid(), profile_id: profileId, currency, balance });

  const wallets: Wallet[] = [
    wallet(jose.id, 'USD', 2_500),
    wallet(ana.id, 'USD', 8_200),
    wallet(maria.id, 'USD', 3_400),
    wallet(carlos.id, 'USD', 1_300),
    wallet(lucia.id, 'USD', 3_100),
    wallet(bruno.id, 'USD', 1_800),
  ];

  // Ordenes historicas ya completadas (saldos arriba ya las reflejan).
  const orders: PaymentOrder[] = [];
  const ledger: LedgerEntry[] = [];

  const histo = (
    sender: Profile,
    receiver: Profile,
    amount: number,
    source: CurrencyCode,
    ageMs: number,
    note: string | null,
  ) => {
    const q = quote(amount, source);
    const order: PaymentOrder = {
      id: uid(),
      reference: orderReference(),
      sender_profile_id: sender.id,
      sender_username: sender.username,
      sender_country_code: sender.country_code,
      receiver_username: receiver.username,
      receiver_profile_id: receiver.id,
      receiver_country_code: receiver.country_code,
      amount: q.amount,
      source_currency: q.currency,
      target_currency: q.currency,
      fee: q.fee,
      amount_received: q.amountReceived,
      note,
      status: 'completed',
      manual_override: null,
      settled: true,
      created_at: iso(ageMs),
    };
    orders.push(order);
    ledger.push({
      id: uid(),
      payment_order_id: order.id,
      profile_id: sender.id,
      type: 'debit',
      amount: q.totalDebit,
      currency: source,
      description: `Reserva de fondos · ${order.reference} → @${receiver.username}`,
      created_at: iso(ageMs),
    });
    ledger.push({
      id: uid(),
      payment_order_id: order.id,
      profile_id: receiver.id,
      type: 'credit',
      amount: q.amountReceived,
      currency: source,
      description: `Pago recibido de @${sender.username} · ${order.reference}`,
      created_at: iso(ageMs - 5000),
    });
    ledger.push({
      id: uid(),
      payment_order_id: order.id,
      profile_id: null,
      type: 'fee',
      amount: q.fee,
      currency: source,
      description: `Comision brux · ${order.reference}`,
      created_at: iso(ageMs - 5000),
    });
  };

  histo(ana, jose, 120, 'USD', 1000 * 60 * 60 * 26, 'Pago de freelance');
  histo(jose, maria, 50, 'USD', 1000 * 60 * 60 * 5, 'Regalo de cumple');
  histo(lucia, jose, 200, 'USD', 1000 * 60 * 60 * 50, 'Anticipo proyecto');

  const cards: BankCard[] = [
    {
      id: uid(),
      profile_id: jose.id,
      brand: 'visa',
      last4: '4242',
      holder: 'JOSE GUEVARA',
      exp_month: 11,
      exp_year: 28,
      is_default: true,
      active: true,
      created_at: iso(1000 * 60 * 60 * 24 * 20),
    },
  ];

  const payout_accounts: PayoutAccount[] = [
    {
      id: uid(),
      profile_id: jose.id,
      iban: 'CR05015202001026284066',
      holder: 'JOSE GUEVARA',
      alias: 'Cuenta principal',
      is_default: true,
      active: true,
      created_at: iso(1000 * 60 * 60 * 24 * 18),
    },
  ];

  return {
    version: 1,
    profiles,
    wallets,
    orders,
    ledger,
    cards,
    username_history: [],
    payout_accounts,
  };
}
