/**
 * A/B Test Row Component
 * Displays a single test in the list with summary and actions
 */

'use client';

import React from 'react';
import {
  Play,
  Pause,
  Square,
  Archive,
  Edit,
  MoreVertical,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertCircle,
} from 'lucide-react';
import { Badge } from '@/app/modules/ui/badge';
import { Button } from '@/app/modules/ui/button';
import { Checkbox } from '@/app/modules/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/app/modules/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import type { AbTest, AbTestStatus } from '../types';
import { formatMetricValue, getMetricDisplayName } from '../utils/abtest-calculations';
import { getTestHealthStatus } from '../utils/sanity-checks';

interface AbTestRowProps {
  test: AbTest;
  selected: boolean;
  onSelect: (id: string) => void;
  onEdit: (test: AbTest) => void;
  onStart: (test: AbTest) => void;
  onPause: (test: AbTest) => void;
  onStop: (test: AbTest) => void;
  onArchive: (test: AbTest) => void;
  onViewResults: (test: AbTest) => void;
}

const STATUS_STYLES: Record<
  AbTestStatus,
  { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }
> = {
  draft: { variant: 'secondary', label: 'Brouillon' },
  running: { variant: 'default', label: 'En cours' },
  paused: { variant: 'outline', label: 'En pause' },
  completed: { variant: 'secondary', label: 'Terminé' },
  archived: { variant: 'outline', label: 'Archivé' },
};

const CHANNEL_COLORS: Record<string, string> = {
  email: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  sms: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  push: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  web: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
  social: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
};

export function AbTestRow({
  test,
  selected,
  onSelect,
  onEdit,
  onStart,
  onPause,
  onStop,
  onArchive,
  onViewResults,
}: AbTestRowProps) {
  const health = getTestHealthStatus(test);
  const hasMetrics = test.metrics && test.metrics.length > 0;

  // Calculate best performing variant
  const bestVariant = hasMetrics
    ? (test.metrics ?? []).reduce((best, current) =>
        (current?.[test.targetMetric] ?? -Infinity) > (best?.[test.targetMetric] ?? -Infinity)
          ? current
          : best
      )
    : null;

  const getTrendIcon = (variantId: string) => {
    if (!bestVariant) return Minus;
    if (variantId === bestVariant.variantId) return TrendingUp;
    return TrendingDown;
  };

  const getTrendColor = (variantId: string) => {
    if (!bestVariant) return 'text-muted-foreground';
    if (variantId === bestVariant.variantId) return 'text-green-600 dark:text-green-500';
    return 'text-red-600 dark:text-red-500';
  };

  return (
    <div
      className={cn(
        'group relative flex items-center gap-4 p-4 border-b hover:bg-muted/50 transition-colors',
        selected && 'bg-muted/50'
      )}
    >
      {/* Selection Checkbox */}
      <Checkbox
        checked={selected}
        onCheckedChange={() => onSelect(test.id)}
        aria-label={`Sélectionner ${test.name}`}
      />

      {/* Test Info */}
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center gap-2">
          <h3 className="font-medium truncate">{test.name}</h3>
          <Badge variant={STATUS_STYLES[test.status].variant} className="shrink-0">
            {STATUS_STYLES[test.status].label}
          </Badge>
          {test.winner && (
            <Badge variant="default" className="shrink-0">
              🏆 Gagnant déclaré
            </Badge>
          )}
          {health.status !== 'healthy' && (
            <span aria-label={health.issues.join(', ')} tabIndex={0}>
              <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-500" />
            </span>
          )}
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            Campagne: <span className="font-medium">{test.campaignName}</span>
          </span>
          <Badge className={cn('text-xs', CHANNEL_COLORS[test.channel])}>{test.channel}</Badge>
          <span>{test.variants.length} variantes</span>
          {test.startDate && (
            <span>Démarré le {new Date(test.startDate).toLocaleDateString('fr-FR')}</span>
          )}
        </div>
      </div>

      {/* Metrics Summary with Trend Icons */}
      {hasMetrics && bestVariant && (
        <div className="hidden lg:flex items-center gap-6">
          <div className="text-center">
            <div className="text-xs text-muted-foreground mb-1">
              {getMetricDisplayName(test.targetMetric)}
            </div>
            <div className="flex items-center gap-1">
              {React.createElement(getTrendIcon(bestVariant.variantId), {
                className: cn('w-4 h-4', getTrendColor(bestVariant.variantId)),
              })}
              <span className="font-semibold">
                {formatMetricValue(bestVariant[test.targetMetric] ?? 0, test.targetMetric)}
              </span>
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground">Impressions</div>
            <div className="font-semibold">
              {(test.metrics?.reduce((sum, m) => sum + m.impressions, 0) ?? 0).toLocaleString()}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground">Conversions</div>
            <div className="font-semibold">
              {(test.metrics?.reduce((sum, m) => sum + m.conversions, 0) ?? 0).toLocaleString()}
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2">
        {test.status === 'draft' && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => onStart(test)}
            title="Démarrer le test"
          >
            <Play className="w-4 h-4" />
          </Button>
        )}

        {test.status === 'running' && (
          <Button size="sm" variant="outline" onClick={() => onPause(test)} title="Mettre en pause">
            <Pause className="w-4 h-4" />
          </Button>
        )}

        {test.status === 'paused' && (
          <Button size="sm" variant="outline" onClick={() => onStart(test)} title="Reprendre">
            <Play className="w-4 h-4" />
          </Button>
        )}

        {(test.status === 'running' || test.status === 'paused') && (
          <Button size="sm" variant="outline" onClick={() => onStop(test)} title="Arrêter le test">
            <Square className="w-4 h-4" />
          </Button>
        )}

        {test.status === 'completed' && (
          <Button size="sm" variant="default" onClick={() => onViewResults(test)}>
            Voir résultats
          </Button>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="ghost">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(test)}>
              <Edit className="w-4 h-4 mr-2" />
              Modifier
            </DropdownMenuItem>
            {hasMetrics && (
              <DropdownMenuItem onClick={() => onViewResults(test)}>
                <TrendingUp className="w-4 h-4 mr-2" />
                Voir les résultats
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onArchive(test)} className="text-destructive">
              <Archive className="w-4 h-4 mr-2" />
              Archiver
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
