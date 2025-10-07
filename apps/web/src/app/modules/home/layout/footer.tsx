'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';

const footerLinks = {
  product: [
    { label: 'Fonctionnalités', href: '#' },
    { label: 'Tarifs', href: '#' },
    { label: 'Démo', href: '#' },
  ],
  support: [
    { label: 'Documentation', href: '#' },
    { label: 'Contact', href: '#' },
    { label: 'Formation', href: '#' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <Sparkles className="h-8 w-8 text-blue-400" />
              <span className="ml-2 text-xl font-bold">AI4Local</span>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              La plateforme marketing IA conçue spécialement pour les PME malgaches. Développez
              votre business avec les outils digitaux adaptés à votre marché.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Produit</h3>
            <ul className="space-y-2 text-gray-400">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="hover:text-white transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-gray-400">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="hover:text-white transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 AI4Local. Tous droits réservés. Fait avec ❤️ à Madagascar.</p>
        </div>
      </div>
    </footer>
  );
}
