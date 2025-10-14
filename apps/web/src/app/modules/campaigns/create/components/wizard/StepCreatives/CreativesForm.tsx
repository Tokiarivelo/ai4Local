'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/app/modules/ui/button';
import { Badge } from '@/app/modules/ui/badge';
import { Sparkles } from 'lucide-react';

import { CreativesStepSchema, type CreativesStepData, type MediaFile } from '../validators';
import { useAiCredits, useIsGenerating, useGenerationError } from '../../../stores/campaignStore';
import { MediaUploadSection } from './MediaUploadSection';
import { TextGenerationSection } from './TextGenerationSection';
import { CampaignPreview } from './CampaignPreview';
import { AIErrorAlert } from './AIErrorAlert';

interface CreativesFormProps {
  initialData?: CreativesStepData;
  onSubmit: (data: CreativesStepData) => void;
  onValidationChange: (isValid: boolean) => void;
}

export function CreativesForm({ initialData, onSubmit, onValidationChange }: CreativesFormProps) {
  // Hooks individuels pour éviter la création d'objets
  const credits = useAiCredits();
  const isGenerating = useIsGenerating();
  const error = useGenerationError();

  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>(initialData?.mediaFiles || []);

  const form = useForm<CreativesStepData>({
    resolver: zodResolver(CreativesStepSchema),
    defaultValues: {
      headline: initialData?.headline || '',
      caption: initialData?.caption || '',
      callToAction: initialData?.callToAction || '',
      mediaFiles: mediaFiles,
    },
  });

  const {
    handleSubmit,
    formState: { isValid },
    watch,
  } = form;

  // Validation globale
  const isFormValid = React.useMemo(() => {
    return isValid && mediaFiles.length > 0;
  }, [isValid, mediaFiles.length]);

  React.useEffect(() => {
    onValidationChange(isFormValid);
  }, [isFormValid, onValidationChange]);

  const handleFormSubmit = React.useCallback(
    (data: CreativesStepData) => {
      const completeData = {
        ...data,
        mediaFiles: mediaFiles,
      };
      onSubmit(completeData);
    },
    [onSubmit, mediaFiles]
  );

  // Watch des valeurs avec fallback pour éviter undefined
  const headline = watch('headline') || '';
  const caption = watch('caption') || '';
  const callToAction = watch('callToAction') || '';

  return (
    <div className="space-y-6">
      {/* Badge crédits IA */}
      <div className="flex justify-end">
        <Badge variant="outline" className="flex items-center gap-1">
          <Sparkles className="h-3 w-3" />
          {credits} crédits IA
        </Badge>
      </div>

      {/* Alerte d'erreur IA */}
      <AIErrorAlert error={error} />

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Section Upload et Génération */}
        <MediaUploadSection
          mediaFiles={mediaFiles}
          onMediaFilesChange={setMediaFiles}
          isGenerating={isGenerating}
        />

        {/* Section Textes */}
        <TextGenerationSection form={form} isGenerating={isGenerating} />

        {/* Preview de la campagne */}
        <CampaignPreview
          headline={headline}
          caption={caption}
          callToAction={callToAction}
          mediaFiles={mediaFiles}
        />

        {/* Actions */}
        <div className="flex justify-end">
          <Button type="submit" disabled={!isFormValid}>
            Continuer vers l'audience
          </Button>
        </div>
      </form>
    </div>
  );
}
