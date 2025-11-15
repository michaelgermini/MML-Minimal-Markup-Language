// Script de debug pour tester le chargement des leçons
// À exécuter dans la console du navigateur

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
        } else {
            console.error('15. Could not find lessonContent element');
        }

    } catch (error) {
        console.error('16. Error during HTML generation:', error);
    }
}

console.log('=== Debug Complete ===');
