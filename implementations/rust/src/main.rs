//! MML CLI - Command Line Interface for MML processing

use clap::{Parser, Subcommand};
use mml_parser::{MMLParser, OutputFormat, parse_mml};
use std::fs;
use std::io::{self, Read};
use std::path::Path;
use std::process;

#[derive(Parser)]
#[command(name = "mml-cli")]
#[command(about = "MML (Minimal Markup Language) command line tool")]
#[command(version = env!("CARGO_PKG_VERSION"))]
struct Cli {
    #[command(subcommand)]
    command: Commands,
}

#[derive(Subcommand)]
enum Commands {
    /// Validate MML syntax
    Validate {
        /// Input file (use - for stdin)
        #[arg(short, long)]
        input: Option<String>,

        /// Strict validation (fail on any error)
        #[arg(long)]
        strict: bool,
    },

    /// Convert MML to other formats
    Convert {
        /// Input file (use - for stdin)
        #[arg(short, long)]
        input: Option<String>,

        /// Output file (use - for stdout)
        #[arg(short, long)]
        output: Option<String>,

        /// Output format
        #[arg(short, long, value_enum, default_value = "html")]
        format: OutputFormat,
    },

    /// Compress MML to MMLC format
    Compress {
        /// Input file (use - for stdin)
        #[arg(short, long)]
        input: Option<String>,

        /// Output file (use - for stdout)
        #[arg(short, long)]
        output: Option<String>,

        /// Compression level
        #[arg(short, long, value_enum, default_value = "basic")]
        level: CompressionLevel,
    },

    /// Analyze MML document
    Stats {
        /// Input file (use - for stdin)
        #[arg(short, long)]
        input: Option<String>,

        /// Include detailed analysis
        #[arg(long)]
        detailed: bool,
    },
}

#[derive(clap::ValueEnum, Clone, Debug)]
enum CompressionLevel {
    None,
    Basic,
    Aggressive,
}

impl From<CompressionLevel> for mml_parser::CompressionLevel {
    fn from(level: CompressionLevel) -> Self {
        match level {
            CompressionLevel::None => mml_parser::CompressionLevel::None,
            CompressionLevel::Basic => mml_parser::CompressionLevel::Basic,
            CompressionLevel::Aggressive => mml_parser::CompressionLevel::Aggressive,
        }
    }
}

#[derive(clap::ValueEnum, Clone, Debug)]
enum OutputFormat {
    Html,
    Json,
    Text,
}

impl From<OutputFormat> for mml_parser::OutputFormat {
    fn from(format: OutputFormat) -> Self {
        match format {
            OutputFormat::Html => mml_parser::OutputFormat::HTML,
            OutputFormat::Json => mml_parser::OutputFormat::JSON,
            OutputFormat::Text => mml_parser::OutputFormat::MML,
        }
    }
}

fn main() {
    let cli = Cli::parse();

    match &cli.command {
        Commands::Validate { input, strict } => {
            if let Err(e) = validate_command(input.as_deref(), *strict) {
                eprintln!("Erreur: {}", e);
                process::exit(1);
            }
        }
        Commands::Convert { input, output, format } => {
            if let Err(e) = convert_command(input.as_deref(), output.as_deref(), (*format).into()) {
                eprintln!("Erreur: {}", e);
                process::exit(1);
            }
        }
        Commands::Compress { input, output, level } => {
            if let Err(e) = compress_command(input.as_deref(), output.as_deref(), (*level).into()) {
                eprintln!("Erreur: {}", e);
                process::exit(1);
            }
        }
        Commands::Stats { input, detailed } => {
            if let Err(e) = stats_command(input.as_deref(), *detailed) {
                eprintln!("Erreur: {}", e);
                process::exit(1);
            }
        }
    }
}

fn read_input(input: Option<&str>) -> Result<String, Box<dyn std::error::Error>> {
    match input {
        Some("-") | None => {
            let mut buffer = String::new();
            io::stdin().read_to_string(&mut buffer)?;
            Ok(buffer)
        }
        Some(path) => {
            fs::read_to_string(path).map_err(Into::into)
        }
    }
}

fn write_output(output: Option<&str>, content: &str) -> Result<(), Box<dyn std::error::Error>> {
    match output {
        Some("-") | None => {
            println!("{}", content);
        }
        Some(path) => {
            fs::write(path, content)?;
            eprintln!("Fichier écrit: {}", path);
        }
    }
    Ok(())
}

fn validate_command(input: Option<&str>, strict: bool) -> Result<(), Box<dyn std::error::Error>> {
    let content = read_input(input)?;
    let parser = MMLParser::new();

    match parser.validate(&content) {
        Ok(_) => {
            eprintln!("✅ Document MML valide");
            Ok(())
        }
        Err(e) => {
            if strict {
                Err(e.into())
            } else {
                eprintln!("⚠️  Avertissement: {}", e);
                Ok(())
            }
        }
    }
}

fn convert_command(
    input: Option<&str>,
    output: Option<&str>,
    format: mml_parser::OutputFormat,
) -> Result<(), Box<dyn std::error::Error>> {
    let content = read_input(input)?;
    let parser = MMLParser::new();
    let document = parser.parse(&content)?;

    let result = match format {
        mml_parser::OutputFormat::HTML => to_html(&document),
        mml_parser::OutputFormat::JSON => serde_json::to_string_pretty(&document)?,
        mml_parser::OutputFormat::MML => to_mml(&document),
        _ => return Err("Format non supporté".into()),
    };

    write_output(output, &result)
}

fn compress_command(
    input: Option<&str>,
    output: Option<&str>,
    level: mml_parser::CompressionLevel,
) -> Result<(), Box<dyn std::error::Error>> {
    let content = read_input(input)?;
    let original_size = content.len();

    // For now, basic compression - expand with full algorithm later
    let compressed = compress_mml(&content, level);
    let compressed_size = compressed.len();

    write_output(output, &compressed)?;

    let ratio = if original_size > 0 {
        (original_size - compressed_size) as f64 / original_size as f64 * 100.0
    } else {
        0.0
    };

    eprintln!("Compression: {} → {} octets ({:.1}% de réduction)",
              original_size, compressed_size, ratio);

    Ok(())
}

fn stats_command(input: Option<&str>, detailed: bool) -> Result<(), Box<dyn std::error::Error>> {
    let content = read_input(input)?;
    let parser = MMLParser::new();
    let document = parser.parse(&content)?;

    println!("📊 Statistiques du document MML:");
    println!("Titre: {}", document.title.as_ref().map(|_| "✅").unwrap_or("❌"));
    println!("Sections: {}", document.sections.len());
    println!("Paragraphes: {}", count_paragraphs(&document));
    println!("Liens: {}", count_links(&document));
    println!("Images: {}", count_images(&document));
    println!("Métadonnées: {}", document.metadata.len());
    println!("Taille: {} octets", content.len());
    println!("Lignes: {}", document.stats.total_lines);

    if let Some(parse_time) = document.stats.parse_time_ms {
        println!("Temps de parsing: {}ms", parse_time);
    }

    if detailed {
        println!("\n📋 Détails:");
        for (i, section) in document.sections.iter().enumerate() {
            println!("  Section {}: '{}' ({} liens, {} images)",
                    i + 1, section.title,
                    section.links.len(), section.images.len());
        }

        if !document.metadata.is_empty() {
            println!("\n🔖 Métadonnées globales:");
            for (key, value) in &document.metadata {
                println!("  {}: {}", key, value);
            }
        }
    }

    Ok(())
}

// Helper functions

fn count_paragraphs(doc: &mml_parser::MMLDocument) -> usize {
    doc.sections.iter()
        .filter(|s| s.content.is_some())
        .count()
}

fn count_links(doc: &mml_parser::MMLDocument) -> usize {
    doc.links.len() +
    doc.sections.iter().map(|s| s.links.len()).sum::<usize>()
}

fn count_images(doc: &mml_parser::MMLDocument) -> usize {
    doc.sections.iter().map(|s| s.images.len()).sum::<usize>()
}

fn to_html(doc: &mml_parser::MMLDocument) -> String {
    let mut html = String::from("<!DOCTYPE html>\n<html>\n<head>\n");
    html.push_str("<meta charset=\"utf-8\">\n");

    if let Some(title) = &doc.title {
        html.push_str(&format!("<title>{}</title>\n", title));
    }

    html.push_str("</head>\n<body>\n");

    if let Some(title) = &doc.title {
        html.push_str(&format!("<h1>{}</h1>\n", title));
    }

    for section in &doc.sections {
        html.push_str(&format!("<h2>{}</h2>\n", section.title));

        if let Some(content) = &section.content {
            html.push_str(&format!("<p>{}</p>\n", content));
        }

        for link in &section.links {
            html.push_str(&format!("<p><a href=\"{}\">{}</a></p>\n",
                                  link.url, link.text));
        }

        for image in &section.images {
            html.push_str(&format!(
                "<figure>\n<img src=\"{}\" alt=\"{}\">\n<figcaption>{}</figcaption>\n</figure>\n",
                image.url, image.description, image.description
            ));
        }
    }

    html.push_str("</body>\n</html>");
    html
}

fn to_mml(doc: &mml_parser::MMLDocument) -> String {
    let mut mml = String::new();

    if let Some(title) = &doc.title {
        mml.push_str(&format!("T:{}\n", title));
    }

    for (key, value) in &doc.metadata {
        mml.push_str(&format!("M:{}|{}\n", key, value));
    }

    for section in &doc.sections {
        mml.push_str(&format!("H:{}\n", section.title));

        for (key, value) in &section.metadata {
            mml.push_str(&format!("M:{}|{}\n", key, value));
        }

        if let Some(content) = &section.content {
            mml.push_str(&format!("P:{}\n", content));
        }

        for link in &section.links {
            mml.push_str(&format!("L:{}|{}\n", link.text, link.url));
        }

        for image in &section.images {
            mml.push_str(&format!("IMG:{}|{}\n", image.description, image.url));
        }
    }

    mml
}

fn compress_mml(content: &str, level: mml_parser::CompressionLevel) -> String {
    // Basic compression - replace common words
    let mut compressed = content.to_string();

    if level != mml_parser::CompressionLevel::None {
        let replacements = [
            ("Rapport", "R"),
            ("Urgent", "U"),
            ("Critique", "C"),
            ("Patient", "P1"),
            ("Victime", "V"),
            ("Secteur", "S"),
            ("Évacuation", "E"),
            ("Médical", "M"),
            ("Stable", "S1"),
            ("Alerte", "A"),
        ];

        for (word, code) in &replacements {
            compressed = compressed.replace(word, code);
        }
    }

    compressed
}
