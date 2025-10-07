'use client';

import { FC, useMemo } from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { ExternalLink } from 'lucide-react';

interface ChannelData {
  name: string;
  conversions: number;
  color: string;
  trend: number;
}

interface BarChartProps {
  data: ChannelData[];
  className?: string;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg">
        <p className="text-sm font-medium text-gray-900 dark:text-white">{label}</p>
        <p className="text-sm text-gray-600 dark:text-gray-300">Conversions: {payload[0].value}</p>
        <p className={`text-sm ${data.trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          Tendance: {data.trend >= 0 ? '+' : ''}
          {data.trend}%
        </p>
      </div>
    );
  }
  return null;
};

export const BarChart: FC<BarChartProps> = ({ data, className = '' }) => {
  const totalConversions = useMemo(() => {
    return data.reduce((sum, item) => sum + item.conversions, 0);
  }, [data]);

  return (
    <div className={`w-full ${className}`}>
      <div className="mb-4">
        <ResponsiveContainer width="100%" height={200}>
          <RechartsBarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12 }}
              className="text-gray-500 dark:text-gray-400"
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis tick={{ fontSize: 12 }} className="text-gray-500 dark:text-gray-400" />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="conversions" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>

      {/* Liste détaillée */}
      <div className="space-y-3">
        {data.map((channel, index) => {
          const share = (channel.conversions / totalConversions) * 100;

          return (
            <div
              key={index}
              className="group flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: channel.color }} />
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {channel.name}
                </span>
                <ExternalLink className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <span className="text-gray-600 dark:text-gray-300">{share.toFixed(1)}%</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {channel.conversions}
                </span>
                <span
                  className={`text-xs font-medium ${
                    channel.trend >= 0 ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  {channel.trend >= 0 ? '+' : ''}
                  {channel.trend}%
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Résumé total */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-300">Total conversions</span>
          <span className="text-lg font-bold text-gray-900 dark:text-white">
            {totalConversions}
          </span>
        </div>
      </div>
    </div>
  );
};
