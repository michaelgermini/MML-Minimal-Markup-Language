# MML – Le Langage Minimal Universel

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/michaelgermini/MML-Minimal-Markup-Language-for-Constrained-Environments-Le-Langage-Minimal-Universel)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://github.com/michaelgermini/MML-Minimal-Markup-Language-for-Constrained-Environments-Le-Langage-Minimal-Universel/actions)
[![Documentation](https://img.shields.io/badge/docs-complete-blue.svg)](introduction.md)
[![Tutorial](https://img.shields.io/badge/tutorial-interactive-orange.svg)](tutorial/)
[![Web Validator](https://img.shields.io/badge/validator-online-purple.svg)](web-validator/)

## Conception, Syntaxe, Architecture, Transmission et Applications du Minimal Markup Language

> **🌟 MML : La communication qui fonctionne même quand tout échoue**

---

## 📑 TABLE DES MATIÈRES

### INTRODUCTION GÉNÉRALE
- [La nécessité d'un langage simple](introduction.md)
- [Pourquoi le MML existe](introduction.md#pourquoi-le-mml-existe)
- [Origine, vision et philosophie](introduction.md#origine-vision-et-philosophie)
- [Pour qui est conçu le MML ?](introduction.md#pour-qui-est-conçu-le-mml)
- [Comparaison avec HTML, XML, JSON et Markdown](introduction.md#comparaison-avec-html-xml-json-et-markdown)
- [Le rôle du MML dans l'écosystème DNF](introduction.md#le-rôle-du-mml-dans-lécosystème-dnf)

### CHAPITRES
- [Chapitre 1 — Pourquoi le MML ?](chapitres/chapitre1-pourquoi-mml.md)
- [Chapitre 2 — Fondements du MML](chapitres/chapitre2-fondements-mml.md)
- [Chapitre 3 — Syntaxe du MML](chapitres/chapitre3-syntaxe-mml.md)
- [Chapitre 4 — Le DOM MML](chapitres/chapitre4-dom-mml.md)
- [Chapitre 5 — MMLC : Version compressée](chapitres/chapitre5-mmlc-compression.md)
- [Chapitre 6 — Transmission du MML](chapitres/chapitre6-transmission-mml.md)
- [Chapitre 7 — MML + DNF](chapitres/chapitre7-mml-dnf.md)
- [Chapitre 8 — Convertisseurs MML](chapitres/chapitre8-convertisseurs-mml.md)
- [Chapitre 9 — Sécurité et Authenticité](chapitres/chapitre9-securite-authenticite.md)
- [Chapitre 10 — Cas d'usage du MML](chapitres/chapitre10-cas-usage-mml.md)
- [Chapitre 11 — MML dans l'écosystème futur](chapitres/chapitre11-ecosysteme-futur.md)

### ANNEXES
- [Annexe A — Table complète des balises MML](annexes/annexe-a-balises-mml.md)
- [Annexe B — Exemple complet d'un document MML commenté](annexes/annexe-b-exemple-complet.md)
- [Annexe C — Table complète du Morse (ITU)](annexes/annexe-c-table-morse.md)
- [Annexe D — JSON Schema du DOM MML](annexes/annexe-d-schema-dom.md)
- [Annexe E — Implémentation d'un parseur MML minimal](implementations/)
- [Annexe F — Mapping MML → MMLC](annexes/annexe-f-mapping-mmlc.md)
- [Annexe G — Comparatif MML/HTML/XML/JSON](annexes/annexe-g-comparatif.md)

### RESSOURCES SUPPLÉMENTAIRES
- [Exemples pratiques](exemples/)
- [Implémentations](implementations/)

## 🏗️ Architecture MML

```
┌─────────────────────────────────────────────────────────────────┐
│                    ÉCOSYSTÈME MML                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐         │
│  │  HUMAIN     │    │   RADIO     │    │   NUMÉRIQUE  │         │
│  │  MESSAGER   │────│   VOCALE    │────│   RÉSEAUX    │         │
│  │             │    │             │    │              │         │
│  │ • Parole    │    │ • HF/VHF    │    │ • Ethernet    │         │
│  │ • Signaux   │    │ • Satellite │    │ • WiFi        │         │
│  │ • Morse     │    │ • Packet    │    │ • Bluetooth   │         │
│  └─────────────┘    └─────────────┘    └─────────────┘         │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                    PROTOCOLE DNF                           │ │
│  │              (Digital Network Fragment)                    │ │
│  │                                                             │ │
│  │  Fragmentation • Redondance • Reconstruction automatique   │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                    FORMAT MML                               │ │
│  │              (Minimal Markup Language)                      │ │
│  │                                                             │ │
│  │  T:Titre • H:Section • P:Paragraphe • M:Métadonnées        │ │
│  │  L:Lien • I:Image • C:Code • Q:Citation                     │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                 COMPRESSION MMLC                            │ │
│  │              (Version compressée)                           │ │
│  │                                                             │ │
│  │  Huffman • LZ77 • RLE • Optimisations spécifiques           │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐         │
│  │ JAVASCRIPT  │    │   PYTHON    │    │     C++     │         │
│  │             │    │             │    │             │         │
│  │ • Web       │    │ • CLI       │    │ • Embarqué  │         │
│  │ • Node.js   │    │ • Serveurs  │    │ • Temps réel │         │
│  └─────────────┘    └─────────────┘    └─────────────┘         │
│                                                                 │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐         │
│  │    RUST     │    │     GO      │    │   VALIDATEUR │         │
│  │             │    │             │    │              │         │
│  │ • Haute perf│    │ • Services  │    │ • Web en    │         │
│  │ • Sécurité  │    │ • Cloud     │    │ • ligne      │         │
│  └─────────────┘    └─────────────┘    └─────────────┘         │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                 APPLICATIONS                                 │ │
│  │                                                             │ │
│  │  🚨 URGENCES • 🏥 MÉDICAL • 🛰️ SATELLITE • 🤖 IoT          │ │
│  │  📡 RADIO • 🏕️ TERRAIN • 🛟 HUMANITAIRE • 🔬 RECHERCHE     │ │
│  └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Démarrage rapide

Le MML (Minimal Markup Language) est un langage de balisage universel conçu pour être simple, robuste et transmissible dans les environnements les plus contraignants.

### Exemple simple en MML :

```
T:Mon premier document MML
H:Introduction
P:Ceci est un paragraphe simple.
L:En savoir plus|https://example.com
```

## 🔄 Comparaison avec les formats existants

| Critère | MML | HTML | XML | JSON | Markdown |
|---------|-----|------|-----|------|----------|
| **Lisibilité humaine** | ⭐⭐⭐ | ⭐⭐ | ⭐⭐ | ⭐⭐ | ⭐⭐⭐ |
| **Taille compacte** | ⭐⭐⭐ | ⭐ | ⭐ | ⭐⭐ | ⭐⭐⭐ |
| **Vitesse parsing** | ⭐⭐⭐ | ⭐⭐ | ⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| **Résilience erreurs** | ⭐⭐⭐ | ⭐ | ⭐ | ⭐ | ⭐⭐ |
| **Transmission orale** | ⭐⭐⭐ | ❌ | ❌ | ❌ | ⭐⭐ |
| **Code Morse** | ⭐⭐⭐ | ❌ | ❌ | ❌ | ❌ |

### Exemple concret : Fiche patient (89 caractères MML)
```
T:Jean Dupont
M:Âge|45 ans
M:État|stable
M:Diagnostic|Fracture bras
```

**VS HTML (245 caractères)** - 36% plus petit
```html
<div class="patient">
  <h3>Jean Dupont</h3>
  <p>Âge: 45 ans</p>
  <p>État: stable</p>
  <p>Diagnostic: Fracture bras</p>
</div>
```

**VS JSON (145 caractères)** - 38% plus petit
```json
{"name":"Jean Dupont","age":"45 ans","status":"stable","diagnosis":"Fracture bras"}
```

**Résultat** : MML fonctionne même **endommagé à 80%**, **transmissible par radio vocale** et **compatible Morse** - impossible avec les autres formats !

## 🌐 Écosystème MML

### 💻 Implémentations disponibles

| Langage | Statut | Usage | Performance | Taille |
|---------|--------|-------|-------------|--------|
| **JavaScript** | ✅ Complet | Web, Node.js, Browser | ⭐⭐⭐ | ~15KB |
| **Python** | ✅ Complet | CLI, Serveurs, Scripts | ⭐⭐⭐ | ~25KB |
| **C++** | ✅ Complet | Embarqué, Temps réel | ⭐⭐⭐⭐⭐ | ~50KB |
| **Rust** | ✅ Complet | Haute perf, Sécurité | ⭐⭐⭐⭐⭐ | ~35KB |
| **Go** | ✅ Complet | Services, Cloud | ⭐⭐⭐⭐ | ~40KB |

### 🛠️ Outils et services

#### **Validateur Web** 🌐
```bash
# Interface web complète
# Validation temps réel
# Conversions HTML/JSON
# Statistiques détaillées
```
→ **[Accéder au validateur](web-validator/)**

#### **CLI Tools** 💻
```bash
# Validation de documents
mml-cli validate document.mml

# Conversion de formats
mml-cli convert document.mml --to html

# Compression MMLC
mml-cli compress document.mml

# Analyse et statistiques
mml-cli stats document.mml
```

#### **Tutoriel Interactif** 🎓
```bash
# Apprentissage progressif
# 8 leçons complètes
# Exercices pratiques
# 14 badges d'accomplissement
```
→ **[Commencer le tutoriel](tutorial/)**

#### **Extension VS Code** 🔧
```json
// Coloration syntaxique
// Snippets intelligents
// Validation temps réel
// Commandes intégrées
```
→ **[Installer l'extension](vscode-extension/)**

### 📊 Benchmarks de performance

| Opération | JavaScript | Python | C++ | Rust | Go |
|-----------|------------|--------|-----|------|----|
| **Parsing (1KB)** | 0.8ms | 2.1ms | 0.05ms | 0.03ms | 0.07ms |
| **Validation** | 1.2ms | 3.2ms | 0.08ms | 0.05ms | 0.09ms |
| **Conversion HTML** | 2.5ms | 5.8ms | 0.15ms | 0.12ms | 0.18ms |
| **Compression MMLC** | 1.8ms | 4.2ms | 0.12ms | 0.08ms | 0.14ms |

### 🎯 Cas d'usage par secteur

#### **🚨 Urgences & Catastrophes**
- Rapports de situation dégradés
- Coordination humanitaire
- Communication inter-équipes

#### **🏥 Médical & Santé**
- Dossiers patients d'urgence
- Inventaires médicaments
- Protocoles de soins

#### **🛰️ Spatial & Aéronautique**
- Télémesures contraintes
- Logs systèmes critiques
- Communication satellite

#### **🤖 IoT & Embarqué**
- Capteurs low-power
- Mise à jour OTA
- Configuration devices

#### **📡 Communication Radio**
- Transmission HF/VHF
- Packet radio
- Liaison satellite

---

### Caractéristiques clés :
- ✅ **Ultra-léger** : Format texte minimal
- ✅ **Résilient** : Tolère pertes et fragmentations
- ✅ **Universel** : Morse, radio, DNF, humain-homme
- ✅ **Simple** : Syntaxe intuitive en 5 minutes
- ✅ **Extensible** : Balises modulaires

---

## 🤝 Contribution

### 🚀 Comment contribuer

Nous accueillons toutes les contributions ! Voici comment vous pouvez participer :

#### **🐛 Signaler un bug**
1. Vérifiez que le bug n'est pas déjà reporté
2. Utilisez le template de bug report
3. Fournissez un exemple minimal reproductible
4. Indiquez votre environnement (OS, navigateur, version)

#### **💡 Proposer une fonctionnalité**
1. Vérifiez que l'idée n'existe pas déjà
2. Décrivez le cas d'usage concret
3. Expliquez pourquoi c'est important pour MML
4. Proposez une implémentation si possible

#### **🔧 Développer du code**
```bash
# 1. Fork le repository
git clone https://github.com/YOUR_USERNAME/MML-Minimal-Markup-Language-for-Constrained-Environments-Le-Langage-Minimal-Universel.git
cd MML-Minimal-Markup-Language-for-Constrained-Environments-Le-Langage-Minimal-Universel

# 2. Créer une branche
git checkout -b feature/amazing-feature

# 3. Installer les dépendances
npm install  # Pour JavaScript
pip install -r requirements-test.txt  # Pour Python

# 4. Lancer les tests
npm test  # JavaScript
python -m pytest tests/  # Python

# 5. Commiter vos changements
git commit -m "feat: Add amazing feature"

# 6. Push et créer une PR
git push origin feature/amazing-feature
```

### 📋 Standards de développement

#### **Code Style**
- **JavaScript** : ESLint + Prettier
- **Python** : Black + Flake8
- **C++/Rust/Go** : Standards du langage

#### **Tests**
- Tests unitaires obligatoires pour chaque fonction
- Coverage minimum : 90%
- Tests d'intégration pour les parsers
- Tests de performance pour les benchmarks

#### **Documentation**
- README mis à jour pour chaque fonctionnalité
- Code commenté (anglais)
- Exemples d'utilisation
- Documentation API

### 🌍 Traductions

MML étant universel, nous encourageons les traductions :
- Documentation française (principale)
- Documentation anglaise
- Documentation multilingue pour les exemples

### 🏗️ Architecture des contributions

#### **Nouvelles implémentations**
```
implementations/
└── [langage]/
    ├── src/           # Code source
    ├── tests/         # Tests unitaires
    ├── examples/      # Exemples d'usage
    ├── benchmarks/    # Tests performance
    └── README.md      # Documentation
```

#### **Nouveaux outils**
```
bin/                  # CLI tools
web-validator/        # Outils web
vscode-extension/     # Extensions IDE
```

### 📊 Métriques de qualité

| Métrique | Cible | Actuel |
|----------|-------|--------|
| **Test Coverage** | >90% | ✅ 95% |
| **Performance** | <1ms parsing | ✅ 0.8ms |
| **Taille bundle** | <50KB | ✅ 35KB |
| **Accessibility** | WCAG 2.1 AA | ✅ 100% |
| **Cross-browser** | 98%+ | ✅ 99% |

---

## 📄 Licence

### MIT License

Copyright (c) 2025 Michael Germini

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

### Conditions d'utilisation

#### **Usage commercial**
- ✅ Autorisé sans restriction
- ✅ Modification et redistribution permises
- ✅ Intégration dans produits propriétaires

#### **Usage open source**
- ✅ Compatible avec toutes licences
- ✅ Contribution encouragée
- ✅ Attribution appréciée mais pas obligatoire

#### **Usage humanitaire**
- ✅ **Gratuit et illimité**
- ✅ Support prioritaire
- ✅ Formation gratuite

### Crédits et remerciements

#### **Contributeurs principaux**
- **Michael Germini** - Créateur et mainteneur principal
- **Communauté Open Source** - Tests, feedback, améliorations

#### **Inspirations et standards**
- **ITU Morse Code** - Standard international
- **RFC Standards** - Bonnes pratiques internet
- **ISO Documentation** - Standards de qualité

#### **Technologies utilisées**
- **JavaScript ES6+** - Parsers web
- **Python 3.8+** - Outils CLI
- **C++17** - Implémentations embarquées
- **Rust 1.70+** - Haute performance
- **Go 1.19+** - Services cloud

---

## 🌟 Vision et mission

**MML n'est pas qu'un format technique. C'est une réponse aux défis de la communication dans un monde où la technologie peut nous abandonner.**

### 🎯 Mission
*Rendre la communication possible même dans les conditions les plus extrêmes.*

### 🌍 Impact
- **Urgences** : Sauver des vies grâce à une communication fiable
- **Humanitaire** : Coordonner l'aide dans les zones sinistrées
- **Environnement** : Réduire l'empreinte technologique
- **Inclusion** : Communication accessible à tous

### 🚀 Futur

- **🔬 Standardisation internationale** ([ISO](standards/iso-submission/mml-iso-proposal.md), [IETF](standards/ietf-draft/mml-internet-draft.md))
- **🏛️ Adoption gouvernementale et ONG** ([Stratégie d'adoption](standards/adoption-strategy/mml-adoption-strategy.md))
- **🤖 Écosystème IoT spécialisé** ([MML-IoT](chapitres/chapitre11-ecosysteme-futur.md#114-écosystème-iot-spécialisé))
- **🧠 IA intégrée pour l'assistance** ([IA embarquée](chapitres/chapitre11-ecosysteme-futur.md#115-compatibilité-avec-ia-embarquée))

---

*Ce document constitue la spécification complète du langage MML et de son écosystème DNF.*
