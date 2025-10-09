'use client';

import React, { useState, useCallback, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/app/modules/ui/button';
import { Card } from '@/app/modules/ui/card';
import { Progress } from '@/app/modules/ui/progress';
import { Badge } from '@/app/modules/ui/badge';
import {
  ArrowLeft,
  ArrowRight,
  Save,
  Eye,
  CheckCircle,
  AlertCircle,
  Clock,
  Zap,
} from 'lucide-react';

import type {
  CampaignDraft,
  WizardState,
  CampaignObjective,
  CampaignChannel,
  Creative,
} from '../types';
import { CreateCampaignForm } from './CreateCampaignForm';
import { TemplateSelector } from './wizard/TemplateSelector';
import { PreviewPanel } from './preview/PreviewPanel';

// Configuration des étapes du wizard
const WIZARD_STEPS = [
  {
    id: 'template',
    title: 'Template',
    description: 'Choisir un modèle',
    icon: '📝',
    optional: true,
  },
  {
    id: 'basic_info',
    title: 'Informations',
    description: 'Nom et objectif',
    icon: '🎯',
    optional: false,
  },
  {
    id: 'creative',
    title: 'Créatifs',
    description: 'Images et textes',
    icon: '🎨',
    optional: false,
  },
  {
    id: 'audience',
    title: 'Audience',
    description: 'Ciblage et segments',
    icon: '👥',
    optional: false,
  },
  {
    id: 'schedule_budget',
    title: 'Planning',
    description: 'Budget et calendrier',
    icon: '📅',
    optional: false,
  },
  {
    id: 'tracking',
    title: 'Tracking',
    description: 'UTM et A/B tests',
    icon: '📊',
    optional: true,
  },
  {
    id: 'review',
    title: 'Validation',
    description: 'Vérification finale',
    icon: '✅',
    optional: false,
  },
] as const;

interface CampaignTemplate {
  readonly id: string;
  readonly name: string;
  readonly objective: CampaignObjective;
  readonly channels: readonly string[];
  readonly creatives: Creative[];
}

interface CampaignCreatePageProps {
  /**
   * ID de template à utiliser par défaut (depuis URL)
   */
  templateId?: string;

  /**
   * Données de campagne pré-remplies (duplication)
   */
  initialData?: Partial<CampaignDraft>;

  /**
   * Mode d'édition (true si modification d'une campagne existante)
   */
  isEditing?: boolean;

  /**
   * Callback appelé lors de la création/modification
   */
  onSuccess?: (campaignId: string) => void;

  /**
   * Callback appelé lors de l'annulation
   */
  onCancel?: () => void;
}

/**
 * Page principale de création/édition de campagne
 * Gère le workflow wizard avec navigation et sauvegarde
 */
export const CampaignCreatePage: React.FC<CampaignCreatePageProps> = ({
  templateId,
  initialData,
  isEditing = false,
  onSuccess,
  onCancel,
}) => {
  const router = useRouter();
  const isInitialRender = useRef(true);

  // État du wizard
  const [wizardState, setWizardState] = useState<WizardState>({
    currentStep: templateId ? 'basic_info' : 'template',
    completedSteps: [],
    visitedSteps: [templateId ? 'basic_info' : 'template'],
    isValid: false,
    hasUnsavedChanges: false,
  });

  // État de l'interface
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showTemplateSelector, setShowTemplateSelector] = useState(!templateId && !initialData);

  // Brouillon de la campagne
  const [campaignDraft, setCampaignDraft] = useState<Partial<CampaignDraft>>(initialData || {});

  /**
   * Mise à jour des données de campagne avec protection contre les boucles
   */
  const handleDataChange = useCallback((data: Partial<CampaignDraft>) => {
    setCampaignDraft((prev) => {
      // Comparaison profonde pour éviter les mises à jour inutiles
      const hasRealChanges = Object.keys(data).some((key) => {
        const oldValue = prev[key as keyof CampaignDraft];
        const newValue = data[key as keyof CampaignDraft];
        return JSON.stringify(oldValue) !== JSON.stringify(newValue);
      });

      if (!hasRealChanges) {
        return prev; // Pas de changement, retourner l'état précédent
      }

      const newData = { ...prev, ...data };

      // Marquer comme modifié seulement si ce n'est pas le premier rendu
      if (!isInitialRender.current) {
        setWizardState((prevWizard) => ({
          ...prevWizard,
          hasUnsavedChanges: true,
        }));
      }

      return newData;
    });
  }, []);

  /**
   * Gestion de la validation d'étape
   */
  const handleValidationChange = useCallback((isValid: boolean) => {
    setWizardState((prev) => {
      if (prev.isValid === isValid) return prev;
      return { ...prev, isValid };
    });
  }, []);

  /**
   * Navigation entre les étapes
   */
  const navigateToStep = useCallback((stepId: (typeof WIZARD_STEPS)[number]['id']) => {
    setWizardState((prev) => ({
      ...prev,
      currentStep: stepId,
      visitedSteps: prev.visitedSteps.includes(stepId)
        ? prev.visitedSteps
        : [...prev.visitedSteps, stepId],
    }));
  }, []);

  /**
   * Étape suivante
   */
  const nextStep = useCallback(() => {
    const currentIndex = WIZARD_STEPS.findIndex((step) => step.id === wizardState.currentStep);
    if (currentIndex < WIZARD_STEPS.length - 1) {
      const nextStep = WIZARD_STEPS[currentIndex + 1];
      navigateToStep(nextStep.id);
    }
  }, [wizardState.currentStep, navigateToStep]);

  /**
   * Étape précédente
   */
  const previousStep = useCallback(() => {
    const currentIndex = WIZARD_STEPS.findIndex((step) => step.id === wizardState.currentStep);
    if (currentIndex > 0) {
      const prevStep = WIZARD_STEPS[currentIndex - 1];
      navigateToStep(prevStep.id);
    }
  }, [wizardState.currentStep, navigateToStep]);

  /**
   * Marquer une étape comme complétée
   */
  const markStepCompleted = useCallback((stepId: (typeof WIZARD_STEPS)[number]['id']) => {
    setWizardState((prev) => ({
      ...prev,
      completedSteps: prev.completedSteps.includes(stepId)
        ? prev.completedSteps
        : [...prev.completedSteps, stepId],
    }));
  }, []);

  /**
   * Sélection d'un template
   */
  const handleTemplateSelect = useCallback(
    (template: CampaignTemplate) => {
      const templateData: Partial<CampaignDraft> = {
        name: template.name,
        objective: template.objective,
        channels: [...template.channels] as CampaignChannel[],
        creatives: [...template.creatives],
      };

      handleDataChange(templateData);
      setShowTemplateSelector(false);
      navigateToStep('basic_info');
      markStepCompleted('template');
    },
    [handleDataChange, navigateToStep, markStepCompleted]
  );

  /**
   * Ignorer la sélection de template
   */
  const handleSkipTemplate = useCallback(() => {
    setShowTemplateSelector(false);
    navigateToStep('basic_info');
  }, [navigateToStep]);

  /**
   * Sauvegarde en brouillon
   */
  const handleSaveDraft = useCallback(async () => {
    setIsSaving(true);
    try {
      // TODO: Appel GraphQL mutation pour sauvegarder en brouillon
      console.log('Saving draft:', campaignDraft);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setWizardState((prev) => ({ ...prev, hasUnsavedChanges: false }));
    } catch (error) {
      console.error('Failed to save draft:', error);
    } finally {
      setIsSaving(false);
    }
  }, [campaignDraft]);

  /**
   * Annulation avec confirmation si modifications non sauvées
   */
  const handleCancel = useCallback(() => {
    if (wizardState.hasUnsavedChanges) {
      if (confirm('Vous avez des modifications non sauvegardées. Voulez-vous vraiment quitter ?')) {
        onCancel?.() || router.push('/dashboard/campaigns');
      }
    } else {
      onCancel?.() || router.push('/dashboard/campaigns');
    }
  }, [wizardState.hasUnsavedChanges, onCancel, router]);

  /**
   * Calcul du progrès global
   */
  const calculateProgress = useCallback(() => {
    const requiredSteps = WIZARD_STEPS.filter((step) => !step.optional);
    const completedRequired = requiredSteps.filter((step) =>
      wizardState.completedSteps.includes(step.id)
    );

    return Math.round((completedRequired.length / requiredSteps.length) * 100);
  }, [wizardState.completedSteps]);

  // Marquer la fin du premier rendu
  React.useEffect(() => {
    isInitialRender.current = false;
  }, []);

  // Mémoriser les valeurs calculées pour éviter les re-renders
  const progress = useMemo(() => calculateProgress(), [calculateProgress]);
  const currentStepIndex = useMemo(
    () => WIZARD_STEPS.findIndex((step) => step.id === wizardState.currentStep),
    [wizardState.currentStep]
  );
  const currentStepConfig = useMemo(() => WIZARD_STEPS[currentStepIndex], [currentStepIndex]);

  // Affichage du sélecteur de template
  if (showTemplateSelector) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <Button variant="ghost" onClick={handleCancel} className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour aux campagnes
            </Button>

            <div className="text-center">
              <h1 className="text-3xl font-bold mb-2">
                {isEditing ? 'Modifier la campagne' : 'Créer une nouvelle campagne'}
              </h1>
              <p className="text-muted-foreground">
                Commencez avec un template ou créez depuis zéro
              </p>
            </div>
          </div>

          <TemplateSelector
            onSelectTemplate={handleTemplateSelect}
            onSkipTemplate={handleSkipTemplate}
            selectedTemplateId={templateId}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header avec navigation */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={handleCancel}
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>

              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-semibold">
                  {isEditing ? 'Modifier' : 'Créer'} une campagne
                </h1>
                {wizardState.hasUnsavedChanges && (
                  <Badge variant="outline" size="sm">
                    <Clock className="w-3 h-3 mr-1" />
                    Non sauvegardé
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={handleSaveDraft}
                disabled={isSaving || !wizardState.hasUnsavedChanges}
                size="sm"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? 'Sauvegarde...' : 'Brouillon'}
              </Button>

              <Button variant="outline" onClick={() => setIsPreviewOpen(true)} size="sm">
                <Eye className="w-4 h-4 mr-2" />
                Aperçu
              </Button>
            </div>
          </div>

          {/* Barre de progression */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Progression: {progress}%</span>
              <span className="text-sm text-muted-foreground">
                Étape {currentStepIndex + 1} sur {WIZARD_STEPS.length}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </header>

      {/* Navigation par étapes */}
      <nav className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto py-4 space-x-2">
            {WIZARD_STEPS.map((step, index) => {
              const isCompleted = wizardState.completedSteps.includes(step.id);
              const isCurrent = wizardState.currentStep === step.id;
              const isVisited = wizardState.visitedSteps.includes(step.id);
              const isDisabled = !isVisited && !isCurrent;

              return (
                <button
                  key={step.id}
                  onClick={() => !isDisabled && navigateToStep(step.id)}
                  disabled={isDisabled}
                  className={`
                    flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium
                    transition-all duration-200 whitespace-nowrap min-w-max
                    ${
                      isCurrent
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 ring-2 ring-blue-200'
                        : isCompleted
                          ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                          : isVisited
                            ? 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200'
                            : 'bg-gray-50 text-gray-400 dark:bg-gray-900 dark:text-gray-600 cursor-not-allowed'
                    }
                  `}
                >
                  <span className="text-lg">{step.icon}</span>
                  <div className="text-left">
                    <div className="flex items-center space-x-1">
                      <span>{step.title}</span>
                      {isCompleted && <CheckCircle className="w-3 h-3" />}
                      {step.optional && (
                        <Badge variant="secondary" size="sm">
                          Opt.
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs opacity-75">{step.description}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Contenu principal */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Formulaire principal */}
          <div className="lg:col-span-3">
            <Card className="p-6">
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-2xl">{currentStepConfig.icon}</span>
                  <h2 className="text-2xl font-bold">{currentStepConfig.title}</h2>
                  {currentStepConfig.optional && (
                    <Badge variant="outline" size="sm">
                      Optionnel
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground">{currentStepConfig.description}</p>
              </div>

              <CreateCampaignForm
                currentStep={wizardState.currentStep}
                campaignData={campaignDraft}
                onDataChange={handleDataChange}
                onStepComplete={markStepCompleted}
                onValidationChange={handleValidationChange}
                isEditing={isEditing}
              />
            </Card>
          </div>

          {/* Panneau latéral */}
          <div className="lg:col-span-1 space-y-6">
            {/* Actions rapides */}
            <Card className="p-4">
              <h3 className="font-semibold mb-3">Actions rapides</h3>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  onClick={() => setIsPreviewOpen(true)}
                  className="w-full justify-start"
                  size="sm"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Aperçu
                </Button>

                <Button
                  variant="outline"
                  onClick={handleSaveDraft}
                  disabled={isSaving || !wizardState.hasUnsavedChanges}
                  className="w-full justify-start"
                  size="sm"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Sauvegarder
                </Button>

                {wizardState.currentStep !== 'template' && (
                  <Button
                    variant="outline"
                    onClick={() => setShowTemplateSelector(true)}
                    className="w-full justify-start"
                    size="sm"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Changer template
                  </Button>
                )}
              </div>
            </Card>

            {/* Statut de l'étape */}
            <Card className="p-4">
              <h3 className="font-semibold mb-3">Statut</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Progression</span>
                  <span className="text-sm font-medium">{progress}%</span>
                </div>

                <div className="flex items-center space-x-2">
                  {wizardState.isValid ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-yellow-500" />
                  )}
                  <span className="text-sm">
                    {wizardState.isValid ? 'Étape valide' : 'Étape incomplète'}
                  </span>
                </div>

                {wizardState.hasUnsavedChanges && (
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <span className="text-sm">Modifications non sauvées</span>
                  </div>
                )}
              </div>
            </Card>

            {/* Aide contextuelle */}
            <Card className="p-4 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
              <h3 className="font-semibold mb-2 text-blue-900 dark:text-blue-100">💡 Astuce</h3>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                {getStepTip(wizardState.currentStep)}
              </p>
            </Card>
          </div>
        </div>

        {/* Navigation du bas */}
        <div className="mt-8 flex items-center justify-between">
          <Button variant="outline" onClick={previousStep} disabled={currentStepIndex === 0}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Précédent
          </Button>

          <div className="flex items-center space-x-2">
            {currentStepIndex === WIZARD_STEPS.length - 1 ? (
              <Button
                onClick={() => {
                  // TODO: Appel GraphQL mutation pour créer/modifier la campagne
                  console.log('Creating campaign:', campaignDraft);
                }}
                disabled={!wizardState.isValid}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                {isEditing ? 'Mettre à jour' : 'Créer la campagne'}
              </Button>
            ) : (
              <Button
                onClick={nextStep}
                disabled={!wizardState.isValid && !currentStepConfig.optional}
              >
                Suivant
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </main>

      {/* Modal d'aperçu */}
      {isPreviewOpen && (
        <PreviewPanel campaignData={campaignDraft} onClose={() => setIsPreviewOpen(false)} />
      )}
    </div>
  );
};

/**
 * Astuce contextuelle selon l'étape
 */
function getStepTip(step: WizardState['currentStep']): string {
  switch (step) {
    case 'template':
      return 'Choisissez un template pour démarrer plus rapidement, ou partez de zéro pour plus de contrôle.';
    case 'basic_info':
      return 'Un nom descriptif et un objectif clair améliorent les performances de votre campagne.';
    case 'creative':
      return "Utilisez des images de haute qualité et des textes accrocheurs pour maximiser l'engagement.";
    case 'audience':
      return 'Un ciblage précis réduit les coûts et améliore les taux de conversion.';
    case 'schedule_budget':
      return 'Programmez vos campagnes aux heures où votre audience est la plus active.';
    case 'tracking':
      return 'Les UTM et A/B tests vous permettent de mesurer et optimiser vos performances.';
    case 'review':
      return 'Vérifiez tous les détails avant la publication. Vous pourrez modifier la campagne après création.';
    default:
      return 'Suivez les étapes pour créer une campagne performante.';
  }
}
