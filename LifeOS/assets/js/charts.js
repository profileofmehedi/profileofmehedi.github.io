/**
 * LifeOS — Chart.js Visualizations & Responsive Dashboards
 * Features:
 * - 6-month Cashflow (Income vs Expense)
 * - Category Expense Distribution Doughnut
 * - Account Balance Polar/Doughnut
 * - Weekly Habit Completion Bar
 * - Net Worth Trend Area
 * - Habit Life Balance Radar
 * - Dark & Light mode auto-color palette adaptation
 */

const LifeCharts = (() => {
  const chartInstances = {};

  function isDarkMode() {
    return document.body.classList.contains("dark-mode");
  }

  function getThemeColors() {
    const dark = isDarkMode();
    return {
      textColor: dark ? "#94A3B8" : "#64748B",
      headingColor: dark ? "#F8FAFC" : "#0F172A",
      gridColor: dark ? "rgba(255, 255, 255, 0.07)" : "rgba(0, 0, 0, 0.05)",
      tooltipBg: dark ? "#1E293B" : "#0F172A",
      tooltipText: "#FFFFFF",
      primary: "#635BFF",
      primaryLight: dark ? "rgba(99, 91, 255, 0.35)" : "rgba(99, 91, 255, 0.15)",
      success: "#10B981",
      successLight: dark ? "rgba(16, 185, 129, 0.35)" : "rgba(16, 185, 129, 0.15)",
      danger: "#EF4444",
      dangerLight: dark ? "rgba(239, 68, 68, 0.35)" : "rgba(239, 68, 68, 0.15)",
      warning: "#F59E0B",
      info: "#06B6D4",
      purple: "#8B5CF6",
      pink: "#EC4899"
    };
  }

  function destroyChart(key) {
    if (chartInstances[key]) {
      chartInstances[key].destroy();
      delete chartInstances[key];
    }
  }

  /**
   * 1. Dashboard: Income vs Expenses 6-Month Bar Chart
   */
  function renderCashflowChart(canvasId = "chart-cashflow") {
    const canvas = document.getElementById(canvasId);
    if (!canvas || !window.Chart) return;
    destroyChart(canvasId);

    const colors = getThemeColors();
    const transactions = LifeStorage.get("transactions") || [];
    const trend = LifeUtils.getSixMonthTrend(transactions);

    const ctx = canvas.getContext("2d");
    chartInstances[canvasId] = new Chart(ctx, {
      type: "bar",
      data: {
        labels: trend.labels,
        datasets: [
          {
            label: "আয়",
            data: trend.incomeData,
            backgroundColor: colors.success,
            borderRadius: 6,
            barPercentage: 0.6,
            categoryPercentage: 0.7
          },
          {
            label: "ব্যয়",
            data: trend.expenseData,
            backgroundColor: colors.danger,
            borderRadius: 6,
            barPercentage: 0.6,
            categoryPercentage: 0.7
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "top",
            align: "end",
            labels: {
              boxWidth: 12,
              boxHeight: 12,
              color: colors.textColor,
              font: { family: "'Hind Siliguri', 'Inter', sans-serif", size: 12, weight: "500" }
            }
          },
          tooltip: {
            backgroundColor: colors.tooltipBg,
            titleColor: colors.tooltipText,
            bodyColor: colors.tooltipText,
            padding: 12,
            cornerRadius: 8,
            callbacks: {
              label: function (ctx) {
                return `${ctx.dataset.label}: ৳${Number(ctx.raw).toLocaleString("en-BD")}`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: colors.textColor, font: { family: "'Inter', sans-serif", size: 12 } }
          },
          y: {
            grid: { color: colors.gridColor },
            ticks: {
              color: colors.textColor,
              font: { family: "'Inter', sans-serif", size: 11 },
              callback: val => `৳${val >= 1000 ? val / 1000 + "k" : val}`
            }
          }
        }
      }
    });
  }

  /**
   * 2. Dashboard: Category Expense Breakdown (Doughnut)
   */
  function renderCategoryDoughnut(canvasId = "chart-category-expenses") {
    const canvas = document.getElementById(canvasId);
    if (!canvas || !window.Chart) return;
    destroyChart(canvasId);

    const colors = getThemeColors();
    const transactions = LifeStorage.get("transactions") || [];
    const spendingMap = LifeUtils.getCategorySpending(transactions, "2026-10");

    const labels = Object.keys(spendingMap);
    const data = Object.values(spendingMap);

    const palette = [
      "#635BFF", "#10B981", "#F59E0B", "#EF4444", "#3B82F6",
      "#8B5CF6", "#EC4899", "#06B6D4", "#14B8A6", "#F97316"
    ];

    const ctx = canvas.getContext("2d");
    chartInstances[canvasId] = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: labels.length ? labels : ["কোনো ব্যয় নেই"],
        datasets: [
          {
            data: data.length ? data : [1],
            backgroundColor: data.length ? palette.slice(0, labels.length) : ["#CBD5E1"],
            borderWidth: 2,
            borderColor: isDarkMode() ? "#1E293B" : "#FFFFFF"
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "72%",
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              boxWidth: 10,
              boxHeight: 10,
              color: colors.textColor,
              font: { family: "'Inter', sans-serif", size: 11 }
            }
          },
          tooltip: {
            backgroundColor: colors.tooltipBg,
            callbacks: {
              label: function (ctx) {
                return ` ${ctx.label}: ৳${Number(ctx.raw).toLocaleString("en-BD")}`;
              }
            }
          }
        }
      }
    });
  }

  /**
   * 3. Dashboard: Account Balance Distribution
   */
  function renderAccountDistribution(canvasId = "chart-account-balances") {
    const canvas = document.getElementById(canvasId);
    if (!canvas || !window.Chart) return;
    destroyChart(canvasId);

    const colors = getThemeColors();
    const accounts = LifeStorage.get("accounts") || [];

    const labels = accounts.map(a => a.name);
    const data = accounts.map(a => Math.max(0, a.balance));
    const bgColors = accounts.map(a => a.color || colors.primary);

    const ctx = canvas.getContext("2d");
    chartInstances[canvasId] = new Chart(ctx, {
      type: "pie",
      data: {
        labels,
        datasets: [
          {
            data,
            backgroundColor: bgColors,
            borderWidth: 2,
            borderColor: isDarkMode() ? "#1E293B" : "#FFFFFF"
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "right",
            labels: {
              boxWidth: 10,
              color: colors.textColor,
              font: { family: "'Inter', sans-serif", size: 11 }
            }
          },
          tooltip: {
            backgroundColor: colors.tooltipBg,
            callbacks: {
              label: ctx => ` ${ctx.label}: ৳${Number(ctx.raw).toLocaleString("en-BD")}`
            }
          }
        }
      }
    });
  }

  /**
   * 4. Dashboard: Weekly Habit Completion Bar Chart
   */
  function renderWeeklyHabitsChart(canvasId = "chart-weekly-habits") {
    const canvas = document.getElementById(canvasId);
    if (!canvas || !window.Chart) return;
    destroyChart(canvasId);

    const colors = getThemeColors();
    const habits = LifeStorage.get("habits") || [];

    // Calculate completions for the past 7 days up to 2026-10-15
    const days = [
      { label: "শুক্র", date: "2026-10-09" },
      { label: "শনি", date: "2026-10-10" },
      { label: "রবি", date: "2026-10-11" },
      { label: "সোম", date: "2026-10-12" },
      { label: "মঙ্গল", date: "2026-10-13" },
      { label: "বুধ", date: "2026-10-14" },
      { label: "বৃহঃ", date: "2026-10-15" }
    ];

    const labels = days.map(d => d.label);
    const completionCounts = days.map(d => {
      return habits.filter(h => (h.completedDates || []).includes(d.date)).length;
    });

    const ctx = canvas.getContext("2d");
    chartInstances[canvasId] = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "সম্পন্ন অভ্যাস",
            data: completionCounts,
            borderColor: colors.primary,
            backgroundColor: colors.primaryLight,
            fill: true,
            tension: 0.35,
            pointBackgroundColor: colors.primary,
            pointRadius: 4,
            pointHoverRadius: 6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: colors.tooltipBg,
            callbacks: {
              label: ctx => ` সম্পন্ন: ${ctx.raw} টি / ${habits.length} টি অভ্যাসের মধ্যে`
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: colors.textColor }
          },
          y: {
            min: 0,
            max: Math.max(habits.length, 10),
            grid: { color: colors.gridColor },
            ticks: { color: colors.textColor, stepSize: 2 }
          }
        }
      }
    });
  }

  /**
   * 5. Analytics Page: Net Worth Trend Area Chart (6 Months)
   */
  function renderNetWorthTrend(canvasId = "chart-net-worth-trend") {
    const canvas = document.getElementById(canvasId);
    if (!canvas || !window.Chart) return;
    destroyChart(canvasId);

    const colors = getThemeColors();
    const months = ["মে ২৬", "জুন ২৬", "জুলাই ২৬", "আগস্ট ২৬", "সেপ্টে ২৬", "অক্টো ২৬"];
    // Modeled realistic accumulation curve based on monthly savings
    const netWorthData = [185000, 240000, 285000, 312000, 345000, 382750];

    const ctx = canvas.getContext("2d");
    chartInstances[canvasId] = new Chart(ctx, {
      type: "line",
      data: {
        labels: months,
        datasets: [
          {
            label: "মোট সম্পদ (টাকা)",
            data: netWorthData,
            borderColor: colors.success,
            backgroundColor: colors.successLight,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: colors.success,
            pointRadius: 5,
            pointHoverRadius: 7
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: colors.tooltipBg,
            callbacks: {
              label: ctx => ` মোট সম্পদ: ৳${Number(ctx.raw).toLocaleString("en-BD")}`
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: colors.textColor }
          },
          y: {
            grid: { color: colors.gridColor },
            ticks: {
              color: colors.textColor,
              callback: val => `৳${(val / 1000).toFixed(0)}k`
            }
          }
        }
      }
    });
  }

  /**
   * 6. Analytics Page: Habit Life Balance Radar Chart
   */
  function renderHabitRadar(canvasId = "chart-habit-radar") {
    const canvas = document.getElementById(canvasId);
    if (!canvas || !window.Chart) return;
    destroyChart(canvasId);

    const colors = getThemeColors();
    const habits = LifeStorage.get("habits") || [];

    // Group completion rate by category
    const catMap = {};
    habits.forEach(h => {
      const cat = h.category || "সাধারণ";
      const stats = LifeUtils.calculateHabitStreak(h.completedDates);
      if (!catMap[cat]) catMap[cat] = { total: 0, count: 0 };
      catMap[cat].total += stats.completionRate;
      catMap[cat].count += 1;
    });

    const categories = Object.keys(catMap);
    const rates = categories.map(c => Math.round(catMap[c].total / catMap[c].count));

    const ctx = canvas.getContext("2d");
    chartInstances[canvasId] = new Chart(ctx, {
      type: "radar",
      data: {
        labels: categories,
        datasets: [
          {
            label: "ক্যাটাগরি ভিত্তিক ধারাবাহিকতা %",
            data: rates,
            backgroundColor: colors.primaryLight,
            borderColor: colors.primary,
            pointBackgroundColor: colors.primary,
            pointRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: colors.tooltipBg,
            callbacks: {
              label: ctx => ` ধারাবাহিকতা: ${ctx.raw}%`
            }
          }
        },
        scales: {
          r: {
            angleLines: { color: colors.gridColor },
            grid: { color: colors.gridColor },
            pointLabels: {
              color: colors.textColor,
              font: { family: "'Inter', sans-serif", size: 11, weight: "600" }
            },
            ticks: {
              backdropColor: "transparent",
              color: colors.textColor,
              stepSize: 20,
              min: 0,
              max: 100
            }
          }
        }
      }
    });
  }

  // Refresh all charts when theme switches or data updates
  function refreshAllCharts() {
    renderCashflowChart("chart-cashflow");
    renderCategoryDoughnut("chart-category-expenses");
    renderAccountDistribution("chart-account-balances");
    renderWeeklyHabitsChart("chart-weekly-habits");
    renderNetWorthTrend("chart-net-worth-trend");
    renderHabitRadar("chart-habit-radar");
  }

  return {
    renderCashflowChart,
    renderCategoryDoughnut,
    renderAccountDistribution,
    renderWeeklyHabitsChart,
    renderNetWorthTrend,
    renderHabitRadar,
    refreshAllCharts,
    destroyChart
  };
})();

if (typeof window !== "undefined") {
  window.LifeCharts = LifeCharts;
}
