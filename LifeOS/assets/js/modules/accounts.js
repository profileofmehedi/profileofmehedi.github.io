/**
 * LifeOS — Accounts & Cards Management Module
 * Fintech dashboard with interactive 3D payment cards, balances, transfers, and ledger drilldown.
 */

const LifeAccounts = (() => {
  let activeTab = "all";

  function init() {
    // Tab switching
    $(document).on("click", ".accounts-tab-btn", function (e) {
      e.preventDefault();
      $(".accounts-tab-btn").removeClass("active");
      $(this).addClass("active");
      activeTab = $(this).data("tab");
      renderCardsAndAccounts();
    });

    // Preferred toggle
    $(document).on("click", ".btn-toggle-preferred", function () {
      const accId = $(this).data("id");
      const accounts = LifeStorage.get("accounts") || [];
      accounts.forEach(a => {
        a.isPreferred = a.id === accId;
      });
      LifeStorage.set("accounts", accounts);
      renderCardsAndAccounts();
    });

    // Delete account
    $(document).on("click", ".btn-delete-account", function () {
      const accId = $(this).data("id");
      window.Swal.fire({
        title: "অ্যাকাউন্ট মুছে ফেলতে চান?",
        text: "আপনি কি আপনার পোর্টফোলিও থেকে এই অ্যাকাউন্টটি মুছে ফেলতে চান?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#EF4444",
        cancelButtonColor: "#64748B",
        confirmButtonText: "হ্যাঁ, মুছে ফেলুন",
        cancelButtonText: "বাতিল"
      }).then(res => {
        if (res.isConfirmed) {
          LifeStorage.deleteAccount(accId);
          window.Swal.fire({ icon: "success", title: "অ্যাকাউন্ট মুছে ফেলা হয়েছে", timer: 1500, showConfirmButton: false, toast: true });
        }
      });
    });

    // Delete card
    $(document).on("click", ".btn-delete-card", function () {
      const cardId = $(this).data("id");
      window.Swal.fire({
        title: "কার্ড সরিয়ে নিতে চান?",
        text: "আপনার ওয়ালেট থেকে এই কার্ডটি সরিয়ে ফেলবেন?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#EF4444",
        cancelButtonColor: "#64748B",
        confirmButtonText: "হ্যাঁ, সরিয়ে নিন",
        cancelButtonText: "বাতিল"
      }).then(res => {
        if (res.isConfirmed) {
          LifeStorage.deleteCard(cardId);
          window.Swal.fire({ icon: "success", title: "কার্ড সরানো হয়েছে", timer: 1500, showConfirmButton: false, toast: true });
        }
      });
    });

    // Quick Transfer button
    $(document).on("click", ".btn-quick-transfer", function () {
      const sourceId = $(this).data("id");
      openTransferModal(sourceId);
    });

    // Direct Income / Expense quick triggers from account card
    $(document).on("click", ".btn-account-add-income", function () {
      const accId = $(this).data("id");
      window.LifeTransactions.openAddModal("income");
      setTimeout(() => $("#tx-form-account").val(accId), 100);
    });

    $(document).on("click", ".btn-account-add-expense", function () {
      const accId = $(this).data("id");
      window.LifeTransactions.openAddModal("expense");
      setTimeout(() => $("#tx-form-account").val(accId), 100);
    });

    // Save Account form
    $(document).on("submit", "#form-account", function (e) {
      e.preventDefault();
      saveAccountForm();
    });

    // Save Card form
    $(document).on("submit", "#form-card", function (e) {
      e.preventDefault();
      saveCardForm();
    });

    // Save Transfer form
    $(document).on("submit", "#form-transfer", function (e) {
      e.preventDefault();
      saveTransferForm();
    });

    LifeStorage.on("change", (e) => {
      if (window.LifeApp && window.LifeApp.getCurrentPage() === "accounts") {
        render();
      }
    });
  }

  function render() {
    renderSummaryMetrics();
    renderCardsAndAccounts();
    renderRecentActivity();
  }

  function renderSummaryMetrics() {
    const accounts = LifeStorage.get("accounts") || [];
    const cards = LifeStorage.get("cards") || [];

    const stats = LifeUtils.calculateNetWorth(accounts, cards);
    $("#acc-stat-net-worth").text(LifeUtils.formatCurrency(stats.netWorth));
    $("#acc-stat-assets").text(LifeUtils.formatCurrency(stats.totalAssets));
    $("#acc-stat-liabilities").text(LifeUtils.formatCurrency(stats.totalLiabilities));
  }

  function renderCardsAndAccounts() {
    const accounts = LifeStorage.get("accounts") || [];
    const cards = LifeStorage.get("cards") || [];

    let filteredAccounts = [...accounts];
    let filteredCards = [...cards];

    if (activeTab === "bank") {
      filteredAccounts = accounts.filter(a => a.type === "bank");
      filteredCards = [];
    } else if (activeTab === "wallets") {
      filteredAccounts = accounts.filter(a => a.type === "wallet" || a.type === "cash");
      filteredCards = [];
    } else if (activeTab === "credit") {
      filteredAccounts = [];
      filteredCards = cards.filter(c => c.type === "credit");
    } else if (activeTab === "debit") {
      filteredAccounts = [];
      filteredCards = cards.filter(c => c.type === "debit");
    }

    // Render Cards Grid (Fintech physical-style cards)
    let cardsHtml = "";
    if (filteredCards.length > 0) {
      cardsHtml = `
        <div class="col-12 mb-3">
          <div class="d-flex justify-content-between align-items-center">
            <h5 class="fw-bold mb-0">পেমেন্ট কার্ডসমূহ (${filteredCards.length})</h5>
            <button class="btn btn-sm btn-outline-primary" data-bs-toggle="modal" data-bs-target="#modal-card">
              <i class="bi bi-plus-lg"></i> কার্ড যোগ করুন
            </button>
          </div>
        </div>
      `;

      filteredCards.forEach(c => {
        const isCredit = c.type === "credit";
        cardsHtml += `
          <div class="col-12 col-md-6 col-xl-4 mb-4">
            <div class="fintech-card life-card-3d p-4 rounded-4 text-white shadow-lg position-relative overflow-hidden" style="background: ${c.gradient || "linear-gradient(135deg, #1E1E2F 0%, #2D3748 100%)"}; min-height: 220px;">
              <div class="d-flex justify-content-between align-items-start mb-4">
                <div>
                  <span class="badge bg-white bg-opacity-20 text-white text-uppercase tracking-wider small mb-1">${isCredit ? "ক্রেডিট" : "ডেবিট"} কার্ড</span>
                  <div class="fw-bold fs-16">${LifeUtils.escapeHtml(c.name)}</div>
                </div>
                <div class="fs-4 text-white opacity-75">
                  <i class="bi ${c.brand === "visa" ? "bi-credit-card-2-front" : "bi-credit-card"}"></i>
                </div>
              </div>

              <div class="chip-graphic mb-3">
                <div class="card-chip"></div>
              </div>

              <div class="card-number font-monospace fs-18 letter-spacing-2 mb-3">${c.number}</div>

              <div class="d-flex justify-content-between align-items-end mt-auto">
                <div>
                  <div class="text-uppercase text-white text-opacity-50 fs-10">কার্ডহোল্ডার</div>
                  <div class="fw-semibold fs-13 text-truncate" style="max-width: 140px;">${LifeUtils.escapeHtml(c.cardHolder || "মেহেদী হাসান")}</div>
                </div>
                <div>
                  <div class="text-uppercase text-white text-opacity-50 fs-10">মেয়াদ</div>
                  <div class="fw-semibold fs-13">${c.expiry}</div>
                </div>
                <div class="text-end">
                  <div class="text-uppercase text-white text-opacity-50 fs-10">${isCredit ? "বকেয়া" : "সংযুক্ত ব্যাংক"}</div>
                  <div class="fw-bold fs-14">${isCredit ? LifeUtils.formatCurrency(c.outstanding) : "প্রাইম ব্যাংক"}</div>
                </div>
              </div>
            </div>

            <!-- Card Actions -->
            <div class="d-flex justify-content-between align-items-center mt-2 px-1">
              <span class="small text-muted">${isCredit ? `সীমা: ${LifeUtils.formatCurrency(c.limit)} (উপলব্ধ: ${LifeUtils.formatCurrency(c.availableCredit)})` : "সরাসরি ব্যাংক কার্ড"}</span>
              <div class="btn-group btn-group-sm">
                <button class="btn btn-link text-danger p-0 ms-2 btn-delete-card" data-id="${c.id}" title="কার্ড সরিয়ে নিন"><i class="bi bi-trash"></i></button>
              </div>
            </div>
          </div>
        `;
      });
    }

    // Render Bank Accounts & Wallets Grid
    let accountsHtml = "";
    if (filteredAccounts.length > 0) {
      accountsHtml = `
        <div class="col-12 mt-2 mb-3">
          <div class="d-flex justify-content-between align-items-center">
            <h5 class="fw-bold mb-0">ব্যাংক অ্যাকাউন্ট ও ওয়ালেট (${filteredAccounts.length})</h5>
            <button class="btn btn-sm btn-outline-primary" data-bs-toggle="modal" data-bs-target="#modal-account">
              <i class="bi bi-plus-lg"></i> নতুন অ্যাকাউন্ট যোগ করুন
            </button>
          </div>
        </div>
      `;

      filteredAccounts.forEach(a => {
        accountsHtml += `
          <div class="col-12 col-md-6 col-xl-4 mb-4">
            <div class="card h-100 border shadow-sm rounded-4 overflow-hidden">
              <div class="card-body p-4">
                <div class="d-flex justify-content-between align-items-start mb-3">
                  <div class="d-flex align-items-center gap-3">
                    <div class="rounded-3 p-3 text-white" style="background-color: ${a.color || "#635BFF"}">
                      <i class="bi ${a.icon || "bi-bank"} fs-4"></i>
                    </div>
                    <div>
                      <h6 class="fw-bold mb-0">${LifeUtils.escapeHtml(a.name)}</h6>
                      <div class="text-muted small">${LifeUtils.escapeHtml(a.institution)} • ${a.number}</div>
                    </div>
                  </div>
                  ${a.isPreferred ? `<span class="badge bg-success-subtle text-success border">প্রধান অ্যাকাউন্ট</span>` : ""}
                </div>

                <div class="my-3">
                  <div class="text-muted small">বর্তমান ব্যালেন্স</div>
                  <div class="fs-3 fw-bold text-dark">${LifeUtils.formatCurrency(a.balance)}</div>
                </div>

                <div class="d-flex gap-2 mt-4 pt-2 border-top">
                  <button class="btn btn-sm btn-light border flex-grow-1 btn-quick-transfer" data-id="${a.id}">
                    <i class="bi bi-arrow-left-right text-primary me-1"></i> স্থানান্তর
                  </button>
                  <button class="btn btn-sm btn-light border flex-grow-1 btn-account-add-income" data-id="${a.id}">
                    <i class="bi bi-plus-circle text-success me-1"></i> আয়
                  </button>
                  <button class="btn btn-sm btn-light border flex-grow-1 btn-account-add-expense" data-id="${a.id}">
                    <i class="bi bi-dash-circle text-danger me-1"></i> ব্যয়
                  </button>
                </div>
              </div>
              <div class="card-footer bg-transparent border-top px-4 py-2 d-flex justify-content-between align-items-center">
                <span class="small text-muted">${a.branch || "ঢাকা"}</span>
                <div class="d-flex gap-2">
                  <button class="btn btn-sm btn-link text-secondary p-0 btn-toggle-preferred" data-id="${a.id}" title="${a.isPreferred ? "প্রধান অ্যাকাউন্ট" : "প্রধান হিসেবে চিহ্নিত করুন"}">
                    <i class="bi ${a.isPreferred ? "bi-star-fill text-warning" : "bi-star"}"></i>
                  </button>
                  <button class="btn btn-sm btn-link text-danger p-0 btn-delete-account" data-id="${a.id}" title="অ্যাকাউন্ট মুছুন">
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        `;
      });
    }

    $("#accounts-grid-container").html(cardsHtml + accountsHtml);

    // Re-bind 3D tilt
    if (window.LifeThreeScene) {
      window.LifeThreeScene.bind3DCardTilt(".life-card-3d");
    }
  }

  function renderRecentActivity() {
    const transactions = LifeStorage.get("transactions") || [];
    const recent = transactions.slice(0, 8);

    const html = recent.map(t => {
      const isExp = t.type === "expense";
      const isInc = t.type === "income";
      const sign = isExp ? "-" : isInc ? "+" : "";
      const color = isExp ? "text-danger" : isInc ? "text-success" : "text-primary";

      return `
        <div class="d-flex justify-content-between align-items-center p-3 border-bottom">
          <div class="d-flex align-items-center gap-3">
            <i class="bi ${isExp ? "bi-arrow-up-right text-danger" : isInc ? "bi-arrow-down-left text-success" : "bi-arrow-left-right text-primary"} fs-5"></i>
            <div>
              <div class="fw-semibold fs-14">${LifeUtils.escapeHtml(t.description)}</div>
              <div class="text-muted small">${LifeUtils.formatDate(t.date, "DD MMM")} • ${LifeUtils.escapeHtml(t.category)}</div>
            </div>
          </div>
          <span class="fw-bold ${color}">${sign}${LifeUtils.formatCurrency(t.amount)}</span>
        </div>
      `;
    }).join("");

    $("#accounts-recent-activity").html(html);
  }

  function openTransferModal(defaultSourceId = null) {
    const accounts = LifeStorage.get("accounts") || [];
    let opts = "";
    accounts.forEach(a => {
      opts += `<option value="${a.id}">${a.name} (${LifeUtils.formatCurrency(a.balance)})</option>`;
    });

    $("#transfer-from-account").html(opts);
    $("#transfer-to-account").html(opts);

    if (defaultSourceId) {
      $("#transfer-from-account").val(defaultSourceId);
      // Select another destination
      const other = accounts.find(a => a.id !== defaultSourceId);
      if (other) $("#transfer-to-account").val(other.id);
    }

    $("#transfer-amount").val("");
    $("#transfer-notes").val("");

    const modal = new bootstrap.Modal(document.getElementById("modal-transfer"));
    modal.show();
  }

  function saveTransferForm() {
    const src = $("#transfer-from-account").val();
    const dest = $("#transfer-to-account").val();
    const amount = Number($("#transfer-amount").val());
    const notes = $("#transfer-notes").val().trim();

    if (src === dest) {
      window.Swal.fire({ icon: "warning", title: "ভুল গন্তব্য", text: "উৎস এবং গন্তব্য অ্যাকাউন্ট ভিন্ন হতে হবে।" });
      return;
    }

    if (!amount || amount <= 0) {
      window.Swal.fire({ icon: "warning", title: "সঠিক পরিমাণ দিন", text: "অনুগ্রহ করে স্থানান্তরের সঠিক পরিমাণ লিখুন।" });
      return;
    }

    const accounts = LifeStorage.get("accounts") || [];
    const srcAcc = accounts.find(a => a.id === src);
    if (srcAcc && srcAcc.balance < amount) {
      window.Swal.fire({ icon: "warning", title: "অপর্যাপ্ত ব্যালেন্স", text: `আপনার ${srcAcc.name}-এ পর্যাপ্ত ব্যালেন্স নেই (বর্তমান: ${LifeUtils.formatCurrency(srcAcc.balance)})।` });
      return;
    }

    const tx = {
      id: LifeUtils.generateId("tx"),
      date: LifeUtils.CURRENT_DEMO_DATE,
      type: "transfer",
      description: `স্থানান্তর: ${srcAcc.name} থেকে ${(accounts.find(a => a.id === dest) || {}).name}`,
      amount: amount,
      category: "স্থানান্তর",
      accountId: src,
      destinationAccountId: dest,
      method: "ডিজিটাল ব্যাংকিং",
      merchant: "নিজস্ব তহবিল স্থানান্তর",
      tags: ["স্থানান্তর"],
      notes: notes || "অভ্যন্তরীণ ব্যালেন্স স্থানান্তর"
    };

    LifeStorage.addTransaction(tx);
    bootstrap.Modal.getInstance(document.getElementById("modal-transfer")).hide();

    window.Swal.fire({
      icon: "success",
      title: "স্থানান্তর সম্পন্ন",
      text: `সফলভাবে ${LifeUtils.formatCurrency(amount)} স্থানান্তর করা হয়েছে।`,
      timer: 1800,
      showConfirmButton: false,
      toast: true,
      position: "top-end"
    });
  }

  function saveAccountForm() {
    const name = $("#acc-form-name").val().trim();
    const institution = $("#acc-form-institution").val().trim();
    const type = $("#acc-form-type").val();
    const number = $("#acc-form-number").val().trim() || "•••• 0000";
    const balance = Number($("#acc-form-balance").val()) || 0;
    const color = $("#acc-form-color").val() || "#635BFF";

    if (!name || !institution) {
      window.Swal.fire({ icon: "warning", title: "যাচাইকরণ ত্রুটি", text: "অনুগ্রহ করে অ্যাকাউন্টের নাম ও ব্যাংকের নাম দিন।" });
      return;
    }

    LifeStorage.addAccount({
      name,
      institution,
      type,
      number,
      balance,
      currency: "BDT",
      color,
      icon: type === "bank" ? "bi-bank" : type === "wallet" ? "bi-wallet2" : "bi-cash",
      isPreferred: false,
      status: "active",
      branch: "ঢাকা"
    });

    bootstrap.Modal.getInstance(document.getElementById("modal-account")).hide();
    window.Swal.fire({ icon: "success", title: "অ্যাকাউন্ট যুক্ত হয়েছে!", timer: 1500, showConfirmButton: false, toast: true });
  }

  function saveCardForm() {
    const name = $("#card-form-name").val().trim();
    const brand = $("#card-form-brand").val();
    const type = $("#card-form-type").val();
    const number = $("#card-form-number").val().trim() || "•••• •••• •••• 1234";
    const cardHolder = $("#card-form-holder").val().trim() || "মেহেদী হাসান";
    const expiry = $("#card-form-expiry").val().trim() || "12/28";
    const limit = Number($("#card-form-limit").val()) || 100000;
    const gradient = $("#card-form-gradient").val();

    if (!name) {
      window.Swal.fire({ icon: "warning", title: "যাচাইকরণ ত্রুটি", text: "অনুগ্রহ করে কার্ডের নাম দিন।" });
      return;
    }

    LifeStorage.addCard({
      name,
      brand,
      type,
      number,
      cardHolder,
      expiry,
      limit,
      outstanding: 0,
      availableCredit: limit,
      dueDate: "2026-11-20",
      gradient: gradient || "linear-gradient(135deg, #1E1E2F 0%, #2D3748 100%)",
      status: "active"
    });

    bootstrap.Modal.getInstance(document.getElementById("modal-card")).hide();
    window.Swal.fire({ icon: "success", title: "কার্ড যুক্ত হয়েছে!", timer: 1500, showConfirmButton: false, toast: true });
  }

  return {
    init,
    render,
    openTransferModal
  };
})();

if (typeof window !== "undefined") {
  window.LifeAccounts = LifeAccounts;
}
