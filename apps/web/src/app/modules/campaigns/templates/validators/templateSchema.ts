import { z } from 'zod';

const CampaignTypeEnum = z.enum([
  'promotion',
  'newsletter',
  'lead_generation',
  'retention',
  'event',
  'product_launch',
  'seasonal',
  'custom',
]);

const MediaFileSchema = z.object({
  id: z.string().optional(),
  type: z.enum(['image', 'video']),
  url: z.string().optional(),
  name: z.string(),
  size: z.number().optional(),
});

const TemplateStructureSchema = z.object({
  basicInfo: z.object({
    objective: z.string().optional(),
    type: CampaignTypeEnum.optional(),
    channels: z.array(z.string()).optional(),
  }).optional(),
  creatives: z.object({
    headline: z.string().optional(),
    caption: z.string().optional(),
    callToAction: z.string().optional(),
    mediaFiles: z.array(MediaFileSchema).optional(),
  }).optional(),
  audience: z.object({
    selectedSegments: z.array(z.any()).optional(),
  }).optional(),
  planning: z.object({
    budget: z.number().optional(),
    startDate: z.date().optional(),
    endDate: z.date().optional(),
  }).optional(),
  tracking: z.object({
    utmParameters: z.record(z.string()).optional(),
  }).optional(),
});

export const TemplateSchema = z.object({
  name: z.string().min(3, 'Le nom doit contenir au moins 3 caractères').max(100),
  description: z.string().max(500).optional(),
  category: CampaignTypeEnum,
  tags: z.array(z.string()).default([]),
  structure: TemplateStructureSchema,
  thumbnail: z.string().optional(),
});

export type TemplateFormData = z.infer<typeof TemplateSchema>;
