/**
 * Template Step Wrapper - Adaptation du TemplateSelector pour l'interface wizard
 * Gère la sélection de template avec l'interface commune des étapes
 */

'use client';

import React, { useCallback } from 'react';
import { TemplateSelector } from './TemplateSelector';
import { useCampaignCreateContext } from '../../context/WizardContext';
import type { CampaignTemplate, CampaignType } from '../../types';

/**
 * Mappe les catégories de template vers les types de campagne
 */
function mapCategoryToType(category: string): CampaignType {
  const categoryMap: Record<string, CampaignType> = {
    promotion: 'promotion',
    newsletter: 'newsletter',
    'lead-generation': 'lead_generation',
    retention: 'retention',
    event: 'event',
    'product-launch': 'product_launch',
    seasonal: 'seasonal',
  };

  return categoryMap[category] || 'promotion';
}

/**
 * Génère un nom de campagne intelligent basé sur le template
 */
function generateCampaignName(template: CampaignTemplate): string {
  const today = new Date();
  const month = today.toLocaleDateString('fr-FR', { month: 'long' });
  const year = today.getFullYear();

  return `${template.name} - ${month} ${year}`;
}

/**
 * Extrait et optimise la description basée sur le template
 */
function generateCampaignDescription(template: CampaignTemplate): string {
  const baseDescription = template.description;
  const channelsText =
    template.channels.length > 1
      ? `Campagne multi-canaux (${template.channels.join(', ')})`
      : `Campagne ${template.channels[0]}`;

  return `${baseDescription}\n\n${channelsText} - Objectif: ${template.objective}`;
}

interface TemplateStepWrapperProps {
  onComplete?: () => void;
  onValidationChange?: (isValid: boolean) => void;
  isValidating?: boolean;
  onAsyncValidation?: (data: any) => Promise<void>;
  isEditing?: boolean;
}

/**
 * Wrapper pour TemplateSelector qui respecte l'interface des étapes du wizard
 */
export function TemplateStepWrapper({
  onComplete,
  onValidationChange,
  isValidating = false,
  onAsyncValidation,
  isEditing = false,
}: TemplateStepWrapperProps) {
  const { data, updateStepData, completeStep } = useCampaignCreateContext();

  // Cast des données pour accéder aux propriétés du template
  const typedData = data as any;
  const selectedTemplateId = typedData.template?.id || null;

  // Gestion de la sélection d'un template
  const handleSelectTemplate = useCallback(
    (template: CampaignTemplate) => {
      // Mettre à jour les données du contexte avec le template sélectionné
      updateStepData({
        template: {
          id: template.id,
          name: template.name,
          category: template.category,
          objective: template.objective,
          channels: template.channels,
          creatives: template.creatives,
        },
        // Pré-remplir les informations de base de manière intelligente
        basicInfo: {
          name: generateCampaignName(template),
          description: generateCampaignDescription(template),
          objective: template.objective,
          channels: template.channels,
          type: mapCategoryToType(template.category),
        },
      } as any);

      // Marquer l'étape comme complétée
      completeStep('template');

      // Notifier la validation (toujours valide après sélection)
      onValidationChange?.(true);

      // Déclencher la completion
      onComplete?.();
    },
    [updateStepData, completeStep, onValidationChange, onComplete]
  );

  // Gestion du skip (pas de template)
  const handleSkipTemplate = useCallback(() => {
    // Nettoyer les données de template
    updateStepData({
      template: null,
    } as any);

    // Marquer l'étape comme complétée
    completeStep('template');

    // Notifier la validation (toujours valide)
    onValidationChange?.(true);

    // Déclencher la completion
    onComplete?.();
  }, [updateStepData, completeStep, onValidationChange, onComplete]);

  // Notifier la validation initiale
  React.useEffect(() => {
    // L'étape template est toujours considérée comme valide
    // car l'utilisateur peut choisir ou passer
    onValidationChange?.(true);
  }, [onValidationChange]);

  return (
    <TemplateSelector
      onSelectTemplate={handleSelectTemplate}
      onSkipTemplate={handleSkipTemplate}
      selectedTemplateId={selectedTemplateId}
    />
  );
}

export default TemplateStepWrapper;
