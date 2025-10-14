/**
 * Données mockées pour les tests et démonstrations du wizard de création de campagne
 * Fournit des exemples réalistes pour chaque étape du processus
 */

import type { MediaFile, AudienceFilter, ABTestVariant } from './components/wizard/validators';

// Données de simulation pour les segments d'audience
export const mockAudienceSegments = [
  {
    id: 'young-adults',
    name: 'Jeunes adultes',
    description: 'Personnes âgées de 18 à 35 ans, actives sur les réseaux sociaux',
    size: 25000,
    demographics: {
      ageRange: '18-35',
      interests: ['technologie', 'lifestyle', 'voyages'],
      behavior: ['early-adopters', 'social-active'],
    },
  },
  {
    id: 'families',
    name: 'Familles',
    description: 'Familles avec enfants, intéressées par les produits familiaux',
    size: 18000,
    demographics: {
      ageRange: '25-45',
      interests: ['famille', 'éducation', 'loisirs'],
      behavior: ['value-conscious', 'family-oriented'],
    },
  },
  {
    id: 'seniors',
    name: 'Seniors',
    description: "Personnes de 55 ans et plus, pouvoir d'achat élevé",
    size: 12000,
    demographics: {
      ageRange: '55+',
      interests: ['santé', 'voyages', 'loisirs'],
      behavior: ['brand-loyal', 'quality-focused'],
    },
  },
  {
    id: 'professionals',
    name: 'Professionnels',
    description: 'Cadres et professionnels, revenus élevés',
    size: 22000,
    demographics: {
      ageRange: '28-50',
      interests: ['business', 'technologie', 'formation'],
      behavior: ['efficiency-focused', 'career-oriented'],
    },
  },
  {
    id: 'students',
    name: 'Étudiants',
    description: 'Étudiants et jeunes diplômés, budget limité',
    size: 8000,
    demographics: {
      ageRange: '18-25',
      interests: ['éducation', 'divertissement', 'mode'],
      behavior: ['price-sensitive', 'trend-followers'],
    },
  },
];

// Exemples de filtres d'audience personnalisés
export const mockCustomFilters: AudienceFilter[] = [
  {
    id: 'age-filter-1',
    type: 'age',
    field: 'age',
    operator: 'between',
    value: [25, 35],
  },
  {
    id: 'location-filter-1',
    type: 'location',
    field: 'city',
    operator: 'in',
    value: ['Antananarivo', 'Tamatave', 'Antsirabe'],
  },
  {
    id: 'interests-filter-1',
    type: 'interests',
    field: 'interests',
    operator: 'contains',
    value: 'technologie',
  },
];

// Fichiers média de démonstration
export const mockMediaFiles: MediaFile[] = [
  {
    id: 'img-1',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1661956602116-aa6865609028?w=800&h=600&fit=crop',
    name: 'hero-image-1.jpg',
    size: 245000,
    preview: 'https://images.unsplash.com/photo-1661956602116-aa6865609028?w=300&h=200&fit=crop',
  },
  {
    id: 'img-2',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1661956602868-6ae368943878?w=800&h=600&fit=crop',
    name: 'product-shot.jpg',
    size: 189000,
    preview: 'https://images.unsplash.com/photo-1661956602868-6ae368943878?w=300&h=200&fit=crop',
  },
  {
    id: 'vid-1',
    type: 'video',
    url: '/videos/demo-video.mp4',
    name: 'presentation.mp4',
    size: 15600000,
    preview: 'https://images.unsplash.com/photo-1661956603025-8310b2e2e5b8?w=300&h=200&fit=crop',
  },
];

// Templates de campagne prédéfinis
export const mockCampaignTemplates = [
  {
    id: 'promotion-template',
    name: 'Promotion Flash',
    description: 'Template pour promotions et offres limitées',
    category: 'Marketing',
    thumbnail: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=300&h=200&fit=crop',
    data: {
      headline: '🔥 Offre Flash - 50% de réduction !',
      caption:
        'Profitez de notre offre exceptionnelle pendant 48h seulement. Ne ratez pas cette opportunité unique !',
      callToAction: 'Profiter maintenant',
    },
  },
  {
    id: 'brand-awareness-template',
    name: 'Notoriété de Marque',
    description: 'Template pour augmenter la visibilité',
    category: 'Branding',
    thumbnail: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=300&h=200&fit=crop',
    data: {
      headline: '✨ Découvrez notre univers',
      caption:
        "Plongez dans notre monde d'innovation et de créativité. Une expérience unique vous attend.",
      callToAction: 'En savoir plus',
    },
  },
  {
    id: 'product-launch-template',
    name: 'Lancement Produit',
    description: 'Template pour nouveaux produits',
    category: 'Lancement',
    thumbnail: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=300&h=200&fit=crop',
    data: {
      headline: '🚀 Nouveau : Révolutionnez votre quotidien',
      caption:
        'Découvrez notre dernière innovation qui va transformer votre façon de travailler et de vivre.',
      callToAction: 'Découvrir',
    },
  },
];

// Variants A/B test de démonstration
export const mockABTestVariants: ABTestVariant[] = [
  {
    id: 'variant-a',
    name: 'Version Contrôle',
    percentage: 50,
    isControl: true,
  },
  {
    id: 'variant-b',
    name: 'Version Alternative',
    percentage: 50,
    isControl: false,
  },
];

// Données de performance mockées pour les charts
export const mockPerformanceData = {
  variants: [
    {
      name: 'Variant A',
      impressions: 12500,
      clicks: 875,
      ctr: 7.0,
      conversions: 52,
      color: '#3B82F6',
    },
    {
      name: 'Variant B',
      impressions: 12300,
      clicks: 1024,
      ctr: 8.3,
      conversions: 68,
      color: '#10B981',
    },
  ],
  timeline: [
    { date: '2024-10-01', impressions: 2100, clicks: 147 },
    { date: '2024-10-02', impressions: 2340, clicks: 164 },
    { date: '2024-10-03', impressions: 2180, clicks: 152 },
    { date: '2024-10-04', impressions: 2450, clicks: 171 },
    { date: '2024-10-05', impressions: 2290, clicks: 160 },
  ],
};

// Exemples de données CSV pour import
export const mockCSVData = {
  headers: ['email', 'nom', 'prénom', 'ville', 'age'],
  stats: {
    totalRows: 1500,
    validRows: 1350,
    errorRows: 150,
  },
  preview: [
    {
      email: 'jean.dupont@email.com',
      nom: 'Dupont',
      prénom: 'Jean',
      ville: 'Paris',
      age: '32',
    },
    {
      email: 'marie.martin@email.com',
      nom: 'Martin',
      prénom: 'Marie',
      ville: 'Lyon',
      age: '28',
    },
    {
      email: 'pierre.bernard@email.com',
      nom: 'Bernard',
      prénom: 'Pierre',
      ville: 'Marseille',
      age: '45',
    },
  ],
};

// Fonction utilitaire pour calculer le reach estimé
export function calculateEstimatedReach(
  budget: number,
  currency: string = 'EUR',
  multiplier: number = 0.45
): number {
  const baseReach = budget * multiplier;
  const randomFactor = 1.1 + Math.random() * 0.2; // 1.1 to 1.3
  return Math.round(baseReach * randomFactor);
}

// Fonction pour générer une URL UTM
export function generateUTMUrl(
  baseUrl: string,
  source: string,
  medium: string,
  campaign: string,
  term?: string,
  content?: string
): string {
  const params = new URLSearchParams({
    utm_source: source,
    utm_medium: medium,
    utm_campaign: campaign,
  });

  if (term) params.append('utm_term', term);
  if (content) params.append('utm_content', content);

  return `${baseUrl}?${params.toString()}`;
}
