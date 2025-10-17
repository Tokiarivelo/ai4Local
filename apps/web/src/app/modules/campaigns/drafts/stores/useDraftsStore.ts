/**
 * Zustand store for Drafts module state management
 * Manages drafts list, selection, filters, editing state, and autosave
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type {
  Draft,
  DraftFilters,
  DraftPagination,
  DraftStats,
  CreateDraftPayload,
  UpdateDraftPayload,
  BulkActionPayload,
} from '../types/draft.types';

interface DraftsState {
  // Data
  drafts: Draft[];
  editingDrafts: Record<string, Draft>;
  selectedIds: string[];

  // UI State
  filters: DraftFilters;
  pagination: DraftPagination;
  stats: DraftStats | null;
  isLoading: boolean;
  error: string | null;

  // Autosave
  autosaveQueue: Set<string>;
  lastAutosave: Record<string, string>;

  // Actions
  fetchDrafts: (params?: Partial<DraftFilters>) => Promise<void>;
  createDraft: (payload: CreateDraftPayload) => Promise<Draft>;
  updateDraft: (id: string, payload: UpdateDraftPayload) => Promise<void>;
  duplicateDraft: (id: string) => Promise<Draft>;
  publishDraft: (id: string) => Promise<void>;
  deleteDraft: (id: string) => Promise<void>;
  bulkAction: (payload: BulkActionPayload) => Promise<void>;

  // Selection
  setSelectedIds: (ids: string[]) => void;
  toggleSelection: (id: string) => void;
  selectAll: () => void;
  clearSelection: () => void;

  // Filters
  setFilters: (filters: Partial<DraftFilters>) => void;
  clearFilters: () => void;

  // Editing
  startEditing: (draft: Draft) => void;
  updateEditingDraft: (id: string, updates: Partial<Draft>) => void;
  clearEditingDraft: (id: string) => void;
  getEditingDraft: (id: string) => Draft | undefined;

  // Autosave
  autosaveDraft: (id: string, draft: Draft) => void;
  processAutosaveQueue: () => Promise<void>;

  // Stats
  fetchStats: () => Promise<void>;

  // Pagination
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;

  // Utils
  getDraftById: (id: string) => Draft | undefined;
  reset: () => void;
}

const initialFilters: DraftFilters = {
  search: '',
  channels: [],
  status: [],
  owners: [],
  tags: [],
};

const initialPagination: DraftPagination = {
  page: 1,
  pageSize: 20,
  total: 0,
  totalPages: 0,
};

export const useDraftsStore = create<DraftsState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial State
        drafts: [],
        editingDrafts: {},
        selectedIds: [],
        filters: initialFilters,
        pagination: initialPagination,
        stats: null,
        isLoading: false,
        error: null,
        autosaveQueue: new Set(),
        lastAutosave: {},

        // Fetch Drafts
        fetchDrafts: async (params) => {
          set({ isLoading: true, error: null });
          try {
            // Mock API call - replace with actual API
            await new Promise((resolve) => setTimeout(resolve, 500));

            const { filters, pagination } = get();
            const mergedFilters = { ...filters, ...params };

            // Simulate filtering (replace with actual API call)
            let filtered = get().drafts;

            if (mergedFilters.search) {
              const search = mergedFilters.search.toLowerCase();
              filtered = filtered.filter(
                (d) =>
                  d.title.toLowerCase().includes(search) || d.body.toLowerCase().includes(search)
              );
            }

            if (mergedFilters.channels.length > 0) {
              filtered = filtered.filter((d) => mergedFilters.channels.includes(d.channel));
            }

            if (mergedFilters.status.length > 0) {
              filtered = filtered.filter((d) => mergedFilters.status.includes(d.status));
            }

            set({
              drafts: filtered,
              filters: mergedFilters,
              pagination: {
                ...pagination,
                total: filtered.length,
                totalPages: Math.ceil(filtered.length / pagination.pageSize),
              },
              isLoading: false,
            });
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Failed to fetch drafts',
              isLoading: false,
            });
          }
        },

        // Create Draft
        createDraft: async (payload) => {
          set({ isLoading: true, error: null });
          try {
            // Mock API call
            await new Promise((resolve) => setTimeout(resolve, 300));

            const newDraft: Draft = {
              id: `draft-${Date.now()}`,
              title: payload.title,
              body: payload.body,
              channel: payload.channel,
              objective: payload.objective,
              tone: payload.tone,
              headline: payload.headline,
              cta: payload.cta,
              targetAudience: payload.targetAudience,
              keyMessage: payload.keyMessage,
              status: 'draft',
              owner: {
                id: 'user-1',
                name: 'Current User',
              },
              media: [],
              tags: payload.tags || [],
              scheduledFor: payload.scheduledFor,
              campaign: payload.campaignId
                ? {
                    id: payload.campaignId,
                    name: 'Campaign Name',
                  }
                : undefined,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              lastEditedAt: new Date().toISOString(),
              lastEditedBy: 'Current User',
              version: 1,
            };

            set((state) => ({
              drafts: [newDraft, ...state.drafts],
              isLoading: false,
            }));

            return newDraft;
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Failed to create draft',
              isLoading: false,
            });
            throw error;
          }
        },

        // Update Draft
        updateDraft: async (id, payload) => {
          set({ isLoading: true, error: null });
          try {
            await new Promise((resolve) => setTimeout(resolve, 200));

            set((state) => ({
              drafts: state.drafts.map((draft) =>
                draft.id === id
                  ? {
                      ...draft,
                      ...payload,
                      updatedAt: new Date().toISOString(),
                      lastEditedAt: new Date().toISOString(),
                      version: draft.version + 1,
                    }
                  : draft
              ),
              isLoading: false,
            }));
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Failed to update draft',
              isLoading: false,
            });
            throw error;
          }
        },

        // Duplicate Draft
        duplicateDraft: async (id) => {
          const draft = get().getDraftById(id);
          if (!draft) throw new Error('Draft not found');

          const duplicated = await get().createDraft({
            title: `${draft.title} (Copy)`,
            body: draft.body,
            channel: draft.channel,
            campaignId: draft.campaign?.id,
            tags: [...draft.tags],
            scheduledFor: draft.scheduledFor,
          });

          return duplicated;
        },

        // Publish Draft
        publishDraft: async (id) => {
          set({ isLoading: true, error: null });
          try {
            await new Promise((resolve) => setTimeout(resolve, 500));

            set((state) => ({
              drafts: state.drafts.filter((d) => d.id !== id),
              selectedIds: state.selectedIds.filter((sid) => sid !== id),
              isLoading: false,
            }));
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Failed to publish draft',
              isLoading: false,
            });
            throw error;
          }
        },

        // Delete Draft
        deleteDraft: async (id) => {
          set({ isLoading: true, error: null });
          try {
            await new Promise((resolve) => setTimeout(resolve, 200));

            set((state) => ({
              drafts: state.drafts.filter((d) => d.id !== id),
              selectedIds: state.selectedIds.filter((sid) => sid !== id),
              isLoading: false,
            }));
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Failed to delete draft',
              isLoading: false,
            });
            throw error;
          }
        },

        // Bulk Action
        bulkAction: async (payload) => {
          const { draftIds, action } = payload;

          switch (action) {
            case 'delete':
              await Promise.all(draftIds.map((id) => get().deleteDraft(id)));
              break;
            case 'publish':
              await Promise.all(draftIds.map((id) => get().publishDraft(id)));
              break;
            case 'duplicate':
              await Promise.all(draftIds.map((id) => get().duplicateDraft(id)));
              break;
            default:
              throw new Error(`Unsupported action: ${action}`);
          }
        },

        // Selection
        setSelectedIds: (ids) => set({ selectedIds: ids }),

        toggleSelection: (id) =>
          set((state) => ({
            selectedIds: state.selectedIds.includes(id)
              ? state.selectedIds.filter((sid) => sid !== id)
              : [...state.selectedIds, id],
          })),

        selectAll: () =>
          set((state) => ({
            selectedIds: state.drafts.map((d) => d.id),
          })),

        clearSelection: () => set({ selectedIds: [] }),

        // Filters
        setFilters: (filters) =>
          set((state) => ({
            filters: { ...state.filters, ...filters },
            pagination: { ...state.pagination, page: 1 },
          })),

        clearFilters: () =>
          set({
            filters: initialFilters,
            pagination: { ...initialPagination },
          }),

        // Editing
        startEditing: (draft) =>
          set((state) => ({
            editingDrafts: {
              ...state.editingDrafts,
              [draft.id]: { ...draft },
            },
          })),

        updateEditingDraft: (id, updates) =>
          set((state) => ({
            editingDrafts: {
              ...state.editingDrafts,
              [id]: {
                ...state.editingDrafts[id],
                ...updates,
                updatedAt: new Date().toISOString(),
              },
            },
            autosaveQueue: new Set([...state.autosaveQueue, id]),
          })),

        clearEditingDraft: (id) =>
          set((state) => {
            const { [id]: _, ...rest } = state.editingDrafts;
            return { editingDrafts: rest };
          }),

        getEditingDraft: (id) => get().editingDrafts[id],

        // Autosave
        autosaveDraft: (id, draft) =>
          set((state) => ({
            editingDrafts: {
              ...state.editingDrafts,
              [id]: {
                ...draft,
                status: 'auto-saved',
                autoSavedAt: new Date().toISOString(),
              },
            },
            lastAutosave: {
              ...state.lastAutosave,
              [id]: new Date().toISOString(),
            },
            autosaveQueue: new Set([...state.autosaveQueue].filter((qid) => qid !== id)),
          })),

        processAutosaveQueue: async () => {
          const { autosaveQueue, editingDrafts } = get();

          for (const id of autosaveQueue) {
            const draft = editingDrafts[id];
            if (draft) {
              await get().updateDraft(id, draft);
              get().autosaveDraft(id, draft);
            }
          }
        },

        // Stats
        fetchStats: async () => {
          try {
            const { drafts } = get();

            const byChannel = drafts.reduce((acc, draft) => {
              acc[draft.channel] = (acc[draft.channel] || 0) + 1;
              return acc;
            }, {} as Record<string, number>);

            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

            const last7Days = drafts.filter((d) => new Date(d.createdAt) >= sevenDaysAgo).length;

            const autoSaved = drafts.filter((d) => d.status === 'auto-saved').length;

            set({
              stats: {
                total: drafts.length,
                byChannel: byChannel as Record<Draft['channel'], number>,
                last7Days,
                autoSaved,
              },
            });
          } catch (error) {
            console.error('Failed to fetch stats:', error);
          }
        },

        // Pagination
        setPage: (page) =>
          set((state) => ({
            pagination: { ...state.pagination, page },
          })),

        setPageSize: (pageSize) =>
          set((state) => ({
            pagination: { ...state.pagination, pageSize, page: 1 },
          })),

        // Utils
        getDraftById: (id) => get().drafts.find((d) => d.id === id),

        reset: () =>
          set({
            drafts: [],
            editingDrafts: {},
            selectedIds: [],
            filters: initialFilters,
            pagination: initialPagination,
            stats: null,
            isLoading: false,
            error: null,
            autosaveQueue: new Set(),
            lastAutosave: {},
          }),
      }),
      {
        name: 'drafts-storage',
        partialize: (state) => ({
          editingDrafts: state.editingDrafts,
          lastAutosave: state.lastAutosave,
        }),
      }
    ),
    { name: 'DraftsStore' }
  )
);
