'use client';

import React from 'react';
import { TrackingForm } from './TrackingForm';
import { useCampaignStore } from '../../../stores/campaignStore';
import type { TrackingStepData } from '../validators';

interface StepTrackingProps {
  onComplete?: () => void;
  onValidationChange?: (isValid: boolean) => void;
}

export function StepTracking({ onComplete, onValidationChange }: StepTrackingProps) {
  const { tracking: initialData, setTracking } = useCampaignStore();

  const handleSubmit = (data: TrackingStepData) => {
    setTracking(data);
    onComplete?.();
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold">Tracking et mesure</h3>
        <p className="text-sm text-muted-foreground">
          Configurez le suivi de votre campagne, les tests A/B et le tracking pixel
        </p>
      </div>

      <TrackingForm
        initialData={initialData}
        onSubmit={handleSubmit}
        onValidationChange={onValidationChange}
      />
    </div>
  );
}

export default StepTracking;
