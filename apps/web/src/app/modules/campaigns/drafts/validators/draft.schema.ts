/**
 * Zod schemas and validation utilities for draft entities
 * Ensures data integrity before save/publish operations
 */

import { z } from 'zod';
import type { DraftValidationResult, DraftValidationError } from '../types/draft.types';

export const channelSchema = z.enum([
  'facebook',
  'instagram',
  'linkedin',
  'twitter',
  'google-ads',
  'email',
]);

export const draftMediaSchema = z.object({
  id: z.string(),
  type: z.enum(['image', 'video', 'document']),
  url: z.string().url(),
  thumbnail: z.string().url().optional(),
  size: z.number().positive(),
  name: z.string().min(1),
});

export const createDraftSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  body: z.string().min(1, 'Body content is required').max(5000, 'Content too long'),
  channel: channelSchema,
  campaignId: z.string().uuid().optional(),
  tags: z.array(z.string()).optional(),
  scheduledFor: z.string().datetime().optional(),
});

export const updateDraftSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  body: z.string().min(1).max(5000).optional(),
  channel: channelSchema.optional(),
  media: z.array(draftMediaSchema).optional(),
  tags: z.array(z.string()).optional(),
  scheduledFor: z.string().datetime().optional(),
  status: z.enum(['draft', 'auto-saved', 'scheduled']).optional(),
});

export const publishDraftSchema = z.object({
  title: z.string().min(1, 'Title required for publishing'),
  body: z.string().min(10, 'Body must have at least 10 characters'),
  channel: channelSchema,
  media: z.array(draftMediaSchema).min(0), // Optional but validated if present
});

/**
 * Validates a draft for publishing
 */
export function validateDraftForPublish(draft: {
  title: string;
  body: string;
  channel: string;
  media?: unknown[];
}): DraftValidationResult {
  const errors: DraftValidationError[] = [];

  try {
    publishDraftSchema.parse(draft);
    return { isValid: true, errors: [] };
  } catch (error) {
    if (error instanceof z.ZodError) {
      error.errors.forEach((err) => {
        errors.push({
          field: err.path.join('.'),
          message: err.message,
        });
      });
    }
    return { isValid: false, errors };
  }
}

/**
 * Validates create draft payload
 */
export function validateCreateDraft(payload: unknown): DraftValidationResult {
  const errors: DraftValidationError[] = [];

  try {
    createDraftSchema.parse(payload);
    return { isValid: true, errors: [] };
  } catch (error) {
    if (error instanceof z.ZodError) {
      error.errors.forEach((err) => {
        errors.push({
          field: err.path.join('.'),
          message: err.message,
        });
      });
    }
    return { isValid: false, errors };
  }
}

/**
 * Validates update draft payload
 */
export function validateUpdateDraft(payload: unknown): DraftValidationResult {
  const errors: DraftValidationError[] = [];

  try {
    updateDraftSchema.parse(payload);
    return { isValid: true, errors: [] };
  } catch (error) {
    if (error instanceof z.ZodError) {
      error.errors.forEach((err) => {
        errors.push({
          field: err.path.join('.'),
          message: err.message,
        });
      });
    }
    return { isValid: false, errors };
  }
}
