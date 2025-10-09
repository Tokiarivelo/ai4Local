import React from 'react';
import { Metadata } from 'next';
import { NotificationsLayout } from '@/app/modules/dashboard/notifications';

export const metadata: Metadata = {
  title: 'Notifications - AI4Local',
  description:
    'Gérez toutes vos notifications et alertes AI4Local en un seul endroit. Restez informé des activités de vos campagnes, messages et intégrations.',
  keywords: ['notifications', 'alertes', 'messages', 'campagnes', 'AI4Local', 'gestion'],
  openGraph: {
    title: 'Notifications - AI4Local',
    description: 'Centre de notifications AI4Local - Gérez tous vos messages et alertes',
    type: 'website',
  },
};

export default function NotificationsPage() {
  return (
    <>
      {/* Breadcrumb pour la navigation */}
      <nav aria-label="Breadcrumb" className="hidden">
        <ol>
          <li>
            <a href="/dashboard">Tableau de bord</a>
          </li>
          <li aria-current="page">Notifications</li>
        </ol>
      </nav>

      {/* Page principale */}
      <NotificationsLayout />
    </>
  );
}
