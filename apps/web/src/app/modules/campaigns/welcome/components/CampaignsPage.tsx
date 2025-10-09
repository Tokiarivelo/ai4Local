/**
 * Page principale des campagnes
 * Compose : Stats + Toolbar + Filters + CampaignsList + RightPane
 */

'use client';

import { useState, useCallback } from 'react';
import CampaignsLayout from './CampaignsLayout';
import CampaignsToolbar from './CampaignsToolbar';
import CampaignFilters from './CampaignFilters';
import CampaignsStatsCards from './CampaignsStatsCards';
import CampaignsList from './CampaignsList';
import CampaignRightPane from './CampaignRightPane';
import { useCampaigns } from '../hooks/useCampaigns';
import type { Campaign, FilterOptions } from '../types';

export default function CampaignsPage() {
  const {
    campaigns,
    filteredCampaigns,
    filters,
    loading,
    selectedCampaign,
    stats,
    updateFilters,
    selectCampaign,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    duplicateCampaign,
    archiveCampaign,
    bulkOperations,
  } = useCampaigns();

  // États locaux pour l'interface
  const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [rightPaneOpen, setRightPaneOpen] = useState(false);

  // Gestion de la sélection
  const handleCampaignSelect = useCallback(
    (campaignId: string) => {
      const campaign = campaigns.find((c) => c.id === campaignId);
      if (campaign) {
        selectCampaign(campaign);
        setRightPaneOpen(true);
      }
    },
    [campaigns, selectCampaign]
  );

  const handleMultiSelect = useCallback((campaignIds: string[]) => {
    setSelectedCampaigns(campaignIds);
  }, []);

  // Gestion des actions de campagne
  const handleCampaignAction = useCallback(
    async (action: string, campaign: Campaign) => {
      try {
        switch (action) {
          case 'duplicate':
            await duplicateCampaign(campaign.id);
            break;
          case 'archive':
            await archiveCampaign(campaign.id);
            break;
          case 'delete':
            await deleteCampaign(campaign.id);
            break;
          case 'edit':
            selectCampaign(campaign);
            setRightPaneOpen(true);
            break;
          default:
            console.log(`Action ${action} non implémentée`);
        }
      } catch (error) {
        console.error(`Erreur lors de l'action ${action}:`, error);
      }
    },
    [duplicateCampaign, archiveCampaign, deleteCampaign, selectCampaign]
  );

  // Gestion des actions bulk
  const handleBulkAction = useCallback(
    async (action: string) => {
      if (selectedCampaigns.length === 0) return;

      try {
        switch (action) {
          case 'pause':
            await bulkOperations.pause(selectedCampaigns);
            break;
          case 'resume':
            await bulkOperations.resume(selectedCampaigns);
            break;
          case 'archive':
            await bulkOperations.archive(selectedCampaigns);
            break;
          case 'delete':
            await bulkOperations.delete(selectedCampaigns);
            break;
          default:
            console.log(`Action bulk ${action} non implémentée`);
        }
        setSelectedCampaigns([]);
      } catch (error) {
        console.error(`Erreur lors de l'action bulk ${action}:`, error);
      }
    },
    [selectedCampaigns, bulkOperations]
  );

  // Gestion de la création
  const handleCreateCampaign = useCallback(() => {
    // Créer une nouvelle campagne vierge
    const newCampaign: Partial<Campaign> = {
      name: 'Nouvelle campagne',
      status: 'draft',
      type: 'promotion',
      channel: 'facebook',
      objective: 'traffic',
    };

    // Ouvrir l'éditeur
    selectCampaign(newCampaign as Campaign);
    setRightPaneOpen(true);
  }, [selectCampaign]);

  return (
    <CampaignsLayout>
      {/* Cartes de statistiques */}
      <CampaignsStatsCards stats={stats} loading={loading} className="mb-6" />

      {/* Toolbar principale */}
      <CampaignsToolbar
        selectedCount={selectedCampaigns.length}
        totalCount={filteredCampaigns.length}
        viewMode={viewMode}
        showFilters={showFilters}
        onViewModeChange={setViewMode}
        onToggleFilters={() => setShowFilters(!showFilters)}
        onCreateCampaign={handleCreateCampaign}
        onBulkAction={handleBulkAction}
        filters={filters}
        onFiltersChange={updateFilters}
      />

      {/* Grille principale : Filtres + Liste + RightPane */}
      <div className="grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {/* Panneau de filtres */}
        {showFilters && (
          <div className="lg:col-span-1">
            <CampaignFilters
              filters={filters}
              onFiltersChange={updateFilters}
              campaigns={campaigns}
              className="sticky top-24"
            />
          </div>
        )}

        {/* Liste des campagnes */}
        <div
          className={`${
            showFilters && rightPaneOpen
              ? 'lg:col-span-2 xl:col-span-2'
              : showFilters
                ? 'lg:col-span-3 xl:col-span-4'
                : rightPaneOpen
                  ? 'lg:col-span-3 xl:col-span-3'
                  : 'lg:col-span-4 xl:col-span-5'
          }`}
        >
          <CampaignsList
            campaigns={filteredCampaigns}
            selectedCampaigns={selectedCampaigns}
            viewMode={viewMode}
            loading={loading}
            onCampaignSelect={handleCampaignSelect}
            onMultiSelect={handleMultiSelect}
            onCampaignAction={handleCampaignAction}
          />
        </div>

        {/* Panneau de droite (détails/édition) */}
        {rightPaneOpen && selectedCampaign && (
          <div className="lg:col-span-1 xl:col-span-2">
            <CampaignRightPane
              campaign={selectedCampaign}
              onClose={() => setRightPaneOpen(false)}
              onSave={updateCampaign}
              onDelete={() => handleCampaignAction('delete', selectedCampaign)}
              onDuplicate={() => handleCampaignAction('duplicate', selectedCampaign)}
              className="sticky top-24"
            />
          </div>
        )}
      </div>
    </CampaignsLayout>
  );
}
