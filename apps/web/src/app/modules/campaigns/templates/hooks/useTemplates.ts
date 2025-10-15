import { useMemo } from 'react';
import { useTemplatesFromStore } from '../stores/templateStore';
import { useFilters, useSorting } from '../stores/templateFiltersStore';
import { applyFilters, applySorting } from '../utils/templateHelpers';

export function useTemplates() {
  const templates = useTemplatesFromStore();
  const filters = useFilters();
  const sorting = useSorting();

  const filteredAndSortedTemplates = useMemo(() => {
    const filtered = applyFilters(templates, filters);
    const sorted = applySorting(filtered, sorting);
    return sorted;
  }, [templates, filters, sorting]);

  return filteredAndSortedTemplates;
}
