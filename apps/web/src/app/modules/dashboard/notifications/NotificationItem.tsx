'use client';

import React, { useState } from 'react';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import {
  FacebookIcon,
  WhatsAppIcon,
  InstagramIcon,
  MailIcon,
  MoreVerticalIcon,
  CheckIcon,
  TrashIcon,
} from './ui/Icons';
import type { NotificationItemProps } from './types';

// Fonction utilitaire pour formater la date relative
const formatRelativeTime = (timestamp: string): string => {
  const now = new Date();
  const notificationTime = new Date(timestamp);
  const diffInSeconds = Math.floor((now.getTime() - notificationTime.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "À l'instant";
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `Il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `Il y a ${hours} heure${hours > 1 ? 's' : ''}`;
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `Il y a ${days} jour${days > 1 ? 's' : ''}`;
  } else {
    return notificationTime.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: notificationTime.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  }
};

// Fonction pour mettre en évidence les termes de recherche
const highlightSearchTerm = (text: string, searchQuery?: string): React.ReactNode => {
  if (!searchQuery || !text) return text;

  const regex = new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);

  return parts.map((part, index) =>
    regex.test(part) ? (
      <mark key={index} className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">
        {part}
      </mark>
    ) : (
      part
    )
  );
};

export const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  isSelected = false,
  onSelect,
  onToggleRead,
  onDelete,
  searchQuery,
}) => {
  const [showMenu, setShowMenu] = useState(false);

  const getChannelIcon = () => {
    const iconProps = { size: 20 };
    switch (notification.channel) {
      case 'facebook':
        return <FacebookIcon {...iconProps} />;
      case 'whatsapp':
        return <WhatsAppIcon {...iconProps} />;
      case 'instagram':
        return <InstagramIcon {...iconProps} />;
      case 'email':
        return <MailIcon {...iconProps} />;
      default:
        return <MailIcon {...iconProps} />;
    }
  };

  const getTypeColor = () => {
    switch (notification.type) {
      case 'success':
        return 'success';
      case 'warning':
        return 'warning';
      case 'error':
        return 'error';
      case 'info':
      default:
        return 'info';
    }
  };

  const getPriorityColor = () => {
    switch (notification.priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'medium':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'low':
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const handleItemClick = () => {
    onSelect(notification.id);
    if (!notification.read) {
      onToggleRead(notification.id);
    }
  };

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleMenuToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handleMenuAction = (action: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(false);

    switch (action) {
      case 'toggleRead':
        onToggleRead(notification.id);
        break;
      case 'delete':
        onDelete(notification.id);
        break;
      case 'view':
        onSelect(notification.id);
        break;
    }
  };

  return (
    <div
      role="listitem"
      tabIndex={0}
      className={`group relative border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer ${
        !notification.read ? 'bg-blue-50 dark:bg-blue-950/20' : ''
      } ${isSelected ? 'ring-2 ring-[var(--brand-mid)] ring-inset' : ''}`}
      onClick={handleItemClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleItemClick();
        }
      }}
      aria-label={`Notification: ${notification.title}`}
    >
      <div className="flex items-start space-x-4 p-4">
        {/* Checkbox for bulk selection */}
        <div className="flex-shrink-0" onClick={handleCheckboxClick}>
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onSelect(notification.id)}
            className="rounded border-gray-300 text-[var(--brand-mid)] focus:ring-[var(--brand-mid)] focus:ring-offset-0"
            aria-label={`Sélectionner notification ${notification.title}`}
          />
        </div>

        {/* Channel Icon */}
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
            {getChannelIcon()}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header: Title, Type Badge, Priority */}
          <div className="flex items-start justify-between mb-1">
            <div className="flex items-center space-x-2 flex-1 min-w-0">
              <h3
                className={`text-sm font-medium truncate ${
                  !notification.read
                    ? 'text-[var(--text)] dark:text-white'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                {highlightSearchTerm(notification.title, searchQuery)}
              </h3>
              <Badge variant={getTypeColor() as any} size="sm">
                {notification.type === 'info'
                  ? 'Info'
                  : notification.type === 'success'
                    ? 'Succès'
                    : notification.type === 'warning'
                      ? 'Attention'
                      : 'Erreur'}
              </Badge>
              {notification.priority && notification.priority !== 'low' && (
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor()}`}
                >
                  {notification.priority === 'urgent'
                    ? 'Urgent'
                    : notification.priority === 'high'
                      ? 'Élevée'
                      : 'Moyenne'}
                </span>
              )}
            </div>
            {!notification.read && (
              <div className="w-2 h-2 bg-[var(--brand-mid)] rounded-full flex-shrink-0 ml-2"></div>
            )}
          </div>

          {/* Body */}
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
            {highlightSearchTerm(notification.body, searchQuery)}
          </p>

          {/* Footer: Tags, Timestamp */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {notification.tags && notification.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {notification.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                    >
                      #{tag}
                    </span>
                  ))}
                  {notification.tags.length > 3 && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      +{notification.tags.length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>
            <time
              className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0"
              dateTime={notification.timestamp}
            >
              {formatRelativeTime(notification.timestamp)}
            </time>
          </div>
        </div>

        {/* Actions Menu */}
        <div className="flex-shrink-0 relative">
          <Button
            variant="ghost"
            size="sm"
            className="opacity-0 group-hover:opacity-100 transition-opacity p-2"
            onClick={handleMenuToggle}
            aria-label="Actions pour cette notification"
          >
            <MoreVerticalIcon size={16} />
          </Button>

          {showMenu && (
            <div className="absolute right-0 top-8 z-10 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 py-1">
              <button
                onClick={(e) => handleMenuAction('view', e)}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Voir les détails
              </button>
              <button
                onClick={(e) => handleMenuAction('toggleRead', e)}
                className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <CheckIcon size={16} className="mr-2" />
                {notification.read ? 'Marquer non lue' : 'Marquer lue'}
              </button>
              <button
                onClick={(e) => handleMenuAction('delete', e)}
                className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <TrashIcon size={16} className="mr-2" />
                Supprimer
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Click overlay to close menu */}
      {showMenu && <div className="fixed inset-0 z-5" onClick={() => setShowMenu(false)} />}
    </div>
  );
};
