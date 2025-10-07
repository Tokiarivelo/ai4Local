'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/modules/ui/card';
import { Badge } from '@/app/modules/ui/badge';
import { Feature } from '@/types/common';

interface FeatureCardProps extends Feature {
  className?: string;
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
  badge,
  className,
}: FeatureCardProps) {
  return (
    <Card className={`hover:shadow-lg transition-shadow duration-300 ${className || ''}`}>
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <Icon className="h-12 w-12 text-blue-600 dark:text-blue-400" />
          <Badge variant="secondary">{badge}</Badge>
        </div>
        <CardTitle className="text-xl font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 dark:text-gray-400">{description}</p>
      </CardContent>
    </Card>
  );
}
