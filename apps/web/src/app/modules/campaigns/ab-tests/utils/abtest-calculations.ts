/**
 * A/B Test Calculations
 * Statistical calculations and winner determination logic
 */

import type { VariantMetrics, WinnerAnalysis, MetricType } from '../types';

/**
 * Calculate z-score for two proportions (simplified statistical test)
 */
function calculateZScore(p1: number, n1: number, p2: number, n2: number): number {
  const pPool = (p1 * n1 + p2 * n2) / (n1 + n2);
  const se = Math.sqrt(pPool * (1 - pPool) * (1 / n1 + 1 / n2));
  return (p1 - p2) / se;
}

/**
 * Calculate confidence level from z-score
 */
function zScoreToConfidence(zScore: number): number {
  const absZ = Math.abs(zScore);
  // Simplified approximation
  if (absZ >= 2.58) return 99; // 99% confidence
  if (absZ >= 1.96) return 95; // 95% confidence
  if (absZ >= 1.65) return 90; // 90% confidence
  if (absZ >= 1.28) return 80; // 80% confidence
  return Math.min(75, 50 + absZ * 15);
}

/**
 * Calculate statistical significance between two variants
 */
export function calculateSignificance(
  variant1: VariantMetrics,
  variant2: VariantMetrics,
  metric: MetricType
): { significant: boolean; confidence: number; zScore: number } {
  let p1: number, p2: number, n1: number, n2: number;

  switch (metric) {
    case 'ctr':
      p1 = variant1.clicks / variant1.impressions;
      p2 = variant2.clicks / variant2.impressions;
      n1 = variant1.impressions;
      n2 = variant2.impressions;
      break;

    case 'conversions':
      p1 = variant1.conversions / variant1.clicks;
      p2 = variant2.conversions / variant2.clicks;
      n1 = variant1.clicks;
      n2 = variant2.clicks;
      break;

    case 'engagement':
      // Simplified for engagement
      p1 = (variant1.engagement || 0) / 100;
      p2 = (variant2.engagement || 0) / 100;
      n1 = variant1.impressions;
      n2 = variant2.impressions;
      break;

    default:
      return { significant: false, confidence: 0, zScore: 0 };
  }

  const zScore = calculateZScore(p1, n1, p2, n2);
  const confidence = zScoreToConfidence(zScore);
  const significant = Math.abs(zScore) >= 1.96; // 95% confidence threshold

  return { significant, confidence, zScore };
}

/**
 * Determine the winner among variants
 */
export function determineWinner(
  metrics: VariantMetrics[],
  targetMetric: MetricType,
  minConfidence: number = 95
): WinnerAnalysis | null {
  if (metrics.length < 2) return null;

  // Find the best performing variant based on target metric
  let bestVariant = metrics[0];
  let bestValue = getMetricValue(bestVariant, targetMetric);

  for (const variant of metrics) {
    const value = getMetricValue(variant, targetMetric);
    if (value > bestValue) {
      bestValue = value;
      bestVariant = variant;
    }
  }

  // Compare winner against control (first variant)
  const control = metrics[0];
  if (bestVariant.variantId === control.variantId) {
    return null; // Control is winning, no clear winner yet
  }

  const significance = calculateSignificance(bestVariant, control, targetMetric);

  if (!significance.significant || significance.confidence < minConfidence) {
    return null; // Not statistically significant
  }

  const controlValue = getMetricValue(control, targetMetric);
  const improvement = ((bestValue - controlValue) / controlValue) * 100;

  return {
    winnerId: bestVariant.variantId,
    confidence: significance.confidence,
    improvement,
    significant: true,
    reason: `${improvement.toFixed(1)}% improvement in ${targetMetric} with ${
      significance.confidence
    }% confidence`,
  };
}

/**
 * Get metric value by type
 */
function getMetricValue(metrics: VariantMetrics, type: MetricType): number {
  switch (type) {
    case 'ctr':
      return metrics.ctr;
    case 'conversions':
      return metrics.conversionRate;
    case 'cpa':
      return -(metrics.cpa || 0); // Negative because lower is better
    case 'ltv':
      return metrics.ltv || 0;
    case 'engagement':
      return metrics.engagement || 0;
    default:
      return 0;
  }
}

/**
 * Calculate required sample size for test
 */
export function calculateRequiredSampleSize(
  baselineRate: number,
  mde: number, // Minimum Detectable Effect (percentage)
  confidence: number = 95,
  power: number = 80
): number {
  // Simplified sample size calculation
  const zAlpha = confidence === 95 ? 1.96 : confidence === 90 ? 1.65 : 2.58;
  const zBeta = power === 80 ? 0.84 : power === 90 ? 1.28 : 0.52;

  const p1 = baselineRate;
  const p2 = baselineRate * (1 + mde / 100);

  const numerator = Math.pow(zAlpha + zBeta, 2) * (p1 * (1 - p1) + p2 * (1 - p2));
  const denominator = Math.pow(p2 - p1, 2);

  return Math.ceil(numerator / denominator);
}

/**
 * Check if test has reached statistical significance
 */
export function hasReachedSignificance(
  metrics: VariantMetrics[],
  targetMetric: MetricType,
  minSampleSize: number = 1000
): boolean {
  if (metrics.length < 2) return false;

  // Check minimum sample size
  const hasEnoughSamples = metrics.every((m) => m.impressions >= minSampleSize);
  if (!hasEnoughSamples) return false;

  const winner = determineWinner(metrics, targetMetric);
  return winner !== null && winner.significant;
}

/**
 * Calculate test progress percentage
 */
export function calculateTestProgress(
  currentSample: number,
  targetSample: number,
  startDate: Date,
  endDate?: Date
): number {
  const sampleProgress = (currentSample / targetSample) * 100;

  if (endDate) {
    const totalDuration = endDate.getTime() - startDate.getTime();
    const elapsed = Date.now() - startDate.getTime();
    const timeProgress = (elapsed / totalDuration) * 100;

    return Math.min(100, Math.max(sampleProgress, timeProgress));
  }

  return Math.min(100, sampleProgress);
}

/**
 * Format metric value for display
 */
export function formatMetricValue(value: number, metric: MetricType): string {
  switch (metric) {
    case 'ctr':
    case 'conversions':
      return `${value.toFixed(2)}%`;
    case 'cpa':
      return `$${value.toFixed(2)}`;
    case 'ltv':
      return `$${value.toFixed(0)}`;
    case 'engagement':
      return `${value.toFixed(1)}%`;
    default:
      return value.toFixed(2);
  }
}

/**
 * Get metric display name
 */
export function getMetricDisplayName(metric: MetricType): string {
  const names: Record<MetricType, string> = {
    ctr: 'Click-Through Rate',
    conversions: 'Conversion Rate',
    cpa: 'Cost Per Acquisition',
    ltv: 'Lifetime Value',
    engagement: 'Engagement Rate',
  };
  return names[metric];
}
