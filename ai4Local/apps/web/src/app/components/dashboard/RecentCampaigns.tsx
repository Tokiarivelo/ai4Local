import React from 'react';
import { Campaign } from '@/lib/types/campaign';
import { StatusBadge } from '@/components/common/StatusBadge';

interface RecentCampaignsProps {
  campaigns: Campaign[];
}

const RecentCampaigns: React.FC<RecentCampaignsProps> = ({ campaigns }) => {
  return (
    <div className='space-y-4'>
      {campaigns.map((campaign, index) => (
        <div
          key={index}
          className='flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors'
        >
          <div className='space-y-1'>
            <div className='flex items-center space-x-2'>
              <p className='font-medium text-sm'>{campaign.name}</p>
              <StatusBadge status={campaign.status} />
            </div>
            <div className='flex items-center space-x-4 text-xs text-muted-foreground'>
              <span>{campaign.audience} destinataires</span>
              {campaign.openRate > 0 && (
                <>
                  <span>• {campaign.openRate}% ouvert</span>
                  <span>• {campaign.clickRate}% cliqué</span>
                </>
              )}
            </div>
          </div>
          <div className='text-right'>
            <p className='text-xs text-muted-foreground'>
              {campaign.sentAt
                ? new Date(campaign.sentAt).toLocaleDateString('fr-FR')
                : 'Non envoyée'}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentCampaigns;