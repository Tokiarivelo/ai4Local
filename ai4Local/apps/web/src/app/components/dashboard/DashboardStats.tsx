import React from 'react';
import { StatCard } from '@/components/ui/stats';
import { StatGroup } from '@/components/ui/stats';
import { Stat } from '@/lib/types/dashboard';

interface DashboardStatsProps {
  stats: Stat[];
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
  return (
    <StatGroup>
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          title={stat.title}
          value={stat.value}
          change={stat.change}
          changeType={stat.changeType}
          description={stat.description}
        />
      ))}
    </StatGroup>
  );
};

export default DashboardStats;