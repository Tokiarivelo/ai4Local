/**
 * Données mock pour la création de campagnes
 * Templates, audiences, canaux et exemples pour le développement
 */

import type {
  CampaignTemplate,
  AudienceSegment,
  Creative,
  CampaignChannel,
  EstimateAudienceResponse,
  CompressImageResponse,
} from '../types';

// Templates de campagnes populaires
export const mockCampaignTemplates: CampaignTemplate[] = [
  {
    id: 'template-1',
    name: 'Promotion Black Friday',
    description: 'Template optimisé pour les promotions saisonnières avec forte conversion',
    category: 'E-commerce',
    thumbnail: 'https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=400&h=300&fit=crop',
    channels: ['facebook', 'instagram', 'email'],
    objective: 'conversions',
    isPopular: true,
    usageCount: 1247,
    creatives: [
      {
        id: 'creative-1',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=1200&h=630&fit=crop',
        thumbnail:
          'https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=300&h=200&fit=crop',
        title: '🔥 BLACK FRIDAY -50%',
        description: 'Profitez de nos offres exceptionnelles !',
        callToAction: "J'en profite",
        alt: 'Promotion Black Friday avec réduction de 50%',
        dimensions: { width: 1200, height: 630 },
      },
    ],
  },
  {
    id: 'template-2',
    name: 'Génération de leads B2B',
    description: 'Template conçu pour capturer des leads qualifiés en B2B',
    category: 'Lead Generation',
    thumbnail: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop',
    channels: ['linkedin', 'email', 'google_ads'],
    objective: 'leads',
    isPopular: true,
    usageCount: 892,
    creatives: [
      {
        id: 'creative-2',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1200&h=630&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=200&fit=crop',
        title: 'Boostez votre business local',
        description: 'Découvrez nos solutions IA pour entrepreneurs',
        callToAction: 'Télécharger le guide',
        alt: 'Guide gratuit pour entrepreneurs',
        dimensions: { width: 1200, height: 630 },
      },
    ],
  },
  {
    id: 'template-3',
    name: 'Lancement produit',
    description: 'Template multi-format pour annoncer un nouveau produit',
    category: 'Product Launch',
    thumbnail: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop',
    channels: ['facebook', 'instagram', 'youtube', 'email'],
    objective: 'awareness',
    isPopular: false,
    usageCount: 445,
    creatives: [
      {
        id: 'creative-3',
        type: 'video',
        url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
        thumbnail: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300&h=200&fit=crop',
        title: 'Nouveau : AI4Local Pro',
        description: 'La suite complète pour digitaliser votre entreprise',
        callToAction: 'Découvrir',
        alt: 'Présentation du produit AI4Local Pro',
        dimensions: { width: 1280, height: 720 },
        duration: 30,
      },
    ],
  },
  {
    id: 'template-4',
    name: 'Newsletter engagement',
    description: "Template optimisé pour l'engagement email et fidélisation",
    category: 'Newsletter',
    thumbnail: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=300&fit=crop',
    channels: ['email', 'whatsapp'],
    objective: 'engagement',
    isPopular: true,
    usageCount: 1089,
    creatives: [
      {
        id: 'creative-4',
        type: 'text',
        title: '📧 Votre digest hebdomadaire',
        description: 'Les meilleures pratiques marketing de la semaine',
        callToAction: 'Lire la suite',
        alt: 'Newsletter hebdomadaire marketing',
      },
    ],
  },
  {
    id: 'template-5',
    name: 'Événement local',
    description: 'Template pour promouvoir des événements et webinaires',
    category: 'Event',
    thumbnail: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=400&h=300&fit=crop',
    channels: ['facebook', 'instagram', 'email', 'whatsapp'],
    objective: 'traffic',
    isPopular: false,
    usageCount: 267,
    creatives: [
      {
        id: 'creative-5',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1200&h=630&fit=crop',
        thumbnail:
          'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=300&h=200&fit=crop',
        title: 'Webinaire gratuit : IA & Business',
        description: 'Rejoignez-nous le 15 novembre à 14h',
        callToAction: "S'inscrire",
        alt: 'Invitation webinaire IA et business',
        dimensions: { width: 1200, height: 630 },
      },
    ],
  },
];

// Segments d'audience prédéfinis
export const mockAudienceSegments: AudienceSegment[] = [
  {
    id: 'segment-1',
    name: 'Entrepreneurs Madagascar',
    description: "Dirigeants d'entreprise et entrepreneurs basés à Madagascar",
    estimatedSize: 12450,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-02-20T14:30:00Z',
    filters: [
      {
        type: 'location',
        field: 'country',
        operator: 'equals',
        value: 'Madagascar',
      },
      {
        type: 'interests',
        field: 'job_title',
        operator: 'in',
        value: ['CEO', 'Entrepreneur', 'Founder', 'Business Owner'],
      },
      {
        type: 'age',
        field: 'age',
        operator: 'between',
        value: [25, 55],
      },
    ],
  },
  {
    id: 'segment-2',
    name: 'PME France',
    description: 'Petites et moyennes entreprises françaises',
    estimatedSize: 45780,
    createdAt: '2024-01-20T09:15:00Z',
    updatedAt: '2024-03-01T11:45:00Z',
    filters: [
      {
        type: 'location',
        field: 'country',
        operator: 'equals',
        value: 'France',
      },
      {
        type: 'custom',
        field: 'company_size',
        operator: 'between',
        value: [10, 250],
      },
      {
        type: 'behavior',
        field: 'industry',
        operator: 'in',
        value: ['retail', 'services', 'manufacturing', 'technology'],
      },
    ],
  },
  {
    id: 'segment-3',
    name: 'Millennials Tech',
    description: 'Professionnels tech nés entre 1981 et 1996',
    estimatedSize: 23670,
    createdAt: '2024-02-01T16:20:00Z',
    updatedAt: '2024-03-15T13:10:00Z',
    filters: [
      {
        type: 'age',
        field: 'age',
        operator: 'between',
        value: [28, 43],
      },
      {
        type: 'interests',
        field: 'industry',
        operator: 'equals',
        value: 'technology',
      },
      {
        type: 'behavior',
        field: 'device_usage',
        operator: 'equals',
        value: 'mobile_primary',
      },
    ],
  },
  {
    id: 'segment-4',
    name: 'E-commerce actifs',
    description: 'Consommateurs ayant acheté en ligne récemment',
    estimatedSize: 67890,
    createdAt: '2024-02-10T12:00:00Z',
    updatedAt: '2024-03-20T15:30:00Z',
    filters: [
      {
        type: 'behavior',
        field: 'last_purchase',
        operator: 'less_than',
        value: 30,
      },
      {
        type: 'custom',
        field: 'purchase_frequency',
        operator: 'greater_than',
        value: 3,
      },
      {
        type: 'interests',
        field: 'categories',
        operator: 'in',
        value: ['fashion', 'electronics', 'home', 'beauty'],
      },
    ],
  },
  {
    id: 'segment-5',
    name: 'Leads qualifiés',
    description: 'Prospects ayant téléchargé du contenu ou demandé une démo',
    estimatedSize: 8934,
    createdAt: '2024-02-15T14:45:00Z',
    updatedAt: '2024-03-25T10:20:00Z',
    filters: [
      {
        type: 'behavior',
        field: 'lead_score',
        operator: 'greater_than',
        value: 70,
      },
      {
        type: 'custom',
        field: 'engagement_level',
        operator: 'in',
        value: ['high', 'very_high'],
      },
      {
        type: 'behavior',
        field: 'content_downloads',
        operator: 'greater_than',
        value: 1,
      },
    ],
  },
];

// Configuration des canaux
export const mockChannelConfig = {
  email: {
    name: 'Email',
    icon: '📧',
    maxCreatives: 5,
    supportedTypes: ['image', 'text'],
    recommendedDimensions: { width: 600, height: 400 },
    description: 'Campagnes email personnalisées avec tracking avancé',
  },
  sms: {
    name: 'SMS',
    icon: '💬',
    maxCreatives: 1,
    supportedTypes: ['text'],
    description: "Messages courts avec taux d'ouverture élevé",
  },
  whatsapp: {
    name: 'WhatsApp',
    icon: '💬',
    maxCreatives: 3,
    supportedTypes: ['text', 'image', 'video'],
    recommendedDimensions: { width: 1080, height: 1080 },
    description: 'Messages directs avec médias riches',
  },
  facebook: {
    name: 'Facebook',
    icon: '📘',
    maxCreatives: 10,
    supportedTypes: ['image', 'video', 'carousel'],
    recommendedDimensions: { width: 1200, height: 630 },
    description: 'Publicités ciblées avec large portée',
  },
  instagram: {
    name: 'Instagram',
    icon: '📷',
    maxCreatives: 10,
    supportedTypes: ['image', 'video', 'carousel'],
    recommendedDimensions: { width: 1080, height: 1080 },
    description: 'Contenu visuel engageant pour audience jeune',
  },
  google_ads: {
    name: 'Google Ads',
    icon: '🔍',
    maxCreatives: 5,
    supportedTypes: ['text', 'image'],
    recommendedDimensions: { width: 1200, height: 628 },
    description: 'Publicités sur le réseau de recherche Google',
  },
  linkedin: {
    name: 'LinkedIn',
    icon: '💼',
    maxCreatives: 5,
    supportedTypes: ['image', 'video', 'text'],
    recommendedDimensions: { width: 1200, height: 627 },
    description: 'Ciblage professionnel B2B de qualité',
  },
  twitter: {
    name: 'Twitter',
    icon: '🐦',
    maxCreatives: 4,
    supportedTypes: ['text', 'image', 'video'],
    recommendedDimensions: { width: 1200, height: 675 },
    description: 'Engagement temps réel et viralité',
  },
  youtube: {
    name: 'YouTube',
    icon: '🎥',
    maxCreatives: 3,
    supportedTypes: ['video'],
    recommendedDimensions: { width: 1920, height: 1080 },
    description: 'Publicités vidéo avec fort engagement',
  },
  tiktok: {
    name: 'TikTok',
    icon: '🎵',
    maxCreatives: 5,
    supportedTypes: ['video'],
    recommendedDimensions: { width: 1080, height: 1920 },
    description: 'Contenu viral pour audience Gen Z',
  },
};

// Fonctions mock pour les APIs
export const mockEstimateAudience = async (
  segments: string[],
  filters: any[]
): Promise<EstimateAudienceResponse> => {
  // Simulation d'une requête API avec délai
  await new Promise((resolve) => setTimeout(resolve, 800));

  const baseSize =
    segments.length > 0
      ? mockAudienceSegments
          .filter((s) => segments.includes(s.id))
          .reduce((sum, s) => sum + s.estimatedSize, 0)
      : 15000;

  const filterMultiplier = filters.length * 0.7; // Chaque filtre réduit l'audience
  const estimatedSize = Math.floor(baseSize * (1 - filterMultiplier));

  return {
    estimatedSize: Math.max(estimatedSize, 100),
    demographics: {
      ageGroups: {
        '18-24': Math.floor(estimatedSize * 0.15),
        '25-34': Math.floor(estimatedSize * 0.35),
        '35-44': Math.floor(estimatedSize * 0.25),
        '45-54': Math.floor(estimatedSize * 0.15),
        '55+': Math.floor(estimatedSize * 0.1),
      },
      genders: {
        male: Math.floor(estimatedSize * 0.52),
        female: Math.floor(estimatedSize * 0.46),
        other: Math.floor(estimatedSize * 0.02),
      },
      locations: {
        France: Math.floor(estimatedSize * 0.6),
        Madagascar: Math.floor(estimatedSize * 0.25),
        Other: Math.floor(estimatedSize * 0.15),
      },
    },
    devices: {
      mobile: Math.floor(estimatedSize * 0.7),
      desktop: Math.floor(estimatedSize * 0.25),
      tablet: Math.floor(estimatedSize * 0.05),
    },
  };
};

export const mockCompressImage = async (file: File): Promise<CompressImageResponse> => {
  // Simulation de compression d'image
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const originalSize = file.size;
  const compressionRatio = 0.3 + Math.random() * 0.4; // 30-70% de compression
  const compressedSize = Math.floor(originalSize * compressionRatio);

  // URLs mock (dans un vrai projet, ces URLs viendraient du serveur)
  const originalUrl = URL.createObjectURL(file);
  const compressedUrl = originalUrl; // Simulation
  const thumbnail = originalUrl; // Simulation

  return {
    originalUrl,
    compressedUrl,
    thumbnail,
    originalSize,
    compressedSize,
    compressionRatio: (1 - compressionRatio) * 100,
  };
};

export const mockCreateCampaign = async (
  campaignData: any
): Promise<{ success: boolean; campaignId: string; message: string }> => {
  // Simulation de création de campagne
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Simulation d'erreur occasionnelle
  if (Math.random() < 0.1) {
    throw new Error('Erreur serveur temporaire');
  }

  return {
    success: true,
    campaignId: `campaign_${Date.now()}`,
    message: 'Campagne créée avec succès !',
  };
};

// Presets pour les configurations courantes
export const mockBudgetPresets = [
  { name: 'Petit budget', daily: 10, lifetime: 100, currency: 'EUR' as const },
  { name: 'Budget moyen', daily: 50, lifetime: 500, currency: 'EUR' as const },
  { name: 'Gros budget', daily: 200, lifetime: 2000, currency: 'EUR' as const },
  { name: 'Campagne premium', daily: 500, lifetime: 10000, currency: 'EUR' as const },
];

export const mockSchedulePresets = [
  { name: 'Maintenant', offset: 0 },
  { name: 'Dans 1 heure', offset: 60 },
  { name: "Aujourd'hui 9h", hour: 9 },
  { name: 'Demain 9h', offset: 24 * 60, hour: 9 },
  { name: 'Lundi prochain', weekday: 1, hour: 9 },
];

export const mockUTMPresets = [
  { source: 'facebook', medium: 'social', campaign: 'promotion_automne' },
  { source: 'google', medium: 'cpc', campaign: 'lead_generation' },
  { source: 'email', medium: 'newsletter', campaign: 'retention_clients' },
  { source: 'linkedin', medium: 'social', campaign: 'b2b_awareness' },
];
