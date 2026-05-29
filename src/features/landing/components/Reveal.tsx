import { useEffect, useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import type { ReactNode } from "react"

type RevealProps = {
  children: ReactNode
  /** Retardo de entrada en segundos. */
  delay?: number
  /** Desplazamiento vertical inicial. */
  y?: number
  className?: string
}

/** Envoltura con fade-up sutil al entrar en el viewport (una sola vez).
 *
 *  Usa `useInView` (hook) + un fallback por timeout: si el observer no
 *  llega a disparar (scroll muy rápido, remount al cambiar idioma, o un
 *  elemento que nunca cruza el umbral), igual se muestra el contenido a
 *  los ~1.1s. Así NUNCA queda texto atascado en opacity:0. */
export default function Reveal({
  children,
  delay = 0,
  y = 16,
  className,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  const [fallback, setFallback] = useState(false)

  useEffect(() => {
    const id = setTimeout(() => setFallback(true), 1100)
    return () => clearTimeout(id)
  }, [])

  const show = inView || fallback

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y }}
      animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
