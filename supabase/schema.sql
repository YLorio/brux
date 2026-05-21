-- brux — esquema del sandbox de orquestación de pagos (moneda única USD, sin FX).
-- Aplicar en Supabase. Refleja los tipos de src/shared/types.ts.
-- Endurecer las políticas RLS antes de cualquier uso real.

create extension if not exists "pgcrypto";

-- Identidad de pago: el @username es la "cuenta" pública del usuario.
create table if not exists public.profiles (
  id                      uuid primary key default gen_random_uuid(),
  user_id                 uuid references auth.users (id) on delete cascade,
  username                text not null unique,
  display_name            text not null,
  country                 text not null,
  country_code            text not null,          -- ISO alpha-2 (CR, SV, AR, MX, BR, CO)
  id_number               text,                   -- documento (cédula/DUI/DNI/CURP/CPF)
  avatar_url              text,                   -- foto (URL o data URL)
  verified                boolean not null default false,
  currency                text not null default 'USD',
  last_username_change_at timestamptz,            -- cooldown de 15 días para cambiar @username
  created_at              timestamptz not null default now()
);

create table if not exists public.wallets_demo (
  id         uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  currency   text not null default 'USD',
  balance    numeric(18, 2) not null default 0,
  unique (profile_id, currency)
);

-- Ciclo de vida: created → pending_route → processing → completed | failed
-- Sin FX: source_currency = target_currency y amount_received = amount.
create table if not exists public.payment_orders (
  id                    uuid primary key default gen_random_uuid(),
  reference             text not null unique,
  sender_profile_id     uuid not null references public.profiles (id),
  sender_username       text not null,
  sender_country_code   text not null,
  receiver_username     text not null,
  receiver_profile_id   uuid references public.profiles (id),
  receiver_country_code text not null,
  amount                numeric(18, 2) not null,
  source_currency       text not null default 'USD',
  target_currency       text not null default 'USD',
  fee                   numeric(18, 2) not null,
  amount_received       numeric(18, 2) not null,
  note                  text,
  status                text not null default 'created',
  settled               boolean not null default false,
  created_at            timestamptz not null default now()
);

create table if not exists public.ledger_entries (
  id               uuid primary key default gen_random_uuid(),
  payment_order_id uuid references public.payment_orders (id) on delete cascade,
  profile_id       uuid references public.profiles (id),
  type             text not null,                 -- debit | credit | fee
  amount           numeric(18, 2) not null,
  currency         text not null default 'USD',
  description      text not null,
  created_at       timestamptz not null default now()
);

-- Historial de cambios de @username: permite mapear contactos al usuario nuevo.
create table if not exists public.username_history (
  id            uuid primary key default gen_random_uuid(),
  profile_id    uuid not null references public.profiles (id) on delete cascade,
  old_username  text not null,
  new_username  text not null,
  changed_at    timestamptz not null default now()
);

-- Tarjetas (solo se guardan los últimos 4 dígitos; nunca el PAN ni el CVV).
create table if not exists public.cards (
  id          uuid primary key default gen_random_uuid(),
  profile_id  uuid not null references public.profiles (id) on delete cascade,
  brand       text not null,                      -- visa | mastercard | amex | other
  last4       text not null,
  holder      text not null,
  exp_month   int not null,
  exp_year    int not null,
  is_default  boolean not null default false,
  active      boolean not null default true,      -- soft delete
  created_at  timestamptz not null default now()
);

-- Cuentas de liquidación (IBAN) donde el usuario recibe sus fondos.
create table if not exists public.payout_accounts (
  id          uuid primary key default gen_random_uuid(),
  profile_id  uuid not null references public.profiles (id) on delete cascade,
  iban        text not null,
  holder      text not null,
  alias       text,
  is_default  boolean not null default false,
  active      boolean not null default true,      -- soft delete
  created_at  timestamptz not null default now()
);

create index if not exists idx_payout_profile on public.payout_accounts (profile_id);
create index if not exists idx_orders_sender on public.payment_orders (sender_profile_id);
create index if not exists idx_orders_receiver on public.payment_orders (receiver_profile_id);
create index if not exists idx_ledger_profile on public.ledger_entries (profile_id);
create index if not exists idx_ledger_order on public.ledger_entries (payment_order_id);
create index if not exists idx_username_history_old on public.username_history (lower(old_username));
create index if not exists idx_cards_profile on public.cards (profile_id);

-- RLS (definir políticas según el modelo de acceso antes de producción).
alter table public.profiles         enable row level security;
alter table public.wallets_demo     enable row level security;
alter table public.payment_orders   enable row level security;
alter table public.ledger_entries   enable row level security;
alter table public.username_history enable row level security;
alter table public.cards            enable row level security;
alter table public.payout_accounts  enable row level security;
