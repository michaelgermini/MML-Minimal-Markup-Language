# Chapitre 8 — Convertisseurs MML

## 8.1 MML → HTML

### Conversion vers le web moderne

#### Objectif
Transformer un document MML en page HTML standard pour l'affichage web.

#### Mapping sémantique
- **T:** → `<h1>`
- **H:** → `<h2>`, `<h3>`, etc.
- **P:** → `<p>`
- **L:** → `<a href>`
- **IMG:** → `<img src>`
- **M:** → `<meta>` ou attributs `data-`
- **Q:** → `<blockquote>`

#### Exemple de conversion

**MML** :
```
T:Guide de survie
H:Alimentation
P:En situation de survie, l'eau est plus importante que la nourriture.
L:Guide complet|https://survie.org
```

**HTML généré** :
```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Guide de survie</title>
</head>
<body>
    <h1>Guide de survie</h1>
    <h2>Alimentation</h2>
    <p>En situation de survie, l'eau est plus importante que la nourriture.</p>
    <p><a href="https://survie.org">Guide complet</a></p>
</body>
</html>
```

### Implémentation JavaScript

```javascript
class MMLToHTMLConverter {
  convert(mmlText) {
    const dom = this.parseMML(mmlText);
    return this.generateHTML(dom);
  }

  generateHTML(dom) {
    let html = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>${this.escapeHTML(dom.title || 'Document MML')}</title>
</head>
<body>`;

    if (dom.title) {
      html += `<h1>${this.escapeHTML(dom.title)}</h1>`;
    }

    for (const section of dom.sections) {
      html += `<h2>${this.escapeHTML(section.title)}</h2>`;
      for (const child of section.children) {
        html += this.convertNodeToHTML(child);
      }
    }

    html += '</body></html>';
    return html;
  }

  convertNodeToHTML(node) {
    switch (node.type) {
      case 'paragraph':
        return `<p>${this.escapeHTML(node.content)}</p>`;
      case 'link':
        return `<p><a href="${this.escapeHTML(node.url)}">${this.escapeHTML(node.text)}</a></p>`;
      case 'quote':
        return `<blockquote>${this.escapeHTML(node.content)}</blockquote>`;
      default:
        return `<p>${this.escapeHTML(node.content)}</p>`;
    }
  }

  escapeHTML(text) {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
}
```

## 8.2 MML → JSON

### Sérialisation structurée

#### Avantages
- **Intégration API** : Services web REST
- **Stockage base de données** : Documents NoSQL
- **Traitement algorithmique** : Analyse automatisée

#### Structure JSON générée
```json
{
  "type": "document",
  "title": "Guide de survie",
  "metadata": {
    "author": "Équipe survie",
    "version": "1.0"
  },
  "sections": [
    {
      "title": "Alimentation",
      "metadata": {},
      "children": [
        {
          "type": "paragraph",
          "content": "L'eau est essentielle"
        }
      ]
    }
  ]
}
```

## 8.3 MML → texte brut

### Extraction de contenu lisible

#### Usage
- **Impression** : Documents papier
- **Archivage** : Texte simple
- **Accessibilité** : Lecteurs d'écran

#### Format de sortie
```
GUIDE DE SURVIE
================

ALIMENTATION
------------
L'eau est essentielle pour la survie humaine.

RESSOURCES
----------
- Guide complet : https://survie.org
```

## 8.4 MML → Morse

### Traduction pour transmission radio

#### Mapping Morse
- **T:** → - (Titre)
- **H:** → .... (Header)
- **P:** → .--. (Paragraph)
- **Espace** → / (séparation mots)

#### Exemple
**MML** : `T:Alerte P:Évacuez`

**Morse** : `- / .- .-.. . .-./ .--. / . ...- .- -.-. ..- .--..`

## 8.5 MML → DNF

### Empaquetage pour transport

#### Génération automatique
Chaque ligne MML devient un fragment DNF avec en-tête.

#### Format
```
DNF:SEQ=1:TOTAL=5:ID=MSG-001
T:Alerte sécurité

DNF:SEQ=2:TOTAL=5:ID=MSG-001
H:Zone compromise

DNF:SEQ=3:TOTAL=5:ID=MSG-001
M:Gravité|Critique
```

## 8.6 Interpréteurs embarqués ultra-légers

### MML sur microcontrôleurs

#### Contraintes
- **RAM** : 2-64 KB
- **Flash** : 32-512 KB
- **CPU** : 8-32 MHz

#### Implémentation Arduino
```cpp
class MMLParser {
private:
  char buffer[256];
  int bufferPos = 0;

public:
  void parse(char* mmlText) {
    char* line = strtok(mmlText, "\n");
    while (line != NULL) {
      parseLine(line);
      line = strtok(NULL, "\n");
    }
  }

  void parseLine(char* line) {
    char* colonPos = strchr(line, ':');
    if (colonPos != NULL) {
      *colonPos = '\0'; // Séparer tag et contenu
      char* tag = line;
      char* content = colonPos + 1;

      // Traiter selon le tag
      if (strcmp(tag, "T") == 0) {
        Serial.print("Titre: ");
        Serial.println(content);
      } else if (strcmp(tag, "P") == 0) {
        Serial.print("Para: ");
        Serial.println(content);
      }
      // ... autres tags
    }
  }
};
```

### Applications IoT

#### Capteurs transmettant MML
- **Température** : `M:Temp|23.5°C`
- **Humidité** : `M:Hum|65%`
- **Batterie** : `M:Bat|78%`

#### Réseau de capteurs
```
PKT:SENSOR-NET-001
T:Données environnementales
M:Station|EXT-01
M:Temp|22.3
M:Hum|67
M:Pression|1013.2
END
```

## 8.7 Librairies et implémentations (JS, Python, PHP, C)

### Écosystème de développement

#### JavaScript/Node.js
- **mml-parser** : Parser complet avec DOM
- **mml-to-html** : Convertisseur web
- **mml-dnf** : Intégration réseau

#### Python
```python
from mml_parser import MMLParser

parser = MMLParser()
document = parser.parse("""
T:Rapport
H:Section 1
P:Contenu
""")

print(document.title)  # "Rapport"
print(document.sections[0].title)  # "Section 1"
```

#### PHP (applications web)
```php
$mml = new MMLConverter();
$html = $mml->toHTML($mmlContent);
echo $html; // Affiche la page HTML
```

#### C (systèmes embarqués)
- **LibMML** : Bibliothèque lightweight
- **Pas de dépendances** : Fonctionne sans OS
- **Mémoire fixe** : Prédictible

### Outils de développement

#### Validation en ligne
Interface web pour tester et valider des documents MML.

#### Générateurs automatiques
- **IA → MML** : Conversion automatique depuis texte naturel
- **MML → Diagrammes** : Génération de schémas
- **MML → PDF** : Documents imprimables

---

**Conclusion du chapitre** : Les convertisseurs MML ouvrent le format à tous les écosystèmes existants. Qu'il s'agisse d'afficher un document sur le web, de l'intégrer dans une API REST, ou de le traiter sur un microcontrôleur, le MML peut être transformé dans le format cible sans perte d'information. Cette interopérabilité universelle fait du MML bien plus qu'un format de stockage – c'est un protocole de communication transversale.
