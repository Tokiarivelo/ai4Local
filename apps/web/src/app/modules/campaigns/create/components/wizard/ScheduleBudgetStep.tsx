'use client';

import React from 'react';
import { Card } from '@/app/modules/ui/card';
import { Button } from '@/app/modules/ui/button';
import { Calendar, DollarSign, Clock, Settings } from 'lucide-react';

interface ScheduleBudgetStepProps {
  isValidating?: boolean;
  onAsyncValidation?: (data: any) => Promise<void>;
  isEditing?: boolean;
}

/**
 * Étape 4: Planning et budget
 * Configuration du budget, dates, horaires
 */
export function ScheduleBudgetStep({
  isValidating = false,
  onAsyncValidation,
  isEditing = false,
}: ScheduleBudgetStepProps) {
  return (
    <div className="space-y-8">
      <Card className="p-6">
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Planning et budget</h3>
          <p className="text-muted-foreground mb-6">
            Cette étape sera implémentée prochainement. Elle permettra de configurer :
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 max-w-2xl mx-auto">
            <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <DollarSign className="w-8 h-8 text-blue-500 mb-2" />
              <span className="text-sm">Budget</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <Calendar className="w-8 h-8 text-green-500 mb-2" />
              <span className="text-sm">Dates</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <Clock className="w-8 h-8 text-purple-500 mb-2" />
              <span className="text-sm">Horaires</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <Settings className="w-8 h-8 text-orange-500 mb-2" />
              <span className="text-sm">Optimisation</span>
            </div>
          </div>
          <Button className="mt-6" disabled>
            Fonctionnalité en développement
          </Button>
        </div>
      </Card>
    </div>
  );
}
