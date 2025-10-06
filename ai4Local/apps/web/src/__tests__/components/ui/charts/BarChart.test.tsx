import React from 'react';
import { render, screen } from '@testing-library/react';
import BarChart from '@/components/ui/charts/BarChart';

describe('BarChart', () => {
  const mockData = [
    { label: 'January', value: 30 },
    { label: 'February', value: 20 },
    { label: 'March', value: 50 },
  ];

  it('renders the bar chart with correct data', () => {
    render(<BarChart data={mockData} />);
    
    // Check if the chart is rendered
    const chartElement = screen.getByTestId('bar-chart');
    expect(chartElement).toBeInTheDocument();

    // Check if the bars are rendered with correct values
    mockData.forEach((dataPoint) => {
      expect(screen.getByText(dataPoint.label)).toBeInTheDocument();
      expect(screen.getByText(dataPoint.value.toString())).toBeInTheDocument();
    });
  });

  it('displays a message when no data is provided', () => {
    render(<BarChart data={[]} />);
    
    const messageElement = screen.getByText('Aucune donnée disponible');
    expect(messageElement).toBeInTheDocument();
  });
});