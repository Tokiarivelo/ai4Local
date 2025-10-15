import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type {
  TemplateFilters,
  TemplateSorting,
  ViewMode,
  SortField,
  SortDirection,
} from '../types/filter.types';
import { DEFAULT_FILTERS, DEFAULT_SORTING } from '../types/filter.types';
import type { TemplateCategory, TemplateStatus } from '../types/template.types';

interface TemplateFiltersState {
  // State
  filters: TemplateFilters;
  sorting: TemplateSorting;
  viewMode: ViewMode;

  // Actions
  setSearch: (search: string) => void;
  toggleCategory: (category: TemplateCategory) => void;
  toggleChannel: (channel: string) => void;
  toggleStatus: (status: TemplateStatus) => void;
  toggleTag: (tag: string) => void;
  toggleFavoritesOnly: () => void;
  setSorting: (field: SortField, direction?: SortDirection) => void;
  setViewMode: (mode: ViewMode) => void;
  clearFilters: () => void;
  resetFilters: () => void;
}

export const useTemplateFiltersStore = create<TemplateFiltersState>()(
  devtools(
    (set) => ({
      // Initial state
      filters: DEFAULT_FILTERS,
      sorting: DEFAULT_SORTING,
      viewMode: 'grid',

      // Actions
      setSearch: (search) =>
        set((state) => ({
          filters: { ...state.filters, search },
        })),

      toggleCategory: (category) =>
        set((state) => ({
          filters: {
            ...state.filters,
            categories: state.filters.categories.includes(category)
              ? state.filters.categories.filter((c) => c !== category)
              : [...state.filters.categories, category],
          },
        })),

      toggleChannel: (channel) =>
        set((state) => ({
          filters: {
            ...state.filters,
            channels: state.filters.channels.includes(channel)
              ? state.filters.channels.filter((c) => c !== channel)
              : [...state.filters.channels, channel],
          },
        })),

      toggleStatus: (status) =>
        set((state) => ({
          filters: {
            ...state.filters,
            status: state.filters.status.includes(status)
              ? state.filters.status.filter((s) => s !== status)
              : [...state.filters.status, status],
          },
        })),

      toggleTag: (tag) =>
        set((state) => ({
          filters: {
            ...state.filters,
            tags: state.filters.tags.includes(tag)
              ? state.filters.tags.filter((t) => t !== tag)
              : [...state.filters.tags, tag],
          },
        })),

      toggleFavoritesOnly: () =>
        set((state) => ({
          filters: {
            ...state.filters,
            showFavoritesOnly: !state.filters.showFavoritesOnly,
          },
        })),

      setSorting: (field, direction) =>
        set((state) => ({
          sorting: {
            field,
            direction:
              direction ||
              (state.sorting.field === field && state.sorting.direction === 'asc' ? 'desc' : 'asc'),
          },
        })),

      setViewMode: (mode) => set({ viewMode: mode }),

      clearFilters: () =>
        set({
          filters: DEFAULT_FILTERS,
        }),

      resetFilters: () =>
        set({
          filters: DEFAULT_FILTERS,
          sorting: DEFAULT_SORTING,
        }),
    }),
    { name: 'TemplateFiltersStore' }
  )
);

// Stable selectors
export const useFilters = () => useTemplateFiltersStore((state) => state.filters);
export const useSorting = () => useTemplateFiltersStore((state) => state.sorting);
export const useViewMode = () => useTemplateFiltersStore((state) => state.viewMode);
