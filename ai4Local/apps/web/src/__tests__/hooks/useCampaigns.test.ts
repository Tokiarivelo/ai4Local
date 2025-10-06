import { render, screen } from '@testing-library/react';
import { useCampaigns } from '../../hooks/useCampaigns';
import RecentCampaigns from '../../components/dashboard/RecentCampaigns';

jest.mock('../../hooks/useCampaigns');

describe('RecentCampaigns', () => {
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

  beforeEach(() => {
    (useCampaigns as jest.Mock).mockReturnValue({
      campaigns: mockCampaigns,
      isLoading: false,
      error: null,
    });
  });

  it('renders the component correctly', () => {
    render(<RecentCampaigns />);
    expect(screen.getByText('Campagnes récentes')).toBeInTheDocument();
  });

  it('displays the correct number of campaigns', () => {
    render(<RecentCampaigns />);
    expect(screen.getAllByText(/Promo Black Friday|Newsletter Hebdo #47/).length).toBe(2);
  });

  it('shows loading state', () => {
    (useCampaigns as jest.Mock).mockReturnValue({
      campaigns: [],
      isLoading: true,
      error: null,
    });
    render(<RecentCampaigns />);
    expect(screen.getByText('Chargement...')).toBeInTheDocument();
  });

  it('displays an error message if there is an error', () => {
    (useCampaigns as jest.Mock).mockReturnValue({
      campaigns: [],
      isLoading: false,
      error: 'Erreur de chargement',
    });
    render(<RecentCampaigns />);
    expect(screen.getByText('Erreur de chargement')).toBeInTheDocument();
  });
});