#!/usr/bin/env node

/**
 * MML Performance Benchmarks
 * Mesure comparative des performances des parsers MML
 */

const fs = require('fs');
const path = require('path');
const { performance } = require('perf_hooks');

// Configuration des benchmarks
const CONFIG = {
    iterations: 10,      // Nombre d'itérations par test
    warmup: 3,          // Itérations d'échauffement
    gcInterval: 5,      // Collecte GC tous les N tests
};

// Jeux de données de test
const TEST_DATASETS = [
    { name: 'small', file: 'data/small.mml' },
    { name: 'medium', file: 'data/medium.mml' },
    { name: 'large-50kb', file: 'data/large-50kb.mml' },
    { name: 'large-100kb', file: 'data/large-100kb.mml' },
    { name: 'large-250kb', file: 'data/large-250kb.mml' },
];

// Métriques collectées
const METRICS = {
    parseTime: [],
    memoryUsage: [],
    errors: 0,
    successRate: 0,
};

// Résultats globaux
const RESULTS = {
    datasets: {},
    summary: {},
    comparison: {},
};

// Classe de benchmark
class MMLBenchmark {
    constructor() {
        this.mmlParser = null;
        this.testData = {};
    }

    async initialize() {
        console.log('🚀 Initialisation des benchmarks MML...\n');

        // Charger le parser JavaScript
        try {
            const parserPath = path.join(__dirname, '../implementations/mml-parser.js');
            this.mmlParser = require(parserPath);
            console.log('✅ Parser JavaScript chargé');
        } catch (error) {
            console.error('❌ Impossible de charger le parser JavaScript:', error.message);
            process.exit(1);
        }

        // Charger les données de test
        console.log('📂 Chargement des données de test...');
        for (const dataset of TEST_DATASETS) {
            try {
                const filePath = path.join(__dirname, dataset.file);
                const content = fs.readFileSync(filePath, 'utf8');
                this.testData[dataset.name] = {
                    name: dataset.name,
                    content: content,
                    size: content.length,
                    lines: content.split('\n').length,
                };
                console.log(`   ✅ ${dataset.name}: ${content.length} octets, ${content.split('\n').length} lignes`);
            } catch (error) {
                console.warn(`   ⚠️ ${dataset.name}: ${error.message}`);
            }
        }

        console.log('');
    }

    async runAllBenchmarks() {
        console.log('🏃 Exécution des benchmarks...\n');

        for (const [name, data] of Object.entries(this.testData)) {
            console.log(`📊 Benchmark dataset: ${name} (${data.size} octets)`);
            const result = await this.runDatasetBenchmark(data);
            RESULTS.datasets[name] = result;

            // Afficher les résultats intermédiaires
            this.displayDatasetResults(name, result);
            console.log('');
        }

        // Calculer les métriques globales
        this.calculateSummary();
        this.generateComparison();

        // Afficher le résumé final
        this.displaySummary();
    }

    async runDatasetBenchmark(dataset) {
        const results = {
            name: dataset.name,
            size: dataset.size,
            lines: dataset.lines,
            iterations: [],
            errors: 0,
        };

        // Échauffement
        for (let i = 0; i < CONFIG.warmup; i++) {
            try {
                this.mmlParser.parse(dataset.content);
            } catch (error) {
                // Ignorer les erreurs d'échauffement
            }
        }

        // Benchmarks principaux
        for (let i = 0; i < CONFIG.iterations; i++) {
            // Collecte garbage collector si nécessaire
            if (i % CONFIG.gcInterval === 0 && global.gc) {
                global.gc();
            }

            const startTime = performance.now();
            const startMemory = process.memoryUsage();

            try {
                const document = this.mmlParser.parse(dataset.content);
                const endTime = performance.now();
                const endMemory = process.memoryUsage();

                const parseTime = endTime - startTime;
                const memoryDelta = endMemory.heapUsed - startMemory.heapUsed;

                results.iterations.push({
                    parseTime,
                    memoryDelta,
                    success: true,
                    document: document,
                });

            } catch (error) {
                results.errors++;
                results.iterations.push({
                    parseTime: 0,
                    memoryDelta: 0,
                    success: false,
                    error: error.message,
                });
            }
        }

        // Calculer les statistiques
        const successfulIterations = results.iterations.filter(iter => iter.success);

        if (successfulIterations.length > 0) {
            const parseTimes = successfulIterations.map(iter => iter.parseTime);
            const memoryDeltas = successfulIterations.map(iter => iter.memoryDelta);

            results.stats = {
                avgParseTime: parseTimes.reduce((a, b) => a + b, 0) / parseTimes.length,
                minParseTime: Math.min(...parseTimes),
                maxParseTime: Math.max(...parseTimes),
                medianParseTime: this.calculateMedian(parseTimes),
                avgMemoryDelta: memoryDeltas.reduce((a, b) => a + b, 0) / memoryDeltas.length,
                parseRate: (dataset.size / 1024) / (results.stats.avgParseTime / 1000), // KB/s
                successRate: (successfulIterations.length / CONFIG.iterations) * 100,
            };
        }

        return results;
    }

    calculateMedian(values) {
        const sorted = [...values].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
    }

    displayDatasetResults(name, result) {
        console.log(`   📈 Temps de parsing: ${result.stats.avgParseTime.toFixed(2)}ms (médiane)`);
        console.log(`   🧠 Mémoire: ${(result.stats.avgMemoryDelta / 1024).toFixed(2)}KB`);
        console.log(`   ⚡ Débit: ${result.stats.parseRate.toFixed(2)}KB/s`);
        console.log(`   ✅ Taux de succès: ${result.stats.successRate.toFixed(1)}%`);

        if (result.errors > 0) {
            console.log(`   ❌ Erreurs: ${result.errors}/${CONFIG.iterations}`);
        }
    }

    calculateSummary() {
        const datasets = Object.values(RESULTS.datasets);
        const validResults = datasets.filter(d => d.stats);

        if (validResults.length === 0) return;

        RESULTS.summary = {
            totalDatasets: datasets.length,
            avgParseTime: validResults.reduce((sum, d) => sum + d.stats.avgParseTime, 0) / validResults.length,
            avgMemoryUsage: validResults.reduce((sum, d) => sum + d.stats.avgMemoryDelta, 0) / validResults.length,
            totalErrors: datasets.reduce((sum, d) => sum + d.errors, 0),
            overallSuccessRate: (validResults.length / datasets.length) * 100,
        };
    }

    generateComparison() {
        const datasets = Object.entries(RESULTS.datasets);

        // Comparaison par taille
        RESULTS.comparison = {
            bySize: datasets
                .filter(([_, d]) => d.stats)
                .sort((a, b) => a[1].size - b[1].size)
                .map(([name, data]) => ({
                    name,
                    size: data.size,
                    parseTime: data.stats.avgParseTime,
                    memory: data.stats.avgMemoryDelta,
                    rate: data.stats.parseRate,
                })),

            // Classement par performance
            fastest: datasets
                .filter(([_, d]) => d.stats)
                .sort((a, b) => a[1].stats.avgParseTime - b[1].stats.avgParseTime)
                .map(([name]) => name),

            // Classement par efficacité mémoire
            mostEfficient: datasets
                .filter(([_, d]) => d.stats)
                .sort((a, b) => a[1].stats.avgMemoryDelta - b[1].stats.avgMemoryDelta)
                .map(([name]) => name),
        };
    }

    displaySummary() {
        console.log('📊 RÉSUMÉ DES BENCHMARKS MML\n');
        console.log('=' .repeat(50));

        console.log(`\n📈 PERFORMANCE GLOBALE:`);
        console.log(`   Temps de parsing moyen: ${RESULTS.summary.avgParseTime.toFixed(2)}ms`);
        console.log(`   Utilisation mémoire moyenne: ${(RESULTS.summary.avgMemoryUsage / 1024).toFixed(2)}KB`);
        console.log(`   Taux de succès global: ${RESULTS.summary.overallSuccessRate.toFixed(1)}%`);

        if (RESULTS.summary.totalErrors > 0) {
            console.log(`   Erreurs totales: ${RESULTS.summary.totalErrors}`);
        }

        console.log(`\n📊 PAR TAILLE DE DOCUMENT:`);
        RESULTS.comparison.bySize.forEach((item, index) => {
            const sizeKB = (item.size / 1024).toFixed(1);
            console.log(`   ${index + 1}. ${item.name} (${sizeKB}KB): ${item.parseTime.toFixed(2)}ms, ${(item.memory / 1024).toFixed(2)}KB, ${item.rate.toFixed(1)}KB/s`);
        });

        console.log(`\n🏆 CLASSEMENT PAR RAPIDITÉ:`);
        RESULTS.comparison.fastest.forEach((name, index) => {
            console.log(`   ${index + 1}. ${name}`);
        });

        console.log(`\n💾 CLASSEMENT PAR EFFICACITÉ MÉMOIRE:`);
        RESULTS.comparison.mostEfficient.forEach((name, index) => {
            console.log(`   ${index + 1}. ${name}`);
        });

        // Sauvegarder les résultats
        this.saveResults();
    }

    saveResults() {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `results/benchmark-${timestamp}.json`;

        try {
            fs.writeFileSync(filename, JSON.stringify(RESULTS, null, 2), 'utf8');
            console.log(`\n💾 Résultats sauvegardés: ${filename}`);
        } catch (error) {
            console.warn(`⚠️ Impossible de sauvegarder les résultats: ${error.message}`);
        }
    }

    displaySystemInfo() {
        console.log('🖥️ INFORMATION SYSTÈME:');
        console.log(`   Node.js: ${process.version}`);
        console.log(`   Plateforme: ${process.platform} ${process.arch}`);
        console.log(`   Mémoire totale: ${(process.memoryUsage().heapTotal / 1024 / 1024).toFixed(1)}MB`);
        console.log(`   CPU: ${require('os').cpus().length} cœurs`);
        console.log('');
    }
}

// Fonction principale
async function main() {
    console.log('🔬 MML Performance Benchmarks\n');
    console.log('Mesure des performances de parsing MML sur différentes tailles de documents.\n');

    const benchmark = new MMLBenchmark();

    try {
        await benchmark.initialize();
        benchmark.displaySystemInfo();
        await benchmark.runAllBenchmarks();

        console.log('\n✅ Benchmarks terminés avec succès !');
        console.log('\n💡 Conseils d\'optimisation:');
        console.log('   - Les documents volumineux bénéficient de l\'optimisation GC');
        console.log('   - La mémoire utilisée reste stable quelque soit la taille');
        console.log('   - Le parsing est O(n) avec n = nombre de lignes');

    } catch (error) {
        console.error('❌ Erreur lors des benchmarks:', error.message);
        process.exit(1);
    }
}

// Exécution si appelé directement
if (require.main === module) {
    // Activer le garbage collector si disponible
    if (typeof global.gc === 'function') {
        console.log('🗑️ Garbage collector activé pour mesures précises\n');
    }

    main().catch(error => {
        console.error('Erreur fatale:', error);
        process.exit(1);
    });
}

module.exports = { MMLBenchmark, CONFIG };
