'use client';

import React, { useState, useReducer, useEffect, useCallback } from 'react';
import { Header } from './Header';
import { NotificationsToolbar } from './NotificationsToolbar';
import { NotificationFilters } from './NotificationFilters';
import { NotificationList } from './NotificationList';
import { NotificationDetailsPanel } from './NotificationDetailsPanel';
import { EmptyState } from './EmptyState';
import { ErrorState } from './ErrorState';
import {
  mockNotifications,
  defaultFilters,
  availableTags,
  filterNotifications,
} from './mocks/data';
import type {
  NotificationsState,
  NotificationsAction,
  Notification,
  FilterOptions,
  ToolbarActions,
} from './types';

// Reducer pour gérer l'état des notifications
const notificationsReducer = (
  state: NotificationsState,
  action: NotificationsAction
): NotificationsState => {
  switch (action.type) {
    case 'SET_NOTIFICATIONS':
      return {
        ...state,
        notifications: action.payload,
        unreadCount: action.payload.filter((n) => !n.read).length,
        isLoading: false,
        error: null,
      };

    case 'ADD_NOTIFICATION':
      const newNotifications = [action.payload, ...state.notifications];
      return {
        ...state,
        notifications: newNotifications,
        unreadCount: newNotifications.filter((n) => !n.read).length,
      };

    case 'UPDATE_NOTIFICATION':
      const updatedNotifications = state.notifications.map((notification) =>
        notification.id === action.payload.id
          ? { ...notification, ...action.payload.updates }
          : notification
      );
      return {
        ...state,
        notifications: updatedNotifications,
        unreadCount: updatedNotifications.filter((n) => !n.read).length,
      };

    case 'DELETE_NOTIFICATION':
      const filteredNotifications = state.notifications.filter((n) => n.id !== action.payload);
      return {
        ...state,
        notifications: filteredNotifications,
        unreadCount: filteredNotifications.filter((n) => !n.read).length,
        selectedIds: state.selectedIds.filter((id) => id !== action.payload),
      };

    case 'SET_FILTERS':
      return { ...state, filters: action.payload };

    case 'SET_SELECTED_IDS':
      return { ...state, selectedIds: action.payload };

    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };

    case 'SET_HAS_MORE':
      return { ...state, hasMore: action.payload };

    case 'TOGGLE_LIVE_UPDATES':
      return { ...state, liveUpdatesEnabled: action.payload };

    case 'MARK_AS_READ':
      const markedNotifications = state.notifications.map((notification) =>
        action.payload.includes(notification.id) ? { ...notification, read: true } : notification
      );
      return {
        ...state,
        notifications: markedNotifications,
        unreadCount: markedNotifications.filter((n) => !n.read).length,
      };

    case 'MARK_ALL_READ':
      const allReadNotifications = state.notifications.map((n) => ({ ...n, read: true }));
      return {
        ...state,
        notifications: allReadNotifications,
        unreadCount: 0,
      };

    default:
      return state;
  }
};

export const NotificationsLayout: React.FC = () => {
  const [state, dispatch] = useReducer(notificationsReducer, {
    notifications: mockNotifications,
    filters: defaultFilters,
    selectedIds: [],
    isLoading: false,
    error: null,
    hasMore: false,
    liveUpdatesEnabled: true,
    unreadCount: mockNotifications.filter((n) => !n.read).length,
  });

  const [showFilters, setShowFilters] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [showDetailsPanel, setShowDetailsPanel] = useState(false);
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([]);

  // Appliquer les filtres
  useEffect(() => {
    const filtered = filterNotifications(state.notifications, state.filters);
    setFilteredNotifications(filtered);
  }, [state.notifications, state.filters]);

  // Simuler les mises à jour en temps réel
  useEffect(() => {
    if (!state.liveUpdatesEnabled) return;

    const interval = setInterval(() => {
      // Simulation d'une nouvelle notification toutes les 30 secondes
      if (Math.random() > 0.95) {
        const newNotification: Notification = {
          id: Date.now().toString(),
          channel: ['facebook', 'whatsapp', 'instagram', 'email'][
            Math.floor(Math.random() * 4)
          ] as any,
          type: ['info', 'success', 'warning', 'error'][Math.floor(Math.random() * 4)] as any,
          title: 'Nouvelle notification en temps réel',
          body: 'Ceci est une notification générée automatiquement pour démontrer les mises à jour en temps réel.',
          timestamp: new Date().toISOString(),
          read: false,
          tags: ['temps-reel', 'demo'],
          priority: 'medium',
        };
        dispatch({ type: 'ADD_NOTIFICATION', payload: newNotification });
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [state.liveUpdatesEnabled]);

  // Actions de la barre d'outils
  const toolbarActions: ToolbarActions = {
    markAllRead: useCallback(() => {
      dispatch({ type: 'MARK_ALL_READ' });
    }, []),

    toggleFilters: useCallback(() => {
      setShowFilters(!showFilters);
    }, [showFilters]),

    exportToCsv: useCallback(() => {
      const csvContent = [
        ['ID', 'Canal', 'Type', 'Titre', 'Message', 'Date', 'Lu', 'Tags'].join(','),
        ...filteredNotifications.map((notification) =>
          [
            notification.id,
            notification.channel,
            notification.type,
            `"${notification.title.replace(/"/g, '""')}"`,
            `"${notification.body.replace(/"/g, '""')}"`,
            notification.timestamp,
            notification.read ? 'Oui' : 'Non',
            `"${(notification.tags || []).join(', ')}"`,
          ].join(',')
        ),
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `notifications-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
    }, [filteredNotifications]),

    refresh: useCallback(async () => {
      dispatch({ type: 'SET_LOADING', payload: true });

      // Simuler un délai de chargement
      setTimeout(() => {
        dispatch({ type: 'SET_NOTIFICATIONS', payload: mockNotifications });
      }, 1000);
    }, []),

    toggleLiveUpdates: useCallback((enabled: boolean) => {
      dispatch({ type: 'TOGGLE_LIVE_UPDATES', payload: enabled });
    }, []),
  };

  // Gestion des filtres
  const handleFiltersChange = useCallback((filters: FilterOptions) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  }, []);

  // Gestion de la recherche
  const handleSearch = useCallback(
    (query: string) => {
      dispatch({
        type: 'SET_FILTERS',
        payload: { ...state.filters, searchQuery: query },
      });
    },
    [state.filters]
  );

  // Gestion de la sélection
  const handleNotificationSelect = useCallback(
    (id: string) => {
      const notification = state.notifications.find((n) => n.id === id);
      if (notification) {
        setSelectedNotification(notification);
        setShowDetailsPanel(true);
      }
    },
    [state.notifications]
  );

  // Actions en lot
  const handleBulkAction = useCallback((action: string, ids: string[]) => {
    switch (action) {
      case 'selectAll':
        dispatch({ type: 'SET_SELECTED_IDS', payload: ids });
        break;
      case 'deselectAll':
        dispatch({ type: 'SET_SELECTED_IDS', payload: [] });
        break;
      case 'markAsRead':
        dispatch({ type: 'MARK_AS_READ', payload: ids });
        dispatch({ type: 'SET_SELECTED_IDS', payload: [] });
        break;
      case 'delete':
        ids.forEach((id) => {
          dispatch({ type: 'DELETE_NOTIFICATION', payload: id });
        });
        break;
    }
  }, []);

  // Marquer comme lu/non lu
  const handleToggleRead = useCallback(
    (id: string) => {
      const notification = state.notifications.find((n) => n.id === id);
      if (notification) {
        dispatch({
          type: 'UPDATE_NOTIFICATION',
          payload: { id, updates: { read: !notification.read } },
        });
      }
    },
    [state.notifications]
  );

  // Supprimer une notification
  const handleDelete = useCallback((id: string) => {
    dispatch({ type: 'DELETE_NOTIFICATION', payload: id });
  }, []);

  // Chargement de plus de notifications
  const handleLoadMore = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });

    // Simuler le chargement de plus de données
    setTimeout(() => {
      dispatch({ type: 'SET_LOADING', payload: false });
      dispatch({ type: 'SET_HAS_MORE', payload: false });
    }, 1000);
  }, []);

  // Action pour l'état vide
  const handleEmptyAction = useCallback(() => {
    if (
      state.filters.searchQuery ||
      state.filters.channels.length > 0 ||
      state.filters.types.length > 0 ||
      state.filters.status.length > 0 ||
      state.filters.tags.length > 0
    ) {
      // Réinitialiser les filtres
      dispatch({ type: 'SET_FILTERS', payload: defaultFilters });
    } else {
      // Rediriger vers la création de campagne
      window.open('/dashboard/campaigns/new', '_blank');
    }
  }, [state.filters]);

  // Gestion des erreurs
  const handleRetry = useCallback(() => {
    dispatch({ type: 'SET_ERROR', payload: null });
    toolbarActions.refresh();
  }, [toolbarActions]);

  // Rendu conditionnel basé sur l'état
  const renderContent = () => {
    if (state.error) {
      return <ErrorState error={state.error} onRetry={handleRetry} />;
    }

    if (filteredNotifications.length === 0 && !state.isLoading) {
      const emptyType =
        state.filters.searchQuery ||
        state.filters.channels.length > 0 ||
        state.filters.types.length > 0 ||
        state.filters.status.length > 0 ||
        state.filters.tags.length > 0
          ? 'no-results'
          : 'no-notifications';

      return <EmptyState type={emptyType} onAction={handleEmptyAction} />;
    }

    return (
      <NotificationList
        items={filteredNotifications}
        selectedIds={state.selectedIds}
        onSelect={handleNotificationSelect}
        onBulkAction={handleBulkAction}
        onToggleRead={handleToggleRead}
        onDelete={handleDelete}
        isLoading={state.isLoading}
        hasMore={state.hasMore}
        onLoadMore={handleLoadMore}
        searchQuery={state.filters.searchQuery}
      />
    );
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] dark:bg-gray-900">
      {/* Layout principal */}
      <div className="flex flex-col h-screen">
        {/* Header */}
        <Header
          onSearch={handleSearch}
          unreadCount={state.unreadCount}
          searchQuery={state.filters.searchQuery}
        />

        {/* Toolbar */}
        <NotificationsToolbar
          actions={toolbarActions}
          selectedCount={state.selectedIds.length}
          totalCount={filteredNotifications.length}
          isRefreshing={state.isLoading}
          liveUpdatesEnabled={state.liveUpdatesEnabled}
        />

        {/* Contenu principal */}
        <main className="flex-1 overflow-hidden">{renderContent()}</main>
      </div>

      {/* Panneau de filtres */}
      <NotificationFilters
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        filters={state.filters}
        onFiltersChange={handleFiltersChange}
        availableTags={availableTags}
      />

      {/* Panneau de détails */}
      <NotificationDetailsPanel
        notification={selectedNotification}
        isOpen={showDetailsPanel}
        onClose={() => setShowDetailsPanel(false)}
        onMarkAsRead={handleToggleRead}
        onDelete={handleDelete}
      />
    </div>
  );
};
