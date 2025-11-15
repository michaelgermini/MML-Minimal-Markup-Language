# Tests du projet MML

Ce dossier contient les tests unitaires pour les parsers MML JavaScript et Python.

## Structure des tests

```
tests/
├── mml-parser.test.js     # Tests pour le parser JavaScript
├── test_mml_parser.py     # Tests pour le parser Python
└── README.md             # Cette documentation
```

## Exécution des tests

### Prérequis

#### Pour les tests JavaScript
```bash
npm install
```

#### Pour les tests Python
```bash
pip install -r requirements-test.txt
```

### Exécution

#### Tests JavaScript (Jest)
```bash
# Exécuter tous les tests
npm test

# Exécuter avec couverture
npm run test:coverage

# Exécuter en mode watch
npm run test:watch
```

#### Tests Python (pytest)
```bash
# Exécuter tous les tests
pytest

# Exécuter avec couverture
pytest --cov=implementations

# Exécuter un test spécifique
pytest tests/test_mml_parser.py::TestMMLParser::test_parse_minimal_document
```

## Métriques de couverture

Les tests visent une couverture de code d'au moins 80% pour :
- **Lignes de code**
- **Branches conditionnelles**
- **Fonctions**

## Types de tests

### Tests unitaires
- **Parsing de base** : Titres, sections, paragraphes
- **Métadonnées** : Globales et de section
- **Liens et médias** : Images, liens, blocs de code
- **Gestion d'erreurs** : Inputs invalides, balises inconnues

### Tests d'intégration
- **Conversion HTML** : Génération de pages web
- **Conversion JSON** : Sérialisation structurée
- **Documents complexes** : Parsing de documents complets

### Tests de performance
- **Documents volumineux** : 1000+ lignes
- **Temps d'exécution** : < 100ms pour documents moyens
- **Utilisation mémoire** : Optimisation des ressources

### Tests de robustesse
- **Cas limites** : Documents vides, lignes malformées
- **Espaces et formatage** : Gestion des variations
- **Encodage** : Support UTF-8, caractères spéciaux

## Ajout de nouveaux tests

### Structure recommandée

```javascript
describe('Nouvelle fonctionnalité', () => {
  test('devrait faire quelque chose', () => {
    // Arrange
    const input = 'MML content';

    // Act
    const result = parser.parse(input);

    // Assert
    expect(result).toBe(expected);
  });
});
```

### Bonnes pratiques

1. **Noms descriptifs** : `test_parse_title_override`
2. **Un seul concept par test** : Chaque test valide un comportement spécifique
3. **Arrange-Act-Assert** : Structure claire des tests
4. **Données de test** : Utiliser des constantes pour les inputs répétés
5. **Assertions précises** : Vérifier exactement ce qui est attendu

## Résultats attendus

### Tests JavaScript
```bash
PASS tests/mml-parser.test.js
Test Suites: 1 passed, 1 total
Tests: 25 passed, 0 failed
Coverage: Lines 85%, Functions 90%, Branches 80%
```

### Tests Python
```bash
========================= test session starts ========================
tests/test_mml_parser.py::TestMMLParser::test_initialization PASSED
tests/test_mml_parser.py::TestMMLParser::test_parse_minimal_document PASSED
...
========================= 25 passed, 0 failed ========================
Coverage: 82% (85 lines covered out of 103)
```

## Debugging

### Tests qui échouent

1. **Vérifier les chemins d'import** : S'assurer que les modules sont correctement importés
2. **Vérifier les données de test** : Les inputs correspondent-ils aux attentes ?
3. **Vérifier les assertions** : Les valeurs attendues sont-elles correctes ?
4. **Logs de debug** : Ajouter des `console.log` temporaires si nécessaire

### Performance

Si les tests sont lents :
1. **Réduire la taille des données de test**
2. **Utiliser des mocks** pour les opérations coûteuses
3. **Paralléliser les tests** si possible
4. **Optimiser les parsers** si nécessaire

## Contribution

### Ajout de tests
1. Créer un nouveau fichier de test dans `tests/`
2. Suivre la convention de nommage
3. Ajouter la documentation appropriée
4. Vérifier que tous les tests passent

### Maintenance
- **Mettre à jour les tests** lors de changements dans les parsers
- **Maintenir la couverture** au-dessus du seuil minimum
- **Nettoyer les tests obsolètes** régulièrement

---

*Ces tests assurent la fiabilité et la robustesse des parsers MML à travers tous les environnements et cas d'usage.*
