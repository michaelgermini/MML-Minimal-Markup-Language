# Chapitre 3 — Syntaxe du MML

## 3.1 Structure générale d'un document

### Anatomie d'un document MML

Un document MML est composé de **lignes de texte** organisées selon une structure hiérarchique implicite.

#### Structure de base
```
T:Titre principal du document
H:Section de premier niveau
P:Paragraphe de contenu
H:Sous-section
P:Contenu de la sous-section
```

#### Équivalent conceptuel HTML
```html
<h1>Titre principal du document</h1>
<h2>Section de premier niveau</h2>
<p>Paragraphe de contenu</p>
<h2>Sous-section</h2>
<p>Contenu de la sous-section</p>
```

### Règles fondamentales de structure

#### Règle 1 : Un élément par ligne
Chaque ligne ne contient qu'un seul élément MML.

**Valide** :
```
T:Mon titre
P:Mon paragraphe
```

**Invalide** :
```
T:Mon titre P:Mon paragraphe
```

#### Règle 2 : Hiérarchie par position
La hiérarchie est déterminée par l'ordre d'apparition, pas par l'imbrication.

**Structure implicite** :
```
T:Document principal
H:Chapitre 1
P:Contenu chapitre 1
H:Chapitre 2
P:Contenu chapitre 2
```

#### Règle 3 : Encodage UTF-8
Tous les documents MML utilisent l'encodage UTF-8.

## 3.2 Règles de base (TAG:, ;, retours ligne)

### La syntaxe élémentaire

#### Format canonique
```
TAG:contenu
```

**Composants** :
- **TAG** : Balise courte (1-4 caractères)
- **:** : Séparateur obligatoire (deux points)
- **contenu** : Texte libre (peut être vide)

### Gestion des retours ligne

#### Règle des sauts de ligne
- Chaque élément occupe exactement une ligne
- Les lignes vides sont ignorées
- Le document se termine par un retour ligne optionnel

#### Exemple valide
```
T:Mon document
P:Ligne 1
P:Ligne 2

P:Ligne 4
```

### Gestion des espaces

#### Espaces significatifs
- **Avant le TAG** : Ignorés (indentation permise)
- **Après le :** : Ignorés
- **Dans le contenu** : Préservés

#### Exemples
```
  T:  Mon titre
P:   Contenu avec espaces
```

**Équivaut à** :
```
T:Mon titre
P:Contenu avec espaces
```

## 3.3 Jeu de caractères minimal (conçu pour Morse)

### Alphabet Morse et contraintes

#### Caractères Morse de base
- **Lettres** : A-Z (capitales uniquement)
- **Chiffres** : 0-9
- **Ponctuation limitée** : . , : ; - / | ?

#### Caractères exclus
- **Parenthèses** : ( ) [ ] { } → confusion en transmission orale
- **Symboles complexes** : @ # $ % & * → difficiles en Morse
- **Accents** : é è à → transmission complexe

### Adaptation du contenu

#### Stratégie d'encodage
Pour les caractères non-Morse, utiliser des équivalents :
- **é** → **e**
- **à** → **a**
- **ç** → **c**
- **œ** → **oe**

#### Exemple d'adaptation
**Texte original** : "État d'urgence à Paris"
**Version MML** : "Etat d urgence a Paris"

## 3.4 Les balises fondamentales

### T: — Titre (Title)

#### Usage
Définit le titre principal du document.

#### Syntaxe
```
T:Texte du titre
```

#### Exemples
```
T:Rapport d'urgence
T:Guide de survie
T:Inventaire médical
```

#### Règles
- Un seul T: par document (recommandé)
- Place en début de document
- Texte court et descriptif

### H: — Section / en-tête (Header)

#### Usage
Définit les sections et sous-sections du document.

#### Syntaxe
```
H:Texte de la section
```

#### Exemples
```
H:Introduction
H:Matériel requis
H:Procédure d'urgence
H:Chapitre 1 : Les bases
```

#### Hiérarchie implicite
La hiérarchie est déterminée par l'ordre d'apparition :
```
T:Manuel de survie
H:Chapitre 1
H:Section 1.1
H:Section 1.2
H:Chapitre 2
```

### P: — Paragraphe (Paragraph)

#### Usage
Contient le texte principal du document.

#### Syntaxe
```
P:Texte du paragraphe
```

#### Exemples
```
P:Ceci est un paragraphe de texte normal.
P:En cas d'urgence, suivez cette procédure.
P:Le patient présente les symptômes suivants.
```

#### Règles
- Texte peut être multiligne (mais reste sur une ligne physique)
- Pas de limitation de longueur
- Support des espaces et ponctuation

### L: — Lien (Link)

#### Usage
Crée des références vers d'autres ressources.

#### Syntaxe
```
L:Texte du lien|URL ou référence
```

#### Exemples
```
L:Consulter la carte|https://maps.example.com/sector-alpha
L:Manuel complet|manuel-survie.pdf
L:Coordonnées GPS|48.8566,2.3522
L:Contact radio|Fréquence 145.500 MHz
```

#### Formats supportés
- **URLs web** : http://, https://
- **Fichiers locaux** : .pdf, .doc, etc.
- **Coordonnées** : latitude,longitude
- **Fréquences radio** : MHz, kHz
- **Références internes** : autres documents MML

### IMG: — Image (Image)

#### Usage
Référence des images ou diagrammes.

#### Syntaxe
```
IMG:Description de l'image|URL ou chemin
```

#### Exemples
```
IMG:Carte du secteur|carte-secteur.png
IMG:Schéma électrique|schema-branchement.jpg
IMG:Diagramme de procédure|flowchart-process.svg
```

#### Règles
- Description obligatoire (accessibilité)
- Support des formats courants : PNG, JPG, SVG, GIF

### C: — Bloc de code (Code)

#### Usage
Présente du code informatique ou des commandes techniques.

#### Syntaxe
```
C:Contenu du code
```

#### Exemples
```
C:SELECT * FROM patients WHERE status = 'critical'
C:function backupData() { return database.save(); }
C:scp fichier.txt user@server:/backup/
```

#### Règles
- Préservation exacte des espaces et caractères spéciaux
- Pas d'échappement nécessaire (sauf pour :)

### Q: — Citation (Quote)

#### Usage
Marque du texte cité ou des informations importantes.

#### Syntaxe
```
Q:Texte de la citation
```

#### Exemples
```
Q:En cas d'urgence, restez calme et suivez les procédures établies.
Q:D'après le Dr. Smith : "La vaccination sauve des vies"
Q:Protocole standard : isoler, identifier, traiter
```

#### Usage spécial
Peut être utilisé pour les messages d'alerte ou les protocoles standard.

### M: — Métadonnée (Metadata)

#### Usage
Ajoute des informations structurées sur le document ou ses éléments.

#### Syntaxe
```
M:Clé|Valeur
```

#### Exemples
```
M:Auteur|Dr. Marie Dubois
M:Date|2025-11-15
M:Version|1.2
M:Priorité|CRITIQUE
M:ID|PATIENT-001
```

#### Règles
- Format clé-valeur avec séparateur |
- Clés en majuscules (convention)
- Valeurs peuvent contenir des espaces

### CFG: — Configuration (Configuration)

#### Usage
Définit des paramètres de configuration système.

#### Syntaxe
```
CFG:Section de configuration
M:Paramètre|Valeur
M:Paramètre2|Valeur2
```

#### Exemples
```
CFG:Paramètres réseau
M:IP|192.168.1.100
M:Masque|255.255.255.0
M:DNS|8.8.8.8

CFG:Paramètres radio
M:Fréquence|145.500
M:Mode|FM
M:Puissance|5W
```

### PKT: — Conteneur DNF (Packet)

#### Usage
Définit un conteneur pour les paquets DNF.

#### Syntaxe
```
PKT:Identifiant du paquet
[contenu du paquet]
```

#### Exemples
```
PKT:URGENCE-MEDICAL
T:Rapport médical d'urgence
H:Patient A
M:État|Critique
P:Nécessite évacuation immédiate
```

## 3.5 Les lignes multi-contenus

### Gestion du contenu complexe

#### Problème
Certains contenus nécessitent plusieurs valeurs ou options.

#### Solution MML
Utiliser le séparateur `|` pour les valeurs multiples.

#### Exemples
```
M:Coordonnées|48.8566|2.3522|Paris
L:Options|Option A|Option B|Option C
CFG:Backup|quotidien|7 jours|compressé
```

### Parsing des valeurs multiples

#### Fonction d'exemple
```javascript
function parseMultiValue(content) {
  return content.split('|').map(item => item.trim());
}

// Exemple
parseMultiValue("48.8566|2.3522|Paris")
// Résultat : ["48.8566", "2.3522", "Paris"]
```

## 3.6 Échapper et éviter ambiguïtés

### Caractères spéciaux dans le contenu

#### Problème
Le caractère `:` peut apparaître dans le contenu normal.

#### Solutions
1. **Contexte** : Le premier `:` d'une ligne sépare toujours TAG du contenu
2. **Échappement** : Doubler le `:` pour l'utiliser dans le contenu

#### Exemples
```
P:Heure : 14h30 (simple)
P:Format JSON : {"key": "value"} (nécessite attention)
```

#### Règle d'échappement
Si le contenu doit commencer par un TAG valide, utiliser l'échappement :
```
P:Voici un exemple : T:Titre dans le texte
```

### Gestion des barres verticales

#### Dans les métadonnées
La barre `|` sépare les composants des M:.

#### Échappement
Pour utiliser `|` dans le contenu :
```
M:Description|Texte avec \| caractère spécial
```

## 3.7 Exemples simples et avancés

### Exemple simple : Carte postale

```
T:Carte postale
M:De|Marie
M:À|Pierre
M:Lieu|Paris
P:Cher Pierre,
P:J'espère que tu vas bien. Paris est magnifique en cette saison.
P:Gros bisous,
P:Marie
```

### Exemple intermédiaire : Rapport d'incident

```
T:Rapport d'incident
M:ID|INC-2025-001
M:Date|2025-11-15
M:Lieu|Secteur Alpha
M:Gravité|CRITIQUE

H:Circonstances
P:À 14h30, explosion dans le secteur de stockage.
P:Cause probable : fuite de gaz.

H:Conséquences
P:2 blessés légers
P:Matériel endommagé : rack A3-A5
P:Évacuation du secteur en cours

H:Actions entreprises
P:Équipe médicale déployée
P:Sécurisation de la zone
P:Investigation en cours

L:Photos de l'incident|photos-incident.zip
L:Rapport technique détaillé|rapport-complet.pdf
```

### Exemple avancé : Configuration système complète

```
T:Configuration serveur de secours
M:Version|2.1
M:Dernière modification|2025-11-15T10:30:00Z

CFG:Réseau principal
M:Interface|eth0
M:IP|192.168.1.100
M:Masque|255.255.255.0
M:Passerelle|192.168.1.1

CFG:Réseau de secours
M:Interface|eth1
M:IP|10.0.0.100
M:Masque|255.255.255.0
M:Passerelle|10.0.0.1

CFG:Services critiques
M:Web|actif
M:Base de données|actif
M:Monitoring|actif

CFG:Paramètres de sécurité
M:Firewall|actif
M:SSH|clé uniquement
M:Mises à jour|automatiques

H:Procédures de basculement
P:En cas de panne du réseau principal :
P:1. Vérifier la connectivité eth1
P:2. Exécuter le script failover.sh
P:3. Notifier l'équipe technique
P:4. Tester les services critiques

C:# Script de basculement automatique
C:if ! ping -c 1 192.168.1.1; then
C:    systemctl restart network
C:    /usr/local/bin/failover.sh
C:fi
```

### Exemple spécialisé : Transmission d'urgence

```
PKT:URGENCE-001
T:ALERTE MÉDICALE PRIORITAIRE
M:Priorité|URGENT
M:Emetteur|Dr. Sarah Chen
M:Localisation|Camp Delta - Secteur 7
M:Timestamp|2025-11-15T14:45:00Z

H:Victime 1 - Enfant 8 ans
M:État|Critique
M:Symptômes|Chute de tension, convulsions
M:Diagnostic|Déshydratation sévère
M:Traitement|Perfusion immédiate, oxygène
P:Évacuation héliportée requise dans l'heure

H:Victime 2 - Adulte 35 ans
M:État|Stable
M:Symptômes|Fracture ouverte jambe droite
M:Traitement|Immobilisation, antibiotiques
P:Peut attendre transport terrestre

H:Ressources disponibles
P:2 médecins, 1 infirmière
P:Médicaments de base disponibles
P:Oxygène : 3 bouteilles restantes
P:Électricité : groupe électrogène opérationnel

Q:URGENT : Besoin renforts médicaux et évacuation aérienne
L:Coordonnées GPS|14.7566|-17.4567
L:Fréquence radio|148.500 MHz
```

---

**Conclusion du chapitre** : La syntaxe du MML est délibérément simple et restrictive. Cette approche peut sembler contraignante au premier abord, mais elle garantit la **fiabilité**, la **lisibilité** et la **transmissibilité universelle** du format. Chaque règle sert un objectif précis dans l'écosystème de communication contrainte où le MML est destiné à opérer.
