# Chapitre 6 — Transmission du MML

## 6.1 Le MML comme format transmissible

### Propriétés de transmissibilité

Le MML est conçu pour être transmis par **tous les moyens imaginables** :

#### Propriétés clés
- **Format texte ASCII** : Compatible avec tous les systèmes
- **Lignes indépendantes** : Résilience aux fragmentations
- **Encodage minimal** : Pas de caractères spéciaux problématiques
- **Taille optimisée** : Rapport signal/bruit élevé

### Métriques de transmissibilité

#### Score de transmissibilité MML : 9.8/10

| Critère | Score | Justification |
|---------|-------|---------------|
| Morse | 10/10 | Balises courtes, chiffres disponibles |
| Radio vocale | 9/10 | Prononçable, structuré |
| Écrit manuel | 10/10 | Simple à écrire |
| Numérique | 10/10 | Texte standard |
| Optique | 8/10 | Visible, mais lent |
| Acoustique | 7/10 | Possible mais moins optimal |

## 6.2 Transmission séquentielle vs fragmentée

### Transmission séquentielle

#### Mode classique
Le document est transmis ligne par ligne dans l'ordre.

**Avantages** :
- Préservation de la structure originale
- Facilité de reconstruction
- Ordre logique maintenu

**Inconvénients** :
- Vulnérable aux interruptions
- Tout ou rien : échec si coupure

### Transmission fragmentée

#### Mode résilient
Chaque ligne devient un fragment indépendant.

**Avantages** :
- Reconstruction possible même partielle
- Tolérance aux pertes
- Reconstitution dans n'importe quel ordre

**Inconvénients** :
- Structure hiérarchique à reconstruire
- Métadonnées potentielles perdues

#### Exemple pratique

**Document original** :
```
T:Rapport météo
H:Aujourd'hui
M:Temp|25°C
P:Temps ensoleillé
```

**Transmission fragmentée** :
- Fragment A: "T:Rapport météo"
- Fragment B: "H:Aujourd'hui"
- Fragment C: "M:Temp|25°C"
- Fragment D: "P:Temps ensoleillé"

**Reconstitution possible** même si B et C sont perdus.

## 6.3 Perte, duplication et reconstruction

### Gestion des pertes

#### Algorithme de reconstruction tolérante

1. **Collecte** de tous les fragments reçus
2. **Identification** du type de chaque fragment
3. **Regroupement** par sections logiques
4. **Reconstruction** de la hiérarchie

#### Exemple de résilience

**Fragments reçus** (60% de pertes) :
- "T:Rapport urgence"
- "P:Évacuation requise"
- "H:Secteur B"
- "P:Stabilisation en cours"

**Reconstruction possible** :
```
T:Rapport urgence
H:Secteur B
P:Évacuation requise
P:Stabilisation en cours
```

### Gestion des duplications

#### Détection et suppression
- **Horodatage** dans les métadonnées
- **Identifiant unique** par document
- **Comparaison de contenu** pour les doublons

### Reconstruction automatique

#### Logique de reconstitution

```javascript
class MMLReconstructor {
  reconstruct(fragments) {
    const document = { title: null, sections: [], metadata: {} };

    // Trier par type de priorité
    const sortedFragments = this.prioritizeFragments(fragments);

    for (const fragment of sortedFragments) {
      this.addFragmentToDocument(document, fragment);
    }

    return this.finalizeDocument(document);
  }

  prioritizeFragments(fragments) {
    const priority = { 'T': 1, 'H': 2, 'M': 3, 'P': 4 };
    return fragments.sort((a, b) => {
      const aPriority = priority[a.tag] || 99;
      const bPriority = priority[b.tag] || 99;
      return aPriority - bPriority;
    });
  }
}
```

## 6.4 Transmission via DNF

### Intégration native

Le MML et le DNF forment un couple parfait car :

#### Synergie technique
- **MML** : Structure le contenu en lignes indépendantes
- **DNF** : Transporte les lignes comme fragments autonomes

#### Avantages combinés
- **Résilience maximale** : Perte de fragments tolérée
- **Reconstruction automatique** : Réassemblage intelligent
- **Transmission universelle** : Tous canaux supportés

### Exemple concret

**Document MML** :
```
T:Alerte sécurité
H:Incident détecté
M:Gravité|Haute
P:Accès non autorisé détecté
```

**Paquet DNF généré** :
```
PKT:SEC-001
T:Alerte sécurité
H:Incident détecté
M:Gravité|Haute
P:Accès non autorisé détecté
END
```

## 6.5 Transmission via Morse

### Optimisation pour le code Morse

#### Choix des balises
- **T** : - (4 signes) → très court
- **H** : .... (4 signes) → court
- **P** : .--. (6 signes) → acceptable
- **M** : -- (4 signes) → court

#### Transmission vocale
- **Opérateur A** : "T deux points Alerte sécurité"
- **Opérateur B** : "T reçu"
- **Opérateur A** : "H deux points Secteur compromis"
- **Etc.**

### Vitesse de transmission

#### Calcul théorique
- **Vitesse Morse experte** : 20-25 mots/minute
- **Longueur moyenne ligne MML** : 25 caractères
- **Débit effectif** : ~15 lignes/minute

#### Comparaison
- **Texte libre** : Illisible en Morse continu
- **MML structuré** : Transmissible efficacement

## 6.6 Transmission via radio amateur (CW, JS8, APRS)

### Code Morse continu (CW)

#### Avantages
- **Portée mondiale** avec faible puissance
- **Pénétration** dans les environnements difficiles
- **Coût énergétique minimal**

#### Format adapté
```
DE F5XYZ
T:ALERTE INONDATION
H:SECTEUR RIVERAIN
M:VICTIMES|8
P:EVACUATION URGENTE
M:COORD|45.2N 2.1E
E E
```

### JS8Call

#### Mode numérique moderne
- **Transmission texte** sur ondes radio
- **Correction d'erreurs** automatique
- **Portée étendue**

#### Exemple transmission
```
F5XYZ: T:RAPPORT MEDICAL H:PATIENT CRITIQUE M:ETAT|STABLE P:TRAITEMENT EN COURS
```

### APRS (Automatic Packet Reporting System)

#### Système de paquets
- **Positionnement GPS** intégré
- **Routage automatique**
- **Stockage en cloud**

#### Paquet MML/APRS
```
F5XYZ>APRS,TCPIP*:=4552.45N/00215.67E- T:SECURITE H:ACCES INTERDIT P:ZONE DANGER
```

## 6.7 Transmission via optique, audio ou vibrations

### Transmission optique

#### Signaux lumineux
- **Lampe torche** : Point = court, trait = long
- **Sémaphores** : Drapeaux colorés
- **Laser** : Transmission directionnelle

#### Adaptation MML
Utilisation de MMLC avec chiffres binaires pour optimiser.

### Transmission acoustique

#### Sifflets et codes
- **Sifflet à deux tons** : Point/trait
- **Morse audio** : Fréquences distinctes

#### Applications
- Communication en milieu bruyant
- Signalisation de détresse

### Transmission par vibrations

#### Applications spécialisées
- **Codeurs braille** : Pour malvoyants
- **Signaux haptiques** : Montres connectées
- **Vibrations morse** : Appareils portables

## 6.8 Tolérances aux erreurs

### Types d'erreurs gérées

#### Erreurs de transmission
- **Substitution** : Lettre changée (A→E)
- **Insertion** : Caractère ajouté
- **Suppression** : Caractère perdu
- **Transposition** : Ordre changé

#### Erreurs humaines
- **Phonétiques** : Confusion auditive
- **Visuelles** : Confusion graphique
- **Fatigue** : Erreurs d'attention

### Stratégies de tolérance

#### Redondance contrôlée
- **Répétition** des informations critiques
- **Paraphrases** : "Alerte maximale" = "URGENT"
- **Codes de contrôle** : Sommes de vérification

#### Validation croisée
- **Multi-transmission** : Plusieurs canaux
- **Consensus** : Accord entre sources
- **Contexte** : Validation sémantique

### Tests de robustesse

#### Scénario d'erreur simulé
**Message original** : "T:URGENT H:EVACUER M:CAUSE|FEU"

**Après erreurs** :
- "T:URGENT H:EVACUFR M:CAUSR|FEU"
- "T:URGENT H:EVACUER M:CAUSE|FFU"

**Résultat** : Message encore intelligible malgré les corruptions.

---

**Conclusion du chapitre** : La transmissibilité universelle est la force majeure du MML. Contrairement aux formats numériques modernes qui dépendent d'infrastructures complexes, le MML peut voyager par n'importe quel moyen : des ondes radio aux signaux lumineux, de la voix humaine au code Morse. Cette universalité fait du MML bien plus qu'un format de données – c'est un protocole de communication pour l'humanité.
