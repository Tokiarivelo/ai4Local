import React from 'react';
import { DashboardHeader } from '../dashboard/DashboardHeader';
import { DashboardStats } from '../dashboard/DashboardStats';
import { DashboardQuickActions } from '../dashboard/DashboardQuickActions';
import { RecentCampaigns } from '../dashboard/RecentCampaigns';
import { RecentActivity } from '../dashboard/RecentActivity';

interface DashboardLayoutProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: 'Admin' | 'User';
    permissions: string[];
  };
  children: React.ReactNode;
}

/**
 * DashboardLayout component serves as the layout for the dashboard,
 * wrapping the main content and providing a consistent structure.
 *
 * @param {DashboardLayoutProps} props - The props for the layout component.
 * @param {Object} props.user - The user object containing user details.
 * @param {React.ReactNode} props.children - The main content to be displayed within the layout.
 */
const DashboardLayout: React.FC<DashboardLayoutProps> = ({ user, children }) => {
  return (
    <div className="flex flex-col h-screen">
      <DashboardHeader user={user} />
      <main className="flex-1 p-6 bg-gray-100">
        {children}
      </main>
      <div className="p-6">
        <DashboardStats />
        <DashboardQuickActions />
        <RecentCampaigns />
        <RecentActivity />
      </div>
    </div>
  );
};

export default DashboardLayout;