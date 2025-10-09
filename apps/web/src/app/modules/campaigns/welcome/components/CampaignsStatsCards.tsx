/**
 * Cartes de statistiques pour les campagnes
 * Vue d'ensemble des métriques principales
 */

'use client';

import { useMemo } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  DollarSign,
  Target,
  Eye,
  MousePointer,
  ShoppingCart,
  BarChart3,
  Percent,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/modules/ui/card';
import type { Campaign } from '../types';

// Interface pour les statistiques
interface CampaignStats {
  total: number;
  active: number;
  scheduled: number;
  paused: number;
  completed: number;
  failed: number;
  draft: number;
  totalSpent: number;
  totalBudget: number;
  totalImpressions: number;
  totalClicks: number;
  totalConversions: number;
  averageCTR: number;
  averageConversionRate: number;
  averageCPC: number;
}

interface CampaignsStatsCardsProps {
  stats: CampaignStats;
  loading?: boolean;
  className?: string;
}

// Configuration des cartes de stats
const statsConfig = [
  {
    key: 'total',
    title: 'Total campagnes',
    icon: BarChart3,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    darkBgColor: 'dark:bg-blue-900/20',
    format: (value: number) => value.toLocaleString('fr-FR'),
  },
  {
    key: 'active',
    title: 'Actives',
    icon: Activity,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    darkBgColor: 'dark:bg-green-900/20',
    format: (value: number) => value.toLocaleString('fr-FR'),
  },
  {
    key: 'totalImpressions',
    title: 'Impressions totales',
    icon: Eye,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    darkBgColor: 'dark:bg-purple-900/20',
    format: (value: number) => {
      if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
      if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
      return value.toLocaleString('fr-FR');
    },
  },
  {
    key: 'totalClicks',
    title: 'Clics totaux',
    icon: MousePointer,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    darkBgColor: 'dark:bg-orange-900/20',
    format: (value: number) => {
      if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
      return value.toLocaleString('fr-FR');
    },
  },
  {
    key: 'totalConversions',
    title: 'Conversions totales',
    icon: Target,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    darkBgColor: 'dark:bg-indigo-900/20',
    format: (value: number) => value.toLocaleString('fr-FR'),
  },
  {
    key: 'totalSpent',
    title: 'Budget dépensé',
    icon: DollarSign,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    darkBgColor: 'dark:bg-red-900/20',
    format: (value: number) =>
      `${value.toLocaleString('fr-FR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })} €`,
  },
  {
    key: 'averageCTR',
    title: 'CTR moyen',
    icon: Percent,
    color: 'text-teal-600',
    bgColor: 'bg-teal-50',
    darkBgColor: 'dark:bg-teal-900/20',
    format: (value: number) => `${value.toFixed(2)}%`,
  },
  {
    key: 'averageConversionRate',
    title: 'Taux de conversion moyen',
    icon: ShoppingCart,
    color: 'text-pink-600',
    bgColor: 'bg-pink-50',
    darkBgColor: 'dark:bg-pink-900/20',
    format: (value: number) => `${value.toFixed(2)}%`,
  },
];

// Composant de skeleton pour le chargement
function StatsCardSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="h-4 bg-muted rounded w-1/2" />
        <div className="h-4 w-4 bg-muted rounded" />
      </CardHeader>
      <CardContent>
        <div className="h-8 bg-muted rounded w-3/4 mb-2" />
        <div className="h-3 bg-muted rounded w-1/2" />
      </CardContent>
    </Card>
  );
}

// Composant de carte de statistique individuelle
interface StatCardProps {
  title: string;
  value: number;
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
  darkBgColor: string;
  format: (value: number) => string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

function StatCard({
  title,
  value,
  icon: Icon,
  color,
  bgColor,
  darkBgColor,
  format,
  trend,
}: StatCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className={`p-2 rounded-lg ${bgColor} ${darkBgColor}`}>
          <Icon className={`h-4 w-4 ${color}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground mb-1">{format(value)}</div>
        {trend && (
          <div className="flex items-center text-xs text-muted-foreground">
            {trend.isPositive ? (
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
            ) : (
              <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
            )}
            <span className={trend.isPositive ? 'text-green-600' : 'text-red-600'}>
              {Math.abs(trend.value).toFixed(1)}%
            </span>
            <span className="ml-1">vs. période précédente</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function CampaignsStatsCards({
  stats,
  loading = false,
  className = '',
}: CampaignsStatsCardsProps) {
  // Calcul des tendances (simulation)
  const trends = useMemo(() => {
    return {
      total: { value: 12.5, isPositive: true },
      active: { value: 8.3, isPositive: true },
      totalImpressions: { value: 15.7, isPositive: true },
      totalClicks: { value: 22.1, isPositive: true },
      totalConversions: { value: 18.9, isPositive: true },
      totalSpent: { value: 5.4, isPositive: false },
      averageCTR: { value: 2.3, isPositive: true },
      averageConversionRate: { value: 1.8, isPositive: true },
    };
  }, []);

  // Calcul des métriques dérivées
  const budgetUtilization = useMemo(() => {
    return stats.totalBudget > 0 ? (stats.totalSpent / stats.totalBudget) * 100 : 0;
  }, [stats.totalSpent, stats.totalBudget]);

  if (loading) {
    return (
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4 ${className}`}
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <StatsCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Métriques principales */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Vue d'ensemble</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statsConfig.map((config) => (
            <StatCard
              key={config.key}
              title={config.title}
              value={stats[config.key as keyof CampaignStats] as number}
              icon={config.icon}
              color={config.color}
              bgColor={config.bgColor}
              darkBgColor={config.darkBgColor}
              format={config.format}
              trend={trends[config.key as keyof typeof trends]}
            />
          ))}
        </div>
      </div>

      {/* Métriques secondaires */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Répartition par statut</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {/* Statuts des campagnes */}
          <Card className="hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-4">
              <div className="text-sm font-medium text-muted-foreground">Programmées</div>
              <div className="text-xl font-bold text-foreground">{stats.scheduled}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {((stats.scheduled / stats.total) * 100).toFixed(1)}% du total
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-4">
              <div className="text-sm font-medium text-muted-foreground">En pause</div>
              <div className="text-xl font-bold text-foreground">{stats.paused}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {((stats.paused / stats.total) * 100).toFixed(1)}% du total
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-4">
              <div className="text-sm font-medium text-muted-foreground">Terminées</div>
              <div className="text-xl font-bold text-foreground">{stats.completed}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {((stats.completed / stats.total) * 100).toFixed(1)}% du total
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-4">
              <div className="text-sm font-medium text-muted-foreground">Échouées</div>
              <div className="text-xl font-bold text-foreground">{stats.failed}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {((stats.failed / stats.total) * 100).toFixed(1)}% du total
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-4">
              <div className="text-sm font-medium text-muted-foreground">Brouillons</div>
              <div className="text-xl font-bold text-foreground">{stats.draft}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {((stats.draft / stats.total) * 100).toFixed(1)}% du total
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-4">
              <div className="text-sm font-medium text-muted-foreground">Utilisation budget</div>
              <div className="text-xl font-bold text-foreground">
                {budgetUtilization.toFixed(1)}%
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {stats.totalSpent.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} € /{' '}
                {stats.totalBudget.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} €
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
