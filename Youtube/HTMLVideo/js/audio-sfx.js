/**
 * Procedural Web Audio SFX Synthesizer (Bulletproof Edition)
 * Generates cinematic motion graphics sound effects dynamically using Web Audio API
 * Safe against autoplay restrictions and browser privacy boundaries.
 */

class MotionAudioEngine {
    constructor() {
        this.ctx = null;
        this.isEnabled = true;
        this.masterVolume = 0.28;
    }

    init() {
        try {
            if (!this.ctx) {
                const AudioContextClass = window.AudioContext || window.webkitAudioContext;
                if (AudioContextClass) {
                    this.ctx = new AudioContextClass();
                }
            }
            if (this.ctx && this.ctx.state === 'suspended') {
                this.ctx.resume().catch(() => {});
            }
        } catch (e) {
            console.warn("AudioContext not available or blocked:", e);
        }
    }

    toggleSound() {
        this.isEnabled = !this.isEnabled;
        return this.isEnabled;
    }

    // Cinematic Whoosh / Slide Transition Sweep
    playWhoosh() {
        if (!this.isEnabled) return;
        this.init();
        if (!this.ctx) return;

        try {
            const now = this.ctx.currentTime;
            const bufferSize = this.ctx.sampleRate * 0.45;
            const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
            const output = noiseBuffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                output[i] = Math.random() * 2 - 1;
            }

            const whiteNoise = this.ctx.createBufferSource();
            whiteNoise.buffer = noiseBuffer;

            const filter = this.ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(180, now);
            filter.frequency.exponentialRampToValueAtTime(1400, now + 0.2);
            filter.frequency.exponentialRampToValueAtTime(120, now + 0.45);
            filter.Q.setValueAtTime(3.0, now);

            const gain = this.ctx.createGain();
            gain.gain.setValueAtTime(0.01, now);
            gain.gain.linearRampToValueAtTime(this.masterVolume * 0.8, now + 0.2);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

            whiteNoise.connect(filter);
            filter.connect(gain);
            gain.connect(this.ctx.destination);

            whiteNoise.start(now);
        } catch (e) {}
    }

    // Sub-Bass Drop (Threat alert & impact)
    playSubDrop() {
        if (!this.isEnabled) return;
        this.init();
        if (!this.ctx) return;

        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(130, now);
            osc.frequency.exponentialRampToValueAtTime(35, now + 0.6);

            gain.gain.setValueAtTime(this.masterVolume * 1.2, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 0.65);
        } catch (e) {}
    }

    // Tech Step Click / UI Blip
    playStepTick() {
        if (!this.isEnabled) return;
        this.init();
        if (!this.ctx) return;

        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(980, now);
            osc.frequency.exponentialRampToValueAtTime(2400, now + 0.05);

            gain.gain.setValueAtTime(this.masterVolume * 0.4, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 0.06);
        } catch (e) {}
    }

    // Crystal Harmonic Chime (Defense Shield Activation)
    playChime() {
        if (!this.isEnabled) return;
        this.init();
        if (!this.ctx) return;

        try {
            const now = this.ctx.currentTime;
            const freqs = [523.25, 659.25, 783.99, 1046.50];

            freqs.forEach((freq, idx) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();

                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, now + idx * 0.06);

                gain.gain.setValueAtTime(0.001, now + idx * 0.06);
                gain.gain.linearRampToValueAtTime(this.masterVolume * 0.35, now + idx * 0.06 + 0.03);
                gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.8);

                osc.connect(gain);
                gain.connect(this.ctx.destination);

                osc.start(now + idx * 0.06);
                osc.stop(now + idx * 0.06 + 0.85);
            });
        } catch (e) {}
    }

    // Digital Cyber Glitch Burst
    playGlitch() {
        if (!this.isEnabled) return;
        this.init();
        if (!this.ctx) return;

        try {
            const now = this.ctx.currentTime;
            for (let i = 0; i < 4; i++) {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();

                osc.type = Math.random() > 0.5 ? 'square' : 'sawtooth';
                osc.frequency.setValueAtTime(300 + Math.random() * 1800, now + i * 0.04);

                gain.gain.setValueAtTime(this.masterVolume * 0.3, now + i * 0.04);
                gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.04 + 0.03);

                osc.connect(gain);
                gain.connect(this.ctx.destination);

                osc.start(now + i * 0.04);
                osc.stop(now + i * 0.04 + 0.035);
            }
        } catch (e) {}
    }
}

window.MotionAudio = new MotionAudioEngine();
