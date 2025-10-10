/**
 * Schémas de validation Zod pour chaque étape du wizard de création de campagne
 * Assure la cohérence des données entre les étapes et la validation client-side
 */

import { z } from 'zod';

// Schéma pour les données de template sélectionné
export const TemplateDataSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    category: z.string(),
    objective: z.enum([
      'awareness',
      'traffic',
      'engagement',
      'leads',
      'conversions',
      'sales',
      'app_installs',
      'video_views',
    ]),
    channels: z.array(
      z.enum([
        'email',
        'sms',
        'whatsapp',
        'facebook',
        'instagram',
        'google_ads',
        'linkedin',
        'twitter',
        'youtube',
        'tiktok',
      ])
    ),
    creatives: z.array(z.any()).optional(), // Les créatifs peuvent être complexes
  })
  .nullable();

// Schéma pour l'étape Informations de base
export const BasicInfoStepSchema = z.object({
  name: z.string().min(1, 'Le nom de la campagne est requis').max(100, 'Le nom est trop long'),
  description: z.string().max(500, 'La description est trop longue').optional(),
  objective: z.enum([
    'awareness',
    'traffic',
    'engagement',
    'leads',
    'conversions',
    'sales',
    'app_installs',
    'video_views',
  ]),
  type: z.enum([
    'promotion',
    'newsletter',
    'lead_generation',
    'retention',
    'event',
    'product_launch',
    'seasonal',
  ]),
  channels: z
    .array(
      z.enum([
        'email',
        'sms',
        'whatsapp',
        'facebook',
        'instagram',
        'google_ads',
        'linkedin',
        'twitter',
        'youtube',
        'tiktok',
      ])
    )
    .min(1, 'Au moins un canal doit être sélectionné'),
});

// Schéma pour les fichiers média
export const MediaFileSchema = z.object({
  id: z.string(),
  type: z.enum(['image', 'video']),
  url: z.string().url(),
  name: z.string(),
  size: z.number().positive(),
  preview: z.string().optional(),
});

// Schéma pour l'étape Créatifs
export const CreativesStepSchema = z.object({
  headline: z.string().min(1, 'Le titre est requis').max(100, 'Le titre est trop long'),
  caption: z.string().max(500, 'La description est trop longue').optional(),
  mediaFiles: z.array(MediaFileSchema).min(1, 'Au moins un média est requis'),
  callToAction: z.string().optional(),
  aiPrompt: z.string().optional(),
});

// Schéma pour les filtres d'audience
export const AudienceFilterSchema = z.object({
  id: z.string(),
  type: z.enum(['age', 'location', 'interests', 'behavior', 'custom']),
  field: z.string(),
  operator: z.enum(['equals', 'contains', 'in', 'between', 'greater_than', 'less_than']),
  value: z.union([z.string(), z.number(), z.array(z.string()), z.array(z.number())]),
});

// Schéma pour l'étape Audience
export const AudienceStepSchema = z.object({
  selectedSegments: z.array(z.string()).min(1, 'Au moins un segment doit être sélectionné'),
  customFilters: z.array(AudienceFilterSchema).optional(),
  csvImport: z
    .object({
      fileName: z.string(),
      headers: z.array(z.string()),
      rowCount: z.number(),
      validRows: z.number(),
    })
    .optional(),
  estimatedReach: z.number().optional(),
});

// Schéma pour l'étape Planning
export const PlanningStepSchema = z
  .object({
    startDate: z.string().min(1, 'La date de début est requise'),
    endDate: z.string().min(1, 'La date de fin est requise'),
    timezone: z.string().default('Europe/Paris'),
    budget: z.number().positive('Le budget doit être positif'),
    currency: z.enum(['EUR', 'USD', 'MGA']).default('EUR'),
    isDailyBudget: z.boolean().default(false),
    estimatedReach: z.number().optional(),
  })
  .refine((data) => new Date(data.startDate) < new Date(data.endDate), {
    message: 'La date de début doit être antérieure à la date de fin',
    path: ['endDate'],
  });

// Schéma pour les paramètres UTM
export const UTMParametersSchema = z.object({
  source: z.string().min(1, 'La source UTM est requise'),
  medium: z.string().min(1, 'Le medium UTM est requis'),
  campaign: z.string().min(1, 'Le nom de campagne UTM est requis'),
  term: z.string().optional(),
  content: z.string().optional(),
});

// Schéma pour les éléments testés dans les variantes A/B
export const ABTestElementSchema = z.object({
  type: z.enum(['headline', 'description', 'cta_button', 'image', 'video', 'price', 'offer']),
  value: z.string().min(1, 'La valeur est requise'),
  description: z.string().optional(),
});

// Schéma pour les variants A/B enrichi
export const ABTestVariantSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Le nom du variant est requis'),
  percentage: z.number().min(0).max(100),
  isControl: z.boolean().default(false),
  description: z.string().optional(),
  elements: z.array(ABTestElementSchema).min(1, 'Au moins un élément doit être testé'),
  expectedOutcome: z.string().optional(),
});

// Schéma pour l'étape Tracking
export const TrackingStepSchema = z
  .object({
    utmParameters: UTMParametersSchema,
    generatedUrl: z.string().optional(),
    abTestEnabled: z.boolean().default(false),
    abTestVariants: z.array(ABTestVariantSchema).optional(),
  })
  .refine(
    (data) => {
      if (data.abTestEnabled && data.abTestVariants) {
        const totalPercentage = data.abTestVariants.reduce(
          (sum, variant) => sum + variant.percentage,
          0
        );
        return totalPercentage === 100;
      }
      return true;
    },
    {
      message: 'Le total des pourcentages des variants doit être égal à 100%',
      path: ['abTestVariants'],
    }
  );

// Schéma pour la checklist de validation
export const ValidationChecklistSchema = z.object({
  visualsApproved: z.boolean(),
  budgetValidated: z.boolean(),
  audienceConfirmed: z.boolean(),
  trackingSetup: z.boolean(),
  legalCompliance: z.boolean(),
});

// Schéma pour l'étape Validation
export const ValidationStepSchema = z
  .object({
    checklist: ValidationChecklistSchema,
    notes: z.string().optional(),
    publishMode: z.enum(['draft', 'schedule', 'publish']).default('draft'),
    scheduledAt: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.publishMode === 'schedule') {
        return !!data.scheduledAt;
      }
      return true;
    },
    {
      message: 'Une date de programmation est requise pour une publication programmée',
      path: ['scheduledAt'],
    }
  );

// Schéma global du wizard
export const WizardDataSchema = z.object({
  template: TemplateDataSchema.optional(),
  basicInfo: BasicInfoStepSchema,
  creatives: CreativesStepSchema,
  audience: AudienceStepSchema,
  planning: PlanningStepSchema,
  tracking: TrackingStepSchema,
  validation: ValidationStepSchema,
});

// Types TypeScript dérivés des schémas
export type TemplateData = z.infer<typeof TemplateDataSchema>;
export type BasicInfoStepData = z.infer<typeof BasicInfoStepSchema>;
export type MediaFile = z.infer<typeof MediaFileSchema>;
export type CreativesStepData = z.infer<typeof CreativesStepSchema>;
export type AudienceFilter = z.infer<typeof AudienceFilterSchema>;
export type AudienceStepData = z.infer<typeof AudienceStepSchema>;
export type PlanningStepData = z.infer<typeof PlanningStepSchema>;
export type UTMParameters = z.infer<typeof UTMParametersSchema>;
export type ABTestElement = z.infer<typeof ABTestElementSchema>;
export type ABTestVariant = z.infer<typeof ABTestVariantSchema>;
export type TrackingStepData = z.infer<typeof TrackingStepSchema>;
export type ValidationChecklist = z.infer<typeof ValidationChecklistSchema>;
export type ValidationStepData = z.infer<typeof ValidationStepSchema>;
export type WizardData = z.infer<typeof WizardDataSchema>;
