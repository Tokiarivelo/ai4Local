/**
 * Campaign Drafts Types
 */

import type { CampaignChannel, CampaignObjective, CommunicationTone } from '../../create/types';

export type { CampaignChannel } from '../../create/types';

export type DraftStatus =
  | 'draft'
  | 'in-review'
  | 'approved'
  | 'rejected'
  | 'auto-saved'
  | 'scheduled';

export interface DraftMedia {
  id: string;
  type: 'image' | 'video' | 'document';
  url: string;
  thumbnail?: string;
  name: string;
  size?: number;
  mimeType?: string;
}

export interface DraftOwner {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
}

export interface DraftCampaign {
  id: string;
  name: string;
}

export interface Draft {
  id: string;
  title: string;
  body: string;
  channel: CampaignChannel;

  // Extended fields
  objective?: CampaignObjective;
  tone?: CommunicationTone;
  headline?: string;
  cta?: string;
  targetAudience?: string;
  keyMessage?: string;

  // Metadata
  status: DraftStatus;
  tags: string[];
  media: DraftMedia[];
  owner: DraftOwner;
  campaign?: DraftCampaign;

  // Scheduling
  scheduledFor?: string;

  // Timestamps
  createdAt: string;
  updatedAt: string;
  lastEditedAt: string;
  lastEditedBy: string;
  autoSavedAt?: string;

  // Versioning
  version: number;
}

export interface CreateDraftPayload {
  title: string;
  body: string;
  channel: CampaignChannel;
  objective?: CampaignObjective;
  tone?: CommunicationTone;
  headline?: string;
  cta?: string;
  campaignId?: string;
  tags?: string[];
  scheduledFor?: string;
  targetAudience?: string;
  keyMessage?: string;
}

export interface UpdateDraftPayload extends Partial<Omit<Draft, 'id' | 'createdAt' | 'owner'>> {}

export interface DraftFilters {
  search?: string;
  channels: CampaignChannel[];
  status: DraftStatus[];
  owners: string[];
  tags: string[];
  dateFrom?: string;
  dateTo?: string;
}

export interface DraftPagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface DraftStats {
  total: number;
  byChannel: Record<CampaignChannel, number>;
  last7Days: number;
  autoSaved: number;
}

export interface BulkActionPayload {
  draftIds: string[];
  action: 'delete' | 'publish' | 'duplicate' | 'archive';
}

export interface DraftsSorting {
  field: 'title' | 'createdAt' | 'updatedAt' | 'channel' | 'status';
  order: 'asc' | 'desc';
}
