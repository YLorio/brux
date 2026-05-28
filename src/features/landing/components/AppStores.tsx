import Reveal from "./Reveal"
import WordsReveal from "./WordsReveal"
import { useLang } from "../i18n"
import { AppleIcon, GooglePlayIcon } from "./icons"

export default function AppStores() {
  const { t } = useLang()
  const copy = t.appStores

  return (
    <section id="descarga" className="section appstores">
      <div className="container">
        <div className="appstores__inner">
          <Reveal className="appstores__copy">
            <span className="eyebrow">{copy.eyebrow}</span>
            <WordsReveal text={copy.title} highlight={copy.highlight} />
            <p className="appstores__text">{copy.text}</p>

            <div className="appstores__buttons">
              <a
                className="storebtn"
                href="#"
                aria-label={`${copy.apple.small} ${copy.apple.big}`}
              >
                <span className="storebtn__icon storebtn__icon--apple">
                  <AppleIcon />
                </span>
                <span className="storebtn__copy">
                  <span className="storebtn__small">{copy.apple.small}</span>
                  <span className="storebtn__big">{copy.apple.big}</span>
                </span>
              </a>
              <a
                className="storebtn"
                href="#"
                aria-label={`${copy.google.small} ${copy.google.big}`}
              >
                <span className="storebtn__icon">
                  <GooglePlayIcon />
                </span>
                <span className="storebtn__copy">
                  <span className="storebtn__small">{copy.google.small}</span>
                  <span className="storebtn__big">{copy.google.big}</span>
                </span>
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="appstores__visual">
            <img
              src="/landing/mockup_hero.png"
              alt={copy.shotAlt}
              className="appstores__mockup"
              loading="lazy"
            />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
