# A/B Tests Module

Module de tests A/B pour AI4Local - Optimisez vos campagnes marketing avec des tests statistiquement rigoureux.

## 📋 Table des matières

- [Structure](#structure)
- [Installation](#installation)
- [Utilisation](#utilisation)
- [Composants](#composants)
- [Store (Zustand)](#store-zustand)
- [Types](#types)
- [Utils](#utils)
- [Tests](#tests)
- [Intégration API](#intégration-api)
- [Exemples](#exemples)

## 🗂 Structure

```
ab-tests/
├── components/
│   ├── AbTestsPage.tsx           # Page principale
│   ├── AbTestsList.tsx           # Liste virtualisée
│   ├── AbTestRow.tsx             # Ligne de test
│   ├── AbTestEditorModal.tsx    # Modal création/édition
│   ├── VariantEditor.tsx         # Éditeur de variante
│   ├── TrafficSplitter.tsx       # Répartition du trafic
│   ├── MetricsSelector.tsx       # Sélection des KPI
│   ├── ResultsDashboard.tsx      # Dashboard de résultats
│   ├── AbTestFilters.tsx         # Filtres et recherche
│   ├── AbTestActions.tsx         # Actions groupées
│   └── AbTestPreview.tsx         # Aperçu variante
├── layout/
│   ├── AbTestsLayout.tsx         # Layout avec breadcrumb
│   └── Header.tsx                # En-tête avec stats
├── store/
│   └── useAbTestsStore.ts        # Store Zustand
├── types.ts                       # Définitions TypeScript
├── mocks/
│   └── abtests.mock.ts           # Données de test
├── utils/
│   ├── abtest-calculations.ts    # Calculs statistiques
│   └── sanity-checks.ts          # Validations métier
├── examples/
│   └── AbTestsExample.tsx        # Exemple d'utilisation
├── tests/
│   ├── AbTestRow.test.tsx        # Tests composants
│   └── useAbTestsStore.test.ts   # Tests store
├── index.ts                       # Exports publics
└── README.md
```

## 📦 Installation

```bash
# Installer les dépendances
bun install zustand react-window react-virtualized-auto-sizer

# Installer les types
bun add -D @types/react-window @types/react-virtualized-auto-sizer
```

## 🚀 Utilisation

### Utilisation de base

```tsx
import { AbTestsExample } from '@/app/modules/campaigns/ab-tests';

export default function AbTestsRoute() {
  return <AbTestsExample />;
}
```

### Utilisation personnalisée

```tsx
import {
  AbTestsLayout,
  Header,
  AbTestsPage,
} from '@/app/modules/campaigns/ab-tests';
import { useAbTestsStore } from '@/app/modules/campaigns/ab-tests/store/useAbTestsStore';

export default function CustomAbTestsPage() {
  const tests = useAbTestsStore((state) => state.tests);

  return (
    <AbTestsLayout hasPermission={true}>
      <Header tests={tests} />
      <AbTestsPage />
    </AbTestsLayout>
  );
}
```

## 🧩 Composants

### AbTestsPage

Composant principal qui orchestre l'ensemble du module.

```tsx
<AbTestsPage />
```

### AbTestsList

Liste virtualisée pour performances optimales avec de grandes quantités de tests.

```tsx
<AbTestsList
  tests={tests}
  selectedIds={selectedIds}
  onSelect={handleSelect}
  onEdit={handleEdit}
  onStart={handleStart}
  // ... autres handlers
/>
```

### AbTestEditorModal

Modal pour créer et éditer des tests A/B.

```tsx
<AbTestEditorModal
  open={isOpen}
  onClose={handleClose}
  onSave={handleSave}
  editingTest={editingTest}
/>
```

### TrafficSplitter

Interface interactive pour répartir le trafic entre variantes.

```tsx
<TrafficSplitter variants={variants} onChange={handleVariantsChange} />
```

### ResultsDashboard

Dashboard de visualisation des résultats avec détection automatique du gagnant.

```tsx
<ResultsDashboard
  test={test}
  onDeclareWinner={handleDeclareWinner}
  onExport={handleExport}
/>
```

## 🗄 Store (Zustand)

Le module utilise Zustand pour la gestion d'état avec support de persistance.

### Actions principales

```typescript
const {
  // CRUD
  fetchTests,
  createDraft,
  updateDraft,
  deleteDraft,

  // Lifecycle
  start,
  pause,
  resume,
  stop,
  archive,

  // Bulk operations
  bulkStart,
  bulkPause,
  bulkArchive,

  // UI state
  setSelectedTestIds,
  toggleTestSelection,
  setFilters,
  setPagination,
} = useAbTestsStore();
```

### Sélecteurs

```typescript
import {
  useTests,
  useSelectedTestIds,
  useFilters,
  usePagination,
} from '@/app/modules/campaigns/ab-tests/store/useAbTestsStore';

const tests = useTests();
const selectedIds = useSelectedTestIds();
```

### Persistance

La persistance est configurée pour sauvegarder:

- Les brouillons en cours d'édition
- Les filtres actifs
- Les préférences de tri

```typescript
// Activer la persistance (déjà configuré par défaut)
const store = useAbTestsStore.persist;

// Effacer les données persistées
store.clearStorage();
```

## 📘 Types

### Types principaux

```typescript
type AbTestStatus = 'draft' | 'running' | 'paused' | 'completed' | 'archived';
type MetricType = 'ctr' | 'conversions' | 'cpa' | 'ltv' | 'engagement';
type Channel = 'email' | 'sms' | 'push' | 'web' | 'social';

interface AbTest {
  id: string;
  name: string;
  campaignId: string;
  channel: Channel;
  status: AbTestStatus;
  variants: Variant[];
  targetMetric: MetricType;
  startDate?: Date;
  endDate?: Date;
  winner?: string;
  metrics?: VariantMetrics[];
  // ...
}
```

## 🛠 Utils

### Calculs statistiques

```typescript
import {
  determineWinner,
  calculateSignificance,
  calculateRequiredSampleSize,
  hasReachedSignificance,
} from '@/app/modules/campaigns/ab-tests/utils/abtest-calculations';

const winner = determineWinner(metrics, 'ctr', 95);
const significance = calculateSignificance(variant1, variant2, 'conversions');
const sampleSize = calculateRequiredSampleSize(0.02, 10, 95, 80);
```

### Validations

```typescript
import {
  validateAbTest,
  validateTrafficSplit,
  canStartTest,
  getTestHealthStatus,
} from '@/app/modules/campaigns/ab-tests/utils/sanity-checks';

const errors = validateAbTest(input);
const { canStart, reason } = canStartTest(test);
const { status, issues } = getTestHealthStatus(test);
```

## 🧪 Tests

### Lancer les tests

```bash
# Tous les tests
bun test

# Tests spécifiques
bun test ab-tests

# Mode watch
bun test --watch

# Avec couverture
bun test --coverage
```

### Exemple de test

```typescript
import { renderHook, act } from '@testing-library/react';
import { useAbTestsStore } from '../store/useAbTestsStore';

it('creates a new test', async () => {
  const { result } = renderHook(() => useAbTestsStore());

  await act(async () => {
    await result.current.createDraft(input);
  });

  expect(result.current.tests).toHaveLength(9);
});
```

## 🔌 Intégration API

Pour connecter à une vraie API, remplacez les appels mock dans le store:

```typescript
// Dans useAbTestsStore.ts

fetchTests: async (params) => {
  set({ isLoading: true, error: null });
  try {
    // Remplacer par votre appel API
    const response = await fetch('/api/ab-tests', {
      method: 'POST',
      body: JSON.stringify({ filters: params }),
    });
    const data = await response.json();

    set({
      tests: data.tests,
      pagination: { ...get().pagination, total: data.total },
      isLoading: false,
    });
  } catch (error) {
    set({
      error: error.message,
      isLoading: false,
    });
  }
},

// Même pattern pour createDraft, updateDraft, etc.
```

### Websocket pour mises à jour temps réel

```typescript
useEffect(() => {
  const ws = new WebSocket('wss://api.example.com/ab-tests/realtime');

  ws.onmessage = (event) => {
    const update = JSON.parse(event.data);

    // Mettre à jour les métriques
    useAbTestsStore.setState((state) => ({
      tests: state.tests.map((test) =>
        test.id === update.testId ? { ...test, metrics: update.metrics } : test
      ),
    }));
  };

  return () => ws.close();
}, []);
```

## 📚 Exemples

### Créer un test programmatiquement

```typescript
const { createDraft } = useAbTestsStore();

await createDraft({
  name: 'Email Subject Line Test',
  campaignId: 'campaign-123',
  channel: 'email',
  variants: [
    {
      name: 'Control',
      trafficPercentage: 50,
      creative: { type: 'text', content: 'Standard template' },
      headline: 'Summer Sale - 50% Off',
      cta: 'Shop Now',
    },
    {
      name: 'Urgency Variant',
      trafficPercentage: 50,
      creative: { type: 'text', content: 'Urgent template' },
      headline: '⏰ Last Chance: Summer Sale Ends Tonight!',
      cta: "Shop Before It's Gone",
    },
  ],
  targetMetric: 'ctr',
  duration: 7,
  sampleSize: 10000,
});
```

### Filtrage avancé

```typescript
const { setFilters, fetchTests } = useAbTestsStore();

setFilters({
  status: ['running', 'paused'],
  channels: ['email'],
  search: 'Black Friday',
});

await fetchTests();
```

### Export des résultats

```typescript
const exportTestResults = (test: AbTest) => {
  const csv = [
    ['Variant', 'Impressions', 'Clicks', 'CTR', 'Conversions', 'Rate'].join(
      ','
    ),
    ...test.metrics!.map((m) =>
      [
        getVariantName(m.variantId),
        m.impressions,
        m.clicks,
        m.ctr.toFixed(2),
        m.conversions,
        m.conversionRate.toFixed(2),
      ].join(',')
    ),
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${test.name}-results.csv`;
  link.click();
};
```

## 🎨 Personnalisation

### Thème

Le module respecte automatiquement le mode clair/sombre de l'application via Tailwind CSS.

### Variantes de couleurs

Modifiez les couleurs dans `AbTestRow.tsx`:

```typescript
const CHANNEL_COLORS: Record<string, string> = {
  email: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  sms: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  // ...
};
```

## 📖 Meilleures pratiques

1. **Taille d'échantillon**: Utilisez `calculateRequiredSampleSize()` pour déterminer la taille optimale
2. **Durée minimale**: Minimum 7 jours pour capturer les variations hebdomadaires
3. **Variantes**: Limitez à 3-5 variantes max pour la clarté
4. **Validation**: Toujours valider avant de démarrer un test
5. **Winner**: Attendez 95%+ de confiance avant de déclarer un gagnant

## 🐛 Debugging

```typescript
// Activer les logs Zustand DevTools
import { devtools } from 'zustand/middleware';

// Les actions sont déjà loggées dans le store

// Inspecter l'état
console.log(useAbTestsStore.getState());
```

## 📝 License

Propriétaire - AI4Local © 2024

---

Pour plus d'informations, consultez la documentation complète ou contactez l'équipe de développement.
