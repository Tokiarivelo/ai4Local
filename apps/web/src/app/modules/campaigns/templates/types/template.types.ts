
export type TemplateCategory =
  | 'promotion'
  | 'newsletter'
  | 'lead_generation'
  | 'retention'
  | 'event'
  | 'product_launch'
  | 'seasonal'
  | 'custom';

export type CampaignType =
  | 'promotion'
  | 'newsletter'
  | 'lead_generation'
  | 'retention'
  | 'event'
  | 'product_launch'
  | 'seasonal'
  | 'custom';

export type TemplateStatus = 'active' | 'draft' | 'archived';

export interface MediaFile {
  id?: string;
  type: 'image' | 'video';
  url?: string;
  name: string;
  size?: number;
}

export interface TemplateStructure {
  basicInfo?: {
    objective?: string;
    type?: CampaignType;
    channels?: string[];
  };
  creatives?: {
    headline?: string;
    caption?: string;
    callToAction?: string;
    mediaFiles?: MediaFile[];
  };
  audience?: {
    selectedSegments?: any[];
  };
  planning?: {
    budget?: number;
    startDate?: Date;
    endDate?: Date;
  };
  tracking?: {
    utmParameters?: Record<string, string>;
  };
}

export interface TemplateStats {
  usageCount: number;
  averageCTR?: number;
  averageConversion?: number;
  successRate?: number;
  lastUsedAt?: Date;
}

export interface Template {
  id: string;
  name: string;
  description?: string;
  category: TemplateCategory;
  status: TemplateStatus;
  thumbnail?: string;
  structure: TemplateStructure;
  tags: string[];
  channels: string[];
  stats: TemplateStats;
  isFavorite: boolean;
  isShared: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface CreateTemplateInput {
  name: string;
  description?: string;
  category: TemplateCategory;
  tags?: string[];
  structure: TemplateStructure;
  thumbnail?: string;
}

export interface UpdateTemplateInput extends Partial<CreateTemplateInput> {
  id: string;
}
