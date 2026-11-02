/**
 * Universal Quiz Engine with Broadcast Motion Graphics & Interactive Click-to-Play
 * Designed for High-Retention YouTube Videos, Shorts, and Live Play
 */

(function() {
    const config = window.quizConfig || {};
    const quizData = config.data || [];
    const quizTitle = config.title || "USA TRIVIA QUIZ";
    const quizSubtitle = config.subtitle || "Test your knowledge with 20 challenging questions!";
    const quizCategory = config.category || "USA TRIVIA";

    let currentIndex = 0;
    let timeLeftMs = 10000;
    let lastTickSec = 10;
    let timerInterval = null;
    let isPaused = false;
    let ttsEnabled = true;
    let bgmEnabled = true;
    let is16by9 = true;
    let answerRevealed = false;

    // Interactive Game State
    let userSelectedOption = null;
    let playerScore = 0;
    let currentStreak = 0;
    let maxStreak = 0;
    let totalInteractions = 0;

    // Check URL parameters (e.g. ?mode=shorts or ?auto=1)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('mode') === 'shorts') {
        is16by9 = false;
    }

    // --- BUILD CLEAN BROADCAST DOM STRUCTURE ---
    function initDOM() {
        const modeClass = is16by9 ? 'mode-16-9' : 'mode-9-16';

        document.body.innerHTML = `
            <canvas id="bg-canvas"></canvas>
            <div class="video-canvas ${modeClass}" id="video-canvas">
                <canvas id="confetti-canvas"></canvas>

                <!-- Start Screen Overlay -->
                <div id="start-overlay" class="overlay-screen">
                    <h1>${quizTitle}</h1>
                    <p>${quizSubtitle}</p>
                    <div class="feature-pills">
                        <span class="pill">🖼️ Visual Clues & Photos</span>
                        <span class="pill">🎮 Click-to-Lock Interactive HUD</span>
                        <span class="pill">📊 Dynamic Audience Poll Bars</span>
                        <span class="pill">🎙️ American Voiceover (TTS)</span>
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

                <!-- End Scorecard Outro -->
                <div id="end-overlay" class="overlay-screen" style="display: none;">
                    <h1>CHALLENGE COMPLETED!</h1>
                    
                    <div class="interactive-score-box" id="interactive-score-box">
                        <div class="score-circle">
                            <span class="final-score-val" id="final-score-val">0/${quizData.length}</span>
                            <span class="final-score-sub">YOUR SCORE</span>
                        </div>
                        <div class="final-details">
                            <div class="final-tier-badge" id="final-tier-badge">🏆 TRIVIA LEGEND</div>
                            <div class="final-streak-stat" id="final-streak-stat">Longest Streak: 🔥 0 in a row</div>
                        </div>
                    </div>

                    <div class="sub-cta-box">
                        <span>💬 Drop Your Score in the Comments Below!</span>
                    </div>
                    
                    <div class="score-tiers">
                        <div class="tier-card"><div class="icon">🏆</div><div><h5>18 - 20 Points</h5><span>Trivia Legend!</span></div></div>
                        <div class="tier-card"><div class="icon">⭐</div><div><h5>14 - 17 Points</h5><span>True Champion!</span></div></div>
                        <div class="tier-card"><div class="icon">🚗</div><div><h5>10 - 13 Points</h5><span>Great Effort!</span></div></div>
                        <div class="tier-card"><div class="icon">📚</div><div><h5>Under 10 Points</h5><span>Time to Study Up!</span></div></div>
                    </div>

                    <p style="font-size: 1.15rem; color: #38bdf8; font-weight: 700; margin-bottom: 20px;">
                        👍 Like & Subscribe for Daily USA Trivia Quizzes!
                    </p>

                    <button class="start-btn" style="font-size: 1.25rem; padding: 12px 35px;" onclick="window.quizEngine.restartQuiz()">
                        PLAY AGAIN (R)
                    </button>
                </div>

                <!-- Main Quiz View Header -->
                <header>
                    <div class="header-left">
                        <div class="category-badge"><span>🇺🇸</span> ${quizCategory}</div>
                        <div class="round-badge" id="round-badge">ROUND 1: BASICS</div>
                        <div class="pass-rate-badge" id="pass-rate-badge"><span>👥</span> 90% Pass Rate</div>
                    </div>
                    
                    <div class="header-right">
                        <div class="hud-stats">
                            <div class="hud-pill score-pill" id="score-pill" title="Current Score">
                                <span>🏆</span>
                                <span style="color: #94a3b8; font-size: 0.82rem;">Score:</span>
                                <span class="hud-num" id="player-score">0</span>
                            </div>
                            <div class="hud-pill streak-pill" id="streak-pill" title="Current Streak">
                                <span>🔥</span>
                                <span style="color: #94a3b8; font-size: 0.82rem;">Streak:</span>
                                <span class="hud-num" id="player-streak">0</span>
                            </div>
                        </div>
                        <div class="question-counter">Question <span id="q-current">1</span>/<span id="q-total">${quizData.length}</span></div>
                    </div>
                </header>

                <!-- Stage Box with Visual Reference -->
                <div class="stage-box">
                    <div class="image-frame" id="img-frame">
                        <img id="q-image" src="" alt="Trivia Reference" onerror="this.style.display='none'; document.getElementById('fallback-icon').style.display='block';">
                        <div id="fallback-icon" class="fallback-icon" style="display: none;">🇺🇸</div>
                    </div>
                    <div class="question-content">
                        <div class="question-text" id="question">Loading Question...</div>
                    </div>
                </div>

                <!-- Radial Neon Timer & Bar -->
                <div class="timer-container" id="timer-container">
                    <div class="radial-timer-box">
                        <svg class="radial-svg" width="86" height="86" viewBox="0 0 86 86">
                            <circle class="radial-track" cx="43" cy="43" r="37" />
                            <circle class="radial-progress" id="radial-progress" cx="43" cy="43" r="37" />
                        </svg>
                        <div class="timer-number" id="timer">10</div>
                    </div>
                    <div class="progress-bar-bg"><div class="progress-bar-fill" id="progress-bar"></div></div>
                </div>

                <!-- Interactive 3D Options Grid -->
                <div class="options-grid" id="options-container"></div>

                <!-- Fact Card with Glassmorphism -->
                <div class="fact-card" id="fact-card">
                    <div class="fact-icon">💡</div>
                    <div class="fact-content">
                        <h4>Did You Know?</h4>
                        <p id="fact-text">Fun fact loading...</p>
                    </div>
                </div>

                <!-- Engagement CTA Footer -->
                <div class="engagement-bar">
                    <div class="highlight"><span>🎯</span> Click or press 1-4 to lock in your answer!</div>
                    <div class="action-prompt">Can you score 20/20? Comment below! 👇</div>
                </div>

                <!-- Hidden Controls (Hover only) -->
                <div class="controls">
                    <button class="ctrl-btn" id="bgm-btn" onclick="window.quizEngine.toggleBGM()">🎵 BGM</button>
                    <button class="ctrl-btn" id="tts-btn" onclick="window.quizEngine.toggleTTS()">🎙️ Voice</button>
                    <button class="ctrl-btn" id="aspect-btn" onclick="window.quizEngine.toggleAspectRatio()">📱 Aspect</button>
                    <button class="ctrl-btn" onclick="window.quizEngine.togglePause()">⏸️ Pause</button>
                    <button class="ctrl-btn" onclick="window.quizEngine.nextQuestion()">⏭️ Skip</button>
                </div>
            </div>
        `;

        // Check if auto-start is requested by exporter tool
        if (urlParams.get('auto') === '1') {
            setTimeout(() => {
                startIntroCountdown();
            }, 800);
        }
    }

    // --- SYNTHESIZED WEB AUDIO API ENGINE ---
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    let audioCtx = null;
    let bgmInterval = null;

    function initAudio() {
        if (!audioCtx) audioCtx = new AudioContextClass();
        if (audioCtx.state === 'suspended') audioCtx.resume();
    }

    function startBgmPulse() {
        if (!bgmEnabled || !audioCtx) return;
        stopBgmPulse();
        let beat = 0;
        bgmInterval = setInterval(() => {
            if (isPaused || answerRevealed) return;
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

    function playTickSound(isUrgent = false) {
        if (!audioCtx) return;
        try {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = isUrgent ? "triangle" : "sine";
            osc.frequency.setValueAtTime(isUrgent ? 1150 : 750, audioCtx.currentTime);
            gain.gain.setValueAtTime(isUrgent ? 0.12 : 0.05, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + (isUrgent ? 0.07 : 0.04));
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + (isUrgent ? 0.07 : 0.04));
        } catch(e) {}
    }

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
            osc.frequency.setValueAtTime(800, now);
            osc.frequency.exponentialRampToValueAtTime(1450, now + 0.08);
            gain.gain.setValueAtTime(0.22, now);
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

    function playCelebrationSound() {
        if (!audioCtx) return;
        try {
            const notes = [523.25, 659.25, 783.99, 1046.50];
            notes.forEach((freq, i) => {
                setTimeout(() => {
                    const osc = audioCtx.createOscillator();
                    const gain = audioCtx.createGain();
                    osc.type = "sine";
                    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
                    gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
                    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.65);
                    osc.connect(gain);
                    gain.connect(audioCtx.destination);
                    osc.start();
                    osc.stop(audioCtx.currentTime + 0.65);
                }, i * 90);
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
            osc.frequency.setValueAtTime(190, now);
            osc.frequency.exponentialRampToValueAtTime(110, now + 0.28);
            gain.gain.setValueAtTime(0.14, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(now);
            osc.stop(now + 0.28);
        } catch(e) {}
    }

    function playStreakSound() {
        if (!audioCtx) return;
        try {
            const now = audioCtx.currentTime;
            [440, 554.37, 659.25, 880].forEach((freq, idx) => {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.type = "triangle";
                osc.frequency.setValueAtTime(freq, now + idx * 0.06);
                gain.gain.setValueAtTime(0.14, now + idx * 0.06);
                gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.22);
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.start(now + idx * 0.06);
                osc.stop(now + idx * 0.06 + 0.22);
            });
        } catch(e) {}
    }

    // --- NATURAL AMERICAN ENGLISH TTS ---
    let selectedVoice = null;
    function loadVoices() {
        if (!('speechSynthesis' in window)) return;
        const voices = window.speechSynthesis.getVoices();
        selectedVoice = voices.find(v => v.lang === 'en-US' && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('David') || v.name.includes('Zira'))) 
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
        utterance.rate = 1.02;
        utterance.pitch = 1.0;
        if (callback) {
            utterance.onend = callback;
            utterance.onerror = callback;
        }
        window.speechSynthesis.speak(utterance);
    }

    // --- BACKGROUND STARS & AMBIENT CANVAS ---
    let bgStars = [];
    function setupBgCanvas() {
        const bgCanvas = document.getElementById('bg-canvas');
        if (!bgCanvas) return;
        const bgCtx = bgCanvas.getContext('2d');
        function resize() {
            bgCanvas.width = window.innerWidth;
            bgCanvas.height = window.innerHeight;
            bgStars = [];
            for (let i = 0; i < 75; i++) {
                bgStars.push({
                    x: Math.random() * bgCanvas.width,
                    y: Math.random() * bgCanvas.height,
                    radius: Math.random() * 1.8 + 0.6,
                    alpha: Math.random() * 0.8 + 0.2,
                    speed: Math.random() * 0.35 + 0.1
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

    // --- CONFETTI & SPARKS ENGINE ---
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

    // --- GAME ENGINE ---
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
                totalInteractions = 0;
                updateHUD(false);
                loadQuestion();
            }
        }, 1000);
    }

    function restartQuiz() {
        document.getElementById('end-overlay').style.display = 'none';
        startIntroCountdown();
    }

    function updateHUD(animate = true) {
        const scoreEl = document.getElementById('player-score');
        const streakEl = document.getElementById('player-streak');
        const streakPill = document.getElementById('streak-pill');
        const scorePill = document.getElementById('score-pill');

        if (scoreEl) scoreEl.innerText = playerScore;
        if (streakEl) streakEl.innerText = currentStreak;

        if (streakPill) {
            if (currentStreak >= 2) {
                streakPill.classList.add('on-fire');
            } else {
                streakPill.classList.remove('on-fire');
            }
        }

        if (animate) {
            if (scorePill) {
                scorePill.classList.remove('pop');
                void scorePill.offsetWidth;
                scorePill.classList.add('pop');
            }
        }
    }

    function handleUserSelection(idx) {
        if (answerRevealed || isPaused) return;
        initAudio();
        userSelectedOption = idx;
        totalInteractions++;
        playLockInSound();

        // Update option button highlights
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
        document.getElementById('q-current').innerText = currentIndex + 1;
        document.getElementById('q-total').innerText = quizData.length;
        
        const roundBadge = document.getElementById('round-badge');
        roundBadge.innerText = currentData.round || (currentIndex === 19 ? "🚨 FINAL BOSS QUESTION" : `ROUND ${Math.floor(currentIndex / 7) + 1}`);
        if (currentIndex === quizData.length - 1) {
            roundBadge.className = 'round-badge boss';
        } else {
            roundBadge.className = 'round-badge';
        }

        document.getElementById('pass-rate-badge').innerHTML = `<span>👥</span> ${currentData.stat || '85% of Americans know this'}`;

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

        const qElement = document.getElementById('question');
        qElement.innerText = currentData.q;
        qElement.style.animation = 'none';
        void qElement.offsetWidth;
        qElement.style.animation = 'fadeInScale 0.45s cubic-bezier(0.22, 1, 0.36, 1)';

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

        speakText(currentData.q);
        startTimer();
        startBgmPulse();
    }

    // Circumference of r=37 circle is 2 * PI * 37 ≈ 232.48px
    const CIRCUMFERENCE = 232.48;

    function resetTimerDisplay() {
        clearInterval(timerInterval);
        timeLeftMs = 10000;
        lastTickSec = 10;

        const timerEl = document.getElementById('timer');
        const progressEl = document.getElementById('progress-bar');
        const radialEl = document.getElementById('radial-progress');
        const canvasEl = document.getElementById('video-canvas');

        if (canvasEl) canvasEl.classList.remove('heartbeat-pulse');

        if (timerEl) {
            timerEl.innerText = '10';
            timerEl.classList.remove('urgent');
        }
        if (progressEl) {
            progressEl.classList.remove('urgent');
            progressEl.style.transition = 'none';
            progressEl.style.width = '100%';
            void progressEl.offsetWidth; // Force instant reflow
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
            if (!isPaused && !answerRevealed) {
                timeLeftMs -= 100;
                if (timeLeftMs < 0) timeLeftMs = 0;

                const currentSec = Math.ceil(timeLeftMs / 1000);
                const timerEl = document.getElementById('timer');
                const progressEl = document.getElementById('progress-bar');
                const radialEl = document.getElementById('radial-progress');
                const canvasEl = document.getElementById('video-canvas');

                const pct = (timeLeftMs / 10000);

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
                    progressEl.style.width = `${pct * 100}%`;
                }

                if (radialEl) {
                    const offset = CIRCUMFERENCE * (1 - pct);
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

        // Grade user choice if they interacted
        if (userSelectedOption !== null) {
            if (userSelectedOption === correctIndex) {
                playerScore++;
                currentStreak++;
                if (currentStreak > maxStreak) maxStreak = currentStreak;
                playCelebrationSound();
                if (currentStreak >= 2) playStreakSound();
                updateHUD(true);
            } else {
                currentStreak = 0;
                playWrongSound();
                updateHUD(true);
            }
        } else {
            // Passive viewer mode
            playCelebrationSound();
        }

        triggerConfetti();

        // Calculate dynamic poll statistics
        let correctStat = 76;
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
        let wrongIdxTracker = 0;

        for (let i = 0; i < 4; i++) {
            const opt = document.getElementById(`opt-${i}`);
            const mark = document.getElementById(`mark-${i}`);
            const pollBar = document.getElementById(`poll-bar-${i}`);
            const pollPct = document.getElementById(`poll-pct-${i}`);

            let share = (i === correctIndex) ? correctStat : (wrongDistribution[wrongIdxTracker++] || 8);

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

        setTimeout(() => {
            if (answerRevealed) nextQuestion();
        }, 5000);
    }

    function nextQuestion() {
        clearInterval(timerInterval);
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
        if (bgmEnabled && !answerRevealed) startBgmPulse();
        else stopBgmPulse();
    }

    function setAspectRatio(target16by9) {
        is16by9 = target16by9;
        const canvas = document.getElementById('video-canvas');
        if (canvas) {
            canvas.className = is16by9 ? 'video-canvas mode-16-9' : 'video-canvas mode-9-16';
        }
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
        // Signal completion for external recorder tool
        window.__quiz_finished = true;
    }

    // --- KEYBOARD LISTENERS ---
    window.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            e.preventDefault();
            togglePause();
        } else if (e.code === 'KeyN') {
            nextQuestion();
        } else if (e.code === 'KeyV') {
            toggleTTS();
        } else if (e.code === 'KeyM') {
            toggleBGM();
        } else if (e.code === 'KeyS') {
            toggleAspectRatio();
        } else if (e.code === 'KeyR') {
            restartQuiz();
        } else if (!answerRevealed) {
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
        handleUserSelection
    };

    window.addEventListener('DOMContentLoaded', () => {
        initDOM();
        setupBgCanvas();
    });
})();
