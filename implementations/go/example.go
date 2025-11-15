package main

import (
	"fmt"
	"log"

	"github.com/mml-lang/mml-go/mml"
)

func main() {
	fmt.Println("🚀 Exemple d'utilisation du parser MML Go")
	fmt.Println("========================================\n")

	// Document MML d'exemple
	mmlDocument := `
T:Rapport d'urgence - Incendie
M:ID|INC-2025-001
M:Priorité|CRITIQUE
M:Localisation|Forêt domaniale secteur 7

H:Situation actuelle
P:Incendie de forêt déclaré à 14h30
M:Surface|450 hectares
M:Vent|25 km/h NNE
P:Front de feu progressant vers le Sud-Est

H:Moyens engagés
P:3 Canadairs en rotation
P:45 sapeurs-pompiers au sol
M:Effectifs|45
M:Aériens|5 appareils

H:Actions requises
P:Évacuation zone rouge immédiate
P:Renforts aériens supplémentaires
L:Carte secteur|cartes/incendie-secteur7.png
IMG:Photo incendie|photos/incendie-1500h.jpg

Q:La rapidité sauve des vies - priorité absolue
`

	fmt.Println("📄 Document MML d'exemple :")
	fmt.Println(mmlDocument)
	fmt.Println("---\n")

	// Créer un parser avec options personnalisées
	options := mml.DefaultParserOptions()
	options.MeasureTime = true
	options.StrictMode = false

	parser := mml.NewParserWithOptions(options)

	// Parsing du document
	fmt.Println("🔍 Parsing du document...")
	doc, err := parser.Parse(mmlDocument)
	if err != nil {
		if errCollection, ok := err.(*mml.ErrorCollection); ok && errCollection.HasErrors() {
			fmt.Printf("⚠️ Avertissements de parsing:\n")
			for _, e := range errCollection.Errors {
				fmt.Printf("  - %s\n", e.Error())
			}
			fmt.Println()
		} else {
			log.Fatalf("❌ Erreur de parsing: %v", err)
		}
	} else {
		fmt.Println("✅ Parsing réussi !\n")
	}

	// Affichage des informations du document
	displayDocumentInfo(doc)

	// Validation du document
	fmt.Println("🔍 Validation du document...")
	if err := doc.Validate(); err != nil {
		fmt.Printf("❌ Document invalide: %v\n", err)
	} else {
		fmt.Println("✅ Document valide")
	}

	// Démonstration des conversions
	demonstrateConversions(parser, doc)

	// Affichage des statistiques détaillées
	fmt.Println("📊 Statistiques détaillées :")
	fmt.Println(parser.GetStatistics(doc))

	fmt.Println("\n✨ Exemple terminé avec succès !")
}

func displayDocumentInfo(doc *mml.Document) {
	fmt.Println("📊 Informations du document :")
	fmt.Printf("  Titre: %s\n", checkMark(doc.Title != ""))
	fmt.Printf("  Sections: %d\n", len(doc.Sections))
	fmt.Printf("  Métadonnées globales: %d\n", len(doc.Metadata))
	fmt.Printf("  Liens globaux: %d\n", len(doc.Links))

	// Affichage des métadonnées
	if len(doc.Metadata) > 0 {
		fmt.Println("  🔖 Métadonnées:")
		for key, value := range doc.Metadata {
			fmt.Printf("    %s: %s\n", key, value)
		}
	}

	// Affichage des sections
	fmt.Println("  📑 Sections:")
	for i, section := range doc.Sections {
		fmt.Printf("    %d. '%s' (%d liens, %d images, %d métadonnées)\n",
			i+1, section.Title, len(section.Links), len(section.Images), len(section.Metadata))

		if section.Content != "" {
			preview := section.Content
			if len(preview) > 50 {
				preview = preview[:47] + "..."
			}
			fmt.Printf("       \"%s\"\n", preview)
		}
	}
	fmt.Println()
}

func demonstrateConversions(parser *mml.Parser, doc *mml.Document) {
	fmt.Println("🔄 Démonstration des conversions :\n")

	// Conversion HTML (aperçu)
	fmt.Println("🌐 Format HTML (aperçu) :")
	html := parser.ToHTML(doc)
	// Afficher seulement les premières lignes
	lines := make([]string, 0)
	current := 0
	for i, char := range html {
		if char == '\n' {
			lines = append(lines, html[current:i])
			current = i + 1
			if len(lines) >= 10 {
				break
			}
		}
	}
	for _, line := range lines {
		fmt.Printf("  %s\n", line)
	}
	if len(html) > 500 {
		fmt.Println("  ... (tronqué)")
	}
	fmt.Println()

	// Conversion JSON (aperçu)
	fmt.Println("📋 Format JSON (aperçu) :")
	json, err := doc.ToJSON()
	if err != nil {
		fmt.Printf("❌ Erreur JSON: %v\n", err)
	} else {
		// Afficher seulement les premières lignes
		lines := make([]string, 0)
		current := 0
		lineCount := 0
		for i, char := range json {
			if char == '\n' {
				lines = append(lines, json[current:i])
				current = i + 1
				lineCount++
				if lineCount >= 8 {
					break
				}
			}
		}
		for _, line := range lines {
			fmt.Printf("  %s\n", line)
		}
		if len(json) > 300 {
			fmt.Println("  ... (tronqué)")
		}
	}
	fmt.Println()

	// Conversion texte brut
	fmt.Println("📄 Format texte brut :")
	text := parser.ToPlainText(doc)
	lines = make([]string, 0)
	for _, line := range strings.Split(text, "\n") {
		lines = append(lines, line)
		if len(lines) >= 10 {
			break
		}
	}
	for _, line := range lines {
		if line != "" {
			fmt.Printf("  %s\n", line)
		}
	}
	fmt.Println()

	// Compression MMLC
	fmt.Println("🗜️ Format MMLC compressé :")
	compressed := parser.Compress(doc, mml.CompressionBasic)
	lines = make([]string, 0)
	for _, line := range strings.Split(compressed, "\n") {
		lines = append(lines, line)
		if len(lines) >= 8 {
			break
		}
	}
	for _, line := range lines {
		fmt.Printf("  %s\n", line)
	}
	if strings.Count(compressed, "\n") > 8 {
		fmt.Println("  ... (tronqué)")
	}

	// Statistiques de compression
	originalSize := len(mmlDocument)
	compressedSize := len(compressed)
	if originalSize > 0 {
		compressionRatio := float64(originalSize-compressedSize) / float64(originalSize) * 100
		fmt.Printf("\n📊 Taille: %d → %d caractères (%.1f%% de réduction)\n",
			originalSize, compressedSize, compressionRatio)
	}
	fmt.Println()
}

func checkMark(condition bool) string {
	if condition {
		return "✅"
	}
	return "❌"
}
