/**
 * LifeOS — Financial Reports & Life Analytics Module
 * Deep analytical insights, cashflow ratios, category expenditure rankings, and lifestyle balance radar.
 */

const LifeAnalytics = (() => {
  let activeTab = "finance"; // 'finance' | 'lifestyle'

  function init() {
    $(document).on("click", ".analytics-tab-btn", function (e) {
      e.preventDefault();
      $(".analytics-tab-btn").removeClass("active");
      $(this).addClass("active");
      activeTab = $(this).data("tab");
      render();
    });

    LifeStorage.on("change", (e) => {
      if (window.LifeApp && window.LifeApp.getCurrentPage() === "analytics") {
        render();
      }
    });
  }

  function render() {
    if (activeTab === "finance") {
      $("#analytics-finance-view").removeClass("d-none");
      $("#analytics-lifestyle-view").addClass("d-none");
      renderFinancialAnalytics();
    } else {
      $("#analytics-finance-view").addClass("d-none");
      $("#analytics-lifestyle-view").removeClass("d-none");
      renderLifestyleAnalytics();
    }
  }

  function renderFinancialAnalytics() {
    const transactions = LifeStorage.get("transactions") || [];
    const accounts = LifeStorage.get("accounts") || [];
    const cards = LifeStorage.get("cards") || [];

    const nw = LifeUtils.calculateNetWorth(accounts, cards);
    const incOct = LifeUtils.calculateMonthlyIncome(transactions, "2026-10");
    const expOct = LifeUtils.calculateMonthlyExpenses(transactions, "2026-10");
    const rateOct = LifeUtils.calculateSavingsRate(incOct, expOct);

    $("#analytics-net-worth").text(LifeUtils.formatCurrency(nw.netWorth));
    $("#analytics-monthly-burn").text(LifeUtils.formatCurrency(expOct));
    $("#analytics-savings-rate").text(`${LifeUtils.toBnNumber(rateOct)}%`);

    // Top categories ranking list
    const spendingMap = LifeUtils.getCategorySpending(transactions, "2026-10");
    const sortedCategories = Object.entries(spendingMap).sort((a, b) => b[1] - a[1]);

    const catMap = {
      "Food & Groceries": "খাবার ও বাজার",
      "Housing & Rent": "বাসা ভাড়া ও আবাসন",
      "Utilities & Bills": "ইউটিলিটি ও বিল",
      "Transport & Fuel": "যাতায়াত ও জ্বালানি",
      "Dining Out & Cafes": "রেস্তোরাঁ ও ক্যাফে",
      "Shopping & Tech": "কেনাকাটা ও গ্যাজেট",
      "Healthcare & Medicine": "চিকিৎসা ও ওষুধ",
      "Subscriptions & SaaS": "সাবস্ক্রিপশন ও সফটওয়্যার",
      "Family & Childcare": "পরিবার ও আত্মীয়স্বজন",
      "Education & Books": "শিক্ষা ও বইপত্র"
    };

    const rankingHtml = sortedCategories.map(([cat, amt], idx) => {
      const percent = expOct > 0 ? Math.round((amt / expOct) * 100) : 0;
      const catLabel = catMap[cat] || cat;
      return `
        <div class="mb-3">
          <div class="d-flex justify-content-between align-items-center mb-1">
            <span class="fs-14 fw-semibold">${LifeUtils.toBnNumber(idx + 1)}. ${LifeUtils.escapeHtml(catLabel)}</span>
            <span class="fs-14 fw-bold text-dark">${LifeUtils.formatCurrency(amt)} <small class="text-muted fw-normal">(${LifeUtils.toBnNumber(percent)}%)</small></span>
          </div>
          <div class="progress" style="height: 6px;">
            <div class="progress-bar bg-primary" style="width: ${percent}%;"></div>
          </div>
        </div>
      `;
    }).join("");

    $("#analytics-top-categories-list").html(rankingHtml);

    // Render Net Worth trend chart
    if (window.LifeCharts) {
      setTimeout(() => {
        window.LifeCharts.renderNetWorthTrend("chart-net-worth-trend");
      }, 50);
    }
  }

  function renderLifestyleAnalytics() {
    const habits = LifeStorage.get("habits") || [];
    const tasks = LifeStorage.get("tasks") || [];
    const lifeGoals = LifeStorage.get("lifeGoals") || [];

    // Calculate rates
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === "completed").length;
    const taskRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    let habitScoreSum = 0;
    habits.forEach(h => {
      habitScoreSum += LifeUtils.calculateHabitStreak(h.completedDates).completionRate;
    });
    const avgHabitScore = habits.length > 0 ? Math.round(habitScoreSum / habits.length) : 0;

    let goalProgressSum = 0;
    lifeGoals.forEach(g => {
      goalProgressSum += (g.progress || 0);
    });
    const avgGoalProgress = lifeGoals.length > 0 ? Math.round(goalProgressSum / lifeGoals.length) : 0;

    $("#analytics-habit-score").text(`${LifeUtils.toBnNumber(avgHabitScore)}%`);
    $("#analytics-task-velocity").text(`${LifeUtils.toBnNumber(taskRate)}%`);
    $("#analytics-goal-velocity").text(`${LifeUtils.toBnNumber(avgGoalProgress)}%`);

    // Render radar
    if (window.LifeCharts) {
      setTimeout(() => {
        window.LifeCharts.renderHabitRadar("chart-habit-radar");
      }, 50);
    }
  }

  return {
    init,
    render
  };
})();

if (typeof window !== "undefined") {
  window.LifeAnalytics = LifeAnalytics;
}
