'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/app/modules/ui/button';

import { TrackingStepSchema, type TrackingStepData } from '../validators';
import { UTMSection } from './UTMSection';
import { ABTestingSection } from './ABTestingSection';
import { PixelTrackingSection } from './PixelTrackingSection';
import { TrackingRecommendations } from './TrackingRecommendations';

interface TrackingFormProps {
  initialData?: TrackingStepData;
  baselineCreatives?: any;
  onSubmit: (data: TrackingStepData) => void;
  onValidationChange: (isValid: boolean) => void;
}

export function TrackingForm({
  initialData,
  baselineCreatives,
  onSubmit,
  onValidationChange,
}: TrackingFormProps) {
  const form = useForm<TrackingStepData>({
    resolver: zodResolver(TrackingStepSchema),
    defaultValues: {
      utmParameters: initialData?.utmParameters || {
        source: '',
        medium: '',
        campaign: '',
        term: '',
        content: '',
      },
      abTestEnabled: initialData?.abTestEnabled || false,
      abTestVariants: initialData?.abTestVariants || [],
      pixelTracking: initialData?.pixelTracking || {
        enabled: false,
        facebookPixelId: '',
        googleAnalyticsId: '',
        customPixels: [],
        consentRequired: true,
      },
    },
  });

  const {
    handleSubmit,
    formState: { isValid },
    watch,
  } = form;

  // Validation globale
  const isFormValid = React.useMemo(() => {
    const utmSource = watch('utmParameters.source');
    return isValid && Boolean(utmSource);
  }, [isValid, watch]);

  React.useEffect(() => {
    onValidationChange(isFormValid);
  }, [isFormValid, onValidationChange]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Section UTM */}
      <UTMSection form={form} />

      {/* Section A/B Testing */}
      <ABTestingSection form={form} baselineCreatives={baselineCreatives} />

      {/* Section Pixel Tracking */}
      <PixelTrackingSection form={form} />

      {/* Recommandations */}
      <TrackingRecommendations
        utmParameters={watch('utmParameters')}
        abTestEnabled={watch('abTestEnabled')}
        pixelTrackingEnabled={watch('pixelTracking.enabled')}
      />

      {/* Actions */}
      <div className="flex justify-end">
        <Button type="submit" disabled={!isFormValid}>
          Continuer vers la validation
        </Button>
      </div>
    </form>
  );
}
