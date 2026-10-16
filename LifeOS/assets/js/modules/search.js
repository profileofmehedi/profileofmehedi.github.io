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
          লেনদেন, অ্যাকাউন্ট, যাতায়াত, টাস্ক, অভ্যাস, লক্ষ্য এবং জার্নাল খুঁজতে টাইপ করুন...
        </div>
      `);
      return;
    }

    const results = [];
    const prioMap = { Urgent: "জরুরি", High: "উচ্চ", Medium: "মধ্যম", Low: "সাধারণ" };
    const claimStatusMap = { draft: "ড্রাফট", submitted: "জমা দেওয়া", reimbursed: "পরিশোধিত", approved: "অনুমোদিত" };

    // Transactions
    const transactions = LifeStorage.get("transactions") || [];
    transactions.forEach(t => {
      if (
        (t.description || "").toLowerCase().includes(query) ||
        (t.category || "").toLowerCase().includes(query) ||
        (t.merchant || "").toLowerCase().includes(query)
      ) {
        results.push({
          type: "লেনদেন",
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
          type: "অ্যাকাউন্ট",
          icon: "bi-bank text-success",
          title: a.name,
          subtitle: `${a.institution} • ব্যালেন্স: ${LifeUtils.formatCurrency(a.balance)}`,
          page: "accounts"
        });
      }
    });

    // Conveyance & Official Trips
    const trips = LifeStorage.get("conveyanceTrips") || [];
    trips.forEach(t => {
      if (
        (t.clientOrPurpose || "").toLowerCase().includes(query) ||
        (t.location || "").toLowerCase().includes(query) ||
        (t.route || "").toLowerCase().includes(query)
      ) {
        results.push({
          type: "যাতায়াত",
          icon: "bi-briefcase text-warning",
          title: t.clientOrPurpose,
          subtitle: `${t.location} • খরচ: ${LifeUtils.formatCurrency(t.actualCost)} (দাবি: ${LifeUtils.formatCurrency(t.claimedCost)})`,
          page: "conveyance"
        });
      }
    });

    // Conveyance Claim Batches
    const claims = LifeStorage.get("conveyanceClaims") || [];
    claims.forEach(c => {
      if ((c.title || "").toLowerCase().includes(query) || (c.voucherNumber || "").toLowerCase().includes(query)) {
        results.push({
          type: "দাবি ভাউচার",
          icon: "bi-receipt text-primary",
          title: `${c.voucherNumber}: ${c.title}`,
          subtitle: `দাবিকৃত: ${LifeUtils.formatCurrency(c.totalClaimed)} • অবস্থা: ${claimStatusMap[c.status] || c.status}`,
          page: "conveyance"
        });
      }
    });

    // Tasks
    const tasks = LifeStorage.get("tasks") || [];
    tasks.forEach(t => {
      if ((t.title || "").toLowerCase().includes(query) || (t.description || "").toLowerCase().includes(query)) {
        results.push({
          type: "টাস্ক",
          icon: "bi-check2-square text-primary",
          title: t.title,
          subtitle: `অগ্রাধিকার: ${prioMap[t.priority] || t.priority} • সময়সীমা: ${LifeUtils.formatDate(t.dueDate, "DD MMM")}`,
          page: "tasks"
        });
      }
    });

    // Habits
    const habits = LifeStorage.get("habits") || [];
    habits.forEach(h => {
      if ((h.name || "").toLowerCase().includes(query) || (h.category || "").toLowerCase().includes(query)) {
        results.push({
          type: "অভ্যাস",
          icon: "bi-fire text-danger",
          title: h.name,
          subtitle: `ক্যাটাগরি: ${h.category} • রিমাইন্ডার: ${LifeUtils.toBnNumber(h.reminderTime || "")}`,
          page: "habits"
        });
      }
    });

    // Life Goals
    const goals = LifeStorage.get("lifeGoals") || [];
    goals.forEach(g => {
      if ((g.title || "").toLowerCase().includes(query) || (g.category || "").toLowerCase().includes(query)) {
        results.push({
          type: "লাইফ গোল",
          icon: "bi-trophy text-warning",
          title: g.title,
          subtitle: `ক্যাটাগরি: ${g.category} • অগ্রগতি: ${LifeUtils.toBnNumber(g.progress || 0)}%`,
          page: "lifegoals"
        });
      }
    });

    // Journal
    const journal = LifeStorage.get("journalEntries") || [];
    journal.forEach(j => {
      if ((j.title || "").toLowerCase().includes(query) || (j.content || "").toLowerCase().includes(query)) {
        results.push({
          type: "জার্নাল",
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
          "<strong>${LifeUtils.escapeHtml(query)}</strong>"-এর জন্য কোনো ফলাফল পাওয়া যায়নি।
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
