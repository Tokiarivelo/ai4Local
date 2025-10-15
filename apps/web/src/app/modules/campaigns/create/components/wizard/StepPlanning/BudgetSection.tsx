'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Wallet } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { Card } from '@/app/modules/ui/card';
import { Input } from '@/app/modules/ui/input';
import { Checkbox } from '@/app/modules/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/modules/ui/select';
import type { PlanningStepData } from '../validators';
import { getCurrencySymbol } from './utils';

interface BudgetSectionProps {
  form: UseFormReturn<PlanningStepData>;
  budget: number;
  setBudget: (budget: number) => void;
  isDailyBudget: boolean;
  setIsDailyBudget: (isDailyBudget: boolean) => void;
  duration: number;
  totalBudget: number;
  estimatedReach: number;
}

export function BudgetSection({
  form,
  budget,
  setBudget,
  isDailyBudget,
  setIsDailyBudget,
  duration,
  totalBudget,
  estimatedReach,
}: BudgetSectionProps) {
  const {
    formState: { errors },
    setValue,
    watch,
  } = form;

  const currency = watch('currency');

  const handleBudgetChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = Number(e.target.value);
      setBudget(value);
      setValue('budget', value);
    },
    [setBudget, setValue]
  );

  const handleCurrencyChange = React.useCallback(
    (value: string) => {
      setValue('currency', value as any);
    },
    [setValue]
  );

  const handleDailyBudgetChange = React.useCallback(
    (checked: boolean) => {
      setIsDailyBudget(checked);
      setValue('isDailyBudget', checked);
    },
    [setIsDailyBudget, setValue]
  );

  return (
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
          <Checkbox checked={isDailyBudget} onCheckedChange={handleDailyBudgetChange} />
        </div>

        {/* Configuration budget */}
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

          <Input
            type="number"
            value={budget}
            onChange={handleBudgetChange}
            max={isDailyBudget ? 500 : 10000}
            min={isDailyBudget ? 10 : 50}
            step={isDailyBudget ? 5 : 25}
            className="w-full"
            placeholder={`Entre ${isDailyBudget ? '10' : '50'} et ${isDailyBudget ? '500' : '10000'}`}
          />

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

      {errors.budget && <p className="text-sm text-destructive mt-2">{errors.budget.message}</p>}
    </Card>
  );
}
