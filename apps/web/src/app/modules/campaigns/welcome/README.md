# Module Campaigns - Documentation

## Vue d'ensemble

Le module Campaigns pour AI4Local est un système complet de gestion de campagnes marketing multicanal. Il suit les mêmes standards architecturaux que le module notifications et offre une interface utilisateur complète pour créer, gérer et analyser les campagnes.

## Architecture

```
src/app/modules/campaigns/
├── components/           # Composants UI
├── hooks/               # Hooks React
├── mocks/               # Données mock pour développement
├── tests/               # Tests unitaires
├── examples/            # Exemples d'utilisation
├── types.ts             # Types TypeScript
└── index.ts             # Exports publics
```

## Fonctionnalités principales

### 🎯 Gestion des campagnes

- Création, modification, suppression de campagnes
- Support multicanal (Email, SMS, WhatsApp, Facebook, Google Ads, etc.)
- Planification et automatisation
- Gestion des budgets et enchères

### 📊 Analytics et métriques

- Dashboard avec KPIs en temps réel
- Métriques détaillées par campagne
- Analyse de performance comparative
- Export des données

### 🔍 Filtrage et recherche

- Filtrage avancé par statut, canal, propriétaire
- Recherche textuelle intelligente
- Tri multicritères
- Sauvegarde des filtres favoris

### 🧪 Tests A/B

- Configuration de tests multivariés
- Analyse statistique automatique
- Recommandations d'optimisation
- Historique des tests

## Types de données

### Campaign

```typescript
interface Campaign {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'scheduled' | 'active' | 'paused' | 'completed' | 'failed';
  channel:
    | 'email'
    | 'sms'
    | 'whatsapp'
    | 'facebook'
    | 'google_ads'
    | 'linkedin'
    | 'twitter'
    | 'instagram';
  type:
    | 'promotion'
    | 'newsletter'
    | 'lead_generation'
    | 'retention'
    | 'awareness'
    | 'event';
  objective:
    | 'reach'
    | 'engagement'
    | 'traffic'
    | 'leads'
    | 'conversions'
    | 'sales';
  // ... autres propriétés
}
```

### Métriques

```typescript
interface CampaignMetrics {
  impressions: number;
  clicks: number;
  ctr: number;
  conversions: number;
  conversionRate: number;
  cost: number;
  cpc: number;
  cpm: number;
  roas: number;
  // ... autres métriques
}
```

## Utilisation

### Hook principal

```typescript
import { useCampaigns } from '@/app/modules/campaigns';

function MyCampaignsComponent() {
  const {
    campaigns,
    filteredCampaigns,
    loading,
    stats,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    filters,
    updateFilters,
  } = useCampaigns();

  // Utilisation...
}
```

### Composants disponibles

```typescript
import {
  CampaignsPage, // Page complète
  CampaignsLayout, // Layout avec sidebar
  CampaignsStatsCards, // Cartes de statistiques
  CampaignsToolbar, // Barre d'outils
  CampaignFilters, // Panneau de filtres
  CampaignsList, // Liste/grille des campagnes
  CampaignRightPane, // Panneau de détails
} from '@/app/modules/campaigns';
```

## Exemples d'utilisation

Voir le fichier `examples/CampaignExamples.tsx` pour des exemples complets :

1. **BasicCampaignsExample** - Utilisation basique de la page complète
2. **CampaignsHookExample** - Utilisation du hook useCampaigns
3. **MockDataExample** - Utilisation des données mock
4. **CustomCampaignCreationExample** - Création personnalisée
5. **AdvancedFilteringExample** - Filtrage avancé

## Données mock

15 campagnes réalistes sont disponibles pour le développement :

```typescript
import { mockCampaigns } from '@/app/modules/campaigns/mocks';

// Accès aux campagnes mock
console.log(`${mockCampaigns.length} campagnes disponibles`);
```

Les données mock incluent :

- Campagnes de différents types et statuts
- Métriques réalistes avec calculs automatiques
- Tests A/B configurés
- Budgets et planifications variés
- Utilisateurs et audiences mock

## Tests

### Structure des tests

```
tests/
├── CampaignRow.test.tsx        # Exemple complet
├── useCampaigns.test.tsx       # Tests du hook (à créer)
├── CampaignFilters.test.tsx    # Tests des filtres (à créer)
└── integration.test.tsx        # Tests d'intégration (à créer)
```

### Lancer les tests

```bash
npm test campaigns
# ou
yarn test campaigns
```

## API et intégration backend

### Endpoints attendus

```typescript
// GET /api/campaigns
// POST /api/campaigns
// PUT /api/campaigns/:id
// DELETE /api/campaigns/:id
// GET /api/campaigns/:id/metrics
// POST /api/campaigns/:id/actions (pause, resume, etc.)
```

### Configuration Apollo Client

Le module utilise Apollo Client pour les requêtes GraphQL. Voir `src/lib/apollo.ts`.

## Personnalisation

### Couleurs et thème

Le module utilise les couleurs de la marque AI4Local définies dans `globals.css` :

- `--brand-dark: #0A4595`
- `--brand-mid: #1F6CC5`
- `--brand-light: #63B3ED`
- `--brand-ghost: #A7D8F9`

### Ajout de nouveaux canaux

1. Ajouter le canal dans le type `CampaignChannel`
2. Mettre à jour les icônes dans `CampaignsList`
3. Ajouter la configuration dans les filtres

### Métriques personnalisées

1. Étendre l'interface `CampaignMetrics`
2. Mettre à jour le calcul des statistiques
3. Ajouter les cartes correspondantes

## Performance

### Optimisations implémentées

- Mémorisation avec `useMemo` et `useCallback`
- Filtrage côté client optimisé
- Lazy loading des composants lourds
- Debounce sur la recherche
- Pagination virtuelle pour les grandes listes

### Recommandations

- Implémenter la pagination serveur pour >1000 campagnes
- Utiliser React Query pour le cache des données
- Optimiser les images des créatifs
- Implémenter le prefetching des détails

## Accessibilité

### Standards respectés

- WCAG 2.1 AA
- Navigation au clavier complète
- Lecteurs d'écran supportés
- Contrastes de couleur validés
- Focus management approprié

### Tests d'accessibilité

```typescript
// Exemple dans les tests
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

test('should be accessible', async () => {
  const { container } = render(<CampaignsPage />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

## Roadmap

### Version 1.1

- [ ] Export CSV/Excel des campagnes
- [ ] Templates de campagnes
- [ ] Duplication de campagnes
- [ ] Historique des modifications

### Version 1.2

- [ ] Automation workflows
- [ ] Intégration CRM
- [ ] API webhooks
- [ ] Notifications push

### Version 2.0

- [ ] IA pour optimisation automatique
- [ ] Prédictions de performance
- [ ] Recommandations personnalisées
- [ ] Tableau de bord exécutif

## Support et maintenance

### Logs et debugging

```typescript
// Activer les logs de développement
localStorage.setItem('campaigns:debug', 'true');
```

### Problèmes courants

1. **Filtres ne s'appliquent pas** - Vérifier la structure des données
2. **Métriques incorrectes** - Contrôler le calcul dans `useCampaigns`
3. **Performance lente** - Activer React DevTools Profiler

### Contact

- Équipe développement AI4Local
- Documentation technique : [lien interne]
- Bug reports : [système de tickets]

---

**Note**: Cette documentation est maintenue à jour avec chaque release. Dernière mise à jour : Version 1.0.0
