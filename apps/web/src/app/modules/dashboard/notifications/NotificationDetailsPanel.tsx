import React from 'react';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { Card, CardHeader, CardContent } from './ui/Card';
import {
  XIcon,
  FacebookIcon,
  WhatsAppIcon,
  InstagramIcon,
  MailIcon,
  CheckIcon,
  TrashIcon,
} from './ui/Icons';
import type { Notification } from './types';

interface NotificationDetailsPanelProps {
  notification: Notification | null;
  isOpen: boolean;
  onClose: () => void;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

const formatDateTime = (timestamp: string): string => {
  const date = new Date(timestamp);
  return date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const NotificationDetailsPanel: React.FC<NotificationDetailsPanelProps> = ({
  notification,
  isOpen,
  onClose,
  onMarkAsRead,
  onDelete,
}) => {
  if (!isOpen || !notification) return null;

  const getChannelIcon = () => {
    const iconProps = { size: 24 };
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

  const getChannelName = () => {
    switch (notification.channel) {
      case 'facebook':
        return 'Facebook';
      case 'whatsapp':
        return 'WhatsApp';
      case 'instagram':
        return 'Instagram';
      case 'email':
        return 'Email';
      default:
        return 'Inconnu';
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

  const getTypeName = () => {
    switch (notification.type) {
      case 'success':
        return 'Succès';
      case 'warning':
        return 'Avertissement';
      case 'error':
        return 'Erreur';
      case 'info':
      default:
        return 'Information';
    }
  };

  const getPriorityName = () => {
    switch (notification.priority) {
      case 'urgent':
        return 'Urgente';
      case 'high':
        return 'Élevée';
      case 'medium':
        return 'Moyenne';
      case 'low':
      default:
        return 'Faible';
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

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />

      {/* Panel */}
      <div className="absolute right-0 top-0 h-full w-full max-w-lg bg-[var(--bg)] dark:bg-gray-900 shadow-xl overflow-y-auto">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-[var(--bg)] dark:bg-gray-900 sticky top-0 z-10">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                {getChannelIcon()}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[var(--text)] dark:text-white">
                  Détails de la notification
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">{getChannelName()}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-2"
              aria-label="Fermer le panneau"
            >
              <XIcon size={20} />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 p-4 space-y-6">
            {/* Status and metadata */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Badge variant={getTypeColor() as any} size="md">
                  {getTypeName()}
                </Badge>
                {notification.priority && (
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor()}`}
                  >
                    {getPriorityName()}
                  </span>
                )}
              </div>
              {!notification.read && (
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-[var(--brand-mid)] rounded-full"></div>
                  <span className="text-sm text-[var(--brand-mid)] font-medium">Non lue</span>
                </div>
              )}
            </div>

            {/* Title */}
            <div>
              <h3 className="text-xl font-semibold text-[var(--text)] dark:text-white mb-2">
                {notification.title}
              </h3>
              <time
                className="text-sm text-gray-600 dark:text-gray-400"
                dateTime={notification.timestamp}
              >
                {formatDateTime(notification.timestamp)}
              </time>
            </div>

            {/* Body */}
            <div>
              <h4 className="text-sm font-medium text-[var(--text)] dark:text-white mb-2">
                Message
              </h4>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {notification.body}
                </p>
              </div>
            </div>

            {/* Image if available */}
            {notification.imageUrl && (
              <div>
                <h4 className="text-sm font-medium text-[var(--text)] dark:text-white mb-2">
                  Pièce jointe
                </h4>
                <img
                  src={notification.imageUrl}
                  alt="Contenu de la notification"
                  className="w-full rounded-lg border border-gray-200 dark:border-gray-700"
                />
              </div>
            )}

            {/* Tags */}
            {notification.tags && notification.tags.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-[var(--text)] dark:text-white mb-2">
                  Tags
                </h4>
                <div className="flex flex-wrap gap-2">
                  {notification.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Metadata */}
            {notification.meta && Object.keys(notification.meta).length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-[var(--text)] dark:text-white mb-2">
                  Informations supplémentaires
                </h4>
                <Card>
                  <CardContent className="p-4">
                    <dl className="space-y-2">
                      {Object.entries(notification.meta).map(([key, value]) => (
                        <div key={key} className="flex justify-between text-sm">
                          <dt className="text-gray-600 dark:text-gray-400 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}:
                          </dt>
                          <dd className="text-[var(--text)] dark:text-white font-medium ml-2 text-right">
                            {value}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Action URL */}
            {notification.actionUrl && (
              <div>
                <h4 className="text-sm font-medium text-[var(--text)] dark:text-white mb-2">
                  Action
                </h4>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(notification.actionUrl, '_blank')}
                  className="w-full"
                >
                  Voir les détails
                </Button>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800">
            <div className="flex space-x-3">
              <Button
                variant={notification.read ? 'outline' : 'default'}
                size="sm"
                onClick={() => onMarkAsRead(notification.id)}
                className="flex-1 flex items-center justify-center space-x-2"
              >
                <CheckIcon size={16} />
                <span>{notification.read ? 'Marquer non lue' : 'Marquer comme lue'}</span>
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  onDelete(notification.id);
                  onClose();
                }}
                className="flex items-center justify-center space-x-2"
              >
                <TrashIcon size={16} />
                <span className="hidden sm:inline">Supprimer</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
