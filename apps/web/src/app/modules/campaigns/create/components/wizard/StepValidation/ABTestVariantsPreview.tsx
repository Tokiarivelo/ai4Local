'use client';

import React from 'react';
import { Card } from '@/app/modules/ui/card';
import { Badge } from '@/app/modules/ui/badge';
import { MiniCampaignPreviewCard } from './MiniCampaignPreviewCard';
import { BasicInfo, Creatives, ABTestVariant } from './CampaignPreview.types';

interface ABTestVariantsPreviewProps {
  basicInfo: BasicInfo;
  creatives: Creatives;
  abTestVariants: ABTestVariant[];
  previewUrl: string;
}

export function ABTestVariantsPreview({
  basicInfo,
  creatives,
  abTestVariants,
  previewUrl,
}: ABTestVariantsPreviewProps) {
  return (
    <Card className="p-6">
      <h5 className="font-medium mb-4">Variantes A/B Testing</h5>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {abTestVariants.map((variant, index) => (
          <div key={variant.id} className="border rounded-lg p-4 bg-muted/50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Badge variant={variant.isControl ? 'default' : 'secondary'}>
                  {variant.isControl ? 'Contrôle' : `Variante ${index + 1}`}
                </Badge>
                <span className="text-sm font-medium">{variant.percentage}%</span>
              </div>
            </div>
            <h6 className="font-medium mb-2">{variant.name}</h6>
            <p className="text-sm text-muted-foreground mb-3">{variant.description}</p>
            <MiniCampaignPreviewCard
              basicInfo={basicInfo}
              creatives={{ ...creatives, ...variant.overrides }}
              device="desktop"
              previewUrl={previewUrl}
              compact
            />
            {variant.overrides && Object.keys(variant.overrides).length > 0 && (
              <div className="space-y-2 mt-2">
                <p className="text-xs font-medium text-muted-foreground">Modifications :</p>
                {Object.entries(variant.overrides).map(([key, value]) => (
                  <div key={key} className="text-xs">
                    <span className="font-medium capitalize">{key}:</span>{' '}
                    <span className="text-muted-foreground">{String(value)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
