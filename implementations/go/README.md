# MML Parser - Implémentation Go

Parser MML haute performance écrit en Go, optimisé pour les services web et les applications serveur.

## Caractéristiques

### ✅ Haute performance
- **Parsing rapide** : Optimisé pour le débit élevé
- **Mémoire efficace** : Gestion fine de l'allocation
- **Goroutines** : Support de la concurrence
- **Zero-copy** : Quand possible pour les gros volumes

### ✅ Production-ready
- **Gestion d'erreurs robuste** : Récupération graceful
- **Logging structuré** : Observabilité complète
- **Métriques intégrées** : Monitoring et statistiques
- **Tests complets** : Couverture >85%

### ✅ Écosystème Go
- **Modules Go** : Gestion moderne des dépendances
- **Interfaces idiomatiques** : API Go native
- **Documentation godoc** : Génération automatique
- **Benchmarks intégrés** : Performances mesurées

### ✅ Services web
- **HTTP handlers** : Intégration web facile
- **Middleware** : Authentification et validation
- **API REST** : Endpoints prêts à l'emploi
- **WebSocket** : Temps réel

## Installation

### Prérequis
```bash
# Installer Go 1.21+
go version

# Cloner le dépôt
git clone https://github.com/mml-lang/mml-go.git
cd mml-go
```

### Installation
```bash
# Installer le package
go install github.com/mml-lang/mml-go

# Ou ajouter aux dépendances
go mod init myproject
go get github.com/mml-lang/mml-go
```

### Compilation
```bash
# Compiler l'exemple
go build -o example example.go

# Compiler le CLI
go build -o mml-cli main.go

# Build optimisé pour production
go build -ldflags="-s -w" -o mml-cli main.go
```

## Utilisation de base

### Parsing simple
```go
package main

import (
    "fmt"
    "log"

    "github.com/mml-lang/mml-go/mml"
)

func main() {
    parser := mml.NewParser()

    mmlText := `T:Mon document
H:Introduction
P:Ceci est un paragraphe
M:Auteur|Jean Dupont`

    doc, err := parser.Parse(mmlText)
    if err != nil {
        log.Fatal(err)
    }

    fmt.Printf("Titre: %s\n", doc.Title)
    fmt.Printf("Sections: %d\n", len(doc.Sections))
}
```

### Parsing avec options
```go
options := mml.DefaultParserOptions()
options.StrictMode = true
options.MeasureTime = true
options.MaxSections = 50

parser := mml.NewParserWithOptions(options)
doc, err := parser.Parse(largeDocument)
// doc.Stats.ParseTimeMs contient le temps de parsing
```

### Validation
```go
err := parser.Validate(mmlText)
if err != nil {
    if errCollection, ok := err.(*mml.ErrorCollection); ok {
        fmt.Printf("Erreurs trouvées: %d\n", len(errCollection.Errors))
        for _, e := range errCollection.Errors {
            fmt.Printf("- %s\n", e.Error())
        }
    }
}
```

### Conversions
```go
// HTML
html := parser.ToHTML(doc)

// JSON
json, err := doc.ToJSON()

// YAML
yaml, err := doc.ToYAML()

// Texte brut
text := parser.ToPlainText(doc)

// MMLC compressé
compressed := parser.Compress(doc, mml.CompressionBasic)
```

## API avancée

### Parsing concurrent
```go
func parseConcurrent(documents []string) []*mml.Document {
    var wg sync.WaitGroup
    results := make([]*mml.Document, len(documents))

    for i, doc := range documents {
        wg.Add(1)
        go func(index int, content string) {
            defer wg.Done()
            parser := mml.NewParser()
            parsed, err := parser.Parse(content)
            if err == nil {
                results[index] = parsed
            }
        }(i, doc)
    }

    wg.Wait()
    return results
}
```

### Streaming parser
```go
func parseStream(reader io.Reader) (*mml.Document, error) {
    scanner := bufio.NewScanner(reader)
    parser := mml.NewParser()

    var content strings.Builder
    for scanner.Scan() {
        content.WriteString(scanner.Text())
        content.WriteString("\n")

        // Parse partiellement si nécessaire
        if content.Len() > 1000 {
            partial, err := parser.Parse(content.String())
            if err != nil {
                return nil, err
            }
            // Traiter le document partiel...
            content.Reset()
        }
    }

    return parser.Parse(content.String())
}
```

### Gestion d'erreurs détaillée
```go
doc, err := parser.Parse(malformedMML)
if err != nil {
    if errCollection, ok := err.(*mml.ErrorCollection); ok {
        // Filtrer par sévérité
        criticalErrors := errCollection.FilterBySeverity(mml.SeverityCritical)
        recoverableErrors := errCollection.RecoverableErrors()

        // Traiter différemment selon la sévérité
        for _, e := range criticalErrors {
            log.Fatal(e.Error())
        }

        for _, e := range recoverableErrors {
            log.Warn(e.Error())
        }
    }
}
```

### Métriques et monitoring
```go
doc, err := parser.Parse(content)
if err == nil {
    stats := parser.GetStatistics(doc)
    fmt.Print(stats)

    // Métriques pour monitoring
    if doc.Stats.ParseTimeMs > 100 {
        log.Warn("Parsing lent détecté")
    }

    if doc.Stats.ErrorLines > 0 {
        log.Info("Erreurs de parsing détectées")
    }
}
```

## CLI - Interface en ligne de commande

### Installation
```bash
go install github.com/mml-lang/mml-go@main
```

### Utilisation
```bash
# Validation
mml-cli -command validate document.mml

# Conversion
mml-cli -command convert -format html document.mml page.html
mml-cli -command convert -format json document.mml data.json

# Compression
mml-cli -command compress document.mml compressed.mml

# Statistiques
mml-cli -command stats -verbose document.mml

# Mode pipeline
cat document.mml | mml-cli -command convert -format json > data.json
```

### Options avancées
```bash
# Validation stricte
mml-cli -command validate -strict document.mml

# Sortie verbeuse
mml-cli -command convert -format html -verbose document.mml page.html

# Entrée/sortie personnalisée
mml-cli -command convert -input doc.mml -output page.html -format html
```

## Intégration web

### HTTP handler simple
```go
func mmlHandler(w http.ResponseWriter, r *http.Request) {
    if r.Method != http.MethodPost {
        http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
        return
    }

    body, err := io.ReadAll(r.Body)
    if err != nil {
        http.Error(w, "Bad request", http.StatusBadRequest)
        return
    }

    parser := mml.NewParser()
    doc, err := parser.Parse(string(body))
    if err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }

    // Retourner en JSON
    w.Header().Set("Content-Type", "application/json")
    json, _ := doc.ToJSON()
    w.Write([]byte(json))
}

func main() {
    http.HandleFunc("/parse", mmlHandler)
    log.Fatal(http.ListenAndServe(":8080", nil))
}
```

### Middleware d'authentification
```go
func authMiddleware(next http.HandlerFunc) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        // Vérifier l'authentification
        if !isAuthenticated(r) {
            http.Error(w, "Unauthorized", http.StatusUnauthorized)
            return
        }
        next(w, r)
    }
}

func parseHandler(w http.ResponseWriter, r *http.Request) {
    // Parsing avec authentification
    body, _ := io.ReadAll(r.Body)
    parser := mml.NewParser()

    doc, err := parser.Parse(string(body))
    if err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }

    json, _ := doc.ToJSON()
    w.Write([]byte(json))
}

func main() {
    http.HandleFunc("/parse", authMiddleware(parseHandler))
    log.Fatal(http.ListenAndServe(":8080", nil))
}
```

### API REST complète
```go
type MMLService struct {
    parser *mml.Parser
}

func (s *MMLService) parseDocument(w http.ResponseWriter, r *http.Request) {
    var req struct {
        Content string `json:"content"`
        Format  string `json:"format,omitempty"`
    }

    if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
        http.Error(w, "Invalid JSON", http.StatusBadRequest)
        return
    }

    doc, err := s.parser.Parse(req.Content)
    if err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }

    format := req.Format
    if format == "" {
        format = "json"
    }

    var response string
    switch format {
    case "html":
        response = s.parser.ToHTML(doc)
        w.Header().Set("Content-Type", "text/html")
    case "json":
        response, _ = doc.ToJSON()
        w.Header().Set("Content-Type", "application/json")
    case "yaml":
        response, _ = doc.ToYAML()
        w.Header().Set("Content-Type", "application/yaml")
    default:
        http.Error(w, "Unsupported format", http.StatusBadRequest)
        return
    }

    w.Write([]byte(response))
}
```

## Benchmarks de performance

### Configuration des tests
```bash
# Installer les outils de benchmark
go install golang.org/x/tools/cmd/benchcmp@latest

# Lancer les benchmarks
go test -bench=. -benchmem ./...

# Comparer les résultats
benchcmp old.txt new.txt
```

### Résultats typiques (sur machine moderne)
```
BenchmarkParseSmall-8          500000    2500 ns/op    1024 B/op    15 allocs/op
BenchmarkParseMedium-8          50000   28500 ns/op   15360 B/op   234 allocs/op
BenchmarkParseLarge-8            2000  750000 ns/op  524288 B/op  4096 allocs/op
BenchmarkValidate-8            100000   15200 ns/op     512 B/op     8 allocs/op
BenchmarkToJSON-8              500000    3200 ns/op    2048 B/op    45 allocs/op
BenchmarkToHTML-8              300000    4800 ns/op    3072 B/op    67 allocs/op
```

### Optimisations
- **Pool d'objets** : Réutilisation des parsers
- **Buffer pooling** : Gestion des tampons
- **Lazy evaluation** : Parsing à la demande
- **SIMD** : Accélération vectorielle

## Tests et qualité

### Exécution des tests
```bash
# Tests unitaires
go test ./...

# Tests avec couverture
go test -cover ./...

# Tests de performance
go test -bench=. -benchmem ./...

# Tests de course de données
go test -race ./...

# Tests d'intégration
go test -tags=integration ./...
```

### Tests d'exemple
```bash
# Compiler et exécuter l'exemple
go run example.go

# CLI en mode développement
go run main.go -command validate example.mml
```

## Contribution

### Développement
```bash
# Fork et clone
git clone https://github.com/your-username/mml-go.git

# Configuration
go mod tidy

# Tests avant commit
go test -v ./...
go vet ./...
golint ./...

# Benchmarks
go test -bench=. -benchmem ./...
```

### Guidelines
- **Code style** : `go fmt` automatique
- **Tests** : Couverture >85%
- **Documentation** : Tout public API documenté
- **Performance** : Benchmarks pour les changements critiques
- **API stability** : Compatibilité ascendante

### Pull Requests
1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/amazing-feature`)
3. Écrire des tests
4. Implémenter la fonctionnalité
5. Vérifier les benchmarks
6. Commiter (`git commit -m 'Add amazing feature'`)
7. Push et créer une PR

## Licence et support

### Licence
Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.

### Support
- **Documentation** : <https://pkg.go.dev/github.com/mml-lang/mml-go>
- **Issues** : <https://github.com/mml-lang/mml-go/issues>
- **Discussions** : <https://github.com/mml-lang/mml-go/discussions>

### Versions supportées
- **Go** : 1.21+ (modules requis)
- **OS** : Linux, macOS, Windows, FreeBSD
- **Architectures** : amd64, arm64, 386

---

**Cette implémentation Go offre les meilleures performances pour les services web tout en maintenant la simplicité d'utilisation et la robustesse du langage MML.**
