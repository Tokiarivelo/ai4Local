'use client';

import React from 'react';
import { Button } from '@/app/modules/ui/button';

export function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 dark:from-blue-800 dark:via-purple-800 dark:to-blue-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Marketing IA pour les <span className="text-yellow-300">PME Locales</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
            Créez des campagnes marketing, générez du contenu avec l&apos;IA, gérez vos clients et
            acceptez les paiements mobiles - tout optimisé pour Madagascar.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
            >
              Démarrer gratuitement
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600"
            >
              Voir la démo
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
