import Reveal from "./Reveal"

const metrics = [
  { value: "16M+", label: "personas y negocios" },
  { value: "150+", label: "países conectados" },
  { value: "$3B+", label: "movidos cada año" },
  { value: "99.9%", label: "disponibilidad" },
]

export default function SocialProof() {
  return (
    <section className="proof">
      <div className="container">
        <Reveal className="proof__lead">
          <span>Con la confianza de millones para mover su dinero sin fronteras</span>
        </Reveal>

        <div className="proof__metrics">
          {metrics.map((m, i) => (
            <Reveal key={m.label} delay={i * 0.06} className="proof__item">
              <span className="proof__value">{m.value}</span>
              <span className="proof__label">{m.label}</span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
