/**
 * Global Standard Presenter Engine (Clean & Spacious Video Masterclass)
 * Supports 15 Uncluttered Slides, Real AI Generated Infographics,
 * Procedural Sound Engine, Camera Dolly, and Dynamic Timeline.
 */

class SlidePresenter {
    constructor() {
        this.slides = window.SLIDES_DATA || [];
        this.currentIndex = 0;
        this.visualizer = null;
        this.channel = null;

        // Auto-Play Timeline state
        this.isPlaying = false;
        this.autoPlayTimer = null;
        this.progressInterval = null;

        this.initDOM();
        this.initThreeJS();
        this.setupBroadcastChannel();
        this.setupKeyboardShortcuts();
        this.renderChapterTimeline();
        this.renderSlide(0);
    }

    initDOM() {
        this.slideContainer = document.getElementById('slide-content');
        this.slideCounter = document.getElementById('slide-counter');
        this.slideTotal = document.getElementById('slide-total');
        this.prevBtn = document.getElementById('prev-btn');
        this.nextBtn = document.getElementById('next-btn');
        this.fullscreenBtn = document.getElementById('fullscreen-btn');
        this.prompterBtn = document.getElementById('open-prompter-btn');
        this.soundBtn = document.getElementById('sound-toggle-btn');
        this.autoPlayBtn = document.getElementById('autoplay-btn');
        this.chapterTimeline = document.getElementById('chapter-timeline');

        if (this.slideTotal) {
            this.slideTotal.innerText = this.slides.length.toString().padStart(2, '0');
        }

        if (this.prevBtn) this.prevBtn.addEventListener('click', () => this.prevSlide());
        if (this.nextBtn) this.nextBtn.addEventListener('click', () => this.nextSlide());
        if (this.fullscreenBtn) this.fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
        if (this.prompterBtn) this.prompterBtn.addEventListener('click', () => this.openTeleprompterWindow());
        if (this.soundBtn) this.soundBtn.addEventListener('click', () => this.toggleSound());
        if (this.autoPlayBtn) this.autoPlayBtn.addEventListener('click', () => this.toggleAutoPlay());
    }

    initThreeJS() {
        try {
            if (window.AISecurityVisualizer) {
                this.visualizer = new window.AISecurityVisualizer('three-canvas-container');
            }
        } catch (err) {
            console.warn("Three.js WebGL visualizer could not initialize (continuing in 2D mode):", err);
        }
    }

    setupBroadcastChannel() {
        if (window.BroadcastChannel) {
            this.channel = new BroadcastChannel('ai_security_slides_channel');
            this.channel.onmessage = (e) => this.handleIncomingMessage(e.data);
        }

        window.addEventListener('storage', (e) => {
            if (e.key === 'ai_security_slide_command' && e.newValue) {
                try {
                    const data = JSON.parse(e.newValue);
                    this.handleIncomingMessage(data);
                } catch (err) {}
            }
        });

        this.broadcastCurrentState();
    }

    handleIncomingMessage(data) {
        if (!data) return;
        if (data.type === 'GOTO_SLIDE' && typeof data.index === 'number') {
            this.renderSlide(data.index, false);
        } else if (data.type === 'REQUEST_STATE') {
            this.broadcastCurrentState();
        }
    }

    broadcastCurrentState() {
        const payload = {
            type: 'STATE_UPDATE',
            currentIndex: this.currentIndex,
            totalSlides: this.slides.length,
            currentSlide: this.slides[this.currentIndex],
            timestamp: Date.now()
        };

        if (this.channel) {
            this.channel.postMessage(payload);
        }

        try {
            localStorage.setItem('ai_security_slide_state', JSON.stringify(payload));
        } catch (e) {}
    }

    renderChapterTimeline() {
        if (!this.chapterTimeline) return;
        this.chapterTimeline.innerHTML = '';
        this.slides.forEach((s, idx) => {
            const seg = document.createElement('div');
            seg.className = `timeline-segment ${idx === this.currentIndex ? 'active' : ''} ${idx < this.currentIndex ? 'completed' : ''}`;
            seg.title = `অধ্যায় ${idx + 1}: ${s.title}`;
            seg.innerHTML = `
                <div class="segment-fill" id="seg-fill-${idx}"></div>
                <div class="segment-label">${idx + 1}</div>
            `;
            seg.addEventListener('click', () => this.renderSlide(idx));
            this.chapterTimeline.appendChild(seg);
        });
    }

    updateTimelineState() {
        if (!this.chapterTimeline) return;
        const segments = this.chapterTimeline.querySelectorAll('.timeline-segment');
        segments.forEach((seg, idx) => {
            seg.classList.toggle('active', idx === this.currentIndex);
            seg.classList.toggle('completed', idx < this.currentIndex);
            const fill = seg.querySelector('.segment-fill');
            if (fill) {
                if (idx < this.currentIndex) fill.style.width = '100%';
                else if (idx > this.currentIndex) fill.style.width = '0%';
            }
        });
    }

    renderSlide(index, shouldBroadcast = true) {
        if (index < 0 || index >= this.slides.length) return;
        this.currentIndex = index;
        const slide = this.slides[index];

        // Trigger Procedural Audio SFX safely
        if (window.MotionAudio) {
            window.MotionAudio.playWhoosh();
            if (slide.theme === 'threat-red') {
                setTimeout(() => window.MotionAudio.playSubDrop(), 180);
            } else if (slide.theme === 'threat-amber') {
                setTimeout(() => window.MotionAudio.playGlitch(), 180);
            } else if (slide.theme.startsWith('defense')) {
                setTimeout(() => window.MotionAudio.playChime(), 200);
            }
        }

        // Animate slide out
        this.slideContainer.classList.remove('slide-active');
        this.slideContainer.classList.add('slide-enter');

        setTimeout(() => {
            // Update Body Theme
            document.body.className = `theme-${slide.theme}`;

            // Update Three.js 3D Visualizer & Camera Dolly
            if (this.visualizer) {
                this.visualizer.setTheme(slide.theme, index);
            }

            // Update Counter
            if (this.slideCounter) {
                this.slideCounter.innerText = (index + 1).toString().padStart(2, '0');
            }

            this.updateTimelineState();

            // Generate Infographic HTML based on type
            const infographicHTML = this.buildInfographicHTML(slide);

            // Generate Clean Highlight Pills (Zero Clutter)
            const pillsHTML = slide.pills ? `
                <div class="highlight-pill-row">
                    ${slide.pills.map(p => `
                        <div class="highlight-pill ${p.type || ''}">
                            <span>${p.icon || '📌'}</span>
                            <span>${p.label}</span>
                        </div>
                    `).join('')}
                </div>
            ` : '';

            // Render Clean Slide Content HTML
            this.slideContainer.innerHTML = `
                <div class="slide-badge">
                    <span class="rec-dot" style="background: currentColor;"></span>
                    ${slide.badge}
                </div>
                <h1 class="slide-title">${slide.title}</h1>
                <p class="slide-subtitle">${slide.subtitle}</p>

                <!-- Clean Focal Infographic Section -->
                ${infographicHTML}

                <!-- Spacious Minimalist Highlight Pills -->
                ${pillsHTML}
            `;

            // Animate slide in
            requestAnimationFrame(() => {
                this.slideContainer.classList.remove('slide-enter');
                this.slideContainer.classList.add('slide-active');
            });

            if (shouldBroadcast) {
                this.broadcastCurrentState();
            }

            // AutoPlay progression
            if (this.isPlaying) {
                this.startSlideTimer(slide.script.durationSec);
            }
        }, 140);
    }

    buildInfographicHTML(slide) {
        const type = slide.infographicType;
        const data = slide.infographicData;
        if (!data) return '';

        switch (type) {
            case 'image-hero':
                return `
                    <div class="infographic-image-card">
                        <img src="${data.src}" alt="${data.alt || 'Infographic'}" />
                    </div>
                `;

            case 'clean-2-focus':
                return `
                    <div class="clean-focus-grid">
                        ${data.cards.map(c => `
                            <div class="clean-focus-card">
                                <div class="focus-icon">${c.icon}</div>
                                <div class="focus-title">${c.title}</div>
                                <div class="focus-desc">${c.desc}</div>
                            </div>
                        `).join('')}
                    </div>
                `;

            case 'hero-highlight':
                return `
                    <div class="hero-highlight-box" style="border-left-color: ${data.color || 'var(--accent-blue)'}">
                        <div class="hero-highlight-title">
                            <span>${data.icon}</span>
                            <span>${data.title}</span>
                        </div>
                        <div class="hero-highlight-desc">${data.desc}</div>
                    </div>
                `;

            case 'chart-donut-clean':
                return `
                    <div class="chart-box" style="margin-bottom: 24px;">
                        <div class="chart-header-tag">📊 ${data.chartTitle}</div>
                        <div class="donut-content-wrap">
                            <svg class="svg-donut" width="170" height="170" viewBox="0 0 120 120">
                                <circle class="donut-bg" cx="60" cy="60" r="48" fill="none" stroke="#e2e8f0" stroke-width="14"></circle>
                                <circle class="donut-slice slice-1" cx="60" cy="60" r="48" fill="none" stroke="#e11d48" stroke-width="14"
                                        stroke-dasharray="301.6" stroke-dashoffset="114.6"></circle>
                                <circle class="donut-slice slice-2" cx="60" cy="60" r="48" fill="none" stroke="#d97706" stroke-width="14"
                                        stroke-dasharray="301.6" stroke-dashoffset="229.2"
                                        style="transform: rotate(223.2deg); transform-origin: 60px 60px;"></circle>
                                <circle class="donut-slice slice-3" cx="60" cy="60" r="48" fill="none" stroke="#7c3aed" stroke-width="14"
                                        stroke-dasharray="301.6" stroke-dashoffset="259.4"
                                        style="transform: rotate(309.6deg); transform-origin: 60px 60px;"></circle>
                                <text x="60" y="56" text-anchor="middle" font-family="'Orbitron', sans-serif" font-weight="900" font-size="20" fill="#0f172a">62%</text>
                                <text x="60" y="74" text-anchor="middle" font-size="11" fill="#64748b" font-weight="800">INDIRECT</text>
                            </svg>

                            <div class="donut-legend">
                                ${data.donutSlices.map(s => `
                                    <div class="legend-row">
                                        <span class="legend-dot" style="background: ${s.color};"></span>
                                        <span class="legend-lbl">${s.label}</span>
                                        <span class="legend-val" style="color: ${s.color};">${s.value}</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                `;

            default:
                return '';
        }
    }

    startSlideTimer(durationSec) {
        if (this.progressInterval) clearInterval(this.progressInterval);
        
        let elapsed = 0;
        const total = durationSec * 1000;
        const currentFill = document.getElementById(`seg-fill-${this.currentIndex}`);

        this.progressInterval = setInterval(() => {
            elapsed += 100;
            const pct = Math.min((elapsed / total) * 100, 100);
            if (currentFill) currentFill.style.width = `${pct}%`;

            if (elapsed >= total) {
                clearInterval(this.progressInterval);
                if (this.currentIndex < this.slides.length - 1) {
                    this.nextSlide();
                } else {
                    this.toggleAutoPlay();
                }
            }
        }, 100);
    }

    toggleAutoPlay() {
        this.isPlaying = !this.isPlaying;
        if (this.autoPlayBtn) {
            this.autoPlayBtn.innerHTML = this.isPlaying ? `<span>⏸</span> পজ করুন` : `<span>▶</span> অটো প্লে`;
            this.autoPlayBtn.classList.toggle('primary', this.isPlaying);
        }

        if (this.isPlaying) {
            const slide = this.slides[this.currentIndex];
            this.startSlideTimer(slide.script.durationSec);
        } else {
            if (this.progressInterval) clearInterval(this.progressInterval);
        }
    }

    toggleSound() {
        if (window.MotionAudio) {
            const enabled = window.MotionAudio.toggleSound();
            if (this.soundBtn) {
                this.soundBtn.innerHTML = enabled ? `<span>🔊</span> সাউন্ড FX: চালু` : `<span>🔇</span> সাউন্ড FX: বন্ধ`;
                this.soundBtn.style.opacity = enabled ? '1' : '0.6';
            }
        }
    }

    nextSlide() {
        if (this.currentIndex < this.slides.length - 1) {
            this.renderSlide(this.currentIndex + 1);
        }
    }

    prevSlide() {
        if (this.currentIndex > 0) {
            this.renderSlide(this.currentIndex - 1);
        }
    }

    setupKeyboardShortcuts() {
        window.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
                e.preventDefault();
                this.nextSlide();
            } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
                e.preventDefault();
                this.prevSlide();
            } else if (e.key.toLowerCase() === 'f') {
                this.toggleFullscreen();
            } else if (e.key.toLowerCase() === 't') {
                this.openTeleprompterWindow();
            } else if (e.key.toLowerCase() === 'm') {
                this.toggleSound();
            }
        });
    }

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.warn("Fullscreen request error:", err);
            });
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    }

    openTeleprompterWindow() {
        const width = 1100;
        const height = 800;
        const left = (window.screen.width - width) / 2;
        const top = (window.screen.height - height) / 2;
        window.open(
            'teleprompter.html',
            'TeleprompterWindow',
            `width=${width},height=${height},left=${left},top=${top},menubar=no,status=no,toolbar=no`
        );
    }
}

window.addEventListener('DOMContentLoaded', () => {
    window.presenterApp = new SlidePresenter();
});
