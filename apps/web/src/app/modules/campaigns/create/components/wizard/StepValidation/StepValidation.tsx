'use client';

import React, { useMemo } from 'react';
import { useCampaignStore } from '../../../stores/campaignStore';
import { ValidationHeader } from './ValidationHeader';
import { ValidationOverview } from './ValidationOverview';
import { CampaignPreview } from './CampaignPreview';
import { ValidationChecklist } from './ValidationChecklist';
import { PublishingActions } from './PublishingActions';
import { PixelTrackingSummary } from './PixelTrackingSummary';

interface StepValidationProps {
  onComplete?: () => void;
  onEdit?: (step: string) => void;
}

export function StepValidation({ onComplete, onEdit }: StepValidationProps) {
  // Get all needed fields individually
  const template = useCampaignStore((state) => state.template);
  const basicInfo = useCampaignStore((state) => state.basicInfo);
  const creatives = useCampaignStore((state) => state.creatives);
  const audience = useCampaignStore((state) => state.audience);
  const planning = useCampaignStore((state) => state.planning);
  const tracking = useCampaignStore((state) => state.tracking);
  const stepValidation = useCampaignStore((state) => state.stepValidation);
  const isPublishing = useCampaignStore((state) => state.isPublishing);
  const publishingProgress = useCampaignStore((state) => state.publishingProgress);

  // Memoize the campaignData object so its reference is stable
  const campaignData = useMemo(
    () => ({
      template,
      basicInfo,
      creatives,
      audience,
      planning,
      tracking,
      stepValidation,
      isPublishing,
      publishingProgress,
    }),
    [
      template,
      basicInfo,
      creatives,
      audience,
      planning,
      tracking,
      stepValidation,
      isPublishing,
      publishingProgress,
    ]
  );

  return (
    <div className="space-y-8">
      <ValidationHeader campaignData={campaignData} />

      <ValidationOverview campaignData={campaignData} onEdit={onEdit} />

      <CampaignPreview />

      <PixelTrackingSummary />

      <ValidationChecklist />

      <PublishingActions campaignData={campaignData} onComplete={onComplete} onEdit={onEdit} />
    </div>
  );
}

export default StepValidation;
