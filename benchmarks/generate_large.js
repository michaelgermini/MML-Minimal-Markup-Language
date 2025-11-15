#!/usr/bin/env node

/**
 * Générateur de document MML volumineux pour benchmarks
 * Crée un fichier de test de grande taille avec contenu réaliste
 */

const fs = require('fs');
const path = require('path');

function generateLargeDocument(targetSizeKB = 100) {
    const lines = [];

    // En-tête du document
    lines.push('T:Document volumineux pour benchmarks de performance');
    lines.push('M:Auteur|Générateur automatique');
    lines.push('M:Version|1.0');
    lines.push('M:Taille cible|' + targetSizeKB + 'KB');
    lines.push('M:Généré|' + new Date().toISOString());
    lines.push('');

    // Génération de sections avec contenu varié
    const sections = [
        'Architecture système',
        'Implémentations disponibles',
        'Comparaisons de performance',
        'Optimisations appliquées',
        'Tests de robustesse',
        'Cas d\'usage avancés',
        'Intégrations tierces',
        'Documentation développeur',
        'Exemples pratiques',
        'Recommandations'
    ];

    const loremIpsum = [
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
        'Nisi ut aliquip ex ea commodo consequat.',
        'Duis aute irure dolor in reprehenderit in voluptate velit esse.',
        'Cillum dolore eu fugiat nulla pariatur.',
        'Excepteur sint occaecat cupidatat non proident.',
        'Sunt in culpa qui officia deserunt mollit anim id est laborum.'
    ];

    let currentSize = lines.join('\n').length;

    // Génération de contenu jusqu'à atteindre la taille cible
    while (currentSize < targetSizeKB * 1024) {
        // Nouvelle section
        const sectionIndex = Math.floor(Math.random() * sections.length);
        const sectionName = sections[sectionIndex];
        const sectionNum = Math.floor(Math.random() * 100) + 1;

        lines.push('H:' + sectionName + ' - Partie ' + sectionNum);
        lines.push('M:Section|' + sectionNum);
        lines.push('M:Type|' + sectionName.toLowerCase().replace(/\s+/g, '_'));
        lines.push('M:Lignes|' + (Math.floor(Math.random() * 20) + 5));

        // Génération de paragraphes
        const numParagraphs = Math.floor(Math.random() * 10) + 3;
        for (let p = 0; p < numParagraphs; p++) {
            const words = [];
            const numWords = Math.floor(Math.random() * 50) + 10;

            for (let w = 0; w < numWords; w++) {
                const wordIndex = Math.floor(Math.random() * loremIpsum.length);
                const word = loremIpsum[wordIndex].split(' ')[w % loremIpsum[wordIndex].split(' ').length];
                words.push(word);
            }

            lines.push('P:' + words.join(' '));

            // Ajout occasionnel de métadonnées
            if (Math.random() < 0.1) {
                const metadataKeys = ['Note', 'Priorité', 'Status', 'Version', 'Auteur'];
                const key = metadataKeys[Math.floor(Math.random() * metadataKeys.length)];
                const value = 'Valeur_' + Math.floor(Math.random() * 1000);
                lines.push('M:' + key + '|' + value);
            }

            // Ajout occasionnel de liens
            if (Math.random() < 0.05) {
                const linkTexts = ['Documentation', 'Référence', 'Article', 'Guide', 'Tutoriel'];
                const text = linkTexts[Math.floor(Math.random() * linkTexts.length)];
                const url = 'https://example.com/' + text.toLowerCase() + '-' + Math.floor(Math.random() * 100);
                lines.push('L:' + text + '|' + url);
            }
        }

        // Ligne vide entre sections
        lines.push('');

        currentSize = lines.join('\n').length;
    }

    // Finalisation avec statistiques
    const finalContent = lines.join('\n');
    const stats = {
        size: finalContent.length,
        lines: lines.length,
        sizeKB: (finalContent.length / 1024).toFixed(2),
        targetKB: targetSizeKB
    };

    return {
        content: finalContent,
        stats: stats
    };
}

// Génération des fichiers de test
function generateTestFiles() {
    const sizes = [50, 100, 250, 500]; // Tailles en KB

    console.log('🔧 Génération de documents MML volumineux pour benchmarks...\n');

    sizes.forEach(sizeKB => {
        console.log(`📄 Génération de ${sizeKB}KB...`);

        const result = generateLargeDocument(sizeKB);
        const filename = `data/large-${sizeKB}kb.mml`;
        const filepath = path.join(__dirname, filename);

        fs.writeFileSync(filepath, result.content, 'utf8');

        console.log(`✅ ${filename}: ${result.stats.size} octets (${result.stats.lines} lignes)`);
    });

    console.log('\n🎉 Génération terminée !');
    console.log('📊 Documents créés :');
    sizes.forEach(size => {
        console.log(`   - large-${size}kb.mml`);
    });
}

// Exécution si appelé directement
if (require.main === module) {
    generateTestFiles();
}

module.exports = { generateLargeDocument, generateTestFiles };
