'use client';

import { FC, useState, useCallback } from 'react';
import {
  Activity,
  Users,
  TrendingUp,
  Target,
  Search,
  Moon,
  Sun,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
} from 'lucide-react';
import { useRealtime } from '../hooks/useRealtime';
import { useRealtimeCharts } from '../hooks/useRealtimeCharts';
import { KpiCard } from './KpiCard';
import { ActivityFeed } from './ActivityFeed';
import { RealtimeControls } from './RealtimeControls';
import { LineChart } from './LineChart';
import { BarChart } from './BarChart';

interface RealtimePageProps {
  className?: string;
}

export const RealtimePage: FC<RealtimePageProps> = ({ className = '' }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [helpModalOpen, setHelpModalOpen] = useState(false);

  const {
    state,
    activities,
    kpis,
    toggleLive,
    setPlaybackSpeed,
    refreshNow,
    markAsRead,
    setState,
  } = useRealtime({
    mockMode: true,
    updateInterval: 5000,
    onMessage: (event) => {
      console.log('Nouvel événement:', event);
    },
  });

  const { lineChartData, barChartData, resetData } = useRealtimeCharts({
    updateInterval: state.isLive ? 5000 : 0,
    maxDataPoints: 10,
  });

  const handleExportCSV = useCallback(() => {
    const csvData = activities.map((activity) => ({
      timestamp: new Date(activity.timestamp).toISOString(),
      type: activity.type,
      message: activity.message,
      status: activity.status,
    }));

    const csv = [
      'timestamp,type,message,status',
      ...csvData.map((row) => `${row.timestamp},${row.type},"${row.message}",${row.status}`),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai4local-realtime-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [activities]);

  const handleDateRangeChange = useCallback(
    (range: { start: Date; end: Date }) => {
      setState((prev) => ({
        ...prev,
        filters: {
          ...prev.filters,
          dateRange: range,
        },
      }));
    },
    [setState]
  );

  const handleRefreshNow = useCallback(() => {
    refreshNow();
    resetData();
  }, [refreshNow, resetData]);

  // Icônes pour les KPI
  const kpiIcons = [
    <Activity key="activity" className="w-5 h-5 text-blue-500" />,
    <Users key="users" className="w-5 h-5 text-green-500" />,
    <TrendingUp key="trending" className="w-5 h-5 text-purple-500" />,
    <Target key="target" className="w-5 h-5 text-orange-500" />,
  ];

  return (
    <div
      className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${darkMode ? 'dark' : ''} ${className}`}
    >
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 lg:hidden"
              aria-label="Basculer la barre latérale"
            >
              {sidebarCollapsed ? (
                <ChevronRight className="w-5 h-5" />
              ) : (
                <ChevronLeft className="w-5 h-5" />
              )}
            </button>

            <nav aria-label="Fil d'Ariane">
              <ol className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <li>
                  <a href="/" className="hover:text-gray-700 dark:hover:text-gray-200">
                    Accueil
                  </a>
                </li>
                <li>/</li>
                <li className="text-gray-900 dark:text-white font-medium">Realtime</li>
              </ol>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            {/* Recherche globale */}
            <div className="relative hidden md:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                placeholder="Rechercher..."
                className="pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                aria-label="Recherche globale"
              />
            </div>

            {/* Toggle dark mode */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label={darkMode ? 'Activer le mode clair' : 'Activer le mode sombre'}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Avatar utilisateur */}
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
              <span className="text-white text-sm font-medium">U</span>
            </div>
          </div>
        </div>
      </header>

      {/* Contrôles temps réel */}
      <RealtimeControls
        state={state}
        onToggleLive={toggleLive}
        onRefreshNow={handleRefreshNow}
        onExportCSV={handleExportCSV}
        onSpeedChange={setPlaybackSpeed}
        onDateRangeChange={handleDateRangeChange}
        onFiltersOpen={() => setFiltersOpen(true)}
      />

      <div className="flex">
        {/* Contenu principal */}
        <main className="flex-1 p-6">
          {/* KPIs Hero */}
          <section className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {kpis.map((kpi, index) => (
                <KpiCard key={`${kpi.title}-${index}`} {...kpi} icon={kpiIcons[index]} />
              ))}
            </div>
          </section>

          {/* Zone graphiques avec vrais composants Recharts */}
          <section className="mb-8">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {/* LineChart avec données temps réel */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Visiteurs / Engagements
                  {state.isLive && (
                    <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                      Live
                    </span>
                  )}
                </h3>
                <LineChart data={lineChartData} />
              </div>

              {/* BarChart avec données temps réel */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Conversions par canal
                  {state.isLive && (
                    <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                      Live
                    </span>
                  )}
                </h3>
                <BarChart data={barChartData} />
              </div>
            </div>
          </section>
        </main>

        {/* Feed d'activité - Sidebar droite sur desktop, section mobile */}
        <aside className="w-full lg:w-96 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 lg:block">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Activité temps réel
              </h2>
              <button
                onClick={() => setHelpModalOpen(true)}
                className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label="Aide"
              >
                <HelpCircle className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <ActivityFeed
              activities={activities}
              onMarkAsRead={markAsRead}
              onView={(event) => console.log('Voir événement:', event)}
              onCancel={(id) => console.log('Annuler événement:', id)}
            />
          </div>
        </aside>
      </div>

      {/* Help Card Modal */}
      {helpModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Guide des KPIs
            </h3>
            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
              <p>
                <strong>Campagnes actives:</strong> Nombre de campagnes en cours d'exécution
              </p>
              <p>
                <strong>Impressions (24h):</strong> Nombre total d'affichages sur 24h
              </p>
              <p>
                <strong>Engagement rate:</strong> Taux d'interaction moyen
              </p>
              <p>
                <strong>Conversions (24h):</strong> Nombre d'actions complétées
              </p>
            </div>
            <div className="flex justify-end mt-6 space-x-3">
              <button
                onClick={() => setHelpModalOpen(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
              >
                Fermer
              </button>
              <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                Voir la doc
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
