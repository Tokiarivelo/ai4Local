'use client';

import React from 'react';
import {
  LineChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/modules/ui/card';
import { cn } from '@/lib/utils';

interface PerformanceData {
  month: string;
  campaigns: number;
  openRate: number;
  clickRate: number;
  revenue: number;
}

interface PerformanceChartProps {
  data: PerformanceData[];
  title?: string;
  className?: string;
}

export function PerformanceChart({
  data,
  title = "Performance sur l'année",
  className,
}: PerformanceChartProps) {
  return (
    <Card className={cn('bg-card text-card-foreground border-border', className)}>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="h-64 sm:h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--color-border))"
                opacity={0.3}
              />
              <XAxis
                dataKey="month"
                tick={{ fill: 'hsl(var(--color-muted-foreground))', fontSize: 12 }}
                axisLine={{ stroke: 'hsl(var(--color-border))' }}
              />
              <YAxis
                yAxisId="left"
                tick={{ fill: 'hsl(var(--color-muted-foreground))', fontSize: 12 }}
                axisLine={{ stroke: 'hsl(var(--color-border))' }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fill: 'hsl(var(--color-muted-foreground))', fontSize: 12 }}
                axisLine={{ stroke: 'hsl(var(--color-border))' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--color-card))',
                  border: '1px solid hsl(var(--color-border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--color-card-foreground))',
                  fontSize: '14px',
                }}
                labelStyle={{ color: 'hsl(var(--color-foreground))' }}
              />
              <Legend wrapperStyle={{ color: 'hsl(var(--color-foreground))' }} />
              <Bar
                yAxisId="left"
                dataKey="campaigns"
                fill="var(--color-chart-1)"
                name="Campagnes"
                radius={[2, 2, 0, 0]}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="openRate"
                stroke="hsl(var(--color-primary))"
                strokeWidth={2}
                name="Taux d'ouverture %"
                dot={{ fill: 'hsl(var(--color-primary))', strokeWidth: 2, r: 4 }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="clickRate"
                stroke="var(--color-chart-2)"
                strokeWidth={2}
                name="Taux de clic %"
                dot={{ fill: 'var(--color-chart-2)', strokeWidth: 2, r: 4 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
