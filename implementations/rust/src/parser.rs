//! MML Parser Implementation
//!
//! High-performance parser with multiple backend options.

use crate::error::{MMLError, MMLResult};
use crate::types::*;
use lazy_static::lazy_static;
use regex::Regex;
use std::collections::HashMap;
use std::time::Instant;

/// Main MML parser struct
pub struct MMLParser {
    options: ParserOptions,
}

#[derive(Debug, Clone)]
pub struct ParserOptions {
    pub max_sections: usize,
    pub max_metadata: usize,
    pub validate_strict: bool,
    pub measure_time: bool,
}

impl Default for ParserOptions {
    fn default() -> Self {
        Self {
            max_sections: MAX_SECTIONS,
            max_metadata: MAX_METADATA,
            validate_strict: true,
            measure_time: false,
        }
    }
}

impl MMLParser {
    /// Create a new parser with default options
    pub fn new() -> Self {
        Self::with_options(ParserOptions::default())
    }

    /// Create a parser with custom options
    pub fn with_options(options: ParserOptions) -> Self {
        Self { options }
    }

    /// Parse MML text into a document
    pub fn parse(&self, input: &str) -> MMLResult<MMLDocument> {
        let start_time = if self.options.measure_time {
            Some(Instant::now())
        } else {
            None
        };

        let mut document = MMLDocument::default();
        let mut current_section: Option<usize> = None;

        let mut total_lines = 0;
        let mut parsed_lines = 0;
        let mut error_lines = 0;

        for (line_num, line) in input.lines().enumerate() {
            total_lines += 1;
            let line_num = line_num + 1; // 1-based line numbers

            let trimmed = line.trim();
            if trimmed.is_empty() {
                continue;
            }

            match self.parse_line(trimmed, line_num) {
                Ok(parsed_line) => {
                    parsed_lines += 1;
                    self.apply_parsed_line(&mut document, &mut current_section, parsed_line, line_num)?;
                }
                Err(_) => {
                    error_lines += 1;
                    if self.options.validate_strict {
                        return Err(MMLError::ParseError {
                            message: format!("Failed to parse line {}", line_num),
                            context: trimmed.to_string(),
                        });
                    }
                    // In non-strict mode, continue parsing
                }
            }
        }

        // Update statistics
        document.stats = MMLStats {
            total_lines,
            parsed_lines,
            error_lines,
            parse_time_ms: start_time.map(|start| start.elapsed().as_millis() as u64),
        };

        Ok(document)
    }

    /// Validate MML syntax without creating a document
    pub fn validate(&self, input: &str) -> MMLResult<()> {
        for (line_num, line) in input.lines().enumerate() {
            let line_num = line_num + 1;
            let trimmed = line.trim();

            if trimmed.is_empty() {
                continue;
            }

            self.parse_line(trimmed, line_num)?;
        }
        Ok(())
    }

    /// Parse a single line of MML
    fn parse_line(&self, line: &str, line_num: usize) -> MMLResult<ParsedLine> {
        lazy_static! {
            static ref LINE_REGEX: Regex = Regex::new(r"^([^:]+):(.*)$").unwrap();
        }

        let captures = LINE_REGEX.captures(line).ok_or_else(|| {
            MMLError::InvalidSyntax {
                line: line_num,
                column: 1,
                found: line.to_string(),
                expected: "TAG:content".to_string(),
                suggestion: "Use format 'TAG:content' where TAG is a valid MML tag.".to_string(),
            }
        })?;

        let tag_str = captures.get(1).unwrap().as_str().trim();
        let content = captures.get(2).unwrap().as_str().trim();

        let tag = MMLTag::from_str(tag_str);
        if tag == MMLTag::Unknown {
            return Err(MMLError::UnknownTag {
                tag: tag_str.to_string(),
                line: line_num,
                suggestion: "Use a valid MML tag like T, H, P, M, L, etc.".to_string(),
            });
        }

        Ok(ParsedLine {
            tag,
            content: content.to_string(),
        })
    }

    /// Apply a parsed line to the document
    fn apply_parsed_line(
        &self,
        document: &mut MMLDocument,
        current_section: &mut Option<usize>,
        parsed_line: ParsedLine,
        line_num: usize,
    ) -> MMLResult<()> {
        match parsed_line.tag {
            MMLTag::Title => {
                document.title = Some(parsed_line.content);
            }
            MMLTag::Section => {
                if document.sections.len() >= self.options.max_sections {
                    return Err(MMLError::LimitExceeded {
                        limit_type: "sections".to_string(),
                        current: document.sections.len(),
                        maximum: self.options.max_sections,
                        suggestion: "Split document into multiple files or increase section limit.".to_string(),
                    });
                }
                document.sections.push(MMLSection::new(parsed_line.content));
                *current_section = Some(document.sections.len() - 1);
            }
            MMLTag::Paragraph => {
                if let Some(section_idx) = *current_section {
                    let section = &mut document.sections[section_idx];
                    section.content = Some(parsed_line.content);
                }
            }
            MMLTag::Metadata => {
                self.parse_metadata(document, current_section, &parsed_line.content, line_num)?;
            }
            MMLTag::Link => {
                self.parse_link(document, current_section, &parsed_line.content, line_num)?;
            }
            MMLTag::Image => {
                self.parse_image(document, current_section, &parsed_line.content, line_num)?;
            }
            MMLTag::Code => {
                if let Some(section_idx) = *current_section {
                    let section = &mut document.sections[section_idx];
                    section.content = Some(format!("```\n{}\n```", parsed_line.content));
                }
            }
            MMLTag::Quote => {
                if let Some(section_idx) = *current_section {
                    let section = &mut document.sections[section_idx];
                    section.content = Some(format!("> {}", parsed_line.content));
                }
            }
            MMLTag::Config | MMLTag::Packet => {
                // For now, treat as metadata
                document.metadata.insert(
                    format!("{:?}", parsed_line.tag).to_lowercase(),
                    parsed_line.content,
                );
            }
            MMLTag::Unknown => unreachable!("Should have been caught in parse_line"),
        }

        Ok(())
    }

    /// Parse metadata (key|value format)
    fn parse_metadata(
        &self,
        document: &mut MMLDocument,
        current_section: &Option<usize>,
        content: &str,
        line_num: usize,
    ) -> MMLResult<()> {
        let parts: Vec<&str> = content.split('|').collect();
        if parts.len() != 2 {
            return Err(MMLError::MetadataError {
                key: content.to_string(),
                value: "".to_string(),
                error: "Invalid format".to_string(),
                suggestion: "Use format 'key|value' for metadata.".to_string(),
            });
        }

        let key = parts[0].trim().to_string();
        let value = parts[1].trim().to_string();

        let metadata_target = if let Some(section_idx) = *current_section {
            let section = &mut document.sections[section_idx];
            if section.metadata.len() >= self.options.max_metadata {
                return Err(MMLError::LimitExceeded {
                    limit_type: "section metadata".to_string(),
                    current: section.metadata.len(),
                    maximum: self.options.max_metadata,
                    suggestion: "Reduce metadata or increase limit.".to_string(),
                });
            }
            &mut section.metadata
        } else {
            if document.metadata.len() >= self.options.max_metadata {
                return Err(MMLError::LimitExceeded {
                    limit_type: "global metadata".to_string(),
                    current: document.metadata.len(),
                    maximum: self.options.max_metadata,
                    suggestion: "Reduce metadata or increase limit.".to_string(),
                });
            }
            &mut document.metadata
        };

        metadata_target.insert(key, value);
        Ok(())
    }

    /// Parse link (text|url format)
    fn parse_link(
        &self,
        document: &mut MMLDocument,
        current_section: &Option<usize>,
        content: &str,
        line_num: usize,
    ) -> MMLResult<()> {
        let parts: Vec<&str> = content.split('|').collect();
        if parts.len() != 2 {
            return Err(MMLError::LinkError {
                text: content.to_string(),
                url: "".to_string(),
                error: "Invalid format".to_string(),
                suggestion: "Use format 'text|url' for links.".to_string(),
            });
        }

        let link = MMLLink::new(
            parts[0].trim().to_string(),
            parts[1].trim().to_string(),
        );

        if let Some(section_idx) = *current_section {
            document.sections[section_idx].links.push(link);
        } else {
            document.links.push(link);
        }

        Ok(())
    }

    /// Parse image (description|url format)
    fn parse_image(
        &self,
        document: &mut MMLDocument,
        current_section: &Option<usize>,
        content: &str,
        line_num: usize,
    ) -> MMLResult<()> {
        let parts: Vec<&str> = content.split('|').collect();
        if parts.len() != 2 {
            return Err(MMLError::ImageError {
                description: content.to_string(),
                url: "".to_string(),
                error: "Invalid format".to_string(),
                suggestion: "Use format 'description|url' for images.".to_string(),
            });
        }

        let image = MMLImage::new(
            parts[0].trim().to_string(),
            parts[1].trim().to_string(),
        );

        if let Some(section_idx) = *current_section {
            document.sections[section_idx].images.push(image);
        } else {
            // For now, add to first section or create a default one
            if document.sections.is_empty() {
                document.sections.push(MMLSection::new("Media".to_string()));
            }
            document.sections[0].images.push(image);
        }

        Ok(())
    }
}

/// Internal representation of a parsed line
#[derive(Debug)]
struct ParsedLine {
    tag: MMLTag,
    content: String,
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_parse_simple_document() {
        let parser = MMLParser::new();
        let mml = "T:Test Document\nH:Section\nP:Content";
        let result = parser.parse(mml);

        assert!(result.is_ok());
        let doc = result.unwrap();
        assert_eq!(doc.title, Some("Test Document".to_string()));
        assert_eq!(doc.sections.len(), 1);
        assert_eq!(doc.sections[0].title, "Section");
    }

    #[test]
    fn test_parse_metadata() {
        let parser = MMLParser::new();
        let mml = "M:author|John Doe\nM:version|1.0";
        let result = parser.parse(mml);

        assert!(result.is_ok());
        let doc = result.unwrap();
        assert_eq!(doc.metadata.get("author"), Some(&"John Doe".to_string()));
        assert_eq!(doc.metadata.get("version"), Some(&"1.0".to_string()));
    }

    #[test]
    fn test_parse_section_metadata() {
        let parser = MMLParser::new();
        let mml = "H:Chapter 1\nM:pages|15\nM:difficulty|Easy";
        let result = parser.parse(mml);

        assert!(result.is_ok());
        let doc = result.unwrap();
        assert_eq!(doc.sections[0].metadata.get("pages"), Some(&"15".to_string()));
        assert_eq!(doc.sections[0].metadata.get("difficulty"), Some(&"Easy".to_string()));
    }

    #[test]
    fn test_parse_links() {
        let parser = MMLParser::new();
        let mml = "H:Resources\nL:Documentation|https://docs.example.com\nL:GitHub|https://github.com";
        let result = parser.parse(mml);

        assert!(result.is_ok());
        let doc = result.unwrap();
        assert_eq!(doc.sections[0].links.len(), 2);
        assert_eq!(doc.sections[0].links[0].text, "Documentation");
        assert_eq!(doc.sections[0].links[0].url, "https://docs.example.com");
    }

    #[test]
    fn test_parse_invalid_syntax() {
        let parser = MMLParser::new();
        let mml = "INVALID LINE WITHOUT COLON";
        let result = parser.parse(mml);

        assert!(result.is_err());
        if let Err(MMLError::InvalidSyntax { .. }) = result {
            // Expected error type
        } else {
            panic!("Expected InvalidSyntax error");
        }
    }

    #[test]
    fn test_parse_unknown_tag() {
        let parser = MMLParser::new();
        let mml = "X:Unknown tag";
        let result = parser.parse(mml);

        assert!(result.is_err());
        if let Err(MMLError::UnknownTag { .. }) = result {
            // Expected error type
        } else {
            panic!("Expected UnknownTag error");
        }
    }

    #[test]
    fn test_validate_valid_document() {
        let parser = MMLParser::new();
        let mml = "T:Valid\nH:Section\nP:Content";
        assert!(parser.validate(mml).is_ok());
    }

    #[test]
    fn test_section_limit() {
        let mut options = ParserOptions::default();
        options.max_sections = 2;
        let parser = MMLParser::with_options(options);

        let mml = "H:Section 1\nH:Section 2\nH:Section 3";
        let result = parser.parse(mml);

        assert!(result.is_err());
        if let Err(MMLError::LimitExceeded { limit_type, .. }) = result {
            assert_eq!(limit_type, "sections");
        } else {
            panic!("Expected LimitExceeded error");
        }
    }

    #[test]
    fn test_parsing_statistics() {
        let parser = MMLParser::new();
        let mml = "T:Test\n\nH:Section\nP:Content\nINVALID LINE\n";
        let result = parser.parse(mml);

        assert!(result.is_ok());
        let doc = result.unwrap();
        assert_eq!(doc.stats.total_lines, 5); // Including empty line and invalid line
        assert_eq!(doc.stats.parsed_lines, 3); // T, H, P
        assert_eq!(doc.stats.error_lines, 1); // INVALID LINE
    }
}
