# Annexe B — Exemple complet d'un document MML commenté

## Document MML complet avec commentaires

```
# Document d'exemple MML complet
# Ce document démontre toutes les balises principales

T:Guide complet du langage MML
M:Auteur|Équipe MML
M:Version|1.0
M:Date|2025-11-15
M:Licence|CC-BY-SA

H:Introduction au MML

P:Le Minimal Markup Language (MML) est un format de balisage conçu pour la transmission et l'archivage de documents structurés dans des environnements contraints.

P:Sa syntaxe minimaliste le rend particulièrement adapté aux situations où la communication doit rester possible malgré les limitations techniques ou environnementales.

Q:« La simplicité est la sophistication ultime » - Léonard de Vinci

H:Syntaxe de base

P:La syntaxe du MML repose sur des principes simples :

P:1. Chaque ligne contient un élément unique
P:2. Le format est TAG:contenu
P:3. Les balises sont courtes et mnémotechniques

C:# Exemple de code JavaScript
C:function parseMML(text) {
C:  return text.split('\n')
C:    .filter(line => line.includes(':'))
C:    .map(line => {
C:      const [tag, content] = line.split(':', 2);
C:      return { tag, content: content.trim() };
C:    });
C:}

H:Transmission et résilience

P:Le MML peut être transmis par de nombreux canaux :

L:Transmission Morse|chapitre6-transmission-mml.md#65-transmission-via-morse
L:Réseaux DNF|chapitre7-mml-dnf.md
L:Radio amateur|chapitre6-transmission-mml.md#66-transmission-via-radio-amateur

IMG:Schéma de transmission|transmission-schema.png

H:Avantages comparatifs

P:Comparé aux formats traditionnels, le MML offre :

M:Simplicité|Syntaxe apprentissage en 5 minutes
M:Résilience|Tolère pertes partielles
M:Universalité|Transmissible par tout moyen
M:Efficacité|Ratio signal/bruit élevé

H:Cas d'usage

P:Le MML trouve ses applications dans de nombreux domaines :

H:Zones de conflit
P:Coordination des secours malgré les destructions d'infrastructure.

H:Catastrophes naturelles
P:Transmission d'informations vitales en zones isolées.

H:Radio amateur
P:Communication numérique dans la bande radio.

H:Applications embarquées
P:Documentation technique sur systèmes à faibles ressources.

H:Implémentations

P:Le MML est implémenté dans plusieurs langages :

CFG:JavaScript
M:Parser|Complet avec DOM
M:Convertisseurs|HTML, JSON, texte
M:Taille|15kb minifiée

CFG:Python
M:Bibliothèque|mml-parser
M:Fonctionnalités|Parsing + validation
M:Dépendances|Néant

CFG:C (embarqué)
M:Librairie|LibMML
M:Mémoire|256 octets RAM
M:Flash|2kb

H:Sécurité

P:Le MML supporte plusieurs mécanismes de sécurité :

M:Hachage|SHA256 pour intégrité
M:Signature|ED25519 pour authentification
M:Chiffrement|AES256 optionnel

HASH:SHA256:ceci-est-un-exemple-d-empreinte-hash-pour-demonstration

H:Écosystème et avenir

P:L'écosystème MML comprend :

L:DNF - Protocole de transport|chapitre7-mml-dnf.md
L:MMLC - Version compressée|chapitre5-mmlc-compression.md
L:Convertisseurs|chapitre8-convertisseurs-mml.md

P:L'avenir du MML s'oriente vers :
P:- Adoption humanitaire internationale
P:- Intégration IA embarquée
P:- Extensions contrôlées (MML 2.0)

Q:Le MML représente une approche minimaliste et résiliente de la communication numérique, adaptée aux défis du XXIe siècle.
```

## Analyse du document

### Structure hiérarchique
- **Niveau 0** : Titre principal (T:)
- **Niveau 1** : Sections principales (H:)
- **Niveau 2** : Sous-sections (H: sous les H:)
- **Contenu** : Paragraphes (P:), citations (Q:), code (C:)

### Métadonnées
- Informations documentaires (auteur, version, date)
- Configuration des implémentations
- Sécurité (hachage)

### Contenu riche
- Texte formaté avec citations importantes
- Blocs de code avec coloration syntaxique implicite
- Liens vers autres sections
- Images référencées
- Métadonnées structurées

### Transmission
Ce document peut être :
- **Dicté en Morse** pour transmission radio
- **Fragmenté en paquets DNF** pour résilience
- **Compressé en MMLC** pour économies
- **Converti automatiquement** vers HTML/JSON/PDF

---

**Ce document d'exemple démontre la richesse expressive du MML malgré sa syntaxe minimaliste.**
