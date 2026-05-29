import { useEffect, useState } from "react"
import { motion, useReducedMotion } from "framer-motion"
import WordsReveal from "./WordsReveal"
import AppDemo from "./AppDemo"
import { useLang } from "../i18n"

/* ------------------------------------------------------------------
   Cómo funciona — "escenario" verde con el teléfono (AppDemo) al
   centro sobre anillos concéntricos. Arriba un stepper horizontal
   (solo títulos) y abajo la descripción del paso activo. Auto-avanza
   en loop; cada paso es clickable. Respeta prefers-reduced-motion.
   ------------------------------------------------------------------ */

const STEP_MS = 2100
const ease = [0.22, 1, 0.36, 1] as const

export default function HowItWorks() {
  const { t } = useLang()
  const copy = t.howItWorks
  const reduce = useReducedMotion()

  const [active, setActive] = useState(0)

  // El timer se reinicia cuando cambia `active` (reloj o click). Sin
  // auto-avance con reduced-motion: el usuario controla con el stepper.
  useEffect(() => {
    if (reduce) return
    const id = setTimeout(
      () => setActive((a) => (a + 1) % copy.steps.length),
      STEP_MS,
    )
    return () => clearTimeout(id)
  }, [active, reduce, copy.steps.length])

  return (
    <section id="como-funciona" className="section howitworks">
      <div className="container">
        <div className="section__head">
          <span className="eyebrow">{copy.eyebrow}</span>
          <WordsReveal text={copy.headingText} highlight={copy.headingHighlight} />
          <p className="section__sub">{copy.sub}</p>
        </div>

        {/* Stepper horizontal — FUERA del card (sobre el gris) */}
        <ol className="hiw__tabs">
          {copy.steps.map((step, i) => {
            const isActive = i === active
            return (
              <li key={step.title}>
                <button
                  type="button"
                  className={`hiw__tab ${isActive ? "is-active" : ""}`}
                  onClick={() => setActive(i)}
                  aria-current={isActive}
                >
                  <span className="hiw__tab-num">{i + 1}</span>
                  <span className="hiw__tab-title">{step.title}</span>
                  {isActive && !reduce && (
                    <span className="hiw__tab-bar">
                      <motion.span
                        key={active}
                        className="hiw__tab-fill"
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: STEP_MS / 1000, ease: "linear" }}
                      />
                    </span>
                  )}
                </button>
              </li>
            )
          })}
        </ol>

        <div className="hiw__stage">
          {/* Teléfono al centro sobre anillos concéntricos */}
          <div className="hiw__phone-wrap">
            <div className="hiw__rings" aria-hidden="true">
              <span className="hiw__ring hiw__ring--1" />
              <span className="hiw__ring hiw__ring--2" />
              <span className="hiw__ring hiw__ring--3" />
            </div>
            <AppDemo step={active} />
          </div>

          {/* Descripción del paso activo */}
          <motion.p
            key={active}
            className="hiw__caption"
            initial={{ opacity: 0, y: reduce ? 0 : 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease }}
          >
            {copy.steps[active].text}
          </motion.p>
        </div>
      </div>
    </section>
  )
}
