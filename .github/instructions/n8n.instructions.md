---
applyTo: "workflows/**"
---

# Instructions Copilot - Workflows n8n

**Langue** : français. **Ton** : clair, concis, pragmatique.
**Priorité** : fiabilité, documentation, monitoring.

## Stack n8n
- **Workflows** JSON versionnés
- **Variables d'environnement** pour secrets
- **Intégration** GraphQL avec API NestJS
- **Monitoring** et retry obligatoires

## Règles spécifiques
1. **Secrets** : jamais hardcodés, toujours via env vars
2. **Documentation** : chaque workflow documenté
3. **Retries** : mécanisme de retry + fallback
4. **Versioning** : workflows exportés en JSON dans repo
5. **Naming** : convention claire pour nœuds et variables

## Structure workflow attendue
```json
{
  "name": "User Notification Workflow",
  "nodes": [
    {
      "name": "Webhook Trigger",
      "type": "n8n-nodes-base.webhook",
      "parameters": {
        "path": "user-created",
        "authentication": "headerAuth"
      }
    },
    {
      "name": "GraphQL Mutation",
      "type": "n8n-nodes-base.graphql",
      "parameters": {
        "url": "={{$env.API_GRAPHQL_URL}}",
        "query": "mutation SendNotification($input: NotificationInput!) { sendNotification(input: $input) { id status } }"
      },
      "retries": 3,
      "retryOnFail": true
    }
  ]
}
```

## Variables d'environnement
```env
API_GRAPHQL_URL=http://api:3000/graphql
NOTIFICATION_SERVICE_KEY={{$secrets.NOTIFICATION_KEY}}
```

## Documentation workflow
```markdown
# Workflow: User Notification

**Déclencheur**: Webhook POST /user-created
**Objectif**: Envoyer notification lors création utilisateur

## Nœuds:
1. **Webhook** - Réception événement
2. **Validation** - Vérification données
3. **GraphQL** - Mutation sendNotification
4. **Fallback** - Gestion erreurs

## Variables requises:
- API_GRAPHQL_URL
- NOTIFICATION_SERVICE_KEY
```

## Développement local
- **Interface** : http://localhost:5678
- **Test** : endpoints webhook disponibles
- **Debug** : logs détaillés activés

## Prompts recommandés
- "Créer workflow n8n : webhook → validation → mutation GraphQL avec retry"
- "Générer workflow de traitement de données avec fallback"
- "Créer automation email avec intégration API externe"