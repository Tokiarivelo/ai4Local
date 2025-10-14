'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Target } from 'lucide-react';
import { Card } from '@/app/modules/ui/card';
import type { CampaignObjective } from '../../../types';
import { CAMPAIGN_OBJECTIVES } from './constants';

interface ObjectiveSelectorProps {
  selectedObjective: CampaignObjective | null;
  onObjectiveSelect: (objective: CampaignObjective) => void;
}

export function ObjectiveSelector({
  selectedObjective,
  onObjectiveSelect,
}: ObjectiveSelectorProps) {
  return (
    <Card className="p-6">
      <div className="mb-4">
        <h4 className="font-medium">Objectif principal *</h4>
        <p className="text-sm text-muted-foreground">
          Choisissez l'objectif principal de votre campagne
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {CAMPAIGN_OBJECTIVES.map((objective) => {
          const isSelected = selectedObjective === objective.id;
          const IconComponent = objective.icon;

          return (
            <motion.div
              key={objective.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`
                relative p-4 border rounded-lg cursor-pointer transition-all
                ${
                  isSelected
                    ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                    : 'border-border hover:border-primary/50 hover:bg-muted/50'
                }
              `}
              onClick={() => onObjectiveSelect(objective.id)}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg text-white ${objective.color}`}>
                  <IconComponent className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="font-medium text-sm">{objective.title}</h5>
                  <p className="text-xs text-muted-foreground mt-1">{objective.description}</p>
                </div>
              </div>

              {isSelected && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute top-2 right-2"
                >
                  <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                    <Target className="h-3 w-3 text-primary-foreground" />
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {!selectedObjective && (
        <p className="text-sm text-destructive mt-2">
          Veuillez sélectionner un objectif pour votre campagne
        </p>
      )}
    </Card>
  );
}
