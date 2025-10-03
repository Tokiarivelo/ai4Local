# .github/copilot-instructions.md

> Fichier guide pour GitHub Copilot / Copilot Chat — comment assister les devs dans ce repo  
> Langue principale : **français**. Ton : clair, concis, pragmatique. Priorité : productivité et cohérence.

---
# Contexte du projet
- **Frontend** : Next.js v15 (React, TypeScript obligatoire).  
- **Backend** : architecture micro-services :
  - **NestJS (GraphQL, TypeScript)** pour l’API principale.
  - **Rust** pour les services haute performance.
  - **Python** pour scripts / jobs / ML.
  - **n8n** pour les workflows/automations.  
- **Orchestration & déploiement** : docker-compose pour dev local, Kubernetes + Helm + Skaffold pour CI/CD et clusters.  
- **CI/CD** : GitHub Actions (lint → test → build → image → helm deploy).  

---

# Règles générales
1. Respecter l’architecture existante (modules GraphQL, résolveurs, schémas).  
2. Toujours générer du code **TypeScript** strict (`strictNullChecks` activé). Pas de `any`.  
3. Proposer **types GraphQL (SDL)** et **types TS** synchronisés.  
4. Générer DTOs / Inputs avec `@nestjs/graphql` (`@InputType`, `@ObjectType`, `@Field`).  
5. Éviter toute injection de secrets. Utiliser `.env` / K8s Secrets.  
6. Chaque nouvelle feature doit avoir **tests** (unitaires avec Jest pour TS, pytest pour Python, cargo test pour Rust).  
7. Documenter (README/CHANGELOG) quand une nouvelle mutation ou query est ajoutée.  

---
# Frontend — Next.js (apps/web)
- Consommer l’API via **GraphQL client** (Apollo Client ou urql selon setup).  
- Générer hooks GraphQL (`useQuery`, `useMutation`) avec codegen si activé.  
- Composants React en **TSX** (`FC<Props>` ou `function Component(props: Props)`), avec **props typées depuis le schéma GraphQL**.  
- Tester avec React Testing Library + Jest.  

---
# Backend — NestJS (GraphQL)
- **Modules** : chaque domaine = 1 module GraphQL (resolver + service + DTO + schema).  
- **Resolvers** : implémenter `@Query`, `@Mutation`, `@Subscription`.  
- **DTOs** : utiliser `@InputType` et `@ObjectType`. Toujours typer les champs.  
- **Validation** : `class-validator` + `class-transformer`.  
- **Context** : gérer auth/user via `@Context()` dans resolvers.  
- **Error handling** : utiliser `ApolloError` ou exceptions Nest mappées.  
- **Tests** : proposer tests e2e GraphQL (`supertest` ou `apollo-server-testing`).  

### Exemple attendu
```ts
@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [User])
  async users(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Mutation(() => User)
  async createUser(@Args('input') input: CreateUserInput): Promise<User> {
    return this.userService.create(input);
  }
}
```
---
# Backend — Rust (services haute performance)

- APIs exposées en REST ou gRPC, communiquant avec le gateway GraphQL Nest si nécessaire.
- Respecter cargo fmt et clippy.
- Types & erreurs avec Result<T,E>.

---
# Backend — Python (scripts, jobs, ML)
- Scripts modulaires, fonctions pures.
- Utiliser virtualenv/poetry pour dépendances.
- Typage avec mypy.
- Tests avec pytest.
- Scripts ML ou jobs batch.
- Respecter black, ruff/flake8.
- Packager dépendances avec poetry/requirements.txt.

---
# n8n
- Documenter chaque workflow : déclencheur, nœuds, secrets requis.
- Ajouter retries et erreurs fallback.
- Utiliser des variables d’environnement pour secrets.
- Versionner les workflows dans le repo.

---
# Dev local
- Frontend : bun dev (toujours bun).
- Backend : docker-compose -f docker-compose.dev.yml up.
- Full stack : skaffold dev.
- Pour les projet node, utilise toujours bun (pas npm/yarn/pnpm).

---
# CI/CD
- Linting : eslint (TS), rustfmt/clippy (Rust), black/ruff
- Commits : Conventional Commits (feat, fix, chore, etc.).
- Helm : bump version chart à chaque modif.
- Tests et lint obligatoires avant merge.
- Secrets : via GitHub Secrets ou K8s.
- Déploiement : staging auto sur push main, prod via release tag.

---
# Revue de code
Chaque PR doit contenir :
- Description claire de la feature/fix.
- Liens vers issues associées.
- Tests unitaires et e2e.
- Documentation mise à jour (README, schémas, etc.).
- Checklist (lint, tests, docs).

---
# Prompts Copilot recommandés
- "Ajoute une mutation createOrder (GraphQL NestJS). Génère InputType, Resolver, Service et tests e2e."
- "Crée un hook React useOrdersQuery basé sur le schéma GraphQL, avec tests RTL."
- "Propose un workflow n8n qui envoie une mutation GraphQL sendNotification après qu’une commande soit validée."

---
# Sécurité
- Ne jamais exposer de secrets dans le code.
- Valider et assainir toutes les entrées utilisateur.
- Utiliser HTTPS et sécuriser les communications entre services.
- Mettre à jour régulièrement les dépendances pour éviter les vulnérabilités.
- Toujours documenter les variables d’environnement nécessaires.
- Respecter les meilleures pratiques de sécurité pour chaque langage/framework utilisé.

---
# Templates utiles#
```
### Description
- Nouvelle query/mutation : ...
- Ce que fait cette PR : ...

### Comment tester
1. Lancer `docker-compose -f docker-compose.dev.yml up`
2. Appeler mutation GraphQL :
   ```graphql
   mutation {
     createUser(input: { name: "Test" }) {
       id
       name
     }
   }
3. Vérifier que la réponse est correcte et que l’utilisateur est créé en base.
Checklist
- [ ] Lint OK
- [ ] Tests unitaires ajoutés
- [ ] Documentation mise à jour
- [ ] Pas de secret hardcodé
- [ ] CI/CD passes
- [ ] Revue de code effectuée
```
