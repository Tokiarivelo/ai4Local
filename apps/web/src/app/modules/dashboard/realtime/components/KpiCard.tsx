'use client';

import { FC, ReactNode } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { KpiData } from '../types';
import { SkeletonLoader } from './SkeletonLoader';

interface KpiCardProps extends KpiData {
  className?: string;
}

export const KpiCard: FC<KpiCardProps> = ({
  title,
  value,
  delta,
  sparklineData,
  icon,
  loading = false,
  error,
  className = '',
}) => {
  if (loading) {
    return <SkeletonLoader variant="kpi" className={className} />;
  }

  if (error) {
    return (
      <div
        className={`p-6 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 ${className}`}
      >
        <p className="text-red-600 dark:text-red-400 text-sm">Erreur: {error}</p>
      </div>
    );
  }

  const getTrendIcon = () => {
    if (!delta) return <Minus className="w-4 h-4 text-gray-400" />;
    if (delta > 0) return <TrendingUp className="w-4 h-4 text-green-500" />;
    return <TrendingDown className="w-4 h-4 text-red-500" />;
  };

  const getTrendColor = () => {
    if (!delta) return 'text-gray-500';
    return delta > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
  };

  return (
    <div
      className={`
        p-6 rounded-lg border border-gray-200 dark:border-gray-700 
        bg-white dark:bg-gray-800 shadow-sm hover:shadow-md 
        transition-shadow duration-200 ${className}
      `}
      role="article"
      aria-labelledby={`kpi-title-${title}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3
          id={`kpi-title-${title}`}
          className="text-sm font-medium text-gray-600 dark:text-gray-300"
        >
          {title}
        </h3>
        {icon && <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700">{icon}</div>}
      </div>

      <div className="flex items-end justify-between">
        <div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{value}</p>
          {delta !== undefined && (
            <div className={`flex items-center space-x-1 ${getTrendColor()}`}>
              {getTrendIcon()}
              <span className="text-sm font-medium">{Math.abs(delta)}%</span>
            </div>
          )}
        </div>

        {sparklineData && sparklineData.length > 0 && (
          <div className="w-16 h-8">
            <svg
              viewBox="0 0 64 32"
              className="w-full h-full"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <polyline
                points={sparklineData
                  .map(
                    (value, index) =>
                      `${(index / (sparklineData.length - 1)) * 64},${32 - (value / 100) * 32}`
                  )
                  .join(' ')}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-blue-500"
              />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};
