/**
 * Page de création de campagne - Entry point
 * Dashboard → Campaigns → Create
 */

import { Metadata } from 'next';
import { CampaignCreatePage } from '@/app/modules/campaigns/create';

export const metadata: Metadata = {
  title: 'Créer une campagne | AI4Local',
  description: 'Créez une nouvelle campagne marketing multicanal avec AI4Local',
};

export default function CreateCampaignPage() {
  return <CampaignCreatePage />;
}
