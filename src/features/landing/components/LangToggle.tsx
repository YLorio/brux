import { LANGS, useLang, type Lang } from "../i18n"

const labels: Record<Lang, string> = { es: "ES", en: "EN" }

type Props = {
  className?: string
}

/** Selector segmentado ES · EN. Reutilizable en navbar y menú móvil. */
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
          {labels[code]}
        </button>
      ))}
    </div>
  )
}
