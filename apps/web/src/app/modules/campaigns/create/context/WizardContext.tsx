/**
 * Context global pour le wizard de création de campagne
 * Gère l'état partagé entre toutes les étapes et la persistance
 */

'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { WizardData } from '../components/wizard/validators';
import type { WizardStep } from '../types';

interface WizardState {
  currentStep: WizardStep;
  data: Partial<WizardData>;
  completedSteps: WizardStep[];
  isValid: boolean;
  isDirty: boolean;
  lastSaved: string | null;
}

type WizardAction =
  | { type: 'SET_STEP'; step: WizardStep }
  | { type: 'UPDATE_DATA'; stepData: Partial<WizardData> }
  | { type: 'COMPLETE_STEP'; step: WizardStep }
  | { type: 'SET_VALIDITY'; isValid: boolean }
  | { type: 'SAVE_DRAFT' }
  | { type: 'LOAD_DRAFT'; data: WizardState };

interface WizardContextValue extends WizardState {
  setCurrentStep: (step: WizardStep) => void;
  updateStepData: (stepData: Partial<WizardData>) => void;
  completeStep: (step: WizardStep) => void;
  setStepValidity: (isValid: boolean) => void;
  saveDraft: () => void;
  saveProgress: () => Promise<void>;
  loadDraft: () => void;
  canNavigateToStep: (step: WizardStep) => boolean;
  isStepCompleted: (step: WizardStep) => boolean;
  getStepProgress: () => number;
}

const initialState: WizardState = {
  currentStep: 'template',
  data: {},
  completedSteps: [],
  isValid: false,
  isDirty: false,
  lastSaved: null,
};

function wizardReducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case 'SET_STEP':
      return {
        ...state,
        currentStep: action.step,
      };

    case 'UPDATE_DATA':
      return {
        ...state,
        data: { ...state.data, ...action.stepData },
        isDirty: true,
      };

    case 'COMPLETE_STEP':
      return {
        ...state,
        completedSteps: state.completedSteps.includes(action.step)
          ? state.completedSteps
          : [...state.completedSteps, action.step],
      };

    case 'SET_VALIDITY':
      return {
        ...state,
        isValid: action.isValid,
      };

    case 'SAVE_DRAFT':
      return {
        ...state,
        isDirty: false,
        lastSaved: new Date().toISOString(),
      };

    case 'LOAD_DRAFT':
      return action.data;

    default:
      return state;
  }
}

const WizardContext = createContext<WizardContextValue | null>(null);

export function WizardProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(wizardReducer, initialState);

  // Auto-save toutes les 30 secondes si des changements
  useEffect(() => {
    if (state.isDirty) {
      const timer = setTimeout(() => {
        saveDraft();
      }, 30000);

      return () => clearTimeout(timer);
    }
  }, [state.isDirty]);

  // Charger le brouillon au montage
  useEffect(() => {
    loadDraft();
  }, []);

  const setCurrentStep = React.useCallback((step: WizardStep) => {
    dispatch({ type: 'SET_STEP', step });
  }, []);

  const updateStepData = React.useCallback((stepData: Partial<WizardData>) => {
    dispatch({ type: 'UPDATE_DATA', stepData });
  }, []);

  const completeStep = React.useCallback((step: WizardStep) => {
    dispatch({ type: 'COMPLETE_STEP', step });
  }, []);

  const setStepValidity = React.useCallback((isValid: boolean) => {
    dispatch({ type: 'SET_VALIDITY', isValid });
  }, []);

  const saveDraft = React.useCallback(() => {
    try {
      localStorage.setItem('campaign-wizard-draft', JSON.stringify(state));
      dispatch({ type: 'SAVE_DRAFT' });
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  }, [state]);

  const saveProgress = React.useCallback(async (): Promise<void> => {
    try {
      // Simulation d'une sauvegarde API
      await new Promise((resolve) => setTimeout(resolve, 500));
      localStorage.setItem('campaign-wizard-draft', JSON.stringify(state));
      dispatch({ type: 'SAVE_DRAFT' });
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      throw error;
    }
  }, [state]);

  const loadDraft = React.useCallback(() => {
    try {
      const saved = localStorage.getItem('campaign-wizard-draft');
      if (saved) {
        const parsedData = JSON.parse(saved);
        dispatch({ type: 'LOAD_DRAFT', data: parsedData });
      }
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    }
  }, []);

  const canNavigateToStep = React.useCallback(
    (step: WizardStep): boolean => {
      const stepOrder: WizardStep[] = [
        'basic_info',
        'creative',
        'audience',
        'schedule_budget',
        'tracking',
        'review',
      ];
      const currentIndex = stepOrder.indexOf(state.currentStep);
      const targetIndex = stepOrder.indexOf(step);

      // Peut naviguer vers les étapes précédentes ou la suivante immédiate
      return targetIndex <= currentIndex + 1;
    },
    [state.currentStep]
  );

  const isStepCompleted = React.useCallback(
    (step: WizardStep): boolean => {
      return state.completedSteps.includes(step);
    },
    [state.completedSteps]
  );

  const getStepProgress = React.useCallback((): number => {
    const totalSteps = 6; // basic_info, creative, audience, schedule_budget, tracking, review
    return Math.round((state.completedSteps.length / totalSteps) * 100);
  }, [state.completedSteps]);

  const value = React.useMemo(
    (): WizardContextValue => ({
      ...state,
      setCurrentStep,
      updateStepData,
      completeStep,
      setStepValidity,
      saveDraft,
      saveProgress,
      loadDraft,
      canNavigateToStep,
      isStepCompleted,
      getStepProgress,
    }),
    [
      state,
      setCurrentStep,
      updateStepData,
      completeStep,
      setStepValidity,
      saveDraft,
      saveProgress,
      loadDraft,
      canNavigateToStep,
      isStepCompleted,
      getStepProgress,
    ]
  );

  return <WizardContext.Provider value={value}>{children}</WizardContext.Provider>;
}

export function useCampaignCreateContext() {
  const context = useContext(WizardContext);
  if (!context) {
    throw new Error('useCampaignCreateContext doit être utilisé dans un WizardProvider');
  }
  return context;
}

// Alias pour le provider
export const CampaignCreateProvider = WizardProvider;
