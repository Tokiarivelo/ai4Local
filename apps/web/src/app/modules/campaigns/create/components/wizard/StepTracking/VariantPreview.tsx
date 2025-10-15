'use client';

import React from 'react';
import { Target } from 'lucide-react';
import { Badge } from '@/app/modules/ui/badge';
import type { ABTestVariant } from '../validators';
import { getFinalCreativeForVariant } from '../validators';

interface VariantPreviewProps {
  variants: ABTestVariant[];
  baselineCreatives?: any;
}

export function VariantPreview({ variants, baselineCreatives }: VariantPreviewProps) {
  return (
    <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
      <h5 className="font-medium mb-3 flex items-center gap-2">
        <Target className="h-4 w-4" />
        Aperçu des variantes finales
      </h5>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {variants?.map((variant, index) => {
          // Fusion des créatifs de base avec les overrides
          const finalCreative = baselineCreatives
            ? getFinalCreativeForVariant(baselineCreatives, variant)
            : null;

          return (
            <div key={variant.id} className="p-3 bg-white dark:bg-gray-800 border rounded">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-sm">{variant.name}</span>
                <Badge variant={variant.isControl ? 'default' : 'secondary'}>
                  {variant.percentage}%
                </Badge>
              </div>

              {variant.description && (
                <p className="text-xs text-muted-foreground mb-2">{variant.description}</p>
              )}

              {/* Aperçu du contenu final fusionné */}
              <div className="space-y-1">
                {finalCreative?.headline && (
                  <div className="text-xs">
                    <span className="font-medium">Titre: </span>
                    <span className="text-muted-foreground">"{finalCreative.headline}"</span>
                    {variant.overrides?.headline && (
                      <Badge variant="outline" className="ml-1 text-[10px] px-1">
                        Modifié
                      </Badge>
                    )}
                  </div>
                )}

                {finalCreative?.caption && (
                  <div className="text-xs">
                    <span className="font-medium">Description: </span>
                    <span className="text-muted-foreground">"{finalCreative.caption}"</span>
                    {variant.overrides?.caption && (
                      <Badge variant="outline" className="ml-1 text-[10px] px-1">
                        Modifié
                      </Badge>
                    )}
                  </div>
                )}

                {finalCreative?.callToAction && (
                  <div className="text-xs">
                    <span className="font-medium">CTA: </span>
                    <span className="text-muted-foreground">"{finalCreative.callToAction}"</span>
                    {variant.overrides?.callToAction && (
                      <Badge variant="outline" className="ml-1 text-[10px] px-1">
                        Modifié
                      </Badge>
                    )}
                  </div>
                )}

                {finalCreative?.mediaFiles && (
                  <div className="text-xs">
                    <span className="font-medium">Médias: </span>
                    <span className="text-muted-foreground">
                      {finalCreative.mediaFiles.length} fichier(s)
                    </span>
                    {variant.overrides?.mediaFiles && (
                      <Badge variant="outline" className="ml-1 text-[10px] px-1">
                        Modifié
                      </Badge>
                    )}
                  </div>
                )}
              </div>

              {variant.expectedOutcome && (
                <div className="mt-2 text-xs text-green-600 dark:text-green-400">
                  🎯 {variant.expectedOutcome}
                </div>
              )}
            </div>
          );
        }) || []}
      </div>
    </div>
  );
}
