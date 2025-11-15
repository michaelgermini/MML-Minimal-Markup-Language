/**
 * MML Tutorial - Lesson Content and Exercises
 * Defines all lessons, exercises, and achievements for the interactive tutorial
 */

const LESSONS = [
    {
        id: 'introduction',
        title: 'Introduction à MML',
        description: 'Découvrez ce qu\'est le langage Minimal Markup Language et pourquoi il a été créé.',
        objectives: [
            'Comprendre le concept de MML',
            'Connaître ses avantages et cas d\'usage',
            'Savoir pourquoi MML est adapté aux environnements contraints'
        ],
        quickReference: {
            'Balises de base': ['T:', 'H:', 'P:', 'M:']
        },
        sections: [
            {
                title: '📋 Qu\'est-ce que MML ?',
                content: [
                    {
                        type: 'text',
                        text: 'MML (Minimal Markup Language) est un langage de balisage conçu pour être simple, robuste et universel. Contrairement à HTML ou XML qui sont verbeux, MML utilise une syntaxe minimaliste adaptée aux environnements contraints.'
                    },
                    {
                        type: 'text',
                        text: 'MML est particulièrement adapté pour :'
                    },
                    {
                        type: 'list',
                        items: [
                            'La transmission radio (code Morse intégré)',
                            'Les systèmes embarqués à ressources limitées',
                            'Les communications d\'urgence',
                            'L\'archivage à long terme'
                        ]
                    }
                ]
            },
            {
                title: '🎯 Avantages de MML',
                content: [
                    {
                        type: 'text',
                        text: 'MML présente plusieurs avantages clés :'
                    },
                    {
                        type: 'list',
                        items: [
                            '<strong>Simplicité</strong> : Syntaxe intuitive et minimaliste',
                            '<strong>Robustesse</strong> : Résistant aux erreurs de transmission',
                            '<strong>Efficacité</strong> : Faible empreinte mémoire et bande passante',
                            '<strong>Universalité</strong> : Implémentable dans n\'importe quel langage'
                        ]
                    }
                ]
            },
            {
                title: '🚀 Premier exemple',
                content: [
                    {
                        type: 'text',
                        text: 'Voici votre premier document MML :'
                    },
                    {
                        type: 'code',
                        code: 'T:Mon premier document\nP:Ceci est un paragraphe simple.'
                    },
                    {
                        type: 'text',
                        text: 'Comme vous pouvez le voir, MML utilise des balises courtes suivies de deux-points pour identifier le type de contenu.'
                    }
                ]
            },
            {
                title: '✏️ Exercice pratique',
                content: [
                    {
                        type: 'text',
                        text: 'Maintenant que vous connaissez les bases, testez vos connaissances :'
                    },
                    {
                        type: 'exercise',
                        id: 'first-document',
                        title: 'Créer votre premier document'
                    }
                ]
            }
        ],
        exercises: [
            {
                id: 'first-document',
                title: 'Créer votre premier document',
                instruction: 'Créez un document MML simple avec un titre et un paragraphe. Utilisez les balises T: pour le titre et P: pour le paragraphe.',
                hint: 'Commencez par T: suivi du titre, puis P: suivi du paragraphe.',
                solution: 'T:Mon premier document\nP:Ceci est mon premier paragraphe en MML.',
                validation: 'has_title',
                achievement: 'first-steps'
            }
        ]
    },
    {
        id: 'basic-syntax',
        title: 'Syntaxe de base',
        description: 'Apprenez la syntaxe fondamentale de MML : balises, structure et règles de base.',
        objectives: [
            'Maîtriser les balises principales',
            'Comprendre la structure des documents',
            'Connaître les règles de syntaxe'
        ],
        quickReference: {
            'Balises principales': ['T:', 'H:', 'P:', 'M:', 'L:', 'Q:', 'C:'],
            'Règles': [
                'Une balise par ligne',
                'Contenu après les deux-points',
                'Pas d\'imbrication complexe'
            ]
        },
        sections: [
            {
                title: '🏗️ Structure des documents',
                content: [
                    {
                        type: 'text',
                        text: 'Un document MML suit une structure hiérarchique simple :'
                    },
                    {
                        type: 'code',
                        code: 'T:Titre du document          ← Titre principal\nH:Section 1                  ← Section/en-tête\nP:Contenu de la section 1    ← Paragraphe\nP:Autre paragraphe\nH:Section 2                  ← Nouvelle section\nP:Contenu de la section 2'
                    },
                    {
                        type: 'text',
                        text: 'Chaque ligne contient exactement une balise et son contenu.'
                    }
                ]
            },
            {
                title: '📝 Balises principales',
                content: [
                    {
                        type: 'text',
                        text: 'Voici les balises les plus utilisées :'
                    },
                    {
                        type: 'list',
                        items: [
                            '<code>T:</code> - Titre du document',
                            '<code>H:</code> - Section ou en-tête',
                            '<code>P:</code> - Paragraphe de texte',
                            '<code>M:</code> - Métadonnées (clé|valeur)',
                            '<code>L:</code> - Lien hypertexte (texte|URL)',
                            '<code>Q:</code> - Citation ou remarque',
                            '<code>C:</code> - Bloc de code'
                        ]
                    }
                ]
            },
            {
                title: '📋 Métadonnées',
                content: [
                    {
                        type: 'text',
                        text: 'Les métadonnées utilisent le format clé|valeur :'
                    },
                    {
                        type: 'code',
                        code: 'M:Auteur|Jean Dupont\nM:Version|1.0\nM:Créé|2025-01-15\nM:Licence|MIT'
                    },
                    {
                        type: 'text',
                        text: 'Elles permettent d\'ajouter des informations structurées au document.'
                    }
                ]
            },
            {
                title: '🔗 Liens et références',
                content: [
                    {
                        type: 'text',
                        text: 'Les liens utilisent également le format texte|URL :'
                    },
                    {
                        type: 'code',
                        code: 'L:Documentation officielle|https://mml-lang.org\nL:Code source|https://github.com/mml-lang/mml\nL:Télécharger|https://mml-lang.org/download'
                    }
                ]
            },
            {
                title: '✏️ Exercices de syntaxe',
                content: [
                    {
                        type: 'exercise',
                        id: 'basic-structure',
                        title: 'Structure de base'
                    },
                    {
                        type: 'exercise',
                        id: 'metadata-exercise',
                        title: 'Ajouter des métadonnées'
                    }
                ]
            }
        ],
        exercises: [
            {
                id: 'basic-structure',
                title: 'Créer une structure de base',
                instruction: 'Créez un document MML avec un titre, deux sections et du contenu dans chaque section.',
                hint: 'Utilisez T: pour le titre, H: pour les sections, et P: pour les paragraphes.',
                solution: 'T:Guide d\'utilisation\nH:Installation\nP:Téléchargez l\'archive depuis le site officiel.\nH:Configuration\nP:Modifiez le fichier de configuration selon vos besoins.',
                validation: 'has_sections',
                achievement: 'syntax-master'
            },
            {
                id: 'metadata-exercise',
                title: 'Document avec métadonnées',
                instruction: 'Ajoutez des métadonnées complètes à votre document : auteur, version, et date.',
                hint: 'Utilisez la balise M: avec le format clé|valeur.',
                solution: 'T:Document avec métadonnées\nM:Auteur|Votre nom\nM:Version|1.0\nM:Créé|2025-01-15\nP:Contenu du document avec métadonnées.',
                validation: 'has_metadata',
                achievement: 'metadata-expert'
            }
        ]
    },
    {
        id: 'advanced-features',
        title: 'Fonctionnalités avancées',
        description: 'Explorez les fonctionnalités avancées de MML : images, code, et structures complexes.',
        objectives: [
            'Utiliser les balises avancées',
            'Intégrer des images et du code',
            'Comprendre MMLC et la compression'
        ],
        quickReference: {
            'Balises avancées': ['IMG:', 'C:', 'Q:', 'CFG:'],
            'Compression': ['MMLC réduit la taille de 40-60%']
        },
        sections: [
            {
                title: '🖼️ Images et médias',
                content: [
                    {
                        type: 'text',
                        text: 'MML supporte l\'intégration d\'images :'
                    },
                    {
                        type: 'code',
                        code: 'IMG:Carte du secteur|carte-secteur.png\nIMG:Photo du site|photo-site-001.jpg'
                    },
                    {
                        type: 'text',
                        text: 'Le format est description|URL, permettant de décrire l\'image pour l\'accessibilité.'
                    }
                ]
            },
            {
                title: '💻 Blocs de code',
                content: [
                    {
                        type: 'text',
                        text: 'Pour insérer du code ou des commandes :'
                    },
                    {
                        type: 'code',
                        code: 'C:# Installation du parser\nC:npm install mml-parser\nC:# Utilisation\nC:const parser = new MMLParser();\nC:const doc = parser.parse(mmlContent);'
                    },
                    {
                        type: 'text',
                        text: 'Les blocs de code préservent le formatage et les indentations.'
                    }
                ]
            },
            {
                title: '📝 Citations et remarques',
                content: [
                    {
                        type: 'text',
                        text: 'Les citations permettent de mettre en valeur du texte important :'
                    },
                    {
                        type: 'code',
                        code: 'Q:La simplicité est la sophistication ultime.\nQ:Leonardo da Vinci'
                    }
                ]
            },
            {
                title: '⚙️ Configuration et données structurées',
                content: [
                    {
                        type: 'text',
                        text: 'Pour les données de configuration :'
                    },
                    {
                        type: 'code',
                        code: 'CFG:Serveur Web\nM:Port|8080\nM:SSL|Activé\nM:Timeout|30s\nCFG:Base de données\nM:Type|PostgreSQL\nM:Host|localhost\nM:Port|5432'
                    }
                ]
            },
            {
                title: '🗜️ Compression MMLC',
                content: [
                    {
                        type: 'text',
                        text: 'MMLC est la version compressée de MML, idéale pour la transmission :'
                    },
                    {
                        type: 'code',
                        code: '1:Titre compressé\n2:Section réduite\n3:Auteur|Toto\n4:Contenu minimal'
                    },
                    {
                        type: 'text',
                        text: 'La compression peut réduire la taille de 40 à 60% selon le contenu.'
                    }
                ]
            },
            {
                title: '✏️ Exercices avancés',
                content: [
                    {
                        type: 'exercise',
                        id: 'complete-document',
                        title: 'Document complet'
                    },
                    {
                        type: 'exercise',
                        id: 'code-integration',
                        title: 'Intégrer du code'
                    }
                ]
            }
        ],
        exercises: [
            {
                id: 'complete-document',
                title: 'Document MML complet',
                instruction: 'Créez un document complet avec titre, métadonnées, sections, liens et images.',
                hint: 'Utilisez toutes les balises apprises : T:, M:, H:, P:, L:, IMG:',
                solution: 'T:Guide complet MML\nM:Auteur|Équipe pédagogique\nM:Version|1.0\nM:Niveau|Avancé\nH:Introduction\nP:MML est un langage de balisage minimaliste.\nL:Documentation|https://mml-lang.org\nIMG:Logo MML|mml-logo.png\nH:Installation\nC:npm install mml-parser\nP:Après installation, vous pouvez utiliser le parser.',
                validation: 'complete_document',
                achievement: 'mml-expert'
            },
            {
                id: 'code-integration',
                title: 'Documentation avec code',
                instruction: 'Créez une documentation technique incluant des exemples de code.',
                hint: 'Utilisez la balise C: pour les blocs de code et structurez votre document clairement.',
                solution: 'T:Installation du parser MML\nH:Prérequis\nP:Node.js version 14 ou supérieure\nC:# Vérifier la version\nC:node --version\nH:Installation\nC:# Installation globale\nC:npm install -g mml-parser\nH:Utilisation\nC:# Exemple d\'usage\nC:const MMLParser = require(\'mml-parser\');\nC:const parser = new MMLParser();',
                validation: 'has_sections',
                achievement: 'code-master'
            }
        ]
    },
    {
        id: 'real-world',
        title: 'Cas d\'usage réels',
        description: 'Découvrez comment MML est utilisé dans des scénarios réels : urgences, technique, médical.',
        objectives: [
            'Comprendre les cas d\'usage de MML',
            'Adapter MML à différents domaines',
            'Optimiser pour des environnements spécifiques'
        ],
        quickReference: {
            'Domaines': ['Urgences', 'Médical', 'Technique', 'IoT'],
            'Optimisations': ['MMLC', 'Métadonnées', 'Structure minimale']
        },
        sections: [
            {
                title: '🚨 Situations d\'urgence',
                content: [
                    {
                        type: 'text',
                        text: 'MML est particulièrement adapté aux communications d\'urgence :'
                    },
                    {
                        type: 'code',
                        code: 'T:ALERTE INCENDIE\nM:ID|INC-2025-001\nM:Priorité|CRITIQUE\nM:Localisation|Forêt domaniale secteur 7\nM:Heure|14:30 UTC\nH:SITUATION\nP:Incendie de forêt déclaré\nM:Surface|450 hectares\nM:Vent|25 km/h NNE\nH:MOYENS ENGAGES\nP:3 Canadairs + 2 hélicoptères\nP:45 sapeurs-pompiers\nH:ACTIONS REQUISES\nP:Évacuation zone rouge immédiate\nQ:URGENT : Intervention immédiate'
                    }
                ]
            },
            {
                title: '🏥 Rapports médicaux',
                content: [
                    {
                        type: 'text',
                        text: 'Structure idéale pour les données médicales :'
                    },
                    {
                        type: 'code',
                        code: 'T:RAPPORT MEDICAL URGENCES\nM:Patient|DUPONT Jean\nM:ID_PATIENT|P2025001\nM:Medecin|Dr. MARTIN Marie\nM:Service|Urgences\nH:IDENTIFICATION\nM:Age|45 ans\nM:Sexe|Homme\nM:Poids|75 kg\nH:SYMPTOMES\nP:Douleurs thoraciques sévères\nP:Difficultés respiratoires\nM:Douleur|8/10\nH:DIAGNOSTIC\nM:Diagnostic|Infarctus du myocarde\nM:Gravite|Critique'
                    }
                ]
            },
            {
                title: '⚙️ Documentation technique',
                content: [
                    {
                        type: 'text',
                        text: 'Parfaite pour les manuels et spécifications :'
                    },
                    {
                        type: 'code',
                        code: 'T:MANUEL SERVEUR API\nM:Produit|Serveur Web MML\nM:Version|2.1.0\nM:OS|Ubuntu 22.04 LTS\nH:INSTALLATION\nC:# Installation des dépendances\nC:sudo apt update\nC:sudo apt install nodejs npm\nH:CONFIGURATION\nCFG:Serveur\nM:Port|8080\nM:SSL|Activé\nM:Timeout|30s\nH:DÉPLOIEMENT\nC:# Démarrage du service\nC:sudo systemctl enable mml-server\nC:sudo systemctl start mml-server'
                    }
                ]
            },
            {
                title: '🌐 Communication IoT',
                content: [
                    {
                        type: 'text',
                        text: 'Optimisé pour les capteurs et objets connectés :'
                    },
                    {
                        type: 'code',
                        code: 'T:RAPPORT CAPTEUR\nM:Device|CAP-001\nM:Location|Warehouse-A\nM:Timestamp|2025-01-15T10:30:00Z\nH:MESURES\nM:Température|23.5°C\nM:Humidité|65%\nM:Pression|1013.25 hPa\nH:STATUS\nM:Batterie|87%\nM:Connectivité|Excellente\nM:Dernière synchro|10:25:00'
                    }
                ]
            },
            {
                title: '📊 Optimisations par domaine',
                content: [
                    {
                        type: 'text',
                        text: 'Chaque domaine bénéficie d\'optimisations spécifiques :'
                    },
                    {
                        type: 'list',
                        items: [
                            '<strong>Urgences</strong> : Métadonnées prioritaires, format standardisé',
                            '<strong>Médical</strong> : Structure rigoureuse, traçabilité complète',
                            '<strong>Technique</strong> : Blocs de code, commandes intégrées',
                            '<strong>IoT</strong> : Timestamps précis, mesures structurées'
                        ]
                    }
                ]
            },
            {
                title: '✏️ Exercices pratiques',
                content: [
                    {
                        type: 'exercise',
                        id: 'emergency-report',
                        title: 'Rapport d\'urgence'
                    },
                    {
                        type: 'exercise',
                        id: 'medical-record',
                        title: 'Dossier médical'
                    }
                ]
            }
        ],
        exercises: [
            {
                id: 'emergency-report',
                title: 'Créer un rapport d\'urgence',
                instruction: 'Rédigez un rapport d\'urgence pour un incident (incendie, accident, etc.) avec tous les éléments essentiels.',
                hint: 'Incluez ID, priorité, localisation, situation, moyens engagés et actions requises.',
                solution: 'T:ALERTE ACCIDENT ROUTIER\nM:ID|ACC-2025-001\nM:Priorité|HAUTE\nM:Localisation|A7 km 234, sens Paris-Lyon\nM:Heure|16:45 UTC\nH:SITUATION\nP:Collision multiple - 3 véhicules impliqués\nP:Blessés légers et graves\nM:Victimes|5 (2 graves, 3 légers)\nH:MOYENS ENGAGES\nP:3 ambulances + SMUR\nP:Pompiers + police\nH:ACTIONS REQUISES\nP:Réduction de voie sur A7\nP:Déviation trafic secondaire\nQ:Intervention rapide nécessaire',
                validation: 'complete_document',
                achievement: 'emergency-expert'
            },
            {
                id: 'medical-record',
                title: 'Créer un dossier médical',
                instruction: 'Créez un dossier médical d\'urgence avec identification patient, symptômes et diagnostic.',
                hint: 'Structurez avec identification, symptômes, diagnostic et traitement.',
                solution: 'T:DOSSIER MEDICAL URGENCES\nM:Patient|MARTIN Pierre\nM:ID_PATIENT|M2025001\nM:Medecin|Dr. DURAND Anne\nM:Service|Urgences\nH:IDENTIFICATION\nM:Age|67 ans\nM:Sexe|Homme\nM:Taille|170 cm\nM:Poids|78 kg\nH:SYMPTOMES\nP:Douleurs abdominales intenses\nP:Nausées et vomissements\nM:Douleur|7/10\nM:Duree|3 heures\nH:DIAGNOSTIC\nM:Diagnostic|Appendicite aiguë\nM:Gravite|Urgente\nM:Examens|Échographie abdominale\nH:TRAITEMENT\nP:Intervention chirurgicale immédiate\nP:Antibiotiques IV\nP:Surveillance post-opératoire',
                validation: 'complete_document',
                achievement: 'medical-expert'
            }
        ]
    },
    {
        id: 'validation-conversion',
        title: 'Validation et conversion',
        description: 'Apprenez à valider vos documents MML et les convertir vers d\'autres formats.',
        objectives: [
            'Valider la syntaxe MML',
            'Convertir vers HTML et JSON',
            'Comprendre les erreurs courantes'
        ],
        quickReference: {
            'Formats de sortie': ['HTML', 'JSON', 'Texte', 'MMLC'],
            'Erreurs communes': ['Balises inconnues', 'Format incorrect', 'Encodage']
        },
        sections: [
            {
                title: '✅ Validation de documents',
                content: [
                    {
                        type: 'text',
                        text: 'La validation vérifie que votre document respecte la syntaxe MML :'
                    },
                    {
                        type: 'list',
                        items: [
                            '<strong>Balises reconnues</strong> : T:, H:, P:, M:, etc.',
                            '<strong>Format correct</strong> : Une balise par ligne',
                            '<strong>Encodage UTF-8</strong> : Support caractères internationaux',
                            '<strong>Structure cohérente</strong> : Hiérarchie logique'
                        ]
                    }
                ]
            },
            {
                title: '🔄 Conversion HTML',
                content: [
                    {
                        type: 'text',
                        text: 'MML se convertit facilement en HTML moderne :'
                    },
                    {
                        type: 'code',
                        code: 'T:Mon document     →  <h1>Mon document</h1>\nH:Section          →  <h2>Section</h2>\nP:Paragraphe       →  <p>Paragraphe</p>\nM:Auteur|Toto      →  <meta name="Auteur" content="Toto">'
                    }
                ]
            },
            {
                title: '📋 Export JSON',
                content: [
                    {
                        type: 'text',
                        text: 'Format structuré pour les APIs et le traitement automatique :'
                    },
                    {
                        type: 'code',
                        code: '{\n  "title": "Mon document",\n  "sections": [\n    {\n      "title": "Section",\n      "content": "Paragraphe",\n      "metadata": {"Auteur": "Toto"}\n    }\n  ]\n}'
                    }
                ]
            },
            {
                title: '🗜️ Compression MMLC',
                content: [
                    {
                        type: 'text',
                        text: 'MMLC réduit la taille pour la transmission :'
                    },
                    {
                        type: 'code',
                        code: 'Original (158 octets):\nT:Guide d\'installation\nH:Prérequis\nP:Node.js 14+\n\nCompressé (89 octets):\n1:Guide d\'installation\n2:Prérequis\n4:Node.js 14+\n\nÉconomie: 44%'
                    }
                ]
            },
            {
                title: '🚨 Erreurs courantes',
                content: [
                    {
                        type: 'text',
                        text: 'Les erreurs les plus fréquentes :'
                    },
                    {
                        type: 'list',
                        items: [
                            '<strong>Balise inconnue</strong> : XYZ: au lieu de balises valides',
                            '<strong>Format métadonnées</strong> : M:clé valeur au lieu de M:clé|valeur',
                            '<strong>Encodage</strong> : Caractères spéciaux mal encodés',
                            '<strong>Structure</strong> : Sections vides ou mal imbriquées'
                        ]
                    }
                ]
            },
            {
                title: '✏️ Exercices de validation',
                content: [
                    {
                        type: 'exercise',
                        id: 'validate-document',
                        title: 'Valider un document'
                    },
                    {
                        type: 'exercise',
                        id: 'convert-formats',
                        title: 'Tester les conversions'
                    }
                ]
            }
        ],
        exercises: [
            {
                id: 'validate-document',
                title: 'Valider et corriger',
                instruction: 'Créez un document MML valide avec tous les éléments requis, puis testez-le.',
                hint: 'Assurez-vous d\'avoir un titre, des sections avec contenu, et des métadonnées correctement formatées.',
                solution: 'T:Document validé\nM:Auteur|Test\nM:Version|1.0\nH:Section 1\nP:Contenu de la première section\nM:Note|Important\nH:Section 2\nP:Contenu de la deuxième section\nL:Référence|https://example.com\nIMG:Illustration|image.png',
                validation: 'complete_document',
                achievement: 'validation-expert'
            },
            {
                id: 'convert-formats',
                title: 'Maîtriser les conversions',
                instruction: 'Créez un document MML riche qui se convertit bien vers HTML et JSON.',
                hint: 'Utilisez tous types de balises pour voir les différentes conversions.',
                solution: 'T:Guide des conversions\nM:Auteur|Équipe MML\nM:Format|Exemple\nM:Test|Conversions\nH:Introduction\nP:Ce document teste les conversions MML.\nQ:La conversion préserve la structure\nC:# Exemple de code\nC:console.log(\'Hello MML\');\nH:Liens et médias\nL:Site web|https://mml-lang.org\nIMG:Logo|logo.png\nH:Configuration\nCFG:Paramètres\nM:Mode|Test\nM:Debug|Activé',
                validation: 'complete_document',
                achievement: 'conversion-master'
            }
        ]
    },
    {
        id: 'best-practices',
        title: 'Bonnes pratiques',
        description: 'Découvrez les meilleures pratiques pour écrire du MML efficace et maintenable.',
        objectives: [
            'Appliquer les conventions de nommage',
            'Optimiser la structure des documents',
            'Préparer pour la production'
        ],
        quickReference: {
            'Conventions': [
                'Majuscules pour les balises',
                'Métadonnées en CamelCase',
                'URLs complètes'
            ],
            'Optimisations': [
                'Sections logiques',
                'Métadonnées pertinentes',
                'Compression MMLC'
            ]
        },
        sections: [
            {
                title: '📏 Conventions de nommage',
                content: [
                    {
                        type: 'text',
                        text: 'Respectez ces conventions pour une meilleure lisibilité :'
                    },
                    {
                        type: 'list',
                        items: [
                            '<strong>Balises</strong> : Toujours en majuscules (T:, H:, P:)',
                            '<strong>Clés métadonnées</strong> : CamelCase (Auteur, Version, DateCreation)',
                            '<strong>Valeurs</strong> : Formatées selon le type (dates ISO, URLs complètes)',
                            '<strong>IDs</strong> : Préfixe + numéro (PAT-001, INC-2025-001)'
                        ]
                    }
                ]
            },
            {
                title: '🏗️ Structure optimale',
                content: [
                    {
                        type: 'text',
                        text: 'Une bonne structure facilite la lecture et le traitement :'
                    },
                    {
                        type: 'code',
                        code: '✅ BONNE STRUCTURE\nT:Titre clair et descriptif\nM:Auteur|Nom complet\nM:Version|1.0.0\nM:Créé|2025-01-15\n\nH:Section principale\nP:Introduction...\n\nH:Sous-section\nP:Détails...\n\n❌ MAUVAISE STRUCTURE\nT:titre\nM:auteur|toto\nH:section1\nP:texte\nH:section2\nP:plus de texte'
                    }
                ]
            },
            {
                title: '🏷️ Métadonnées essentielles',
                content: [
                    {
                        type: 'text',
                        text: 'Incluez toujours ces métadonnées de base :'
                    },
                    {
                        type: 'list',
                        items: [
                            '<code>Auteur</code> : Créateur du document',
                            '<code>Version</code> : Numéro de version (1.0.0)',
                            '<code>Créé</code> : Date de création (ISO 8601)',
                            '<code>Modifié</code> : Dernière modification',
                            '<code>Licence</code> : Conditions d\'utilisation'
                        ]
                    }
                ]
            },
            {
                title: '⚡ Optimisations de performance',
                content: [
                    {
                        type: 'text',
                        text: 'Pour des documents optimaux :'
                    },
                    {
                        type: 'list',
                        items: [
                            '<strong>Compression MMLC</strong> : -40% à -60% de taille',
                            '<strong>Métadonnées utiles</strong> : Seulement celles nécessaires',
                            '<strong>Sections logiques</strong> : Groupement cohérent du contenu',
                            '<strong>Liens valides</strong> : URLs complètes et fonctionnelles'
                        ]
                    }
                ]
            },
            {
                title: '🔒 Sécurité et conformité',
                content: [
                    {
                        type: 'text',
                        text: 'Points importants pour la production :'
                    },
                    {
                        type: 'list',
                        items: [
                            '<strong>Validation</strong> : Toujours valider avant publication',
                            '<strong>Sanitisation</strong> : Nettoyer les entrées utilisateur',
                            '<strong>Encodage</strong> : UTF-8 obligatoire',
                            '<strong>Conformité</strong> : Respecter les standards du domaine'
                        ]
                    }
                ]
            },
            {
                title: '✏️ Exercices de bonnes pratiques',
                content: [
                    {
                        type: 'exercise',
                        id: 'best-practices-doc',
                        title: 'Document professionnel'
                    },
                    {
                        type: 'exercise',
                        id: 'optimized-structure',
                        title: 'Structure optimisée'
                    }
                ]
            }
        ],
        exercises: [
            {
                id: 'best-practices-doc',
                title: 'Document professionnel',
                instruction: 'Créez un document MML professionnel respectant toutes les bonnes pratiques : conventions, métadonnées, structure.',
                hint: 'Utilisez les conventions de nommage, incluez toutes les métadonnées essentielles, structurez logiquement.',
                solution: 'T:Guide des bonnes pratiques MML\nM:Auteur|Équipe Documentation MML\nM:Version|2.1.0\nM:Créé|2025-01-15\nM:Modifié|2025-01-15\nM:Licence|MIT\nM:Tags|Documentation,Bonnes pratiques,MML\n\nH:Introduction\nP:Ce guide présente les bonnes pratiques pour écrire du MML de qualité.\nQ:La qualité du code commence par les conventions.\n\nH:Conventions de nommage\nP:Respectez toujours les conventions établies.\nM:Priorité|Haute\nM:Complexité|Faible\n\nH:Structure optimale\nP:Une bonne structure facilite la maintenance.\nC:# Exemple de structure\nC:T:Titre descriptif\nC:M:Auteur|Nom complet\n\nH:Validation et tests\nP:Validez toujours vos documents.\nL:Outil de validation|https://validator.mml-lang.org\nL:Tests automatisés|https://github.com/mml-lang/mml/tree/main/tests',
                validation: 'complete_document',
                achievement: 'best-practices-master'
            },
            {
                id: 'optimized-structure',
                title: 'Structure optimisée',
                instruction: 'Créez un document optimisé pour la performance et la maintenabilité avec compression MMLC en tête.',
                hint: 'Structurez pour la lisibilité humaine et la compression automatique, incluez les métadonnées essentielles.',
                solution: 'T:Document optimisé pour performance\nM:Auteur|Équipe Performance\nM:Version|1.0.0\nM:Créé|2025-01-15T10:00:00Z\nM:Modifié|2025-01-15T10:00:00Z\nM:Compression|MMLC recommandée\nM:Taille cible|< 1KB compressé\n\nH:Contenu principal\nP:Contenu optimisé pour la lisibilité.\nP:Structure hiérarchique claire.\nM:Lignes|Compact\nM:Lecturabilité|Élevée\n\nH:Références\nL:Documentation|https://docs.mml-lang.org\nL:Validateur|https://validator.mml-lang.org\nIMG:Schéma optimisation|schema-optimisation.png\n\nH:Code exemple\nC:# Utilisation optimisée\nC:const parser = new MMLParser();\nC:const doc = parser.parse(content);\nC:console.log(doc.title);\n\nQ:L\'optimisation est un équilibre entre performance et lisibilité',
                validation: 'complete_document',
                achievement: 'optimization-expert'
            }
        ]
    },
    {
        id: 'advanced-topics',
        title: 'Sujets avancés',
        description: 'Explorez des concepts avancés : extensibilité, internationalisation, et intégration système.',
        objectives: [
            'Comprendre l\'extensibilité de MML',
            'Gérer l\'internationalisation',
            'Intégrer MML dans des systèmes complexes'
        ],
        quickReference: {
            'Extensions': ['Balises personnalisées', 'Métadonnées domaine', 'Intégration système'],
            'i18n': ['Métadonnées multilingues', 'Encodage UTF-8', 'Locale par document']
        },
        sections: [
            {
                title: '🔧 Extensibilité',
                content: [
                    {
                        type: 'text',
                        text: 'MML peut être étendu pour des domaines spécifiques :'
                    },
                    {
                        type: 'code',
                        code: 'T:Rapport médical étendu\nMED:Diagnostic|Appendicite\nMED:Gravité|Urgente\nMED:Traitement|Chirurgical\n\nT:Configuration système\nSYS:CPU|i7-11700K\nSYS:RAM|32GB\nSYS:Storage|1TB NVMe'
                    },
                    {
                        type: 'text',
                        text: 'Les extensions permettent d\'adapter MML à vos besoins métier.'
                    }
                ]
            },
            {
                title: '🌍 Internationalisation',
                content: [
                    {
                        type: 'text',
                        text: 'Support complet de l\'internationalisation :'
                    },
                    {
                        type: 'code',
                        code: 'T:国际报告\nM:Language|zh-CN\nM:Author|李小明\nM:Created|2025-01-15\nH:介绍\nP:这是国际化的MML文档。\nQ:国际化让MML无国界'
                    }
                ]
            },
            {
                title: '🤝 Intégration système',
                content: [
                    {
                        type: 'text',
                        text: 'MML s\'intègre facilement dans les architectures modernes :'
                    },
                    {
                        type: 'list',
                        items: [
                            '<strong>APIs REST</strong> : Conversion JSON automatique',
                            '<strong>Bases de données</strong> : Stockage structuré',
                            '<strong>Files d\'attente</strong> : Transmission asynchrone',
                            '<strong>Systèmes IoT</strong> : Communication capteurs',
                            '<strong>Blockchain</strong> : Archivage immuable'
                        ]
                    }
                ]
            },
            {
                title: '📊 Analytics et métriques',
                content: [
                    {
                        type: 'text',
                        text: 'MML facilite l\'analyse et les métriques :'
                    },
                    {
                        type: 'code',
                        code: 'T:Rapport d\'analyse MML\nMETRIC:Documents|15420\nMETRIC:TailleMoyenne|2.3KB\nMETRIC:TempsParsingMoyen|1.2ms\nMETRIC:TauxCompression|45%\n\nANALYTICS:UsageParDomaine\nM:Medical|35%\nM:Technical|28%\nM:Emergency|22%\nM:IoT|15%'
                    }
                ]
            },
            {
                title: '🔮 Futur de MML',
                content: [
                    {
                        type: 'text',
                        text: 'Évolutions à venir :'
                    },
                    {
                        type: 'list',
                        items: [
                            '<strong>MML 2.0</strong> : Syntaxe étendue, types de données',
                            '<strong>IA intégrée</strong> : Génération automatique de contenu',
                            '<strong>Web3</strong> : Intégration blockchain native',
                            '<strong>Edge computing</strong> : Optimisations pour le calcul décentralisé'
                        ]
                    }
                ]
            },
            {
                title: '✏️ Exercices avancés',
                content: [
                    {
                        type: 'exercise',
                        id: 'extended-document',
                        title: 'Document étendu'
                    },
                    {
                        type: 'exercise',
                        id: 'international-doc',
                        title: 'Document international'
                    }
                ]
            }
        ],
        exercises: [
            {
                id: 'extended-document',
                title: 'Document avec extensions',
                instruction: 'Créez un document utilisant des extensions de balises personnalisées pour un domaine spécifique.',
                hint: 'Utilisez des préfixes comme MED:, TECH:, SYS: pour étendre MML selon vos besoins.',
                solution: 'T:Rapport système étendu\nM:Auteur|Admin Système\nM:Version|1.0\nM:Domaine|Infrastructure\n\nSYS:OS|Ubuntu 22.04 LTS\nSYS:Kernel|5.15.0-67-generic\nSYS:Uptime|15 days\nSYS:Load|1.2 0.8 0.6\n\nTECH:CPU|Intel Xeon E5-2680\nTECH:Cores|16\nTECH:Frequency|2.7GHz\nTECH:Cache|20MB\n\nNET:Interface|eth0\nNET:IP|192.168.1.100\nNET:Gateway|192.168.1.1\nNET:DNS|8.8.8.8\n\nSEC:Firewall|UFW\nSEC:SSH|Activé\nSEC:Fail2Ban|Activé\nSEC:Updates|Automatiques\n\nH:Analyse de performance\nP:Système en bon état général.\nMETRIC:CPU_Usage|45%\nMETRIC:Memory_Usage|67%\nMETRIC:Disk_Usage|23%\nQ:Maintenance préventive recommandée',
                validation: 'complete_document',
                achievement: 'extension-pioneer'
            },
            {
                id: 'international-doc',
                title: 'Document multilingue',
                instruction: 'Créez un document MML avec contenu international et métadonnées multilingues.',
                hint: 'Utilisez UTF-8, incluez des métadonnées de langue, et mélangez plusieurs langues.',
                solution: 'T:International Report / Rapport International / 国际报告\nM:Language|en-US\nM:Translations|fr,de,zh\nM:Author|International Team\nM:Created|2025-01-15\nM:Target|Global audience\n\nH:English Section\nP:This document demonstrates MML\'s internationalization capabilities.\nQ:One language is never enough for global communication.\n\nH:Section Française\nP:Ce document démontre les capacités d\'internationalisation de MML.\nQ:Une seule langue ne suffit jamais pour la communication mondiale.\n\nH:Deutsche Sektion\nP:Dieses Dokument zeigt die Internationalisierungsfähigkeiten von MML.\nQ:Eine Sprache reicht nie für die globale Kommunikation.\n\nH:中文部分\nP:本文档展示了MML的国际化能力。\nQ:一种语言永远不足以进行全球通信。\n\nH:Data & Metrics\nMETRIC:Languages_Supported|50+\nMETRIC:Countries_Reached|195\nMETRIC:Documents_Translated|10000+\n\nH:Technical Implementation\nC:# Encoding always UTF-8\nC:const content = fs.readFileSync(\'doc.mml\', \'utf8\');\nC:# Parser handles all Unicode characters\nC:const doc = parser.parse(content);',
                validation: 'complete_document',
                achievement: 'global-communicator'
            }
        ]
    },
    {
        id: 'conclusion',
        title: 'Conclusion et perspectives',
        description: 'Félicitations ! Vous maîtrisez maintenant MML. Découvrez les prochaines étapes.',
        objectives: [
            'Consolider vos connaissances MML',
            'Explorer les ressources disponibles',
            'Contribuer à l\'écosystème MML'
        ],
        quickReference: {
            'Ressources': [
                '📖 Documentation complète',
                '🔍 Validateur en ligne',
                '💻 Implémentations multiples',
                '🧪 Tests et benchmarks'
            ],
            'Contribution': [
                '🐛 Signaler les bugs',
                '✨ Proposer des améliorations',
                '📝 Écrire de la documentation',
                '🔧 Développer des outils'
            ]
        },
        sections: [
            {
                title: '🎓 Ce que vous avez appris',
                content: [
                    {
                        type: 'text',
                        text: 'Au cours de ce tutoriel, vous avez maîtrisé :'
                    },
                    {
                        type: 'list',
                        items: [
                            '<strong>Syntaxe de base</strong> : Balises, structure, métadonnées',
                            '<strong>Fonctionnalités avancées</strong> : Code, images, citations',
                            '<strong>Cas d\'usage réels</strong> : Urgences, médical, technique',
                            '<strong>Validation et conversion</strong> : HTML, JSON, MMLC',
                            '<strong>Bonnes pratiques</strong> : Conventions, optimisation, sécurité',
                            '<strong>Sujets avancés</strong> : Extensions, internationalisation'
                        ]
                    }
                ]
            },
            {
                title: '🛠️ Outils et ressources',
                content: [
                    {
                        type: 'text',
                        text: 'L\'écosystème MML complet :'
                    },
                    {
                        type: 'list',
                        items: [
                            '<strong>📖 Documentation</strong> : https://docs.mml-lang.org',
                            '<strong>🔍 Validateur web</strong> : https://validator.mml-lang.org',
                            '<strong>💻 Code source</strong> : https://github.com/mml-lang/mml',
                            '<strong>📦 Packages</strong> : NPM, PyPI, Cargo',
                            '<strong>🧪 Tests</strong> : Suites complètes et benchmarks',
                            '<strong>🎓 Tutoriels</strong> : Contenu pédagogique varié'
                        ]
                    }
                ]
            },
            {
                title: '🚀 Prochaines étapes',
                content: [
                    {
                        type: 'text',
                        text: 'Continuez votre apprentissage :'
                    },
                    {
                        type: 'list',
                        items: [
                            '<strong>Pratique</strong> : Créez vos propres documents MML',
                            '<strong>Contribution</strong> : Participez au développement',
                            '<strong>Intégration</strong> : Utilisez MML dans vos projets',
                            '<strong>Formation</strong> : Devenez formateur MML',
                            '<strong>Innovation</strong> : Proposez de nouvelles fonctionnalités'
                        ]
                    }
                ]
            },
            {
                title: '🤝 Communauté et contribution',
                content: [
                    {
                        type: 'text',
                        text: 'Rejoignez la communauté MML :'
                    },
                    {
                        type: 'list',
                        items: [
                            '<strong>GitHub</strong> : Issues, pull requests, discussions',
                            '<strong>Forum</strong> : Échanges avec la communauté',
                            '<strong>Slack/Discord</strong> : Chat en temps réel',
                            '<strong>Meetups</strong> : Rencontres locales',
                            '<strong>Conférences</strong> : Présentations et ateliers'
                        ]
                    }
                ]
            },
            {
                title: '🎯 Certification et reconnaissance',
                content: [
                    {
                        type: 'text',
                        text: 'Obtenez la reconnaissance de vos compétences :'
                    },
                    {
                        type: 'list',
                        items: [
                            '<strong>MML Certified</strong> : Certification officielle',
                            '<strong>Expert badges</strong> : Récompenses communautaires',
                            '<strong>Portfolio</strong> : Projets et contributions',
                            '<strong>Références</strong> : Témoignages et études de cas'
                        ]
                    }
                ]
            },
            {
                title: '✏️ Dernier exercice',
                content: [
                    {
                        type: 'exercise',
                        id: 'final-project',
                        title: 'Projet final'
                    }
                ]
            }
        ],
        exercises: [
            {
                id: 'final-project',
                title: 'Projet final - Document complet',
                instruction: 'Créez un document MML complet intégrant tous les concepts appris : structure, métadonnées, contenu riche, extensions.',
                hint: 'Utilisez tout ce que vous avez appris : balises de base, avancées, extensions, internationalisation, bonnes pratiques.',
                solution: 'T:Portfolio MML - Projet Final Complet\nM:Auteur|Apprenti MML Expert\nM:Version|1.0.0-final\nM:Créé|2025-01-15T12:00:00Z\nM:Modifié|2025-01-15T12:00:00Z\nM:Licence|MIT\nM:Language|fr-FR\nM:Translations|en,de\nM:Tags|Tutoriel,Portfolio,Final,Complet\nM:Difficulty|Expert\nM:Completion|100%\n\nH:Introduction et Contexte\nP:Ce document constitue le projet final du tutoriel MML interactif.\nP:Il démontre la maîtrise complète du langage à travers divers cas d\'usage.\nQ:MML allie simplicité et puissance pour tous les environnements.\n\nH:Syntaxe et Structure\nP:Démonstration des balises fondamentales avec structure hiérarchique.\nM:Balisage|Complet\nM:Hiérarchie|Respectée\n\nH:Métadonnées Étendues\nM:Type|Portfolio\nM:Domaine|Éducation\nM:Niveau|Avancé\nM:Durée|30 minutes\nM:Prérequis|Tutoriel complet\n\nH:Contenu Riche\nP:Ce document inclut tous types de contenu supportés par MML.\nC:# Exemple de code intégré\nC:function helloMML() {\nC:    console.log(\'Hello, MML World!\');\nC:    return \'Succès\';\nC:}\n\nQ:La richesse du contenu est limitée uniquement par l\'imagination.\n\nH:Liens et Références\nL:Site officiel MML|https://mml-lang.org\nL:Documentation complète|https://docs.mml-lang.org\nL:Validateur en ligne|https://validator.mml-lang.org\nL:Dépôt GitHub|https://github.com/mml-lang/mml\nL:Tutoriel interactif|https://tutorial.mml-lang.org\n\nIMG:Architecture MML|architecture-mml.png\nIMG:Logo officiel|logo-mml.png\n\nH:Extensions et Domaines\nTECH:Framework|MML Parser v2.1\nTECH:Language|JavaScript/Node.js\nTECH:Performance|Excellente\nTECH:Compatibilité|Universelle\n\nMED:Type|Éducatif\nMED:Public|Cible\nMED:Objectif|Apprentissage\nMED:Évaluation|Réussie\n\nSYS:Environment|Tutorial\nSYS:Platform|Web\nSYS:Browser|Modern\nSYS:Features|Complete\n\nH:Cas d\'Usage Réels\nP:Application pratique dans différents domaines :\n\nH:Communication d\'Urgence\nEMERGENCY:Type|Exercice\nEMERGENCY:Priority|Formation\nEMERGENCY:Location|Tutoriel\nEMERGENCY:Status|Terminé\nP:Simulation de rapport d\'urgence pour formation.\nM:Victimes|0 (simulation)\nM:Moyens|Équipe pédagogique\n\nH:Documentation Technique\nP:Guide complet d\'utilisation du langage MML.\nCFG:Configuration\nM:Theme|Dark\nM:Language|fr\nM:AutoSave|Enabled\nM:Validation|Strict\n\nH:Internationalisation\nI18N:Primary|fr-FR\nI18N:Secondary|en-US,de-DE\nI18N:Encoding|UTF-8\nI18N:Support|Complet\nP:Support multilingue intégré.\n\nH:Analytics et Métriques\nMETRIC:Lessons_Completed|8/8\nMETRIC:Exercises_Success|100%\nMETRIC:Time_Spent|~45min\nMETRIC:Knowledge_Level|Expert\nMETRIC:Practical_Skills|Advanced\n\nANALYTICS:Progression\nM:Semaine1|Fondamentaux\nM:Semaine2|Pratique\nM:Semaine3|Maîtrise\nM:Semaine4|Expertise\n\nH:Conclusion et Perspectives\nP:Ce projet final démontre la polyvalence et la puissance de MML.\nP:Le langage répond aux besoins les plus exigeants tout en restant simple.\nQ:MML : Simple, Robuste, Universel.\n\nH:Remerciements\nP:Merci d\'avoir suivi ce tutoriel interactif.\nP:Continuez à explorer et contribuer à l\'écosystème MML !\n\nL:Communauté MML|https://github.com/mml-lang/mml\nL:Signaler un bug|https://github.com/mml-lang/mml/issues\nL:Proposer une amélioration|https://github.com/mml-lang/mml/discussions\n\nQ:L\'apprentissage est un voyage sans fin, mais MML facilite le parcours.',
                validation: 'complete_document',
                achievement: 'mml-master'
            }
        ]
    }
];

const ACHIEVEMENTS = [
    {
        id: 'first-steps',
        title: 'Premiers pas',
        icon: '📝',
        description: 'Créer votre premier document MML'
    },
    {
        id: 'syntax-master',
        title: 'Maître de la syntaxe',
        icon: '🏷️',
        description: 'Maîtriser les structures de base MML'
    },
    {
        id: 'metadata-expert',
        title: 'Expert métadonnées',
        icon: '🎓',
        description: 'Utiliser efficacement les métadonnées'
    },
    {
        id: 'mml-expert',
        title: 'Expert MML',
        icon: '💻',
        description: 'Maîtriser les fonctionnalités avancées'
    },
    {
        id: 'code-master',
        title: 'Maître du code',
        icon: '🚨',
        description: 'Intégrer du code dans les documents MML'
    },
    {
        id: 'emergency-expert',
        title: 'Expert urgence',
        icon: '🏥',
        description: 'Rédiger des rapports d\'urgence'
    },
    {
        id: 'medical-expert',
        title: 'Expert médical',
        icon: '✅',
        description: 'Créer des dossiers médicaux'
    },
    {
        id: 'validation-expert',
        title: 'Expert validation',
        icon: '🔄',
        description: 'Valider et déboguer des documents MML'
    },
    {
        id: 'conversion-master',
        title: 'Maître conversion',
        icon: '⭐',
        description: 'Maîtriser tous les formats de sortie'
    },
    {
        id: 'best-practices-master',
        title: 'Maître bonnes pratiques',
        icon: '⚡',
        description: 'Appliquer toutes les bonnes pratiques'
    },
    {
        id: 'optimization-expert',
        title: 'Expert optimisation',
        icon: '🚀',
        description: 'Optimiser les documents pour la performance'
    },
    {
        id: 'extension-pioneer',
        title: 'Pionnier extensions',
        icon: '🌍',
        description: 'Utiliser des extensions personnalisées'
    },
    {
        id: 'global-communicator',
        title: 'Communicateur global',
        icon: '👑',
        description: 'Créer du contenu multilingue'
    },
    {
        id: 'mml-master',
        title: 'Maître MML',
        icon: '🏆',
        description: 'Maîtrise complète du langage MML'
    }
];

// Export for use in tutorial.js
if (typeof window !== 'undefined') {
    window.LESSONS = LESSONS;
    window.ACHIEVEMENTS = ACHIEVEMENTS;
}
