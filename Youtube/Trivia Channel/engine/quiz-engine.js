/**
 * ==========================================================================
 * USA TRIVIA CHANNEL - HIGH-RETENTION BROADCAST QUIZ ENGINE
 * Featuring Fast Typewriter Effects, Studio SFX, and Viral Engagement Hooks
 * ==========================================================================
 */

(function() {
    const config = window.quizConfig || {};
    const quizData = config.data || [];
    const quizTitle = config.title || "USA TRIVIA QUIZ";
    const quizSubtitle = config.subtitle || "Test your knowledge with 20 challenging questions!";
    const quizCategory = config.category || "USA TRIVIA";

    let currentIndex = 0;
    let is16by9 = true;
    let thinkingDurationMs = 7000; // 7 seconds for optimal YouTube pacing
    let timeLeftMs = thinkingDurationMs;
    let lastTickSec = 7;
    let timerInterval = null;
    let isPaused = false;
    let ttsEnabled = true;
    let bgmEnabled = true;
    let answerRevealed = false;

    // Typewriter State
    let isTyping = false;
    let typingTimer = null;
    let currentQuestionFullText = "";

    // Interactive Stats Tracking
    let userSelectedOption = null;
    let playerScore = 0;
    let currentStreak = 0;
    let maxStreak = 0;

    // Channel Logo Branding State ('color' = logo-color.png, 'white' = logo-bw.png)
    let currentLogoTheme = 'color';

    // Check URL parameters (e.g. ?mode=shorts or ?auto=1 or ?logo=white)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('mode') === 'shorts') {
        is16by9 = false;
        thinkingDurationMs = 4000; // 4s for fast vertical Shorts
    }
    if (urlParams.get('logo') === 'white') {
        currentLogoTheme = 'white';
    }

    // --- DOM INITIALIZATION (CLEAN BROADCAST LAYOUT) ---
    function initDOM() {
        const modeClass = is16by9 ? 'mode-16-9' : 'mode-9-16';
        const logoSrc = currentLogoTheme === 'white' ? 'images/logo/logo-bw.png' : 'images/logo/logo-color.png';
        const whiteClass = currentLogoTheme === 'white' ? 'white-theme' : '';

        document.body.innerHTML = `
            <canvas id="bg-canvas"></canvas>
            <div class="video-canvas ${modeClass}" id="video-canvas">
                <canvas id="confetti-canvas"></canvas>

                <!-- Start Screen Overlay with ThinkFast Channel Branding -->
                <div id="start-overlay" class="overlay-screen">
                    <div class="intro-logo-container" onclick="window.quizEngine.toggleLogoTheme()" style="cursor: pointer;" title="Click to toggle Color / White Logo">
                        <div class="intro-logo-card ${whiteClass}" id="intro-logo-card">
                            <img src="${logoSrc}" alt="ThinkFast Logo" class="intro-logo-img" id="intro-logo-img">
                        </div>
                        <div class="intro-tagline">THINK SMART. ANSWER FAST.</div>
                        <div class="logo-toggle-hint">Click logo or press <b>L</b> to toggle Color / White</div>
                    </div>

                    <h1>${quizTitle}</h1>
                    <p>${quizSubtitle}</p>
                    <div class="feature-pills">
                        <span class="pill">⚡ Fast Typewriter Flow</span>
                        <span class="pill">🖼️ Broadcast Visual Clues</span>
                        <span class="pill">🎙️ American Voiceover</span>
                        <span class="pill">🚨 Question 20 Final Boss</span>
                    </div>

                    <button class="start-btn" id="start-btn" onclick="window.quizEngine.startIntroCountdown()">
                        START CHALLENGE
                    </button>
                    <div style="margin-top: 20px; font-size: 0.92rem; color: #64748b;">
                        Press <b>F11</b> for Fullscreen • Press <b>1-4</b> or <b>Click</b> to Guess • <b>Space</b> to Pause
                    </div>
                </div>

                <!-- 3-2-1 Countdown Overlay -->
                <div id="countdown-overlay" style="display: none;">
                    <div class="countdown-big-number" id="countdown-number">3</div>
                    <p style="font-size: 1.6rem; color: #38bdf8; font-weight: 800; margin-top: 15px; letter-spacing: 2px;">GET READY...</p>
                </div>

                <!-- Outro Scorecard Screen with ThinkFast Branding -->
                <div id="end-overlay" class="overlay-screen" style="display: none;">
                    <div class="outro-logo-container">
                        <div class="outro-logo-card ${whiteClass}" id="outro-logo-card">
                            <img src="${logoSrc}" alt="ThinkFast Logo" class="outro-logo-img" id="outro-logo-img">
                        </div>
                    </div>

                    <h1>CHALLENGE COMPLETED!</h1>
                    
                    <div class="interactive-score-box" id="interactive-score-box">
                        <div class="score-circle">
                            <span class="final-score-val" id="final-score-val">0/${quizData.length}</span>
                            <span class="final-score-sub">FINAL SCORE</span>
                        </div>
                        <div class="final-details">
                            <div class="final-tier-badge" id="final-tier-badge">🏆 TRIVIA LEGEND</div>
                            <div class="final-streak-stat" id="final-streak-stat">Longest Streak: 🔥 0 in a row</div>
                        </div>
                    </div>

                    <div class="sub-cta-box">
                        <img src="images/logo/logo-bw.png" alt="ThinkFast Logo" class="cta-white-badge" title="ThinkFast Official">
                        <span>Subscribe to <b>ThinkFast</b> for Daily USA Trivia!</span>
                    </div>

                    <p style="font-size: 1.18rem; color: #38bdf8; font-weight: 700; margin-bottom: 25px;">
                        👍 Like & Subscribe for Daily USA Trivia Challenges!
                    </p>

                    <button class="start-btn" style="font-size: 1.25rem; padding: 12px 38px;" onclick="window.quizEngine.restartQuiz()">
                        PLAY AGAIN (R)
                    </button>
                </div>

                <!-- Minimalist Broadcast Header with ThinkFast Watermark -->
                <header>
                    <div class="header-left">
                        <div class="brand-pill ${whiteClass}" id="brand-pill" title="ThinkFast (Press L or Click to Toggle Logo Theme)" onclick="window.quizEngine.toggleLogoTheme()">
                            <div class="brand-logo-frame">
                                <img src="${logoSrc}" alt="ThinkFast" class="brand-logo-img" id="header-brand-logo">
                            </div>
                            <div class="brand-text">
                                <span class="brand-title">Think<span class="brand-accent">Fast</span></span>
                            </div>
                        </div>
                        <div class="category-badge"><span>🇺🇸</span> ${quizCategory}</div>
                        <div class="round-badge" id="round-badge">ROUND 1 • BASICS</div>
                    </div>
                    
                    <div class="header-right">
                        <div class="question-counter">
                            QUESTION <span class="current-num" id="q-current">01</span> / <span class="total-num" id="q-total">${quizData.length < 10 ? '0' + quizData.length : quizData.length}</span>
                        </div>
                    </div>
                </header>

                <!-- Stage Box with Visual & Question -->
                <div class="stage-box">
                    <div class="image-frame" id="img-frame">
                        <img id="q-image" src="" alt="Visual Clue" onerror="this.style.display='none'; document.getElementById('fallback-icon').style.display='block';">
                        <div id="fallback-icon" class="fallback-icon" style="display: none;">🇺🇸</div>
                    </div>
                    <div class="question-content" onclick="window.quizEngine.completeTypingInstantly()">
                        <div class="question-text">
                            <span id="question-typed-text"></span><span class="typing-cursor" id="typing-cursor"></span>
                        </div>
                    </div>
                </div>

                <!-- Precision Radial & Linear Countdown Timer -->
                <div class="timer-container" id="timer-container">
                    <div class="radial-timer-box">
                        <svg class="radial-svg" width="84" height="84" viewBox="0 0 84 84">
                            <circle class="radial-track" cx="42" cy="42" r="37" />
                            <circle class="radial-progress" id="radial-progress" cx="42" cy="42" r="37" />
                        </svg>
                        <div class="timer-number" id="timer">7</div>
                    </div>
                    <div class="progress-bar-bg"><div class="progress-bar-fill" id="progress-bar"></div></div>
                </div>

                <!-- 3D Multiple Choice Grid -->
                <div class="options-grid" id="options-container"></div>

                <!-- "Did You Know?" Fact Card -->
                <div class="fact-card" id="fact-card">
                    <div class="fact-icon">💡</div>
                    <div class="fact-content">
                        <h4>Did You Know?</h4>
                        <p id="fact-text">Fun fact loading...</p>
                    </div>
                </div>

                <!-- Clean Engagement Bar -->
                <div class="engagement-bar">
                    <div class="highlight"><span>🎯</span> Press 1-4 or Click to lock in your answer!</div>
                    <div class="action-prompt" id="cta-prompt">Can you score 20/20? Comment below! 👇</div>
                </div>

                <!-- Hidden Controls (Hover only) -->
                <div class="controls">
                    <button class="ctrl-btn" id="logo-btn" onclick="window.quizEngine.toggleLogoTheme()">${currentLogoTheme === 'white' ? '🎨 Logo: White' : '🎨 Logo: Color'}</button>
                    <button class="ctrl-btn" id="bgm-btn" onclick="window.quizEngine.toggleBGM()">🎵 BGM</button>
                    <button class="ctrl-btn" id="tts-btn" onclick="window.quizEngine.toggleTTS()">🎙️ Voice</button>
                    <button class="ctrl-btn" id="aspect-btn" onclick="window.quizEngine.toggleAspectRatio()">📱 Aspect</button>
                    <button class="ctrl-btn" onclick="window.quizEngine.togglePause()">⏸️ Pause</button>
                    <button class="ctrl-btn" onclick="window.quizEngine.nextQuestion()">⏭️ Skip</button>
                </div>
            </div>
        `;

        if (urlParams.get('auto') === '1') {
            setTimeout(() => { startIntroCountdown(); }, 800);
        }
    }

    // --- SYNTHESIZED WEB AUDIO API SOUND SYSTEM ---
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    let audioCtx = null;
    let bgmInterval = null;

    function initAudio() {
        if (!audioCtx) audioCtx = new AudioContextClass();
        if (audioCtx.state === 'suspended') audioCtx.resume();
    }

    // Soft mechanical typewriter key click
    function playTypewriterTick() {
        if (!audioCtx) return;
        try {
            const now = audioCtx.currentTime;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = "sine";
            osc.frequency.setValueAtTime(1400 + Math.random() * 400, now);
            gain.gain.setValueAtTime(0.02, now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(now);
            osc.stop(now + 0.035);
        } catch(e) {}
    }

    // Ambient background rhythm
    function startBgmPulse() {
        if (!bgmEnabled || !audioCtx) return;
        stopBgmPulse();
        let beat = 0;
        bgmInterval = setInterval(() => {
            if (isPaused || answerRevealed || isTyping) return;
            try {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.type = "triangle";
                const freq = (beat % 2 === 0) ? 65.4 : 82.4;
                osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
                gain.gain.setValueAtTime(0.035, audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.start();
                osc.stop(audioCtx.currentTime + 0.35);
                beat++;
            } catch(e) {}
        }, 600);
    }

    function stopBgmPulse() {
        if (bgmInterval) {
            clearInterval(bgmInterval);
            bgmInterval = null;
        }
    }

    // Crisp mechanical clock tick
    function playTickSound(isUrgent = false) {
        if (!audioCtx) return;
        try {
            const now = audioCtx.currentTime;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = isUrgent ? "triangle" : "sine";
            osc.frequency.setValueAtTime(isUrgent ? 1200 : 800, now);
            gain.gain.setValueAtTime(isUrgent ? 0.12 : 0.05, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + (isUrgent ? 0.06 : 0.04));
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(now);
            osc.stop(now + (isUrgent ? 0.06 : 0.04));
        } catch(e) {}
    }

    // Heartbeat pulse for last 3 seconds
    function playHeartbeatSound() {
        if (!audioCtx) return;
        try {
            const now = audioCtx.currentTime;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = "sine";
            osc.frequency.setValueAtTime(75, now);
            osc.frequency.exponentialRampToValueAtTime(45, now + 0.16);
            gain.gain.setValueAtTime(0.35, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(now);
            osc.stop(now + 0.18);
        } catch(e) {}
    }

    function playLockInSound() {
        if (!audioCtx) return;
        try {
            const now = audioCtx.currentTime;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = "sine";
            osc.frequency.setValueAtTime(700, now);
            osc.frequency.exponentialRampToValueAtTime(1400, now + 0.08);
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(now);
            osc.stop(now + 0.09);
        } catch(e) {}
    }

    function playBeep(freq = 600, duration = 0.12) {
        if (!audioCtx) return;
        try {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = "sine";
            osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
            gain.gain.setValueAtTime(0.18, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + duration);
        } catch(e) {}
    }

    // Cheerful chime on correct answer
    function playCelebrationSound() {
        if (!audioCtx) return;
        try {
            const notes = [523.25, 659.25, 783.99, 1046.50];
            notes.forEach((freq, i) => {
                setTimeout(() => {
                    if (!audioCtx) return;
                    const osc = audioCtx.createOscillator();
                    const gain = audioCtx.createGain();
                    osc.type = "sine";
                    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
                    gain.gain.setValueAtTime(0.18, audioCtx.currentTime);
                    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.6);
                    osc.connect(gain);
                    gain.connect(audioCtx.destination);
                    osc.start();
                    osc.stop(audioCtx.currentTime + 0.6);
                }, i * 80);
            });
        } catch(e) {}
    }

    function playWrongSound() {
        if (!audioCtx) return;
        try {
            const now = audioCtx.currentTime;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = "sawtooth";
            osc.frequency.setValueAtTime(180, now);
            osc.frequency.exponentialRampToValueAtTime(110, now + 0.25);
            gain.gain.setValueAtTime(0.12, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(now);
            osc.stop(now + 0.25);
        } catch(e) {}
    }

    // --- NATURAL AMERICAN ENGLISH VOICE TTS ---
    let selectedVoice = null;
    function loadVoices() {
        if (!('speechSynthesis' in window)) return;
        const voices = window.speechSynthesis.getVoices();
        // Priority: Natural US voices -> Google US English -> Microsoft English
        selectedVoice = voices.find(v => v.lang === 'en-US' && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Christopher') || v.name.includes('Guy') || v.name.includes('Jenny') || v.name.includes('Samantha')))
                     || voices.find(v => v.lang === 'en-US') 
                     || voices.find(v => v.lang.startsWith('en'));
    }
    if ('speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
        loadVoices();
    }

    function speakText(text, callback) {
        if (!ttsEnabled || !('speechSynthesis' in window)) {
            if (callback) callback();
            return;
        }
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        if (selectedVoice) utterance.voice = selectedVoice;
        utterance.rate = 1.05; // Energetic, high-retention rate
        utterance.pitch = 1.0;
        if (callback) {
            utterance.onend = callback;
            utterance.onerror = callback;
        }
        window.speechSynthesis.speak(utterance);
    }

    // --- AMBIENT CANVAS PARTICLES ---
    let bgStars = [];
    function setupBgCanvas() {
        const bgCanvas = document.getElementById('bg-canvas');
        if (!bgCanvas) return;
        const bgCtx = bgCanvas.getContext('2d');
        function resize() {
            bgCanvas.width = window.innerWidth;
            bgCanvas.height = window.innerHeight;
            bgStars = [];
            for (let i = 0; i < 65; i++) {
                bgStars.push({
                    x: Math.random() * bgCanvas.width,
                    y: Math.random() * bgCanvas.height,
                    radius: Math.random() * 1.6 + 0.6,
                    alpha: Math.random() * 0.7 + 0.2,
                    speed: Math.random() * 0.3 + 0.1
                });
            }
        }
        window.addEventListener('resize', resize);
        resize();

        function animateBg() {
            bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
            bgStars.forEach(star => {
                star.y -= star.speed;
                if (star.y < 0) {
                    star.y = bgCanvas.height;
                    star.x = Math.random() * bgCanvas.width;
                }
                bgCtx.beginPath();
                bgCtx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
                bgCtx.fillStyle = `rgba(147, 197, 253, ${star.alpha})`;
                bgCtx.shadowBlur = 8;
                bgCtx.shadowColor = '#38bdf8';
                bgCtx.fill();
            });
            requestAnimationFrame(animateBg);
        }
        animateBg();
    }

    // --- CONFETTI ENGINE ---
    let confettiParticles = [];
    let confettiRunning = false;
    function triggerConfetti() {
        const confCanvas = document.getElementById('confetti-canvas');
        if (!confCanvas) return;
        const confCtx = confCanvas.getContext('2d');
        confCanvas.width = confCanvas.parentElement.clientWidth;
        confCanvas.height = confCanvas.parentElement.clientHeight;
        confettiParticles = [];
        const colors = ['#ef4444', '#ffffff', '#38bdf8', '#fbbf24', '#10b981'];

        for (let i = 0; i < 90; i++) {
            confettiParticles.push({
                x: confCanvas.width / 2 + (Math.random() * 260 - 130),
                y: confCanvas.height * 0.52,
                vx: (Math.random() - 0.5) * 18,
                vy: (Math.random() * -15) - 6,
                size: Math.random() * 8 + 5,
                color: colors[Math.floor(Math.random() * colors.length)],
                rot: Math.random() * 360,
                vRot: (Math.random() - 0.5) * 14,
                alpha: 1
            });
        }
        if (!confettiRunning) {
            confettiRunning = true;
            function render() {
                confCtx.clearRect(0, 0, confCanvas.width, confCanvas.height);
                let alive = false;
                confettiParticles.forEach(p => {
                    p.x += p.vx;
                    p.y += p.vy;
                    p.vy += 0.45;
                    p.rot += p.vRot;
                    p.alpha -= 0.012;
                    if (p.alpha > 0) {
                        alive = true;
                        confCtx.save();
                        confCtx.translate(p.x, p.y);
                        confCtx.rotate((p.rot * Math.PI) / 180);
                        confCtx.globalAlpha = Math.max(0, p.alpha);
                        confCtx.fillStyle = p.color;
                        confCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.65);
                        confCtx.restore();
                    }
                });
                if (alive) requestAnimationFrame(render);
                else {
                    confCtx.clearRect(0, 0, confCanvas.width, confCanvas.height);
                    confettiRunning = false;
                }
            }
            requestAnimationFrame(render);
        }
    }

    // --- GAME ENGINE LOGIC ---
    function startIntroCountdown() {
        initAudio();
        document.getElementById('start-overlay').style.display = 'none';
        const countOverlay = document.getElementById('countdown-overlay');
        const numEl = document.getElementById('countdown-number');
        countOverlay.style.display = 'flex';

        let count = 3;
        numEl.innerText = count;
        playBeep(520, 0.15);

        const countInt = setInterval(() => {
            count--;
            if (count > 0) {
                numEl.innerText = count;
                numEl.style.animation = 'none';
                void numEl.offsetWidth;
                numEl.style.animation = 'zoomBeat 0.9s infinite ease-out';
                playBeep(520, 0.15);
            } else if (count === 0) {
                numEl.innerText = "GO! 🚀";
                playBeep(880, 0.35);
            } else {
                clearInterval(countInt);
                countOverlay.style.display = 'none';
                currentIndex = 0;
                playerScore = 0;
                currentStreak = 0;
                maxStreak = 0;
                loadQuestion();
            }
        }, 1000);
    }

    function restartQuiz() {
        document.getElementById('end-overlay').style.display = 'none';
        startIntroCountdown();
    }

    function handleUserSelection(idx) {
        if (answerRevealed || isPaused || isTyping) return;
        initAudio();
        userSelectedOption = idx;
        playLockInSound();

        for (let i = 0; i < 4; i++) {
            const btn = document.getElementById(`opt-${i}`);
            const mark = document.getElementById(`mark-${i}`);
            if (btn) {
                if (i === idx) {
                    btn.classList.add('selected-locked');
                    if (mark) {
                        mark.innerHTML = "🔒";
                        mark.style.opacity = "1";
                    }
                } else {
                    btn.classList.remove('selected-locked');
                    if (mark) {
                        mark.innerHTML = "";
                        mark.style.opacity = "0";
                    }
                }
            }
        }
    }

    // Fast, Snappy Typewriter Effect
    function typeQuestion(text, onComplete) {
        if (typingTimer) clearInterval(typingTimer);
        isTyping = true;
        currentQuestionFullText = text;

        const typedEl = document.getElementById('question-typed-text');
        const cursorEl = document.getElementById('typing-cursor');
        if (!typedEl) {
            if (onComplete) onComplete();
            return;
        }

        typedEl.innerText = "";
        if (cursorEl) cursorEl.classList.remove('finished');

        let charIndex = 0;
        const totalChars = text.length;
        // Fast typing speed (~14ms per char = finishes within 0.8s - 1.2s max)
        const typingSpeed = Math.max(10, Math.min(20, Math.floor(1000 / (totalChars || 50))));

        typingTimer = setInterval(() => {
            if (charIndex < totalChars) {
                typedEl.innerText += text[charIndex];
                if (charIndex % 3 === 0) playTypewriterTick();
                charIndex++;
            } else {
                clearInterval(typingTimer);
                typingTimer = null;
                isTyping = false;
                if (cursorEl) cursorEl.classList.add('finished');
                if (onComplete) onComplete();
            }
        }, typingSpeed);
    }

    function completeTypingInstantly() {
        if (!isTyping) return;
        if (typingTimer) {
            clearInterval(typingTimer);
            typingTimer = null;
        }
        isTyping = false;
        const typedEl = document.getElementById('question-typed-text');
        const cursorEl = document.getElementById('typing-cursor');
        if (typedEl) typedEl.innerText = currentQuestionFullText;
        if (cursorEl) cursorEl.classList.add('finished');
        startTimer();
        startBgmPulse();
    }

    function loadQuestion() {
        answerRevealed = false;
        userSelectedOption = null;
        resetTimerDisplay();
        const factCard = document.getElementById('fact-card');
        factCard.classList.remove('visible');

        if (currentIndex >= quizData.length) {
            showEndScreen();
            return;
        }

        const currentData = quizData[currentIndex];
        const currentQNum = currentIndex + 1;
        const formattedCurrent = currentQNum < 10 ? '0' + currentQNum : currentQNum;
        document.getElementById('q-current').innerText = formattedCurrent;

        // Header Round / Final Boss Badge
        const roundBadge = document.getElementById('round-badge');
        const ctaPrompt = document.getElementById('cta-prompt');
        const isLastQuestion = (currentIndex === quizData.length - 1);

        if (isLastQuestion) {
            roundBadge.innerText = "🚨 FINAL BOSS QUESTION (90% FAIL)";
            roundBadge.className = 'round-badge boss';
            if (ctaPrompt) ctaPrompt.innerText = "Can you get Question 20 right? Comment below! 👇";
        } else {
            roundBadge.innerText = currentData.round || `ROUND ${Math.floor(currentIndex / 7) + 1} • BASICS`;
            roundBadge.className = 'round-badge';
            if (ctaPrompt) ctaPrompt.innerText = "Can you score 20/20? Comment below! 👇";
        }

        // Image / Visual Frame
        const qImg = document.getElementById('q-image');
        const fallbackIcon = document.getElementById('fallback-icon');
        if (currentData.img) {
            qImg.style.display = 'block';
            fallbackIcon.style.display = 'none';
            qImg.src = currentData.img;
        } else {
            qImg.style.display = 'none';
            fallbackIcon.style.display = 'block';
            fallbackIcon.innerText = currentData.icon || "🇺🇸";
        }

        // Populate Options Grid
        const prefixes = ['A', 'B', 'C', 'D'];
        const container = document.getElementById('options-container');
        container.innerHTML = '';

        currentData.options.forEach((opt, idx) => {
            const btn = document.createElement('div');
            btn.className = `option-btn stagger-${idx}`;
            btn.id = `opt-${idx}`;
            btn.setAttribute('data-idx', idx);
            btn.onclick = () => handleUserSelection(idx);
            btn.innerHTML = `
                <div class="option-poll-bar" id="poll-bar-${idx}"></div>
                <div class="option-left">
                    <div class="option-prefix">${prefixes[idx]}</div>
                    <div class="option-text">${opt}</div>
                </div>
                <div class="option-right">
                    <span class="poll-percent" id="poll-pct-${idx}"></span>
                    <div class="status-mark" id="mark-${idx}"></div>
                </div>
            `;
            container.appendChild(btn);
        });

        document.getElementById('fact-text').innerText = currentData.fact || "Great job! Keep testing your USA trivia knowledge!";

        // Voiceover & Fast Typewriter
        speakText(currentData.q);
        typeQuestion(currentData.q, () => {
            startTimer();
            startBgmPulse();
        });
    }

    const CIRCUMFERENCE = 232.48;

    function resetTimerDisplay() {
        clearInterval(timerInterval);
        timeLeftMs = thinkingDurationMs;
        lastTickSec = Math.ceil(thinkingDurationMs / 1000);

        const timerEl = document.getElementById('timer');
        const progressEl = document.getElementById('progress-bar');
        const radialEl = document.getElementById('radial-progress');
        const canvasEl = document.getElementById('video-canvas');

        if (canvasEl) canvasEl.classList.remove('heartbeat-pulse');

        if (timerEl) {
            timerEl.innerText = lastTickSec;
            timerEl.classList.remove('urgent');
        }
        if (progressEl) {
            progressEl.classList.remove('urgent');
            progressEl.style.transition = 'none';
            progressEl.style.width = '100%';
            void progressEl.offsetWidth;
            progressEl.style.transition = 'width 0.1s linear, background 0.3s';
        }
        if (radialEl) {
            radialEl.classList.remove('urgent');
            radialEl.style.strokeDasharray = `${CIRCUMFERENCE}`;
            radialEl.style.strokeDashoffset = '0';
        }
    }

    function startTimer() {
        resetTimerDisplay();

        timerInterval = setInterval(() => {
            if (!isPaused && !answerRevealed && !isTyping) {
                timeLeftMs -= 100;
                if (timeLeftMs < 0) timeLeftMs = 0;

                const currentSec = Math.ceil(timeLeftMs / 1000);
                const timerEl = document.getElementById('timer');
                const progressEl = document.getElementById('progress-bar');
                const radialEl = document.getElementById('radial-progress');
                const canvasEl = document.getElementById('video-canvas');

                const pct = (timeLeftMs / thinkingDurationMs);

                if (timerEl) {
                    timerEl.innerText = currentSec;
                    if (currentSec <= 3 && currentSec > 0) {
                        timerEl.classList.add('urgent');
                        if (progressEl) progressEl.classList.add('urgent');
                        if (radialEl) radialEl.classList.add('urgent');
                    } else {
                        timerEl.classList.remove('urgent');
                        if (progressEl) progressEl.classList.remove('urgent');
                        if (radialEl) radialEl.classList.remove('urgent');
                    }
                }

                if (progressEl) {
                    progressEl.style.width = `${Math.max(0, pct * 100)}%`;
                }

                if (radialEl) {
                    const offset = CIRCUMFERENCE * (1 - Math.max(0, pct));
                    radialEl.style.strokeDashoffset = `${offset}`;
                }

                if (currentSec !== lastTickSec && currentSec > 0) {
                    lastTickSec = currentSec;
                    playTickSound(currentSec <= 3);

                    if (currentSec <= 3) {
                        playHeartbeatSound();
                        if (canvasEl) {
                            canvasEl.classList.remove('heartbeat-pulse');
                            void canvasEl.offsetWidth;
                            canvasEl.classList.add('heartbeat-pulse');
                        }
                    }
                }

                if (timeLeftMs <= 0) {
                    clearInterval(timerInterval);
                    revealAnswer();
                }
            }
        }, 100);
    }

    function revealAnswer() {
        if (answerRevealed) return;
        answerRevealed = true;
        clearInterval(timerInterval);
        stopBgmPulse();

        const currentData = quizData[currentIndex];
        const correctIndex = currentData.ans;
        const correctText = currentData.options[correctIndex];

        if (userSelectedOption !== null) {
            if (userSelectedOption === correctIndex) {
                playerScore++;
                currentStreak++;
                if (currentStreak > maxStreak) maxStreak = currentStreak;
                playCelebrationSound();
            } else {
                currentStreak = 0;
                playWrongSound();
            }
        } else {
            playCelebrationSound();
        }

        triggerConfetti();

        // Calculate Audience Poll Stats
        let correctStat = 78;
        if (currentData.stat) {
            const match = currentData.stat.match(/(\d+)%/);
            if (match) correctStat = parseInt(match[1]);
        }
        const remaining = 100 - correctStat;
        const wrongDistribution = [
            Math.round(remaining * 0.45),
            Math.round(remaining * 0.35),
            remaining - Math.round(remaining * 0.45) - Math.round(remaining * 0.35)
        ];
        let wrongTracker = 0;

        for (let i = 0; i < 4; i++) {
            const opt = document.getElementById(`opt-${i}`);
            const mark = document.getElementById(`mark-${i}`);
            const pollBar = document.getElementById(`poll-bar-${i}`);
            const pollPct = document.getElementById(`poll-pct-${i}`);

            let share = (i === correctIndex) ? correctStat : (wrongDistribution[wrongTracker++] || 7);

            if (pollBar) pollBar.style.width = `${share}%`;
            if (pollPct) {
                pollPct.innerText = `${share}%`;
                pollPct.classList.add('visible');
            }

            if (opt) {
                opt.classList.add('revealed');
                if (i === correctIndex) {
                    opt.classList.remove('selected-locked');
                    opt.classList.add('correct');
                    if (mark) mark.innerHTML = "✅";
                } else {
                    opt.classList.add('wrong-revealed');
                    if (i === userSelectedOption) {
                        opt.classList.add('user-wrong');
                        if (mark) mark.innerHTML = "❌";
                    } else {
                        if (mark) mark.innerHTML = "";
                    }
                }
            }
        }

        const factCard = document.getElementById('fact-card');
        factCard.classList.add('visible');

        speakText(`The correct answer is: ${correctText}!`);

        // Wait 4.5 seconds for reading the answer and fact, then move forward
        setTimeout(() => {
            if (answerRevealed) nextQuestion();
        }, 4500);
    }

    function nextQuestion() {
        clearInterval(timerInterval);
        if (typingTimer) clearInterval(typingTimer);
        currentIndex++;
        loadQuestion();
    }

    function togglePause() {
        isPaused = !isPaused;
    }

    function toggleTTS() {
        ttsEnabled = !ttsEnabled;
        const btn = document.getElementById('tts-btn');
        if (btn) btn.innerText = ttsEnabled ? "🎙️ Voice: ON" : "🔇 Voice: OFF";
        if (!ttsEnabled && 'speechSynthesis' in window) window.speechSynthesis.cancel();
    }

    function toggleBGM() {
        bgmEnabled = !bgmEnabled;
        const btn = document.getElementById('bgm-btn');
        if (btn) btn.innerText = bgmEnabled ? "🎵 BGM: ON" : "🔇 BGM: OFF";
        if (bgmEnabled && !answerRevealed && !isTyping) startBgmPulse();
        else stopBgmPulse();
    }

    function setAspectRatio(target16by9) {
        is16by9 = target16by9;
        thinkingDurationMs = is16by9 ? 7000 : 4000;
        const canvas = document.getElementById('video-canvas');
        if (canvas) {
            canvas.className = is16by9 ? 'video-canvas mode-16-9' : 'video-canvas mode-9-16';
        }
        resetTimerDisplay();
    }

    function toggleAspectRatio() {
        setAspectRatio(!is16by9);
    }

    function showEndScreen() {
        const endOverlay = document.getElementById('end-overlay');
        endOverlay.style.display = 'flex';

        const finalScoreVal = document.getElementById('final-score-val');
        const finalTierBadge = document.getElementById('final-tier-badge');
        const finalStreakStat = document.getElementById('final-streak-stat');

        if (finalScoreVal) finalScoreVal.innerText = `${playerScore}/${quizData.length}`;
        if (finalStreakStat) finalStreakStat.innerText = `Longest Streak: 🔥 ${maxStreak} in a row`;

        if (finalTierBadge) {
            if (playerScore >= 18) {
                finalTierBadge.innerText = "🏆 TRIVIA LEGEND (Top 1%)";
                finalTierBadge.style.color = "#fbbf24";
            } else if (playerScore >= 14) {
                finalTierBadge.innerText = "⭐ TRUE CHAMPION";
                finalTierBadge.style.color = "#38bdf8";
            } else if (playerScore >= 10) {
                finalTierBadge.innerText = "🚗 GREAT EFFORT";
                finalTierBadge.style.color = "#34d399";
            } else {
                finalTierBadge.innerText = "📚 TIME TO STUDY UP";
                finalTierBadge.style.color = "#f87171";
            }
        }

        speakText("Challenge completed! How did you score? Drop your score in the comments below, and subscribe for daily USA trivia!");
        window.__quiz_finished = true;
        try {
            if (window.parent && window.parent !== window) {
                window.parent.postMessage({ type: 'QUIZ_FINISHED', title: quizTitle, index: currentIndex }, '*');
            }
        } catch(e) {}
    }

    // --- CHANNEL LOGO THEME MANAGEMENT ---
    function setLogoTheme(theme) {
        currentLogoTheme = (theme === 'white') ? 'white' : 'color';
        const isWhite = (currentLogoTheme === 'white');
        const logoSrc = isWhite ? 'images/logo/logo-bw.png' : 'images/logo/logo-color.png';

        const headerLogo = document.getElementById('header-brand-logo');
        const introLogo = document.getElementById('intro-logo-img');
        const outroLogo = document.getElementById('outro-logo-img');
        const brandPill = document.getElementById('brand-pill');
        const introCard = document.getElementById('intro-logo-card');
        const outroCard = document.getElementById('outro-logo-card');
        const logoBtn = document.getElementById('logo-btn');

        if (headerLogo) headerLogo.src = logoSrc;
        if (introLogo) introLogo.src = logoSrc;
        if (outroLogo) outroLogo.src = logoSrc;

        if (brandPill) {
            if (isWhite) brandPill.classList.add('white-theme');
            else brandPill.classList.remove('white-theme');
        }
        if (introCard) {
            if (isWhite) introCard.classList.add('white-theme');
            else introCard.classList.remove('white-theme');
        }
        if (outroCard) {
            if (isWhite) outroCard.classList.add('white-theme');
            else outroCard.classList.remove('white-theme');
        }
        if (logoBtn) {
            logoBtn.innerText = isWhite ? "🎨 Logo: White" : "🎨 Logo: Color";
        }
    }

    function toggleLogoTheme() {
        setLogoTheme(currentLogoTheme === 'color' ? 'white' : 'color');
    }

    // --- KEYBOARD SHORTCUTS ---
    window.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            e.preventDefault();
            if (isTyping) completeTypingInstantly();
            else togglePause();
        } else if (e.code === 'KeyN') {
            nextQuestion();
        } else if (e.code === 'KeyV') {
            toggleTTS();
        } else if (e.code === 'KeyM') {
            toggleBGM();
        } else if (e.code === 'KeyS') {
            toggleAspectRatio();
        } else if (e.code === 'KeyL') {
            toggleLogoTheme();
        } else if (e.code === 'KeyR') {
            restartQuiz();
        } else if (!answerRevealed) {
            if (isTyping) completeTypingInstantly();
            if (e.code === 'Digit1' || e.code === 'KeyA') handleUserSelection(0);
            else if (e.code === 'Digit2' || e.code === 'KeyB') handleUserSelection(1);
            else if (e.code === 'Digit3' || e.code === 'KeyC') handleUserSelection(2);
            else if (e.code === 'Digit4' || e.code === 'KeyD') handleUserSelection(3);
        }
    });

    // Expose API
    window.quizEngine = {
        startIntroCountdown,
        restartQuiz,
        nextQuestion,
        togglePause,
        toggleTTS,
        toggleBGM,
        toggleAspectRatio,
        setAspectRatio,
        setLogoTheme,
        toggleLogoTheme,
        handleUserSelection,
        completeTypingInstantly
    };

    window.addEventListener('DOMContentLoaded', () => {
        initDOM();
        setupBgCanvas();
    });
})();
