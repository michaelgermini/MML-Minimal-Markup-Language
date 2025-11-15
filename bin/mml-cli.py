#!/usr/bin/env python3
"""
MML CLI - Outil en ligne de commande pour le langage MML
Fournit validation, conversion et compression de documents MML
"""

import sys
import json
import argparse
from pathlib import Path
from implementations.mml_parser import MMLParser


class MMLCLI:
    def __init__(self):
        self.parser = MMLParser()

    def run(self):
        args = self.parse_args()

        try:
            if args.command == 'validate':
                self.validate_command(args)
            elif args.command == 'convert':
                self.convert_command(args)
            elif args.command == 'compress':
                self.compress_command(args)
            elif args.command == 'stats':
                self.stats_command(args)
        except Exception as e:
            print(f"Erreur: {e}", file=sys.stderr)
            sys.exit(1)

    def parse_args(self):
        parser = argparse.ArgumentParser(
            description='MML CLI - Outil pour le langage MML',
            formatter_class=argparse.RawDescriptionHelpFormatter,
            epilog="""
EXEMPLES:
  %(prog)s validate document.mml
  %(prog)s convert -f html document.mml page.html
  %(prog)s compress document.mml compressed.mml
  %(prog)s stats document.mml
  cat document.mml | %(prog)s convert --format json
            """
        )

        parser.add_argument(
            'command',
            choices=['validate', 'convert', 'compress', 'stats'],
            help='Commande à exécuter'
        )

        parser.add_argument(
            'input',
            nargs='?',
            help='Fichier d\'entrée (défaut: stdin)'
        )

        parser.add_argument(
            'output',
            nargs='?',
            help='Fichier de sortie (défaut: stdout)'
        )

        parser.add_argument(
            '-f', '--format',
            choices=['html', 'json', 'text'],
            default='html',
            help='Format de sortie pour la conversion (défaut: html)'
        )

        parser.add_argument(
            '-v', '--verbose',
            action='store_true',
            help='Mode verbeux'
        )

        return parser.parse_args()

    def read_input(self, args):
        """Lit l'entrée depuis un fichier ou stdin"""
        if not args.input or args.input == '-':
            return sys.stdin.read()
        else:
            input_path = Path(args.input)
            if not input_path.exists():
                raise FileNotFoundError(f"Fichier d'entrée introuvable: {args.input}")
            return input_path.read_text(encoding='utf-8')

    def write_output(self, args, data):
        """Écrit la sortie vers un fichier ou stdout"""
        if not args.output or args.output == '-':
            print(data, end='')
        else:
            output_path = Path(args.output)
            output_path.write_text(data, encoding='utf-8')
            if args.verbose:
                print(f"Fichier écrit: {args.output}", file=sys.stderr)

    def validate_command(self, args):
        """Valide un document MML"""
        input_data = self.read_input(args)
        doc = self.parser.parse(input_data)

        errors = self.validate_document(doc)

        if not errors:
            print("✅ Document MML valide", file=sys.stderr)
            if args.verbose:
                print(f"Titre: {doc['title'] or '(aucun)'}", file=sys.stderr)
                print(f"Sections: {len(doc['sections'])}", file=sys.stderr)
                print(f"Métadonnées: {len(doc['metadata'])}", file=sys.stderr)
        else:
            print("❌ Document MML invalide:", file=sys.stderr)
            for error in errors:
                print(f"  - {error}", file=sys.stderr)
            sys.exit(1)

    def convert_command(self, args):
        """Convertit un document MML"""
        input_data = self.read_input(args)
        doc = self.parser.parse(input_data)

        if args.format == 'html':
            output = self.parser.to_html(doc)
        elif args.format == 'json':
            output = self.parser.to_json(doc)
        elif args.format == 'text':
            output = self.to_plain_text(doc)

        self.write_output(args, output)

        if args.verbose:
            print(f"Conversion {args.input or 'stdin'} → {args.format}", file=sys.stderr)

    def compress_command(self, args):
        """Compresse un document MML"""
        input_data = self.read_input(args)
        compressed = self.compress_mml(input_data)

        self.write_output(args, compressed)

        if args.verbose:
            original_size = len(input_data.encode('utf-8'))
            compressed_size = len(compressed.encode('utf-8'))
            ratio = (original_size - compressed_size) / original_size * 100
            print(f"Compression: {original_size} → {compressed_size} octets ({ratio:.1f}% de réduction)", file=sys.stderr)

    def stats_command(self, args):
        """Affiche les statistiques d'un document MML"""
        input_data = self.read_input(args)
        doc = self.parser.parse(input_data)

        stats = self.calculate_stats(input_data, doc)

        print("📊 Statistiques du document MML:", file=sys.stderr)
        print(f"Titre: {'✅' if stats['title'] else '❌'}", file=sys.stderr)
        print(f"Sections: {stats['sections']}", file=sys.stderr)
        print(f"Paragraphes: {stats['paragraphs']}", file=sys.stderr)
        print(f"Liens: {stats['links']}", file=sys.stderr)
        print(f"Images: {stats['images']}", file=sys.stderr)
        print(f"Métadonnées: {stats['metadata']}", file=sys.stderr)
        print(f"Taille: {stats['size']} octets", file=sys.stderr)
        print(f"Lignes: {stats['lines']}", file=sys.stderr)
        print(f"Ratio signal/bruit: {stats['signal_ratio']}%", file=sys.stderr)

    def validate_document(self, doc):
        """Valide la structure d'un document MML"""
        errors = []

        # Validation basique
        if not doc['title'] and not doc['metadata'] and not doc['sections']:
            errors.append('Document vide ou mal formé')

        # Validation des sections
        for i, section in enumerate(doc['sections']):
            if not section['title']:
                errors.append(f"Section {i + 1}: titre manquant")

        # Validation des liens globaux
        if 'links' in doc:
            for i, link in enumerate(doc['links']):
                if not link['url']:
                    errors.append(f"Lien global {i + 1}: URL manquante")

        return errors

    def compress_mml(self, mml_text):
        """Compresse un texte MML vers MMLC"""
        lines = mml_text.split('\n')
        compressed_lines = []

        # Mapping des balises
        tag_map = {
            'T': '1', 'H': '2', 'M': '3', 'P': '4',
            'L': '5', 'IMG': '6', 'C': '7', 'Q': '8'
        }

        # Mapping des mots fréquents
        word_map = {
            'Rapport': 'R', 'Urgent': 'U', 'Critique': 'C',
            'Patient': 'P1', 'Victime': 'V', 'Secteur': 'S',
            'Évacuation': 'E', 'Médical': 'M', 'Stable': 'S1',
            'Alerte': 'A'
        }

        for line in lines:
            line = line.strip()
            if not line or ':' not in line:
                compressed_lines.append(line)
                continue

            tag, content = line.split(':', 1)
            tag = tag.strip().upper()
            content = content.strip()

            # Compression de la balise
            compressed_tag = tag_map.get(tag, tag)

            # Compression du contenu
            compressed_content = content
            for word, code in word_map.items():
                import re
                compressed_content = re.sub(r'\b' + re.escape(word) + r'\b',
                                          code, compressed_content)

            compressed_lines.append(f"{compressed_tag}:{compressed_content}")

        return '\n'.join(compressed_lines)

    def to_plain_text(self, doc):
        """Convertit un document MML en texte brut"""
        text = ''

        if doc['title']:
            text += f"{doc['title']}\n{'=' * len(doc['title'])}\n\n"

        for section in doc['sections']:
            text += f"{section['title']}\n{'-' * len(section['title'])}\n\n"
            for child in section['children']:
                if child['type'] == 'paragraph':
                    text += f"{child['content']}\n\n"
                elif child['type'] == 'quote':
                    text += f"> {child['content']}\n\n"
                elif child['type'] == 'link':
                    text += f"[{child['text']}]({child['url']})\n\n"
                elif child['type'] == 'code':
                    text += f"```\n{child['content']}\n```\n\n"
                elif child['type'] == 'image':
                    text += f"[Image: {child['description']}]\n\n"

        return text.strip()

    def calculate_stats(self, input_text, doc):
        """Calcule les statistiques d'un document"""
        lines = [line for line in input_text.split('\n') if line.strip()]
        size = len(input_text.encode('utf-8'))

        paragraphs = 0
        links = 0
        images = 0

        for section in doc['sections']:
            for child in section['children']:
                if child['type'] == 'paragraph':
                    paragraphs += 1
                elif child['type'] == 'link':
                    links += 1
                elif child['type'] == 'image':
                    images += 1

        # Liens globaux
        global_links = len(doc.get('links', []))

        # Ratio signal/bruit
        total_chars = len(input_text)
        syntax_chars = sum(len(line.split(':', 1)[0]) + 1
                          for line in lines if ':' in line)
        signal_ratio = int((total_chars - syntax_chars) / total_chars * 100) if total_chars > 0 else 0

        return {
            'title': bool(doc['title']),
            'sections': len(doc['sections']),
            'paragraphs': paragraphs,
            'links': links + global_links,
            'images': images,
            'metadata': len(doc['metadata']),
            'size': size,
            'lines': len(lines),
            'signal_ratio': signal_ratio
        }


def main():
    """Point d'entrée principal"""
    cli = MMLCLI()
    cli.run()


if __name__ == '__main__':
    main()
