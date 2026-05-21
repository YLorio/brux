import Logo from "./Logo"
import { useLang } from "../i18n"

export default function Footer() {
  const { t } = useLang()
  const { columns, brand, rights, legal } = t.footer

  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <Logo />
          <p>{brand}</p>
        </div>

        <div className="footer__cols">
          {columns.map((c) => (
            <div key={c.title} className="footer__col">
              <h4>{c.title}</h4>
              <ul>
                {c.links.map((l) => (
                  <li key={l}>
                    <a href="#">{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="container footer__bottom">
        <span>© {new Date().getFullYear()} Brux. {rights}</span>
        <div className="footer__legal">
          {legal.map((l) => (
            <a key={l} href="#">
              {l}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
