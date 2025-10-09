/**
 * Exemple d'utilisation du module Campaigns
 * Guide pour les développeurs
 */

import React from 'react';
import {
  CampaignsPage,
  useCampaigns,
  mockCampaigns,
  type Campaign,
} from '@/app/modules/campaigns/welcome';

// EXEMPLE 1: Utilisation basique de la page complète
export function BasicCampaignsExample() {
  return (
    <div>
      <h2>Exemple 1: Page complète des campagnes</h2>
      <CampaignsPage />
    </div>
  );
}

// EXEMPLE 2: Utilisation du hook useCampaigns
export function CampaignsHookExample() {
  const {
    campaigns,
    filteredCampaigns,
    loading,
    stats,
    filters,
    updateFilters,
    createCampaign,
    updateCampaign,
    deleteCampaign,
  } = useCampaigns();

  const handleCreateCampaign = async () => {
    try {
      const newCampaign = await createCampaign({
        name: 'Ma nouvelle campagne',
        description: 'Description de test',
        channel: 'email',
        type: 'promotion',
        objective: 'conversions',
      });
      console.log('Campagne créée:', newCampaign);
    } catch (error) {
      console.error('Erreur création:', error);
    }
  };

  const handleFilterByStatus = (status: Campaign['status']) => {
    updateFilters({ status: [status] });
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="space-y-4">
      <h2>Exemple 2: Utilisation du hook useCampaigns</h2>

      {/* Statistiques */}
      <div className="grid grid-cols-4 gap-4">
        <div className="p-4 border rounded">
          <h3>Total</h3>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="p-4 border rounded">
          <h3>Actives</h3>
          <p className="text-2xl font-bold">{stats.active}</p>
        </div>
        <div className="p-4 border rounded">
          <h3>Impressions</h3>
          <p className="text-2xl font-bold">{stats.totalImpressions.toLocaleString()}</p>
        </div>
        <div className="p-4 border rounded">
          <h3>CTR Moyen</h3>
          <p className="text-2xl font-bold">{stats.averageCTR}%</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex space-x-2">
        <button onClick={handleCreateCampaign} className="px-4 py-2 bg-blue-500 text-white rounded">
          Créer une campagne
        </button>
        <button
          onClick={() => handleFilterByStatus('active')}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Filtrer actives
        </button>
        <button
          onClick={() => updateFilters({ status: [] })}
          className="px-4 py-2 bg-gray-500 text-white rounded"
        >
          Réinitialiser filtres
        </button>
      </div>

      {/* Liste des campagnes */}
      <div>
        <h3>Campagnes filtrées ({filteredCampaigns.length})</h3>
        <div className="space-y-2">
          {filteredCampaigns.map((campaign) => (
            <div key={campaign.id} className="p-4 border rounded">
              <h4 className="font-bold">{campaign.name}</h4>
              <p className="text-sm text-gray-600">{campaign.description}</p>
              <div className="flex space-x-4 mt-2 text-sm">
                <span>Status: {campaign.status}</span>
                <span>Canal: {campaign.channel}</span>
                <span>Propriétaire: {campaign.owner}</span>
              </div>
              <div className="flex space-x-4 mt-2 text-sm">
                <span>Impressions: {campaign.metrics.impressions.toLocaleString()}</span>
                <span>Clics: {campaign.metrics.clicks.toLocaleString()}</span>
                <span>CTR: {campaign.metrics.ctr}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// EXEMPLE 3: Utilisation des données mock
export function MockDataExample() {
  return (
    <div className="space-y-4">
      <h2>Exemple 3: Données mock pour développement</h2>
      <p>Nombre de campagnes mock disponibles: {mockCampaigns.length}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockCampaigns.slice(0, 6).map((campaign) => (
          <div key={campaign.id} className="p-4 border rounded-lg">
            <h3 className="font-semibold">{campaign.name}</h3>
            <p className="text-sm text-gray-600 mt-1">{campaign.description}</p>

            <div className="mt-3 space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Canal:</span>
                <span className="font-medium">{campaign.channel}</span>
              </div>
              <div className="flex justify-between">
                <span>Statut:</span>
                <span
                  className={`font-medium ${
                    campaign.status === 'active'
                      ? 'text-green-600'
                      : campaign.status === 'paused'
                        ? 'text-yellow-600'
                        : campaign.status === 'completed'
                          ? 'text-blue-600'
                          : 'text-gray-600'
                  }`}
                >
                  {campaign.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Impressions:</span>
                <span className="font-medium">{campaign.metrics.impressions.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>CTR:</span>
                <span className="font-medium">{campaign.metrics.ctr}%</span>
              </div>
            </div>

            {campaign.tags.length > 0 && (
              <div className="mt-3">
                <div className="flex flex-wrap gap-1">
                  {campaign.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      {tag}
                    </span>
                  ))}
                  {campaign.tags.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      +{campaign.tags.length - 3}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// EXEMPLE 4: Création personnalisée de campagne
export function CustomCampaignCreationExample() {
  const { createCampaign } = useCampaigns();
  const [isCreating, setIsCreating] = React.useState(false);

  const createCustomCampaign = async () => {
    setIsCreating(true);
    try {
      const campaignData: Partial<Campaign> = {
        name: 'Campagne personnalisée',
        description: 'Exemple de création avec données personnalisées',
        channel: 'whatsapp',
        type: 'lead_generation',
        objective: 'leads',
        tags: ['exemple', 'personnalise', 'whatsapp'],
        budget: {
          total: 2000,
          daily: 100,
          spent: 0,
          currency: 'EUR',
          bidStrategy: 'target_cost',
        },
        schedule: {
          startAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Demain
          endAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // Dans 30 jours
          timezone: 'Europe/Paris',
        },
      };

      const newCampaign = await createCampaign(campaignData);
      console.log('Campagne personnalisée créée:', newCampaign);
      alert(`Campagne "${newCampaign.name}" créée avec succès !`);
    } catch (error) {
      console.error('Erreur création campagne:', error);
      alert('Erreur lors de la création de la campagne');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2>Exemple 4: Création personnalisée de campagne</h2>
      <p className="text-gray-600">
        Cet exemple montre comment créer une campagne avec des paramètres personnalisés.
      </p>

      <button
        onClick={createCustomCampaign}
        disabled={isCreating}
        className={`px-6 py-3 rounded-lg font-medium ${
          isCreating
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-blue-500 text-white hover:bg-blue-600'
        }`}
      >
        {isCreating ? 'Création en cours...' : 'Créer une campagne WhatsApp'}
      </button>

      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium mb-2">Paramètres de la campagne:</h3>
        <ul className="space-y-1 text-sm">
          <li>• Canal: WhatsApp</li>
          <li>• Type: Génération de leads</li>
          <li>• Budget: 2000€ (100€/jour)</li>
          <li>• Durée: 30 jours</li>
          <li>• Tags: exemple, personnalise, whatsapp</li>
        </ul>
      </div>
    </div>
  );
}

// EXEMPLE 5: Filtrage avancé
export function AdvancedFilteringExample() {
  const { filteredCampaigns, updateFilters, filters } = useCampaigns();

  const filterExamples = [
    {
      name: 'Campagnes actives Facebook',
      filter: {
        status: ['active' as Campaign['status']],
        channels: ['facebook' as Campaign['channel']],
      },
    },
    {
      name: 'Campagnes email avec bon CTR',
      filter: {
        channels: ['email' as Campaign['channel']],
        sortBy: 'ctr',
        sortOrder: 'desc' as const,
      },
    },
    {
      name: 'Campagnes par Marie Dupont',
      filter: { owners: ['Marie Dupont'] },
    },
    {
      name: 'Campagnes avec tag "promotion"',
      filter: { tags: ['promotion'] },
    },
    {
      name: 'Budget > 3000€',
      filter: { budgetRange: { min: 3000 } },
    },
  ];

  return (
    <div className="space-y-4">
      <h2>Exemple 5: Filtrage avancé</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filterExamples.map((example, index) => (
          <button
            key={index}
            onClick={() => updateFilters(example.filter)}
            className="p-4 border rounded-lg text-left hover:bg-gray-50"
          >
            <h3 className="font-medium">{example.name}</h3>
            <p className="text-sm text-gray-600 mt-1">Cliquez pour appliquer ce filtre</p>
          </button>
        ))}
      </div>

      <div className="flex space-x-2">
        <button
          onClick={() =>
            updateFilters({
              status: [],
              channels: [],
              types: [],
              objectives: [],
              owners: [],
              tags: [],
              dateRange: {},
              budgetRange: {},
            })
          }
          className="px-4 py-2 bg-gray-500 text-white rounded"
        >
          Réinitialiser tous les filtres
        </button>
      </div>

      <div className="mt-4">
        <h3 className="font-medium">Résultats filtrés:</h3>
        <p className="text-sm text-gray-600">{filteredCampaigns.length} campagne(s) trouvée(s)</p>

        {/* Affichage des filtres actifs */}
        {(filters.status.length > 0 ||
          filters.channels.length > 0 ||
          filters.owners.length > 0) && (
          <div className="mt-2 p-3 bg-blue-50 rounded-lg">
            <h4 className="text-sm font-medium text-blue-800">Filtres actifs:</h4>
            <div className="mt-1 space-y-1 text-sm text-blue-700">
              {filters.status.length > 0 && <div>Statuts: {filters.status.join(', ')}</div>}
              {filters.channels.length > 0 && <div>Canaux: {filters.channels.join(', ')}</div>}
              {filters.owners.length > 0 && <div>Propriétaires: {filters.owners.join(', ')}</div>}
              {filters.tags.length > 0 && <div>Tags: {filters.tags.join(', ')}</div>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Export de tous les exemples
export default {
  BasicCampaignsExample,
  CampaignsHookExample,
  MockDataExample,
  CustomCampaignCreationExample,
  AdvancedFilteringExample,
};
