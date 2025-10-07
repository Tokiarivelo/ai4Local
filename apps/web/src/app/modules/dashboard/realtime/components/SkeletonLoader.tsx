'use client';

import { FC } from 'react';
import { SkeletonLoaderProps } from '../types';

export const SkeletonLoader: FC<SkeletonLoaderProps> = ({ variant, count = 1, className = '' }) => {
  const renderSkeleton = () => {
    switch (variant) {
      case 'kpi':
        return (
          <div
            className={`p-6 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 ${className}`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded animate-pulse w-24"></div>
              <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <div className="h-8 bg-gray-200 dark:bg-gray-600 rounded animate-pulse w-20 mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded animate-pulse w-16"></div>
              </div>
              <div className="w-16 h-8 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
            </div>
          </div>
        );

      case 'chart':
        return (
          <div
            className={`p-6 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 ${className}`}
          >
            <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded animate-pulse w-32 mb-4"></div>
            <div className="h-64 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
          </div>
        );

      case 'activity':
        return (
          <div className={`p-4 border-b border-gray-200 dark:border-gray-700 ${className}`}>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full animate-pulse"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded animate-pulse w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded animate-pulse w-1/2"></div>
              </div>
            </div>
          </div>
        );

      case 'text':
      default:
        return (
          <div
            className={`h-4 bg-gray-200 dark:bg-gray-600 rounded animate-pulse ${className}`}
          ></div>
        );
    }
  };

  return (
    <>
      {Array.from({ length: count }, (_, index) => (
        <div key={index}>{renderSkeleton()}</div>
      ))}
    </>
  );
};
