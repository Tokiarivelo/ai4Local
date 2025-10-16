/**
 * A/B Tests Header Component
 * Page header with stats and quick actions
 */

'use client';

import React from 'react';
import { TrendingUp, Play, CheckCircle, Archive } from 'lucide-react';
import { Card, CardContent } from '@/app/modules/ui/card';
import { cn } from '@/lib/utils';
import type { AbTest } from '../types';

interface HeaderProps {
  tests: AbTest[];
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  trend?: number;
  className?: string;
}

function StatCard({ title, value, icon: Icon, trend, className }: StatCardProps) {
  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {trend !== undefined && (
              <p
                className={cn('text-xs font-medium', trend > 0 ? 'text-green-600' : 'text-red-600')}
              >
                {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% ce mois
              </p>
            )}
          </div>
          <div className="p-3 bg-primary/10 rounded-full">
            <Icon className="w-6 h-6 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function Header({ tests }: HeaderProps) {
  const stats = {
    total: tests.length,
    running: tests.filter((t) => t.status === 'running').length,
    completed: tests.filter((t) => t.status === 'completed').length,
    withWinner: tests.filter((t) => t.winner).length,
  };

  return (
    <div className="grid gap-4 md:grid-cols-4 mb-6">
      <StatCard title="Total des tests" value={stats.total} icon={TrendingUp} trend={12} />
      <StatCard
        title="Tests en cours"
        value={stats.running}
        icon={Play}
        className="border-blue-200 dark:border-blue-800"
      />
      <StatCard
        title="Tests terminés"
        value={stats.completed}
        icon={CheckCircle}
        className="border-green-200 dark:border-green-800"
      />
      <StatCard
        title="Avec gagnant"
        value={stats.withWinner}
        icon={Archive}
        className="border-purple-200 dark:border-purple-800"
      />
    </div>
  );
}
