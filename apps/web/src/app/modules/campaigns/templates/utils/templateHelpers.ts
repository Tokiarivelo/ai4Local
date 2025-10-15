import type { Template } from '../types/template.types';
import type { TemplateFilters, TemplateSorting } from '../types/filter.types';

/**
 * Filter templates based on active filters
 */
export function applyFilters(templates: Template[], filters: TemplateFilters): Template[] {
  return templates.filter((template) => {
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch =
        template.name.toLowerCase().includes(searchLower) ||
        template.description?.toLowerCase().includes(searchLower) ||
        template.tags.some((tag) => tag.toLowerCase().includes(searchLower));

      if (!matchesSearch) return false;
    }

    // Category filter
    if (filters.categories.length > 0) {
      if (!filters.categories.includes(template.category)) return false;
    }

    // Channel filter
    if (filters.channels.length > 0) {
      const hasChannel = filters.channels.some((channel) => template.channels.includes(channel));
      if (!hasChannel) return false;
    }

    // Status filter
    if (filters.status.length > 0) {
      if (!filters.status.includes(template.status)) return false;
    }

    // Tags filter
    if (filters.tags.length > 0) {
      const hasTag = filters.tags.some((tag) => template.tags.includes(tag));
      if (!hasTag) return false;
    }

    // Favorites filter
    if (filters.showFavoritesOnly && !template.isFavorite) {
      return false;
    }

    return true;
  });
}

/**
 * Sort templates based on sorting configuration
 */
export function applySorting(templates: Template[], sorting: TemplateSorting): Template[] {
  const sorted = [...templates];

  sorted.sort((a, b) => {
    let comparison = 0;

    switch (sorting.field) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'createdAt':
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        break;
      case 'updatedAt':
        comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
        break;
      case 'usageCount':
        comparison = a.stats.usageCount - b.stats.usageCount;
        break;
      default:
        comparison = 0;
    }

    return sorting.direction === 'asc' ? comparison : -comparison;
  });

  return sorted;
}

/**
 * Get all unique tags from templates
 */
export function getAllTags(templates: Template[]): string[] {
  const tags = new Set<string>();
  templates.forEach((template) => {
    template.tags.forEach((tag) => tags.add(tag));
  });
  return Array.from(tags).sort();
}

/**
 * Get all unique channels from templates
 */
export function getAllChannels(templates: Template[]): string[] {
  const channels = new Set<string>();
  templates.forEach((template) => {
    template.channels.forEach((channel) => channels.add(channel));
  });
  return Array.from(channels).sort();
}

/**
 * Calculate template performance score
 */
export function calculatePerformanceScore(template: Template): number {
  const { stats } = template;
  let score = 0;

  // Usage frequency (max 30 points)
  score += Math.min(stats.usageCount * 2, 30);

  // CTR (max 25 points)
  if (stats.averageCTR) {
    score += Math.min(stats.averageCTR * 5, 25);
  }

  // Conversion rate (max 25 points)
  if (stats.averageConversion) {
    score += Math.min(stats.averageConversion * 2.5, 25);
  }

  // Success rate (max 20 points)
  if (stats.successRate) {
    score += Math.min(stats.successRate / 5, 20);
  }

  return Math.round(score);
}

/**
 * Format template date
 */
export function formatTemplateDate(date: Date): string {
  const now = new Date();
  const diffInMs = now.getTime() - new Date(date).getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return "Aujourd'hui";
  if (diffInDays === 1) return 'Hier';
  if (diffInDays < 7) return `Il y a ${diffInDays} jours`;
  if (diffInDays < 30) return `Il y a ${Math.floor(diffInDays / 7)} semaines`;
  if (diffInDays < 365) return `Il y a ${Math.floor(diffInDays / 30)} mois`;
  return `Il y a ${Math.floor(diffInDays / 365)} ans`;
}

/**
 * Get category label
 */
export function getCategoryLabel(category: Template['category']): string {
  const labels: Record<Template['category'], string> = {
    promotion: 'Promotion',
    newsletter: 'Newsletter',
    lead_generation: 'Génération de leads',
    retention: 'Rétention',
    event: 'Événement',
    product_launch: 'Lancement produit',
    seasonal: 'Saisonnier',
    custom: 'Personnalisé',
  };
  return labels[category];
}

/**
 * Get status label and color
 */
export function getStatusConfig(status: Template['status']): {
  label: string;
  color: string;
  bgColor: string;
} {
  const configs = {
    active: {
      label: 'Actif',
      color: 'text-green-700 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-950',
    },
    draft: {
      label: 'Brouillon',
      color: 'text-yellow-700 dark:text-yellow-400',
      bgColor: 'bg-yellow-50 dark:bg-yellow-950',
    },
    archived: {
      label: 'Archivé',
      color: 'text-gray-700 dark:text-gray-400',
      bgColor: 'bg-gray-50 dark:bg-gray-950',
    },
  };
  return configs[status];
}
