// Focus Pomodoro Timer Component (UI Module)
// Implements interactive timers, customized sessions (25/5, 50/10),
// stopwatch, custom countdown timer, lap loggers, and audio alerts.
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

    // Tab routing
    this.activeTab = 'pomodoro'; // pomodoro, stopwatch, timer

    // Stopwatch State
    this.stopwatchState = {
      isRunning: false,
      elapsedMs: 0,
      startTime: 0,
      laps: []
    };

    // Custom Timer State
    this.timerState = {
      isRunning: false,
      isSet: false,
      totalSeconds: 0,
      secondsLeft: 0
    };

    this.timerInterval = null;
    this.stopwatchInterval = null;
    this.customTimerInterval = null;
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

    let subViewHtml = '';

    if (this.activeTab === 'pomodoro') {
      subViewHtml = `
        <!-- Pomodoro Control Presets -->
        <div class="premium-card p-3 mb-4 text-center">
          <div class="d-flex justify-content-center gap-2 flex-wrap">
            <button class="btn btn-outline-secondary btn-sm pomo-preset-btn ${this.state.mode === 'pomo' ? 'active' : ''}" data-mode="pomo">Focus Session (${Math.round(this.presets.pomo/60)}m)</button>
            <button class="btn btn-outline-secondary btn-sm pomo-preset-btn ${this.state.mode === 'short' ? 'active' : ''}" data-mode="short">Short Break (${Math.round(this.presets.short/60)}m)</button>
            <button class="btn btn-outline-secondary btn-sm pomo-preset-btn ${this.state.mode === 'long' ? 'active' : ''}" data-mode="long">Long Break (${Math.round(this.presets.long/60)}m)</button>
          </div>
        </div>

        <!-- Circular Clock Graphic -->
        <div class="premium-card p-4 p-sm-5 mb-4 text-center">
          <div class="pomodoro-timer-display mb-4 mx-auto">
            <!-- SVG loader border -->
            <svg class="pomodoro-progress-svg">
              <circle class="pomodoro-progress-circle" cx="110" cy="110" r="106"></circle>
            </svg>
            <div class="pomodoro-time" id="pomo-clock-digits">25:00</div>
            <div class="pomodoro-status" id="pomo-clock-mode-title">Focus Session</div>
          </div>

          <!-- Controls buttons -->
          <div class="d-flex justify-content-center gap-3">
            <button class="btn btn-lg btn-primary font-semibold px-4 px-sm-5" id="pomo-play-btn">
              <i class="bi ${this.state.isRunning ? 'bi-pause-fill' : 'bi-play-fill'}"></i> ${this.state.isRunning ? 'Pause' : 'Start'}
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
      `;
    } else if (this.activeTab === 'stopwatch') {
      subViewHtml = `
        <!-- Stopwatch Graphic Face -->
        <div class="premium-card p-4 p-sm-5 mb-4 text-center">
          <div class="pomodoro-timer-display mb-4 mx-auto">
            <div class="pomodoro-time" id="stopwatch-clock-digits" style="font-size: 2.85rem;">00:00.00</div>
            <div class="pomodoro-status">Stopwatch</div>
          </div>

          <!-- Controls buttons -->
          <div class="d-flex justify-content-center gap-3">
            <button class="btn btn-lg ${this.stopwatchState.isRunning ? 'btn-warning text-dark' : 'btn-primary'} font-semibold px-4" id="stopwatch-toggle-btn">
              <i class="bi ${this.stopwatchState.isRunning ? 'bi-pause-fill' : 'bi-play-fill'}"></i> ${this.stopwatchState.isRunning ? 'Pause' : 'Start'}
            </button>
            <button class="btn btn-lg btn-outline-secondary font-semibold" id="stopwatch-lap-btn" ${!this.stopwatchState.isRunning ? 'disabled' : ''}>
              Lap
            </button>
            <button class="btn btn-lg btn-outline-danger font-semibold" id="stopwatch-reset-btn">
              Reset
            </button>
          </div>
        </div>

        <!-- Lap Tracker List Card -->
        <div class="premium-card p-3 mb-4 text-start" id="stopwatch-laps-card" style="display: ${this.stopwatchState.laps.length > 0 ? 'block' : 'none'}; max-height: 250px; overflow-y: auto;">
          <h6 class="font-bold text-xs text-uppercase text-muted mb-3"><i class="bi bi-flag"></i> Recorded Laps</h6>
          <div class="list-group list-group-flush text-xs font-semibold" id="stopwatch-laps-list">
            ${this.stopwatchState.laps.map((lap, i) => {
              const totalMs = lap;
              const mins = Math.floor(totalMs / 60000).toString().padStart(2, '0');
              const secs = Math.floor((totalMs % 60000) / 1000).toString().padStart(2, '0');
              const centis = Math.floor((totalMs % 1000) / 10).toString().padStart(2, '0');
              return `
                <div class="list-group-item d-flex justify-content-between align-items-center py-2 px-0 bg-transparent border-bottom">
                  <span class="text-muted">Lap ${this.stopwatchState.laps.length - i}</span>
                  <span class="font-bold text-main font-monospace">${mins}:${secs}.${centis}</span>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    } else if (this.activeTab === 'timer') {
      subViewHtml = `
        ${!this.timerState.isSet ? `
          <!-- Custom Timer Input Panel -->
          <div class="premium-card p-4 mb-4 text-center">
            <h6 class="font-bold text-xs text-uppercase text-muted mb-4"><i class="bi bi-stopwatch"></i> Configure Countdown Timer</h6>
            <div class="row g-2 mb-4 text-center justify-content-center max-width-xs mx-auto" style="max-width: 320px;">
              <div class="col-4">
                <label class="text-3xs text-muted font-bold text-uppercase mb-1">Hrs</label>
                <input type="number" id="timer-input-hours" class="form-control form-control-lg text-center font-bold" value="0" min="0" max="23">
              </div>
              <div class="col-4">
                <label class="text-3xs text-muted font-bold text-uppercase mb-1">Mins</label>
                <input type="number" id="timer-input-mins" class="form-control form-control-lg text-center font-bold" value="5" min="0" max="59">
              </div>
              <div class="col-4">
                <label class="text-3xs text-muted font-bold text-uppercase mb-1">Secs</label>
                <input type="number" id="timer-input-secs" class="form-control form-control-lg text-center font-bold" value="0" min="0" max="59">
              </div>
            </div>
            <button class="btn btn-primary font-semibold py-2 px-5" id="timer-setup-start-btn">
              <i class="bi bi-play-fill"></i> Start Countdown
            </button>
          </div>
        ` : `
          <!-- Custom Timer Active Screen -->
          <div class="premium-card p-4 p-sm-5 mb-4 text-center">
            <div class="pomodoro-timer-display mb-4 mx-auto">
              <!-- SVG loader ring -->
              <svg class="pomodoro-progress-svg">
                <circle class="pomodoro-progress-circle" id="timer-progress-circle" cx="110" cy="110" r="106"></circle>
              </svg>
              <div class="pomodoro-time" id="timer-clock-digits">00:05:00</div>
              <div class="pomodoro-status">Countdown Timer</div>
            </div>
            <!-- Controls -->
            <div class="d-flex justify-content-center gap-3">
              <button class="btn btn-lg ${this.timerState.isRunning ? 'btn-warning text-dark' : 'btn-primary'} font-semibold px-4" id="timer-active-toggle-btn">
                <i class="bi ${this.timerState.isRunning ? 'bi-pause-fill' : 'bi-play-fill'}"></i> ${this.timerState.isRunning ? 'Pause' : 'Resume'}
              </button>
              <button class="btn btn-lg btn-outline-danger font-semibold" id="timer-active-cancel-btn">
                Cancel
              </button>
            </div>
          </div>
        `}
      `;
    }

    container.innerHTML = `
      <div class="container-fluid py-4">
        <div class="max-width-md mx-auto" style="max-width: 650px;">
          
          <div class="mb-4 text-center">
            <h2 class="font-bold mb-1">Focus Pomodoro</h2>
            <p class="text-muted text-sm mb-0">Use time-blocking intervals to maintain deep cognitive focus.</p>
          </div>

          <!-- Sub-Tab Pills navigation -->
          <div class="d-flex justify-content-center mb-4">
            <div class="btn-group btn-group-sm rounded-pill p-1 bg-light border" role="group">
              <button type="button" class="btn btn-rounded-pill px-3 py-1.5 focus-tab-toggle-btn ${this.activeTab === 'pomodoro' ? 'btn-primary active text-white' : 'btn-light text-dark'}" data-tab="pomodoro">Pomodoro</button>
              <button type="button" class="btn btn-rounded-pill px-3 py-1.5 focus-tab-toggle-btn ${this.activeTab === 'stopwatch' ? 'btn-primary active text-white' : 'btn-light text-dark'}" data-tab="stopwatch">Stopwatch</button>
              <button type="button" class="btn btn-rounded-pill px-3 py-1.5 focus-tab-toggle-btn ${this.activeTab === 'timer' ? 'btn-primary active text-white' : 'btn-light text-dark'}" data-tab="timer">Custom Timer</button>
            </div>
          </div>

          <!-- Stats Summary Bar -->
          <div class="row g-2 g-sm-3 mb-4 text-start">
            <div class="col-6 col-lg-3">
              <div class="premium-card p-2 p-sm-3 d-flex align-items-center justify-content-center justify-content-sm-start gap-2 gap-sm-3 h-100">
                <div class="rounded-circle d-none d-sm-flex align-items-center justify-content-center" style="width: 44px; height: 44px; font-size: 1.25rem; background-color: rgba(59, 130, 246, 0.1); color: #3b82f6; flex-shrink: 0;">
                  <i class="bi bi-clock-history"></i>
                </div>
                <div class="text-center text-sm-start">
                  <div class="text-2xs text-muted font-bold text-uppercase">Completed</div>
                  <div class="font-bold text-sm mb-0 text-main" id="stats-pomo-sessions">${this.state.sessionsCompleted} sessions</div>
                </div>
              </div>
            </div>
            <div class="col-6 col-lg-3">
              <div class="premium-card p-2 p-sm-3 d-flex align-items-center justify-content-center justify-content-sm-start gap-2 gap-sm-3 h-100">
                <div class="rounded-circle d-none d-sm-flex align-items-center justify-content-center" style="width: 44px; height: 44px; font-size: 1.25rem; background-color: rgba(16, 185, 129, 0.1); color: #10b981; flex-shrink: 0;">
                  <i class="bi bi-hourglass-split"></i>
                </div>
                <div class="text-center text-sm-start">
                  <div class="text-2xs text-muted font-bold text-uppercase">Focus Time</div>
                  <div class="font-bold text-sm mb-0 text-main">${focusTime} mins</div>
                </div>
              </div>
            </div>
            <div class="col-6 col-lg-3">
              <div class="premium-card p-2 p-sm-3 d-flex align-items-center justify-content-center justify-content-sm-start gap-2 gap-sm-3 h-100">
                <div class="rounded-circle d-none d-sm-flex align-items-center justify-content-center" style="width: 44px; height: 44px; font-size: 1.25rem; background-color: rgba(239, 68, 68, 0.1); color: #ef4444; flex-shrink: 0;">
                  <i class="bi bi-fire"></i>
                </div>
                <div class="text-center text-sm-start">
                  <div class="text-2xs text-muted font-bold text-uppercase">Streak</div>
                  <div class="font-bold text-sm mb-0 text-danger">${streak} days</div>
                </div>
              </div>
            </div>
            <div class="col-6 col-lg-3">
              <div class="premium-card p-2 p-sm-3 d-flex align-items-center justify-content-center justify-content-sm-start gap-2 gap-sm-3 h-100">
                <div class="rounded-circle d-none d-sm-flex align-items-center justify-content-center" style="width: 44px; height: 44px; font-size: 1.25rem; background-color: rgba(108, 117, 125, 0.1); color: #6c757d; flex-shrink: 0;">
                  <i class="bi bi-activity"></i>
                </div>
                <div class="text-center text-sm-start">
                  <div class="text-2xs text-muted font-bold text-uppercase">Status</div>
                  <div class="font-bold text-sm mb-0 ${statusColor}" id="stats-pomo-status">${focusStatus}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Active Subview Mount Target -->
          <div id="focus-subview-panel">
            ${subViewHtml}
          </div>

        </div>
      </div>
    `;

    // Apply ticking positions
    if (this.activeTab === 'pomodoro') {
      this.updateClockDisplay(container);
    } else if (this.activeTab === 'stopwatch') {
      this.updateStopwatchDisplay(container);
    } else if (this.activeTab === 'timer' && this.timerState.isSet) {
      this.updateTimerClockDisplay(container);
    }
  }

  init(container) {
    // 1. Tab pills switching
    container.querySelectorAll('.focus-tab-toggle-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-tab');
        this.activeTab = tab;
        this.render(container);
        this.init(container);
      });
    });

    // 2. Pomodoro controls
    if (this.activeTab === 'pomodoro') {
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
      if (playBtn) {
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
      }

      const resetBtn = container.querySelector('#pomo-reset-btn');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          this.resetTimer(playBtn, container);
          const statusEl = container.querySelector('#stats-pomo-status');
          if (statusEl) {
            statusEl.textContent = 'Idle';
            statusEl.className = 'font-bold text-sm mb-0 text-muted';
          }
        });
      }

      // Custom Durations Apply Handler
      const applyBtn = container.querySelector('#apply-custom-timer-btn');
      if (applyBtn) {
        applyBtn.addEventListener('click', () => {
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
    }

    // 3. Stopwatch controls
    if (this.activeTab === 'stopwatch') {
      const toggleBtn = container.querySelector('#stopwatch-toggle-btn');
      const lapBtn = container.querySelector('#stopwatch-lap-btn');
      const resetBtn = container.querySelector('#stopwatch-reset-btn');

      if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
          if (this.stopwatchState.isRunning) {
            this.pauseStopwatch();
          } else {
            this.startStopwatch(container);
          }
          this.render(container);
          this.init(container);
        });
      }

      if (lapBtn) {
        lapBtn.addEventListener('click', () => {
          if (this.stopwatchState.isRunning) {
            const elapsed = this.stopwatchState.elapsedMs;
            this.stopwatchState.laps.unshift(elapsed);
            this.render(container);
            this.init(container);
          }
        });
      }

      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          this.resetStopwatch();
          this.render(container);
          this.init(container);
        });
      }
    }

    // 4. Custom Timer controls
    if (this.activeTab === 'timer') {
      if (!this.timerState.isSet) {
        const setupBtn = container.querySelector('#timer-setup-start-btn');
        if (setupBtn) {
          setupBtn.addEventListener('click', () => {
            const hrs = parseInt(container.querySelector('#timer-input-hours').value, 10) || 0;
            const mins = parseInt(container.querySelector('#timer-input-mins').value, 10) || 0;
            const secs = parseInt(container.querySelector('#timer-input-secs').value, 10) || 0;
            const total = hrs * 3600 + mins * 60 + secs;
            
            if (total <= 0) {
              window.notificationService.showToast('Please enter a valid time greater than 0', 'warning');
              return;
            }

            this.timerState.totalSeconds = total;
            this.timerState.secondsLeft = total;
            this.timerState.isSet = true;

            this.render(container);
            this.init(container);
            this.startCustomTimer(container);
          });
        }
      } else {
        const toggleBtn = container.querySelector('#timer-active-toggle-btn');
        const cancelBtn = container.querySelector('#timer-active-cancel-btn');

        if (toggleBtn) {
          toggleBtn.addEventListener('click', () => {
            if (this.timerState.isRunning) {
              this.pauseCustomTimer();
            } else {
              this.startCustomTimer(container);
            }
            this.render(container);
            this.init(container);
          });
        }

        if (cancelBtn) {
          cancelBtn.addEventListener('click', () => {
            this.cancelCustomTimer();
            this.render(container);
            this.init(container);
          });
        }
      }
    }
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

  updateStopwatchDisplay(container) {
    const digits = container.querySelector('#stopwatch-clock-digits');
    if (!digits) return;

    const totalMs = this.stopwatchState.elapsedMs;
    const mins = Math.floor(totalMs / 60000).toString().padStart(2, '0');
    const secs = Math.floor((totalMs % 60000) / 1000).toString().padStart(2, '0');
    const centis = Math.floor((totalMs % 1000) / 10).toString().padStart(2, '0');

    digits.textContent = `${mins}:${secs}.${centis}`;
  }

  updateTimerClockDisplay(container) {
    const digits = container.querySelector('#timer-clock-digits');
    const circle = container.querySelector('#timer-progress-circle');

    if (!digits) return;

    const hrs = Math.floor(this.timerState.secondsLeft / 3600);
    const mins = Math.floor((this.timerState.secondsLeft % 3600) / 60);
    const secs = this.timerState.secondsLeft % 60;

    const formatted = [
      hrs.toString().padStart(2, '0'),
      mins.toString().padStart(2, '0'),
      secs.toString().padStart(2, '0')
    ].join(':');

    digits.textContent = formatted;

    if (circle) {
      const circumference = 2 * Math.PI * 106; // r=106
      circle.style.strokeDasharray = circumference;
      
      const pct = (this.timerState.totalSeconds - this.timerState.secondsLeft) / this.timerState.totalSeconds;
      circle.style.strokeDashoffset = circumference - (pct * circumference);
    }
  }

  startTimer(playBtn, container) {
    this.state.isRunning = true;
    playBtn.innerHTML = `<i class="bi bi-pause-fill"></i> Pause`;
    playBtn.classList.replace('btn-primary', 'btn-warning');

    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      this.state.timeLeft--;
      
      const digits = container.querySelector('#pomo-clock-digits');
      if (digits) {
        this.updateClockDisplay(container);
      }

      // Update browser tab title countdown
      const mins = Math.floor(this.state.timeLeft / 60).toString().padStart(2, '0');
      const secs = (this.state.timeLeft % 60).toString().padStart(2, '0');
      document.title = `(${mins}:${secs}) LifeOS Timer`;

      if (this.state.timeLeft <= 0) {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
        this.state.isRunning = false;
        
        // Trigger alarm beep and notification!
        window.notificationService.playAlarmSound();
        window.notificationService.triggerNotification('Focus Session Done!', 'Great work! Take a short rest break.');
        
        if (this.state.mode === 'pomo') {
          this.state.sessionsCompleted++;
          this.logActivity("Completed Pomodoro session");
        }

        // Return to standard presets
        this.setMode('pomo');
        this.render(container);
        this.init(container);
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
    this.render(container);
    this.init(container);
  }

  startStopwatch(container) {
    this.stopwatchState.isRunning = true;
    this.stopwatchState.startTime = Date.now() - this.stopwatchState.elapsedMs;

    if (this.stopwatchInterval) clearInterval(this.stopwatchInterval);
    this.stopwatchInterval = setInterval(() => {
      this.stopwatchState.elapsedMs = Date.now() - this.stopwatchState.startTime;
      this.updateStopwatchDisplay(container);
    }, 10);
  }

  pauseStopwatch() {
    this.stopwatchState.isRunning = false;
    if (this.stopwatchInterval) {
      clearInterval(this.stopwatchInterval);
      this.stopwatchInterval = null;
    }
  }

  resetStopwatch() {
    this.stopwatchState.isRunning = false;
    this.stopwatchState.elapsedMs = 0;
    this.stopwatchState.laps = [];
    if (this.stopwatchInterval) {
      clearInterval(this.stopwatchInterval);
      this.stopwatchInterval = null;
    }
  }

  startCustomTimer(container) {
    this.timerState.isRunning = true;

    if (this.customTimerInterval) clearInterval(this.customTimerInterval);
    this.customTimerInterval = setInterval(() => {
      this.timerState.secondsLeft--;

      const digits = container.querySelector('#timer-clock-digits');
      if (digits) {
        this.updateTimerClockDisplay(container);
      }

      const hrs = Math.floor(this.timerState.secondsLeft / 3600);
      const mins = Math.floor((this.timerState.secondsLeft % 3600) / 60);
      const secs = this.timerState.secondsLeft % 60;
      const formatted = [
        hrs > 0 ? hrs.toString().padStart(2, '0') : null,
        mins.toString().padStart(2, '0'),
        secs.toString().padStart(2, '0')
      ].filter(x => x !== null).join(':');
      document.title = `(${formatted}) Custom Timer`;

      if (this.timerState.secondsLeft <= 0) {
        clearInterval(this.customTimerInterval);
        this.customTimerInterval = null;
        this.timerState.isRunning = false;
        this.timerState.isSet = false;

        // Trigger alarm beep and notification!
        window.notificationService.playAlarmSound();
        window.notificationService.triggerNotification("Timer Finished!", "Your custom countdown timer has completed.");

        this.render(container);
        this.init(container);
      }
    }, 1000);
  }

  pauseCustomTimer() {
    this.timerState.isRunning = false;
    if (this.customTimerInterval) {
      clearInterval(this.customTimerInterval);
      this.customTimerInterval = null;
    }
  }

  cancelCustomTimer() {
    this.timerState.isRunning = false;
    this.timerState.isSet = false;
    this.timerState.secondsLeft = 0;
    this.timerState.totalSeconds = 0;
    if (this.customTimerInterval) {
      clearInterval(this.customTimerInterval);
      this.customTimerInterval = null;
    }
    document.title = "LifeOS - Design Your Life";
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
    if (this.timerInterval) clearInterval(this.timerInterval);
    if (this.stopwatchInterval) clearInterval(this.stopwatchInterval);
    if (this.customTimerInterval) clearInterval(this.customTimerInterval);
    document.title = "LifeOS - Design Your Life";
  }
}
