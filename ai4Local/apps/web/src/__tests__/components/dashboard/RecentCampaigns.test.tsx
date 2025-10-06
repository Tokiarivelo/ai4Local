import React from 'react';
import { render, screen } from '@testing-library/react';
import RecentCampaigns from '@/components/dashboard/RecentCampaigns';

const mockCampaigns = [
  {
    name: 'Promo Black Friday',
    status: 'active',
    audience: 1250,
    openRate: 28.4,
    clickRate: 4.2,
    sentAt: '2024-11-15',
  },
  {
    name: 'Newsletter Hebdo #47',
    status: 'completed',
    audience: 2847,
    openRate: 22.1,
    clickRate: 3.8,
    sentAt: '2024-11-12',
  },
];

describe('RecentCampaigns', () => {
  it('renders the component with campaign data', () => {
    render(<RecentCampaigns campaigns={mockCampaigns} />);

    expect(screen.getByText('Campagnes récentes')).toBeInTheDocument();
    expect(screen.getByText('Promo Black Friday')).toBeInTheDocument();
    expect(screen.getByText('active')).toBeInTheDocument();
    expect(screen.getByText('1250 destinataires')).toBeInTheDocument();
    expect(screen.getByText('28.4% ouvert')).toBeInTheDocument();
  });

  it('displays "Non envoyée" for campaigns that have not been sent', () => {
    render(<RecentCampaigns campaigns={[{ ...mockCampaigns[0], sentAt: null }]} />);

    expect(screen.getByText('Non envoyée')).toBeInTheDocument();
  });

  it('renders the correct number of campaigns', () => {
    render(<RecentCampaigns campaigns={mockCampaigns} />);
    
    const campaignItems = screen.getAllByText(/destinataires/i);
    expect(campaignItems.length).toBe(mockCampaigns.length);
  });
});