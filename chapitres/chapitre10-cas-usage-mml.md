# Chapitre 10 — Cas d'usage du MML

## 10.1 Zones de guerre

### Communication sous conflit

#### Défis spécifiques
- **Infrastructures détruites** : Réseaux électriques coupés
- **Brouillage radio** : Communications militaires
- **Déplacement constant** : Troupes mobiles
- **Stress extrême** : Personnel sous pression

#### Solutions MML
- **Transmission Morse** : Contourner le brouillage
- **Messagers humains** : Courriers à pied
- **DNF fragmenté** : Résister aux interruptions

#### Exemple opérationnel
```
T:RAPPORT COMBAT
M:SECTEUR|ALPHA-7
M:DATE|15NOV2025
H:SITUATION
P:ENNEMI REPOUSSE POSITION 45.2N 2.1E
M:PERTES|3 BLESSES 1 TUÉ
H:RENFORTS
P:BESOIN URGENT MEDECINS
L:CARTE TACTIQUE|carte-alpha7.png
Q:EXTRACTION AERIENNE PRIORITAIRE
```

## 10.2 Catastrophes naturelles

### Coordination post-désastre

#### Scénarios typiques
- **Tremblements de terre** : Infrastructures effondrées
- **Inondations** : Zones isolées
- **Ouragans** : Communications coupées
- **Incendies** : Évacuation massive

#### Applications MML
- **Inventaires de ressources** : Eau, nourriture, médicaments
- **Coordination des secours** : Position des équipes
- **Évaluation des dommages** : Rapports structurés

#### Rapport d'évaluation
```
T:EVALUATION DEGATS
H:ZONE SINISTREE
M:SUPERFICIE|5km²
M:BATIMENTS|80% DETRUITS
M:VICTIMES|12 DISPARUS
P:ELECTRICITE COUPEE SECTEUR NORD
P:VOIES ACCES BLOQUEES
H:RESSOURCES REQUISES
P:EQUIPE DEBUT 20 PERSONNES
P:MATERIEL LOURD PRIORITAIRE
M:COORD|43.5N 1.4W
```

## 10.3 Communication hors-ligne

### Systèmes autonomes

#### Bibliothèque communautaire
- **Catalogage** : Livres disponibles
- **Réservations** : Système sans électricité
- **Échanges** : Communauté locale

#### Gestion locative
```
T:ETAT LOCATIF
H:BATIMENT A
M:APPARTEMENTS|24
M:OCCUPES|18
M:DISPONIBLES|6
P:REPARATIONS NECESSAIRES ESCALIER B
H:BATIMENT B
M:APPARTEMENTS|16
M:OCCUPES|16
M:DISPONIBLES|0
```

## 10.4 Longue distance low tech

### Expéditions isolées

#### Recherche polaire
- **Données scientifiques** : Collecte automatique
- **Rapports de santé** : Équipe isolée
- **Maintenance** : Suivi équipement

#### Transmission par satellite iridium
```
PKT:EXPEDITION-045
T:RAPPORT QUOTIDIEN
M:JOUR|45
M:POSITION|78.2S 45.1E
H:METEO
M:TEMPERATURE|-35°C
M:VENT|45km/h
H:EQUIPE
P:SANTE BONNE AUCUN PROBLEME
P:PROGRESSION NORMALE
H:DONNEES
M:ECHANTILLONS|12
M:OBSERVATIONS|8
END
```

## 10.5 Radio amateur

### Communication d'urgence

#### Réseaux ARES/RACES
- **Gestion des fréquences** : Coordination
- **Diffusion d'alertes** : Population civile
- **Support logistique** : Ressources disponibles

#### Bulletin radio amateur
```
T:BULLETIN ARES
M:EMETTEUR|W1AW
M:FREQUENCE|3.950MHz
H:ACTIVITES
P:NET QUOTIDIEN 19H00 UTC
P:FORMATION MORSE MARDI
H:ALERTES
P:PAS D ACTIVITE MAJEURE
P:VEILLE RADIO MAINTENUE
```

## 10.6 Systèmes éducatifs low-tech

### Éducation en zones isolées

#### Manuels scolaires
- **Contenu structuré** : Leçons progressives
- **Exercices** : Auto-évaluation
- **Suivi progrès** : Élèves individuels

#### Cours élémentaire
```
T:MATHÉMATIQUES CP
H:ADDITION
P:L'addition est la réunion de deux groupes.
C:2 + 3 = 5
C:4 + 1 = 5
H:MULTIPLICATION
P:La multiplication est l'addition répétée.
C:2 × 3 = 6
Q:À retenir : la multiplication est plus rapide que l'addition !
```

## 10.7 Documentation technique embarquée

### Manuels d'équipement

#### Avantages MML
- **Taille réduite** : Mémoire limitée
- **Recherche facile** : Structure hiérarchique
- **Mise à jour** : Fragments indépendants

#### Manuel compresseur
```
T:MANUEL COMPRESSEUR AIR
M:MODELE|CA-200
M:VERSION|2.1
H:INSTALLATION
P:Placer sur surface stable horizontale.
P:Vérifier alimentation électrique 220V.
H:MAINTENANCE
P:Vidanger condenseur hebdomadairement.
P:Nettoyer filtre tous les 3 mois.
C:# Démarrage d'urgence
C:if power_failure:
C:    switch_to_backup()
H:DEPANNAGE
P:Si pas de pression : vérifier fusible.
P:Si bruit anormal : vidanger huile.
```

## 10.8 Signalisation universelle

### Communication transculturelle

#### Signes universels
- **Danger** : Symboles reconnus mondialement
- **Aide** : Signaux de détresse standardisés
- **Directions** : Guidage visuel

#### Panneau MML
```
T:SIGNALISATION SITE
H:DANGER
M:TYPE|HAUTE TENSION
P:NE PAS TOUCHER
P:DISTANCE MINIMUM 3 METRES
IMG:picto-danger-electrique.png
H:ACCES
P:ENTREE AUTORISEE PERSONNEL SEULEMENT
P:BADGE OBLIGATOIRE
L:PROCEDURE ACCES|procedure-securite.pdf
```

## 10.9 Conversions automatiques IA → MML

### Génération assistée

#### IA comme rédacteur
- **Transcription audio** → MML structuré
- **Analyse d'images** → Descriptions MML
- **Résumé automatique** → Documents concis

#### Exemple : Rapport IA
```
T:RAPPORT INCIDENT
M:GENERE_PAR|IA_ANALYSE
M:CONFIDENCE|87%
H:DESCRIPTION
P:Accident de voiture détecté intersection principale.
M:VEHICULES|2
M:BLESSES|1 LEGER
H:CAUSE PROBABLE
P:Non respect priorité à droite.
Q:Recommandation : installation feu tricolore.
```

---

**Conclusion du chapitre** : Les cas d'usage du MML démontrent sa polyvalence exceptionnelle. Du champ de bataille aux salles de classe, des expéditions polaires aux zones sinistrées, le MML s'adapte à tous les contextes où la communication doit rester possible malgré les contraintes. Chaque scénario révèle une facette différente de la robustesse et de l'universalité du format.
