// Analytics Summary Chart.js View (UI Module)
// Draws task progress, habits streak rates, and expense trends using Chart.js.
// Globally Scoped.

window.AnalyticsView = class AnalyticsView {
  constructor(app) {
    this.app = app;
    this.charts = [];
  }

  render(container) {
    container.innerHTML = `
      <div class="container-fluid py-4">
        <!-- Header -->
        <div class="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 class="font-bold mb-1">Analytics Dashboard</h2>
            <p class="text-muted text-sm mb-0">Deep productivity patterns, habits consistency, and ledger expense balances.</p>
          </div>
        </div>

        <div class="row g-4">
          <!-- Tasks Metrics -->
          <div class="col-md-6 col-lg-4">
            <div class="premium-card text-center p-4">
              <h6 class="font-bold text-xs text-uppercase text-muted mb-2">Tasks Success Ratio</h6>
              <div class="chart-container d-flex align-items-center justify-content-center" style="height: 220px;">
                <canvas id="chart-tasks-progress"></canvas>
              </div>
            </div>
          </div>

          <!-- Habits Compliance -->
          <div class="col-md-6 col-lg-4">
            <div class="premium-card text-center p-4">
              <h6 class="font-bold text-xs text-uppercase text-muted mb-2">Habits Streaks Consistency</h6>
              <div class="chart-container d-flex align-items-center justify-content-center" style="height: 220px;">
                <canvas id="chart-habits-completion"></canvas>
              </div>
            </div>
          </div>

          <!-- Expense ledger Trends -->
          <div class="col-md-6 col-lg-4">
            <div class="premium-card text-center p-4">
              <h6 class="font-bold text-xs text-uppercase text-muted mb-2">Financial Flow Balance</h6>
              <div class="chart-container d-flex align-items-center justify-content-center" style="height: 220px;">
                <canvas id="chart-expenses-trend"></canvas>
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

    // 1. Tasks Completion Doughnut
    this.renderTasksChart(container);

    // 2. Habits Streak Rates Polar area
    this.renderHabitsChart(container);

    // 3. Expenses Flow Bar Chart
    this.renderExpensesChart(container);
  }

  renderTasksChart(container) {
    const canvas = container.querySelector('#chart-tasks-progress');
    if (!canvas) return;

    const list = window.taskService.getTasks();
    const completed = list.filter(t => t.status === 'completed').length;
    const pending = list.length - completed;

    this.charts.push(new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: ['Completed', 'Pending'],
        datasets: [{
          data: [completed, pending],
          backgroundColor: ['#10b981', '#64748b'],
          borderWidth: 1,
          borderColor: 'var(--bg-card)'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { font: { family: 'Outfit', size: 10 }, color: 'var(--text-main)' } }
        }
      }
    }));
  }

  renderHabitsChart(container) {
    const canvas = container.querySelector('#chart-habits-completion');
    if (!canvas) return;

    const list = window.habitService.getHabits();
    const labels = list.map(h => h.title);
    const data = list.map(h => window.habitService.getHabitStreaks(h).completionRate);

    this.charts.push(new Chart(canvas, {
      type: 'polarArea',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: ['rgba(59, 130, 246, 0.6)', 'rgba(139, 92, 246, 0.6)', 'rgba(16, 185, 129, 0.6)']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: { grid: { color: 'var(--border-color)' }, ticks: { backdropColor: 'transparent', color: 'var(--text-muted)' } }
        },
        plugins: {
          legend: { position: 'bottom', labels: { font: { family: 'Outfit', size: 10 }, color: 'var(--text-main)' } }
        }
      }
    }));
  }

  renderExpensesChart(container) {
    const canvas = container.querySelector('#chart-expenses-trend');
    if (!canvas) return;

    const summary = window.expenseService.getSummary();

    this.charts.push(new Chart(canvas, {
      type: 'bar',
      data: {
        labels: ['Income Flow', 'Spending'],
        datasets: [{
          label: 'USD ($)',
          data: [summary.income, summary.expense],
          backgroundColor: ['#10b981', '#ef4444'],
          borderRadius: 6
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

  destroyCharts() {
    this.charts.forEach(c => c.destroy());
    this.charts = [];
  }

  destroy() {
    this.destroyCharts();
  }
}
