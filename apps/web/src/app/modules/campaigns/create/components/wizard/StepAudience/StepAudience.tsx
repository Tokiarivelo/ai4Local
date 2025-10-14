'use client';

import React, { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/app/modules/ui/button';

import { AudienceStepSchema, type AudienceStepData } from '../validators';
import { useCampaignStore } from '../../../stores/campaignStore';
import { SegmentSelector } from './SegmentSelector';
import { CustomFilters } from './CustomFilters';
import { CSVImport } from './CSVImport';
import { AudienceEstimator } from './AudienceEstimator';
import { AudienceSummary } from './AudienceSummary';

interface StepAudienceProps {
  onComplete?: () => void;
  onValidationChange?: (isValid: boolean) => void;
}

export function StepAudience({ onComplete, onValidationChange }: StepAudienceProps) {
  const { audience, setAudience, completeStep } = useCampaignStore();

  // État local pour gérer les données en temps réel
  const [localData, setLocalData] = useState<AudienceStepData>(
    audience || {
      selectedSegments: [],
      customFilters: [],
      csvImport: undefined,
      estimatedReach: 0,
    }
  );

  const form = useForm<AudienceStepData>({
    resolver: zodResolver(AudienceStepSchema),
    defaultValues: localData,
    values: localData, // Synchronise avec l'état local
  });

  const {
    handleSubmit,
    formState: { isValid },
  } = form;

  // Notification de validation
  React.useEffect(() => {
    const hasSegments = localData.selectedSegments.length > 0;
    const isFormValid = isValid && hasSegments;
    onValidationChange?.(isFormValid);
  }, [isValid, localData.selectedSegments.length, onValidationChange]);

  // Mise à jour de l'état local uniquement - mémorisé pour éviter les re-rendus
  const handleDataChange = useCallback((updates: Partial<AudienceStepData>) => {
    setLocalData((prev) => {
      // Vérifier si les données ont réellement changé
      const hasChanged = Object.keys(updates).some((key) => {
        const typedKey = key as keyof AudienceStepData;
        return JSON.stringify(prev[typedKey]) !== JSON.stringify(updates[typedKey]);
      });

      if (!hasChanged) {
        return prev; // Retourner la même référence si rien n'a changé
      }

      return { ...prev, ...updates };
    });
  }, []);

  // Callback mémorisé pour la mise à jour du reach
  const handleReachUpdate = useCallback(
    (reach: number) => {
      handleDataChange({ estimatedReach: reach });
    },
    [handleDataChange]
  );

  const onSubmit = useCallback(
    (data: AudienceStepData) => {
      // Sauvegarde dans le store seulement à la soumission
      setAudience(data);
      completeStep('audience');
      onComplete?.();
    },
    [setAudience, completeStep, onComplete]
  );

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div>
        <h3 className="text-lg font-semibold">Définir l'audience</h3>
        <p className="text-sm text-muted-foreground">
          Sélectionnez vos segments cibles pour maximiser l'impact de votre campagne
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Sélection de segments */}
        <SegmentSelector
          selectedSegments={localData.selectedSegments}
          onSegmentsChange={(segments) => handleDataChange({ selectedSegments: segments })}
        />

        {/* Filtres personnalisés */}
        <CustomFilters
          filters={localData.customFilters || []}
          onFiltersChange={(filters) => handleDataChange({ customFilters: filters })}
        />

        {/* Import CSV */}
        <CSVImport
          csvData={localData.csvImport}
          onCsvDataChange={(csvData) => handleDataChange({ csvImport: csvData })}
        />

        {/* Estimateur d'audience */}
        <AudienceEstimator
          selectedSegments={localData.selectedSegments}
          customFilters={localData.customFilters || []}
          csvData={localData.csvImport}
          onReachUpdate={handleReachUpdate}
        />

        {/* Résumé */}
        <AudienceSummary
          segments={localData.selectedSegments}
          filters={localData.customFilters || []}
          csvData={localData.csvImport}
          estimatedReach={localData.estimatedReach ?? 0}
        />

        {/* Actions */}
        <div className="flex justify-end">
          <Button type="submit" disabled={!isValid || localData.selectedSegments.length === 0}>
            Continuer vers le planning
          </Button>
        </div>
      </form>
    </div>
  );
}

export default StepAudience;
