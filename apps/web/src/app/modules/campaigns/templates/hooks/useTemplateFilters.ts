import { useCallback } from 'react';
import { useTemplateFiltersStore } from '../stores/templateFiltersStore';
import type { TemplateCategory, TemplateStatus } from '../types/template.types';

export function useTemplateFilters() {
  const store = useTemplateFiltersStore();

  const setSearch = useCallback(
    (search: string) => {
      store.setSearch(search);
    },
    [store]
  );

  const toggleCategory = useCallback(
    (category: TemplateCategory) => {
      store.toggleCategory(category);
    },
    [store]
  );

  const toggleChannel = useCallback(
    (channel: string) => {
      store.toggleChannel(channel);
    },
    [store]
  );

  const toggleStatus = useCallback(
    (status: TemplateStatus) => {
      store.toggleStatus(status);
    },
    [store]
  );

  const toggleTag = useCallback(
    (tag: string) => {
      store.toggleTag(tag);
    },
    [store]
  );

  const toggleFavoritesOnly = useCallback(() => {
    store.toggleFavoritesOnly();
  }, [store]);

  const clearFilters = useCallback(() => {
    store.clearFilters();
  }, [store]);

  return {
    setSearch,
    toggleCategory,
    toggleChannel,
    toggleStatus,
    toggleTag,
    toggleFavoritesOnly,
    clearFilters,
  };
}
