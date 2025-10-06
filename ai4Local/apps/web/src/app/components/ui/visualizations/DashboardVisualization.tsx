import React from 'react';
import { DashboardStats } from '../dashboard/DashboardStats';
import { RecentCampaigns } from '../dashboard/RecentCampaigns';
import { RecentActivity } from '../dashboard/RecentActivity';
import { DashboardQuickActions } from '../dashboard/DashboardQuickActions';
import { StatGroup } from '../ui/stats/StatGroup';
import { BarChart } from '../ui/charts/BarChart';
import { LineChart } from '../ui/charts/LineChart';
import { PieChart } from '../ui/charts/PieChart';
import { useDashboardData } from '../../../hooks/useDashboardData';

const DashboardVisualization: React.FC = () => {
  const { stats, recentCampaigns, recentActivities } = useDashboardData();

  return (
    <div className="space-y-6">
      <DashboardStats stats={stats} />
      <StatGroup stats={stats} />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentCampaigns campaigns={recentCampaigns} />
        </div>
        <RecentActivity activities={recentActivities} />
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="col-span-1">
          <BarChart data={stats} />
        </div>
        <div className="col-span-1">
          <LineChart data={stats} />
        </div>
        <div className="col-span-1">
          <PieChart data={stats} />
        </div>
      </div>
      <DashboardQuickActions />
    </div>
  );
};

export default DashboardVisualization;