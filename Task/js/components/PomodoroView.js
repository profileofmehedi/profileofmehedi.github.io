// Focus Pomodoro Timer Component (UI Module)
// Implements interactive timers, customized sessions (25/5, 50/10),
// ticking tab title updates, circular SVG loader, and audio warnings.
// Globally Scoped.

window.PomodoroView = class PomodoroView {
  constructor(app) {
    this.app = app;
    
    // Configurations
    this.presets = {
      pomo: 25 * 60,
      short: 5 * 60,
      long: 15 * 60
    };

    this.state = {
      mode: 'pomo', // pomo, short, long
      duration: this.presets.pomo,
      timeLeft: this.presets.pomo,
      isRunning: false,
      sessionsCompleted: 0
    };

    this.timerInterval = null;
  }

  render(container) {
    container.innerHTML = `
      <div class="container-fluid py-4 text-center">
        <div class="max-width-md mx-auto" style="max-width: 600px;">
          
          <div class="mb-4">
            <h2 class="font-bold mb-1">Focus Pomodoro</h2>
            <p class="text-muted text-sm mb-0">Use time-blocking intervals to maintain deep cognitive focus.</p>
          </div>

          <!-- Pomodoro Control Presets -->
          <div class="premium-card p-3 mb-4">
            <div class="d-flex justify-content-center gap-2">
              <button class="btn btn-outline-secondary btn-sm pomo-preset-btn ${this.state.mode === 'pomo' ? 'active' : ''}" data-mode="pomo">Focus Session (25m)</button>
              <button class="btn btn-outline-secondary btn-sm pomo-preset-btn ${this.state.mode === 'short' ? 'active' : ''}" data-mode="short">Short Break (5m)</button>
              <button class="btn btn-outline-secondary btn-sm pomo-preset-btn ${this.state.mode === 'long' ? 'active' : ''}" data-mode="long">Long Break (15m)</button>
            </div>
          </div>

          <!-- Circular Clock Graphic -->
          <div class="premium-card p-5 mb-4">
            <div class="pomodoro-timer-display mb-4">
              <!-- SVG loader border -->
              <svg class="pomodoro-progress-svg">
                <circle class="pomodoro-progress-circle" cx="110" cy="110" r="106"></circle>
              </svg>
              <div class="pomodoro-time" id="pomo-clock-digits">25:00</div>
              <div class="pomodoro-status" id="pomo-clock-mode-title">Focus Session</div>
            </div>

            <!-- Controls buttons -->
            <div class="d-flex justify-content-center gap-3">
              <button class="btn btn-lg btn-primary font-semibold px-5" id="pomo-play-btn">
                <i class="bi bi-play-fill"></i> Start
              </button>
              <button class="btn btn-lg btn-outline-secondary font-semibold" id="pomo-reset-btn">
                Reset
              </button>
            </div>
          </div>

          <!-- Sessions Log -->
          <div class="premium-card p-3 text-start">
            <h6 class="font-bold text-xs text-uppercase text-muted mb-2">Focus Session logs</h6>
            <div class="d-flex justify-content-between align-items-center">
              <span class="text-sm text-main">Sessions completed today</span>
              <span class="badge bg-success font-bold h6 mb-0" id="pomo-session-badge">${this.state.sessionsCompleted} sessions</span>
            </div>
          </div>

        </div>
      </div>
    `;

    this.updateClockDisplay(container);
  }

  init(container) {
    container.querySelectorAll('.pomo-preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        container.querySelectorAll('.pomo-preset-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const mode = btn.getAttribute('data-mode');
        this.setMode(mode);
        this.updateClockDisplay(container);
      });
    });

    const playBtn = container.querySelector('#pomo-play-btn');
    playBtn.addEventListener('click', () => {
      if (this.state.isRunning) {
        this.pauseTimer(playBtn);
      } else {
        this.startTimer(playBtn, container);
      }
    });

    container.querySelector('#pomo-reset-btn').addEventListener('click', () => {
      this.resetTimer(playBtn, container);
    });
  }

  setMode(mode) {
    this.state.mode = mode;
    this.state.duration = this.presets[mode];
    this.state.timeLeft = this.presets[mode];
    this.state.isRunning = false;
    if (this.timerInterval) clearInterval(this.timerInterval);
    
    // Reset tab title
    document.title = "LifeOS - Design Your Life";
  }

  updateClockDisplay(container) {
    const digits = container.querySelector('#pomo-clock-digits');
    const modeTitle = container.querySelector('#pomo-clock-mode-title');
    const circle = container.querySelector('.pomodoro-progress-circle');

    if (!digits || !modeTitle) return;

    // Digits
    const mins = Math.floor(this.state.timeLeft / 60).toString().padStart(2, '0');
    const secs = (this.state.timeLeft % 60).toString().padStart(2, '0');
    digits.textContent = `${mins}:${secs}`;

    // Mode title
    const titles = { pomo: 'Focus Session', short: 'Short Break', long: 'Long Break' };
    modeTitle.textContent = titles[this.state.mode];

    // Circle SVG indicator
    if (circle) {
      const circumference = 2 * Math.PI * 106; // r=106
      circle.style.strokeDasharray = circumference;
      
      const pct = (this.state.duration - this.state.timeLeft) / this.state.duration;
      circle.style.strokeDashoffset = circumference - (pct * circumference);
    }
  }

  startTimer(playBtn, container) {
    this.state.isRunning = true;
    playBtn.innerHTML = `<i class="bi bi-pause-fill"></i> Pause`;
    playBtn.classList.replace('btn-primary', 'btn-warning');

    this.timerInterval = setInterval(() => {
      this.state.timeLeft--;
      this.updateClockDisplay(container);

      // Update browser tab title countdown
      const mins = Math.floor(this.state.timeLeft / 60).toString().padStart(2, '0');
      const secs = (this.state.timeLeft % 60).toString().padStart(2, '0');
      document.title = `(${mins}:${secs}) LifeOS Timer`;

      if (this.state.timeLeft <= 0) {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
        this.state.isRunning = false;
        
        playBtn.innerHTML = `<i class="bi bi-play-fill"></i> Start`;
        playBtn.className = 'btn btn-lg btn-primary font-semibold px-5';
        
        // Log activity & handle session completion
        if (this.state.mode === 'pomo') {
          this.state.sessionsCompleted++;
          container.querySelector('#pomo-session-badge').textContent = `${this.state.sessionsCompleted} sessions`;
          window.notificationService.triggerNotification('Focus Session Done!', 'Great work! Take a short rest break.');
          this.logActivity("Completed Pomodoro session");
        } else {
          window.notificationService.triggerNotification('Break time Over!', 'Time to resume focusing.');
        }

        // Return to standard presets
        this.setMode('pomo');
        this.updateClockDisplay(container);
      }
    }, 1000);
  }

  pauseTimer(playBtn) {
    this.state.isRunning = false;
    playBtn.innerHTML = `<i class="bi bi-play-fill"></i> Resume`;
    playBtn.classList.replace('btn-warning', 'btn-primary');
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  resetTimer(playBtn, container) {
    this.setMode(this.state.mode);
    this.updateClockDisplay(container);
    playBtn.innerHTML = `<i class="bi bi-play-fill"></i> Start`;
    playBtn.className = 'btn btn-lg btn-primary font-semibold px-5';
  }

  logActivity(text) {
    const activities = window.storageService.get('activities') || [];
    activities.unshift({
      timestamp: new Date().toISOString(),
      text
    });
    if (activities.length > 50) activities.pop();
    window.storageService.set('activities', activities);
  }

  destroy() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    document.title = "LifeOS - Design Your Life";
  }
}
