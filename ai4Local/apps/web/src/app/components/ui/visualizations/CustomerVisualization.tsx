import React from 'react';
import { BarChart } from '../charts/BarChart';
import { LineChart } from '../charts/LineChart';
import { PieChart } from '../charts/PieChart';
import { useCustomers } from '../../../hooks/useCustomers';
import { CustomerData } from '../../../lib/types/customer';

interface CustomerVisualizationProps {
  data: CustomerData[];
}

const CustomerVisualization: React.FC<CustomerVisualizationProps> = ({ data }) => {
  const { totalCustomers, activeCustomers, inactiveCustomers } = useCustomers(data);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Visualisation des Clients</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="col-span-1">
          <h3 className="text-lg font-semibold">Total des Clients</h3>
          <PieChart data={[{ name: 'Actifs', value: activeCustomers }, { name: 'Inactifs', value: inactiveCustomers }]} />
        </div>
        <div className="col-span-1">
          <h3 className="text-lg font-semibold">Tendances des Clients</h3>
          <LineChart data={data.map(customer => ({ date: customer.createdAt, value: customer.value }))} />
        </div>
        <div className="col-span-1">
          <h3 className="text-lg font-semibold">Statistiques des Clients</h3>
          <BarChart data={data.map(customer => ({ name: customer.name, value: customer.value }))} />
        </div>
      </div>
    </div>
  );
};

export default CustomerVisualization;