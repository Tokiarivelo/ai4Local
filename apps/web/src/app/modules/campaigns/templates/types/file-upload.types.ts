export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  thumbnailUrl?: string;
  uploadedAt: Date;
}

export interface FileUploadConfig {
  maxSize: number; // in bytes
  acceptedTypes: string[];
  maxFiles: number;
}

export const DEFAULT_IMAGE_CONFIG: FileUploadConfig = {
  maxSize: 5 * 1024 * 1024, // 5MB
  acceptedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  maxFiles: 10,
};

export const DEFAULT_VIDEO_CONFIG: FileUploadConfig = {
  maxSize: 50 * 1024 * 1024, // 50MB
  acceptedTypes: ['video/mp4', 'video/webm', 'video/quicktime'],
  maxFiles: 5,
};
