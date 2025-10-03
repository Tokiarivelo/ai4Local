'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

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
}

export function TopCampaigns({ campaigns, title = 'Top campagnes', onViewAll }: TopCampaignsProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{title}</CardTitle>
          <Button variant="ghost" size="sm" onClick={onViewAll}>
            Voir tout
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {campaigns.map((campaign, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <p className="font-medium text-sm">{campaign.name}</p>
                  <Badge variant="outline" className="text-xs">
                    #{index + 1}
                  </Badge>
                </div>
                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                  <span>{campaign.opens.toLocaleString()} ouvertures</span>
                  <span>• {campaign.clicks.toLocaleString()} clics</span>
                  <span>• {campaign.conversions} conversions</span>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-sm">€{campaign.revenue.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">
                  {campaign.conversions > 0
                    ? `${((campaign.conversions / campaign.clicks) * 100).toFixed(1)}% conv.`
                    : 'Pas de vente'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
