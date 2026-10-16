/**
 * LifeOS — Dashboard Command Center Module
 */

const LifeDashboard = (() => {
  let privacyMode = false;

  function init() {
    const settings = LifeStorage.get("settings") || {};
    privacyMode = !!settings.privacyMode;

    // Toggle privacy mask across dashboard
    $(document).on("click", "#btn-toggle-privacy", function () {
      privacyMode = !privacyMode;
      const icon = $(this).find("i");
      if (privacyMode) {
        icon.removeClass("bi-eye").addClass("bi-eye-slash");
        $(this).attr("title", "গোপনীয় মান প্রদর্শন করুন");
      } else {
        icon.removeClass("bi-eye-slash").addClass("bi-eye");
        $(this).attr("title", "গোপনীয় মান লুকান");
      }
      renderMetrics();
    });

    // Re-render when data updates
    LifeStorage.on("change", () => {
      if (window.LifeApp && window.LifeApp.getCurrentPage() === "dashboard") {
        render();
      }
    });
  }

  function render() {
    renderGreeting();
    renderMetrics();
    renderWidgets();

    // Render Chart.js visual charts
    if (window.LifeCharts) {
      setTimeout(() => {
        window.LifeCharts.renderCashflowChart("chart-cashflow");
        window.LifeCharts.renderCategoryDoughnut("chart-category-expenses");
        window.LifeCharts.renderAccountDistribution("chart-account-balances");
        window.LifeCharts.renderWeeklyHabitsChart("chart-weekly-habits");
      }, 50);
    }
  }

  function renderGreeting() {
    const user = LifeStorage.get("user") || window.SEED_DATA.user;
    const greeting = LifeUtils.getGreeting(user.name.split(" ")[0]);
    $("#dash-greeting-title").text(greeting.title);
    $("#dash-greeting-date").text(LifeUtils.formatDate(LifeUtils.CURRENT_DEMO_DATE, "Day, DD MMM"));

    // Daily tasks & habits completed today progress
    const tasks = LifeStorage.get("tasks") || [];
    const habits = LifeStorage.get("habits") || [];
    const todayTasks = tasks.filter(t => t.dueDate === LifeUtils.CURRENT_DEMO_DATE);
    const completedTasks = todayTasks.filter(t => t.status === "completed").length;

    const todayHabitsCompleted = habits.filter(h => (h.completedDates || []).includes(LifeUtils.CURRENT_DEMO_DATE)).length;
    const totalDailyItems = todayTasks.length + habits.length;
    const completedDailyItems = completedTasks + todayHabitsCompleted;
    const dailyPercent = totalDailyItems > 0 ? Math.round((completedDailyItems / totalDailyItems) * 100) : 0;

    $("#dash-daily-progress-badge").html(`
      <div class="d-flex align-items-center gap-2">
        <div class="progress flex-grow-1" style="height: 6px; width: 80px;">
          <div class="progress-bar bg-success" style="width: ${dailyPercent}%"></div>
        </div>
        <span class="small fw-semibold text-white-50">${LifeUtils.toBnNumber(dailyPercent)}% আজকের অগ্রগতি</span>
      </div>
    `);
  }

  function renderMetrics() {
    const accounts = LifeStorage.get("accounts") || [];
    const cards = LifeStorage.get("cards") || [];
    const transactions = LifeStorage.get("transactions") || [];
    const savingsGoals = LifeStorage.get("savingsGoals") || [];

    // Net worth
    const nwStats = LifeUtils.calculateNetWorth(accounts, cards);
    // Income and expenses for Oct 2026
    const curMonthIncome = LifeUtils.calculateMonthlyIncome(transactions, "2026-10");
    const curMonthExpenses = LifeUtils.calculateMonthlyExpenses(transactions, "2026-10");
    // Prior month for comparison (Sep 2026)
    const prevMonthIncome = LifeUtils.calculateMonthlyIncome(transactions, "2026-09");
    const prevMonthExpenses = LifeUtils.calculateMonthlyExpenses(transactions, "2026-09");

    const totalSavings = LifeUtils.calculateTotalSavings(savingsGoals);
    const availableCash = nwStats.totalAssets;
    const savingsRate = LifeUtils.calculateSavingsRate(curMonthIncome, curMonthExpenses);

    // Income trend %
    const incDiff = prevMonthIncome > 0 ? Math.round(((curMonthIncome - prevMonthIncome) / prevMonthIncome) * 100) : 0;
    const expDiff = prevMonthExpenses > 0 ? Math.round(((curMonthExpenses - prevMonthExpenses) / prevMonthExpenses) * 100) : 0;

    // Render into DOM
    $("#metric-net-worth").text(LifeUtils.formatCurrency(nwStats.netWorth, privacyMode));
    $("#metric-income").text(LifeUtils.formatCurrency(curMonthIncome, privacyMode));
    $("#metric-expenses").text(LifeUtils.formatCurrency(curMonthExpenses, privacyMode));
    $("#metric-savings").text(LifeUtils.formatCurrency(totalSavings, privacyMode));
    $("#metric-available-balance").text(LifeUtils.formatCurrency(availableCash, privacyMode));
    $("#metric-savings-rate").text(privacyMode ? "••••" : `${savingsRate}%`);

    // Badges
    $("#badge-income-trend").html(
      incDiff >= 0
        ? `<i class="bi bi-arrow-up-right text-success"></i> +${incDiff}% সেপ্টেম্বরের তুলনায়`
        : `<i class="bi bi-arrow-down-right text-danger"></i> ${incDiff}% সেপ্টেম্বরের তুলনায়`
    );
    $("#badge-expenses-trend").html(
      expDiff <= 0
        ? `<i class="bi bi-arrow-down-right text-success"></i> ${expDiff}% সেপ্টেম্বরের তুলনায়`
        : `<i class="bi bi-arrow-up-right text-warning"></i> +${expDiff}% সেপ্টেম্বরের তুলনায়`
    );
  }

  function renderWidgets() {
    renderRecentTransactionsWidget();
    renderUpcomingBillsWidget();
    renderTodayTasksWidget();
    renderTodayHabitsWidget();
    renderSavingsGoalsWidget();
  }

  function renderRecentTransactionsWidget() {
    const transactions = LifeStorage.get("transactions") || [];
    const recent = transactions.slice(0, 5);

    let html = "";
    if (recent.length === 0) {
      html = `<div class="p-4 text-center text-muted">কোনো লেনদেন পাওয়া যায়নি।</div>`;
    } else {
      html = recent
        .map(t => {
          const isExp = t.type === "expense";
          const isInc = t.type === "income";
          const isSav = t.type === "savings";
          const colorClass = isExp ? "text-danger" : isInc ? "text-success" : isSav ? "text-primary" : "text-info";
          const sign = isExp ? "-" : isInc ? "+" : "";

          return `
          <div class="transaction-item d-flex align-items-center justify-content-between p-3 border-bottom border-light">
            <div class="d-flex align-items-center gap-3">
              <div class="icon-shape rounded-3 bg-light p-2">
                <i class="bi ${isExp ? "bi-arrow-up-right text-danger" : isInc ? "bi-arrow-down-left text-success" : isSav ? "bi-piggy-bank text-primary" : "bi-arrow-left-right text-info"} fs-5"></i>
              </div>
              <div>
                <h6 class="mb-0 fw-semibold fs-14">${LifeUtils.escapeHtml(t.description)}</h6>
                <div class="text-muted small">${LifeUtils.formatDate(t.date, "DD MMM")} • <span class="badge bg-light text-secondary border">${LifeUtils.escapeHtml(t.category)}</span></div>
              </div>
            </div>
            <div class="text-end">
              <div class="fw-bold ${colorClass}">${sign}${LifeUtils.formatCurrency(t.amount, privacyMode)}</div>
              <div class="text-muted small">${LifeUtils.escapeHtml(t.method || "সরাসরি")}</div>
            </div>
          </div>
        `;
        })
        .join("");
    }
    $("#widget-recent-transactions").html(html);
  }

  function renderUpcomingBillsWidget() {
    const events = LifeStorage.get("calendarEvents") || [];
    const bills = events.filter(e => e.type === "bill" || e.category === "Bills" || e.category === "বিল").slice(0, 4);

    let html = "";
    if (bills.length === 0) {
      html = `<div class="p-3 text-muted small text-center">আসন্ন কোনো বিল নির্ধারিত নেই।</div>`;
    } else {
      html = bills
        .map(b => {
          return `
          <div class="d-flex align-items-center justify-content-between p-2 rounded-2 mb-2 bg-light-subtle border">
            <div class="d-flex align-items-center gap-2">
              <i class="bi bi-clock-history text-warning fs-5"></i>
              <div>
                <div class="fw-semibold fs-14">${LifeUtils.escapeHtml(b.title)}</div>
                <div class="text-muted small">পরিশোধ: ${LifeUtils.formatDate(b.date, "DD MMM")}</div>
              </div>
            </div>
            <span class="badge bg-warning-subtle text-warning-emphasis">নির্ধারিত</span>
          </div>
        `;
        })
        .join("");
    }
    $("#widget-upcoming-bills").html(html);
  }

  function renderTodayTasksWidget() {
    const tasks = LifeStorage.get("tasks") || [];
    const todayTasks = tasks.filter(t => t.dueDate === LifeUtils.CURRENT_DEMO_DATE).slice(0, 4);

    let html = "";
    if (todayTasks.length === 0) {
      html = `<div class="p-3 text-muted small text-center">আজকের সব কাজ সম্পন্ন হয়েছে!</div>`;
    } else {
      html = todayTasks
        .map(t => {
          const isDone = t.status === "completed";
          const prioText = t.priority === "Urgent" || t.priority === "জরুরি" ? "জরুরি" : t.priority === "High" || t.priority === "উচ্চ" ? "উচ্চ" : t.priority === "Medium" || t.priority === "মাঝারি" ? "মাঝারি" : "সাধারণ";
          const prioBadgeClass = t.priority === "Urgent" || t.priority === "জরুরি" ? "bg-danger text-white" : t.priority === "High" || t.priority === "উচ্চ" ? "bg-warning text-dark" : "bg-light-subtle text-secondary border";
          return `
          <div class="d-flex align-items-center justify-content-between p-2 rounded-2 mb-2 bg-light-subtle border">
            <div class="d-flex align-items-center gap-2">
              <input type="checkbox" class="form-check-input task-toggle-checkbox cursor-pointer" data-id="${t.id}" ${isDone ? "checked" : ""}>
              <span class="fs-14 ${isDone ? "text-decoration-line-through text-muted" : "fw-medium"}">${LifeUtils.escapeHtml(t.title)}</span>
            </div>
            <span class="badge ${prioBadgeClass} fs-11">${prioText}</span>
          </div>
        `;
        })
        .join("");
    }
    $("#widget-today-tasks").html(html);
  }

  function renderTodayHabitsWidget() {
    const habits = LifeStorage.get("habits") || [];
    const topHabits = habits.slice(0, 5);

    let html = "";
    html = topHabits
      .map(h => {
        const isDone = (h.completedDates || []).includes(LifeUtils.CURRENT_DEMO_DATE);
        const streakInfo = LifeUtils.calculateHabitStreak(h.completedDates);
        return `
        <div class="d-flex align-items-center justify-content-between p-2 rounded-2 mb-2 border ${isDone ? "bg-success-subtle border-success" : "bg-light-subtle"}">
          <div class="d-flex align-items-center gap-2">
            <button class="btn btn-sm ${isDone ? "btn-success" : "btn-outline-secondary"} habit-check-btn rounded-circle p-1 px-2" data-id="${h.id}" title="সম্পন্ন চিহ্নিত করুন">
              <i class="bi ${isDone ? "bi-check-lg" : "bi-circle"}"></i>
            </button>
            <div>
              <div class="fs-14 ${isDone ? "fw-bold text-success-emphasis" : "fw-medium"}">${LifeUtils.escapeHtml(h.name)}</div>
              <div class="text-muted small"><i class="bi bi-fire text-danger"></i> ${streakInfo.currentStreak} দিনের ধারাবাহিকতা</div>
            </div>
          </div>
          <span class="badge bg-light text-secondary border">${LifeUtils.escapeHtml(h.category)}</span>
        </div>
      `;
      })
      .join("");
    $("#widget-today-habits").html(html);
  }

  function renderSavingsGoalsWidget() {
    const goals = LifeStorage.get("savingsGoals") || [];
    const topGoals = goals.slice(0, 3);

    let html = topGoals
      .map(g => {
        const percent = Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100));
        return `
        <div class="p-3 rounded-3 border bg-light-subtle mb-2">
          <div class="d-flex justify-content-between align-items-center mb-1">
            <span class="fw-semibold fs-14">${LifeUtils.escapeHtml(g.name)}</span>
            <span class="small fw-bold text-primary">${percent}%</span>
          </div>
          <div class="progress mb-2" style="height: 6px;">
            <div class="progress-bar bg-primary" style="width: ${percent}%;"></div>
          </div>
          <div class="d-flex justify-content-between small text-muted">
            <span>${LifeUtils.formatCurrency(g.currentAmount, privacyMode)}</span>
            <span>লক্ষ্য: ${LifeUtils.formatCurrency(g.targetAmount, privacyMode)}</span>
          </div>
        </div>
      `;
      })
      .join("");
    $("#widget-savings-goals").html(html);
  }

  return {
    init,
    render,
    renderMetrics
  };
})();

if (typeof window !== "undefined") {
  window.LifeDashboard = LifeDashboard;
}
