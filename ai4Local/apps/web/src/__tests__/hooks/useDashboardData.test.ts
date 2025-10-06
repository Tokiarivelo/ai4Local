import { render, screen } from '@testing-library/react';
import { useDashboardData } from '../../hooks/useDashboardData';
import DashboardPage from '../../app/[locale]/dashboard/page';

jest.mock('../../hooks/useDashboardData');

describe('DashboardPage', () => {
  beforeEach(() => {
    (useDashboardData as jest.Mock).mockReturnValue({
      stats: [],
      recentCampaigns: [],
      recentActivities: [],
    });
  });

  it('renders the dashboard header', () => {
    render(<DashboardPage />);
    expect(screen.getByText('Tableau de bord')).toBeInTheDocument();
    expect(screen.getByText("Vue d'ensemble de vos campagnes et performances")).toBeInTheDocument();
  });

  it('renders the stats section', () => {
    (useDashboardData as jest.Mock).mockReturnValue({
      stats: [
        { title: 'Campagnes actives', value: '12', change: '+20%', changeType: 'increase' },
        { title: 'Clients actifs', value: '2,847', change: '+12%', changeType: 'increase' },
      ],
      recentCampaigns: [],
      recentActivities: [],
    });

    render(<DashboardPage />);
    expect(screen.getByText('Campagnes actives')).toBeInTheDocument();
    expect(screen.getByText('Clients actifs')).toBeInTheDocument();
  });

  it('renders recent campaigns', () => {
    (useDashboardData as jest.Mock).mockReturnValue({
      stats: [],
      recentCampaigns: [
        { name: 'Promo Black Friday', status: 'active', audience: 1250, openRate: 28.4, clickRate: 4.2, sentAt: '2024-11-15' },
      ],
      recentActivities: [],
    });

    render(<DashboardPage />);
    expect(screen.getByText('Promo Black Friday')).toBeInTheDocument();
  });

  it('renders recent activities', () => {
    (useDashboardData as jest.Mock).mockReturnValue({
      stats: [],
      recentCampaigns: [],
      recentActivities: [
        { action: 'Campagne créée', details: 'Promo Black Friday', time: 'Il y a 2 heures' },
      ],
    });

    render(<DashboardPage />);
    expect(screen.getByText('Campagne créée')).toBeInTheDocument();
  });
});