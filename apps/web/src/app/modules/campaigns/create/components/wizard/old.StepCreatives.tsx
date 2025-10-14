/**
 * Étape Créatifs - Upload d'images/vidéos et génération IA
 * Gère l'upload de fichiers, la génération de contenu par IA et la preview
 */

'use client';

import React from 'react';
import { useCampaignStore } from '../../stores/campaignStore';
import { CreativesForm } from './StepCreatives/CreativesForm';

interface StepCreativesProps {
  onComplete?: () => void;
  onValidationChange?: (isValid: boolean) => void;
}

export function StepCreatives({ onComplete, onValidationChange }: StepCreativesProps) {
  const { creatives, setCreatives, completeStep, setStepValidation } = useCampaignStore();

  const handleFormSubmit = React.useCallback(
    (data: any) => {
      setCreatives(data);
      completeStep('creative');
      onComplete?.();
    },
    [setCreatives, completeStep, onComplete]
  );

  const handleValidationChange = React.useCallback(
    (isValid: boolean) => {
      setStepValidation('creative', isValid);
      onValidationChange?.(isValid);
    },
    [setStepValidation, onValidationChange]
  );

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Créatifs de campagne</h3>
          <p className="text-sm text-muted-foreground">
            Ajoutez des images, vidéos et textes pour votre campagne
          </p>
        </div>
      </div>

      <CreativesForm
        initialData={creatives}
        onSubmit={handleFormSubmit}
        onValidationChange={handleValidationChange}
      />
    </div>
  );
}

export default StepCreatives;
