'use client';

import React from 'react';
import { TrendingUp, Users, MousePointer, Target, Calendar } from 'lucide-react';
import { Card } from '@/app/modules/ui/card';
import type { Template } from '../../types/template.types';
import { formatTemplateDate, calculatePerformanceScore } from '../../utils/templateHelpers';

interface TemplateStatsProps {
  template: Template;
}

export function TemplateStats({ template }: TemplateStatsProps) {
  const { stats } = template;
  const performanceScore = calculatePerformanceScore(template);

  const statCards = [
    {
      label: 'Utilisations',
      value: stats.usageCount.toString(),
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950',
    },
    {
      label: 'CTR Moyen',
      value: stats.averageCTR ? `${stats.averageCTR}%` : 'N/A',
      icon: MousePointer,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-950',
    },
    {
      label: 'Taux de conversion',
      value: stats.averageConversion ? `${stats.averageConversion}%` : 'N/A',
      icon: Target,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-950',
    },
    {
      label: 'Taux de réussite',
      value: stats.successRate ? `${stats.successRate}%` : 'N/A',
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-950',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Performance Score */}
      <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold mb-2">Score de performance</h3>
            <p className="text-sm text-muted-foreground">Basé sur l'utilisation et les résultats</p>
          </div>
          <div className="text-5xl font-bold text-primary">{performanceScore}</div>
        </div>
        <div className="mt-4">
          <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-3">
            <div
              className="bg-primary h-3 rounded-full transition-all duration-500"
              style={{ width: `${performanceScore}%` }}
            />
          </div>
        </div>
      </Card>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-2 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Additional Info */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Informations supplémentaires</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">
              <span className="text-muted-foreground">Créé:</span>{' '}
              {formatTemplateDate(template.createdAt)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">
              <span className="text-muted-foreground">Modifié:</span>{' '}
              {formatTemplateDate(template.updatedAt)}
            </span>
          </div>
          {stats.lastUsedAt && (
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">
                <span className="text-muted-foreground">Dernière utilisation:</span>{' '}
                {formatTemplateDate(stats.lastUsedAt)}
              </span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <span className="text-sm">
              <span className="text-muted-foreground">Partagé:</span>{' '}
              {template.isShared ? 'Oui' : 'Non'}
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}
