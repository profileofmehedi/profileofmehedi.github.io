// Dashboard View Component (UI Module)
// Implements 16 modular widgets supporting SortableJS drag-and-drop, collapse toggles,
// and auto-saving layouts to storage.
// Globally Scoped.

window.DashboardView = class DashboardView {
  constructor(app) {
    this.app = app;
    this.storageKey = 'dashboard_widgets_state';
    
    // Default widget order and visibility states (No AWS study, Leetcode, bookmarks)
    this.defaultWidgets = [
      { id: 'welcome', title: 'Welcome', size: 'widget-col-8', visible: true, collapsed: false },
      { id: 'clock', title: 'Clock & Date', size: 'widget-col-4', visible: true, collapsed: false },
      { id: 'weather', title: 'Weather Forecast', size: 'widget-col-4', visible: true, collapsed: false },
      { id: 'quote', title: 'Quote of the Day', size: 'widget-col-8', visible: true, collapsed: false },
      { id: 'tasks', title: "Today's Focus Tasks", size: 'widget-col-6', visible: true, collapsed: false },
      { id: 'pomodoro', title: 'Focus Pomodoro', size: 'widget-col-6', visible: true, collapsed: false },
      { id: 'reminders', title: 'Upcoming Alarm', size: 'widget-col-4', visible: true, collapsed: false },
      { id: 'productivity', title: 'Productivity Score', size: 'widget-col-4', visible: true, collapsed: false },
      { id: 'habits', title: 'Habits Tracker', size: 'widget-col-4', visible: true, collapsed: false },
      { id: 'expense', title: 'Monthly Financials', size: 'widget-col-6', visible: true, collapsed: false },
      { id: 'notes', title: 'Scratch Note', size: 'widget-col-6', visible: true, collapsed: false },
      { id: 'activity', title: 'System Logs', size: 'widget-col-12', visible: true, collapsed: false }
    ];
  }

  // Load configuration details from LocalStorage
  getWidgetsState() {
    const state = window.storageService.get(this.storageKey);
    if (!state) {
      window.storageService.set(this.storageKey, this.defaultWidgets);
      return this.defaultWidgets;
    }
    return state;
  }

  saveWidgetsState(state) {
    window.storageService.set(this.storageKey, state);
  }

  render(container) {
    const states = this.getWidgetsState();
    
    let widgetsHtml = '';
    states.forEach(w => {
      if (!w.visible) return;
      widgetsHtml += this.buildWidgetTemplate(w);
    });

    container.innerHTML = `
      <div class="container-fluid py-4">
        <!-- Dashboard Toolbar -->
        <div class="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3 mb-4">
          <div>
            <h2 class="font-bold mb-1">Your Dashboard</h2>
            <p class="text-muted text-sm mb-0">Overview of your goals, tasks, and progress.</p>
          </div>
          
          <div class="dropdown">
            <button class="btn btn-outline-primary dropdown-toggle font-semibold text-sm" type="button" data-bs-toggle="dropdown" aria-expanded="false">
              <i class="bi bi-grid-fill me-2"></i> Manage Widgets
            </button>
            <ul class="dropdown-menu dropdown-menu-end p-2" id="widgets-selector-dropdown" style="min-width: 220px;">
              <li><h6 class="dropdown-header">Show/Hide Widgets</h6></li>
              <li><hr class="dropdown-divider"></li>
            </ul>
          </div>
        </div>

        <!-- Draggable Widgets Container -->
        <div id="dashboard-widgets-grid" class="widget-grid">
          ${widgetsHtml}
        </div>
      </div>
    `;
  }

  init(container) {
    const grid = container.querySelector('#dashboard-widgets-grid');
    const states = this.getWidgetsState();

    // 1. Initialize SortableJS for widget dragging
    if (window.Sortable) {
      new Sortable(grid, {
        handle: '.widget-drag-handle',
        animation: 180,
        ghostClass: 'widget-ghost-placeholder',
        onEnd: () => {
          const reorderedStates = [];
          const cards = grid.querySelectorAll('.widget-card-wrapper');
          cards.forEach(card => {
            const id = card.getAttribute('data-widget-id');
            const match = states.find(w => w.id === id);
            if (match) reorderedStates.push(match);
          });
          
          states.forEach(w => {
            if (!reorderedStates.some(x => x.id === w.id)) {
              reorderedStates.push(w);
            }
          });

          this.saveWidgetsState(reorderedStates);
        }
      });
    }

    // 2. Initialize Widget controls (Collapse, Hide)
    container.querySelectorAll('.widget-btn-collapse').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-widget-id');
        const updated = states.map(w => w.id === id ? { ...w, collapsed: !w.collapsed } : w);
        this.saveWidgetsState(updated);
        this.render(container);
        this.init(container);
      });
    });

    container.querySelectorAll('.widget-btn-hide').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-widget-id');
        const updated = states.map(w => w.id === id ? { ...w, visible: false } : w);
        this.saveWidgetsState(updated);
        this.render(container);
        this.init(container);
      });
    });

    // 3. Populate Manage Widgets Dropdown
    const dropdown = container.querySelector('#widgets-selector-dropdown');
    states.forEach(w => {
      const li = document.createElement('li');
      li.className = 'px-3 py-1';
      li.innerHTML = `
        <div class="form-check">
          <input class="form-check-input widget-toggle-chk" type="checkbox" id="chk-${w.id}" data-widget-id="${w.id}" ${w.visible ? 'checked' : ''}>
          <label class="form-check-label text-sm cursor-pointer" for="chk-${w.id}">${w.title}</label>
        </div>
      `;
      dropdown.appendChild(li);
    });

    dropdown.querySelectorAll('.widget-toggle-chk').forEach(chk => {
      chk.addEventListener('change', () => {
        const id = chk.getAttribute('data-widget-id');
        const checked = chk.checked;
        const updated = states.map(w => w.id === id ? { ...w, visible: checked } : w);
        this.saveWidgetsState(updated);
        this.render(container);
        this.init(container);
      });
    });

    // 4. Run widget specific behaviors (Clocks, Pomodoro, Scratchpad autosave)
    this.bootWidgetInteractions(container);
  }

  // Generate HTML wrapper for widgets
  buildWidgetTemplate(w) {
    const bodyClass = w.collapsed ? 'd-none' : '';
    const collapseIcon = w.collapsed ? 'bi-plus-lg' : 'bi-dash-lg';
    
    return `
      <div class="widget-card-wrapper ${w.size}" data-widget-id="${w.id}">
        <div class="premium-card h-100 widget-card d-flex flex-column">
          <!-- Widget Card Header -->
          <div class="premium-card-header mb-2 pb-2 border-bottom">
            <div class="d-flex align-items-center gap-2">
              <span class="widget-drag-handle"><i class="bi bi-grip-vertical"></i></span>
              <h6 class="font-bold mb-0 text-main">${w.title}</h6>
            </div>
            <div class="d-flex gap-1">
              <button class="btn btn-sm btn-link p-1 text-muted widget-btn-collapse" data-widget-id="${w.id}">
                <i class="bi ${collapseIcon}"></i>
              </button>
              <button class="btn btn-sm btn-link p-1 text-muted widget-btn-hide" data-widget-id="${w.id}">
                <i class="bi bi-x-lg"></i>
              </button>
            </div>
          </div>
          <!-- Widget Content Body -->
          <div class="flex-grow-1 widget-card-body ${bodyClass}">
            ${this.getWidgetContent(w.id)}
          </div>
        </div>
      </div>
    `;
  }

  // Dispatch widget HTML content based on ID
  getWidgetContent(id) {
    const todayStr = new Date().toISOString().split('T')[0];

    switch (id) {
      case 'welcome':
        const name = window.storageService.get('profile')?.name || 'Mehedi';
        const tasks = window.taskService.getTasks();
        const done = tasks.filter(t => t.dueDate === todayStr && t.status === 'completed').length;
        const total = tasks.filter(t => t.dueDate === todayStr).length;
        return `
          <div class="py-2">
            <h4 class="font-bold mb-2">Good Day, <span class="text-primary">${name}</span>!</h4>
            <p class="text-muted text-sm mb-3">Your schedule for today looks productive. You have completed <strong>${done}/${total}</strong> focus tasks due today.</p>
            <div class="progress" style="height: 8px; border-radius: 4px;">
              <div class="progress-bar bg-primary" role="progressbar" style="width: ${total > 0 ? (done/total)*100 : 0}%;"></div>
            </div>
          </div>
        `;

      case 'clock':
        return `
          <div class="text-center py-3">
            <div class="display-6 font-bold text-main" id="dash-live-clock">00:00:00</div>
            <div class="text-muted text-sm font-semibold mt-1" id="dash-live-date">...</div>
          </div>
        `;

      case 'weather':
        return `
          <div class="d-flex align-items-center justify-content-around gap-2 flex-wrap py-2">
            <div class="text-center">
              <i class="bi bi-cloud-sun text-warning" style="font-size: 2.5rem;"></i>
              <div class="text-xs text-muted mt-1">Partly Cloudy</div>
            </div>
            <div class="text-start">
              <div class="h2 font-bold mb-0">26°C</div>
              <div class="text-xs font-semibold text-muted">Dhaka, BD</div>
              <div class="text-xs text-primary mt-1"><i class="bi bi-wind"></i> Wind: 14 km/h</div>
            </div>
          </div>
        `;

      case 'quote':
        const quotes = [
          { q: "Focus on being productive instead of busy.", a: "Tim Ferriss" },
          { q: "Your mind is for having ideas, not holding them.", a: "David Allen" },
          { q: "The only way to do great work is to love what you do.", a: "Steve Jobs" },
          { q: "It always seems impossible until it is done.", a: "Nelson Mandela" }
        ];
        const randomQuote = quotes[new Date().getDay() % quotes.length];
        return `
          <div class="py-2 d-flex flex-column h-100 justify-content-center">
            <blockquote class="blockquote mb-2 text-sm text-main" style="border-left: 3px solid var(--primary-color); padding-left: 1rem; font-style: italic;">
              "${randomQuote.q}"
            </blockquote>
            <figcaption class="blockquote-footer text-xs font-semibold mt-0">
              ${randomQuote.a}
            </figcaption>
          </div>
        `;

      case 'tasks':
        const focusTasks = window.taskService.getTasks().filter(t => t.dueDate === todayStr).slice(0, 4);
        if (focusTasks.length === 0) {
          return `<div class="text-center text-muted text-xs py-4">No tasks scheduled for today.</div>`;
        }
        return `
          <div class="list-group list-group-flush pt-1">
            ${focusTasks.map(t => `
              <div class="list-group-item px-0 py-2 d-flex align-items-center justify-content-between border-0 gap-2">
                <div class="d-flex align-items-center gap-2 min-w-0" style="min-width: 0; flex: 1;">
                  <div class="custom-checkbox dash-task-chk flex-shrink-0 ${t.status === 'completed' ? 'checked' : ''}" data-id="${t.id}">
                    <i class="bi bi-check-lg"></i>
                  </div>
                  <span class="text-sm text-truncate ${t.status === 'completed' ? 'text-decoration-line-through text-muted' : 'text-main'}" style="flex: 1; min-width: 0;">${t.title}</span>
                </div>
                <span class="badge text-xs badge-priority-${t.priority} flex-shrink-0">${t.priority}</span>
              </div>
            `).join('')}
          </div>
        `;

      case 'pomodoro':
        return `
          <div class="d-flex align-items-center justify-content-around gap-3 flex-wrap py-2">
            <div class="text-center">
              <div class="font-bold text-main" id="dash-pomo-clock" style="font-size: 2.25rem;">25:00</div>
              <div class="text-xs text-muted text-uppercase" id="dash-pomo-status">Focus Session</div>
            </div>
            <div class="d-flex flex-column gap-2">
              <button class="btn btn-sm btn-primary font-semibold text-xs py-1" id="dash-pomo-start-btn">Start Session</button>
              <button class="btn btn-sm btn-outline-secondary font-semibold text-xs py-1" id="dash-pomo-reset-btn">Reset</button>
            </div>
          </div>
        `;

      case 'reminders':
        const nextRem = window.reminderService.getReminders().filter(r => !r.completed)[0];
        if (!nextRem) {
          return `<div class="text-center text-muted text-xs py-4">No pending reminders found.</div>`;
        }
        return `
          <div class="py-2 text-center">
            <div class="font-bold text-main" id="dash-countdown-clock" data-time="${nextRem.dateTime}">--:--:--</div>
            <div class="text-xs font-semibold text-primary mt-1">${nextRem.title}</div>
            <div class="text-xs text-muted mt-1">Countdown timer active</div>
          </div>
        `;

      case 'productivity':
        const allTasks = window.taskService.getTasks();
        const completed = allTasks.filter(t => t.status === 'completed').length;
        const totalCount = allTasks.length;
        const taskRate = totalCount > 0 ? Math.round((completed / totalCount) * 100) : 0;
        
        const habits = window.habitService.getHabits();
        let habitScore = 0;
        if (habits.length > 0) {
          const checks = habits.reduce((acc, curr) => acc + (curr.history[todayStr] ? 1 : 0), 0);
          habitScore = Math.round((checks / habits.length) * 100);
        }
        
        const score = Math.round((taskRate * 0.6) + (habitScore * 0.4)) || 45;

        return `
          <div class="text-center py-2">
            <div class="display-6 font-bold text-success">${score}%</div>
            <div class="text-xs text-muted mt-1">Score calculated from tasks & habits done today.</div>
            <div class="progress mt-3" style="height: 6px; border-radius:3px;">
              <div class="progress-bar bg-success" role="progressbar" style="width: ${score}%;"></div>
            </div>
          </div>
        `;

      case 'habits':
        const hList = window.habitService.getHabits().slice(0, 3);
        if (hList.length === 0) {
          return `<div class="text-center text-muted text-xs py-4">No habits created.</div>`;
        }
        return `
          <div class="list-group list-group-flush pt-1">
            ${hList.map(h => {
              const checked = h.history[todayStr] === true;
              const streak = window.habitService.getHabitStreaks(h).current;
              return `
                <div class="list-group-item px-0 py-2 d-flex align-items-center justify-content-between border-0 gap-2">
                  <div class="d-flex align-items-center gap-2 min-w-0" style="min-width: 0; flex: 1;">
                    <button class="btn btn-xs ${checked ? 'btn-success' : 'btn-outline-secondary'} py-0 px-2 text-xs dash-habit-chk-btn flex-shrink-0" data-id="${h.id}">
                      <i class="bi ${checked ? 'bi-check-lg' : 'bi-plus-lg'}"></i>
                    </button>
                    <span class="text-sm text-main text-truncate" style="flex: 1; min-width: 0;">${h.title}</span>
                  </div>
                  <span class="text-xs text-muted font-semibold flex-shrink-0"><i class="bi bi-fire text-danger"></i> ${streak}d streak</span>
                </div>
              `;
            }).join('')}
          </div>
        `;

      case 'expense':
        const summary = window.expenseService.getSummary();
        return `
          <div class="row g-2 text-center py-2">
            <div class="col-4">
              <div class="text-xs text-muted">Income</div>
              <div class="font-bold text-success">$${summary.income}</div>
            </div>
            <div class="col-4">
              <div class="text-xs text-muted">Expense</div>
              <div class="font-bold text-danger">$${summary.expense}</div>
            </div>
            <div class="col-4">
              <div class="text-xs text-muted">Savings</div>
              <div class="font-bold text-primary">$${summary.savings}</div>
            </div>
            <div class="col-12 mt-3 text-start px-3">
              <div class="text-xs text-muted mb-1">Savings Rate: ${summary.savingsRate}%</div>
              <div class="progress" style="height: 6px; border-radius: 3px;">
                <div class="progress-bar bg-primary" role="progressbar" style="width: ${summary.savingsRate}%;"></div>
              </div>
            </div>
          </div>
        `;

      case 'notes':
        const quickNotes = window.storageService.get('dash_quick_notes') || '';
        return `
          <div class="py-1">
            <textarea class="form-control text-xs text-main border-0" id="dash-quick-notes-area" rows="4" placeholder="Autosaving scratch note. Write thoughts here..." style="background-color: var(--bg-hover); border-radius: var(--border-radius-sm); resize: none; outline:none;">${quickNotes}</textarea>
          </div>
        `;

      case 'activity':
        const logs = window.storageService.get('activities') || [];
        if (logs.length === 0) {
          return `<div class="text-center text-muted text-xs py-4">No recent activity logged.</div>`;
        }
        return `
          <div class="py-1 overflow-y-auto" style="max-height: 120px;">
            ${logs.slice(0, 4).map(log => {
              const time = new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              return `
                <div class="text-xs py-1 border-bottom d-flex justify-content-between align-items-center gap-2">
                  <span class="text-main text-truncate" style="flex: 1; min-width: 0;">${log.text}</span>
                  <span class="text-muted text-2xs flex-shrink-0">${time}</span>
                </div>
              `;
            }).join('')}
          </div>
        `;

      default:
        return `<div class="text-muted text-xs">Widget configured.</div>`;
    }
  }

  bootWidgetInteractions(container) {
    // 1. Clock widget loop
    const clockEl = container.querySelector('#dash-live-clock');
    const dateEl = container.querySelector('#dash-live-date');
    if (clockEl && dateEl) {
      const updateClock = () => {
        const d = new Date();
        clockEl.textContent = d.toLocaleTimeString();
        dateEl.textContent = d.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      };
      this.clockInterval = setInterval(updateClock, 1000);
      updateClock();
    }

    // 2. Alarms countdown clock loop
    const countdownEl = container.querySelector('#dash-countdown-clock');
    if (countdownEl) {
      const targetTimeStr = countdownEl.getAttribute('data-time');
      const targetTime = new Date(targetTimeStr);
      const updateCountdown = () => {
        const diff = targetTime - new Date();
        if (diff <= 0) {
          countdownEl.textContent = '00:00:00';
          clearInterval(this.countdownInterval);
        } else {
          const hrs = Math.floor(diff / 3600000).toString().padStart(2, '0');
          const mins = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
          const secs = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
          countdownEl.textContent = `${hrs}:${mins}:${secs}`;
        }
      };
      this.countdownInterval = setInterval(updateCountdown, 1000);
      updateCountdown();
    }

    // 3. Scratchpad Note Autosave on key inputs
    const notesArea = container.querySelector('#dash-quick-notes-area');
    if (notesArea) {
      notesArea.addEventListener('input', () => {
        window.storageService.set('dash_quick_notes', notesArea.value);
      });
    }

    // 4. Todo item click checkmark toggle inside widget
    container.querySelectorAll('.dash-task-chk').forEach(chk => {
      chk.addEventListener('click', () => {
        const id = chk.getAttribute('data-id');
        const checked = !chk.classList.contains('checked');
        window.taskService.updateTask(id, { status: checked ? 'completed' : 'todo', progress: checked ? 100 : 0 });
        
        this.render(container);
        this.init(container);
      });
    });

    // 5. Habits item checkmark click toggle inside widget
    container.querySelectorAll('.dash-habit-chk-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const todayStr = new Date().toISOString().split('T')[0];
        window.habitService.toggleHabitDay(id, todayStr);
        
        this.render(container);
        this.init(container);
      });
    });

    // 6. Mini Pomodoro interactions inside widget
    const pomoClock = container.querySelector('#dash-pomo-clock');
    const pomoStatus = container.querySelector('#dash-pomo-status');
    const pomoStartBtn = container.querySelector('#dash-pomo-start-btn');
    const pomoResetBtn = container.querySelector('#dash-pomo-reset-btn');

    if (pomoClock && pomoStartBtn) {
      let duration = 25 * 60;
      let pomoTimer = null;
      let running = false;

      const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
      };

      pomoStartBtn.addEventListener('click', () => {
        if (!running) {
          running = true;
          pomoStartBtn.textContent = 'Pause';
          pomoStartBtn.classList.replace('btn-primary', 'btn-warning');
          
          pomoTimer = setInterval(() => {
            duration--;
            pomoClock.textContent = formatTime(duration);
            if (duration <= 0) {
              clearInterval(pomoTimer);
              pomoClock.textContent = '00:00';
              pomoStatus.textContent = 'Session Done!';
              running = false;
              pomoStartBtn.textContent = 'Start';
              pomoStartBtn.className = 'btn btn-sm btn-primary font-semibold text-xs py-1';
              window.notificationService.triggerNotification('Pomodoro Done!', 'Take a short break');
            }
          }, 1000);
        } else {
          clearInterval(pomoTimer);
          running = false;
          pomoStartBtn.textContent = 'Resume';
          pomoStartBtn.classList.replace('btn-warning', 'btn-primary');
        }
      });

      pomoResetBtn.addEventListener('click', () => {
        clearInterval(pomoTimer);
        running = false;
        duration = 25 * 60;
        pomoClock.textContent = '25:00';
        pomoStatus.textContent = 'Focus Session';
        pomoStartBtn.textContent = 'Start Session';
        pomoStartBtn.className = 'btn btn-sm btn-primary font-semibold text-xs py-1';
      });
    }
  }

  destroy() {
    if (this.clockInterval) clearInterval(this.clockInterval);
    if (this.countdownInterval) clearInterval(this.countdownInterval);
  }
}
