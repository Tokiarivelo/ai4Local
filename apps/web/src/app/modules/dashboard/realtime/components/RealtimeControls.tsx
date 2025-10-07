'use client';

import { FC, useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Download, Calendar, Filter } from 'lucide-react';
import { RealtimeState } from '../types';
import { useLocale } from 'next-intl';

interface RealtimeControlsProps {
  state: RealtimeState;
  onToggleLive: () => void;
  onRefreshNow: () => void;
  onExportCSV: () => void;
  onSpeedChange: (speed: 1 | 2) => void;
  onDateRangeChange: (range: { start: Date; end: Date }) => void;
  onFiltersOpen: () => void;
  className?: string;
}

export const RealtimeControls: FC<RealtimeControlsProps> = ({
  state,
  onToggleLive,
  onRefreshNow,
  onExportCSV,
  onSpeedChange,
  onDateRangeChange,
  onFiltersOpen,
  className = '',
}) => {
  const [dateRange, setDateRange] = useState('24h');
  const [isClient, setIsClient] = useState(false);
  const locale = useLocale();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleDateRangeChange = (range: string) => {
    setDateRange(range);
    const now = new Date();
    let start: Date;

    switch (range) {
      case '30m':
        start = new Date(now.getTime() - 30 * 60 * 1000);
        break;
      case '1h':
        start = new Date(now.getTime() - 60 * 60 * 1000);
        break;
      case '24h':
        start = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      default:
        start = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    }

    onDateRangeChange({ start, end: now });
  };

  return (
    <div
      className={`
        sticky top-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 
        px-4 py-3 ${className}
      `}
      role="toolbar"
      aria-label="Contrôles temps réel"
    >
      <div className="flex items-center justify-between space-x-4">
        {/* Contrôles principaux */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onToggleLive}
            className={`
              flex items-center space-x-2 px-3 py-2 rounded-md font-medium transition-colors
              ${
                state.isLive
                  ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400'
                  : 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400'
              }
            `}
            aria-label={state.isLive ? 'Mettre en pause' : 'Reprendre'}
            aria-pressed={state.isLive}
          >
            {state.isLive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span className="hidden sm:inline">{state.isLive ? 'Pause' : 'Live'}</span>
          </button>

          <button
            onClick={onRefreshNow}
            className="flex items-center space-x-2 px-3 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors"
            aria-label="Actualiser maintenant"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Actualiser</span>
          </button>

          <button
            onClick={onExportCSV}
            className="flex items-center space-x-2 px-3 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors"
            aria-label="Exporter en CSV"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">CSV</span>
          </button>
        </div>

        {/* Contrôles secondaires */}
        <div className="flex items-center space-x-4">
          {/* Sélecteur de vitesse */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 dark:text-gray-300 hidden md:inline">
              Vitesse:
            </span>
            <div className="flex rounded-md border border-gray-200 dark:border-gray-600">
              <button
                onClick={() => onSpeedChange(1)}
                className={`
                  px-3 py-1 text-sm rounded-l-md transition-colors
                  ${
                    state.playbackSpeed === 1
                      ? 'bg-blue-500 text-white'
                      : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600'
                  }
                `}
                aria-label="Vitesse normale"
                aria-pressed={state.playbackSpeed === 1}
              >
                1x
              </button>
              <button
                onClick={() => onSpeedChange(2)}
                className={`
                  px-3 py-1 text-sm rounded-r-md border-l border-gray-200 dark:border-gray-600 transition-colors
                  ${
                    state.playbackSpeed === 2
                      ? 'bg-blue-500 text-white'
                      : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600'
                  }
                `}
                aria-label="Vitesse double"
                aria-pressed={state.playbackSpeed === 2}
              >
                2x
              </button>
            </div>
          </div>

          {/* Sélecteur de plage */}
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <select
              value={dateRange}
              onChange={(e) => handleDateRangeChange(e.target.value)}
              className="border border-gray-200 dark:border-gray-600 rounded-md px-3 py-1 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              aria-label="Sélectionner la plage de dates"
            >
              <option value="30m">30 min</option>
              <option value="1h">1 heure</option>
              <option value="24h">24 heures</option>
              <option value="custom">Personnalisé</option>
            </select>
          </div>

          {/* Bouton filtres */}
          <button
            onClick={onFiltersOpen}
            className="flex items-center space-x-2 px-3 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors"
            aria-label="Ouvrir les filtres"
          >
            <Filter className="w-4 h-4" />
            <span className="hidden lg:inline">Filtres</span>
          </button>
        </div>
      </div>

      {/* Indicateur de statut */}
      <div className="flex items-center justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center space-x-2">
          <div
            className={`w-2 h-2 rounded-full ${state.isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}
          ></div>
          <span>{state.isLive ? 'En direct' : 'En pause'}</span>
        </div>
        <span>
          Dernière mise à jour:{' '}
          {isClient ? state.lastUpdate.toLocaleTimeString(locale) : '--:--:--'}
        </span>
      </div>
    </div>
  );
};
