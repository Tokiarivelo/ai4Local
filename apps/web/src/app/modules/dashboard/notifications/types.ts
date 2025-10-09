/**
 * Types pour le système de notifications AI4Local
 */

export type NotificationChannel = 'facebook' | 'whatsapp' | 'instagram' | 'email';
export type NotificationType = 'info' | 'warning' | 'error' | 'success';
export type NotificationStatus = 'read' | 'unread';

export interface Notification {
  id: string;
  channel: NotificationChannel;
  type: NotificationType;
  title: string;
  body: string;
  meta?: Record<string, string>;
  timestamp: string;
  read: boolean;
  tags?: string[];
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  actionUrl?: string;
  imageUrl?: string;
}

export interface FilterOptions {
  channels: NotificationChannel[];
  types: NotificationType[];
  status: NotificationStatus[];
  dateRange: {
    start?: string;
    end?: string;
  };
  tags: string[];
  priority?: ('low' | 'medium' | 'high' | 'urgent')[];
  searchQuery?: string;
}

export interface NotificationListProps {
  items: Notification[];
  onSelect: (id: string) => void;
  onBulkAction: (action: string, ids: string[]) => void;
  selectedIds: string[];
  isLoading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
}

export interface NotificationItemProps {
  notification: Notification;
  isSelected?: boolean;
  onSelect: (id: string) => void;
  onToggleRead: (id: string) => void;
  onDelete: (id: string) => void;
  searchQuery?: string;
}

export interface ToolbarActions {
  markAllRead: () => void;
  toggleFilters: () => void;
  exportToCsv: () => void;
  refresh: () => void;
  toggleLiveUpdates: (enabled: boolean) => void;
}

export interface HeaderProps {
  onSearch: (query: string) => void;
  unreadCount: number;
  searchQuery?: string;
}

export interface NotificationFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  availableTags: string[];
}

export interface EmptyStateProps {
  type: 'no-notifications' | 'no-results' | 'error';
  onAction?: () => void;
}

export interface ErrorStateProps {
  error: Error | string;
  onRetry: () => void;
}

// État global de l'application notifications
export interface NotificationsState {
  notifications: Notification[];
  filters: FilterOptions;
  selectedIds: string[];
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
  liveUpdatesEnabled: boolean;
  unreadCount: number;
}

// Actions pour le state management
export type NotificationsAction =
  | { type: 'SET_NOTIFICATIONS'; payload: Notification[] }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'UPDATE_NOTIFICATION'; payload: { id: string; updates: Partial<Notification> } }
  | { type: 'DELETE_NOTIFICATION'; payload: string }
  | { type: 'SET_FILTERS'; payload: FilterOptions }
  | { type: 'SET_SELECTED_IDS'; payload: string[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_HAS_MORE'; payload: boolean }
  | { type: 'TOGGLE_LIVE_UPDATES'; payload: boolean }
  | { type: 'MARK_AS_READ'; payload: string[] }
  | { type: 'MARK_ALL_READ' };
