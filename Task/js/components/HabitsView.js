// Habits View Component (UI Module)
// Implements tracking lists, weekly completion matrices, streak calculators, and add routines.
// Globally Scoped.

window.HabitsView = class HabitsView {
  constructor(app) {
    this.app = app;
  }

  getLastWeekDays() {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push({
        dateStr: d.toISOString().split('T')[0],
        label: d.toLocaleDateString(undefined, { weekday: 'narrow' }),
        num: d.getDate()
      });
    }
    return days;
  }

  render(container) {
    const list = window.habitService.getHabits();
    const lastWeek = this.getLastWeekDays();

    let totalCheckins = 0;
    let highestStreak = 0;
    let activeStreakCount = 0;
    list.forEach(h => {
      const streaks = window.habitService.getHabitStreaks(h);
      if (streaks.current > 0) activeStreakCount++;
      if (streaks.current > highestStreak) highestStreak = streaks.current;
      
      Object.values(h.history).forEach(v => {
        if (v === true) totalCheckins++;
      });
    });

    container.innerHTML = `
      <div class="container-fluid py-4">
        <!-- Header -->
        <div class="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3 mb-4">
          <div>
            <h2 class="font-bold mb-1">Habits Tracker</h2>
            <p class="text-muted text-sm mb-0">Build consistency by logging your routines daily and watching streaks grow.</p>
          </div>
          <button class="btn btn-primary btn-sm font-semibold flex-shrink-0" id="habit-add-btn">
            <i class="bi bi-plus-lg"></i> Add Habit
          </button>
        </div>

        <!-- Stats Summary Bar -->
        <div class="row g-2 g-sm-3 mb-4">
          <div class="col-6 col-lg-3">
            <div class="premium-card p-2 p-sm-3 d-flex align-items-center justify-content-center justify-content-sm-start gap-2 gap-sm-3 h-100">
              <div class="rounded-circle d-none d-sm-flex align-items-center justify-content-center" style="width: 44px; height: 44px; font-size: 1.25rem; background-color: rgba(59, 130, 246, 0.1); color: #3b82f6; flex-shrink: 0;">
                <i class="bi bi-lightning"></i>
              </div>
              <div class="text-center text-sm-start">
                <div class="text-2xs text-muted font-bold text-uppercase">Total Habits</div>
                <div class="h4 font-bold mb-0 text-main">${list.length}</div>
              </div>
            </div>
          </div>
          <div class="col-6 col-lg-3">
            <div class="premium-card p-2 p-sm-3 d-flex align-items-center justify-content-center justify-content-sm-start gap-2 gap-sm-3 h-100">
              <div class="rounded-circle d-none d-sm-flex align-items-center justify-content-center" style="width: 44px; height: 44px; font-size: 1.25rem; background-color: rgba(239, 68, 68, 0.1); color: #ef4444; flex-shrink: 0;">
                <i class="bi bi-fire"></i>
              </div>
              <div class="text-center text-sm-start">
                <div class="text-2xs text-muted font-bold text-uppercase">Active Streaks</div>
                <div class="h4 font-bold mb-0 text-danger">${activeStreakCount}</div>
              </div>
            </div>
          </div>
          <div class="col-6 col-lg-3">
            <div class="premium-card p-2 p-sm-3 d-flex align-items-center justify-content-center justify-content-sm-start gap-2 gap-sm-3 h-100">
              <div class="rounded-circle d-none d-sm-flex align-items-center justify-content-center" style="width: 44px; height: 44px; font-size: 1.25rem; background-color: rgba(245, 158, 11, 0.1); color: #f59e0b; flex-shrink: 0;">
                <i class="bi bi-trophy"></i>
              </div>
              <div class="text-center text-sm-start">
                <div class="text-2xs text-muted font-bold text-uppercase">Best Streak</div>
                <div class="h4 font-bold mb-0 text-warning">${highestStreak}d</div>
              </div>
            </div>
          </div>
          <div class="col-6 col-lg-3">
            <div class="premium-card p-2 p-sm-3 d-flex align-items-center justify-content-center justify-content-sm-start gap-2 gap-sm-3 h-100">
              <div class="rounded-circle d-none d-sm-flex align-items-center justify-content-center" style="width: 44px; height: 44px; font-size: 1.25rem; background-color: rgba(16, 185, 129, 0.1); color: #10b981; flex-shrink: 0;">
                <i class="bi bi-calendar-check"></i>
              </div>
              <div class="text-center text-sm-start">
                <div class="text-2xs text-muted font-bold text-uppercase">Total Check-ins</div>
                <div class="h4 font-bold mb-0 text-main">${totalCheckins}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Habit Creation Card -->
        <div class="premium-card p-3 mb-4">
          <h6 class="font-bold text-xs text-uppercase text-muted mb-2"><i class="bi bi-lightning-charge"></i> Quick Habit Creator</h6>
          <form id="quick-habit-form" class="row g-3 align-items-center">
            <div class="col-12 col-md-7">
              <input type="text" id="quick-habit-title" class="form-control form-control-sm text-sm" placeholder="Habit Routine name (e.g. Read 30m, Drink water)..." required>
            </div>
            <div class="col-12 col-md-3">
              <select id="quick-habit-freq" class="form-select form-select-sm text-xs">
                <option value="daily" selected>Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            <div class="col-12 col-md-2">
              <button type="submit" class="btn btn-primary btn-sm font-semibold w-100 py-1"><i class="bi bi-plus-lg"></i> Add Habit</button>
            </div>
          </form>
        </div>

        <!-- Desktop Table View -->
        <div class="d-none d-md-block premium-card p-0 overflow-hidden">
          <table class="table align-middle mb-0 text-sm">
            <thead class="table-light">
              <tr>
                <th>Routine Habit Description</th>
                <th width="150">Current Streak</th>
                <th width="150">Longest Streak</th>
                <th width="150">30-day Rate</th>
                <th width="280" class="text-center">Weekly Log Matrix (Last 7 Days)</th>
                <th width="80" class="pe-3">Action</th>
              </tr>
            </thead>
            <tbody>
              ${list.map(h => {
                const streaks = window.habitService.getHabitStreaks(h);
                return `
                  <tr class="habit-row-item" data-id="${h.id}">
                    <td>
                      <div class="font-semibold text-main">${h.title}</div>
                      <div class="text-xs text-muted text-capitalize"><i class="bi bi-calendar-check"></i> ${h.frequency}</div>
                    </td>
                    <td>
                      <span class="h6 font-bold text-danger mb-0"><i class="bi bi-fire text-danger"></i> ${streaks.current}d</span>
                    </td>
                    <td>
                      <span class="h6 font-bold text-muted mb-0"><i class="bi bi-award text-muted"></i> ${streaks.longest}d</span>
                    </td>
                    <td>
                      <div class="d-flex align-items-center gap-2">
                        <div class="progress" style="width: 70px; height: 6px; border-radius:3px;">
                          <div class="progress-bar bg-success" style="width:${streaks.completionRate}%"></div>
                        </div>
                        <span class="text-xs font-semibold text-muted">${streaks.completionRate}%</span>
                      </div>
                    </td>
                    <td>
                      <div class="d-flex justify-content-center gap-2">
                        ${lastWeek.map(day => {
                          const checked = h.history[day.dateStr] === true;
                          const activeClass = checked ? 'btn-success' : 'btn-outline-secondary';
                          return `
                            <button class="btn btn-xs ${activeClass} py-1 px-2 text-xs habit-matrix-btn" 
                                    data-id="${h.id}" 
                                    data-date="${day.dateStr}" 
                                    title="Log for ${day.dateStr}">
                              <div>${day.label}</div>
                              <div class="font-bold text-2xs mt-1" style="font-size:0.6rem;">${day.num}</div>
                            </button>
                          `;
                        }).join('')}
                      </div>
                    </td>
                    <td class="pe-3">
                      <button class="btn btn-sm btn-outline-danger p-1 habit-delete-btn" data-id="${h.id}"><i class="bi bi-trash-fill"></i></button>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
          ${list.length === 0 ? `
            <div class="text-center py-5">
              <i class="bi bi-lightning-charge text-muted" style="font-size: 3rem;"></i>
              <h5 class="font-bold text-muted mt-3">No habits created yet.</h5>
            </div>
          ` : ''}
        </div>

        <!-- Mobile Stacked Card View -->
        <div class="d-block d-md-none">
          ${list.map(h => {
            const streaks = window.habitService.getHabitStreaks(h);
            return `
              <div class="premium-card p-3 mb-3 habit-card" data-id="${h.id}">
                <div class="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <h5 class="font-bold text-main mb-1 fs-6">${h.title}</h5>
                    <span class="badge bg-light text-dark text-capitalize border"><i class="bi bi-calendar-check text-muted"></i> ${h.frequency}</span>
                  </div>
                  <button class="btn btn-sm btn-outline-danger p-1 py-0 px-2 habit-delete-btn" data-id="${h.id}">
                    <i class="bi bi-trash"></i>
                  </button>
                </div>

                <div class="row g-2 mb-3 text-center border-top border-bottom py-2 bg-light rounded mx-0">
                  <div class="col-4">
                    <div class="text-3xs text-muted font-bold text-uppercase">Current</div>
                    <div class="text-sm font-bold text-danger"><i class="bi bi-fire"></i> ${streaks.current}d</div>
                  </div>
                  <div class="col-4 border-start border-end">
                    <div class="text-3xs text-muted font-bold text-uppercase">Longest</div>
                    <div class="text-sm font-bold text-muted"><i class="bi bi-award"></i> ${streaks.longest}d</div>
                  </div>
                  <div class="col-4">
                    <div class="text-3xs text-muted font-bold text-uppercase">30-day</div>
                    <div class="text-sm font-bold text-success">${streaks.completionRate}%</div>
                  </div>
                </div>

                <div class="text-center">
                  <div class="text-3xs text-muted font-bold text-uppercase mb-2">Weekly Log Matrix (Last 7 Days)</div>
                  <div class="d-flex justify-content-center gap-1">
                    ${lastWeek.map(day => {
                      const checked = h.history[day.dateStr] === true;
                      const activeClass = checked ? 'btn-success' : 'btn-outline-secondary';
                      return `
                        <button class="btn btn-xs ${activeClass} py-1 px-1 text-2xs habit-matrix-btn flex-grow-1" 
                                data-id="${h.id}" 
                                data-date="${day.dateStr}" 
                                title="Log for ${day.dateStr}"
                                style="min-width: 30px;">
                          <div>${day.label}</div>
                          <div class="font-bold text-3xs mt-1" style="font-size:0.55rem;">${day.num}</div>
                        </button>
                      `;
                    }).join('')}
                  </div>
                </div>
              </div>
            `;
          }).join('')}
          ${list.length === 0 ? `
            <div class="premium-card text-center py-5">
              <i class="bi bi-lightning-charge text-muted" style="font-size: 3rem;"></i>
              <h5 class="font-bold text-muted mt-3">No habits created yet.</h5>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  init(container) {
    // Quick Habit Submission
    const quickForm = container.querySelector('#quick-habit-form');
    if (quickForm) {
      quickForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = container.querySelector('#quick-habit-title').value.trim();
        const freq = container.querySelector('#quick-habit-freq').value;

        window.habitService.addHabit(title, freq);
        window.notificationService.showToast(`Habit "${title}" created!`, 'success');

        this.render(container);
        this.init(container);
      });
    }

    container.querySelectorAll('.habit-matrix-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const dateStr = btn.getAttribute('data-date');
        
        window.habitService.toggleHabitDay(id, dateStr);
        
        if (!btn.classList.contains('btn-success')) {
          window.notificationService.playNotificationSound();
        }

        this.render(container);
        this.init(container);
      });
    });

    container.querySelector('#habit-add-btn').addEventListener('click', () => {
      this.openAddHabitDrawer();
    });

    container.querySelectorAll('.habit-delete-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (confirm("Are you sure you want to delete this habit?")) {
          window.habitService.deleteHabit(btn.getAttribute('data-id'));
          window.notificationService.showToast('Habit deleted', 'success');
          this.render(container);
          this.init(container);
        }
      });
    });
  }

  openAddHabitDrawer() {
    const html = `
      <form id="add-habit-drawer-form">
        <div class="mb-3">
          <label class="form-label font-semibold text-sm">Habit Description</label>
          <input type="text" id="habit-title-input" class="form-control" placeholder="e.g. Read 30m, Gym Workout..." required>
        </div>

        <div class="mb-3">
          <label class="form-label font-semibold text-sm">Tracking Frequency</label>
          <select id="habit-freq-input" class="form-select">
            <option value="daily" selected>Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>

        <button type="submit" class="btn btn-primary w-100 font-semibold mt-3">Add Routine Habit</button>
      </form>
    `;

    this.app.openDrawer('Create Routine Habit', html, (content) => {
      content.querySelector('#add-habit-drawer-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const title = content.querySelector('#habit-title-input').value;
        const freq = content.querySelector('#habit-freq-input').value;

        window.habitService.addHabit(title, freq);
        window.notificationService.showToast(`Habit "${title}" created`, 'success');
        this.app.closeDrawer();

        this.render(document.getElementById('app-view-container'));
        this.init(document.getElementById('app-view-container'));
      });
    });
  }

  destroy() {}
}
