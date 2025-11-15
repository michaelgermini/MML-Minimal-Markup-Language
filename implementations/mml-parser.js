/**
 * MML Parser - JavaScript Implementation
 * Minimal Markup Language Parser
 *
 * This is a basic implementation demonstrating core MML parsing functionality.
 * For production use, consider additional error handling and optimizations.
 */

class MMLParser {
  constructor() {
    this.reset();
  }

  reset() {
    this.document = {
      type: 'document',
      title: null,
      metadata: {},
      sections: []
    };
    this.currentSection = null;
  }

  /**
   * Parse MML text into document structure
   * @param {string} mmlText - Raw MML content
   * @returns {object} Parsed document object
   */
  parse(mmlText) {
    this.reset();

    if (!mmlText || typeof mmlText !== 'string') {
      throw new Error('Invalid MML input: must be a non-empty string');
    }

    const lines = mmlText.split('\n');

    for (const line of lines) {
      const trimmedLine = line.trim();
      if (trimmedLine && trimmedLine.includes(':')) {
        this.parseLine(trimmedLine);
      }
    }

    return this.document;
  }

  /**
   * Parse a single MML line
   * @param {string} line - Single MML line
   */
  parseLine(line) {
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) return;

    const tag = line.substring(0, colonIndex).trim().toUpperCase();
    const content = line.substring(colonIndex + 1).trim();

    this.processTag(tag, content);
  }

  /**
   * Process a tag and its content
   * @param {string} tag - MML tag
   * @param {string} content - Tag content
   */
  processTag(tag, content) {
    switch (tag) {
      case 'T':
        this.document.title = content;
        break;

      case 'H':
        this.currentSection = {
          type: 'section',
          title: content,
          metadata: {},
          children: []
        };
        this.document.sections.push(this.currentSection);
        break;

      case 'P':
        if (this.currentSection) {
          this.currentSection.children.push({
            type: 'paragraph',
            content: content
          });
        }
        break;

      case 'M':
        const [key, value] = content.split('|', 2);
        const metadataTarget = this.currentSection ?
          this.currentSection.metadata :
          this.document.metadata;

        metadataTarget[key.trim()] = value ? value.trim() : '';
        break;

      case 'L':
        const [linkText, linkUrl] = content.split('|', 2);
        const linkNode = {
          type: 'link',
          text: linkText.trim(),
          url: linkUrl ? linkUrl.trim() : ''
        };

        if (this.currentSection) {
          this.currentSection.children.push(linkNode);
        } else {
          if (!this.document.links) this.document.links = [];
          this.document.links.push(linkNode);
        }
        break;

      case 'Q':
        if (this.currentSection) {
          this.currentSection.children.push({
            type: 'quote',
            content: content
          });
        }
        break;

      case 'C':
        if (this.currentSection) {
          this.currentSection.children.push({
            type: 'code',
            content: content
          });
        }
        break;

      case 'IMG':
        const [imgDesc, imgUrl] = content.split('|', 2);
        const imgNode = {
          type: 'image',
          description: imgDesc.trim(),
          url: imgUrl ? imgUrl.trim() : ''
        };

        if (this.currentSection) {
          this.currentSection.children.push(imgNode);
        }
        break;

      // Add more tags as needed...

      default:
        // Unknown tag - could log warning or handle gracefully
        console.warn(`Unknown MML tag: ${tag}`);
    }
  }

  /**
   * Convert parsed document to HTML
   * @param {object} doc - Parsed MML document
   * @returns {string} HTML representation
   */
  toHTML(doc = this.document) {
    let html = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>${this.escapeHTML(doc.title || 'Document MML')}</title>
</head>
<body>`;

    if (doc.title) {
      html += `<h1>${this.escapeHTML(doc.title)}</h1>`;
    }

    for (const section of doc.sections) {
      html += `<h2>${this.escapeHTML(section.title)}</h2>`;
      for (const child of section.children) {
        html += this.nodeToHTML(child);
      }
    }

    html += '</body></html>';
    return html;
  }

  /**
   * Convert a node to HTML
   * @param {object} node - Document node
   * @returns {string} HTML string
   */
  nodeToHTML(node) {
    switch (node.type) {
      case 'paragraph':
        return `<p>${this.escapeHTML(node.content)}</p>`;
      case 'quote':
        return `<blockquote>${this.escapeHTML(node.content)}</blockquote>`;
      case 'code':
        return `<pre><code>${this.escapeHTML(node.content)}</code></pre>`;
      case 'link':
        return `<p><a href="${this.escapeHTML(node.url)}">${this.escapeHTML(node.text)}</a></p>`;
      case 'image':
        return `<figure>
  <img src="${this.escapeHTML(node.url)}" alt="${this.escapeHTML(node.description)}">
  <figcaption>${this.escapeHTML(node.description)}</figcaption>
</figure>`;
      default:
        return `<p>${this.escapeHTML(node.content || '')}</p>`;
    }
  }

  /**
   * Escape HTML special characters
   * @param {string} text - Text to escape
   * @returns {string} Escaped text
   */
  escapeHTML(text) {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /**
   * Convert parsed document to JSON
   * @param {object} doc - Parsed MML document
   * @returns {string} JSON representation
   */
  toJSON(doc = this.document) {
    return JSON.stringify(doc, null, 2);
  }
}

// Export for use in Node.js or browsers
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MMLParser;
}

// Example usage:
/*
const parser = new MMLParser();
const doc = parser.parse(`
T:Test Document
H:Section 1
P:This is a paragraph
M:Author|John Doe
`);

console.log(doc);
console.log(parser.toHTML(doc));
*/
