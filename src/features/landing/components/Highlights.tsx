import { motion } from "framer-motion"
import Reveal from "./Reveal"
import WordsReveal from "./WordsReveal"
import { useLang } from "../i18n"
import { ArrowIcon } from "./icons"

const ease = [0.22, 1, 0.36, 1] as const

const images = [
  "/landing/blake-wisz-Xn5FbEM9564-unsplash.webp",
  "/landing/nejc-soklic-yZ6MnFo5hX0-unsplash.webp",
  "/landing/julio-lopez-b11egyegINk-unsplash.webp",
]

export default function Highlights() {
  const { t } = useLang()
  const items = t.highlights.items.map((it, i) => ({ ...it, img: images[i] }))

  return (
    <section className="section highlights">
      <div className="container">
        <div className="section__head">
          <WordsReveal
            text={t.highlights.headingText}
            highlight={t.highlights.headingHighlight}
          />
        </div>

        <div className="highlights__grid">
          {items.map(({ title, text, img }, i) => (
            <Reveal key={title} delay={i * 0.08}>
              <article className="hlcard">
                <div className="hlcard__media">
                  <motion.img
                    className="hlcard__img"
                    src={img}
                    alt=""
                    loading="lazy"
                    initial={{ scale: 1.05, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.8, ease }}
                  />
                  <span className="hlcard__overlay" aria-hidden="true" />
                </div>

                <h3 className="hlcard__title">{title}</h3>
                <p className="hlcard__text">{text}</p>
                <a className="hlcard__cta" href="#capacidades">
                  {t.highlights.cta}
                  <ArrowIcon />
                </a>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
