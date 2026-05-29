import { useEffect } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import './index.css';
import './App.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Highlights from './components/Highlights';
import HowItWorks from './components/HowItWorks';
import Capabilities from './components/Capabilities';
import Countries from './components/Countries';
import AppStores from './components/AppStores';
import FAQ from './components/FAQ';
import Welcome from './components/Welcome';
import Footer from './components/Footer';
import { LanguageProvider } from './i18n';

export function LandingPage() {
  // El landing es público y SIEMPRE claro. El ThemeProvider de la app pone
  // `html.dark` si el usuario activó el tema oscuro del panel; esa clase se
  // queda pegada al volver a `/` y filtra un "modo oscuro a medias" (inputs,
  // scrollbars, body vía color-scheme). Mientras el landing esté montado le
  // quitamos la clase y la restauramos al salir para no romper el panel.
  useEffect(() => {
    const root = document.documentElement;
    const wasDark = root.classList.contains('dark');
    root.classList.remove('dark');
    return () => {
      if (wasDark) root.classList.add('dark');
    };
  }, []);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.3,
  });

  return (
    <LanguageProvider>
      <div className="brux-landing">
        <motion.div className="scroll-progress" style={{ scaleX: progress }} />
        <Navbar />
        {/* Orden (ritmo de tonos A·B·B·A·A·B·A·B, sin tríos del mismo):
            1. Hero ─────────── Hook + waitlist            (gris)
            2. Countries ────── Trust signal global        (blanco)
            3. Highlights ───── 3 beneficios principales   (blanco)
            4. HowItWorks ──── 3 pasos para empezar        (gris)
            5. Capabilities ── "El @usuario es solo el comienzo" (gris)
            6. AppStores ───── Preview móvil               (blanco)
            7. FAQ ──────────── Objeciones                 (gris)
            8. Welcome ──────── Cierre — reserva tu @usuario (blanco) */}
        <main>
          <Hero />
          <Countries />
          <Highlights />
          <HowItWorks />
          <Capabilities />
          <AppStores />
          <FAQ />
          <Welcome />
        </main>
        <Footer />
      </div>
    </LanguageProvider>
  );
}
