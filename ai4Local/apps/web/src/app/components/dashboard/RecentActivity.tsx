import React from 'react';
import { Badge } from '@/components/ui/badge';

interface Activity {
  action: string;
  details: string;
  time: string;
  type: string;
}

interface RecentActivityProps {
  activities: Activity[];
}

const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => {
  return (
    <div className='space-y-3'>
      {activities.map((activity, index) => (
        <div key={index} className='flex items-start space-x-3'>
          <div className='w-2 h-2 bg-primary rounded-full mt-2 shrink-0' />
          <div className='space-y-1 min-w-0 flex-1'>
            <p className='text-sm font-medium leading-none'>{activity.action}</p>
            <p className='text-xs text-muted-foreground'>{activity.details}</p>
            <p className='text-xs text-muted-foreground'>{activity.time}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentActivity;