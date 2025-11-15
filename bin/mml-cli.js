#!/usr/bin/env node

/**
 * MML CLI - Outil en ligne de commande pour le langage MML
 * Fournit validation, conversion et compression de documents MML
 */

const fs = require('fs');
const path = require('path');
const MMLParser = require('../implementations/mml-parser.js');

class MMLCLI {
  constructor() {
    this.parser = new MMLParser();
  }

  run() {
    const args = process.argv.slice(2);
    if (args.length === 0) {
      this.showHelp();
      process.exit(0);
    }

    const command = args[0];
    const options = this.parseOptions(args.slice(1));

    try {
      switch (command) {
        case 'validate':
          this.validateCommand(options);
          break;
        case 'convert':
          this.convertCommand(options);
          break;
        case 'compress':
          this.compressCommand(options);
          break;
        case 'stats':
          this.statsCommand(options);
          break;
        case 'help':
        case '--help':
        case '-h':
          this.showHelp();
          break;
        default:
          console.error(`Erreur: Commande inconnue '${command}'`);
          this.showHelp();
          process.exit(1);
      }
    } catch (error) {
      console.error(`Erreur: ${error.message}`);
      process.exit(1);
    }
  }

  parseOptions(args) {
    const options = {
      input: null,
      output: null,
      format: 'html',
      verbose: false
    };

    for (let i = 0; i < args.length; i++) {
      const arg = args[i];

      switch (arg) {
        case '-i':
        case '--input':
          options.input = args[++i];
          break;
        case '-o':
        case '--output':
          options.output = args[++i];
          break;
        case '-f':
        case '--format':
          options.format = args[++i];
          break;
        case '-v':
        case '--verbose':
          options.verbose = true;
          break;
        case '--stdin':
          options.input = '-';
          break;
        case '--stdout':
          options.output = '-';
          break;
        default:
          if (!options.input) {
            options.input = arg;
          } else if (!options.output) {
            options.output = arg;
          } else {
            console.error(`Erreur: Argument inconnu '${arg}'`);
            process.exit(1);
          }
      }
    }

    return options;
  }

  readInput(options) {
    if (options.input === '-' || !options.input) {
      // Lecture depuis stdin
      return new Promise((resolve, reject) => {
        let data = '';
        process.stdin.setEncoding('utf8');
        process.stdin.on('data', chunk => data += chunk);
        process.stdin.on('end', () => resolve(data));
        process.stdin.on('error', reject);
      });
    } else {
      // Lecture depuis fichier
      if (!fs.existsSync(options.input)) {
        throw new Error(`Fichier d'entrée introuvable: ${options.input}`);
      }
      return fs.promises.readFile(options.input, 'utf8');
    }
  }

  writeOutput(options, data) {
    if (options.output === '-' || !options.output) {
      // Écriture vers stdout
      process.stdout.write(data);
    } else {
      // Écriture vers fichier
      fs.writeFileSync(options.output, data, 'utf8');
      if (options.verbose) {
        console.log(`Fichier écrit: ${options.output}`);
      }
    }
  }

  async validateCommand(options) {
    const input = await this.readInput(options);
    const doc = this.parser.parse(input);

    // Validation basique
    const errors = this.validateDocument(doc);

    if (errors.length === 0) {
      console.log('✅ Document MML valide');
      if (options.verbose) {
        console.log(`Titre: ${doc.title || '(aucun)'}`);
        console.log(`Sections: ${doc.sections.length}`);
        console.log(`Métadonnées: ${Object.keys(doc.metadata).length}`);
      }
    } else {
      console.log('❌ Document MML invalide:');
      errors.forEach(error => console.log(`  - ${error}`));
      process.exit(1);
    }
  }

  async convertCommand(options) {
    const input = await this.readInput(options);
    const doc = this.parser.parse(input);

    let output;
    switch (options.format.toLowerCase()) {
      case 'html':
        output = this.parser.toHTML(doc);
        break;
      case 'json':
        output = this.parser.toJSON(doc);
        break;
      case 'text':
        output = this.toPlainText(doc);
        break;
      default:
        throw new Error(`Format de sortie non supporté: ${options.format}`);
    }

    await this.writeOutput(options, output);

    if (options.verbose) {
      console.log(`Conversion ${options.input || 'stdin'} → ${options.format}`);
    }
  }

  async compressCommand(options) {
    const input = await this.readInput(options);
    const compressed = this.compressMML(input);

    await this.writeOutput(options, compressed);

    if (options.verbose) {
      const originalSize = Buffer.byteLength(input, 'utf8');
      const compressedSize = Buffer.byteLength(compressed, 'utf8');
      const ratio = ((originalSize - compressedSize) / originalSize * 100).toFixed(1);
      console.log(`Compression: ${originalSize} → ${compressedSize} octets (${ratio}% de réduction)`);
    }
  }

  async statsCommand(options) {
    const input = await this.readInput(options);
    const doc = this.parser.parse(input);

    const stats = this.calculateStats(input, doc);

    console.log('📊 Statistiques du document MML:');
    console.log(`Titre: ${stats.title ? '✅' : '❌'}`);
    console.log(`Sections: ${stats.sections}`);
    console.log(`Paragraphes: ${stats.paragraphs}`);
    console.log(`Liens: ${stats.links}`);
    console.log(`Images: ${stats.images}`);
    console.log(`Métadonnées: ${stats.metadata}`);
    console.log(`Taille: ${stats.size} octets`);
    console.log(`Lignes: ${stats.lines}`);
    console.log(`Ratio signal/bruit: ${stats.signalRatio}%`);
  }

  validateDocument(doc) {
    const errors = [];

    // Validation du titre (optionnel mais recommandé)
    if (!doc.title && Object.keys(doc.metadata).length === 0 && doc.sections.length === 0) {
      errors.push('Document vide ou mal formé');
    }

    // Validation des sections
    doc.sections.forEach((section, index) => {
      if (!section.title) {
        errors.push(`Section ${index + 1}: titre manquant`);
      }
    });

    // Validation des liens
    if (doc.links) {
      doc.links.forEach((link, index) => {
        if (!link.url) {
          errors.push(`Lien global ${index + 1}: URL manquante`);
        }
      });
    }

    return errors;
  }

  compressMML(mmlText) {
    const lines = mmlText.split('\n');
    const compressedLines = lines.map(line => {
      const trimmed = line.trim();
      if (!trimmed || !trimmed.includes(':')) return trimmed;

      const [tag, content] = trimmed.split(':', 2);
      const cleanTag = tag.trim().toUpperCase();
      const cleanContent = content.trim();

      // Mapping des balises
      const tagMap = {
        'T': '1', 'H': '2', 'M': '3', 'P': '4',
        'L': '5', 'IMG': '6', 'C': '7', 'Q': '8'
      };

      // Mapping des mots fréquents
      const wordMap = {
        'Rapport': 'R', 'Urgent': 'U', 'Critique': 'C',
        'Patient': 'P1', 'Victime': 'V', 'Secteur': 'S',
        'Évacuation': 'E', 'Médical': 'M', 'Stable': 'S1',
        'Alerte': 'A'
      };

      const compressedTag = tagMap[cleanTag] || cleanTag;
      let compressedContent = cleanContent;

      // Compression des mots
      Object.entries(wordMap).forEach(([word, code]) => {
        compressedContent = compressedContent.replace(
          new RegExp(`\\b${word}\\b`, 'g'), code
        );
      });

      return `${compressedTag}:${compressedContent}`;
    });

    return compressedLines.join('\n');
  }

  toPlainText(doc) {
    let text = '';

    if (doc.title) {
      text += `${doc.title}\n${'='.repeat(doc.title.length)}\n\n`;
    }

    doc.sections.forEach(section => {
      text += `${section.title}\n${'-'.repeat(section.title.length)}\n\n`;
      section.children.forEach(child => {
        switch (child.type) {
          case 'paragraph':
            text += `${child.content}\n\n`;
            break;
          case 'quote':
            text += `> ${child.content}\n\n`;
            break;
          case 'link':
            text += `[${child.text}](${child.url})\n\n`;
            break;
          case 'code':
            text += `\`\`\`\n${child.content}\n\`\`\`\n\n`;
            break;
          case 'image':
            text += `[Image: ${child.description}]\n\n`;
            break;
        }
      });
    });

    return text.trim();
  }

  calculateStats(input, doc) {
    const lines = input.split('\n').filter(line => line.trim());
    const size = Buffer.byteLength(input, 'utf8');

    let paragraphs = 0;
    let links = 0;
    let images = 0;

    doc.sections.forEach(section => {
      section.children.forEach(child => {
        switch (child.type) {
          case 'paragraph':
            paragraphs++;
            break;
          case 'link':
            links++;
            break;
          case 'image':
            images++;
            break;
        }
      });
    });

    // Estimation du ratio signal/bruit
    const totalChars = input.length;
    const syntaxChars = lines.reduce((acc, line) => {
      const colonIndex = line.indexOf(':');
      return acc + (colonIndex >= 0 ? colonIndex + 1 : 0);
    }, 0);

    const signalRatio = totalChars > 0 ?
      Math.round((totalChars - syntaxChars) / totalChars * 100) : 0;

    return {
      title: !!doc.title,
      sections: doc.sections.length,
      paragraphs,
      links: links + (doc.links ? doc.links.length : 0),
      images,
      metadata: Object.keys(doc.metadata).length,
      size,
      lines: lines.length,
      signalRatio
    };
  }

  showHelp() {
    console.log(`
MML CLI - Outil en ligne de commande pour le langage MML

USAGE:
  mml-cli <commande> [options] [fichier_entrée] [fichier_sortie]

COMMANDES:
  validate    Valider un document MML
  convert     Convertir vers HTML/JSON/text
  compress    Compresser en MMLC
  stats       Afficher les statistiques du document

OPTIONS:
  -i, --input <fichier>    Fichier d'entrée (défaut: stdin)
  -o, --output <fichier>   Fichier de sortie (défaut: stdout)
  -f, --format <format>    Format de sortie (html, json, text)
  -v, --verbose            Mode verbeux
  --stdin                  Lire depuis stdin
  --stdout                 Écrire vers stdout

EXEMPLES:
  mml-cli validate document.mml
  mml-cli convert -f html document.mml page.html
  mml-cli compress document.mml | mml-cli convert -f json
  mml-cli stats document.mml
  cat document.mml | mml-cli convert --format json

Pour plus d'informations: https://mml-lang.org
`);
  }
}

// Point d'entrée
if (require.main === module) {
  const cli = new MMLCLI();
  cli.run();
}

module.exports = MMLCLI;
