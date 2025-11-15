/**
 * MML Parser Example - C++ Implementation
 * Demonstrates usage of the MML parser for embedded systems
 */

#include "mml_parser.h"
#include <iostream>
#include <cstring>

int main() {
    std::cout << "MML Parser - C++ Embedded Example" << std::endl;
    std::cout << "==================================" << std::endl;

    // Sample MML document
    const char* mml_document =
        "T:Rapport d'urgence\n"
        "M:Auteur|Équipe secours\n"
        "M:Priorité|CRITIQUE\n"
        "M:Date|2025-11-15\n"
        "\n"
        "H:Situation actuelle\n"
        "P:Incendie en cours dans secteur nord\n"
        "M:Surface|500 hectares\n"
        "M:Vent|25 km/h NNE\n"
        "P:Risque de propagation rapide\n"
        "\n"
        "H:Moyens engagés\n"
        "P:3 Canadairs, 2 hélicoptères\n"
        "P:45 sapeurs-pompiers au sol\n"
        "M:Effectifs|45\n"
        "M:Aériens|5 appareils\n"
        "\n"
        "H:Actions requises\n"
        "P:Évacuation zone rouge immédiate\n"
        "P:Renforts aériens supplémentaires\n"
        "L:Carte secteur|cartes/incendie-secteur7.png\n"
        "IMG:Photo incendie|photos/incendie-1500h.jpg\n"
        "Q:La rapidité sauve des vies\n";

    // Initialize document
    mml_document_t document;
    mml_init_document(&document);

    std::cout << "Document MML d'exemple :" << std::endl;
    std::cout << mml_document << std::endl;
    std::cout << "---" << std::endl;

    // Parse document
    std::cout << "Parsing du document..." << std::endl;
    if (mml_parse(mml_document, &document)) {
        std::cout << "✅ Parsing réussi !" << std::endl;
    } else {
        std::cout << "❌ Erreur de parsing" << std::endl;
        return 1;
    }

    // Validate document
    if (mml_validate_document(&document)) {
        std::cout << "✅ Document valide" << std::endl;
    } else {
        std::cout << "❌ Document invalide" << std::endl;
    }

    // Display statistics
    std::cout << "\n📊 Statistiques :" << std::endl;
    char* stats = mml_get_statistics(&document);
    std::cout << stats << std::endl;

    // Convert to JSON
    std::cout << "\n🔄 Conversion JSON :" << std::endl;
    char json_buffer[2048];
    if (mml_to_json(&document, json_buffer, sizeof(json_buffer))) {
        std::cout << json_buffer << std::endl;
    } else {
        std::cout << "❌ Erreur conversion JSON" << std::endl;
    }

    // Convert to HTML
    std::cout << "\n🔄 Conversion HTML :" << std::endl;
    char html_buffer[4096];
    if (mml_to_html(&document, html_buffer, sizeof(html_buffer))) {
        std::cout << html_buffer << std::endl;
    } else {
        std::cout << "❌ Erreur conversion HTML" << std::endl;
    }

    // Compress to MMLC
    std::cout << "\n🗜️ Compression MMLC :" << std::endl;
    char mmlc_buffer[2048];
    if (mml_compress(&document, mmlc_buffer, sizeof(mmlc_buffer))) {
        std::cout << mmlc_buffer << std::endl;
    } else {
        std::cout << "❌ Erreur compression" << std::endl;
    }

    // Demonstrate memory usage
    std::cout << "\n💾 Utilisation mémoire :" << std::endl;
    std::cout << "Taille structure mml_document_t: " << sizeof(mml_document_t) << " octets" << std::endl;
    std::cout << "Taille structure mml_section_t: " << sizeof(mml_section_t) << " octets" << std::endl;
    std::cout << "Mémoire utilisée: ~" << (sizeof(mml_document_t) + document.section_count * sizeof(mml_section_t)) << " octets" << std::endl;

    std::cout << "\n✨ Exemple terminé avec succès !" << std::endl;

    return 0;
}
