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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
}

export function PerformanceChart({
  data,
  title = "Performance sur l'année",
}: PerformanceChartProps) {
  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px',
                }}
              />
              <Legend />
              <Bar yAxisId="left" dataKey="campaigns" fill="#63B3ED" name="Campagnes" />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="openRate"
                stroke="#1F6CC5"
                strokeWidth={2}
                name="Taux d'ouverture %"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="clickRate"
                stroke="#0A4595"
                strokeWidth={2}
                name="Taux de clic %"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
