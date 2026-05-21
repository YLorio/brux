import { motion, useScroll, useSpring } from 'framer-motion';
import './index.css';
import './App.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Highlights from './components/Highlights';
import Showcase from './components/Showcase';
import Bento from './components/Bento';
import Countries from './components/Countries';
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
        <main>
          <Hero />
          <Countries />
          <Highlights />
          <Showcase />
          <Bento />
          <FAQ />
          <Welcome />
        </main>
        <Footer />
      </div>
    </LanguageProvider>
  );
}
