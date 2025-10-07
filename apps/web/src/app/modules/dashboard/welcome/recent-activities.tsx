'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/modules/ui/card';

export interface Activity {
  id?: string;
  action: string;
  details: string;
  time: string;
  type: 'campaign' | 'segment' | 'import' | 'report';
}

const defaultActivities: Activity[] = [
  {
    action: 'Campagne créée',
    details: 'Promo Black Friday',
    time: 'Il y a 2 heures',
    type: 'campaign',
  },
  {
    action: 'Nouveau segment',
    details: 'Clients VIP Q4',
    time: 'Il y a 4 heures',
    type: 'segment',
  },
  {
    action: 'Import contacts',
    details: '245 nouveaux contacts',
    time: 'Il y a 1 jour',
    type: 'import',
  },
  {
    action: 'Rapport généré',
    details: 'Analytics Octobre',
    time: 'Il y a 2 jours',
    type: 'report',
  },
];

interface RecentActivitiesProps {
  activities?: Activity[];
}

export const RecentActivities: React.FC<RecentActivitiesProps> = ({
  activities = defaultActivities,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Activité récente</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {activities.map((activity, index) => (
            <div key={activity.id || index} className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0" />
              <div className="space-y-1 min-w-0 flex-1">
                <p className="text-sm font-medium leading-none">{activity.action}</p>
                <p className="text-xs text-muted-foreground">{activity.details}</p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
