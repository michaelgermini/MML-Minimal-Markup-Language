# Exemple MML : Rapport d'urgence

## Document MML d'exemple

```
T:RAPPORT URGENCE - INCENDIE FORESTIER
M:ID|INC-2025-001
M:DATE|2025-11-15T14:30:00Z
M:EMETTEUR|Capitaine Sarah Chen
M:GRAVITE|CRITIQUE
M:LOCALISATION|Forêt domaniale secteur 7
M:COORDONNEES|45.234N 2.456E

H:SITUATION ACTUELLE

P:Incendie de forêt déclaré à 13h45. Vent de secteur Nord-Ouest force 5-6 Beaufort. Température 32°C. Humidité relative 25%.

P:Front de feu progressant vers le Sud-Est à raison de 200 mètres par heure. Menace sur hameau de Saint-Claire distant de 3km.

M:SUPERFICIE_BRULEE|450 hectares
M:VITESSE_PROPAGATION|200 m/h
M:DIRECTION|Sud-Est
M:VENT|NW 25-35 km/h

H:MOYENS ENGAGES

P:4 Canadairs en rotation. 2 hélicoptères bombardiers d'eau. 120 sapeurs-pompiers au sol avec 15 véhicules.

P:2 avions de reconnaissance. 1 drone de surveillance thermique.

M:EFFECTIFS_SOL|120 pompiers
M:VEHICULES|15
M:AERIENS|6 appareils

H:RENFORTS DEMANDES

P:Renforts aériens supplémentaires : 3 Canadairs et 2 hélicoptères.

P:Effectifs terrestres : 50 sapeurs-pompiers spécialisés feux de forêts.

P:Moyens logistiques : ravitaillement en eau pour 48h.

Q:URGENT : Évacuation préventive du hameau de Saint-Claire. Risque de débordement du front de feu.

H:VICTIMES ET DOMMAGES

P:2 blessés légers parmi les pompiers (brûlures superficielles). Aucune victime civile.

P:3 maisons de forestiers détruites. Chemin d'accès principal coupé par le feu.

M:VICTIMES|2 blesses legers
M:MAISONS_DETRUITES|3
M:INFRASTRUCTURES|Chemin d'acces coupe

H:CONDITIONS METEO PREVISIBLES

P:Vent soutenu pour les 12 prochaines heures. Risque d'orage sec en fin de journée pouvant aggraver la situation.

P:Température maximale prévue : 35°C. Humidité : 20-15%.

M:VENT_PREVU|NW 20-30 km/h
M:TEMPERATURE_MAX|35°C
M:HUMIDITE_MIN|15%
M:ORAGE_RISQUE|Eleve

H:PLAN D'ACTION

P:1. Consolidation de la ligne de défense principale
P:2. Protection prioritaire du hameau
P:3. Contre-feux sur flancs Ouest
P:4. Surveillance aérienne continue
P:5. Évacuation population si nécessaire

H:COMMUNICATIONS

P:Fréquence radio principale : 148.500 MHz
P:Canal de secours : 145.625 MHz
P:Téléphone satellite : +881 612 345 678

L:Carte secteur|cartes/incendie-secteur7.png
L:Bulletin météo|MeteoFrance/alerte-rouge
IMG:Photo incendie|photos/incendie-1500h.jpg

Q:RESTER EN ALERTE - SITUATION EVOLUTIVE

HASH:SHA256:d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f
```

## Analyse de l'exemple

### Structure du rapport
- **En-tête** : Informations essentielles identifiant le rapport
- **Situation** : État actuel détaillé
- **Moyens** : Ressources engagées
- **Renforts** : Besoins supplémentaires
- **Victimes** : Impact humain
- **Météo** : Conditions influençant l'évolution
- **Action** : Plan opérationnel
- **Communications** : Coordonnées de contact

### Métadonnées structurées
- **Localisation précise** : Coordonnées GPS
- **Horodatage** : Timestamp ISO 8601
- **Données quantitatives** : Superficies, vitesses, effectifs
- **Codes de gravité** : Classification normalisée

### Contenu opérationnel
- **Langage clair** : Termes techniques appropriés
- **Informations vitales** : Priorisation des données critiques
- **Références visuelles** : Cartes et photos
- **Contacts** : Multiples moyens de communication

### Sécurité et intégrité
- **Hachage** : Vérification d'intégrité du document
- **Horodatage** : Traçabilité temporelle
- **Émetteur identifié** : Responsabilité de l'information

## Transmission possible

### Par radio Morse
```
- / .- .--. .--. --- .- - / ..- .- .-. --. . -. -.-. .
.... .. -. -.-. . -. -.. .. . ..-. --- .- .-. . ...
```

### Par messager humain
- Dictée ligne par ligne
- Vérification à la réception
- Reproduction manuelle si nécessaire

### Par paquets DNF
- Fragmentation automatique
- Reconstruction résiliente
- Transmission par tout canal

---

**Cet exemple démontre comment le MML structure efficacement les informations complexes dans un format simple et transmissible.**
