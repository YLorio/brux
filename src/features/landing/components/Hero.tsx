import { useEffect, useState, type FormEvent, type ReactNode } from "react"
import { motion } from "framer-motion"
import WordsReveal from "./WordsReveal"
import { useLang } from "../i18n"
import { getWaitlistCount, joinWaitlist, WAITLIST_BASE_COUNT } from "../waitlist"

const ease = [0.22, 1, 0.36, 1] as const
const up = (delay: number) => ({
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.5, delay, ease },
})

/** Avatares para el "social proof" del waitlist. Self-hosted en /public para
 *  no depender de un CDN externo. */
const WAITLIST_AVATARS = [
  "/landing/avatars/avatar-11.jpg",
  "/landing/avatars/avatar-32.jpg",
  "/landing/avatars/avatar-47.jpg",
  "/landing/avatars/avatar-68.jpg",
]

type HeroProps = {
  id?: string
  title?: string
  highlight?: string
  lead?: ReactNode
  /** Variante centrada: sin mockup, texto al centro. */
  centered?: boolean
}

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "ok"; already: boolean }
  | { kind: "error"; msg: string }

export default function Hero({
  id = "inicio",
  title,
  highlight,
  lead,
  centered = false,
}: HeroProps) {
  const { t, lang } = useLang()
  const copy = t.hero
  const wl = copy.waitlist
  const heroTitle = title ?? copy.title
  const heroHighlight = highlight ?? copy.highlight
  const heroLead = lead ?? copy.lead

  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<Status>({ kind: "idle" })
  const [extra, setExtra] = useState(0)

  // Trae el conteo real una vez al montar; el visible siempre es base + reales,
  // asi el "+100" del copy nunca baja aunque la tabla este vacia.
  useEffect(() => {
    let alive = true
    getWaitlistCount().then((n) => {
      if (alive) setExtra(n)
    })
    return () => {
      alive = false
    }
  }, [])

  const totalCount = WAITLIST_BASE_COUNT + extra

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (status.kind === "submitting") return
    setStatus({ kind: "submitting" })
    const res = await joinWaitlist(email, lang)
    if (res.ok) {
      setStatus({ kind: "ok", already: res.already })
      if (!res.already) setExtra((n) => n + 1)
      setEmail("")
      return
    }
    const msg =
      res.reason === "invalid"
        ? wl.invalid
        : res.reason === "no_supabase"
          ? wl.offline
          : wl.error
    setStatus({ kind: "error", msg })
  }

  return (
    <section id={id} className={`hero ${centered ? "hero--centered" : ""}`}>
      {centered && (
        <div className="hero__bg" aria-hidden="true">
          <div className="hero__grid" />
        </div>
      )}

      <div className="container hero__inner">
        <div className="hero__copy">
          {/* Powered by Stellar — pildora arriba del título, borde completo
              verde brand. Link discreto a stellar.org. */}
          <motion.a
            href="https://stellar.org"
            target="_blank"
            rel="noopener noreferrer"
            className="hero__powered-by"
            aria-label="Powered by Stellar"
            {...up(0)}
          >
            <span className="hero__powered-by-label">Powered by</span>
            <img
              src="/landing/stellar.avif"
              alt="Stellar"
              className="hero__powered-by-logo"
              loading="lazy"
            />
          </motion.a>

          <WordsReveal
            as="h1"
            className="hero__title"
            text={heroTitle}
            highlight={heroHighlight}
          />

          <motion.p className="hero__lead" {...up(0.12)}>
            {heroLead}
          </motion.p>

          <motion.div className="hero__waitlist" {...up(0.2)}>
            <div className="hero__waitlist-proof">
              <span className="hero__waitlist-avatars" aria-hidden="true">
                {WAITLIST_AVATARS.map((src, i) => (
                  <img
                    key={src}
                    src={src}
                    alt=""
                    loading="lazy"
                    width={28}
                    height={28}
                    className="hero__waitlist-avatar"
                    style={{ zIndex: WAITLIST_AVATARS.length - i }}
                  />
                ))}
              </span>
              <span>{wl.socialProof(totalCount)}</span>
            </div>

            <form className="hero__waitlist-form" onSubmit={onSubmit} noValidate>
              <label className="sr-only" htmlFor="hero-waitlist-email">
                {wl.emailLabel}
              </label>
              <input
                id="hero-waitlist-email"
                className="hero__waitlist-input"
                type="email"
                inputMode="email"
                autoComplete="email"
                spellCheck={false}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={wl.emailPlaceholder}
                aria-label={wl.emailLabel}
                disabled={status.kind === "submitting"}
                required
              />
              <button
                type="submit"
                className="hero__waitlist-btn"
                disabled={status.kind === "submitting"}
              >
                {status.kind === "submitting" ? wl.submitting : wl.submit}
              </button>
            </form>

            {status.kind !== "idle" && (
              <p
                className={`hero__waitlist-status ${
                  status.kind === "ok"
                    ? "is-ok"
                    : status.kind === "error"
                      ? "is-error"
                      : ""
                }`}
                role={status.kind === "error" ? "alert" : "status"}
                aria-live="polite"
              >
                {status.kind === "submitting"
                  ? wl.submitting
                  : status.kind === "ok"
                    ? status.already
                      ? `✓ ${wl.alreadyIn}`
                      : `✓ ${wl.success}`
                    : status.msg}
              </p>
            )}

          </motion.div>
        </div>

        {/* Visual del hero — escena 3D con la app. En desktop ocupa la
            columna derecha; en móvil baja debajo del waitlist. */}
        <motion.div
          className="hero__media"
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: 0.25, ease }}
        >
          <img
            src="/landing/hero.png"
            alt="App de Brux con tarjeta y saldo"
            className="hero__media-img"
            loading="eager"
            fetchPriority="high"
          />
        </motion.div>
      </div>
    </section>
  )
}
