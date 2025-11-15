# Extension VS Code pour MML

Cette extension apporte un support complet pour le langage MML (Minimal Markup Language) dans Visual Studio Code.

## Fonctionnalités

### ✅ Coloration syntaxique
- **Balises MML** : `T:`, `H:`, `P:`, etc. mises en évidence
- **Balises MMLC** : Codes numériques `1:`, `2:`, etc.
- **Métadonnées** : Clés et valeurs distinguées
- **Liens** : URLs automatiquement détectées
- **Blocs de code** : Coloration selon le langage
- **Commentaires** : Lignes commençant par `#`

### ✅ Snippets intelligents
- **Structure complète** : Template de document MML
- **Rapports spécialisés** : Urgence, médical, technique
- **Balises individuelles** : Raccourcis pour chaque balise
- **MMLC** : Rappels des mappings de compression

### ✅ Commandes intégrées
- **Validation MML** : Vérification syntaxique
- **Conversion HTML** : Aperçu instantané
- **Compression MMLC** : Optimisation rapide

### ✅ Support complet
- **Auto-complétion** : Suggestions contextuelles
- **Navigation** : Pliage des sections
- **Vérification** : Détection d'erreurs de syntaxe

## Installation

### Méthode 1 : Depuis VS Code
1. Ouvrir VS Code
2. `Ctrl+Shift+P` → "Extensions: Install from VSIX"
3. Sélectionner le fichier `.vsix` de l'extension

### Méthode 2 : Développement local
1. Cloner ce dépôt
2. Ouvrir dans VS Code
3. `F5` pour lancer en mode debug
4. Tester l'extension dans la nouvelle fenêtre

### Méthode 3 : Compilation manuelle
```bash
npm install
npm run compile
code --install-extension mml-lang-support-1.0.0.vsix
```

## Utilisation

### Fichiers reconnus
L'extension s'active automatiquement pour les fichiers :
- `.mml` - Documents MML standard
- `.mmlc` - Documents MML compressés

### Snippets disponibles

#### Structure de base
Tapez `mmldoc` pour insérer un document complet :
```
T:Titre du document
M:Auteur|Auteur
M:Version|1.0
M:Date|2025-11-15

H:Introduction
P:Contenu de l'introduction

H:Section principale
P:Contenu de la section
```

#### Rapports spécialisés
- `urgence` : Template pour rapports d'urgence
- `medical` : Structure pour rapports médicaux
- `techdoc` : Documentation technique

#### Balises rapides
- `title` → `T:Titre`
- `section` → `H:Section`
- `para` → `P:Paragraphe`
- `meta` → `M:Clé|Valeur`
- `link` → `L:Texte|URL`
- `img` → `IMG:Description|image.png`
- `quote` → `Q:Citation`
- `code` → Bloc de code
- `config` → Section de configuration

### Commandes

#### Validation
`Ctrl+Shift+P` → "MML: Validate MML Document"
- Vérifie la syntaxe du document courant
- Affiche les erreurs dans le panneau Problèmes

#### Conversion HTML
`Ctrl+Shift+P` → "MML: Convert to HTML"
- Génère un aperçu HTML
- Ouvre dans le navigateur par défaut

#### Compression
`Ctrl+Shift+P` → "MML: Compress to MMLC"
- Compresse le document courant
- Crée un fichier `.mmlc` associé

## Configuration

### Paramètres utilisateur
```json
{
  "mml.validateOnSave": true,
  "mml.autoCompress": false,
  "mml.htmlPreview": true,
  "mml.compressionLevel": "standard"
}
```

### Paramètres disponibles
- **validateOnSave** : Validation automatique à la sauvegarde
- **autoCompress** : Compression automatique des fichiers `.mml`
- **htmlPreview** : Aperçu HTML intégré
- **compressionLevel** : Niveau de compression (`minimal`, `standard`, `aggressive`)

## Fonctionnalités avancées

### Validation en temps réel
- **Erreurs de syntaxe** : Détectées instantanément
- **Balises manquantes** : Suggestions automatiques
- **Format incorrect** : Corrections proposées

### Navigation intelligente
- **Pliage de sections** : `Ctrl+Shift+[` / `Ctrl+Shift+]`
- **Navigation par symbole** : `Ctrl+Shift+O`
- **Aller à la définition** : `F12` sur les références

### Intégration Git
- **Diff amélioré** : Comparaison visuelle des modifications
- **Blame** : Attribution des modifications par ligne
- **Historique** : Suivi des changements de structure

## Personnalisation

### Thèmes de couleur
L'extension supporte tous les thèmes VS Code et propose des couleurs spécifiques :

```json
{
  "editor.tokenColorCustomizations": {
    "[Mon thème]": {
      "textMateRules": [
        {
          "scope": "entity.name.tag.mml",
          "settings": {
            "foreground": "#569CD6",
            "fontStyle": "bold"
          }
        },
        {
          "scope": "string.quoted.mml",
          "settings": {
            "foreground": "#CE9178"
          }
        }
      ]
    }
  }
}
```

### Raccourcis clavier personnalisés
```json
{
  "keybindings": [
    {
      "key": "ctrl+shift+m",
      "command": "mml.validate",
      "when": "resourceExtname == .mml"
    },
    {
      "key": "ctrl+shift+h",
      "command": "mml.convertToHtml",
      "when": "resourceExtname == .mml"
    }
  ]
}
```

## Développement

### Structure de l'extension
```
vscode-extension/
├── package.json          # Manifest de l'extension
├── language-configuration.json  # Configuration du langage
├── syntaxes/
│   └── mml.tmLanguage.json      # Grammaire TextMate
├── snippets/
│   └── mml.json                 # Snippets utilisateur
└── src/
    └── extension.ts             # Code TypeScript principal
```

### Contribution
1. Forker le dépôt
2. Créer une branche feature
3. Commiter les modifications
4. Créer une Pull Request

### Tests
```bash
npm run test
npm run test:coverage
```

## Dépannage

### Problèmes courants

#### Coloration syntaxique absente
- Vérifier que le fichier a l'extension `.mml`
- Redémarrer VS Code
- Recharger la fenêtre : `Ctrl+Shift+P` → "Developer: Reload Window"

#### Snippets non disponibles
- Vérifier la version de VS Code (≥ 1.74.0)
- Désactiver/reactiver l'extension
- Vider le cache des snippets

#### Commandes non fonctionnelles
- Installer les dépendances Node.js
- Compiler l'extension : `npm run compile`
- Vérifier les logs : `Ctrl+Shift+P` → "Developer: Show Logs"

### Logs de diagnostic
```bash
# Afficher les logs de l'extension
Ctrl+Shift+P → "Developer: Show Logs" → "Extension Host"
```

### Rapport de bug
Pour signaler un problème :
1. `Ctrl+Shift+P` → "Developer: Show Logs"
2. Copier les logs pertinents
3. Créer une issue sur GitHub avec :
   - Version de VS Code
   - Version de l'extension
   - Système d'exploitation
   - Description du problème
   - Logs de l'extension

## Roadmap

### Version 1.1
- [ ] Support MMLC amélioré
- [ ] Validation JSON Schema intégrée
- [ ] Aperçu HTML en temps réel
- [ ] Export vers autres formats

### Version 1.2
- [ ] Débogage intégré
- [ ] Tests unitaires dans l'IDE
- [ ] Intégration avec l'API MML
- [ ] Thèmes spécialisés

### Version 2.0
- [ ] Éditeur graphique
- [ ] Collaboration en temps réel
- [ ] Plugins tiers
- [ ] Support IA pour génération

---

**Cette extension fait de VS Code l'IDE de référence pour travailler avec des documents MML, offrant productivité et fiabilité maximales.**
