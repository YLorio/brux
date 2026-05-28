import { motion } from "framer-motion"
import type { ReactNode } from "react"

type RevealProps = {
  children: ReactNode
  /** Retardo de entrada en segundos. */
  delay?: number
  /** Desplazamiento vertical inicial. */
  y?: number
  className?: string
}

/** Envoltura con fade-up sutil al entrar en el viewport (una sola vez). */
export default function Reveal({
  children,
  delay = 0,
  y = 16,
  className,
}: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
