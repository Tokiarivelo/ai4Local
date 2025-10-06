'use client';

import React from 'react';
import { DashboardOverview } from '@/components/dashboard';

/**
 * Page principale du tableau de bord
 * Utilise le composant DashboardOverview modulaire
 */
export default function DashboardPage() {
  const handleAnalyticsClick = () => {
    // Navigation vers les analytics
    console.log('Navigation vers analytics');
  };

  const handleDateFilterClick = () => {
    // Ouvrir le sélecteur de date
    console.log('Ouvrir sélecteur de date');
  };

  const handleViewAllCampaigns = () => {
    // Navigation vers la liste complète des campagnes
    console.log('Navigation vers campagnes');
  };

  return (
    <DashboardOverview
      onAnalyticsClick={handleAnalyticsClick}
      onDateFilterClick={handleDateFilterClick}
      onViewAllCampaigns={handleViewAllCampaigns}
    />
  );
}
