export interface KpiData {
  title: string;
  value: string | number;
  delta?: number;
  sparklineData?: number[];
  icon?: React.ReactNode;
  loading?: boolean;
  error?: string;
}

export interface ChartDataPoint {
  timestamp: number;
  value: number;
  label?: string;
}

export interface ActivityEvent {
  id: string;
  type: 'publishing' | 'error' | 'validation' | 'conversion';
  message: string;
  timestamp: number;
  status: 'success' | 'warning' | 'error' | 'info';
  metadata?: Record<string, any>;
  read?: boolean;
}

export interface RealtimeFilters {
  channels: string[];
  status: string[];
  tags: string[];
  owners: string[];
  dateRange: {
    start: Date;
    end: Date;
  };
}

export interface RealtimeState {
  isLive: boolean;
  playbackSpeed: 1 | 2;
  filters: RealtimeFilters;
  lastUpdate: Date;
}

export interface ChartConfig {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  gridColor: string;
}

// Types pour les composants
export interface SkeletonLoaderProps {
  variant: 'kpi' | 'chart' | 'activity' | 'text';
  count?: number;
  className?: string;
}

export interface LineChartProps {
  data: ChartDataPoint[];
  loading?: boolean;
  error?: string;
  config?: Partial<ChartConfig>;
  interactive?: boolean;
  onZoom?: (range: [number, number]) => void;
}

export interface BarChartProps {
  data: Array<{
    label: string;
    values: Array<{ name: string; value: number; color?: string }>;
  }>;
  loading?: boolean;
  error?: string;
  stacked?: boolean;
  responsive?: boolean;
}
