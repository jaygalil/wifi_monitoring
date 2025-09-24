// Simple HTTP Server for testing the Site Tracker Dashboard
// Run with: node server.js

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 8080;

// MIME types for different file extensions
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.ico': 'image/x-icon',
    '.svg': 'image/svg+xml',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.md': 'text/markdown'
};

const server = http.createServer((req, res) => {
    // Parse URL
    const parsedUrl = url.parse(req.url, true);
    let pathname = parsedUrl.pathname;
    
    // Default to index.html for root path
    if (pathname === '/') {
        pathname = '/index.html';
    }
    
    // Get file path
    const filePath = path.join(__dirname, pathname);
    
    // Check if file exists
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            // File not found
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end(`
                <html>
                    <head><title>404 - File Not Found</title></head>
                    <body>
                        <h1>404 - File Not Found</h1>
                        <p>The requested file <code>${pathname}</code> was not found.</p>
                        <p><a href="/">← Go back to dashboard</a></p>
                    </body>
                </html>
            `);
            return;
        }
        
        // Get file extension and MIME type
        const ext = path.extname(filePath);
        const mimeType = mimeTypes[ext] || 'application/octet-stream';
        
        // Read and serve the file
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/html' });
                res.end(`
                    <html>
                        <head><title>500 - Server Error</title></head>
                        <body>
                            <h1>500 - Internal Server Error</h1>
                            <p>Error reading file: ${err.message}</p>
                        </body>
                    </html>
                `);
                return;
            }
            
            // Set appropriate headers
            res.writeHead(200, { 
                'Content-Type': mimeType,
                'Cache-Control': 'no-cache', // Disable caching for development
                'Access-Control-Allow-Origin': '*', // Enable CORS for external APIs
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            });
            res.end(data);
        });
    });
});

server.listen(PORT, () => {
    console.log('🚀 Site Tracker Dashboard Server Started!');
    console.log('');
    console.log(`📍 Server running at: http://localhost:${PORT}`);
    console.log(`📋 Dashboard URL: http://localhost:${PORT}/index.html`);
    console.log('');
    console.log('🔧 Features available:');
    console.log('   • Interactive mapping with Leaflet.js');
    console.log('   • Enhanced resizable chat panel');
    console.log('   • AI assistant integration');
    console.log('   • Google Sheets data loading');
    console.log('   • Secure configuration system');
    console.log('');
    console.log('💡 Testing tips:');
    console.log('   • Add your API keys to config.js for full functionality');
    console.log('   • Use sample data if you don\'t have Google Sheets setup');
    console.log('   • Test the resizable chat panel on the right side');
    console.log('');
    console.log('⏹️  Press Ctrl+C to stop the server');
    console.log('');
});

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use. Try a different port or stop the other server.`);
    } else {
        console.error('❌ Server error:', err);
    }
});

// Handle graceful shutdown
let shutdownInProgress = false;
process.on('SIGINT', () => {
    if (shutdownInProgress) return;
    shutdownInProgress = true;
    console.log('\n🛑 Shutting down server...');
    server.close(() => {
        console.log('✅ Server stopped gracefully');
        process.exit(0);
    });
});
