'use client';

import React from 'react';
import { LucideIcon, ArrowUpIcon, ArrowDownIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/modules/ui/card';

export interface StatCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease';
  icon: LucideIcon;
  description: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  description,
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground flex items-center mt-1">
          {changeType === 'increase' ? (
            <ArrowUpIcon className="w-3 h-3 text-green-500 mr-1" />
          ) : (
            <ArrowDownIcon className="w-3 h-3 text-red-500 mr-1" />
          )}
          <span className={changeType === 'increase' ? 'text-green-600' : 'text-red-600'}>
            {change}
          </span>
          <span className="ml-1">{description}</span>
        </p>
      </CardContent>
    </Card>
  );
};
