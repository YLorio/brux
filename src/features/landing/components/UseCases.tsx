import Reveal from "./Reveal"
import WordsReveal from "./WordsReveal"
import { ArrowIcon, BriefcaseIcon, CheckIcon, SparkIcon } from "./icons"

const cases = [
  {
    icon: <BriefcaseIcon />,
    tag: "Para negocios",
    title: "Cobra a clientes de todo el mundo",
    points: [
      "Links de pago y QR con tu marca",
      "Paga a tu equipo y proveedores globales",
      "Conciliación y API para automatizar",
    ],
    cta: "Abrir cuenta de negocio",
    accent: "green",
  },
  {
    icon: <SparkIcon />,
    tag: "Para creadores",
    title: "Que tu audiencia te apoye sin fricción",
    points: [
      "Recibe propinas con solo tu @usuario",
      "Cobros recurrentes de tus suscriptores",
      "Sin compartir datos bancarios jamás",
    ],
    cta: "Empezar como creador",
    accent: "cyan",
  },
]

export default function UseCases() {
  return (
    <section id="casos" className="section usecases">
      <div className="container">
        <div className="section__head">
          <WordsReveal text="Hecho para quien mueve el mundo" />
        </div>

        <div className="usecases__grid">
          {cases.map((c, i) => (
            <Reveal key={c.tag} delay={i * 0.14}>
              <article className={`card usecase usecase--${c.accent}`}>
                <div className="usecase__head">
                  <span className="usecase__icon">{c.icon}</span>
                  <span className="usecase__tag">{c.tag}</span>
                </div>
                <h3>{c.title}</h3>
                <ul className="usecase__list">
                  {c.points.map((p) => (
                    <li key={p}>
                      <CheckIcon /> {p}
                    </li>
                  ))}
                </ul>
                <a href="#empezar" className="usecase__cta">
                  {c.cta} <ArrowIcon />
                </a>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
