'use client';

import { useState, useCallback } from 'react';
import type { UploadedFile, FileUploadConfig } from '../types/file-upload.types';

interface UseFileUploadOptions {
  config: FileUploadConfig;
  onUploadComplete?: (files: UploadedFile[]) => void;
  onError?: (error: string) => void;
}

export function useFileUpload({ config, onUploadComplete, onError }: UseFileUploadOptions) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const validateFile = (file: File): { valid: boolean; error?: string } => {
    if (file.size > config.maxSize) {
      return {
        valid: false,
        error: `Le fichier ${file.name} est trop volumineux (max: ${
          config.maxSize / 1024 / 1024
        }MB)`,
      };
    }

    if (!config.acceptedTypes.includes(file.type)) {
      return {
        valid: false,
        error: `Type de fichier non supporté: ${file.type}`,
      };
    }

    return { valid: true };
  };

  const uploadFiles = useCallback(
    async (files: FileList | File[]) => {
      const fileArray = Array.from(files);

      if (uploadedFiles.length + fileArray.length > config.maxFiles) {
        onError?.(`Nombre maximum de fichiers dépassé (max: ${config.maxFiles})`);
        return;
      }

      // Validate all files first
      for (const file of fileArray) {
        const validation = validateFile(file);
        if (!validation.valid) {
          onError?.(validation.error || 'Erreur de validation');
          return;
        }
      }

      setUploading(true);
      setProgress(0);

      try {
        const newFiles: UploadedFile[] = [];

        for (let i = 0; i < fileArray.length; i++) {
          const file = fileArray[i];

          // TODO: Replace with actual upload API
          // Simulate upload with progress
          await new Promise((resolve) => {
            const interval = setInterval(() => {
              setProgress((prev) => {
                const newProgress = prev + 10;
                if (newProgress >= 100) {
                  clearInterval(interval);
                  resolve(true);
                  return 100;
                }
                return newProgress;
              });
            }, 100);
          });

          // Create uploaded file object
          const uploadedFile: UploadedFile = {
            id: `file-${Date.now()}-${i}`,
            name: file.name,
            size: file.size,
            type: file.type,
            url: URL.createObjectURL(file), // Temporary URL
            uploadedAt: new Date(),
          };

          newFiles.push(uploadedFile);
        }

        setUploadedFiles((prev) => [...prev, ...newFiles]);
        onUploadComplete?.(newFiles);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Erreur lors de l'upload";
        onError?.(errorMessage);
      } finally {
        setUploading(false);
        setProgress(0);
      }
    },
    [config, uploadedFiles, onUploadComplete, onError]
  );

  const removeFile = useCallback((fileId: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId));
  }, []);

  const clearFiles = useCallback(() => {
    setUploadedFiles([]);
  }, []);

  return {
    uploadFiles,
    removeFile,
    clearFiles,
    uploading,
    progress,
    uploadedFiles,
  };
}
