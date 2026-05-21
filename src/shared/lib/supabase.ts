import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

/** true cuando hay credenciales de Supabase en .env. */
export const hasSupabase = Boolean(url && key);

/**
 * Cliente Supabase tipado, conectado al proyecto "buró" (fxpaerkjvlekzllqppbf).
 *
 * NOTA: hoy la app sigue leyendo/escribiendo el store mock (localStorage). Este
 * cliente es el puente para la fase de migración: ir reemplazando el cuerpo de
 * las funciones de `store.ts` (y las `api/` por feature) por consultas
 * `supabase.from('...')`. Los hooks de React Query y la UI no cambian.
 */
export const supabase = hasSupabase
  ? createClient<Database>(url as string, key as string, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    })
  : null;
