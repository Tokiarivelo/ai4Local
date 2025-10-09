import React from 'react';
import { Button } from './ui/Button';
import { BellIcon } from './ui/Icons';
import type { EmptyStateProps } from './types';

export const EmptyState: React.FC<EmptyStateProps> = ({ type, onAction }) => {
  const getContent = () => {
    switch (type) {
      case 'no-notifications':
        return {
          icon: (
            <div className="w-16 h-16 bg-[var(--brand-ghost)] rounded-full flex items-center justify-center mb-6">
              <BellIcon size={32} className="text-[var(--brand-mid)]" />
            </div>
          ),
          title: 'Aucune notification',
          description:
            "Vous n'avez aucune notification pour le moment. Nous vous notifierons dès qu'il y aura du nouveau.",
          actionText: 'Créer une campagne',
          actionIcon: '+',
        };

      case 'no-results':
        return {
          icon: (
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-6">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          ),
          title: 'Aucun résultat trouvé',
          description:
            "Aucune notification ne correspond à vos critères de recherche. Essayez d'ajuster vos filtres ou votre recherche.",
          actionText: 'Réinitialiser les filtres',
          actionIcon: '🔄',
        };

      case 'error':
      default:
        return {
          icon: (
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-6">
              <svg
                className="w-8 h-8 text-red-500 dark:text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
          ),
          title: 'Erreur de chargement',
          description:
            "Une erreur s'est produite lors du chargement des notifications. Veuillez réessayer.",
          actionText: 'Réessayer',
          actionIcon: '↻',
        };
    }
  };

  const content = getContent();

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center min-h-[400px]">
      {content.icon}

      <h3 className="text-xl font-semibold text-[var(--text)] dark:text-white mb-2">
        {content.title}
      </h3>

      <p className="text-gray-600 dark:text-gray-400 max-w-md mb-8 leading-relaxed">
        {content.description}
      </p>

      {onAction && (
        <div className="space-y-4">
          <Button
            variant="default"
            onClick={onAction}
            className="inline-flex items-center space-x-2"
          >
            <span>{content.actionIcon}</span>
            <span>{content.actionText}</span>
          </Button>

          {type === 'no-notifications' && (
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open('/docs/getting-started', '_blank')}
                className="text-sm"
              >
                📚 Voir la documentation
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open('/dashboard/integrations', '_blank')}
                className="text-sm"
              >
                🔗 Configurer les intégrations
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Suggestions pour l'état vide */}
      {type === 'no-notifications' && (
        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg max-w-md">
          <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
            💡 Pour commencer :
          </h4>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1 text-left">
            <li>• Connectez vos comptes sociaux</li>
            <li>• Créez votre première campagne</li>
            <li>• Activez les notifications en temps réel</li>
          </ul>
        </div>
      )}
    </div>
  );
};
