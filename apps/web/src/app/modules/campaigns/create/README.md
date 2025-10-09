# 🚀 Campaign Create System - Documentation complète

## 📋 Vue d'ensemble

Le système de création de campagnes AI4Local est une interface wizard complète permettant de créer et gérer des campagnes marketing multi-canaux avec une approche moderne et intuitive.

## 🏗️ Architecture

### Structure des dossiers

```
src/app/modules/campaigns/create/
├── components/           # Composants React
│   ├── wizard/          # Étapes du wizard
│   ├── preview/         # Prévisualisation
│   └── ui/              # Composants UI spécifiques
├── mocks/               # Données de test et simulation
├── utils/               # Utilitaires (compression, validation)
├── types.ts             # Définitions TypeScript
├── validators.ts        # Schémas de validation Zod
└── page.tsx            # Point d'entrée
```

### Technologies utilisées

- **Framework**: Next.js 15 avec App Router
- **Validation**: React Hook Form 7.x + Zod 4.x
- **Styling**: Tailwind CSS 4.x
- **Runtime**: Bun (moderne et performant)
- **État**: React hooks + Context local
- **TypeScript**: Mode strict avec types complets

## 🎯 Fonctionnalités principales

### 1. Wizard de création à 6 étapes

1. **Template** (optionnel) - Sélection de modèles pré-configurés
2. **Basic** - Informations de base (nom, objectif, canaux)
3. **Creative** - Upload et gestion des créatifs (images, vidéos, textes)
4. **Audience** - Ciblage et segmentation avancée
5. **Schedule** - Planning, budget et optimisation
6. **Tracking** - UTM, pixels, A/B tests
7. **Review** - Validation finale et création

### 2. Templates intelligents

- 5+ templates optimisés par secteur
- Suggestions automatiques de canaux
- Créatifs pré-configurés
- Métriques d'utilisation temps réel

### 3. Gestion multi-canaux

Support natif pour 10+ canaux :

- **Social**: Facebook, Instagram, LinkedIn, Twitter, TikTok, YouTube
- **Search**: Google Ads, Bing
- **Direct**: Email, SMS, WhatsApp

### 4. Système de créatifs avancé

- Upload avec compression automatique
- Support images (JPG, PNG, WebP) et vidéos (MP4, WebM)
- Génération de miniatures
- Optimisation par canal (dimensions, formats)
- Validation qualité automatique

### 5. Audience Builder

- Segments pré-définis
- Filtres personnalisés avancés
- Import CSV de contacts
- Estimation de portée temps réel
- Analytics démographiques

### 6. Budget et planning intelligent

- Budgets quotidiens/totaux
- Optimisation automatique
- Calendrier avancé avec timezone
- Suggestions de moments optimaux

### 7. Tracking et analytics

- UTM automatiques
- Configuration A/B tests
- Pixels de conversion
- Intégration analytics

## 💻 Guide d'utilisation

### Installation et démarrage

```bash
# Installation des dépendances
bun install

# Démarrage en développement
bun dev

# Build de production
bun build
```

### Utilisation du système

#### 1. Intégration dans une page

```tsx
import { CampaignCreatePage } from '@/app/modules/campaigns/create/components/CampaignCreatePage';

export default function CreateCampaignPage() {
  return (
    <CampaignCreatePage
      onSuccess={(campaignId) => {
        console.log('Campagne créée:', campaignId);
        // Redirection ou notification
      }}
      onCancel={() => {
        // Logique d'annulation
      }}
    />
  );
}
```

#### 2. Utilisation avec template pré-sélectionné

```tsx
<CampaignCreatePage templateId="template-1" onSuccess={handleSuccess} />
```

#### 3. Mode édition

```tsx
<CampaignCreatePage
  isEditing={true}
  initialData={existingCampaignData}
  onSuccess={handleUpdate}
/>
```

### Customisation

#### Ajouter un nouveau canal

```tsx
// Dans mocks/campaign-create.mock.ts
export const mockChannelConfig = {
  // ... canaux existants
  pinterest: {
    name: 'Pinterest',
    icon: '📌',
    maxCreatives: 5,
    supportedTypes: ['image'],
    recommendedDimensions: { width: 1000, height: 1500 },
    description: 'Inspiration visuelle et shopping',
  },
};
```

#### Ajouter un template

```tsx
// Dans mocks/campaign-create.mock.ts
export const mockCampaignTemplates = [
  // ... templates existants
  {
    id: 'template-new',
    name: 'Mon template',
    description: 'Description du template',
    category: 'Custom',
    thumbnail: 'url-image',
    channels: ['facebook', 'instagram'],
    objective: 'awareness',
    isPopular: false,
    usageCount: 0,
    creatives: [...]
  }
];
```

## 🧩 Composants principaux

### CampaignCreatePage

Composant principal gérant l'état du wizard et la navigation.

**Props:**

- `templateId?`: ID de template à utiliser par défaut
- `initialData?`: Données pré-remplies pour l'édition
- `isEditing?`: Mode édition (true/false)
- `onSuccess?`: Callback de succès avec ID de campagne
- `onCancel?`: Callback d'annulation

### CreateCampaignForm

Gestionnaire de formulaires avec React Hook Form et validation Zod.

**Responsabilités:**

- Gestion de l'état des formulaires
- Validation temps réel
- Synchronisation avec le wizard
- Persistance des données

### Étapes du wizard

#### BasicInfoStep

- Nom et description de la campagne
- Sélection d'objectif avec recommandations
- Choix des canaux avec suggestions intelligentes

#### CreativeStep

- Upload de fichiers avec compression
- Gestion des formats multiples
- Prévisualisation temps réel
- Optimisation par canal

#### AudienceStep

- Sélection de segments pré-définis
- Création de filtres personnalisés
- Import CSV avec validation
- Estimation de portée

#### ScheduleBudgetStep

- Configuration budgetaire flexible
- Calendrier avec timezones
- Optimisation automatique
- Presets intelligents

#### TrackingStep

- Paramètres UTM automatiques
- Configuration A/B tests
- Pixels de tracking
- Intégrations analytics

#### ReviewStep

- Résumé complet de la campagne
- Validation finale
- Aperçu multi-appareils
- Actions de création/modification

### TemplateSelector

Sélecteur de templates avec recherche et filtres.

**Fonctionnalités:**

- Recherche textuelle
- Filtres par catégorie
- Templates populaires mis en avant
- Prévisualisation rapide

### PreviewPanel

Système de prévisualisation multi-appareils et multi-canaux.

**Appareils supportés:**

- Desktop (1200px+)
- Tablette (768-1199px)
- Mobile (320-767px)

**Canaux supportés:**

- Email avec header/footer
- Réseaux sociaux avec UI native
- Messages (SMS/WhatsApp)
- Publicités (Google/Facebook)

## 🔧 Types et interfaces

### CampaignDraft

Interface principale pour les données de campagne en cours de création.

```typescript
interface CampaignDraft {
  basicInfo: {
    name: string;
    description?: string;
    objective: CampaignObjective;
  };
  channels: CampaignChannel[];
  creatives: Creative[];
  audience?: AudienceConfig;
  budget?: BudgetConfig;
  schedule?: ScheduleConfig;
  utm?: UTMParameters;
  abTest?: ABTestConfig;
}
```

### WizardState

État du wizard de création.

```typescript
interface WizardState {
  currentStep: WizardStep;
  completedSteps: WizardStep[];
  visitedSteps: WizardStep[];
  isValid: boolean;
  hasUnsavedChanges: boolean;
}
```

## 🧪 Validation avec Zod

### Schémas par étape

Chaque étape dispose de son propre schéma de validation Zod pour une validation incrémentale.

```typescript
const basicInfoSchema = z.object({
  name: z.string().min(3, 'Le nom doit contenir au moins 3 caractères'),
  description: z.string().optional(),
  objective: z.enum([
    'awareness',
    'traffic',
    'engagement',
    'leads',
    'conversions',
  ]),
  channels: z.array(z.string()).min(1, 'Sélectionnez au moins un canal'),
});
```

### Validation complète

Validation finale avant création de campagne.

```typescript
const fullCampaignSchema = z.object({
  basicInfo: basicInfoSchema,
  creatives: z.array(creativeSchema).min(1),
  // ... autres schémas
});
```

## 🎨 Système de design

### Composants UI réutilisables

- `Button` - Boutons avec variants et sizes
- `Card` - Conteneurs avec élévation
- `Input/Textarea` - Champs de saisie
- `Badge` - Étiquettes de statut
- `Progress` - Barres de progression
- `Checkbox` - Cases à cocher

### Thème et couleurs

- Mode sombre/clair automatique
- Couleurs cohérentes avec la charte
- Animations et transitions fluides
- Responsive design mobile-first

## 🚀 Performance et optimisation

### Compression d'images

- Compression WebP automatique
- Redimensionnement intelligent
- Génération de miniatures
- Optimisation par canal

### Lazy loading

- Chargement différé des composants
- Images optimisées
- Code splitting automatique

### Mise en cache

- Cache des templates
- Persistance des brouillons
- Synchronisation hors ligne

## 🧪 Tests et qualité

### Tests unitaires

```bash
# Lancer les tests
bun test

# Tests avec coverage
bun test --coverage
```

### Tests d'intégration

- Scénarios complets de création
- Validation des formulaires
- Navigation du wizard

### Linting et formatting

```bash
# ESLint
bun lint

# Prettier
bun format

# TypeScript check
bun type-check
```

## 📱 Responsive design

### Breakpoints

- Mobile: 320px - 767px
- Tablette: 768px - 1199px
- Desktop: 1200px+

### Adaptations mobiles

- Navigation simplifiée
- Formulaires optimisés
- Prévisualisation adaptée
- Gestures tactiles

## 🔒 Sécurité

### Validation côté client

- Sanitisation des entrées
- Validation des types de fichiers
- Limitation des tailles
- Filtrage XSS

### Gestion des erreurs

- Messages d'erreur explicites
- Fallbacks gracieux
- Logs détaillés
- Recovery automatique

## 🌐 Internationalisation

### Support multilingue

- Français (défaut)
- Anglais
- Malgache (prévu)

### Configuration i18n

```typescript
// Ajout de traductions
export const translations = {
  fr: {
    'campaign.create.title': 'Créer une campagne',
    // ...
  },
  en: {
    'campaign.create.title': 'Create campaign',
    // ...
  },
};
```

## 🔄 Intégrations API

### Endpoints prévus

```typescript
// Création de campagne
POST /api/campaigns
{
  "name": "string",
  "objective": "awareness",
  "channels": ["facebook", "email"],
  // ...
}

// Upload de créatifs
POST /api/campaigns/creatives
FormData with files

// Estimation d'audience
POST /api/audiences/estimate
{
  "segments": ["segment-1"],
  "filters": [...]
}
```

### Gestion d'état

- Optimistic updates
- Retry automatique
- Synchronisation offline
- Cache intelligent

## 📊 Analytics et métriques

### Métriques de création

- Temps de création par étape
- Taux d'abandon par étape
- Templates les plus utilisés
- Canaux populaires

### Optimisations basées sur les données

- Suggestions personnalisées
- Amélioration continue UX
- A/B tests interface

## 🚧 Feuille de route

### Phase 1 (Actuelle) ✅

- [x] Architecture de base
- [x] Wizard de navigation
- [x] Templates système
- [x] Validation formulaires
- [x] Prévisualisation

### Phase 2 (En cours) 🔄

- [ ] Upload de créatifs fonctionnel
- [ ] Audience builder complet
- [ ] Intégration API backend
- [ ] Tests unitaires complets

### Phase 3 (Prévue) 📋

- [ ] IA de génération de contenu
- [ ] Optimisation automatique
- [ ] Analytics avancées
- [ ] Collaboration temps réel

### Phase 4 (Future) 🚀

- [ ] Mobile app
- [ ] API publique
- [ ] Marketplace de templates
- [ ] Intégrations tierces

## 🤝 Contribution

### Guidelines de développement

1. Suivre les conventions TypeScript strict
2. Tests unitaires pour nouvelles fonctionnalités
3. Documentation des composants
4. Performance-first approach

### Structure des commits

```
feat(wizard): ajouter étape audience builder
fix(validation): corriger schéma créatifs
docs(readme): mettre à jour guide utilisation
```

## 📞 Support et contact

- **Documentation**: Voir ce README
- **Issues**: GitHub Issues
- **Discussions**: GitHub Discussions
- **Email**: dev@ai4local.com

---

## 🎉 Conclusion

Le système de création de campagnes AI4Local offre une expérience moderne, performante et intuitive pour créer des campagnes marketing multi-canaux. Avec son architecture modulaire, sa validation robuste et ses fonctionnalités avancées, il constitue une base solide pour l'évolution future de la plateforme.

**Dernière mise à jour**: Décembre 2024  
**Version**: 1.0.0-beta  
**Auteur**: Équipe AI4Local
