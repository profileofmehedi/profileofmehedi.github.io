/**
 * Teleprompter & Voiceover Director System
 * Provides auto-scroll reading prompter, 2-way presentation sync, timing tracker & 1-click TTS exporter.
 */

class TeleprompterApp {
    constructor() {
        this.slides = window.SLIDES_DATA || [];
        this.currentIndex = 0;
        this.channel = new BroadcastChannel('ai_security_slides_channel');
        
        // Autoscroll state
        this.isScrolling = false;
        this.scrollSpeed = 1.6; // pixels per step
        this.scrollAnimationId = null;

        // Timer state
        this.elapsedSeconds = 0;
        this.timerInterval = null;
        this.isTimerRunning = false;

        this.initDOM();
        this.setupBroadcastChannel();
        this.renderSlidesList();
        this.loadSlide(0);
        this.setupKeyboardShortcuts();
    }

    initDOM() {
        this.prompterScrollView = document.getElementById('prompter-scroll');
        this.scriptContainer = document.getElementById('script-content');
        this.slidesListContainer = document.getElementById('slides-list');
        
        // Mini Preview Elements
        this.previewBadge = document.getElementById('preview-badge');
        this.previewTitle = document.getElementById('preview-title');
        this.previewBullets = document.getElementById('preview-bullets');

        // Header Stats
        this.statSlideNumber = document.getElementById('stat-slide-num');
        this.statSlideTotal = document.getElementById('stat-slide-total');
        this.statTimer = document.getElementById('stat-elapsed-timer');
        this.statTargetTime = document.getElementById('stat-target-time');
        this.statWordCount = document.getElementById('stat-word-count');

        // Controls
        this.playPauseBtn = document.getElementById('play-pause-btn');
        this.prevSlideBtn = document.getElementById('prompter-prev-btn');
        this.nextSlideBtn = document.getElementById('prompter-next-btn');
        this.copyScriptBtn = document.getElementById('copy-script-btn');
        this.resetTimerBtn = document.getElementById('reset-timer-btn');
        this.speedSlider = document.getElementById('scroll-speed-slider');
        this.speedValueLbl = document.getElementById('speed-value');
        this.fontSizeSlider = document.getElementById('font-size-slider');
        this.toast = document.getElementById('copy-toast');

        // Total Target Time display
        if (window.TOTAL_SCRIPT_INFO) {
            const mins = Math.floor(window.TOTAL_SCRIPT_INFO.estimatedTotalSeconds / 60);
            const secs = window.TOTAL_SCRIPT_INFO.estimatedTotalSeconds % 60;
            this.statTargetTime.innerText = `${mins}:${secs.toString().padStart(2, '0')}`;
            this.statSlideTotal.innerText = window.TOTAL_SCRIPT_INFO.totalSlides.toString().padStart(2, '0');
        }

        // Event Listeners
        this.playPauseBtn.addEventListener('click', () => this.toggleScroll());
        this.prevSlideBtn.addEventListener('click', () => this.goToSlide(this.currentIndex - 1));
        this.nextSlideBtn.addEventListener('click', () => this.goToSlide(this.currentIndex + 1));
        this.copyScriptBtn.addEventListener('click', () => this.copyCurrentScript());
        this.resetTimerBtn.addEventListener('click', () => this.resetTimer());

        this.speedSlider.addEventListener('input', (e) => {
            this.scrollSpeed = parseFloat(e.target.value);
            this.speedValueLbl.innerText = `${this.scrollSpeed.toFixed(1)}x`;
        });

        this.fontSizeSlider.addEventListener('input', (e) => {
            const sz = e.target.value;
            document.documentElement.style.setProperty('--font-size-prompter', `${sz}px`);
        });
    }

    setupBroadcastChannel() {
        if (window.BroadcastChannel) {
            this.channel = new BroadcastChannel('ai_security_slides_channel');
            this.channel.onmessage = (e) => this.handleIncomingMessage(e.data);
        }

        window.addEventListener('storage', (e) => {
            if (e.key === 'ai_security_slide_state' && e.newValue) {
                try {
                    const data = JSON.parse(e.newValue);
                    this.handleIncomingMessage(data);
                } catch (err) {}
            }
        });

        // Query current state from presenter window
        this.sendCommand({ type: 'REQUEST_STATE' });
    }

    handleIncomingMessage(data) {
        if (!data) return;
        if (data.type === 'STATE_UPDATE' && typeof data.currentIndex === 'number') {
            if (data.currentIndex !== this.currentIndex) {
                this.loadSlide(data.currentIndex, false);
            }
        }
    }

    sendCommand(payload) {
        if (this.channel) {
            this.channel.postMessage(payload);
        }
        try {
            payload.timestamp = Date.now();
            localStorage.setItem('ai_security_slide_command', JSON.stringify(payload));
        } catch (e) {}
    }

    renderSlidesList() {
        this.slidesListContainer.innerHTML = '';
        this.slides.forEach((s, idx) => {
            const item = document.createElement('div');
            item.className = `slide-nav-item ${idx === this.currentIndex ? 'active' : ''}`;
            item.innerHTML = `
                <div class="nav-idx">${(idx + 1).toString().padStart(2, '0')}</div>
                <div class="nav-text">
                    <div class="nav-title">${s.title}</div>
                    <div class="nav-time">⏳ ~${s.script.durationSec} সেকেন্ড • ${s.badge}</div>
                </div>
            `;
            item.addEventListener('click', () => {
                this.goToSlide(idx);
            });
            this.slidesListContainer.appendChild(item);
        });
    }

    loadSlide(index, notifyPresenter = true) {
        if (index < 0 || index >= this.slides.length) return;
        this.currentIndex = index;
        const slide = this.slides[index];

        // Update Nav List Selection
        const items = this.slidesListContainer.querySelectorAll('.slide-nav-item');
        items.forEach((it, i) => {
            it.classList.toggle('active', i === index);
        });

        // Update Mini Preview
        this.previewBadge.innerText = slide.badge;
        this.previewTitle.innerText = `${index + 1}. ${slide.title}`;
        this.previewBullets.innerHTML = `
            <div style="color: var(--accent-cyan); font-weight: 500;">• ${slide.subtitle}</div>
            <div style="font-size: 11px; color: var(--text-secondary); margin-top: 4px;">ইনফোগ্রাফিক: ${slide.infographicType}</div>
        `;

        // Update Header Stats
        this.statSlideNumber.innerText = (index + 1).toString().padStart(2, '0');
        const wordCount = slide.script.bengali.split(/\s+/).length;
        this.statWordCount.innerText = `${wordCount} শব্দ (~${slide.script.durationSec}s)`;

        // Format and inject reading script
        this.scriptContainer.innerHTML = this.formatScriptText(slide.script.bengali);

        // Reset scroll position to top
        this.prompterScrollView.scrollTop = 0;

        // Notify Presenter if requested
        if (notifyPresenter) {
            this.sendCommand({
                type: 'GOTO_SLIDE',
                index: this.currentIndex
            });
        }
    }

    formatScriptText(rawText) {
        // Highlight sound cues [SOUND EFFECT: ...] or [SLIDE TRANSITION: ...]
        let formatted = rawText.replace(/\[([^\]]+)\]/g, (match, p1) => {
            return `<div class="sound-fx-tag">⚡ ${p1}</div>`;
        });

        // Highlight technical buzzwords
        const techTerms = [
            'প্রম্পট ইনজেকশন', 'জেলব্রেকিং', 'এআই গার্ডরেইল', 'জিরো ট্রাস্ট',
            'মেম্বারশিপ ইনভার্সন', 'মডেল ইনভার্সন', 'ট্রেনিং ডেটা পয়জনিং',
            'অটোনোমাস এআই', 'কনফিউজড ডেপুটি প্রবলেম', 'ল্যাঙ্গুয়েজ মডেল', 'LLM', 'AI'
        ];

        techTerms.forEach(term => {
            const regex = new RegExp(`(${term})`, 'gi');
            formatted = formatted.replace(regex, `<span class="tech-highlight">$1</span>`);
        });

        return formatted;
    }

    goToSlide(index) {
        if (index >= 0 && index < this.slides.length) {
            if (window.MotionAudio) window.MotionAudio.playStepTick();
            this.loadSlide(index, true);
        }
    }

    toggleScroll() {
        if (this.isScrolling) {
            this.stopScroll();
        } else {
            this.startScroll();
        }
    }

    startScroll() {
        this.isScrolling = true;
        this.playPauseBtn.innerHTML = `<span>⏸</span> PAUSE`;
        this.playPauseBtn.classList.add('active-play');
        this.startTimer();

        const scrollStep = () => {
            if (!this.isScrolling) return;

            this.prompterScrollView.scrollTop += this.scrollSpeed;
            
            // Auto advance slide if scrolled to very end
            const maxScroll = this.prompterScrollView.scrollHeight - this.prompterScrollView.clientHeight;
            if (this.prompterScrollView.scrollTop >= maxScroll - 5) {
                // At end of this slide's script
                if (this.currentIndex < this.slides.length - 1) {
                    setTimeout(() => {
                        if (this.isScrolling) {
                            this.goToSlide(this.currentIndex + 1);
                        }
                    }, 1200);
                } else {
                    this.stopScroll();
                }
            }

            this.scrollAnimationId = requestAnimationFrame(scrollStep);
        };

        this.scrollAnimationId = requestAnimationFrame(scrollStep);
    }

    stopScroll() {
        this.isScrolling = false;
        if (this.scrollAnimationId) {
            cancelAnimationFrame(this.scrollAnimationId);
            this.scrollAnimationId = null;
        }
        this.playPauseBtn.innerHTML = `<span>▶</span> AUTO SCROLL`;
        this.playPauseBtn.classList.remove('active-play');
    }

    startTimer() {
        if (this.isTimerRunning) return;
        this.isTimerRunning = true;
        this.timerInterval = setInterval(() => {
            this.elapsedSeconds++;
            const mins = Math.floor(this.elapsedSeconds / 60);
            const secs = this.elapsedSeconds % 60;
            this.statTimer.innerText = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }, 1000);
    }

    resetTimer() {
        this.elapsedSeconds = 0;
        this.statTimer.innerText = "00:00";
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.isTimerRunning = false;
        }
    }

    copyCurrentScript() {
        const slide = this.slides[this.currentIndex];
        if (!slide) return;

        // Clean out bracketed sound cues for pure TTS reading if desired
        const cleanScript = slide.script.bengali
            .replace(/\[.*?\]\n?/g, '')
            .trim();

        navigator.clipboard.writeText(cleanScript).then(() => {
            if (window.MotionAudio) window.MotionAudio.playChime();
            this.showToast(`স্লাইড ${this.currentIndex + 1}-এর স্ক্রিপ্ট কপি হয়েছে!`);
        }).catch(err => {
            console.error('Copy failed:', err);
        });
    }

    showToast(msg) {
        this.toast.innerText = `✓ ${msg}`;
        this.toast.classList.add('show');
        setTimeout(() => {
            this.toast.classList.remove('show');
        }, 2500);
    }

    setupKeyboardShortcuts() {
        window.addEventListener('keydown', (e) => {
            // Spacebar: Play / Pause autoscroll
            if (e.code === 'Space' && e.target.tagName !== 'INPUT') {
                e.preventDefault();
                this.toggleScroll();
            }
            // Arrow Right / PageDown: Next Slide
            else if (e.key === 'ArrowRight' || e.key === 'PageDown') {
                e.preventDefault();
                this.goToSlide(this.currentIndex + 1);
            }
            // Arrow Left / PageUp: Prev Slide
            else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
                e.preventDefault();
                this.goToSlide(this.currentIndex - 1);
            }
            // Key 'C': Copy Script
            else if (e.key.toLowerCase() === 'c' && e.ctrlKey === false && e.metaKey === false) {
                this.copyCurrentScript();
            }
            // Up/Down arrows adjust speed when scrolling
            else if (e.key === 'ArrowUp') {
                e.preventDefault();
                this.speedSlider.value = Math.min(4.0, parseFloat(this.speedSlider.value) + 0.2);
                this.speedSlider.dispatchEvent(new Event('input'));
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                this.speedSlider.value = Math.max(0.6, parseFloat(this.speedSlider.value) - 0.2);
                this.speedSlider.dispatchEvent(new Event('input'));
            }
        });
    }
}

window.addEventListener('DOMContentLoaded', () => {
    window.teleprompterApp = new TeleprompterApp();
});
