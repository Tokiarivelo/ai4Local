/**
 * Étape Planning - Budget et calendrier
 * Gère la définition du budget, des dates et calcule le reach estimé
 */

'use client';

import React, { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  Euro,
  Target,
  TrendingUp,
  Info,
  CalendarDays,
  Wallet,
} from 'lucide-react';

import { Card } from '@/app/modules/ui/card';
import { Button } from '@/app/modules/ui/button';
import { Input } from '@/app/modules/ui/input';
import { Badge } from '@/app/modules/ui/badge';
import { Checkbox } from '@/app/modules/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/modules/ui/select';

import { PlanningStepSchema, type PlanningStepData } from './validators';
import { useCampaignCreateContext } from '../../context/WizardContext';
import { calculateEstimatedReach } from '../../mock-data';

interface StepPlanningProps {
  onComplete?: () => void;
  onValidationChange?: (isValid: boolean) => void;
}

export function StepPlanning({ onComplete, onValidationChange }: StepPlanningProps) {
  const { data, updateStepData, completeStep } = useCampaignCreateContext();

  const [budget, setBudget] = useState(data.planning?.budget || 100);
  const [isDailyBudget, setIsDailyBudget] = useState(data.planning?.isDailyBudget || false);
  const [estimatedReach, setEstimatedReach] = useState(0);

  const form = useForm<PlanningStepData>({
    resolver: zodResolver(PlanningStepSchema),
    defaultValues: {
      startDate: data.planning?.startDate || '',
      endDate: data.planning?.endDate || '',
      timezone: data.planning?.timezone || 'Europe/Paris',
      budget: budget,
      currency: data.planning?.currency || 'EUR',
      isDailyBudget: isDailyBudget,
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
  } = form;

  // Watch spécifique pour éviter les re-renders inutiles
  const startDate = watch('startDate');
  const endDate = watch('endDate');
  const timezone = watch('timezone');
  const currency = watch('currency');

  // Calcul du reach estimé avec stabilisation
  React.useEffect(() => {
    if (budget > 0) {
      const reach = calculateEstimatedReach(budget, currency);
      setEstimatedReach(reach);
    }
  }, [budget, currency]);

  // Mise à jour du contexte avec stabilisation
  React.useEffect(() => {
    updateStepData({
      planning: {
        startDate,
        endDate,
        timezone,
        currency,
        budget,
        isDailyBudget,
        estimatedReach,
      },
    });
  }, [
    startDate,
    endDate,
    timezone,
    currency,
    budget,
    isDailyBudget,
    estimatedReach,
    updateStepData,
  ]);

  // Notification de validation avec mémorisation
  const isFormValidMemo = React.useMemo(() => {
    return isValid;
  }, [isValid]);

  React.useEffect(() => {
    onValidationChange?.(isFormValidMemo);
  }, [isFormValidMemo, onValidationChange]);

  // Budget handling avec stabilisation
  const handleBudgetChange = useCallback(
    (value: number[]) => {
      setBudget(value[0]);
      setValue('budget', value[0]);
    },
    [setValue]
  );

  // Select handlers avec stabilisation useRef
  const handleTimezoneChangeRef = React.useRef<(value: string) => void>();
  handleTimezoneChangeRef.current = (value: string) => {
    setValue('timezone', value);
  };

  const handleTimezoneChange = React.useCallback((value: string) => {
    handleTimezoneChangeRef.current?.(value);
  }, []);

  const handleCurrencyChangeRef = React.useRef<(value: string) => void>();
  handleCurrencyChangeRef.current = (value: string) => {
    setValue('currency', value as any);
  };

  const handleCurrencyChange = React.useCallback((value: string) => {
    handleCurrencyChangeRef.current?.(value);
  }, []);

  const getCurrencySymbol = (currency: string) => {
    switch (currency) {
      case 'EUR':
        return '€';
      case 'USD':
        return '$';
      case 'MGA':
        return 'Ar';
      default:
        return '€';
    }
  };

  const calculateDuration = () => {
    if (!startDate || !endDate) return 0;

    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getTotalBudget = () => {
    if (!isDailyBudget) return budget;

    const duration = calculateDuration();
    return duration > 0 ? budget * duration : budget;
  };

  const onSubmit = (data: PlanningStepData) => {
    completeStep('schedule_budget');
    onComplete?.();
  };

  const duration = calculateDuration();
  const totalBudget = getTotalBudget();

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div>
        <h3 className="text-lg font-semibold">Planning et budget</h3>
        <p className="text-sm text-muted-foreground">
          Définissez la période et le budget de votre campagne
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Calendrier */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <CalendarDays className="h-5 w-5 text-primary" />
            <h4 className="font-medium">Calendrier de campagne</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Date de début *</label>
              <Input
                type="date"
                {...register('startDate')}
                min={new Date().toISOString().split('T')[0]}
                className={errors.startDate ? 'border-destructive' : ''}
              />
              {errors.startDate && (
                <p className="text-sm text-destructive">{errors.startDate.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Date de fin *</label>
              <Input
                type="date"
                {...register('endDate')}
                min={startDate || new Date().toISOString().split('T')[0]}
                className={errors.endDate ? 'border-destructive' : ''}
              />
              {errors.endDate && (
                <p className="text-sm text-destructive">{errors.endDate.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Fuseau horaire</label>
              <Select value={timezone} onValueChange={handleTimezoneChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Europe/Paris">Europe/Paris (UTC+1)</SelectItem>
                  <SelectItem value="Indian/Antananarivo">Madagascar (UTC+3)</SelectItem>
                  <SelectItem value="UTC">UTC (UTC+0)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {duration > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 bg-muted rounded-lg"
            >
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-primary" />
                <span>
                  Durée de campagne :{' '}
                  <strong>
                    {duration} jour{duration > 1 ? 's' : ''}
                  </strong>
                </span>
              </div>
            </motion.div>
          )}
        </Card>

        {/* Budget */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Wallet className="h-5 w-5 text-primary" />
            <h4 className="font-medium">Configuration du budget</h4>
          </div>

          <div className="space-y-6">
            {/* Type de budget */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <div className="font-medium">Budget quotidien</div>
                <div className="text-sm text-muted-foreground">
                  {isDailyBudget
                    ? 'Le budget sera réparti sur toute la durée'
                    : 'Budget total pour toute la campagne'}
                </div>
              </div>
              <Checkbox
                checked={isDailyBudget}
                onCheckedChange={(checked: boolean) => {
                  setIsDailyBudget(checked);
                  setValue('isDailyBudget', checked);
                }}
              />
            </div>

            {/* Input de budget */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">
                  {isDailyBudget ? 'Budget par jour' : 'Budget total'}
                </label>
                <div className="flex items-center gap-2">
                  <Select value={currency} onValueChange={handleCurrencyChange}>
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="MGA">MGA</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="px-3">
                <Input
                  type="number"
                  value={budget}
                  onChange={(e) => handleBudgetChange([Number(e.target.value)])}
                  max={isDailyBudget ? 500 : 10000}
                  min={isDailyBudget ? 10 : 50}
                  step={isDailyBudget ? 5 : 25}
                  className="w-full"
                  placeholder={`Entre ${isDailyBudget ? '10' : '50'} et ${isDailyBudget ? '500' : '10000'}`}
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {isDailyBudget ? '10' : '50'} {getCurrencySymbol(currency)}
                </span>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {budget} {getCurrencySymbol(currency)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {isDailyBudget ? 'par jour' : 'total'}
                  </div>
                </div>
                <span className="text-muted-foreground">
                  {isDailyBudget ? '500' : '10 000'} {getCurrencySymbol(currency)}
                </span>
              </div>
            </div>

            {/* Résumé budget */}
            {duration > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted rounded-lg"
              >
                <div className="text-center">
                  <div className="text-lg font-semibold text-primary">
                    {budget} {getCurrencySymbol(currency)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {isDailyBudget ? 'Par jour' : 'Budget total'}
                  </div>
                </div>

                {isDailyBudget && (
                  <div className="text-center">
                    <div className="text-lg font-semibold">
                      {totalBudget} {getCurrencySymbol(currency)}
                    </div>
                    <div className="text-xs text-muted-foreground">Total estimé</div>
                  </div>
                )}

                <div className="text-center">
                  <div className="text-lg font-semibold text-green-600">
                    {estimatedReach.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground">Reach estimé</div>
                </div>
              </motion.div>
            )}
          </div>

          {errors.budget && (
            <p className="text-sm text-destructive mt-2">{errors.budget.message}</p>
          )}
        </Card>

        {/* Prévisions et recommendations */}
        <EstimationCard
          budget={totalBudget}
          currency={currency}
          duration={duration}
          reach={estimatedReach}
          isDailyBudget={isDailyBudget}
        />

        {/* Actions */}
        <div className="flex justify-end">
          <Button type="submit" disabled={!isValid}>
            Continuer vers le tracking
          </Button>
        </div>
      </form>
    </div>
  );
}

// Carte d'estimation et recommendations
function EstimationCard({
  budget,
  currency,
  duration,
  reach,
  isDailyBudget,
}: {
  budget: number;
  currency: string;
  duration: number;
  reach: number;
  isDailyBudget: boolean;
}) {
  const getCurrencySymbol = (currency: string) => {
    switch (currency) {
      case 'EUR':
        return '€';
      case 'USD':
        return '$';
      case 'MGA':
        return 'Ar';
      default:
        return '€';
    }
  };

  const calculateMetrics = () => {
    const cpm = budget > 0 && reach > 0 ? (budget / reach) * 1000 : 0;
    const dailyReach = duration > 0 ? reach / duration : reach;

    return {
      cpm: cpm.toFixed(2),
      dailyReach: Math.round(dailyReach),
      frequency: duration > 0 ? (duration * 1.2).toFixed(1) : '1.0',
    };
  };

  const metrics = calculateMetrics();

  if (duration === 0 || budget === 0) return null;

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="h-5 w-5 text-primary" />
        <h4 className="font-medium">Prévisions de performance</h4>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-4 bg-muted rounded-lg">
          <div className="text-2xl font-bold text-primary">{reach.toLocaleString()}</div>
          <div className="text-sm text-muted-foreground">Personnes touchées</div>
        </div>

        <div className="text-center p-4 bg-muted rounded-lg">
          <div className="text-2xl font-bold">{metrics.dailyReach.toLocaleString()}</div>
          <div className="text-sm text-muted-foreground">Reach quotidien</div>
        </div>

        <div className="text-center p-4 bg-muted rounded-lg">
          <div className="text-2xl font-bold">
            {metrics.cpm} {getCurrencySymbol(currency)}
          </div>
          <div className="text-sm text-muted-foreground">CPM estimé</div>
        </div>

        <div className="text-center p-4 bg-muted rounded-lg">
          <div className="text-2xl font-bold">{metrics.frequency}</div>
          <div className="text-sm text-muted-foreground">Fréquence</div>
        </div>
      </div>

      <div className="space-y-3">
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex items-start gap-2">
            <Info className="h-4 w-4 text-blue-600 mt-0.5" />
            <div>
              <div className="font-medium text-blue-900">Recommandations :</div>
              <div className="text-sm text-blue-800">
                {budget < 100 && <div>• Augmentez votre budget pour améliorer la portée.</div>}
                {duration > 30 && <div>• Une campagne longue permet un meilleur engagement.</div>}
                {duration < 7 && <div>• Une durée plus longue améliore la mémorisation.</div>}
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="font-medium">Optimisations suggérées :</div>
            <ul className="space-y-1 text-muted-foreground">
              <li>
                •{' '}
                {isDailyBudget
                  ? 'Budget réparti uniformément'
                  : 'Budget concentré pour impact maximal'}
              </li>
              <li>• Ciblage précis recommandé</li>
              <li>• A/B test pour optimiser les créatifs</li>
            </ul>
          </div>

          <div className="space-y-2">
            <div className="font-medium">Métriques clés à surveiller :</div>
            <ul className="space-y-1 text-muted-foreground">
              <li>• CTR (taux de clic)</li>
              <li>• Coût par acquisition</li>
              <li>• Fréquence d'exposition</li>
              <li>• Taux de conversion</li>
            </ul>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default StepPlanning;
