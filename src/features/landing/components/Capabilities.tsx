import type { ReactNode } from "react"
import {
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Share2,
  X,
} from "lucide-react"
import { QRCodeSVG } from "qrcode.react"
import WordsReveal from "./WordsReveal"
import { useLang } from "../i18n"

/* ------------------------------------------------------------------
   Capacidades — 4 cards con un mini "app screen" abajo. La altura del
   card es fija (h-[420px]); el visual se empuja con `mt-auto` para
   tocar el pie y sube 8px en hover (group/group-hover). Cada visual
   es un componente aparte para poder iterar uno sin tocar los demás.
   ------------------------------------------------------------------ */

function CardShell({
  title,
  text,
  children,
}: {
  title: string
  text: string
  children: ReactNode
}) {
  return (
    // Card un escalón más oscuro que el bg de la sección (#f4f5f4 → #ebecec)
    // para que los widgets blancos del interior contrasten y se noten más.
    <div className="group relative flex h-[420px] flex-col overflow-hidden rounded-3xl bg-[#ebecec] p-7 ring-1 ring-gray-300/40">
      <h3 className="text-xl font-semibold tracking-tight text-gray-900">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-gray-500">{text}</p>
      <div className="mt-auto pt-6 transition-transform duration-500 group-hover:-translate-y-2">
        {children}
      </div>
    </div>
  )
}

/* Banderitas simples en SVG inline. Evitamos depender del CSS de
   flag-icons aquí porque está pensado para iconos discretos. */
function FlagDot({ code }: { code: "us" | "mx" }) {
  if (code === "us") {
    return (
      <span className="flex h-6 w-6 items-center justify-center overflow-hidden rounded-full ring-1 ring-gray-900/10">
        <svg viewBox="0 0 24 24" className="h-full w-full">
          <rect width="24" height="24" fill="#fff" />
          {[0, 2, 4, 6, 8, 10].map((y) => (
            <rect key={y} x="0" y={y * 2} width="24" height="2" fill="#B22234" />
          ))}
          <rect width="11" height="12" fill="#3C3B6E" />
        </svg>
      </span>
    )
  }
  return (
    <span className="flex h-6 w-6 items-center justify-center overflow-hidden rounded-full ring-1 ring-gray-900/10">
      <svg viewBox="0 0 24 24" className="h-full w-full">
        <rect width="8" height="24" fill="#006847" />
        <rect x="8" width="8" height="24" fill="#fff" />
        <rect x="16" width="8" height="24" fill="#CE1126" />
      </svg>
    </span>
  )
}

/* --- Visual 1: Entre países ---
   Mini widget de transferencia: dos chips de país con un arrow flow,
   monto en grande y dots de progreso. Se siente como un "estado en
   curso" dentro de la app. */
function CrossBorderVis() {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-400">
          Transferencia
        </span>
        <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-semibold text-brand-700">
          En camino
        </span>
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <FlagDot code="us" />
          <div>
            <div className="text-[10px] text-gray-400">Desde</div>
            <div className="text-xs font-semibold text-gray-900">USA</div>
          </div>
        </div>
        <ArrowRight className="h-4 w-4 text-brand-500" strokeWidth={2.5} />
        <div className="flex items-center gap-2">
          <FlagDot code="mx" />
          <div>
            <div className="text-[10px] text-gray-400">Hacia</div>
            <div className="text-xs font-semibold text-gray-900">México</div>
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-xl bg-gray-50 px-3 py-2">
        <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-400">
          Monto
        </div>
        <div className="text-lg font-bold tabular text-gray-900">$1,250.00</div>
      </div>

      {/* Progreso 3 pasos */}
      <div className="mt-3 flex items-center gap-1.5">
        <span className="h-1.5 flex-1 rounded-full bg-brand-500" />
        <span className="h-1.5 flex-1 rounded-full bg-brand-500" />
        <span className="h-1.5 flex-1 rounded-full bg-gray-200" />
      </div>
    </div>
  )
}

/* --- Visual 2: Envía a una persona ---
   Mini "Confirmar envío" — destinatario seleccionado, monto y un CTA
   verde "Enviar". Replica el step 3 del flow de envío de la app. */
function SendPersonVis() {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-400">
          Para
        </span>
        <X className="h-3.5 w-3.5 text-gray-300" />
      </div>

      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-brand-600 text-sm font-bold text-white">
          M
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1 truncate text-sm font-semibold text-gray-900">
            Maria González
            <CheckCircle2 className="h-3 w-3 shrink-0 text-brand-500" strokeWidth={2.5} />
          </div>
          <div className="text-[10px] text-gray-500">@maria · México</div>
        </div>
      </div>

      <div className="mt-3 rounded-xl bg-gray-50 px-3 py-2.5">
        <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-400">
          Monto
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-base text-gray-400">$</span>
          <span className="text-xl font-bold tabular text-gray-900">50.00</span>
        </div>
      </div>

      <button
        type="button"
        className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl bg-brand-500 py-2.5 text-xs font-semibold text-white"
      >
        Enviar $50.00 <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.5} />
      </button>
    </div>
  )
}

/* --- Visual 3: Cobro con QR ---
   Mini pantalla "Cobrar" como dentro de la app. QR REAL via
   qrcode.react (valor brux.app/@cafe.nube), monto, alias y un CTA
   "Compartir QR" — replica la pantalla de receive. */
function QrVis() {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
      {/* "Handle" del modal — guiño al sheet de la app */}
      <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-gray-200" />

      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-900">Cobrar</span>
        <X className="h-3.5 w-3.5 text-gray-300" />
      </div>

      <div className="flex justify-center rounded-xl bg-gray-50 p-3">
        <QRCodeSVG
          value="https://brux.app/@cafe.nube?amount=45"
          size={96}
          fgColor="#0b1b24"
          bgColor="transparent"
          marginSize={0}
          level="M"
        />
      </div>

      <div className="mt-3 text-center">
        <div className="text-lg font-bold tabular text-gray-900">$45.00</div>
        <div className="mt-0.5 text-[11px] text-gray-500">@cafe.nube</div>
      </div>

      <button
        type="button"
        className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl bg-brand-500 py-2 text-[11px] font-semibold text-white"
      >
        <Share2 className="h-3.5 w-3.5" strokeWidth={2.5} /> Compartir QR
      </button>
    </div>
  )
}

/* --- Visual 4: Control y seguridad ---
   Lista de movimientos con badges de estado + chip de "trazable".
   Replica el feed de actividad de la app. */
function ControlVis() {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-400">
          Movimientos
        </span>
        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-brand-700">
          <ShieldCheck className="h-3 w-3" strokeWidth={2.5} /> Verificado
        </span>
      </div>

      <ul className="space-y-2.5">
        <li className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-50">
            <ArrowRight className="h-3.5 w-3.5 rotate-[-45deg] text-brand-600" strokeWidth={2.5} />
          </span>
          <div className="min-w-0 flex-1">
            <div className="truncate text-xs font-semibold text-gray-900">
              $250.00 a @juan
            </div>
            <div className="text-[10px] text-gray-400">Completada · hace 2h</div>
          </div>
          <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-brand-500" strokeWidth={2.5} />
        </li>

        <li className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-50">
            <ArrowRight className="h-3.5 w-3.5 rotate-[135deg] text-brand-600" strokeWidth={2.5} />
          </span>
          <div className="min-w-0 flex-1">
            <div className="truncate text-xs font-semibold text-gray-900">
              +$1,250.00 de @ana
            </div>
            <div className="text-[10px] text-gray-400">Completada · ayer</div>
          </div>
          <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-brand-500" strokeWidth={2.5} />
        </li>

        <li className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-50">
            <ArrowRight className="h-3.5 w-3.5 rotate-[-45deg] text-amber-600" strokeWidth={2.5} />
          </span>
          <div className="min-w-0 flex-1">
            <div className="truncate text-xs font-semibold text-gray-900">
              $45.00 a @cafe.nube
            </div>
            <div className="text-[10px] text-gray-400">Procesando</div>
          </div>
        </li>
      </ul>
    </div>
  )
}

const VISUALS = [CrossBorderVis, SendPersonVis, QrVis, ControlVis]

export default function Capabilities() {
  const { t } = useLang()
  const copy = t.capabilities

  return (
    <section id="capacidades" className="section capabilities">
      <div className="container">
        {/* Encabezado centrado — usa .section__head para que el h2 tome el
            tamaño fluido `--fs-3xl` definido en App.css. */}
        <div className="section__head">
          <WordsReveal text={copy.headingText} highlight={copy.headingHighlight} />
          <p className="section__sub">{copy.sub}</p>
        </div>

        {/* Grid de cards — 1 col móvil, 2 col tablet, 4 col desktop */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {copy.cards.map((c, i) => {
            const Vis = VISUALS[i] ?? VISUALS[0]
            return (
              <CardShell key={c.title} title={c.title} text={c.text}>
                <Vis />
              </CardShell>
            )
          })}
        </div>
      </div>
    </section>
  )
}
