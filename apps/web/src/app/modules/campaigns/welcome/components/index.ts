/**
 * Index des composants campagnes
 * Exports pour faciliter les imports
 */

// Composants principaux
export { default as CampaignsLayout } from './CampaignsLayout';
export { default as CampaignsPage } from './CampaignsPage';

// Composants de gestion
export { default as CampaignsToolbar } from './CampaignsToolbar';
export { default as CampaignFilters } from './CampaignFilters';
export { default as CampaignsStatsCards } from './CampaignsStatsCards';

// Composants de liste
export { default as CampaignsList } from './CampaignsList';
export { default as CampaignRightPane } from './CampaignRightPane';

// Types
export type { Campaign, FilterOptions } from '../types';
