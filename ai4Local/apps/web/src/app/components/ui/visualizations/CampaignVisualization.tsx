import React from 'react';
import { BarChart } from '../charts/BarChart';
import { LineChart } from '../charts/LineChart';
import { PieChart } from '../charts/PieChart';
import { CampaignData } from '../../../lib/types/campaign';

interface CampaignVisualizationProps {
  campaignData: CampaignData[];
}

const CampaignVisualization: React.FC<CampaignVisualizationProps> = ({ campaignData }) => {
  const totalCampaigns = campaignData.length;
  const activeCampaigns = campaignData.filter(campaign => campaign.status === 'active').length;
  const completedCampaigns = campaignData.filter(campaign => campaign.status === 'completed').length;

  const performanceData = campaignData.map(campaign => ({
    name: campaign.name,
    openRate: campaign.openRate,
    clickRate: campaign.clickRate,
  }));

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Visualisations des Campagnes</h2>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-medium">Total des Campagnes</h3>
          <p className="text-3xl">{totalCampaigns}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-medium">Campagnes Actives</h3>
          <p className="text-3xl">{activeCampaigns}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-medium">Campagnes Terminées</h3>
          <p className="text-3xl">{completedCampaigns}</p>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <BarChart data={performanceData} />
        <LineChart data={performanceData} />
        <PieChart data={performanceData} />
      </div>
    </div>
  );
};

export default CampaignVisualization;