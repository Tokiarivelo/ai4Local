import type { Notification, FilterOptions } from '../types';

export const mockNotifications: Notification[] = [
  {
    id: '1',
    channel: 'facebook',
    type: 'success',
    title: 'Nouvelle connexion Facebook',
    body: 'Votre page Facebook "AI4Local Pro" a été connectée avec succès. Vous pouvez maintenant gérer vos messages et campagnes depuis notre plateforme.',
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
    read: false,
    tags: ['connexion', 'facebook'],
    priority: 'medium',
    meta: {
      pageId: 'ai4local-pro',
      pageName: 'AI4Local Pro',
    },
  },
  {
    id: '2',
    channel: 'whatsapp',
    type: 'warning',
    title: 'Limite de messages approchée',
    body: 'Vous avez utilisé 85% de votre quota mensuel de messages WhatsApp Business. Pensez à optimiser vos campagnes ou à upgrader votre plan.',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 minutes ago
    read: false,
    tags: ['quota', 'whatsapp', 'facturation'],
    priority: 'high',
    meta: {
      currentUsage: '8500',
      totalQuota: '10000',
      percentageUsed: '85',
    },
  },
  {
    id: '3',
    channel: 'instagram',
    type: 'info',
    title: 'Nouveau commentaire Instagram',
    body: "Un utilisateur a commenté votre dernière publication Instagram. Répondez rapidement pour maintenir l'engagement de votre audience.",
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
    read: true,
    tags: ['engagement', 'instagram', 'commentaire'],
    priority: 'medium',
    actionUrl: '/dashboard/social/instagram/comments/456',
    meta: {
      postId: 'post_123',
      username: '@user_example',
      commentPreview: 'Super contenu ! Merci pour ces conseils...',
    },
  },
  {
    id: '4',
    channel: 'email',
    type: 'error',
    title: "Échec d'envoi de campagne",
    body: 'La campagne email "Newsletter Mars 2024" n\'a pas pu être envoyée en raison d\'un problème de configuration SMTP. Vérifiez vos paramètres.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    read: false,
    tags: ['email', 'campagne', 'erreur'],
    priority: 'urgent',
    actionUrl: '/dashboard/email/campaigns/789',
    meta: {
      campaignId: 'campaign_789',
      campaignName: 'Newsletter Mars 2024',
      errorCode: 'SMTP_AUTH_FAILED',
    },
  },
  {
    id: '5',
    channel: 'facebook',
    type: 'success',
    title: 'Campagne Facebook terminée',
    body: 'Votre campagne publicitaire "Promotion Printemps" s\'est achevée avec succès. Consultez les résultats détaillés dans votre tableau de bord.',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
    read: true,
    tags: ['campagne', 'facebook', 'publicité'],
    priority: 'low',
    actionUrl: '/dashboard/campaigns/facebook/completed/101',
    meta: {
      campaignId: 'fb_campaign_101',
      campaignName: 'Promotion Printemps',
      impressions: '25420',
      clicks: '1250',
      ctr: '4.92',
    },
  },
  {
    id: '6',
    channel: 'whatsapp',
    type: 'info',
    title: 'Message automatique envoyé',
    body: "Le message de bienvenue automatique a été envoyé à 15 nouveaux contacts WhatsApp aujourd'hui.",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
    read: true,
    tags: ['automatisation', 'whatsapp', 'bienvenue'],
    priority: 'low',
    meta: {
      recipientCount: '15',
      templateName: 'welcome_message_v2',
    },
  },
  {
    id: '7',
    channel: 'instagram',
    type: 'warning',
    title: "Token d'accès expire bientôt",
    body: "Votre token d'accès Instagram Business expire dans 7 jours. Renouvelez-le pour maintenir la connexion.",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    read: false,
    tags: ['sécurité', 'instagram', 'token'],
    priority: 'high',
    actionUrl: '/settings/integrations/instagram',
    meta: {
      expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      accountId: 'ig_business_456',
    },
  },
  {
    id: '8',
    channel: 'email',
    type: 'success',
    title: 'Liste de contacts importée',
    body: 'Votre fichier CSV contenant 1,250 contacts a été importé avec succès. Tous les contacts sont maintenant disponibles pour vos campagnes.',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
    read: true,
    tags: ['import', 'contacts', 'email'],
    priority: 'medium',
    meta: {
      fileName: 'contacts_mars_2024.csv',
      importedCount: '1250',
      duplicatesSkipped: '45',
    },
  },
  {
    id: '9',
    channel: 'facebook',
    type: 'info',
    title: 'Nouveau message Facebook',
    body: 'Vous avez reçu un nouveau message privé sur votre page Facebook. Répondez rapidement pour offrir un excellent service client.',
    timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(), // 18 hours ago
    read: true,
    tags: ['message', 'facebook', 'service-client'],
    priority: 'medium',
    actionUrl: '/dashboard/social/facebook/messages/new',
    meta: {
      senderName: 'Marie Dubois',
      messagePreview: "Bonjour, j'aimerais avoir plus d'informations sur...",
    },
  },
  {
    id: '10',
    channel: 'whatsapp',
    type: 'error',
    title: 'Erreur de synchronisation',
    body: 'La synchronisation avec WhatsApp Business API a échoué. Certains messages peuvent ne pas avoir été livrés.',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    read: false,
    tags: ['synchronisation', 'whatsapp', 'api'],
    priority: 'urgent',
    actionUrl: '/settings/integrations/whatsapp/troubleshoot',
    meta: {
      errorCode: 'SYNC_FAILED_001',
      affectedMessages: '12',
      lastSyncTime: new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(),
    },
  },
];

export const defaultFilters: FilterOptions = {
  channels: [],
  types: [],
  status: [],
  dateRange: {},
  tags: [],
  priority: [],
  searchQuery: '',
};

export const availableTags = [
  'connexion',
  'facebook',
  'quota',
  'whatsapp',
  'facturation',
  'engagement',
  'instagram',
  'commentaire',
  'email',
  'campagne',
  'erreur',
  'publicité',
  'automatisation',
  'bienvenue',
  'sécurité',
  'token',
  'import',
  'contacts',
  'message',
  'service-client',
  'synchronisation',
  'api',
];

export const mockStats = {
  total: mockNotifications.length,
  unread: mockNotifications.filter((n) => !n.read).length,
  byChannel: {
    facebook: mockNotifications.filter((n) => n.channel === 'facebook').length,
    whatsapp: mockNotifications.filter((n) => n.channel === 'whatsapp').length,
    instagram: mockNotifications.filter((n) => n.channel === 'instagram').length,
    email: mockNotifications.filter((n) => n.channel === 'email').length,
  },
  byType: {
    info: mockNotifications.filter((n) => n.type === 'info').length,
    success: mockNotifications.filter((n) => n.type === 'success').length,
    warning: mockNotifications.filter((n) => n.type === 'warning').length,
    error: mockNotifications.filter((n) => n.type === 'error').length,
  },
  byPriority: {
    low: mockNotifications.filter((n) => n.priority === 'low').length,
    medium: mockNotifications.filter((n) => n.priority === 'medium').length,
    high: mockNotifications.filter((n) => n.priority === 'high').length,
    urgent: mockNotifications.filter((n) => n.priority === 'urgent').length,
  },
};

// Fonction utilitaire pour filtrer les notifications
export function filterNotifications(
  notifications: Notification[],
  filters: FilterOptions
): Notification[] {
  return notifications.filter((notification) => {
    // Filtre par canal
    if (filters.channels.length > 0 && !filters.channels.includes(notification.channel)) {
      return false;
    }

    // Filtre par type
    if (filters.types.length > 0 && !filters.types.includes(notification.type)) {
      return false;
    }

    // Filtre par statut
    if (filters.status.length > 0) {
      const notificationStatus = notification.read ? 'read' : 'unread';
      if (!filters.status.includes(notificationStatus)) {
        return false;
      }
    }

    // Filtre par priorité
    if (
      filters.priority &&
      filters.priority.length > 0 &&
      (!notification.priority || !filters.priority.includes(notification.priority))
    ) {
      return false;
    }

    // Filtre par tags
    if (filters.tags.length > 0) {
      const hasMatchingTag = filters.tags.some((tag) => notification.tags?.includes(tag));
      if (!hasMatchingTag) {
        return false;
      }
    }

    // Filtre par recherche
    if (filters.searchQuery) {
      const searchLower = filters.searchQuery.toLowerCase();
      const matchesSearch =
        notification.title.toLowerCase().includes(searchLower) ||
        notification.body.toLowerCase().includes(searchLower) ||
        notification.tags?.some((tag) => tag.toLowerCase().includes(searchLower));

      if (!matchesSearch) {
        return false;
      }
    }

    // Filtre par date
    if (filters.dateRange.start || filters.dateRange.end) {
      const notificationDate = new Date(notification.timestamp);

      if (filters.dateRange.start) {
        const startDate = new Date(filters.dateRange.start);
        if (notificationDate < startDate) {
          return false;
        }
      }

      if (filters.dateRange.end) {
        const endDate = new Date(filters.dateRange.end);
        if (notificationDate > endDate) {
          return false;
        }
      }
    }

    return true;
  });
}
