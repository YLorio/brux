import type { ReactNode } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowIcon } from "./icons"
import WordsReveal from "./WordsReveal"
import { useLang } from "../i18n"

const ease = [0.22, 1, 0.36, 1] as const
const up = (delay: number) => ({
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: false, margin: "-80px" },
  transition: { duration: 0.5, delay, ease },
})

type HeroProps = {
  id?: string
  title?: string
  highlight?: string
  lead?: ReactNode
  /** Variante centrada: sin mockup, texto al centro. */
  centered?: boolean
}

export default function Hero({
  id = "inicio",
  title,
  highlight,
  lead,
  centered = false,
}: HeroProps) {
  const { t } = useLang()
  const copy = t.hero
  const heroTitle = title ?? copy.title
  const heroHighlight = highlight ?? copy.highlight
  const heroLead = lead ?? copy.lead

  return (
    <section id={id} className={`hero ${centered ? "hero--centered" : ""}`}>
      {centered && (
        <div className="hero__bg" aria-hidden="true">
          <div className="hero__grid" />
        </div>
      )}

      <div className="container hero__inner">
        <div className="hero__copy">
          <WordsReveal
            as="h1"
            className="hero__title"
            text={heroTitle}
            highlight={heroHighlight}
          />

          <motion.p className="hero__lead" {...up(0.12)}>
            {heroLead}
          </motion.p>

          <motion.div className="hero__actions" {...up(0.2)}>
            <a href="#empezar" className="btn btn--primary btn--lg">
              {copy.ctaPrimary} <ArrowIcon />
            </a>
            <Link to="/login" className="btn btn--glass btn--lg">
              {copy.ctaSecondary}
            </Link>
          </motion.div>

          <motion.p className="hero__note" {...up(0.28)}>
            {copy.note}
          </motion.p>
        </div>

        {!centered && (
          <motion.div
            className="hero__visual"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.15, ease }}
          >
            <img className="hero__shot" src="/landing/dashboard.jpg" alt={copy.shotAlt} />
          </motion.div>
        )}
      </div>
    </section>
  )
}
