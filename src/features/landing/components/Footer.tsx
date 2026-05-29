import Logo from "./Logo"
import { useLang } from "../i18n"

export default function Footer() {
  const { t } = useLang()
  const { columns, brand, rights, legal } = t.footer

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__top">
          <div className="footer__brand">
            <Logo />
            <p className="footer__tagline">{brand}</p>
          </div>

          <nav className="footer__cols" aria-label="Enlaces del pie de página">
            {columns.map((c) => (
              <div key={c.title} className="footer__col">
                <h4>{c.title}</h4>
                <ul>
                  {c.links.map((l) => (
                    <li key={l.label}>
                      <a href={l.href}>{l.label}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="footer__bottom">
          <span>
            © {new Date().getFullYear()} Brux. {rights}
          </span>
          <div className="footer__legal">
            {legal.map((l) => (
              <a key={l.label} href={l.href}>
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
