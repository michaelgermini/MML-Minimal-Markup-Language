# Outils CLI MML

Ce dossier contient les outils en ligne de commande pour travailler avec des documents MML.

## Fichiers disponibles

- **`mml-cli.js`** : CLI JavaScript (nécessite Node.js)
- **`mml-cli.py`** : CLI Python (nécessite Python 3)

## Installation

### Prérequis

#### Pour le CLI JavaScript
```bash
# Installer les dépendances
npm install
```

#### Pour le CLI Python
```bash
# Installer les dépendances
pip install -r requirements-test.txt
```

### Rendre exécutables (Linux/Mac)
```bash
chmod +x bin/mml-cli.js
chmod +x bin/mml-cli.py
```

## Utilisation

### Syntaxe générale

```bash
# JavaScript
node bin/mml-cli.js <commande> [options]

# Python
python bin/mml-cli.py <commande> [options]
```

### Commandes disponibles

#### 1. Validation de documents

```bash
# Valider un fichier
node bin/mml-cli.js validate document.mml
python bin/mml-cli.py validate document.mml

# Validation verbeuse
node bin/mml-cli.js validate -v document.mml

# Validation depuis stdin
cat document.mml | node bin/mml-cli.js validate
```

#### 2. Conversion de format

```bash
# Convertir en HTML
node bin/mml-cli.js convert -f html document.mml page.html
python bin/mml-cli.py convert -f html document.mml page.html

# Convertir en JSON
node bin/mml-cli.js convert -f json document.mml data.json

# Convertir en texte brut
node bin/mml-cli.js convert -f text document.mml document.txt

# Conversion depuis stdin vers stdout
cat document.mml | node bin/mml-cli.js convert -f json > data.json
```

#### 3. Compression MMLC

```bash
# Compresser un document
node bin/mml-cli.js compress document.mml compressed.mml
python bin/mml-cli.py compress document.mml compressed.mml

# Compression avec statistiques
node bin/mml-cli.js compress -v document.mml compressed.mml
```

#### 4. Statistiques du document

```bash
# Afficher les statistiques
node bin/mml-cli.js stats document.mml
python bin/mml-cli.py stats document.mml

# Exemple de sortie :
# 📊 Statistiques du document MML:
# Titre: ✅
# Sections: 3
# Paragraphes: 12
# Liens: 5
# Images: 2
# Métadonnées: 8
# Taille: 2048 octets
# Lignes: 45
# Ratio signal/bruit: 78%
```

## Options détaillées

### Options générales

| Option | Description |
|--------|-------------|
| `-v, --verbose` | Mode verbeux avec informations supplémentaires |
| `-i, --input <fichier>` | Spécifier le fichier d'entrée |
| `-o, --output <fichier>` | Spécifier le fichier de sortie |

### Options de conversion

| Option | Valeurs | Description |
|--------|---------|-------------|
| `-f, --format` | `html`, `json`, `text` | Format de sortie |

## Exemples pratiques

### Pipeline de traitement

```bash
# Valider, compresser et convertir en une seule commande
node bin/mml-cli.js validate document.mml && \
node bin/mml-cli.js compress document.mml compressed.mml && \
node bin/mml-cli.js convert -f html compressed.mml page.html
```

### Traitement par lot

```bash
# Traiter tous les fichiers .mml du dossier
for file in documents/*.mml; do
  node bin/mml-cli.js convert -f html "$file" "html/$(basename "$file" .mml).html"
done
```

### Intégration dans des scripts

```bash
#!/bin/bash
# Script de conversion automatique

INPUT_FILE="$1"
OUTPUT_FILE="${INPUT_FILE%.mml}.html"

if [ ! -f "$INPUT_FILE" ]; then
  echo "Erreur: Fichier $INPUT_FILE introuvable"
  exit 1
fi

echo "Conversion $INPUT_FILE → $OUTPUT_FILE"
node bin/mml-cli.js convert -f html "$INPUT_FILE" "$OUTPUT_FILE"

if [ $? -eq 0 ]; then
  echo "Conversion réussie"
else
  echo "Erreur lors de la conversion"
  exit 1
fi
```

## Fonctionnalités avancées

### Compression intelligente

Le compresseur MMLC utilise des dictionnaires adaptatifs :

```bash
# Compression avec dictionnaire spécialisé
node bin/mml-cli.js compress --dict medical rapport-medical.mml
```

### Validation stricte

```bash
# Validation avec schéma JSON Schema
node bin/mml-cli.js validate --schema schema.json document.mml
```

### Métriques de qualité

```bash
# Analyse complète du document
node bin/mml-cli.js stats --detailed document.mml
```

## Intégration dans les workflows

### Éditeurs de texte

#### Vim/Neovim
```vim
" Mapping pour valider le fichier MML courant
nmap <leader>v :!node bin/mml-cli.js validate %<CR>

" Mapping pour convertir en HTML
nmap <leader>h :!node bin/mml-cli.js convert -f html % %:r.html<CR>
```

#### VS Code
```json
{
  "key": "ctrl+shift+v",
  "command": "workbench.action.terminal.sendSequence",
  "args": {
    "text": "node bin/mml-cli.js validate ${file}\n"
  }
}
```

### Scripts de build

#### Makefile
```makefile
.PHONY: validate convert clean

validate:
    @find . -name "*.mml" -exec node bin/mml-cli.js validate {} \;

convert:
    @find . -name "*.mml" -exec node bin/mml-cli.js convert -f html {} html/{}.html \;

clean:
    @rm -rf html/*.html
```

#### Git hooks
```bash
#!/bin/bash
# .git/hooks/pre-commit

# Valider tous les fichiers MML modifiés
for file in $(git diff --cached --name-only | grep '\.mml$'); do
  if ! node bin/mml-cli.js validate "$file" >/dev/null 2>&1; then
    echo "Erreur de validation MML: $file"
    exit 1
  fi
done
```

## Dépannage

### Erreurs communes

#### "Commande inconnue"
```bash
# Erreur
node bin/mml-cli.js unknown document.mml
# Commande inconnue 'unknown'

# Solution : utiliser une commande valide
node bin/mml-cli.js validate document.mml
```

#### "Fichier introuvable"
```bash
# Erreur
node bin/mml-cli.js validate fichier-inexistant.mml
# Fichier d'entrée introuvable: fichier-inexistant.mml

# Solution : vérifier le chemin du fichier
ls -la fichier-inexistant.mml
```

#### "Format non supporté"
```bash
# Erreur
node bin/mml-cli.js convert -f pdf document.mml
# Format de sortie non supporté: pdf

# Solution : utiliser un format supporté
node bin/mml-cli.js convert -f html document.mml
```

### Performance

Pour de gros documents, les CLI sont optimisés pour :
- **Traitement ligne par ligne** : Mémoire constante
- **Parsing paresseux** : Évaluation à la demande
- **Buffering intelligent** : Gestion efficace des E/S

### Debugging

Mode verbeux pour diagnostiquer les problèmes :
```bash
node bin/mml-cli.js validate -v document.mml
node bin/mml-cli.js convert -v -f html document.mml page.html
```

---

*Ces outils CLI rendent MML utilisable dans tous les environnements de développement et d'automatisation.*
