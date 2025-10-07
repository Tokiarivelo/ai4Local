---
applyTo: ".github/**,docker-compose*.yml,k8s/**,helm/**,skaffold.yaml"
---

# Instructions Copilot - DevOps & CI/CD

**Langue** : français. **Ton** : clair, concis, pragmatique.
**Priorité** : sécurité, fiabilité, automatisation.

## Stack DevOps
- **Containers** : Docker + Docker Compose (dev)
- **Orchestration** : Kubernetes + Helm + Skaffold
- **CI/CD** : GitHub Actions
- **Package Manager** : bun (jamais npm/yarn/pnpm)

## Règles CI/CD
1. **Pipeline** : lint → test → build → image → deploy
2. **Commits** : Conventional Commits obligatoires
3. **Secrets** : GitHub Secrets ou K8s, jamais hardcodés
4. **Tests** : obligatoires avant merge
5. **Helm** : bump version à chaque modification

## GitHub Actions structure
```yaml
name: CI/CD Pipeline
on:
  push: { branches: [main, develop] }
  pull_request: { branches: [main] }

jobs:
  lint-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v1
      - run: bun install
      - run: bun run lint
      - run: bun run test
      
  build-and-deploy:
    needs: lint-and-test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - name: Build and push Docker image
        # Build + push logic
      - name: Deploy with Helm
        # Helm upgrade logic
```

## Docker Compose (dev)
```yaml
# docker-compose.dev.yml
services:
  web:
    build: ./apps/web
    ports: ["3000:3000"]
    environment:
      - NEXT_PUBLIC_API_URL=http://api:3000/graphql
    
  api:
    build: ./apps/api
    ports: ["3001:3000"]
    environment:
      - DATABASE_URL=${DATABASE_URL}
```

## Helm structure
```yaml
# helm/values.yaml
image:
  tag: "latest"
  pullPolicy: IfNotPresent

ingress:
  enabled: true
  hosts:
    - host: app.example.com
      paths: ["/"]
```

## Skaffold (dev)
```yaml
# skaffold.yaml
apiVersion: skaffold/v4beta1
kind: Config
build:
  artifacts:
    - image: web
      context: apps/web
    - image: api
      context: apps/api
deploy:
  helm:
    releases:
      - name: ai4local
        chartPath: helm/ai4local
```

## Développement local
```bash
# Frontend seul
bun dev

# Backend seul  
docker-compose -f docker-compose.dev.yml up api

# Full stack
skaffold dev
```

## Sécurité
- **Secrets** : rotation automatique
- **Images** : scan de vulnérabilités
- **HTTPS** : obligatoire en production
- **RBAC** : principe du moindre privilège

## Prompts recommandés
- "Créer pipeline GitHub Actions avec lint, test, build et deploy Helm"
- "Générer Dockerfile optimisé pour Next.js avec build multi-stage"
- "Créer manifests K8s avec ConfigMap et Secrets"