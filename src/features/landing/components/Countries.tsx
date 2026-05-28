import Flag, { type FlagCode } from "./Flag"

/** Foco LATAM primero, después contrapartes globales. Marquee infinito:
 *  el array se duplica para que `translateX(-50%)` empalme sin saltos. */
const countries: FlagCode[] = [
  "sv", "mx", "gt", "hn", "cr", "pa", "co", "ec", "pe",
  "bo", "cl", "ar", "uy", "py", "br", "do", "ve", "cu", "ni",
  "us", "ca", "es", "pt", "gb", "fr", "de", "it", "nl", "pl", "eu",
  "jp", "kr", "sg", "au",
]

export default function Countries() {
  const loop = [...countries, ...countries]
  return (
    <section className="countries" aria-label="Cobertura de países">
      <div className="countries__marquee">
        <ul className="countries__track">
          {loop.map((cc, i) => (
            <li
              key={`${cc}-${i}`}
              className="country__flag"
              title={cc.toUpperCase()}
              aria-hidden={i >= countries.length || undefined}
              // Stagger del float: cada bandera arranca su oscilación con un
              // pequeño desfase. Da sensación de "viento" sin sincronía rígida.
              style={{ animationDelay: `${(i % countries.length) * 120}ms` }}
            >
              <Flag cc={cc} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
