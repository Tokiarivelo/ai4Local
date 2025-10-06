'use client';

import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface KPICardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease';
  icon: LucideIcon;
  description: string;
  className?: string;
}

export function KPICard({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  description,
  className,
}: KPICardProps) {
  const isPositive = changeType === 'increase';

  return (
    <Card
      className={cn(
        'bg-card text-card-foreground border-border transition-all duration-200 hover:shadow-md hover:shadow-primary/5 hover:border-primary/20',
        className
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground truncate pr-2">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="text-2xl font-bold text-foreground leading-none">{value}</div>
        <div className="flex items-center gap-1 text-xs">
          {isPositive ? (
            <TrendingUp className="h-3 w-3 text-[hsl(var(--color-success))]" />
          ) : (
            <TrendingDown className="h-3 w-3 text-[hsl(var(--color-destructive))]" />
          )}
          <span
            className={cn(
              'font-medium',
              isPositive
                ? 'text-[hsl(var(--color-success))]'
                : 'text-[hsl(var(--color-destructive))]'
            )}
          >
            {change}
          </span>
          <span className="text-muted-foreground ml-1">{description}</span>
        </div>
      </CardContent>
    </Card>
  );
}
