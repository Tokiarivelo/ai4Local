'use client';

import { useState, useEffect, useCallback } from 'react';

interface ChartDataPoint {
  time: string;
  visitors: number;
  engagements: number;
}

interface ChannelData {
  name: string;
  conversions: number;
  color: string;
  trend: number;
}

interface UseRealtimeChartsOptions {
  updateInterval?: number;
  maxDataPoints?: number;
}

export const useRealtimeCharts = (options: UseRealtimeChartsOptions = {}) => {
  const { updateInterval = 5000, maxDataPoints = 10 } = options;

  const [lineChartData, setLineChartData] = useState<ChartDataPoint[]>([
    { time: '14:00', visitors: 45, engagements: 12 },
    { time: '14:15', visitors: 52, engagements: 18 },
    { time: '14:30', visitors: 38, engagements: 15 },
    { time: '14:45', visitors: 67, engagements: 24 },
    { time: '15:00', visitors: 73, engagements: 31 },
    { time: '15:15', visitors: 61, engagements: 28 },
    { time: '15:30', visitors: 84, engagements: 35 },
    { time: '15:45', visitors: 92, engagements: 42 },
  ]);

  const [barChartData, setBarChartData] = useState<ChannelData[]>([
    { name: 'Email Marketing', conversions: 156, color: '#3B82F6', trend: 12.5 },
    { name: 'Social Media', conversions: 134, color: '#10B981', trend: -3.2 },
    { name: 'SEO Organique', conversions: 98, color: '#8B5CF6', trend: 8.7 },
    { name: 'Publicités payantes', conversions: 87, color: '#F59E0B', trend: 15.3 },
    { name: 'Référencement', conversions: 45, color: '#EF4444', trend: -1.8 },
  ]);

  const generateNewDataPoint = useCallback((): ChartDataPoint => {
    const now = new Date();
    const timeString = now.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const lastPoint = lineChartData[lineChartData.length - 1];
    const baseVisitors = lastPoint?.visitors || 50;
    const baseEngagements = lastPoint?.engagements || 20;

    // Variation aléatoire avec tendance
    const visitorsChange = (Math.random() - 0.5) * 20;
    const engagementsChange = (Math.random() - 0.5) * 10;

    return {
      time: timeString,
      visitors: Math.max(0, Math.round(baseVisitors + visitorsChange)),
      engagements: Math.max(0, Math.round(baseEngagements + engagementsChange)),
    };
  }, [lineChartData]);

  const updateBarChartData = useCallback(() => {
    setBarChartData((prevData) =>
      prevData.map((channel) => ({
        ...channel,
        conversions: Math.max(0, channel.conversions + Math.round((Math.random() - 0.5) * 10)),
        trend: parseFloat(((Math.random() - 0.5) * 30).toFixed(1)),
      }))
    );
  }, []);

  const updateLineChartData = useCallback(() => {
    const newPoint = generateNewDataPoint();
    setLineChartData((prevData) => {
      const newData = [...prevData, newPoint];
      return newData.length > maxDataPoints ? newData.slice(-maxDataPoints) : newData;
    });
  }, [generateNewDataPoint, maxDataPoints]);

  useEffect(() => {
    const lineInterval = setInterval(updateLineChartData, updateInterval);
    const barInterval = setInterval(updateBarChartData, updateInterval * 2); // Mise à jour moins fréquente

    return () => {
      clearInterval(lineInterval);
      clearInterval(barInterval);
    };
  }, [updateLineChartData, updateBarChartData, updateInterval]);

  const resetData = useCallback(() => {
    setLineChartData([
      { time: '14:00', visitors: 45, engagements: 12 },
      { time: '14:15', visitors: 52, engagements: 18 },
      { time: '14:30', visitors: 38, engagements: 15 },
      { time: '14:45', visitors: 67, engagements: 24 },
    ]);

    setBarChartData([
      { name: 'Email Marketing', conversions: 156, color: '#3B82F6', trend: 12.5 },
      { name: 'Social Media', conversions: 134, color: '#10B981', trend: -3.2 },
      { name: 'SEO Organique', conversions: 98, color: '#8B5CF6', trend: 8.7 },
      { name: 'Publicités payantes', conversions: 87, color: '#F59E0B', trend: 15.3 },
      { name: 'Référencement', conversions: 45, color: '#EF4444', trend: -1.8 },
    ]);
  }, []);

  return {
    lineChartData,
    barChartData,
    resetData,
  };
};
