import React from 'react';
import { render, screen } from '@testing-library/react';
import DashboardStats from '@/app/components/dashboard/DashboardStats';

const mockStats = [
  {
    title: 'Campagnes actives',
    value: '12',
    change: '+20%',
    changeType: 'increase',
  },
  {
    title: 'Clients actifs',
    value: '2,847',
    change: '+12%',
    changeType: 'increase',
  },
  {
    title: "Taux d'ouverture",
    value: '24.5%',
    change: '-2%',
    changeType: 'decrease',
  },
  {
    title: 'Revenus générés',
    value: '€45,231',
    change: '+18%',
    changeType: 'increase',
  },
];

describe('DashboardStats', () => {
  it('renders the statistics cards correctly', () => {
    render(<DashboardStats stats={mockStats} />);

    mockStats.forEach(stat => {
      expect(screen.getByText(stat.title)).toBeInTheDocument();
      expect(screen.getByText(stat.value)).toBeInTheDocument();
      expect(screen.getByText(stat.change)).toBeInTheDocument();
    });
  });

  it('displays the correct change indicators', () => {
    render(<DashboardStats stats={mockStats} />);

    mockStats.forEach(stat => {
      const changeElement = screen.getByText(stat.change);
      if (stat.changeType === 'increase') {
        expect(changeElement).toHaveClass('text-green-600');
      } else {
        expect(changeElement).toHaveClass('text-red-600');
      }
    });
  });
});