'use client';

import React from 'react';
import { Info } from 'lucide-react';
import { Card } from '@/app/modules/ui/card';
import type { CampaignChannel, CampaignObjective } from '../../../types';

interface RecommendationsCardProps {
  selectedObjective: CampaignObjective | null;
  selectedChannels: CampaignChannel[];
}

export function RecommendationsCard({
  selectedObjective,
  selectedChannels,
}: RecommendationsCardProps) {
  const getObjectiveRecommendations = () => {
    switch (selectedObjective) {
      case 'awareness':
        return '• Pour la notoriété, privilégiez Facebook, Instagram et Google Ads';
      case 'leads':
        return '• Pour les leads, combinez LinkedIn, email et Google Ads';
      case 'sales':
        return '• Pour les ventes, utilisez Google Ads, Facebook et email';
      case 'traffic':
        return '• Pour le trafic, Google Ads et SEO sont très efficaces';
      case 'engagement':
        return "• Pour l'engagement, misez sur les réseaux sociaux et l'email";
      case 'conversions':
        return '• Pour les conversions, optimisez vos landing pages et utilisez le retargeting';
      default:
        return '';
    }
  };

  const getChannelRecommendations = () => {
    if (selectedChannels.length > 3) {
      return '• Attention: trop de canaux peuvent diluer votre message';
    }
    if (selectedChannels.length === 1) {
      return '• Considérez ajouter 1-2 canaux complémentaires pour maximiser la portée';
    }
    return '';
  };

  const objectiveRec = getObjectiveRecommendations();
  const channelRec = getChannelRecommendations();

  return (
    <Card className="p-4 bg-blue-50 border-blue-200">
      <div className="flex items-start gap-2">
        <Info className="h-4 w-4 text-blue-600 mt-0.5" />
        <div>
          <div className="font-medium text-blue-900 mb-1">💡 Recommandations</div>
          <div className="text-sm text-blue-800 space-y-1">
            {objectiveRec && <p>{objectiveRec}</p>}
            {channelRec && <p>{channelRec}</p>}
            <p>• Un nom descriptif améliore le suivi de vos performances</p>
            <p>• Testez toujours vos campagnes sur un petit segment avant le déploiement complet</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
