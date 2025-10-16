/**
 * Results Dashboard Component
 * Visualization of A/B test results with charts and winner analysis
 */

'use client';

import React, { useMemo } from 'react';
import { TrendingUp, TrendingDown, Award, AlertTriangle, BarChart3, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/modules/ui/card';
import { Badge } from '@/app/modules/ui/badge';
import { Button } from '@/app/modules/ui/button';
import { Progress } from '@/app/modules/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/modules/ui/tabs';
import { cn } from '@/lib/utils';
import type { AbTest, VariantMetrics } from '../types';
import {
  determineWinner,
  formatMetricValue,
  getMetricDisplayName,
  calculateTestProgress,
} from '../utils/abtest-calculations';

interface ResultsDashboardProps {
  test: AbTest;
  onDeclareWinner?: (variantId: string) => void;
  onExport?: () => void;
}

export function ResultsDashboard({ test, onDeclareWinner, onExport }: ResultsDashboardProps) {
  const metrics = test.metrics || [];
  const winnerAnalysis = useMemo(
    () => determineWinner(metrics, test.targetMetric),
    [metrics, test.targetMetric]
  );

  const progress = useMemo(() => {
    if (!test.startDate || !test.sampleSize) return 0;
    const currentSample = metrics.reduce((sum, m) => sum + m.impressions, 0);
    return calculateTestProgress(currentSample, test.sampleSize, test.startDate, test.endDate);
  }, [metrics, test.startDate, test.endDate, test.sampleSize]);

  const sortedMetrics = useMemo(() => {
    return [...metrics].sort((a, b) => {
      const aValue = a[test.targetMetric] ?? 0;
      const bValue = b[test.targetMetric] ?? 0;
      return test.targetMetric === 'cpa' ? aValue - bValue : bValue - aValue;
    });
  }, [metrics, test.targetMetric]);

  const getVariantName = (variantId: string) => {
    return test.variants.find((v) => v.id === variantId)?.name || variantId;
  };

  const getVariantColor = (index: number) => {
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500'];
    return colors[index % colors.length];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{test.name}</h2>
          <p className="text-muted-foreground">
            {test.campaignName} • {test.variants.length} variantes
          </p>
        </div>
        {onExport && (
          <Button variant="outline" onClick={onExport}>
            <Download className="w-4 h-4 mr-2" />
            Exporter les résultats
          </Button>
        )}
      </div>

      {/* Progress & Status */}
      <Card>
        <CardHeader>
          <CardTitle>Progression du test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Échantillon collecté</span>
              <span className="font-medium">{progress.toFixed(1)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {test.startDate && (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Début</span>
                <p className="font-medium">
                  {new Date(test.startDate).toLocaleDateString('fr-FR')}
                </p>
              </div>
              {test.endDate && (
                <div>
                  <span className="text-muted-foreground">Fin prévue</span>
                  <p className="font-medium">
                    {new Date(test.endDate).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Winner Analysis */}
      {winnerAnalysis && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              Variante gagnante détectée
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <TrendingUp className="w-5 h-5 text-green-600 mt-1" />
              <div className="flex-1">
                <p className="font-medium">{getVariantName(winnerAnalysis.winnerId)}</p>
                <p className="text-sm text-muted-foreground mt-1">{winnerAnalysis.reason}</p>
              </div>
              <Badge variant="default" className="shrink-0">
                {winnerAnalysis.confidence}% confiance
              </Badge>
            </div>

            {onDeclareWinner && test.status !== 'completed' && (
              <Button onClick={() => onDeclareWinner(winnerAnalysis.winnerId)} className="w-full">
                Déclarer cette variante gagnante
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {!winnerAnalysis && test.status === 'running' && (
        <Card className="border-yellow-500/50 bg-yellow-50 dark:bg-yellow-950/20">
          <CardContent className="flex items-start gap-3 pt-6">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mt-1" />
            <div>
              <p className="font-medium text-yellow-900 dark:text-yellow-100">
                Résultats non concluants
              </p>
              <p className="text-sm text-yellow-800 dark:text-yellow-200 mt-1">
                Le test n'a pas encore atteint une signification statistique suffisante. Continuez à
                collecter des données.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Metrics Comparison */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="details">Détails</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            {/* Total Impressions */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Impressions totales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {metrics.reduce((sum, m) => sum + m.impressions, 0).toLocaleString()}
                </div>
              </CardContent>
            </Card>

            {/* Total Clicks */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Clics totaux</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {metrics.reduce((sum, m) => sum + m.clicks, 0).toLocaleString()}
                </div>
              </CardContent>
            </Card>

            {/* Total Conversions */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Conversions totales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {metrics.reduce((sum, m) => sum + m.conversions, 0).toLocaleString()}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Variants Ranking */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Classement par {getMetricDisplayName(test.targetMetric)}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {sortedMetrics.map((metric, index) => {
                const isWinner = metric.variantId === winnerAnalysis?.winnerId;
                const maxValue =
                  Math.max(...sortedMetrics.map((m) => m[test.targetMetric] ?? 0)) || 1;
                const metricValue = metric[test.targetMetric] ?? 0;
                const percentage = (metricValue / maxValue) * 100;

                return (
                  <div key={metric.variantId} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          #{index + 1} {getVariantName(metric.variantId)}
                        </span>
                        {isWinner && <Award className="w-4 h-4 text-yellow-500" />}
                      </div>
                      <span className="font-semibold">
                        {formatMetricValue(metric[test.targetMetric] ?? 0, test.targetMetric)}
                      </span>
                    </div>
                    <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={cn(
                          'h-full transition-all',
                          getVariantColor(test.variants.findIndex((v) => v.id === metric.variantId))
                        )}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-4">
          {metrics.map((metric, index) => {
            const variant = test.variants.find((v) => v.id === metric.variantId);
            if (!variant) return null;

            return (
              <Card key={metric.variantId}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{variant.name}</span>
                    {metric.variantId === winnerAnalysis?.winnerId && (
                      <Badge variant="default">Gagnant</Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">CTR</div>
                      <div className="text-xl font-semibold">{metric.ctr.toFixed(2)}%</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Taux de conversion</div>
                      <div className="text-xl font-semibold">
                        {metric.conversionRate.toFixed(2)}%
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">CPA</div>
                      <div className="text-xl font-semibold">${(metric.cpa || 0).toFixed(2)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Confiance</div>
                      <div className="text-xl font-semibold">
                        {(metric.confidence || 0).toFixed(0)}%
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        {/* Details Tab */}
        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Métriques détaillées</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 font-medium">Variante</th>
                      <th className="text-right p-3 font-medium">Impressions</th>
                      <th className="text-right p-3 font-medium">Clics</th>
                      <th className="text-right p-3 font-medium">CTR</th>
                      <th className="text-right p-3 font-medium">Conversions</th>
                      <th className="text-right p-3 font-medium">Taux</th>
                      <th className="text-right p-3 font-medium">CPA</th>
                      <th className="text-right p-3 font-medium">LTV</th>
                    </tr>
                  </thead>
                  <tbody>
                    {metrics.map((metric) => (
                      <tr key={metric.variantId} className="border-b hover:bg-muted/50">
                        <td className="p-3 font-medium">{getVariantName(metric.variantId)}</td>
                        <td className="p-3 text-right">{metric.impressions.toLocaleString()}</td>
                        <td className="p-3 text-right">{metric.clicks.toLocaleString()}</td>
                        <td className="p-3 text-right">{metric.ctr.toFixed(2)}%</td>
                        <td className="p-3 text-right">{metric.conversions.toLocaleString()}</td>
                        <td className="p-3 text-right">{metric.conversionRate.toFixed(2)}%</td>
                        <td className="p-3 text-right">${(metric.cpa || 0).toFixed(2)}</td>
                        <td className="p-3 text-right">${(metric.ltv || 0).toFixed(0)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
