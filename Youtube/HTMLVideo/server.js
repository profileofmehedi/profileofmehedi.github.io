const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ttf': 'font/ttf',
    '.woff2': 'font/woff2'
};

const server = http.createServer((req, res) => {
    let filePath = path.join(__dirname, req.url === '/' ? 'launch.html' : req.url.split('?')[0]);
    
    // Security check to avoid path traversal
    if (!filePath.startsWith(__dirname)) {
        res.writeHead(403);
        res.end('Access Denied');
        return;
    }

    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found');
            return;
        }

        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';

        res.writeHead(200, { 'Content-Type': contentType });
        fs.createReadStream(filePath).pipe(res);
    });
});

server.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`  🚀 AI SECURITY YOUTUBE STUDIO SERVER RUNNING!`);
    console.log(`  🌐 Open in browser: http://localhost:${PORT}`);
    console.log(`  📺 Presenter View:  http://localhost:${PORT}/index.html`);
    console.log(`  🎙️ Teleprompter:    http://localhost:${PORT}/teleprompter.html`);
    console.log(`======================================================\n`);
});
