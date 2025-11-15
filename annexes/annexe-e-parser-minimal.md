# Annexe E — Implémentation d'un parseur MML minimal

## Parseur ultra-minimal en JavaScript (42 lignes)

Voici l'implémentation la plus simple possible d'un parseur MML qui respecte les principes fondamentaux du langage. Ce parseur minimal démontre que la complexité du MML réside dans sa simplicité conceptuelle.

```javascript
class MinimalMMLParser {
  parse(text) {
    const doc = { title: '', sections: [] };
    let currentSection = null;

    text.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (!trimmed || !trimmed.includes(':')) return;

      const [tag, content] = trimmed.split(':', 2);
      const cleanTag = tag.trim().toUpperCase();
      const cleanContent = content.trim();

      switch(cleanTag) {
        case 'T':
          doc.title = cleanContent;
          break;
        case 'H':
          currentSection = { title: cleanContent, content: [] };
          doc.sections.push(currentSection);
          break;
        case 'P':
          if (currentSection) currentSection.content.push(cleanContent);
          break;
      }
    });

    return doc;
  }
}

// Utilisation
const parser = new MinimalMMLParser();
const result = parser.parse(`
T:Mon document
H:Première section
P:Contenu de la première section
H:Deuxième section
P:Contenu de la deuxième section
`);

console.log(JSON.stringify(result, null, 2));
```

**Résultat :**
```json
{
  "title": "Mon document",
  "sections": [
    {
      "title": "Première section",
      "content": ["Contenu de la première section"]
    },
    {
      "title": "Deuxième section",
      "content": ["Contenu de la deuxième section"]
    }
  ]
}
```

## Parseur ultra-minimal en Python (28 lignes)

```python
class MinimalMMLParser:
    def parse(self, text):
        doc = {'title': '', 'sections': []}
        current_section = None

        for line in text.split('\n'):
            line = line.strip()
            if not line or ':' not in line:
                continue

            tag, content = line.split(':', 1)
            tag = tag.strip().upper()
            content = content.strip()

            if tag == 'T':
                doc['title'] = content
            elif tag == 'H':
                current_section = {'title': content, 'content': []}
                doc['sections'].append(current_section)
            elif tag == 'P' and current_section:
                current_section['content'].append(content)

        return doc

# Utilisation
parser = MinimalMMLParser()
result = parser.parse("""
T:Mon document
H:Première section
P:Contenu de la première section
H:Deuxième section
P:Contenu de la deuxième section
""")

import json
print(json.dumps(result, indent=2, ensure_ascii=False))
```

## Parseur ultra-minimal en C (65 lignes)

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define MAX_LINE 256
#define MAX_SECTIONS 10

typedef struct {
    char title[MAX_LINE];
    char sections[MAX_SECTIONS][MAX_LINE];
    int section_count;
} MMLDocument;

void parse_mml(const char* text, MMLDocument* doc) {
    char line[MAX_LINE];
    int current_section = -1;

    // Copie du texte pour éviter de modifier l'original
    char* text_copy = strdup(text);
    char* token = strtok(text_copy, "\n");

    while (token != NULL) {
        strcpy(line, token);
        // Suppression des espaces
        char* start = line;
        while (*start == ' ' || *start == '\t') start++;

        if (strlen(start) > 0 && strchr(start, ':') != NULL) {
            char* colon_pos = strchr(start, ':');
            *colon_pos = '\0';

            char* tag = start;
            char* content = colon_pos + 1;

            // Conversion en majuscules
            for (int i = 0; tag[i]; i++) {
                tag[i] = toupper(tag[i]);
            }

            if (strcmp(tag, "T") == 0) {
                strcpy(doc->title, content);
            } else if (strcmp(tag, "H") == 0) {
                current_section = doc->section_count++;
                strcpy(doc->sections[current_section], content);
            }
            // Note: Ce parseur minimal ne gère que T et H
        }

        token = strtok(NULL, "\n");
    }

    free(text_copy);
}

int main() {
    MMLDocument doc = {0};

    const char* mml_text =
        "T:Mon document\n"
        "H:Première section\n"
        "H:Deuxième section\n";

    parse_mml(mml_text, &doc);

    printf("Titre: %s\n", doc.title);
    printf("Sections:\n");
    for (int i = 0; i < doc.section_count; i++) {
        printf("  %d: %s\n", i + 1, doc.sections[i]);
    }

    return 0;
}
```

## Parseur fonctionnel en Bash (15 lignes)

```bash
#!/bin/bash

parse_mml() {
    local text="$1"
    local title=""
    local sections=""

    while IFS= read -r line; do
        line=$(echo "$line" | sed 's/^[[:space:]]*//' | sed 's/[[:space:]]*$//')
        if [[ -n "$line" && "$line" == *":"* ]]; then
            tag=$(echo "$line" | cut -d':' -f1 | tr '[:lower:]' '[:upper:]')
            content=$(echo "$line" | cut -d':' -f2- | sed 's/^[[:space:]]*//')

            case "$tag" in
                "T") title="$content" ;;
                "H") sections="${sections}${content}|" ;;
            esac
        fi
    done <<< "$text"

    echo "TITLE: $title"
    echo "SECTIONS: ${sections%|}"
}

# Utilisation
mml_text="T:Mon document
H:Section 1
H:Section 2"

parse_mml "$mml_text"
```

## Principes d'implémentation minimalistes

### 1. Parsing ligne par ligne
```javascript
// Principe fondamental : traiter chaque ligne indépendamment
text.split('\n').forEach(line => {
  // Analyser chaque ligne
});
```

### 2. Séparation tag/contenu
```javascript
// Trouver le premier ':' et séparer
const [tag, content] = line.split(':', 2);
```

### 3. Gestion des espaces
```javascript
// Nettoyer les espaces avant et après
const cleanTag = tag.trim().toUpperCase();
const cleanContent = content.trim();
```

### 4. Structure hiérarchique simple
```javascript
// Maintenir une référence à la section courante
let currentSection = null;
if (tag === 'H') {
  currentSection = { title: content, content: [] };
}
```

## Extensions possibles du parseur minimal

### Support des métadonnées
```javascript
case 'M':
  const [key, value] = content.split('|', 2);
  doc.metadata = doc.metadata || {};
  doc.metadata[key.trim()] = value ? value.trim() : '';
  break;
```

### Support des liens
```javascript
case 'L':
  const [text, url] = content.split('|', 2);
  const link = { text: text.trim(), url: url ? url.trim() : '' };
  if (currentSection) {
    currentSection.links = currentSection.links || [];
    currentSection.links.push(link);
  }
  break;
```

## Tests du parseur minimal

### Test case 1 : Document simple
**Input :**
```
T:Test document
H:Introduction
P:Ceci est un paragraphe
```

**Output attendu :**
```json
{
  "title": "Test document",
  "sections": [
    {
      "title": "Introduction",
      "content": ["Ceci est un paragraphe"]
    }
  ]
}
```

### Test case 2 : Document avec métadonnées
**Input :**
```
T:Rapport
M:Auteur|Jean
M:Date|2025-01-01
H:Section 1
P:Contenu
```

**Output attendu :**
```json
{
  "title": "Rapport",
  "metadata": {
    "Auteur": "Jean",
    "Date": "2025-01-01"
  },
  "sections": [
    {
      "title": "Section 1",
      "content": ["Contenu"]
    }
  ]
}
```

## Performance du parseur minimal

### Métriques mesurées
- **Complexité temporelle** : O(n) où n = nombre de lignes
- **Complexité spatiale** : O(m) où m = nombre de sections
- **Dépendances** : Aucune (langage standard uniquement)
- **Taille du code** : 20-50 lignes selon le langage

### Avantages
- **Ultra-rapide** : Parsing instantané même pour gros documents
- **Mémoire efficace** : Structure minimale
- **Portable** : Fonctionne partout
- **Maintenable** : Code simple et clair

### Limites
- **Fonctionnalités réduites** : Uniquement T, H, P de base
- **Pas de validation** : Accepte tout format de ligne
- **Pas de gestion d'erreurs** : Échoue silencieusement
- **Extensions limitées** : Difficile d'ajouter des fonctionnalités complexes

---

**Ce parseur minimal démontre que l'essence du MML peut être capturée en quelques lignes de code, prouvant la simplicité fondamentale du langage.**
