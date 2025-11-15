# Chapitre 4 — Le DOM MML

## 4.1 Pourquoi un DOM pour un langage minimal ?

### Au-delà du texte brut

Le MML, malgré sa syntaxe simple, doit pouvoir être traité de manière structurée par les programmes informatiques. Le **DOM MML** (Document Object Model) fournit cette structure logique.

#### Problématique
Un document MML est initialement un flux de texte :
```
T:Mon document
H:Section 1
P:Contenu
```

**Besoin** : Transformer ce flux en structure exploitable par les programmes.

#### Solution : Le DOM MML
Une représentation arborescente du document qui :
- Respecte la sémantique des balises
- Permet la navigation programmatique
- Facilite les transformations (HTML, JSON, etc.)
- Supporte la validation et les requêtes

### Avantages du DOM structuré

#### 1. Traitement programmatique
```javascript
// Accès aux éléments par type
const titles = dom.querySelectorAll('T');
const sections = dom.querySelectorAll('H');
```

#### 2. Transformations automatiques
```javascript
// Conversion MML → HTML
const html = dom.toHTML();
// Conversion MML → JSON
const json = dom.toJSON();
```

#### 3. Validation sémantique
```javascript
// Vérification de structure
const isValid = dom.validate();
```

## 4.2 Construction d'un arbre logique

### Principe de construction

#### Algorithme de base
1. **Parser ligne par ligne** le document MML
2. **Créer un nœud** pour chaque élément valide
3. **Établir la hiérarchie** basée sur les types de balises
4. **Gérer les métadonnées** comme attributs des nœuds

#### Exemple de transformation

**Document MML** :
```
T:Guide de survie
M:Auteur|John Doe
H:Chapitre 1
P:Introduction au sujet
H:Chapitre 2
P:Contenu du chapitre 2
```

**Arbre DOM résultant** :
```
Document
├── title: "Guide de survie"
├── metadata:
│   └── author: "John Doe"
├── sections:
│   ├── Section 1
│   │   ├── title: "Chapitre 1"
│   │   └── content: "Introduction au sujet"
│   └── Section 2
│       ├── title: "Chapitre 2"
│       └── content: "Contenu du chapitre 2"
```

### Hiérarchie implicite vs explicite

#### Hiérarchie implicite du MML
La structure est déterminée par l'ordre et les types de balises :
- **T:** → Racine du document
- **H:** → Sections de niveau 1
- **P:** → Contenu des sections
- **M:** → Métadonnées associées

#### Construction de l'arbre
```javascript
class MMLDOMBuilder {
  constructor() {
    this.document = { type: 'document', children: [] };
    this.currentSection = null;
  }

  addNode(tag, content) {
    const node = { type: tag.toLowerCase(), content };

    switch(tag) {
      case 'T':
        this.document.title = content;
        break;
      case 'H':
        this.currentSection = { type: 'section', title: content, children: [] };
        this.document.children.push(this.currentSection);
        break;
      case 'P':
        if (this.currentSection) {
          this.currentSection.children.push({ type: 'paragraph', content });
        }
        break;
      case 'M':
        const [key, value] = content.split('|', 2);
        this.document.metadata = this.document.metadata || {};
        this.document.metadata[key.trim()] = value.trim();
        break;
    }
  }
}
```

## 4.3 Parallèles avec HTML / XML / JSON DOM

### Comparaison avec le DOM HTML

#### DOM HTML traditionnel
```html
<!DOCTYPE html>
<html>
<head><title>Mon titre</title></head>
<body>
  <h1>Section 1</h1>
  <p>Paragraphe 1</p>
  <h1>Section 2</h1>
  <p>Paragraphe 2</p>
</body>
</html>
```

**Structure arborescente rigide** avec imbrication explicite.

#### DOM MML équivalent
```
T:Mon titre
H:Section 1
P:Paragraphe 1
H:Section 2
P:Paragraphe 2
```

**Structure arborescente reconstruite** à partir d'un flux plat.

### Comparaison avec XML DOM

#### XML avec structure explicite
```xml
<document>
  <title>Mon titre</title>
  <section>
    <title>Section 1</title>
    <paragraph>Paragraphe 1</paragraph>
  </section>
</document>
```

#### MML avec structure implicite
```
T:Mon titre
H:Section 1
P:Paragraphe 1
```

**Résultat DOM identique**, mais syntaxe MML 60% plus concise.

### Comparaison avec JSON

#### JSON structurel rigide
```json
{
  "title": "Mon titre",
  "sections": [
    {
      "title": "Section 1",
      "content": "Paragraphe 1"
    }
  ]
}
```

#### MML plus flexible
Le DOM MML permet :
- **Ajout dynamique** de propriétés
- **Métadonnées extensibles**
- **Structure adaptable** selon les besoins

## 4.4 Détection des sections

### Algorithme de reconstruction hiérarchique

#### Règles de hiérarchie

1. **Les H: créent de nouvelles sections**
2. **Les P: appartiennent à la section H: précédente**
3. **Les M: peuvent être globales ou associées à la section courante**
4. **Les L: et autres éléments sont contextuels**

#### Exemple complexe

**Document MML** :
```
T:Manuel technique
M:Auteur|Équipe technique
H:Installation
M:Durée|2 heures
P:Prérequis système
P:Procédure d'installation
H:Configuration
P:Paramètres de base
H:Sécurité
M:Niveau|Avancé
P:Configuration SSL
```

**Hiérarchie reconstruite** :
```
Manuel technique
├── Métadonnées globales: Auteur
├── Section: Installation
│   ├── Métadonnées: Durée
│   ├── Paragraphe: Prérequis système
│   └── Paragraphe: Procédure d'installation
├── Section: Configuration
│   └── Paragraphe: Paramètres de base
└── Section: Sécurité
    ├── Métadonnées: Niveau
    └── Paragraphe: Configuration SSL
```

### Gestion des sections imbriquées

#### Problème des sous-sections
Le MML n'a qu'une seule balise H:, comment gérer les niveaux hiérarchiques ?

#### Solutions
1. **Convention de nommage** : "Chapitre 1", "Section 1.1"
2. **Analyse sémantique** : Détection automatique des niveaux
3. **Métadonnées explicites** : M:Niveau|2

#### Exemple de sous-sections
```
H:Chapitre 1 : Les bases
H:Section 1.1 : Introduction
H:Section 1.2 : Concepts fondamentaux
H:Chapitre 2 : Applications avancées
```

## 4.5 Arbre hiérarchique reconstruit depuis un flux plat

### Algorithme de reconstruction complet

#### Implémentation JavaScript
```javascript
class MMLParser {
  constructor() {
    this.reset();
  }

  reset() {
    this.dom = {
      type: 'document',
      metadata: {},
      sections: []
    };
    this.currentSection = null;
    this.sectionStack = [];
  }

  parse(text) {
    this.reset();
    const lines = text.split('\n');

    for (const line of lines) {
      const node = this.parseLine(line.trim());
      if (node) {
        this.addNode(node);
      }
    }

    return this.dom;
  }

  parseLine(line) {
    if (!line || !line.includes(':')) return null;

    const [tag, content] = line.split(':', 2);
    return {
      tag: tag.trim().toUpperCase(),
      content: content.trim()
    };
  }

  addNode(node) {
    switch(node.tag) {
      case 'T':
        this.dom.title = node.content;
        break;

      case 'M':
        const [key, value] = node.content.split('|', 2);
        const metadata = this.currentSection ?
          (this.currentSection.metadata = this.currentSection.metadata || {}) :
          this.dom.metadata;
        metadata[key.trim()] = value ? value.trim() : '';
        break;

      case 'H':
        const section = {
          type: 'section',
          title: node.content,
          metadata: {},
          children: []
        };
        this.dom.sections.push(section);
        this.currentSection = section;
        break;

      case 'P':
        if (this.currentSection) {
          this.currentSection.children.push({
            type: 'paragraph',
            content: node.content
          });
        }
        break;

      case 'L':
        const [linkText, linkUrl] = node.content.split('|', 2);
        const linkNode = {
          type: 'link',
          text: linkText.trim(),
          url: linkUrl ? linkUrl.trim() : ''
        };

        if (this.currentSection) {
          this.currentSection.children.push(linkNode);
        } else {
          // Lien global
          this.dom.links = this.dom.links || [];
          this.dom.links.push(linkNode);
        }
        break;

      // Gestion d'autres balises...
    }
  }
}
```

### Gestion des erreurs et résilience

#### Lignes invalides
Les lignes qui ne suivent pas le format TAG:contenu sont ignorées silencieusement.

#### Récupération d'erreurs
- Documents partiellement corrompus restent exploitables
- Sections incomplètes sont préservées
- Métadonnées orphelines sont attachées au document global

## 4.6 Résilience aux pertes de lignes

### Test de robustesse

#### Scénario : Perte de 30% des lignes
**Document original** :
```
T:Rapport urgence
H:Secteur A
M:Victimes|5
P:État stable
H:Secteur B
M:Victimes|3
P:Besoin renforts
```

**Après pertes** :
```
T:Rapport urgence
H:Secteur A
P:État stable
H:Secteur B
P:Besoin renforts
```

**DOM reconstruit** : Fonctionnel malgré les pertes de métadonnées.

#### Scénario : Lignes mélangées
**Ordre perturbé** :
```
H:Secteur B
T:Rapport urgence
P:État stable
H:Secteur A
P:Besoin renforts
```

**Reconstruction** : Le parser peut réorganiser logiquement le contenu.

### Stratégies de résilience

#### 1. Validation lâche
Accepter les documents incomplets plutôt que les rejeter.

#### 2. Reconstruction heuristique
Utiliser des règles pour rattacher les éléments orphelins.

#### 3. Métadonnées redondantes
Répéter les informations importantes dans plusieurs formats.

## 4.7 Définition formelle des nœuds du DOM

### Schéma des nœuds de base

#### Nœud Document
```javascript
{
  type: "document",
  title: string,
  metadata: {[key: string]: string},
  sections: Section[],
  links: Link[]
}
```

#### Nœud Section
```javascript
{
  type: "section",
  title: string,
  metadata: {[key: string]: string},
  children: (Paragraph | Link | Image | Code | Quote)[]
}
```

#### Nœuds de contenu
```javascript
// Paragraphe
{
  type: "paragraph",
  content: string
}

// Lien
{
  type: "link",
  text: string,
  url: string
}

// Image
{
  type: "image",
  description: string,
  url: string
}

// Code
{
  type: "code",
  content: string,
  language?: string
}

// Citation
{
  type: "quote",
  content: string
}
```

### Extensions du schéma

#### Nœuds spécialisés
```javascript
// Configuration
{
  type: "configuration",
  section: string,
  parameters: {[key: string]: string}
}

// Paquet DNF
{
  type: "packet",
  id: string,
  children: MMLNode[]
}
```

## 4.8 Exemple complet de DOM MML en JSON

### Document MML d'exemple

```
T:Guide de premiers secours
M:Auteur|Croix-Rouge
M:Version|2.1
M:Dernière révision|2025-11-15

H:Arrêt cardiaque
M:Gravité|Critique
P:En cas d'arrêt cardiaque, agir immédiatement.
P:1. Vérifier la conscience
P:2. Appeler les secours
P:3. Commencer le massage cardiaque

Q:N'oubliez pas : persistez jusqu'à l'arrivée des secours

L:Vidéo démonstration|https://example.com/cpr-video
IMG:Schéma de massage|massage-cardiaque.png

H:Étouffement
P:Pour un adulte conscient :
P:1. Encourager la toux
P:2. Si échec, donner 5 claques dans le dos
P:3. Alterner avec 5 compressions abdominales

C:# Code pour calculer la fréquence de massage
C:frequence = 100 // compressions par minute
C:profondeur = 5 // centimètres
```

### DOM JSON résultant

```json
{
  "type": "document",
  "title": "Guide de premiers secours",
  "metadata": {
    "Auteur": "Croix-Rouge",
    "Version": "2.1",
    "Dernière révision": "2025-11-15"
  },
  "sections": [
    {
      "type": "section",
      "title": "Arrêt cardiaque",
      "metadata": {
        "Gravité": "Critique"
      },
      "children": [
        {
          "type": "paragraph",
          "content": "En cas d'arrêt cardiaque, agir immédiatement."
        },
        {
          "type": "paragraph",
          "content": "1. Vérifier la conscience"
        },
        {
          "type": "paragraph",
          "content": "2. Appeler les secours"
        },
        {
          "type": "paragraph",
          "content": "3. Commencer le massage cardiaque"
        },
        {
          "type": "quote",
          "content": "N'oubliez pas : persistez jusqu'à l'arrivée des secours"
        },
        {
          "type": "link",
          "text": "Vidéo démonstration",
          "url": "https://example.com/cpr-video"
        },
        {
          "type": "image",
          "description": "Schéma de massage",
          "url": "massage-cardiaque.png"
        }
      ]
    },
    {
      "type": "section",
      "title": "Étouffement",
      "metadata": {},
      "children": [
        {
          "type": "paragraph",
          "content": "Pour un adulte conscient :"
        },
        {
          "type": "paragraph",
          "content": "1. Encourager la toux"
        },
        {
          "type": "paragraph",
          "content": "2. Si échec, donner 5 claques dans le dos"
        },
        {
          "type": "paragraph",
          "content": "3. Alterner avec 5 compressions abdominales"
        },
        {
          "type": "code",
          "content": "# Code pour calculer la fréquence de massage"
        },
        {
          "type": "code",
          "content": "frequence = 100 // compressions par minute"
        },
        {
          "type": "code",
          "content": "profondeur = 5 // centimètres"
        }
      ]
    }
  ],
  "links": []
}
```

---

**Conclusion du chapitre** : Le DOM MML transforme un simple flux de texte en structure logique exploitable par les programmes. Cette abstraction permet au MML de bénéficier des avantages d'un format structuré tout en conservant sa simplicité de transmission et sa résilience. Le DOM MML est la clé qui ouvre le MML au monde de la programmation moderne tout en préservant son essence minimaliste.
