import {
  Target,
  Mail,
  MessageSquare,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
  Search,
  Smartphone,
  Globe,
  Sparkles,
} from 'lucide-react';

import type { CampaignChannel, CampaignObjective, CampaignType } from '../../../types';

// Configuration des objectifs avec descriptions
export const CAMPAIGN_OBJECTIVES = [
  {
    id: 'awareness' as CampaignObjective,
    title: 'Notoriété',
    description: 'Faire connaître votre marque ou produit',
    icon: Globe,
    color: 'bg-blue-500',
  },
  {
    id: 'traffic' as CampaignObjective,
    title: 'Trafic',
    description: 'Diriger les visiteurs vers votre site web',
    icon: Search,
    color: 'bg-green-500',
  },
  {
    id: 'engagement' as CampaignObjective,
    title: 'Engagement',
    description: 'Encourager les interactions avec votre contenu',
    icon: Target,
    color: 'bg-purple-500',
  },
  {
    id: 'leads' as CampaignObjective,
    title: 'Génération de leads',
    description: 'Collecter des contacts qualifiés',
    icon: Mail,
    color: 'bg-orange-500',
  },
  {
    id: 'conversions' as CampaignObjective,
    title: 'Conversions',
    description: "Inciter à l'action (achat, inscription...)",
    icon: Target,
    color: 'bg-red-500',
  },
  {
    id: 'sales' as CampaignObjective,
    title: 'Ventes',
    description: 'Générer des ventes directes',
    icon: Sparkles,
    color: 'bg-indigo-500',
  },
] as const;

// Configuration des canaux avec icônes
export const CAMPAIGN_CHANNELS = [
  {
    id: 'email' as CampaignChannel,
    title: 'Email',
    description: 'Newsletters et emails marketing',
    icon: Mail,
    color: 'bg-blue-500',
  },
  {
    id: 'sms' as CampaignChannel,
    title: 'SMS',
    description: 'Messages texte directs',
    icon: MessageSquare,
    color: 'bg-green-500',
  },
  {
    id: 'whatsapp' as CampaignChannel,
    title: 'WhatsApp',
    description: 'Messages via WhatsApp Business',
    icon: MessageSquare,
    color: 'bg-green-600',
  },
  {
    id: 'facebook' as CampaignChannel,
    title: 'Facebook',
    description: 'Publicités sur Facebook',
    icon: Facebook,
    color: 'bg-blue-600',
  },
  {
    id: 'instagram' as CampaignChannel,
    title: 'Instagram',
    description: 'Stories et posts sponsorisés',
    icon: Instagram,
    color: 'bg-pink-500',
  },
  {
    id: 'google_ads' as CampaignChannel,
    title: 'Google Ads',
    description: 'Publicités sur Google Search & Display',
    icon: Search,
    color: 'bg-yellow-500',
  },
  {
    id: 'linkedin' as CampaignChannel,
    title: 'LinkedIn',
    description: 'Réseau professionnel B2B',
    icon: Linkedin,
    color: 'bg-blue-700',
  },
  {
    id: 'twitter' as CampaignChannel,
    title: 'Twitter/X',
    description: 'Tweets sponsorisés',
    icon: Twitter,
    color: 'bg-gray-900',
  },
  {
    id: 'youtube' as CampaignChannel,
    title: 'YouTube',
    description: 'Publicités vidéo',
    icon: Youtube,
    color: 'bg-red-600',
  },
  {
    id: 'tiktok' as CampaignChannel,
    title: 'TikTok',
    description: 'Contenu viral et tendance',
    icon: Smartphone,
    color: 'bg-black',
  },
] as const;

// Types de campagne
export const CAMPAIGN_TYPES = [
  { id: 'promotion', title: 'Promotion', description: 'Offres spéciales et réductions' },
  { id: 'newsletter', title: 'Newsletter', description: 'Information régulière' },
  { id: 'lead_generation', title: 'Génération de leads', description: 'Collecte de contacts' },
  { id: 'retention', title: 'Fidélisation', description: 'Réengager les clients existants' },
  { id: 'event', title: 'Événement', description: "Promotion d'événements" },
  { id: 'product_launch', title: 'Lancement produit', description: 'Nouveau produit ou service' },
  { id: 'seasonal', title: 'Saisonnier', description: 'Campagnes liées aux saisons' },
] as const;
