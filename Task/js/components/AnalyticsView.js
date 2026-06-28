// Analytics Dashboard Component (UI Module)
// Computes deep productivity patterns, habits consistency ratings, and financial flow trends using SVG gauges and Chart.js.
// Globally Scoped.

window.AnalyticsView = class AnalyticsView {
  constructor(app) {
    this.app = app;
    this.charts = [];
  }

  render(container) {
    const allTasks = window.taskService.getTasks();
    const completedTasks = allTasks.filter(t => t.status === 'completed').length;
    const taskProgressPct = allTasks.length > 0 ? Math.round((completedTasks / allTasks.length) * 100) : 0;

    const allHabits = window.habitService.getHabits();
    let highestStreak = 0;
    let totalHabitStreaks = 0;
    allHabits.forEach(h => {
      const streaks = window.habitService.getHabitStreaks(h);
      totalHabitStreaks += streaks.current;
      if (streaks.current > highestStreak) highestStreak = streaks.current;
    });

    const allActivities = window.storageService.get('activities') || [];
    const completedPomoSessions = allActivities.filter(a => a.text === 'Completed Pomodoro session').length;
    const totalFocusMinutes = completedPomoSessions * 25;
    const focusHours = (totalFocusMinutes / 60).toFixed(1);

    const expenseSummary = window.expenseService.getSummary();
    const netSavings = expenseSummary.savings;
    const savingsRate = expenseSummary.savingsRate;

    // SVG Circular Gauge calculation
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (taskProgressPct / 100) * circumference;

    container.innerHTML = `
      <div class="container-fluid py-4">
        <!-- Range Header -->
        <div class="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
          <div>
            <h2 class="font-bold mb-1 text-main"><i class="bi bi-bar-chart-line text-primary"></i> Productivity Analytics</h2>
            <p class="text-muted text-sm mb-0">Deep diagnostic logs of tasks, focus metrics, and savings ratios.</p>
          </div>
          <div class="btn-group bg-hover p-1 rounded-3" style="background-color: var(--bg-hover);">
            <button class="btn btn-sm btn-link text-main text-xs font-semibold px-3 py-1 text-decoration-none active-filter" style="border-radius: var(--border-radius-sm); background-color: var(--bg-card);" data-range="7d">7 Days</button>
            <button class="btn btn-sm btn-link text-muted text-xs font-semibold px-3 py-1 text-decoration-none" data-range="30d">30 Days</button>
            <button class="btn btn-sm btn-link text-muted text-xs font-semibold px-3 py-1 text-decoration-none" data-range="ytd">Year to Date</button>
          </div>
        </div>

        <div class="row g-4 mb-4">
          <!-- Left: Productivity Index SVG Gauge -->
          <div class="col-lg-4">
            <div class="premium-card p-4 text-center h-100 d-flex flex-column justify-content-between">
              <div>
                <h6 class="font-bold text-xs text-uppercase text-muted mb-4">Overall Completion Index</h6>
                <div class="position-relative d-inline-flex align-items-center justify-content-center mb-3" style="width: 140px; height: 140px;">
                  <svg class="w-100 h-100" style="transform: rotate(-90deg);">
                    <circle cx="70" cy="70" r="${radius}" fill="transparent" stroke="var(--border-color)" stroke-width="10" />
                    <circle cx="70" cy="70" r="${radius}" fill="transparent" stroke="#3b82f6" stroke-width="10" 
                      stroke-dasharray="${circumference}" stroke-dashoffset="${strokeDashoffset}" stroke-linecap="round" style="transition: stroke-dashoffset 0.5s ease-in-out;" />
                  </svg>
                  <div class="position-absolute text-center">
                    <div class="h2 font-bold mb-0 text-main">${taskProgressPct}%</div>
                    <span class="text-muted text-3xs font-bold text-uppercase">Efficiency</span>
                  </div>
                </div>
              </div>
              <div class="border-top pt-3">
                <p class="text-xs text-muted mb-0">You completed <strong class="text-main">${completedTasks}</strong> out of <strong class="text-main">${allTasks.length}</strong> tasks in this cycle.</p>
              </div>
            </div>
          </div>

          <!-- Middle: Financial Flow Bars -->
          <div class="col-lg-4">
            <div class="premium-card p-4 h-100 d-flex flex-column justify-content-between">
              <div>
                <h6 class="font-bold text-xs text-uppercase text-muted mb-3">Financial Savings Goals</h6>
                
                <div class="mb-3">
                  <div class="d-flex justify-content-between text-xs mb-1">
                    <span class="font-semibold text-muted">Total Ledger Inflow</span>
                    <span class="font-bold text-success">$${expenseSummary.income}</span>
                  </div>
                  <div class="progress" style="height: 8px; border-radius: 4px;">
                    <div class="progress-bar bg-success" role="progressbar" style="width: 100%;"></div>
                  </div>
                </div>

                <div class="mb-3">
                  <div class="d-flex justify-content-between text-xs mb-1">
                    <span class="font-semibold text-muted">Ledger Outflow (Spent)</span>
                    <span class="font-bold text-danger">$${expenseSummary.expense}</span>
                  </div>
                  <div class="progress" style="height: 8px; border-radius: 4px;">
                    <div class="progress-bar bg-danger" role="progressbar" style="width: ${expenseSummary.income > 0 ? (expenseSummary.expense / expenseSummary.income) * 100 : 0}%;"></div>
                  </div>
                </div>

                <div class="mb-2">
                  <div class="d-flex justify-content-between text-xs mb-1">
                    <span class="font-semibold text-muted">Net Savings Margin</span>
                    <span class="font-bold text-primary">$${netSavings}</span>
                  </div>
                  <div class="progress" style="height: 8px; border-radius: 4px;">
                    <div class="progress-bar bg-primary" role="progressbar" style="width: ${savingsRate}%;"></div>
                  </div>
                </div>
              </div>

              <div class="border-top pt-3 text-center">
                <div class="text-xs text-muted">Savings Rate percentage: <strong class="text-main">${savingsRate}%</strong></div>
              </div>
            </div>
          </div>

          <!-- Right: Habit Streaks Consistency -->
          <div class="col-lg-4">
            <div class="premium-card p-4 h-100 d-flex flex-column justify-content-between">
              <div>
                <h6 class="font-bold text-xs text-uppercase text-muted mb-3">Habit Streaks Breakdown</h6>
                <div class="list-group list-group-flush">
                  ${allHabits.slice(0, 3).map(h => {
                    const streaks = window.habitService.getHabitStreaks(h);
                    return `
                      <div class="list-group-item px-0 py-2 d-flex justify-content-between align-items-center border-0">
                        <div>
                          <div class="text-sm font-semibold text-main">${h.title}</div>
                          <span class="text-muted text-3xs text-uppercase font-bold">${h.frequency}</span>
                        </div>
                        <div class="text-end">
                          <span class="badge bg-warning-subtle text-warning border border-warning-subtle text-xs px-2 py-1"><i class="bi bi-fire"></i> ${streaks.current}d</span>
                          <div class="text-muted text-3xs font-semibold mt-1">Rate: ${streaks.completionRate}%</div>
                        </div>
                      </div>
                    `;
                  }).join('')}
                  ${allHabits.length === 0 ? '<div class="text-center text-muted text-xs py-4">No habits created yet.</div>' : ''}
                </div>
              </div>

              <div class="border-top pt-3 text-center">
                <div class="text-xs text-muted">Peak Active Streak: <strong class="text-warning">${highestStreak} days</strong></div>
              </div>
            </div>
          </div>
        </div>

        <div class="row g-4">
          <!-- Focus Hours Trend Chart (Line) -->
          <div class="col-md-6 col-lg-8">
            <div class="premium-card p-4 h-100">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <h6 class="font-bold text-xs text-uppercase text-muted mb-0">Focus Time Distribution (Daily Mins)</h6>
                <span class="badge bg-light text-dark text-2xs border">${focusHours} hrs total</span>
              </div>
              <div class="chart-container d-flex align-items-center justify-content-center" style="height: 250px;">
                <canvas id="chart-focus-hours"></canvas>
              </div>
            </div>
          </div>

          <!-- Tasks Priority Split (Doughnut) -->
          <div class="col-md-6 col-lg-4">
            <div class="premium-card p-4 h-100">
              <h6 class="font-bold text-xs text-uppercase text-muted mb-3">Task Priority Breakdown</h6>
              <div class="chart-container d-flex align-items-center justify-content-center" style="height: 250px;">
                <canvas id="chart-priority-split"></canvas>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  init(container) {
    this.destroyCharts();

    if (!window.Chart) return;

    // 1. Render Focus Hours Line Chart
    this.renderFocusTrendChart(container);

    // 2. Render Task Priority Doughnut Chart
    this.renderPriorityChart(container);
  }

  renderFocusTrendChart(container) {
    const canvas = container.querySelector('#chart-focus-hours');
    if (!canvas) return;

    // Generate recent 7 days labels
    const labels = [];
    const focusData = [];
    const allActivities = window.storageService.get('activities') || [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dStr = d.toISOString().split('T')[0];
      labels.push(d.toLocaleDateString(undefined, { weekday: 'short' }));

      // Sum pomodoro sessions on this date
      const count = allActivities.filter(a => {
        const logDate = a.timestamp.split('T')[0];
        return logDate === dStr && a.text === 'Completed Pomodoro session';
      }).length;

      focusData.push(count * 25);
    }

    this.charts.push(new Chart(canvas, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Minutes Focused',
          data: focusData,
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: true,
          tension: 0.3,
          borderWidth: 3,
          pointBackgroundColor: '#3b82f6'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { grid: { color: 'var(--border-color)' }, ticks: { font: { family: 'Outfit', size: 10 }, color: 'var(--text-muted)' } },
          x: { grid: { display: false }, ticks: { font: { family: 'Outfit', size: 10 }, color: 'var(--text-muted)' } }
        },
        plugins: {
          legend: { display: false }
        }
      }
    }));
  }

  renderPriorityChart(container) {
    const canvas = container.querySelector('#chart-priority-split');
    if (!canvas) return;

    const list = window.taskService.getTasks();
    const high = list.filter(t => t.priority === 'high').length;
    const medium = list.filter(t => t.priority === 'medium').length;
    const low = list.filter(t => t.priority === 'low').length;

    this.charts.push(new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: ['High', 'Medium', 'Low'],
        datasets: [{
          data: [high, medium, low],
          backgroundColor: ['#ef4444', '#f59e0b', '#10b981'],
          borderWidth: 2,
          borderColor: 'var(--bg-card)'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { font: { family: 'Outfit', size: 11 }, color: 'var(--text-main)' }
          }
        }
      }
    }));
  }

  destroyCharts() {
    this.charts.forEach(c => c.destroy());
    this.charts = [];
  }

  destroy() {
    this.destroyCharts();
  }
}
