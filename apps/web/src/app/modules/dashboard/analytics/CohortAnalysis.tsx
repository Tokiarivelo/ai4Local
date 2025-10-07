'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/modules/ui/card';
import { cn } from '@/lib/utils';

interface CohortData {
  cohort: string;
  month1: number;
  month2: number;
  month3: number;
  month4: number;
  month5: number;
  month6: number;
}

interface CohortAnalysisProps {
  data: CohortData[];
  title?: string;
  className?: string;
}

export function CohortAnalysis({
  data,
  title = 'Analyse de cohortes - Rétention (%)',
  className,
}: CohortAnalysisProps) {
  const getIntensityColor = (value: number): string => {
    if (value === 0) return 'transparent';

    // Calcul de l'intensité basé sur la valeur (0-100)
    const intensity = Math.max(0.1, value / 100);
    return `hsl(var(--color-primary) / ${intensity})`;
  };

  const getTextColor = (value: number): string => {
    return value > 50 ? 'hsl(var(--color-primary-foreground))' : 'hsl(var(--color-foreground))';
  };

  return (
    <Card className={cn('bg-card text-card-foreground border-border', className)}>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="responsive-scroll">
          <div className="min-w-[600px] p-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-3 font-medium text-muted-foreground">Cohorte</th>
                  {['M1', 'M2', 'M3', 'M4', 'M5', 'M6'].map((month) => (
                    <th key={month} className="text-center p-3 font-medium text-muted-foreground">
                      {month}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((cohort, index) => (
                  <tr key={index} className="border-b border-border last:border-b-0">
                    <td className="p-3 font-medium text-foreground">{cohort.cohort}</td>
                    <td className="text-center p-3">
                      <div
                        className="w-12 h-8 rounded mx-auto flex items-center justify-center text-xs font-medium"
                        style={{
                          backgroundColor: 'hsl(var(--color-primary))',
                          color: 'hsl(var(--color-primary-foreground))',
                        }}
                      >
                        {cohort.month1}%
                      </div>
                    </td>
                    {[
                      cohort.month2,
                      cohort.month3,
                      cohort.month4,
                      cohort.month5,
                      cohort.month6,
                    ].map((value, monthIndex) => (
                      <td key={monthIndex + 1} className="text-center p-3">
                        {value > 0 ? (
                          <div
                            className="w-12 h-8 rounded mx-auto flex items-center justify-center text-xs font-medium transition-all duration-200 hover:scale-105"
                            style={{
                              backgroundColor: getIntensityColor(value),
                              color: getTextColor(value),
                              border: value > 0 ? '1px solid hsl(var(--color-border))' : 'none',
                            }}
                          >
                            {value}%
                          </div>
                        ) : (
                          <div className="w-12 h-8 mx-auto flex items-center justify-center">
                            <span className="text-muted-foreground text-xs">-</span>
                          </div>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
