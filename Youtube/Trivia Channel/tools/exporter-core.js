const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');
const { execSync, spawn } = require('child_process');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const FFMPEG_PATH = 'C:\\Program Files\\DownloadHelper CoApp\\ffmpeg.exe';

const projectDir = path.resolve(__dirname, '..');
const exportsDir = path.join(projectDir, 'exports');
if (!fs.existsSync(exportsDir)) fs.mkdirSync(exportsDir, { recursive: true });

/**
 * Core Exporter function: Records any served HTML file at 1080p 60fps
 * @param {Object} options
 * @param {string} options.targetUrl - Full URL to load (e.g. http://127.0.0.1:4567/serve?file=...)
 * @param {string} options.outputBaseName - Base name for exported MP4 (e.g. Know_USA)
 * @param {string} options.format - '16:9' or '9:16'
 * @param {number|'auto'} options.duration - Duration in seconds or 'auto'
 * @param {Function} options.onProgress - Progress callback (status, message, pct)
 */
async function recordHtmlToMP4({ targetUrl, outputBaseName, format = '16:9', duration = 'auto', onProgress = () => {} }) {
    const isShorts = format === '9:16' || format === 'shorts';
    const width = isShorts ? 1080 : 1920;
    const height = isShorts ? 1920 : 1080;
    const suffix = isShorts ? 'Shorts_9x16' : '1080p_16x9';
    const outMP4 = path.join(exportsDir, `${outputBaseName}_${suffix}.mp4`);
    const tempWebM = path.join(exportsDir, `temp_${Date.now()}_${suffix}.webm`);

    onProgress('launching', `Launching Chrome in ${width}x${height} (${isShorts ? '9:16 Shorts' : '16:9 Landscape'})...`, 5);

    const browser = await puppeteer.launch({
        executablePath: CHROME_PATH,
        headless: false,
        args: [
            '--enable-usermedia-screen-capturing',
            '--allow-http-screen-capture',
            '--use-fake-ui-for-media-stream',
            '--auto-select-tab-capture-source-by-title=STUDIO_CAPTURE_TARGET',
            `--window-size=${width},${height}`,
            '--autoplay-policy=no-user-gesture-required',
            '--disable-infobars',
            '--no-default-browser-check'
        ]
    });

    try {
        const page = await browser.newPage();
        await page.setViewport({ width, height });

        onProgress('loading', `Loading HTML slide: ${outputBaseName}...`, 15);
        await page.goto(targetUrl, { waitUntil: 'domcontentloaded' });

        // If Shorts mode, ensure quizEngine knows it's 9:16
        if (isShorts) {
            await page.evaluate(() => {
                if (window.quizEngine && window.quizEngine.setAspectRatio) {
                    window.quizEngine.setAspectRatio(false);
                }
            });
        }

        onProgress('recording', `Broadcasting & recording 60FPS stream...`, 25);

        // Inject in-tab 60FPS WebM capture
        const recordPromise = page.evaluate(async (maxDurationSec) => {
            const stream = await navigator.mediaDevices.getDisplayMedia({
                video: {
                    displaySurface: "browser",
                    frameRate: 60,
                    width: { ideal: 1920 },
                    height: { ideal: 1080 }
                },
                audio: true,
                preferCurrentTab: true
            });

            const chunks = [];
            const rec = new MediaRecorder(stream, {
                mimeType: 'video/webm;codecs=vp9,opus',
                videoBitsPerSecond: 16000000
            });

            rec.ondataavailable = (e) => {
                if (e.data && e.data.size > 0) chunks.push(e.data);
            };

            rec.start(1000);

            // Auto-start quiz if present
            if (window.quizEngine && window.quizEngine.startIntroCountdown) {
                window.quizEngine.startIntroCountdown();
            }

            // Monitor completion or timed duration
            const startTime = Date.now();
            let shouldStop = false;

            while (!shouldStop) {
                await new Promise(r => setTimeout(r, 1000));
                const elapsedSec = (Date.now() - startTime) / 1000;

                if (maxDurationSec !== 'auto' && elapsedSec >= maxDurationSec) {
                    shouldStop = true;
                } else if (maxDurationSec === 'auto') {
                    if (window.__quiz_finished === true) {
                        // Wait 5 seconds to capture final scorecard
                        await new Promise(r => setTimeout(r, 5000));
                        shouldStop = true;
                    } else if (elapsedSec > 25 * 60) {
                        // 25 min safety timeout
                        shouldStop = true;
                    }
                }
            }

            return new Promise((resolve) => {
                rec.onstop = () => {
                    stream.getTracks().forEach(t => t.stop());
                    const blob = new Blob(chunks, { type: 'video/webm' });
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result.split(',')[1]);
                    reader.readAsDataURL(blob);
                };
                rec.stop();
            });
        }, duration);

        const base64Data = await recordPromise;
        await browser.close();

        onProgress('encoding', `Encoding Full HD H.264/AAC with FFmpeg...`, 80);
        fs.writeFileSync(tempWebM, Buffer.from(base64Data, 'base64'));

        // FFmpeg broadcast encoding with exact Full HD scaling (1920x1080 or 1080x1920)
        const scaleFilter = isShorts ? 'scale=1080:1920:flags=lanczos' : 'scale=1920:1080:flags=lanczos';
        const ffmpegCmd = `"${FFMPEG_PATH}" -y -i "${tempWebM}" -vf "${scaleFilter}" -r 60 -c:v libx264 -preset fast -crf 18 -pix_fmt yuv420p -map 0:v -map 0:a? -c:a aac -b:a 192k "${outMP4}"`;
        execSync(ffmpegCmd, { stdio: 'inherit' });

        if (fs.existsSync(tempWebM)) fs.unlinkSync(tempWebM);

        const fileSizeMB = (fs.statSync(outMP4).size / (1024 * 1024)).toFixed(2);
        onProgress('done', `Export completed! ${path.basename(outMP4)} (${fileSizeMB} MB)`, 100);

        return {
            success: true,
            filePath: outMP4,
            fileName: path.basename(outMP4),
            sizeMB: fileSizeMB,
            format: format
        };
    } catch (err) {
        if (browser) await browser.close();
        if (fs.existsSync(tempWebM)) fs.unlinkSync(tempWebM);
        onProgress('error', `Export failed: ${err.message}`, 0);
        throw err;
    }
}

module.exports = {
    recordHtmlToMP4,
    CHROME_PATH,
    FFMPEG_PATH,
    exportsDir,
    projectDir
};
