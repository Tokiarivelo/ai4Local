'use client';

import React, { useCallback, useState } from 'react';
import { Upload, Image, Video, File, X, Sparkles } from 'lucide-react';
import { Card } from '@/app/modules/ui/card';
import { Button } from '@/app/modules/ui/button';
import { Badge } from '@/app/modules/ui/badge';
import { Progress } from '@/app/modules/ui/progress';
import type { MediaFile } from '../validators';
import { useCampaignStore } from '../../../stores/campaignStore';

interface MediaUploadSectionProps {
  mediaFiles: MediaFile[];
  onMediaFilesChange: (files: MediaFile[]) => void;
  isGenerating: boolean;
}

export function MediaUploadSection({
  mediaFiles,
  onMediaFilesChange,
  isGenerating,
}: MediaUploadSectionProps) {
  const { useAiCredits, setGenerating, setGenerationError } = useCampaignStore();
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});

  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (!files) return;

      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        const fileId = Math.random().toString(36).substr(2, 9);

        // Simulation du progress
        let progress = 0;
        const interval = setInterval(() => {
          progress += Math.random() * 30;
          if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            setUploadProgress((prev) => {
              const newProgress = { ...prev };
              delete newProgress[fileId];
              return newProgress;
            });
          }
          setUploadProgress((prev) => ({ ...prev, [fileId]: progress }));
        }, 200);

        reader.onload = () => {
          const newFile: MediaFile = {
            id: fileId,
            name: file.name,
            type: file.type.startsWith('image/')
              ? 'image'
              : file.type.startsWith('video/')
                ? 'video'
                : 'file',
            url: reader.result as string,
            size: file.size,
            uploadedAt: new Date(),
          };

          setTimeout(() => {
            onMediaFilesChange([...mediaFiles, newFile]);
          }, 1000);
        };

        reader.readAsDataURL(file);
      });
    },
    [mediaFiles, onMediaFilesChange]
  );

  const handleGenerateImage = async () => {
    setGenerating(true);
    setGenerationError(null);

    try {
      useAiCredits(2); // Coût de génération d'image

      // Simulation de génération IA
      await new Promise((resolve) => setTimeout(resolve, 3000));

      const generatedFile: MediaFile = {
        id: Math.random().toString(36).substr(2, 9),
        name: 'generated-image.jpg',
        type: 'image',
        url: '/placeholder-generated.jpg', // URL de placeholder
        size: 1024 * 500, // 500KB simulé
        uploadedAt: new Date(),
        generated: true,
      };

      onMediaFilesChange([...mediaFiles, generatedFile]);
    } catch (error) {
      setGenerationError("Erreur lors de la génération de l'image");
    } finally {
      setGenerating(false);
    }
  };

  const removeFile = (fileId: string) => {
    onMediaFilesChange(mediaFiles.filter((f) => f.id !== fileId));
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <Image className="h-4 w-4" />;
      case 'video':
        return <Video className="h-4 w-4" />;
      default:
        return <File className="h-4 w-4" />;
    }
  };

  return (
    <Card className="p-6">
      <div className="mb-4">
        <h4 className="font-medium">Éléments multimédias</h4>
        <p className="text-sm text-muted-foreground">
          Ajoutez des images, vidéos ou générez du contenu avec l'IA
        </p>
      </div>

      {/* Zone d'upload */}
      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center mb-6">
        <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-4" />
        <div className="space-y-2">
          <p className="text-sm font-medium">Glissez-déposez vos fichiers ici</p>
          <p className="text-xs text-muted-foreground">PNG, JPG, GIF, MP4 (max. 10MB)</p>
        </div>

        <div className="flex justify-center gap-3 mt-4">
          <Button variant="outline" asChild>
            <label htmlFor="file-upload" className="cursor-pointer">
              <Upload className="h-4 w-4 mr-2" />
              Choisir des fichiers
            </label>
          </Button>

          <Button variant="outline" onClick={handleGenerateImage} disabled={isGenerating}>
            <Sparkles className="h-4 w-4 mr-2" />
            {isGenerating ? 'Génération...' : 'Générer avec IA'}
          </Button>
        </div>

        <input
          id="file-upload"
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>

      {/* Fichiers uploadés */}
      {mediaFiles.length > 0 && (
        <div className="space-y-3">
          <h5 className="font-medium text-sm">Fichiers ajoutés ({mediaFiles.length})</h5>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {mediaFiles.map((file) => (
              <div key={file.id} className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="flex-shrink-0">{getFileIcon(file.type)}</div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    {file.generated && (
                      <Badge variant="secondary" className="text-xs">
                        <Sparkles className="h-3 w-3 mr-1" />
                        IA
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / (1024 * 1024)).toFixed(1)} MB
                  </p>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(file.id)}
                  className="flex-shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Progress des uploads */}
      {Object.keys(uploadProgress).length > 0 && (
        <div className="mt-4 space-y-2">
          {Object.entries(uploadProgress).map(([fileId, progress]) => (
            <div key={fileId}>
              <div className="flex justify-between text-sm mb-1">
                <span>Upload en cours...</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          ))}
        </div>
      )}

      {mediaFiles.length === 0 && (
        <p className="text-sm text-destructive mt-2">
          Veuillez ajouter au moins un élément multimédia
        </p>
      )}
    </Card>
  );
}
