import { motion, useReducedMotion } from "framer-motion"
import { QRCodeSVG } from "qrcode.react"
import {
  AtSign,
  Copy,
  Send,
  ScanLine,
  QrCode,
  EyeOff,
  Hand,
  BadgeCheck,
  Check,
} from "lucide-react"

/* ==================================================================
   AppDemo — réplica fiel de la UI real de Brux (no un mockup vago).
   Reusa los mismos tokens que la app: brand-500 #00A86B, surface,
   tarjeta de saldo con gradiente from-brand-700→500 + blobs, chip
   @usuario, OrderListItem, VerifiedBadge, botones rounded-xl, Inter.
   Recibe `step` (0·1·2) y muestra la pantalla con transición suave.
   Fuentes: `font-sans` (Inter) para igualar la app, no el Hanken del
   landing.
   ================================================================== */

const ease = [0.22, 1, 0.36, 1] as const

/* Bandera MX redonda para la esquina del avatar (como el <Flag> de la app). */
function FlagMx() {
  return (
    <span className="absolute -bottom-0.5 -right-0.5 h-[15px] w-[15px] overflow-hidden rounded-full ring-2 ring-white">
      <svg viewBox="0 0 3 2" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
        <rect width="1" height="2" x="0" fill="#006847" />
        <rect width="1" height="2" x="1" fill="#fff" />
        <rect width="1" height="2" x="2" fill="#ce1126" />
      </svg>
    </span>
  )
}

/* Avatar monograma (paleta brand de la app: bg-brand-100 / text-brand-700). */
function Avatar({
  size = "md",
  flag = false,
  gradient = false,
}: {
  size?: "md" | "xl"
  flag?: boolean
  gradient?: boolean
}) {
  const dim = size === "xl" ? "h-16 w-16 text-xl" : "h-10 w-10 text-sm"
  return (
    <span className="relative inline-flex shrink-0">
      <span
        className={`inline-flex items-center justify-center rounded-full font-semibold ${dim} ${
          gradient
            ? "bg-gradient-to-br from-brand-400 to-brand-600 text-white"
            : "bg-brand-100 text-brand-700"
        }`}
      >
        MG
      </span>
      {flag && <FlagMx />}
    </span>
  )
}

function Verified({ size = 16 }: { size?: number }) {
  return (
    <BadgeCheck
      className="shrink-0 text-brand-500"
      fill="currentColor"
      stroke="#fff"
      strokeWidth={2.5}
      style={{ width: size, height: size }}
      aria-hidden
    />
  )
}

/* Barra de estado iOS-like. */
function StatusBar() {
  return (
    <div className="flex items-center justify-between px-1 text-[11px] font-semibold text-gray-900">
      <span className="tabular-nums">9:41</span>
      <span className="flex items-center gap-1">
        <svg width="16" height="11" viewBox="0 0 16 11" fill="none" aria-hidden>
          {[2, 5, 8, 11].map((x, i) => (
            <rect key={x} x={x} y={6 - i * 1.6} width="2.4" height={2 + i * 1.6} rx="0.6" fill="#111827" />
          ))}
        </svg>
        <svg width="22" height="11" viewBox="0 0 22 11" fill="none" aria-hidden>
          <rect x="0.5" y="0.8" width="18" height="9.4" rx="2.6" stroke="#111827" opacity="0.4" />
          <rect x="2" y="2.3" width="13" height="6.4" rx="1.4" fill="#111827" />
          <rect x="20" y="3.6" width="1.6" height="3.8" rx="0.8" fill="#111827" opacity="0.4" />
        </svg>
      </span>
    </div>
  )
}

/* --- Paso 1 · Crea tu @usuario (modelado en la tarjeta de identidad) --- */
function ScreenAccount() {
  return (
    <div className="flex h-full flex-col gap-3 bg-gray-50 px-4 pb-4 pt-3 font-sans">
      <StatusBar />
      <div className="flex items-center justify-between">
        <span className="text-base font-semibold tracking-tight text-gray-900">
          Crea tu cuenta
        </span>
        <span className="text-xs font-medium text-gray-400">Paso 1 de 3</span>
      </div>

      {/* Card de identidad (igual que el Dashboard) */}
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-5 shadow-card">
        <Avatar size="xl" flag />
        <div className="text-center">
          <p className="flex items-center justify-center gap-1.5 font-semibold text-gray-900">
            María González <Verified size={16} />
          </p>
          <p className="text-sm text-gray-500">México · MXN</p>
        </div>
      </div>

      {/* Campo @usuario con disponibilidad */}
      <div>
        <span className="text-xs font-medium text-gray-500">Elige tu @usuario</span>
        <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3.5 py-3">
          <AtSign className="h-4 w-4 text-brand-500" strokeWidth={2.2} aria-hidden />
          <span className="text-[15px] font-semibold text-gray-900">maria</span>
          <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700">
            <Check className="h-3 w-3" strokeWidth={3} /> Disponible
          </span>
        </div>
      </div>

      <button
        type="button"
        className="mt-auto inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand-500 text-sm font-medium text-white shadow-soft"
      >
        Crear mi cuenta
      </button>
    </div>
  )
}

/* --- Paso 2 · Comparte o escanea (igual que el QrModal "Recibir un pago") --- */
function ScreenQr() {
  return (
    <div className="flex h-full flex-col gap-3 bg-gray-50 px-4 pb-4 pt-3 font-sans">
      <StatusBar />
      <span className="text-base font-semibold tracking-tight text-gray-900">
        Recibir un pago
      </span>

      <div className="flex flex-1 flex-col items-center gap-4 rounded-2xl border border-gray-200 bg-white px-4 py-5 shadow-card">
        <p className="text-center text-sm text-gray-500">
          Comparte tu @usuario o este QR. No necesitas dar datos bancarios.
        </p>
        <div className="rounded-2xl border border-gray-200 bg-white p-4">
          <QRCodeSVG
            value="https://brux.app/@maria"
            size={132}
            fgColor="#111827"
            bgColor="#FFFFFF"
            level="M"
          />
        </div>
        <div className="flex w-full items-center justify-between gap-3 rounded-xl bg-gray-100 px-4 py-3">
          <span className="flex items-center gap-1.5 font-semibold text-gray-900">
            <AtSign className="h-4 w-4 text-brand-500" aria-hidden />
            maria
          </span>
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-600">
            <Copy className="h-4 w-4" /> Copiar
          </span>
        </div>
      </div>

      <button
        type="button"
        className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700"
      >
        Listo
      </button>
    </div>
  )
}

/* --- Paso 3 · El dinero llega (Dashboard: WalletCard + movimientos) --- */
function ScreenDashboard() {
  return (
    <div className="flex h-full flex-col gap-3 bg-gray-50 px-4 pb-4 pt-3 font-sans">
      <StatusBar />
      <div>
        <h3 className="flex items-center gap-1.5 text-lg font-semibold tracking-tight text-gray-900">
          Hola, María
          <Hand className="h-4 w-4 origin-[70%_80%] animate-wave text-warning-500" aria-hidden />
        </h3>
      </div>

      {/* Tarjeta de saldo — réplica de WalletCard */}
      <div className="relative flex flex-col overflow-hidden rounded-3xl bg-gradient-to-br from-brand-700 via-brand-600 to-brand-500 p-5 text-white shadow-glow">
        <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-white/15 blur-3xl" />
        <div className="absolute -bottom-20 -left-10 h-44 w-44 rounded-full bg-black/15 blur-3xl" />

        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-2">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-white/90">
              Saldo disponible
            </p>
            <EyeOff className="h-3.5 w-3.5 text-white/80" />
          </div>
          <span className="rounded-full bg-white/20 px-2.5 py-1 text-[11px] font-semibold backdrop-blur">
            @maria
          </span>
        </div>

        <div className="relative mt-1.5">
          <p className="text-[28px] font-bold leading-none tracking-tight tabular-nums">
            $3,480.00
          </p>
          <p className="mt-1.5 text-xs font-medium text-white/90">MXN · Peso mexicano</p>
        </div>

        <div className="relative mt-4 grid grid-cols-3 divide-x divide-white/20 rounded-2xl bg-white/15 backdrop-blur">
          {[
            { label: "Enviados", value: 12 },
            { label: "Recibidos", value: 8 },
            { label: "En curso", value: 1 },
          ].map((it) => (
            <div key={it.label} className="px-2 py-2.5 text-center">
              <p className="text-base font-bold tabular-nums">{it.value}</p>
              <p className="mt-0.5 text-[10px] font-medium text-white/85">{it.label}</p>
            </div>
          ))}
        </div>

        <div className="relative mt-4 flex gap-2.5">
          <span className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-2xl bg-white text-sm font-semibold text-brand-700">
            <Send className="h-4 w-4" /> Enviar
          </span>
          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/20 backdrop-blur">
            <ScanLine className="h-4 w-4" />
          </span>
          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/20 backdrop-blur">
            <QrCode className="h-4 w-4" />
          </span>
        </div>
      </div>

      {/* Movimientos recientes */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-card">
        <div className="flex items-center justify-between px-4 py-2.5">
          <span className="text-[13px] font-semibold text-gray-900">
            Movimientos recientes
          </span>
          <span className="text-xs font-medium text-brand-600">Ver todos</span>
        </div>
        <div className="divide-y divide-gray-100">
          {/* fila entrante (recién llegó) */}
          <div className="flex items-center gap-2.5 px-4 py-2.5">
            <Avatar />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-medium text-gray-900">
                Recibiste de @ana
              </p>
              <p className="truncate text-[11px] text-gray-500">BRX-4821 · ahora</p>
            </div>
            <div className="flex flex-col items-end gap-0.5">
              <span className="text-[13px] font-semibold tabular-nums text-brand-600">
                +$1,250.00
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-1.5 py-0.5 text-[10px] font-medium text-brand-700">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-500" /> Completada
              </span>
            </div>
          </div>
          {/* fila saliente */}
          <div className="flex items-center gap-2.5 px-4 py-2.5">
            <Avatar />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-medium text-gray-900">
                Enviaste a @juan
              </p>
              <p className="truncate text-[11px] text-gray-500">BRX-4810 · hace 2 h</p>
            </div>
            <div className="flex flex-col items-end gap-0.5">
              <span className="text-[13px] font-semibold tabular-nums text-gray-900">
                −$250.00
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-1.5 py-0.5 text-[10px] font-medium text-warning-700">
                <span className="h-1.5 w-1.5 rounded-full bg-warning-500" /> Procesando
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const SCREENS = [ScreenAccount, ScreenQr, ScreenDashboard]

export default function AppDemo({ step }: { step: number }) {
  const reduce = useReducedMotion()
  const Active = SCREENS[step] ?? SCREENS[0]

  return (
    <div className="appdemo">
      <div className="appdemo__glow" aria-hidden="true" />
      <div className="appdemo__viewport">
        {/* Una sola pantalla montada a la vez: al cambiar `step`, el keyed
            motion.div se reemplaza (la anterior se desmonta, la nueva entra
            con fade). Siempre en sync con la lista de pasos, sin pantallas
            apiladas. */}
        <motion.div
          key={step}
          className="appdemo__screen"
          initial={{ opacity: 0, y: reduce ? 0 : 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease }}
        >
          {/* Lienzo a tamaño fijo (300×600) escalado por CSS al viewport:
              las proporciones del contenido se mantienen igual sin importar
              el tamaño del teléfono. El scale va aquí (no en el motion.div,
              que ya usa transform para animar `y`). */}
          <div className="appdemo__canvas">
            <Active />
          </div>
        </motion.div>
      </div>
    </div>
  )
}
