// Export des composants principaux
export { NotificationsLayout } from './NotificationsLayout';
export { Header } from './Header';
export { NotificationsToolbar } from './NotificationsToolbar';
export { NotificationFilters } from './NotificationFilters';
export { NotificationList } from './NotificationList';
export { NotificationItem } from './NotificationItem';
export { NotificationDetailsPanel } from './NotificationDetailsPanel';
export { EmptyState } from './EmptyState';
export { ErrorState } from './ErrorState';

// Export des hooks
export { useNotifications } from './useNotifications';

// Export des composants UI
export { Button } from './ui/Button';
export { Badge } from './ui/Badge';
export { Input } from './ui/Input';
export { Card, CardHeader, CardContent } from './ui/Card';
export { Skeleton, NotificationSkeleton, NotificationListSkeleton } from './ui/Skeleton';
export * from './ui/Icons';

// Export des types
export type {
  Notification,
  NotificationChannel,
  NotificationType,
  NotificationStatus,
  FilterOptions,
  NotificationListProps,
  NotificationItemProps,
  ToolbarActions,
  HeaderProps,
  NotificationFiltersProps,
  EmptyStateProps,
  ErrorStateProps,
  NotificationsState,
  NotificationsAction,
} from './types';

// Export des données mock
export {
  mockNotifications,
  defaultFilters,
  availableTags,
  mockStats,
  filterNotifications,
} from './mocks/data';
