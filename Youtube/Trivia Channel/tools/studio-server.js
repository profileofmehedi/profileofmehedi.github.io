const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { recordHtmlToMP4, exportsDir, projectDir } = require('./exporter-core');

const PORT = 4567;

let exportState = {
    isExporting: false,
    step: 'idle',
    message: 'Ready',
    pct: 0,
    filePath: null
};

// Helper: List all quiz HTML files in project
function getQuizFiles() {
    return fs.readdirSync(projectDir)
        .filter(f => f.endsWith('.html') && !f.includes('index.html') && !f.startsWith('.'))
        .sort((a, b) => {
            if (a === 'Know_USA.html') return -1;
            if (b === 'Know_USA.html') return 1;
            return a.localeCompare(b);
        });
}

// HTTP Server
const server = http.createServer(async (req, res) => {
    const parsedUrl = new URL(req.url, `http://127.0.0.1:${PORT}`);
    const pathname = parsedUrl.pathname;

    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // 1. Studio Dashboard UI
    if (pathname === '/' || pathname === '/index.html') {
        const uiPath = path.join(__dirname, 'studio-ui.html');
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(fs.readFileSync(uiPath));
        return;
    }

    // 2. API: List Quizzes
    if (pathname === '/api/list-quizzes' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(getQuizFiles()));
        return;
    }

    // 3. API: Status
    if (pathname === '/api/status' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(exportState));
        return;
    }

    // 4. API: Open Exports Folder
    if (pathname === '/api/open-folder' && req.method === 'POST') {
        exec(`explorer.exe "${exportsDir}"`);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true }));
        return;
    }

    // 5. API: Open Exported File
    if (pathname === '/api/open-file' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                const data = JSON.parse(body || '{}');
                if (data.filePath && fs.existsSync(data.filePath)) {
                    exec(`start "" "${data.filePath}"`);
                }
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true }));
            } catch(e) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: e.message }));
            }
        });
        return;
    }

    // 6. API: Start Export
    if (pathname === '/api/start-export' && req.method === 'POST') {
        if (exportState.isExporting) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: 'Another export is already in progress.' }));
            return;
        }

        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
            try {
                const params = JSON.parse(body);
                const { filePath, format, duration } = params;

                exportState = {
                    isExporting: true,
                    step: 'starting',
                    message: `Preparing export for ${path.basename(filePath)}...`,
                    pct: 5,
                    filePath: null
                };

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true }));

                // Run export asynchronously in background
                runExportJob(filePath, format, duration);
            } catch(e) {
                exportState.isExporting = false;
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: e.message }));
            }
        });
        return;
    }

    // 7. Static File Serving (for recording target)
    let targetFilePath = '';
    const customQuery = parsedUrl.searchParams.get('customPath');
    if (customQuery) {
        targetFilePath = path.resolve(customQuery);
    } else {
        targetFilePath = path.join(projectDir, decodeURIComponent(pathname));
    }

    if (fs.existsSync(targetFilePath) && !fs.statSync(targetFilePath).isDirectory()) {
        const ext = path.extname(targetFilePath).toLowerCase();
        const mimeTypes = {
            '.html': 'text/html',
            '.js': 'application/javascript',
            '.css': 'text/css',
            '.json': 'application/json',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.svg': 'image/svg+xml',
            '.mp3': 'audio/mpeg',
            '.wav': 'audio/wav'
        };

        let fileBuffer = fs.readFileSync(targetFilePath);

        // Inject STUDIO_CAPTURE_TARGET title for Chrome tab capture filter
        if (ext === '.html') {
            let html = fileBuffer.toString('utf8');
            html = html.replace(/<title>[\s\S]*?<\/title>/i, '<title>STUDIO_CAPTURE_TARGET</title>');
            if (!html.includes('STUDIO_CAPTURE_TARGET')) {
                html = html.replace('<head>', '<head><title>STUDIO_CAPTURE_TARGET</title>');
            }
            fileBuffer = Buffer.from(html, 'utf8');
        }

        res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
        res.end(fileBuffer);
        return;
    }

    res.writeHead(404);
    res.end('Not Found: ' + pathname);
});

// Run export pipeline (supports 'both' format)
async function runExportJob(filePath, format, duration) {
    try {
        const baseName = path.basename(filePath, path.extname(filePath));
        let serveUrl = '';

        if (fs.existsSync(path.join(projectDir, filePath))) {
            serveUrl = `http://127.0.0.1:${PORT}/${encodeURIComponent(filePath)}`;
        } else if (fs.existsSync(filePath)) {
            serveUrl = `http://127.0.0.1:${PORT}/?customPath=${encodeURIComponent(path.resolve(filePath))}`;
        } else {
            throw new Error(`File not found: ${filePath}`);
        }

        const onProgress = (step, message, pct) => {
            exportState.step = step;
            exportState.message = message;
            exportState.pct = pct;
        };

        if (format === 'both') {
            // 1. Export 16:9 Landscape first
            onProgress('recording', `Exporting 16:9 YouTube Video for ${baseName}...`, 10);
            const res16x9 = await recordHtmlToMP4({
                targetUrl: serveUrl,
                outputBaseName: baseName,
                format: '16:9',
                duration: duration,
                onProgress: (step, msg, pct) => onProgress(step, `[16:9] ${msg}`, Math.floor(pct / 2))
            });

            // 2. Export 9:16 Shorts second
            onProgress('recording', `Exporting 9:16 Shorts for ${baseName}...`, 55);
            const shortsUrl = serveUrl.includes('?') ? `${serveUrl}&mode=shorts` : `${serveUrl}?mode=shorts`;
            const res9x16 = await recordHtmlToMP4({
                targetUrl: shortsUrl,
                outputBaseName: baseName,
                format: '9:16',
                duration: duration,
                onProgress: (step, msg, pct) => onProgress(step, `[Shorts] ${msg}`, 50 + Math.floor(pct / 2))
            });

            exportState = {
                isExporting: false,
                step: 'done',
                message: `Dual export completed! Created 16:9 & 9:16 videos.`,
                pct: 100,
                filePath: res9x16.filePath
            };
        } else {
            const isShorts = format === '9:16' || format === 'shorts';
            const finalUrl = isShorts ? (serveUrl.includes('?') ? `${serveUrl}&mode=shorts` : `${serveUrl}?mode=shorts`) : serveUrl;

            const res = await recordHtmlToMP4({
                targetUrl: finalUrl,
                outputBaseName: baseName,
                format: isShorts ? '9:16' : '16:9',
                duration: duration,
                onProgress
            });

            exportState = {
                isExporting: false,
                step: 'done',
                message: `Export completed successfully!`,
                pct: 100,
                filePath: res.filePath
            };
        }
    } catch(err) {
        exportState = {
            isExporting: false,
            step: 'error',
            message: `Export failed: ${err.message}`,
            pct: 0,
            filePath: null
        };
    }
}

// Start Server
server.listen(PORT, '127.0.0.1', () => {
    console.log(`\n======================================================`);
    console.log(`🎬 TRIVIA STUDIO HD EXPORTER SERVER RUNNING`);
    console.log(`🌐 Dashboard: http://127.0.0.1:${PORT}`);
    console.log(`📁 Destination: ${exportsDir}`);
    console.log(`======================================================\n`);

    if (process.argv.includes('--open')) {
        const chromeExe = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
        exec(`"${chromeExe}" "http://127.0.0.1:${PORT}"`);
    }
});
