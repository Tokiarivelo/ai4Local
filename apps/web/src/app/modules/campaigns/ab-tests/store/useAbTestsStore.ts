/**
 * A/B Tests Store
 * Zustand store for managing A/B tests state
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type {
  AbTest,
  AbTestFilters,
  AbTestPagination,
  AbTestSorting,
  CreateAbTestInput,
  UpdateAbTestInput,
  AbTestStatus,
} from '../types';
import { mockAbTests } from '../mocks/abtests.mock';

interface AbTestsState {
  // Data
  tests: AbTest[];
  selectedTestIds: string[];
  editingDraft: Partial<AbTest> | null;
  isLoading: boolean;
  error: string | null;

  // Pagination & Filters
  pagination: AbTestPagination;
  filters: AbTestFilters;
  sorting: AbTestSorting;

  // Actions - CRUD
  fetchTests: (params?: Partial<AbTestFilters>) => Promise<void>;
  createDraft: (input: CreateAbTestInput) => Promise<AbTest>;
  updateDraft: (input: UpdateAbTestInput) => Promise<AbTest>;
  deleteDraft: (id: string) => Promise<void>;

  // Actions - Lifecycle
  publish: (id: string) => Promise<void>;
  start: (id: string) => Promise<void>;
  pause: (id: string) => Promise<void>;
  resume: (id: string) => Promise<void>;
  stop: (id: string, winnerId?: string) => Promise<void>;
  archive: (id: string) => Promise<void>;

  // Actions - Bulk
  bulkStart: (ids: string[]) => Promise<void>;
  bulkPause: (ids: string[]) => Promise<void>;
  bulkArchive: (ids: string[]) => Promise<void>;

  // Actions - Selection & UI
  setSelectedTestIds: (ids: string[]) => void;
  toggleTestSelection: (id: string) => void;
  selectAll: () => void;
  clearSelection: () => void;
  setEditingDraft: (draft: Partial<AbTest> | null) => void;

  // Actions - Filters & Pagination
  setFilters: (filters: Partial<AbTestFilters>) => void;
  setPagination: (pagination: Partial<AbTestPagination>) => void;
  setSorting: (sorting: AbTestSorting) => void;
  clearFilters: () => void;

  // Utilities
  getTestById: (id: string) => AbTest | undefined;
  clearError: () => void;

  // Helper method
  updateStatus: (id: string, status: AbTestStatus, message: string) => Promise<void>;
}

const initialFilters: AbTestFilters = {
  search: '',
  status: [],
  channels: [],
  campaigns: [],
  owners: [],
  tags: [],
};

const initialPagination: AbTestPagination = {
  page: 1,
  pageSize: 20,
  total: 0,
};

const initialSorting: AbTestSorting = {
  field: 'createdAt',
  order: 'desc',
};

export const useAbTestsStore = create<AbTestsState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial State
        tests: mockAbTests,
        selectedTestIds: [],
        editingDraft: null,
        isLoading: false,
        error: null,
        pagination: { ...initialPagination, total: mockAbTests.length },
        filters: initialFilters,
        sorting: initialSorting,

        // CRUD Actions
        fetchTests: async (params) => {
          set({ isLoading: true, error: null });
          try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 500));

            const filters = { ...get().filters, ...params };
            let filteredTests = [...mockAbTests];

            // Apply filters
            if (filters.search) {
              const search = filters.search.toLowerCase();
              filteredTests = filteredTests.filter(
                (test) =>
                  test.name.toLowerCase().includes(search) ||
                  test.campaignName.toLowerCase().includes(search)
              );
            }

            if (filters.status.length > 0) {
              filteredTests = filteredTests.filter((test) => filters.status.includes(test.status));
            }

            if (filters.channels.length > 0) {
              filteredTests = filteredTests.filter((test) =>
                filters.channels.includes(test.channel)
              );
            }

            set({
              tests: filteredTests,
              pagination: { ...get().pagination, total: filteredTests.length },
              isLoading: false,
            });
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Failed to fetch tests',
              isLoading: false,
            });
          }
        },

        createDraft: async (input) => {
          set({ isLoading: true, error: null });
          try {
            const newTest: AbTest = {
              id: `test-${Date.now()}`,
              ...input,
              campaignName: `Campaign ${input.campaignId}`,
              status: 'draft',
              variants: input.variants.map((v, idx) => ({
                ...v,
                id: `variant-${Date.now()}-${idx}`,
              })),
              createdBy: 'current-user',
              createdAt: new Date(),
              updatedAt: new Date(),
            };

            set((state) => ({
              tests: [newTest, ...state.tests],
              pagination: { ...state.pagination, total: state.pagination.total + 1 },
              isLoading: false,
            }));

            return newTest;
          } catch (error) {
            const errorMsg = error instanceof Error ? error.message : 'Failed to create test';
            set({ error: errorMsg, isLoading: false });
            throw error;
          }
        },

        updateDraft: async (input) => {
          set({ isLoading: true, error: null });
          try {
            const { id, ...updates } = input;

            set((state) => ({
              tests: state.tests.map((test) => {
                if (test.id !== id) return test;

                // Merge updates, preserving variant IDs if variants are updated
                const updatedTest: AbTest = {
                  ...test,
                  ...updates,
                  updatedAt: new Date(),
                  variants: updates.variants
                    ? updates.variants.map((variant, idx) => ({
                        ...variant,
                        id: test.variants[idx]?.id || `variant-${Date.now()}-${idx}`,
                      }))
                    : test.variants,
                };

                return updatedTest;
              }),
              isLoading: false,
            }));

            const updated = get().tests.find((t) => t.id === id);
            if (!updated) throw new Error('Test not found');

            return updated;
          } catch (error) {
            const errorMsg = error instanceof Error ? error.message : 'Failed to update test';
            set({ error: errorMsg, isLoading: false });
            throw error;
          }
        },

        deleteDraft: async (id) => {
          set({ isLoading: true, error: null });
          try {
            set((state) => ({
              tests: state.tests.filter((t) => t.id !== id),
              selectedTestIds: state.selectedTestIds.filter((tid) => tid !== id),
              pagination: { ...state.pagination, total: state.pagination.total - 1 },
              isLoading: false,
            }));
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Failed to delete test',
              isLoading: false,
            });
            throw error;
          }
        },

        // Lifecycle Actions
        publish: async (id) => {
          await get().updateStatus(id, 'draft', 'Test published');
        },

        start: async (id) => {
          set({ isLoading: true, error: null });
          try {
            set((state) => ({
              tests: state.tests.map((test) =>
                test.id === id
                  ? { ...test, status: 'running' as AbTestStatus, startDate: new Date() }
                  : test
              ),
              isLoading: false,
            }));
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Failed to start test',
              isLoading: false,
            });
            throw error;
          }
        },

        pause: async (id) => {
          await get().updateStatus(id, 'paused', 'Test paused');
        },

        resume: async (id) => {
          await get().updateStatus(id, 'running', 'Test resumed');
        },

        stop: async (id, winnerId) => {
          set({ isLoading: true, error: null });
          try {
            set((state) => ({
              tests: state.tests.map((test) =>
                test.id === id
                  ? {
                      ...test,
                      status: 'completed' as AbTestStatus,
                      endDate: new Date(),
                      winner: winnerId,
                    }
                  : test
              ),
              isLoading: false,
            }));
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Failed to stop test',
              isLoading: false,
            });
            throw error;
          }
        },

        archive: async (id) => {
          await get().updateStatus(id, 'archived', 'Test archived');
        },

        // Bulk Actions
        bulkStart: async (ids) => {
          for (const id of ids) {
            await get().start(id);
          }
        },

        bulkPause: async (ids) => {
          for (const id of ids) {
            await get().pause(id);
          }
        },

        bulkArchive: async (ids) => {
          for (const id of ids) {
            await get().archive(id);
          }
        },

        // Selection & UI
        setSelectedTestIds: (ids) => set({ selectedTestIds: ids }),

        toggleTestSelection: (id) =>
          set((state) => ({
            selectedTestIds: state.selectedTestIds.includes(id)
              ? state.selectedTestIds.filter((tid) => tid !== id)
              : [...state.selectedTestIds, id],
          })),

        selectAll: () =>
          set((state) => ({
            selectedTestIds: state.tests.map((t) => t.id),
          })),

        clearSelection: () => set({ selectedTestIds: [] }),

        setEditingDraft: (draft) => set({ editingDraft: draft }),

        // Filters & Pagination
        setFilters: (filters) =>
          set((state) => ({
            filters: { ...state.filters, ...filters },
          })),

        setPagination: (pagination) =>
          set((state) => ({
            pagination: { ...state.pagination, ...pagination },
          })),

        setSorting: (sorting) => set({ sorting }),

        clearFilters: () =>
          set({
            filters: initialFilters,
            pagination: { ...initialPagination, total: get().tests.length },
          }),

        // Utilities
        getTestById: (id) => get().tests.find((t) => t.id === id),

        clearError: () => set({ error: null }),

        // Helper method
        updateStatus: async (id: string, status: AbTestStatus, message: string) => {
          set({ isLoading: true, error: null });
          try {
            set((state) => ({
              tests: state.tests.map((test) =>
                test.id === id ? { ...test, status, updatedAt: new Date() } : test
              ),
              isLoading: false,
            }));
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : message,
              isLoading: false,
            });
            throw error;
          }
        },
      }),
      {
        name: 'ab-tests-storage',
        partialize: (state) => ({
          editingDraft: state.editingDraft,
          filters: state.filters,
          sorting: state.sorting,
        }),
      }
    ),
    { name: 'AbTestsStore' }
  )
);

// Selectors
export const useTests = () => useAbTestsStore((state) => state.tests);
export const useSelectedTestIds = () => useAbTestsStore((state) => state.selectedTestIds);
export const useEditingDraft = () => useAbTestsStore((state) => state.editingDraft);
export const useIsLoading = () => useAbTestsStore((state) => state.isLoading);
export const useError = () => useAbTestsStore((state) => state.error);
export const useFilters = () => useAbTestsStore((state) => state.filters);
export const usePagination = () => useAbTestsStore((state) => state.pagination);
export const useSorting = () => useAbTestsStore((state) => state.sorting);
