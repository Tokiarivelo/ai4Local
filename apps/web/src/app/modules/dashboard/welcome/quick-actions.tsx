'use client';

import React from 'react';
import { Mail, Users, Target, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/modules/ui/card';
import { QuickActionButton } from '@/app/modules/ui/quick-action-button';

interface QuickAction {
  icon: typeof Mail;
  label: string;
  variant?: 'default' | 'outline';
  onClick?: () => void;
}

const defaultActions: QuickAction[] = [
  {
    icon: Mail,
    label: 'Nouvelle campagne',
    variant: 'default',
  },
  {
    icon: Users,
    label: 'Créer un segment',
    variant: 'outline',
  },
  {
    icon: Target,
    label: 'Importer contacts',
    variant: 'outline',
  },
  {
    icon: Activity,
    label: 'Voir analytics',
    variant: 'outline',
  },
];

interface QuickActionsProps {
  actions?: QuickAction[];
}

export const QuickActions: React.FC<QuickActionsProps> = ({ actions = defaultActions }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Actions rapides</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {actions.map((action, index) => (
            <QuickActionButton
              key={index}
              icon={action.icon}
              label={action.label}
              variant={action.variant}
              onClick={action.onClick}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
