# 🔄 Architecture A/B Testing vs Créatifs - Solutions

## 🤔 Problème Identifié

Il y a une **contradiction logique** entre deux étapes du wizard :

### StepCreatives (Étape 3)

```typescript
// Crée UNE version unique
{
  headline: "Découvrez notre offre",
  caption: "Description de la campagne",
  callToAction: "En savoir plus",
  mediaFiles: [image1.jpg, video1.mp4]
}
```

### StepTracking (Étape 6)

```typescript
// Teste PLUSIEURS versions des mêmes éléments
{
  variants: [
    {
      elements: [
        { type: 'headline', value: 'Offre spéciale limitée !' }, // ≠ StepCreatives
        { type: 'cta_button', value: 'Profiter maintenant' }, // ≠ StepCreatives
        { type: 'image', value: 'image2.jpg' }, // ≠ StepCreatives
      ],
    },
  ];
}
```

### ❌ Conflits

1. **Données dupliquées** entre les étapes
2. **Quelle version utiliser** pour la campagne finale ?
3. **Logique contradictoire** : créer puis recréer
4. **UX confuse** pour l'utilisateur

---

## 🎯 Solution 1: A/B Testing Master (RECOMMANDÉE)

### Principe

- **StepCreatives** = Création de la version de base (contrôle)
- **StepTracking** = Extension avec variantes A/B optionnelles
- **Les variantes héritent** des créatifs de base

### Architecture

#### StepCreatives (Étape 3)

```typescript
interface CreativesStepData {
  // Version de contrôle (base)
  baseline: {
    headline: string;
    caption: string;
    callToAction: string;
    mediaFiles: MediaFile[];
  };
  // Métadonnées
  aiPrompt?: string;
}
```

#### StepTracking (Étape 6)

```typescript
interface TrackingStepData {
  utmParameters: UTMParameters;

  // A/B Testing optionnel
  abTestEnabled: boolean;
  abTestConfig?: {
    testType: 'headline' | 'cta' | 'image' | 'full_creative';
    variants: ABTestVariant[];
  };
}

interface ABTestVariant {
  id: string;
  name: string;
  percentage: number;
  isControl: boolean;

  // Override seulement les éléments testés
  overrides: {
    headline?: string; // Override le headline de base
    callToAction?: string; // Override le CTA de base
    mediaFiles?: MediaFile[]; // Override les medias de base
    // caption reste de la version de base
  };

  expectedOutcome: string;
}
```

### Exemple Concret

```typescript
// Étape Créatifs (base)
creatives: {
  baseline: {
    headline: "Découvrez notre offre spéciale",
    caption: "Une solution innovante pour vos besoins",
    callToAction: "En savoir plus",
    mediaFiles: [baseImage.jpg]
  }
}

// Étape Tracking (variantes)
tracking: {
  abTestEnabled: true,
  abTestConfig: {
    testType: 'headline',
    variants: [
      {
        name: "Contrôle",
        isControl: true,
        percentage: 50,
        overrides: {} // Utilise la baseline
      },
      {
        name: "Test Urgence",
        isControl: false,
        percentage: 50,
        overrides: {
          headline: "Offre limitée - Seulement 48h !" // Override juste le titre
          // caption et callToAction restent de la baseline
        }
      }
    ]
  }
}
```

### Avantages

✅ **Cohérence** : Une source de vérité claire  
✅ **Flexibilité** : A/B testing optionnel  
✅ **Simplicité** : Override seulement ce qui change  
✅ **UX logique** : Créer puis optionnellement tester

---

## 🎯 Solution 2: Créatifs Multiples

### Principe

- **StepCreatives** permet de créer **plusieurs versions** dès le départ
- **StepTracking** organise juste les tests et UTM

### Architecture

#### StepCreatives Modifié

```typescript
interface CreativesStepData {
  primaryVersion: Creative; // Version principale
  alternativeVersions?: Creative[]; // Versions alternatives

  // Options A/B
  enableABTesting: boolean;
  abTestStrategy?: 'headline' | 'cta' | 'media' | 'full';
}

interface Creative {
  id: string;
  name: string;
  headline: string;
  caption: string;
  callToAction: string;
  mediaFiles: MediaFile[];
  isControl?: boolean;
}
```

### Avantages

✅ **Tout centralisé** dans StepCreatives  
✅ **Prévisualisation** directe des variantes

### Inconvénients

❌ **Complexité** : StepCreatives devient très lourd  
❌ **Logique mélangée** : Créatifs + A/B testing dans même étape  
❌ **UX surchargée** : Trop d'options d'un coup

---

## 🎯 Solution 3: Séparation Stricte

### Principe

- **StepCreatives** = Création des assets (images, vidéos, textes)
- **StepTracking** = Tests A/B complètement indépendants
- **Pas de lien** entre les deux

### Architecture

#### StepCreatives (Assets uniquement)

```typescript
interface CreativesStepData {
  // Pool d'assets disponibles
  headlines: string[];
  captions: string[];
  callToActions: string[];
  mediaFiles: MediaFile[];

  // Pas de version "assemblée"
}
```

#### StepTracking (Assembly + Tests)

```typescript
interface TrackingStepData {
  utm: UTMParameters;

  // Variantes qui piochent dans les assets
  variants: {
    name: string;
    percentage: number;
    composition: {
      headline: string; // Choisi parmi creatives.headlines
      caption: string; // Choisi parmi creatives.captions
      callToAction: string; // Choisi parmi creatives.callToActions
      mediaFile: string; // Choisi parmi creatives.mediaFiles
    };
  }[];
}
```

### Avantages

✅ **Séparation claire** des responsabilités  
✅ **Réutilisation** des assets entre variantes

### Inconvénients

❌ **UX fragmentée** : Difficile de voir le résultat final  
❌ **Pas de preview** des campagnes complètes

---

## 🏆 Recommandation: Solution 1

La **Solution 1 (A/B Testing Master)** est la meilleure car :

1. **UX naturelle** : Créer puis optionnellement tester
2. **Backward compatible** : Fonctionne sans A/B testing
3. **Flexible** : Peut tester n'importe quel élément
4. **Maintenable** : Logique claire et séparée

### Implémentation Recommandée

#### Étape 1: Modifier CreativesStepSchema

```typescript
export const CreativesStepSchema = z.object({
  headline: z.string().min(1, 'Le titre est requis'),
  caption: z.string().optional(),
  callToAction: z.string().optional(),
  mediaFiles: z.array(MediaFileSchema).min(1, 'Au moins un média requis'),
  aiPrompt: z.string().optional(),
});
```

#### Étape 2: Modifier ABTestVariantSchema

```typescript
export const ABTestVariantSchema = z.object({
  id: z.string(),
  name: z.string(),
  percentage: z.number().min(0).max(100),
  isControl: z.boolean(),

  // Override des éléments de base
  overrides: z
    .object({
      headline: z.string().optional(),
      caption: z.string().optional(),
      callToAction: z.string().optional(),
      mediaFiles: z.array(MediaFileSchema).optional(),
    })
    .optional(),

  expectedOutcome: z.string().optional(),
});
```

#### Étape 3: Logique de Fusion

```typescript
// Dans le contexte final de la campagne
function getFinalCreativeForVariant(
  baseline: CreativesStepData,
  variant: ABTestVariant
): CreativesStepData {
  return {
    headline: variant.overrides?.headline || baseline.headline,
    caption: variant.overrides?.caption || baseline.caption,
    callToAction: variant.overrides?.callToAction || baseline.callToAction,
    mediaFiles: variant.overrides?.mediaFiles || baseline.mediaFiles,
  };
}
```

Cette approche résout élégamment le conflit tout en gardant une UX simple et logique ! 🚀
