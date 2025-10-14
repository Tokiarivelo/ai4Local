'use client';

import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription } from '@/app/modules/ui/alert';
import { Button } from '@/app/modules/ui/button';
import { useCampaignStore } from '../../../stores/campaignStore';

interface AIErrorAlertProps {
  error: string | null;
}

export function AIErrorAlert({ error }: AIErrorAlertProps) {
  const { setGenerationError } = useCampaignStore();

  if (!error) return null;

  return (
    <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <span>{error}</span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setGenerationError(null)}
          className="ml-2"
        >
          <RefreshCw className="h-3 w-3 mr-1" />
          Réessayer
        </Button>
      </AlertDescription>
    </Alert>
  );
}
