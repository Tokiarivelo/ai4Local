/**
 * Hook principal pour la gestion des campagnes
 * État global, filtres, actions CRUD et opérations bulk
 */

'use client';

import { useState, useEffect, useReducer, useCallback, useMemo } from 'react';
import {
  mockCampaigns,
  defaultCampaignFilters,
  filterCampaigns,
  sortCampaigns,
  campaignStats,
} from '../mocks/campaigns.mock';
import type { Campaign, FilterOptions } from '../types';

// Interface pour les statistiques dynamiques
interface CampaignStats {
  total: number;
  active: number;
  scheduled: number;
  paused: number;
  completed: number;
  failed: number;
  draft: number;
  totalSpent: number;
  totalBudget: number;
  totalImpressions: number;
  totalClicks: number;
  totalConversions: number;
  averageCTR: number;
  averageConversionRate: number;
  averageCPC: number;
}

// Types pour le reducer
type CampaignAction =
  | { type: 'SET_CAMPAIGNS'; payload: Campaign[] }
  | { type: 'ADD_CAMPAIGN'; payload: Campaign }
  | { type: 'UPDATE_CAMPAIGN'; payload: { id: string; updates: Partial<Campaign> } }
  | { type: 'DELETE_CAMPAIGN'; payload: string }
  | { type: 'BULK_UPDATE'; payload: { ids: string[]; updates: Partial<Campaign> } }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

interface CampaignState {
  campaigns: Campaign[];
  loading: boolean;
  error: string | null;
}

// Reducer pour la gestion d'état
function campaignReducer(state: CampaignState, action: CampaignAction): CampaignState {
  switch (action.type) {
    case 'SET_CAMPAIGNS':
      return { ...state, campaigns: action.payload, loading: false };

    case 'ADD_CAMPAIGN':
      return {
        ...state,
        campaigns: [action.payload, ...state.campaigns],
        loading: false,
      };

    case 'UPDATE_CAMPAIGN':
      return {
        ...state,
        campaigns: state.campaigns.map((campaign) =>
          campaign.id === action.payload.id
            ? { ...campaign, ...action.payload.updates, updatedAt: new Date().toISOString() }
            : campaign
        ),
        loading: false,
      };

    case 'DELETE_CAMPAIGN':
      return {
        ...state,
        campaigns: state.campaigns.filter((campaign) => campaign.id !== action.payload),
        loading: false,
      };

    case 'BULK_UPDATE':
      return {
        ...state,
        campaigns: state.campaigns.map((campaign) =>
          action.payload.ids.includes(campaign.id)
            ? { ...campaign, ...action.payload.updates, updatedAt: new Date().toISOString() }
            : campaign
        ),
        loading: false,
      };

    case 'SET_LOADING':
      return { ...state, loading: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };

    default:
      return state;
  }
}

// État initial
const initialState: CampaignState = {
  campaigns: [],
  loading: true,
  error: null,
};

export function useCampaigns() {
  // Reducer principal
  const [state, dispatch] = useReducer(campaignReducer, initialState);

  // États locaux
  const [filters, setFilters] = useState<FilterOptions>(defaultCampaignFilters);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

  // Chargement initial des données
  useEffect(() => {
    const loadCampaigns = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });

        // Simulation d'une API call
        await new Promise((resolve) => setTimeout(resolve, 800));

        dispatch({ type: 'SET_CAMPAIGNS', payload: mockCampaigns });
        dispatch({ type: 'SET_ERROR', payload: null });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Erreur lors du chargement des campagnes' });
        console.error('Erreur chargement campagnes:', error);
      }
    };

    loadCampaigns();
  }, []);

  // Campagnes filtrées et triées (memoized)
  const filteredCampaigns = useMemo(() => {
    const filtered = filterCampaigns(state.campaigns, filters);
    return sortCampaigns(filtered, filters.sortBy, filters.sortOrder);
  }, [state.campaigns, filters]);

  // Statistiques dynamiques (memoized)
  const stats = useMemo((): CampaignStats => {
    const activeCampaigns = state.campaigns.filter((c) => c.status === 'active');

    return {
      total: state.campaigns.length,
      active: activeCampaigns.length,
      scheduled: state.campaigns.filter((c) => c.status === 'scheduled').length,
      paused: state.campaigns.filter((c) => c.status === 'paused').length,
      completed: state.campaigns.filter((c) => c.status === 'completed').length,
      failed: state.campaigns.filter((c) => c.status === 'failed').length,
      draft: state.campaigns.filter((c) => c.status === 'draft').length,

      totalSpent: state.campaigns.reduce((sum, c) => sum + c.budget.spent, 0),
      totalBudget: state.campaigns.reduce((sum, c) => sum + c.budget.total, 0),
      totalImpressions: state.campaigns.reduce((sum, c) => sum + c.metrics.impressions, 0),
      totalClicks: state.campaigns.reduce((sum, c) => sum + c.metrics.clicks, 0),
      totalConversions: state.campaigns.reduce((sum, c) => sum + c.metrics.conversions, 0),

      averageCTR:
        state.campaigns.length > 0
          ? Number(
              (
                state.campaigns.reduce((sum, c) => sum + c.metrics.ctr, 0) / state.campaigns.length
              ).toFixed(2)
            )
          : 0,
      averageConversionRate:
        state.campaigns.length > 0
          ? Number(
              (
                state.campaigns.reduce((sum, c) => sum + c.metrics.conversionRate, 0) /
                state.campaigns.length
              ).toFixed(2)
            )
          : 0,
      averageCPC:
        state.campaigns.length > 0
          ? Number(
              (
                state.campaigns.reduce((sum, c) => sum + c.metrics.costPerClick, 0) /
                state.campaigns.length
              ).toFixed(2)
            )
          : 0,
    };
  }, [state.campaigns]);

  // Actions CRUD
  const updateFilters = useCallback((newFilters: Partial<FilterOptions>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const selectCampaign = useCallback((campaign: Campaign | null) => {
    setSelectedCampaign(campaign);
  }, []);

  const createCampaign = useCallback(async (campaignData: Partial<Campaign>) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      // Génération d'un ID unique
      const newId = `camp_${Date.now()}`;
      const now = new Date().toISOString();

      const newCampaign: Campaign = {
        id: newId,
        name: campaignData.name || 'Nouvelle campagne',
        description: campaignData.description || '',
        channel: campaignData.channel || 'facebook',
        status: campaignData.status || 'draft',
        type: campaignData.type || 'promotion',
        objective: campaignData.objective || 'traffic',
        owner: campaignData.owner || 'Utilisateur actuel',
        ownerId: campaignData.ownerId || 'current_user',
        teamId: campaignData.teamId,
        createdAt: now,
        updatedAt: now,
        schedule: campaignData.schedule || {
          startAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Demain
          timezone: 'Europe/Paris',
        },
        audience: campaignData.audience || {
          id: 'temp_audience',
          name: 'Audience temporaire',
          size: 10000,
          demographics: {
            ageMin: 18,
            ageMax: 65,
            genders: ['all'],
            locations: ['France métropolitaine'],
          },
          interests: [],
          behaviors: [],
        },
        creative: campaignData.creative || {
          id: 'temp_creative',
          type: 'text',
          title: 'Titre temporaire',
          description: 'Description temporaire',
          callToAction: 'En savoir plus',
          linkUrl: 'https://ai4local.com',
        },
        budget: campaignData.budget || {
          total: 1000,
          daily: 50,
          spent: 0,
          currency: 'EUR',
          bidStrategy: 'lowest_cost',
        },
        metrics: campaignData.metrics || {
          impressions: 0,
          reach: 0,
          clicks: 0,
          ctr: 0,
          conversions: 0,
          conversionRate: 0,
          costPerClick: 0,
          costPerConversion: 0,
          returnOnAdSpend: 0,
          frequency: 0,
        },
        tags: campaignData.tags || [],
        isArchived: false,
        lastActivity: now,
      };

      // Simulation API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      dispatch({ type: 'ADD_CAMPAIGN', payload: newCampaign });
      setSelectedCampaign(newCampaign);

      return newCampaign;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Erreur lors de la création de la campagne' });
      throw error;
    }
  }, []);

  const updateCampaign = useCallback(
    async (id: string, updates: Partial<Campaign>) => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });

        // Simulation API call
        await new Promise((resolve) => setTimeout(resolve, 300));

        dispatch({ type: 'UPDATE_CAMPAIGN', payload: { id, updates } });

        // Mettre à jour la campagne sélectionnée si c'est celle-ci
        if (selectedCampaign?.id === id) {
          setSelectedCampaign((prev) => (prev ? { ...prev, ...updates } : null));
        }
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Erreur lors de la mise à jour de la campagne' });
        throw error;
      }
    },
    [selectedCampaign]
  );

  const deleteCampaign = useCallback(
    async (id: string) => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });

        // Simulation API call
        await new Promise((resolve) => setTimeout(resolve, 300));

        dispatch({ type: 'DELETE_CAMPAIGN', payload: id });

        // Déselectionner si c'était la campagne sélectionnée
        if (selectedCampaign?.id === id) {
          setSelectedCampaign(null);
        }
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Erreur lors de la suppression de la campagne' });
        throw error;
      }
    },
    [selectedCampaign]
  );

  const duplicateCampaign = useCallback(
    async (id: string) => {
      try {
        const originalCampaign = state.campaigns.find((c) => c.id === id);
        if (!originalCampaign) throw new Error('Campagne non trouvée');

        const duplicatedCampaign = {
          ...originalCampaign,
          name: `${originalCampaign.name} (Copie)`,
          status: 'draft' as const,
          metrics: {
            impressions: 0,
            reach: 0,
            clicks: 0,
            ctr: 0,
            conversions: 0,
            conversionRate: 0,
            costPerClick: 0,
            costPerConversion: 0,
            returnOnAdSpend: 0,
            frequency: 0,
          },
          budget: {
            ...originalCampaign.budget,
            spent: 0,
          },
        };

        delete (duplicatedCampaign as any).id; // Supprimer l'ID pour la création

        return await createCampaign(duplicatedCampaign);
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Erreur lors de la duplication de la campagne' });
        throw error;
      }
    },
    [state.campaigns, createCampaign]
  );

  const archiveCampaign = useCallback(
    async (id: string) => {
      try {
        await updateCampaign(id, { isArchived: true, status: 'completed' });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: "Erreur lors de l'archivage de la campagne" });
        throw error;
      }
    },
    [updateCampaign]
  );

  // Opérations bulk
  const bulkOperations = useMemo(
    () => ({
      pause: async (ids: string[]) => {
        try {
          dispatch({ type: 'SET_LOADING', payload: true });
          await new Promise((resolve) => setTimeout(resolve, 500));
          dispatch({ type: 'BULK_UPDATE', payload: { ids, updates: { status: 'paused' } } });
        } catch (error) {
          dispatch({ type: 'SET_ERROR', payload: 'Erreur lors de la pause des campagnes' });
          throw error;
        }
      },

      resume: async (ids: string[]) => {
        try {
          dispatch({ type: 'SET_LOADING', payload: true });
          await new Promise((resolve) => setTimeout(resolve, 500));
          dispatch({ type: 'BULK_UPDATE', payload: { ids, updates: { status: 'active' } } });
        } catch (error) {
          dispatch({ type: 'SET_ERROR', payload: 'Erreur lors de la reprise des campagnes' });
          throw error;
        }
      },

      archive: async (ids: string[]) => {
        try {
          dispatch({ type: 'SET_LOADING', payload: true });
          await new Promise((resolve) => setTimeout(resolve, 500));
          dispatch({
            type: 'BULK_UPDATE',
            payload: { ids, updates: { isArchived: true, status: 'completed' } },
          });
        } catch (error) {
          dispatch({ type: 'SET_ERROR', payload: "Erreur lors de l'archivage des campagnes" });
          throw error;
        }
      },

      delete: async (ids: string[]) => {
        try {
          dispatch({ type: 'SET_LOADING', payload: true });
          await new Promise((resolve) => setTimeout(resolve, 500));

          for (const id of ids) {
            dispatch({ type: 'DELETE_CAMPAIGN', payload: id });
          }

          // Déselectionner si nécessaire
          if (selectedCampaign && ids.includes(selectedCampaign.id)) {
            setSelectedCampaign(null);
          }
        } catch (error) {
          dispatch({ type: 'SET_ERROR', payload: 'Erreur lors de la suppression des campagnes' });
          throw error;
        }
      },
    }),
    [selectedCampaign]
  );

  return {
    // Données
    campaigns: state.campaigns,
    filteredCampaigns,
    filters,
    loading: state.loading,
    error: state.error,
    selectedCampaign,
    stats,

    // Actions
    updateFilters,
    selectCampaign,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    duplicateCampaign,
    archiveCampaign,
    bulkOperations,
  };
}
