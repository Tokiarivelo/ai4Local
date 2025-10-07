'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Button } from '@/app/modules/ui/button';

interface QuickActionButtonProps {
  icon: LucideIcon;
  label: string;
  variant?: 'default' | 'outline';
  onClick?: () => void;
}

export const QuickActionButton: React.FC<QuickActionButtonProps> = ({
  icon: Icon,
  label,
  variant = 'outline',
  onClick,
}) => {
  return (
    <Button variant={variant} className="h-20 flex-col space-y-2" onClick={onClick}>
      <Icon className="w-6 h-6" />
      <span>{label}</span>
    </Button>
  );
};
