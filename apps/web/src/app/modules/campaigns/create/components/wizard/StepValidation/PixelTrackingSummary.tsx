'use client';

import React, { useState } from 'react';
import { useTracking } from '../../../stores/campaignStore';
import { Card } from '@/app/modules/ui/card';
import { Badge } from '@/app/modules/ui/badge';
import { Check, X, Eye, EyeOff } from 'lucide-react';

export function PixelTrackingSummary() {
  const tracking = useTracking();
  const pixelTracking = tracking?.pixelTracking;
  const [showValues, setShowValues] = useState(false);

  if (!pixelTracking?.enabled) return null;

  // Helper to mask value
  const maskValue = (value?: string) => (value ? '•'.repeat(Math.max(8, value.length)) : '');

  return (
    <Card className="p-6">
      <h4 className="font-semibold mb-4">Pixels de tracking configurés</h4>
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Badge variant="outline">Facebook Pixel</Badge>
          {pixelTracking.facebookPixel ? (
            <span className="flex items-center gap-1 text-green-600">
              <Check className="h-4 w-4" />
              <span>
                {showValues ? pixelTracking.facebookPixel : maskValue(pixelTracking.facebookPixel)}
              </span>
            </span>
          ) : (
            <span className="flex items-center gap-1 text-red-600">
              <X className="h-4 w-4" /> Non configuré
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">Google Analytics</Badge>
          {pixelTracking.googleAnalytics ? (
            <span className="flex items-center gap-1 text-green-600">
              <Check className="h-4 w-4" />
              <span>
                {showValues
                  ? pixelTracking.googleAnalytics
                  : maskValue(pixelTracking.googleAnalytics)}
              </span>
            </span>
          ) : (
            <span className="flex items-center gap-1 text-red-600">
              <X className="h-4 w-4" /> Non configuré
            </span>
          )}
        </div>
        {(pixelTracking.customPixels?.length ?? 0) > 0 && (
          <div>
            <Badge variant="outline">Pixels personnalisés</Badge>
            <ul className="ml-4 mt-2 space-y-1">
              {(pixelTracking.customPixels ?? []).map((pixel, idx) => (
                <li key={idx} className="flex items-center gap-2 text-green-700">
                  <Check className="h-4 w-4" />
                  <span className="font-medium">{pixel.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {showValues ? pixel.id : maskValue(pixel.id)}
                  </span>
                  {pixel.description && (
                    <span className="text-xs text-muted-foreground">({pixel.description})</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="mt-4">
          <button
            type="button"
            className="flex items-center gap-2 text-sm text-primary"
            onClick={() => setShowValues((v) => !v)}
          >
            {showValues ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {showValues ? 'Masquer les valeurs' : 'Afficher les valeurs'}
          </button>
        </div>
      </div>
    </Card>
  );
}
