'use client';

import React from 'react';
import { Users, Package, BookOpen, CreditCard, BarChart3, Sparkles } from 'lucide-react';

import { Feature } from '@/types/common';
import { FeatureCard } from '../../ui/feature-card';

const features: Feature[] = [
  {
    icon: Sparkles,
    title: 'Campagnes IA',
    description:
      "Créez des publicités, posts et SMS avec l'intelligence artificielle. Templates optimisés pour le marché malgache.",
    badge: 'IA',
  },
  {
    icon: Users,
    title: 'Gestion Clients',
    description:
      'CRM simple pour gérer vos clients, tags, import CSV et segmentation pour vos campagnes.',
    badge: 'CRM',
  },
  {
    icon: Package,
    title: 'Catalogue Produits',
    description: 'Gérez facilement vos produits et services avec photos, prix et descriptions.',
    badge: 'Catalogue',
  },
  {
    icon: CreditCard,
    title: 'Paiements Mobiles',
    description:
      'Intégration Mvola, Airtel Money et Orange Money pour accepter les paiements locaux.',
    badge: 'Mobile Money',
  },
  {
    icon: BookOpen,
    title: 'Formation Équipe',
    description:
      'LMS intégré pour former votre personnel avec cours vidéo et suivi de progression.',
    badge: 'LMS',
  },
  {
    icon: BarChart3,
    title: 'Analytics',
    description: 'Tableaux de bord et rapports pour suivre vos performances marketing et ventes.',
    badge: 'Analytics',
  },
];

export function FeaturesSection() {
  return (
    <section className="py-24 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Tout ce dont votre PME a besoin
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Une plateforme complète pour digitaliser votre business et booster vos ventes avec
            l'intelligence artificielle.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
