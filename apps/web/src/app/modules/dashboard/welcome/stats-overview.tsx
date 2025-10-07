'use client';

import React from 'react';
import { Mail, Users, MousePointer, DollarSign } from 'lucide-react';
import { StatCard, StatCardProps } from '@/app/modules/ui/stat-card';

const defaultStats: StatCardProps[] = [
  {
    title: 'Campagnes actives',
    value: '12',
    change: '+20%',
    changeType: 'increase',
    icon: Mail,
    description: 'vs mois dernier',
  },
  {
    title: 'Clients actifs',
    value: '2,847',
    change: '+12%',
    changeType: 'increase',
    icon: Users,
    description: 'vs mois dernier',
  },
  {
    title: "Taux d'ouverture",
    value: '24.5%',
    change: '-2%',
    changeType: 'decrease',
    icon: MousePointer,
    description: 'vs mois dernier',
  },
  {
    title: 'Revenus générés',
    value: '€45,231',
    change: '+18%',
    changeType: 'increase',
    icon: DollarSign,
    description: 'vs mois dernier',
  },
];

interface StatsOverviewProps {
  stats?: StatCardProps[];
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ stats = defaultStats }) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};
