import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Logo from "./Logo"
import LangToggle from "./LangToggle"
import { useLang } from "../i18n"

export default function Navbar() {
  const { t } = useLang()
  const links = t.nav.links
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <motion.header
      className={`nav ${scrolled ? "nav--scrolled" : ""}`}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="container nav__inner">
        <a href="#inicio" className="nav__brand">
          <Logo />
        </a>

        <nav className={`nav__links ${open ? "is-open" : ""}`}>
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={active === l.href ? "is-active" : ""}
              onClick={() => {
                setActive(l.href)
                setOpen(false)
              }}
            >
              {l.label}
            </a>
          ))}
          <LangToggle className="nav__lang--mobile" />
          <a href="#empezar" className="btn btn--primary nav__cta-mobile">
            {t.nav.cta}
          </a>
        </nav>

        <div className="nav__actions">
          <LangToggle />
          <a href="#empezar" className="btn btn--primary">
            {t.nav.cta}
          </a>
        </div>

        <button
          className="nav__burger"
          aria-label={t.nav.menuLabel}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </motion.header>
  )
}
