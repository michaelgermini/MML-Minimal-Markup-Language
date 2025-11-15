# Chapitre 7 — MML + DNF

## 7.1 Le lien direct entre les deux technologies

### Naissance d'un écosystème

Le MML et le DNF (Digital Network Fragment) sont conçus comme **deux faces d'une même pièce** : la communication résiliente.

#### Origine commune
- **MML** : Format de sérialisation minimal
- **DNF** : Protocole de transport fragmenté
- **Ensemble** : Système de communication post-effondrement

#### Philosophie partagée
- **Résilience** : Fonctionner malgré les dommages
- **Simplicité** : Accessible à tous
- **Universalité** : Indépendant des infrastructures

## 7.2 Pourquoi DNF est le transport idéal du MML

### Affinités techniques

#### Structure complémentaire
- **MML** : Contenu organisé en lignes autonomes
- **DNF** : Transport de fragments indépendants

#### Avantages synergiques
- **Fragmentation naturelle** : Chaque ligne MML = fragment DNF
- **Reconstitution automatique** : DOM MML reconstruit depuis les fragments
- **Tolérance aux pertes** : Documents partiellement reconstituables

### Exemple d'intégration parfaite

**Document MML** :
```
T:Rapport urgence
H:Secteur A
M:Victimes|5
P:État stable
H:Secteur B
M:Victimes|3
P:Renforts requis
```

**Fragments DNF générés** :
- **Fragment 1** : `T:Rapport urgence`
- **Fragment 2** : `H:Secteur A`
- **Fragment 3** : `M:Victimes|5`
- **Fragment 4** : `P:État stable`
- **Fragment 5** : `H:Secteur B`
- **Fragment 6** : `M:Victimes|3`
- **Fragment 7** : `P:Renforts requis`

## 7.3 Fragmentation PKT

### Structure des paquets

#### Format PKT MML
```
PKT:IDENTIFIANT-UNIQUE
[contenu MML fragmenté]
END
```

#### Exemple concret
```
PKT:MED-URG-001
T:Rapport médical d'urgence
H:Patient A - 45 ans
M:Diagnostic|Infarctus
P:Douleurs thoraciques sévères
END
```

### Gestion des métadonnées de transport

#### En-têtes DNF
- **ID** : Identifiant unique du paquet
- **TTL** : Time To Live
- **Priority** : Niveau de priorité
- **Source** : Origine du message

#### Intégration avec MML
```
PKT:SEC-ALERT-001:TTL=3600:PRIORITY=HIGH
T:Alerte sécurité maximale
H:Intrusion détectée
M:Zone|Aile Est
P:Évacuation immédiate
END
```

## 7.4 Reconstitution automatique

### Algorithme de reconstruction

#### Processus en trois étapes

1. **Collecte** : Rassembler tous les fragments du même ID
2. **Validation** : Vérifier l'intégrité de chaque fragment
3. **Assemblage** : Reconstruire le document selon la logique DOM

#### Implémentation simplifiée
```javascript
class MMLDNFReconstructor {
  constructor() {
    this.fragments = new Map(); // ID -> fragments[]
  }

  addFragment(packetId, fragment) {
    if (!this.fragments.has(packetId)) {
      this.fragments.set(packetId, []);
    }
    this.fragments.get(packetId).push(fragment);
  }

  reconstruct(packetId) {
    const fragments = this.fragments.get(packetId) || [];
    if (fragments.length === 0) return null;

    // Trier par priorité logique
    const sortedFragments = this.sortFragments(fragments);

    // Construire le document
    const document = this.buildDocument(sortedFragments);

    return document;
  }

  sortFragments(fragments) {
    const priority = { 'T': 1, 'H': 2, 'M': 3, 'P': 4 };
    return fragments.sort((a, b) => {
      const aType = a.split(':')[0];
      const bType = b.split(':')[0];
      return (priority[aType] || 99) - (priority[bType] || 99);
    });
  }

  buildDocument(fragments) {
    const parser = new MMLParser();
    const mmlText = fragments.join('\n');
    return parser.parse(mmlText);
  }
}
```

### Gestion des pertes partielles

#### Reconstitution dégradée
Si certains fragments sont perdus, le document reste partiellement utilisable.

**Exemple** :
- **Pertes** : Métadonnées détaillées
- **Préservé** : Structure principale et contenu essentiel

## 7.5 Cas d'usage : antennes, Bluetooth, mesh, humain → humain

### Transmission par antennes radio

#### Scénario typique
- **Émetteur** : Opérateur de terrain avec radio portable
- **Transport** : Onde radio VHF/UHF
- **Récepteur** : Centre de coordination

#### Avantages
- **Portée** : Plusieurs kilomètres
- **Vitesse** : Temps réel
- **Fiabilité** : Bonne dans la zone de couverture

### Réseaux Bluetooth mesh

#### Applications IoT
- **Capteurs environnementaux** transmettant des données MML
- **Réseaux de secours** auto-organisants
- **Communication entre drones** et opérateurs

#### Exemple
```
PKT:SENSOR-001
T:Données capteur
M:Type|Température
M:Valeur|23.5°C
M:Batterie|85%
END
```

### Réseaux mesh humains

#### Communication peer-to-peer
- **Transport** : Coursier à pied/vélo
- **Stockage** : Mémorisation ou papier
- **Reprise** : Transmission à la prochaine station

#### Robustesse ultime
- **Pas d'énergie** requise (en théorie)
- **Fonctionne** même sans technologie
- **Redondance** par multiplication des courriers

### Chaîne humain → machine → humain

#### Processus complet
1. **Observation** humaine → **Encodage** MML
2. **Transmission** par tout moyen → **Stockage** temporaire
3. **Réception** par système automatisé → **Traitement** algorithmique
4. **Conversion** vers format utile → **Diffusion** aux destinataires
5. **Décodage** humain final

#### Exemple concret : Alerte tsunami
1. **Témoin** : "Vague de 5m approche !"
2. **Encode** : `T:ALERTE TSUNAMI H:VAGUE 5M P:EVACUEZ IMMEDIATEMENT`
3. **Transmet** : Par radio ou coursier
4. **Système reçoit** : Convertit en alerte automatique
5. **Population alertée** : Par sirènes et SMS

## 7.6 Validation, authenticité, hachage

### Sécurité dans l'écosystème MML+DNF

#### Hachage pour l'intégrité
Chaque paquet peut inclure son empreinte cryptographique.

#### Format sécurisé
```
PKT:SECURE-MSG-001
T:Document authentifié
[contenu MML]
HASH:SHA256:abcdef123456...
SIGN:ED25519:key_id:signature...
END
```

### Authentification des sources

#### Clés publiques légères
- **ED25519** : Signature rapide et compacte
- **Clés embarquées** : Dans les appareils MML
- **Chaîne de confiance** : Validation par autorités reconnues

### Validation de contenu

#### Règles automatiques
- **Cohérence** : Vérification des métadonnées
- **Plage valide** : Températures entre -100°C et +100°C
- **Format** : Validation des coordonnées GPS

#### Exemple de validation
```javascript
class MMLValidator {
  validate(document) {
    const errors = [];

    // Vérifier la présence du titre
    if (!document.title) {
      errors.push("Titre manquant");
    }

    // Valider les coordonnées GPS
    if (document.metadata.coordinates) {
      if (!this.isValidGPS(document.metadata.coordinates)) {
        errors.push("Coordonnées GPS invalides");
      }
    }

    // Vérifier les plages de valeurs
    if (document.metadata.temperature) {
      const temp = parseFloat(document.metadata.temperature);
      if (temp < -100 || temp > 100) {
        errors.push("Température hors plage valide");
      }
    }

    return errors;
  }

  isValidGPS(coord) {
    const gpsRegex = /^-?\d{1,3}\.\d+,-?\d{1,3}\.\d+$/;
    return gpsRegex.test(coord);
  }
}
```

---

**Conclusion du chapitre** : L'intégration MML+DNF représente l'aboutissement de la philosophie minimaliste. Ensemble, ils créent un système de communication qui peut survivre à l'effondrement des infrastructures modernes. Cette synergie transforme deux technologies simples en une infrastructure de communication résiliente capable de fonctionner dans les conditions les plus extrêmes, prouvant que la simplicité bien conçue peut surpasser la complexité sophistiquée.
