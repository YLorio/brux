import { useState } from "react"
import Reveal from "./Reveal"
import WordsReveal from "./WordsReveal"
import { ArrowIcon } from "./icons"
import { useLang } from "../i18n"

export default function Welcome() {
  const { t } = useLang()
  const copy = t.welcome
  const [value, setValue] = useState("")
  const [sent, setSent] = useState(false)

  return (
    <section id="empezar" className="section welcome">
      <div className="container">
        <Reveal>
          <div className="welcome__card">
            <img
              className="welcome__bg"
              src="/landing/Gemini_Generated_Image_li9bngli9bngli9b.webp"
              alt={copy.bgAlt}
              loading="lazy"
            />

            <div className="welcome__body">
              <WordsReveal
                className="waitlist__title"
                text={copy.title}
                highlight={copy.highlight}
              />
              <p className="waitlist__text">{copy.text}</p>

              {sent ? (
                <p className="waitlist__done">
                  <span>✓</span> {copy.done(value)}
                </p>
              ) : (
                <form
                  className="welcome__form"
                  onSubmit={(e) => {
                    e.preventDefault()
                    if (value.trim()) setSent(true)
                  }}
                >
                  <div className="welcome__field">
                    <span className="welcome__prefix">brux.app/@</span>
                    <input
                      className="welcome__input"
                      value={value}
                      onChange={(e) => setValue(e.target.value.replace(/\s/g, ""))}
                      placeholder={copy.placeholder}
                      aria-label={copy.inputLabel}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn--primary btn--lg">
                    {copy.submit} <ArrowIcon />
                  </button>
                </form>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
