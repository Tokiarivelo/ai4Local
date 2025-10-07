'use client';

import { ThemeProvider } from 'next-themes';
import { useState } from 'react';
import { Header } from '../modules/home/layout/header';
import { HeroSection } from '../modules/home/modules/hero-section';
import { FeaturesSection } from '../modules/home/modules/features-section';
import { Footer } from '../modules/home/layout/footer';
import { CTASection } from '../modules/home/modules/cta-section';

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
