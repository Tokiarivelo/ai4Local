'use client';

import React from 'react';
import { useCampaignStore } from '../../../stores/campaignStore';
import { ValidationHeader } from './ValidationHeader';
import { ValidationOverview } from './ValidationOverview';
import { CampaignPreview } from './CampaignPreview';
import { ValidationChecklist } from './ValidationChecklist';
import { PublishingActions } from './PublishingActions';

interface StepValidationProps {
  onComplete?: () => void;
  onEdit?: (step: string) => void;
}

export function StepValidation({ onComplete, onEdit }: StepValidationProps) {
  const campaignData = useCampaignStore((state) => ({
    template: state.template,
    basicInfo: state.basicInfo,
    creatives: state.creatives,
    audience: state.audience,
    planning: state.planning,
    tracking: state.tracking,
    stepValidation: state.stepValidation,
    isPublishing: state.isPublishing,
    publishingProgress: state.publishingProgress,
  }));

  const { getCampaignSummary } = useCampaignStore();

  return (
    <div className="space-y-8">
      <ValidationHeader campaignData={campaignData} />

      <ValidationOverview campaignData={campaignData} onEdit={onEdit} />

      <CampaignPreview campaignData={campaignData} />

      <ValidationChecklist />

      <PublishingActions campaignData={campaignData} onComplete={onComplete} onEdit={onEdit} />
    </div>
  );
}

export default StepValidation;
