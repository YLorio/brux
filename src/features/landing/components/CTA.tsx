import { useEffect, useRef, useState } from "react"
import { animate, motion, useInView } from "framer-motion"
import Reveal from "./Reveal"
import { ArrowIcon } from "./icons"

const ease = [0.22, 1, 0.36, 1] as const

/** Número que cuenta hacia arriba al entrar en pantalla. */
function Counter({ to }: { to: number }) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: "-40px" })
  const [val, setVal] = useState(0)

  useEffect(() => {
    if (!inView) return
    const controls = animate(0, to, {
      duration: 1.4,
      ease,
      onUpdate: (v) => setVal(Math.round(v)),
    })
    return () => controls.stop()
  }, [inView, to])

  return <strong ref={ref}>{val.toLocaleString("es-ES")}</strong>
}

export default function CTA() {
  const [sent, setSent] = useState(false)

  return (
    <section id="empezar" className="section waitlist">
      <div className="container">
        <Reveal>
          <div className="waitlist__card">
            <svg viewBox="0 0 64 64" className="waitlist__check" aria-hidden="true">
              <circle
                cx="32"
                cy="32"
                r="30"
                fill="none"
                stroke="rgba(10,157,102,0.22)"
                strokeWidth="3"
              />
              <motion.path
                d="M19 33l9 9 17-20"
                fill="none"
                stroke="#0a9d66"
                strokeWidth="4.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.7, delay: 0.2, ease }}
              />
            </svg>

            <h2 className="waitlist__title">
              Estamos por borrar las{" "}
              <span className="text-grad">fronteras</span> del dinero
            </h2>
            <p className="waitlist__text">
              Brux llega muy pronto. Déjanos tu correo y sé de los primeros en
              mover tu dinero sin límites.
            </p>

            {sent ? (
              <p className="waitlist__done">
                <span>✓</span> ¡Listo! Te avisaremos apenas Brux esté disponible.
              </p>
            ) : (
              <form
                className="waitlist__form"
                onSubmit={(e) => {
                  e.preventDefault()
                  setSent(true)
                }}
              >
                <input
                  type="email"
                  required
                  placeholder="tu@correo.com"
                  aria-label="Tu correo"
                  className="waitlist__input"
                />
                <button type="submit" className="btn btn--primary btn--lg">
                  Unirme a la lista <ArrowIcon />
                </button>
              </form>
            )}

            <p className="waitlist__count">
              <Counter to={12487} /> personas ya en la lista ·{" "}
              <Counter to={150} /> países
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
