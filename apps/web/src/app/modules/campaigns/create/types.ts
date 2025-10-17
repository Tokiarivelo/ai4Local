/**
 * Types pour la création de campagnes
 * Définit les interfaces, DTOs et enums pour le module de création
 */

import { z } from 'zod';

// Enums de base
export type CampaignChannel =
  | 'email'
  | 'sms'
  | 'whatsapp'
  | 'facebook'
  | 'instagram'
  | 'google_ads'
  | 'linkedin'
  | 'twitter'
  | 'youtube'
  | 'tiktok';

export type CampaignObjective =
  | 'awareness'
  | 'traffic'
  | 'engagement'
  | 'leads'
  | 'conversions'
  | 'sales'
  | 'app_installs'
  | 'video_views';

export type CampaignType =
  | 'promotion'
  | 'newsletter'
  | 'lead_generation'
  | 'retention'
  | 'event'
  | 'product_launch'
  | 'seasonal';

export type CommunicationTone =
  | 'professional'
  | 'friendly'
  | 'casual'
  | 'urgent'
  | 'inspirational'
  | 'humorous'
  | 'educational'
  | 'formal'
  | 'conversational';

export type BudgetType = 'daily' | 'lifetime';
export type PacingStrategy = 'standard' | 'accelerated';
export type Currency = 'EUR' | 'USD' | 'MGA';
export type Timezone = 'Europe/Paris' | 'Indian/Antananarivo' | 'UTC';

// Interfaces pour les créatifs
export interface Creative {
  id: string;
  type: 'image' | 'video' | 'carousel' | 'text';
  url?: string;
  thumbnail?: string;
  title: string;
  description?: string;
  callToAction?: string;
  alt?: string;
  dimensions?: {
    width: number;
    height: number;
  };
  fileSize?: number;
  duration?: number; // Pour les vidéos
}

// Interfaces pour l'audience
export interface AudienceSegment {
  id: string;
  name: string;
  description?: string;
  filters: AudienceFilter[];
  estimatedSize: number;
  createdAt: string;
  updatedAt: string;
}

export interface AudienceFilter {
  type: 'location' | 'age' | 'gender' | 'interests' | 'behavior' | 'custom';
  field: string;
  operator: 'equals' | 'contains' | 'in' | 'between' | 'greater_than' | 'less_than';
  value: string | number | string[] | number[];
}

export interface CSVImport {
  file: File;
  headers: string[];
  preview: Record<string, any>[];
  mapping: Record<string, string>;
  validRows: number;
  invalidRows: number;
}

// Interfaces pour le budget et la planification
export interface Budget {
  type: BudgetType;
  amount: number;
  dailyAmount?: number;
  currency: Currency;
  pacingStrategy: PacingStrategy;
  spendCap?: number;
}

export interface Schedule {
  startAt: string;
  endAt?: string;
  timezone: Timezone;
  recurring?: {
    enabled: boolean;
    frequency: 'daily' | 'weekly' | 'monthly';
    endDate?: string;
  };
}

// Interfaces pour le tracking et les UTM
export interface UTMParameters {
  source: string;
  medium: string;
  campaign: string;
  term?: string;
  content?: string;
}

export interface TrackingConfig {
  utm: UTMParameters;
  pixelTracking: boolean;
  conversionTracking: boolean;
  customEvents: string[];
}

// Interfaces pour les tests A/B
export interface ABTestVariant {
  id: string;
  name: string;
  creative: Creative;
  trafficPercentage: number;
  isControl: boolean;
}

export interface ABTestConfig {
  enabled: boolean;
  variants: ABTestVariant[];
  winningMetric: 'ctr' | 'conversions' | 'cost_per_conversion' | 'roas';
  duration: number; // en jours
  confidenceLevel: number; // 90, 95, 99
}

// Interface principale pour la création de campagne
export interface CampaignDraft {
  // Informations de base
  name: string;
  description?: string;
  objective: CampaignObjective;
  type: CampaignType;
  channels: CampaignChannel[];

  // Créatifs
  creatives: Creative[];

  // Audience
  audienceSegments: string[]; // IDs des segments existants
  customAudience?: AudienceFilter[];
  csvImport?: CSVImport;

  // Budget et planification
  budget: Budget;
  schedule: Schedule;

  // Tracking
  tracking: TrackingConfig;

  // Tests A/B
  abTest?: ABTestConfig;

  // Métadonnées
  tags: string[];
  status: 'draft' | 'review' | 'scheduled' | 'published';
  createdAt: string;
  updatedAt: string;
}

// Templates et bibliothèque
export interface CampaignTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  thumbnail: string;
  channels: CampaignChannel[];
  objective: CampaignObjective;
  creatives: Creative[];
  isPopular: boolean;
  usageCount: number;
}

// États pour le wizard - Version complète avec template et informations de base
export type WizardStep =
  | 'template'
  | 'basic_info'
  | 'creative'
  | 'audience'
  | 'schedule_budget'
  | 'tracking'
  | 'review';

export interface WizardState {
  currentStep: WizardStep;
  completedSteps: WizardStep[];
  visitedSteps: WizardStep[];
  isValid: boolean;
  hasUnsavedChanges: boolean;
}

// Réponses API mockées
export interface CreateCampaignResponse {
  success: boolean;
  campaignId: string;
  message: string;
  validationErrors?: Record<string, string[]>;
}

export interface EstimateAudienceResponse {
  estimatedSize: number;
  demographics: {
    ageGroups: Record<string, number>;
    genders: Record<string, number>;
    locations: Record<string, number>;
  };
  devices: {
    mobile: number;
    desktop: number;
    tablet: number;
  };
}

export interface CompressImageResponse {
  originalUrl: string;
  compressedUrl: string;
  thumbnail: string;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
}

// Types utilitaires
export type FormStep<T> = {
  data: Partial<T>;
  isValid: boolean;
  isDirty: boolean;
};

export type ValidationResult = {
  isValid: boolean;
  errors: Record<string, string[]>;
  warnings: Record<string, string[]>;
};

// Export des schémas Zod (seront définis dans validators.ts)
export type CreateCampaignFormData = z.infer<typeof createCampaignSchema>;

// Déclaration du schéma (implémentation dans validators.ts)
declare const createCampaignSchema: z.ZodSchema<CampaignDraft>;
