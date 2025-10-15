'use client';

import React, { useCallback } from 'react';
import { Upload, X, Image, Film, FileIcon, Loader2 } from 'lucide-react';
import { Button } from '@/app/modules/ui/button';
import { Progress } from '@/app/modules/ui/progress';
import { cn } from '@/lib/utils';
import { useFileUpload } from '../../hooks/useFileUpload';
import type { FileUploadConfig, UploadedFile } from '../../types/file-upload.types';

interface FileUploadZoneProps {
  config: FileUploadConfig;
  onFilesChange: (files: UploadedFile[]) => void;
  existingFiles?: UploadedFile[];
}

export function FileUploadZone({ config, onFilesChange, existingFiles = [] }: FileUploadZoneProps) {
  const [isDragging, setIsDragging] = React.useState(false);

  const { uploadFiles, removeFile, uploading, progress, uploadedFiles } = useFileUpload({
    config,
    onUploadComplete: (newFiles) => {
      onFilesChange([...existingFiles, ...newFiles]);
    },
    onError: (error) => {
      console.error('Upload error:', error);
      // TODO: Show toast notification
    },
  });

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        uploadFiles(files);
      }
    },
    [uploadFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        uploadFiles(files);
      }
    },
    [uploadFiles]
  );

  const handleRemoveFile = useCallback(
    (fileId: string) => {
      const updatedFiles = [...existingFiles, ...uploadedFiles].filter((f) => f.id !== fileId);
      onFilesChange(updatedFiles);
      removeFile(fileId);
    },
    [existingFiles, uploadedFiles, onFilesChange, removeFile]
  );

  const allFiles = [...existingFiles, ...uploadedFiles];
  const remainingSlots = config.maxFiles - allFiles.length;

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return Image;
    if (type.startsWith('video/')) return Film;
    return FileIcon;
  };

  return (
    <div className="space-y-4">
      {/* Upload Zone */}
      {remainingSlots > 0 && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={cn(
            'border-2 border-dashed rounded-lg p-8 text-center transition-colors',
            isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
          )}
        >
          <input
            type="file"
            id="file-upload"
            className="hidden"
            multiple
            accept={config.acceptedTypes.join(',')}
            onChange={handleFileSelect}
            disabled={uploading}
          />

          <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-2">
            {uploading ? (
              <Loader2 className="w-12 h-12 text-muted-foreground animate-spin" />
            ) : (
              <Upload className="w-12 h-12 text-muted-foreground" />
            )}

            <div className="space-y-1">
              <p className="font-medium">
                {uploading ? 'Upload en cours...' : 'Cliquez pour uploader ou glissez-déposez'}
              </p>
              <p className="text-sm text-muted-foreground">
                {config.acceptedTypes.join(', ')} (max {config.maxSize / 1024 / 1024}MB)
              </p>
              <p className="text-xs text-muted-foreground">
                {remainingSlots} fichier{remainingSlots > 1 ? 's' : ''} restant
                {remainingSlots > 1 ? 's' : ''}
              </p>
            </div>
          </label>

          {uploading && (
            <div className="mt-4 w-full max-w-xs mx-auto">
              <Progress value={progress} />
            </div>
          )}
        </div>
      )}

      {/* Uploaded Files Grid */}
      {allFiles.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {allFiles.map((file) => {
            const FileIconComponent = getFileIcon(file.type);

            return (
              <div
                key={file.id}
                className="relative group border rounded-lg overflow-hidden bg-muted/50"
              >
                {/* Preview */}
                <div className="aspect-video bg-muted flex items-center justify-center">
                  {file.type.startsWith('image/') && file.url ? (
                    <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
                  ) : (
                    <FileIconComponent className="w-12 h-12 text-muted-foreground" />
                  )}
                </div>

                {/* File Info */}
                <div className="p-2">
                  <p className="text-xs font-medium truncate" title={file.name}>
                    {file.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>

                {/* Remove Button */}
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6"
                  onClick={() => handleRemoveFile(file.id)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
