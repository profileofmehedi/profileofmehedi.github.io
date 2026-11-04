const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const url = require('url');
const crypto = require('crypto');
const { exec } = require('child_process');

let ffmpegPath = null;
try {
    ffmpegPath = require('ffmpeg-static');
} catch (e) {
    ffmpegPath = null;
}

const PORT = process.env.PORT || 3300;
const STUDIO_DIR = __dirname;
const TRIVIA_DIR = path.resolve(__dirname, '..', 'Trivia Channel');
const EXPORTS_DIR = path.join(STUDIO_DIR, 'exports');
const CACHE_DIR = path.join(STUDIO_DIR, 'tts-cache');

if (!fs.existsSync(EXPORTS_DIR)) fs.mkdirSync(EXPORTS_DIR, { recursive: true });
if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true });

// MIME types
const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.mp4': 'video/mp4',
    '.webm': 'video/webm',
    '.wav': 'audio/wav',
    '.mp3': 'audio/mpeg'
};

// Scan trivia files
function getAvailableQuizzes() {
    if (!fs.existsSync(TRIVIA_DIR)) return [];
    
    const files = fs.readdirSync(TRIVIA_DIR);
    const quizzes = [];

    files.forEach(file => {
        if (file.endsWith('.html') && file.toLowerCase() !== 'index.html') {
            const filePath = path.join(TRIVIA_DIR, file);
            let title = file.replace('.html', '').replace(/^[0-9]+_/, '').replace(/_/g, ' ');
            let questionCount = 20;
            let category = "USA TRIVIA";
            let subtitle = "";

            try {
                const content = fs.readFileSync(filePath, 'utf-8');
                const titleMatch = content.match(/"title"\s*:\s*"([^"]+)"/i);
                if (titleMatch) title = titleMatch[1];
                
                const subMatch = content.match(/"subtitle"\s*:\s*"([^"]+)"/i);
                if (subMatch) subtitle = subMatch[1];

                const catMatch = content.match(/"category"\s*:\s*"([^"]+)"/i);
                if (catMatch) category = catMatch[1];

                const qMatches = content.match(/"q"\s*:/g);
                if (qMatches) questionCount = qMatches.length;
            } catch (err) {}

            quizzes.push({
                filename: file,
                title: title,
                subtitle: subtitle || `Test your knowledge with ${questionCount} challenging questions!`,
                category: category,
                questions: questionCount,
                url: `/trivia/${encodeURIComponent(file)}`
            });
        }
    });

    quizzes.sort((a, b) => a.filename.localeCompare(b.filename, undefined, { numeric: true, sensitivity: 'base' }));
    return quizzes;
}

// Fetch single TTS chunk
function fetchTTSChunk(textChunk) {
    return new Promise((resolve, reject) => {
        const ttsUrl = 'https://translate.google.com/translate_tts?ie=UTF-8&q=' + encodeURIComponent(textChunk) + '&tl=en-US&client=tw-ob';
        const req = https.get(ttsUrl, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
            if (res.statusCode !== 200) {
                return reject(new Error('TTS responded with status ' + res.statusCode));
            }
            const chunks = [];
            res.on('data', d => chunks.push(d));
            res.on('end', () => resolve(Buffer.concat(chunks)));
            res.on('error', reject);
        });
        req.on('error', reject);
    });
}

// Split text into chunks <= 150 chars for Google TTS
function splitIntoChunks(text, maxLen = 150) {
    const sentences = text.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [text];
    const chunks = [];
    let current = '';

    sentences.forEach(s => {
        const trimmed = s.trim();
        if (!trimmed) return;
        if ((current + ' ' + trimmed).trim().length <= maxLen) {
            current = (current + ' ' + trimmed).trim();
        } else {
            if (current) chunks.push(current);
            if (trimmed.length <= maxLen) {
                current = trimmed;
            } else {
                // Split by words
                const words = trimmed.split(' ');
                current = '';
                words.forEach(w => {
                    if ((current + ' ' + w).trim().length <= maxLen) {
                        current = (current + ' ' + w).trim();
                    } else {
                        if (current) chunks.push(current);
                        current = w;
                    }
                });
            }
        }
    });
    if (current) chunks.push(current);
    return chunks.length ? chunks : [text];
}

async function getFullTTSAudio(text) {
    const hash = crypto.createHash('md5').update(text.trim().toLowerCase()).digest('hex');
    const cachedFile = path.join(CACHE_DIR, `${hash}.mp3`);

    if (fs.existsSync(cachedFile)) {
        return fs.readFileSync(cachedFile);
    }

    const chunks = splitIntoChunks(text);
    const audioBuffers = [];

    for (const chunk of chunks) {
        try {
            const buf = await fetchTTSChunk(chunk);
            audioBuffers.push(buf);
        } catch (err) {
            console.error('[TTS Chunk Error]', err.message);
        }
    }

    const fullBuffer = Buffer.concat(audioBuffers);
    if (fullBuffer.length > 0) {
        fs.writeFileSync(cachedFile, fullBuffer);
    }
    return fullBuffer;
}

const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = decodeURIComponent(parsedUrl.pathname);

    // API: TTS Voiceover Endpoint (Streams crystal-clear MP3 for HTML5 Audio)
    if (pathname === '/api/tts') {
        const text = parsedUrl.query.text;
        if (!text || !text.trim()) {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            return res.end('Missing text parameter');
        }

        try {
            const audioBuffer = await getFullTTSAudio(text);
            res.writeHead(200, {
                'Content-Type': 'audio/mpeg',
                'Content-Length': audioBuffer.length,
                'Cache-Control': 'public, max-age=86400',
                'Access-Control-Allow-Origin': '*'
            });
            return res.end(audioBuffer);
        } catch (err) {
            console.error('[TTS API Error]', err);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            return res.end('TTS generation error');
        }
    }

    // API: List quizzes
    if (pathname === '/api/quizzes') {
        const quizzes = getAvailableQuizzes();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ success: true, count: quizzes.length, data: quizzes }));
    }

    // API: Save recorded video & auto-convert to crisp 1080p MP4 via FFmpeg
    if (pathname === '/api/save-video' && req.method === 'POST') {
        const rawFileName = req.headers['x-file-name'] || `trivia_raw_${Date.now()}.webm`;
        const sanitizedRaw = rawFileName.replace(/[^a-zA-Z0-9_.-]/g, '_');
        const rawPath = path.join(EXPORTS_DIR, sanitizedRaw);
        const writeStream = fs.createWriteStream(rawPath);

        req.pipe(writeStream);

        req.on('end', () => {
            console.log(`[VideoStudio] Received raw recording: ${rawPath}`);

            // Target final 1080p MP4 name
            const mp4Name = sanitizedRaw.replace(/\.(webm|mp4)$/i, '') + '_1080p.mp4';
            const mp4Path = path.join(EXPORTS_DIR, mp4Name);

            if (ffmpegPath && fs.existsSync(ffmpegPath)) {
                console.log(`[VideoStudio] Remastering to Ultra-HD 1080p 60fps MP4 with FFmpeg...`);
                // CRF 17 = visually lossless master quality
                const cmd = `"${ffmpegPath}" -y -i "${rawPath}" -c:v libx264 -preset fast -crf 17 -pix_fmt yuv420p -c:a aac -b:a 192k "${mp4Path}"`;
                
                exec(cmd, (err) => {
                    if (err) {
                        console.error('[VideoStudio] FFmpeg remastering error:', err.message);
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        return res.end(JSON.stringify({
                            success: true,
                            filename: sanitizedRaw,
                            downloadUrl: `/exports/${encodeURIComponent(sanitizedRaw)}`
                        }));
                    }
                    console.log(`[VideoStudio] Ultra-HD 1080p MP4 ready: ${mp4Path}`);
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                        success: true,
                        filename: mp4Name,
                        downloadUrl: `/exports/${encodeURIComponent(mp4Name)}`
                    }));
                });
            } else {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    success: true,
                    filename: sanitizedRaw,
                    downloadUrl: `/exports/${encodeURIComponent(sanitizedRaw)}`
                }));
            }
        });

        req.on('error', (err) => {
            console.error('[VideoStudio] Stream error:', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: err.message }));
        });
        return;
    }

    // API: Open Exports Folder in File Explorer
    if (pathname === '/api/open-exports') {
        exec(`explorer "${EXPORTS_DIR}"`);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ success: true }));
    }

    // Serve exported videos directly
    if (pathname.startsWith('/exports/')) {
        const file = path.basename(pathname);
        const fullPath = path.join(EXPORTS_DIR, file);
        if (fs.existsSync(fullPath)) {
            const ext = path.extname(fullPath).toLowerCase();
            res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'video/mp4' });
            return fs.createReadStream(fullPath).pipe(res);
        }
        res.writeHead(404);
        return res.end('Export not found');
    }

    // Serve Trivia Channel files (Read-only untouched)
    if (pathname.startsWith('/trivia/')) {
        const subPath = pathname.replace('/trivia/', '');
        const targetFile = path.resolve(TRIVIA_DIR, subPath);

        if (!targetFile.startsWith(TRIVIA_DIR)) {
            res.writeHead(403);
            return res.end('Forbidden');
        }

        if (fs.existsSync(targetFile) && fs.statSync(targetFile).isFile()) {
            const ext = path.extname(targetFile).toLowerCase();
            const contentType = MIME_TYPES[ext] || 'application/octet-stream';
            res.writeHead(200, { 'Content-Type': contentType });
            return fs.createReadStream(targetFile).pipe(res);
        }
        res.writeHead(404);
        return res.end('File not found in Trivia Channel');
    }

    // Serve VideoStudio static files
    let localPath = path.join(STUDIO_DIR, pathname === '/' ? 'index.html' : pathname);
    if (fs.existsSync(localPath) && fs.statSync(localPath).isFile()) {
        const ext = path.extname(localPath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';
        res.writeHead(200, { 'Content-Type': contentType });
        return fs.createReadStream(localPath).pipe(res);
    }

    res.writeHead(404);
    res.end('404 Not Found');
});

server.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`🚀 YouTube Trivia Video Studio is RUNNING!`);
    console.log(`📍 Web Interface: http://localhost:${PORT}`);
    console.log(`📁 Exports Folder: ${EXPORTS_DIR}`);
    console.log(`🎙️ TTS Voiceover Engine: ONLINE (Direct HTML5 Audio)`);
    console.log(`🎬 1080p Master Transcoder: ${ffmpegPath ? 'READY (FFmpeg)' : 'Standard'}`);
    console.log(`======================================================\n`);
});
