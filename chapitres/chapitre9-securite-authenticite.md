# Chapitre 9 — Sécurité et Authenticité

## 9.1 Vérification par hachage

### Intégrité des documents

#### Principe
Chaque document MML peut être accompagné d'un hachage cryptographique garantissant qu'il n'a pas été modifié.

#### Format avec hachage
```
T:Document officiel
H:Section 1
P:Contenu authentifié
HASH:SHA256:a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3
```

#### Vérification
```javascript
const crypto = require('crypto');

function verifyMMLIntegrity(mmlText) {
  const lines = mmlText.split('\n');
  const hashLine = lines.find(line => line.startsWith('HASH:'));

  if (!hashLine) return false;

  const expectedHash = hashLine.split(':')[2];
  const contentWithoutHash = lines.filter(line => !line.startsWith('HASH:')).join('\n');
  const calculatedHash = crypto.createHash('sha256').update(contentWithoutHash).digest('hex');

  return calculatedHash === expectedHash;
}
```

## 9.2 Signatures légères

### Authentification des sources

#### ED25519 pour l'embarqué
- **Taille clé** : 32 octets
- **Signature** : 64 octets
- **Vérification rapide** : Adapté aux faibles ressources

#### Format signé
```
T:Document signé
SIGN:ED25519:clé_publique_en_base64:signature_en_base64
[contenu]
```

### Chaîne de confiance

#### Autorités de certification légères
- **Clés maîtresses** pour organisations
- **Délégation** à utilisateurs autorisés
- **Révocation** par liste noire

## 9.3 Protection contre modifications malveillantes

### Attaques potentielles

#### Modification de contenu
- **Détection** : Hachage invalide
- **Prévention** : Signature obligatoire pour documents critiques

#### Injection de faux fragments
- **Détection** : Vérification de source
- **Prévention** : Authentification mutuelle

#### Déni de service
- **Détection** : Filtrage par réputation
- **Prévention** : Limitation de débit

### Mesures de protection

#### Chiffrement optionnel
Pour contenu sensible :
```
ENCRYPT:AES256:clé_id
[contenu chiffré en base64]
```

#### Canaux sécurisés
- **DNF over TLS** : Quand réseau disponible
- **Chiffrement de bout en bout** : Protection contre interception

## 9.4 Transmission anonyme

### Respect de la vie privée

#### Anonymisation automatique
- **Pas d'identifiant personnel** dans les métadonnées de base
- **Horodatage relatif** au lieu d'absolu
- **Coordonnées approximatives** pour la protection

#### Format anonyme
```
T:Rapport incident
M:Type|Agression
M:Lieu|Centre-ville
M:Heure|Hier soir
P:Incident signalé anonymement
```

### Balance sécurité/anonymat

#### Niveau configurable
- **Public** : Aucune protection
- **Protégé** : Anonymisation automatique
- **Confidentiel** : Chiffrement obligatoire

## 9.5 Sécurité dans les contexts humanitaires

### Priorité à la communication

#### Principe humanitaire
En situation de crise, la **communication prime sur la sécurité parfaite**.

#### Sécurité proportionnée
- **Documents publics** : Pas de chiffrement
- **Informations sensibles** : Chiffrement léger
- **Données médicales** : Authentification minimale

### Authentification par contexte

#### Vérification sociale
- **Témoins multiples** : Corroboration
- **Chaîne de transmission** : Traçabilité humaine
- **Contexte opérationnel** : Validation par situation

### Gestion des clés

#### Clés embarquées
- **Pré-installées** dans équipements humanitaires
- **Rotation automatique** : Périodique
- **Récupération** : Procédures de secours

---

**Conclusion du chapitre** : La sécurité du MML est pensée pour être proportionnée au contexte. Dans les environnements humanitaires où la vie est en jeu, la priorité est donnée à la communication fiable plutôt qu'à une sécurité parfaite qui pourrait bloquer les transmissions. Le MML offre une sécurité "suffisante" et adaptable, privilégiant l'efficacité opérationnelle sur la perfection cryptographique.
