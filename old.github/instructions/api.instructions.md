---
applyTo: "apps/api/**"
---

# Instructions Copilot - Backend NestJS

**Langue** : français. **Ton** : clair, concis, pragmatique.
**Priorité** : productivité, cohérence, sécurité.

## Stack Backend
- **NestJS** avec GraphQL/TypeScript
- **Architecture modulaire** : 1 domaine = 1 module
- **Apollo Server** intégré
- **Validation** : class-validator + class-transformer

## Règles spécifiques
1. **TypeScript strict** : no any, strictNullChecks
2. **GraphQL** : schémas SDL et types TS synchronisés
3. **DTOs** : @InputType, @ObjectType avec @nestjs/graphql
4. **Auth** : via @Context()
5. **Tests e2e** : supertest obligatoires

## Structure module attendue
```ts
// user.resolver.ts
@Resolver(() => User)
export class UserResolver {
  constructor(private readonly service: UserService) {}
  
  @Query(() => [User])
  users(): Promise<User[]> {
    return this.service.findAll();
  }
  
  @Mutation(() => User)
  createUser(@Args('input') input: CreateUserInput): Promise<User> {
    return this.service.create(input);
  }
}

// user.input.ts
@InputType()
export class CreateUserInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @MinLength(3)
  name: string;
}
```

## Gestion erreurs
```ts
throw new ApolloError('Message utilisateur', 'CODE_ERROR');
```

## Développement local
- **Commande** : `docker-compose -f docker-compose.dev.yml up api`
- **GraphQL Playground** : disponible en mode dev

## Tests
```bash
bun test:e2e
bun test:unit
```

## Prompts recommandés
- "Créer mutation GraphQL NestJS avec InputType, Resolver, Service et tests e2e"
- "Générer module CRUD complet avec validation class-validator"
- "Créer subscription GraphQL avec gestion auth"