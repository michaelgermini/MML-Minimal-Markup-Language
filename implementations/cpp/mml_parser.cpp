/**
 * MML Parser - C/C++ Implementation for Embedded Systems
 * Implementation file
 */

#include "mml_parser.h"
#include <string.h>
#include <stdio.h>
#include <ctype.h>

// Static lookup table for tag identification
static const struct {
    const char* str;
    mml_tag_t tag;
} tag_lookup[] = {
    {"T", MML_TAG_TITLE},
    {"H", MML_TAG_SECTION},
    {"P", MML_TAG_PARAGRAPH},
    {"M", MML_TAG_METADATA},
    {"L", MML_TAG_LINK},
    {"IMG", MML_TAG_IMAGE},
    {"C", MML_TAG_CODE},
    {"Q", MML_TAG_QUOTE},
    {"CFG", MML_TAG_CONFIG},
    {"PKT", MML_TAG_PACKET},
    {NULL, MML_TAG_UNKNOWN}
};

void mml_init_document(mml_document_t* doc) {
    if (!doc) return;

    memset(doc, 0, sizeof(mml_document_t));
}

bool mml_parse(const char* text, mml_document_t* doc) {
    if (!text || !doc) return false;

    mml_init_document(doc);

    mml_parser_state_t state;
    state.document = doc;
    state.current_section = 0xFF; // Invalid index
    state.in_code_block = false;
    state.code_length = 0;

    const char* line_start = text;
    const char* text_end = text + strlen(text);
    uint16_t line_number = 0;

    doc->total_lines = 0;

    while (line_start < text_end) {
        // Find end of line
        const char* line_end = line_start;
        while (line_end < text_end && *line_end != '\n' && *line_end != '\r') {
            line_end++;
        }

        // Extract line
        char line[MML_MAX_LINE_LENGTH];
        uint16_t line_length = line_end - line_start;
        if (line_length >= MML_MAX_LINE_LENGTH) {
            line_length = MML_MAX_LINE_LENGTH - 1;
        }

        if (line_length > 0) {
            memcpy(line, line_start, line_length);
            line[line_length] = '\0';

            // Trim whitespace
            mml_trim_string(line);

            // Parse line if not empty
            if (strlen(line) > 0) {
                doc->total_lines++;
                if (!mml_parse_line(line, &state)) {
                    doc->error_lines++;
                } else {
                    doc->parsed_lines++;
                }
            }
        }

        // Move to next line
        line_start = line_end;
        while (line_start < text_end && (*line_start == '\n' || *line_start == '\r')) {
            line_start++;
        }
    }

    return true;
}

bool mml_parse_line(const char* line, mml_parser_state_t* state) {
    if (!line || !state || !state->document) return false;

    // Find colon separator
    const char* colon_pos = strchr(line, ':');
    if (!colon_pos) return false; // Not a valid MML line

    // Extract tag
    char tag_str[MML_MAX_LINE_LENGTH];
    uint16_t tag_length = colon_pos - line;
    if (tag_length >= sizeof(tag_str)) return false;

    memcpy(tag_str, line, tag_length);
    tag_str[tag_length] = '\0';
    mml_trim_string(tag_str);

    // Extract content
    const char* content = colon_pos + 1;
    while (*content == ' ' || *content == '\t') content++;

    mml_tag_t tag = mml_identify_tag(tag_str);

    // Process based on tag
    mml_document_t* doc = state->document;

    switch (tag) {
        case MML_TAG_TITLE:
            return mml_safe_strncpy(doc->title, content, sizeof(doc->title));

        case MML_TAG_SECTION:
            if (doc->section_count >= MML_MAX_SECTIONS) return false;
            mml_section_t* section = &doc->sections[doc->section_count];
            memset(section, 0, sizeof(mml_section_t));
            bool success = mml_safe_strncpy(section->title, content, sizeof(section->title));
            if (success) {
                state->current_section = doc->section_count;
                doc->section_count++;
            }
            return success;

        case MML_TAG_PARAGRAPH:
            if (state->current_section >= MML_MAX_SECTIONS) return false;
            mml_section_t* section = &doc->sections[state->current_section];
            return mml_safe_strncpy(section->content, content, sizeof(section->content));

        case MML_TAG_METADATA: {
            char key[MML_MAX_LINE_LENGTH / 4];
            char value[MML_MAX_LINE_LENGTH / 4];
            mml_split_string(content, '|', key, value, sizeof(key));

            mml_metadata_t* metadata;
            uint8_t* count;

            if (state->current_section < MML_MAX_SECTIONS) {
                // Section metadata
                mml_section_t* section = &doc->sections[state->current_section];
                metadata = &section->metadata[section->metadata_count];
                count = &section->metadata_count;
                if (*count >= MML_MAX_METADATA) return false;
            } else {
                // Global metadata
                metadata = &doc->metadata[doc->metadata_count];
                count = &doc->metadata_count;
                if (*count >= MML_MAX_METADATA) return false;
            }

            bool success = mml_safe_strncpy(metadata->key, key, sizeof(metadata->key)) &&
                           mml_safe_strncpy(metadata->value, value, sizeof(metadata->value));
            if (success) {
                (*count)++;
            }
            return success;
        }

        case MML_TAG_LINK: {
            if (state->current_section >= MML_MAX_SECTIONS &&
                doc->link_count >= sizeof(doc->links) / sizeof(doc->links[0])) {
                return false;
            }

            char text[MML_MAX_LINE_LENGTH / 2];
            char url[MML_MAX_LINE_LENGTH / 2];
            mml_split_string(content, '|', text, url, sizeof(text));

            mml_link_t* link;
            uint8_t* count;

            if (state->current_section < MML_MAX_SECTIONS) {
                // Section link
                mml_section_t* section = &doc->sections[state->current_section];
                if (section->link_count >= sizeof(section->links) / sizeof(section->links[0])) {
                    return false;
                }
                link = &section->links[section->link_count];
                count = &section->link_count;
            } else {
                // Global link
                link = &doc->links[doc->link_count];
                count = &doc->link_count;
            }

            bool success = mml_safe_strncpy(link->text, text, sizeof(link->text)) &&
                           mml_safe_strncpy(link->url, url, sizeof(link->url));
            if (success) {
                (*count)++;
            }
            return success;
        }

        case MML_TAG_IMAGE: {
            if (state->current_section >= MML_MAX_SECTIONS) return false;
            mml_section_t* section = &doc->sections[state->current_section];

            if (section->image_count >= sizeof(section->images) / sizeof(section->images[0])) {
                return false;
            }

            char description[MML_MAX_LINE_LENGTH / 2];
            char url[MML_MAX_LINE_LENGTH / 2];
            mml_split_string(content, '|', description, url, sizeof(description));

            mml_image_t* image = &section->images[section->image_count];
            bool success = mml_safe_strncpy(image->description, description, sizeof(image->description)) &&
                           mml_safe_strncpy(image->url, url, sizeof(image->url));
            if (success) {
                section->image_count++;
            }
            return success;
        }

        case MML_TAG_CODE:
            // For embedded systems, we treat code blocks as regular content
            if (state->current_section >= MML_MAX_SECTIONS) return false;
            mml_section_t* section = &doc->sections[state->current_section];
            return mml_safe_strncpy(section->content, content, sizeof(section->content));

        case MML_TAG_QUOTE:
            if (state->current_section >= MML_MAX_SECTIONS) return false;
            mml_section_t* section = &doc->sections[state->current_section];
            char quote_content[MML_MAX_CONTENT_LENGTH];
            snprintf(quote_content, sizeof(quote_content), "> %s", content);
            return mml_safe_strncpy(section->content, quote_content, sizeof(section->content));

        default:
            // Unknown tag - ignore silently for robustness
            return true;
    }
}

mml_tag_t mml_identify_tag(const char* tag_str) {
    if (!tag_str) return MML_TAG_UNKNOWN;

    for (int i = 0; tag_lookup[i].str != NULL; i++) {
        if (strcmp(tag_lookup[i].str, tag_str) == 0) {
            return tag_lookup[i].tag;
        }
    }

    return MML_TAG_UNKNOWN;
}

const char* mml_tag_to_string(mml_tag_t tag) {
    for (int i = 0; tag_lookup[i].str != NULL; i++) {
        if (tag_lookup[i].tag == tag) {
            static char buffer[8];
            snprintf(buffer, sizeof(buffer), "%s:", tag_lookup[i].str);
            return buffer;
        }
    }
    return "UNKNOWN:";
}

bool mml_validate_document(const mml_document_t* doc) {
    if (!doc) return false;

    // Basic validation
    if (doc->section_count > MML_MAX_SECTIONS) return false;
    if (doc->metadata_count > MML_MAX_METADATA) return false;

    // Validate sections
    for (uint8_t i = 0; i < doc->section_count; i++) {
        const mml_section_t* section = &doc->sections[i];
        if (strlen(section->title) == 0) return false;
        if (section->metadata_count > MML_MAX_METADATA) return false;
    }

    return true;
}

char* mml_get_statistics(const mml_document_t* doc) {
    static char buffer[512];

    if (!doc) {
        strcpy(buffer, "Document invalide");
        return buffer;
    }

    uint16_t total_metadata = doc->metadata_count;
    uint16_t total_links = doc->link_count;
    uint16_t total_images = 0;

    for (uint8_t i = 0; i < doc->section_count; i++) {
        total_metadata += doc->sections[i].metadata_count;
        total_links += doc->sections[i].link_count;
        total_images += doc->sections[i].image_count;
    }

    snprintf(buffer, sizeof(buffer),
             "Titre: %s\n"
             "Sections: %d\n"
             "Métadonnées: %d\n"
             "Liens: %d\n"
             "Images: %d\n"
             "Lignes totales: %d\n"
             "Lignes parsées: %d\n"
             "Erreurs: %d",
             doc->title[0] ? "Oui" : "Non",
             doc->section_count,
             total_metadata,
             total_links,
             total_images,
             doc->total_lines,
             doc->parsed_lines,
             doc->error_lines);

    return buffer;
}

bool mml_to_json(const mml_document_t* doc, char* buffer, uint16_t buffer_size) {
    if (!doc || !buffer || buffer_size == 0) return false;

    uint16_t pos = 0;
    int written;

    // Start document
    written = snprintf(buffer + pos, buffer_size - pos,
                      "{\"title\":\"%s\",\"metadata\":[", doc->title);
    if (written < 0 || pos + written >= buffer_size) return false;
    pos += written;

    // Global metadata
    for (uint8_t i = 0; i < doc->metadata_count; i++) {
        written = snprintf(buffer + pos, buffer_size - pos,
                          "{\"key\":\"%s\",\"value\":\"%s\"}%s",
                          doc->metadata[i].key, doc->metadata[i].value,
                          (i < doc->metadata_count - 1) ? "," : "");
        if (written < 0 || pos + written >= buffer_size) return false;
        pos += written;
    }

    // Sections
    written = snprintf(buffer + pos, buffer_size - pos, "],\"sections\":[");
    if (written < 0 || pos + written >= buffer_size) return false;
    pos += written;

    for (uint8_t i = 0; i < doc->section_count; i++) {
        const mml_section_t* section = &doc->sections[i];
        written = snprintf(buffer + pos, buffer_size - pos,
                          "{\"title\":\"%s\",\"content\":\"%s\",\"metadata\":[",
                          section->title, section->content);
        if (written < 0 || pos + written >= buffer_size) return false;
        pos += written;

        // Section metadata
        for (uint8_t j = 0; j < section->metadata_count; j++) {
            written = snprintf(buffer + pos, buffer_size - pos,
                              "{\"key\":\"%s\",\"value\":\"%s\"}%s",
                              section->metadata[j].key, section->metadata[j].value,
                              (j < section->metadata_count - 1) ? "," : "");
            if (written < 0 || pos + written >= buffer_size) return false;
            pos += written;
        }

        written = snprintf(buffer + pos, buffer_size - pos, "]}%s",
                          (i < doc->section_count - 1) ? "," : "");
        if (written < 0 || pos + written >= buffer_size) return false;
        pos += written;
    }

    // Close document
    written = snprintf(buffer + pos, buffer_size - pos, "]}");
    if (written < 0 || pos + written >= buffer_size) return false;
    pos += written;

    return true;
}

bool mml_to_html(const mml_document_t* doc, char* buffer, uint16_t buffer_size) {
    if (!doc || !buffer || buffer_size == 0) return false;

    uint16_t pos = 0;
    int written;

    // HTML header
    written = snprintf(buffer + pos, buffer_size - pos,
                      "<!DOCTYPE html>\n<html>\n<head>\n"
                      "<meta charset=\"utf-8\">\n<title>%s</title>\n</head>\n<body>\n",
                      doc->title);
    if (written < 0 || pos + written >= buffer_size) return false;
    pos += written;

    if (doc->title[0]) {
        written = snprintf(buffer + pos, buffer_size - pos,
                          "<h1>%s</h1>\n", doc->title);
        if (written < 0 || pos + written >= buffer_size) return false;
        pos += written;
    }

    // Sections
    for (uint8_t i = 0; i < doc->section_count; i++) {
        const mml_section_t* section = &doc->sections[i];

        written = snprintf(buffer + pos, buffer_size - pos,
                          "<h2>%s</h2>\n", section->title);
        if (written < 0 || pos + written >= buffer_size) return false;
        pos += written;

        if (section->content[0]) {
            written = snprintf(buffer + pos, buffer_size - pos,
                              "<p>%s</p>\n", section->content);
            if (written < 0 || pos + written >= buffer_size) return false;
            pos += written;
        }

        // Links
        for (uint8_t j = 0; j < section->link_count; j++) {
            const mml_link_t* link = &section->links[j];
            written = snprintf(buffer + pos, buffer_size - pos,
                              "<p><a href=\"%s\">%s</a></p>\n",
                              link->url, link->text);
            if (written < 0 || pos + written >= buffer_size) return false;
            pos += written;
        }

        // Images
        for (uint8_t j = 0; j < section->image_count; j++) {
            const mml_image_t* image = &section->images[j];
            written = snprintf(buffer + pos, buffer_size - pos,
                              "<figure>\n<img src=\"%s\" alt=\"%s\">\n"
                              "<figcaption>%s</figcaption>\n</figure>\n",
                              image->url, image->description, image->description);
            if (written < 0 || pos + written >= buffer_size) return false;
            pos += written;
        }
    }

    // HTML footer
    written = snprintf(buffer + pos, buffer_size - pos, "</body>\n</html>\n");
    if (written < 0 || pos + written >= buffer_size) return false;
    pos += written;

    return true;
}

bool mml_compress(const mml_document_t* doc, char* buffer, uint16_t buffer_size) {
    if (!doc || !buffer || buffer_size == 0) return false;

    uint16_t pos = 0;
    int written;

    // Title
    if (doc->title[0]) {
        written = snprintf(buffer + pos, buffer_size - pos, "1:%s\n", doc->title);
        if (written < 0 || pos + written >= buffer_size) return false;
        pos += written;
    }

    // Global metadata
    for (uint8_t i = 0; i < doc->metadata_count; i++) {
        written = snprintf(buffer + pos, buffer_size - pos, "3:%s|%s\n",
                          doc->metadata[i].key, doc->metadata[i].value);
        if (written < 0 || pos + written >= buffer_size) return false;
        pos += written;
    }

    // Sections
    for (uint8_t i = 0; i < doc->section_count; i++) {
        const mml_section_t* section = &doc->sections[i];

        written = snprintf(buffer + pos, buffer_size - pos, "2:%s\n", section->title);
        if (written < 0 || pos + written >= buffer_size) return false;
        pos += written;

        if (section->content[0]) {
            written = snprintf(buffer + pos, buffer_size - pos, "4:%s\n", section->content);
            if (written < 0 || pos + written >= buffer_size) return false;
            pos += written;
        }

        // Section metadata
        for (uint8_t j = 0; j < section->metadata_count; j++) {
            written = snprintf(buffer + pos, buffer_size - pos, "3:%s|%s\n",
                              section->metadata[j].key, section->metadata[j].value);
            if (written < 0 || pos + written >= buffer_size) return false;
            pos += written;
        }
    }

    // Ensure null termination
    if (pos < buffer_size) {
        buffer[pos] = '\0';
        return true;
    }

    return false;
}

// Utility functions

bool mml_safe_strncpy(char* dest, const char* src, uint16_t dest_size) {
    if (!dest || !src || dest_size == 0) return false;

    uint16_t i;
    for (i = 0; i < dest_size - 1 && src[i]; i++) {
        dest[i] = src[i];
    }
    dest[i] = '\0';

    return src[i] == '\0'; // Return true if full string was copied
}

void mml_trim_string(char* str) {
    if (!str) return;

    // Trim leading whitespace
    char* start = str;
    while (*start && (*start == ' ' || *start == '\t' || *start == '\n' || *start == '\r')) {
        start++;
    }

    // Trim trailing whitespace
    char* end = start + strlen(start) - 1;
    while (end >= start && (*end == ' ' || *end == '\t' || *end == '\n' || *end == '\r')) {
        *end = '\0';
        end--;
    }

    // Move string to beginning if needed
    if (start != str) {
        memmove(str, start, strlen(start) + 1);
    }
}

void mml_split_string(const char* str, char delim, char* left, char* right, uint16_t max_len) {
    if (!str || !left || !right) return;

    const char* delim_pos = strchr(str, delim);
    if (!delim_pos) {
        // No delimiter found
        mml_safe_strncpy(left, str, max_len);
        right[0] = '\0';
        return;
    }

    // Copy left part
    uint16_t left_len = delim_pos - str;
    if (left_len >= max_len) left_len = max_len - 1;
    memcpy(left, str, left_len);
    left[left_len] = '\0';

    // Copy right part
    const char* right_start = delim_pos + 1;
    mml_safe_strncpy(right, right_start, max_len);
}

bool mml_url_encode(const char* input, char* output, uint16_t output_size) {
    if (!input || !output || output_size == 0) return false;

    uint16_t pos = 0;
    const char* hex = "0123456789ABCDEF";

    for (uint16_t i = 0; input[i] && pos < output_size - 4; i++) {
        char c = input[i];
        if ((c >= 'A' && c <= 'Z') || (c >= 'a' && c <= 'z') ||
            (c >= '0' && c <= '9') || c == '-' || c == '_' || c == '.' || c == '~') {
            output[pos++] = c;
        } else {
            output[pos++] = '%';
            output[pos++] = hex[(c >> 4) & 0xF];
            output[pos++] = hex[c & 0xF];
        }
    }

    output[pos] = '\0';
    return input[strlen(input)] == '\0'; // True if full string was encoded
}

const char* mml_error_message(mml_error_t error) {
    static const char* messages[] = {
        "Success",
        "Invalid input",
        "Buffer overflow",
        "Invalid tag",
        "Too many sections",
        "Too many metadata entries",
        "Parse error"
    };

    if (error >= 0 && error < (int)(sizeof(messages) / sizeof(messages[0]))) {
        return messages[error];
    }

    return "Unknown error";
}
