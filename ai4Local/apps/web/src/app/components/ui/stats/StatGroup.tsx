import React from 'react';
import { StatCard } from './StatCard';

interface StatGroupProps {
  stats: {
    title: string;
    value: string;
    change: string;
    changeType: 'increase' | 'decrease';
    description: string;
    icon: React.ElementType;
  }[];
}

export const StatGroup: React.FC<StatGroupProps> = ({ stats }) => {
  return (
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          title={stat.title}
          value={stat.value}
          change={stat.change}
          changeType={stat.changeType}
          description={stat.description}
          Icon={stat.icon}
        />
      ))}
    </div>
  );
};