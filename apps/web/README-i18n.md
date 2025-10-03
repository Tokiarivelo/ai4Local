# 🌍 Système Multi-langue AI4Local

L'application AI4Local supporte maintenant 2 langues : **Français** et **Malagasy (Malgache)**.

## 🏗️ Architecture i18n

### Technologies utilisées

- **next-intl v4.3.9** : Internationalisation pour Next.js 15 App Router
- **Route-based locales** : `/fr/page` et `/mg/page`
- **Client & Server Components** : Support complet SSR + hydratation

### Structure des fichiers

```
apps/web/
├── messages/
│   ├── fr.json          # Traductions françaises
│   └── mg.json          # Traductions malagasy
├── src/
│   ├── app/
│   │   ├── [locale]/    # Pages avec locale
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   └── dashboard/
│   │   └── layout.tsx   # Redirect vers /fr
│   ├── components/
│   │   └── LanguageSwitcher.tsx
│   ├── i18n.ts          # Configuration next-intl
│   ├── navigation.ts    # Navigation typée
│   ├── middleware.ts    # Middleware de détection locale
│   └── global.d.ts      # Types TypeScript
└── next.config.js       # Configuration Next.js avec plugin
```

## 🔧 Configuration

### 1. Locales supportées

```typescript
// src/navigation.ts
export const locales = ['fr', 'mg'] as const;
export const defaultLocale = 'fr' as const;
```

### 2. Middleware de routage

```typescript
// src/middleware.ts
export default createMiddleware({
  locales: ['fr', 'mg'],
  defaultLocale: 'fr',
  localePrefix: 'always', // URLs: /fr/page, /mg/page
});
```

### 3. Routes typées

```typescript
// src/navigation.ts
export const pathnames = {
  '/': '/',
  '/dashboard': '/dashboard',
  '/campaigns': '/campaigns',
  // ...
} as const;
```

## 🎯 Utilisation

### Dans les composants

```tsx
import { useTranslations } from 'next-intl';
import { Link } from '@/navigation';

export default function MyComponent() {
  const t = useTranslations();

  return (
    <div>
      <h1>{t('dashboard.title')}</h1>
      <p>{t('dashboard.welcome', { name: 'Rakoto' })}</p>
      <Link href="/campaigns">{t('navigation.campaigns')}</Link>
    </div>
  );
}
```

### Navigation entre langues

```tsx
// components/LanguageSwitcher.tsx
import { useRouter, usePathname } from '@/navigation';

const switchLanguage = (newLocale: string) => {
  router.replace(pathname, { locale: newLocale });
};
```

## 📖 Messages de traduction

### Structure des messages

```json
{
  "common": {
    "loading": "Chargement..." // FR
    "loading": "Miandry..."    // MG
  },
  "navigation": {
    "dashboard": "Tableau de bord", // FR
    "dashboard": "Sehatr'asa"       // MG
  }
}
```

### Interpolation de variables

```json
{
  "dashboard": {
    "welcome": "Bienvenue, {name}", // FR
    "welcome": "Tonga soa, {name}" // MG
  }
}
```

## 🔗 URLs générées

### Français (défaut)

- Homepage: `http://localhost:3000/fr`
- Dashboard: `http://localhost:3000/fr/dashboard`
- Campagnes: `http://localhost:3000/fr/campaigns`

### Malagasy

- Homepage: `http://localhost:3000/mg`
- Dashboard: `http://localhost:3000/mg/dashboard`
- Campagnes: `http://localhost:3000/mg/campaigns`

## 🎨 Interface utilisateur

### Commutateur de langue

- **Position** : Top-right de chaque page
- **Design** : Boutons "Français" / "Malagasy"
- **Comportement** : Conserve la page actuelle en changeant la locale

### Navigation

- **Links typés** : Import depuis `@/navigation`
- **SEO friendly** : URLs complètes avec locale
- **Accessibilité** : `lang` attribute automatique

## 🚀 Déploiement

### Docker

```dockerfile
# Dockerfile.dev
COPY apps/web/messages ./apps/web/messages
```

### Build

```bash
cd apps/web
bun run build    # Génère /fr et /mg static
```

### Variables d'environnement

Aucune variable spécifique requise. Configuration statique.

## 📱 Mobile Money & Madagascar

### Traductions spécifiques

- **MVola** : Conservé tel quel dans les 2 langues
- **Orange Money** : Conservé tel quel
- **Ariary (Ar)** : Monnaie malgache supportée

### Contexte culturel

- **Français** : Langue officielle, business
- **Malagasy** : Langue nationale, familier

## 🔧 Développement

### Ajouter une nouvelle traduction

1. Modifier `messages/fr.json` et `messages/mg.json`
2. Utiliser `t('nouveau.message')` dans le composant
3. TypeScript vous avertira des clés manquantes

### Ajouter une nouvelle page

1. Créer `src/app/[locale]/nouvelle-page/page.tsx`
2. Ajouter la route dans `src/navigation.ts`
3. Tester `/fr/nouvelle-page` et `/mg/nouvelle-page`

### Debug

```bash
# Vérifier les traductions manquantes
bun run dev
# Erreurs TypeScript si clé manquante dans messages/
```

## 🎯 Prochaines étapes

1. **Traductions métier** : Contenu IA spécifique PME Madagascar
2. **Détection automatique** : Géolocalisation + langue navigateur
3. **Pluriels complexes** : Règles grammaticales malagasy
4. **Right-to-left** : Futur support si dialectes régionaux

---

✅ **Système multi-langue opérationnel !**
🇫🇷 Français ↔️ 🇲🇬 Malagasy
