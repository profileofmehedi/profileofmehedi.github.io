/**
 * LifeOS — Global Search Omnibox Module (Ctrl + K)
 * Instant multi-entity search indexing across transactions, accounts, tasks, habits, goals, and journal.
 */

const LifeSearch = (() => {
  function init() {
    // Keyboard shortcut Ctrl+K / Cmd+K
    $(document).on("keydown", function (e) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        openSearchModal();
      }
    });

    $(document).on("click", "#btn-open-global-search", function (e) {
      e.preventDefault();
      openSearchModal();
    });

    // Real-time search query input
    $(document).on("input", "#global-search-input", function () {
      const q = $(this).val().toLowerCase().trim();
      executeSearch(q);
    });

    // Result item click
    $(document).on("click", ".search-result-item", function () {
      const targetPage = $(this).data("page");
      bootstrap.Modal.getInstance(document.getElementById("modal-global-search")).hide();
      if (window.LifeApp) {
        window.LifeApp.navigateTo(targetPage);
      }
    });
  }

  function openSearchModal() {
    $("#global-search-input").val("");
    executeSearch("");
    const modal = new bootstrap.Modal(document.getElementById("modal-global-search"));
    modal.show();
    setTimeout(() => $("#global-search-input").focus(), 300);
  }

  function executeSearch(query) {
    if (!query) {
      $("#global-search-results").html(`
        <div class="p-4 text-center text-muted small">
          Type to search transactions, accounts, tasks, habits, goals, and journals...
        </div>
      `);
      return;
    }

    const results = [];

    // Transactions
    const transactions = LifeStorage.get("transactions") || [];
    transactions.forEach(t => {
      if (
        (t.description || "").toLowerCase().includes(query) ||
        (t.category || "").toLowerCase().includes(query) ||
        (t.merchant || "").toLowerCase().includes(query)
      ) {
        results.push({
          type: "Transaction",
          icon: "bi-arrow-left-right text-info",
          title: t.description,
          subtitle: `${LifeUtils.formatDate(t.date, "DD MMM")} • ${LifeUtils.formatCurrency(t.amount)} (${t.category})`,
          page: "transactions"
        });
      }
    });

    // Accounts
    const accounts = LifeStorage.get("accounts") || [];
    accounts.forEach(a => {
      if ((a.name || "").toLowerCase().includes(query) || (a.institution || "").toLowerCase().includes(query)) {
        results.push({
          type: "Account",
          icon: "bi-bank text-success",
          title: a.name,
          subtitle: `${a.institution} • Balance: ${LifeUtils.formatCurrency(a.balance)}`,
          page: "accounts"
        });
      }
    });

    // Tasks
    const tasks = LifeStorage.get("tasks") || [];
    tasks.forEach(t => {
      if ((t.title || "").toLowerCase().includes(query) || (t.description || "").toLowerCase().includes(query)) {
        results.push({
          type: "Task",
          icon: "bi-check2-square text-primary",
          title: t.title,
          subtitle: `Priority: ${t.priority} • Due ${LifeUtils.formatDate(t.dueDate, "DD MMM")}`,
          page: "tasks"
        });
      }
    });

    // Habits
    const habits = LifeStorage.get("habits") || [];
    habits.forEach(h => {
      if ((h.name || "").toLowerCase().includes(query) || (h.category || "").toLowerCase().includes(query)) {
        results.push({
          type: "Habit",
          icon: "bi-fire text-danger",
          title: h.name,
          subtitle: `Category: ${h.category} • Reminder: ${h.reminderTime}`,
          page: "habits"
        });
      }
    });

    // Life Goals
    const goals = LifeStorage.get("lifeGoals") || [];
    goals.forEach(g => {
      if ((g.title || "").toLowerCase().includes(query) || (g.category || "").toLowerCase().includes(query)) {
        results.push({
          type: "Life Goal",
          icon: "bi-trophy text-warning",
          title: g.title,
          subtitle: `Category: ${g.category} • Progress: ${g.progress}%`,
          page: "lifegoals"
        });
      }
    });

    // Journal
    const journal = LifeStorage.get("journalEntries") || [];
    journal.forEach(j => {
      if ((j.title || "").toLowerCase().includes(query) || (j.content || "").toLowerCase().includes(query)) {
        results.push({
          type: "Journal",
          icon: "bi-journal-text text-purple",
          title: j.title,
          subtitle: `${LifeUtils.formatDate(j.date, "DD MMM YYYY")}`,
          page: "journal"
        });
      }
    });

    if (results.length === 0) {
      $("#global-search-results").html(`
        <div class="p-4 text-center text-muted small">
          No matches found for "<strong>${LifeUtils.escapeHtml(query)}</strong>".
        </div>
      `);
      return;
    }

    const html = results.slice(0, 10).map(r => `
      <div class="search-result-item d-flex align-items-center justify-content-between p-3 border-bottom cursor-pointer hover-bg-light" data-page="${r.page}">
        <div class="d-flex align-items-center gap-3">
          <i class="bi ${r.icon} fs-5"></i>
          <div>
            <div class="fw-semibold fs-14">${LifeUtils.escapeHtml(r.title)}</div>
            <div class="text-muted small">${LifeUtils.escapeHtml(r.subtitle)}</div>
          </div>
        </div>
        <span class="badge bg-light text-secondary border small">${r.type}</span>
      </div>
    `).join("");

    $("#global-search-results").html(html);
  }

  return {
    init,
    openSearchModal
  };
})();

if (typeof window !== "undefined") {
  window.LifeSearch = LifeSearch;
}
