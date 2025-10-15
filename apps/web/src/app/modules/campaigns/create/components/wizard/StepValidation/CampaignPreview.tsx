'use client';

import React, { useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/modules/ui/tabs';
import { useCampaignStore } from '../../../stores/campaignStore';
import { MiniCampaignPreviewCard } from './MiniCampaignPreviewCard';
import { ABTestVariantsPreview } from './ABTestVariantsPreview';
import { generatePreviewUrl } from './campaignPreview.utils';

// Valeurs par défaut pour éviter undefined
const defaultBasicInfo = {
  name: '',
  objective: '',
  type: '',
  channels: [],
  description: '',
};

const defaultCreatives = {
  headline: '',
  caption: '',
  callToAction: '',
  mediaFiles: [],
};

export function CampaignPreview() {
  // Get each field separately to avoid selector recreation
  const basicInfo = useCampaignStore((state) => state.basicInfo) ?? defaultBasicInfo;
  const creatives = useCampaignStore((state) => state.creatives) ?? defaultCreatives;
  const tracking = useCampaignStore((state) => state.tracking);

  // Memoize previewUrl for stability
  const previewUrl = useMemo(() => generatePreviewUrl(tracking), [tracking]);

  return (
    <div className="space-y-6">
      <h4 className="text-lg font-semibold">Aperçu de la campagne</h4>

      <Tabs defaultValue="desktop" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="desktop" className="flex items-center gap-2">
            Desktop
          </TabsTrigger>
          <TabsTrigger value="mobile" className="flex items-center gap-2">
            Mobile
          </TabsTrigger>
        </TabsList>

        <TabsContent value="desktop" className="space-y-4">
          <MiniCampaignPreviewCard
            basicInfo={basicInfo}
            creatives={creatives}
            device="desktop"
            previewUrl={previewUrl}
          />
        </TabsContent>

        <TabsContent value="mobile" className="space-y-4">
          <MiniCampaignPreviewCard
            basicInfo={basicInfo}
            creatives={creatives}
            device="mobile"
            previewUrl={previewUrl}
          />
        </TabsContent>
      </Tabs>

      {tracking?.abTestEnabled && (tracking?.abTestVariants?.length ?? 0) > 0 && (
        <ABTestVariantsPreview
          basicInfo={basicInfo}
          creatives={creatives}
          abTestVariants={tracking.abTestVariants ?? []}
          previewUrl={previewUrl}
        />
      )}
    </div>
  );
}
