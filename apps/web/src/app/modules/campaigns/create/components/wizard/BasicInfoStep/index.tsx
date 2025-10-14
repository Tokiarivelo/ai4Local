'use client';

import React from 'react';
import { useCampaignStore } from '../../../stores/campaignStore';
import { BasicInfoForm } from './BasicInfoForm';
import { ObjectiveSelector } from './ObjectiveSelector';
import { ChannelSelector } from './ChannelSelector';
import { RecommendationsCard } from './RecommendationsCard';

interface BasicInfoStepProps {
  onComplete?: () => void;
  onValidationChange?: (isValid: boolean) => void;
  isValidating?: boolean;
  onAsyncValidation?: (data: any) => Promise<void>;
  isEditing?: boolean;
}

export function BasicInfoStep({
  onComplete,
  onValidationChange,
  isValidating = false,
  onAsyncValidation,
  isEditing = false,
}: BasicInfoStepProps) {
  const { basicInfo, setBasicInfo, completeStep, setStepValidation } = useCampaignStore();

  const handleFormSubmit = React.useCallback(
    (data: any) => {
      setBasicInfo(data);
      completeStep('basic_info');
      onComplete?.();
    },
    [setBasicInfo, completeStep, onComplete]
  );

  const handleValidationChange = React.useCallback(
    (isValid: boolean) => {
      setStepValidation('basic_info', isValid);
      onValidationChange?.(isValid);
    },
    [setStepValidation, onValidationChange]
  );

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div>
        <h3 className="text-lg font-semibold">Informations de base</h3>
        <p className="text-sm text-muted-foreground">
          Définissez les informations essentielles de votre campagne
        </p>
      </div>

      <BasicInfoForm
        initialData={basicInfo}
        onSubmit={handleFormSubmit}
        onValidationChange={handleValidationChange}
        isValidating={isValidating}
      />
    </div>
  );
}

export default BasicInfoStep;
