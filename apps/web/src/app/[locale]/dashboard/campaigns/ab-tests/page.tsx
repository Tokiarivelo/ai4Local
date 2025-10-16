/**
 * Page de création de campagne - Entry point
 * Dashboard → Campaigns → Create
 */

import { Metadata } from 'next';
import AbTest from '@/app/modules/campaigns/ab-tests';

export const metadata: Metadata = {
  title: 'A/B Tests | AI4Local',
  description: 'Créez un nouveau test A/B avec AI4Local',
};

export default function AbTestPage() {
  return <AbTest />;
}
