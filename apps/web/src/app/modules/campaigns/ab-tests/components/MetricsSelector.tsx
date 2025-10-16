/**
 * Metrics Selector Component
 * Choose target KPI for test success
 */

'use client';

import React from 'react';
import { TrendingUp, MousePointerClick, DollarSign, Users, Heart } from 'lucide-react';
import { Label } from '@/app/modules/ui/label';
import { RadioGroup, RadioGroupItem } from '@/app/modules/ui/radio-group';
import { cn } from '@/lib/utils';
import type { MetricType } from '../types';
import { getMetricDisplayName } from '../utils/abtest-calculations';

interface MetricsSelectorProps {
  value: MetricType;
  onChange: (metric: MetricType) => void;
  disabled?: boolean;
}

const METRICS: Array<{
  value: MetricType;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}> = [
  {
    value: 'ctr',
    icon: MousePointerClick,
    description: 'Mesure le taux de clics par rapport aux impressions',
  },
  {
    value: 'conversions',
    icon: TrendingUp,
    description: 'Mesure le taux de conversion des clics en actions',
  },
  {
    value: 'cpa',
    icon: DollarSign,
    description: 'Coût par acquisition - plus bas est meilleur',
  },
  {
    value: 'ltv',
    icon: Users,
    description: 'Valeur vie client - revenus générés sur le long terme',
  },
  {
    value: 'engagement',
    icon: Heart,
    description: "Mesure l'engagement global avec le contenu",
  },
];

export function MetricsSelector({ value, onChange, disabled }: MetricsSelectorProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label className="text-base font-semibold">Métrique cible de succès</Label>
        <p className="text-sm text-muted-foreground mt-1">
          Choisissez la métrique qui déterminera la variante gagnante
        </p>
      </div>

      <RadioGroup
        value={value}
        onValueChange={(v) => onChange(v as MetricType)}
        disabled={disabled}
        className="grid gap-3"
      >
        {METRICS.map((metric) => {
          const Icon = metric.icon;
          const isSelected = value === metric.value;

          return (
            <label
              key={metric.value}
              className={cn(
                'flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-all',
                'hover:border-primary hover:bg-accent/50',
                isSelected && 'border-primary bg-accent',
                disabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              <RadioGroupItem value={metric.value} id={metric.value} className="mt-1" />
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-primary" />
                  <span className="font-medium">{getMetricDisplayName(metric.value)}</span>
                </div>
                <p className="text-sm text-muted-foreground">{metric.description}</p>
              </div>
            </label>
          );
        })}
      </RadioGroup>
    </div>
  );
}
