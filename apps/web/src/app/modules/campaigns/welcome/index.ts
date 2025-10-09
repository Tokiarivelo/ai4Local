/**
 * Index principal du module Campaigns
 * Exports centralisés pour l'ensemble du module
 */

// Composants principaux
export { default as CampaignsPage } from './components/CampaignsPage';
export { default as CampaignsLayout } from './components/CampaignsLayout';

// Composants de gestion
export { default as CampaignsToolbar } from './components/CampaignsToolbar';
export { default as CampaignFilters } from './components/CampaignFilters';
export { default as CampaignsStatsCards } from './components/CampaignsStatsCards';

// Composants de liste et détails
export { default as CampaignsList } from './components/CampaignsList';
export { default as CampaignRightPane } from './components/CampaignRightPane';

// Hooks
export { useCampaigns } from './hooks/useCampaigns';

// Types
export type * from './types';

// Données mock (pour développement)
export * from './mocks/campaigns.mock';
