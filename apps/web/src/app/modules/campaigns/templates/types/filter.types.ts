import type { TemplateCategory, TemplateStatus } from './template.types';

export interface TemplateFilters {
  search: string;
  categories: TemplateCategory[];
  channels: string[];
  status: TemplateStatus[];
  tags: string[];
  showFavoritesOnly: boolean;
}

export type SortField = 'name' | 'createdAt' | 'updatedAt' | 'usageCount';
export type SortDirection = 'asc' | 'desc';

export interface TemplateSorting {
  field: SortField;
  direction: SortDirection;
}

export type ViewMode = 'grid' | 'list';

export const DEFAULT_FILTERS: TemplateFilters = {
  search: '',
  categories: [],
  channels: [],
  status: [],
  tags: [],
  showFavoritesOnly: false,
};

export const DEFAULT_SORTING: TemplateSorting = {
  field: 'updatedAt',
  direction: 'desc',
};
