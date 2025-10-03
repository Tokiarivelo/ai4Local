'use client';

import React, { useState } from 'react';
import { DollarSign, Eye, MousePointer, Target } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { QuickFilterTabs } from '@/components/layout/Tabs';
import { AnalyticsHeader } from '@/components/analytics/AnalyticsHeader';
import { KPICard } from '@/components/analytics/KPICard';
import { PerformanceChart } from '@/components/analytics/PerformanceChart';
import { ChannelDistributionChart } from '@/components/analytics/ChannelDistributionChart';
import { RevenueChart } from '@/components/analytics/RevenueChart';
import { ConversionFunnel } from '@/components/analytics/ConversionFunnel';
import { CohortAnalysis } from '@/components/analytics/CohortAnalysis';
import { TopCampaigns } from '@/components/analytics/TopCampaigns';

// Données exemple (à déplacer vers un service ou hook plus tard)
const performanceData = [
  { month: 'Jan', campaigns: 15, openRate: 22.5, clickRate: 3.2, revenue: 12500 },
  { month: 'Fev', campaigns: 18, openRate: 24.1, clickRate: 3.8, revenue: 15200 },
  { month: 'Mar', campaigns: 22, openRate: 26.3, clickRate: 4.1, revenue: 18900 },
  { month: 'Avr', campaigns: 19, openRate: 23.7, clickRate: 3.5, revenue: 16800 },
  { month: 'Mai', campaigns: 25, openRate: 28.2, clickRate: 4.6, revenue: 22100 },
  { month: 'Jun', campaigns: 23, openRate: 25.8, clickRate: 4.2, revenue: 20300 },
  { month: 'Jul', campaigns: 27, openRate: 30.1, clickRate: 5.1, revenue: 26500 },
  { month: 'Aoû', campaigns: 24, openRate: 27.9, clickRate: 4.8, revenue: 24200 },
  { month: 'Sep', campaigns: 26, openRate: 29.5, clickRate: 5.3, revenue: 28800 },
  { month: 'Oct', campaigns: 21, openRate: 26.7, clickRate: 4.4, revenue: 23600 },
  { month: 'Nov', campaigns: 29, openRate: 32.1, clickRate: 5.7, revenue: 31200 },
  { month: 'Dec', campaigns: 31, openRate: 34.2, clickRate: 6.1, revenue: 35400 },
];

const channelData = [
  { name: 'Email', value: 65, color: '#1F6CC5' },
  { name: 'SMS', value: 20, color: '#63B3ED' },
  { name: 'Push', value: 10, color: '#A7D8F9' },
  { name: 'Social', value: 5, color: '#0A4595' },
];

const funnelData = [
  { stage: 'Envoyés', value: 100000, percentage: 100 },
  { stage: 'Ouverts', value: 28500, percentage: 28.5 },
  { stage: 'Cliqués', value: 4750, percentage: 4.75 },
  { stage: 'Convertis', value: 950, percentage: 0.95 },
];

const cohortData = [
  { cohort: 'Jan 2024', month1: 100, month2: 85, month3: 72, month4: 68, month5: 65, month6: 62 },
  { cohort: 'Fev 2024', month1: 100, month2: 88, month3: 75, month4: 70, month5: 67, month6: 0 },
  { cohort: 'Mar 2024', month1: 100, month2: 82, month3: 78, month4: 74, month5: 0, month6: 0 },
  { cohort: 'Avr 2024', month1: 100, month2: 90, month3: 81, month4: 0, month5: 0, month6: 0 },
  { cohort: 'Mai 2024', month1: 100, month2: 87, month3: 0, month4: 0, month5: 0, month6: 0 },
  { cohort: 'Jun 2024', month1: 100, month2: 0, month3: 0, month4: 0, month5: 0, month6: 0 },
];

const topCampaigns = [
  { name: 'Black Friday 2024', opens: 15420, clicks: 2180, conversions: 387, revenue: 18500 },
  { name: 'Newsletter Hebdo', opens: 8950, clicks: 1120, conversions: 98, revenue: 4200 },
  { name: 'Relance Panier', opens: 3200, clicks: 890, conversions: 245, revenue: 12800 },
  { name: 'Soldes Été', opens: 12100, clicks: 1850, conversions: 298, revenue: 15200 },
  { name: 'Enquête Client', opens: 5600, clicks: 420, conversions: 0, revenue: 0 },
];

const stats = [
  {
    title: 'Revenus totaux',
    value: '€287,430',
    change: '+18.2%',
    changeType: 'increase' as const,
    icon: DollarSign,
    description: 'vs période précédente',
  },
  {
    title: "Taux d'ouverture moyen",
    value: '28.4%',
    change: '+2.1%',
    changeType: 'increase' as const,
    icon: Eye,
    description: 'vs période précédente',
  },
  {
    title: 'Taux de clic moyen',
    value: '4.7%',
    change: '+0.8%',
    changeType: 'increase' as const,
    icon: MousePointer,
    description: 'vs période précédente',
  },
  {
    title: 'ROI moyen',
    value: '3.2x',
    change: '-0.1x',
    changeType: 'decrease' as const,
    icon: Target,
    description: 'vs période précédente',
  },
];

export default function AnalyticsPage() {
  const [activePeriod, setActivePeriod] = useState('year');

  const periodFilters = [
    { id: 'week', label: 'Cette semaine', count: 0 },
    { id: 'month', label: 'Ce mois', count: 0 },
    { id: 'quarter', label: 'Ce trimestre', count: 0 },
    { id: 'year', label: 'Cette année', count: 0 },
  ];

  const handleSelectPeriod = () => {
    console.log('Sélection de période');
  };

  const handleAdvancedFilters = () => {
    console.log('Filtres avancés');
  };

  const handleExport = () => {
    console.log('Export des données');
  };

  const handleViewAllCampaigns = () => {
    console.log('Voir toutes les campagnes');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Breadcrumbs items={[{ label: 'Analytics' }]} />

        <AnalyticsHeader
          onSelectPeriod={handleSelectPeriod}
          onAdvancedFilters={handleAdvancedFilters}
          onExport={handleExport}
        />

        <QuickFilterTabs
          filters={periodFilters}
          activeFilter={activePeriod}
          onFilterChange={setActivePeriod}
        />

        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <KPICard key={index} {...stat} />
          ))}
        </div>

        {/* Performance Overview */}
        <div className="grid gap-6 lg:grid-cols-2">
          <PerformanceChart data={performanceData} />
        </div>

        {/* Charts Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          <ChannelDistributionChart data={channelData} />
          <RevenueChart data={performanceData} />
          <ConversionFunnel data={funnelData} />
        </div>

        <CohortAnalysis data={cohortData} />

        <TopCampaigns campaigns={topCampaigns} onViewAll={handleViewAllCampaigns} />
      </div>
    </DashboardLayout>
  );
}
