"""
Tests unitaires pour le parser MML Python
Utilise pytest comme framework de test
"""

import pytest
import json
from implementations.mml_parser import MMLParser


class TestMMLParser:
    """Tests pour la classe MMLParser"""

    def setup_method(self):
        """Configuration avant chaque test"""
        self.parser = MMLParser()

    def test_initialization(self):
        """Test d'initialisation du parser"""
        assert isinstance(self.parser, MMLParser)
        assert self.parser.document == {
            'title': '',
            'sections': []
        }

    def test_reset(self):
        """Test de la méthode reset"""
        self.parser.document['title'] = 'Test'
        self.parser.document['sections'].append({'title': 'Section', 'content': []})
        self.parser.reset()
        assert self.parser.document == {
            'title': '',
            'sections': []
        }

    def test_parse_minimal_document(self):
        """Test de parsing d'un document minimal"""
        result = self.parser.parse('T:Test document')
        assert result['title'] == 'Test document'
        assert result['sections'] == []

    def test_parse_with_empty_lines(self):
        """Test de gestion des lignes vides"""
        mml_text = '\n\nT:Test\n\nH:Section\n\n'
        result = self.parser.parse(mml_text)
        assert result['title'] == 'Test'
        assert len(result['sections']) == 1
        assert result['sections'][0]['title'] == 'Section'

    def test_parse_ignore_lines_without_colon(self):
        """Test d'ignorance des lignes sans deux-points"""
        mml_text = 'Ceci est une ligne sans balise\nT:Test document\nAutre ligne'
        result = self.parser.parse(mml_text)
        assert result['title'] == 'Test document'

    def test_parse_handle_spaces_around_tags(self):
        """Test de gestion des espaces autour des balises"""
        mml_text = '  T  :  Mon titre  '
        result = self.parser.parse(mml_text)
        assert result['title'] == 'Mon titre'

    def test_parse_title_simple(self):
        """Test de parsing d'un titre simple"""
        result = self.parser.parse('T:Mon titre')
        assert result['title'] == 'Mon titre'

    def test_parse_title_override(self):
        """Test d'écrasement du titre précédent"""
        result = self.parser.parse('T:Premier titre\nT:Deuxième titre')
        assert result['title'] == 'Deuxième titre'

    def test_parse_single_section(self):
        """Test de parsing d'une section simple"""
        result = self.parser.parse('H:Ma section')
        assert len(result['sections']) == 1
        assert result['sections'][0]['title'] == 'Ma section'
        assert result['sections'][0]['content'] == []

    def test_parse_multiple_sections(self):
        """Test de parsing de plusieurs sections"""
        result = self.parser.parse('H:Section 1\nH:Section 2\nH:Section 3')
        assert len(result['sections']) == 3
        assert result['sections'][0]['title'] == 'Section 1'
        assert result['sections'][1]['title'] == 'Section 2'
        assert result['sections'][2]['title'] == 'Section 3'

    def test_parse_section_with_metadata(self):
        """Test de parsing d'une section avec métadonnées"""
        result = self.parser.parse('H:Section principale\nM:Niveau|1\nM:Priorité|Haute')
        section = result['sections'][0]
        assert section['metadata']['Niveau'] == '1'
        assert section['metadata']['Priorité'] == 'Haute'

    def test_parse_paragraph_in_section(self):
        """Test de parsing d'un paragraphe dans une section"""
        result = self.parser.parse('H:Introduction\nP:Ceci est un paragraphe')
        section = result['sections'][0]
        assert len(section['children']) == 1
        assert section['children'][0]['type'] == 'paragraph'
        assert section['children'][0]['content'] == 'Ceci est un paragraphe'

    def test_parse_multiple_paragraphs(self):
        """Test de parsing de plusieurs paragraphes"""
        result = self.parser.parse('H:Section\nP:Premier paragraphe\nP:Deuxième paragraphe')
        section = result['sections'][0]
        assert len(section['children']) == 2
        assert section['children'][0]['content'] == 'Premier paragraphe'
        assert section['children'][1]['content'] == 'Deuxième paragraphe'

    def test_parse_paragraph_without_section_ignored(self):
        """Test d'ignorance des paragraphes sans section"""
        result = self.parser.parse('P:Paragraphe orphelin')
        assert len(result['sections']) == 0

    def test_parse_global_metadata(self):
        """Test de parsing des métadonnées globales"""
        result = self.parser.parse('M:Auteur|Jean Dupont\nM:Version|1.0')
        assert result['metadata']['Auteur'] == 'Jean Dupont'
        assert result['metadata']['Version'] == '1.0'

    def test_parse_section_metadata(self):
        """Test de parsing des métadonnées de section"""
        result = self.parser.parse('H:Chapitre 1\nM:Pages|15\nM:Difficulté|Facile')
        section = result['sections'][0]
        assert section['metadata']['Pages'] == '15'
        assert section['metadata']['Difficulté'] == 'Facile'

    def test_parse_metadata_without_value(self):
        """Test de parsing des métadonnées sans valeur"""
        result = self.parser.parse('M:Draft')
        assert result['metadata']['Draft'] == ''

    def test_parse_metadata_with_spaces(self):
        """Test de parsing des métadonnées avec espaces"""
        result = self.parser.parse('M: Date de création | 2025-01-01 ')
        assert result['metadata']['Date de création'] == '2025-01-01'

    def test_parse_simple_link(self):
        """Test de parsing d'un lien simple"""
        result = self.parser.parse('H:Resources\nL:Documentation|https://example.com')
        section = result['sections'][0]
        link = section['children'][0]
        assert link['type'] == 'link'
        assert link['text'] == 'Documentation'
        assert link['url'] == 'https://example.com'

    def test_parse_link_without_url(self):
        """Test de parsing d'un lien sans URL"""
        result = self.parser.parse('H:Section\nL:Référence locale')
        link = result['sections'][0]['children'][0]
        assert link['url'] == ''

    def test_parse_global_link(self):
        """Test de parsing d'un lien global"""
        result = self.parser.parse('L:Site officiel|https://mml-lang.org')
        assert len(result['links']) == 1
        assert result['links'][0]['text'] == 'Site officiel'
        assert result['links'][0]['url'] == 'https://mml-lang.org'

    def test_parse_quote(self):
        """Test de parsing d'une citation"""
        result = self.parser.parse('H:Section\nQ:Ceci est important')
        quote = result['sections'][0]['children'][0]
        assert quote['type'] == 'quote'
        assert quote['content'] == 'Ceci est important'

    def test_parse_code_block(self):
        """Test de parsing d'un bloc de code"""
        result = self.parser.parse('H:Exemple\nC:function test() { return true; }')
        code = result['sections'][0]['children'][0]
        assert code['type'] == 'code'
        assert code['content'] == 'function test() { return true; }'

    def test_parse_image(self):
        """Test de parsing d'une image"""
        result = self.parser.parse('H:Galerie\nIMG:Photo du projet|project.jpg')
        image = result['sections'][0]['children'][0]
        assert image['type'] == 'image'
        assert image['description'] == 'Photo du projet'
        assert image['url'] == 'project.jpg'

    def test_parse_invalid_input_types(self):
        """Test de rejet des types d'input invalides"""
        with pytest.raises(ValueError, match="Invalid MML input"):
            self.parser.parse(None)

        with pytest.raises(ValueError, match="Invalid MML input"):
            self.parser.parse(123)

        with pytest.raises(ValueError, match="Invalid MML input"):
            self.parser.parse({})

    def test_parse_unknown_tags_ignored(self):
        """Test d'ignorance des balises inconnues"""
        result = self.parser.parse('X:Balise inconnue\nT:Document valide')
        assert result['title'] == 'Document valide'
        # Aucune exception ne devrait être levée

    def test_to_html_simple_document(self):
        """Test de conversion HTML d'un document simple"""
        mml_text = 'T:Test Document\nH:Introduction\nP:Hello World'
        doc = self.parser.parse(mml_text)
        html = self.parser.to_html(doc)

        assert '<h1>Test Document</h1>' in html
        assert '<h2>Introduction</h2>' in html
        assert '<p>Hello World</p>' in html
        assert '<!DOCTYPE html>' in html
        assert 'lang="fr"' in html

    def test_to_html_escapes_dangerous_characters(self):
        """Test d'échappement des caractères HTML dangereux"""
        mml_text = 'H:Section\nP:Texte avec <script> et "guillemets"'
        doc = self.parser.parse(mml_text)
        html = self.parser.to_html(doc)

        assert '&lt;script&gt;' in html
        assert '&quot;guillemets&quot;' in html

    def test_to_html_link_conversion(self):
        """Test de conversion des liens en HTML"""
        mml_text = 'H:Liens\nL:Google|https://google.com'
        doc = self.parser.parse(mml_text)
        html = self.parser.to_html(doc)

        assert '<a href="https://google.com">Google</a>' in html

    def test_to_html_image_conversion(self):
        """Test de conversion des images en HTML"""
        mml_text = 'H:Images\nIMG:Logo MML|logo.png'
        doc = self.parser.parse(mml_text)
        html = self.parser.to_html(doc)

        assert 'src="logo.png"' in html
        assert 'alt="Logo MML"' in html
        assert '<figcaption>Logo MML</figcaption>' in html

    def test_to_json_conversion(self):
        """Test de conversion en JSON valide"""
        mml_text = 'T:Test\nH:Section\nP:Content'
        doc = self.parser.parse(mml_text)
        json_str = self.parser.to_json(doc)
        parsed = json.loads(json_str)

        assert parsed['title'] == 'Test'
        assert len(parsed['sections']) == 1
        assert parsed['sections'][0]['title'] == 'Section'
        assert parsed['sections'][0]['children'][0]['content'] == 'Content'

    def test_parse_complex_document(self):
        """Test de parsing d'un document complexe complet"""
        mml_text = '''T:Guide complet MML
M:Auteur|Équipe MML
M:Version|1.0

H:Introduction
P:Le MML est un langage simple.
Q:La simplicité est la sophistication ultime.

H:Fonctionnalités
P:Liste des principales fonctionnalités :
P:- Résilience
P:- Simplicité
P:- Universalité

L:Documentation complète|https://mml-lang.org
IMG:Logo MML|logo.png

C:function hello() {
C:  console.log('Hello MML!');
C:}'''

        result = self.parser.parse(mml_text)

        # Vérifications générales
        assert result['title'] == 'Guide complet MML'
        assert result['metadata']['Auteur'] == 'Équipe MML'
        assert result['metadata']['Version'] == '1.0'
        assert len(result['sections']) == 2

        # Vérification première section
        intro_section = result['sections'][0]
        assert intro_section['title'] == 'Introduction'
        assert len(intro_section['children']) == 2
        assert intro_section['children'][0]['type'] == 'paragraph'
        assert intro_section['children'][1]['type'] == 'quote'

        # Vérification deuxième section
        features_section = result['sections'][1]
        assert features_section['title'] == 'Fonctionnalités'
        assert len(features_section['children']) == 5

    def test_performance_large_document(self):
        """Test de performance avec un document volumineux"""
        import time

        # Créer un document avec 1000 lignes
        mml_text = 'T:Document volumineux\n'
        for i in range(100):
            mml_text += f'H:Section {i}\n'
            for j in range(9):
                mml_text += f'P:Paragraphe {i}-{j}\n'

        start_time = time.time()
        result = self.parser.parse(mml_text)
        end_time = time.time()

        assert len(result['sections']) == 100
        assert len(result['sections'][0]['children']) == 9
        assert (end_time - start_time) < 0.1  # Moins de 100ms

    def test_parse_edge_cases(self):
        """Test des cas limites"""
        # Document vide
        result = self.parser.parse('')
        assert result['title'] == ''
        assert result['sections'] == []

        # Seulement des espaces
        result = self.parser.parse('   \n  \n   ')
        assert result['title'] == ''
        assert result['sections'] == []

        # Ligne avec seulement deux-points
        result = self.parser.parse('T:Titre\n:\nH:Section')
        assert result['title'] == 'Titre'
        assert len(result['sections']) == 1

    def test_case_insensitive_tags(self):
        """Test de l'insensibilité à la casse des balises"""
        result = self.parser.parse('t:minuscule\nt:MAJUSCULE\nT:Mixte')
        assert result['title'] == 'Mixte'  # Dernier gagne

    def test_preserve_content_whitespace(self):
        """Test de préservation des espaces dans le contenu"""
        result = self.parser.parse('H:Test\nP:  Espaces préservés  ')
        assert result['sections'][0]['children'][0]['content'] == '  Espaces préservés  '
