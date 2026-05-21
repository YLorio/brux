import Reveal from "./Reveal"
import WordsReveal from "./WordsReveal"
import {
  AtIcon,
  CodeIcon,
  GlobeIcon,
  LockIcon,
  QrIcon,
  ShieldIcon,
} from "./icons"
import { useLang } from "../i18n"

const icons = [
  <GlobeIcon />,
  <QrIcon />,
  <AtIcon />,
  <ShieldIcon />,
  <LockIcon />,
  <CodeIcon />,
]

export default function Bento() {
  const { t } = useLang()
  const cards = t.bento.cards.map((c, i) => ({ ...c, icon: icons[i] }))

  return (
    <section id="capacidades" className="section bento">
      <div className="container bento__split">
        <div className="bento__copy">
          <WordsReveal
            text={t.bento.headingText}
            highlight={t.bento.headingHighlight}
          />
          <Reveal delay={0.15}>
            <p className="section__sub">{t.bento.sub}</p>
          </Reveal>
        </div>

        <div className="bento__grid">
          {cards.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.06}>
              <article className="capcard">
                <span className="capcard__icon">{c.icon}</span>
                <h3>{c.title}</h3>
                <p>{c.text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
