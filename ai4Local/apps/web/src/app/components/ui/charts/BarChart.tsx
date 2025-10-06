import React from 'react';
import { Bar } from 'react-chartjs-2';

interface BarChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string[];
    }[];
  };
  options?: {
    responsive?: boolean;
    maintainAspectRatio?: boolean;
  };
}

/**
 * BarChart component renders a bar chart using Chart.js.
 * 
 * @param {BarChartProps} props - The props for the BarChart component.
 * @returns {JSX.Element} The rendered BarChart component.
 */
const BarChart: React.FC<BarChartProps> = ({ data, options }) => {
  return (
    <div className="w-full h-full">
      <Bar data={data} options={{ responsive: true, maintainAspectRatio: false, ...options }} />
    </div>
  );
};

export default BarChart;