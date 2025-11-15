# Annexe A — Table complète des balises MML

## Balises fondamentales

| Balise | Nom | Description | Exemple |
|--------|-----|-------------|---------|
| `T:` | Title | Titre principal du document | `T:Rapport d'urgence` |
| `H:` | Header | Section ou en-tête | `H:Introduction` |
| `P:` | Paragraph | Paragraphe de texte | `P:Ceci est un paragraphe` |
| `L:` | Link | Lien hypertexte | `L:Documentation|https://example.com` |
| `IMG:` | Image | Référence d'image | `IMG:Carte du secteur|map.png` |
| `C:` | Code | Bloc de code | `C:console.log('Hello')` |
| `Q:` | Quote | Citation ou note importante | `Q:Attention : zone dangereuse` |
| `M:` | Metadata | Métadonnées clé-valeur | `M:Auteur|Jean Dupont` |

## Balises spécialisées

| Balise | Nom | Description | Exemple |
|--------|-----|-------------|---------|
| `CFG:` | Configuration | Section de configuration | `CFG:Paramètres réseau` |
| `PKT:` | Packet | Conteneur DNF | `PKT:MSG-001` |

## Balises de sécurité (optionnelles)

| Balise | Nom | Description | Exemple |
|--------|-----|-------------|---------|
| `HASH:` | Hash | Empreinte cryptographique | `HASH:SHA256:abc123...` |
| `SIGN:` | Signature | Signature digitale | `SIGN:ED25519:key:signature` |
| `ENCRYPT:` | Encryption | Contenu chiffré | `ENCRYPT:AES256:key_id` |

## Syntaxe détaillée

### Format général
```
TAG:contenu
```

**Règles strictes :**
- Un seul TAG par ligne
- Séparateur `:` obligatoire
- Pas d'espaces autour du `:`
- Encodage UTF-8

### Contenu spécial

#### Liens (L:)
```
L:Texte affiché|URL ou référence
```

#### Métadonnées (M:)
```
M:Clé|Valeur
```

#### Images (IMG:)
```
IMG:Description|URL ou chemin
```

### Caractères réservés

| Caractère | Usage | Échappement |
|-----------|-------|-------------|
| `:` | Séparateur TAG/contenu | `:text:` → `:text:` dans contenu |
| `\|` | Séparateur dans M:, L: | `\|` → `\|` dans texte |
| `\n` | Fin de ligne | Implicite |

## Extensions proposées (MML 2.0)

### Balises multimédia
- `AUDIO:` - Références audio
- `VIDEO:` - Contenu vidéo
- `3D:` - Modèles 3D

### Balises structurelles
- `CAL:` - Événements calendaires
- `TASK:` - Gestion de tâches
- `FORM:` - Formulaires

### Balises IA
- `AI:` - Métadonnées d'analyse IA
- `ML:` - Modèles embarqués
- `RULE:` - Règles de validation

---

**Note** : Cette table définit le standard MML 1.0. Les extensions sont proposées pour futures versions mais restent rétrocompatibles.
