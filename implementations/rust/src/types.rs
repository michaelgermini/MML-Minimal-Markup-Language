//! MML Data Types
//!
//! Core data structures representing MML documents and their components.

use serde::{Deserialize, Serialize};
use std::collections::HashMap;

/// Represents a complete MML document
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct MMLDocument {
    /// Document title (optional)
    pub title: Option<String>,
    /// Global metadata key-value pairs
    pub metadata: HashMap<String, String>,
    /// Document sections
    pub sections: Vec<MMLSection>,
    /// Global links
    pub links: Vec<MMLLink>,
    /// Parsing statistics
    pub stats: MMLStats,
}

impl Default for MMLDocument {
    fn default() -> Self {
        Self {
            title: None,
            metadata: HashMap::new(),
            sections: Vec::new(),
            links: Vec::new(),
            stats: MMLStats::default(),
        }
    }
}

/// Represents a section within an MML document
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct MMLSection {
    /// Section title
    pub title: String,
    /// Section content (main paragraph)
    pub content: Option<String>,
    /// Section-specific metadata
    pub metadata: HashMap<String, String>,
    /// Links within this section
    pub links: Vec<MMLLink>,
    /// Images within this section
    pub images: Vec<MMLImage>,
}

impl MMLSection {
    /// Create a new section with the given title
    pub fn new(title: String) -> Self {
        Self {
            title,
            content: None,
            metadata: HashMap::new(),
            links: Vec::new(),
            images: Vec::new(),
        }
    }
}

/// Represents a link in MML
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct MMLLink {
    /// Link text/description
    pub text: String,
    /// Link URL or reference
    pub url: String,
}

impl MMLLink {
    /// Create a new link
    pub fn new(text: String, url: String) -> Self {
        Self { text, url }
    }
}

/// Represents an image in MML
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct MMLImage {
    /// Image description/alt text
    pub description: String,
    /// Image URL or path
    pub url: String,
}

impl MMLImage {
    /// Create a new image
    pub fn new(description: String, url: String) -> Self {
        Self { description, url }
    }
}

/// Parsing statistics and metadata
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct MMLStats {
    /// Total number of lines processed
    pub total_lines: usize,
    /// Number of successfully parsed lines
    pub parsed_lines: usize,
    /// Number of lines with parse errors
    pub error_lines: usize,
    /// Parsing time in milliseconds (if measured)
    pub parse_time_ms: Option<u64>,
}

impl Default for MMLStats {
    fn default() -> Self {
        Self {
            total_lines: 0,
            parsed_lines: 0,
            error_lines: 0,
            parse_time_ms: None,
        }
    }
}

/// MML tag enumeration
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum MMLTag {
    Title,
    Section,
    Paragraph,
    Metadata,
    Link,
    Image,
    Code,
    Quote,
    Config,
    Packet,
    Unknown,
}

impl MMLTag {
    /// Convert tag to string representation
    pub fn to_str(self) -> &'static str {
        match self {
            MMLTag::Title => "T",
            MMLTag::Section => "H",
            MMLTag::Paragraph => "P",
            MMLTag::Metadata => "M",
            MMLTag::Link => "L",
            MMLTag::Image => "IMG",
            MMLTag::Code => "C",
            MMLTag::Quote => "Q",
            MMLTag::Config => "CFG",
            MMLTag::Packet => "PKT",
            MMLTag::Unknown => "UNKNOWN",
        }
    }

    /// Parse tag from string
    pub fn from_str(s: &str) -> Self {
        match s {
            "T" => MMLTag::Title,
            "H" => MMLTag::Section,
            "P" => MMLTag::Paragraph,
            "M" => MMLTag::Metadata,
            "L" => MMLTag::Link,
            "IMG" => MMLTag::Image,
            "C" => MMLTag::Code,
            "Q" => MMLTag::Quote,
            "CFG" => MMLTag::Config,
            "PKT" => MMLTag::Packet,
            _ => MMLTag::Unknown,
        }
    }
}

/// Compression level for MMLC output
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum CompressionLevel {
    /// No compression, readable MML
    None,
    /// Basic compression with common words
    Basic,
    /// Aggressive compression with full dictionary
    Aggressive,
}

impl Default for CompressionLevel {
    fn default() -> Self {
        CompressionLevel::Basic
    }
}

/// Output format options
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum OutputFormat {
    /// MML plain text
    MML,
    /// HTML format
    HTML,
    /// JSON format
    JSON,
    /// Compressed MMLC
    MMLC,
}

impl Default for OutputFormat {
    fn default() -> Self {
        OutputFormat::MML
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_document_creation() {
        let doc = MMLDocument::default();
        assert!(doc.title.is_none());
        assert!(doc.metadata.is_empty());
        assert!(doc.sections.is_empty());
    }

    #[test]
    fn test_section_creation() {
        let section = MMLSection::new("Test Section".to_string());
        assert_eq!(section.title, "Test Section");
        assert!(section.content.is_none());
        assert!(section.metadata.is_empty());
    }

    #[test]
    fn test_link_creation() {
        let link = MMLLink::new("Test Link".to_string(), "https://example.com".to_string());
        assert_eq!(link.text, "Test Link");
        assert_eq!(link.url, "https://example.com");
    }

    #[test]
    fn test_tag_conversion() {
        assert_eq!(MMLTag::Title.to_str(), "T");
        assert_eq!(MMLTag::from_str("H"), MMLTag::Section);
        assert_eq!(MMLTag::from_str("INVALID"), MMLTag::Unknown);
    }

    #[test]
    fn test_serialization() {
        let mut doc = MMLDocument::default();
        doc.title = Some("Test Document".to_string());
        doc.metadata.insert("author".to_string(), "Test Author".to_string());

        let json = serde_json::to_string(&doc).unwrap();
        let deserialized: MMLDocument = serde_json::from_str(&json).unwrap();

        assert_eq!(doc, deserialized);
    }
}
