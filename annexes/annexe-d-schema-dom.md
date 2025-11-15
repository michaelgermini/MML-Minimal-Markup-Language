# Annexe D — JSON Schema du DOM MML

## Spécification formelle du Document Object Model MML

Le DOM MML définit la structure arborescente d'un document MML parsé. Cette annexe présente le schéma JSON Schema officiel pour valider les structures DOM MML.

### Schéma principal du DOM MML

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://mml-lang.org/schema/dom/v1.0",
  "title": "MML Document Object Model",
  "description": "Schéma JSON pour valider la structure DOM d'un document MML",
  "type": "object",
  "properties": {
    "type": {
      "const": "document",
      "description": "Type de nœud racine"
    },
    "title": {
      "type": "string",
      "description": "Titre principal du document",
      "minLength": 1
    },
    "metadata": {
      "type": "object",
      "description": "Métadonnées globales du document",
      "patternProperties": {
        "^.*$": {
          "type": "string",
          "description": "Valeur de métadonnée"
        }
      },
      "additionalProperties": false
    },
    "sections": {
      "type": "array",
      "description": "Sections du document",
      "items": {
        "$ref": "#/$defs/section"
      }
    },
    "links": {
      "type": "array",
      "description": "Liens globaux du document",
      "items": {
        "$ref": "#/$defs/link"
      }
    }
  },
  "required": ["type", "metadata", "sections"],
  "additionalProperties": false,

  "$defs": {
    "section": {
      "type": "object",
      "properties": {
        "type": {
          "const": "section",
          "description": "Type de nœud section"
        },
        "title": {
          "type": "string",
          "description": "Titre de la section",
          "minLength": 1
        },
        "metadata": {
          "type": "object",
          "description": "Métadonnées spécifiques à la section",
          "patternProperties": {
            "^.*$": {
              "type": "string"
            }
          },
          "additionalProperties": false
        },
        "children": {
          "type": "array",
          "description": "Éléments enfants de la section",
          "items": {
            "oneOf": [
              {"$ref": "#/$defs/paragraph"},
              {"$ref": "#/$defs/link"},
              {"$ref": "#/$defs/image"},
              {"$ref": "#/$defs/code"},
              {"$ref": "#/$defs/quote"}
            ]
          }
        }
      },
      "required": ["type", "title", "metadata", "children"],
      "additionalProperties": false
    },

    "paragraph": {
      "type": "object",
      "properties": {
        "type": {
          "const": "paragraph"
        },
        "content": {
          "type": "string",
          "description": "Contenu textuel du paragraphe"
        }
      },
      "required": ["type", "content"],
      "additionalProperties": false
    },

    "link": {
      "type": "object",
      "properties": {
        "type": {
          "const": "link"
        },
        "text": {
          "type": "string",
          "description": "Texte affiché du lien",
          "minLength": 1
        },
        "url": {
          "type": "string",
          "description": "URL ou référence cible",
          "minLength": 1
        }
      },
      "required": ["type", "text", "url"],
      "additionalProperties": false
    },

    "image": {
      "type": "object",
      "properties": {
        "type": {
          "const": "image"
        },
        "description": {
          "type": "string",
          "description": "Description textuelle de l'image",
          "minLength": 1
        },
        "url": {
          "type": "string",
          "description": "Chemin ou URL de l'image",
          "minLength": 1
        }
      },
      "required": ["type", "description", "url"],
      "additionalProperties": false
    },

    "code": {
      "type": "object",
      "properties": {
        "type": {
          "const": "code"
        },
        "content": {
          "type": "string",
          "description": "Contenu du bloc de code"
        },
        "language": {
          "type": "string",
          "description": "Langage de programmation (optionnel)",
          "enum": ["javascript", "python", "java", "cpp", "c", "bash", "sql", "json", "xml", "html"]
        }
      },
      "required": ["type", "content"],
      "additionalProperties": false
    },

    "quote": {
      "type": "object",
      "properties": {
        "type": {
          "const": "quote"
        },
        "content": {
          "type": "string",
          "description": "Contenu de la citation"
        }
      },
      "required": ["type", "content"],
      "additionalProperties": false
    }
  }
}
```

## Extensions du schéma

### Nœud de configuration

```json
{
  "$defs": {
    "configuration": {
      "type": "object",
      "properties": {
        "type": {
          "const": "configuration"
        },
        "section": {
          "type": "string",
          "description": "Nom de la section de configuration"
        },
        "parameters": {
          "type": "object",
          "description": "Paramètres de configuration",
          "patternProperties": {
            "^.*$": {
              "type": "string"
            }
          },
          "additionalProperties": false
        }
      },
      "required": ["type", "section", "parameters"],
      "additionalProperties": false
    }
  }
}
```

### Nœud de paquet DNF

```json
{
  "$defs": {
    "packet": {
      "type": "object",
      "properties": {
        "type": {
          "const": "packet"
        },
        "id": {
          "type": "string",
          "description": "Identifiant unique du paquet",
          "pattern": "^[A-Z0-9_-]+$"
        },
        "children": {
          "type": "array",
          "description": "Contenu du paquet",
          "items": {
            "oneOf": [
              {"$ref": "#/$defs/section"},
              {"$ref": "#/$defs/paragraph"},
              {"$ref": "#/$defs/link"},
              {"$ref": "#/$defs/image"},
              {"$ref": "#/$defs/code"},
              {"$ref": "#/$defs/quote"}
            ]
          }
        }
      },
      "required": ["type", "id", "children"],
      "additionalProperties": false
    }
  }
}
```

## Validation et exemples

### Exemple de document valide

```json
{
  "type": "document",
  "title": "Rapport d'urgence",
  "metadata": {
    "auteur": "Dr. Smith",
    "date": "2025-11-15"
  },
  "sections": [
    {
      "type": "section",
      "title": "Situation",
      "metadata": {},
      "children": [
        {
          "type": "paragraph",
          "content": "Incendie en cours"
        },
        {
          "type": "link",
          "text": "Carte du secteur",
          "url": "carte-incendie.png"
        }
      ]
    }
  ]
}
```

### Utilisation du schéma

#### Validation JavaScript
```javascript
const Ajv = require('ajv');
const ajv = new Ajv();

const validate = ajv.compile(mmlDomSchema);
const valid = validate(documentObject);

if (!valid) {
  console.log('Erreurs de validation:', validate.errors);
}
```

#### Validation Python
```python
import jsonschema

try:
    jsonschema.validate(document_object, mml_dom_schema)
    print("Document valide")
except jsonschema.ValidationError as e:
    print(f"Erreur de validation: {e.message}")
```

### Tests de conformité

#### Document minimal valide
```json
{
  "type": "document",
  "title": "Test",
  "metadata": {},
  "sections": []
}
```

#### Document invalide (titre manquant)
```json
{
  "type": "document",
  "metadata": {},
  "sections": []
}
```
**Erreur** : Propriété requise "title" manquante

#### Document invalide (type incorrect)
```json
{
  "type": "document",
  "title": "Test",
  "metadata": {},
  "sections": [
    {
      "type": "invalid_type",
      "title": "Section",
      "metadata": {},
      "children": []
    }
  ]
}
```
**Erreur** : Valeur "invalid_type" ne correspond pas à la constante "section"

## Évolution du schéma

### Versionnement
- **v1.0** : Schéma initial avec types de base
- **v1.1** : Ajout des nœuds de configuration et paquets
- **v2.0** : Support des extensions multilingues (prévu)

### Compatibilité
Le schéma est conçu pour être :
- **Rétrocompatible** : Les anciennes structures restent valides
- **Extensible** : Nouveaux types peuvent être ajoutés
- **Modulaire** : Définitions réutilisables

### Outils de validation
- **Online validator** : Interface web pour tester des documents
- **CLI validator** : Outil en ligne de commande
- **Library validators** : Intégration dans les parsers

---

**Ce schéma définit formellement la structure attendue du DOM MML et permet la validation automatique de tous les documents parsés.**
