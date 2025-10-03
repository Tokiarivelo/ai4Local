'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
}

export function CohortAnalysis({
  data,
  title = 'Analyse de cohortes - Rétention (%)',
}: CohortAnalysisProps) {
  const getCellStyle = (value: number, monthIndex: number) => {
    if (value === 0) return {};

    const cssVariables = [
      '--ai4local-primary',
      '--ai4local-accent',
      '--ai4local-secondary',
      '--ai4local-highlight',
      '--ai4local-primary',
      '--ai4local-accent',
    ];

    return {
      backgroundColor: `hsl(var(${cssVariables[monthIndex]}, ${value}%))`,
    };
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Cohorte</th>
                <th className="text-center p-2">M1</th>
                <th className="text-center p-2">M2</th>
                <th className="text-center p-2">M3</th>
                <th className="text-center p-2">M4</th>
                <th className="text-center p-2">M5</th>
                <th className="text-center p-2">M6</th>
              </tr>
            </thead>
            <tbody>
              {data.map((cohort, index) => (
                <tr key={index} className="border-b">
                  <td className="p-2 font-medium">{cohort.cohort}</td>
                  <td className="text-center p-2">
                    <div className="w-12 h-6 bg-primary rounded mx-auto flex items-center justify-center text-white text-xs">
                      {cohort.month1}%
                    </div>
                  </td>
                  {[cohort.month2, cohort.month3, cohort.month4, cohort.month5, cohort.month6].map(
                    (value, monthIndex) => (
                      <td key={monthIndex + 1} className="text-center p-2">
                        {value > 0 && (
                          <div
                            className="w-12 h-6 rounded mx-auto flex items-center justify-center text-white text-xs"
                            style={getCellStyle(value, monthIndex + 1)}
                          >
                            {value}%
                          </div>
                        )}
                      </td>
                    )
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
