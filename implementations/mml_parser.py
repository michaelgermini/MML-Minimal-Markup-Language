"""
MML Parser - Python Implementation
Minimal Markup Language Parser

This is a basic implementation demonstrating core MML parsing functionality.
For production use, consider additional error handling and optimizations.
"""

class MMLParser:
    def __init__(self):
        self.reset()

    def reset(self):
        """Reset parser state"""
        self.document = {
            'type': 'document',
            'title': None,
            'metadata': {},
            'sections': []
        }
        self.current_section = None

    def parse(self, mml_text):
        """
        Parse MML text into document structure

        Args:
            mml_text (str): Raw MML content

        Returns:
            dict: Parsed document object
        """
        self.reset()

        if not mml_text or not isinstance(mml_text, str):
            raise ValueError("Invalid MML input: must be a non-empty string")

        lines = mml_text.split('\n')

        for line in lines:
            line = line.strip()
            if line and ':' in line:
                self._parse_line(line)

        return self.document

    def _parse_line(self, line):
        """Parse a single MML line"""
        colon_index = line.find(':')
        if colon_index == -1:
            return

        tag = line[:colon_index].strip().upper()
        content = line[colon_index + 1:].strip()

        self._process_tag(tag, content)

    def _process_tag(self, tag, content):
        """Process a tag and its content"""
        if tag == 'T':
            self.document['title'] = content

        elif tag == 'H':
            self.current_section = {
                'type': 'section',
                'title': content,
                'metadata': {},
                'children': []
            }
            self.document['sections'].append(self.current_section)

        elif tag == 'P':
            if self.current_section:
                self.current_section['children'].append({
                    'type': 'paragraph',
                    'content': content
                })

        elif tag == 'M':
            parts = content.split('|', 1)
            key = parts[0].strip()
            value = parts[1].strip() if len(parts) > 1 else ''

            metadata_target = self.current_section['metadata'] if self.current_section else self.document['metadata']
            metadata_target[key] = value

        elif tag == 'L':
            parts = content.split('|', 1)
            link_text = parts[0].strip()
            link_url = parts[1].strip() if len(parts) > 1 else ''

            link_node = {
                'type': 'link',
                'text': link_text,
                'url': link_url
            }

            if self.current_section:
                self.current_section['children'].append(link_node)
            else:
                if 'links' not in self.document:
                    self.document['links'] = []
                self.document['links'].append(link_node)

        elif tag == 'Q':
            if self.current_section:
                self.current_section['children'].append({
                    'type': 'quote',
                    'content': content
                })

        elif tag == 'C':
            if self.current_section:
                self.current_section['children'].append({
                    'type': 'code',
                    'content': content
                })

        elif tag == 'IMG':
            parts = content.split('|', 1)
            img_desc = parts[0].strip()
            img_url = parts[1].strip() if len(parts) > 1 else ''

            img_node = {
                'type': 'image',
                'description': img_desc,
                'url': img_url
            }

            if self.current_section:
                self.current_section['children'].append(img_node)

        else:
            # Unknown tag - could log warning
            print(f"Warning: Unknown MML tag: {tag}")

    def to_html(self, doc=None):
        """
        Convert parsed document to HTML

        Args:
            doc (dict, optional): Parsed document. Uses current document if None.

        Returns:
            str: HTML representation
        """
        if doc is None:
            doc = self.document

        html = f"""<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>{self._escape_html(doc['title'] or 'Document MML')}</title>
</head>
<body>"""

        if doc['title']:
            html += f"<h1>{self._escape_html(doc['title'])}</h1>"

        for section in doc['sections']:
            html += f"<h2>{self._escape_html(section['title'])}</h2>"
            for child in section['children']:
                html += self._node_to_html(child)

        html += "</body></html>"
        return html

    def _node_to_html(self, node):
        """Convert a node to HTML"""
        node_type = node['type']

        if node_type == 'paragraph':
            return f"<p>{self._escape_html(node['content'])}</p>"
        elif node_type == 'quote':
            return f"<blockquote>{self._escape_html(node['content'])}</blockquote>"
        elif node_type == 'code':
            return f"<pre><code>{self._escape_html(node['content'])}</code></pre>"
        elif node_type == 'link':
            return f"<p><a href=\"{self._escape_html(node['url'])}\">{self._escape_html(node['text'])}</a></p>"
        elif node_type == 'image':
            return f"""<figure>
  <img src="{self._escape_html(node['url'])}" alt="{self._escape_html(node['description'])}">
  <figcaption>{self._escape_html(node['description'])}</figcaption>
</figure>"""
        else:
            return f"<p>{self._escape_html(node.get('content', ''))}</p>"

    def _escape_html(self, text):
        """Escape HTML special characters"""
        return (text
                .replace('&', '&amp;')
                .replace('<', '&lt;')
                .replace('>', '&gt;')
                .replace('"', '&quot;')
                .replace("'", '&#39;'))

    def to_json(self, doc=None):
        """
        Convert parsed document to JSON

        Args:
            doc (dict, optional): Parsed document. Uses current document if None.

        Returns:
            str: JSON representation
        """
        import json
        if doc is None:
            doc = self.document
        return json.dumps(doc, indent=2, ensure_ascii=False)


# Example usage
if __name__ == "__main__":
    parser = MMLParser()

    mml_content = """T:Test Document
H:Section 1
P:This is a paragraph
M:Author|John Doe
L:Documentation|https://example.com
Q:Important note
"""

    # Parse the document
    doc = parser.parse(mml_content)
    print("Parsed document:")
    print(parser.to_json(doc))

    print("\nHTML output:")
    print(parser.to_html(doc))
