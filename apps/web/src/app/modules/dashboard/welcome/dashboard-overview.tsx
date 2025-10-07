'use client';

import React from 'react';
import { DashboardHeader } from './dashboard-header';
import { StatsOverview } from './stats-overview';
import { RecentCampaigns, Campaign } from './recent-campaigns';
import { RecentActivities, Activity } from './recent-activities';
import { QuickActions } from './quick-actions';
import { StatCardProps } from '@/app/modules/ui/stat-card';

interface DashboardOverviewProps {
  stats?: StatCardProps[];
  campaigns?: Campaign[];
  activities?: Activity[];
  onAnalyticsClick?: () => void;
  onDateFilterClick?: () => void;
  onViewAllCampaigns?: () => void;
}

/**
 * Composant principal du tableau de bord
 * Agrège tous les sous-composants du dashboard
 */
export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  stats,
  campaigns,
  activities,
  onAnalyticsClick,
  onDateFilterClick,
  onViewAllCampaigns,
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <DashboardHeader onAnalyticsClick={onAnalyticsClick} onDateFilterClick={onDateFilterClick} />

      {/* Stats cards */}
      <StatsOverview stats={stats} />

      {/* Main content grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        <RecentCampaigns campaigns={campaigns} onViewAll={onViewAllCampaigns} />
        <RecentActivities activities={activities} />
      </div>

      {/* Quick actions */}
      <QuickActions />
    </div>
  );
};
