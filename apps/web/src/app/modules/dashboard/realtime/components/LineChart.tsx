'use client';

import { FC, useMemo } from 'react';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface DataPoint {
  time: string;
  visitors: number;
  engagements: number;
}

interface LineChartProps {
  data: DataPoint[];
  className?: string;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg">
        <p className="text-sm font-medium text-gray-900 dark:text-white">{`Heure: ${label}`}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {`${entry.name}: ${entry.value}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const LineChart: FC<LineChartProps> = ({ data, className = '' }) => {
  const metrics = useMemo(() => {
    const lastVisitors = data[data.length - 1]?.visitors || 0;
    const prevVisitors = data[data.length - 2]?.visitors || 0;
    const visitorsChange =
      prevVisitors > 0 ? ((lastVisitors - prevVisitors) / prevVisitors) * 100 : 0;

    const lastEngagements = data[data.length - 1]?.engagements || 0;
    const prevEngagements = data[data.length - 2]?.engagements || 0;
    const engagementsChange =
      prevEngagements > 0 ? ((lastEngagements - prevEngagements) / prevEngagements) * 100 : 0;

    return {
      visitorsChange,
      engagementsChange,
      lastVisitors,
      lastEngagements,
    };
  }, [data]);

  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-gray-600 dark:text-gray-300">Visiteurs</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600 dark:text-gray-300">Engagements</span>
          </div>
        </div>
        <div className="flex items-center space-x-1 text-sm">
          {metrics.visitorsChange >= 0 ? (
            <TrendingUp className="w-4 h-4 text-green-500" />
          ) : (
            <TrendingDown className="w-4 h-4 text-red-500" />
          )}
          <span className={metrics.visitorsChange >= 0 ? 'text-green-500' : 'text-red-500'}>
            {Math.abs(metrics.visitorsChange).toFixed(1)}%
          </span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <RechartsLineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis
            dataKey="time"
            tick={{ fontSize: 12 }}
            className="text-gray-500 dark:text-gray-400"
          />
          <YAxis tick={{ fontSize: 12 }} className="text-gray-500 dark:text-gray-400" />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line
            type="monotone"
            dataKey="visitors"
            stroke="#3B82F6"
            strokeWidth={2}
            dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6 }}
            name="Visiteurs"
          />
          <Line
            type="monotone"
            dataKey="engagements"
            stroke="#10B981"
            strokeWidth={2}
            dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6 }}
            name="Engagements"
          />
        </RechartsLineChart>
      </ResponsiveContainer>

      {/* Stats rapides */}
      <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-500">{metrics.lastVisitors}</div>
          <div className="text-gray-600 dark:text-gray-300">Visiteurs actuels</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-500">{metrics.lastEngagements}</div>
          <div className="text-gray-600 dark:text-gray-300">Engagements actuels</div>
        </div>
      </div>
    </div>
  );
};
