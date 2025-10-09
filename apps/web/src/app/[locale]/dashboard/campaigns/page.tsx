/**
 * Page principale des campagnes AI4Local
 * Route: /[locale]/dashboard/campaigns
 */

import { CampaignsPage } from '@/app/modules/campaigns/welcome/components';

export default function CampaignsPageRoute() {
  return <CampaignsPage />;
}

export const metadata = {
  title: 'Campagnes | AI4Local Dashboard',
  description: 'Gérez et optimisez vos campagnes marketing multi-canaux avec AI4Local',
};
