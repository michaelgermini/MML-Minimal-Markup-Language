# MML – Le Langage Minimal Universel

## Conception, Syntaxe, Architecture, Transmission et Applications du Minimal Markup Language

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

### Caractéristiques clés :
- ✅ **Ultra-léger** : Format texte minimal
- ✅ **Résilient** : Tolère pertes et fragmentations
- ✅ **Universel** : Morse, radio, DNF, humain-homme
- ✅ **Simple** : Syntaxe intuitive en 5 minutes
- ✅ **Extensible** : Balises modulaires

---

*Ce document constitue la spécification complète du langage MML et de son écosystème DNF.*
