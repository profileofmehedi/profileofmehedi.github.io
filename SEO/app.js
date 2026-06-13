/**
 * AI Image SEO & Portfolio Optimizer - Core Application Logic
 */

// --- Constants & Config ---
const CONFIG = {
    API_URL: 'https://api.openai.com/v1/chat/completions',
    MODEL: 'gpt-4o', 
    STORAGE_KEYS: {
        API_KEY: 'ai_seo_api_key',
        HISTORY: 'ai_seo_history',
        THEME: 'ai_seo_theme'
    }
};

// --- App State ---
const state = {
    queue: [],
    currentIndex: -1,
    currentResults: null,
    history: [],
    apiKey: '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',
    isProcessing: false
};

// --- DOM Elements ---
const el = {
    themeToggle: document.getElementById('themeToggle'),
    apiKeyInput: document.getElementById('apiKey'),
    saveApiKey: document.getElementById('saveApiKey'),
    toggleApiKey: document.getElementById('toggleApiKey'),
    dropZone: document.getElementById('dropZone'),
    fileInput: document.getElementById('fileInput'),
    projectTitle: document.getElementById('projectTitle'),
    projectContext: document.getElementById('projectContext'),
    imageGallery: document.getElementById('imageGallery'),
    generateBtn: document.getElementById('generateBtn'),
    generateAllBtn: document.getElementById('generateAllBtn'),
    resultsArea: document.getElementById('resultsArea'),
    emptyState: document.getElementById('emptyState'),
    loadingOverlay: document.getElementById('loadingOverlay'),
    loadingText: document.getElementById('loadingText'),
    loadingProgress: document.getElementById('loadingProgress'),
    queueSection: document.getElementById('queueSection'),
    queueCount: document.getElementById('queueCount'),
    queueProgress: document.getElementById('queueProgress'),
    prevImg: document.getElementById('prevImg'),
    nextImg: document.getElementById('nextImg'),
    historyTable: document.querySelector('#historyTable tbody'),
    noHistory: document.getElementById('noHistory'),
    toastContainer: document.querySelector('.toast-container'),
    removeExif: document.getElementById('removeExif'),
    embedSeo: document.getElementById('embedSeo'),
    convertFormat: () => document.getElementById('convertFormatSelect').value
};

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    loadApiKey();
    loadHistory();
    setupEventListeners();
    renderHistory();
});

function setupEventListeners() {
    // Theme
    if (el.themeToggle) el.themeToggle.addEventListener('click', toggleTheme);

    // API Key
    if (el.saveApiKey) el.saveApiKey.addEventListener('click', saveApiKey);
    if (el.toggleApiKey) el.toggleApiKey.addEventListener('click', () => {
        const type = el.apiKeyInput.type === 'password' ? 'text' : 'password';
        el.apiKeyInput.type = type;
        el.toggleApiKey.innerHTML = `<i class="fas fa-eye${type === 'password' ? '' : '-slash'}"></i>`;
    });

    // Uploads
    if (el.dropZone) {
        el.dropZone.addEventListener('dragover', (e) => { e.preventDefault(); el.dropZone.classList.add('dragover'); });
        el.dropZone.addEventListener('dragleave', () => el.dropZone.classList.remove('dragover'));
        el.dropZone.addEventListener('drop', (e) => { e.preventDefault(); el.dropZone.classList.remove('dragover'); handleFiles(e.dataTransfer.files); });
    }
    if (el.fileInput) el.fileInput.addEventListener('change', (e) => handleFiles(e.target.files));

    // Queue Navigation
    if (el.prevImg) el.prevImg.addEventListener('click', () => navigateQueue(-1));
    if (el.nextImg) el.nextImg.addEventListener('click', () => navigateQueue(1));

    // Generation
    if (el.generateBtn) el.generateBtn.addEventListener('click', () => startGeneration(false));
    if (el.generateAllBtn) el.generateAllBtn.addEventListener('click', () => startGeneration(true));

    // Results Copying
    document.addEventListener('click', (e) => {
        if (e.target.closest('.copy-btn')) {
            const input = e.target.closest('.input-group').querySelector('input');
            copyToClipboard(input.value);
        } else if (e.target.closest('.copy-btn-text')) {
            const field = e.target.closest('.input-group') || e.target.closest('.tab-pane') || e.target.closest('.col-md-6');
            const textarea = field.querySelector('textarea');
            if (textarea) copyToClipboard(textarea.value);
        }
    });

    // Downloads
    document.getElementById('dl_image').addEventListener('click', downloadCurrentImage);
    document.getElementById('dl_json').addEventListener('click', downloadJSON);
    document.getElementById('dl_csv').addEventListener('click', downloadCSV);
    document.getElementById('dl_txt_all').addEventListener('click', downloadTXT);
    document.getElementById('dl_zip').addEventListener('click', downloadZIP);

    // History
    document.getElementById('clearHistory').addEventListener('click', clearHistory);
}

// --- Theme Management ---
function initTheme() {
    const savedTheme = localStorage.getItem(CONFIG.STORAGE_KEYS.THEME) || 'light';
    document.documentElement.setAttribute('data-bs-theme', savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-bs-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-bs-theme', newTheme);
    localStorage.setItem(CONFIG.STORAGE_KEYS.THEME, newTheme);
}

// --- API Key Management ---
function loadApiKey() {
    // The key is already hardcoded in the state.
    // If the user has a different one saved in localStorage, we can use that,
    // but default to the hardcoded state if localStorage is empty.
    const savedKey = localStorage.getItem(CONFIG.STORAGE_KEYS.API_KEY);
    if (savedKey) {
        state.apiKey = savedKey;
    }
    if (el.apiKeyInput) el.apiKeyInput.value = state.apiKey;
}

function saveApiKey() {
    const key = el.apiKeyInput.value.trim();
    if (!key) return showToast('Please enter an API key', 'warning');
    state.apiKey = key;
    localStorage.setItem(CONFIG.STORAGE_KEYS.API_KEY, key);
    showToast('API Key saved successfully', 'success');
}

// --- File Handling ---
async function handleFiles(files) {
    if (files.length === 0) return;
    for (const file of files) {
        if (!file.type.startsWith('image/')) continue;
        const reader = new FileReader();
        reader.onload = (e) => {
            const imgData = {
                file: file,
                name: file.name,
                dataUrl: e.target.result,
                id: Date.now() + Math.random().toString(36).substr(2, 9),
                results: null
            };
            state.queue.push(imgData);
            updateQueueUI();
            if (state.currentIndex === -1) {
                state.currentIndex = 0;
                displayCurrentItem();
            }
        };
        reader.readAsDataURL(file);
    }
}

function updateQueueUI() {
    if (state.queue.length > 0) {
        el.queueSection.classList.remove('d-none');
        el.queueCount.textContent = state.queue.length;
        const progress = ((state.currentIndex + 1) / state.queue.length) * 100;
        el.queueProgress.style.width = `${progress}%`;
    } else {
        el.queueSection.classList.add('d-none');
    }
    renderGallery();
}

function renderGallery() {
    el.imageGallery.innerHTML = '';
    state.queue.forEach((item, index) => {
        const isActive = index === state.currentIndex;
        const card = document.createElement('div');
        card.className = 'col';
        card.innerHTML = `
            <div class="card glass-card img-preview-card border-2 ${isActive ? 'border-primary' : 'border-transparent'}" onclick="selectQueueItem(${index})">
                <img src="${item.dataUrl}" style="height: 60px; object-fit: cover; border-radius: 6px;">
                <div class="extra-small text-truncate mt-1 px-1">${item.name}</div>
            </div>
        `;
        el.imageGallery.appendChild(card);
    });
}

function selectQueueItem(index) {
    state.currentIndex = index;
    displayCurrentItem();
}

function navigateQueue(dir) {
    const next = state.currentIndex + dir;
    if (next >= 0 && next < state.queue.length) {
        state.currentIndex = next;
        displayCurrentItem();
    }
}

function displayCurrentItem() {
    if (state.currentIndex === -1) {
        el.resultsArea.classList.add('d-none');
        el.emptyState.classList.remove('d-none');
        return;
    }
    updateQueueUI();
    const item = state.queue[state.currentIndex];
    if (item.results) {
        showResults(item.results);
        el.emptyState.classList.add('d-none');
    } else {
        el.resultsArea.classList.add('d-none');
        el.emptyState.classList.remove('d-none');
    }
}

// --- AI Generation ---
async function startGeneration(isBulk = false) {
    if (!state.apiKey) return showToast('Please save your OpenAI API key', 'warning');
    if (state.currentIndex === -1) return showToast('Upload an image first', 'warning');
    if (state.isProcessing) return;

    const title = el.projectTitle.value.trim() || 'Untitled Project';
    const context = el.projectContext.value.trim();
    const itemsToProcess = isBulk ? state.queue.filter(item => !item.results) : [state.queue[state.currentIndex]];

    if (itemsToProcess.length === 0) return showToast('No images to process', 'info');

    state.isProcessing = true;
    showLoading(true);

    try {
        let count = 0;
        for (const item of itemsToProcess) {
            count++;
            updateLoadingProgress((count / itemsToProcess.length) * 100, `Processing ${count}/${itemsToProcess.length}...`);
            const base64Image = item.dataUrl.split(',')[1];
            const result = await callOpenAIVision(base64Image, title, context);
            item.results = result;
            item.projectTitle = title;
            addToHistory(item);
        }
        displayCurrentItem();
        showToast('Generation Complete!', 'success');
    } catch (err) {
        showToast(err.message || 'API Error', 'danger');
    } finally {
        state.isProcessing = false;
        showLoading(false);
    }
}

async function callOpenAIVision(base64Image, title, context) {
    const prompt = `Analyze image for project "${title}". Context: ${context}. Return valid JSON: {seoFilename, seoTitle, altText, metaDescription, keywords:[], upwork:{description,problem,solution,result}, fiverr:{description}, linkedin:{post}, instagram:{caption}, facebook:{post}, twitter:{post}}. No markdown.`;
    const response = await fetch(CONFIG.API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${state.apiKey}` },
        body: JSON.stringify({
            model: CONFIG.MODEL,
            messages: [{ role: 'user', content: [{ type: 'text', text: prompt }, { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${base64Image}` } }] }],
            response_format: { type: "json_object" }
        })
    });
    if (!response.ok) throw new Error('OpenAI API Error');
    const data = await response.json();
    return JSON.parse(data.choices[0].message.content);
}

// --- Results ---
function showResults(res) {
    el.resultsArea.classList.remove('d-none');
    el.emptyState.classList.add('d-none');
    document.getElementById('res_seoFilename').value = res.seoFilename;
    document.getElementById('res_seoTitle').value = res.seoTitle;
    document.getElementById('res_altText').value = res.altText;
    document.getElementById('res_metaDescription').value = res.metaDescription;
    document.getElementById('res_keywords').value = res.keywords.join(', ');
    document.getElementById('res_upworkDesc').value = `PROBLEM: ${res.upwork.problem}\n\nSOLUTION: ${res.upwork.solution}\n\nDESCRIPTION: ${res.upwork.description}`;
    document.getElementById('res_fiverrDesc').value = res.fiverr.description;
    document.getElementById('res_linkedin').value = res.linkedin.post;
    document.getElementById('res_instagram').value = res.instagram.caption;
    document.getElementById('res_facebook').value = res.facebook.post;
    document.getElementById('res_x').value = res.twitter.post;
}

// --- Metadata & Processing ---
function toXPBytes(str) {
    const bytes = [];
    for (let i = 0; i < str.length; i++) {
        const charCode = str.charCodeAt(i);
        bytes.push(charCode & 0xFF, (charCode >> 8) & 0xFF);
    }
    bytes.push(0, 0);
    return bytes;
}

async function getProcessedImage(targetItem) {
    const item = targetItem || state.queue[state.currentIndex];
    if (!item) return null;

    let format = el.convertFormat();
    const embedSeo = el.embedSeo.checked;

    // IMPORTANT: Windows only supports these 'Details' fields for JPEGs.
    // If embedding SEO, we must convert PNG/WEBP to JPEG.
    if (embedSeo && format === 'original' && item.file.type !== 'image/jpeg') {
        format = 'image/jpeg';
    }

    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width; canvas.height = img.height;
            canvas.getContext('2d').drawImage(img, 0, 0);
            
            const targetFormat = format === 'original' ? item.file.type : format;
            canvas.toBlob((blob) => {
                if (embedSeo && (targetFormat === 'image/jpeg' || targetFormat === 'image/jpg') && item.results) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        try {
                            const dataUrl = e.target.result;
                            const exif = { "0th": {}, "Exif": {}, "GPS": {}, "1st": {}, "thumbnail": null };
                            
                            // 1. Description Section (Windows Properties)
                            exif["0th"][0x9c9b] = toXPBytes(item.results.seoTitle); // Title
                            exif["0th"][0x9c9f] = toXPBytes(item.results.altText);  // Subject
                            exif["0th"][0x4746] = 5; // Rating (5 stars)
                            exif["0th"][0x4749] = 99; // RatingPercent
                            exif["0th"][0x9c9e] = toXPBytes(item.results.keywords.join('; ')); // Tags
                            exif["0th"][0x9c9c] = toXPBytes(item.results.metaDescription); // Comments
                            
                            // 2. Origin Section
                            exif["0th"][0x9c9d] = toXPBytes("AI SEO Optimizer"); // Authors
                            exif["0th"][piexif.ImageIFD.Software] = "AI Image SEO Optimizer"; // Program Name
                            exif["0th"][piexif.ImageIFD.Copyright] = "Copyright © 2024 AI SEO Optimizer";
                            
                            // 3. Standard Metadata
                            exif["0th"][piexif.ImageIFD.ImageDescription] = item.results.seoTitle;
                            exif["Exif"][piexif.ExifIFD.UserComment] = [0x55, 0x4e, 0x49, 0x43, 0x4f, 0x44, 0x45, 0x00, ...toXPBytes(item.results.altText)];

                            const exifStr = piexif.dump(exif);
                            const inserted = piexif.insert(exifStr, dataUrl);
                            
                            const byteString = atob(inserted.split(',')[1]);
                            const ia = new Uint8Array(byteString.length);
                            for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
                            resolve(new Blob([ia], { type: 'image/jpeg' }));
                        } catch (err) {
                            console.error('Metadata Error:', err);
                            resolve(blob);
                        }
                    };
                    reader.readAsDataURL(blob);
                } else {
                    resolve(blob);
                }
            }, targetFormat, 0.95);
        };
        img.src = item.dataUrl;
    });
}

// --- Downloads ---
async function downloadCurrentImage() {
    const item = state.queue[state.currentIndex];
    if (!item || !item.results) return showToast('Generate results first', 'warning');
    const blob = await getProcessedImage(item);
    saveFile(blob, `${item.results.seoFilename}.${blob.type.split('/')[1]}`);
}

async function downloadJSON() {
    const res = state.queue[state.currentIndex].results;
    if (!res) return;
    saveFile(new Blob([JSON.stringify(res, null, 2)], { type: 'application/json' }), `${res.seoFilename}.json`);
}

async function downloadCSV() {
    const res = state.queue[state.currentIndex].results;
    if (!res) return;
    const csv = `Field,Value\nTitle,"${res.seoTitle}"\nAlt,"${res.altText}"`;
    saveFile(new Blob([csv], { type: 'text/csv' }), `${res.seoFilename}.csv`);
}

async function downloadTXT() {
    const res = state.queue[state.currentIndex].results;
    if (!res) return;
    saveFile(new Blob([res.seoTitle + "\n\n" + res.altText], { type: 'text/plain' }), `${res.seoFilename}.txt`);
}

async function downloadZIP() {
    const processedItems = state.queue.filter(i => i.results);
    if (processedItems.length === 0) return showToast('No processed images to download', 'warning');

    showLoading(true, `Packaging ${processedItems.length} images...`);
    try {
        const zip = new JSZip();
        for (const item of processedItems) {
            const imgBlob = await getProcessedImage(item);
            const ext = imgBlob.type.split('/')[1] || 'jpg';
            // Add only the image file to the root of the ZIP
            zip.file(`${item.results.seoFilename}.${ext}`, imgBlob);
        }
        
        const content = await zip.generateAsync({ type: 'blob' });
        saveFile(content, `optimized_images_${Date.now()}.zip`);
        showToast('Bulk Download Ready!', 'success');
    } catch (err) {
        console.error(err);
        showToast('Packaging failed', 'danger');
    } finally {
        showLoading(false);
    }
}

function saveFile(blob, name) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = name; a.click();
}

// --- History ---
function loadHistory() { state.history = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.HISTORY)) || []; }
function addToHistory(item) {
    state.history.unshift({ date: new Date().toLocaleString(), project: item.projectTitle, title: item.results.seoTitle });
    if (state.history.length > 20) state.history.pop();
    localStorage.setItem(CONFIG.STORAGE_KEYS.HISTORY, JSON.stringify(state.history));
    renderHistory();
}
function renderHistory() {
    el.historyTable.innerHTML = '';
    state.history.forEach(h => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${h.date}</td><td>${h.project}</td><td>${h.title}</td>`;
        el.historyTable.appendChild(tr);
    });
}
function clearHistory() { state.history = []; localStorage.removeItem(CONFIG.STORAGE_KEYS.HISTORY); renderHistory(); }

// --- UI Helpers ---
function showLoading(show, text = 'Processing...') {
    if (show) { el.loadingOverlay.classList.remove('d-none'); el.loadingText.textContent = text; }
    else { el.loadingOverlay.classList.add('d-none'); }
}
function updateLoadingProgress(p, t) { el.loadingProgress.style.width = `${p}%`; if (t) el.loadingText.textContent = t; }
function showToast(m, type = 'info') {
    const t = document.createElement('div');
    t.className = `toast align-items-center text-white bg-${type} border-0 show p-2 mb-2`;
    t.innerHTML = `<div class="d-flex"><div class="toast-body">${m}</div><button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button></div>`;
    el.toastContainer.appendChild(t);
    setTimeout(() => t.remove(), 3000);
}
function copyToClipboard(t) { navigator.clipboard.writeText(t).then(() => showToast('Copied!', 'success')); }
