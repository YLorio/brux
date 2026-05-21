// Implementación del data-layer contra Supabase (proyecto "buró").
// Misma API que mockStore.ts; el selector store.ts elige según hasSupabase.
// Login sigue siendo demo (sesión = id de perfil en localStorage); RLS abierta.

import type {
  BankCard,
  CardBrand,
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
import { orderReference } from './id';
import { detectBrand, onlyDigits } from './cards';
import { normalizeIban } from './iban';
import { supabase } from './supabase';
import {
  usernameChangeStatus,
  type AddCardInput,
  type AddPayoutInput,
  type CreateOrderInput,
  type CreateProfileInput,
  type TopUpInput,
} from './mockStore';

const sb = supabase!;
const round = (n: number) => roundToCurrency(n, 'USD');

const STAGE_MS = { pending_route: 1400, processing: 3200, completed: 5400 };

function deriveStatus(createdAt: string, stored: OrderStatus): OrderStatus {
  if (stored === 'completed' || stored === 'failed') return stored; // admin/terminal manda
  const elapsed = Date.now() - new Date(createdAt).getTime();
  if (elapsed >= STAGE_MS.completed) return 'completed';
  if (elapsed >= STAGE_MS.processing) return 'processing';
  if (elapsed >= STAGE_MS.pending_route) return 'pending_route';
  return 'created';
}

type OrderRow = Record<string, unknown> & {
  id: string;
  reference: string;
  sender_profile_id: string;
  sender_username: string;
  sender_country_code: string;
  receiver_username: string;
  receiver_profile_id: string | null;
  receiver_country_code: string;
  amount: number;
  source_currency: string;
  target_currency: string;
  fee: number;
  amount_received: number;
  note: string | null;
  status: string;
  settled: boolean;
  created_at: string;
};

function toOrder(row: OrderRow): PaymentOrder {
  return {
    id: row.id,
    reference: row.reference,
    sender_profile_id: row.sender_profile_id,
    sender_username: row.sender_username,
    sender_country_code: row.sender_country_code,
    receiver_username: row.receiver_username,
    receiver_profile_id: row.receiver_profile_id,
    receiver_country_code: row.receiver_country_code,
    amount: Number(row.amount),
    source_currency: row.source_currency as CurrencyCode,
    target_currency: row.target_currency as CurrencyCode,
    fee: Number(row.fee),
    amount_received: Number(row.amount_received),
    note: row.note,
    status: row.status as OrderStatus,
    manual_override: null,
    settled: row.settled,
    created_at: row.created_at,
  };
}

// ----------------------------------------------------------------------------
// Orquestación: conciliación al leer (con lock optimista para no duplicar)
// ----------------------------------------------------------------------------

async function creditReceiver(row: OrderRow) {
  if (row.receiver_profile_id) {
    const { data: w } = await sb
      .from('wallets_demo')
      .select('id,balance')
      .eq('profile_id', row.receiver_profile_id)
      .eq('currency', row.target_currency)
      .maybeSingle();
    if (w) {
      await sb
        .from('wallets_demo')
        .update({ balance: round(Number(w.balance) + Number(row.amount_received)) })
        .eq('id', w.id);
    } else {
      await sb.from('wallets_demo').insert({
        profile_id: row.receiver_profile_id,
        currency: row.target_currency,
        balance: round(Number(row.amount_received)),
      });
    }
    await sb.from('ledger_entries').insert({
      payment_order_id: row.id,
      profile_id: row.receiver_profile_id,
      type: 'credit',
      amount: Number(row.amount_received),
      currency: row.target_currency,
      description: `Pago recibido de @${row.sender_username} · ${row.reference}`,
    });
  }
  await sb.from('ledger_entries').insert({
    payment_order_id: row.id,
    profile_id: null,
    type: 'fee',
    amount: Number(row.fee),
    currency: row.source_currency,
    description: `Comisión brux · ${row.reference}`,
  });
}

async function refundSender(row: OrderRow) {
  const refund = round(Number(row.amount) + Number(row.fee));
  const { data: w } = await sb
    .from('wallets_demo')
    .select('id,balance')
    .eq('profile_id', row.sender_profile_id)
    .eq('currency', row.source_currency)
    .maybeSingle();
  if (w) {
    await sb
      .from('wallets_demo')
      .update({ balance: round(Number(w.balance) + refund) })
      .eq('id', w.id);
  }
  await sb.from('ledger_entries').insert({
    payment_order_id: row.id,
    profile_id: row.sender_profile_id,
    type: 'credit',
    amount: refund,
    currency: row.source_currency,
    description: `Reverso por orden fallida · ${row.reference}`,
  });
}

/** Settla por tiempo (solo a 'completed'). Lock optimista: gana quien marca settled. */
async function reconcile(row: OrderRow): Promise<PaymentOrder> {
  const derived = deriveStatus(row.created_at, row.status as OrderStatus);
  if (derived !== 'completed' || row.settled) {
    return toOrder({ ...row, status: derived });
  }
  const { data: won } = await sb
    .from('payment_orders')
    .update({ settled: true, status: 'completed' })
    .eq('id', row.id)
    .eq('settled', false)
    .select('id')
    .maybeSingle();
  if (won) await creditReceiver(row);
  return toOrder({ ...row, status: 'completed', settled: true });
}

// ----------------------------------------------------------------------------
// Perfiles / identidad
// ----------------------------------------------------------------------------

export async function getProfile(id: string): Promise<Profile | null> {
  const { data } = await sb.from('profiles').select('*').eq('id', id).maybeSingle();
  return (data as Profile) ?? null;
}

export async function getProfileByUsername(username: string): Promise<Profile | null> {
  const clean = username.replace(/^@/, '').trim().toLowerCase();
  const { data: direct } = await sb
    .from('profiles')
    .select('*')
    .eq('username', clean)
    .maybeSingle();
  if (direct) return direct as Profile;
  const { data: alias } = await sb
    .from('username_history')
    .select('profile_id')
    .eq('old_username', clean)
    .limit(1)
    .maybeSingle();
  if (alias) return getProfile((alias as { profile_id: string }).profile_id);
  return null;
}

export async function listProfiles(): Promise<Profile[]> {
  const { data } = await sb.from('profiles').select('*').order('username');
  return (data as Profile[]) ?? [];
}

export async function isUsernameAvailable(username: string): Promise<boolean> {
  return (await getProfileByUsername(username)) === null;
}

export async function createProfile(input: CreateProfileInput): Promise<Profile> {
  const clean = input.username.replace(/^@/, '').trim().toLowerCase();
  if (await getProfileByUsername(clean)) {
    throw new Error(`El usuario @${clean} ya esta registrado.`);
  }
  const { data, error } = await sb
    .from('profiles')
    .insert({
      username: clean,
      display_name: input.display_name.trim(),
      country: input.country,
      country_code: input.country_code,
      id_number: input.id_number?.trim() || null,
      currency: input.currency,
    })
    .select('*')
    .single();
  if (error) throw new Error(error.message);
  const profile = data as Profile;
  await sb.from('wallets_demo').insert({
    profile_id: profile.id,
    currency: input.currency,
    balance: round(input.initialBalance ?? 0),
  });
  return profile;
}

export async function changeUsername(profileId: string, newUsername: string): Promise<Profile> {
  const profile = await getProfile(profileId);
  if (!profile) throw new Error('Perfil no encontrado.');
  const clean = newUsername.replace(/^@/, '').trim().toLowerCase();
  if (!/^[a-z0-9_]{3,20}$/.test(clean)) {
    throw new Error('Usuario inválido (3-20: minúsculas, números o guion bajo).');
  }
  if (clean === profile.username) throw new Error('Ese ya es tu usuario actual.');
  if (!usernameChangeStatus(profile).allowed) {
    throw new Error('Solo puedes cambiar tu usuario cada 15 días.');
  }
  const taken = await getProfileByUsername(clean);
  if (taken && taken.id !== profileId) throw new Error(`@${clean} no está disponible.`);

  await sb.from('username_history').insert({
    profile_id: profileId,
    old_username: profile.username,
    new_username: clean,
  });
  const { data, error } = await sb
    .from('profiles')
    .update({ username: clean, last_username_change_at: new Date().toISOString() })
    .eq('id', profileId)
    .select('*')
    .single();
  if (error) throw new Error(error.message);
  return data as Profile;
}

export async function updateAvatar(
  profileId: string,
  avatarUrl: string | null,
): Promise<Profile> {
  const { data, error } = await sb
    .from('profiles')
    .update({ avatar_url: avatarUrl })
    .eq('id', profileId)
    .select('*')
    .single();
  if (error) throw new Error(error.message);
  return data as Profile;
}

export async function listUsernameHistory(profileId: string): Promise<UsernameHistory[]> {
  const { data } = await sb
    .from('username_history')
    .select('*')
    .eq('profile_id', profileId)
    .order('changed_at', { ascending: false });
  return (data as UsernameHistory[]) ?? [];
}

// ----------------------------------------------------------------------------
// Wallets
// ----------------------------------------------------------------------------

export async function listWallets(profileId: string): Promise<Wallet[]> {
  const { data } = await sb.from('wallets_demo').select('*').eq('profile_id', profileId);
  return (data as Wallet[]) ?? [];
}

// ----------------------------------------------------------------------------
// Órdenes
// ----------------------------------------------------------------------------

export async function createOrder(input: CreateOrderInput): Promise<PaymentOrder> {
  const sender = await getProfile(input.senderProfileId);
  if (!sender) throw new Error('Remitente no encontrado.');

  const cleanReceiver = input.receiverUsername.replace(/^@/, '').trim().toLowerCase();
  if (!cleanReceiver) throw new Error('Indica el @usuario del destinatario.');
  if (cleanReceiver === sender.username) throw new Error('No puedes enviarte un pago a ti mismo.');

  const receiver = await getProfileByUsername(cleanReceiver);
  if (!receiver) throw new Error(`No se pudo resolver la identidad @${cleanReceiver}.`);
  if (receiver.id === sender.id) throw new Error('No puedes enviarte un pago a ti mismo.');
  if (!(input.amount > 0)) throw new Error('El monto debe ser mayor a cero.');

  const q = quote(input.amount, input.sourceCurrency);

  const { data: wallet } = await sb
    .from('wallets_demo')
    .select('id,balance')
    .eq('profile_id', sender.id)
    .eq('currency', input.sourceCurrency)
    .maybeSingle();
  if (!wallet || Number(wallet.balance) < q.totalDebit) {
    throw new Error('Saldo insuficiente para cubrir el monto mas la comision.');
  }

  await sb
    .from('wallets_demo')
    .update({ balance: round(Number(wallet.balance) - q.totalDebit) })
    .eq('id', wallet.id);

  const reference = orderReference();
  const { data: orderRow, error } = await sb
    .from('payment_orders')
    .insert({
      reference,
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
      settled: false,
    })
    .select('*')
    .single();
  if (error) throw new Error(error.message);

  await sb.from('ledger_entries').insert({
    payment_order_id: (orderRow as OrderRow).id,
    profile_id: sender.id,
    type: 'debit',
    amount: q.totalDebit,
    currency: q.currency,
    description: `Reserva de fondos · ${reference} → @${receiver.username}`,
  });

  return toOrder(orderRow as OrderRow);
}

export async function getOrder(id: string): Promise<PaymentOrder | null> {
  const { data } = await sb.from('payment_orders').select('*').eq('id', id).maybeSingle();
  if (!data) return null;
  return reconcile(data as OrderRow);
}

export async function listOrdersForProfile(profileId: string): Promise<PaymentOrder[]> {
  const { data } = await sb
    .from('payment_orders')
    .select('*')
    .or(`sender_profile_id.eq.${profileId},receiver_profile_id.eq.${profileId}`)
    .order('created_at', { ascending: false });
  return Promise.all(((data as OrderRow[]) ?? []).map(reconcile));
}

export async function listAllOrders(): Promise<PaymentOrder[]> {
  const { data } = await sb
    .from('payment_orders')
    .select('*')
    .order('created_at', { ascending: false });
  return Promise.all(((data as OrderRow[]) ?? []).map(reconcile));
}

export async function adminSetStatus(orderId: string, status: OrderStatus): Promise<PaymentOrder> {
  const { data: row } = await sb
    .from('payment_orders')
    .select('*')
    .eq('id', orderId)
    .maybeSingle();
  if (!row) throw new Error('Orden no encontrada.');
  const order = row as OrderRow;

  if (status === 'completed' || status === 'failed') {
    const { data: won } = await sb
      .from('payment_orders')
      .update({ settled: true, status })
      .eq('id', orderId)
      .eq('settled', false)
      .select('id')
      .maybeSingle();
    if (won) {
      if (status === 'completed') await creditReceiver(order);
      else await refundSender(order);
    } else {
      await sb.from('payment_orders').update({ status }).eq('id', orderId);
    }
  } else {
    await sb.from('payment_orders').update({ status }).eq('id', orderId);
  }

  const { data: updated } = await sb.from('payment_orders').select('*').eq('id', orderId).single();
  return toOrder(updated as OrderRow);
}

export async function listLedgerForProfile(profileId: string): Promise<LedgerEntry[]> {
  const { data } = await sb
    .from('ledger_entries')
    .select('*')
    .eq('profile_id', profileId)
    .order('created_at', { ascending: false });
  return (data as LedgerEntry[]) ?? [];
}

export async function listLedgerForOrder(orderId: string): Promise<LedgerEntry[]> {
  const { data } = await sb
    .from('ledger_entries')
    .select('*')
    .eq('payment_order_id', orderId)
    .order('created_at', { ascending: true });
  return (data as LedgerEntry[]) ?? [];
}

export async function countInFlight(profileId?: string): Promise<number> {
  let query = sb.from('payment_orders').select('created_at,status,sender_profile_id,receiver_profile_id');
  if (profileId) {
    query = query.or(`sender_profile_id.eq.${profileId},receiver_profile_id.eq.${profileId}`);
  }
  const { data } = await query;
  return ((data as OrderRow[]) ?? []).filter((o) => {
    const s = deriveStatus(o.created_at, o.status as OrderStatus);
    return s !== 'completed' && s !== 'failed';
  }).length;
}

// ----------------------------------------------------------------------------
// Tarjetas
// ----------------------------------------------------------------------------

export async function listCards(profileId: string): Promise<BankCard[]> {
  const { data } = await sb
    .from('cards')
    .select('*')
    .eq('profile_id', profileId)
    .eq('active', true)
    .order('is_default', { ascending: false })
    .order('created_at', { ascending: false });
  return (data as BankCard[]) ?? [];
}

export async function addCard(input: AddCardInput): Promise<BankCard> {
  const digits = onlyDigits(input.number);
  const { data: existing } = await sb
    .from('cards')
    .select('id')
    .eq('profile_id', input.profileId)
    .eq('active', true);
  const makeDefault = input.makeDefault || ((existing as unknown[]) ?? []).length === 0;
  if (makeDefault) {
    await sb.from('cards').update({ is_default: false }).eq('profile_id', input.profileId);
  }
  const { data, error } = await sb
    .from('cards')
    .insert({
      profile_id: input.profileId,
      brand: detectBrand(digits) as CardBrand,
      last4: digits.slice(-4),
      holder: input.holder.trim().toUpperCase(),
      exp_month: input.expMonth,
      exp_year: input.expYear,
      is_default: makeDefault,
      active: true,
    })
    .select('*')
    .single();
  if (error) throw new Error(error.message);
  return data as BankCard;
}

export async function setDefaultCard(cardId: string): Promise<void> {
  const { data: card } = await sb.from('cards').select('profile_id').eq('id', cardId).maybeSingle();
  if (!card) throw new Error('Tarjeta no encontrada.');
  await sb
    .from('cards')
    .update({ is_default: false })
    .eq('profile_id', (card as { profile_id: string }).profile_id);
  await sb.from('cards').update({ is_default: true }).eq('id', cardId);
}

export async function removeCard(cardId: string): Promise<void> {
  const { data: card } = await sb
    .from('cards')
    .select('profile_id,is_default')
    .eq('id', cardId)
    .maybeSingle();
  if (!card) return;
  await sb.from('cards').update({ active: false, is_default: false }).eq('id', cardId);
  if ((card as { is_default: boolean }).is_default) {
    const { data: next } = await sb
      .from('cards')
      .select('id')
      .eq('profile_id', (card as { profile_id: string }).profile_id)
      .eq('active', true)
      .limit(1)
      .maybeSingle();
    if (next) await sb.from('cards').update({ is_default: true }).eq('id', (next as { id: string }).id);
  }
}

export async function topUpWallet(input: TopUpInput): Promise<Wallet> {
  if (!(input.amount > 0)) throw new Error('El monto debe ser mayor a cero.');
  const amount = round(input.amount);
  const { data: w } = await sb
    .from('wallets_demo')
    .select('id,balance')
    .eq('profile_id', input.profileId)
    .eq('currency', input.currency)
    .maybeSingle();
  let wallet: Wallet;
  if (w) {
    const { data } = await sb
      .from('wallets_demo')
      .update({ balance: round(Number(w.balance) + amount) })
      .eq('id', w.id)
      .select('*')
      .single();
    wallet = data as Wallet;
  } else {
    const { data } = await sb
      .from('wallets_demo')
      .insert({ profile_id: input.profileId, currency: input.currency, balance: amount })
      .select('*')
      .single();
    wallet = data as Wallet;
  }
  await sb.from('ledger_entries').insert({
    payment_order_id: null,
    profile_id: input.profileId,
    type: 'credit',
    amount,
    currency: input.currency,
    description: `Recarga con tarjeta ····${input.cardLast4}`,
  });
  return wallet;
}

// ----------------------------------------------------------------------------
// Cuentas de liquidación (IBAN)
// ----------------------------------------------------------------------------

export async function listPayoutAccounts(profileId: string): Promise<PayoutAccount[]> {
  const { data } = await sb
    .from('payout_accounts')
    .select('*')
    .eq('profile_id', profileId)
    .eq('active', true)
    .order('is_default', { ascending: false })
    .order('created_at', { ascending: false });
  return (data as PayoutAccount[]) ?? [];
}

export async function addPayoutAccount(input: AddPayoutInput): Promise<PayoutAccount> {
  const { data: existing } = await sb
    .from('payout_accounts')
    .select('id')
    .eq('profile_id', input.profileId)
    .eq('active', true);
  const makeDefault = ((existing as unknown[]) ?? []).length === 0;
  if (makeDefault) {
    await sb.from('payout_accounts').update({ is_default: false }).eq('profile_id', input.profileId);
  }
  const { data, error } = await sb
    .from('payout_accounts')
    .insert({
      profile_id: input.profileId,
      iban: normalizeIban(input.iban),
      holder: input.holder.trim().toUpperCase(),
      alias: input.alias?.trim() || null,
      is_default: makeDefault,
      active: true,
    })
    .select('*')
    .single();
  if (error) throw new Error(error.message);
  return data as PayoutAccount;
}

export async function setDefaultPayoutAccount(accountId: string): Promise<void> {
  const { data: acct } = await sb
    .from('payout_accounts')
    .select('profile_id')
    .eq('id', accountId)
    .maybeSingle();
  if (!acct) throw new Error('Cuenta no encontrada.');
  await sb
    .from('payout_accounts')
    .update({ is_default: false })
    .eq('profile_id', (acct as { profile_id: string }).profile_id);
  await sb.from('payout_accounts').update({ is_default: true }).eq('id', accountId);
}

export async function removePayoutAccount(accountId: string): Promise<void> {
  const { data: acct } = await sb
    .from('payout_accounts')
    .select('profile_id,is_default')
    .eq('id', accountId)
    .maybeSingle();
  if (!acct) return;
  await sb.from('payout_accounts').update({ active: false, is_default: false }).eq('id', accountId);
  if ((acct as { is_default: boolean }).is_default) {
    const { data: next } = await sb
      .from('payout_accounts')
      .select('id')
      .eq('profile_id', (acct as { profile_id: string }).profile_id)
      .eq('active', true)
      .limit(1)
      .maybeSingle();
    if (next) {
      await sb.from('payout_accounts').update({ is_default: true }).eq('id', (next as { id: string }).id);
    }
  }
}

// ----------------------------------------------------------------------------
// Reset del sandbox (borra y resiembra los datos demo)
// ----------------------------------------------------------------------------

export async function resetDemo(): Promise<void> {
  type Tbl =
    | 'cards'
    | 'payout_accounts'
    | 'ledger_entries'
    | 'payment_orders'
    | 'username_history'
    | 'wallets_demo'
    | 'profiles';
  const all = (table: Tbl) => sb.from(table).delete().not('id', 'is', null);
  await all('cards');
  await all('payout_accounts');
  await all('ledger_entries');
  await all('payment_orders');
  await all('username_history');
  await all('wallets_demo');
  await all('profiles');

  const demos: Array<[string, string, string, string, string, number, boolean]> = [
    ['jose', 'Jose Guevara', 'Costa Rica', 'CR', '1-2345-6789', 2500, true],
    ['ana', 'Ana Torres', 'El Salvador', 'SV', '12345678-9', 8200, true],
    ['maria', 'Maria Lopez', 'México', 'MX', 'GOMC900101MDFXXX09', 3400, true],
    ['carlos', 'Carlos Ruiz', 'Colombia', 'CO', '1.234.567.890', 1300, false],
    ['lucia', 'Lucia Fernandez', 'Argentina', 'AR', '12.345.678', 3100, false],
    ['bruno', 'Bruno Silva', 'Brasil', 'BR', '123.456.789-09', 1800, false],
  ];
  for (const [username, display_name, country, country_code, id_number, bal, verified] of demos) {
    const { data: p } = await sb
      .from('profiles')
      .insert({
        username,
        display_name,
        country,
        country_code,
        id_number,
        currency: 'USD',
        avatar_url: `https://i.pravatar.cc/240?u=${username}`,
        verified,
      })
      .select('id')
      .single();
    const profileId = (p as { id: string }).id;
    await sb.from('wallets_demo').insert({ profile_id: profileId, currency: 'USD', balance: bal });
    if (username === 'jose') {
      await sb.from('cards').insert({
        profile_id: profileId,
        brand: 'visa',
        last4: '4242',
        holder: 'JOSE GUEVARA',
        exp_month: 11,
        exp_year: 28,
        is_default: true,
        active: true,
      });
      await sb.from('payout_accounts').insert({
        profile_id: profileId,
        iban: 'CR05015202001026284066',
        holder: 'JOSE GUEVARA',
        alias: 'Cuenta principal',
        is_default: true,
        active: true,
      });
    }
  }
}
