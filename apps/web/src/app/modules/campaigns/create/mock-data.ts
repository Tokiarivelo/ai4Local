/**
 * Données mockées pour les tests et démonstrations du wizard de création de campagne
 * Fournit des exemples réalistes pour chaque étape du processus
 */

import type { MediaFile, AudienceFilter, ABTestVariant } from './components/wizard/validators';

// Segments d'audience prédéfinis
export const mockAudienceSegments = [
  {
    id: 'young-professionals',
    name: 'Jeunes Professionnels',
    description: '25-35 ans, revenus moyens-élevés, urbains',
    size: 45000,
    demographics: {
      age: '25-35',
      income: 'Moyen-Élevé',
      location: 'Zones urbaines',
      interests: ['Technologie', 'Carrière', 'Lifestyle'],
    },
    isActive: false,
  },
  {
    id: 'families-madagascar',
    name: 'Familles Malgaches',
    description: 'Familles avec enfants, Madagascar',
    size: 28000,
    demographics: {
      age: '30-45',
      income: 'Moyen',
      location: 'Madagascar',
      interests: ['Famille', 'Éducation', 'Santé'],
    },
    isActive: false,
  },
  {
    id: 'tech-enthusiasts',
    name: 'Passionnés Tech',
    description: 'Early adopters, gadgets, innovation',
    size: 18500,
    demographics: {
      age: '20-40',
      income: 'Élevé',
      location: 'Global',
      interests: ['IA', 'Gadgets', 'Innovation', 'Startup'],
    },
    isActive: false,
  },
  {
    id: 'local-businesses',
    name: 'Entreprises Locales',
    description: 'PME, commerce local, services',
    size: 12000,
    demographics: {
      age: '35-55',
      income: 'Variable',
      location: 'Local',
      interests: ['Business', 'Marketing', 'Croissance'],
    },
    isActive: false,
  },
  {
    id: 'students-youth',
    name: 'Étudiants & Jeunes',
    description: '18-25 ans, étudiants, jeunes actifs',
    size: 62000,
    demographics: {
      age: '18-25',
      income: 'Faible-Moyen',
      location: 'Universités',
      interests: ['Études', 'Emploi', 'Loisirs', 'Tech'],
    },
    isActive: false,
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
  headers: ['email', 'nom', 'prenom', 'age', 'ville', 'interet'],
  preview: [
    {
      email: 'john.doe@example.com',
      nom: 'Doe',
      prenom: 'John',
      age: '28',
      ville: 'Antananarivo',
      interet: 'technologie',
    },
    {
      email: 'marie.martin@example.com',
      nom: 'Martin',
      prenom: 'Marie',
      age: '34',
      ville: 'Tamatave',
      interet: 'business',
    },
    {
      email: 'pierre.durand@example.com',
      nom: 'Durand',
      prenom: 'Pierre',
      age: '29',
      ville: 'Antsirabe',
      interet: 'sport',
    },
  ],
  stats: {
    totalRows: 1524,
    validRows: 1489,
    invalidRows: 35,
  },
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
