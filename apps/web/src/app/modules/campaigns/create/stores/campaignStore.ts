import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type {
  BasicInfoStepData,
  CreativesStepData,
  AudienceStepData,
  PlanningStepData,
  TrackingStepData,
} from '../components/wizard/validators';

interface CampaignState {
  // Données des étapes
  template?: any;
  basicInfo?: BasicInfoStepData;
  creatives?: CreativesStepData;
  audience?: AudienceStepData;
  planning?: PlanningStepData;
  tracking?: TrackingStepData;

  // États de validation par étape
  stepValidation: Record<string, boolean>;

  // États UI
  currentStep: number;
  completedSteps: string[];

  // États de génération IA
  aiCredits: number;
  isGenerating: boolean;
  generationError: string | null;

  // Métadonnées
  lastSaved?: Date;
  isPublishing: boolean;
  publishingProgress: number;
}

interface CampaignActions {
  // Actions pour les données d'étapes
  setTemplate: (data: any) => void;
  setBasicInfo: (data: BasicInfoStepData) => void;
  setCreatives: (data: CreativesStepData) => void;
  setAudience: (data: AudienceStepData) => void;
  setPlanning: (data: PlanningStepData) => void;
  setTracking: (data: TrackingStepData) => void;

  // Actions pour la navigation
  setCurrentStep: (step: number) => void;
  completeStep: (stepId: string) => void;
  goToStep: (step: number) => void;

  // Actions pour la validation
  setStepValidation: (step: string, isValid: boolean) => void;

  // Actions pour l'IA
  setAiCredits: (credits: number) => void;
  useAiCredits: (amount: number) => void;
  setGenerating: (isGenerating: boolean) => void;
  setGenerationError: (error: string | null) => void;

  // Actions pour la publication
  setPublishing: (isPublishing: boolean) => void;
  setPublishingProgress: (progress: number) => void;

  // Actions utilitaires
  saveProgress: () => void;
  resetCampaign: () => void;
  getCampaignSummary: () => any;
  updateStepData: (stepData: Partial<CampaignState>) => void;
}

type CampaignStore = CampaignState & CampaignActions;

export const useCampaignStore = create<CampaignStore>()(
  devtools(
    persist(
      (set, get): CampaignStore => ({
        // État initial
        stepValidation: {},
        currentStep: 0,
        completedSteps: [],
        aiCredits: 10,
        isGenerating: false,
        generationError: null,
        isPublishing: false,
        publishingProgress: 0,

        // Actions pour les données d'étapes
        setTemplate: (data) => {
          set({ template: data }, false, 'setTemplate');
        },

        setBasicInfo: (data) => {
          set({ basicInfo: data }, false, 'setBasicInfo');
        },

        setCreatives: (data) => {
          set({ creatives: data }, false, 'setCreatives');
        },

        setAudience: (data) => {
          set({ audience: data }, false, 'setAudience');
        },

        setPlanning: (data) => {
          set({ planning: data }, false, 'setPlanning');
        },

        setTracking: (data) => {
          set({ tracking: data }, false, 'setTracking');
        },

        // Actions pour la navigation
        setCurrentStep: (step) => {
          set({ currentStep: step }, false, 'setCurrentStep');
        },

        completeStep: (stepId) => {
          set(
            (state) => ({
              completedSteps: state.completedSteps.includes(stepId)
                ? state.completedSteps
                : [...state.completedSteps, stepId],
            }),
            false,
            'completeStep'
          );
        },

        goToStep: (step) => {
          set({ currentStep: step }, false, 'goToStep');
        },

        // Actions pour la validation
        setStepValidation: (step, isValid) => {
          set(
            (state) => ({
              stepValidation: { ...state.stepValidation, [step]: isValid },
            }),
            false,
            'setStepValidation'
          );
        },

        // Actions pour l'IA
        setAiCredits: (credits) => {
          set({ aiCredits: credits }, false, 'setAiCredits');
        },

        useAiCredits: (amount) => {
          set(
            (state) => ({
              aiCredits: Math.max(0, state.aiCredits - amount),
            }),
            false,
            'useAiCredits'
          );
        },

        setGenerating: (isGenerating) => {
          set({ isGenerating }, false, 'setGenerating');
        },

        setGenerationError: (error) => {
          set({ generationError: error }, false, 'setGenerationError');
        },

        // Actions pour la publication
        setPublishing: (isPublishing) => {
          set({ isPublishing }, false, 'setPublishing');
        },

        setPublishingProgress: (progress) => {
          set({ publishingProgress: progress }, false, 'setPublishingProgress');
        },

        // Actions utilitaires
        saveProgress: () => {
          set({ lastSaved: new Date() }, false, 'saveProgress');
        },

        resetCampaign: () => {
          set(
            {
              template: undefined,
              basicInfo: undefined,
              creatives: undefined,
              audience: undefined,
              planning: undefined,
              tracking: undefined,
              stepValidation: {},
              currentStep: 0,
              completedSteps: [],
              isPublishing: false,
              publishingProgress: 0,
              lastSaved: undefined,
              generationError: null,
            },
            false,
            'resetCampaign'
          );
        },

        updateStepData: (stepData) => {
          set((state) => ({ ...state, ...stepData }), false, 'updateStepData');
        },

        getCampaignSummary: () => {
          const state = get();
          return {
            template: state.template,
            basicInfo: state.basicInfo,
            creatives: state.creatives,
            audience: state.audience,
            planning: state.planning,
            tracking: state.tracking,
            validation: state.stepValidation,
            currentStep: state.currentStep,
            completedSteps: state.completedSteps,
          };
        },
      }),
      {
        name: 'campaign-storage',
        version: 1,
        partialize: (state) => ({
          template: state.template,
          basicInfo: state.basicInfo,
          creatives: state.creatives,
          audience: state.audience,
          planning: state.planning,
          tracking: state.tracking,
          stepValidation: state.stepValidation,
          currentStep: state.currentStep,
          completedSteps: state.completedSteps,
          aiCredits: state.aiCredits,
          lastSaved: state.lastSaved,
        }),
      }
    ),
    { name: 'campaign-store' }
  )
);

// Hooks utilitaires pour des sélections spécifiques
export const useBasicInfo = () => useCampaignStore((state) => state.basicInfo);
export const useCreatives = () => useCampaignStore((state) => state.creatives);
export const useAudience = () => useCampaignStore((state) => state.audience);
export const usePlanning = () => useCampaignStore((state) => state.planning);
export const useTracking = () => useCampaignStore((state) => state.tracking);
export const useValidation = () => useCampaignStore((state) => state.stepValidation);

// Hooks pour la navigation
export const useCurrentStep = () => useCampaignStore((state) => state.currentStep);
export const useCompletedSteps = () => useCampaignStore((state) => state.completedSteps);

// Hooks pour l'état IA
export const useAiCredits = () => useCampaignStore((state) => state.aiCredits);
export const useIsGenerating = () => useCampaignStore((state) => state.isGenerating);
export const useGenerationError = () => useCampaignStore((state) => state.generationError);

// Sélecteur stable pour l'état IA
const aiStateSelector = (state: CampaignState) => ({
  credits: state.aiCredits,
  isGenerating: state.isGenerating,
  error: state.generationError,
});

// Hook combiné pour l'état IA avec sélecteur stable
export const useAiState = () => useCampaignStore(aiStateSelector);

// Hooks pour les actions
export const useCampaignActions = () =>
  useCampaignStore((state) => ({
    setTemplate: state.setTemplate,
    setBasicInfo: state.setBasicInfo,
    setCreatives: state.setCreatives,
    setAudience: state.setAudience,
    setPlanning: state.setPlanning,
    setTracking: state.setTracking,
    setCurrentStep: state.setCurrentStep,
    completeStep: state.completeStep,
    goToStep: state.goToStep,
    setStepValidation: state.setStepValidation,
    saveProgress: state.saveProgress,
    resetCampaign: state.resetCampaign,
    updateStepData: state.updateStepData,
  }));

// Hook pour l'état complet (à utiliser avec parcimonie)
export const useCampaignState = () =>
  useCampaignStore((state) => ({
    template: state.template,
    basicInfo: state.basicInfo,
    creatives: state.creatives,
    audience: state.audience,
    planning: state.planning,
    tracking: state.tracking,
    stepValidation: state.stepValidation,
    currentStep: state.currentStep,
    completedSteps: state.completedSteps,
  }));
