#!/usr/bin/env node

/**
 * MML Web Validator Server
 * Simple HTTP server to serve the MML web validator
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 8080;
const HOST = process.env.HOST || 'localhost';

// MIME types
const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

// Server
const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    let pathname = parsedUrl.pathname;

    // Default to index.html
    if (pathname === '/') {
        pathname = '/index.html';
    }

    // Security: prevent directory traversal
    if (pathname.includes('..') || pathname.includes('\\')) {
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        res.end('403 Forbidden');
        return;
    }

    // Build file path
    const filePath = path.join(__dirname, pathname);

    // Check if file exists
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            // File not found
            if (pathname === '/index.html') {
                // Serve a basic 404 for the main page
                res.writeHead(200, {
                    'Content-Type': 'text/html',
                    'Cache-Control': 'no-cache'
                });
                res.end(getNotFoundPage());
            } else {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('404 Not Found');
            }
            return;
        }

        // Get file stats
        fs.stat(filePath, (err, stats) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('500 Internal Server Error');
                return;
            }

            // Check if it's a directory
            if (stats.isDirectory()) {
                res.writeHead(403, { 'Content-Type': 'text/plain' });
                res.end('403 Forbidden');
                return;
            }

            // Get MIME type
            const ext = path.extname(filePath);
            const contentType = MIME_TYPES[ext] || 'application/octet-stream';

            // Set cache headers
            const headers = {
                'Content-Type': contentType,
                'Content-Length': stats.size
            };

            // Don't cache HTML and JS files during development
            if (ext === '.html' || ext === '.js') {
                headers['Cache-Control'] = 'no-cache';
            }

            // Stream file
            res.writeHead(200, headers);

            const stream = fs.createReadStream(filePath);
            stream.pipe(res);

            stream.on('error', (err) => {
                console.error('Stream error:', err);
                if (!res.headersSent) {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('500 Internal Server Error');
                }
            });
        });
    });
});

// Start server
server.listen(PORT, HOST, () => {
    console.log(`🚀 MML Web Validator Server running at:`);
    console.log(`   http://${HOST}:${PORT}`);
    console.log(`   Local: http://localhost:${PORT}`);
    console.log(`   Network: http://${getNetworkIP()}:${PORT}`);
    console.log('');
    console.log('📖 Usage:');
    console.log('   - Open the URL above in your web browser');
    console.log('   - Enter MML content in the editor');
    console.log('   - See real-time validation and conversions');
    console.log('');
    console.log('🛑 To stop: Ctrl+C');
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down MML Web Validator Server...');
    server.close(() => {
        console.log('✅ Server stopped');
        process.exit(0);
    });
});

process.on('SIGTERM', () => {
    console.log('\n🛑 Received SIGTERM, shutting down gracefully...');
    server.close(() => {
        console.log('✅ Server stopped');
        process.exit(0);
    });
});

// Helper functions
function getNetworkIP() {
    const { networkInterfaces } = require('os');
    const nets = networkInterfaces();

    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
            if (net.family === 'IPv4' && !net.internal) {
                return net.address;
            }
        }
    }

    return '0.0.0.0';
}

function getNotFoundPage() {
    return `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MML Validator - Fichier non trouvé</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 50px auto;
            padding: 20px;
            text-align: center;
        }
        .error {
            color: #e74c3c;
            font-size: 5em;
            margin-bottom: 20px;
        }
        .message {
            font-size: 1.2em;
            color: #666;
            margin-bottom: 30px;
        }
        .button {
            display: inline-block;
            padding: 12px 24px;
            background: #3498db;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            transition: background 0.3s ease;
        }
        .button:hover {
            background: #2980b9;
        }
    </style>
</head>
<body>
    <div class="error">📄</div>
    <h1>MML Web Validator</h1>
    <p class="message">
        Le validateur web MML n'est pas encore configuré.<br>
        Veuillez suivre les instructions d'installation dans le README.
    </p>
    <a href="https://github.com/mml-lang/mml" class="button" target="_blank">
        📖 Documentation
    </a>
</body>
</html>`;
}

// Error handling
server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} déjà utilisé. Essayez un port différent :`);
        console.error(`   node server.js --port ${PORT + 1}`);
    } else {
        console.error('❌ Erreur serveur:', err);
    }
    process.exit(1);
});

console.log('📦 Loading MML Web Validator...');
