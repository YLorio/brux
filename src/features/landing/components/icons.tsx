import type { SVGProps } from "react"

/* Iconos de línea (stroke = currentColor). Heredan el color del contenedor. */

const base: SVGProps<SVGSVGElement> = {
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
}

export const AtIcon = () => (
  <svg {...base}>
    <circle cx="12" cy="12" r="3.5" />
    <path d="M15.5 12v1.5a2.5 2.5 0 0 0 5 0V12a8.5 8.5 0 1 0-3.4 6.8" />
  </svg>
)

export const PhoneIcon = () => (
  <svg {...base}>
    <rect x="6.5" y="2.5" width="11" height="19" rx="3" />
    <path d="M10.5 18.5h3" />
  </svg>
)

export const MailIcon = () => (
  <svg {...base}>
    <rect x="3" y="5" width="18" height="14" rx="2.5" />
    <path d="m4 7 8 5 8-5" />
  </svg>
)

export const QrIcon = () => (
  <svg {...base}>
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <path d="M14 14h3v3M21 14v.01M14 21h3M21 17v4" />
  </svg>
)

export const BoltIcon = () => (
  <svg {...base}>
    <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" />
  </svg>
)

export const GlobeIcon = () => (
  <svg {...base}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3c2.5 2.5 2.5 15.5 0 18M12 3c-2.5 2.5-2.5 15.5 0 18" />
  </svg>
)

export const ShieldIcon = () => (
  <svg {...base}>
    <path d="M12 3 4 6v6c0 5 3.4 8.5 8 9 4.6-.5 8-4 8-9V6l-8-3Z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
)

export const LockIcon = () => (
  <svg {...base}>
    <rect x="4.5" y="10.5" width="15" height="10" rx="2.5" />
    <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
  </svg>
)

export const FingerprintIcon = () => (
  <svg {...base}>
    <path d="M12 11a2 2 0 0 1 2 2c0 2.5-.4 5-1.2 7" />
    <path d="M8.5 8.6A5 5 0 0 1 17 13c0 1-.1 2-.3 3" />
    <path d="M5.8 11A8 8 0 0 1 12 5a8 8 0 0 1 7 4" />
    <path d="M9 13c0 3-.5 5.4-1.5 7.5" />
  </svg>
)

export const SwapIcon = () => (
  <svg {...base}>
    <path d="M4 9h13l-3.5-3.5M20 15H7l3.5 3.5" />
  </svg>
)

export const BriefcaseIcon = () => (
  <svg {...base}>
    <rect x="3" y="7" width="18" height="13" rx="2.5" />
    <path d="M8 7V5.5A2.5 2.5 0 0 1 10.5 3h3A2.5 2.5 0 0 1 16 5.5V7M3 12h18" />
  </svg>
)

export const SparkIcon = () => (
  <svg {...base}>
    <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" />
    <circle cx="12" cy="12" r="2.6" />
  </svg>
)

export const UsersIcon = () => (
  <svg {...base}>
    <circle cx="9" cy="8" r="3.2" />
    <path d="M3.5 20a5.5 5.5 0 0 1 11 0M16 5.2a3.2 3.2 0 0 1 0 5.6M17 20a5.5 5.5 0 0 0-2.5-4.6" />
  </svg>
)

export const CodeIcon = () => (
  <svg {...base}>
    <path d="m8 8-4 4 4 4M16 8l4 4-4 4M13.5 6l-3 12" />
  </svg>
)

export const XIcon = () => (
  <svg width={18} height={18} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M6 6l12 12M18 6 6 18"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
    />
  </svg>
)

export const AppleIcon = () => (
  <svg width={22} height={22} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.6 12.7c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.1-2.8.9-3.5.9-.7 0-1.8-.8-3-.8-1.6 0-3 .9-3.8 2.3-1.6 2.8-.4 7 1.2 9.3.8 1.1 1.7 2.4 2.9 2.3 1.2-.1 1.6-.8 3-.8s1.8.8 3 .8c1.2 0 2-1.1 2.8-2.2.6-.9.9-1.6 1-1.9-.1 0-2.4-1-2.4-3.6z" />
    <path d="M15.3 6.1c.6-.8 1.1-1.9.9-3-1 .1-2.1.7-2.8 1.5-.6.7-1.1 1.8-1 2.8 1.1.1 2.2-.5 2.9-1.3z" />
  </svg>
)

export const PlayIcon = () => (
  <svg width={20} height={20} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M4 3.5v17a1 1 0 0 0 1.5.87l14.6-8.5a1 1 0 0 0 0-1.74L5.5 2.63A1 1 0 0 0 4 3.5z" />
  </svg>
)

export const CheckIcon = () => (
  <svg width={18} height={18} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="m5 12 5 5 9-11"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export const ArrowIcon = () => (
  <svg width={18} height={18} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M5 12h14m-6-6 6 6-6 6"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)
