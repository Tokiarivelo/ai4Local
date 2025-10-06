import React from 'react';

type StatusBadgeProps = {
  status: 'active' | 'completed' | 'draft' | 'scheduled';
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const variants = {
    active: 'bg-green-100 text-green-800 border-green-200',
    completed: 'bg-blue-100 text-blue-800 border-blue-200',
    draft: 'bg-gray-100 text-gray-800 border-gray-200',
    scheduled: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  };

  const labels = {
    active: 'Active',
    completed: 'Terminée',
    draft: 'Brouillon',
    scheduled: 'Planifiée',
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-1 text-xs font-medium border rounded ${variants[status]}`}
    >
      {labels[status]}
    </span>
  );
};

export default StatusBadge;