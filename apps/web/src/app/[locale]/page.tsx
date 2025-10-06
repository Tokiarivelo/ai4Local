'use client';

import { ThemeProvider } from 'next-themes';
import { useState } from 'react';
import { Header } from '../components/home/layout/header';
import { HeroSection } from '../components/home/modules/hero-section';
import { FeaturesSection } from '../components/home/modules/features-section';
import { Footer } from '../components/home/layout/footer';
import { CTASection } from '../components/home/modules/cta-section';

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <Header onMenuToggle={toggleMenu} isMenuOpen={isMenuOpen} />
      <main>
        <HeroSection />
        <FeaturesSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
