'use client';

import React from 'react';
import { TrendingUp, Info } from 'lucide-react';
import { Card } from '@/app/modules/ui/card';
import { getCurrencySymbol } from './utils';

interface EstimationCardProps {
  budget: number;
  currency: string;
  duration: number;
  reach: number;
  isDailyBudget: boolean;
}

export function EstimationCard({
  budget,
  currency,
  duration,
  reach,
  isDailyBudget,
}: EstimationCardProps) {
  const calculateMetrics = () => {
    const cpm = budget > 0 && reach > 0 ? (budget / reach) * 1000 : 0;
    const dailyReach = duration > 0 ? reach / duration : reach;

    return {
      cpm: cpm.toFixed(2),
      dailyReach: Math.round(dailyReach),
      frequency: duration > 0 ? (duration * 1.2).toFixed(1) : '1.0',
    };
  };

  const metrics = calculateMetrics();

  if (duration === 0 || budget === 0) return null;

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="h-5 w-5 text-primary" />
        <h4 className="font-medium">Prévisions de performance</h4>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard value={reach.toLocaleString()} label="Personnes touchées" variant="primary" />
        <MetricCard value={metrics.dailyReach.toLocaleString()} label="Reach quotidien" />
        <MetricCard value={`${metrics.cpm} ${getCurrencySymbol(currency)}`} label="CPM estimé" />
        <MetricCard value={metrics.frequency} label="Fréquence" />
      </div>

      <div className="space-y-3">
        <RecommendationCard budget={budget} duration={duration} />
        <OptimizationGrid isDailyBudget={isDailyBudget} />
      </div>
    </Card>
  );
}

function MetricCard({
  value,
  label,
  variant = 'default',
}: {
  value: string;
  label: string;
  variant?: 'default' | 'primary';
}) {
  return (
    <div className="text-center p-4 bg-muted rounded-lg">
      <div
        className={`text-2xl font-bold ${
          variant === 'primary' ? 'text-primary' : 'text-foreground'
        }`}
      >
        {value}
      </div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}

function RecommendationCard({ budget, duration }: { budget: number; duration: number }) {
  return (
    <Card className="p-4 bg-blue-50 border-blue-200">
      <div className="flex items-start gap-2">
        <Info className="h-4 w-4 text-blue-600 mt-0.5" />
        <div>
          <div className="font-medium text-blue-900">Recommandations :</div>
          <div className="text-sm text-blue-800">
            {budget < 100 && <div>• Augmentez votre budget pour améliorer la portée.</div>}
            {duration > 30 && <div>• Une campagne longue permet un meilleur engagement.</div>}
            {duration < 7 && <div>• Une durée plus longue améliore la mémorisation.</div>}
          </div>
        </div>
      </div>
    </Card>
  );
}

function OptimizationGrid({ isDailyBudget }: { isDailyBudget: boolean }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
      <div className="space-y-2">
        <div className="font-medium">Optimisations suggérées :</div>
        <ul className="space-y-1 text-muted-foreground">
          <li>
            •{' '}
            {isDailyBudget ? 'Budget réparti uniformément' : 'Budget concentré pour impact maximal'}
          </li>
          <li>• Ciblage précis recommandé</li>
          <li>• A/B test pour optimiser les créatifs</li>
        </ul>
      </div>

      <div className="space-y-2">
        <div className="font-medium">Métriques clés à surveiller :</div>
        <ul className="space-y-1 text-muted-foreground">
          <li>• CTR (taux de clic)</li>
          <li>• Coût par acquisition</li>
          <li>• Fréquence d'exposition</li>
          <li>• Taux de conversion</li>
        </ul>
      </div>
    </div>
  );
}
