# Instructions Copilot - ai4Local

**Langue** : français. **Ton** : clair, concis, pragmatique.
**Priorité** : productivité, cohérence, sécurité.

## Stack
- **Frontend** : Next.js 15 + TypeScript strict + Tailwind v4 + Apollo Client
- **Backend** : NestJS (GraphQL) + Rust (perf) + Python (scripts/ML) + n8n (workflows)
- **DevOps** : Docker Compose (dev) + K8s/Helm/Skaffold + GitHub Actions

## Règles essentielles
1. **TypeScript strict** : no any, strictNullChecks
2. **Package manager** : **bun uniquement** (jamais npm/yarn/pnpm)
3. **Tests obligatoires** : Jest/RTL (TS), pytest (Python), cargo test (Rust)
4. **Lint/format** : eslint, black/ruff, rustfmt/clippy obligatoires
5. **Secrets** : jamais hardcodés, toujours .env/K8s
6. **GraphQL** : schémas SDL/TS sync, DTOs @nestjs/graphql

## Structures types
### NestJS GraphQL
```ts
@Resolver(() => User)
export class UserResolver {
  @Mutation(() => User)
  createUser(@Args('input') input: CreateUserInput): Promise<User> {
    return this.service.create(input);
  }
}
```

### React Component
```tsx
const Component: FC<ComponentProps> = ({ data }) => {
  const { data: users, loading } = useUsersQuery();
  return <div className="flex flex-col space-y-4">{/* Tailwind v4 */}</div>;
};
```

## Dev local
- **Frontend** : `bun dev`
- **Backend** : `docker-compose -f docker-compose.dev.yml up`
- **Full stack** : `skaffold dev`

## CI/CD
- Pipeline : lint → test → build → deploy
- Commits : Conventional Commits
- Tests obligatoires avant merge
- Helm version bump requis

## Instructions spécifiques par stack
Voir fichiers séparés dans `.github/copilot-instructions/` selon contexte :
- `web.instructions.md` - Frontend Next.js
- `api.instructions.md` - Backend NestJS  
- `rust.instructions.md` - Services Rust
- `python.instructions.md` - Scripts Python
- `n8n.instructions.md` - Workflows n8n
- `devops.instructions.md` - CI/CD & Infra
