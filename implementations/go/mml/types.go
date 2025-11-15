// Package mml provides a Go implementation of the Minimal Markup Language (MML) parser.
// MML is designed for high-performance parsing with excellent support for web services and APIs.
package mml

import (
	"encoding/json"
	"fmt"
	"strings"
	"time"
)

// Version represents the MML specification version
const Version = "1.0"

// Tag represents MML tag types
type Tag int

const (
	TagUnknown Tag = iota
	TagTitle
	TagSection
	TagParagraph
	TagMetadata
	TagLink
	TagImage
	TagCode
	TagQuote
	TagConfig
	TagPacket
)

// String returns the string representation of a tag
func (t Tag) String() string {
	switch t {
	case TagTitle:
		return "T"
	case TagSection:
		return "H"
	case TagParagraph:
		return "P"
	case TagMetadata:
		return "M"
	case TagLink:
		return "L"
	case TagImage:
		return "IMG"
	case TagCode:
		return "C"
	case TagQuote:
		return "Q"
	case TagConfig:
		return "CFG"
	case TagPacket:
		return "PKT"
	default:
		return "UNKNOWN"
	}
}

// ParseTag converts a string to a Tag
func ParseTag(s string) Tag {
	switch strings.ToUpper(s) {
	case "T":
		return TagTitle
	case "H":
		return TagSection
	case "P":
		return TagParagraph
	case "M":
		return TagMetadata
	case "L":
		return TagLink
	case "IMG":
		return TagImage
	case "C":
		return TagCode
	case "Q":
		return TagQuote
	case "CFG":
		return TagConfig
	case "PKT":
		return TagPacket
	default:
		return TagUnknown
	}
}

// Document represents a complete MML document
type Document struct {
	Title    string            `json:"title,omitempty" yaml:"title,omitempty"`
	Metadata map[string]string `json:"metadata,omitempty" yaml:"metadata,omitempty"`
	Sections []Section         `json:"sections,omitempty" yaml:"sections,omitempty"`
	Links    []Link            `json:"links,omitempty" yaml:"links,omitempty"`
	Stats    Stats             `json:"stats,omitempty" yaml:"stats,omitempty"`
}

// Section represents a document section
type Section struct {
	Title    string            `json:"title" yaml:"title"`
	Content  string            `json:"content,omitempty" yaml:"content,omitempty"`
	Metadata map[string]string `json:"metadata,omitempty" yaml:"metadata,omitempty"`
	Links    []Link            `json:"links,omitempty" yaml:"links,omitempty"`
	Images   []Image           `json:"images,omitempty" yaml:"images,omitempty"`
}

// Link represents a hyperlink
type Link struct {
	Text string `json:"text" yaml:"text"`
	URL  string `json:"url" yaml:"url"`
}

// Image represents an image reference
type Image struct {
	Description string `json:"description" yaml:"description"`
	URL         string `json:"url" yaml:"url"`
}

// Stats contains parsing statistics
type Stats struct {
	TotalLines  int `json:"total_lines" yaml:"total_lines"`
	ParsedLines int `json:"parsed_lines" yaml:"parsed_lines"`
	ErrorLines  int `json:"error_lines" yaml:"error_lines"`
	ParseTimeMs int `json:"parse_time_ms,omitempty" yaml:"parse_time_ms,omitempty"`
}

// CompressionLevel represents compression aggressiveness
type CompressionLevel int

const (
	CompressionNone CompressionLevel = iota
	CompressionBasic
	CompressionAggressive
)

// OutputFormat represents output format types
type OutputFormat int

const (
	OutputFormatMML OutputFormat = iota
	OutputFormatHTML
	OutputFormatJSON
	OutputFormatYAML
	OutputFormatMMLC
)

// String returns string representation of output format
func (f OutputFormat) String() string {
	switch f {
	case OutputFormatMML:
		return "mml"
	case OutputFormatHTML:
		return "html"
	case OutputFormatJSON:
		return "json"
	case OutputFormatYAML:
		return "yaml"
	case OutputFormatMMLC:
		return "mmlc"
	default:
		return "unknown"
	}
}

// ParserOptions contains parser configuration
type ParserOptions struct {
	MaxSections   int  `json:"max_sections" yaml:"max_sections"`
	MaxMetadata   int  `json:"max_metadata" yaml:"max_metadata"`
	StrictMode    bool `json:"strict_mode" yaml:"strict_mode"`
	MeasureTime   bool `json:"measure_time" yaml:"measure_time"`
	AllowUnknown  bool `json:"allow_unknown" yaml:"allow_unknown"`
}

// DefaultParserOptions returns default parser options
func DefaultParserOptions() ParserOptions {
	return ParserOptions{
		MaxSections:  100,
		MaxMetadata:  200,
		StrictMode:   true,
		MeasureTime:  false,
		AllowUnknown: false,
	}
}

// ParsedLine represents an internal parsed line
type ParsedLine struct {
	Tag     Tag
	Content string
	LineNum  int
}

// String returns a string representation of the document
func (d *Document) String() string {
	var sb strings.Builder

	if d.Title != "" {
		sb.WriteString(fmt.Sprintf("Title: %s\n", d.Title))
	}

	sb.WriteString(fmt.Sprintf("Sections: %d\n", len(d.Sections)))
	sb.WriteString(fmt.Sprintf("Metadata: %d\n", len(d.Metadata)))
	sb.WriteString(fmt.Sprintf("Links: %d\n", len(d.Links)))

	return sb.String()
}

// ToJSON converts document to JSON string
func (d *Document) ToJSON() (string, error) {
	data, err := json.MarshalIndent(d, "", "  ")
	if err != nil {
		return "", fmt.Errorf("JSON marshaling error: %w", err)
	}
	return string(data), nil
}

// ToYAML converts document to YAML string
func (d *Document) ToYAML() (string, error) {
	// Simple YAML conversion (in real implementation, use gopkg.in/yaml.v3)
	var sb strings.Builder

	if d.Title != "" {
		sb.WriteString(fmt.Sprintf("title: %q\n", d.Title))
	}

	if len(d.Metadata) > 0 {
		sb.WriteString("metadata:\n")
		for k, v := range d.Metadata {
			sb.WriteString(fmt.Sprintf("  %s: %q\n", k, v))
		}
	}

	if len(d.Sections) > 0 {
		sb.WriteString("sections:\n")
		for _, section := range d.Sections {
			sb.WriteString(fmt.Sprintf("  - title: %q\n", section.Title))
			if section.Content != "" {
				sb.WriteString(fmt.Sprintf("    content: %q\n", section.Content))
			}
			if len(section.Metadata) > 0 {
				sb.WriteString("    metadata:\n")
				for k, v := range section.Metadata {
					sb.WriteString(fmt.Sprintf("      %s: %q\n", k, v))
				}
			}
		}
	}

	return sb.String(), nil
}

// Validate checks document validity
func (d *Document) Validate() error {
	if len(d.Sections) == 0 && d.Title == "" && len(d.Metadata) == 0 {
		return fmt.Errorf("document is empty")
	}

	for i, section := range d.Sections {
		if section.Title == "" {
			return fmt.Errorf("section %d has no title", i+1)
		}
	}

	return nil
}
