'use client';

import React, { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/app/modules/ui/button';
import { CalendarSection } from './CalendarSection';
import { BudgetSection } from './BudgetSection';
import { EstimationCard } from './EstimationCard';
import { PlanningStepSchema, type PlanningStepData } from '../validators';
import { calculateEstimatedReach } from '../../../mock-data';

interface PlanningFormProps {
  initialData?: PlanningStepData;
  onSubmit: (data: PlanningStepData) => void;
  onValidationChange?: (isValid: boolean) => void;
}

export function PlanningForm({ initialData, onSubmit, onValidationChange }: PlanningFormProps) {
  const [budget, setBudget] = useState(initialData?.budget || 100);
  const [isDailyBudget, setIsDailyBudget] = useState(initialData?.isDailyBudget || false);
  const [estimatedReach, setEstimatedReach] = useState(0);

  const form = useForm<PlanningStepData>({
    resolver: zodResolver(PlanningStepSchema),
    defaultValues: {
      startDate: initialData?.startDate || '',
      endDate: initialData?.endDate || '',
      timezone: initialData?.timezone || 'Europe/Paris',
      budget: budget,
      currency: initialData?.currency || 'EUR',
      isDailyBudget: isDailyBudget,
    },
  });

  const {
    handleSubmit,
    formState: { isValid },
    watch,
  } = form;

  const startDate = watch('startDate');
  const endDate = watch('endDate');
  const currency = watch('currency');

  // Calcul du reach estimé
  React.useEffect(() => {
    if (budget > 0) {
      const reach = calculateEstimatedReach(budget, currency);
      setEstimatedReach(reach);
    }
  }, [budget, currency]);

  // Notification de validation
  React.useEffect(() => {
    onValidationChange?.(isValid);
  }, [isValid, onValidationChange]);

  const calculateDuration = useCallback(() => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }, [startDate, endDate]);

  const getTotalBudget = useCallback(() => {
    if (!isDailyBudget) return budget;
    const duration = calculateDuration();
    return duration > 0 ? budget * duration : budget;
  }, [budget, isDailyBudget, calculateDuration]);

  const duration = calculateDuration();
  const totalBudget = getTotalBudget();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <CalendarSection form={form} duration={duration} />

      <BudgetSection
        form={form}
        budget={budget}
        setBudget={setBudget}
        isDailyBudget={isDailyBudget}
        setIsDailyBudget={setIsDailyBudget}
        duration={duration}
        totalBudget={totalBudget}
        estimatedReach={estimatedReach}
      />

      <EstimationCard
        budget={totalBudget}
        currency={currency}
        duration={duration}
        reach={estimatedReach}
        isDailyBudget={isDailyBudget}
      />

      <div className="flex justify-end">
        <Button type="submit" disabled={!isValid}>
          Continuer vers le tracking
        </Button>
      </div>
    </form>
  );
}
