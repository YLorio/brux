import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { LANGS, translations, type Lang, type LandingDict } from "./translations"

interface LanguageContextValue {
  lang: Lang
  setLang: (lang: Lang) => void
  /** Diccionario del idioma activo. */
  t: LandingDict
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

const STORAGE_KEY = "brux:lang"

function isLang(value: string | null): value is Lang {
  return value === "es" || value === "en"
}

function getInitialLang(): Lang {
  if (typeof window === "undefined") return "es"
  const saved = window.localStorage.getItem(STORAGE_KEY)
  if (isLang(saved)) return saved
  // Sin preferencia guardada: seguimos el idioma del navegador. Cualquier
  // variante de inglés (en, en-US, …) usa inglés; el resto cae a español.
  return window.navigator.language?.toLowerCase().startsWith("en") ? "en" : "es"
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(getInitialLang)

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, lang)
    document.documentElement.lang = lang
  }, [lang])

  const setLang = useCallback((next: Lang) => {
    if (LANGS.includes(next)) setLangState(next)
  }, [])

  const value = useMemo<LanguageContextValue>(
    () => ({ lang, setLang, t: translations[lang] }),
    [lang, setLang],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLang(): LanguageContextValue {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error("useLang debe usarse dentro de <LanguageProvider>")
  return ctx
}
