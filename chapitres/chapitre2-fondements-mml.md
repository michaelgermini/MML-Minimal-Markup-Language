# Chapitre 2 — Fondements du MML

## 2.1 Définition formelle du MML

### Définition académique

Le **MML (Minimal Markup Language)** est un langage de balisage déclaratif conçu pour la sérialisation, la transmission et l'archivage de documents structurés dans des environnements contraints.

**Propriétés formelles** :
- **Langage de type L1** : Linéaire et séquentiel
- **Grammaire régulière** : Parsable par automates finis
- **Sémantique déclarative** : Focus sur le "quoi" plutôt que le "comment"
- **Tolérance aux erreurs** : Fonctionnement partiel possible

### Définition pratique

**Le MML est un format texte où chaque ligne représente un élément de contenu précédé d'une balise courte.**

```
T:Titre du document
H:Section principale
P:Paragraphe de contenu
```

**Equivalent conceptuel** :
```xml
<document>
  <title>Titre du document</title>
  <section>Section principale</section>
  <paragraph>Paragraphe de contenu</paragraph>
</document>
```

## 2.2 Objectifs principaux : universalité, robustesse, simplicité

### L'universalité comme objectif central

#### Universalité de transmission

Le MML doit pouvoir être transmis par **tous les moyens imaginables** :

1. **Transmission électronique** :
   - Réseaux informatiques (HTTP, Bluetooth, radio numérique)
   - Stockage fichiers (disques, cartes mémoire)

2. **Transmission humaine** :
   - Dictée orale (radio, téléphone)
   - Code Morse (télégraphe, lumière, son)
   - Écriture manuelle (papier, tableaux noirs)

3. **Transmission mécanique** :
   - Signaux lumineux (lampes, lasers)
   - Signaux sonores (cloches, sifflets)
   - Signaux physiques (drapeaux, sémaphores)

#### Universalité d'interprétation

Le MML doit être **compréhensible par** :
- **Humains** : Lecteurs alphabétisés sans formation technique
- **Machines** : Parseurs simples (microcontrôleurs, vieux ordinateurs)
- **Systèmes hybrides** : Combinaisons homme-machine

### La robustesse comme garantie de fiabilité

#### Robustesse structurelle

**Principe** : Un document MML reste partiellement utilisable même endommagé.

**Exemple de résilience** :

Document original :
```
T:Rapport météo
H:Prévisions
M:Température|25°C
M:Vent|15 km/h
P:Beau temps attendu
```

Document endommagé (lignes mélangées, caractères corrompus) :
```
M:Température|25°C
H:Prévisions
P:Beau temps attendu
M:Vent|1? km/h
T:Rapport météo
```

**Résultat** : L'information essentielle est préservée malgré les dommages.

#### Robustesse temporelle

**Principe** : Un document MML créé aujourd'hui doit rester lisible dans 50 ans.

**Garanties** :
- Syntaxe stable et minimaliste
- Aucun dépendance externe
- Encodage texte universel (UTF-8)
- Sémantique claire et pérenne

### La simplicité comme stratégie

#### Simplicité d'apprentissage

**Courbe d'apprentissage** :
- **5 minutes** : Comprendre la syntaxe de base
- **1 heure** : Maîtriser toutes les balises
- **1 jour** : Créer des documents complexes

#### Simplicité d'implémentation

**Parser MML minimal en Python** :
```python
def parse_mml(text):
    lines = text.strip().split('\n')
    document = {'nodes': []}

    for line in lines:
        if ':' in line:
            tag, content = line.split(':', 1)
            document['nodes'].append({
                'tag': tag.strip(),
                'content': content.strip()
            })

    return document
```

**Parser MML minimal en JavaScript** :
```javascript
function parseMML(text) {
  return text.trim().split('\n')
    .filter(line => line.includes(':'))
    .map(line => {
      const [tag, content] = line.split(':', 2);
      return { tag: tag.trim(), content: content.trim() };
    });
}
```

## 2.3 Le MML comme langage de sérialisation

### Sérialisation vs autres approches

#### Comparaison avec la sérialisation binaire

**Avantages de la sérialisation binaire** :
- Taille compacte
- Vitesse de traitement
- Structure fixe et prévisible

**Avantages de la sérialisation MML** :
- Lisibilité humaine
- Résilience aux corruptions
- Transmission par canaux texte
- Débogage facile

#### Exemple concret : Configuration système

**Format binaire** : 45 octets, illisible
**Format JSON** : 128 caractères, verbeux
**Format MML** : 67 caractères, lisible

```
CFG:Interface réseau
M:IP|192.168.1.100
M:Masque|255.255.255.0
M:Passerelle|192.168.1.1
M:DNS|8.8.8.8
```

### Applications de sérialisation

#### 1. Configuration d'équipements
```
CFG:Routeur WiFi
M:SSID|ReseauSecurise
M:MotDePasse|ChangementRequis
M:Canal|6
M:Chiffrement|WPA3
```

#### 2. Données de capteurs IoT
```
PKT:Capteur température
M:ID|sensor_01
M:Valeur|23.5
M:Unité|Celsius
M:Timestamp|2025-11-15T14:30:00Z
```

#### 3. Messages système
```
T:Alerte système
M:Niveau|CRITIQUE
M:Composant|Base de données
M:Message|Connexion perdue
M:Action|Redémarrage automatique
```

## 2.4 Pourquoi un format strict mais lisible ?

### L'équilibre délicat

#### Trop strict : Les problèmes des formats rigides

**Exemple JSON** :
```json
{
  "title": "Document",
  "content": "Texte"
}
```

**Problèmes** :
- Impossibilité d'ajouter des commentaires
- Virgules obligatoires
- Guillemets partout
- Structure arborescente figée

#### Trop lâche : Les problèmes des formats libres

**Exemple Markdown** :
```
# Titre

Paragraphe avec **gras** et *italique*.

- Liste 1
- Liste 2
```

**Problèmes** :
- Ambiguïtés d'interprétation
- Extensions multiples incompatibles
- Parsers complexes
- Résilience limitée

#### L'approche MML : Strict mais humain

**Principe** : Règles claires, minimales, mais suffisantes pour éviter toute ambiguïté.

**Règles strictes du MML** :
1. Une balise par ligne
2. Séparateur `:` obligatoire
3. Pas d'imbrication complexe
4. Encodage UTF-8

**Avantages** :
- Parsing déterministe
- Résilience maximale
- Lisibilité humaine
- Simplicité d'implémentation

## 2.5 Les contraintes de conception (Morse, radio, DNF, fragmentation)

### Contrainte 1 : Optimisation pour le Morse

#### Alphabet Morse limité

Le Morse n'utilise que :
- `.` (point) : signal court
- `-` (trait) : signal long
- `/` (barre) : séparation lettres
- ` ` (espace) : séparation mots

**Lettre la plus courte** : E (.)
**Lettre la plus longue** : J (·---)

#### Impact sur le MML

**Choix des balises courtes** :
- `T:` (Titre) : - ....
- `H:` (Header) : .... .... (plus court que `HEADER:`)
- `P:` (Paragraph) : .-- .

**Évitement des caractères problématiques** :
- Pas de parenthèses : difficiles en Morse
- Pas de crochets : confusion possible
- Utilisation du `|` pour séparer les valeurs

### Contrainte 2 : Transmission radio

#### Caractéristiques de la transmission vocale

**Facteurs limitants** :
- Bruit de fond
- Accent des opérateurs
- Fatigue
- Stress

**Solutions MML** :
- Balises phonétiques courtes
- Séparation claire (`:`)
- Mots entiers prononçables
- Répétition tolérée

#### Exemple de transmission

**Opérateur A** : "Tango deux points Rapport urgence"
**Opérateur B** : "T reçu"
**Opérateur A** : "Hotel deux points Secteur Alpha"
**Opérateur B** : "H reçu"

### Contrainte 3 : Intégration DNF

#### Qu'est-ce que le DNF ?

Le DNF (Digital Network Fragment) est un protocole de transport qui :
- Divise les messages en fragments de taille fixe
- Transporte les fragments indépendamment
- Reconstitue le message original
- Tolère les pertes partielles

#### Adaptation du MML au DNF

**Structure par lignes** : Chaque ligne MML est un fragment naturel
```
T:Rapport urgence
H:Secteur Alpha
M:Victimes|12
```

**Devient en DNF** :
- Fragment 1: "T:Rapport urgence"
- Fragment 2: "H:Secteur Alpha"
- Fragment 3: "M:Victimes|12"

**Avantage** : Reconstruction possible même si fragments mélangés ou perdus.

### Contrainte 4 : Résilience à la fragmentation

#### Types de fragmentation

1. **Fragmentation réseau** : Paquets IP perdus
2. **Fragmentation physique** : Pages déchirées
3. **Fragmentation temporelle** : Messages interrompus
4. **Fragmentation humaine** : Erreurs de transmission

#### Stratégies de résilience

**Règles de conception MML** :
- Chaque ligne = unité d'information complète
- Pas de dépendance entre lignes
- Reconstruction possible dans n'importe quel ordre
- Informations redondantes tolérées

## 2.6 Les principes architecturaux du MML

### Principe 1 : La ligne comme unité atomique

#### Définition
Chaque ligne MML contient une information complète et indépendante.

#### Avantages
- Reconstruction facile après fragmentation
- Parsing ligne par ligne possible
- Débogage simplifié
- Transmission asynchrone

#### Implémentation
```javascript
function processMMLLine(line) {
  const [tag, content] = line.split(':', 2);
  return {
    tag: tag.trim(),
    content: content.trim(),
    valid: tag.length > 0 && content.length > 0
  };
}
```

### Principe 2 : Séparation claire signal/bruit

#### Métriques de qualité

**Rapport signal/bruit optimal** :
- **Signal** : Information utile (contenu du document)
- **Bruit** : Caractères de syntaxe (balises, séparateurs)

**MML** : Rapport ~80% (signal très élevé)
**XML** : Rapport ~50% (beaucoup de balises)
**JSON** : Rapport ~70% (guillemets et structure)

### Principe 3 : Extension contrôlée

#### Philosophie
N'ajouter une nouvelle balise que si :
1. Elle couvre un besoin universel
2. Elle ne peut pas être exprimée avec des balises existantes
3. Elle reste simple et courte

#### Processus d'extension
1. **Proposition** : Description du besoin
2. **Validation** : Test dans environnements réels
3. **Implémentation** : Ajout au standard
4. **Rétrocompatibilité** : Pas de breaking changes

### Principe 4 : Design pour l'échec

#### Acceptation de l'imperfection

**Principe** : Un système imparfait qui fonctionne est préférable à un système parfait qui échoue.

**Implémentations MML** :
- **Graceful degradation** : Fonctionne partiellement endommagé
- **Best effort parsing** : Ignore les lignes invalides
- **Recovery mechanisms** : Reconstruction à partir de fragments

### Vision architecturale globale

Le MML n'est pas conçu comme un langage de programmation complexe ou un système de base de données sophistiqué. C'est un **protocole de communication fondamental** qui place la **fiabilité** et l'**accessibilité** au-dessus de la **puissance expressive**.

Dans un monde où les systèmes complexes échouent régulièrement, le MML offre une garantie simple mais essentielle : **l'information circulera, même dans les conditions les plus difficiles**.

---

**Conclusion du chapitre** : Les fondements du MML ne sont pas des choix arbitraires mais des réponses rationnelles aux contraintes réelles de la communication dans les environnements extrêmes. Chaque décision architecturale sert un objectif précis : maximiser la résilience tout en préservant la simplicité et l'universalité.
