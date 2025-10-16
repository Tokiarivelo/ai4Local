/**
 * A/B Tests Module - Type Definitions
 * Core types for A/B testing functionality
 */

export type AbTestStatus = 'draft' | 'running' | 'paused' | 'completed' | 'archived';

export type Channel = 'email' | 'sms' | 'push' | 'web' | 'social';

export type MetricType = 'ctr' | 'conversions' | 'cpa' | 'ltv' | 'engagement';

export interface Variant {
  id: string;
  name: string;
  trafficPercentage: number;
  creative: {
    type: 'image' | 'video' | 'text';
    url?: string;
    content?: string;
  };
  headline: string;
  cta: string;
  description?: string;
}

export interface VariantMetrics {
  variantId: string;
  impressions: number;
  clicks: number;
  conversions: number;
  ctr: number;
  conversionRate: number;
  cpa?: number;
  ltv?: number;
  engagement?: number;
  confidence?: number;
}

export interface AbTest {
  id: string;
  name: string;
  description?: string;
  campaignId: string;
  campaignName: string;
  channel: Channel;
  status: AbTestStatus;
  variants: Variant[];
  targetMetric: MetricType;
  startDate?: Date;
  endDate?: Date;
  duration?: number; // in days
  sampleSize?: number;
  winner?: string; // variantId
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  metrics?: VariantMetrics[];
  tags?: string[];
}

export interface CreateAbTestInput {
  name: string;
  description?: string;
  campaignId: string;
  channel: Channel;
  variants: Omit<Variant, 'id'>[];
  targetMetric: MetricType;
  duration?: number;
  sampleSize?: number;
  tags?: string[];
}

export interface UpdateAbTestInput extends Partial<CreateAbTestInput> {
  id: string;
}

export interface AbTestFilters {
  search: string;
  status: AbTestStatus[];
  channels: Channel[];
  dateRange?: {
    from?: Date;
    to?: Date;
  };
  campaigns: string[];
  owners: string[];
  tags: string[];
}

export interface AbTestPagination {
  page: number;
  pageSize: number;
  total: number;
}

export interface AbTestSorting {
  field: 'name' | 'createdAt' | 'startDate' | 'status' | 'performance';
  order: 'asc' | 'desc';
}

export interface WinnerAnalysis {
  winnerId: string;
  confidence: number;
  improvement: number;
  significant: boolean;
  reason: string;
}
