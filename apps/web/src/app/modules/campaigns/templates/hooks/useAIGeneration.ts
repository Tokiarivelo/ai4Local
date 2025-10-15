'use client';

import { useState } from 'react';
import type { AIGenerationRequest, AIGenerationResponse } from '../types/ai-generation.types';

export function useAIGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateText = async (request: AIGenerationRequest): Promise<string> => {
    setIsGenerating(true);
    setError(null);

    try {
      // TODO: Replace with actual API call
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock response
      const mockResponses: Record<string, string> = {
        headline: `Offre exclusive : ${request.context || 'Profitez de nos promotions'}`,
        caption: `Découvrez notre nouvelle ${
          request.context || 'collection'
        } ! Des produits exceptionnels à des prix imbattables. Ne manquez pas cette opportunité unique.`,
        callToAction: 'Découvrir maintenant',
        objective: 'Augmenter les conversions et générer des ventes',
      };

      const response: AIGenerationResponse = {
        generatedText: mockResponses[request.prompt] || 'Texte généré par IA',
        confidence: 0.85,
        suggestions: ['Suggestion alternative 1', 'Suggestion alternative 2'],
      };

      return response.generatedText;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la génération';
      setError(errorMessage);
      throw err;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateText,
    isGenerating,
    error,
    clearError: () => setError(null),
  };
}
