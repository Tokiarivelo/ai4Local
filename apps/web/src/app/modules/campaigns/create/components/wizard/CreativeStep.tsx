'use client';

import React from 'react';
import { Card } from '@/app/modules/ui/card';
import { Button } from '@/app/modules/ui/button';
import { Upload, Image, Video, Type, Wand2 } from 'lucide-react';

interface CreativeStepProps {
  isValidating?: boolean;
  onAsyncValidation?: (data: any) => Promise<void>;
  isEditing?: boolean;
}

/**
 * Étape 2: Créatifs de la campagne
 * Upload et gestion des images, vidéos, textes
 */
export function CreativeStep({
  isValidating = false,
  onAsyncValidation,
  isEditing = false,
}: CreativeStepProps) {
  return (
    <div className="space-y-8">
      <Card className="p-6">
        <div className="text-center py-12">
          <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Créatifs</h3>
          <p className="text-muted-foreground mb-6">
            Cette étape sera implémentée prochainement. Elle permettra de gérer les créatifs :
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 max-w-2xl mx-auto">
            <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <Image className="w-8 h-8 text-blue-500 mb-2" />
              <span className="text-sm">Images</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <Video className="w-8 h-8 text-green-500 mb-2" />
              <span className="text-sm">Vidéos</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <Type className="w-8 h-8 text-purple-500 mb-2" />
              <span className="text-sm">Textes</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <Wand2 className="w-8 h-8 text-orange-500 mb-2" />
              <span className="text-sm">IA Génération</span>
            </div>
          </div>
          <Button className="mt-6" disabled>
            Fonctionnalité en développement
          </Button>
        </div>
      </Card>
    </div>
  );
}
