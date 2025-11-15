/**
 * MML Tutorial - Interactive JavaScript Logic
 * Handles lesson navigation, exercises, and progress tracking
 */

// Global state
let currentLesson = 0;
let lessons = [];
let achievements = [];
let userProgress = {
    completedLessons: [],
    unlockedAchievements: [],
    exerciseAttempts: {},
    totalTimeSpent: 0
};

// DOM elements (will be initialized when DOM is ready)
let lessonContent, lessonObjectives, quickReference, achievementsList;
let progressFill, progressText, prevBtn, nextBtn, lessonDots;
let exerciseModal, successModal;
let exerciseInput, exerciseFeedback, validationResult, htmlResult, jsonResult;

// Initialize the tutorial
document.addEventListener('DOMContentLoaded', function() {
    initializeTutorial();
});

// Additional check to ensure lessons are loaded
function initializeInterface() {
    console.log('Initializing tutorial interface...');

    // Wait for DOM elements to be available
    const checkElements = () => {
        const requiredElements = [
            'prevBtn', 'nextBtn', 'lessonContent', 'lessonObjectives',
            'quickReference', 'achievements', 'progressFill', 'progressText',
            'lessonDots'
        ];

        const allFound = requiredElements.every(id => document.getElementById(id) !== null);

        if (allFound) {
            console.log('All DOM elements found, initializing DOM variables...');

            // Initialize DOM element variables
            lessonContent = document.getElementById('lessonContent');
            lessonObjectives = document.getElementById('lessonObjectives');
            quickReference = document.getElementById('quickReference');
            achievementsList = document.getElementById('achievements');
            progressFill = document.getElementById('progressFill');
            progressText = document.getElementById('progressText');
            prevBtn = document.getElementById('prevBtn');
            nextBtn = document.getElementById('nextBtn');
            lessonDots = document.getElementById('lessonDots');
            exerciseModal = document.getElementById('exerciseModal');
            successModal = document.getElementById('successModal');
            exerciseInput = document.getElementById('exerciseInput');
            exerciseFeedback = document.getElementById('exerciseFeedback');
            validationResult = document.getElementById('validationResult');
            htmlResult = document.getElementById('htmlResult');
            jsonResult = document.getElementById('jsonResult');

            console.log('DOM variables initialized, setting up interface...');
            setupEventListeners();
            loadUserProgress();
            renderLesson(currentLesson);
            updateNavigation();
            updateProgress();
            console.log('Tutorial initialized successfully');
        } else {
            console.log('DOM elements not ready, waiting...');
            setTimeout(checkElements, 10);
        }
    };

    checkElements();
}

window.addEventListener('load', function() {
    console.log('Window loaded, checking LESSONS...');
    console.log('LESSONS defined:', typeof LESSONS);
    console.log('LESSONS length:', LESSONS ? LESSONS.length : 'N/A');

    if (typeof LESSONS !== 'undefined') {
        initializeInterface();
    } else {
        console.error('Lessons not loaded after window load');
        showError('Erreur: Les leçons n\'ont pas pu être chargées.');
    }
});

function initializeTutorial() {
    console.log('Initializing tutorial...');

    // Check if MML parser is loaded
    console.log('MMLParser defined:', typeof MMLParser);
    if (typeof MMLParser === 'undefined') {
        showError('Erreur: Le parser MML n\'est pas chargé. Vérifiez que le fichier mml-parser.js est accessible.');
        return;
    }

    // Load lessons from lessons.js (will be defined in that file)
    console.log('LESSONS defined:', typeof LESSONS);
    console.log('window.LESSONS defined:', typeof window.LESSONS);

    if (typeof LESSONS === 'undefined') {
        showError('Erreur: Les leçons ne sont pas chargées. Vérifiez que le fichier lessons.js est accessible.');
        return;
    }

    lessons = LESSONS;
    achievements = ACHIEVEMENTS;

    console.log('Lessons loaded:', lessons.length);
    console.log('Achievements loaded:', achievements.length);
    console.log('✅ MML Tutorial initialisé');
}

function setupEventListeners() {
    console.log('Setting up event listeners...');

    // Navigation buttons
    if (prevBtn) prevBtn.addEventListener('click', () => navigateLesson(currentLesson - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => navigateLesson(currentLesson + 1));

    // Modal controls
    const closeExercise = document.getElementById('closeExercise');
    const closeSuccess = document.getElementById('closeSuccess');
    const continueBtn = document.getElementById('continueBtn');

    if (closeExercise) closeExercise.addEventListener('click', hideExerciseModal);
    if (closeSuccess) closeSuccess.addEventListener('click', hideSuccessModal);
    if (continueBtn) continueBtn.addEventListener('click', () => {
        hideSuccessModal();
        navigateLesson(currentLesson + 1);
    });

    // Exercise controls
    const checkExerciseBtn = document.getElementById('checkExerciseBtn');
    const showHintBtn = document.getElementById('showHintBtn');
    const showSolutionBtn = document.getElementById('showSolutionBtn');

    if (checkExerciseBtn) checkExerciseBtn.addEventListener('click', checkExercise);
    if (showHintBtn) showHintBtn.addEventListener('click', showHint);
    if (showSolutionBtn) showSolutionBtn.addEventListener('click', showSolution);

    // Result tabs
    document.querySelectorAll('.result-tab').forEach(tab => {
        tab.addEventListener('click', () => switchResultTab(tab.dataset.result));
    });

    // Lesson dots
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('lesson-dot')) {
            const lessonIndex = parseInt(e.target.dataset.lesson);
            navigateLesson(lessonIndex);
        }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    if (!prevBtn.disabled) navigateLesson(currentLesson - 1);
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    if (!nextBtn.disabled) navigateLesson(currentLesson + 1);
                    break;
            }
        }
    });

    // Click outside modal to close
    window.addEventListener('click', (e) => {
        if (e.target === exerciseModal) hideExerciseModal();
        if (e.target === successModal) hideSuccessModal();
    });
}

function renderLesson(lessonIndex) {
    console.log('Rendering lesson:', lessonIndex);
    const lesson = lessons[lessonIndex];
    console.log('Lesson object:', lesson);

    if (!lesson) {
        console.error('No lesson found at index:', lessonIndex);
        return;
    }

    console.log('Lesson title:', lesson.title);
    console.log('Lesson sections:', lesson.sections ? lesson.sections.length : 'none');

    // Render lesson content
    const html = generateLessonHTML(lesson);
    console.log('Generated HTML length:', html.length);
    console.log('Generated HTML preview:', html.substring(0, 200) + '...');

    if (lessonContent) {
        lessonContent.innerHTML = html;
        console.log('HTML assigned to lessonContent');
    } else {
        console.error('lessonContent element not found!');
    }

    // Render objectives
    lessonObjectives.innerHTML = lesson.objectives
        .map(obj => `<li>${obj}</li>`)
        .join('');

    // Render quick reference
    quickReference.innerHTML = generateQuickReference(lesson);

    // Render achievements
    renderAchievements();

    // Add event listeners for exercise buttons
    document.querySelectorAll('.exercise-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const exerciseId = e.target.dataset.exercise;
            showExercise(exerciseId);
        });
    });

    console.log('Lesson rendered successfully');
}

function generateLessonHTML(lesson) {
    console.log('Generating HTML for lesson:', lesson.title);

    let html = `
        <div class="lesson-header">
            <h2 class="lesson-title">${lesson.title}</h2>
            <p class="lesson-description">${lesson.description}</p>
        </div>
    `;

    console.log('Sections to process:', lesson.sections.length);

    for (let section of lesson.sections) {
        console.log('Processing section:', section.title);
        html += `<div class="lesson-section">`;
        html += `<h3>${section.title}</h3>`;

        for (let content of section.content) {
            console.log('Processing content type:', content.type);
            if (content.type === 'text') {
                html += `<p>${content.text}</p>`;
            } else if (content.type === 'code') {
                html += `<div class="code-example">${content.code}</div>`;
            } else if (content.type === 'list') {
                html += `<ul>`;
                for (let item of content.items) {
                    html += `<li>${item}</li>`;
                }
                html += `</ul>`;
            } else if (content.type === 'exercise') {
                html += `<button class="exercise-btn" data-exercise="${content.id}">🎯 ${content.title}</button>`;
            }
        }

        html += `</div>`;
    }

    console.log('Generated HTML final length:', html.length);
    return html;
}

function generateQuickReference(lesson) {
    const ref = lesson.quickReference || {};

    if (Object.keys(ref).length === 0) {
        return '<p>Aucune référence rapide pour cette leçon.</p>';
    }

    let html = '';
    for (const [category, items] of Object.entries(ref)) {
        html += `<h4>${category}</h4>`;
        if (Array.isArray(items)) {
            html += '<ul>';
            items.forEach(item => {
                html += `<li><code>${item}</code></li>`;
            });
            html += '</ul>';
        } else {
            html += `<p>${items}</p>`;
        }
    }

    return html;
}

function renderAchievements() {
    achievementsList.innerHTML = achievements.map(achievement => {
        const unlocked = userProgress.unlockedAchievements.includes(achievement.id);
        return `
            <div class="achievement ${unlocked ? 'unlocked' : ''}">
                <div class="achievement-icon">${achievement.icon}</div>
                <div>
                    <strong>${achievement.title}</strong>
                    <div>${achievement.description}</div>
                </div>
            </div>
        `;
    }).join('');
}

function navigateLesson(newIndex) {
    if (newIndex < 0 || newIndex >= lessons.length) return;

    currentLesson = newIndex;
    renderLesson(currentLesson);
    updateNavigation();
    updateProgress();
    saveUserProgress();
}

function updateNavigation() {
    // Update buttons
    prevBtn.disabled = currentLesson === 0;
    nextBtn.disabled = currentLesson === lessons.length - 1;

    // Update dots
    lessonDots.innerHTML = lessons.map((_, index) => {
        const completed = userProgress.completedLessons.includes(index);
        const current = index === currentLesson;
        return `<div class="lesson-dot ${completed ? 'completed' : ''} ${current ? 'current' : ''}" data-lesson="${index}"></div>`;
    }).join('');
}

function updateProgress() {
    const progress = ((currentLesson + 1) / lessons.length) * 100;
    progressFill.style.width = `${progress}%`;
    progressText.textContent = `Leçon ${currentLesson + 1} sur ${lessons.length}`;
}

function showExercise(exerciseId) {
    const lesson = lessons[currentLesson];
    const exercise = lesson.exercises?.find(ex => ex.id === exerciseId);

    if (!exercise) return;

    // Set exercise content
    document.getElementById('exerciseTitle').textContent = exercise.title;
    document.getElementById('exerciseInstruction').textContent = exercise.instruction;

    // Clear previous input and results
    exerciseInput.value = '';
    exerciseFeedback.className = 'exercise-feedback';
    exerciseFeedback.style.display = 'none';
    document.getElementById('exerciseResult').style.display = 'none';

    // Reset result tabs
    switchResultTab('validation');

    // Show modal
    exerciseModal.classList.add('show');
    exerciseInput.focus();

    // Store current exercise
    exerciseModal.dataset.currentExercise = exerciseId;
}

function hideExerciseModal() {
    exerciseModal.classList.remove('show');
}

function hideSuccessModal() {
    successModal.classList.remove('show');
}

function checkExercise() {
    const exerciseId = exerciseModal.dataset.currentExercise;
    const lesson = lessons[currentLesson];
    const exercise = lesson.exercises?.find(ex => ex.id === exerciseId);
    const userInput = exerciseInput.value.trim();

    if (!exercise) return;

    // Track attempts
    if (!userProgress.exerciseAttempts[exerciseId]) {
        userProgress.exerciseAttempts[exerciseId] = 0;
    }
    userProgress.exerciseAttempts[exerciseId]++;

    // Validate input
    let isValid = false;
    let feedbackMessage = '';
    let feedbackType = 'error';

    try {
        const parser = new MMLParser();
        const doc = parser.parse(userInput);

        // Check if document meets exercise requirements
        isValid = validateExerciseSolution(doc, exercise);

        if (isValid) {
            feedbackMessage = '🎉 Excellent ! Votre solution est correcte.';
            feedbackType = 'success';

            // Mark exercise as completed
            unlockAchievement(exercise.achievement);

            // Show success modal after a delay
            setTimeout(() => {
                document.getElementById('successMessage').textContent =
                    `Félicitations ! Vous avez réussi l'exercice "${exercise.title}".`;
                successModal.classList.add('show');
            }, 1500);

        } else {
            feedbackMessage = '❌ Votre solution n\'est pas tout à fait correcte. Vérifiez les exigences de l\'exercice.';
        }

    } catch (error) {
        feedbackMessage = `❌ Erreur de parsing : ${error.message}`;
    }

    // Show feedback
    exerciseFeedback.textContent = feedbackMessage;
    exerciseFeedback.className = `exercise-feedback ${feedbackType}`;
    exerciseFeedback.style.display = 'block';

    // Show results
    updateExerciseResults(userInput);
    document.getElementById('exerciseResult').style.display = 'block';
}

function validateExerciseSolution(doc, exercise) {
    // Basic validation - can be extended per exercise
    switch (exercise.validation) {
        case 'has_title':
            return doc.title && doc.title.length > 0;

        case 'has_sections':
            return doc.sections && doc.sections.length > 0;

        case 'has_metadata':
            return doc.metadata && Object.keys(doc.metadata).length > 0;

        case 'complete_document':
            return doc.title &&
                   doc.sections && doc.sections.length > 0 &&
                   doc.metadata && Object.keys(doc.metadata).length > 0;

        default:
            return doc.sections && doc.sections.length > 0;
    }
}

function updateExerciseResults(input) {
    try {
        const parser = new MMLParser();
        const doc = parser.parse(input);

        // Validation result
        validationResult.innerHTML = `
            <div style="color: green;">✅ Document valide</div>
            <div style="margin-top: 0.5rem; font-size: 0.9rem;">
                Titre: ${doc.title ? 'Oui' : 'Non'}<br>
                Sections: ${doc.sections ? doc.sections.length : 0}<br>
                Métadonnées: ${doc.metadata ? Object.keys(doc.metadata).length : 0}
            </div>
        `;

        // HTML result
        const html = parser.toHTML(doc);
        htmlResult.innerHTML = `
            <div style="background: white; border: 1px solid #e2e8f0; padding: 1rem; border-radius: 4px; margin-bottom: 1rem;">
                <strong>Aperçu HTML généré :</strong>
            </div>
            <div style="max-height: 200px; overflow-y: auto; background: white; border: 1px solid #e2e8f0; padding: 1rem; border-radius: 4px;">
                ${html}
            </div>
        `;

        // JSON result
        const json = parser.toJSON(doc);
        jsonResult.innerHTML = `<pre style="margin: 0;">${json}</pre>`;

    } catch (error) {
        validationResult.innerHTML = `<div style="color: red;">❌ Erreur: ${error.message}</div>`;
        htmlResult.innerHTML = '<em>Impossible de générer l\'aperçu HTML</em>';
        jsonResult.innerHTML = '<em>Impossible de générer le JSON</em>';
    }
}

function switchResultTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.result-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.result === tabName);
    });

    // Update tab content
    document.querySelectorAll('.result-pane').forEach(pane => {
        pane.classList.toggle('active', pane.id === tabName + 'Result');
    });
}

function showHint() {
    const exerciseId = exerciseModal.dataset.currentExercise;
    const lesson = lessons[currentLesson];
    const exercise = lesson.exercises?.find(ex => ex.id === exerciseId);

    if (exercise && exercise.hint) {
        exerciseFeedback.textContent = `💡 Indice : ${exercise.hint}`;
        exerciseFeedback.className = 'exercise-feedback';
        exerciseFeedback.style.display = 'block';
    }
}

function showSolution() {
    const exerciseId = exerciseModal.dataset.currentExercise;
    const lesson = lessons[currentLesson];
    const exercise = lesson.exercises?.find(ex => ex.id === exerciseId);

    if (exercise && exercise.solution) {
        exerciseInput.value = exercise.solution;
        exerciseFeedback.textContent = '👀 Solution affichée. Essayez de la comprendre avant de continuer !';
        exerciseFeedback.className = 'exercise-feedback';
        exerciseFeedback.style.display = 'block';
    }
}

function unlockAchievement(achievementId) {
    if (!userProgress.unlockedAchievements.includes(achievementId)) {
        userProgress.unlockedAchievements.push(achievementId);
        renderAchievements();
        saveUserProgress();
    }
}

function loadUserProgress() {
    try {
        const stored = localStorage.getItem('mml-tutorial-progress');
        if (stored) {
            userProgress = { ...userProgress, ...JSON.parse(stored) };
        }
    } catch (error) {
        console.warn('Could not load user progress:', error);
    }
}

function saveUserProgress() {
    try {
        localStorage.setItem('mml-tutorial-progress', JSON.stringify(userProgress));
    } catch (error) {
        console.warn('Could not save user progress:', error);
    }
}

function showError(message) {
    lessonContent.innerHTML = `
        <div style="text-align: center; padding: 3rem;">
            <div style="font-size: 3rem; margin-bottom: 1rem;">❌</div>
            <h2>Erreur de chargement</h2>
            <p style="color: #ef4444; margin: 1rem 0;">${message}</p>
            <p>Vérifiez que tous les fichiers nécessaires sont présents et rechargez la page.</p>
        </div>
    `;
}

// Debug function for testing
function runDebugTest() {
    console.log('=== MML Tutorial Debug ===');

    // Vérifier les dépendances
    console.log('1. MMLParser loaded:', typeof MMLParser !== 'undefined');
    console.log('2. LESSONS loaded:', typeof LESSONS !== 'undefined');
    console.log('3. ACHIEVEMENTS loaded:', typeof ACHIEVEMENTS !== 'undefined');

    // Vérifier le contenu des leçons
    if (typeof LESSONS !== 'undefined') {
        console.log('4. Number of lessons:', LESSONS.length);
        console.log('5. First lesson title:', LESSONS[0]?.title);
        console.log('6. First lesson sections:', LESSONS[0]?.sections?.length);

        if (LESSONS[0]?.sections?.[0]) {
            console.log('7. First section title:', LESSONS[0].sections[0].title);
            console.log('8. First section content count:', LESSONS[0].sections[0].content?.length);
        }
    }

    // Vérifier les éléments DOM
    console.log('9. lessonContent element:', document.getElementById('lessonContent') ? 'found' : 'NOT FOUND');
    console.log('10. lessonObjectives element:', document.getElementById('lessonObjectives') ? 'found' : 'NOT FOUND');

    // Tester la génération HTML
    if (typeof LESSONS !== 'undefined' && LESSONS.length > 0) {
        try {
            // Simuler generateLessonHTML
            const lesson = LESSONS[0];
            console.log('11. Testing HTML generation for lesson:', lesson.title);

            let html = `<div class="lesson-header">
                <h2 class="lesson-title">${lesson.title}</h2>
                <p class="lesson-description">${lesson.description}</p>
            </div>`;

            for (let section of lesson.sections) {
                html += `<div class="lesson-section">`;
                html += `<h3>${section.title}</h3>`;

                for (let content of section.content) {
                    console.log('Processing content type:', content.type);
                    if (content.type === 'text') {
                        html += `<p>${content.text}</p>`;
                    } else if (content.type === 'code') {
                        html += `<div class="code-example">${content.code}</div>`;
                    } else if (content.type === 'list') {
                        html += `<ul>`;
                        for (let item of content.items) {
                            html += `<li>${item}</li>`;
                        }
                        html += `</ul>`;
                    } else if (content.type === 'exercise') {
                        html += `<button class="exercise-btn" data-exercise="${content.id}">🎯 ${content.title}</button>`;
                    }
                }

                html += `</div>`;
            }

            console.log('12. Generated HTML length:', html.length);
            console.log('13. HTML preview:', html.substring(0, 300) + '...');

            // Tester l'insertion dans le DOM
            const testElement = document.getElementById('lessonContent');
            if (testElement) {
                testElement.innerHTML = html;
                console.log('14. HTML inserted into DOM successfully');
                alert('Debug terminé ! Vérifiez la console pour les détails.');
            } else {
                console.error('15. Could not find lessonContent element');
                alert('Erreur : élément lessonContent non trouvé !');
            }

        } catch (error) {
            console.error('16. Error during HTML generation:', error);
            alert('Erreur lors de la génération HTML : ' + error.message);
        }
    }

    console.log('=== Debug Complete ===');
}

// Export for potential use in other scripts
window.MMLTutorial = {
    navigateToLesson: navigateLesson,
    showExercise: showExercise,
    getCurrentLesson: () => currentLesson,
    getProgress: () => ({
        current: currentLesson,
        total: lessons.length,
        completed: userProgress.completedLessons.length
    }),
    runDebugTest: runDebugTest
};
