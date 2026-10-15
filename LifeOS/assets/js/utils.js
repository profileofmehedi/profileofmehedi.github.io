/**
 * LifeOS — Utility Functions & Financial Business Logic
 * Centralized formatting, accounting calculations, streak tracking, and validation.
 */

const LifeUtils = (() => {
  // Demo reference date
  const CURRENT_DEMO_DATE = "2026-10-15";

  /**
   * Safe HTML string escaping
   */
  function escapeHtml(str) {
    if (str === null || str === undefined) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  /**
   * Currency formatter with privacy mode support
   */
  function formatCurrency(amount, privacyMode = false, currencySymbol = "৳") {
    if (privacyMode) return "••••••";
    const num = Number(amount) || 0;
    const formatted = Math.abs(num).toLocaleString("en-BD", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });
    const prefix = num < 0 ? `-${currencySymbol}` : `${currencySymbol}`;
    return `${prefix}${formatted}`;
  }

  /**
   * Format numbers with commas
   */
  function formatNumber(num) {
    return Number(num || 0).toLocaleString("en-US");
  }

  /**
   * Date formatting utilities
   */
  function formatDate(dateStr, format = "DD MMM YYYY") {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const fullMonths = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const d = date.getDate();
    const dd = String(d).padStart(2, "0");
    const m = date.getMonth();
    const mm = String(m + 1).padStart(2, "0");
    const mmm = months[m];
    const mmmm = fullMonths[m];
    const yyyy = date.getFullYear();
    const dayName = days[date.getDay()];

    if (format === "DD MMM YYYY") return `${dd} ${mmm} ${yyyy}`;
    if (format === "MMM DD, YYYY") return `${mmm} ${dd}, ${yyyy}`;
    if (format === "YYYY-MM-DD") return `${yyyy}-${mm}-${dd}`;
    if (format === "Day, DD MMM") return `${dayName}, ${dd} ${mmm}`;
    if (format === "Month Year") return `${mmmm} ${yyyy}`;
    return `${dd} ${mmm} ${yyyy}`;
  }

  /**
   * Relative time from demo date
   */
  function formatRelativeDate(dateStr) {
    if (!dateStr) return "";
    const target = new Date(dateStr);
    const today = new Date(CURRENT_DEMO_DATE);
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays === -1) return "Yesterday";
    if (diffDays > 1 && diffDays <= 7) return `In ${diffDays} days`;
    if (diffDays < -1 && diffDays >= -7) return `${Math.abs(diffDays)} days ago`;
    return formatDate(dateStr, "DD MMM");
  }

  /**
   * Greeting based on current hour
   */
  function getGreeting(name = "Mehedi") {
    const hour = new Date().getHours();
    let timeGreeting = "Good evening";
    if (hour >= 5 && hour < 12) timeGreeting = "Good morning";
    else if (hour >= 12 && hour < 17) timeGreeting = "Good afternoon";
    else if (hour >= 17 && hour < 22) timeGreeting = "Good evening";
    else timeGreeting = "Good night";

    return {
      title: `${timeGreeting}, ${name}`,
      tagline: "Let's make today count with intention and discipline."
    };
  }

  /**
   * Generate UUID-like unique IDs
   */
  function generateId(prefix = "id") {
    return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`;
  }

  /**
   * Financial Calculations
   */

  // Net worth = Liquid Asset balances (Bank, Wallets, Cash) - Credit Card Outstanding Liabilities
  function calculateNetWorth(accounts = [], cards = []) {
    const totalAssets = accounts
      .filter(a => a.status !== "inactive")
      .reduce((sum, a) => sum + (Number(a.balance) || 0), 0);

    const totalLiabilities = cards
      .filter(c => c.type === "credit" && c.status !== "inactive")
      .reduce((sum, c) => sum + (Number(c.outstanding) || 0), 0);

    return {
      netWorth: totalAssets - totalLiabilities,
      totalAssets,
      totalLiabilities
    };
  }

  // Monthly Income by Year-Month string ('YYYY-MM')
  function calculateMonthlyIncome(transactions = [], yearMonth = "2026-10") {
    return transactions
      .filter(t => t.type === "income" && (t.date || "").startsWith(yearMonth))
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
  }

  // Monthly Expenses by Year-Month string
  function calculateMonthlyExpenses(transactions = [], yearMonth = "2026-10") {
    return transactions
      .filter(t => t.type === "expense" && (t.date || "").startsWith(yearMonth))
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
  }

  // Monthly Savings Rate %: ((Income - Expenses) / Income) * 100
  function calculateSavingsRate(income, expenses) {
    if (!income || income <= 0) return 0;
    const rate = ((income - expenses) / income) * 100;
    return Math.max(0, Math.min(100, Math.round(rate)));
  }

  // Total allocated to savings goals
  function calculateTotalSavings(savingsGoals = []) {
    return savingsGoals.reduce((sum, g) => sum + (Number(g.currentAmount) || 0), 0);
  }

  // Spending aggregated by category for a specific month
  function getCategorySpending(transactions = [], yearMonth = "2026-10") {
    const categoryMap = {};
    transactions
      .filter(t => t.type === "expense" && (t.date || "").startsWith(yearMonth))
      .forEach(t => {
        const cat = t.category || "Other";
        categoryMap[cat] = (categoryMap[cat] || 0) + Number(t.amount || 0);
      });
    return categoryMap;
  }

  // 6-Month Income vs Expense Trend
  function getSixMonthTrend(transactions = []) {
    // Generate last 6 months up to October 2026: May, Jun, Jul, Aug, Sep, Oct
    const months = [
      { key: "2026-05", label: "May" },
      { key: "2026-06", label: "Jun" },
      { key: "2026-07", label: "Jul" },
      { key: "2026-08", label: "Aug" },
      { key: "2026-09", label: "Sep" },
      { key: "2026-10", label: "Oct" }
    ];

    const labels = [];
    const incomeData = [];
    const expenseData = [];
    const savingsData = [];

    months.forEach(m => {
      labels.push(m.label);
      const inc = calculateMonthlyIncome(transactions, m.key);
      const exp = calculateMonthlyExpenses(transactions, m.key);
      incomeData.push(inc);
      expenseData.push(exp);
      savingsData.push(Math.max(0, inc - exp));
    });

    return { labels, incomeData, expenseData, savingsData };
  }

  /**
   * Habit Streak Calculation
   * Accurately calculates current streak and longest streak from actual completion dates.
   */
  function calculateHabitStreak(completedDates = [], refDateStr = CURRENT_DEMO_DATE) {
    if (!completedDates || completedDates.length === 0) {
      return { currentStreak: 0, longestStreak: 0, completionRate: 0 };
    }

    const sortedDates = [...new Set(completedDates)].sort();
    const dateSet = new Set(sortedDates);

    // Calculate current streak: check if completed on refDate or refDate - 1
    let currentStreak = 0;
    const ref = new Date(refDateStr);

    let checkDate = new Date(ref);
    const checkStr = checkDate.toISOString().split("T")[0];

    // If today is completed, start from today. If not yet completed today, check yesterday
    if (dateSet.has(checkStr)) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      checkDate.setDate(checkDate.getDate() - 1);
      const yestStr = checkDate.toISOString().split("T")[0];
      if (dateSet.has(yestStr)) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      }
    }

    while (currentStreak > 0) {
      const prevStr = checkDate.toISOString().split("T")[0];
      if (dateSet.has(prevStr)) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    // Calculate longest continuous streak
    let longestStreak = 0;
    let tempStreak = 0;
    let lastDate = null;

    sortedDates.forEach(dStr => {
      const d = new Date(dStr);
      if (!lastDate) {
        tempStreak = 1;
      } else {
        const diffDays = Math.round((d.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          tempStreak++;
        } else if (diffDays > 1) {
          tempStreak = 1;
        }
      }
      lastDate = d;
      if (tempStreak > longestStreak) {
        longestStreak = tempStreak;
      }
    });

    if (currentStreak > longestStreak) longestStreak = currentStreak;

    // 30-day completion rate
    const last30DaysCount = 30;
    let completedIn30Days = 0;
    for (let i = 0; i < last30DaysCount; i++) {
      const day = new Date(refDateStr);
      day.setDate(day.getDate() - i);
      const dKey = day.toISOString().split("T")[0];
      if (dateSet.has(dKey)) completedIn30Days++;
    }
    const completionRate = Math.round((completedIn30Days / last30DaysCount) * 100);

    return { currentStreak, longestStreak, completionRate };
  }

  /**
   * Export transactions array as CSV file download
   */
  function exportToCsv(transactions = [], filename = "LifeOS-Transactions.csv") {
    if (!transactions.length) {
      if (window.Swal) {
        window.Swal.fire({
          icon: "info",
          title: "No Data",
          text: "There are no transactions to export under the current filter.",
          confirmButtonColor: "#635BFF"
        });
      }
      return;
    }

    const headers = ["ID", "Date", "Type", "Description", "Amount (BDT)", "Category", "Payment Method", "Merchant/Source", "Tags", "Notes"];
    const rows = transactions.map(t => [
      `"${t.id}"`,
      `"${t.date}"`,
      `"${t.type}"`,
      `"${(t.description || "").replace(/"/g, '""')}"`,
      t.amount,
      `"${t.category || ""}"`,
      `"${t.method || ""}"`,
      `"${(t.merchant || "").replace(/"/g, '""')}"`,
      `"${(t.tags || []).join("; ")}"`,
      `"${(t.notes || "").replace(/"/g, '""')}"`
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(r => r.join(","))].join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /**
   * Conveyance & Reimbursement Metrics
   */
  function calculateConveyanceMetrics(trips = [], claims = []) {
    const totalActualSpent = trips.reduce((sum, t) => sum + (Number(t.actualCost) || 0), 0);
    const totalClaimed = trips.reduce((sum, t) => sum + (Number(t.claimedCost) || 0), 0);
    const initialGap = trips.reduce((sum, t) => sum + (Number(t.pocketGap) || 0), 0);

    const totalDisbursed = claims.reduce((sum, c) => sum + (Number(c.disbursedAmount) || 0), 0);
    const totalCompanyDeductions = claims.reduce((sum, c) => sum + (Number(c.companyDeduction) || 0), 0);
    const pendingDisbursement = claims
      .filter(c => c.status === "pending_approval")
      .reduce((sum, c) => sum + (Number(c.totalClaimed) || 0), 0);

    const settledClaims = claims.filter(c => c.status === "fully_disbursed" || c.status === "partially_disbursed");
    const totalSettledActual = settledClaims.reduce((sum, c) => sum + (Number(c.totalActualSpent) || 0), 0);
    const totalSettledDisbursed = settledClaims.reduce((sum, c) => sum + (Number(c.disbursedAmount) || 0), 0);
    const netSettledPocketLoss = Math.max(0, totalSettledActual - totalSettledDisbursed);

    const overallLoss = Math.max(0, (totalActualSpent - totalDisbursed) - pendingDisbursement);

    return {
      totalActualSpent,
      totalClaimed,
      initialGap,
      totalDisbursed,
      totalCompanyDeductions,
      pendingDisbursement,
      netSettledPocketLoss,
      overallLoss
    };
  }

  return {
    CURRENT_DEMO_DATE,
    escapeHtml,
    formatCurrency,
    formatNumber,
    formatDate,
    formatRelativeDate,
    getGreeting,
    generateId,
    calculateNetWorth,
    calculateMonthlyIncome,
    calculateMonthlyExpenses,
    calculateSavingsRate,
    calculateTotalSavings,
    getCategorySpending,
    getSixMonthTrend,
    calculateHabitStreak,
    exportToCsv,
    calculateConveyanceMetrics
  };
})();

if (typeof window !== "undefined") {
  window.LifeUtils = LifeUtils;
}

