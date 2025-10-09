/**
 * Tests pour CampaignRow - Exemple de pattern de test
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { mockCampaigns } from '../mocks/campaigns.mock';
import { Campaign } from '../types';

// Mock du composant CampaignRow (serait un composant séparé dans une version complète)
interface CampaignRowProps {
  campaign: Campaign;
  isSelected: boolean;
  onSelect: () => void;
  onToggleSelect: () => void;
  onAction: (action: string) => void;
}

function CampaignRow({
  campaign,
  isSelected,
  onSelect,
  onToggleSelect,
  onAction,
}: CampaignRowProps) {
  return (
    <div
      data-testid="campaign-row"
      className={`campaign-row ${isSelected ? 'selected' : ''}`}
      onClick={onSelect}
    >
      <input
        type="checkbox"
        checked={isSelected}
        onChange={onToggleSelect}
        data-testid="campaign-checkbox"
      />
      <h3 data-testid="campaign-name">{campaign.name}</h3>
      <span data-testid="campaign-status">{campaign.status}</span>
      <span data-testid="campaign-channel">{campaign.channel}</span>
      <span data-testid="campaign-owner">{campaign.owner}</span>

      {/* Actions */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onAction('edit');
        }}
        data-testid="edit-button"
      >
        Modifier
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onAction('duplicate');
        }}
        data-testid="duplicate-button"
      >
        Dupliquer
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onAction('delete');
        }}
        data-testid="delete-button"
      >
        Supprimer
      </button>

      {/* Métriques */}
      <span data-testid="impressions">{campaign.metrics.impressions.toLocaleString()}</span>
      <span data-testid="clicks">{campaign.metrics.clicks.toLocaleString()}</span>
      <span data-testid="ctr">{campaign.metrics.ctr}%</span>
      <span data-testid="conversions">{campaign.metrics.conversions}</span>
    </div>
  );
}

describe('CampaignRow', () => {
  const mockCampaign = mockCampaigns[0]; // Campagne AI4Local Pro
  const mockOnSelect = jest.fn();
  const mockOnToggleSelect = jest.fn();
  const mockOnAction = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render campaign information correctly', () => {
    render(
      <CampaignRow
        campaign={mockCampaign}
        isSelected={false}
        onSelect={mockOnSelect}
        onToggleSelect={mockOnToggleSelect}
        onAction={mockOnAction}
      />
    );

    // Vérifications de base
    expect(screen.getByTestId('campaign-name')).toHaveTextContent(mockCampaign.name);
    expect(screen.getByTestId('campaign-status')).toHaveTextContent(mockCampaign.status);
    expect(screen.getByTestId('campaign-channel')).toHaveTextContent(mockCampaign.channel);
    expect(screen.getByTestId('campaign-owner')).toHaveTextContent(mockCampaign.owner);
  });

  it('should display metrics correctly', () => {
    render(
      <CampaignRow
        campaign={mockCampaign}
        isSelected={false}
        onSelect={mockOnSelect}
        onToggleSelect={mockOnToggleSelect}
        onAction={mockOnAction}
      />
    );

    // Vérification des métriques
    expect(screen.getByTestId('impressions')).toHaveTextContent('45 000'); // Format français
    expect(screen.getByTestId('clicks')).toHaveTextContent('1 440');
    expect(screen.getByTestId('ctr')).toHaveTextContent('3.2%');
    expect(screen.getByTestId('conversions')).toHaveTextContent('59');
  });

  it('should handle selection correctly', () => {
    render(
      <CampaignRow
        campaign={mockCampaign}
        isSelected={false}
        onSelect={mockOnSelect}
        onToggleSelect={mockOnToggleSelect}
        onAction={mockOnAction}
      />
    );

    // Test de sélection via clic
    fireEvent.click(screen.getByTestId('campaign-row'));
    expect(mockOnSelect).toHaveBeenCalledTimes(1);

    // Test de toggle via checkbox
    fireEvent.change(screen.getByTestId('campaign-checkbox'));
    expect(mockOnToggleSelect).toHaveBeenCalledTimes(1);
  });

  it('should reflect selection state', () => {
    const { rerender } = render(
      <CampaignRow
        campaign={mockCampaign}
        isSelected={false}
        onSelect={mockOnSelect}
        onToggleSelect={mockOnToggleSelect}
        onAction={mockOnAction}
      />
    );

    // Vérification état non sélectionné
    expect(screen.getByTestId('campaign-row')).not.toHaveClass('selected');
    expect(screen.getByTestId('campaign-checkbox')).not.toBeChecked();

    // Re-render avec sélection
    rerender(
      <CampaignRow
        campaign={mockCampaign}
        isSelected={true}
        onSelect={mockOnSelect}
        onToggleSelect={mockOnToggleSelect}
        onAction={mockOnAction}
      />
    );

    // Vérification état sélectionné
    expect(screen.getByTestId('campaign-row')).toHaveClass('selected');
    expect(screen.getByTestId('campaign-checkbox')).toBeChecked();
  });

  it('should handle action buttons correctly', () => {
    render(
      <CampaignRow
        campaign={mockCampaign}
        isSelected={false}
        onSelect={mockOnSelect}
        onToggleSelect={mockOnToggleSelect}
        onAction={mockOnAction}
      />
    );

    // Test bouton modifier
    fireEvent.click(screen.getByTestId('edit-button'));
    expect(mockOnAction).toHaveBeenCalledWith('edit');
    expect(mockOnSelect).not.toHaveBeenCalled(); // Ne doit pas déclencher la sélection

    // Test bouton dupliquer
    fireEvent.click(screen.getByTestId('duplicate-button'));
    expect(mockOnAction).toHaveBeenCalledWith('duplicate');

    // Test bouton supprimer
    fireEvent.click(screen.getByTestId('delete-button'));
    expect(mockOnAction).toHaveBeenCalledWith('delete');

    expect(mockOnAction).toHaveBeenCalledTimes(3);
  });

  it('should prevent event propagation on action buttons', () => {
    render(
      <CampaignRow
        campaign={mockCampaign}
        isSelected={false}
        onSelect={mockOnSelect}
        onToggleSelect={mockOnToggleSelect}
        onAction={mockOnAction}
      />
    );

    // Clic sur un bouton d'action ne doit pas déclencher la sélection
    fireEvent.click(screen.getByTestId('edit-button'));

    expect(mockOnAction).toHaveBeenCalledWith('edit');
    expect(mockOnSelect).not.toHaveBeenCalled();
  });

  it('should handle different campaign statuses', () => {
    const completedCampaign = { ...mockCampaign, status: 'completed' as const };

    render(
      <CampaignRow
        campaign={completedCampaign}
        isSelected={false}
        onSelect={mockOnSelect}
        onToggleSelect={mockOnToggleSelect}
        onAction={mockOnAction}
      />
    );

    expect(screen.getByTestId('campaign-status')).toHaveTextContent('completed');
  });

  it('should handle campaigns with zero metrics', () => {
    const newCampaign: Campaign = {
      ...mockCampaign,
      metrics: {
        impressions: 0,
        reach: 0,
        clicks: 0,
        ctr: 0,
        conversions: 0,
        conversionRate: 0,
        costPerClick: 0,
        costPerConversion: 0,
        returnOnAdSpend: 0,
        frequency: 0,
      },
    };

    render(
      <CampaignRow
        campaign={newCampaign}
        isSelected={false}
        onSelect={mockOnSelect}
        onToggleSelect={mockOnToggleSelect}
        onAction={mockOnAction}
      />
    );

    expect(screen.getByTestId('impressions')).toHaveTextContent('0');
    expect(screen.getByTestId('clicks')).toHaveTextContent('0');
    expect(screen.getByTestId('ctr')).toHaveTextContent('0%');
    expect(screen.getByTestId('conversions')).toHaveTextContent('0');
  });

  it('should be accessible', () => {
    render(
      <CampaignRow
        campaign={mockCampaign}
        isSelected={false}
        onSelect={mockOnSelect}
        onToggleSelect={mockOnToggleSelect}
        onAction={mockOnAction}
      />
    );

    // Vérification de l'accessibilité
    const checkbox = screen.getByTestId('campaign-checkbox');
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).toHaveAttribute('type', 'checkbox');

    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(3); // edit, duplicate, delete

    buttons.forEach((button) => {
      expect(button).toBeInTheDocument();
    });
  });
});

// Test d'intégration avec plusieurs campagnes
describe('CampaignRow Integration', () => {
  it('should handle multiple campaigns with different properties', () => {
    const campaigns = mockCampaigns.slice(0, 3);
    const mockHandlers = {
      onSelect: jest.fn(),
      onToggleSelect: jest.fn(),
      onAction: jest.fn(),
    };

    const { container } = render(
      <div>
        {campaigns.map((campaign) => (
          <CampaignRow key={campaign.id} campaign={campaign} isSelected={false} {...mockHandlers} />
        ))}
      </div>
    );

    // Vérification du rendu de plusieurs campagnes
    const campaignRows = container.querySelectorAll('[data-testid="campaign-row"]');
    expect(campaignRows).toHaveLength(3);

    // Vérification des noms uniques
    campaigns.forEach((campaign, index) => {
      const row = campaignRows[index];
      const nameElement = row.querySelector('[data-testid="campaign-name"]');
      expect(nameElement).toHaveTextContent(campaign.name);
    });
  });
});

// Tests de performance
describe('CampaignRow Performance', () => {
  it('should render quickly with large metric numbers', () => {
    const campaignWithLargeMetrics: Campaign = {
      ...mockCampaigns[0],
      metrics: {
        impressions: 1500000,
        reach: 1200000,
        clicks: 45000,
        ctr: 3.0,
        conversions: 1350,
        conversionRate: 3.0,
        costPerClick: 0.75,
        costPerConversion: 25.0,
        returnOnAdSpend: 4.2,
        frequency: 1.25,
      },
    };

    const startTime = performance.now();

    render(
      <CampaignRow
        campaign={campaignWithLargeMetrics}
        isSelected={false}
        onSelect={jest.fn()}
        onToggleSelect={jest.fn()}
        onAction={jest.fn()}
      />
    );

    const endTime = performance.now();

    // Le rendu doit être rapide (moins de 10ms)
    expect(endTime - startTime).toBeLessThan(10);

    // Vérification du formatage des gros nombres
    expect(screen.getByTestId('impressions')).toHaveTextContent('1 500 000');
    expect(screen.getByTestId('clicks')).toHaveTextContent('45 000');
  });
});
