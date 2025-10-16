/**
 * Traffic Splitter Component
 * Interactive UI for configuring traffic distribution across variants
 */

'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Slider } from '@/app/modules/ui/slider';
import { Input } from '@/app/modules/ui/input';
import { Label } from '@/app/modules/ui/label';
import { Badge } from '@/app/modules/ui/badge';
import { AlertCircle, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Variant } from '../types';

interface TrafficSplitterProps {
  variants: Variant[];
  onChange: (variants: Variant[]) => void;
  disabled?: boolean;
}

export function TrafficSplitter({ variants, onChange, disabled }: TrafficSplitterProps) {
  const [localVariants, setLocalVariants] = useState(variants);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    setLocalVariants(variants);
  }, [variants]);

  const total = localVariants.reduce((sum, v) => sum + v.trafficPercentage, 0);
  const isValid = Math.abs(total - 100) < 0.01;

  const handlePercentageChange = useCallback(
    (index: number, value: number) => {
      const newVariants = [...localVariants];
      const oldValue = newVariants[index].trafficPercentage;
      const delta = value - oldValue;

      // Update the changed variant
      newVariants[index].trafficPercentage = value;

      // Distribute the delta proportionally among other variants
      const otherVariants = newVariants.filter((_, i) => i !== index);
      const otherTotal = otherVariants.reduce((sum, v) => sum + v.trafficPercentage, 0);

      if (otherTotal > 0 && Math.abs(delta) > 0.01) {
        otherVariants.forEach((variant) => {
          const proportion = variant.trafficPercentage / otherTotal;
          const adjustment = -delta * proportion;
          variant.trafficPercentage = Math.max(
            0,
            Math.min(100, variant.trafficPercentage + adjustment)
          );
        });
      }

      setLocalVariants(newVariants);
      onChange(newVariants);
    },
    [localVariants, onChange]
  );

  const handleInputChange = useCallback(
    (index: number, value: string) => {
      const numValue = parseFloat(value);
      if (!isNaN(numValue) && numValue >= 0 && numValue <= 100) {
        handlePercentageChange(index, numValue);
      }
    },
    [handlePercentageChange]
  );

  const handleEqualSplit = useCallback(() => {
    const equalPercentage = 100 / localVariants.length;
    const newVariants = localVariants.map((v) => ({
      ...v,
      trafficPercentage: equalPercentage,
    }));
    setLocalVariants(newVariants);
    onChange(newVariants);
  }, [localVariants, onChange]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Label className="text-base font-semibold">Répartition du trafic</Label>
          <p className="text-sm text-muted-foreground mt-1">
            Configurez la distribution du trafic entre les variantes
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleEqualSplit}
            disabled={disabled}
            className="text-sm text-primary hover:underline disabled:opacity-50"
          >
            Répartition égale
          </button>
          {isValid ? (
            <Badge variant="default" className="gap-1">
              <Check className="w-3 h-3" />
              Valide
            </Badge>
          ) : (
            <Badge variant="destructive" className="gap-1">
              <AlertCircle className="w-3 h-3" />
              {total.toFixed(1)}%
            </Badge>
          )}
        </div>
      </div>

      {/* Visual Splitter */}
      <div className="relative h-12 bg-muted rounded-lg overflow-hidden">
        <div className="absolute inset-0 flex">
          {localVariants.map((variant, index) => (
            <div
              key={variant.id || index}
              className={cn(
                'relative flex items-center justify-center text-xs font-medium text-white transition-all',
                index === 0 && 'bg-blue-500',
                index === 1 && 'bg-green-500',
                index === 2 && 'bg-purple-500',
                index === 3 && 'bg-orange-500',
                index >= 4 && 'bg-pink-500'
              )}
              style={{ width: `${variant.trafficPercentage}%` }}
            >
              {variant.trafficPercentage > 10 && (
                <span>{variant.trafficPercentage.toFixed(1)}%</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Variant Controls */}
      <div className="space-y-4">
        {localVariants.map((variant, index) => (
          <div key={variant.id || index} className="p-4 border rounded-lg space-y-3 bg-card">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    'w-3 h-3 rounded-full',
                    index === 0 && 'bg-blue-500',
                    index === 1 && 'bg-green-500',
                    index === 2 && 'bg-purple-500',
                    index === 3 && 'bg-orange-500',
                    index >= 4 && 'bg-pink-500'
                  )}
                />
                <Label className="font-medium">{variant.name}</Label>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={variant.trafficPercentage.toFixed(1)}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  disabled={disabled}
                  className="w-20 text-right"
                  aria-label={`Pourcentage pour ${variant.name}`}
                />
                <span className="text-sm text-muted-foreground">%</span>
              </div>
            </div>

            <Slider
              value={[variant.trafficPercentage]}
              onValueChange={([value]) => handlePercentageChange(index, value)}
              min={0}
              max={100}
              step={0.1}
              disabled={disabled}
              className="w-full"
              aria-label={`Slider pour ${variant.name}`}
            />
          </div>
        ))}
      </div>

      {/* Validation Message */}
      {!isValid && (
        <div className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
          <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-destructive">La répartition doit totaliser 100%</p>
            <p className="text-muted-foreground mt-1">
              Total actuel: {total.toFixed(1)}% (
              {total > 100 ? `+${(total - 100).toFixed(1)}%` : `${(total - 100).toFixed(1)}%`})
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
