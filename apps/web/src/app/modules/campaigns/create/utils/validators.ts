/**
 * Schémas de validation Zod pour la création de campagnes
 * Utilisés par React Hook Form pour la validation côté client
 */

import { z } from 'zod';
import type {
  CampaignChannel,
  CampaignObjective,
  CampaignType,
  BudgetType,
  PacingStrategy,
  Currency,
  Timezone,
} from '../types';

// Schémas de base
const campaignChannelSchema = z.enum([
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
]);

const campaignObjectiveSchema = z.enum([
  'awareness',
  'traffic',
  'engagement',
  'leads',
  'conversions',
  'sales',
  'app_installs',
  'video_views',
]);

const campaignTypeSchema = z.enum([
  'promotion',
  'newsletter',
  'lead_generation',
  'retention',
  'event',
  'product_launch',
  'seasonal',
]);

const budgetTypeSchema = z.enum(['daily', 'lifetime']);
const pacingStrategySchema = z.enum(['standard', 'accelerated']);
const currencySchema = z.enum(['EUR', 'USD', 'MGA']);
const timezoneSchema = z.enum(['Europe/Paris', 'Indian/Antananarivo', 'UTC']);

// Schémas pour les créatifs
const creativeSchema = z.object({
  id: z.string().min(1, 'ID requis'),
  type: z.enum(['image', 'video', 'carousel', 'text']),
  url: z.string().url('URL invalide').optional(),
  thumbnail: z.string().url('URL de miniature invalide').optional(),
  title: z.string().min(1, 'Titre requis').max(100, 'Titre trop long'),
  description: z.string().max(500, 'Description trop longue').optional(),
  callToAction: z.string().max(30, 'CTA trop long').optional(),
  alt: z.string().max(200, 'Texte alternatif trop long').optional(),
  dimensions: z
    .object({
      width: z.number().positive('Largeur doit être positive'),
      height: z.number().positive('Hauteur doit être positive'),
    })
    .optional(),
  fileSize: z.number().positive('Taille de fichier invalide').optional(),
  duration: z.number().positive('Durée invalide').optional(),
});

// Schémas pour l'audience
const audienceFilterSchema = z.object({
  type: z.enum(['location', 'age', 'gender', 'interests', 'behavior', 'custom']),
  field: z.string().min(1, 'Champ requis'),
  operator: z.enum(['equals', 'contains', 'in', 'between', 'greater_than', 'less_than']),
  value: z.union([z.string(), z.number(), z.array(z.string()), z.array(z.number())]),
});

const csvImportSchema = z.object({
  file: z.instanceof(File),
  headers: z.array(z.string()).min(1, 'Au moins un en-tête requis'),
  preview: z.array(z.record(z.any())),
  mapping: z.record(z.string()),
  validRows: z.number().min(0),
  invalidRows: z.number().min(0),
});

// Schémas pour le budget
const budgetSchema = z
  .object({
    type: budgetTypeSchema,
    amount: z.number().positive('Montant doit être positif').min(1, 'Montant minimum : 1€'),
    dailyAmount: z.number().positive('Montant journalier doit être positif').optional(),
    currency: currencySchema,
    pacingStrategy: pacingStrategySchema,
    spendCap: z.number().positive('Plafond doit être positif').optional(),
  })
  .refine(
    (data) => {
      if (data.type === 'daily' && !data.dailyAmount) {
        return false;
      }
      if (data.spendCap && data.spendCap < data.amount) {
        return false;
      }
      return true;
    },
    {
      message: 'Configuration budget invalide',
      path: ['amount'],
    }
  );

// Schémas pour la planification
const scheduleSchema = z
  .object({
    startAt: z.string().datetime('Date de début invalide'),
    endAt: z.string().datetime('Date de fin invalide').optional(),
    timezone: timezoneSchema,
    recurring: z
      .object({
        enabled: z.boolean(),
        frequency: z.enum(['daily', 'weekly', 'monthly']),
        endDate: z.string().datetime('Date de fin récurrence invalide').optional(),
      })
      .optional(),
  })
  .refine(
    (data) => {
      if (data.endAt) {
        const start = new Date(data.startAt);
        const end = new Date(data.endAt);
        return end > start;
      }
      return true;
    },
    {
      message: 'La date de fin doit être après la date de début',
      path: ['endAt'],
    }
  );

// Schémas pour le tracking
const utmParametersSchema = z.object({
  source: z.string().min(1, 'Source UTM requise').max(50, 'Source trop longue'),
  medium: z.string().min(1, 'Medium UTM requis').max(50, 'Medium trop long'),
  campaign: z.string().min(1, 'Campagne UTM requise').max(50, 'Campagne trop longue'),
  term: z.string().max(50, 'Terme trop long').optional(),
  content: z.string().max(50, 'Contenu trop long').optional(),
});

const trackingConfigSchema = z.object({
  utm: utmParametersSchema,
  pixelTracking: z.boolean(),
  conversionTracking: z.boolean(),
  customEvents: z.array(z.string()).max(10, 'Maximum 10 événements personnalisés'),
});

// Schémas pour les tests A/B
const abTestVariantSchema = z.object({
  id: z.string().min(1, 'ID requis'),
  name: z.string().min(1, 'Nom requis').max(50, 'Nom trop long'),
  creative: creativeSchema,
  trafficPercentage: z.number().min(1, 'Minimum 1%').max(100, 'Maximum 100%'),
  isControl: z.boolean(),
});

const abTestConfigSchema = z
  .object({
    enabled: z.boolean(),
    variants: z
      .array(abTestVariantSchema)
      .min(2, 'Minimum 2 variantes')
      .max(5, 'Maximum 5 variantes'),
    winningMetric: z.enum(['ctr', 'conversions', 'cost_per_conversion', 'roas']),
    duration: z.number().min(1, 'Minimum 1 jour').max(30, 'Maximum 30 jours'),
    confidenceLevel: z.union([z.literal(90), z.literal(95), z.literal(99)]),
  })
  .refine(
    (data) => {
      if (data.enabled) {
        const totalPercentage = data.variants.reduce(
          (sum, variant) => sum + variant.trafficPercentage,
          0
        );
        return totalPercentage === 100;
      }
      return true;
    },
    {
      message: 'Le total des pourcentages doit être égal à 100%',
      path: ['variants'],
    }
  );

// Schéma principal pour la création de campagne
export const createCampaignSchema = z.object({
  // Informations de base
  name: z
    .string()
    .min(1, 'Nom de campagne requis')
    .max(100, 'Nom trop long')
    .regex(/^[a-zA-Z0-9\s\-_]+$/, 'Caractères spéciaux non autorisés'),

  description: z.string().max(500, 'Description trop longue').optional(),

  objective: campaignObjectiveSchema,
  type: campaignTypeSchema,

  channels: z
    .array(campaignChannelSchema)
    .min(1, 'Au moins un canal requis')
    .max(5, 'Maximum 5 canaux'),

  // Créatifs
  creatives: z
    .array(creativeSchema)
    .min(1, 'Au moins un créatif requis')
    .max(10, 'Maximum 10 créatifs'),

  // Audience
  audienceSegments: z.array(z.string()).min(1, "Au moins un segment d'audience requis"),

  customAudience: z.array(audienceFilterSchema).optional(),
  csvImport: csvImportSchema.optional(),

  // Budget et planification
  budget: budgetSchema,
  schedule: scheduleSchema,

  // Tracking
  tracking: trackingConfigSchema,

  // Tests A/B
  abTest: abTestConfigSchema.optional(),

  // Métadonnées
  tags: z.array(z.string().max(30, 'Tag trop long')).max(10, 'Maximum 10 tags'),

  status: z.enum(['draft', 'review', 'scheduled', 'published']),

  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// Schémas pour les étapes du wizard
export const basicInfoSchema = createCampaignSchema.pick({
  name: true,
  description: true,
  objective: true,
  type: true,
  channels: true,
});

export const creativeSchema_step = createCampaignSchema.pick({
  creatives: true,
});

export const audienceSchema = createCampaignSchema.pick({
  audienceSegments: true,
  customAudience: true,
  csvImport: true,
});

export const scheduleBudgetSchema = createCampaignSchema.pick({
  budget: true,
  schedule: true,
});

export const trackingSchema = createCampaignSchema.pick({
  tracking: true,
  abTest: true,
});

export const reviewSchema = createCampaignSchema.pick({
  tags: true,
  status: true,
});

// Types inférés
export type CreateCampaignFormData = z.infer<typeof createCampaignSchema>;
export type BasicInfoFormData = z.infer<typeof basicInfoSchema>;
export type CreativeFormData = z.infer<typeof creativeSchema_step>;
export type AudienceFormData = z.infer<typeof audienceSchema>;
export type ScheduleBudgetFormData = z.infer<typeof scheduleBudgetSchema>;
export type TrackingFormData = z.infer<typeof trackingSchema>;
export type ReviewFormData = z.infer<typeof reviewSchema>;

// Utilitaires de validation
export const validateStep = (step: string, data: any) => {
  const schemas = {
    basic_info: basicInfoSchema,
    creative: creativeSchema_step,
    audience: audienceSchema,
    schedule_budget: scheduleBudgetSchema,
    tracking: trackingSchema,
    review: reviewSchema,
  };

  const schema = schemas[step as keyof typeof schemas];
  if (!schema) return { success: false, error: 'Étape inconnue' };

  return schema.safeParse(data);
};

export const validateFullCampaign = (data: any) => {
  return createCampaignSchema.safeParse(data);
};
