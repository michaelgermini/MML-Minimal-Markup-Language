package main

import (
	"flag"
	"fmt"
	"io"
	"os"
	"strings"

	"github.com/mml-lang/mml-go/mml"
)

func main() {
	var (
		inputFile  = flag.String("input", "", "Input file (default: stdin)")
		outputFile = flag.String("output", "", "Output file (default: stdout)")
		format     = flag.String("format", "html", "Output format: html, json, yaml, text, mmlc")
		command    = flag.String("command", "convert", "Command: convert, validate, stats, compress")
		strict     = flag.Bool("strict", false, "Strict validation mode")
		verbose    = flag.Bool("verbose", false, "Verbose output")
	)

	flag.Parse()

	// Validate format
	validFormats := map[string]bool{
		"html": true, "json": true, "yaml": true, "text": true, "mmlc": true,
	}
	if !validFormats[*format] {
		fmt.Fprintf(os.Stderr, "Error: Invalid format '%s'. Valid formats: html, json, yaml, text, mmlc\n", *format)
		os.Exit(1)
	}

	// Read input
	input, err := readInput(*inputFile)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error reading input: %v\n", err)
		os.Exit(1)
	}

	// Create parser with options
	options := mml.DefaultParserOptions()
	if *strict {
		options.StrictMode = true
	}
	options.MeasureTime = *verbose

	parser := mml.NewParserWithOptions(options)

	// Execute command
	switch *command {
	case "validate":
		err = validateCommand(parser, input, *verbose)
	case "convert":
		err = convertCommand(parser, input, *outputFile, *format, *verbose)
	case "stats":
		err = statsCommand(parser, input, *verbose)
	case "compress":
		err = compressCommand(parser, input, *outputFile, *verbose)
	default:
		fmt.Fprintf(os.Stderr, "Error: Unknown command '%s'\n", *command)
		os.Exit(1)
		return
	}

	if err != nil {
		fmt.Fprintf(os.Stderr, "Error: %v\n", err)
		os.Exit(1)
	}
}

func readInput(filename string) (string, error) {
	if filename == "" || filename == "-" {
		// Read from stdin
		data, err := io.ReadAll(os.Stdin)
		return string(data), err
	}

	// Read from file
	data, err := os.ReadFile(filename)
	return string(data), err
}

func writeOutput(filename, content string) error {
	if filename == "" || filename == "-" {
		// Write to stdout
		fmt.Print(content)
		return nil
	}

	// Write to file
	return os.WriteFile(filename, []byte(content), 0644)
}

func validateCommand(parser *mml.Parser, input string, verbose bool) error {
	err := parser.Validate(input)
	if err != nil {
		if mmlErr, ok := err.(*mml.ErrorCollection); ok {
			if verbose {
				fmt.Fprintln(os.Stderr, mmlErr.String())
			} else {
				fmt.Fprintf(os.Stderr, "❌ Validation failed: %v\n", err)
			}
		}
		return err
	}

	if verbose {
		fmt.Fprintln(os.Stderr, "✅ Document MML valide")
	} else {
		fmt.Println("valid")
	}

	return nil
}

func convertCommand(parser *mml.Parser, input, outputFile, format string, verbose bool) error {
	doc, err := parser.Parse(input)
	if err != nil {
		return fmt.Errorf("parsing failed: %w", err)
	}

	var output string

	switch format {
	case "html":
		output = parser.ToHTML(doc)
	case "json":
		output, err = doc.ToJSON()
		if err != nil {
			return fmt.Errorf("JSON conversion failed: %w", err)
		}
	case "yaml":
		output, err = doc.ToYAML()
		if err != nil {
			return fmt.Errorf("YAML conversion failed: %w", err)
		}
	case "text":
		output = parser.ToPlainText(doc)
	case "mmlc":
		output = parser.Compress(doc, mml.CompressionBasic)
	default:
		return fmt.Errorf("unsupported format: %s", format)
	}

	err = writeOutput(outputFile, output)
	if err != nil {
		return fmt.Errorf("writing output failed: %w", err)
	}

	if verbose {
		fmt.Fprintf(os.Stderr, "✅ Conversion réussie: %s → %s\n", getInputDesc(input), format)
		if outputFile != "" && outputFile != "-" {
			fmt.Fprintf(os.Stderr, "Fichier écrit: %s\n", outputFile)
		}
	}

	return nil
}

func statsCommand(parser *mml.Parser, input string, verbose bool) error {
	doc, err := parser.Parse(input)
	if err != nil {
		return fmt.Errorf("parsing failed: %w", err)
	}

	stats := parser.GetStatistics(doc)
	fmt.Print(stats)

	if verbose {
		// Additional detailed statistics
		fmt.Fprintf(os.Stderr, "\n\n📋 Détails:\n")
		for i, section := range doc.Sections {
			fmt.Fprintf(os.Stderr, "  Section %d: '%s' (%d liens, %d images, %d métadonnées)\n",
				i+1, section.Title, len(section.Links), len(section.Images), len(section.Metadata))

			if section.Content != "" {
				preview := section.Content
				if len(preview) > 50 {
					preview = preview[:47] + "..."
				}
				fmt.Fprintf(os.Stderr, "    Contenu: \"%s\"\n", preview)
			}
		}

		if len(doc.Metadata) > 0 {
			fmt.Fprintln(os.Stderr, "\n🔖 Métadonnées globales:")
			for key, value := range doc.Metadata {
				fmt.Fprintf(os.Stderr, "  %s: %s\n", key, value)
			}
		}
	}

	return nil
}

func compressCommand(parser *mml.Parser, input, outputFile string, verbose bool) error {
	doc, err := parser.Parse(input)
	if err != nil {
		return fmt.Errorf("parsing failed: %w", err)
	}

	compressed := parser.Compress(doc, mml.CompressionBasic)

	err = writeOutput(outputFile, compressed)
	if err != nil {
		return fmt.Errorf("writing output failed: %w", err)
	}

	if verbose {
		originalSize := len(input)
		compressedSize := len(compressed)
		if originalSize > 0 {
			compressionRatio := float64(originalSize-compressedSize) / float64(originalSize) * 100
			fmt.Fprintf(os.Stderr, "🗜️ Compression: %d → %d octets (%.1f%% de réduction)\n",
				originalSize, compressedSize, compressionRatio)
		}
	}

	return nil
}

func getInputDesc(input string) string {
	lines := strings.Count(input, "\n") + 1
	chars := len(input)
	return fmt.Sprintf("%d lignes, %d caractères", lines, chars)
}
