'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/modules/ui/card';
import { Button } from '@/app/modules/ui/button';
import { Badge } from '@/app/modules/ui/badge';
import { cn } from '@/lib/utils';

interface Campaign {
  name: string;
  opens: number;
  clicks: number;
  conversions: number;
  revenue: number;
}

interface TopCampaignsProps {
  campaigns: Campaign[];
  title?: string;
  onViewAll?: () => void;
  className?: string;
}

export function TopCampaigns({
  campaigns,
  title = 'Top campagnes',
  onViewAll,
  className,
}: TopCampaignsProps) {
  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('fr-FR').format(num);
  };

  const calculateConversionRate = (conversions: number, clicks: number): string => {
    if (clicks === 0) return '0.0';
    return ((conversions / clicks) * 100).toFixed(1);
  };

  return (
    <Card className={cn('bg-card text-card-foreground border-border', className)}>
      <CardHeader className="pb-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-lg font-semibold text-foreground">{title}</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onViewAll}
            className="self-start sm:self-auto text-primary hover:text-primary/80"
          >
            Voir tout
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        {campaigns.map((campaign, index) => (
          <div
            key={index}
            className="flex flex-col gap-3 p-4 rounded-lg border border-border bg-card hover:bg-accent/50 transition-all duration-200 sm:flex-row sm:items-center sm:justify-between"
          >
            {/* Informations principales */}
            <div className="space-y-2 flex-1">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                <h4 className="font-medium text-sm text-foreground leading-tight">
                  {campaign.name}
                </h4>
                <Badge variant="outline" className="text-xs w-fit border-primary/20 text-primary">
                  #{index + 1}
                </Badge>
              </div>

              {/* Métriques - Responsive layout */}
              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground sm:flex sm:items-center sm:gap-4">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[hsl(var(--color-chart-1))]"></span>
                  {formatNumber(campaign.opens)} ouvertures
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[hsl(var(--color-chart-2))]"></span>
                  {formatNumber(campaign.clicks)} clics
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[hsl(var(--color-success))]"></span>
                  {campaign.conversions} conversions
                </span>
                <span className="text-[hsl(var(--color-warning))] font-medium">
                  {calculateConversionRate(campaign.conversions, campaign.clicks)}% conv.
                </span>
              </div>
            </div>

            {/* Revenus */}
            <div className="text-right space-y-1 border-t pt-3 sm:border-t-0 sm:pt-0 sm:border-l sm:pl-4">
              <p className="text-lg font-bold text-foreground">€{formatNumber(campaign.revenue)}</p>
              <p className="text-xs text-muted-foreground">
                {campaign.revenue > 0 ? 'Revenus générés' : 'Pas de revenus'}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
