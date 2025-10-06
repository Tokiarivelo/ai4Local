import React from 'react';
import { ActionButton } from '@/components/common/ActionButton';

const actions = [
  {
    label: 'Nouvelle campagne',
    icon: '📧', // Placeholder for an icon
    onClick: () => console.log('Créer une nouvelle campagne'),
  },
  {
    label: 'Créer un segment',
    icon: '👥', // Placeholder for an icon
    onClick: () => console.log('Créer un nouveau segment'),
  },
  {
    label: 'Importer contacts',
    icon: '📥', // Placeholder for an icon
    onClick: () => console.log('Importer des contacts'),
  },
  {
    label: 'Voir analytics',
    icon: '📊', // Placeholder for an icon
    onClick: () => console.log('Voir les analytics'),
  },
];

export const DashboardQuickActions: React.FC = () => {
  return (
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
      {actions.map((action, index) => (
        <ActionButton key={index} onClick={action.onClick}>
          <span className='mr-2'>{action.icon}</span>
          {action.label}
        </ActionButton>
      ))}
    </div>
  );
};