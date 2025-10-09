import React from 'react';
import { Button } from './ui/Button';
import type { ErrorStateProps } from './types';

export const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry }) => {
  const errorMessage = typeof error === 'string' ? error : error.message;

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center min-h-[400px]">
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
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>

      <h3 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">
        Erreur de chargement
      </h3>

      <p className="text-gray-600 dark:text-gray-400 max-w-md mb-2">
        Une erreur s'est produite lors du chargement des notifications.
      </p>

      {errorMessage && (
        <details className="mb-6 max-w-md">
          <summary className="text-sm text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300">
            Détails de l'erreur
          </summary>
          <div className="mt-2 p-3 bg-gray-100 dark:bg-gray-800 rounded-md text-sm text-left font-mono text-red-600 dark:text-red-400">
            {errorMessage}
          </div>
        </details>
      )}

      <div className="space-y-3">
        <Button variant="default" onClick={onRetry} className="inline-flex items-center space-x-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          <span>Réessayer</span>
        </Button>

        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.reload()}
            className="text-sm"
          >
            🔄 Recharger la page
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open('/support', '_blank')}
            className="text-sm"
          >
            📞 Contacter le support
          </Button>
        </div>
      </div>

      {/* Suggestions de dépannage */}
      <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg max-w-md">
        <h4 className="text-sm font-medium text-yellow-900 dark:text-yellow-100 mb-2">
          🔧 Suggestions de dépannage :
        </h4>
        <ul className="text-sm text-yellow-800 dark:text-yellow-200 space-y-1 text-left">
          <li>• Vérifiez votre connexion internet</li>
          <li>• Essayez de recharger la page</li>
          <li>• Videz le cache de votre navigateur</li>
          <li>• Contactez le support si le problème persiste</li>
        </ul>
      </div>
    </div>
  );
};
