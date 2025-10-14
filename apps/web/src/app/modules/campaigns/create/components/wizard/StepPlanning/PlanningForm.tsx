'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/app/modules/ui/button';

import { PlanningStepSchema, type PlanningStepData } from '../validators';
import { BudgetSection } from './BudgetSection';
import { ScheduleSection } from './ScheduleSection';
import { BidStrategySection } from './BidStrategySection';
import { BudgetSummary } from './BudgetSummary';

interface PlanningFormProps {
  initialData?: PlanningStepData;
  onSubmit: (data: PlanningStepData) => void;
  onValidationChange: (isValid: boolean) => void;
}

export function PlanningForm({ initialData, onSubmit, onValidationChange }: PlanningFormProps) {
  const form = useForm<PlanningStepData>({
    resolver: zodResolver(PlanningStepSchema),
    defaultValues: {
      budget: initialData?.budget || 0,
      isDailyBudget: initialData?.isDailyBudget || false,
      startDate: initialData?.startDate || '',
      endDate: initialData?.endDate || '',
      timezone: initialData?.timezone || 'Europe/Paris',
      bidStrategy: initialData?.bidStrategy || 'automatic',
      maxCPC: initialData?.maxCPC || 0,
      targetCPA: initialData?.targetCPA || 0,
      scheduleType: initialData?.scheduleType || 'immediate',
      estimatedReach: initialData?.estimatedReach || 0,
    },
  });

  const {
    handleSubmit,
    formState: { isValid },
    watch,
  } = form;

  // Validation globale
  const isFormValid = React.useMemo(() => {
    const budget = watch('budget');
    const startDate = watch('startDate');
    return isValid && budget > 0 && startDate;
  }, [isValid, watch]);

  React.useEffect(() => {
    onValidationChange(isFormValid);
  }, [isFormValid, onValidationChange]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Section Budget */}
      <BudgetSection form={form} />

      {/* Section Planification */}
      <ScheduleSection form={form} />

      {/* Section Stratégie d'enchères */}
      <BidStrategySection form={form} />

      {/* Résumé du budget */}
      <BudgetSummary
        budget={watch('budget')}
        isDailyBudget={watch('isDailyBudget')}
        startDate={watch('startDate')}
        endDate={watch('endDate')}
        estimatedReach={watch('estimatedReach')}
      />

      {/* Actions */}
      <div className="flex justify-end">
        <Button type="submit" disabled={!isFormValid}>
          Continuer vers le tracking
        </Button>
      </div>
    </form>
  );
}
