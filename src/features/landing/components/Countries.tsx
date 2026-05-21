import Reveal from "./Reveal"
import Flag, { type FlagCode } from "./Flag"

const countries: FlagCode[] = ["sv", "br", "co", "ar", "mx", "cr"]

export default function Countries() {
  return (
    <section className="countries">
      <div className="container">
        <Reveal>
          <div className="countries__row">
            {countries.map((cc) => (
              <span key={cc} className="country__flag">
                <Flag cc={cc} cover />
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
