// Calendar View Component (UI Module)
// Draws Month grids, Week blocks, Day schedules, and Agenda tables.
// Globally Scoped.

window.CalendarView = class CalendarView {
  constructor(app) {
    this.app = app;
    this.currentDate = new Date();
    this.activeMode = 'month';
  }

  render(container) {
    container.innerHTML = `
      <div class="container-fluid py-4">
        <!-- Header Controls -->
        <div class="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
          <div>
            <h2 class="font-bold mb-1" id="cal-title-header">Planner Calendar</h2>
            <p class="text-muted text-sm mb-0">Consolidated schedule of your tasks, milestones, and reflections.</p>
          </div>

          <div class="d-flex gap-2 align-items-center">
            <div class="btn-group">
              <button class="btn btn-outline-secondary btn-sm" id="cal-prev-btn"><i class="bi bi-chevron-left"></i></button>
              <button class="btn btn-outline-secondary btn-sm font-semibold text-xs px-3" id="cal-today-btn">Today</button>
              <button class="btn btn-outline-secondary btn-sm" id="cal-next-btn"><i class="bi bi-chevron-right"></i></button>
            </div>
            
            <div class="btn-group">
              <button class="btn btn-outline-secondary btn-sm cal-mode-btn ${this.activeMode === 'month' ? 'active' : ''}" data-mode="month">Month</button>
              <button class="btn btn-outline-secondary btn-sm cal-mode-btn ${this.activeMode === 'week' ? 'active' : ''}" data-mode="week">Week</button>
              <button class="btn btn-outline-secondary btn-sm cal-mode-btn ${this.activeMode === 'day' ? 'active' : ''}" data-mode="day">Day</button>
              <button class="btn btn-outline-secondary btn-sm cal-mode-btn ${this.activeMode === 'agenda' ? 'active' : ''}" data-mode="agenda">Agenda</button>
            </div>
          </div>
        </div>

        <!-- Render Mount Target -->
        <div id="calendar-view-viewport"></div>
      </div>
    `;

    this.renderActiveGrid(container);
  }

  init(container) {
    container.querySelector('#cal-prev-btn').addEventListener('click', () => {
      this.navigateDate(-1);
      this.renderActiveGrid(container);
    });

    container.querySelector('#cal-next-btn').addEventListener('click', () => {
      this.navigateDate(1);
      this.renderActiveGrid(container);
    });

    container.querySelector('#cal-today-btn').addEventListener('click', () => {
      this.currentDate = new Date();
      this.renderActiveGrid(container);
    });

    container.querySelectorAll('.cal-mode-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        container.querySelectorAll('.cal-mode-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.activeMode = btn.getAttribute('data-mode');
        this.renderActiveGrid(container);
      });
    });
  }

  navigateDate(direction) {
    if (this.activeMode === 'month') {
      this.currentDate.setMonth(this.currentDate.getMonth() + direction);
    } else if (this.activeMode === 'week') {
      this.currentDate.setDate(this.currentDate.getDate() + direction * 7);
    } else if (this.activeMode === 'day') {
      this.currentDate.setDate(this.currentDate.getDate() + direction);
    } else {
      this.currentDate.setMonth(this.currentDate.getMonth() + direction);
    }
  }

  renderActiveGrid(container) {
    const viewport = container.querySelector('#calendar-view-viewport');
    const headerTitle = container.querySelector('#cal-title-header');
    const groupedEvents = window.calendarService.getEventsGroupedByDate();

    if (this.activeMode === 'month') {
      this.renderMonthGrid(viewport, headerTitle, groupedEvents);
    } else if (this.activeMode === 'week') {
      this.renderWeekGrid(viewport, headerTitle, groupedEvents);
    } else if (this.activeMode === 'day') {
      this.renderDayGrid(viewport, headerTitle, groupedEvents);
    } else {
      this.renderAgendaGrid(viewport, headerTitle);
    }
  }

  renderMonthGrid(viewport, headerTitle, grouped) {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    
    headerTitle.textContent = this.currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    
    let html = `
      <div class="premium-card p-0 overflow-hidden">
        <div class="row g-0 text-center py-2 border-bottom font-semibold text-xs text-muted" style="background-color: var(--bg-hover);">
          <div class="col" style="width:14%">Sun</div><div class="col" style="width:14%">Mon</div>
          <div class="col" style="width:14%">Tue</div><div class="col" style="width:14%">Wed</div>
          <div class="col" style="width:14%">Thu</div><div class="col" style="width:14%">Fri</div>
          <div class="col" style="width:14%">Sat</div>
        </div>
        <div class="row g-0">
    `;

    for (let i = 0; i < firstDay; i++) {
      html += `<div class="col p-2 text-muted border-end border-bottom text-2xs" style="width:14.28%; min-height:110px; background-color:var(--bg-app); opacity:0.3;"></div>`;
    }

    const todayStr = new Date().toISOString().split('T')[0];

    for (let day = 1; day <= totalDays; day++) {
      const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      const dayEvents = grouped[dateStr] || [];
      
      const isToday = dateStr === todayStr ? 'border-primary' : '';
      const cellBg = dateStr === todayStr ? 'rgba(var(--primary-color-rgb), 0.05)' : 'var(--bg-card)';

      const eventsListHtml = dayEvents.slice(0, 3).map(ev => `
        <div class="text-2xs px-1 rounded text-truncate font-semibold mb-1" style="background-color:${ev.color}; color:#fff; max-width:98%; font-size: 0.7rem; line-height:1.2;">
          ${ev.title}
        </div>
      `).join('');
      
      const overflowCount = dayEvents.length > 3 ? `<div class="text-2xs text-muted text-center font-bold">+${dayEvents.length - 3} more</div>` : '';

      html += `
        <div class="col p-2 border-end border-bottom cal-day-cell cursor-pointer ${isToday}" data-date="${dateStr}" style="width:14.28%; min-height:110px; background-color:${cellBg}; overflow:hidden;">
          <div class="d-flex justify-content-between mb-1">
            <span class="font-bold text-xs text-main">${day}</span>
            ${dayEvents.length > 0 ? `<span class="badge rounded-pill bg-secondary text-2xs px-1 py-0">${dayEvents.length}</span>` : ''}
          </div>
          <div class="d-flex flex-column gap-1">${eventsListHtml}</div>
          ${overflowCount}
        </div>
      `;
    }

    const remainingDays = 7 - ((firstDay + totalDays) % 7);
    if (remainingDays < 7) {
      for (let i = 0; i < remainingDays; i++) {
        html += `<div class="col p-2 border-bottom border-end text-muted text-2xs" style="width:14.28%; min-height:110px; background-color:var(--bg-app); opacity:0.3;"></div>`;
      }
    }

    html += `</div></div>`;
    viewport.innerHTML = html;

    viewport.querySelectorAll('.cal-day-cell').forEach(cell => {
      cell.addEventListener('click', () => {
        this.openDayAgendaDrawer(cell.getAttribute('data-date'));
      });
    });
  }

  renderWeekGrid(viewport, headerTitle, grouped) {
    const today = new Date(this.currentDate);
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
    const endOfWeek = new Date(today.setDate(today.getDate() + 6));
    
    headerTitle.textContent = `${startOfWeek.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} - ${endOfWeek.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}`;

    let html = `<div class="row g-2">`;
    
    for (let i = 0; i < 7; i++) {
      const cursor = new Date(startOfWeek);
      cursor.setDate(cursor.getDate() + i);
      const dateStr = cursor.toISOString().split('T')[0];
      const dayEvents = grouped[dateStr] || [];

      const activeDayName = cursor.toLocaleDateString(undefined, { weekday: 'short' });
      const activeDayNum = cursor.getDate();
      
      html += `
        <div class="col-md">
          <div class="premium-card h-100 p-2" style="min-height:350px;">
            <div class="text-center border-bottom pb-2 mb-3">
              <div class="text-xs text-muted font-semibold text-uppercase">${activeDayName}</div>
              <div class="h4 font-bold text-main mb-0">${activeDayNum}</div>
            </div>
            
            <div class="d-flex flex-column gap-2">
              ${dayEvents.map(ev => `
                <div class="p-2 rounded border" style="border-left: 3px solid ${ev.color} !important; background-color: var(--bg-hover); font-size: 0.75rem;">
                  <div class="font-bold text-main text-truncate">${ev.title}</div>
                  <div class="text-2xs text-muted mt-1"><i class="bi bi-clock"></i> ${new Date(ev.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                </div>
              `).join('')}
              ${dayEvents.length === 0 ? '<p class="text-muted text-center text-2xs py-4">No events</p>' : ''}
            </div>
          </div>
        </div>
      `;
    }

    html += `</div>`;
    viewport.innerHTML = html;
  }

  renderDayGrid(viewport, headerTitle, grouped) {
    const dateStr = this.currentDate.toISOString().split('T')[0];
    headerTitle.textContent = this.currentDate.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    const dayEvents = grouped[dateStr] || [];

    let html = `
      <div class="premium-card p-0 overflow-hidden">
        <div class="py-2 px-3 border-bottom font-semibold text-xs text-muted" style="background-color: var(--bg-hover);">
          Hourly Timeline Logs
        </div>
        <div class="d-flex flex-column" style="max-height: 500px; overflow-y: auto;">
    `;

    for (let hour = 0; hour < 24; hour++) {
      const hourStr = hour.toString().padStart(2, '0') + ':00';
      const slotEvents = dayEvents.filter(ev => {
        const time = new Date(ev.start).getHours();
        return time === hour;
      });

      const eventsHtml = slotEvents.map(ev => `
        <span class="badge text-xs px-2 py-1 text-white text-truncate" style="background-color:${ev.color}; max-width:200px;">
          ${ev.title}
        </span>
      `).join(' ');

      html += `
        <div class="d-flex border-bottom align-items-center py-2 px-3">
          <div class="text-muted font-bold text-xs" style="width: 60px;">${hourStr}</div>
          <div class="flex-grow-1 d-flex gap-2 flex-wrap">${eventsHtml}</div>
        </div>
      `;
    }

    html += `</div></div>`;
    viewport.innerHTML = html;
  }

  renderAgendaGrid(viewport, headerTitle) {
    headerTitle.textContent = "Upcoming Agenda Schedule";
    const events = window.calendarService.getCalendarEvents()
      .filter(ev => new Date(ev.start) >= new Date())
      .sort((a, b) => new Date(a.start) - new Date(b.start));

    if (events.length === 0) {
      viewport.innerHTML = `
        <div class="text-center py-5">
          <i class="bi bi-calendar-minus text-muted" style="font-size: 3rem;"></i>
          <h5 class="font-bold text-muted mt-3">No upcoming events scheduled.</h5>
        </div>
      `;
      return;
    }

    viewport.innerHTML = `
      <div class="premium-card p-0 overflow-hidden">
        <table class="table table-hover align-middle mb-0 text-sm">
          <thead class="table-light">
            <tr>
              <th>Date & Time</th>
              <th>Category</th>
              <th>Scheduled Event Description</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${events.map(ev => `
              <tr>
                <td class="font-semibold">${new Date(ev.start).toLocaleString()}</td>
                <td><span class="badge" style="background-color:${ev.color}">${ev.type.toUpperCase()}</span></td>
                <td class="text-main">${ev.title}</td>
                <td><span class="badge bg-light text-dark border">${ev.completed ? 'COMPLETED' : 'PENDING'}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  openDayAgendaDrawer(dateStr) {
    const grouped = window.calendarService.getEventsGroupedByDate();
    const dayEvents = grouped[dateStr] || [];

    const listHtml = dayEvents.map(ev => `
      <div class="p-3 border rounded mb-2 d-flex justify-content-between align-items-center" style="border-left: 4px solid ${ev.color} !important;">
        <div>
          <div class="font-semibold text-main">${ev.title}</div>
          <div class="text-xs text-muted"><i class="bi bi-clock"></i> ${new Date(ev.start).toLocaleTimeString()}</div>
        </div>
        <span class="badge bg-light text-dark border text-uppercase text-xs">${ev.type}</span>
      </div>
    `).join('');

    const html = `
      <div class="mb-4">
        <h6 class="font-bold text-xs text-uppercase text-muted mb-3">Agenda for ${new Date(dateStr).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h6>
        ${dayEvents.length > 0 ? listHtml : '<p class="text-muted text-xs text-center py-4">No events scheduled on this day.</p>'}
      </div>

      <h6 class="font-bold text-xs text-uppercase text-muted mb-2 border-top pt-3">Create Event on this Day</h6>
      <div class="d-grid gap-2">
        <button class="btn btn-outline-primary btn-sm font-semibold add-task-quick" data-date="${dateStr}">+ Add Task Target</button>
        <button class="btn btn-outline-warning btn-sm font-semibold add-rem-quick" data-date="${dateStr}">+ Set Alarm Reminder</button>
      </div>
    `;

    this.app.openDrawer('Day Agenda & Schedulers', html, (content) => {
      content.querySelector('.add-task-quick').addEventListener('click', () => {
        this.app.closeDrawer();
        this.app.switchView('tasks');
        
        setTimeout(() => {
          if (this.app.currentViewInstance instanceof window.TasksView) {
            this.app.currentViewInstance.openTaskEditDrawer(null, { dueDate: dateStr });
          }
        }, 300);
      });

      content.querySelector('.add-rem-quick').addEventListener('click', () => {
        this.app.closeDrawer();
        this.app.switchView('reminders');
        
        setTimeout(() => {
          if (this.app.currentViewInstance instanceof window.RemindersView) {
            this.app.currentViewInstance.openAddReminderDrawer();
            const dateInput = document.getElementById('rem-datetime');
            if (dateInput) {
              dateInput.value = `${dateStr}T09:00`;
            }
          }
        }, 300);
      });
    });
  }

  destroy() {}
}
