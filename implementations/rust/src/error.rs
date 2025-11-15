//! Error handling for MML parsing
//!
//! Comprehensive error types with detailed error messages and recovery suggestions.

use std::fmt;
use std::num::ParseIntError;

/// Result type alias for MML operations
pub type MMLResult<T> = Result<T, MMLError>;

/// Comprehensive error type for MML operations
#[derive(Debug, Clone, PartialEq)]
pub enum MMLError {
    /// Invalid input format or syntax
    InvalidSyntax {
        line: usize,
        column: usize,
        found: String,
        expected: String,
        suggestion: String,
    },

    /// Unknown or unsupported tag
    UnknownTag {
        tag: String,
        line: usize,
        suggestion: String,
    },

    /// Document structure error
    StructureError {
        message: String,
        suggestion: String,
    },

    /// Metadata parsing error
    MetadataError {
        key: String,
        value: String,
        error: String,
        suggestion: String,
    },

    /// Link parsing error
    LinkError {
        text: String,
        url: String,
        error: String,
        suggestion: String,
    },

    /// Image parsing error
    ImageError {
        description: String,
        url: String,
        error: String,
        suggestion: String,
    },

    /// Limits exceeded (sections, metadata, etc.)
    LimitExceeded {
        limit_type: String,
        current: usize,
        maximum: usize,
        suggestion: String,
    },

    /// I/O error during file operations
    IoError {
        operation: String,
        path: String,
        error: String,
    },

    /// Encoding/decoding error
    EncodingError {
        operation: String,
        charset: String,
        error: String,
        suggestion: String,
    },

    /// Validation error
    ValidationError {
        field: String,
        value: String,
        reason: String,
        suggestion: String,
    },

    /// Generic parsing error
    ParseError {
        message: String,
        context: String,
    },
}

impl fmt::Display for MMLError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            MMLError::InvalidSyntax { line, column, found, expected, suggestion } => {
                write!(f, "Syntax error at line {}, column {}: found '{}', expected '{}'. {}",
                       line, column, found, expected, suggestion)
            }
            MMLError::UnknownTag { tag, line, suggestion } => {
                write!(f, "Unknown tag '{}' at line {}. {}", tag, line, suggestion)
            }
            MMLError::StructureError { message, suggestion } => {
                write!(f, "Structure error: {}. {}", message, suggestion)
            }
            MMLError::MetadataError { key, value, error, suggestion } => {
                write!(f, "Metadata error for key '{}', value '{}': {}. {}",
                       key, value, error, suggestion)
            }
            MMLError::LinkError { text, url, error, suggestion } => {
                write!(f, "Link error for '{} -> {}': {}. {}", text, url, error, suggestion)
            }
            MMLError::ImageError { description, url, error, suggestion } => {
                write!(f, "Image error for '{} -> {}': {}. {}", description, url, error, suggestion)
            }
            MMLError::LimitExceeded { limit_type, current, maximum, suggestion } => {
                write!(f, "Limit exceeded for {}: {} used, {} maximum. {}",
                       limit_type, current, maximum, suggestion)
            }
            MMLError::IoError { operation, path, error } => {
                write!(f, "I/O error during {} on '{}': {}", operation, path, error)
            }
            MMLError::EncodingError { operation, charset, error, suggestion } => {
                write!(f, "Encoding error during {} with charset {}: {}. {}",
                       operation, charset, error, suggestion)
            }
            MMLError::ValidationError { field, value, reason, suggestion } => {
                write!(f, "Validation error for field '{}', value '{}': {}. {}",
                       field, value, reason, suggestion)
            }
            MMLError::ParseError { message, context } => {
                write!(f, "Parse error: {} (context: {})", message, context)
            }
        }
    }
}

impl std::error::Error for MMLError {}

impl From<ParseIntError> for MMLError {
    fn from(err: ParseIntError) -> Self {
        MMLError::ParseError {
            message: format!("Integer parsing error: {}", err),
            context: "numeric conversion".to_string(),
        }
    }
}

#[cfg(feature = "std")]
impl From<std::io::Error> for MMLError {
    fn from(err: std::io::Error) -> Self {
        MMLError::IoError {
            operation: "file operation".to_string(),
            path: "unknown".to_string(),
            error: err.to_string(),
        }
    }
}

/// Error recovery suggestions
impl MMLError {
    /// Get a recovery suggestion for this error
    pub fn suggestion(&self) -> &str {
        match self {
            MMLError::InvalidSyntax { suggestion, .. } => suggestion,
            MMLError::UnknownTag { suggestion, .. } => suggestion,
            MMLError::StructureError { suggestion, .. } => suggestion,
            MMLError::MetadataError { suggestion, .. } => suggestion,
            MMLError::LinkError { suggestion, .. } => suggestion,
            MMLError::ImageError { suggestion, .. } => suggestion,
            MMLError::LimitExceeded { suggestion, .. } => suggestion,
            MMLError::EncodingError { suggestion, .. } => suggestion,
            MMLError::ValidationError { suggestion, .. } => suggestion,
            _ => "Please check the MML specification for correct syntax.",
        }
    }

    /// Check if this error is recoverable
    pub fn is_recoverable(&self) -> bool {
        match self {
            MMLError::UnknownTag { .. } => true,
            MMLError::InvalidSyntax { .. } => false,
            MMLError::StructureError { .. } => false,
            MMLError::LimitExceeded { .. } => false,
            MMLError::IoError { .. } => false,
            MMLError::EncodingError { .. } => false,
            _ => true,
        }
    }

    /// Get error severity level
    pub fn severity(&self) -> ErrorSeverity {
        match self {
            MMLError::InvalidSyntax { .. } => ErrorSeverity::Critical,
            MMLError::StructureError { .. } => ErrorSeverity::High,
            MMLError::LimitExceeded { .. } => ErrorSeverity::High,
            MMLError::IoError { .. } => ErrorSeverity::High,
            MMLError::EncodingError { .. } => ErrorSeverity::Medium,
            MMLError::UnknownTag { .. } => ErrorSeverity::Low,
            _ => ErrorSeverity::Medium,
        }
    }
}

/// Error severity levels
#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord)]
pub enum ErrorSeverity {
    /// Minor issues that don't prevent parsing
    Low,
    /// Issues that may affect document structure
    Medium,
    /// Serious issues that may break parsing
    High,
    /// Critical errors that prevent any processing
    Critical,
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_error_display() {
        let error = MMLError::UnknownTag {
            tag: "INVALID".to_string(),
            line: 5,
            suggestion: "Use a valid MML tag.".to_string(),
        };

        let display = format!("{}", error);
        assert!(display.contains("Unknown tag 'INVALID'"));
        assert!(display.contains("line 5"));
    }

    #[test]
    fn test_error_suggestion() {
        let error = MMLError::InvalidSyntax {
            line: 1,
            column: 10,
            found: "INVALID".to_string(),
            expected: "TAG:".to_string(),
            suggestion: "Start with a valid tag.".to_string(),
        };

        assert_eq!(error.suggestion(), "Start with a valid tag.");
    }

    #[test]
    fn test_error_severity() {
        assert_eq!(MMLError::UnknownTag {
            tag: "X".to_string(),
            line: 1,
            suggestion: "".to_string(),
        }.severity(), ErrorSeverity::Low);

        assert_eq!(MMLError::InvalidSyntax {
            line: 1,
            column: 1,
            found: "".to_string(),
            expected: "".to_string(),
            suggestion: "".to_string(),
        }.severity(), ErrorSeverity::Critical);
    }

    #[test]
    fn test_error_recoverability() {
        assert!(MMLError::UnknownTag {
            tag: "X".to_string(),
            line: 1,
            suggestion: "".to_string(),
        }.is_recoverable());

        assert!(!MMLError::InvalidSyntax {
            line: 1,
            column: 1,
            found: "".to_string(),
            expected: "".to_string(),
            suggestion: "".to_string(),
        }.is_recoverable());
    }
}
