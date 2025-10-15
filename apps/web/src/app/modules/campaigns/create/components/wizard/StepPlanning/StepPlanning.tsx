'use client';

import React from 'react';
import { PlanningForm } from './PlanningForm';
import { useCampaignStore } from '../../../stores/campaignStore';
import type { PlanningStepData } from '../validators';

interface StepPlanningProps {
  onComplete?: () => void;
  onValidationChange?: (isValid: boolean) => void;
}

export function StepPlanning({ onComplete, onValidationChange }: StepPlanningProps) {
  const { planning: initialData, setPlanning } = useCampaignStore();

  const handleSubmit = (data: PlanningStepData) => {
    setPlanning(data);
    onComplete?.();
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold">Planning et budget</h3>
        <p className="text-sm text-muted-foreground">
          Définissez la période et le budget de votre campagne
        </p>
      </div>

      <PlanningForm
        initialData={initialData}
        onSubmit={handleSubmit}
        onValidationChange={onValidationChange}
      />
    </div>
  );
}

export default StepPlanning;
