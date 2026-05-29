import Flag, { type FlagCode } from "./Flag"
import { LANGS, useLang, type Lang } from "../i18n"

const labels: Record<Lang, string> = { es: "ES", en: "EN" }
/** Bandera por idioma: España para ES, Reino Unido para EN. */
const flagFor: Record<Lang, FlagCode> = { es: "es", en: "gb" }

type Props = {
  className?: string
}

/** Selector segmentado 🇪🇸 ES · 🇬🇧 EN. Reutilizable en navbar y menú móvil. */
export default function LangToggle({ className }: Props) {
  const { lang, setLang, t } = useLang()

  return (
    <div
      className={`nav__lang ${className ?? ""}`}
      role="group"
      aria-label={t.langSwitch}
    >
      {LANGS.map((code) => (
        <button
          key={code}
          type="button"
          className={lang === code ? "is-active" : ""}
          aria-pressed={lang === code}
          lang={code}
          onClick={() => setLang(code)}
        >
          <span className="nav__lang-flag" aria-hidden="true">
            <Flag cc={flagFor[code]} />
          </span>
          {labels[code]}
        </button>
      ))}
    </div>
  )
}
