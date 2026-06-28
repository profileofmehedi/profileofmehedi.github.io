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
    const focusTime = this.state.sessionsCompleted * Math.round(this.presets.pomo / 60);
    const focusStatus = this.state.isRunning 
      ? (this.state.mode === 'pomo' ? 'Focusing' : 'Resting')
      : 'Idle';
    const statusColor = this.state.isRunning
      ? (this.state.mode === 'pomo' ? 'text-danger' : 'text-success')
      : 'text-muted';

    // Calculate daily streak of completed focus sessions from storage activities
    const activities = window.storageService.get('activities') || [];
    const focusDays = new Set(
      activities
        .filter(a => a.text === 'Completed Pomodoro session')
        .map(a => a.timestamp.split('T')[0])
    );
    let streak = 0;
    let cursor = new Date();
    while (true) {
      const dateStr = cursor.toISOString().split('T')[0];
      if (focusDays.has(dateStr)) {
        streak++;
        cursor.setDate(cursor.getDate() - 1);
      } else {
        if (streak === 0) {
          cursor.setDate(cursor.getDate() - 1);
          const yesterdayStr = cursor.toISOString().split('T')[0];
          if (focusDays.has(yesterdayStr)) {
            streak++;
            cursor.setDate(cursor.getDate() - 1);
            continue;
          }
        }
        break;
      }
    }

    container.innerHTML = `
      <div class="container-fluid py-4">
        <div class="max-width-md mx-auto" style="max-width: 650px;">
          
          <div class="mb-4 text-center">
            <h2 class="font-bold mb-1">Focus Pomodoro</h2>
            <p class="text-muted text-sm mb-0">Use time-blocking intervals to maintain deep cognitive focus.</p>
          </div>

          <!-- Stats Summary Bar -->
          <div class="row g-3 mb-4 text-start">
            <div class="col-6 col-lg-3">
              <div class="premium-card p-3 d-flex align-items-center gap-3 h-100">
                <div class="rounded-circle d-flex align-items-center justify-content-center" style="width: 44px; height: 44px; font-size: 1.25rem; background-color: rgba(59, 130, 246, 0.1); color: #3b82f6; flex-shrink: 0;">
                  <i class="bi bi-clock-history"></i>
                </div>
                <div>
                  <div class="text-2xs text-muted font-bold text-uppercase">Completed</div>
                  <div class="font-bold text-sm mb-0 text-main" id="stats-pomo-sessions">${this.state.sessionsCompleted} sessions</div>
                </div>
              </div>
            </div>
            <div class="col-6 col-lg-3">
              <div class="premium-card p-3 d-flex align-items-center gap-3 h-100">
                <div class="rounded-circle d-flex align-items-center justify-content-center" style="width: 44px; height: 44px; font-size: 1.25rem; background-color: rgba(16, 185, 129, 0.1); color: #10b981; flex-shrink: 0;">
                  <i class="bi bi-hourglass-split"></i>
                </div>
                <div>
                  <div class="text-2xs text-muted font-bold text-uppercase">Focus Time</div>
                  <div class="font-bold text-sm mb-0 text-main">${focusTime} mins</div>
                </div>
              </div>
            </div>
            <div class="col-6 col-lg-3">
              <div class="premium-card p-3 d-flex align-items-center gap-3 h-100">
                <div class="rounded-circle d-flex align-items-center justify-content-center" style="width: 44px; height: 44px; font-size: 1.25rem; background-color: rgba(239, 68, 68, 0.1); color: #ef4444; flex-shrink: 0;">
                  <i class="bi bi-fire"></i>
                </div>
                <div>
                  <div class="text-2xs text-muted font-bold text-uppercase">Streak</div>
                  <div class="font-bold text-sm mb-0 text-danger">${streak} days</div>
                </div>
              </div>
            </div>
            <div class="col-6 col-lg-3">
              <div class="premium-card p-3 d-flex align-items-center gap-3 h-100">
                <div class="rounded-circle d-flex align-items-center justify-content-center" style="width: 44px; height: 44px; font-size: 1.25rem; background-color: rgba(108, 117, 125, 0.1); color: #6c757d; flex-shrink: 0;">
                  <i class="bi bi-activity"></i>
                </div>
                <div>
                  <div class="text-2xs text-muted font-bold text-uppercase">Status</div>
                  <div class="font-bold text-sm mb-0 ${statusColor}" id="stats-pomo-status">${focusStatus}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Pomodoro Control Presets -->
          <div class="premium-card p-3 mb-4 text-center">
            <div class="d-flex justify-content-center gap-2 flex-wrap">
              <button class="btn btn-outline-secondary btn-sm pomo-preset-btn ${this.state.mode === 'pomo' ? 'active' : ''}" data-mode="pomo">Focus Session (${Math.round(this.presets.pomo/60)}m)</button>
              <button class="btn btn-outline-secondary btn-sm pomo-preset-btn ${this.state.mode === 'short' ? 'active' : ''}" data-mode="short">Short Break (${Math.round(this.presets.short/60)}m)</button>
              <button class="btn btn-outline-secondary btn-sm pomo-preset-btn ${this.state.mode === 'long' ? 'active' : ''}" data-mode="long">Long Break (${Math.round(this.presets.long/60)}m)</button>
            </div>
          </div>

          <!-- Circular Clock Graphic -->
          <div class="premium-card p-5 mb-4 text-center">
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

          <!-- Custom Preset Tuner Card -->
          <div class="premium-card p-3 mb-4 text-start">
            <h6 class="font-bold text-xs text-uppercase text-muted mb-3"><i class="bi bi-sliders"></i> Adjust Custom Focus Durations</h6>
            <div class="row g-2">
              <div class="col-4">
                <label class="text-2xs text-muted font-bold">Focus (mins)</label>
                <input type="number" id="custom-pomo-min" class="form-control form-control-sm text-sm font-semibold" value="${Math.round(this.presets.pomo/60)}" min="5" max="120">
              </div>
              <div class="col-4">
                <label class="text-2xs text-muted font-bold">Short Break</label>
                <input type="number" id="custom-short-min" class="form-control form-control-sm text-sm font-semibold" value="${Math.round(this.presets.short/60)}" min="1" max="60">
              </div>
              <div class="col-4">
                <label class="text-2xs text-muted font-bold">Long Break</label>
                <input type="number" id="custom-long-min" class="form-control form-control-sm text-sm font-semibold" value="${Math.round(this.presets.long/60)}" min="5" max="90">
              </div>
            </div>
            <button class="btn btn-outline-primary btn-sm font-semibold text-xs mt-3 w-100" id="apply-custom-timer-btn">
              Apply Durations
            </button>
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
        
        const statusEl = container.querySelector('#stats-pomo-status');
        if (statusEl) {
          statusEl.textContent = 'Idle';
          statusEl.className = 'font-bold text-sm mb-0 text-muted';
        }
      });
    });

    const playBtn = container.querySelector('#pomo-play-btn');
    playBtn.addEventListener('click', () => {
      if (this.state.isRunning) {
        this.pauseTimer(playBtn);
        const statusEl = container.querySelector('#stats-pomo-status');
        if (statusEl) {
          statusEl.textContent = 'Idle';
          statusEl.className = 'font-bold text-sm mb-0 text-muted';
        }
      } else {
        this.startTimer(playBtn, container);
        const statusEl = container.querySelector('#stats-pomo-status');
        if (statusEl) {
          const isPomo = this.state.mode === 'pomo';
          statusEl.textContent = isPomo ? 'Focusing' : 'Resting';
          statusEl.className = `font-bold text-sm mb-0 ${isPomo ? 'text-danger' : 'text-success'}`;
        }
      }
    });

    container.querySelector('#pomo-reset-btn').addEventListener('click', () => {
      this.resetTimer(playBtn, container);
      const statusEl = container.querySelector('#stats-pomo-status');
      if (statusEl) {
        statusEl.textContent = 'Idle';
        statusEl.className = 'font-bold text-sm mb-0 text-muted';
      }
    });

    // Custom Durations Apply Handler
    container.querySelector('#apply-custom-timer-btn').addEventListener('click', () => {
      const pomoMin = parseInt(container.querySelector('#custom-pomo-min').value, 10) || 25;
      const shortMin = parseInt(container.querySelector('#custom-short-min').value, 10) || 5;
      const longMin = parseInt(container.querySelector('#custom-long-min').value, 10) || 15;

      this.presets.pomo = pomoMin * 60;
      this.presets.short = shortMin * 60;
      this.presets.long = longMin * 60;

      this.setMode(this.state.mode);
      this.render(container);
      this.init(container);
      window.notificationService.showToast('Custom intervals applied!', 'success');
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
