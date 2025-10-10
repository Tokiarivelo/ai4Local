/**
 * Utilitaires pour la génération IA de contenu
 * Mock API pour simulation de génération de texte et d'images
 */

import { useState } from 'react';

// Types pour les requêtes IA
export interface AITextRequest {
  prompt: string;
  type: 'headline' | 'caption' | 'cta';
  tone?: 'professional' | 'casual' | 'exciting' | 'urgent';
  length?: 'short' | 'medium' | 'long';
}

export interface AIImageRequest {
  prompt: string;
  style?: 'photo' | 'illustration' | 'graphic' | 'minimalist';
  size?: '1:1' | '16:9' | '9:16' | '4:5';
  color?: 'colorful' | 'monochrome' | 'brand';
}

export interface AIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  credits_used?: number;
}

// Mock de génération de texte
export async function generateText(request: AITextRequest): Promise<AIResponse<string>> {
  // Simulation d'un délai d'API
  await new Promise((resolve) => setTimeout(resolve, 1500 + Math.random() * 1000));

  const mockTexts = {
    headline: [
      '🎯 Découvrez nos offres exclusives !',
      '✨ Innovation et performance réunies',
      '🚀 Transformez votre quotidien',
      '💡 La solution que vous attendiez',
      '🌟 Excellence et qualité garanties',
    ],
    caption: [
      'Rejoignez des milliers de clients satisfaits qui ont déjà fait confiance à notre expertise. Découvrez pourquoi nous sommes le choix préféré des professionnels.',
      "Une nouvelle ère commence avec nos solutions innovantes. Profitez d'une expérience unique et personnalisée selon vos besoins spécifiques.",
      "Optimisez votre productivité avec nos outils dernière génération. Simple, efficace et accessible à tous les niveaux d'expertise.",
    ],
    cta: [
      'Découvrir maintenant',
      "Profiter de l'offre",
      'Commencer gratuitement',
      'En savoir plus',
      'Réserver ma place',
    ],
  };

  const texts = mockTexts[request.type] || mockTexts.headline;
  const randomText = texts[Math.floor(Math.random() * texts.length)];

  // Simulation d'échec occasionnel
  if (Math.random() < 0.1) {
    return {
      success: false,
      error: 'Limite de génération atteinte. Réessayez dans quelques minutes.',
    };
  }

  return {
    success: true,
    data: randomText,
    credits_used: 1,
  };
}

// Mock de génération d'image
export async function generateImage(request: AIImageRequest): Promise<AIResponse<string>> {
  // Simulation d'un délai d'API plus long pour les images
  await new Promise((resolve) => setTimeout(resolve, 3000 + Math.random() * 2000));

  // URLs d'images de démonstration (Unsplash)
  const mockImages = [
    'https://images.unsplash.com/photo-1661956602116-aa6865609028?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1661956602868-6ae368943878?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1661956603025-8310b2e2e5b8?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1661956603117-230f169ce8ea?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1661956603394-0d4c5ee4a929?w=800&h=600&fit=crop',
  ];

  const randomImage = mockImages[Math.floor(Math.random() * mockImages.length)];

  // Simulation d'échec occasionnel
  if (Math.random() < 0.15) {
    return {
      success: false,
      error: "Erreur lors de la génération de l'image. Veuillez modifier votre prompt.",
    };
  }

  return {
    success: true,
    data: randomImage,
    credits_used: 3,
  };
}

// Fonction générique pour la génération IA
export async function aiGenerator<T>(
  type: 'text' | 'image',
  request: AITextRequest | AIImageRequest
): Promise<AIResponse<T>> {
  if (type === 'text') {
    return generateText(request as AITextRequest) as Promise<AIResponse<T>>;
  } else {
    return generateImage(request as AIImageRequest) as Promise<AIResponse<T>>;
  }
}

// Hook pour suivre les crédits IA
export function useAICredits() {
  const [credits, setCredits] = useState(50); // Crédits initiaux
  const [isLoading, setIsLoading] = useState(false);

  const useCredits = (amount: number) => {
    setCredits((prev: number) => Math.max(0, prev - amount));
  };

  const canUseCredits = (amount: number) => {
    return credits >= amount;
  };

  return {
    credits,
    isLoading,
    setIsLoading,
    useCredits,
    canUseCredits,
  };
}

// Utilitaires pour formater les prompts
export function formatPromptForHeadline(
  product: string,
  audience: string,
  tone: string = 'professional'
): string {
  return `Créer un titre accrocheur pour ${product} destiné à ${audience} avec un ton ${tone}`;
}

export function formatPromptForImage(
  concept: string,
  style: string = 'photo',
  mood: string = 'modern'
): string {
  return `${concept}, style ${style}, ambiance ${mood}, haute qualité, professionnel`;
}
