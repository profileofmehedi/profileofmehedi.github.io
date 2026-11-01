/**
 * Universal Quiz Engine for YouTube Trivia Videos & Shorts
 * Clean Broadcast-Ready Design (No recording watermarks or clutter)
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
                        <span class="pill">🎙️ American Voiceover (TTS)</span>
                        <span class="pill">📊 % Pass Rate Public Stats</span>
                        <span class="pill">🎵 Game Show Suspense BGM</span>
                        <span class="pill">🚨 Question 20 Final Boss</span>
                    </div>

                    <button class="start-btn" id="start-btn" onclick="window.quizEngine.startIntroCountdown()">
                        START TRIVIA QUIZ
                    </button>
                    <div style="margin-top: 20px; font-size: 0.9rem; color: #64748b;">
                        Press <b>F11</b> for Fullscreen • Press <b>Space</b> to Pause
                    </div>
                </div>

                <!-- 3-2-1 Countdown Overlay -->
                <div id="countdown-overlay" style="display: none;">
                    <div class="countdown-big-number" id="countdown-number">3</div>
                    <p style="font-size: 1.6rem; color: #38bdf8; font-weight: 800; margin-top: 15px;">GET READY...</p>
                </div>

                <!-- End Scorecard Outro -->
                <div id="end-overlay" class="overlay-screen" style="display: none;">
                    <h1>CHALLENGE COMPLETED!</h1>
                    <div class="sub-cta-box">
                        <span>💬 Drop Your Score in the Comments Below!</span>
                    </div>
                    <div class="score-tiers">
                        <div class="tier-card"><div class="icon">🏆</div><div><h5>18 - 20 Points</h5><span>Trivia Legend!</span></div></div>
                        <div class="tier-card"><div class="icon">⭐</div><div><h5>14 - 17 Points</h5><span>True Champion!</span></div></div>
                        <div class="tier-card"><div class="icon">🚗</div><div><h5>10 - 13 Points</h5><span>Great Effort!</span></div></div>
                        <div class="tier-card"><div class="icon">📚</div><div><h5>Under 10 Points</h5><span>Time to Study Up!</span></div></div>
                    </div>
                    <p style="font-size: 1.15rem; color: #38bdf8; font-weight: 700;">
                        👍 Like & Subscribe for Daily USA Trivia Quizzes!
                    </p>
                    <button class="start-btn" style="font-size: 1.25rem; padding: 12px 35px;" onclick="window.quizEngine.restartQuiz()">
                        PLAY AGAIN (R)
                    </button>
                </div>

                <!-- Main Quiz View -->
                <header>
                    <div class="header-left">
                        <div class="category-badge"><span>🇺🇸</span> ${quizCategory}</div>
                        <div class="round-badge" id="round-badge">ROUND 1: BASICS</div>
                        <div class="pass-rate-badge" id="pass-rate-badge"><span>👥</span> 90% Pass Rate</div>
                    </div>
                    <div class="question-counter">Question <span id="q-current">1</span>/<span id="q-total">${quizData.length}</span></div>
                </header>

                <div class="stage-box">
                    <div class="image-frame" id="img-frame">
                        <img id="q-image" src="" alt="Trivia Reference" onerror="this.style.display='none'; document.getElementById('fallback-icon').style.display='block';">
                        <div id="fallback-icon" class="fallback-icon" style="display: none;">🇺🇸</div>
                    </div>
                    <div class="question-content">
                        <div class="question-text" id="question">Loading Question...</div>
                    </div>
                </div>

                <div class="timer-container">
                    <div class="timer-number" id="timer">10</div>
                    <div class="progress-bar-bg"><div class="progress-bar-fill" id="progress-bar"></div></div>
                </div>

                <div class="options-grid" id="options-container"></div>

                <div class="fact-card" id="fact-card">
                    <div class="fact-icon">💡</div>
                    <div class="fact-content">
                        <h4>Did You Know?</h4>
                        <p id="fact-text">Fun fact loading...</p>
                    </div>
                </div>

                <div class="engagement-bar">
                    <div class="highlight"><span>🎯</span> Play along & count your correct answers!</div>
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

    // --- WEB AUDIO API ENGINE ---
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
                    gain.gain.setValueAtTime(0.18, audioCtx.currentTime);
                    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.65);
                    osc.connect(gain);
                    gain.connect(audioCtx.destination);
                    osc.start();
                    osc.stop(audioCtx.currentTime + 0.65);
                }, i * 100);
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

    // --- BACKGROUND STARS ---
    let bgStars = [];
    function setupBgCanvas() {
        const bgCanvas = document.getElementById('bg-canvas');
        if (!bgCanvas) return;
        const bgCtx = bgCanvas.getContext('2d');
        function resize() {
            bgCanvas.width = window.innerWidth;
            bgCanvas.height = window.innerHeight;
            bgStars = [];
            for (let i = 0; i < 70; i++) {
                bgStars.push({
                    x: Math.random() * bgCanvas.width,
                    y: Math.random() * bgCanvas.height,
                    radius: Math.random() * 1.8 + 0.6,
                    alpha: Math.random() * 0.8 + 0.2,
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

        for (let i = 0; i < 85; i++) {
            confettiParticles.push({
                x: confCanvas.width / 2 + (Math.random() * 250 - 125),
                y: confCanvas.height * 0.55,
                vx: (Math.random() - 0.5) * 16,
                vy: (Math.random() * -14) - 5,
                size: Math.random() * 8 + 5,
                color: colors[Math.floor(Math.random() * colors.length)],
                rot: Math.random() * 360,
                vRot: (Math.random() - 0.5) * 12,
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
                        confCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
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
                loadQuestion();
            }
        }, 1000);
    }

    function restartQuiz() {
        document.getElementById('end-overlay').style.display = 'none';
        startIntroCountdown();
    }

    function loadQuestion() {
        answerRevealed = false;
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
        qElement.style.animation = 'fadeInScale 0.4s ease';

        const prefixes = ['A', 'B', 'C', 'D'];
        const container = document.getElementById('options-container');
        container.innerHTML = '';

        currentData.options.forEach((opt, idx) => {
            const btn = document.createElement('div');
            btn.className = 'option-btn';
            btn.id = `opt-${idx}`;
            btn.innerHTML = `
                <div class="option-left">
                    <div class="option-prefix">${prefixes[idx]}</div>
                    <div>${opt}</div>
                </div>
                <div class="status-mark" id="mark-${idx}"></div>
            `;
            container.appendChild(btn);
        });

        document.getElementById('fact-text').innerText = currentData.fact || "Great job! Keep testing your USA trivia knowledge!";

        speakText(currentData.q);
        startTimer();
        startBgmPulse();
    }

    function resetTimerDisplay() {
        clearInterval(timerInterval);
        timeLeftMs = 10000;
        lastTickSec = 10;

        const timerEl = document.getElementById('timer');
        const progressEl = document.getElementById('progress-bar');
        if (timerEl) {
            timerEl.innerText = '10';
            timerEl.classList.remove('urgent');
        }
        if (progressEl) {
            progressEl.classList.remove('urgent');
            progressEl.style.transition = 'none';
            progressEl.style.width = '100%';
            void progressEl.offsetWidth; // Force instant reflow so bar snaps to 100%
            progressEl.style.transition = 'width 0.1s linear, background 0.3s';
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

                if (timerEl) {
                    timerEl.innerText = currentSec;
                    if (currentSec <= 3 && currentSec > 0) {
                        timerEl.classList.add('urgent');
                        if (progressEl) progressEl.classList.add('urgent');
                    } else {
                        timerEl.classList.remove('urgent');
                        if (progressEl) progressEl.classList.remove('urgent');
                    }
                }

                if (progressEl) {
                    const pct = (timeLeftMs / 10000) * 100;
                    progressEl.style.width = `${pct}%`;
                }

                if (currentSec !== lastTickSec && currentSec > 0) {
                    lastTickSec = currentSec;
                    playTickSound(currentSec <= 3);
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

        playCelebrationSound();
        triggerConfetti();

        for (let i = 0; i < 4; i++) {
            const opt = document.getElementById(`opt-${i}`);
            const mark = document.getElementById(`mark-${i}`);
            if (i === correctIndex) {
                opt.classList.add('correct');
                mark.innerHTML = "✅";
            } else {
                opt.classList.add('wrong-revealed');
                mark.innerHTML = "❌";
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
        document.getElementById('end-overlay').style.display = 'flex';
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
        setAspectRatio
    };

    window.addEventListener('DOMContentLoaded', () => {
        initDOM();
        setupBgCanvas();
    });
})();
