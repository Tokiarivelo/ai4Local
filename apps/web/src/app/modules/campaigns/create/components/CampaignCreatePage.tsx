/**
 * Campaign Create Page - Version unifiée
 * Combine la simplicité de CampaignCreateWizard avec la structure complète
 */

'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  Save,
  CheckCircle,
  Rocket,
  Sparkles,
  Users,
  Calendar,
  BarChart,
  FileText,
  Target,
} from 'lucide-react';

import { Button } from '@/app/modules/ui/button';
import { Card } from '@/app/modules/ui/card';
import { Badge } from '@/app/modules/ui/badge';
import { Progress } from './ui/progress';

// Import des étapes du wizard
import { TemplateSelector } from './wizard/TemplateSelector';
import { TemplateStepWrapper } from './wizard/TemplateStepWrapper';
import { BasicInfoStep } from './wizard/BasicInfoStep';
import StepCreatives from './wizard/StepCreatives';
import StepAudience from './wizard/StepAudience';
import StepPlanning from './wizard/StepPlanning';
import StepTracking from './wizard/StepTracking';
import StepValidation from './wizard/StepValidation';

// Context provider et types
import { CampaignCreateProvider, useCampaignCreateContext } from '../context/WizardContext';
import type { WizardStep } from '../types';

// Configuration des étapes du wizard
const WIZARD_STEPS = [
  {
    id: 'template',
    title: 'Template',
    subtitle: 'Choisir un modèle ou partir de zéro',
    icon: FileText,
    color: 'bg-purple-500',
    component: TemplateStepWrapper,
  },
  {
    id: 'basic_info',
    title: 'Informations',
    subtitle: 'Nom, objectif et canaux',
    icon: Target,
    color: 'bg-indigo-500',
    component: BasicInfoStep,
  },
  {
    id: 'creative',
    title: 'Créatifs',
    subtitle: 'Éléments visuels et textes',
    icon: Sparkles,
    color: 'bg-blue-500',
    component: StepCreatives,
  },
  {
    id: 'audience',
    title: 'Audience',
    subtitle: 'Ciblage et segments',
    icon: Users,
    color: 'bg-green-500',
    component: StepAudience,
  },
  {
    id: 'schedule_budget',
    title: 'Planning',
    subtitle: 'Budget et calendrier',
    icon: Calendar,
    color: 'bg-purple-500',
    component: StepPlanning,
  },
  {
    id: 'tracking',
    title: 'Tracking',
    subtitle: 'UTM et A/B tests',
    icon: BarChart,
    color: 'bg-orange-500',
    component: StepTracking,
  },
  {
    id: 'review',
    title: 'Validation',
    subtitle: 'Révision finale',
    icon: CheckCircle,
    color: 'bg-red-500',
    component: StepValidation,
  },
] as const;

interface CampaignCreatePageProps {
  onComplete?: (campaignData: any) => void;
  onCancel?: () => void;
}

/**
 * Wizard Content - Logique interne avec accès au context
 */
function WizardContent({ onComplete, onCancel }: CampaignCreatePageProps) {
  const router = useRouter();
  const { currentStep, data, setCurrentStep, saveProgress, completedSteps } =
    useCampaignCreateContext();

  const [stepValidation, setStepValidation] = useState<{ [key: string]: boolean }>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  // Variables pour async validation et editing
  const onAsyncValidation = async (data: any) => {
    setIsValidating(true);
    try {
      // Logique de validation asynchrone si nécessaire
      await new Promise((resolve) => setTimeout(resolve, 300));
    } catch (error) {
      console.error('Erreur de validation:', error);
    } finally {
      setIsValidating(false);
    }
  };

  const isEditing = false; // Peut être étendu selon les besoins

  const currentStepIndex = WIZARD_STEPS.findIndex((step) => step.id === currentStep);
  const currentStepConfig = WIZARD_STEPS[currentStepIndex];
  const CurrentStepComponent = currentStepConfig?.component;

  const progress = ((currentStepIndex + 1) / WIZARD_STEPS.length) * 100;

  // Navigation functions
  const goToStep = useCallback(
    (stepId: WizardStep) => {
      setCurrentStep(stepId);
    },
    [setCurrentStep]
  );

  const goToNextStep = useCallback(() => {
    if (currentStepIndex < WIZARD_STEPS.length - 1) {
      setCurrentStep(WIZARD_STEPS[currentStepIndex + 1].id);
    }
  }, [currentStepIndex, setCurrentStep]);

  const goToPreviousStep = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStep(WIZARD_STEPS[currentStepIndex - 1].id);
    }
  }, [currentStepIndex, setCurrentStep]);

  // Validation handling
  const handleStepValidationChange = useCallback(
    (isValid: boolean) => {
      setStepValidation((prev) => ({
        ...prev,
        [currentStep]: isValid,
      }));
    },
    [currentStep]
  );

  // Save progress
  const handleSaveProgress = async () => {
    setIsSaving(true);
    try {
      await saveProgress();
      // Feedback de sauvegarde réussie
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Step completion
  const handleStepComplete = useCallback(() => {
    if (currentStepIndex === WIZARD_STEPS.length - 1) {
      // Dernière étape - finaliser la campagne
      onComplete?.(data);
    } else {
      // Passer à l'étape suivante
      goToNextStep();
    }
  }, [currentStepIndex, data, onComplete, goToNextStep]);

  // Edit handling from validation step
  const handleEditStep = useCallback(
    (stepId: string) => {
      goToStep(stepId as WizardStep);
    },
    [goToStep]
  );

  // Cancel with navigation
  const handleCancel = useCallback(() => {
    if (onCancel) {
      onCancel();
    } else {
      router.push('/dashboard/campaigns');
    }
  }, [onCancel, router]);

  const isCurrentStepValid = stepValidation[currentStep] !== false;
  const canProceed = isCurrentStepValid;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={handleCancel} className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Retour
              </Button>

              <div>
                <h1 className="text-2xl font-bold">Créer une campagne</h1>
                <p className="text-muted-foreground">{currentStepConfig?.subtitle}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSaveProgress}
                disabled={isSaving}
                className="gap-2"
              >
                <Save className="h-4 w-4" />
                {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
              </Button>

              <Badge variant="secondary">
                Étape {currentStepIndex + 1} / {WIZARD_STEPS.length}
              </Badge>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">
                Progression: {Math.round(progress)}%
              </span>
              <span className="text-sm text-muted-foreground">
                {completedSteps.length} / {WIZARD_STEPS.length} étapes complétées
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Navigation sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <h3 className="font-semibold mb-4">Étapes du wizard</h3>

              <div className="space-y-3">
                {WIZARD_STEPS.map((step, index) => {
                  const isCompleted = completedSteps.includes(step.id);
                  const isCurrent = step.id === currentStep;
                  const isAccessible =
                    index === 0 || completedSteps.includes(WIZARD_STEPS[index - 1].id);

                  return (
                    <motion.button
                      key={step.id}
                      onClick={() => isAccessible && goToStep(step.id)}
                      disabled={!isAccessible}
                      whileHover={isAccessible ? { scale: 1.02 } : {}}
                      whileTap={isAccessible ? { scale: 0.98 } : {}}
                      className={`
                        w-full text-left p-3 rounded-lg border transition-all
                        ${
                          isCurrent
                            ? 'border-primary bg-primary/5 shadow-sm'
                            : isCompleted
                              ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950'
                              : isAccessible
                                ? 'border-border hover:border-primary/50 hover:bg-muted/50'
                                : 'border-border/50 opacity-50 cursor-not-allowed'
                        }
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`
                          p-2 rounded-lg text-white text-sm
                          ${isCurrent ? step.color : isCompleted ? 'bg-green-500' : 'bg-muted'}
                        `}
                        >
                          {isCompleted ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            <step.icon className="h-4 w-4" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className={`font-medium text-sm ${isCurrent ? 'text-primary' : ''}`}>
                            {step.title}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">{step.subtitle}</p>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Summary stats */}
              <div className="mt-6 pt-4 border-t space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Progression</span>
                  <span className="font-medium">{Math.round(progress)}%</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Étapes complétées</span>
                  <span className="font-medium">
                    {completedSteps.length} / {WIZARD_STEPS.length}
                  </span>
                </div>
              </div>

              {/* Aide contextuelle */}
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
                <h4 className="font-semibold mb-2 text-blue-900 dark:text-blue-100">💡 Astuce</h4>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  {getStepTip(currentStep)}
                </p>
              </div>
            </Card>
          </div>

          {/* Main content */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-8">
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`p-2 rounded-lg text-white ${currentStepConfig?.color}`}>
                        <currentStepConfig.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold">{currentStepConfig?.title}</h2>
                        <p className="text-muted-foreground">{currentStepConfig?.subtitle}</p>
                      </div>
                    </div>
                  </div>

                  {/* Rendu uniforme pour toutes les étapes */}
                  {CurrentStepComponent ? (
                    <CurrentStepComponent
                      onComplete={handleStepComplete}
                      onValidationChange={handleStepValidationChange}
                      onEdit={currentStep === 'review' ? handleEditStep : undefined}
                      isValidating={isValidating}
                      onAsyncValidation={onAsyncValidation}
                      isEditing={isEditing}
                    />
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">
                        Composant non trouvé pour l'étape: {currentStep}
                      </p>
                    </div>
                  )}
                </Card>
              </motion.div>
            </AnimatePresence>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between mt-8">
              <Button
                variant="outline"
                onClick={goToPreviousStep}
                disabled={currentStepIndex === 0}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Précédent
              </Button>

              <div className="flex items-center gap-2">
                {currentStepIndex === WIZARD_STEPS.length - 1 ? (
                  <Button onClick={handleStepComplete} disabled={!canProceed} className="gap-2">
                    <Rocket className="h-4 w-4" />
                    Lancer la campagne
                  </Button>
                ) : (
                  <Button onClick={goToNextStep} disabled={!canProceed} className="gap-2">
                    Continuer
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Campaign Create Page - Composant principal avec provider
 */
export const CampaignCreatePage: React.FC<CampaignCreatePageProps> = (props) => {
  return (
    <CampaignCreateProvider>
      <WizardContent {...props} />
    </CampaignCreateProvider>
  );
};

/**
 * Astuce contextuelle selon l'étape
 */
function getStepTip(step: WizardStep): string {
  switch (step) {
    case 'template':
      return 'Choisissez un template pour démarrer rapidement ou créez depuis zéro pour plus de contrôle.';
    case 'basic_info':
      return 'Un nom descriptif et un objectif clair amélioreront les performances de votre campagne.';
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

export default CampaignCreatePage;
