'use client';

import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { PieLabelRenderProps } from 'recharts/types/polar/Pie';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ChannelData {
  name: string;
  value: number;
  color?: string;
}

interface ChannelDistributionChartProps {
  data: ChannelData[];
  title?: string;
  className?: string;
}

const CHART_COLORS = [
  'var(--color-chart-1)',
  'var(--color-chart-2)',
  'var(--color-chart-3)',
  'var(--color-chart-4)',
  'var(--color-chart-5)',
];

export function ChannelDistributionChart({
  data,
  title = 'Répartition par canal',
  className,
}: ChannelDistributionChartProps) {
  const dataWithColors = data.map((item, index) => ({
    ...item,
    color: item.color || CHART_COLORS[index % CHART_COLORS.length],
  }));

  const renderCustomizedLabel = (props: PieLabelRenderProps) => {
    const { cx = 0, cy = 0, midAngle = 0, innerRadius = 0, outerRadius = 0, percent = 0 } = props;
    const percentNumber = typeof percent === 'number' ? percent : 0;
    if (percentNumber < 0.05) return null; // N'affiche pas les labels pour les petites valeurs

    const RADIAN = Math.PI / 180;
    const cxNum = typeof cx === 'number' ? cx : Number(cx) || 0;
    const cyNum = typeof cy === 'number' ? cy : Number(cy) || 0;
    const midAngleNum = typeof midAngle === 'number' ? midAngle : Number(midAngle) || 0;
    const innerRadiusNum = typeof innerRadius === 'number' ? innerRadius : Number(innerRadius) || 0;
    const outerRadiusNum = typeof outerRadius === 'number' ? outerRadius : Number(outerRadius) || 0;
    const radius = innerRadiusNum + (outerRadiusNum - innerRadiusNum) * 0.5;
    const x = cxNum + radius * Math.cos(-midAngleNum * RADIAN);
    const y = cyNum + radius * Math.sin(-midAngleNum * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cxNum ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize={12}
        fontWeight="medium"
        style={{ textShadow: '0 0 3px rgba(0,0,0,0.5)' }}
      >
        {`${(percentNumber * 100).toFixed(0)}%`}
      </text>
    );
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];

      console.log('data :>> ', data);

      return (
        <div
          className="bg-card text-card-foreground border border-border rounded-lg p-3 shadow-lg"
          style={{
            backgroundColor: 'hsl(var(--card))',
            borderColor: 'hsl(var(--border))',
            color: 'hsl(var(--card-foreground))',
          }}
        >
          <p className="font-medium">{data.name}</p>
          <p className="text-sm">
            <span style={{ color: data.payload.color }}>■</span> {data.value}% ({data.payload.value}
            )
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }: any) => {
    console.log('payload :>> ', payload);

    return (
      <ul className="flex flex-wrap justify-center gap-4 mt-4">
        {payload?.map((entry: any, index: number) => (
          <li key={index} className="flex items-center gap-2 text-sm">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-foreground">{entry.value}</span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <Card className={cn('bg-card text-card-foreground border-border', className)}>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={dataWithColors}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={80}
                innerRadius={20} // Ajout d'un inner radius pour un effet donut
                fill="#8884d8"
                dataKey="value"
                stroke="var(--chart-stroke)"
                strokeWidth={2}
              >
                {dataWithColors.map((entry, index) => {
                  return (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      className="hover:opacity-80 transition-opacity duration-200"
                    />
                  );
                })}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend content={<CustomLegend />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Statistiques complémentaires */}
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div className="text-center">
            <p className="text-muted-foreground">Total</p>
            <p className="font-semibold text-foreground">
              {data.reduce((sum, item) => sum + item.value, 0)}%
            </p>
          </div>
          <div className="text-center">
            <p className="text-muted-foreground">Canaux</p>
            <p className="font-semibold text-foreground">{data.length}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
