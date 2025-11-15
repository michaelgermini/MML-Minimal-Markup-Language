// Package mml provides MML parsing functionality
package mml

import (
	"bufio"
	"fmt"
	"regexp"
	"strconv"
	"strings"
	"time"
	"unicode"
)

// Parser represents an MML parser instance
type Parser struct {
	options ParserOptions
}

// NewParser creates a new parser with default options
func NewParser() *Parser {
	return &Parser{
		options: DefaultParserOptions(),
	}
}

// NewParserWithOptions creates a parser with custom options
func NewParserWithOptions(options ParserOptions) *Parser {
	return &Parser{
		options: options,
	}
}

// Parse parses MML text into a Document
func (p *Parser) Parse(input string) (*Document, error) {
	startTime := time.Now()

	doc := &Document{
		Metadata: make(map[string]string),
		Sections: make([]Section, 0),
		Links:    make([]Link, 0),
	}

	var currentSection *Section
	var errors ErrorCollection

	scanner := bufio.NewScanner(strings.NewReader(input))
	lineNum := 0

	for scanner.Scan() {
		lineNum++
		line := strings.TrimSpace(scanner.Text())

		// Skip empty lines
		if line == "" {
			continue
		}

		parsedLine, err := p.parseLine(line, lineNum)
		if err != nil {
			errors.Add(*err)
			if p.options.StrictMode {
				return nil, &errors
			}
			continue
		}

		// Apply parsed line to document
		err = p.applyParsedLine(doc, &currentSection, parsedLine, lineNum)
		if err != nil {
			errors.Add(*err)
			if p.options.StrictMode {
				return nil, &errors
			}
			continue
		}

		doc.Stats.ParsedLines++
	}

	doc.Stats.TotalLines = lineNum

	// Set parse time if requested
	if p.options.MeasureTime {
		doc.Stats.ParseTimeMs = int(time.Since(startTime).Milliseconds())
	}

	doc.Stats.ErrorLines = len(errors.Errors)

	// Return document with errors if any (non-strict mode)
	if errors.HasErrors() && !p.options.StrictMode {
		return doc, &errors
	}

	return doc, nil
}

// Validate checks MML syntax without creating a document
func (p *Parser) Validate(input string) error {
	scanner := bufio.NewScanner(strings.NewReader(input))
	lineNum := 0
	var errors ErrorCollection

	for scanner.Scan() {
		lineNum++
		line := strings.TrimSpace(scanner.Text())

		if line == "" {
			continue
		}

		_, err := p.parseLine(line, lineNum)
		if err != nil {
			errors.Add(*err)
			if p.options.StrictMode {
				return &errors
			}
		}
	}

	if errors.HasErrors() {
		return &errors
	}

	return nil
}

// parseLine parses a single line of MML
func (p *Parser) parseLine(line string, lineNum int) (*ParsedLine, *MMLError) {
	// Use regex to split tag and content
	re := regexp.MustCompile(`^([^:]+):(.*)$`)
	matches := re.FindStringSubmatch(line)

	if matches == nil {
		return nil, NewSyntaxError(lineNum, 1, line, "TAG:content", "Use format 'TAG:content' where TAG is a valid MML tag")
	}

	tagStr := strings.TrimSpace(matches[1])
	content := strings.TrimSpace(matches[2])

	tag := ParseTag(tagStr)
	if tag == TagUnknown && !p.options.AllowUnknown {
		return nil, NewUnknownTagError(tagStr, lineNum, "Use a valid MML tag like T, H, P, M, L, etc.")
	}

	return &ParsedLine{
		Tag:     tag,
		Content: content,
		LineNum:  lineNum,
	}, nil
}

// applyParsedLine applies a parsed line to the document
func (p *Parser) applyParsedLine(doc *Document, currentSection **Section, parsedLine *ParsedLine, lineNum int) *MMLError {
	switch parsedLine.Tag {
	case TagTitle:
		doc.Title = parsedLine.Content

	case TagSection:
		if len(doc.Sections) >= p.options.MaxSections {
			return NewLimitExceededError("sections", len(doc.Sections), p.options.MaxSections,
				"Split document into multiple files or increase section limit")
		}

		section := Section{
			Title:    parsedLine.Content,
			Metadata: make(map[string]string),
			Links:    make([]Link, 0),
			Images:   make([]Image, 0),
		}
		doc.Sections = append(doc.Sections, section)
		*currentSection = &doc.Sections[len(doc.Sections)-1]

	case TagParagraph:
		if *currentSection == nil {
			// Allow paragraphs without sections in non-strict mode
			if !p.options.AllowUnknown {
				return NewStructureError("paragraph without section",
					"Add a section (H:) before paragraphs or enable AllowUnknown option")
			}
			return nil
		}
		(*currentSection).Content = parsedLine.Content

	case TagMetadata:
		return p.parseMetadata(doc, currentSection, parsedLine.Content, lineNum)

	case TagLink:
		return p.parseLink(doc, currentSection, parsedLine.Content, lineNum)

	case TagImage:
		return p.parseImage(doc, currentSection, parsedLine.Content, lineNum)

	case TagCode:
		if *currentSection != nil {
			(*currentSection).Content = fmt.Sprintf("```\n%s\n```", parsedLine.Content)
		}

	case TagQuote:
		if *currentSection != nil {
			(*currentSection).Content = fmt.Sprintf("> %s", parsedLine.Content)
		}

	case TagConfig, TagPacket:
		// Store as global metadata for now
		doc.Metadata[string(rune(int(parsedLine.Tag)))+"_"+strconv.Itoa(lineNum)] = parsedLine.Content

	default:
		// Unknown tags are ignored in non-strict mode
		if !p.options.AllowUnknown {
			return NewUnknownTagError(parsedLine.Tag.String(), lineNum, "Enable AllowUnknown option to ignore unknown tags")
		}
	}

	return nil
}

// parseMetadata parses metadata in key|value format
func (p *Parser) parseMetadata(doc *Document, currentSection **Section, content string, lineNum int) *MMLError {
	parts := strings.SplitN(content, "|", 2)
	if len(parts) != 2 {
		return NewMetadataError(content, "", "invalid format",
			"Use format 'key|value' for metadata")
	}

	key := strings.TrimSpace(parts[0])
	value := strings.TrimSpace(parts[1])

	if key == "" {
		return NewMetadataError(key, value, "empty key", "Provide a non-empty key")
	}

	// Check metadata limits
	var metadata *map[string]string
	var count *int

	if *currentSection != nil {
		metadata = &(*currentSection).Metadata
		currentCount := len(*metadata)
		count = &currentCount
		if *count >= p.options.MaxMetadata {
			return NewLimitExceededError("section metadata", *count, p.options.MaxMetadata,
				"Reduce metadata or increase limit")
		}
	} else {
		metadata = &doc.Metadata
		currentCount := len(*metadata)
		count = &currentCount
		if *count >= p.options.MaxMetadata {
			return NewLimitExceededError("global metadata", *count, p.options.MaxMetadata,
				"Reduce metadata or increase limit")
		}
	}

	(*metadata)[key] = value
	return nil
}

// parseLink parses link in text|url format
func (p *Parser) parseLink(doc *Document, currentSection **Section, content string, lineNum int) *MMLError {
	parts := strings.SplitN(content, "|", 2)
	if len(parts) != 2 {
		return NewLinkError(content, "", "invalid format",
			"Use format 'text|url' for links")
	}

	link := Link{
		Text: strings.TrimSpace(parts[0]),
		URL:  strings.TrimSpace(parts[1]),
	}

	if link.Text == "" {
		return NewLinkError(link.Text, link.URL, "empty text",
			"Provide link text")
	}

	if link.URL == "" {
		return NewLinkError(link.Text, link.URL, "empty URL",
			"Provide link URL")
	}

	if *currentSection != nil {
		(*currentSection).Links = append((*currentSection).Links, link)
	} else {
		doc.Links = append(doc.Links, link)
	}

	return nil
}

// parseImage parses image in description|url format
func (p *Parser) parseImage(doc *Document, currentSection **Section, content string, lineNum int) *MMLError {
	parts := strings.SplitN(content, "|", 2)
	if len(parts) != 2 {
		return NewImageError(content, "", "invalid format",
			"Use format 'description|url' for images")
	}

	image := Image{
		Description: strings.TrimSpace(parts[0]),
		URL:         strings.TrimSpace(parts[1]),
	}

	if image.Description == "" {
		return NewImageError(image.Description, image.URL, "empty description",
			"Provide image description")
	}

	if image.URL == "" {
		return NewImageError(image.Description, image.URL, "empty URL",
			"Provide image URL")
	}

	if *currentSection != nil {
		(*currentSection).Images = append((*currentSection).Images, image)
	} else {
		// Create a default media section
		if len(doc.Sections) == 0 || doc.Sections[len(doc.Sections)-1].Title != "Media" {
			section := Section{
				Title:    "Media",
				Metadata: make(map[string]string),
				Links:    make([]Link, 0),
				Images:   make([]Image, 0),
			}
			doc.Sections = append(doc.Sections, section)
		}
		doc.Sections[len(doc.Sections)-1].Images = append(doc.Sections[len(doc.Sections)-1].Images, image)
	}

	return nil
}

// GetStatistics returns parsing statistics
func (p *Parser) GetStatistics(doc *Document) string {
	totalMetadata := len(doc.Metadata)
	totalLinks := len(doc.Links)
	totalImages := 0

	for _, section := range doc.Sections {
		totalMetadata += len(section.Metadata)
		totalLinks += len(section.Links)
		totalImages += len(section.Images)
	}

	return fmt.Sprintf(`Statistics:
  Title: %s
  Sections: %d
  Total Metadata: %d
  Total Links: %d
  Total Images: %d
  Parsed Lines: %d/%d
  Errors: %d
  Parse Time: %dms`,
		checkMark(doc.Title != ""),
		len(doc.Sections),
		totalMetadata,
		totalLinks,
		totalImages,
		doc.Stats.ParsedLines,
		doc.Stats.TotalLines,
		doc.Stats.ErrorLines,
		doc.Stats.ParseTimeMs)
}

// checkMark returns a checkmark or X based on condition
func checkMark(condition bool) string {
	if condition {
		return "✅"
	}
	return "❌"
}

// ToHTML converts document to HTML
func (p *Parser) ToHTML(doc *Document) string {
	var sb strings.Builder

	sb.WriteString("<!DOCTYPE html>\n<html>\n<head>\n")
	sb.WriteString("<meta charset=\"utf-8\">\n")

	if doc.Title != "" {
		sb.WriteString(fmt.Sprintf("<title>%s</title>\n", escapeHTML(doc.Title)))
	}

	sb.WriteString("</head>\n<body>\n")

	if doc.Title != "" {
		sb.WriteString(fmt.Sprintf("<h1>%s</h1>\n", escapeHTML(doc.Title)))
	}

	for _, section := range doc.Sections {
		sb.WriteString(fmt.Sprintf("<h2>%s</h2>\n", escapeHTML(section.Title)))

		if section.Content != "" {
			sb.WriteString(fmt.Sprintf("<p>%s</p>\n", escapeHTML(section.Content)))
		}

		for _, link := range section.Links {
			sb.WriteString(fmt.Sprintf("<p><a href=\"%s\">%s</a></p>\n",
				escapeHTML(link.URL), escapeHTML(link.Text)))
		}

		for _, image := range section.Images {
			sb.WriteString(fmt.Sprintf("<figure>\n<img src=\"%s\" alt=\"%s\">\n<figcaption>%s</figcaption>\n</figure>\n",
				escapeHTML(image.URL), escapeHTML(image.Description), escapeHTML(image.Description)))
		}
	}

	sb.WriteString("</body>\n</html>")
	return sb.String()
}

// ToPlainText converts document to plain text
func (p *Parser) ToPlainText(doc *Document) string {
	var sb strings.Builder

	if doc.Title != "" {
		sb.WriteString(fmt.Sprintf("%s\n%s\n\n", doc.Title, strings.Repeat("=", len(doc.Title))))
	}

	for _, section := range doc.Sections {
		sb.WriteString(fmt.Sprintf("%s\n%s\n\n", section.Title, strings.Repeat("-", len(section.Title))))

		if section.Content != "" {
			sb.WriteString(fmt.Sprintf("%s\n\n", section.Content))
		}

		for _, link := range section.Links {
			sb.WriteString(fmt.Sprintf("• %s: %s\n", link.Text, link.URL))
		}

		if len(section.Links) > 0 {
			sb.WriteString("\n")
		}
	}

	return strings.TrimSpace(sb.String())
}

// Compress converts document to MMLC compressed format
func (p *Parser) Compress(doc *Document, level CompressionLevel) string {
	var sb strings.Builder

	// Tag mappings for compression
	tagMap := map[Tag]string{
		TagTitle:     "1",
		TagSection:   "2",
		TagParagraph: "4",
		TagMetadata:  "3",
		TagLink:      "5",
		TagImage:     "6",
		TagCode:      "7",
		TagQuote:     "8",
	}

	// Word replacements
	wordMap := map[string]string{
		"Rapport": "R", "Urgent": "U", "Critique": "C",
		"Patient": "P1", "Victime": "V", "Secteur": "S",
		"Évacuation": "E", "Médical": "M", "Stable": "S1",
		"Alerte": "A",
	}

	if level != CompressionNone {
		// Title
		if doc.Title != "" {
			compressedTitle := replaceWords(doc.Title, wordMap)
			sb.WriteString(fmt.Sprintf("1:%s\n", compressedTitle))
		}

		// Global metadata
		for key, value := range doc.Metadata {
			compressedValue := replaceWords(value, wordMap)
			sb.WriteString(fmt.Sprintf("3:%s|%s\n", key, compressedValue))
		}

		// Sections
		for _, section := range doc.Sections {
			compressedTitle := replaceWords(section.Title, wordMap)
			sb.WriteString(fmt.Sprintf("2:%s\n", compressedTitle))

			// Section metadata
			for key, value := range section.Metadata {
				compressedValue := replaceWords(value, wordMap)
				sb.WriteString(fmt.Sprintf("3:%s|%s\n", key, compressedValue))
			}

			// Content
			if section.Content != "" {
				compressedContent := replaceWords(section.Content, wordMap)
				sb.WriteString(fmt.Sprintf("4:%s\n", compressedContent))
			}
		}
	} else {
		// No compression - output standard MML
		if doc.Title != "" {
			sb.WriteString(fmt.Sprintf("T:%s\n", doc.Title))
		}

		for key, value := range doc.Metadata {
			sb.WriteString(fmt.Sprintf("M:%s|%s\n", key, value))
		}

		for _, section := range doc.Sections {
			sb.WriteString(fmt.Sprintf("H:%s\n", section.Title))

			for key, value := range section.Metadata {
				sb.WriteString(fmt.Sprintf("M:%s|%s\n", key, value))
			}

			if section.Content != "" {
				sb.WriteString(fmt.Sprintf("P:%s\n", section.Content))
			}
		}
	}

	return strings.TrimSpace(sb.String())
}

// replaceWords replaces words in text using the provided mapping
func replaceWords(text string, wordMap map[string]string) string {
	result := text
	for word, replacement := range wordMap {
		result = strings.ReplaceAll(result, word, replacement)
	}
	return result
}

// escapeHTML escapes HTML special characters
func escapeHTML(text string) string {
	text = strings.ReplaceAll(text, "&", "&amp;")
	text = strings.ReplaceAll(text, "<", "&lt;")
	text = strings.ReplaceAll(text, ">", "&gt;")
	text = strings.ReplaceAll(text, "\"", "&quot;")
	text = strings.ReplaceAll(text, "'", "&#39;")
	return text
}
