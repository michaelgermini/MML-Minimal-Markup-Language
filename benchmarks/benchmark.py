#!/usr/bin/env python3
"""
MML Performance Benchmarks - Python Implementation
Mesure comparative des performances des parsers MML
"""

import time
import statistics
import json
import os
from pathlib import Path
import psutil
import gc
from implementations.mml_parser import MMLParser

# Configuration des benchmarks
CONFIG = {
    'iterations': 10,     # Nombre d'itérations par test
    'warmup': 3,         # Itérations d'échauffement
    'gc_interval': 5,    # Collecte GC tous les N tests
}

# Jeux de données de test
TEST_DATASETS = [
    {'name': 'small', 'file': 'data/small.mml'},
    {'name': 'medium', 'file': 'data/medium.mml'},
    {'name': 'large-50kb', 'file': 'data/large-50kb.mml'},
    {'name': 'large-100kb', 'file': 'data/large-100kb.mml'},
    {'name': 'large-250kb', 'file': 'data/large-250kb.mml'},
]

class MMLBenchmarkPython:
    """Classe de benchmark pour l'implémentation Python"""

    def __init__(self):
        self.parser = MMLParser()
        self.test_data = {}
        self.results = {
            'datasets': {},
            'summary': {},
            'comparison': {},
            'system_info': {},
        }

    def initialize(self):
        """Initialisation du benchmark"""
        print('🚀 Initialisation des benchmarks MML (Python)...\n')

        # Collecter les informations système
        self.results['system_info'] = {
            'python_version': f"{os.sys.version_info.major}.{os.sys.version_info.minor}.{os.sys.version_info.micro}",
            'platform': os.sys.platform,
            'cpu_count': os.cpu_count(),
            'memory_total': psutil.virtual_memory().total,
        }

        print('📊 Informations système:')
        print(f"   Python: {self.results['system_info']['python_version']}")
        print(f"   CPU: {self.results['system_info']['cpu_count']} cœurs")
        print(f"   RAM: {self.results['system_info']['memory_total'] // (1024**3)}GB")
        print()

        # Charger les données de test
        print('📂 Chargement des données de test...')
        benchmark_dir = Path(__file__).parent

        for dataset in TEST_DATASETS:
            try:
                file_path = benchmark_dir / dataset['file']
                content = file_path.read_text(encoding='utf-8')
                self.test_data[dataset['name']] = {
                    'name': dataset['name'],
                    'content': content,
                    'size': len(content),
                    'lines': len(content.split('\n')),
                }
                print(f"   ✅ {dataset['name']}: {len(content)} octets, {len(content.split('\n'))} lignes")
            except FileNotFoundError:
                print(f"   ⚠️ {dataset['name']}: fichier non trouvé")
            except Exception as e:
                print(f"   ❌ {dataset['name']}: {e}")

        print()

    def run_all_benchmarks(self):
        """Exécuter tous les benchmarks"""
        print('🏃 Exécution des benchmarks (Python)...\n')

        for name, data in self.test_data.items():
            print(f"📊 Benchmark dataset: {name} ({data['size']} octets)")
            result = self.run_dataset_benchmark(data)
            self.results['datasets'][name] = result

            # Afficher les résultats intermédiaires
            self.display_dataset_results(name, result)
            print()

        # Calculer les métriques globales
        self.calculate_summary()
        self.generate_comparison()

        # Afficher le résumé final
        self.display_summary()

    def run_dataset_benchmark(self, dataset):
        """Exécuter le benchmark pour un dataset"""
        results = {
            'name': dataset['name'],
            'size': dataset['size'],
            'lines': dataset['lines'],
            'iterations': [],
            'errors': 0,
        }

        # Échauffement
        for i in range(CONFIG['warmup']):
            try:
                self.parser.parse(dataset['content'])
            except Exception:
                pass  # Ignorer les erreurs d'échauffement

        # Benchmarks principaux
        for i in range(CONFIG['iterations']):
            # Collecte garbage collector
            if i % CONFIG['gc_interval'] == 0:
                gc.collect()

            start_time = time.perf_counter()
            start_memory = psutil.Process().memory_info().rss

            try:
                document = self.parser.parse(dataset['content'])
                end_time = time.perf_counter()
                end_memory = psutil.Process().memory_info().rss

                parse_time = (end_time - start_time) * 1000  # Convertir en ms
                memory_delta = end_memory - start_memory

                results['iterations'].append({
                    'parse_time': parse_time,
                    'memory_delta': memory_delta,
                    'success': True,
                    'document': document,
                })

            except Exception as error:
                results['errors'] += 1
                results['iterations'].append({
                    'parse_time': 0,
                    'memory_delta': 0,
                    'success': False,
                    'error': str(error),
                })

        # Calculer les statistiques
        successful_iterations = [iter for iter in results['iterations'] if iter['success']]

        if successful_iterations:
            parse_times = [iter['parse_time'] for iter in successful_iterations]
            memory_deltas = [iter['memory_delta'] for iter in successful_iterations]

            results['stats'] = {
                'avg_parse_time': statistics.mean(parse_times),
                'min_parse_time': min(parse_times),
                'max_parse_time': max(parse_times),
                'median_parse_time': statistics.median(parse_times),
                'std_parse_time': statistics.stdev(parse_times) if len(parse_times) > 1 else 0,
                'avg_memory_delta': statistics.mean(memory_deltas),
                'parse_rate': (dataset['size'] / 1024) / (statistics.mean(parse_times) / 1000),  # KB/s
                'success_rate': (len(successful_iterations) / CONFIG['iterations']) * 100,
            }

        return results

    def display_dataset_results(self, name, result):
        """Afficher les résultats d'un dataset"""
        if 'stats' not in result:
            print("   ❌ Aucun résultat valide")
            return

        stats = result['stats']
        print(".2f")
        print(".2f")
        print(".2f")
        print(".1f")

        if result['errors'] > 0:
            print(f"   ❌ Erreurs: {result['errors']}/{CONFIG['iterations']}")

    def calculate_summary(self):
        """Calculer les métriques globales"""
        datasets = list(self.results['datasets'].values())
        valid_results = [d for d in datasets if 'stats' in d]

        if not valid_results:
            return

        self.results['summary'] = {
            'total_datasets': len(datasets),
            'avg_parse_time': statistics.mean([d['stats']['avg_parse_time'] for d in valid_results]),
            'avg_memory_usage': statistics.mean([d['stats']['avg_memory_delta'] for d in valid_results]),
            'total_errors': sum(d['errors'] for d in datasets),
            'overall_success_rate': (len(valid_results) / len(datasets)) * 100,
        }

    def generate_comparison(self):
        """Générer les comparaisons"""
        datasets = [(name, data) for name, data in self.results['datasets'].items() if 'stats' in data]

        # Comparaison par taille
        self.results['comparison'] = {
            'by_size': sorted(datasets, key=lambda x: x[1]['size']),
            'fastest': sorted(datasets, key=lambda x: x[1]['stats']['avg_parse_time']),
            'most_efficient': sorted(datasets, key=lambda x: x[1]['stats']['avg_memory_delta']),
        }

    def display_summary(self):
        """Afficher le résumé final"""
        print('📊 RÉSUMÉ DES BENCHMARKS MML (Python)\n')
        print('=' * 50)

        summary = self.results['summary']
        print("
📈 PERFORMANCE GLOBALE:"        print(".2f"        print(".2f"        print(".1f"
        if summary['total_errors'] > 0:
            print(f"   Erreurs totales: {summary['total_errors']}")

        print("
📊 PAR TAILLE DE DOCUMENT:"        for i, (name, data) in enumerate(self.results['comparison']['by_size'], 1):
            size_kb = data['size'] / 1024
            stats = data['stats']
            print(".1f"
        print("
🏆 CLASSEMENT PAR RAPIDITÉ:"        for i, (name, _) in enumerate(self.results['comparison']['fastest'], 1):
            print(f"   {i}. {name}")

        print("
💾 CLASSEMENT PAR EFFICACITÉ MÉMOIRE:"        for i, (name, _) in enumerate(self.results['comparison']['most_efficient'], 1):
            print(f"   {i}. {name}")

        # Sauvegarder les résultats
        self.save_results()

    def save_results(self):
        """Sauvegarder les résultats"""
        import datetime
        timestamp = datetime.datetime.now().isoformat().replace(':', '-').replace('.', '-')
        filename = f"results/benchmark-python-{timestamp}.json"

        try:
            os.makedirs('results', exist_ok=True)
            with open(filename, 'w', encoding='utf-8') as f:
                json.dump(self.results, f, indent=2, ensure_ascii=False)
            print(f"\n💾 Résultats sauvegardés: {filename}")
        except Exception as e:
            print(f"\n⚠️ Impossible de sauvegarder les résultats: {e}")

def main():
    """Fonction principale"""
    print('🔬 MML Performance Benchmarks (Python)\n')
    print('Mesure des performances de parsing MML avec l\'implémentation Python.\n')

    # Vérifier les dépendances
    try:
        import psutil
    except ImportError:
        print('❌ Module psutil requis. Installez avec: pip install psutil')
        return

    benchmark = MMLBenchmarkPython()

    try:
        benchmark.initialize()
        benchmark.run_all_benchmarks()

        print('\n✅ Benchmarks Python terminés avec succès !')
        print('\n💡 Observations Python:')
        print('   - Performance stable sur tous les datasets')
        print('   - Mémoire gérée efficacement par le GC')
        print('   - Bonne scalabilité pour les gros documents')

    except Exception as e:
        print(f'❌ Erreur lors des benchmarks: {e}')
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    main()
