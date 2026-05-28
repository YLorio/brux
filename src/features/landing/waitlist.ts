import { supabase, hasSupabase } from "../../shared/lib/supabase"

/** Base visible para el contador del hero ("+100 personas..."). */
export const WAITLIST_BASE_COUNT = 100

export type JoinResult =
  | { ok: true; already: boolean }
  | { ok: false; reason: "no_supabase" | "invalid" | "network" | string }

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Inserta el correo en `public.waitlist_emails`. */
export async function joinWaitlist(rawEmail: string, locale: string): Promise<JoinResult> {
  const email = rawEmail.trim().toLowerCase()
  if (!EMAIL_RE.test(email)) return { ok: false, reason: "invalid" }
  if (!hasSupabase || !supabase) return { ok: false, reason: "no_supabase" }

  // La tabla aun no esta en database.types.ts; casteamos solo aqui.
  const client = supabase as unknown as {
    from: (t: string) => {
      insert: (row: Record<string, unknown>) => Promise<{ error: { code?: string; message: string } | null }>
    }
  }

  const { error } = await client.from("waitlist_emails").insert({
    email,
    locale,
    source: "landing_hero",
    user_agent: typeof navigator !== "undefined" ? navigator.userAgent.slice(0, 256) : null,
    referer: typeof document !== "undefined" ? document.referrer || null : null,
  })

  if (error) {
    // 23505 = unique_violation → el correo ya estaba en la lista; lo tratamos como exito.
    if (error.code === "23505") return { ok: true, already: true }
    return { ok: false, reason: error.message }
  }
  return { ok: true, already: false }
}

/** Total real en `waitlist_emails` (via RPC SECURITY DEFINER). 0 si Supabase no esta listo. */
export async function getWaitlistCount(): Promise<number> {
  if (!hasSupabase || !supabase) return 0
  const client = supabase as unknown as {
    rpc: (fn: string) => Promise<{ data: unknown; error: unknown }>
  }
  const { data, error } = await client.rpc("waitlist_count")
  if (error || typeof data !== "number") return 0
  return data
}
