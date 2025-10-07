'use client';

import { FC, useState, useCallback } from 'react';
import { MoreVertical, Eye, X, Check } from 'lucide-react';
import { ActivityEvent } from '../types';
import { SkeletonLoader } from './SkeletonLoader';

interface ActivityFeedProps {
  activities: ActivityEvent[];
  loading?: boolean;
  error?: string;
  onMarkAsRead?: (eventId: string) => void;
  onView?: (event: ActivityEvent) => void;
  onCancel?: (eventId: string) => void;
  className?: string;
}

export const ActivityFeed: FC<ActivityFeedProps> = ({
  activities,
  loading = false,
  error,
  onMarkAsRead,
  onView,
  onCancel,
  className = '',
}) => {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const formatRelativeTime = useCallback((timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "À l'instant";
    if (minutes < 60) return `il y a ${minutes} min`;
    if (hours < 24) return `il y a ${hours}h`;
    return `il y a ${days}j`;
  }, []);

  const getStatusBadge = (status: ActivityEvent['status']) => {
    const baseClasses = 'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium';

    switch (status) {
      case 'success':
        return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400`;
      case 'warning':
        return `${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400`;
      case 'error':
        return `${baseClasses} bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400`;
      default:
        return `${baseClasses} bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400`;
    }
  };

  const getTypeIcon = (type: ActivityEvent['type']) => {
    // Retourne une couleur basée sur le type
    switch (type) {
      case 'publishing':
        return 'bg-blue-500';
      case 'error':
        return 'bg-red-500';
      case 'validation':
        return 'bg-green-500';
      case 'conversion':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <SkeletonLoader variant="activity" count={5} />
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`p-4 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 ${className}`}
      >
        <p className="text-red-600 dark:text-red-400 text-sm">Erreur: {error}</p>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className={`p-8 text-center text-gray-500 dark:text-gray-400 ${className}`}>
        <p>Aucune activité récente</p>
      </div>
    );
  }

  return (
    <div
      className={`space-y-1 ${className}`}
      role="feed"
      aria-label="Flux d'activité en temps réel"
    >
      {activities.map((activity) => (
        <div
          key={activity.id}
          className={`
            relative p-4 border-l-4 bg-white dark:bg-gray-800 
            hover:bg-gray-50 dark:hover:bg-gray-700 
            transition-all duration-200 ease-in-out transform hover:scale-[1.01]
            ${activity.read ? 'opacity-60' : ''}
            ${getTypeIcon(activity.type).replace('bg-', 'border-l-')}
          `}
          role="article"
          aria-labelledby={`activity-${activity.id}`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3 flex-1">
              <div className={`w-2 h-2 rounded-full mt-2 ${getTypeIcon(activity.type)}`}></div>
              <div className="flex-1 min-w-0">
                <p
                  id={`activity-${activity.id}`}
                  className="text-sm text-gray-900 dark:text-white font-medium"
                >
                  {activity.message}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={getStatusBadge(activity.status)}>{activity.status}</span>
                  <time
                    className="text-xs text-gray-500 dark:text-gray-400"
                    dateTime={new Date(activity.timestamp).toISOString()}
                  >
                    {formatRelativeTime(activity.timestamp)}
                  </time>
                </div>
              </div>
            </div>

            <div className="relative">
              <button
                onClick={() => setOpenMenuId(openMenuId === activity.id ? null : activity.id)}
                className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                aria-label="Actions"
                aria-expanded={openMenuId === activity.id}
                aria-haspopup="menu"
              >
                <MoreVertical className="w-4 h-4 text-gray-400" />
              </button>

              {openMenuId === activity.id && (
                <div
                  className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg border border-gray-200 dark:border-gray-600 z-10"
                  role="menu"
                  aria-orientation="vertical"
                >
                  <button
                    onClick={() => {
                      onView?.(activity);
                      setOpenMenuId(null);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                    role="menuitem"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Voir
                  </button>

                  {!activity.read && (
                    <button
                      onClick={() => {
                        onMarkAsRead?.(activity.id);
                        setOpenMenuId(null);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                      role="menuitem"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Marquer lu
                    </button>
                  )}

                  <button
                    onClick={() => {
                      onCancel?.(activity.id);
                      setOpenMenuId(null);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-600"
                    role="menuitem"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Annuler
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
