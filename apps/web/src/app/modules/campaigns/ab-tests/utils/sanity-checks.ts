/**
 * A/B Test Sanity Checks
 * Business rule validations
 */

import type { AbTest, Variant, CreateAbTestInput } from '../types';

export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Validate traffic split percentages
 */
export function validateTrafficSplit(variants: Variant[]): ValidationError[] {
  const errors: ValidationError[] = [];

  if (variants.length < 2) {
    errors.push({
      field: 'variants',
      message: 'At least 2 variants are required for A/B testing',
    });
    return errors;
  }

  const total = variants.reduce((sum, v) => sum + v.trafficPercentage, 0);
  if (Math.abs(total - 100) > 0.01) {
    errors.push({
      field: 'trafficSplit',
      message: `Traffic split must equal 100% (current: ${total.toFixed(1)}%)`,
    });
  }

  variants.forEach((variant, idx) => {
    if (variant.trafficPercentage < 0 || variant.trafficPercentage > 100) {
      errors.push({
        field: `variants[${idx}].trafficPercentage`,
        message: `Traffic percentage must be between 0-100%`,
      });
    }
  });

  return errors;
}

/**
 * Validate variant configuration
 */
export function validateVariant(variant: Variant, index: number): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!variant.name.trim()) {
    errors.push({
      field: `variants[${index}].name`,
      message: 'Variant name is required',
    });
  }

  if (!variant.headline.trim()) {
    errors.push({
      field: `variants[${index}].headline`,
      message: 'Headline is required',
    });
  }

  if (!variant.cta.trim()) {
    errors.push({
      field: `variants[${index}].cta`,
      message: 'Call-to-action is required',
    });
  }

  if (variant.creative.type === 'image' && !variant.creative.url) {
    errors.push({
      field: `variants[${index}].creative`,
      message: 'Image URL is required for image creatives',
    });
  }

  if (variant.creative.type === 'video' && !variant.creative.url) {
    errors.push({
      field: `variants[${index}].creative`,
      message: 'Video URL is required for video creatives',
    });
  }

  if (variant.creative.type === 'text' && !variant.creative.content) {
    errors.push({
      field: `variants[${index}].creative`,
      message: 'Text content is required for text creatives',
    });
  }

  return errors;
}

/**
 * Validate test configuration
 */
export function validateAbTest(input: CreateAbTestInput): ValidationError[] {
  const errors: ValidationError[] = [];

  // Basic validations
  if (!input.name.trim()) {
    errors.push({ field: 'name', message: 'Test name is required' });
  }

  if (input.name.length > 100) {
    errors.push({
      field: 'name',
      message: 'Test name must be less than 100 characters',
    });
  }

  if (!input.campaignId) {
    errors.push({ field: 'campaignId', message: 'Campaign is required' });
  }

  // Variant validations
  if (input.variants.length < 2) {
    errors.push({
      field: 'variants',
      message: 'At least 2 variants are required',
    });
  }

  if (input.variants.length > 10) {
    errors.push({
      field: 'variants',
      message: 'Maximum 10 variants allowed',
    });
  }

  // Validate each variant
  input.variants.forEach((variant, idx) => {
    const variantErrors = validateVariant(variant as Variant, idx);
    errors.push(...variantErrors);
  });

  // Validate traffic split
  const trafficErrors = validateTrafficSplit(input.variants as Variant[]);
  errors.push(...trafficErrors);

  // Duration validation
  if (input.duration) {
    if (input.duration < 1) {
      errors.push({
        field: 'duration',
        message: 'Test duration must be at least 1 day',
      });
    }

    if (input.duration > 90) {
      errors.push({
        field: 'duration',
        message: 'Test duration cannot exceed 90 days',
      });
    }
  }

  // Sample size validation
  if (input.sampleSize) {
    if (input.sampleSize < 100) {
      errors.push({
        field: 'sampleSize',
        message: 'Sample size must be at least 100',
      });
    }
  }

  return errors;
}

/**
 * Check if test can be started
 */
export function canStartTest(test: AbTest): { canStart: boolean; reason?: string } {
  if (test.status !== 'draft') {
    return { canStart: false, reason: 'Test must be in draft status to start' };
  }

  const errors = validateAbTest({
    name: test.name,
    campaignId: test.campaignId,
    channel: test.channel,
    variants: test.variants.map(({ id, ...rest }) => rest),
    targetMetric: test.targetMetric,
    duration: test.duration,
    sampleSize: test.sampleSize,
  });

  if (errors.length > 0) {
    return {
      canStart: false,
      reason: `Validation errors: ${errors.map((e) => e.message).join(', ')}`,
    };
  }

  return { canStart: true };
}

/**
 * Check if test can be stopped
 */
export function canStopTest(test: AbTest): { canStop: boolean; reason?: string } {
  if (test.status !== 'running' && test.status !== 'paused') {
    return { canStop: false, reason: 'Only running or paused tests can be stopped' };
  }

  return { canStop: true };
}

/**
 * Check if test has minimum sample size
 */
export function hasMinimumSampleSize(test: AbTest, minSize: number = 100): boolean {
  if (!test.metrics) return false;

  return test.metrics.every((m) => m.impressions >= minSize);
}

/**
 * Get test health status
 */
export function getTestHealthStatus(test: AbTest): {
  status: 'healthy' | 'warning' | 'error';
  issues: string[];
} {
  const issues: string[] = [];

  // Check if test is running too long
  if (test.status === 'running' && test.startDate && test.duration) {
    const daysPassed = (Date.now() - test.startDate.getTime()) / (1000 * 60 * 60 * 24);
    if (daysPassed > test.duration * 1.5) {
      issues.push('Test is running longer than planned duration');
    }
  }

  // Check variant balance
  if (test.metrics) {
    const impressions = test.metrics.map((m) => m.impressions);
    const avgImpressions = impressions.reduce((a, b) => a + b, 0) / impressions.length;
    const maxDeviation = Math.max(
      ...impressions.map((i) => Math.abs(i - avgImpressions) / avgImpressions)
    );

    if (maxDeviation > 0.2) {
      // 20% deviation
      issues.push('Uneven traffic distribution detected');
    }
  }

  // Check for stale tests
  if (test.status === 'paused' && test.updatedAt) {
    const daysSinceUpdate = (Date.now() - test.updatedAt.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceUpdate > 14) {
      issues.push('Test has been paused for over 2 weeks');
    }
  }

  if (issues.length === 0) return { status: 'healthy', issues: [] };
  if (issues.length === 1) return { status: 'warning', issues };
  return { status: 'error', issues };
}
