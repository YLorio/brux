-- brux — políticas RLS de sandbox + datos demo.
-- OJO: estas políticas son ABIERTAS (using(true)) para el PoC con la anon key.
-- Endurecer con auth.uid() antes de producción.

-- Políticas permisivas en todas las tablas (rol anon/authenticated).
do $$
declare t text;
begin
  foreach t in array array['profiles','wallets_demo','payment_orders','ledger_entries','username_history','cards'] loop
    execute format('drop policy if exists demo_all on public.%I', t);
    execute format('create policy demo_all on public.%I for all using (true) with check (true)', t);
  end loop;
end $$;

-- Perfiles demo (6 países de lanzamiento).
insert into public.profiles (username, display_name, country, country_code, id_number, currency)
values
  ('jose',   'Jose Guevara',    'Costa Rica',  'CR', '1-2345-6789',        'USD'),
  ('ana',    'Ana Torres',      'El Salvador', 'SV', '12345678-9',         'USD'),
  ('maria',  'Maria Lopez',     'México',      'MX', 'GOMC900101MDFXXX09', 'USD'),
  ('carlos', 'Carlos Ruiz',     'Colombia',    'CO', '1.234.567.890',      'USD'),
  ('lucia',  'Lucia Fernandez', 'Argentina',   'AR', '12.345.678',         'USD'),
  ('bruno',  'Bruno Silva',     'Brasil',      'BR', '123.456.789-09',     'USD')
on conflict (username) do nothing;

-- Fotos (placeholder) y cuentas verificadas.
update public.profiles set avatar_url = 'https://i.pravatar.cc/240?u=' || username where avatar_url is null;
update public.profiles set verified = true where username in ('jose', 'maria', 'ana');

-- Wallets (una en USD por perfil).
insert into public.wallets_demo (profile_id, currency, balance)
select p.id, 'USD', v.bal
from public.profiles p
join (values ('jose', 2500), ('ana', 8200), ('maria', 3400), ('carlos', 1300), ('lucia', 3100), ('bruno', 1800))
  as v(u, bal) on v.u = p.username
on conflict (profile_id, currency) do nothing;

-- Tarjeta demo de jose.
insert into public.cards (profile_id, brand, last4, holder, exp_month, exp_year, is_default, active)
select p.id, 'visa', '4242', 'JOSE GUEVARA', 11, 28, true, true
from public.profiles p
where p.username = 'jose'
  and not exists (select 1 from public.cards c where c.profile_id = p.id);

-- Órdenes históricas (ya completadas).
insert into public.payment_orders
  (reference, sender_profile_id, sender_username, sender_country_code,
   receiver_username, receiver_profile_id, receiver_country_code,
   amount, source_currency, target_currency, fee, amount_received, note, status, settled, created_at)
select o.reference, s.id, o.su, o.scc, o.ru, r.id, o.rcc,
       o.amount, 'USD', 'USD', o.fee, o.amount, o.note, 'completed', true, now() - o.age
from (values
  ('BRX-SEED01', 'ana',   'SV', 'jose',  'CR', 120::numeric, 1.08::numeric, 'Pago de freelance', interval '26 hours'),
  ('BRX-SEED02', 'jose',  'CR', 'maria', 'MX',  50::numeric, 0.99::numeric, 'Regalo de cumple',  interval '5 hours'),
  ('BRX-SEED03', 'lucia', 'AR', 'jose',  'CR', 200::numeric, 1.80::numeric, 'Anticipo proyecto', interval '50 hours')
) as o(reference, su, scc, ru, rcc, amount, fee, note, age)
join public.profiles s on s.username = o.su
join public.profiles r on r.username = o.ru
on conflict (reference) do nothing;
