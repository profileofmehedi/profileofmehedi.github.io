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

    container.innerHTML = `
      <div class="container-fluid py-4">
        <!-- Header -->
        <div class="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 class="font-bold mb-1">Habits Tracker</h2>
            <p class="text-muted text-sm mb-0">Build consistency by logging your routines daily and watching streaks grow.</p>
          </div>
          <button class="btn btn-primary btn-sm font-semibold" id="habit-add-btn">
            <i class="bi bi-plus-lg"></i> Add Habit
          </button>
        </div>

        <!-- Habits Table Card Grid -->
        <div class="premium-card p-0 overflow-hidden">
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
      </div>
    `;
  }

  init(container) {
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
