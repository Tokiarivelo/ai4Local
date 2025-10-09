/**
 * Point d'entrée principal du système de création de campagnes
 * Exporte les composants et types principaux
 */

// Composant principal
export { CampaignCreatePage } from './components/CampaignCreatePage';

// Composants secondaires
export { TemplateSelector } from './components/wizard/TemplateSelector';
export { PreviewPanel } from './components/preview/PreviewPanel';

// Types principaux
export type {
  CampaignDraft,
  WizardState,
  CampaignTemplate,
  Creative,
  AudienceSegment,
  UTMParameters,
  ABTestConfig,
} from './types';

// Données mock pour développement
export {
  mockCampaignTemplates,
  mockAudienceSegments,
  mockChannelConfig,
  mockEstimateAudience,
  mockCompressImage,
  mockCreateCampaign,
} from './mocks/campaign-create.mock';

// Utilitaires
export {
  compressImage,
  validateImageFile,
  validateVideoFile,
  sanitizeText,
  sanitizeUrl,
  formatFileSize,
} from './utils/compression.utils';
