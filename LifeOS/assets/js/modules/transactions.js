/**
 * LifeOS — Transactions Management Module
 * Comprehensive ledger with filters, search, sort, pagination, dynamic modal, and CSV export.
 */

const LifeTransactions = (() => {
  let currentPage = 1;
  const pageSize = 10;
  let activeFilters = {
    search: "",
    type: "all",
    category: "all",
    account: "all",
    sortBy: "date-desc"
  };

  function init() {
    // Search input
    $(document).on("input", "#tx-search-input", function () {
      activeFilters.search = $(this).val().toLowerCase().trim();
      currentPage = 1;
      render();
    });

    // Filters
    $(document).on("change", "#tx-filter-type", function () {
      activeFilters.type = $(this).val();
      currentPage = 1;
      render();
    });

    $(document).on("change", "#tx-filter-category", function () {
      activeFilters.category = $(this).val();
      currentPage = 1;
      render();
    });

    $(document).on("change", "#tx-filter-account", function () {
      activeFilters.account = $(this).val();
      currentPage = 1;
      render();
    });

    $(document).on("change", "#tx-sort-by", function () {
      activeFilters.sortBy = $(this).val();
      currentPage = 1;
      render();
    });

    // Reset filters
    $(document).on("click", "#btn-tx-reset-filters", function () {
      activeFilters = {
        search: "",
        type: "all",
        category: "all",
        account: "all",
        sortBy: "date-desc"
      };
      $("#tx-search-input").val("");
      $("#tx-filter-type").val("all");
      $("#tx-filter-category").val("all");
      $("#tx-filter-account").val("all");
      $("#tx-sort-by").val("date-desc");
      currentPage = 1;
      render();
    });

    // Pagination
    $(document).on("click", ".tx-page-btn", function (e) {
      e.preventDefault();
      const page = $(this).data("page");
      if (page) {
        currentPage = Number(page);
        render();
      }
    });

    // Export CSV
    $(document).on("click", "#btn-tx-export-csv", function () {
      const filtered = getFilteredTransactions();
      LifeUtils.exportToCsv(filtered, `LifeOS-Transactions-${new Date().toISOString().split("T")[0]}.csv`);
    });

    // Add / Edit Modal type change dynamic field visibility
    $(document).on("change", "#tx-form-type", function () {
      updateDynamicFormFields($(this).val());
    });

    // Delete transaction
    $(document).on("click", ".btn-delete-tx", function () {
      const txId = $(this).data("id");
      window.Swal.fire({
        title: "লেনদেন মুছবেন?",
        text: "এটি লেনদেনটি মুছে ফেলবে এবং অ্যাকাউন্টের ব্যালেন্সে সমন্বয় করবে।",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#EF4444",
        cancelButtonColor: "#64748B",
        confirmButtonText: "হ্যাঁ, মুছুন",
        cancelButtonText: "বাতিল"
      }).then(result => {
        if (result.isConfirmed) {
          LifeStorage.deleteTransaction(txId);
          window.Swal.fire({
            icon: "success",
            title: "মুছে ফেলা হয়েছে!",
            text: "লেনদেনটি সফলভাবে মুছে ফেলা হয়েছে।",
            timer: 1500,
            showConfirmButton: false,
            toast: true,
            position: "top-end"
          });
        }
      });
    });

    // Edit transaction modal open
    $(document).on("click", ".btn-edit-tx", function () {
      const txId = $(this).data("id");
      openEditModal(txId);
    });

    // Save transaction form submit
    $(document).on("submit", "#form-transaction", function (e) {
      e.preventDefault();
      saveTransactionForm();
    });

    // Re-render on storage change
    LifeStorage.on("change", (e) => {
      if (window.LifeApp && window.LifeApp.getCurrentPage() === "transactions") {
        render();
      }
    });
  }

  function updateDynamicFormFields(type) {
    const isTransfer = type === "transfer";
    const isSavings = type === "savings";
    const isDebt = type === "debt_payment";

    $("#tx-group-destination").toggleClass("d-none", !isTransfer);
    $("#tx-group-savings-goal").toggleClass("d-none", !isSavings);
    $("#tx-group-credit-card").toggleClass("d-none", !isDebt);

    // Populate category defaults based on type
    if (isTransfer) {
      $("#tx-form-category").val("Transfer");
    } else if (isSavings) {
      $("#tx-form-category").val("Savings Contribution");
    } else if (isDebt) {
      $("#tx-form-category").val("Credit Card Payment");
    }
  }

  function getFilteredTransactions() {
    let list = [...(LifeStorage.get("transactions") || [])];

    // Search
    if (activeFilters.search) {
      list = list.filter(t =>
        (t.description || "").toLowerCase().includes(activeFilters.search) ||
        (t.merchant || "").toLowerCase().includes(activeFilters.search) ||
        (t.category || "").toLowerCase().includes(activeFilters.search) ||
        (t.tags || []).some(tag => tag.toLowerCase().includes(activeFilters.search))
      );
    }

    // Type
    if (activeFilters.type !== "all") {
      list = list.filter(t => t.type === activeFilters.type);
    }

    // Category
    if (activeFilters.category !== "all") {
      list = list.filter(t => t.category === activeFilters.category);
    }

    // Account
    if (activeFilters.account !== "all") {
      list = list.filter(t => t.accountId === activeFilters.account || t.destinationAccountId === activeFilters.account);
    }

    // Sort
    list.sort((a, b) => {
      if (activeFilters.sortBy === "date-desc") return new Date(b.date) - new Date(a.date);
      if (activeFilters.sortBy === "date-asc") return new Date(a.date) - new Date(b.date);
      if (activeFilters.sortBy === "amount-desc") return (Number(b.amount) || 0) - (Number(a.amount) || 0);
      if (activeFilters.sortBy === "amount-asc") return (Number(a.amount) || 0) - (Number(b.amount) || 0);
      return 0;
    });

    return list;
  }

  function render() {
    populateAccountDropdowns();
    populateCategoryDropdowns();

    const filtered = getFilteredTransactions();
    renderSummaryBanner(filtered);

    // Pagination slice
    const totalItems = filtered.length;
    const totalPages = Math.ceil(totalItems / pageSize) || 1;
    if (currentPage > totalPages) currentPage = totalPages;

    const startIdx = (currentPage - 1) * pageSize;
    const paginatedItems = filtered.slice(startIdx, startIdx + pageSize);

    renderTable(paginatedItems);
    renderPagination(totalItems, totalPages);
  }

  function renderSummaryBanner(filtered) {
    let inflow = 0, outflow = 0;
    filtered.forEach(t => {
      const amt = Number(t.amount) || 0;
      if (t.type === "income") inflow += amt;
      else if (t.type === "expense") outflow += amt;
    });

    const net = inflow - outflow;
    $("#tx-summary-inflow").text(LifeUtils.formatCurrency(inflow));
    $("#tx-summary-outflow").text(LifeUtils.formatCurrency(outflow));
    $("#tx-summary-net").text(LifeUtils.formatCurrency(net));
    $("#tx-summary-net").removeClass("text-success text-danger")
      .addClass(net >= 0 ? "text-success" : "text-danger");
    $("#tx-summary-count").text(`${LifeUtils.toBnNumber(filtered.length)} টি লেনদেন`);
  }

  function renderTable(items) {
    const accounts = LifeStorage.get("accounts") || [];
    const cards = LifeStorage.get("cards") || [];

    const categoryMap = {
      "Food & Groceries": "খাবার ও বাজার",
      "Housing & Rent": "বাসা ভাড়া ও আবাসন",
      "Utilities & Bills": "ইউটিলিটি ও বিল",
      "Transport & Fuel": "যাতায়াত ও জ্বালানি",
      "Dining Out & Cafes": "রেস্তোরাঁ ও ক্যাফে",
      "Shopping & Tech": "কেনাকাটা ও গ্যাজেট",
      "Healthcare & Medicine": "চিকিৎসা ও ওষুধ",
      "Subscriptions & SaaS": "সাবস্ক্রিপশন ও সফটওয়্যার",
      "Family & Childcare": "পরিবার ও আত্মীয়স্বজন",
      "Education & Books": "শিক্ষা ও বইপত্র",
      "Salary": "বেতন",
      "Freelance & Consulting": "ফ্রিল্যান্সিং ও কনসাল্টিং",
      "Bonus": "বোনাস ও ইনসেন্টিভ",
      "Transfer": "অ্যাকাউন্ট স্থানান্তর",
      "Savings Contribution": "সঞ্চয় কিস্তি জমা",
      "Credit Card Payment": "ক্রেডিট কার্ড পরিশোধ",
      "Other": "অন্যান্য"
    };

    const methodMap = {
      "Debit Card": "ডেবিট কার্ড",
      "Credit Card": "ক্রেডিট কার্ড",
      "Bank Transfer": "ব্যাংক ট্রান্সফার",
      "bKash": "বিকাশ",
      "Nagad": "নগদ",
      "Cash": "ক্যাশ",
      "Direct Deposit": "ডিপোজিট",
      "Electronic": "অনলাইন"
    };

    const getAccountName = id => {
      const acc = accounts.find(a => a.id === id);
      if (acc) return acc.name;
      const card = cards.find(c => c.id === id);
      if (card) return card.name;
      return "সরাসরি";
    };

    if (items.length === 0) {
      $("#tx-table-body").html(`
        <tr>
          <td colspan="7" class="text-center py-5 text-muted">
            <i class="bi bi-inbox fs-1 d-block mb-2 text-secondary opacity-50"></i>
            <div class="fw-semibold">আপনার ফিল্টারের সাথে কোনো লেনদেন মেলেনি।</div>
            <div class="small">অনুসন্ধান বা ফিল্টার রিসেট করে আবার চেষ্টা করুন।</div>
          </td>
        </tr>
      `);
      return;
    }

    const html = items.map(t => {
      const isExp = t.type === "expense";
      const isInc = t.type === "income";
      const isSav = t.type === "savings";
      const isTrans = t.type === "transfer";
      const isDebt = t.type === "debt_payment";

      let typeBadge = `<span class="badge bg-danger-subtle text-danger-emphasis">ব্যয়</span>`;
      let amountColor = "text-danger";
      let amountPrefix = "-";

      if (isInc) {
        typeBadge = `<span class="badge bg-success-subtle text-success-emphasis">আয়</span>`;
        amountColor = "text-success";
        amountPrefix = "+";
      } else if (isSav) {
        typeBadge = `<span class="badge bg-primary-subtle text-primary-emphasis">সঞ্চয়</span>`;
        amountColor = "text-primary";
        amountPrefix = "";
      } else if (isTrans) {
        typeBadge = `<span class="badge bg-info-subtle text-info-emphasis">স্থানান্তর</span>`;
        amountColor = "text-info";
        amountPrefix = "";
      } else if (isDebt) {
        typeBadge = `<span class="badge bg-warning-subtle text-warning-emphasis">কার্ড বিল</span>`;
        amountColor = "text-warning";
        amountPrefix = "";
      }

      const catLabel = categoryMap[t.category] || t.category || "সাধারণ";
      const methodLabel = methodMap[t.method] || t.method || "অনলাইন";

      return `
        <tr>
          <td>
            <div class="fw-semibold fs-14">${LifeUtils.formatDate(t.date, "DD MMM YYYY")}</div>
            <div class="text-muted small">${LifeUtils.formatRelativeDate(t.date)}</div>
          </td>
          <td>
            <div class="fw-semibold fs-14 text-dark text-truncate" style="max-width: 240px;">${LifeUtils.escapeHtml(t.description)}</div>
            <div class="text-muted small">${LifeUtils.escapeHtml(t.merchant || "ব্যক্তিগত")}</div>
          </td>
          <td>${typeBadge}</td>
          <td>
            <span class="badge bg-light text-secondary border">${LifeUtils.escapeHtml(catLabel)}</span>
          </td>
          <td>
            <div class="small fw-medium">${LifeUtils.escapeHtml(getAccountName(t.accountId))}</div>
            <div class="text-muted small">${LifeUtils.escapeHtml(methodLabel)}</div>
          </td>
          <td class="text-end">
            <span class="fw-bold ${amountColor}">${amountPrefix}${LifeUtils.formatCurrency(t.amount)}</span>
          </td>
          <td class="text-end">
            <div class="btn-group btn-group-sm">
              <button class="btn btn-outline-secondary btn-edit-tx" data-id="${t.id}" title="সম্পাদনা"><i class="bi bi-pencil"></i></button>
              <button class="btn btn-outline-danger btn-delete-tx" data-id="${t.id}" title="মুছুন"><i class="bi bi-trash"></i></button>
            </div>
          </td>
        </tr>
      `;
    }).join("");

    $("#tx-table-body").html(html);
  }

  function renderPagination(totalItems, totalPages) {
    if (totalPages <= 1) {
      $("#tx-pagination").html("");
      return;
    }

    let html = `<li class="page-item ${currentPage === 1 ? "disabled" : ""}">
      <a class="page-link tx-page-btn" href="#" data-page="${currentPage - 1}"><i class="bi bi-chevron-left"></i></a>
    </li>`;

    for (let p = 1; p <= totalPages; p++) {
      if (p === 1 || p === totalPages || (p >= currentPage - 1 && p <= currentPage + 1)) {
        html += `<li class="page-item ${p === currentPage ? "active" : ""}">
          <a class="page-link tx-page-btn" href="#" data-page="${p}">${LifeUtils.toBnNumber(p)}</a>
        </li>`;
      } else if (p === currentPage - 2 || p === currentPage + 2) {
        html += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
      }
    }

    html += `<li class="page-item ${currentPage === totalPages ? "disabled" : ""}">
      <a class="page-link tx-page-btn" href="#" data-page="${currentPage + 1}"><i class="bi bi-chevron-right"></i></a>
    </li>`;

    $("#tx-pagination").html(html);
  }

  function populateAccountDropdowns() {
    const accounts = LifeStorage.get("accounts") || [];
    const cards = LifeStorage.get("cards") || [];

    let filterOptions = `<option value="all">সকল অ্যাকাউন্ট ও কার্ড</option>`;
    let formOptions = "";

    accounts.forEach(a => {
      filterOptions += `<option value="${a.id}">${a.name} (${LifeUtils.formatCurrency(a.balance)})</option>`;
      formOptions += `<option value="${a.id}">${a.name} (${a.institution})</option>`;
    });

    cards.forEach(c => {
      filterOptions += `<option value="${c.id}">${c.name}</option>`;
      formOptions += `<option value="${c.id}">${c.name}</option>`;
    });

    $("#tx-filter-account").html(filterOptions).val(activeFilters.account);
    $("#tx-form-account").html(formOptions);
    $("#tx-form-dest-account").html(formOptions);

    // Savings goals
    const goals = LifeStorage.get("savingsGoals") || [];
    let goalOptions = `<option value="">সঞ্চয় লক্ষ্য নির্বাচন করুন...</option>`;
    goals.forEach(g => {
      goalOptions += `<option value="${g.id}">${g.name} (${LifeUtils.formatCurrency(g.currentAmount)} / ${LifeUtils.formatCurrency(g.targetAmount)})</option>`;
    });
    $("#tx-form-goal").html(goalOptions);

    // Credit cards
    const creditCards = cards.filter(c => c.type === "credit");
    let ccOptions = `<option value="">ক্রেডিট কার্ড নির্বাচন করুন...</option>`;
    creditCards.forEach(c => {
      ccOptions += `<option value="${c.id}">${c.name} (বকেয়া: ${LifeUtils.formatCurrency(c.outstanding)})</option>`;
    });
    $("#tx-form-card").html(ccOptions);
  }

  function populateCategoryDropdowns() {
    const categories = [
      { id: "Food & Groceries", name: "খাবার ও বাজার" },
      { id: "Housing & Rent", name: "বাসা ভাড়া ও আবাসন" },
      { id: "Utilities & Bills", name: "ইউটিলিটি ও বিল" },
      { id: "Transport & Fuel", name: "যাতায়াত ও জ্বালানি" },
      { id: "Dining Out & Cafes", name: "রেস্তোরাঁ ও ক্যাফে" },
      { id: "Shopping & Tech", name: "কেনাকাটা ও গ্যাজেট" },
      { id: "Healthcare & Medicine", name: "চিকিৎসা ও ওষুধ" },
      { id: "Subscriptions & SaaS", name: "সাবস্ক্রিপশন ও সফটওয়্যার" },
      { id: "Family & Childcare", name: "পরিবার ও আত্মীয়স্বজন" },
      { id: "Education & Books", name: "শিক্ষা ও বইপত্র" },
      { id: "Salary", name: "বেতন" },
      { id: "Freelance & Consulting", name: "ফ্রিল্যান্সিং ও কনসাল্টিং" },
      { id: "Bonus", name: "বোনাস ও ইনসেন্টিভ" },
      { id: "Transfer", name: "অ্যাকাউন্ট স্থানান্তর" },
      { id: "Savings Contribution", name: "সঞ্চয় কিস্তি জমা" },
      { id: "Credit Card Payment", name: "ক্রেডিট কার্ড পরিশোধ" },
      { id: "Other", name: "অন্যান্য" }
    ];

    let filterOptions = `<option value="all">সকল ক্যাটাগরি</option>`;
    let formOptions = "";

    categories.forEach(c => {
      filterOptions += `<option value="${c.id}">${c.name}</option>`;
      formOptions += `<option value="${c.id}">${c.name}</option>`;
    });

    $("#tx-filter-category").html(filterOptions).val(activeFilters.category);
    $("#tx-form-category").html(formOptions);
  }

  function openEditModal(txId) {
    const tx = (LifeStorage.get("transactions") || []).find(t => t.id === txId);
    if (!tx) return;

    $("#modal-tx-title").text("লেনদেন সম্পাদনা");
    $("#tx-form-id").val(tx.id);
    $("#tx-form-type").val(tx.type);
    $("#tx-form-description").val(tx.description);
    $("#tx-form-amount").val(tx.amount);
    $("#tx-form-date").val(tx.date);
    $("#tx-form-category").val(tx.category);
    $("#tx-form-account").val(tx.accountId);
    $("#tx-form-dest-account").val(tx.destinationAccountId || "");
    $("#tx-form-goal").val(tx.savingsGoalId || "");
    $("#tx-form-card").val(tx.cardId || "");
    $("#tx-form-method").val(tx.method || "Debit Card");
    $("#tx-form-merchant").val(tx.merchant || "");
    $("#tx-form-tags").val((tx.tags || []).join(", "));
    $("#tx-form-notes").val(tx.notes || "");

    updateDynamicFormFields(tx.type);

    const modal = new bootstrap.Modal(document.getElementById("modal-transaction"));
    modal.show();
  }

  function openAddModal(type = "expense") {
    $("#modal-tx-title").text("নতুন লেনদেন যোগ করুন");
    $("#tx-form-id").val("");
    $("#tx-form-type").val(type);
    $("#tx-form-description").val("");
    $("#tx-form-amount").val("");
    $("#tx-form-date").val(LifeUtils.CURRENT_DEMO_DATE);
    $("#tx-form-method").val(type === "expense" ? "Debit Card" : "Direct Deposit");
    $("#tx-form-merchant").val("");
    $("#tx-form-tags").val("");
    $("#tx-form-notes").val("");

    updateDynamicFormFields(type);

    const modal = new bootstrap.Modal(document.getElementById("modal-transaction"));
    modal.show();
  }

  function saveTransactionForm() {
    const id = $("#tx-form-id").val();
    const type = $("#tx-form-type").val();
    const description = $("#tx-form-description").val().trim();
    const amount = Number($("#tx-form-amount").val());
    const date = $("#tx-form-date").val();
    const category = $("#tx-form-category").val();
    const accountId = $("#tx-form-account").val();
    const destinationAccountId = $("#tx-form-dest-account").val();
    const savingsGoalId = $("#tx-form-goal").val();
    const cardId = $("#tx-form-card").val();
    const method = $("#tx-form-method").val();
    const merchant = $("#tx-form-merchant").val().trim();
    const rawTags = $("#tx-form-tags").val().trim();
    const tags = rawTags ? rawTags.split(",").map(t => t.trim()) : [];
    const notes = $("#tx-form-notes").val().trim();

    if (!description || !amount || amount <= 0 || !date) {
      window.Swal.fire({
        icon: "warning",
        title: "ভুল তথ্য",
        text: "অনুগ্রহ করে বিবরণ, তারিখ এবং সঠিক টাকার পরিমাণ প্রদান করুন।",
        confirmButtonColor: "#635BFF"
      });
      return;
    }

    const payload = {
      id: id || LifeUtils.generateId("tx"),
      type,
      description,
      amount,
      date,
      category,
      accountId,
      destinationAccountId: type === "transfer" ? destinationAccountId : null,
      savingsGoalId: type === "savings" ? savingsGoalId : null,
      cardId: type === "debt_payment" ? cardId : null,
      method,
      merchant,
      tags,
      notes
    };

    if (id) {
      LifeStorage.updateTransaction(payload);
    } else {
      LifeStorage.addTransaction(payload);
    }

    // Hide modal
    bootstrap.Modal.getInstance(document.getElementById("modal-transaction")).hide();

    window.Swal.fire({
      icon: "success",
      title: id ? "লেনদেন আপডেট হয়েছে" : "লেনদেন যোগ হয়েছে",
      timer: 1500,
      showConfirmButton: false,
      toast: true,
      position: "top-end"
    });
  }

  return {
    init,
    render,
    openAddModal,
    openEditModal
  };
})();

if (typeof window !== "undefined") {
  window.LifeTransactions = LifeTransactions;
}
