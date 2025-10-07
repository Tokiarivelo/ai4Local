'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/modules/ui/card';
import { Button } from '@/app/modules/ui/button';
import { StatusBadge, CampaignStatus } from '@/app/modules/ui/status-badge';

export interface Campaign {
  id?: string;
  name: string;
  status: CampaignStatus;
  audience: number;
  openRate: number;
  clickRate: number;
  sentAt: string | null;
}

const defaultCampaigns: Campaign[] = [
  {
    name: 'Promo Black Friday',
    status: 'active',
    audience: 1250,
    openRate: 28.4,
    clickRate: 4.2,
    sentAt: '2024-11-15',
  },
  {
    name: 'Newsletter Hebdo #47',
    status: 'completed',
    audience: 2847,
    openRate: 22.1,
    clickRate: 3.8,
    sentAt: '2024-11-12',
  },
  {
    name: 'Relance Panier Abandonné',
    status: 'active',
    audience: 156,
    openRate: 35.2,
    clickRate: 8.9,
    sentAt: '2024-11-14',
  },
  {
    name: 'Enquête Satisfaction',
    status: 'draft',
    audience: 2847,
    openRate: 0,
    clickRate: 0,
    sentAt: null,
  },
];

interface RecentCampaignsProps {
  campaigns?: Campaign[];
  onViewAll?: () => void;
}

export const RecentCampaigns: React.FC<RecentCampaignsProps> = ({
  campaigns = defaultCampaigns,
  onViewAll,
}) => {
  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Campagnes récentes</CardTitle>
          <Button variant="ghost" size="sm" onClick={onViewAll}>
            Voir tout
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {campaigns.map((campaign, index) => (
            <div
              key={campaign.id || index}
              className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <p className="font-medium text-sm">{campaign.name}</p>
                  <StatusBadge status={campaign.status} />
                </div>
                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                  <span>{campaign.audience.toLocaleString('fr-FR')} destinataires</span>
                  {campaign.openRate > 0 && (
                    <>
                      <span>• {campaign.openRate}% ouvert</span>
                      <span>• {campaign.clickRate}% cliqué</span>
                    </>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">
                  {campaign.sentAt
                    ? new Date(campaign.sentAt).toLocaleDateString('fr-FR')
                    : 'Non envoyée'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
