---
applyTo: "apps/web/**"
---

# Instructions Copilot - Frontend Next.js

**Langue** : français. **Ton** : clair, concis, pragmatique.
**Priorité** : productivité, cohérence, sécurité.

## Stack Frontend
- **Next.js 15** (React, TypeScript strict)
- **Tailwind v4** obligatoire
- **Apollo Client/urql** pour API GraphQL
- **Génération hooks** via codegen si disponible

## Règles spécifiques
1. **TypeScript strict** : no any, strictNullChecks activés
2. **Composants React** : TSX avec `FC<Props>` ou `function Comp(props: Props)`
3. **Tests** : React Testing Library + Jest obligatoires
4. **Hooks GraphQL** : `useQuery`, `useMutation` générés via codegen
5. **Lint/format** : eslint obligatoire avant commit

## Structure attendue
```tsx
interface ComponentProps {
  data: SomeType;
  onAction: (id: string) => void;
}

const Component: FC<ComponentProps> = ({ data, onAction }) => {
  const { data: users, loading } = useUsersQuery();
  
  return (
    <div className="flex flex-col space-y-4">
      {/* Tailwind v4 classes */}
    </div>
  );
};
```

## Développement local
- **Commande** : `bun dev`
- **Port** : défini dans docker-compose.dev.yml
- **Hot reload** : activé par défaut

## Tests
```bash
bun test
bun test:watch
```

## Prompts recommandés
- "Créer composant React avec hook useOrdersQuery + tests RTL"
- "Générer page Next.js avec SSR et Apollo Client"
- "Créer formulaire avec validation TypeScript strict"