'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, Clock } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { Card } from '@/app/modules/ui/card';
import { Input } from '@/app/modules/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/modules/ui/select';
import type { PlanningStepData } from '../validators';

interface CalendarSectionProps {
  form: UseFormReturn<PlanningStepData>;
  duration: number;
}

export function CalendarSection({ form, duration }: CalendarSectionProps) {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = form;

  const startDate = watch('startDate');
  const timezone = watch('timezone');

  const handleTimezoneChange = React.useCallback(
    (value: string) => {
      setValue('timezone', value);
    },
    [setValue]
  );

  return (
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
          {errors.endDate && <p className="text-sm text-destructive">{errors.endDate.message}</p>}
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
  );
}
