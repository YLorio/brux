import Reveal from "./Reveal"
import WordsReveal from "./WordsReveal"
import { CheckIcon, XIcon } from "./icons"

const before = [
  "Números de cuenta e IBAN larguísimos",
  "Comisiones ocultas en cada cambio",
  "El dinero tarda días en llegar",
  "Expones tus datos bancarios",
]

const after = [
  "Solo tu @usuario, correo o un QR",
  "Tipo de cambio real, 0% de margen oculto",
  "Llega en segundos, a cualquier país",
  "Nunca compartes datos bancarios",
]

export default function Comparison() {
  return (
    <section className="section compare">
      <div className="container">
        <div className="section__head">
          <WordsReveal text="Recibir dinero de otro país no debería doler" />
          <Reveal delay={0.2}>
            <p className="section__sub">
              Cobrar al extranjero sigue lleno de fricción. Brux lo vuelve tan
              simple como mandar un mensaje.
            </p>
          </Reveal>
        </div>

        <div className="compare__grid">
          <Reveal className="compare__card compare__card--bad">
            <span className="compare__tag">Sin Brux</span>
            <ul className="compare__list">
              {before.map((t) => (
                <li key={t}>
                  <span className="compare__x">
                    <XIcon />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.1} className="compare__card compare__card--good">
            <span className="compare__tag compare__tag--good">Con Brux</span>
            <ul className="compare__list">
              {after.map((t) => (
                <li key={t}>
                  <span className="compare__check">
                    <CheckIcon />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
