// Daily Journal View Component (UI Module)
// Implements mood selection panels, achievements checklists, reflections text,
// and scrollable timelines.
// Globally Scoped.

window.JournalView = class JournalView {
  constructor(app) {
    this.app = app;
  }

  render(container) {
    const list = window.journalService.getEntries().sort((a, b) => new Date(b.date) - new Date(a.date));
    const todayStr = new Date().toISOString().split('T')[0];
    const loggedToday = list.some(j => j.date === todayStr);

    container.innerHTML = `
      <div class="container-fluid py-4">
        <!-- Header -->
        <div class="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 class="font-bold mb-1">Daily Journal</h2>
            <p class="text-muted text-sm mb-0">Track your daily mood index, capture achievements, and reflect on thoughts.</p>
          </div>
          ${!loggedToday ? `
            <button class="btn btn-primary btn-sm font-semibold" id="journal-log-today-btn">
              <i class="bi bi-pencil-square"></i> Log Today
            </button>
          ` : `
            <span class="badge bg-success-subtle text-success border border-success-subtle py-2 px-3 text-xs"><i class="bi bi-check-all"></i> Logged Today</span>
          `}
        </div>

        <div class="row g-4">
          <!-- Timelines Group -->
          <div class="col-lg-8">
            <div class="premium-card p-0 overflow-hidden">
              <div class="py-3 px-4 border-bottom font-bold text-main">Journal Timelines</div>
              <div class="p-4 overflow-y-auto" style="max-height: 500px;">
                ${this.buildTimelineHtml(list)}
              </div>
            </div>
          </div>

          <!-- Quick Statistics Summary -->
          <div class="col-lg-4">
            <div class="premium-card">
              <h6 class="font-bold mb-3 text-main">Mood Insights Share</h6>
              <div class="row g-2 text-center text-xs">
                ${this.buildMoodInsightsHtml(list)}
              </div>
            </div>
          </div>
        </div>

      </div>
    `;
  }

  init(container) {
    const logBtn = container.querySelector('#journal-log-today-btn');
    if (logBtn) {
      logBtn.addEventListener('click', () => {
        this.openJournalDrawer();
      });
    }

    container.querySelectorAll('.edit-journal-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        this.openJournalDrawer(id);
      });
    });

    container.querySelectorAll('.delete-journal-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (confirm("Delete this journal log?")) {
          window.journalService.deleteEntry(btn.getAttribute('data-id'));
          window.notificationService.showToast('Journal log removed', 'success');
          this.render(container);
          this.init(container);
        }
      });
    });
  }

  buildTimelineHtml(list) {
    if (list.length === 0) {
      return `
        <div class="text-center py-5">
          <i class="bi bi-journal-x text-muted" style="font-size: 3rem;"></i>
          <h6 class="font-bold text-muted mt-3">No reflections recorded yet.</h6>
          <p class="text-muted text-2xs">Begin logging today's thoughts!</p>
        </div>
      `;
    }

    const moodEmojis = {
      happy: '😊',
      productive: '💪',
      tired: '🥱',
      stressed: '😰',
      neutral: '😐'
    };

    return list.map(entry => {
      const emoji = moodEmojis[entry.mood] || '📝';
      const achsHtml = entry.achievements.map(a => `
        <li class="mb-1"><i class="bi bi-patch-check-fill text-success"></i> ${a}</li>
      `).join('');

      return `
        <div class="p-3 border rounded mb-3 position-relative" style="background-color: var(--bg-card); border-left: 4px solid var(--primary-color) !important;">
          <div class="d-flex justify-content-between align-items-start mb-2">
            <div>
              <span class="h5 font-bold text-main">${new Date(entry.date).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</span>
              <span class="ms-2" title="Mood: ${entry.mood}">${emoji}</span>
            </div>
            <div class="d-flex gap-2">
              <button class="btn btn-sm btn-outline-secondary p-1 edit-journal-btn" data-id="${entry.id}"><i class="bi bi-pencil-fill"></i></button>
              <button class="btn btn-sm btn-outline-danger p-1 delete-journal-btn" data-id="${entry.id}"><i class="bi bi-trash-fill"></i></button>
            </div>
          </div>
          
          <p class="text-xs text-muted font-semibold mt-1 mb-2" style="font-style:italic;">"${entry.reflection}"</p>
          
          ${entry.achievements.length > 0 ? `
            <div class="mt-2 text-xs">
              <div class="font-bold text-main mb-1">Key Achievements Done</div>
              <ul class="list-unstyled ps-0 mb-2">${achsHtml}</ul>
            </div>
          ` : ''}

          ${entry.tomorrowPlan ? `
            <div class="mt-2 text-xs">
              <div class="font-bold text-main mb-1"><i class="bi bi-brightness-high text-warning"></i> Plan for Tomorrow</div>
              <p class="text-muted mb-0">${entry.tomorrowPlan}</p>
            </div>
          ` : ''}
        </div>
      `;
    }).join('');
  }

  buildMoodInsightsHtml(list) {
    if (list.length === 0) {
      return `<p class="text-muted text-center text-xs py-4">No data logged.</p>`;
    }

    const counts = { happy: 0, productive: 0, tired: 0, stressed: 0, neutral: 0 };
    list.forEach(j => {
      if (counts[j.mood] !== undefined) counts[j.mood]++;
    });

    const emojis = { happy: '😊', productive: '💪', tired: '🥱', stressed: '😰', neutral: '😐' };

    return Object.entries(counts).map(([mood, count]) => {
      const pct = Math.round((count / list.length) * 100) || 0;
      return `
        <div class="col-6 mb-3">
          <div class="p-2 border rounded text-center bg-light">
            <div style="font-size: 1.5rem;">${emojis[mood]}</div>
            <div class="font-bold text-main mt-1 text-capitalize">${mood}</div>
            <div class="text-muted font-bold text-2xs mt-1">${count} entries (${pct}%)</div>
          </div>
        </div>
      `;
    }).join('');
  }

  openJournalDrawer(entryId) {
    const isNew = !entryId;
    const entry = isNew ? {
      mood: 'productive', reflection: '', achievements: [], tomorrowPlan: ''
    } : window.journalService.getEntryById(entryId);

    if (!entry) return;

    const titleText = isNew ? "Create Reflection Record" : "Modify Reflection Details";
    const achsHtml = entry.achievements.map(a => `
      <div class="d-flex gap-2 align-items-center mb-2 achievement-row">
        <input type="text" class="form-control form-control-sm border-0 bg-transparent" value="${a}" required>
        <button class="btn btn-sm btn-link text-danger p-0 delete-ach-row" type="button"><i class="bi bi-x-lg"></i></button>
      </div>
    `).join('');

    const html = `
      <form id="journal-edit-drawer-form" class="text-sm">
        <div class="mb-3">
          <label class="form-label font-semibold text-xs text-uppercase mb-2">How are you feeling today?</label>
          <div class="d-flex justify-content-between gap-1">
            ${[
              { id: 'happy', emoji: '😊', label: 'Happy' },
              { id: 'productive', emoji: '💪', label: 'Focused' },
              { id: 'neutral', emoji: '😐', label: 'Neutral' },
              { id: 'tired', emoji: '🥱', label: 'Tired' },
              { id: 'stressed', emoji: '😰', label: 'Stressed' }
            ].map(m => `
              <div class="mood-selector-card flex-grow-1 p-2 border rounded text-center cursor-pointer ${entry.mood === m.id ? 'border-primary bg-primary-subtle' : ''}" data-mood="${m.id}" style="width:18%;">
                <div style="font-size:1.5rem;">${m.emoji}</div>
                <div class="text-2xs font-semibold mt-1">${m.label}</div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="mb-3">
          <label class="form-label font-semibold text-xs text-uppercase">Today's Reflection</label>
          <textarea id="journal-reflection-input" class="form-control text-xs" rows="5" required placeholder="Write summary thoughts about your day...">${entry.reflection}</textarea>
        </div>

        <div class="mb-3 premium-card p-3">
          <label class="form-label font-semibold text-xs text-uppercase mb-2">Key Achievements</label>
          <div id="journal-achievements-container">${achsHtml}</div>
          <button class="btn btn-xs btn-outline-secondary font-semibold text-xs mt-2" type="button" id="journal-add-ach-row-btn">+ Add Achievement</button>
        </div>

        <div class="mb-3">
          <label class="form-label font-semibold text-xs text-uppercase">Plan for Tomorrow</label>
          <input type="text" id="journal-plan-input" class="form-control text-xs" value="${entry.tomorrowPlan || ''}" placeholder="Tasks or focus areas for tomorrow...">
        </div>

        <button type="submit" class="btn btn-primary w-100 font-semibold mt-3">Log Reflection</button>
      </form>
    `;

    this.app.openDrawer(titleText, html, (content) => {
      let selectedMood = entry.mood;

      content.querySelectorAll('.mood-selector-card').forEach(card => {
        card.addEventListener('click', () => {
          content.querySelectorAll('.mood-selector-card').forEach(c => c.classList.remove('border-primary', 'bg-primary-subtle'));
          card.classList.add('border-primary', 'bg-primary-subtle');
          selectedMood = card.getAttribute('data-mood');
        });
      });

      const achContainer = content.querySelector('#journal-achievements-container');
      content.querySelector('#journal-add-ach-row-btn').addEventListener('click', () => {
        const div = document.createElement('div');
        div.className = 'd-flex gap-2 align-items-center mb-2 achievement-row';
        div.innerHTML = `
          <input type="text" class="form-control form-control-sm border-0 bg-transparent" placeholder="Describe accomplishment details..." required>
          <button class="btn btn-sm btn-link text-danger p-0 delete-ach-row" type="button"><i class="bi bi-x-lg"></i></button>
        `;
        achContainer.appendChild(div);
        div.querySelector('.delete-ach-row').addEventListener('click', () => div.remove());
      });

      content.querySelectorAll('.delete-ach-row').forEach(b => b.addEventListener('click', () => b.closest('.achievement-row').remove()));

      content.querySelector('#journal-edit-drawer-form').addEventListener('submit', (e) => {
        e.preventDefault();

        const achievements = [];
        content.querySelectorAll('.achievement-row').forEach(row => {
          achievements.push(row.querySelector('input[type="text"]').value);
        });

        const reflection = content.querySelector('#journal-reflection-input').value;
        const tomorrowPlan = content.querySelector('#journal-plan-input').value;

        if (isNew) {
          window.journalService.addEntry(selectedMood, reflection, achievements, tomorrowPlan);
          window.notificationService.showToast('Reflection logged successfully', 'success');
        } else {
          window.journalService.updateEntry(entryId, {
            mood: selectedMood,
            reflection,
            achievements,
            tomorrowPlan
          });
          window.notificationService.showToast('Reflection logs modified', 'success');
        }

        this.app.closeDrawer();
        this.render(document.getElementById('app-view-container'));
        this.init(document.getElementById('app-view-container'));
      });
    });
  }

  destroy() {}
}
