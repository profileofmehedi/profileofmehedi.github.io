const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

const FFMPEG_PATH = 'C:\\Program Files\\DownloadHelper CoApp\\ffmpeg.exe';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const projectDir = path.resolve(__dirname, '..');
const exportsDir = path.join(projectDir, 'exports');
if (!fs.existsSync(exportsDir)) fs.mkdirSync(exportsDir, { recursive: true });

async function exportQuizToMP4(htmlFileName, format = '16:9') {
    const isShorts = format === '9:16' || format === 'shorts';
    const width = isShorts ? 1080 : 1920;
    const height = isShorts ? 1920 : 1080;
    const baseName = path.basename(htmlFileName, '.html');
    const outMP4 = path.join(exportsDir, `${baseName}_${isShorts ? 'Shorts_9x16' : '1080p_16x9'}.mp4`);
    const tempWebM = path.join(exportsDir, `temp_${Date.now()}.webm`);

    console.log(`\n======================================================`);
    console.log(`🎬 EXPORTING TO MP4: ${htmlFileName}`);
    console.log(`📐 Resolution: ${width}x${height} (${isShorts ? '9:16 Shorts' : '16:9 Landscape'})`);
    console.log(`📁 Destination: ${outMP4}`);
    console.log(`======================================================\n`);

    const browser = await puppeteer.launch({
        executablePath: CHROME_PATH,
        headless: false, // Visible so TTS audio and Web Audio render with GPU hardware acceleration
        defaultViewport: null,
        args: [
            '--enable-usermedia-screen-capturing',
            '--allow-http-screen-capture',
            '--use-fake-ui-for-media-stream',
            '--auto-select-desktop-capture-source=Entire screen',
            `--window-size=${width},${height}`,
            '--autoplay-policy=no-user-gesture-required',
            '--no-default-browser-check',
            '--disable-infobars',
            '--hide-scrollbars'
        ]
    });

    const page = await browser.newPage();
    await page.setViewport({ width, height });

    const targetUrl = 'file:///' + path.join(projectDir, htmlFileName).replace(/\\/g, '/') + (isShorts ? '?mode=shorts' : '');
    console.log(`Loading: ${targetUrl}`);
    await page.goto(targetUrl, { waitUntil: 'domcontentloaded' });

    // Set aspect ratio in page if Shorts
    if (isShorts) {
        await page.evaluate(() => {
            if (window.quizEngine && window.quizEngine.setAspectRatio) {
                window.quizEngine.setAspectRatio(false);
            }
        });
    }

    // Inject Clean Stream Recorder (NO UI, NO WATERMARKS)
    await page.evaluate(async () => {
        window.__recordedChunks = [];
        window.__recordingFinished = false;

        const stream = await navigator.mediaDevices.getDisplayMedia({
            video: { frameRate: 60 },
            audio: true
        });

        const rec = new MediaRecorder(stream, {
            mimeType: 'video/webm;codecs=vp9,opus',
            videoBitsPerSecond: 16000000 // 16 Mbps Full HD
        });

        rec.ondataavailable = (e) => {
            if (e.data && e.data.size > 0) window.__recordedChunks.push(e.data);
        };

        window.__stopCapture = function() {
            return new Promise((resolve) => {
                rec.onstop = () => {
                    stream.getTracks().forEach(t => t.stop());
                    const blob = new Blob(window.__recordedChunks, { type: 'video/webm' });
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result.split(',')[1]);
                    reader.readAsDataURL(blob);
                };
                rec.stop();
            });
        };

        rec.start(1000);
    });

    console.log(`🎙️ Recording stream started. Launching quiz...`);

    // Start Quiz countdown
    await page.evaluate(() => {
        if (window.quizEngine && window.quizEngine.startIntroCountdown) {
            window.quizEngine.startIntroCountdown();
        }
    });

    console.log(`⏳ Quiz running... waiting for completion...`);

    // Monitor for completion
    let isFinished = false;
    const startTime = Date.now();
    const maxDurationMs = 25 * 60 * 1000; // 25 minutes safety timeout

    while (!isFinished && (Date.now() - startTime) < maxDurationMs) {
        await new Promise(r => setTimeout(r, 2000));
        isFinished = await page.evaluate(() => {
            return window.__quiz_finished === true;
        });
    }

    console.log(`🏁 Quiz completed! Capturing final scorecard (6 seconds)...`);
    await new Promise(r => setTimeout(r, 6000));

    console.log(`💾 Saving video buffer...`);
    const base64Data = await page.evaluate(async () => {
        return await window.__stopCapture();
    });

    await browser.close();

    // Write temp WebM file
    fs.writeFileSync(tempWebM, Buffer.from(base64Data, 'base64'));
    console.log(`✅ Raw capture saved (${(fs.statSync(tempWebM).size / 1024 / 1024).toFixed(2)} MB).`);

    // Convert to Broadcast-Quality H.264 / AAC MP4 with FFmpeg
    console.log(`⚡ Encoding to MP4 with FFmpeg (H.264 / AAC 60FPS)...`);
    try {
        const cmd = `"${FFMPEG_PATH}" -y -i "${tempWebM}" -c:v libx264 -preset fast -crf 18 -pix_fmt yuv420p -c:a aac -b:a 192k "${outMP4}"`;
        execSync(cmd, { stdio: 'inherit' });
        fs.unlinkSync(tempWebM); // Clean temp file
        console.log(`\n🎉 SUCCESS! HD MP4 Video Ready for YouTube:`);
        console.log(`👉 ${outMP4}\n`);
    } catch(err) {
        console.error(`FFmpeg encoding error:`, err.message);
    }
}

// CLI Execution Support
const args = process.argv.slice(2);
if (args.length > 0) {
    const file = args[0];
    const fmt = args[1] || '16:9';
    exportQuizToMP4(file, fmt).catch(console.error);
}

module.exports = { exportQuizToMP4 };
