'use client';

import React, { useEffect, useCallback, useMemo } from 'react';
import { Users, TrendingUp } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/app/modules/ui/card';
import type { AudienceFilter } from '../validators';

interface CSVData {
  fileName: string;
  headers: string[];
  rowCount: number;
  validRows: number;
}

interface AudienceEstimatorProps {
  selectedSegments: string[];
  customFilters: AudienceFilter[];
  csvData?: CSVData;
  onReachUpdate: (reach: number) => void;
}

// Données de reach par segment (simulation)
const SEGMENT_REACH: Record<string, number> = {
  'young-adults': 25000,
  families: 18000,
  seniors: 12000,
  professionals: 22000,
  students: 8000,
  'tech-enthusiasts': 15000,
  'local-businesses': 5000,
};

export function AudienceEstimator({
  selectedSegments,
  customFilters,
  csvData,
  onReachUpdate,
}: AudienceEstimatorProps) {
  // Utiliser useMemo pour mémoriser le calcul et éviter les recalculs inutiles
  const estimatedReach = useMemo(() => {
    let reach = 0;

    // Si on a des données CSV, on les utilise en priorité
    if (csvData) {
      return csvData.validRows;
    }

    // Calcul basé sur les segments sélectionnés
    selectedSegments.forEach((segment) => {
      reach += SEGMENT_REACH[segment] || 0;
    });

    // Application des filtres personnalisés (réduction progressive)
    if (customFilters.length > 0) {
      // Chaque filtre réduit l'audience de 10% (simulation)
      const filterReduction = customFilters.length * 0.1;
      reach = reach * (1 - Math.min(filterReduction, 0.8)); // Max 80% de réduction
    }

    // Facteur de déduplication si plusieurs segments
    if (selectedSegments.length > 1) {
      reach = reach * 0.85; // 15% de déduplication
    }

    return Math.round(reach);
  }, [selectedSegments, customFilters, csvData]);

  // Mise à jour du reach uniquement quand la valeur change réellement
  useEffect(() => {
    onReachUpdate(estimatedReach);
  }, [estimatedReach, onReachUpdate]);

  const getReachQuality = () => {
    if (estimatedReach < 1000) return { label: 'Très ciblée', color: 'text-orange-600' };
    if (estimatedReach < 10000) return { label: 'Ciblée', color: 'text-blue-600' };
    if (estimatedReach < 50000) return { label: 'Large', color: 'text-green-600' };
    return { label: 'Très large', color: 'text-purple-600' };
  };

  const quality = getReachQuality();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TrendingUp className="h-5 w-5" />
          <span>Estimation de l'audience</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{estimatedReach.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">personnes estimées</p>
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className={`text-sm font-medium ${quality.color}`}>{quality.label}</div>
            <div className="text-xs text-muted-foreground">Taille d'audience</div>
          </div>
        </div>

        {/* Indicateurs visuels */}
        <div className="mt-4 space-y-2">
          {csvData && (
            <div className="p-3 bg-blue-50 dark:bg-blue-950/50 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                📊 Audience basée sur votre fichier CSV importé ({csvData.validRows} contacts
                valides)
              </p>
            </div>
          )}

          {selectedSegments.length > 0 && !csvData && (
            <div className="p-3 bg-green-50 dark:bg-green-950/50 rounded-lg">
              <p className="text-sm text-green-800 dark:text-green-200">
                🎯 Audience calculée à partir de {selectedSegments.length} segment(s) sélectionné(s)
                {customFilters.length > 0 &&
                  ` avec ${customFilters.length} filtre(s) personnalisé(s)`}
              </p>
            </div>
          )}

          {selectedSegments.length === 0 && !csvData && (
            <div className="p-3 bg-gray-50 dark:bg-gray-950/50 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                ⚠️ Sélectionnez au moins un segment ou importez un fichier CSV pour estimer votre
                audience
              </p>
            </div>
          )}
        </div>

        {/* Détails du calcul */}
        {estimatedReach > 0 && selectedSegments.length > 0 && !csvData && (
          <div className="mt-4 pt-4 border-t">
            <h5 className="text-xs font-medium text-muted-foreground mb-2">DÉTAILS DU CALCUL</h5>
            <div className="space-y-1 text-xs text-muted-foreground">
              {selectedSegments.map((segment) => (
                <div key={segment} className="flex justify-between">
                  <span>Segment "{segment}":</span>
                  <span>~{(SEGMENT_REACH[segment] || 0).toLocaleString()}</span>
                </div>
              ))}
              {selectedSegments.length > 1 && (
                <div className="flex justify-between pt-1 border-t">
                  <span>Déduplication (-15%):</span>
                  <span>
                    -
                    {Math.round(
                      selectedSegments.reduce((sum, s) => sum + (SEGMENT_REACH[s] || 0), 0) * 0.15
                    ).toLocaleString()}
                  </span>
                </div>
              )}
              {customFilters.length > 0 && (
                <div className="flex justify-between">
                  <span>Filtres personnalisés (-{customFilters.length * 10}%):</span>
                  <span>Appliqués</span>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
