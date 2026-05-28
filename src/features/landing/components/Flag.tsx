import {
  // LATAM
  AR, BO, BR, CL, CO, CR, CU, DO, EC, GT, HN, MX, NI, PA, PE, PY, SV, UY, VE,
  // North America
  US, CA,
  // Europa
  ES, PT, GB, FR, DE, IT, NL, BE, CH, IE, SE, NO, DK, FI, PL, EU,
  // Asia / Oceanía
  JP, KR, CN, IN, SG, AU, NZ,
} from "country-flag-icons/react/1x1"

/** Mapa de banderas usadas. Cambiar a /1x1 (cuadrado) es lo que hace que se
 *  vean bien dentro de un círculo: el centro del símbolo queda visible y no
 *  recortamos franjas como pasaba con 3x2. */
const map = {
  ar: AR, bo: BO, br: BR, cl: CL, co: CO, cr: CR, cu: CU, do: DO, ec: EC,
  gt: GT, hn: HN, mx: MX, ni: NI, pa: PA, pe: PE, py: PY, sv: SV, uy: UY, ve: VE,
  us: US, ca: CA,
  es: ES, pt: PT, gb: GB, fr: FR, de: DE, it: IT, nl: NL, be: BE, ch: CH,
  ie: IE, se: SE, no: NO, dk: DK, fi: FI, pl: PL, eu: EU,
  jp: JP, kr: KR, cn: CN, in: IN, sg: SG, au: AU, nz: NZ,
}

export type FlagCode = keyof typeof map

/** Bandera SVG en aspecto 1×1. El consumidor decide el tamaño vía CSS;
 *  el SVG rellena su contenedor. */
export default function Flag({
  cc,
  className,
}: {
  cc: FlagCode
  className?: string
}) {
  const F = map[cc]
  if (!F) return null
  return <F className={`flag ${className ?? ""}`} />
}
