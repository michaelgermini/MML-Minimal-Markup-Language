//! Exemple d'utilisation du parser MML Rust

use mml_parser::{MMLParser, MMLDocument};

fn main() -> Result<(), Box<dyn std::error::Error>> {
    println!("🚀 Exemple d'utilisation du parser MML Rust");
    println!("==========================================\n");

    // Document MML d'exemple
    let mml_document = r#"
T:Rapport d'urgence - Incendie
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
P:Renforts aériens supplémentaires
L:Carte secteur|cartes/incendie-secteur7.png
IMG:Photo incendie|photos/incendie-1500h.jpg

Q:La rapidité sauve des vies - priorité absolue
"#;

    println!("📄 Document MML d'exemple :");
    println!("{}", mml_document);
    println!("---\n");

    // Initialisation du parser
    let parser = MMLParser::new();

    // Parsing du document
    println!("🔍 Parsing du document...");
    match parser.parse(mml_document) {
        Ok(document) => {
            println!("✅ Parsing réussi !\n");

            // Affichage des informations principales
            display_document_info(&document);

            // Conversion en différents formats
            demonstrate_conversions(&document)?;

            // Affichage des statistiques
            display_statistics(&document);
        }
        Err(error) => {
            eprintln!("❌ Erreur de parsing: {}", error);
            eprintln!("💡 Suggestion: {}", error.suggestion());
            std::process::exit(1);
        }
    }

    println!("\n✨ Exemple terminé avec succès !");
    Ok(())
}

fn display_document_info(doc: &MMLDocument) {
    println!("📊 Informations du document :");
    println!("  Titre: {}", doc.title.as_deref().unwrap_or("(aucun)"));
    println!("  Sections: {}", doc.sections.len());
    println!("  Métadonnées globales: {}", doc.metadata.len());
    println!("  Liens globaux: {}", doc.links.len());

    // Affichage des métadonnées
    if !doc.metadata.is_empty() {
        println!("  🔖 Métadonnées:");
        for (key, value) in &doc.metadata {
            println!("    {}: {}", key, value);
        }
    }

    // Affichage des sections
    println!("  📑 Sections:");
    for (i, section) in doc.sections.iter().enumerate() {
        println!("    {}. '{}' ({} liens, {} images, {} métadonnées)",
                i + 1,
                section.title,
                section.links.len(),
                section.images.len(),
                section.metadata.len());

        if let Some(content) = &section.content {
            let preview: String = content.chars().take(50).collect();
            println!("       \"{}\"{}", preview, if content.len() > 50 { "..." } else { "" });
        }
    }
    println!();
}

fn demonstrate_conversions(doc: &MMLDocument) -> Result<(), Box<dyn std::error::Error>> {
    println!("🔄 Démonstration des conversions :\n");

    // Conversion JSON
    println!("📋 Format JSON :");
    let json = serde_json::to_string_pretty(doc)?;
    println!("{}\n", json);

    // Conversion HTML (aperçu)
    println!("🌐 Format HTML (aperçu) :");
    let html = generate_html_preview(doc);
    println!("{}\n", html);

    // Conversion texte brut
    println!("📄 Format texte brut :");
    let text = generate_plain_text(doc);
    println!("{}\n", text);

    Ok(())
}

fn generate_html_preview(doc: &MMLDocument) -> String {
    let mut html = String::from("<!DOCTYPE html>\n<html>\n<head>\n<meta charset=\"utf-8\">");

    if let Some(title) = &doc.title {
        html.push_str(&format!("\n<title>{}</title>", title));
    }

    html.push_str("\n</head>\n<body>");

    if let Some(title) = &doc.title {
        html.push_str(&format!("\n<h1>{}</h1>", title));
    }

    for section in &doc.sections {
        html.push_str(&format!("\n<h2>{}</h2>", section.title));

        if let Some(content) = &section.content {
            html.push_str(&format!("\n<p>{}</p>", content));
        }

        for link in &section.links {
            html.push_str(&format!("\n<p><a href=\"{}\">{}</a></p>", link.url, link.text));
        }
    }

    html.push_str("\n</body>\n</html>");
    html
}

fn generate_plain_text(doc: &MMLDocument) -> String {
    let mut text = String::new();

    if let Some(title) = &doc.title {
        text.push_str(&format!("{}\n{}\n\n", title, "=".repeat(title.len())));
    }

    for section in &doc.sections {
        text.push_str(&format!("{}\n{}\n\n", section.title, "-".repeat(section.title.len())));

        if let Some(content) = &section.content {
            text.push_str(&format!("{}\n\n", content));
        }

        for link in &section.links {
            text.push_str(&format!("• {}: {}\n", link.text, link.url));
        }

        if !section.links.is_empty() {
            text.push('\n');
        }
    }

    text.trim().to_string()
}

fn display_statistics(doc: &MMLDocument) {
    println!("📈 Statistiques de parsing :");
    println!("  Lignes totales: {}", doc.stats.total_lines);
    println!("  Lignes parsées: {}", doc.stats.parsed_lines);
    println!("  Erreurs: {}", doc.stats.error_lines);

    if let Some(parse_time) = doc.stats.parse_time_ms {
        println!("  Temps de parsing: {} ms", parse_time);
    }

    // Calculs supplémentaires
    let total_metadata: usize = doc.metadata.len() +
        doc.sections.iter().map(|s| s.metadata.len()).sum::<usize>();

    let total_links: usize = doc.links.len() +
        doc.sections.iter().map(|s| s.links.len()).sum::<usize>();

    let total_images: usize = doc.sections.iter().map(|s| s.images.len()).sum::<usize>();

    println!("  Métadonnées totales: {}", total_metadata);
    println!("  Liens totaux: {}", total_links);
    println!("  Images totales: {}", total_images);
}

// Fonction utilitaire pour compter les mots (démonstration)
fn count_words(text: &str) -> usize {
    text.split_whitespace().count()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_example_execution() {
        // Test que l'exemple peut s'exécuter sans erreur
        let mml = r#"
T:Test Document
H:Section 1
P:Some content
M:Author|Test Author
"#;

        let parser = MMLParser::new();
        let result = parser.parse(mml);
        assert!(result.is_ok());

        let doc = result.unwrap();
        assert_eq!(doc.title, Some("Test Document".to_string()));
        assert_eq!(doc.sections.len(), 1);
        assert_eq!(doc.metadata.get("Author"), Some(&"Test Author".to_string()));
    }

    #[test]
    fn test_html_preview_generation() {
        let mut doc = MMLDocument::default();
        doc.title = Some("Test".to_string());
        doc.sections.push(mml_parser::MMLSection::new("Section".to_string()));

        let html = generate_html_preview(&doc);
        assert!(html.contains("<h1>Test</h1>"));
        assert!(html.contains("<h2>Section</h2>"));
    }
}
