import React from 'react';
import { useNotifications, NotificationList, Header } from '@/app/modules/dashboard/notifications';

/**
 * Exemple d'utilisation du hook useNotifications
 * pour créer une page de notifications personnalisée
 */
export function ExampleNotificationsPage() {
  const {
    // État
    filteredNotifications,
    selectedIds,
    unreadCount,
    isLoading,
    error,
    hasMore,
    filters,
    stats,

    // Actions
    setFilters,
    toggleRead,
    deleteNotification,
    markSelectedAsRead,
    deleteSelected,
    selectAll,
    deselectAll,
    setSelectedIds,
    loadMore,
    refresh,
    exportToCsv,
    markAllAsRead,
    toggleLiveUpdates,
  } = useNotifications({
    enableLiveUpdates: true,
    liveUpdateInterval: 30000, // 30 secondes
  });

  const handleSearch = (query: string) => {
    setFilters({ ...filters, searchQuery: query });
  };

  const handleNotificationSelect = (id: string) => {
    console.log('Notification sélectionnée:', id);
    // Ici vous pourriez ouvrir un modal de détails
  };

  const handleBulkAction = (action: string, ids: string[]) => {
    switch (action) {
      case 'selectAll':
        selectAll();
        break;
      case 'deselectAll':
        deselectAll();
        break;
      case 'markAsRead':
        markSelectedAsRead();
        break;
      case 'delete':
        deleteSelected();
        break;
    }
  };

  if (error) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-600 mb-4">Erreur: {error}</p>
        <button
          onClick={refresh}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header avec recherche */}
      <Header onSearch={handleSearch} unreadCount={unreadCount} searchQuery={filters.searchQuery} />

      {/* Statistiques rapides */}
      <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 border-b">
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <div className="flex space-x-4">
            <span>{stats.total} notifications</span>
            <span>{stats.unread} non lues</span>
            {stats.selected > 0 && (
              <span className="text-blue-600">{stats.selected} sélectionnées</span>
            )}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={markAllAsRead}
              className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
            >
              Tout marquer lu
            </button>
            <button
              onClick={exportToCsv}
              className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
            >
              Exporter CSV
            </button>
            <button
              onClick={refresh}
              disabled={isLoading}
              className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 disabled:opacity-50"
            >
              {isLoading ? 'Actualisation...' : 'Actualiser'}
            </button>
          </div>
        </div>
      </div>

      {/* Liste des notifications */}
      <NotificationList
        items={filteredNotifications}
        selectedIds={selectedIds}
        onSelect={handleNotificationSelect}
        onBulkAction={handleBulkAction}
        onToggleRead={toggleRead}
        onDelete={deleteNotification}
        isLoading={isLoading}
        hasMore={hasMore}
        onLoadMore={loadMore}
        searchQuery={filters.searchQuery}
      />
    </div>
  );
}

/**
 * Exemple d'utilisation minimale
 */
export function MinimalNotificationsExample() {
  const { filteredNotifications, unreadCount } = useNotifications();

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Notifications ({unreadCount} non lues)</h2>

      <div className="space-y-2">
        {filteredNotifications.slice(0, 5).map((notification) => (
          <div
            key={notification.id}
            className={`p-3 border rounded ${
              !notification.read ? 'bg-blue-50 border-blue-200' : 'bg-white'
            }`}
          >
            <h3 className="font-medium">{notification.title}</h3>
            <p className="text-sm text-gray-600">{notification.body}</p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-gray-500">
                {notification.channel} • {notification.type}
              </span>
              <span className="text-xs text-gray-500">
                {new Date(notification.timestamp).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
