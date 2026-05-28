-- Waitlist de la landing: guarda correos de gente esperando entrar a brux.
-- Pensado para inserts publicos desde el navegador (rol anon) con RLS.

create extension if not exists "pgcrypto";

create table if not exists public.waitlist_emails (
  id          uuid primary key default gen_random_uuid(),
  email       text not null,
  source      text default 'landing_hero',
  locale      text,
  user_agent  text,
  referer     text,
  created_at  timestamptz not null default now()
);

-- Un correo no se duplica (case-insensitive).
create unique index if not exists waitlist_emails_email_lower_uq
  on public.waitlist_emails (lower(email));

create index if not exists idx_waitlist_emails_created_at
  on public.waitlist_emails (created_at desc);

alter table public.waitlist_emails enable row level security;

-- Cualquiera puede sumarse a la waitlist, con validacion basica del formato.
drop policy if exists "anyone can join waitlist" on public.waitlist_emails;
create policy "anyone can join waitlist"
  on public.waitlist_emails
  for insert
  to anon, authenticated
  with check (
    char_length(email) between 5 and 320
    and position('@' in email) > 1
    and position('.' in split_part(email, '@', 2)) > 0
  );

-- Nadie puede leer los correos directamente desde el cliente (sin policy SELECT).
-- Para el contador del hero exponemos un RPC SECURITY DEFINER que solo devuelve
-- un entero, sin filtrar emails individuales.
create or replace function public.waitlist_count()
returns int
language sql
security definer
set search_path = public
as $$
  select count(*)::int from public.waitlist_emails;
$$;

revoke all on function public.waitlist_count() from public;
grant execute on function public.waitlist_count() to anon, authenticated;
