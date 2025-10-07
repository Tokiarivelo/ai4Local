---
applyTo: "apps/rust-services/**"
---

# Instructions Copilot - Services Rust

**Langue** : français. **Ton** : clair, concis, pragmatique.
**Priorité** : performance, sécurité, fiabilité.

## Stack Rust
- **APIs REST/gRPC** haute performance
- **Interface** avec NestJS via HTTP/gRPC
- **Cargo workspace** pour multi-services

## Règles spécifiques
1. **Formatage** : `cargo fmt` obligatoire
2. **Linting** : `cargo clippy` sans warnings
3. **Gestion erreurs** : `Result<T, E>` systématique
4. **Tests** : `cargo test` avec couverture
5. **Documentation** : rustdoc pour APIs publiques

## Structure attendue
```rust
use anyhow::Result;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct User {
    pub id: String,
    pub email: String,
}

pub async fn create_user(input: CreateUserInput) -> Result<User> {
    // Validation + logique métier
    Ok(User {
        id: generate_id(),
        email: input.email,
    })
}

#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn test_create_user() {
        // Tests unitaires obligatoires
    }
}
```

## Développement local
```bash
cargo run --bin service-name
cargo watch -x "run --bin service-name"
```

## Tests et qualité
```bash
cargo test
cargo clippy
cargo fmt --check
```

## Prompts recommandés
- "Créer service Rust REST avec validation et tests"
- "Générer client gRPC pour interface avec NestJS"
- "Optimiser performance avec async/await et tokio"