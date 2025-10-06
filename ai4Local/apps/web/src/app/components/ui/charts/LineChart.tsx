import React from 'react';
import { Line } from 'react-chartjs-2';

interface LineChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
      fill?: boolean;
    }[];
  };
  options?: {
    responsive?: boolean;
    maintainAspectRatio?: boolean;
    scales?: {
      x: {
        beginAtZero: boolean;
      };
      y: {
        beginAtZero: boolean;
      };
    };
  };
}

/**
 * LineChart component renders a line chart using Chart.js.
 * 
 * @param {LineChartProps} props - The props for the LineChart component.
 * @returns {JSX.Element} The rendered line chart.
 */
const LineChart: React.FC<LineChartProps> = ({ data, options }) => {
  return <Line data={data} options={options} />;
};

export default LineChart;