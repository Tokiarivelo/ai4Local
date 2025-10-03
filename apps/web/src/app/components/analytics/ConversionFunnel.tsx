'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FunnelStage {
  stage: string;
  value: number;
  percentage: number;
}

interface ConversionFunnelProps {
  data: FunnelStage[];
  title?: string;
}

export function ConversionFunnel({
  data,
  title = 'Entonnoir de conversion',
}: ConversionFunnelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((stage, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{stage.stage}</span>
                <span className="text-muted-foreground">{stage.percentage}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-500"
                  style={{ width: `${stage.percentage}%` }}
                />
              </div>
              <div className="text-xs text-muted-foreground">
                {stage.value.toLocaleString()} utilisateurs
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
