# 🚀 Guide de Démarrage AI4Local

## Prérequis

### Logiciels requis

- **Bun** >= 1.0.0 (gestionnaire de packages)
- **Node.js** >= 18.0.0
- **Docker** & **Docker Compose**
- **Git**
- **Rust** (pour le service AI Content)
- **Python** 3.11+ (pour le service ML)

### Comptes nécessaires

- Compte **OpenAI** (API key pour génération de contenu)
- Compte **Google Cloud Platform** (pour déploiement production)
- Accès **Mobile Money APIs** (Orange, Airtel, Telma)

## 🏁 Démarrage Rapide

### 1. Cloner le projet

```bash
git clone https://github.com/ai4local/ai4local.git
cd ai4local
```

### 2. Installation des dépendances

```bash
# Installation globale avec Bun
bun install

# Services individuels
cd services/api-gateway && bun install && cd ../..
cd services/ml-service && pip install -r requirements.txt && cd ../..
cd apps/web && bun install && cd ../..
```

### 3. Configuration de l'environnement

```bash
# Copier les fichiers d'environnement
cp .env.example .env
cp apps/web/.env.example apps/web/.env.local
cp services/api-gateway/.env.example services/api-gateway/.env

# Éditer les variables d'environnement
# Ajouter vos clés API, URLs de base de données, etc.
```

### 4. Démarrage avec Docker Compose

```bash
# Démarrage de l'environnement complet
bun run docker:dev

# Ou manuellement
docker-compose -f infra/docker-compose.dev.yml up -d
```

### 5. Vérification des services

```bash
# API Gateway GraphQL
curl http://localhost:4000/graphql

# Application Web
open http://localhost:3000

# Service ML
curl http://localhost:5000/health

# Service AI Content (Rust)
curl http://localhost:8080/health

# n8n (Workflows)
open http://localhost:5678
```

## 🛠️ Développement

### Commandes utiles

```bash
# Développement full-stack
bun run dev:all

# Développement par service
bun run dev:web        # Frontend Next.js
bun run dev:api        # API Gateway NestJS
bun run dev:mobile     # App mobile Expo

# Tests
bun run test:all       # Tous les tests
bun run test:services  # Tests services backend
bun run test:apps      # Tests applications frontend

# Linting
bun run lint:all       # Lint tout le code
bun run lint:services  # Lint services backend
bun run lint:apps      # Lint applications frontend

# Build production
bun run build          # Build complet
```

### Structure des commandes par service

#### API Gateway (NestJS)

```bash
cd services/api-gateway

# Développement
bun run start:dev

# Tests
bun run test
bun run test:e2e

# Migration base de données
bun run migration:up
bun run migration:down

# Build
bun run build
bun run start:prod
```

#### Service AI Content (Rust)

```bash
cd services/ai-content-service

# Développement
cargo run

# Tests
cargo test

# Build optimisé
cargo build --release

# Linting
cargo fmt
cargo clippy
```

#### Service ML (Python)

```bash
cd services/ml-service

# Développement
python src/main.py

# Tests
pytest

# Linting
black src/
flake8 src/
mypy src/

# Dépendances
pip install -r requirements.txt
```

#### Application Web (Next.js)

```bash
cd apps/web

# Développement
bun run dev

# Tests
bun run test
bun run test:watch

# Build
bun run build
bun run start

# Vérification types
bun run type-check
```

## 🐳 Docker & Infrastructure

### Développement local

```bash
# Démarrage complet
docker-compose -f infra/docker-compose.dev.yml up -d

# Services individuels
docker-compose -f infra/docker-compose.dev.yml up mongodb redis
docker-compose -f infra/docker-compose.dev.yml up api-gateway

# Logs
docker-compose -f infra/docker-compose.dev.yml logs -f api-gateway
```

### Kubernetes local avec Skaffold

```bash
# Prérequis
# - Kubernetes cluster local (Docker Desktop, minikube, k3s)
# - Skaffold installé

# Développement avec Skaffold
skaffold dev

# Build et déploiement
skaffold run

# Nettoyage
skaffold delete
```

## 🔧 Configuration

### Variables d'environnement

#### Racine (.env)

```bash
NODE_ENV=development
DATABASE_URL=mongodb://admin:ai4local2025@localhost:27017/ai4local?authSource=admin
REDIS_URL=redis://:ai4local2025@localhost:6379
JWT_SECRET=ai4local-jwt-secret-dev
OPENAI_API_KEY=your-openai-api-key
```

#### API Gateway (.env)

```bash
PORT=4000
MONGODB_URI=mongodb://admin:ai4local2025@localhost:27017/ai4local?authSource=admin
POSTGRES_URI=postgresql://ai4local:ai4local2025@localhost:5432/ai4local_relational
REDIS_URI=redis://:ai4local2025@localhost:6379
JWT_SECRET=ai4local-jwt-secret-dev
AI_CONTENT_SERVICE_URL=http://localhost:8080
ML_SERVICE_URL=http://localhost:5000
```

#### Application Web (.env.local)

```bash
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:4000/graphql
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXTAUTH_SECRET=ai4local-nextauth-secret
NEXTAUTH_URL=http://localhost:3000
```

## 📊 Base de Données

### MongoDB

```bash
# Connexion à MongoDB
mongosh mongodb://admin:ai4local2025@localhost:27017/ai4local?authSource=admin

# Collections principales
use ai4local
db.users.find()
db.companies.find()
db.content_requests.find()
```

### PostgreSQL

```bash
# Connexion à PostgreSQL
psql postgresql://ai4local:ai4local2025@localhost:5432/ai4local_relational

# Tables principales
\dt
SELECT * FROM payments;
SELECT * FROM subscriptions;
```

### Redis

```bash
# Connexion à Redis
redis-cli -a ai4local2025

# Vérification du cache
KEYS *
GET user:session:*
```

## 🧪 Tests

### Tests unitaires

```bash
# API Gateway
cd services/api-gateway
bun run test

# Application Web
cd apps/web
bun run test

# Service Rust
cd services/ai-content-service
cargo test

# Service Python
cd services/ml-service
pytest
```

### Tests d'intégration

```bash
# Tests GraphQL E2E
cd services/api-gateway
bun run test:e2e

# Tests interface utilisateur
cd apps/web
bun run test:integration
```

### Tests de charge

```bash
# Avec k6 (à installer séparément)
k6 run tests/load/api-gateway.js
```

## 🚀 Déploiement

### Staging (automatique via CI/CD)

```bash
# Push sur branche develop
git push origin develop

# Vérification du déploiement
kubectl get pods -n ai4local-staging
```

### Production (automatique via CI/CD)

```bash
# Push sur branche main
git push origin main

# Suivi du déploiement
kubectl get pods -n ai4local
kubectl logs -f deployment/ai4local-api-gateway -n ai4local
```

### Déploiement manuel avec Helm

```bash
# Installation/mise à jour
helm upgrade --install ai4local infra/helm/ai4local \
  --namespace ai4local \
  --create-namespace \
  --values infra/helm/ai4local/values-prod.yaml

# Vérification
helm status ai4local -n ai4local
kubectl get all -n ai4local
```

## 🐛 Debugging

### Logs des services

```bash
# Docker Compose
docker-compose -f infra/docker-compose.dev.yml logs -f api-gateway

# Kubernetes
kubectl logs -f deployment/ai4local-api-gateway -n ai4local
kubectl logs -f deployment/ai4local-web -n ai4local

# Logs agrégés (si Grafana configuré)
# Ouvrir http://localhost:3001 (Grafana)
```

### Debug GraphQL

```bash
# GraphQL Playground/Studio
open http://localhost:4000/graphql

# Exemple de requête
query {
  users {
    id
    email
    firstName
    lastName
  }
}

# Exemple de mutation
mutation {
  createUser(input: {
    email: "test@ai4local.mg"
    firstName: "Test"
    lastName: "User"
    password: "password123"
  }) {
    id
    email
  }
}
```

## 📚 Ressources Supplémentaires

### Documentation

- [Architecture](./docs/architecture/README.md)
- [API GraphQL](./docs/api/graphql-schema.md)
- [Déploiement](./docs/deployment/README.md)
- [Cahier des charges](./docs/cahier-des-charges.md)

### Liens utiles

- [Next.js Documentation](https://nextjs.org/docs)
- [NestJS Documentation](https://docs.nestjs.com)
- [Rust Axum Documentation](https://docs.rs/axum)
- [FastAPI Documentation](https://fastapi.tiangolo.com)

### Support

- **Issues GitHub** : https://github.com/ai4local/ai4local/issues
- **Discussions** : https://github.com/ai4local/ai4local/discussions
- **Email** : dev@ai4local.mg

---

🎉 **Bon développement !** L'équipe AI4Local est là pour vous accompagner.
