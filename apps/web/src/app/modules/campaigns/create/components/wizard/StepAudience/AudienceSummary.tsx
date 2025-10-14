'use client';

import React from 'react';
import { Target } from 'lucide-react';

import { Card } from '@/app/modules/ui/card';
import { mockAudienceSegments } from '../../../mock-data';
import type { AudienceFilter } from '../validators';

interface CSVData {
  fileName: string;
  headers: string[];
  rowCount: number;
  validRows: number;
}

interface AudienceSummaryProps {
  segments: string[];
  filters: AudienceFilter[];
  csvData?: CSVData;
  estimatedReach: number;
}

export function AudienceSummary({
  segments,
  filters,
  csvData,
  estimatedReach,
}: AudienceSummaryProps) {
  return (
    <Card className="p-6">
      <h4 className="font-medium mb-4">Résumé de l'audience</h4>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Reach estimé */}
        <div className="text-center">
          <div className="text-3xl font-bold text-primary mb-1">
            {estimatedReach.toLocaleString()}
          </div>
          <div className="text-sm text-muted-foreground">Personnes touchées</div>
        </div>

        {/* Segments */}
        <div>
          <div className="text-sm font-medium mb-2">Segments sélectionnés</div>
          <div className="space-y-1">
            {segments.length > 0 ? (
              segments.map((segmentId) => {
                const segment = mockAudienceSegments.find((s) => s.id === segmentId);
                return segment ? (
                  <div key={segmentId} className="text-sm text-muted-foreground">
                    • {segment.name} ({segment.size.toLocaleString()})
                  </div>
                ) : null;
              })
            ) : (
              <div className="text-sm text-muted-foreground">Aucun segment sélectionné</div>
            )}
          </div>
        </div>

        {/* Filtres et CSV */}
        <div>
          <div className="text-sm font-medium mb-2">Critères additionnels</div>
          <div className="space-y-1">
            {filters.length > 0 && (
              <div className="text-sm text-muted-foreground">
                • {filters.length} filtre{filters.length > 1 ? 's' : ''} personnalisé
                {filters.length > 1 ? 's' : ''}
              </div>
            )}
            {csvData && (
              <div className="text-sm text-muted-foreground">
                • Import CSV ({csvData.validRows} contacts)
              </div>
            )}
            {filters.length === 0 && !csvData && (
              <div className="text-sm text-muted-foreground">Aucun critère additionnel</div>
            )}
          </div>
        </div>
      </div>

      {estimatedReach > 0 && (
        <Card className="mt-4 p-4 bg-blue-50 border-blue-200">
          <div className="flex items-start gap-2">
            <Target className="h-4 w-4 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              Votre audience cible représente <strong>{estimatedReach.toLocaleString()}</strong>{' '}
              personnes. Cette estimation peut varier selon les recoupements entre segments.
            </div>
          </div>
        </Card>
      )}
    </Card>
  );
}
