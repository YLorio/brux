import { motion } from "framer-motion"
import Flag, { type FlagCode } from "./Flag"

const points = [
  { cx: 130, cy: 150 },
  { cx: 360, cy: 120 },
  { cx: 95, cy: 300 },
  { cx: 380, cy: 320 },
  { cx: 240, cy: 90 },
  { cx: 250, cy: 400 },
]

const arcs = [
  "M130 150 Q 240 40 360 120",
  "M95 300 Q 230 200 380 320",
  "M130 150 Q 120 280 250 400",
  "M360 120 Q 420 240 380 320",
  "M240 90 Q 120 180 95 300",
]

const chips: { label: string; cc: FlagCode; x: string; y: string; d: number }[] = [
  { label: "USD", cc: "us", x: "2%", y: "14%", d: 0 },
  { label: "BRL", cc: "br", x: "76%", y: "4%", d: 0.4 },
  { label: "COP", cc: "co", x: "84%", y: "56%", d: 0.8 },
  { label: "ARS", cc: "ar", x: "-4%", y: "62%", d: 1.2 },
  { label: "MXN", cc: "mx", x: "60%", y: "88%", d: 1.6 },
]

/** Visualización de la red global de pagos: esfera + arcos animados + divisas. */
export default function Globe() {
  return (
    <div className="globe">
      <svg
        viewBox="0 0 480 480"
        className="globe__svg"
        role="img"
        aria-label="Red global de pagos de Brux"
      >
        <defs>
          <radialGradient id="globe-fill" cx="50%" cy="40%" r="65%">
            <stop offset="0%" stopColor="rgba(10,157,102,0.16)" />
            <stop offset="100%" stopColor="rgba(10,157,102,0)" />
          </radialGradient>
          <clipPath id="globe-clip">
            <circle cx="240" cy="240" r="150" />
          </clipPath>
        </defs>

        <circle cx="240" cy="240" r="150" fill="url(#globe-fill)" />
        <circle
          cx="240"
          cy="240"
          r="150"
          fill="none"
          stroke="rgba(10,28,36,0.16)"
        />
        <g clipPath="url(#globe-clip)" stroke="rgba(10,28,36,0.1)" fill="none">
          <ellipse cx="240" cy="240" rx="150" ry="55" />
          <ellipse cx="240" cy="240" rx="150" ry="110" />
          <ellipse cx="240" cy="240" rx="55" ry="150" />
          <ellipse cx="240" cy="240" rx="110" ry="150" />
          <line x1="90" y1="240" x2="390" y2="240" />
        </g>

        {arcs.map((d, i) => (
          <path
            key={"base" + i}
            d={d}
            fill="none"
            stroke="rgba(10,157,102,0.18)"
            strokeWidth="1.5"
          />
        ))}
        {arcs.map((d, i) => (
          <path
            key={i}
            d={d}
            className="globe__arc"
            fill="none"
            stroke="#0a9d66"
            strokeWidth="3"
            strokeLinecap="round"
            style={{ animationDelay: `${i * 0.6}s` }}
          />
        ))}

        {points.map((p, i) => (
          <g key={i}>
            <circle
              cx={p.cx}
              cy={p.cy}
              r="9"
              className="globe__pulse"
              style={{ animationDelay: `${i * 0.4}s` }}
            />
            <circle cx={p.cx} cy={p.cy} r="4.5" fill="#0a9d66" />
          </g>
        ))}
      </svg>

      {chips.map((c) => (
        <motion.span
          key={c.label}
          className="globe__chip"
          style={{ left: c.x, top: c.y }}
          animate={{ y: [0, -9, 0] }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: c.d,
          }}
        >
          <Flag cc={c.cc} />
          {c.label}
        </motion.span>
      ))}
    </div>
  )
}
