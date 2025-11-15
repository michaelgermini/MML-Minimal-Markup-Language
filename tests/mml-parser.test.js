/**
 * Tests unitaires pour le parser MML JavaScript
 * Utilise Jest comme framework de test
 */

const MMLParser = require('../implementations/mml-parser.js');

describe('MMLParser', () => {
  let parser;

  beforeEach(() => {
    parser = new MMLParser();
  });

  describe('Initialisation', () => {
    test('devrait créer une instance valide', () => {
      expect(parser).toBeInstanceOf(MMLParser);
      expect(parser.document).toBeDefined();
    });

    test('devrait initialiser un document vide', () => {
      expect(parser.document.type).toBeUndefined(); // Sera défini après reset
      parser.reset();
      expect(parser.document.type).toBeUndefined();
      expect(parser.document.sections).toEqual([]);
    });
  });

  describe('Parsing de base', () => {
    test('devrait parser un document minimal', () => {
      const mmlText = 'T:Test document';
      const result = parser.parse(mmlText);

      expect(result.title).toBe('Test document');
      expect(result.sections).toEqual([]);
    });

    test('devrait gérer les lignes vides', () => {
      const mmlText = '\n\nT:Test\n\nH:Section\n\n';
      const result = parser.parse(mmlText);

      expect(result.title).toBe('Test');
      expect(result.sections).toHaveLength(1);
      expect(result.sections[0].title).toBe('Section');
    });

    test('devrait ignorer les lignes sans deux-points', () => {
      const mmlText = 'Ceci est une ligne sans balise\nT:Test document\nAutre ligne';
      const result = parser.parse(mmlText);

      expect(result.title).toBe('Test document');
    });

    test('devrait gérer les espaces autour des balises', () => {
      const mmlText = '  T  :  Mon titre  ';
      const result = parser.parse(mmlText);

      expect(result.title).toBe('Mon titre');
    });
  });

  describe('Parsing des balises T (Title)', () => {
    test('devrait parser un titre simple', () => {
      const result = parser.parse('T:Mon titre');
      expect(result.title).toBe('Mon titre');
    });

    test('devrait écraser le titre précédent', () => {
      const result = parser.parse('T:Premier titre\nT:Deuxième titre');
      expect(result.title).toBe('Deuxième titre');
    });
  });

  describe('Parsing des balises H (Header)', () => {
    test('devrait parser une section simple', () => {
      const result = parser.parse('H:Ma section');
      expect(result.sections).toHaveLength(1);
      expect(result.sections[0].title).toBe('Ma section');
      expect(result.sections[0].children).toEqual([]);
    });

    test('devrait parser plusieurs sections', () => {
      const result = parser.parse('H:Section 1\nH:Section 2\nH:Section 3');
      expect(result.sections).toHaveLength(3);
      expect(result.sections[0].title).toBe('Section 1');
      expect(result.sections[1].title).toBe('Section 2');
      expect(result.sections[2].title).toBe('Section 3');
    });

    test('devrait gérer les métadonnées de section', () => {
      const result = parser.parse('H:Section principale\nM:Niveau|1\nM:Priorité|Haute');
      expect(result.sections[0].metadata.Niveau).toBe('1');
      expect(result.sections[0].metadata.Priorité).toBe('Haute');
    });
  });

  describe('Parsing des balises P (Paragraph)', () => {
    test('devrait parser un paragraphe dans une section', () => {
      const result = parser.parse('H:Introduction\nP:Ceci est un paragraphe');
      expect(result.sections[0].children).toHaveLength(1);
      expect(result.sections[0].children[0].type).toBe('paragraph');
      expect(result.sections[0].children[0].content).toBe('Ceci est un paragraphe');
    });

    test('devrait parser plusieurs paragraphes', () => {
      const result = parser.parse('H:Section\nP:Premier paragraphe\nP:Deuxième paragraphe');
      expect(result.sections[0].children).toHaveLength(2);
      expect(result.sections[0].children[0].content).toBe('Premier paragraphe');
      expect(result.sections[0].children[1].content).toBe('Deuxième paragraphe');
    });

    test('devrait ignorer les paragraphes sans section', () => {
      const result = parser.parse('P:Paragraphe orphelin');
      expect(result.sections).toHaveLength(0);
    });
  });

  describe('Parsing des balises M (Metadata)', () => {
    test('devrait parser les métadonnées globales', () => {
      const result = parser.parse('M:Auteur|Jean Dupont\nM:Version|1.0');
      expect(result.metadata.Auteur).toBe('Jean Dupont');
      expect(result.metadata.Version).toBe('1.0');
    });

    test('devrait parser les métadonnées de section', () => {
      const result = parser.parse('H:Chapitre 1\nM:Pages|15\nM:Difficulté|Facile');
      expect(result.sections[0].metadata.Pages).toBe('15');
      expect(result.sections[0].metadata.Difficulté).toBe('Facile');
    });

    test('devrait gérer les métadonnées sans valeur', () => {
      const result = parser.parse('M:Draft');
      expect(result.metadata.Draft).toBe('');
    });

    test('devrait gérer les espaces dans les clés et valeurs', () => {
      const result = parser.parse('M: Date de création | 2025-01-01 ');
      expect(result.metadata['Date de création']).toBe('2025-01-01');
    });
  });

  describe('Parsing des balises L (Link)', () => {
    test('devrait parser un lien simple', () => {
      const result = parser.parse('H:Resources\nL:Documentation|https://example.com');
      expect(result.sections[0].children[0].type).toBe('link');
      expect(result.sections[0].children[0].text).toBe('Documentation');
      expect(result.sections[0].children[0].url).toBe('https://example.com');
    });

    test('devrait gérer les liens sans URL', () => {
      const result = parser.parse('H:Section\nL:Référence locale');
      expect(result.sections[0].children[0].url).toBe('');
    });

    test('devrait parser les liens globaux', () => {
      const result = parser.parse('L:Site officiel|https://mml-lang.org');
      expect(result.links).toHaveLength(1);
      expect(result.links[0].text).toBe('Site officiel');
      expect(result.links[0].url).toBe('https://mml-lang.org');
    });
  });

  describe('Parsing des balises spéciales', () => {
    test('devrait parser les citations', () => {
      const result = parser.parse('H:Section\nQ:Ceci est important');
      expect(result.sections[0].children[0].type).toBe('quote');
      expect(result.sections[0].children[0].content).toBe('Ceci est important');
    });

    test('devrait parser les blocs de code', () => {
      const result = parser.parse('H:Exemple\nC:function test() { return true; }');
      expect(result.sections[0].children[0].type).toBe('code');
      expect(result.sections[0].children[0].content).toBe('function test() { return true; }');
    });

    test('devrait parser les images', () => {
      const result = parser.parse('H:Galerie\nIMG:Photo du projet|project.jpg');
      expect(result.sections[0].children[0].type).toBe('image');
      expect(result.sections[0].children[0].description).toBe('Photo du projet');
      expect(result.sections[0].children[0].url).toBe('project.jpg');
    });
  });

  describe('Gestion d\'erreurs', () => {
    test('devrait rejeter un input non-string', () => {
      expect(() => parser.parse(null)).toThrow('Invalid MML input');
      expect(() => parser.parse(123)).toThrow('Invalid MML input');
      expect(() => parser.parse({})).toThrow('Invalid MML input');
    });

    test('devrait gérer les balises inconnues sans erreur', () => {
      const result = parser.parse('X:Balise inconnue\nT:Document valide');
      expect(result.title).toBe('Document valide');
      // Aucune erreur ne devrait être levée
    });
  });

  describe('Conversion HTML', () => {
    test('devrait convertir un document simple en HTML', () => {
      const mmlText = 'T:Test Document\nH:Introduction\nP:Hello World';
      const doc = parser.parse(mmlText);
      const html = parser.toHTML(doc);

      expect(html).toContain('<h1>Test Document</h1>');
      expect(html).toContain('<h2>Introduction</h2>');
      expect(html).toContain('<p>Hello World</p>');
      expect(html).toContain('<!DOCTYPE html>');
      expect(html).toContain('<html lang="fr">');
    });

    test('devrait échapper les caractères HTML dangereux', () => {
      const mmlText = 'H:Section\nP:Texte avec <script> et "guillemets"';
      const doc = parser.parse(mmlText);
      const html = parser.toHTML(doc);

      expect(html).toContain('&lt;script&gt;');
      expect(html).toContain('&quot;guillemets&quot;');
    });

    test('devrait convertir les liens en HTML', () => {
      const mmlText = 'H:Liens\nL:Google|https://google.com';
      const doc = parser.parse(mmlText);
      const html = parser.toHTML(doc);

      expect(html).toContain('<a href="https://google.com">Google</a>');
    });

    test('devrait convertir les images en HTML', () => {
      const mmlText = 'H:Images\nIMG:Logo MML|logo.png';
      const doc = parser.parse(mmlText);
      const html = parser.toHTML(doc);

      expect(html).toContain('<img src="logo.png" alt="Logo MML">');
      expect(html).toContain('<figcaption>Logo MML</figcaption>');
    });
  });

  describe('Conversion JSON', () => {
    test('devrait convertir un document en JSON valide', () => {
      const mmlText = 'T:Test\nH:Section\nP:Content';
      const doc = parser.parse(mmlText);
      const json = parser.toJSON(doc);
      const parsed = JSON.parse(json);

      expect(parsed.title).toBe('Test');
      expect(parsed.sections).toHaveLength(1);
      expect(parsed.sections[0].title).toBe('Section');
      expect(parsed.sections[0].children[0].content).toBe('Content');
    });
  });

  describe('Documents complexes', () => {
    test('devrait parser un document complet', () => {
      const mmlText = `T:Guide complet MML
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
C:}`;

      const result = parser.parse(mmlText);

      expect(result.title).toBe('Guide complet MML');
      expect(result.metadata.Auteur).toBe('Équipe MML');
      expect(result.metadata.Version).toBe('1.0');
      expect(result.sections).toHaveLength(2);

      // Vérification première section
      expect(result.sections[0].title).toBe('Introduction');
      expect(result.sections[0].children).toHaveLength(2);
      expect(result.sections[0].children[0].type).toBe('paragraph');
      expect(result.sections[0].children[1].type).toBe('quote');

      // Vérification deuxième section
      expect(result.sections[1].title).toBe('Fonctionnalités');
      expect(result.sections[1].children).toHaveLength(5);
    });
  });

  describe('Performance', () => {
    test('devrait parser rapidement un document volumineux', () => {
      // Créer un document avec 1000 lignes
      let mmlText = 'T:Document volumineux\n';
      for (let i = 0; i < 100; i++) {
        mmlText += `H:Section ${i}\n`;
        for (let j = 0; j < 9; j++) {
          mmlText += `P:Paragraphe ${i}-${j}\n`;
        }
      }

      const startTime = Date.now();
      const result = parser.parse(mmlText);
      const endTime = Date.now();

      expect(result.sections).toHaveLength(100);
      expect(result.sections[0].children).toHaveLength(9);
      expect(endTime - startTime).toBeLessThan(100); // Moins de 100ms
    });
  });
});
