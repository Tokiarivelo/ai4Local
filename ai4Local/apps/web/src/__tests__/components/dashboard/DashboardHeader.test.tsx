import React from 'react';
import { render, screen } from '@testing-library/react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';

describe('DashboardHeader', () => {
  it('renders the dashboard title and description', () => {
    render(<DashboardHeader />);

    const titleElement = screen.getByText(/tableau de bord/i);
    const descriptionElement = screen.getByText(/vue d'ensemble de vos campagnes et performances/i);

    expect(titleElement).toBeInTheDocument();
    expect(descriptionElement).toBeInTheDocument();
  });
});