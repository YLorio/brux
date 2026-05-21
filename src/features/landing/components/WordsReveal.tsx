import { motion, type Variants } from "framer-motion"

const ease = [0.22, 1, 0.36, 1] as const

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
}

const wordV: Variants = {
  hidden: { opacity: 0, y: 16, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease },
  },
}

type Props = {
  /** Texto del encabezado. */
  text: string
  /** Palabra a resaltar en verde (sin signos de puntuación). */
  highlight?: string
  className?: string
  /** Etiqueta a renderizar. */
  as?: "h1" | "h2"
}

/** Encabezado que revela su texto palabra por palabra al entrar en pantalla. */
export default function WordsReveal({
  text,
  highlight,
  className,
  as = "h2",
}: Props) {
  const words = text.split(" ")
  const Comp = as === "h1" ? motion.h1 : motion.h2
  const strip = (s: string) => s.replace(/[.,;:¿?¡!]/g, "").toLowerCase()
  const hlSet = new Set(
    (highlight ?? "").split(" ").map(strip).filter(Boolean)
  )
  return (
    <Comp
      className={className}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, margin: "-80px" }}
    >
      {words.map((w, i) => {
        const isHl = hlSet.has(strip(w))
        return (
          <motion.span
            key={`${w}-${i}`}
            variants={wordV}
            className={isHl ? "text-grad" : undefined}
            style={{ display: "inline-block", whiteSpace: "pre" }}
          >
            {w}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        )
      })}
    </Comp>
  )
}
