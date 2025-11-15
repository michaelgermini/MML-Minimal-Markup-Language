#!/usr/bin/env node

/**
 * Script principal pour exécuter tous les benchmarks MML
 * Génère les données de test volumineuses et lance les benchmarks
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

async function main() {
    console.log('🚀 MML Comprehensive Benchmark Suite\n');
    console.log('Exécution complète des benchmarks de performance MML.\n');

    const steps = [
        {
            name: 'Génération des données de test volumineuses',
            command: 'node generate_large.js',
            description: 'Création de fichiers MML de 50KB, 100KB et 250KB'
        },
        {
            name: 'Benchmarks JavaScript',
            command: 'node benchmark.js',
            description: 'Mesure des performances du parser JavaScript'
        },
        {
            name: 'Benchmarks Python',
            command: 'python benchmark.py',
            description: 'Mesure des performances du parser Python'
        },
        {
            name: 'Génération du rapport comparatif',
            command: 'node generate_report.js',
            description: 'Création d\'un rapport HTML comparatif'
        }
    ];

    const results = {
        steps: [],
        summary: {},
        timestamp: new Date().toISOString(),
    };

    for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        console.log(`📋 Étape ${i + 1}/${steps.length}: ${step.name}`);
        console.log(`   ${step.description}\n`);

        const stepResult = {
            name: step.name,
            command: step.command,
            startTime: Date.now(),
            success: false,
            error: null,
        };

        try {
            // Vérifier si la commande existe avant de l'exécuter
            if (step.command.startsWith('python') && !commandExists('python')) {
                if (commandExists('python3')) {
                    step.command = step.command.replace('python', 'python3');
                } else {
                    throw new Error('Python n\'est pas installé ou accessible');
                }
            }

            const output = execSync(step.command, {
                cwd: __dirname,
                encoding: 'utf8',
                timeout: 300000, // 5 minutes timeout
                stdio: 'pipe'
            });

            stepResult.success = true;
            stepResult.output = output;

            console.log('✅ Étape terminée avec succès\n');

            // Afficher un résumé de la sortie si elle n'est pas trop longue
            if (output && output.length < 1000) {
                console.log('📄 Sortie:', output.trim());
            }

        } catch (error) {
            stepResult.success = false;
            stepResult.error = error.message;

            console.log('❌ Échec de l\'étape:', error.message);

            // Continuer avec les autres étapes malgré l'échec
            console.log('⚠️ Continuation avec les étapes suivantes...\n');
        }

        stepResult.duration = Date.now() - stepResult.startTime;
        results.steps.push(stepResult);
    }

    // Générer le rapport final
    generateFinalReport(results);

    // Afficher le résumé
    displaySummary(results);
}

function commandExists(command) {
    try {
        execSync(`${command} --version`, { stdio: 'ignore' });
        return true;
    } catch {
        return false;
    }
}

function generateFinalReport(results) {
    console.log('📊 Génération du rapport final...\n');

    const report = {
        title: 'MML Comprehensive Benchmark Report',
        timestamp: results.timestamp,
        system: getSystemInfo(),
        steps: results.steps,
        summary: calculateSummary(results),
    };

    // Sauvegarder en JSON
    const reportPath = path.join(__dirname, 'results', 'final-report.json');
    fs.mkdirSync(path.dirname(reportPath), { recursive: true });
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');

    console.log(`💾 Rapport JSON sauvegardé: ${reportPath}`);

    // Générer un rapport HTML simple
    const htmlReport = generateHTMLReport(report);
    const htmlPath = path.join(__dirname, 'results', 'final-report.html');
    fs.writeFileSync(htmlPath, htmlReport, 'utf8');

    console.log(`🌐 Rapport HTML sauvegardé: ${htmlPath}\n`);
}

function getSystemInfo() {
    return {
        platform: process.platform,
        arch: process.arch,
        nodeVersion: process.version,
        totalMemory: process.memoryUsage().heapTotal,
    };
}

function calculateSummary(results) {
    const successfulSteps = results.steps.filter(step => step.success);
    const totalDuration = results.steps.reduce((sum, step) => sum + step.duration, 0);

    return {
        totalSteps: results.steps.length,
        successfulSteps: successfulSteps.length,
        failedSteps: results.steps.length - successfulSteps.length,
        totalDuration,
        successRate: (successfulSteps.length / results.steps.length) * 100,
    };
}

function generateHTMLReport(report) {
    const successRate = report.summary.successRate.toFixed(1);
    const duration = (report.summary.totalDuration / 1000).toFixed(1);

    return `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rapport Benchmarks MML</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #2563eb; text-align: center; }
        .summary { background: #f0f8ff; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .step { margin: 15px 0; padding: 15px; border-left: 4px solid #10b981; background: #f9f9f9; }
        .step.failed { border-left-color: #ef4444; background: #fef2f2; }
        .success { color: #10b981; font-weight: bold; }
        .error { color: #ef4444; font-weight: bold; }
        .duration { color: #6b7280; font-size: 0.9em; }
    </style>
</head>
<body>
    <div class="container">
        <h1>📊 Rapport Benchmarks MML</h1>

        <div class="summary">
            <h2>Résumé</h2>
            <p><strong>Exécution:</strong> ${new Date(report.timestamp).toLocaleString('fr-FR')}</p>
            <p><strong>Étapes réussies:</strong> <span class="${report.summary.successfulSteps === report.summary.totalSteps ? 'success' : 'error'}">${report.summary.successfulSteps}/${report.summary.totalSteps}</span></p>
            <p><strong>Taux de succès:</strong> ${successRate}%</p>
            <p><strong>Durée totale:</strong> ${duration}s</p>
        </div>

        <h2>Détail des étapes</h2>
        ${report.steps.map(step => `
            <div class="step ${step.success ? '' : 'failed'}">
                <h3>${step.success ? '✅' : '❌'} ${step.name}</h3>
                <p><strong>Commande:</strong> ${step.command}</p>
                <p class="duration">Durée: ${(step.duration / 1000).toFixed(1)}s</p>
                ${step.error ? `<p class="error">Erreur: ${step.error}</p>` : ''}
            </div>
        `).join('')}

        <h2>Informations système</h2>
        <ul>
            <li><strong>Plateforme:</strong> ${report.system.platform}</li>
            <li><strong>Architecture:</strong> ${report.system.arch}</li>
            <li><strong>Node.js:</strong> ${report.system.nodeVersion}</li>
            <li><strong>Mémoire:</strong> ${(report.system.totalMemory / 1024 / 1024).toFixed(0)} MB</li>
        </ul>
    </div>
</body>
</html>`;
}

function displaySummary(results) {
    const summary = results.summary;

    console.log('📋 RÉSUMÉ FINAL DES BENCHMARKS\n');
    console.log('=' .repeat(50));
    console.log(`\n📈 RÉSULTATS GLOBAUX:`);
    console.log(`   Étapes totales: ${summary.totalSteps}`);
    console.log(`   Étapes réussies: ${summary.successfulSteps}`);
    console.log(`   Étapes échouées: ${summary.failedSteps}`);
    console.log(`   Taux de succès: ${summary.successRate.toFixed(1)}%`);
    console.log(`   Durée totale: ${(summary.totalDuration / 1000).toFixed(1)}s`);

    console.log(`\n📋 DÉTAIL PAR ÉTAPE:`);
    results.steps.forEach((step, index) => {
        const status = step.success ? '✅' : '❌';
        const duration = (step.duration / 1000).toFixed(1);
        console.log(`   ${index + 1}. ${status} ${step.name} (${duration}s)`);

        if (!step.success && step.error) {
            console.log(`      Erreur: ${step.error}`);
        }
    });

    if (summary.successRate === 100) {
        console.log('\n🎉 Tous les benchmarks se sont exécutés avec succès !');
    } else {
        console.log(`\n⚠️ ${summary.failedSteps} étape(s) ont échoué. Vérifiez les logs ci-dessus.`);
    }

    console.log('\n💡 Prochaines étapes:');
    console.log('   - Examiner les rapports détaillés dans le dossier results/');
    console.log('   - Comparer les performances entre implémentations');
    console.log('   - Optimiser les parsers en fonction des résultats');
}

// Gestion des erreurs
process.on('uncaughtException', (error) => {
    console.error('❌ Erreur non gérée:', error);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Promesse rejetée non gérée:', reason);
    process.exit(1);
});

// Exécution
if (require.main === module) {
    main().catch(error => {
        console.error('❌ Erreur fatale:', error);
        process.exit(1);
    });
}

module.exports = { main };
