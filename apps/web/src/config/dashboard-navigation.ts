import { NavigationItem, UserRole } from '@/types/dashboard';

export const navigationItems: NavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Accueil',
    icon: 'LayoutDashboard',
    children: [
      { id: 'overview', label: 'Overview', href: '/dashboard', icon: 'Home' },
      {
        id: 'realtime',
        label: 'Temps réel',
        href: '/dashboard/realtime',
        icon: 'Clock',
      },
      {
        id: 'notifications',
        label: 'Notifications',
        href: '/dashboard/notifications',
        icon: 'BellRing',
      },
    ],
  },
  {
    id: 'campaigns',
    label: 'Campagnes',
    icon: 'Megaphone',
    children: [
      {
        id: 'all-campaigns',
        label: 'Toutes les campagnes',
        href: '/dashboard/campaigns',
        icon: 'Megaphone',
      },
      {
        id: 'create-campaign',
        label: 'Créer une campagne',
        href: '/dashboard/campaigns/create',
        icon: 'Plus',
      },
      {
        id: 'templates',
        label: 'Templates',
        href: '/dashboard/campaigns/templates',
        icon: 'FileTemplate',
      },
      {
        id: 'ab-tests',
        label: 'A/B Tests',
        href: '/dashboard/campaigns/ab-tests',
        icon: 'FlaskConical',
      },
      {
        id: 'drafts',
        label: 'Brouillons',
        href: '/dashboard/campaigns/drafts',
        icon: 'Edit',
      },
    ],
  },
  {
    id: 'clients',
    label: 'Clients',
    icon: 'Users',
    children: [
      { id: 'directory', label: 'Annuaire', href: '/clients', icon: 'Users' },
      {
        id: 'segments',
        label: 'Segments',
        href: '/dashboard/clients/segments',
        icon: 'UserCog',
      },
      {
        id: 'import-export',
        label: 'Import / Export CSV',
        href: '/dashboard/clients/import-export',
        icon: 'Upload',
      },
      {
        id: 'loyalty',
        label: 'Programme de fidélité',
        href: '/clients/loyalty',
        icon: 'Gift',
      },
    ],
  },
  {
    id: 'content',
    label: 'Contenu',
    icon: 'FileText',
    children: [
      {
        id: 'publications',
        label: 'Publications',
        href: '/dashboard/content/publications',
        icon: 'FileText',
      },
      { id: 'ads', label: 'Publicités', href: '/dashboard/content/ads', icon: 'Zap' },
      {
        id: 'assets',
        label: "Bibliothèque d'assets",
        href: '/dashboard/content/assets',
        icon: 'Image',
      },
      {
        id: 'scheduler',
        label: 'Planificateur',
        href: '/dashboard/content/scheduler',
        icon: 'Calendar',
      },
    ],
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: 'BarChart3',
    children: [
      {
        id: 'overview-analytics',
        label: 'Vue générale',
        href: '/dashboard/analytics',
        icon: 'BarChart3',
      },
      {
        id: 'funnels',
        label: 'Funnels',
        href: '/dashboard/analytics/funnels',
        icon: 'TrendingUp',
      },
      {
        id: 'cohorts',
        label: 'Cohortes',
        href: '/dashboard/analytics/cohorts',
        icon: 'GitBranch',
      },
      { id: 'ltv', label: 'LTV', href: '/dashboard/analytics/ltv', icon: 'DollarSign' },
      {
        id: 'custom-reports',
        label: 'Rapports personnalisés',
        href: '/dashboard/analytics/reports',
        icon: 'FileBarChart',
      },
      {
        id: 'exports',
        label: 'Exports',
        href: '/dashboard/analytics/exports',
        icon: 'Download',
      },
    ],
  },
  {
    id: 'notifications-alerts',
    label: 'Notifications & Alertes',
    icon: 'Bell',
    children: [
      {
        id: 'realtime-feed',
        label: 'Flux en temps réel',
        href: '/dashboard/notifications/feed',
        icon: 'Bell',
      },
      {
        id: 'alert-settings',
        label: 'Paramètres alertes',
        href: '/dashboard/notifications/settings',
        icon: 'Settings',
      },
    ],
  },
  {
    id: 'billing',
    label: 'Billing',
    icon: 'CreditCard',
    requiredPermissions: ['billing.read'],
    children: [
      {
        id: 'subscription',
        label: 'Abonnement',
        href: '/dashboard/billing/subscription',
        icon: 'CreditCard',
      },
      {
        id: 'invoices',
        label: 'Factures',
        href: '/dashboard/billing/invoices',
        icon: 'FileText',
      },
      {
        id: 'usage',
        label: 'Utilisation',
        href: '/dashboard/billing/usage',
        icon: 'BarChart3',
      },
    ],
  },
  {
    id: 'settings',
    label: 'Paramètres',
    icon: 'Settings',
    children: [
      {
        id: 'team',
        label: 'Équipe & rôles',
        href: '/dashboard/settings/team',
        icon: 'Users2',
        requiredPermissions: ['users.read'],
      },
      {
        id: 'permissions',
        label: 'Permissions',
        href: '/dashboard/settings/permissions',
        icon: 'Shield',
        requiredPermissions: ['permissions.manage'],
      },
      {
        id: 'integrations',
        label: 'Intégrations',
        href: '/dashboard/settings/integrations',
        icon: 'Link',
      },
      {
        id: 'webhooks',
        label: 'Webhooks & API keys',
        href: '/dashboard/settings/webhooks',
        icon: 'Webhook',
        requiredPermissions: ['api.manage'],
      },
    ],
  },
  {
    id: 'help',
    label: 'Aide',
    icon: 'HelpCircle',
    children: [
      {
        id: 'documentation',
        label: 'Documentation',
        href: '/dashboard/help/docs',
        icon: 'Book',
      },
      {
        id: 'tutorials',
        label: 'Tutoriels',
        href: '/dashboard/help/tutorials',
        icon: 'Video',
      },
      {
        id: 'support',
        label: 'Contacter le support',
        href: '/dashboard/help/support',
        icon: 'MessageSquare',
      },
    ],
  },
];

export const rolePermissions: Record<UserRole, string[]> = {
  Admin: [
    'campaigns.read',
    'campaigns.write',
    'campaigns.delete',
    'clients.read',
    'clients.write',
    'clients.delete',
    'analytics.read',
    'analytics.export',
    'billing.read',
    'billing.write',
    'users.read',
    'users.write',
    'users.delete',
    'permissions.manage',
    'api.manage',
    'content.read',
    'content.write',
    'content.delete',
    'notifications.read',
    'notifications.write',
  ],
  Manager: [
    'campaigns.read',
    'campaigns.write',
    'clients.read',
    'clients.write',
    'analytics.read',
    'analytics.export',
    'users.read',
    'content.read',
    'content.write',
    'notifications.read',
  ],
  Editor: [
    'campaigns.read',
    'campaigns.write',
    'clients.read',
    'clients.write',
    'content.read',
    'content.write',
    'analytics.read',
    'notifications.read',
  ],
  Viewer: [
    'campaigns.read',
    'clients.read',
    'analytics.read',
    'content.read',
    'notifications.read',
  ],
};

export function hasPermission(userRole: UserRole, permission: string): boolean {
  return rolePermissions[userRole]?.includes(permission) ?? false;
}

export function filterNavigationByRole(
  navigation: NavigationItem[],
  userRole: UserRole
): NavigationItem[] {
  return navigation
    .map((item) => {
      const filteredChildren = item.children?.filter((child) => {
        if (!child.requiredPermissions) return true;
        return child.requiredPermissions.some((permission) => hasPermission(userRole, permission));
      });

      if (
        item.requiredPermissions &&
        !item.requiredPermissions.some((permission) => hasPermission(userRole, permission))
      ) {
        return null;
      }

      return {
        ...item,
        children: filteredChildren,
      };
    })
    .filter(Boolean) as NavigationItem[];
}
