/**
 * MML Web Validator - JavaScript Logic
 * Interactive web interface for MML validation and conversion
 */

// Global state
let currentDocument = null;
let parseTimeout = null;
let currentTab = 'validation';

// DOM elements
const mmlInput = document.getElementById('mmlInput');
const validationResult = document.getElementById('validationResult');
const htmlResult = document.getElementById('htmlResult');
const htmlPreview = document.getElementById('htmlPreview');
const jsonResult = document.getElementById('jsonResult');
const textResult = document.getElementById('textResult');
const mmlcResult = document.getElementById('mmlcResult');
const mmlcContent = document.getElementById('mmlcContent');
const compressionStats = document.getElementById('compressionStats');
const statsResult = document.getElementById('statsResult');
const statsGrid = document.getElementById('statsGrid');
const charCount = document.getElementById('charCount');
const lineCount = document.getElementById('lineCount');

// Modal elements
const examplesModal = document.getElementById('examplesModal');
const errorModal = document.getElementById('errorModal');
const helpModal = document.getElementById('helpModal');

// Button elements
const clearBtn = document.getElementById('clearBtn');
const examplesBtn = document.getElementById('examplesBtn');
const formatBtn = document.getElementById('formatBtn');

// Tab buttons
const tabButtons = document.querySelectorAll('.tab-btn');

// Initialize the validator
document.addEventListener('DOMContentLoaded', function() {
    initializeValidator();
    setupEventListeners();
    loadDefaultExample();
});

function initializeValidator() {
    // Check if MML parser is loaded
    if (typeof MMLParser === 'undefined') {
        showError('Erreur: Le parser MML n\'est pas chargé. Vérifiez que le fichier mml-parser.js est accessible.');
        return;
    }

    console.log('✅ MML Web Validator initialisé');
}

function setupEventListeners() {
    // Input events
    mmlInput.addEventListener('input', handleInputChange);
    mmlInput.addEventListener('keydown', handleKeyDown);

    // Button events
    clearBtn.addEventListener('click', clearInput);
    examplesBtn.addEventListener('click', showExamplesModal);
    formatBtn.addEventListener('click', formatInput);

    // Tab events
    tabButtons.forEach(button => {
        button.addEventListener('click', () => switchTab(button.dataset.tab));
    });

    // Modal events
    document.getElementById('closeExamples').addEventListener('click', hideExamplesModal);
    document.getElementById('closeError').addEventListener('click', hideErrorModal);
    document.getElementById('closeHelp').addEventListener('click', hideHelpModal);

    document.getElementById('errorHelpBtn').addEventListener('click', () => {
        hideErrorModal();
        showHelpModal();
    });

    document.getElementById('errorRetryBtn').addEventListener('click', () => {
        hideErrorModal();
        parseCurrentInput();
    });

    // Example cards
    document.querySelectorAll('.example-card').forEach(card => {
        card.addEventListener('click', () => loadExample(card.dataset.example));
    });

    // Click outside modal to close
    window.addEventListener('click', (e) => {
        if (e.target === examplesModal) hideExamplesModal();
        if (e.target === errorModal) hideErrorModal();
        if (e.target === helpModal) hideHelpModal();
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
                case 'Enter':
                    e.preventDefault();
                    parseCurrentInput();
                    break;
                case '/':
                    e.preventDefault();
                    showHelpModal();
                    break;
                case 'l':
                    e.preventDefault();
                    clearInput();
                    break;
            }
        }
    });

    // Update counters
    updateCounters();
}

function handleInputChange() {
    updateCounters();

    // Debounced parsing
    clearTimeout(parseTimeout);
    parseTimeout = setTimeout(parseCurrentInput, 300);
}

function handleKeyDown(e) {
    // Auto-indent on Enter
    if (e.key === 'Enter' && !e.shiftKey) {
        const cursorPos = mmlInput.selectionStart;
        const beforeCursor = mmlInput.value.substring(0, cursorPos);
        const afterCursor = mmlInput.value.substring(cursorPos);

        // Check if we're after a tag
        const lines = beforeCursor.split('\n');
        const currentLine = lines[lines.length - 1];

        if (currentLine.includes(':') && !currentLine.trim().endsWith(':')) {
            e.preventDefault();

            // Auto-indent for content lines
            const indent = '  ';
            mmlInput.value = beforeCursor + '\n' + indent + afterCursor;
            mmlInput.selectionStart = mmlInput.selectionEnd = cursorPos + 1 + indent.length;
        }
    }
}

function parseCurrentInput() {
    const input = mmlInput.value.trim();

    if (input === '') {
        showPendingState();
        currentDocument = null;
        updateAllTabs();
        return;
    }

    try {
        const parser = new MMLParser();
        currentDocument = parser.parse(input);

        showSuccessState();
        updateAllTabs();

    } catch (error) {
        console.error('Parse error:', error);
        showErrorState(error);
        currentDocument = null;
        updateAllTabs();
    }
}

function updateCounters() {
    const text = mmlInput.value;
    const chars = text.length;
    const lines = text.split('\n').length;

    charCount.textContent = `${chars} caractère${chars !== 1 ? 's' : ''}`;
    lineCount.textContent = `${lines} ligne${lines !== 1 ? 's' : ''}`;
}

function showPendingState() {
    validationResult.innerHTML = `
        <div class="status pending">
            <span class="emoji">⏳</span>
            En attente de saisie...
        </div>
    `;
}

function showSuccessState() {
    const doc = currentDocument;
    if (!doc) return;

    let metadataCount = 0;
    if (doc.metadata) {
        metadataCount = Object.keys(doc.metadata).length;
    }

    let linkCount = 0;
    if (doc.links) {
        linkCount = doc.links.length;
    }

    doc.sections.forEach(section => {
        linkCount += section.links ? section.links.length : 0;
    });

    validationResult.innerHTML = `
        <div class="status success">
            <span class="emoji">✅</span>
            Document MML valide
        </div>
        <div style="margin-top: 1rem; font-size: 0.9rem;">
            <strong>Structure détectée :</strong><br>
            • Titre: ${doc.title ? 'Oui' : 'Non'}<br>
            • Sections: ${doc.sections ? doc.sections.length : 0}<br>
            • Métadonnées: ${metadataCount}<br>
            • Liens: ${linkCount}<br>
            • Lignes parsées: ${doc.stats ? doc.stats.parsedLines : 0}
        </div>
    `;
}

function showErrorState(error) {
    let errorMessage = 'Erreur de parsing inconnue';
    let errorDetails = '';
    let suggestions = [];

    if (error && error.message) {
        errorMessage = error.message;
    }

    // Extract line number if available
    if (error.line) {
        errorDetails += `Ligne ${error.line}`;
        if (error.column) {
            errorDetails += `, colonne ${error.column}`;
        }
        errorDetails += '<br>';
    }

    // Add suggestions
    if (error.suggestion) {
        suggestions.push(error.suggestion);
    } else {
        suggestions.push('Vérifiez la syntaxe MML : TAG:contenu');
        suggestions.push('Consultez l\'aide pour la syntaxe correcte');
    }

    validationResult.innerHTML = `
        <div class="status error">
            <span class="emoji">❌</span>
            ${errorMessage}
        </div>
        <div style="margin-top: 1rem; font-size: 0.9rem;">
            ${errorDetails}
            <strong>Suggestions :</strong><br>
            ${suggestions.map(s => '• ' + s).join('<br>')}
        </div>
    `;

    // Show error modal for detailed view
    showErrorModal(error, suggestions);
}

function switchTab(tabName) {
    // Update tab buttons
    tabButtons.forEach(btn => {
        if (btn.dataset.tab === tabName) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        if (content.id === tabName + 'Tab') {
            content.classList.add('active');
        } else {
            content.classList.remove('active');
        }
    });

    currentTab = tabName;

    // Update content for the new tab
    updateTabContent(tabName);
}

function updateAllTabs() {
    updateTabContent('validation');
    updateTabContent('html');
    updateTabContent('json');
    updateTabContent('text');
    updateTabContent('mmlc');
    updateTabContent('stats');
}

function updateTabContent(tabName) {
    if (!currentDocument) {
        // Clear all tabs
        switch (tabName) {
            case 'validation':
                showPendingState();
                break;
            case 'html':
                htmlPreview.innerHTML = '<em>Aucun document à convertir</em>';
                break;
            case 'json':
                jsonResult.textContent = '// Aucun document à convertir';
                break;
            case 'text':
                textResult.textContent = '// Aucun document à convertir';
                break;
            case 'mmlc':
                mmlcContent.textContent = '// Aucun document à convertir';
                compressionStats.textContent = '';
                break;
            case 'stats':
                statsGrid.innerHTML = '<em>Aucune statistique disponible</em>';
                break;
        }
        return;
    }

    const parser = new MMLParser();

    switch (tabName) {
        case 'validation':
            // Already updated
            break;

        case 'html':
            try {
                const html = parser.toHTML(currentDocument);
                htmlPreview.innerHTML = html;
            } catch (error) {
                htmlPreview.innerHTML = `<em>Erreur de conversion HTML: ${error.message}</em>`;
            }
            break;

        case 'json':
            try {
                const json = parser.toJSON(currentDocument);
                jsonResult.textContent = json;
            } catch (error) {
                jsonResult.textContent = `// Erreur de conversion JSON: ${error.message}`;
            }
            break;

        case 'text':
            try {
                const text = generatePlainText(currentDocument);
                textResult.textContent = text;
            } catch (error) {
                textResult.textContent = `// Erreur de conversion texte: ${error.message}`;
            }
            break;

        case 'mmlc':
            try {
                const mmlc = generateMMLC(currentDocument);
                mmlcContent.textContent = mmlc.compressed;

                const originalSize = mmlInput.value.length;
                const compressedSize = mmlc.compressed.length;
                const ratio = originalSize > 0 ? ((originalSize - compressedSize) / originalSize * 100) : 0;

                compressionStats.innerHTML = `
                    <strong>Compression MMLC:</strong> ${originalSize} → ${compressedSize} caractères
                    <span style="color: ${ratio > 0 ? 'green' : 'orange'}">
                        (${ratio > 0 ? 'économie' : 'augmentation'} de ${Math.abs(ratio).toFixed(1)}%)
                    </span>
                `;
            } catch (error) {
                mmlcContent.textContent = `// Erreur de compression: ${error.message}`;
                compressionStats.textContent = '';
            }
            break;

        case 'stats':
            updateStatsDisplay(currentDocument);
            break;
    }
}

function updateStatsDisplay(doc) {
    const stats = doc.stats || {};

    let metadataCount = 0;
    if (doc.metadata) {
        metadataCount = Object.keys(doc.metadata).length;
    }

    let sectionCount = doc.sections ? doc.sections.length : 0;
    let paragraphCount = 0;
    let linkCount = doc.links ? doc.links.length : 0;
    let imageCount = 0;

    if (doc.sections) {
        doc.sections.forEach(section => {
            if (section.content && section.content.trim()) {
                paragraphCount++;
            }
            if (section.links) {
                linkCount += section.links.length;
            }
            if (section.images) {
                imageCount += section.images.length;
            }
        });
    }

    statsGrid.innerHTML = `
        <div class="stat-item">
            <span class="stat-value">${sectionCount}</span>
            <span class="stat-label">Sections</span>
        </div>
        <div class="stat-item">
            <span class="stat-value">${paragraphCount}</span>
            <span class="stat-label">Paragraphes</span>
        </div>
        <div class="stat-item">
            <span class="stat-value">${metadataCount}</span>
            <span class="stat-label">Métadonnées</span>
        </div>
        <div class="stat-item">
            <span class="stat-value">${linkCount}</span>
            <span class="stat-label">Liens</span>
        </div>
        <div class="stat-item">
            <span class="stat-value">${imageCount}</span>
            <span class="stat-label">Images</span>
        </div>
        <div class="stat-item">
            <span class="stat-value">${stats.parsedLines || 0}</span>
            <span class="stat-label">Lignes parsées</span>
        </div>
    `;
}

function generatePlainText(doc) {
    let text = '';

    if (doc.title) {
        text += `${doc.title}\n${'='.repeat(doc.title.length)}\n\n`;
    }

    if (doc.sections) {
        doc.sections.forEach(section => {
            text += `${section.title}\n${'-'.repeat(section.title.length)}\n\n`;

            if (section.content) {
                text += `${section.content}\n\n`;
            }

            if (section.links) {
                section.links.forEach(link => {
                    text += `• ${link.text}: ${link.url}\n`;
                });
                if (section.links.length > 0) text += '\n';
            }
        });
    }

    return text.trim();
}

function generateMMLC(doc) {
    let compressed = '';

    // Title
    if (doc.title) {
        compressed += `1:${compressWords(doc.title)}\n`;
    }

    // Global metadata
    if (doc.metadata) {
        Object.entries(doc.metadata).forEach(([key, value]) => {
            compressed += `3:${key}|${compressWords(value)}\n`;
        });
    }

    // Sections
    if (doc.sections) {
        doc.sections.forEach(section => {
            compressed += `2:${compressWords(section.title)}\n`;

            // Section metadata
            if (section.metadata) {
                Object.entries(section.metadata).forEach(([key, value]) => {
                    compressed += `3:${key}|${compressWords(value)}\n`;
                });
            }

            // Content
            if (section.content) {
                compressed += `4:${compressWords(section.content)}\n`;
            }
        });
    }

    return {
        compressed: compressed.trim(),
        originalSize: JSON.stringify(doc).length,
        compressedSize: compressed.length
    };
}

function compressWords(text) {
    const replacements = {
        'Rapport': 'R',
        'Urgent': 'U',
        'Critique': 'C',
        'Patient': 'P1',
        'Victime': 'V',
        'Secteur': 'S',
        'Évacuation': 'E',
        'Médical': 'M',
        'Stable': 'S1',
        'Alerte': 'A'
    };

    let result = text;
    Object.entries(replacements).forEach(([word, code]) => {
        result = result.replace(new RegExp(word, 'gi'), code);
    });

    return result;
}

function clearInput() {
    mmlInput.value = '';
    mmlInput.focus();
    updateCounters();
    showPendingState();
    currentDocument = null;
    updateAllTabs();
}

function formatInput() {
    if (!currentDocument) {
        parseCurrentInput();
        return;
    }

    // Re-generate formatted MML from parsed document
    let formatted = '';

    if (currentDocument.title) {
        formatted += `T:${currentDocument.title}\n`;
    }

    if (currentDocument.metadata) {
        Object.entries(currentDocument.metadata).forEach(([key, value]) => {
            formatted += `M:${key}|${value}\n`;
        });
    }

    if (currentDocument.sections) {
        currentDocument.sections.forEach(section => {
            formatted += `\nH:${section.title}\n`;

            if (section.metadata) {
                Object.entries(section.metadata).forEach(([key, value]) => {
                    formatted += `M:${key}|${value}\n`;
                });
            }

            if (section.content) {
                formatted += `P:${section.content}\n`;
            }

            if (section.links) {
                section.links.forEach(link => {
                    formatted += `L:${link.text}|${link.url}\n`;
                });
            }

            if (section.images) {
                section.images.forEach(image => {
                    formatted += `IMG:${image.description}|${image.url}\n`;
                });
            }
        });
    }

    mmlInput.value = formatted.trim();
    updateCounters();
}

function loadDefaultExample() {
    const defaultExample = `T:Rapport d'urgence - Incendie
M:ID|INC-2025-001
M:Priorité|CRITIQUE
M:Localisation|Forêt domaniale secteur 7

H:Situation actuelle
P:Incendie de forêt déclaré à 14h30
M:Surface|450 hectares
M:Vent|25 km/h NNE
P:Front de feu progressant vers le Sud-Est

H:Moyens engagés
P:3 Canadairs en rotation
P:45 sapeurs-pompiers au sol
M:Effectifs|45
M:Aériens|5 appareils

H:Actions requises
P:Évacuation zone rouge immédiate
Q:La rapidité sauve des vies
L:Carte secteur|cartes/incendie-secteur7.png`;

    mmlInput.value = defaultExample;
    updateCounters();
    parseCurrentInput();
}

function loadExample(exampleType) {
    const examples = {
        basic: `T:Mon document
M:Auteur|Jean Dupont
M:Version|1.0

H:Introduction
P:Ceci est un paragraphe simple.

H:Conclusion
P:Fin du document.`,

        metadata: `T:Document avec métadonnées
M:Auteur|Équipe MML
M:Version|1.0
M:Créé|2025-01-15
M:Licence|MIT
M:Tags|documentation,mml,exemple

H:Section principale
M:Durée|10 minutes
M:Difficulté|Débutant
P:Contenu de la section.`,

        links: `T:Documentation avec liens
M:Auteur|Équipe technique

H:Ressources externes
L:Site officiel MML|https://mml-lang.org
L:Documentation complète|https://docs.mml-lang.org
L:GitHub Repository|https://github.com/mml-lang/mml
L:Spécification PDF|spec/mml-specification.pdf

H:Outils
L:Validateur en ligne|https://validator.mml-lang.org
L:CLI Download|https://github.com/mml-lang/mml/releases`,

        emergency: `T:RAPPORT URGENCE - INCENDIE
M:ID|INC-2025-001
M:Priorité|CRITIQUE
M:Localisation|Forêt domaniale secteur 7
M:Heure|14:30 UTC

H:SITUATION ACTUELLE
P:Incendie de forêt déclaré
M:Surface|450 hectares
M:Vent|25 km/h NNE
M:Direction|Sud-Est
P:Risque de propagation rapide

H:MOYENS ENGAGES
P:3 Canadairs + 2 hélicoptères
P:45 sapeurs-pompiers
M:Effectifs|45
M:Aériens|5 appareils

H:ACTIONS REQUISES
P:Évacuation zone rouge immédiate
P:Renforts aériens supplémentaires
Q:URGENT : Intervention immédiate requise
L:Carte secteur|cartes/incendie-secteur7.png
L:Coordonnées GPS|45.234N 2.456E`,

        medical: `T:RAPPORT MEDICAL
M:Patient|Jean Dupont
M:ID_PATIENT|PAT-2025-001
M:Medecin|Dr. Marie Curie
M:Service|Urgences
M:Heure|14:30

H:IDENTIFICATION
M:Age|45 ans
M:Sexe|Homme
M:Taille|175 cm
M:Poids|75 kg

H:SYMPTOMES
P:Douleurs thoraciques sévères
P:Difficultés respiratoires
P:Transpiration excessive
M:Douleur|8/10

H:DIAGNOSTIC
M:Diagnostic|Infarctus du myocarde
M:Gravite|Critique
M:Examen|ECG, Troponine

H:TRAITEMENT
P:Oxygénothérapie 4L/min
P:Morphine IV 5mg
P:Aspirine 250mg
P:Anticoagulants
M:Medicaments|Aspirine,Morphine,Heparine

H:EVOLUTION
P:Surveillance continue
P:Transfert USIC
Q:Pronostic réservé - angiographie urgente`,

        technical: `T:MANUEL TECHNIQUE - SERVEUR WEB
M:Produit|Serveur Web MML
M:Version|2.1.0
M:Auteur|Équipe DevOps
M:Derniere revision|2025-01-15
M:Environnement|Production

H:INSTALLATION
M:OS|Ubuntu 22.04 LTS
M:RAM|4GB minimum
M:Disque|20GB
P:Prérequis système validés

H:CONFIGURATION
CFG:Serveur Web
M:Port|8080
M:SSL|Activé
M:Timeout|30s
P:Configuration réseau appliquée

H:DÉPLOIEMENT
C:# Commandes de déploiement
C:sudo systemctl enable mml-server
C:sudo systemctl start mml-server
C:sudo systemctl status mml-server
P:Vérification du statut du service

H:MAINTENANCE
P:Sauvegarde quotidienne automatique
P:Mise à jour sécurité mensuelle
P:Monitoring performance continu
L:Documentation monitoring|docs/monitoring.md
IMG:Architecture système|diagrams/architecture.png

H:DÉPANNAGE
P:Logs disponibles dans /var/log/mml/
P:Redémarrage: sudo systemctl restart mml-server
L:Guide dépannage|docs/troubleshooting.md`
    };

    const example = examples[exampleType];
    if (example) {
        mmlInput.value = example;
        updateCounters();
        parseCurrentInput();
        hideExamplesModal();
    }
}

function showExamplesModal() {
    examplesModal.classList.add('show');
}

function hideExamplesModal() {
    examplesModal.classList.remove('show');
}

function showErrorModal(error, suggestions) {
    const errorContent = document.getElementById('errorContent');
    errorContent.innerHTML = `
        <strong>Erreur de parsing :</strong> ${error.message || 'Erreur inconnue'}<br><br>
        <strong>Détails :</strong><br>
        ${error.line ? `Ligne: ${error.line}` : ''}
        ${error.column ? `Colonne: ${error.column}` : ''}<br><br>
        <strong>Suggestions :</strong><br>
        <ul>
            ${suggestions.map(s => `<li>${s}</li>`).join('')}
        </ul>
    `;

    errorModal.classList.add('show');
}

function hideErrorModal() {
    errorModal.classList.remove('show');
}

function showHelpModal() {
    helpModal.classList.add('show');
}

function hideHelpModal() {
    helpModal.classList.remove('show');
}

function showError(message) {
    validationResult.innerHTML = `
        <div class="status error">
            <span class="emoji">❌</span>
            ${message}
        </div>
    `;
}

// Export for potential use in other scripts
window.MMLValidator = {
    parse: parseCurrentInput,
    clear: clearInput,
    format: formatInput,
    getDocument: () => currentDocument
};

// Keyboard shortcuts hint in console
console.log(`
🎹 Raccourcis clavier :
  Ctrl+Entrée : Parser le document
  Ctrl+/ : Afficher l'aide
  Ctrl+L : Effacer l'éditeur
`);
