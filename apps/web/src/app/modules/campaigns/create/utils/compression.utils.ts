/**
 * Utilitaires pour la compression d'images et la sanitisation
 * Fonctions helper pour optimiser les médias uploadés
 */

// Configuration de compression par défaut
const DEFAULT_COMPRESSION_CONFIG = {
  maxWidth: 1920,
  maxHeight: 1080,
  quality: 0.8,
  format: 'webp' as const,
  thumbnailSize: 300,
};

// Types pour la compression
export interface CompressionConfig {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0-1
  format?: 'webp' | 'jpeg' | 'png';
  thumbnailSize?: number;
}

export interface CompressionResult {
  originalFile: File;
  compressedFile: File;
  thumbnail: File;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  originalUrl: string;
  compressedUrl: string;
  thumbnailUrl: string;
  dimensions: { width: number; height: number };
}

/**
 * Compresse une image avec configuration personnalisée
 */
export async function compressImage(
  file: File,
  config: CompressionConfig = {}
): Promise<CompressionResult> {
  const finalConfig = { ...DEFAULT_COMPRESSION_CONFIG, ...config };

  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Canvas context not available'));
      return;
    }

    img.onload = () => {
      try {
        // Calculer les nouvelles dimensions
        const { width: newWidth, height: newHeight } = calculateDimensions(
          img.width,
          img.height,
          finalConfig.maxWidth!,
          finalConfig.maxHeight!
        );

        // Configurer le canvas
        canvas.width = newWidth;
        canvas.height = newHeight;

        // Dessiner l'image redimensionnée
        ctx.drawImage(img, 0, 0, newWidth, newHeight);

        // Convertir en blob compressé
        canvas.toBlob(
          async (compressedBlob) => {
            if (!compressedBlob) {
              reject(new Error('Compression failed'));
              return;
            }

            // Créer la miniature
            const thumbnailBlob = await createThumbnail(
              img,
              finalConfig.thumbnailSize!,
              finalConfig.quality!
            );

            // Créer les fichiers et URLs
            const compressedFile = new File([compressedBlob], `compressed_${file.name}`, {
              type: compressedBlob.type,
            });

            const thumbnailFile = new File([thumbnailBlob], `thumbnail_${file.name}`, {
              type: thumbnailBlob.type,
            });

            const originalUrl = URL.createObjectURL(file);
            const compressedUrl = URL.createObjectURL(compressedFile);
            const thumbnailUrl = URL.createObjectURL(thumbnailFile);

            const compressionRatio = ((file.size - compressedFile.size) / file.size) * 100;

            resolve({
              originalFile: file,
              compressedFile,
              thumbnail: thumbnailFile,
              originalSize: file.size,
              compressedSize: compressedFile.size,
              compressionRatio,
              originalUrl,
              compressedUrl,
              thumbnailUrl,
              dimensions: { width: newWidth, height: newHeight },
            });
          },
          `image/${finalConfig.format}`,
          finalConfig.quality
        );
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Calcule les dimensions optimales en respectant le ratio
 */
function calculateDimensions(
  originalWidth: number,
  originalHeight: number,
  maxWidth: number,
  maxHeight: number
): { width: number; height: number } {
  const ratio = originalWidth / originalHeight;

  let width = originalWidth;
  let height = originalHeight;

  // Redimensionner si nécessaire
  if (width > maxWidth) {
    width = maxWidth;
    height = width / ratio;
  }

  if (height > maxHeight) {
    height = maxHeight;
    width = height * ratio;
  }

  return { width: Math.round(width), height: Math.round(height) };
}

/**
 * Crée une miniature de l'image
 */
function createThumbnail(img: HTMLImageElement, size: number, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Canvas context not available'));
      return;
    }

    // Dimensions carrées pour la miniature
    canvas.width = size;
    canvas.height = size;

    // Calculer les dimensions de crop (centré)
    const sourceSize = Math.min(img.width, img.height);
    const sourceX = (img.width - sourceSize) / 2;
    const sourceY = (img.height - sourceSize) / 2;

    // Dessiner la miniature
    ctx.drawImage(
      img,
      sourceX,
      sourceY,
      sourceSize,
      sourceSize, // Source
      0,
      0,
      size,
      size // Destination
    );

    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Thumbnail creation failed'));
        }
      },
      'image/webp',
      quality
    );
  });
}

/**
 * Valide qu'un fichier est une image supportée
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const supportedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (!supportedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Type de fichier non supporté. Utilisez JPG, PNG, WebP ou GIF.',
    };
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'Fichier trop volumineux. Taille maximum : 10MB.',
    };
  }

  return { valid: true };
}

/**
 * Valide qu'un fichier est une vidéo supportée
 */
export function validateVideoFile(file: File): { valid: boolean; error?: string } {
  const supportedTypes = ['video/mp4', 'video/webm', 'video/ogg'];
  const maxSize = 100 * 1024 * 1024; // 100MB

  if (!supportedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Type de fichier non supporté. Utilisez MP4, WebM ou OGG.',
    };
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'Fichier trop volumineux. Taille maximum : 100MB.',
    };
  }

  return { valid: true };
}

/**
 * Sanitise le contenu texte pour éviter les injections
 */
export function sanitizeText(text: string): string {
  return text
    .replace(/[<>]/g, '') // Supprimer les balises
    .replace(/javascript:/gi, '') // Supprimer les liens JS
    .replace(/on\w+=/gi, '') // Supprimer les handlers d'événements
    .trim()
    .slice(0, 1000); // Limiter la longueur
}

/**
 * Sanitise une URL pour vérifier qu'elle est sûre
 */
export function sanitizeUrl(url: string): string {
  try {
    const parsed = new URL(url);

    // Seuls les protocoles HTTP/HTTPS sont autorisés
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      throw new Error('Protocole non autorisé');
    }

    return parsed.toString();
  } catch {
    return '';
  }
}

/**
 * Génère un nom de fichier sécurisé
 */
export function sanitizeFileName(fileName: string): string {
  return fileName
    .replace(/[^a-zA-Z0-9.-]/g, '_') // Remplacer les caractères spéciaux
    .replace(/_{2,}/g, '_') // Éviter les underscores multiples
    .replace(/^_|_$/g, '') // Supprimer les underscores en début/fin
    .toLowerCase();
}

/**
 * Formate la taille de fichier en format lisible
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

/**
 * Génère une preview d'image à partir d'un fichier
 */
export function generateImagePreview(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      if (e.target?.result && typeof e.target.result === 'string') {
        resolve(e.target.result);
      } else {
        reject(new Error('Failed to generate preview'));
      }
    };

    reader.onerror = () => reject(new Error('FileReader error'));
    reader.readAsDataURL(file);
  });
}

/**
 * Vérifie si le navigateur supporte la compression WebP
 */
export function supportsWebP(): Promise<boolean> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;

    canvas.toBlob((blob) => resolve(!!blob), 'image/webp');
  });
}

/**
 * Nettoie les URLs d'objets créées pour éviter les fuites mémoire
 */
export function cleanupObjectUrls(urls: string[]): void {
  urls.forEach((url) => {
    if (url.startsWith('blob:')) {
      URL.revokeObjectURL(url);
    }
  });
}
