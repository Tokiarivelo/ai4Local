/**
 * AbTestRow Component Tests
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AbTestRow } from '../components/AbTestRow';
import type { AbTest } from '../types';

const mockTest: AbTest = {
  id: 'test-1',
  name: 'Test Email Subject',
  campaignId: 'campaign-1',
  campaignName: 'Black Friday 2024',
  channel: 'email',
  status: 'running',
  variants: [
    {
      id: 'variant-1',
      name: 'Control',
      trafficPercentage: 50,
      creative: { type: 'text', content: 'Test' },
      headline: 'Test Headline',
      cta: 'Click Me',
    },
    {
      id: 'variant-2',
      name: 'Variant A',
      trafficPercentage: 50,
      creative: { type: 'text', content: 'Test' },
      headline: 'Test Headline 2',
      cta: 'Click Here',
    },
  ],
  targetMetric: 'ctr',
  createdBy: 'user-1',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  metrics: [
    {
      variantId: 'variant-1',
      impressions: 10000,
      clicks: 250,
      conversions: 25,
      ctr: 2.5,
      conversionRate: 10,
      cpa: 15,
      ltv: 180,
    },
    {
      variantId: 'variant-2',
      impressions: 10000,
      clicks: 300,
      conversions: 35,
      ctr: 3.0,
      conversionRate: 11.67,
      cpa: 14,
      ltv: 200,
    },
  ],
};

describe('AbTestRow', () => {
  const mockHandlers = {
    onSelect: vi.fn(),
    onEdit: vi.fn(),
    onStart: vi.fn(),
    onPause: vi.fn(),
    onStop: vi.fn(),
    onArchive: vi.fn(),
    onViewResults: vi.fn(),
  };

  it('renders test name and status', () => {
    render(<AbTestRow test={mockTest} selected={false} {...mockHandlers} />);

    expect(screen.getByText('Test Email Subject')).toBeInTheDocument();
    expect(screen.getByText('En cours')).toBeInTheDocument();
  });

  it('displays campaign and channel info', () => {
    render(<AbTestRow test={mockTest} selected={false} {...mockHandlers} />);

    expect(screen.getByText(/Black Friday 2024/)).toBeInTheDocument();
    expect(screen.getByText('email')).toBeInTheDocument();
  });

  it('shows metrics when available', () => {
    render(<AbTestRow test={mockTest} selected={false} {...mockHandlers} />);

    expect(screen.getByText('3.00%')).toBeInTheDocument(); // Best CTR
    expect(screen.getByText('20,000')).toBeInTheDocument(); // Total impressions
  });

  it('calls onSelect when checkbox is clicked', () => {
    render(<AbTestRow test={mockTest} selected={false} {...mockHandlers} />);

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(mockHandlers.onSelect).toHaveBeenCalledWith('test-1');
  });

  it('shows pause button for running tests', () => {
    render(<AbTestRow test={mockTest} selected={false} {...mockHandlers} />);

    const pauseButton = screen.getByTitle('Mettre en pause');
    expect(pauseButton).toBeInTheDocument();
  });

  it('shows start button for draft tests', () => {
    const draftTest = { ...mockTest, status: 'draft' as const };
    render(<AbTestRow test={draftTest} selected={false} {...mockHandlers} />);

    const startButton = screen.getByTitle('Démarrer le test');
    expect(startButton).toBeInTheDocument();
  });

  it('shows view results button for completed tests', () => {
    const completedTest = { ...mockTest, status: 'completed' as const };
    render(<AbTestRow test={completedTest} selected={false} {...mockHandlers} />);

    expect(screen.getByText('Voir résultats')).toBeInTheDocument();
  });

  it('displays winner badge when winner is declared', () => {
    const testWithWinner = { ...mockTest, winner: 'variant-2' };
    render(<AbTestRow test={testWithWinner} selected={false} {...mockHandlers} />);

    expect(screen.getByText(/Gagnant déclaré/)).toBeInTheDocument();
  });
});
