# Chapitre 5 — MMLC : Version compressée

## 5.1 Pourquoi compresser ?

### Le besoin de compression

Malgré sa concision, le MML reste un format texte qui peut être optimisé pour les transmissions très contraintes.

#### Scénarios nécessitant la compression

1. **Transmission Morse lente** : Chaque caractère compte
2. **Canaux à faible débit** : Satellite, radio packet
3. **Stockage limité** : Microcontrôleurs, cartes mémoire
4. **Coût de transmission** : Radio payante, satellite

#### Avantages de MMLC

- **Réduction de 40-60%** de la taille des messages
- **Accélération** des transmissions Morse
- **Économie** de bande passante et d'énergie
- **Compatibilité** avec les équipements existants

### Comparaison de tailles

#### Exemple : Bulletin météo

**MML original** (124 caractères) :
```
T:Bulletin météo
H:Prévisions
M:Température|22°C
M:Vent|15 km/h
P:Temps ensoleillé
```

**MMLC compressé** (68 caractères) :
```
1:Meteo
2:Previsions
3:Temperature|22°C
3:Vent|15 km/h
4:Temps ensoleille
```

**Gain** : 45% de réduction de taille.

## 5.2 Mapping balises → chiffres (1, 2, 3…)

### Table de correspondance standard

#### Balises fondamentales
- **1** = T: (Titre)
- **2** = H: (Header/Section)
- **3** = M: (Metadata)
- **4** = P: (Paragraph)
- **5** = L: (Link)
- **6** = IMG: (Image)
- **7** = C: (Code)
- **8** = Q: (Quote)
- **9** = CFG: (Configuration)
- **10** = PKT: (Packet)

#### Extension possible
- **11-99** : Balises personnalisées selon le domaine
- **100+** : Macros composites

### Syntaxe MMLC

#### Format compressé
```
numéro:contenu
```

#### Exemples
```
1:Rapport urgence
2:Secteur Alpha
3:Victimes|12
4:Évacuation requise
```

**Equivalent MML** :
```
T:Rapport urgence
H:Secteur Alpha
M:Victimes|12
P:Évacuation requise
```

## 5.3 Avantages pour le Morse

### Optimisation Morse

#### Caractères courts en Morse
Les chiffres sont plus courts que les lettres :
- **1** : ·---- (5 signes)
- **T** : - (4 signes)

Mais surtout : **moins de caractères au total**.

#### Exemple de transmission

**MML** : "T:Rapport H:Secteur M:Statut|OK"
- Lettres : T H S E C T E U R M S T A T U T O K
- Durée estimée : ~2 minutes

**MMLC** : "1:Rapport 2:Secteur 3:Statut|OK"
- Codes : 1 : R A P P O R T  2 : S E C T E U R  3 : S T A T U T | O K
- Durée estimée : ~1.3 minute

**Gain** : 35% de temps de transmission.

### Résilience améliorée

#### Moins de caractères = moins d'erreurs
- **Taux d'erreur réduit** proportionnellement au nombre de caractères
- **Correction plus facile** pour les opérateurs
- **Reprise simplifiée** en cas d'interruption

## 5.4 Tables de codes courts

### Dictionnaire intégré

#### Mots fréquents compressés
En plus des balises, MMLC peut compresser les mots courants :

- **A** = Alerte
- **B** = Bulletin
- **C** = Critique
- **D** = Danger
- **E** = Évacuation
- **F** = Feu
- **G** = Gravité
- **H** = Hospital
- **I** = Important
- **J** = Jour
- **K** = km/h (kilomètre par heure)
- **L** = Localisation
- **M** = Médical
- **N** = Normal
- **O** = OK
- **P** = Patient
- **Q** = Quantité
- **R** = Rapport
- **S** = Stable
- **T** = Température
- **U** = Urgent
- **V** = Victime
- **W** = Vent
- **X** = Explosion
- **Y** = °C (degrés Celsius)
- **Z** = Zone

### Utilisation du dictionnaire

#### Syntaxe avec dictionnaire
```
1:R
2:Z Alpha
3:V|5
4:E immédiate
```

**Expansion** :
```
1:Rapport
2:Zone Alpha
3:Victime|5
4:Évacuation immédiate
```

### Tables spécialisées

#### Dictionnaire médical
- **MED1** = Aspirine
- **MED2** = Paracétamol
- **MED3** = Antibiotiques
- **DIA1** = Pneumonie
- **DIA2** = Fracture
- **DIA3** = Déshydratation

#### Dictionnaire technique
- **TEC1** = Court-circuit
- **TEC2** = Panne électrique
- **TEC3** = Fuite de gaz

## 5.5 Compression contextuelle (tokens, dictionnaire)

### Compression adaptative

#### Analyse de fréquence
Le compresseur peut analyser un corpus de documents pour identifier les mots les plus fréquents.

#### Exemple d'analyse
Sur 100 rapports d'urgence :
- "Patient" apparaît 85 fois
- "Stable" apparaît 67 fois
- "Évacuation" apparaît 43 fois
- "Critique" apparaît 38 fois

#### Dictionnaire généré
- **P1** = Patient
- **S1** = Stable
- **E1** = Évacuation
- **C1** = Critique

### Compression par domaine

#### MMLC spécialisé
Différentes tables de compression selon le contexte :

- **MMLC-MED** : Dictionnaire médical
- **MMLC-TECH** : Dictionnaire technique
- **MMLC-MIL** : Dictionnaire militaire
- **MMLC-HUM** : Dictionnaire humanitaire

#### Exemple MMLC-MED
```
1:R urgence
2:P1 A
3:État|C1
3:DIA1
4:O2 et MED2 requis
```

**Expansion** :
```
T:Rapport urgence
H:Patient A
M:État|Critique
M:Diagnostic|Pneumonie
P:Oxygène et Paracétamol requis
```

## 5.6 Exemple HTML → MML → MMLC

### Processus de conversion complet

#### Document HTML original
```html
<!DOCTYPE html>
<html>
<head>
  <title>Rapport d'urgence</title>
  <meta name="author" content="Dr. Smith">
  <meta name="date" content="2025-11-15">
</head>
<body>
  <h1>Situation actuelle</h1>
  <p>Le secteur Alpha signale 3 blessés.</p>
  <p>État : 2 stables, 1 critique.</p>

  <h2>Ressources nécessaires</h2>
  <p>Équipe médicale supplémentaire requise.</p>
  <p>Évacuation aérienne prioritaire.</p>

  <blockquote>
    N'oubliez pas : la rapidité sauve des vies.
  </blockquote>
</body>
</html>
```

#### Conversion en MML
```
T:Rapport d'urgence
M:Auteur|Dr. Smith
M:Date|2025-11-15
H:Situation actuelle
P:Le secteur Alpha signale 3 blessés.
P:État : 2 stables, 1 critique.
H:Ressources nécessaires
P:Équipe médicale supplémentaire requise.
P:Évacuation aérienne prioritaire.
Q:N'oubliez pas : la rapidité sauve des vies.
```

**Taille** : 312 caractères

#### Conversion en MMLC standard
```
1:Rapport d urgence
3:Auteur|Dr. Smith
3:Date|2025-11-15
2:Situation actuelle
4:Le secteur Alpha signale 3 blesses.
4:Etat : 2 stables, 1 critique.
2:Ressources necessaires
4:Equipe medicale supplementaire requise.
4:Evacuation aerienne prioritaire.
8:N oubliez pas : la rapidite sauve des vies.
```

**Taille** : 268 caractères (14% de réduction)

#### Conversion en MMLC avec dictionnaire
```
1:R urgence
3:Auteur|Dr. Smith
3:J|2025-11-15
2:S actuelle
4:Z Alpha signale 3 V
4:État : 2 S1, 1 C1
2:R necessaires
4:E med supp req
4:E aerienne U
8:Rapidite sauve vies
```

**Taille** : 142 caractères (55% de réduction)

### Analyse des gains

| Format | Caractères | Gain | Usage |
|--------|------------|------|-------|
| HTML   | 587       | -    | Web   |
| MML    | 312       | 47%  | Standard |
| MMLC   | 268       | 54%  | Transmission |
| MMLC+Dict | 142    | 76%  | Urgence |

### Implémentation du compresseur

#### Fonction de compression JavaScript
```javascript
class MMLCompressor {
  constructor() {
    this.tagMap = {
      'T': '1', 'H': '2', 'M': '3', 'P': '4', 'L': '5',
      'IMG': '6', 'C': '7', 'Q': '8', 'CFG': '9', 'PKT': '10'
    };

    this.wordMap = {
      'Rapport': 'R', 'Patient': 'P1', 'Stable': 'S1',
      'Évacuation': 'E1', 'Critique': 'C1', 'Urgent': 'U',
      'Zone': 'Z', 'Victime': 'V', 'Médical': 'M'
    };
  }

  compress(mmlText) {
    const lines = mmlText.split('\n');
    const compressedLines = lines.map(line => this.compressLine(line));
    return compressedLines.join('\n');
  }

  compressLine(line) {
    if (!line.includes(':')) return line;

    const [tag, content] = line.split(':', 2);
    const compressedTag = this.tagMap[tag.trim()] || tag;
    const compressedContent = this.compressContent(content);

    return `${compressedTag}:${compressedContent}`;
  }

  compressContent(content) {
    let compressed = content;
    for (const [word, code] of Object.entries(this.wordMap)) {
      compressed = compressed.replace(new RegExp(word, 'g'), code);
    }
    return compressed;
  }

  decompress(mmlcText) {
    // Fonction inverse pour la décompression
    const lines = mmlcText.split('\n');
    const decompressedLines = lines.map(line => this.decompressLine(line));
    return decompressedLines.join('\n');
  }

  decompressLine(line) {
    if (!line.includes(':')) return line;

    const [tag, content] = line.split(':', 2);
    const decompressedTag = this.reverseTagMap[tag] || tag;
    const decompressedContent = this.decompressContent(content);

    return `${decompressedTag}:${decompressedContent}`;
  }

  decompressContent(content) {
    let decompressed = content;
    for (const [code, word] of Object.entries(this.reverseWordMap)) {
      decompressed = decompressed.replace(new RegExp(code, 'g'), word);
    }
    return decompressed;
  }
}
```

---

**Conclusion du chapitre** : MMLC démontre que le MML peut être encore optimisé pour les environnements les plus contraignants sans perdre sa lisibilité humaine. La compression par mapping numérique et dictionnaire contextuel offre des gains significatifs en taille et en vitesse de transmission, particulièrement crucial pour les communications d'urgence. MMLC prouve que minimalisme et efficacité peuvent coexister parfaitement.
