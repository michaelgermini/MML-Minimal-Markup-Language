//! # MML Parser - Rust Implementation
//!
//! High-performance, memory-safe MML (Minimal Markup Language) parser written in Rust.
//!
//! ## Features
//!
//! - **Zero-copy parsing** where possible
//! - **Memory safety** guaranteed by Rust
//! - **High performance** with multiple parsing backends
//! - **Serde support** for serialization/deserialization
//! - **Comprehensive error handling**
//!
//! ## Example
//!
//! ```rust
//! use mml_parser::{MMLParser, MMLDocument};
//!
//! let parser = MMLParser::new();
//! let mml_text = r#"
//! T:My Document
//! H:Introduction
//! P:This is a paragraph
//! M:Author|John Doe
//! "#;
//!
//! match parser.parse(mml_text) {
//!     Ok(document) => {
//!         println!("Title: {}", document.title.as_deref().unwrap_or("None"));
//!         println!("Sections: {}", document.sections.len());
//!     }
//!     Err(error) => eprintln!("Parse error: {}", error),
//! }
//! ```

pub mod error;
pub mod parser;
pub mod types;

pub use error::{MMLError, MMLResult};
pub use parser::MMLParser;
pub use types::*;

/// Version of the MML specification supported
pub const MML_VERSION: &str = "1.0";

/// Maximum number of sections allowed in a document
pub const MAX_SECTIONS: usize = 100;

/// Maximum number of metadata entries per document/section
pub const MAX_METADATA: usize = 200;

/// Parse MML text into a document (convenience function)
///
/// # Example
///
/// ```rust
/// use mml_parser::parse_mml;
///
/// let result = parse_mml("T:Hello\nP:World");
/// assert!(result.is_ok());
/// ```
pub fn parse_mml(input: &str) -> MMLResult<MMLDocument> {
    let parser = MMLParser::new();
    parser.parse(input)
}

/// Validate MML syntax without creating a document
///
/// # Example
///
/// ```rust
/// use mml_parser::validate_mml;
///
/// assert!(validate_mml("T:Valid\nP:Document").is_ok());
/// ```
pub fn validate_mml(input: &str) -> MMLResult<()> {
    let parser = MMLParser::new();
    parser.validate(input)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_parse_simple_document() {
        let mml = "T:Test Document\nH:Section\nP:Content";
        let result = parse_mml(mml);
        assert!(result.is_ok());

        let doc = result.unwrap();
        assert_eq!(doc.title, Some("Test Document".to_string()));
        assert_eq!(doc.sections.len(), 1);
        assert_eq!(doc.sections[0].title, "Section");
    }

    #[test]
    fn test_validate_valid_document() {
        let mml = "T:Valid\nP:Document";
        assert!(validate_mml(mml).is_ok());
    }

    #[test]
    fn test_validate_invalid_document() {
        let mml = "INVALID:Document";
        assert!(validate_mml(mml).is_err());
    }
}
