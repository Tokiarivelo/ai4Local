'use client';

import React, { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import type { CampaignDraft, WizardState } from '../types';

// Import des composants d'étapes
import { BasicInfoStep } from './wizard/BasicInfoStep';
import { CreativeStep } from './wizard/CreativeStep';
import { AudienceStep } from './wizard/AudienceStep';
import { ScheduleBudgetStep } from './wizard/ScheduleBudgetStep';
import { TrackingStep } from './wizard/TrackingStep';
import { ReviewStep } from './wizard/ReviewStep';

interface CreateCampaignFormProps {
  /**
   * Étape actuelle du wizard
   */
  currentStep: WizardState['currentStep'];

  /**
   * Données de la campagne
   */
  campaignData: Partial<CampaignDraft>;

  /**
   * Callback appelé lors de modification des données
   */
  onDataChange: (data: Partial<CampaignDraft>) => void;

  /**
   * Callback appelé quand une étape est complétée
   */
  onStepComplete: (stepId: WizardState['currentStep']) => void;

  /**
   * Callback pour l'état de validation
   */
  onValidationChange: (isValid: boolean) => void;

  /**
   * Mode édition
   */
  isEditing?: boolean;
}

/**
 * Formulaire principal avec gestion des étapes wizard
 * Utilise React Hook Form + Zod pour la validation
 */
export function CreateCampaignForm({
  currentStep,
  campaignData,
  onDataChange,
  onStepComplete,
  onValidationChange,
  isEditing = false,
}: CreateCampaignFormProps) {
  const [isValidating, setIsValidating] = useState(false);

  // Configuration du formulaire selon l'étape actuelle
  const getFormConfig = () => {
    // Pour l'instant, utilisation d'un schéma basique
    // TODO: Implémenter les schémas de validation Zod par étape
    const defaultValues = getDefaultValuesForStep(currentStep, campaignData);

    return {
      defaultValues,
      mode: 'onChange' as const,
    };
  };

  const methods = useForm(getFormConfig());
  const {
    formState: { isValid, isDirty, errors },
    watch,
    reset,
  } = methods;

  // Surveiller les changements du formulaire
  const watchedValues = watch();

  // Mettre à jour les données parent quand le formulaire change
  useEffect(() => {
    if (isDirty) {
      const updatedData = {
        ...campaignData,
        ...getStepDataFromFormValues(currentStep, watchedValues),
      };
      onDataChange(updatedData);
    }
  }, [watchedValues, isDirty, campaignData, onDataChange, currentStep]);

  // Notifier l'état de validation
  useEffect(() => {
    onValidationChange(isValid);
  }, [isValid, onValidationChange]);

  // Marquer l'étape comme complétée si valide
  useEffect(() => {
    if (isValid && isDirty) {
      onStepComplete(currentStep);
    }
  }, [isValid, isDirty, currentStep, onStepComplete]);

  // Réinitialiser le formulaire quand l'étape change
  useEffect(() => {
    const newConfig = getFormConfig();
    reset(newConfig.defaultValues);
  }, [currentStep, reset]);

  // Validation asynchrone pour certaines étapes
  const handleAsyncValidation = async (data: any) => {
    setIsValidating(true);
    try {
      // Validation spécifique selon l'étape
      switch (currentStep) {
        case 'audience':
          // Valider la taille d'audience
          if (data.segments?.length > 0) {
            // TODO: Appel API pour estimer l'audience
            await new Promise((resolve) => setTimeout(resolve, 500));
          }
          break;

        case 'creative':
          // Valider les créatifs uploadés
          if (data.creatives?.length > 0) {
            // TODO: Validation des fichiers
            await new Promise((resolve) => setTimeout(resolve, 300));
          }
          break;

        case 'schedule_budget':
          // Valider le budget et les dates
          if (data.budget && data.schedule) {
            // TODO: Validation business rules
            await new Promise((resolve) => setTimeout(resolve, 200));
          }
          break;
      }
    } catch (error) {
      console.error('Async validation error:', error);
    } finally {
      setIsValidating(false);
    }
  };

  // Rendu du composant d'étape approprié
  const renderStepComponent = () => {
    const stepProps = {
      isValidating,
      onAsyncValidation: handleAsyncValidation,
      isEditing,
    };

    switch (currentStep) {
      case 'basic_info':
        return <BasicInfoStep {...stepProps} />;

      case 'creative':
        return <CreativeStep {...stepProps} />;

      case 'audience':
        return <AudienceStep {...stepProps} />;

      case 'schedule_budget':
        return <ScheduleBudgetStep {...stepProps} />;

      case 'tracking':
        return <TrackingStep {...stepProps} />;

      case 'review':
        return <ReviewStep {...stepProps} campaignData={campaignData} />;

      default:
        return (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Étape non reconnue: {currentStep}</p>
          </div>
        );
    }
  };

  return (
    <FormProvider {...methods}>
      <form className="space-y-6">
        {/* Indicateurs de validation */}
        {Object.keys(errors).length > 0 && (
          <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <h4 className="font-medium text-red-800 dark:text-red-200 mb-2">
              ⚠️ Veuillez corriger les erreurs suivantes :
            </h4>
            <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
              {Object.entries(errors).map(([field, error]) => {
                const errorMessage =
                  typeof error === 'string'
                    ? error
                    : (error as any)?.message || 'Erreur de validation';
                return (
                  <li key={field}>
                    • {getFieldLabel(field)}: {errorMessage}
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* Composant d'étape */}
        {renderStepComponent()}

        {/* État de validation */}
        {isValidating && (
          <div className="text-center py-4">
            <div className="inline-flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" />
              <span className="text-sm text-muted-foreground">Validation en cours...</span>
            </div>
          </div>
        )}
      </form>
    </FormProvider>
  );
}

/**
 * Génère les valeurs par défaut selon l'étape
 */
function getDefaultValuesForStep(
  step: WizardState['currentStep'],
  data: Partial<CampaignDraft>
): any {
  switch (step) {
    case 'basic_info':
      return {
        name: data.name || '',
        description: data.description || '',
        objective: data.objective || 'awareness',
        channels: data.channels || [],
      };

    case 'creative':
      return {
        creatives: data.creatives || [],
      };

    case 'audience':
      return {
        audienceSegments: data.audienceSegments || [],
        customAudience: data.customAudience || [],
      };

    case 'schedule_budget':
      return {
        startDate: data.schedule?.startAt || '',
        endDate: data.schedule?.endAt || '',
        timezone: data.schedule?.timezone || 'Europe/Paris',
        budget: data.budget || {
          type: 'daily',
          amount: 0,
          currency: 'EUR',
          pacingStrategy: 'standard',
        },
      };

    case 'tracking':
      return {
        utmSource: data.tracking?.utm?.source || '',
        utmMedium: data.tracking?.utm?.medium || '',
        utmCampaign: data.tracking?.utm?.campaign || '',
        utmTerm: data.tracking?.utm?.term || '',
        utmContent: data.tracking?.utm?.content || '',
        pixelTracking: data.tracking?.pixelTracking || false,
        conversionTracking: data.tracking?.conversionTracking || false,
        customEvents: data.tracking?.customEvents || [],
      };

    case 'review':
      return data;

    default:
      return {};
  }
}

/**
 * Extrait les données de l'étape depuis les valeurs du formulaire
 */
function getStepDataFromFormValues(
  step: WizardState['currentStep'],
  values: any
): Partial<CampaignDraft> {
  switch (step) {
    case 'basic_info':
      return {
        name: values.name,
        description: values.description,
        objective: values.objective,
        channels: values.channels,
      };

    case 'creative':
      return {
        creatives: values.creatives,
      };

    case 'audience':
      return {
        audienceSegments: values.audienceSegments,
        customAudience: values.customAudience,
      };

    case 'schedule_budget':
      return {
        budget: values.budget,
        schedule: {
          startAt: values.startDate,
          endAt: values.endDate,
          timezone: values.timezone,
        },
      };

    case 'tracking':
      return {
        tracking: {
          utm: {
            source: values.utmSource,
            medium: values.utmMedium,
            campaign: values.utmCampaign,
            term: values.utmTerm,
            content: values.utmContent,
          },
          pixelTracking: values.pixelTracking || false,
          conversionTracking: values.conversionTracking || false,
          customEvents: values.customEvents || [],
        },
      };

    default:
      return {};
  }
}

/**
 * Libellé des champs pour les messages d'erreur
 */
function getFieldLabel(fieldName: string): string {
  const labels: Record<string, string> = {
    name: 'Nom de la campagne',
    description: 'Description',
    objective: 'Objectif',
    channels: 'Canaux',
    creatives: 'Créatifs',
    segments: "Segments d'audience",
    budget: 'Budget',
    schedule: 'Planning',
    utm: 'Paramètres UTM',
  };

  return labels[fieldName] || fieldName;
}
