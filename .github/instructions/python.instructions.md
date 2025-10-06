---
applyTo: "apps/python-scripts/**"
---

# Instructions Copilot - Scripts Python

**Langue** : français. **Ton** : clair, concis, pragmatique.
**Priorité** : lisibilité, typage, maintenabilité.

## Stack Python
- **Scripts modulaires** pour jobs/ML
- **Poetry** pour gestion dépendances
- **Type hints** obligatoires
- **Black + Ruff** pour formatage/linting

## Règles spécifiques
1. **Typage** : mypy strict, type hints obligatoires
2. **Formatage** : black + ruff sans exceptions
3. **Tests** : pytest avec couverture
4. **Documentation** : docstrings Google style
5. **Gestion erreurs** : exceptions typées

## Structure attendue
```python
from typing import List, Optional
from dataclasses import dataclass
import pytest

@dataclass
class User:
    id: str
    email: str
    name: Optional[str] = None

def process_users(users: List[User]) -> List[User]:
    """
    Traite une liste d'utilisateurs.
    
    Args:
        users: Liste des utilisateurs à traiter
        
    Returns:
        Liste des utilisateurs traités
        
    Raises:
        ValueError: Si la liste est vide
    """
    if not users:
        raise ValueError("La liste d'utilisateurs ne peut pas être vide")
    
    return [user for user in users if user.email]

# Tests
def test_process_users():
    users = [User(id="1", email="test@example.com")]
    result = process_users(users)
    assert len(result) == 1
```

## Développement local
```bash
poetry install
poetry run python script.py
poetry run pytest
```

## Qualité code
```bash
poetry run black .
poetry run ruff check .
poetry run mypy .
poetry run pytest --cov
```

## Prompts recommandés
- "Créer script Python typé avec tests pytest"
- "Générer job de traitement de données avec validation"
- "Créer module ML avec interface typée"