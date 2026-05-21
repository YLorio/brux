import type { ReactNode } from "react"
import Reveal from "./Reveal"
import WordsReveal from "./WordsReveal"
import { CheckIcon } from "./icons"
import Globe from "./Globe"
import { useLang } from "../i18n"

export default function Showcase() {
  const { t } = useLang()

  const visuals: { visual: ReactNode; reverse: boolean }[] = [
    {
      visual: (
        <img
          className="showcase__img"
          src="/landing/profile-card.jpg"
          alt={t.showcase.profileAlt}
          loading="lazy"
        />
      ),
      reverse: false,
    },
    { visual: <Globe />, reverse: true },
  ]

  const rows = t.showcase.rows.map((r, i) => ({ ...r, ...visuals[i] }))

  return (
    <section id="producto" className="section showcase">
      <div className="container">
        {rows.map((r) => (
          <div
            key={r.title}
            className={`feature-row ${r.reverse ? "feature-row--reverse" : ""}`}
          >
            <div className="feature-row__text">
              <WordsReveal text={r.title} highlight={r.highlight} />
              <Reveal delay={0.15}>
                <p>{r.text}</p>
                <ul className="feat-list">
                  {r.points.map((p) => (
                    <li key={p}>
                      <CheckIcon /> {p}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>

            <Reveal delay={0.1} y={24} className="feature-row__visual">
              {r.visual}
            </Reveal>
          </div>
        ))}
      </div>
    </section>
  )
}
