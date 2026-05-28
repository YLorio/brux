import { motion, useScroll, useSpring } from 'framer-motion';
import './index.css';
import './App.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Highlights from './components/Highlights';
import Capabilities from './components/Capabilities';
import Countries from './components/Countries';
import AppStores from './components/AppStores';
import FAQ from './components/FAQ';
import Welcome from './components/Welcome';
import Footer from './components/Footer';
import { LanguageProvider } from './i18n';

export function LandingPage() {
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
        {/* Orden:
            1. Hero ─────────── Hook + waitlist
            2. Countries ────── Trust signal global
            3. Highlights ───── 3 beneficios principales
            4. Capabilities ── "El @usuario es solo el comienzo" + 4 cards
            5. AppStores ───── Preview móvil
            6. FAQ ──────────── Objeciones
            7. Welcome ──────── Cierre — reserva tu @usuario */}
        <main>
          <Hero />
          <Countries />
          <Highlights />
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
