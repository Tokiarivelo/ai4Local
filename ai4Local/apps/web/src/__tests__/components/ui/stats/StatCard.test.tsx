import React from 'react';
import { render, screen } from '@testing-library/react';
import StatCard from '@/components/ui/stats/StatCard';

describe('StatCard', () => {
  const mockProps = {
    title: 'Campagnes actives',
    value: '12',
    change: '+20%',
    changeType: 'increase',
    description: 'vs mois dernier',
  };

  it('renders the StatCard with correct values', () => {
    render(<StatCard {...mockProps} />);
    
    expect(screen.getByText(mockProps.title)).toBeInTheDocument();
    expect(screen.getByText(mockProps.value)).toBeInTheDocument();
    expect(screen.getByText(mockProps.change)).toBeInTheDocument();
    expect(screen.getByText(mockProps.description)).toBeInTheDocument();
  });

  it('displays the correct change indicator', () => {
    render(<StatCard {...mockProps} />);
    
    const changeIndicator = screen.getByText(mockProps.change);
    expect(changeIndicator).toHaveClass('text-green-600'); // Assuming increase is styled with green
  });

  it('renders correctly for decrease change type', () => {
    const decreaseProps = { ...mockProps, change: '-5%', changeType: 'decrease' };
    render(<StatCard {...decreaseProps} />);
    
    const changeIndicator = screen.getByText(decreaseProps.change);
    expect(changeIndicator).toHaveClass('text-red-600'); // Assuming decrease is styled with red
  });
});