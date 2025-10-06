import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardStats from '@/components/dashboard/DashboardStats';
import DashboardQuickActions from '@/components/dashboard/DashboardQuickActions';
import RecentCampaigns from '@/components/dashboard/RecentCampaigns';
import RecentActivity from '@/components/dashboard/RecentActivity';
import { useDashboardData } from '@/hooks/useDashboardData';

export default function DashboardPage() {
  const { stats, recentCampaigns, recentActivities } = useDashboardData();

  return (
    <DashboardLayout>
      <div className='space-y-6'>
        <DashboardHeader />
        <DashboardStats stats={stats} />
        <DashboardQuickActions />
        
        <div className='grid gap-6 lg:grid-cols-3'>
          <RecentCampaigns campaigns={recentCampaigns} />
          <RecentActivity activities={recentActivities} />
        </div>
      </div>
    </DashboardLayout>
  );
}