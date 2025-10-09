/**
 * Types TypeScript pour le module Campaigns AI4Local
 * Définit toutes les interfaces et types utilisés dans le système de gestion des campagnes
 */

export type CampaignChannel = 'facebook' | 'whatsapp' | 'instagram' | 'email' | 'sms';
export type CampaignStatus =
  | 'draft'
  | 'active'
  | 'scheduled'
  | 'paused'
  | 'archived'
  | 'failed'
  | 'completed';
export type CampaignType = 'promotion' | 'awareness' | 'lead_generation' | 'traffic' | 'engagement';
export type CampaignObjective =
  | 'reach'
  | 'traffic'
  | 'engagement'
  | 'leads'
  | 'conversions'
  | 'brand_awareness';

export interface ABTestVariant {
  id: string;
  name: string;
  percentage: number;
  impressions: number;
  clicks: number;
  conversions: number;
  isControl: boolean;
}

export interface ABTest {
  enabled: boolean;
  testName: string;
  winningMetric: 'ctr' | 'conversions' | 'cost_per_conversion';
  variants: ABTestVariant[];
  confidence: number;
  winner?: string;
  status: 'running' | 'completed' | 'stopped';
  startedAt?: string;
  endedAt?: string;
}

export interface CampaignBudget {
  total: number;
  daily?: number;
  spent: number;
  currency: string;
  bidStrategy: 'lowest_cost' | 'cost_cap' | 'bid_cap' | 'target_cost';
}

export interface CampaignAudience {
  id: string;
  name: string;
  size: number;
  demographics: {
    ageMin: number;
    ageMax: number;
    genders: ('male' | 'female' | 'all')[];
    locations: string[];
  };
  interests: string[];
  behaviors: string[];
}

export interface CampaignCreative {
  id: string;
  type: 'image' | 'video' | 'carousel' | 'text' | 'collection';
  title: string;
  description: string;
  imageUrl?: string;
  videoUrl?: string;
  callToAction: string;
  linkUrl?: string;
  utmParameters?: {
    source: string;
    medium: string;
    campaign: string;
    term?: string;
    content?: string;
  };
}

export interface CampaignSchedule {
  startAt: string;
  endAt?: string;
  timezone: string;
  dayParting?: {
    enabled: boolean;
    schedule: {
      day: string;
      startHour: number;
      endHour: number;
    }[];
  };
}

export interface CampaignMetrics {
  impressions: number;
  reach: number;
  clicks: number;
  ctr: number; // Click-through rate
  conversions: number;
  conversionRate: number;
  costPerClick: number;
  costPerConversion: number;
  returnOnAdSpend: number;
  frequency: number;
}

export interface Campaign {
  id: string;
  name: string;
  description?: string;
  channel: CampaignChannel;
  status: CampaignStatus;
  type: CampaignType;
  objective: CampaignObjective;
  owner: string;
  ownerId: string;
  teamId?: string;

  // Timing
  createdAt: string;
  updatedAt: string;
  schedule: CampaignSchedule;

  // Configuration
  audience: CampaignAudience;
  creative: CampaignCreative;
  budget: CampaignBudget;

  // Performance
  metrics: CampaignMetrics;

  // Features
  abTest?: ABTest;
  templateId?: string;
  tags: string[];

  // Metadata
  metadata?: Record<string, any>;
  notes?: string;
  isArchived: boolean;
  lastActivity?: string;
}

export interface CampaignTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  channel: CampaignChannel;
  type: CampaignType;
  objective: CampaignObjective;
  thumbnailUrl: string;
  configuration: Partial<Campaign>;
  isPublic: boolean;
  createdBy: string;
  usageCount: number;
  rating: number;
  tags: string[];
}

export interface FilterOptions {
  search: string;
  status: CampaignStatus[];
  channels: CampaignChannel[];
  types: CampaignType[];
  objectives: CampaignObjective[];
  owners: string[];
  tags: string[];
  dateRange: {
    start?: string;
    end?: string;
  };
  budgetRange: {
    min?: number;
    max?: number;
  };
  performanceMetric?: 'impressions' | 'clicks' | 'conversions' | 'spend';
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export interface BulkAction {
  type: 'publish' | 'pause' | 'resume' | 'archive' | 'delete' | 'duplicate' | 'export';
  campaignIds: string[];
  parameters?: Record<string, any>;
}

export interface CampaignListProps {
  campaigns: Campaign[];
  selectedIds: string[];
  onSelect: (id: string) => void;
  onBulkSelect: (ids: string[]) => void;
  onEdit: (campaign: Campaign) => void;
  onDuplicate: (campaign: Campaign) => void;
  onStatusChange: (id: string, status: CampaignStatus) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  onSort?: (field: string) => void;
}

export interface CampaignRowProps {
  campaign: Campaign;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onEdit: (campaign: Campaign) => void;
  onDuplicate: (campaign: Campaign) => void;
  onStatusChange: (id: string, status: CampaignStatus) => void;
  onDelete: (id: string) => void;
  searchQuery?: string;
}

export interface CampaignFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  availableTags: string[];
  availableOwners: string[];
}

export interface CampaignEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaign?: Campaign;
  onSave: (campaign: Partial<Campaign>) => void;
  onSaveDraft: (campaign: Partial<Campaign>) => void;
  templates: CampaignTemplate[];
}

export interface CampaignStatsCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: React.ReactNode;
  color?: 'primary' | 'success' | 'warning' | 'error';
  chartData?: number[];
  isLoading?: boolean;
}

export interface ABTestManagerProps {
  campaign: Campaign;
  onUpdate: (abTest: ABTest) => void;
  onStop: () => void;
}

export interface CampaignQuickActionsProps {
  selectedIds: string[];
  onBulkAction: (action: BulkAction) => void;
  onClearSelection: () => void;
}

// Context types
export interface CampaignsContextValue {
  campaigns: Campaign[];
  filters: FilterOptions;
  selectedIds: string[];
  isLoading: boolean;
  error: string | null;

  // Actions
  setCampaigns: (campaigns: Campaign[]) => void;
  addCampaign: (campaign: Campaign) => void;
  updateCampaign: (id: string, updates: Partial<Campaign>) => void;
  deleteCampaign: (id: string) => void;
  setFilters: (filters: FilterOptions) => void;
  setSelectedIds: (ids: string[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Derived data
  filteredCampaigns: Campaign[];
  totalCampaigns: number;
  activeCampaigns: number;
  totalSpent: number;
  totalImpressions: number;
  averageCTR: number;
}

// API types
export interface CampaignsApiResponse {
  data: Campaign[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface CreateCampaignRequest {
  name: string;
  channel: CampaignChannel;
  type: CampaignType;
  objective: CampaignObjective;
  audience: CampaignAudience;
  creative: CampaignCreative;
  budget: CampaignBudget;
  schedule: CampaignSchedule;
  tags?: string[];
  templateId?: string;
}

export interface UpdateCampaignRequest extends Partial<CreateCampaignRequest> {
  id: string;
}

// Utility types
export type CampaignFormData = Omit<
  Campaign,
  'id' | 'createdAt' | 'updatedAt' | 'metrics' | 'isArchived'
>;
export type CampaignTableColumn =
  | 'name'
  | 'channel'
  | 'status'
  | 'startAt'
  | 'endAt'
  | 'impressions'
  | 'clicks'
  | 'conversions'
  | 'spend'
  | 'owner';

// Error types
export interface CampaignError {
  code: string;
  message: string;
  field?: string;
  details?: Record<string, any>;
}

export interface ValidationErrors {
  [key: string]: string[];
}
