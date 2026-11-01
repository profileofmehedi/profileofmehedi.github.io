const path = require('path');
const fs = require('fs');
const http = require('http');
const { recordHtmlToMP4, projectDir, exportsDir } = require('./exporter-core');

const args = process.argv.slice(2);
if (args.length === 0) {
    console.log(`\nUsage:`);
    console.log(`  node tools/export-cli.js <HTML_FILE> [16:9|9:16|both] [duration_seconds|auto]`);
    console.log(`\nExamples:`);
    console.log(`  node tools/export-cli.js Know_USA.html 16:9 auto`);
    console.log(`  node tools/export-cli.js 01_Guess_The_State_3_Clues.html shorts 30`);
    console.log(`  node tools/export-cli.js "C:\\MyFolder\\quiz.html" both\n`);
    process.exit(1);
}

const targetInput = args[0];
const targetFormat = (args[1] || '16:9').toLowerCase();
const targetDuration = args[2] ? (args[2] === 'auto' ? 'auto' : parseInt(args[2])) : 'auto';

let targetFilePath = '';
if (fs.existsSync(path.join(projectDir, targetInput))) {
    targetFilePath = path.join(projectDir, targetInput);
} else if (fs.existsSync(targetInput)) {
    targetFilePath = path.resolve(targetInput);
} else {
    console.error(`❌ File not found: ${targetInput}`);
    process.exit(1);
}

const baseName = path.basename(targetFilePath, path.extname(targetFilePath));
const PORT = 4599;

// Spin up a transient static server
const server = http.createServer((req, res) => {
    let fileToServe = targetFilePath;
    const ext = path.extname(fileToServe).toLowerCase();

    // Serve project assets (js, css, images)
    const reqPath = path.join(path.dirname(targetFilePath), decodeURIComponent(req.url.split('?')[0]));
    if (fs.existsSync(reqPath) && !fs.statSync(reqPath).isDirectory()) {
        fileToServe = reqPath;
    }

    if (!fs.existsSync(fileToServe)) {
        res.writeHead(404);
        res.end();
        return;
    }

    let buf = fs.readFileSync(fileToServe);
    if (ext === '.html') {
        let html = buf.toString('utf8');
        html = html.replace(/<title>[\s\S]*?<\/title>/i, '<title>STUDIO_CAPTURE_TARGET</title>');
        if (!html.includes('STUDIO_CAPTURE_TARGET')) {
            html = html.replace('<head>', '<head><title>STUDIO_CAPTURE_TARGET</title>');
        }
        buf = Buffer.from(html, 'utf8');
    }

    const mime = ext === '.html' ? 'text/html' : (ext === '.js' ? 'application/javascript' : (ext === '.css' ? 'text/css' : 'application/octet-stream'));
    res.writeHead(200, { 'Content-Type': mime, 'Access-Control-Allow-Origin': '*' });
    res.end(buf);
}).listen(PORT, '127.0.0.1');

(async () => {
    try {
        console.log(`\n======================================================`);
        console.log(`🎬 TRIVIA STUDIO CLI EXPORTER`);
        console.log(`📁 File: ${targetFilePath}`);
        console.log(`📐 Format: ${targetFormat}`);
        console.log(`⏱️ Duration: ${targetDuration}`);
        console.log(`======================================================\n`);

        const serveUrl = `http://127.0.0.1:${PORT}/${path.basename(targetFilePath)}`;

        if (targetFormat === 'both') {
            console.log(`\n👉 Step 1/2: Exporting YouTube Video (16:9)...`);
            await recordHtmlToMP4({
                targetUrl: serveUrl,
                outputBaseName: baseName,
                format: '16:9',
                duration: targetDuration,
                onProgress: (step, msg) => console.log(`[16:9] [${step.toUpperCase()}] ${msg}`)
            });

            console.log(`\n👉 Step 2/2: Exporting YouTube Shorts (9:16)...`);
            await recordHtmlToMP4({
                targetUrl: `${serveUrl}?mode=shorts`,
                outputBaseName: baseName,
                format: '9:16',
                duration: targetDuration,
                onProgress: (step, msg) => console.log(`[Shorts] [${step.toUpperCase()}] ${msg}`)
            });
        } else {
            const isShorts = targetFormat === '9:16' || targetFormat === 'shorts';
            await recordHtmlToMP4({
                targetUrl: isShorts ? `${serveUrl}?mode=shorts` : serveUrl,
                outputBaseName: baseName,
                format: isShorts ? '9:16' : '16:9',
                duration: targetDuration,
                onProgress: (step, msg) => console.log(`[${step.toUpperCase()}] ${msg}`)
            });
        }

        console.log(`\n🎉 ALL EXPORTS COMPLETE!`);
        console.log(`📁 Check your files in: ${exportsDir}\n`);
    } catch(err) {
        console.error(`\n❌ Error during export:`, err.message);
    } finally {
        server.close();
        process.exit(0);
    }
})();
