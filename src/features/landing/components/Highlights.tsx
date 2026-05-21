import { motion } from "framer-motion"
import Reveal from "./Reveal"
import WordsReveal from "./WordsReveal"
import { useLang } from "../i18n"

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
          {items.map((it, i) => (
            <Reveal key={it.title} delay={i * 0.1}>
              <article className="imgcard">
                <motion.img
                  className="imgcard__img"
                  src={it.img}
                  alt=""
                  loading="lazy"
                  initial={{ scale: 1.18, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: false, margin: "-60px" }}
                  whileHover={{ scale: 1.06, transition: { duration: 0.4 } }}
                  transition={{ duration: 1.1, ease }}
                />
                <div className="imgcard__overlay">
                  <h3 className="imgcard__title">{it.title}</h3>
                  <p className="imgcard__text">{it.text}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
