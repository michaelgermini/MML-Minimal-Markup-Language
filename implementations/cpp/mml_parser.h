/**
 * MML Parser - C/C++ Implementation for Embedded Systems
 * Minimal Markup Language Parser
 *
 * Designed for resource-constrained embedded systems
 * Memory-efficient, no dynamic allocation in core functions
 *
 * Author: MML Team
 * License: MIT
 */

#ifndef MML_PARSER_H
#define MML_PARSER_H

#include <stdint.h>
#include <stdbool.h>

#ifdef __cplusplus
extern "C" {
#endif

// Configuration constants
#define MML_MAX_LINE_LENGTH        256
#define MML_MAX_SECTIONS          32
#define MML_MAX_METADATA          64
#define MML_MAX_CONTENT_LENGTH    512
#define MML_MAX_TITLE_LENGTH      128

// Tag enumeration
typedef enum {
    MML_TAG_UNKNOWN = 0,
    MML_TAG_TITLE,        // T:
    MML_TAG_SECTION,      // H:
    MML_TAG_PARAGRAPH,    // P:
    MML_TAG_METADATA,     // M:
    MML_TAG_LINK,         // L:
    MML_TAG_IMAGE,        // IMG:
    MML_TAG_CODE,         // C:
    MML_TAG_QUOTE,        // Q:
    MML_TAG_CONFIG,       // CFG:
    MML_TAG_PACKET        // PKT:
} mml_tag_t;

// Metadata structure
typedef struct {
    char key[MML_MAX_LINE_LENGTH / 4];
    char value[MML_MAX_LINE_LENGTH / 4];
} mml_metadata_t;

// Link structure
typedef struct {
    char text[MML_MAX_LINE_LENGTH / 2];
    char url[MML_MAX_LINE_LENGTH / 2];
} mml_link_t;

// Image structure
typedef struct {
    char description[MML_MAX_LINE_LENGTH / 2];
    char url[MML_MAX_LINE_LENGTH / 2];
} mml_image_t;

// Section structure
typedef struct {
    char title[MML_MAX_TITLE_LENGTH];
    char content[MML_MAX_CONTENT_LENGTH];
    mml_metadata_t metadata[MML_MAX_METADATA];
    uint8_t metadata_count;
    mml_link_t links[8];
    uint8_t link_count;
    mml_image_t images[4];
    uint8_t image_count;
} mml_section_t;

// Document structure
typedef struct {
    char title[MML_MAX_TITLE_LENGTH];
    mml_metadata_t metadata[MML_MAX_METADATA];
    uint8_t metadata_count;
    mml_section_t sections[MML_MAX_SECTIONS];
    uint8_t section_count;
    mml_link_t links[8];
    uint8_t link_count;

    // Statistics
    uint16_t total_lines;
    uint16_t parsed_lines;
    uint16_t error_lines;
} mml_document_t;

// Parser state
typedef struct {
    mml_document_t* document;
    uint8_t current_section;
    bool in_code_block;
    char code_buffer[MML_MAX_CONTENT_LENGTH];
    uint16_t code_length;
} mml_parser_state_t;

// Function declarations

/**
 * Initialize a new MML document
 * @param doc Pointer to document structure
 */
void mml_init_document(mml_document_t* doc);

/**
 * Parse MML text into document structure
 * @param text Input MML text (null-terminated)
 * @param doc Pointer to document structure to fill
 * @return true on success, false on error
 */
bool mml_parse(const char* text, mml_document_t* doc);

/**
 * Parse a single line of MML
 * @param line Input line (null-terminated)
 * @param state Parser state
 * @return true on success, false on error
 */
bool mml_parse_line(const char* line, mml_parser_state_t* state);

/**
 * Identify MML tag from string
 * @param tag_str Tag string (without colon)
 * @return Tag enumeration value
 */
mml_tag_t mml_identify_tag(const char* tag_str);

/**
 * Convert tag enumeration to string
 * @param tag Tag enumeration value
 * @return Tag string (with colon)
 */
const char* mml_tag_to_string(mml_tag_t tag);

/**
 * Validate document structure
 * @param doc Document to validate
 * @return true if valid, false otherwise
 */
bool mml_validate_document(const mml_document_t* doc);

/**
 * Get parsing statistics
 * @param doc Document
 * @return String with statistics (caller must free)
 */
char* mml_get_statistics(const mml_document_t* doc);

/**
 * Convert document to JSON string
 * @param doc Document
 * @param buffer Output buffer
 * @param buffer_size Size of output buffer
 * @return true on success, false if buffer too small
 */
bool mml_to_json(const mml_document_t* doc, char* buffer, uint16_t buffer_size);

/**
 * Convert document to HTML string
 * @param doc Document
 * @param buffer Output buffer
 * @param buffer_size Size of output buffer
 * @return true on success, false if buffer too small
 */
bool mml_to_html(const mml_document_t* doc, char* buffer, uint16_t buffer_size);

/**
 * Compress document to MMLC format
 * @param doc Input document
 * @param buffer Output buffer
 * @param buffer_size Size of output buffer
 * @return true on success, false if buffer too small
 */
bool mml_compress(const mml_document_t* doc, char* buffer, uint16_t buffer_size);

/**
 * Utility functions
 */

/**
 * Safe string copy with bounds checking
 * @param dest Destination buffer
 * @param src Source string
 * @param dest_size Size of destination buffer
 * @return true on success, false if truncated
 */
bool mml_safe_strncpy(char* dest, const char* src, uint16_t dest_size);

/**
 * Trim whitespace from string
 * @param str String to trim (modified in place)
 */
void mml_trim_string(char* str);

/**
 * Split string by delimiter (first occurrence)
 * @param str Input string
 * @param delim Delimiter character
 * @param left Left part output (optional)
 * @param right Right part output (optional)
 * @param max_len Maximum length for parts
 */
void mml_split_string(const char* str, char delim,
                     char* left, char* right, uint16_t max_len);

/**
 * URL encode string for HTML output
 * @param input Input string
 * @param output Output buffer
 * @param output_size Size of output buffer
 * @return true on success, false if buffer too small
 */
bool mml_url_encode(const char* input, char* output, uint16_t output_size);

/**
 * Error codes
 */
typedef enum {
    MML_SUCCESS = 0,
    MML_ERROR_INVALID_INPUT,
    MML_ERROR_BUFFER_OVERFLOW,
    MML_ERROR_INVALID_TAG,
    MML_ERROR_TOO_MANY_SECTIONS,
    MML_ERROR_TOO_MANY_METADATA,
    MML_ERROR_PARSE_ERROR
} mml_error_t;

/**
 * Get error message for error code
 * @param error Error code
 * @return Error message string
 */
const char* mml_error_message(mml_error_t error);

#ifdef __cplusplus
}
#endif

#endif /* MML_PARSER_H */
