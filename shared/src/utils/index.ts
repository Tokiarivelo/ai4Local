// Utilitaires partagés AI4Local

import { Language } from '../types';

/**
 * Validation d'email simple
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validation de numéro de téléphone malgache
 */
export const isValidMalagasyPhone = (phone: string): boolean => {
  // Format: +261 XX XXX XXXX ou 0XX XXX XXXX
  const phoneRegex = /^(\+261|0)(3[2-9]|7[0-9])[0-9]{7}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

/**
 * Formatage de numéro de téléphone malgache
 */
export const formatMalagasyPhone = (phone: string): string => {
  const cleaned = phone.replace(/\s/g, '');
  if (cleaned.startsWith('+261')) {
    return cleaned.replace(/(\+261)(\d{2})(\d{3})(\d{4})/, '$1 $2 $3 $4');
  }
  if (cleaned.startsWith('0')) {
    return cleaned.replace(/(\d{3})(\d{2})(\d{3})(\d{2})/, '$1 $2 $3 $4');
  }
  return phone;
};

/**
 * Formatage de montant en Ariary (MGA)
 */
export const formatMGA = (amount: number): string => {
  return new Intl.NumberFormat('fr-MG', {
    style: 'currency',
    currency: 'MGA',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Détection de la langue préférée selon le contexte
 */
export const detectPreferredLanguage = (userLang?: Language, browserLang?: string): Language => {
  if (userLang) return userLang;
  if (browserLang?.startsWith('fr')) return 'fr';
  return 'mg'; // Par défaut malgache
};

/**
 * Traduction simple des termes courants
 */
export const translate = (key: string, lang: Language): string => {
  const translations: Record<string, Record<Language, string>> = {
    // Navigation
    dashboard: { fr: 'Tableau de bord', mg: 'Tohatra' },
    content: { fr: 'Contenu', mg: 'Votoaty' },
    training: { fr: 'Formation', mg: 'Fampianarana' },
    settings: { fr: 'Paramètres', mg: 'Fandrindrana' },

    // Actions
    create: { fr: 'Créer', mg: 'Mamorona' },
    edit: { fr: 'Modifier', mg: 'Manova' },
    delete: { fr: 'Supprimer', mg: 'Mamafa' },
    save: { fr: 'Enregistrer', mg: 'Mitahiry' },
    cancel: { fr: 'Annuler', mg: 'Manafoana' },

    // Status
    active: { fr: 'Actif', mg: 'Miasa' },
    inactive: { fr: 'Inactif', mg: 'Tsy miasa' },
    pending: { fr: 'En attente', mg: 'Miandry' },
    completed: { fr: 'Terminé', mg: 'Vita' },

    // Secteurs d'activité
    agriculture: { fr: 'Agriculture', mg: 'Fambolena' },
    artisanat: { fr: 'Artisanat', mg: 'Asa tanana' },
    commerce: { fr: 'Commerce', mg: 'Varotra' },
    restauration: { fr: 'Restauration', mg: 'Sakafo' },
    services: { fr: 'Services', mg: 'Serivisy' },
    tourisme: { fr: 'Tourisme', mg: 'Fizahan-tany' },
    textile: { fr: 'Textile', mg: 'Lamba' },
    transport: { fr: 'Transport', mg: 'Fitaterana' },

    // Erreurs courantes
    required_field: { fr: 'Ce champ est obligatoire', mg: 'Ilaina io sehatra io' },
    invalid_email: { fr: 'Email invalide', mg: 'Email tsy mety' },
    invalid_phone: { fr: 'Numéro de téléphone invalide', mg: 'Nomeraon-telefaona tsy mety' },
    network_error: { fr: 'Erreur réseau', mg: "Olana amin'ny fifandraisana" },

    // Messages de succès
    user_created: { fr: 'Utilisateur créé avec succès', mg: 'Mpampiasa voaforona tsara' },
    content_generated: { fr: 'Contenu généré avec succès', mg: 'Votoaty voaforona tsara' },
    payment_success: { fr: 'Paiement effectué avec succès', mg: 'Fandoavam-bola vita tsara' },
  };

  return translations[key]?.[lang] || key;
};

/**
 * Validation de mot de passe fort
 */
export const isStrongPassword = (password: string): boolean => {
  // Au moins 8 caractères, 1 majuscule, 1 minuscule, 1 chiffre
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return strongPasswordRegex.test(password);
};

/**
 * Génération d'un ID unique simple
 */
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * Calcul de la taille de données en MB
 */
export const bytesToMB = (bytes: number): number => {
  return Math.round((bytes / (1024 * 1024)) * 100) / 100;
};

/**
 * Vérification si l'utilisateur est en ligne
 */
export const isOnline = (): boolean => {
  return typeof navigator !== 'undefined' ? navigator.onLine : true;
};

/**
 * Délai d'attente promisifié
 */
export const delay = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Retry avec backoff exponentiel
 */
export const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> => {
  let lastError: Error;

  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (i < maxRetries) {
        await delay(baseDelay * Math.pow(2, i));
      }
    }
  }

  throw lastError!;
};

/**
 * Compression simple de texte pour mode offline
 */
export const compressText = (text: string): string => {
  // Implémentation basique - à remplacer par une vraie compression
  return btoa(encodeURIComponent(text));
};

/**
 * Décompression de texte
 */
export const decompressText = (compressed: string): string => {
  try {
    return decodeURIComponent(atob(compressed));
  } catch {
    return compressed; // Si la décompression échoue, retourner tel quel
  }
};

/**
 * Validation du secteur d'activité selon les standards malgaches
 */
export const isValidSector = (sector: string): boolean => {
  const validSectors = [
    'AGRICULTURE',
    'ARTISANAT',
    'COMMERCE',
    'RESTAURATION',
    'SERVICES',
    'TOURISME',
    'TEXTILE',
    'TRANSPORT',
    'AUTRES',
  ];
  return validSectors.includes(sector.toUpperCase());
};

/**
 * Calcul de score de complexité pour contenu IA
 */
export const calculateContentComplexity = (prompt: string): number => {
  const words = prompt.split(/\s+/).length;
  const specialChars = (prompt.match(/[!@#$%^&*()_+=\[\]{}|;':",.<>?]/g) || []).length;
  const questions = (prompt.match(/\?/g) || []).length;

  return Math.min(100, Math.round((words * 2 + specialChars * 3 + questions * 5) / 10));
};
