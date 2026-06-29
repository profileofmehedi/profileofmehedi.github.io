// Reminders View Component (UI Module)
// Manages alert triggers list, recurring rules, category badges, and active countdowns.
// Globally Scoped.

window.RemindersView = class RemindersView {
  constructor(app) {
    this.app = app;
    this.filterTab = 'upcoming';
    this.countdownInterval = null;
  }

  render(container) {
    const list = this.getFilteredReminders();
    const allReminders = window.reminderService.getReminders();
    const activeReminders = allReminders.filter(r => !r.completed);
    const completedReminders = allReminders.filter(r => r.completed);
    
    const now = new Date();
    const missedReminders = allReminders.filter(r => !r.completed && new Date(r.dateTime) < now);
    const upcomingCount = activeReminders.length - missedReminders.length;

    container.innerHTML = `
      <div class="container-fluid py-4">
        <!-- Header -->
        <div class="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3 mb-4">
          <div>
            <h2 class="font-bold mb-1">Alert Reminders</h2>
            <p class="text-muted text-sm mb-0">Schedule one-time or recurring alarms with audio synthesized ringers.</p>
          </div>
          <button class="btn btn-primary btn-sm font-semibold flex-shrink-0" id="reminder-add-btn">
            <i class="bi bi-plus-lg"></i> Set Alarm
          </button>
        </div>

        <!-- Stats Summary Bar -->
        <div class="row g-2 g-sm-3 mb-4">
          <div class="col-6 col-lg-3">
            <div class="premium-card p-2 p-sm-3 d-flex align-items-center justify-content-center justify-content-sm-start gap-2 gap-sm-3 h-100">
              <div class="rounded-circle d-none d-sm-flex align-items-center justify-content-center" style="width: 44px; height: 44px; font-size: 1.25rem; background-color: rgba(59, 130, 246, 0.1); color: #3b82f6; flex-shrink: 0;">
                <i class="bi bi-bell"></i>
              </div>
              <div class="text-center text-sm-start">
                <div class="text-2xs text-muted font-bold text-uppercase">Total Alarms</div>
                <div class="h4 font-bold mb-0 text-main">${allReminders.length}</div>
              </div>
            </div>
          </div>
          <div class="col-6 col-lg-3">
            <div class="premium-card p-2 p-sm-3 d-flex align-items-center justify-content-center justify-content-sm-start gap-2 gap-sm-3 h-100">
              <div class="rounded-circle d-none d-sm-flex align-items-center justify-content-center" style="width: 44px; height: 44px; font-size: 1.25rem; background-color: rgba(16, 185, 129, 0.1); color: #10b981; flex-shrink: 0;">
                <i class="bi bi-clock-history"></i>
              </div>
              <div class="text-center text-sm-start">
                <div class="text-2xs text-muted font-bold text-uppercase">Upcoming</div>
                <div class="h4 font-bold mb-0 text-main">${upcomingCount}</div>
              </div>
            </div>
          </div>
          <div class="col-6 col-lg-3">
            <div class="premium-card p-2 p-sm-3 d-flex align-items-center justify-content-center justify-content-sm-start gap-2 gap-sm-3 h-100">
              <div class="rounded-circle d-none d-sm-flex align-items-center justify-content-center" style="width: 44px; height: 44px; font-size: 1.25rem; background-color: rgba(239, 68, 68, 0.1); color: #ef4444; flex-shrink: 0;">
                <i class="bi bi-exclamation-octagon"></i>
              </div>
              <div class="text-center text-sm-start">
                <div class="text-2xs text-muted font-bold text-uppercase">Missed</div>
                <div class="h4 font-bold mb-0 text-danger">${missedReminders.length}</div>
              </div>
            </div>
          </div>
          <div class="col-6 col-lg-3">
            <div class="premium-card p-2 p-sm-3 d-flex align-items-center justify-content-center justify-content-sm-start gap-2 gap-sm-3 h-100">
              <div class="rounded-circle d-none d-sm-flex align-items-center justify-content-center" style="width: 44px; height: 44px; font-size: 1.25rem; background-color: rgba(139, 92, 246, 0.1); color: #8b5cf6; flex-shrink: 0;">
                <i class="bi bi-check-circle"></i>
              </div>
              <div class="text-center text-sm-start">
                <div class="text-2xs text-muted font-bold text-uppercase">Completed</div>
                <div class="h4 font-bold mb-0 text-main">${completedReminders.length}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Alarm Creation Card -->
        <div class="premium-card p-3 mb-4">
          <h6 class="font-bold text-xs text-uppercase text-muted mb-2"><i class="bi bi-lightning-charge"></i> Quick Alarm Scheduler</h6>
          <form id="quick-reminder-form" class="row g-2 align-items-center">
            <div class="col-12 col-md-5">
              <input type="text" id="quick-rem-title" class="form-control form-control-sm text-sm" placeholder="Quick alert name (e.g. Drink water, stretch)..." required>
            </div>
            <div class="col-12 col-md-3">
              <select id="quick-rem-time-offset" class="form-select form-select-sm text-xs">
                <option value="15">In 15 minutes</option>
                <option value="30">In 30 minutes</option>
                <option value="60" selected>In 1 hour</option>
                <option value="120">In 2 hours</option>
                <option value="morning">Tomorrow morning (9 AM)</option>
              </select>
            </div>
            <div class="col-12 col-md-2">
              <select id="quick-rem-category" class="form-select form-select-sm text-xs">
                <option value="health">Health</option>
                <option value="work">Work</option>
                <option value="finance">Finance</option>
              </select>
            </div>
            <div class="col-12 col-md-2">
              <button type="submit" class="btn btn-primary btn-sm font-semibold w-100 py-1"><i class="bi bi-plus-lg"></i> Add Alarm</button>
            </div>
          </form>
        </div>

        <!-- Filter tabs & summary -->
        <div class="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-2 mb-4 border-bottom pb-2">
          <ul class="nav nav-pills gap-1">
            <li class="nav-item">
              <button class="nav-link py-1 px-3 text-sm rem-filter-btn ${this.filterTab === 'upcoming' ? 'active' : ''}" data-filter="upcoming">Upcoming</button>
            </li>
            <li class="nav-item">
              <button class="nav-link py-1 px-3 text-sm rem-filter-btn ${this.filterTab === 'completed' ? 'active' : ''}" data-filter="completed">Completed</button>
            </li>
            <li class="nav-item">
              <button class="nav-link py-1 px-3 text-sm rem-filter-btn ${this.filterTab === 'all' ? 'active' : ''}" data-filter="all">All Logs</button>
            </li>
          </ul>
          
          <span class="text-xs text-muted font-semibold mb-2 mb-sm-0">Active timers: ${list.filter(r => !r.completed).length} pending</span>
        </div>

        <!-- Cards View List -->
        <div class="row g-3" id="reminders-list-container">
          ${this.buildRemindersListHtml(list)}
        </div>
      </div>
    `;
  }

  init(container) {
    // Check URL parameters for quick-add actions from other pages
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('action') === 'add-reminder') {
      const date = urlParams.get('date');
      window.history.replaceState({}, document.title, window.location.pathname);
      setTimeout(() => {
        this.openAddReminderDrawer();
        const dateInput = document.getElementById('rem-datetime');
        if (dateInput) {
          dateInput.value = `${date}T09:00`;
        }
      }, 100);
    }

    // Quick Alarm Scheduler Submit
    const quickForm = container.querySelector('#quick-reminder-form');
    if (quickForm) {
      quickForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = container.querySelector('#quick-rem-title').value.trim();
        const offsetVal = container.querySelector('#quick-rem-time-offset').value;
        const category = container.querySelector('#quick-rem-category').value;
        
        let targetDate = new Date();
        if (offsetVal === 'morning') {
          targetDate.setDate(targetDate.getDate() + 1);
          targetDate.setHours(9, 0, 0, 0);
        } else {
          const minutes = parseInt(offsetVal, 10);
          targetDate.setMinutes(targetDate.getMinutes() + minutes);
        }

        const pad = (n) => n.toString().padStart(2, '0');
        const localDateTimeStr = `${targetDate.getFullYear()}-${pad(targetDate.getMonth()+1)}-${pad(targetDate.getDate())}T${pad(targetDate.getHours())}:${pad(targetDate.getMinutes())}`;

        window.reminderService.addReminder({
          title,
          dateTime: localDateTimeStr,
          category,
          type: 'one-time',
          repeat: 'none',
          completed: false
        });

        window.notificationService.showToast('Quick reminder scheduled!', 'success');
        this.app.refreshNotificationDropdown();
        this.render(container);
        this.init(container);
      });
    }

    container.querySelector('#reminder-add-btn').addEventListener('click', () => {
      this.openAddReminderDrawer();
    });

    container.querySelectorAll('.rem-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.filterTab = btn.getAttribute('data-filter');
        this.render(container);
        this.init(container);
      });
    });

    container.querySelectorAll('.check-rem-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        window.reminderService.updateReminder(id, { completed: true });
        window.notificationService.showToast('Reminder checked off', 'success');
        this.app.refreshNotificationDropdown();
        this.render(container);
        this.init(container);
      });
    });

    container.querySelectorAll('.delete-rem-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (confirm("Delete this reminder?")) {
          window.reminderService.deleteReminder(btn.getAttribute('data-id'));
          window.notificationService.showToast('Reminder deleted', 'success');
          this.app.refreshNotificationDropdown();
          this.render(container);
          this.init(container);
        }
      });
    });

    this.bootTickingCountdowns(container);
  }

  getFilteredReminders() {
    const list = window.reminderService.getReminders();
    if (this.filterTab === 'upcoming') {
      return list.filter(r => !r.completed);
    } else if (this.filterTab === 'completed') {
      return list.filter(r => r.completed);
    }
    return list;
  }

  buildRemindersListHtml(list) {
    if (list.length === 0) {
      return `
        <div class="col-12 text-center py-5">
          <i class="bi bi-bell-slash text-muted" style="font-size: 3rem;"></i>
          <h5 class="font-bold text-muted mt-3">No reminders found in this folder.</h5>
        </div>
      `;
    }

    return list.map(rem => {
      const now = new Date();
      const target = new Date(rem.dateTime);
      const isMissed = target < now && !rem.completed;
      
      const badgeCat = {
        health: 'bg-info-subtle text-info border border-info-subtle',
        work: 'bg-primary-subtle text-primary border border-primary-subtle',
        finance: 'bg-success-subtle text-success border border-success-subtle'
      }[rem.category] || 'bg-light text-dark';

      let stateText = '';
      if (rem.completed) {
        stateText = `<span class="badge bg-success text-capitalize"><i class="bi bi-check-circle"></i> Completed</span>`;
      } else if (isMissed) {
        stateText = `<span class="badge bg-danger text-capitalize"><i class="bi bi-exclamation-triangle"></i> Missed Deadline</span>`;
      } else {
        stateText = `<span class="badge bg-primary text-capitalize"><i class="bi bi-clock"></i> Active</span>`;
      }

      return `
        <div class="col-md-6 col-lg-4">
          <div class="premium-card h-100 d-flex flex-column">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <span class="badge text-uppercase text-xs ${badgeCat}">${rem.category}</span>
              ${stateText}
            </div>
            
            <h5 class="font-bold text-main mb-1">${rem.title}</h5>
            <div class="text-xs text-muted mb-3"><i class="bi bi-calendar-event"></i> ${target.toLocaleString()}</div>
            
            ${!rem.completed && !isMissed ? `
              <div class="alert alert-light py-2 text-center border mb-3">
                <span class="text-xs text-muted d-block mb-1">Time Remaining</span>
                <span class="h4 font-bold text-primary rem-ticking-timer" data-time="${rem.dateTime}">00:00:00</span>
              </div>
            ` : ''}

            <div class="text-xs font-semibold text-muted mt-auto mb-3">
              <i class="bi bi-arrow-repeat"></i> Recurring: <span class="text-capitalize text-main">${rem.repeat === 'none' ? 'One Time' : rem.repeat}</span>
            </div>

            <div class="d-flex justify-content-between border-top pt-2">
              ${!rem.completed ? `
                <button class="btn btn-sm btn-outline-success check-rem-btn" data-id="${rem.id}"><i class="bi bi-check2-all"></i> Check Off</button>
              ` : '<div></div>'}
              <button class="btn btn-sm btn-link text-danger p-0 delete-rem-btn" data-id="${rem.id}"><i class="bi bi-trash"></i> Delete</button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  bootTickingCountdowns(container) {
    const timers = container.querySelectorAll('.rem-ticking-timer');
    if (timers.length === 0) return;

    const updateTimers = () => {
      const now = new Date();
      timers.forEach(t => {
        const targetStr = t.getAttribute('data-time');
        const target = new Date(targetStr);
        const diff = target - now;

        if (diff <= 0) {
          t.textContent = '00:00:00';
          t.classList.replace('text-primary', 'text-danger');
        } else {
          const hrs = Math.floor(diff / 3600000).toString().padStart(2, '0');
          const mins = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
          const secs = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
          t.textContent = `${hrs}:${mins}:${secs}`;
        }
      });
    };

    this.countdownInterval = setInterval(updateTimers, 1000);
    updateTimers();
  }

  openAddReminderDrawer() {
    const html = `
      <form id="add-reminder-form">
        <div class="mb-3">
          <label class="form-label font-semibold text-sm">Reminder Title</label>
          <input type="text" id="rem-title" class="form-control" placeholder="Drink water, Log expenses..." required>
        </div>

        <div class="mb-3">
          <label class="form-label font-semibold text-sm">Schedule Trigger Time</label>
          <input type="datetime-local" id="rem-datetime" class="form-control" required>
        </div>

        <div class="mb-3">
          <label class="form-label font-semibold text-sm">Category Badge</label>
          <select id="rem-category" class="form-select">
            <option value="health">Health</option>
            <option value="work">Work</option>
            <option value="finance">Finance</option>
          </select>
        </div>

        <div class="row g-2 mb-3">
          <div class="col-6">
            <label class="form-label font-semibold text-sm">Alarm Type</label>
            <select id="rem-type" class="form-select">
              <option value="one-time">One Time</option>
              <option value="recurring">Recurring</option>
            </select>
          </div>
          <div class="col-6">
            <label class="form-label font-semibold text-sm">Recurrence Rule</label>
            <select id="rem-repeat" class="form-select">
              <option value="none">None</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
        </div>

        <button type="submit" class="btn btn-primary w-100 font-semibold mt-3">Schedule Ringer</button>
      </form>
    `;

    this.app.openDrawer('Schedule Alarm Reminder', html, (content) => {
      const typeSelect = content.querySelector('#rem-type');
      const repeatSelect = content.querySelector('#rem-repeat');

      typeSelect.addEventListener('change', () => {
        if (typeSelect.value === 'one-time') {
          repeatSelect.value = 'none';
        } else if (repeatSelect.value === 'none') {
          repeatSelect.value = 'daily';
        }
      });

      repeatSelect.addEventListener('change', () => {
        if (repeatSelect.value !== 'none') {
          typeSelect.value = 'recurring';
        } else {
          typeSelect.value = 'one-time';
        }
      });

      content.querySelector('#add-reminder-form').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const title = content.querySelector('#rem-title').value;
        const dateTime = content.querySelector('#rem-datetime').value;
        const category = content.querySelector('#rem-category').value;
        const type = typeSelect.value;
        const repeat = repeatSelect.value;

        window.reminderService.addReminder({
          title,
          dateTime,
          category,
          type,
          repeat,
          completed: false
        });

        window.notificationService.showToast('Reminder schedule created', 'success');
        this.app.closeDrawer();
        this.app.refreshNotificationDropdown();

        this.render(document.getElementById('app-view-container'));
        this.init(document.getElementById('app-view-container'));
      });
    });
  }

  destroy() {
    if (this.countdownInterval) clearInterval(this.countdownInterval);
  }
}
