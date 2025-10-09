'use client';

import { useReducer, useCallback, useEffect } from 'react';
import { mockNotifications, defaultFilters, filterNotifications } from './mocks/data';
import type { NotificationsState, NotificationsAction, Notification, FilterOptions } from './types';

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

interface UseNotificationsOptions {
  initialData?: Notification[];
  enableLiveUpdates?: boolean;
  liveUpdateInterval?: number;
}

export function useNotifications(options: UseNotificationsOptions = {}) {
  const {
    initialData = mockNotifications,
    enableLiveUpdates = true,
    liveUpdateInterval = 30000,
  } = options;

  const [state, dispatch] = useReducer(notificationsReducer, {
    notifications: initialData,
    filters: defaultFilters,
    selectedIds: [],
    isLoading: false,
    error: null,
    hasMore: false,
    liveUpdatesEnabled: enableLiveUpdates,
    unreadCount: initialData.filter((n) => !n.read).length,
  });

  // Filtrage des notifications
  const filteredNotifications = filterNotifications(state.notifications, state.filters);

  // Actions
  const actions = {
    // Notifications CRUD
    addNotification: useCallback((notification: Notification) => {
      dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
    }, []),

    updateNotification: useCallback((id: string, updates: Partial<Notification>) => {
      dispatch({ type: 'UPDATE_NOTIFICATION', payload: { id, updates } });
    }, []),

    deleteNotification: useCallback((id: string) => {
      dispatch({ type: 'DELETE_NOTIFICATION', payload: id });
    }, []),

    setNotifications: useCallback((notifications: Notification[]) => {
      dispatch({ type: 'SET_NOTIFICATIONS', payload: notifications });
    }, []),

    // Filtres
    setFilters: useCallback((filters: FilterOptions) => {
      dispatch({ type: 'SET_FILTERS', payload: filters });
    }, []),

    clearFilters: useCallback(() => {
      dispatch({ type: 'SET_FILTERS', payload: defaultFilters });
    }, []),

    // Sélection
    setSelectedIds: useCallback((ids: string[]) => {
      dispatch({ type: 'SET_SELECTED_IDS', payload: ids });
    }, []),

    selectAll: useCallback(() => {
      const allIds = filteredNotifications.map((n) => n.id);
      dispatch({ type: 'SET_SELECTED_IDS', payload: allIds });
    }, [filteredNotifications]),

    deselectAll: useCallback(() => {
      dispatch({ type: 'SET_SELECTED_IDS', payload: [] });
    }, []),

    // Actions en lot
    markAsRead: useCallback((ids: string[]) => {
      dispatch({ type: 'MARK_AS_READ', payload: ids });
    }, []),

    markAllAsRead: useCallback(() => {
      dispatch({ type: 'MARK_ALL_READ' });
    }, []),

    markSelectedAsRead: useCallback(() => {
      dispatch({ type: 'MARK_AS_READ', payload: state.selectedIds });
      dispatch({ type: 'SET_SELECTED_IDS', payload: [] });
    }, [state.selectedIds]),

    deleteSelected: useCallback(() => {
      state.selectedIds.forEach((id) => {
        dispatch({ type: 'DELETE_NOTIFICATION', payload: id });
      });
    }, [state.selectedIds]),

    // Actions individuelles
    toggleRead: useCallback(
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
    ),

    // État
    setLoading: useCallback((loading: boolean) => {
      dispatch({ type: 'SET_LOADING', payload: loading });
    }, []),

    setError: useCallback((error: string | null) => {
      dispatch({ type: 'SET_ERROR', payload: error });
    }, []),

    setHasMore: useCallback((hasMore: boolean) => {
      dispatch({ type: 'SET_HAS_MORE', payload: hasMore });
    }, []),

    toggleLiveUpdates: useCallback((enabled: boolean) => {
      dispatch({ type: 'TOGGLE_LIVE_UPDATES', payload: enabled });
    }, []),

    // Utilitaires
    refresh: useCallback(async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        // Simuler un appel API
        await new Promise((resolve) => setTimeout(resolve, 1000));
        dispatch({ type: 'SET_NOTIFICATIONS', payload: initialData });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Erreur lors du chargement des notifications' });
      }
    }, [initialData]),

    loadMore: useCallback(async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        // Simuler le chargement de plus de données
        await new Promise((resolve) => setTimeout(resolve, 1000));
        dispatch({ type: 'SET_LOADING', payload: false });
        dispatch({ type: 'SET_HAS_MORE', payload: false });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Erreur lors du chargement' });
      }
    }, []),

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
  };

  // Mises à jour en temps réel
  useEffect(() => {
    if (!state.liveUpdatesEnabled) return;

    const interval = setInterval(() => {
      // Simulation d'une nouvelle notification
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
        actions.addNotification(newNotification);
      }
    }, liveUpdateInterval);

    return () => clearInterval(interval);
  }, [state.liveUpdatesEnabled, liveUpdateInterval, actions]);

  return {
    // État
    ...state,
    filteredNotifications,

    // Actions
    ...actions,

    // Statistiques utiles
    stats: {
      total: state.notifications.length,
      unread: state.unreadCount,
      selected: state.selectedIds.length,
      filtered: filteredNotifications.length,
    },
  };
}
