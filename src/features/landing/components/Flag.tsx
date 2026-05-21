import {
  US, EU, GB, JP, MX, CO, ES, DE, BR, SV, AR, CR,
} from "country-flag-icons/react/3x2"

const map = {
  us: US, eu: EU, gb: GB, jp: JP, mx: MX, co: CO, es: ES, de: DE, br: BR,
  sv: SV, ar: AR, cr: CR,
}

export type FlagCode = keyof typeof map

/** Bandera SVG (country-flag-icons). Solo se empaquetan las banderas usadas.
 *  `cover` hace que la bandera rellene su contenedor (para recortes circulares). */
export default function Flag({
  cc,
  className,
  cover,
}: {
  cc: FlagCode
  className?: string
  cover?: boolean
}) {
  const F = map[cc]
  return (
    <F
      className={`flag ${className ?? ""}`}
      preserveAspectRatio={cover ? "xMidYMid slice" : undefined}
    />
  )
}
