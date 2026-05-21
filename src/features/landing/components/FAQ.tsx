import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import Reveal from "./Reveal"
import WordsReveal from "./WordsReveal"
import { useLang } from "../i18n"

const ease = [0.22, 1, 0.36, 1] as const

export default function FAQ() {
  const { t } = useLang()
  const faqs = t.faq.items
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section id="faq" className="section faq">
      <div className="container">
        <div className="section__head">
          <WordsReveal text={t.faq.headingText} highlight={t.faq.headingHighlight} />
        </div>

        <div className="faq__list">
          {faqs.map((f, i) => {
            const isOpen = open === i
            return (
              <Reveal key={f.q} delay={i * 0.05}>
                <div className={`faq__item ${isOpen ? "is-open" : ""}`}>
                  <button
                    type="button"
                    className="faq__q"
                    aria-expanded={isOpen}
                    onClick={() => setOpen(isOpen ? null : i)}
                  >
                    <span>{f.q}</span>
                    <svg
                      className="faq__icon"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="m6 9 6 6 6-6"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        className="faq__a-wrap"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease }}
                      >
                        <p className="faq__a">{f.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
