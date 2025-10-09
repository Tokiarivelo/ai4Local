/**
 * Layout principal pour la page Campagnes
 * Structure : Breadcrumb + Grid responsive
 */

import { ReactNode } from 'react';
import { ChevronRight, BarChart3 } from 'lucide-react';

interface CampaignsLayoutProps {
  children: ReactNode;
  className?: string;
}

export default function CampaignsLayout({ children, className = '' }: CampaignsLayoutProps) {
  return (
    <div className={`min-h-screen bg-background ${className}`}>
      {/* Header avec breadcrumb */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Breadcrumb */}
            <nav className="flex items-center space-x-2 text-sm">
              <span className="text-muted-foreground">Dashboard</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Campaigns</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium text-foreground">Toutes les campagnes</span>
            </nav>

            {/* Indicateur temps réel */}
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>Données en temps réel</span>
            </div>
          </div>
        </div>
      </div>

      {/* Titre principal */}
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center space-x-3 mb-8">
          <div className="p-2 bg-brand-ghost/20 rounded-lg">
            <BarChart3 className="w-6 h-6 text-brand-dark" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Gestion des campagnes</h1>
            <p className="text-muted-foreground mt-1">
              Suivez et optimisez vos campagnes marketing multi-canaux
            </p>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="space-y-6">{children}</div>
      </div>
    </div>
  );
}
