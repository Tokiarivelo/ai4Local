/**
 * Données mock pour les campagnes AI4Local
 * Contient des exemples réalistes de campagnes avec toutes les métriques
 */

import type {
  Campaign,
  CampaignTemplate,
  FilterOptions,
  CampaignMetrics,
  ABTest,
  CampaignBudget,
  CampaignAudience,
  CampaignCreative,
  CampaignSchedule,
} from '../types';

// Utilisateurs fictifs
export const mockUsers = [
  { id: '1', name: 'Marie Dupont', email: 'marie.dupont@ai4local.com' },
  { id: '2', name: 'Jean Martin', email: 'jean.martin@ai4local.com' },
  { id: '3', name: 'Sophie Bernard', email: 'sophie.bernard@ai4local.com' },
  { id: '4', name: 'Pierre Dubois', email: 'pierre.dubois@ai4local.com' },
  { id: '5', name: 'Alice Moreau', email: 'alice.moreau@ai4local.com' },
];

// Audiences types
const audienceTemplates: CampaignAudience[] = [
  {
    id: 'aud_1',
    name: 'Jeunes professionnels 25-35',
    size: 125000,
    demographics: {
      ageMin: 25,
      ageMax: 35,
      genders: ['all'],
      locations: ['Paris', 'Lyon', 'Marseille'],
    },
    interests: ['technologie', 'entrepreneuriat', 'marketing digital'],
    behaviors: ['frequent_travelers', 'online_shoppers'],
  },
  {
    id: 'aud_2',
    name: 'Parents 30-45',
    size: 89000,
    demographics: {
      ageMin: 30,
      ageMax: 45,
      genders: ['all'],
      locations: ['France métropolitaine'],
    },
    interests: ['famille', 'éducation', 'loisirs'],
    behaviors: ['family_activities', 'education_focused'],
  },
  {
    id: 'aud_3',
    name: 'Entrepreneurs seniors',
    size: 45000,
    demographics: {
      ageMin: 45,
      ageMax: 65,
      genders: ['all'],
      locations: ['Île-de-France', 'PACA', 'Rhône-Alpes'],
    },
    interests: ['business', 'investissement', 'leadership'],
    behaviors: ['business_leaders', 'high_value_online_shoppers'],
  },
];

// Templates de créatifs
const creativeTemplates: CampaignCreative[] = [
  {
    id: 'cr_1',
    type: 'image',
    title: 'Découvrez AI4Local Pro',
    description:
      'La solution complète pour automatiser vos campagnes marketing locales. Essai gratuit 14 jours.',
    imageUrl: '/images/campaigns/ai4local-pro-banner.jpg',
    callToAction: 'Essayer gratuitement',
    linkUrl: 'https://ai4local.com/trial',
    utmParameters: {
      source: 'facebook',
      medium: 'social',
      campaign: 'q1_acquisition',
      content: 'pro_banner',
    },
  },
  {
    id: 'cr_2',
    type: 'video',
    title: 'Témoignage client',
    description:
      'Découvrez comment Restaurant Le Bistrot a augmenté sa fréquentation de 40% avec AI4Local.',
    videoUrl: '/videos/campaigns/testimonial-bistrot.mp4',
    callToAction: 'Voir la démo',
    linkUrl: 'https://ai4local.com/demo',
    utmParameters: {
      source: 'instagram',
      medium: 'social',
      campaign: 'testimonials',
      content: 'bistrot_video',
    },
  },
];

// Métriques de base pour calculs
const generateMetrics = (
  impressions: number,
  ctr: number = 2.5,
  conversionRate: number = 3.2
): CampaignMetrics => {
  const clicks = Math.floor(impressions * (ctr / 100));
  const conversions = Math.floor(clicks * (conversionRate / 100));
  const costPerClick = 0.45 + Math.random() * 0.8; // 0.45€ - 1.25€
  const spend = clicks * costPerClick;

  return {
    impressions,
    reach: Math.floor(impressions * 0.85),
    clicks,
    ctr: Number(((clicks / impressions) * 100).toFixed(2)),
    conversions,
    conversionRate: Number(((conversions / clicks) * 100).toFixed(2)),
    costPerClick: Number(costPerClick.toFixed(2)),
    costPerConversion: Number((spend / conversions).toFixed(2)),
    returnOnAdSpend: Number(((conversions * 25) / spend).toFixed(2)), // AOV moyen 25€
    frequency: Number((1.2 + Math.random() * 0.8).toFixed(2)),
  };
};

// Génération des budgets
const generateBudget = (totalBudget: number): CampaignBudget => {
  const spent = totalBudget * (0.1 + Math.random() * 0.8); // 10-90% dépensé

  return {
    total: totalBudget,
    daily: Math.floor(totalBudget / 30),
    spent: Number(spent.toFixed(2)),
    currency: 'EUR',
    bidStrategy: ['lowest_cost', 'cost_cap', 'target_cost'][Math.floor(Math.random() * 3)] as any,
  };
};

// Tests A/B exemples
const sampleABTests: ABTest[] = [
  {
    enabled: true,
    testName: 'Titre vs CTA',
    winningMetric: 'ctr',
    confidence: 95.7,
    status: 'completed',
    winner: 'variant_b',
    startedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    endedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    variants: [
      {
        id: 'variant_a',
        name: 'Titre principal',
        percentage: 50,
        impressions: 12500,
        clicks: 287,
        conversions: 12,
        isControl: true,
      },
      {
        id: 'variant_b',
        name: 'CTA mis en avant',
        percentage: 50,
        impressions: 12500,
        clicks: 352,
        conversions: 18,
        isControl: false,
      },
    ],
  },
  {
    enabled: true,
    testName: 'Image vs Vidéo',
    winningMetric: 'conversions',
    confidence: 89.3,
    status: 'running',
    startedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    variants: [
      {
        id: 'variant_img',
        name: 'Image statique',
        percentage: 60,
        impressions: 8900,
        clicks: 267,
        conversions: 8,
        isControl: true,
      },
      {
        id: 'variant_vid',
        name: 'Vidéo 15s',
        percentage: 40,
        impressions: 5900,
        clicks: 203,
        conversions: 11,
        isControl: false,
      },
    ],
  },
];

// Campagnes mock (15 exemples)
export const mockCampaigns: Campaign[] = [
  {
    id: 'camp_001',
    name: 'Lancement AI4Local Pro - Q1 2024',
    description:
      'Campagne de lancement pour la nouvelle version Pro avec fonctionnalités IA avancées',
    channel: 'facebook',
    status: 'active',
    type: 'promotion',
    objective: 'conversions',
    owner: 'Marie Dupont',
    ownerId: '1',
    teamId: 'team_marketing',
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    schedule: {
      startAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      endAt: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
      timezone: 'Europe/Paris',
      dayParting: {
        enabled: true,
        schedule: [
          { day: 'monday', startHour: 9, endHour: 18 },
          { day: 'tuesday', startHour: 9, endHour: 18 },
          { day: 'wednesday', startHour: 9, endHour: 18 },
          { day: 'thursday', startHour: 9, endHour: 18 },
          { day: 'friday', startHour: 9, endHour: 18 },
        ],
      },
    },
    audience: audienceTemplates[0],
    creative: creativeTemplates[0],
    budget: generateBudget(5000),
    metrics: generateMetrics(45000, 3.2, 4.1),
    abTest: sampleABTests[0],
    tags: ['lancement', 'pro', 'q1-2024', 'conversion'],
    isArchived: false,
    lastActivity: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    id: 'camp_002',
    name: 'Retargeting prospects WhatsApp',
    description: 'Ciblage des visiteurs du site ayant montré un intérêt pour WhatsApp Business',
    channel: 'whatsapp',
    status: 'active',
    type: 'lead_generation',
    objective: 'leads',
    owner: 'Jean Martin',
    ownerId: '2',
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    schedule: {
      startAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      endAt: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
      timezone: 'Europe/Paris',
    },
    audience: audienceTemplates[1],
    creative: {
      id: 'cr_whatsapp_1',
      type: 'text',
      title: 'Automatisez votre service client WhatsApp',
      description: 'Répondez instantanément à vos clients 24h/24 avec notre IA conversationnelle.',
      callToAction: 'Demander une démo',
      linkUrl: 'https://ai4local.com/whatsapp-demo',
    },
    budget: generateBudget(3000),
    metrics: generateMetrics(28000, 4.8, 6.2),
    tags: ['retargeting', 'whatsapp', 'leads', 'service-client'],
    isArchived: false,
    lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'camp_003',
    name: 'Instagram Stories - Restaurants',
    description: 'Campagne de notoriété ciblant les restaurateurs sur Instagram',
    channel: 'instagram',
    status: 'paused',
    type: 'awareness',
    objective: 'brand_awareness',
    owner: 'Sophie Bernard',
    ownerId: '3',
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    schedule: {
      startAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      endAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
      timezone: 'Europe/Paris',
    },
    audience: {
      id: 'aud_restaurants',
      name: 'Propriétaires de restaurants',
      size: 15000,
      demographics: {
        ageMin: 25,
        ageMax: 55,
        genders: ['all'],
        locations: ['France métropolitaine'],
      },
      interests: ['restauration', 'entrepreneuriat', 'marketing local'],
      behaviors: ['business_owners', 'restaurant_industry'],
    },
    creative: creativeTemplates[1],
    budget: generateBudget(2500),
    metrics: generateMetrics(35000, 2.1, 2.8),
    abTest: sampleABTests[1],
    tags: ['restaurants', 'stories', 'awareness', 'instagram'],
    isArchived: false,
    notes: 'Campagne mise en pause pour optimisation du ciblage',
    lastActivity: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'camp_004',
    name: 'Newsletter hebdomadaire',
    description: 'Campagne email automatisée pour nos tips marketing hebdomadaires',
    channel: 'email',
    status: 'active',
    type: 'engagement',
    objective: 'engagement',
    owner: 'Pierre Dubois',
    ownerId: '4',
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    schedule: {
      startAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
      timezone: 'Europe/Paris',
    },
    audience: {
      id: 'aud_newsletter',
      name: 'Abonnés newsletter',
      size: 8500,
      demographics: {
        ageMin: 25,
        ageMax: 65,
        genders: ['all'],
        locations: ['Monde entier'],
      },
      interests: ['marketing digital', 'entrepreneuriat', 'AI'],
      behaviors: ['newsletter_subscribers', 'engaged_users'],
    },
    creative: {
      id: 'cr_newsletter',
      type: 'text',
      title: 'Tips Marketing AI4Local - Semaine #12',
      description:
        'Cette semaine : optimisation des campagnes WhatsApp Business et nouvelles fonctionnalités IA.',
      callToAction: 'Lire la newsletter',
      linkUrl: 'https://ai4local.com/newsletter/week-12',
    },
    budget: generateBudget(800),
    metrics: generateMetrics(8500, 28.5, 12.4), // Email a des taux plus élevés
    tags: ['newsletter', 'email', 'hebdomadaire', 'tips'],
    isArchived: false,
    lastActivity: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'camp_005',
    name: 'Black Friday 2024 - Offre spéciale',
    description: 'Promotion exceptionnelle Black Friday avec -50% sur tous les plans',
    channel: 'facebook',
    status: 'scheduled',
    type: 'promotion',
    objective: 'conversions',
    owner: 'Alice Moreau',
    ownerId: '5',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    schedule: {
      startAt: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(), // Dans 45 jours
      endAt: new Date(Date.now() + 52 * 24 * 60 * 60 * 1000).toISOString(), // 7 jours de promo
      timezone: 'Europe/Paris',
    },
    audience: audienceTemplates[2],
    creative: {
      id: 'cr_blackfriday',
      type: 'image',
      title: 'BLACK FRIDAY : -50% sur AI4Local !',
      description:
        'Offre limitée : profitez de -50% sur tous nos plans premium. Seulement du 24 au 30 novembre !',
      imageUrl: '/images/campaigns/black-friday-2024.jpg',
      callToAction: "Profiter de l'offre",
      linkUrl: 'https://ai4local.com/black-friday-2024',
      utmParameters: {
        source: 'facebook',
        medium: 'social',
        campaign: 'black_friday_2024',
        content: 'main_banner',
      },
    },
    budget: generateBudget(8000),
    metrics: generateMetrics(0, 0, 0), // Pas encore lancée
    tags: ['black-friday', 'promotion', 'conversion', 'urgence'],
    isArchived: false,
    lastActivity: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'camp_006',
    name: 'SMS Marketing - Relance panier',
    description: "Campagne SMS pour relancer les paniers abandonnés lors de l'inscription",
    channel: 'sms',
    status: 'active',
    type: 'traffic',
    objective: 'conversions',
    owner: 'Marie Dupont',
    ownerId: '1',
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    schedule: {
      startAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      timezone: 'Europe/Paris',
    },
    audience: {
      id: 'aud_abandoned_cart',
      name: 'Paniers abandonnés',
      size: 2400,
      demographics: {
        ageMin: 18,
        ageMax: 65,
        genders: ['all'],
        locations: ['France métropolitaine'],
      },
      interests: ['marketing digital'],
      behaviors: ['abandoned_cart', 'price_sensitive'],
    },
    creative: {
      id: 'cr_sms_cart',
      type: 'text',
      title: 'Vous avez oublié quelque chose ! 📱',
      description:
        'Finalisez votre inscription AI4Local et bénéficiez de 7 jours gratuits supplémentaires.',
      callToAction: 'Finaliser',
      linkUrl: 'https://ai4local.com/complete-signup',
    },
    budget: generateBudget(600),
    metrics: generateMetrics(2400, 18.5, 8.7), // SMS ont de bons taux
    tags: ['sms', 'relance', 'panier-abandonne', 'conversion'],
    isArchived: false,
    lastActivity: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'camp_007',
    name: 'Webinar - IA pour TPE/PME',
    description: "Webinar gratuit sur l'utilisation de l'IA pour les petites entreprises",
    channel: 'email',
    status: 'completed',
    type: 'lead_generation',
    objective: 'leads',
    owner: 'Jean Martin',
    ownerId: '2',
    createdAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    schedule: {
      startAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      endAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
      timezone: 'Europe/Paris',
    },
    audience: audienceTemplates[0],
    creative: {
      id: 'cr_webinar',
      type: 'image',
      title: 'Webinar gratuit : IA et marketing local',
      description:
        "Découvrez comment l'intelligence artificielle peut transformer votre marketing local. Inscriptions limitées.",
      imageUrl: '/images/campaigns/webinar-ia-tpe.jpg',
      callToAction: "S'inscrire gratuitement",
      linkUrl: 'https://ai4local.com/webinar-ia-tpe',
    },
    budget: generateBudget(1200),
    metrics: generateMetrics(15000, 12.8, 25.4), // Webinar gratuit, bon taux conversion
    tags: ['webinar', 'ia', 'tpe-pme', 'gratuit', 'leads'],
    isArchived: false,
    lastActivity: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'camp_008',
    name: 'Réactivation clients inactifs',
    description:
      "Campagne de réactivation pour les clients qui n'ont pas utilisé la plateforme depuis 60 jours",
    channel: 'email',
    status: 'active',
    type: 'engagement',
    objective: 'engagement',
    owner: 'Sophie Bernard',
    ownerId: '3',
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    schedule: {
      startAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      endAt: new Date(Date.now() + 23 * 24 * 60 * 60 * 1000).toISOString(),
      timezone: 'Europe/Paris',
    },
    audience: {
      id: 'aud_inactive',
      name: 'Clients inactifs 60j+',
      size: 890,
      demographics: {
        ageMin: 25,
        ageMax: 65,
        genders: ['all'],
        locations: ['France métropolitaine'],
      },
      interests: ['marketing digital'],
      behaviors: ['inactive_users', 'former_customers'],
    },
    creative: {
      id: 'cr_reactivation',
      type: 'text',
      title: 'On vous a manqué ! Revenez gratuitement',
      description:
        'Redécouvrez AI4Local avec nos nouvelles fonctionnalités et profitez de 30 jours gratuits.',
      callToAction: 'Réactiver mon compte',
      linkUrl: 'https://ai4local.com/reactivation',
    },
    budget: generateBudget(400),
    metrics: generateMetrics(890, 15.2, 18.7), // Bons taux pour la réactivation
    tags: ['reactivation', 'clients-inactifs', 'retention', 'gratuit'],
    isArchived: false,
    lastActivity: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'camp_009',
    name: 'Instagram Reels - Témoignages',
    description: 'Série de Reels mettant en avant les témoignages de nos clients satisfaits',
    channel: 'instagram',
    status: 'active',
    type: 'awareness',
    objective: 'brand_awareness',
    owner: 'Pierre Dubois',
    ownerId: '4',
    createdAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    schedule: {
      startAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      endAt: new Date(Date.now() + 16 * 24 * 60 * 60 * 1000).toISOString(),
      timezone: 'Europe/Paris',
    },
    audience: audienceTemplates[1],
    creative: {
      id: 'cr_reels_testimonials',
      type: 'video',
      title: 'Nos clients témoignent',
      description: 'Découvrez comment AI4Local transforme le quotidien des entrepreneurs locaux.',
      videoUrl: '/videos/campaigns/reels-testimonials.mp4',
      callToAction: 'En savoir plus',
      linkUrl: 'https://ai4local.com/success-stories',
    },
    budget: generateBudget(1800),
    metrics: generateMetrics(67000, 3.8, 2.1), // Instagram Reels ont une bonne portée
    tags: ['reels', 'temoignages', 'stories', 'awareness'],
    isArchived: false,
    lastActivity: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'camp_010',
    name: 'Partenariat influenceurs food',
    description:
      'Collaboration avec des influenceurs du secteur food pour promouvoir nos solutions restaurants',
    channel: 'instagram',
    status: 'failed',
    type: 'awareness',
    objective: 'reach',
    owner: 'Alice Moreau',
    ownerId: '5',
    createdAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
    schedule: {
      startAt: new Date(Date.now() - 38 * 24 * 60 * 60 * 1000).toISOString(),
      endAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
      timezone: 'Europe/Paris',
    },
    audience: {
      id: 'aud_food_lovers',
      name: 'Amateurs de gastronomie',
      size: 180000,
      demographics: {
        ageMin: 20,
        ageMax: 50,
        genders: ['all'],
        locations: ['France métropolitaine'],
      },
      interests: ['gastronomie', 'restaurants', 'food'],
      behaviors: ['food_enthusiasts', 'restaurant_goers'],
    },
    creative: {
      id: 'cr_influencers_food',
      type: 'video',
      title: 'Collab avec @chef_marcus',
      description: "Le chef Marcus nous explique comment AI4Local l'aide à fidéliser sa clientèle.",
      videoUrl: '/videos/campaigns/chef-marcus-collab.mp4',
      callToAction: 'Découvrir',
      linkUrl: 'https://ai4local.com/restaurants',
    },
    budget: generateBudget(4500),
    metrics: generateMetrics(12000, 1.2, 0.8), // Échec de la campagne
    tags: ['influenceurs', 'food', 'restaurants', 'partenariat'],
    isArchived: false,
    notes: 'Campagne échouée - problème de ciblage et contenu inadapté',
    lastActivity: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'camp_011',
    name: 'Formation gratuite WhatsApp Business',
    description: 'Série de formations gratuites pour maîtriser WhatsApp Business avec AI4Local',
    channel: 'whatsapp',
    status: 'active',
    type: 'lead_generation',
    objective: 'leads',
    owner: 'Marie Dupont',
    ownerId: '1',
    createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    schedule: {
      startAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
      endAt: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(),
      timezone: 'Europe/Paris',
    },
    audience: {
      id: 'aud_whatsapp_beginners',
      name: 'Débutants WhatsApp Business',
      size: 5600,
      demographics: {
        ageMin: 25,
        ageMax: 55,
        genders: ['all'],
        locations: ['France métropolitaine'],
      },
      interests: ['whatsapp business', 'formation', 'entrepreneuriat'],
      behaviors: ['small_business_owners', 'learning_focused'],
    },
    creative: {
      id: 'cr_whatsapp_training',
      type: 'text',
      title: 'Formation WhatsApp Business GRATUITE',
      description: 'Apprenez à automatiser votre service client WhatsApp en 3 sessions gratuites.',
      callToAction: "M'inscrire",
      linkUrl: 'https://ai4local.com/formation-whatsapp',
    },
    budget: generateBudget(1500),
    metrics: generateMetrics(5600, 22.1, 15.8), // Formation gratuite = bons taux
    tags: ['formation', 'whatsapp', 'gratuit', 'leads', 'service-client'],
    isArchived: false,
    lastActivity: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'camp_012',
    name: 'Retargeting blog lecteurs',
    description: 'Retargeting des visiteurs du blog avec du contenu premium',
    channel: 'facebook',
    status: 'archived',
    type: 'traffic',
    objective: 'traffic',
    owner: 'Jean Martin',
    ownerId: '2',
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    schedule: {
      startAt: new Date(Date.now() - 55 * 24 * 60 * 60 * 1000).toISOString(),
      endAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
      timezone: 'Europe/Paris',
    },
    audience: {
      id: 'aud_blog_readers',
      name: 'Lecteurs du blog',
      size: 12000,
      demographics: {
        ageMin: 25,
        ageMax: 65,
        genders: ['all'],
        locations: ['France métropolitaine'],
      },
      interests: ['marketing digital', 'contenu', 'blog'],
      behaviors: ['blog_readers', 'content_consumers'],
    },
    creative: {
      id: 'cr_blog_retargeting',
      type: 'image',
      title: 'Contenu exclusif pour vous',
      description:
        'Accédez à notre guide premium "Marketing Local 2024" réservé aux lecteurs fidèles.',
      imageUrl: '/images/campaigns/guide-premium-2024.jpg',
      callToAction: 'Télécharger le guide',
      linkUrl: 'https://ai4local.com/guide-premium-2024',
    },
    budget: generateBudget(900),
    metrics: generateMetrics(34000, 4.2, 8.9),
    tags: ['retargeting', 'blog', 'contenu-premium', 'guide'],
    isArchived: true,
    notes: 'Campagne archivée après succès - objectifs atteints',
    lastActivity: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'camp_013',
    name: 'Onboarding nouveaux utilisateurs',
    description: "Séquence d'emails d'onboarding pour accompagner les nouveaux utilisateurs",
    channel: 'email',
    status: 'active',
    type: 'engagement',
    objective: 'engagement',
    owner: 'Sophie Bernard',
    ownerId: '3',
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    schedule: {
      startAt: new Date(Date.now() - 85 * 24 * 60 * 60 * 1000).toISOString(),
      timezone: 'Europe/Paris',
    },
    audience: {
      id: 'aud_new_users',
      name: 'Nouveaux utilisateurs',
      size: 156,
      demographics: {
        ageMin: 18,
        ageMax: 65,
        genders: ['all'],
        locations: ['Monde entier'],
      },
      interests: ['marketing digital', 'ai4local'],
      behaviors: ['new_users', 'trial_users'],
    },
    creative: {
      id: 'cr_onboarding',
      type: 'text',
      title: 'Bienvenue dans AI4Local ! 🎉',
      description: 'Voici vos premiers pas pour réussir avec notre plateforme. Suivez le guide !',
      callToAction: 'Commencer le parcours',
      linkUrl: 'https://ai4local.com/onboarding',
    },
    budget: generateBudget(200),
    metrics: generateMetrics(1850, 45.2, 32.1), // Onboarding = excellent taux d'engagement
    tags: ['onboarding', 'nouveaux-utilisateurs', 'engagement', 'parcours'],
    isArchived: false,
    lastActivity: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'camp_014',
    name: 'Campagne fidélisation - Programme VIP',
    description: 'Invitation exclusive au programme VIP pour nos meilleurs clients',
    channel: 'email',
    status: 'draft',
    type: 'engagement',
    objective: 'engagement',
    owner: 'Pierre Dubois',
    ownerId: '4',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    schedule: {
      startAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      timezone: 'Europe/Paris',
    },
    audience: {
      id: 'aud_vip_candidates',
      name: 'Candidats programme VIP',
      size: 245,
      demographics: {
        ageMin: 25,
        ageMax: 65,
        genders: ['all'],
        locations: ['France métropolitaine'],
      },
      interests: ['marketing digital', 'fidélité'],
      behaviors: ['high_value_customers', 'loyal_users'],
    },
    creative: {
      id: 'cr_vip_program',
      type: 'text',
      title: 'Invitation exclusive : Programme VIP',
      description:
        "Rejoignez notre cercle VIP et bénéficiez d'avantages exclusifs : support prioritaire, fonctionnalités en avant-première...",
      callToAction: 'Rejoindre le programme VIP',
      linkUrl: 'https://ai4local.com/vip-program',
    },
    budget: generateBudget(300),
    metrics: generateMetrics(0, 0, 0), // Brouillon
    tags: ['vip', 'fidelisation', 'exclusif', 'programme'],
    isArchived: false,
    notes: 'En cours de finalisation - lancement prévu dans 7 jours',
    lastActivity: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'camp_015',
    name: 'Test campagne locale Paris',
    description: 'Test de géolocalisation ultra-précise pour les commerces parisiens',
    channel: 'facebook',
    status: 'active',
    type: 'traffic',
    objective: 'traffic',
    owner: 'Alice Moreau',
    ownerId: '5',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    schedule: {
      startAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      endAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      timezone: 'Europe/Paris',
    },
    audience: {
      id: 'aud_paris_local',
      name: 'Parisiens hyper-local',
      size: 25000,
      demographics: {
        ageMin: 20,
        ageMax: 50,
        genders: ['all'],
        locations: ['Paris 1er-20e arrondissements'],
      },
      interests: ['commerce local', 'proximité'],
      behaviors: ['local_shoppers', 'paris_residents'],
    },
    creative: {
      id: 'cr_paris_local',
      type: 'image',
      title: 'Commerces de votre quartier sur AI4Local',
      description: 'Découvrez et soutenez les commerces de proximité de votre arrondissement.',
      imageUrl: '/images/campaigns/paris-local-shops.jpg',
      callToAction: 'Explorer mon quartier',
      linkUrl: 'https://ai4local.com/paris-local',
    },
    budget: generateBudget(1000),
    metrics: generateMetrics(8500, 5.2, 7.1), // Test en cours
    tags: ['test', 'paris', 'local', 'geolocalisation', 'proximite'],
    isArchived: false,
    lastActivity: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
];

// Templates de campagnes
export const mockCampaignTemplates: CampaignTemplate[] = [
  {
    id: 'tpl_001',
    name: 'Lancement produit standard',
    description: 'Template idéal pour lancer un nouveau produit ou service',
    category: 'Lancement',
    channel: 'facebook',
    type: 'promotion',
    objective: 'conversions',
    thumbnailUrl: '/images/templates/product-launch.jpg',
    configuration: {
      name: 'Lancement [NOM_PRODUIT]',
      type: 'promotion',
      objective: 'conversions',
      tags: ['lancement', 'produit'],
      budget: {
        total: 2000,
        daily: 100,
        spent: 0,
        currency: 'EUR',
        bidStrategy: 'lowest_cost',
      },
    },
    isPublic: true,
    createdBy: 'AI4Local Team',
    usageCount: 847,
    rating: 4.7,
    tags: ['lancement', 'produit', 'conversion'],
  },
  {
    id: 'tpl_002',
    name: 'Retargeting e-commerce',
    description: "Récupérez vos visiteurs qui n'ont pas acheté",
    category: 'E-commerce',
    channel: 'facebook',
    type: 'traffic',
    objective: 'conversions',
    thumbnailUrl: '/images/templates/retargeting-ecommerce.jpg',
    configuration: {
      name: 'Retargeting [SITE_WEB]',
      type: 'traffic',
      objective: 'conversions',
      tags: ['retargeting', 'ecommerce'],
      budget: {
        total: 1500,
        daily: 75,
        spent: 0,
        currency: 'EUR',
        bidStrategy: 'cost_cap',
      },
    },
    isPublic: true,
    createdBy: 'AI4Local Team',
    usageCount: 623,
    rating: 4.5,
    tags: ['retargeting', 'ecommerce', 'conversion'],
  },
  {
    id: 'tpl_003',
    name: 'Génération de leads B2B',
    description: 'Parfait pour acquérir des prospects qualifiés en B2B',
    category: 'Lead Generation',
    channel: 'email',
    type: 'lead_generation',
    objective: 'leads',
    thumbnailUrl: '/images/templates/b2b-leads.jpg',
    configuration: {
      name: 'Leads B2B [SECTEUR]',
      type: 'lead_generation',
      objective: 'leads',
      tags: ['b2b', 'leads', 'prospection'],
      budget: {
        total: 3000,
        daily: 120,
        spent: 0,
        currency: 'EUR',
        bidStrategy: 'target_cost',
      },
    },
    isPublic: true,
    createdBy: 'AI4Local Team',
    usageCount: 392,
    rating: 4.8,
    tags: ['b2b', 'leads', 'prospection'],
  },
];

// Filtres par défaut
export const defaultCampaignFilters: FilterOptions = {
  search: '',
  status: [],
  channels: [],
  types: [],
  objectives: [],
  owners: [],
  tags: [],
  dateRange: {},
  budgetRange: {},
  sortBy: 'updatedAt',
  sortOrder: 'desc',
};

// Tags disponibles
export const availableCampaignTags = [
  'lancement',
  'promotion',
  'conversion',
  'retargeting',
  'leads',
  'awareness',
  'engagement',
  'formation',
  'gratuit',
  'premium',
  'urgence',
  'test',
  'onboarding',
  'newsletter',
  'webinar',
  'testimonial',
  'local',
  'geolocalisation',
  'proximite',
  'fidelisation',
  'vip',
  'exclusif',
  'programme',
  'partenariat',
  'influenceurs',
  'reactivation',
  'service-client',
  'q1-2024',
  'q2-2024',
  'q3-2024',
  'q4-2024',
  'black-friday',
  'facebook',
  'instagram',
  'whatsapp',
  'email',
  'sms',
  'restaurants',
  'tpe-pme',
  'ecommerce',
  'b2b',
  'food',
];

// Utilisateurs disponibles (propriétaires)
export const availableCampaignOwners = mockUsers.map((user) => user.name);

// Fonction utilitaire pour filtrer les campagnes
export function filterCampaigns(campaigns: Campaign[], filters: FilterOptions): Campaign[] {
  return campaigns.filter((campaign) => {
    // Recherche globale
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch =
        campaign.name.toLowerCase().includes(searchLower) ||
        campaign.description?.toLowerCase().includes(searchLower) ||
        campaign.owner.toLowerCase().includes(searchLower) ||
        campaign.tags.some((tag) => tag.toLowerCase().includes(searchLower));

      if (!matchesSearch) return false;
    }

    // Filtres par statut
    if (filters.status.length > 0 && !filters.status.includes(campaign.status)) {
      return false;
    }

    // Filtres par canal
    if (filters.channels.length > 0 && !filters.channels.includes(campaign.channel)) {
      return false;
    }

    // Filtres par type
    if (filters.types.length > 0 && !filters.types.includes(campaign.type)) {
      return false;
    }

    // Filtres par objectif
    if (filters.objectives.length > 0 && !filters.objectives.includes(campaign.objective)) {
      return false;
    }

    // Filtres par propriétaire
    if (filters.owners.length > 0 && !filters.owners.includes(campaign.owner)) {
      return false;
    }

    // Filtres par tags
    if (filters.tags.length > 0) {
      const hasMatchingTag = filters.tags.some((tag) => campaign.tags.includes(tag));
      if (!hasMatchingTag) return false;
    }

    // Filtres par budget
    if (filters.budgetRange.min !== undefined && campaign.budget.total < filters.budgetRange.min) {
      return false;
    }
    if (filters.budgetRange.max !== undefined && campaign.budget.total > filters.budgetRange.max) {
      return false;
    }

    // Filtres par date
    if (filters.dateRange.start || filters.dateRange.end) {
      const campaignStart = new Date(campaign.schedule.startAt);

      if (filters.dateRange.start) {
        const filterStart = new Date(filters.dateRange.start);
        if (campaignStart < filterStart) return false;
      }

      if (filters.dateRange.end) {
        const filterEnd = new Date(filters.dateRange.end);
        if (campaignStart > filterEnd) return false;
      }
    }

    return true;
  });
}

// Fonction utilitaire pour trier les campagnes
export function sortCampaigns(
  campaigns: Campaign[],
  sortBy: string,
  sortOrder: 'asc' | 'desc'
): Campaign[] {
  return [...campaigns].sort((a, b) => {
    let valueA: any, valueB: any;

    switch (sortBy) {
      case 'name':
        valueA = a.name.toLowerCase();
        valueB = b.name.toLowerCase();
        break;
      case 'status':
        valueA = a.status;
        valueB = b.status;
        break;
      case 'channel':
        valueA = a.channel;
        valueB = b.channel;
        break;
      case 'startAt':
        valueA = new Date(a.schedule.startAt);
        valueB = new Date(b.schedule.startAt);
        break;
      case 'endAt':
        valueA = a.schedule.endAt ? new Date(a.schedule.endAt) : new Date(8640000000000000); // Date max si pas de fin
        valueB = b.schedule.endAt ? new Date(b.schedule.endAt) : new Date(8640000000000000);
        break;
      case 'impressions':
        valueA = a.metrics.impressions;
        valueB = b.metrics.impressions;
        break;
      case 'clicks':
        valueA = a.metrics.clicks;
        valueB = b.metrics.clicks;
        break;
      case 'conversions':
        valueA = a.metrics.conversions;
        valueB = b.metrics.conversions;
        break;
      case 'spend':
        valueA = a.budget.spent;
        valueB = b.budget.spent;
        break;
      case 'owner':
        valueA = a.owner.toLowerCase();
        valueB = b.owner.toLowerCase();
        break;
      case 'updatedAt':
      default:
        valueA = new Date(a.updatedAt);
        valueB = new Date(b.updatedAt);
        break;
    }

    if (valueA < valueB) return sortOrder === 'asc' ? -1 : 1;
    if (valueA > valueB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });
}

// Statistiques globales
export const campaignStats = {
  total: mockCampaigns.length,
  active: mockCampaigns.filter((c) => c.status === 'active').length,
  scheduled: mockCampaigns.filter((c) => c.status === 'scheduled').length,
  paused: mockCampaigns.filter((c) => c.status === 'paused').length,
  completed: mockCampaigns.filter((c) => c.status === 'completed').length,
  failed: mockCampaigns.filter((c) => c.status === 'failed').length,
  draft: mockCampaigns.filter((c) => c.status === 'draft').length,

  totalSpent: mockCampaigns.reduce((sum, c) => sum + c.budget.spent, 0),
  totalBudget: mockCampaigns.reduce((sum, c) => sum + c.budget.total, 0),
  totalImpressions: mockCampaigns.reduce((sum, c) => sum + c.metrics.impressions, 0),
  totalClicks: mockCampaigns.reduce((sum, c) => sum + c.metrics.clicks, 0),
  totalConversions: mockCampaigns.reduce((sum, c) => sum + c.metrics.conversions, 0),

  // Moyennes
  averageCTR: Number(
    (mockCampaigns.reduce((sum, c) => sum + c.metrics.ctr, 0) / mockCampaigns.length).toFixed(2)
  ),
  averageConversionRate: Number(
    (
      mockCampaigns.reduce((sum, c) => sum + c.metrics.conversionRate, 0) / mockCampaigns.length
    ).toFixed(2)
  ),
  averageCPC: Number(
    (
      mockCampaigns.reduce((sum, c) => sum + c.metrics.costPerClick, 0) / mockCampaigns.length
    ).toFixed(2)
  ),
};
