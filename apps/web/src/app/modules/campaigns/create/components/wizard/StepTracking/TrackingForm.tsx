'use client';

import React, { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/app/modules/ui/button';
import { Alert, AlertDescription } from '@/app/modules/ui/alert';
import { AlertCircle } from 'lucide-react';
import { UTMSection } from './UTMSection';
import { ABTestSection } from './ABTestSection';
import { PixelTrackingSection } from './PixelTrackingSection';
import { TrackingStepSchema, type TrackingStepData } from '../validators';
import { useCreatives } from '../../../stores/campaignStore';

interface TrackingFormProps {
  initialData?: TrackingStepData;
  onSubmit: (data: TrackingStepData) => void;
  onValidationChange?: (isValid: boolean) => void;
}

export function TrackingForm({ initialData, onSubmit, onValidationChange }: TrackingFormProps) {
  const [enableAbTesting, setEnableAbTesting] = useState(initialData?.abTestEnabled || false);
  const baselineCreatives = useCreatives();

  const form = useForm<TrackingStepData>({
    resolver: zodResolver(TrackingStepSchema),
    defaultValues: {
      utmParameters: {
        source: initialData?.utmParameters?.source || '',
        medium: initialData?.utmParameters?.medium || '',
        campaign: initialData?.utmParameters?.campaign || '',
        term: initialData?.utmParameters?.term || '',
        content: initialData?.utmParameters?.content || '',
      },
      generatedUrl: initialData?.generatedUrl || '',
      abTestEnabled: enableAbTesting,
      abTestVariants: initialData?.abTestVariants || [
        {
          id: '1',
          name: 'Contrôle - Version originale',
          percentage: 50,
          isControl: true,
          description: "Version de base créée dans l'étape Créatifs",
          overrides: {},
          expectedOutcome: 'Baseline pour comparaison avec les variantes',
        },
        {
          id: '2',
          name: 'Variante A - Titre avec urgence',
          percentage: 50,
          isControl: false,
          description: "Test d'un titre avec notion d'urgence",
          overrides: {
            headline: baselineCreatives?.headline
              ? `${baselineCreatives.headline} - Offre limitée !`
              : 'Offre limitée - Profitez maintenant !',
          },
          expectedOutcome: "Augmentation du taux de clic grâce à l'effet d'urgence",
        },
      ],
      pixelTracking: {
        facebookPixel: initialData?.pixelTracking?.facebookPixel || '',
        googleAnalytics: initialData?.pixelTracking?.googleAnalytics || '',
        customPixels: initialData?.pixelTracking?.customPixels || [],
        enabled: initialData?.pixelTracking?.enabled || false,
      },
    },
  });

  const {
    handleSubmit,
    formState: { isValid },
    watch,
  } = form;

  const utmSource = watch('utmParameters.source');
  const utmMedium = watch('utmParameters.medium');
  const utmCampaign = watch('utmParameters.campaign');
  const abTestEnabled = watch('abTestEnabled');
  const abTestVariants = watch('abTestVariants');
  const pixelTracking = watch('pixelTracking');

  // Validation personnalisée
  const isUTMValid = React.useMemo(() => {
    return Boolean(utmSource && utmMedium && utmCampaign);
  }, [utmSource, utmMedium, utmCampaign]);

  const isABTestValid = React.useMemo(() => {
    if (!abTestEnabled) return true;
    if (!abTestVariants || abTestVariants.length < 2) return false;

    const totalPercentage = abTestVariants.reduce(
      (sum, variant) => sum + (variant.percentage || 0),
      0
    );
    return totalPercentage === 100;
  }, [abTestEnabled, abTestVariants]);

  const isFormValid = React.useMemo(() => {
    return isUTMValid && isABTestValid;
  }, [isUTMValid, isABTestValid]);

  React.useEffect(() => {
    onValidationChange?.(isFormValid);
  }, [isFormValid, onValidationChange]);

  const handleABTestToggle = useCallback((enabled: boolean) => {
    setEnableAbTesting(enabled);
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <UTMSection form={form} />

      <PixelTrackingSection form={form} />

      <ABTestSection
        form={form}
        enabled={enableAbTesting}
        onToggle={handleABTestToggle}
        baselineCreatives={baselineCreatives}
      />

      {/* Recommandations */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Bonnes pratiques :</strong>
          <ul className="mt-2 space-y-1 text-sm">
            <li>• Utilisez des noms UTM cohérents et descriptifs</li>
            <li>• Testez toujours vos URLs avant le lancement</li>
            <li>• Limitez-vous à 2-4 variantes pour des résultats significatifs</li>
            <li>• Assurez-vous que vos pixels sont correctement installés</li>
            <li>• Vérifiez que votre pixel Facebook est actif dans le gestionnaire</li>
          </ul>
        </AlertDescription>
      </Alert>

      {/* Actions */}
      <div className="flex justify-end">
        <Button type="submit" disabled={!isFormValid}>
          Continuer vers la validation
        </Button>
      </div>
    </form>
  );
}
