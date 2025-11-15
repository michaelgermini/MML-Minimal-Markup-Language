package mml

import (
	"fmt"
	"strings"
)

// ErrorSeverity represents error severity levels
type ErrorSeverity int

const (
	SeverityLow ErrorSeverity = iota
	SeverityMedium
	SeverityHigh
	SeverityCritical
)

// String returns string representation of severity
func (s ErrorSeverity) String() string {
	switch s {
	case SeverityLow:
		return "low"
	case SeverityMedium:
		return "medium"
	case SeverityHigh:
		return "high"
	case SeverityCritical:
		return "critical"
	default:
		return "unknown"
	}
}

// MMLError represents MML parsing errors
type MMLError struct {
	Message    string
	Line        int
	Column     int
	Found      string
	Expected   string
	Suggestion string
	Severity   ErrorSeverity
	Context    string
}

// Error implements the error interface
func (e *MMLError) Error() string {
	var parts []string

	if e.Line > 0 {
		parts = append(parts, fmt.Sprintf("line %d", e.Line))
	}
	if e.Column > 0 {
		parts = append(parts, fmt.Sprintf("column %d", e.Column))
	}

	location := strings.Join(parts, ", ")
	if location != "" {
		location = " at " + location
	}

	msg := fmt.Sprintf("MML error%s: %s", location, e.Message)

	if e.Found != "" || e.Expected != "" {
		details := ""
		if e.Found != "" {
			details += fmt.Sprintf("found '%s'", e.Found)
		}
		if e.Expected != "" {
			if details != "" {
				details += ", "
			}
			details += fmt.Sprintf("expected '%s'", e.Expected)
		}
		if details != "" {
			msg += " (" + details + ")"
		}
	}

	if e.Suggestion != "" {
		msg += ". " + e.Suggestion
	}

	return msg
}

// IsRecoverable returns true if the error is recoverable
func (e *MMLError) IsRecoverable() bool {
	switch e.Severity {
	case SeverityLow, SeverityMedium:
		return true
	case SeverityHigh, SeverityCritical:
		return false
	default:
		return false
	}
}

// NewSyntaxError creates a syntax error
func NewSyntaxError(line, column int, found, expected, suggestion string) *MMLError {
	return &MMLError{
		Message:    "syntax error",
		Line:        line,
		Column:     column,
		Found:      found,
		Expected:   expected,
		Suggestion: suggestion,
		Severity:   SeverityHigh,
	}
}

// NewUnknownTagError creates an unknown tag error
func NewUnknownTagError(tag string, line int, suggestion string) *MMLError {
	return &MMLError{
		Message:    fmt.Sprintf("unknown tag '%s'", tag),
		Line:        line,
		Found:      tag,
		Expected:   "valid MML tag (T, H, P, M, L, IMG, C, Q, CFG, PKT)",
		Suggestion: suggestion,
		Severity:   SeverityLow,
	}
}

// NewStructureError creates a structure error
func NewStructureError(message, suggestion string) *MMLError {
	return &MMLError{
		Message:    message,
		Suggestion: suggestion,
		Severity:   SeverityHigh,
	}
}

// NewMetadataError creates a metadata parsing error
func NewMetadataError(key, value, errorMsg, suggestion string) *MMLError {
	return &MMLError{
		Message:    fmt.Sprintf("metadata error for key '%s': %s", key, errorMsg),
		Context:    fmt.Sprintf("key='%s', value='%s'", key, value),
		Suggestion: suggestion,
		Severity:   SeverityMedium,
	}
}

// NewLinkError creates a link parsing error
func NewLinkError(text, url, errorMsg, suggestion string) *MMLError {
	return &MMLError{
		Message:    fmt.Sprintf("link error: %s", errorMsg),
		Context:    fmt.Sprintf("text='%s', url='%s'", text, url),
		Suggestion: suggestion,
		Severity:   SeverityMedium,
	}
}

// NewImageError creates an image parsing error
func NewImageError(description, url, errorMsg, suggestion string) *MMLError {
	return &MMLError{
		Message:    fmt.Sprintf("image error: %s", errorMsg),
		Context:    fmt.Sprintf("description='%s', url='%s'", description, url),
		Suggestion: suggestion,
		Severity:   SeverityMedium,
	}
}

// NewLimitExceededError creates a limit exceeded error
func NewLimitExceededError(limitType string, current, maximum int, suggestion string) *MMLError {
	return &MMLError{
		Message:    fmt.Sprintf("%s limit exceeded: %d used, %d maximum", limitType, current, maximum),
		Suggestion: suggestion,
		Severity:   SeverityHigh,
	}
}

// NewValidationError creates a validation error
func NewValidationError(field, value, reason, suggestion string) *MMLError {
	return &MMLError{
		Message:    fmt.Sprintf("validation error for %s '%s': %s", field, value, reason),
		Suggestion: suggestion,
		Severity:   SeverityMedium,
	}
}

// ErrorCollection represents multiple errors
type ErrorCollection struct {
	Errors []MMLError
}

// Add adds an error to the collection
func (ec *ErrorCollection) Add(err MMLError) {
	ec.Errors = append(ec.Errors, err)
}

// HasErrors returns true if there are any errors
func (ec *ErrorCollection) HasErrors() bool {
	return len(ec.Errors) > 0
}

// HasCriticalErrors returns true if there are critical errors
func (ec *ErrorCollection) HasCriticalErrors() bool {
	for _, err := range ec.Errors {
		if err.Severity == SeverityCritical {
			return true
		}
	}
	return false
}

// Error implements the error interface
func (ec *ErrorCollection) Error() string {
	if len(ec.Errors) == 0 {
		return "no errors"
	}

	var msgs []string
	for _, err := range ec.Errors {
		msgs = append(msgs, err.Error())
	}

	return fmt.Sprintf("%d errors: %s", len(ec.Errors), strings.Join(msgs, "; "))
}

// String returns a detailed string representation
func (ec *ErrorCollection) String() string {
	if len(ec.Errors) == 0 {
		return "No errors"
	}

	var sb strings.Builder
	sb.WriteString(fmt.Sprintf("%d errors found:\n", len(ec.Errors)))

	for i, err := range ec.Errors {
		sb.WriteString(fmt.Sprintf("%d. %s (severity: %s)\n",
			i+1, err.Error(), err.Severity.String()))
		if err.Suggestion != "" {
			sb.WriteString(fmt.Sprintf("   Suggestion: %s\n", err.Suggestion))
		}
	}

	return sb.String()
}

// FilterBySeverity returns errors filtered by severity
func (ec *ErrorCollection) FilterBySeverity(minSeverity ErrorSeverity) []MMLError {
	var filtered []MMLError
	for _, err := range ec.Errors {
		if err.Severity >= minSeverity {
			filtered = append(filtered, err)
		}
	}
	return filtered
}

// RecoverableErrors returns only recoverable errors
func (ec *ErrorCollection) RecoverableErrors() []MMLError {
	var recoverable []MMLError
	for _, err := range ec.Errors {
		if err.IsRecoverable() {
			recoverable = append(recoverable, err)
		}
	}
	return recoverable
}
