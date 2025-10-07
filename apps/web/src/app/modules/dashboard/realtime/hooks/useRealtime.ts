import { useState, useEffect, useCallback, useRef } from 'react';
import { ActivityEvent, RealtimeState, KpiData } from '../types';

interface UseRealtimeOptions {
  mockMode?: boolean;
  updateInterval?: number;
  onMessage?: (event: ActivityEvent) => void;
}

export const useRealtime = (options: UseRealtimeOptions = {}) => {
  const { mockMode = true, updateInterval = 5000, onMessage } = options;
  const [state, setState] = useState<RealtimeState>({
    isLive: true,
    playbackSpeed: 1,
    filters: {
      channels: [],
      status: [],
      tags: [],
      owners: [],
      dateRange: {
        start: new Date(Date.now() - 24 * 60 * 60 * 1000),
        end: new Date(),
      },
    },
    lastUpdate: new Date(),
  });

  const [activities, setActivities] = useState<ActivityEvent[]>([]);
  const [kpis, setKpis] = useState<KpiData[]>([]);
  const intervalRef = useRef<NodeJS.Timeout>();

  // Simulation de données mock
  const generateMockEvent = useCallback((): ActivityEvent => {
    const types: ActivityEvent['type'][] = ['publishing', 'error', 'validation', 'conversion'];
    const statuses: ActivityEvent['status'][] = ['success', 'warning', 'error', 'info'];

    return {
      id: `event-${Date.now()}-${Math.random()}`,
      type: types[Math.floor(Math.random() * types.length)],
      message: `Événement de test généré automatiquement`,
      timestamp: Date.now(),
      status: statuses[Math.floor(Math.random() * statuses.length)],
      read: false,
    };
  }, []);

  const generateMockKpis = useCallback(
    (): KpiData[] => [
      {
        title: 'Campagnes actives',
        value: Math.floor(Math.random() * 50) + 10,
        delta: Math.floor(Math.random() * 20) - 10,
        sparklineData: Array.from({ length: 7 }, () => Math.random() * 100),
      },
      {
        title: 'Impressions (24h)',
        value: (Math.random() * 100000).toLocaleString('fr-FR'),
        delta: Math.floor(Math.random() * 30) - 15,
        sparklineData: Array.from({ length: 7 }, () => Math.random() * 100),
      },
      {
        title: 'Engagement rate',
        value: `${(Math.random() * 10 + 2).toFixed(1)}%`,
        delta: Math.floor(Math.random() * 10) - 5,
      },
      {
        title: 'Conversions (24h)',
        value: Math.floor(Math.random() * 500) + 50,
        delta: Math.floor(Math.random() * 25) - 12,
      },
    ],
    []
  );

  // Démarrage/arrêt du temps réel
  const toggleLive = useCallback(() => {
    setState((prev) => ({ ...prev, isLive: !prev.isLive }));
  }, []);

  const setPlaybackSpeed = useCallback((speed: 1 | 2) => {
    setState((prev) => ({ ...prev, playbackSpeed: speed }));
  }, []);

  // Gestion des événements temps réel
  useEffect(() => {
    if (!state.isLive || !mockMode) return;

    const interval = updateInterval / state.playbackSpeed;

    intervalRef.current = setInterval(() => {
      const newEvent = generateMockEvent();
      setActivities((prev) => [newEvent, ...prev.slice(0, 99)]); // Garde les 100 derniers
      setKpis(generateMockKpis());
      setState((prev) => ({ ...prev, lastUpdate: new Date() }));

      onMessage?.(newEvent);
    }, interval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [
    state.isLive,
    state.playbackSpeed,
    mockMode,
    updateInterval,
    generateMockEvent,
    generateMockKpis,
    onMessage,
  ]);

  // Initialisation des données
  useEffect(() => {
    setKpis(generateMockKpis());
  }, [generateMockKpis]);

  const refreshNow = useCallback(() => {
    const newEvent = generateMockEvent();
    setActivities((prev) => [newEvent, ...prev.slice(0, 99)]);
    setKpis(generateMockKpis());
    setState((prev) => ({ ...prev, lastUpdate: new Date() }));
  }, [generateMockEvent, generateMockKpis]);

  const markAsRead = useCallback((eventId: string) => {
    setActivities((prev) =>
      prev.map((event) => (event.id === eventId ? { ...event, read: true } : event))
    );
  }, []);

  return {
    state,
    activities,
    kpis,
    toggleLive,
    setPlaybackSpeed,
    refreshNow,
    markAsRead,
    setState,
  };
};
