'use client';

import React from 'react';
import { Button } from '@/app/modules/ui/button';

export function CTASection() {
  return (
    <section className="bg-blue-600 dark:bg-blue-800 text-white py-16">
      <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Prêt à transformer votre business ?</h2>
        <p className="text-xl mb-8 text-blue-100">
          Rejoignez les PME malgaches qui utilisent déjà AI4Local pour développer leur activité.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="bg-white text-blue-600 hover:bg-gray-100 dark:bg-gray-100 dark:text-blue-800 dark:hover:bg-gray-200"
          >
            Créer mon compte
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-white text-white hover:bg-white hover:text-blue-600 dark:hover:bg-gray-100 dark:hover:text-blue-800"
          >
            Contacter l&apos;équipe
          </Button>
        </div>
      </div>
    </section>
  );
}
