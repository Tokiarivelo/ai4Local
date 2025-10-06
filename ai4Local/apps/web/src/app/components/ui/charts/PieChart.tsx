import React from 'react';
import { Pie } from 'react-chartjs-2';

interface PieChartProps {
  data: {
    labels: string[];
    values: number[];
  };
  title?: string;
}

const PieChart: React.FC<PieChartProps> = ({ data, title }) => {
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        data: data.values,
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
        ],
        hoverBackgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
        ],
      },
    ],
  };

  return (
    <div className="flex flex-col items-center">
      {title && <h2 className="text-lg font-semibold mb-4">{title}</h2>}
      <Pie data={chartData} />
    </div>
  );
};

export default PieChart;