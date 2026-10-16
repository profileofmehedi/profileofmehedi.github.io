/**
 * LifeOS — Accounts, DPS, Loans & Cards Management Module
 * Comprehensive fintech management: Bank Accounts, Wallets, DPS schemes, Personal/Home Loans, and Credit Cards.
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

    // Dynamic field toggle when changing account type in #modal-account
    $(document).on("change", "#acc-form-type", function () {
      const type = $(this).val();
      if (type === "dps") {
        $("#acc-dps-fields").removeClass("d-none");
        $("#acc-loan-fields").addClass("d-none");
        $("#acc-label-name").text("ডিপিএস স্কিমের নাম");
        $("#acc-form-name").attr("placeholder", "যেমন: ইসলামী ব্যাংক মাসিক ডিপিএস");
        $("#acc-label-institution").text("ব্যাংক / আর্থিক প্রতিষ্ঠান");
        $("#acc-label-balance").text("বর্তমান সঞ্চিত মোট ব্যালেন্স (টাকা)");
        $("#acc-form-color").val("#0D9488");
      } else if (type === "loan") {
        $("#acc-dps-fields").addClass("d-none");
        $("#acc-loan-fields").removeClass("d-none");
        $("#acc-label-name").text("ঋণের শিরোনাম / বিবরণ");
        $("#acc-form-name").attr("placeholder", "যেমন: আইডিএলসি পার্সোনাল লোন");
        $("#acc-label-institution").text("ব্যাংক বা ঋণদাতা প্রতিষ্ঠান");
        $("#acc-label-balance").text("বর্তমান অবশিষ্ট বকেয়া মূল ঋণ (টাকা)");
        $("#acc-form-color").val("#E11D48");
      } else {
        $("#acc-dps-fields").addClass("d-none");
        $("#acc-loan-fields").addClass("d-none");
        $("#acc-label-name").text("অ্যাকাউন্টের নাম");
        $("#acc-form-name").attr("placeholder", "যেমন: সিটি ব্যাংক সেভিংস");
        $("#acc-label-institution").text("আর্থিক প্রতিষ্ঠান / প্রোভাইডার");
        $("#acc-label-balance").text("প্রাথমিক ব্যালেন্স (টাকা)");
        if (type === "wallet") $("#acc-form-color").val("#E5484D");
        else if (type === "cash") $("#acc-form-color").val("#64748B");
        else $("#acc-form-color").val("#635BFF");
      }
    });

    // Preferred toggle
    $(document).on("click", ".btn-toggle-preferred", function () {
      const accId = $(this).data("id");
      const accounts = LifeStorage.get("accounts") || [];
      accounts.forEach(a => {
        a.isPreferred = (a.id === accId || a.id == accId);
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

    // Pay DPS button
    $(document).on("click", ".btn-pay-dps", function () {
      const accId = $(this).data("id");
      openPayDpsModal(accId);
    });

    // Pay Loan button
    $(document).on("click", ".btn-pay-loan", function () {
      const accId = $(this).data("id");
      openPayLoanModal(accId);
    });

    // Pay Card Bill button
    $(document).on("click", ".btn-pay-card", function () {
      const cardId = $(this).data("id");
      openPayCardModal(cardId);
    });

    // Card quick buttons for full / 50%
    $(document).on("click", "#btn-pay-card-full", function () {
      const cardId = $("#pay-card-id").val();
      const cards = LifeStorage.get("cards") || [];
      const card = cards.find(c => c.id === cardId || c.id == cardId);
      if (card) {
        const out = Number(card.outstanding != null ? card.outstanding : card.currentBalance) || 0;
        $("#pay-card-amount").val(out);
      }
    });

    $(document).on("click", "#btn-pay-card-half", function () {
      const cardId = $("#pay-card-id").val();
      const cards = LifeStorage.get("cards") || [];
      const card = cards.find(c => c.id === cardId || c.id == cardId);
      if (card) {
        const out = Number(card.outstanding != null ? card.outstanding : card.currentBalance) || 0;
        $("#pay-card-amount").val(Math.round(out / 2));
      }
    });

    // Direct Income / Expense quick triggers from account card
    $(document).on("click", ".btn-account-add-income", function () {
      const accId = $(this).data("id");
      if (window.LifeTransactions) {
        window.LifeTransactions.openAddModal("income");
        setTimeout(() => $("#tx-form-account").val(accId), 100);
      }
    });

    $(document).on("click", ".btn-account-add-expense", function () {
      const accId = $(this).data("id");
      if (window.LifeTransactions) {
        window.LifeTransactions.openAddModal("expense");
        setTimeout(() => $("#tx-form-account").val(accId), 100);
      }
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

    // Save DPS Payment form
    $(document).on("submit", "#form-pay-dps", function (e) {
      e.preventDefault();
      saveDpsPayment();
    });

    // Save Loan Payment form
    $(document).on("submit", "#form-pay-loan", function (e) {
      e.preventDefault();
      saveLoanPayment();
    });

    // Save Card Payment form
    $(document).on("submit", "#form-pay-card", function (e) {
      e.preventDefault();
      saveCardPayment();
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
    $("#acc-stat-assets").text(LifeUtils.formatCurrency(stats.liquidAssets));
    $("#acc-stat-dps").text(LifeUtils.formatCurrency(stats.dpsAssets));
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
    } else if (activeTab === "dps") {
      filteredAccounts = accounts.filter(a => a.type === "dps");
      filteredCards = [];
    } else if (activeTab === "loan") {
      filteredAccounts = accounts.filter(a => a.type === "loan");
      filteredCards = [];
    } else if (activeTab === "credit") {
      filteredAccounts = [];
      filteredCards = cards.filter(c => (c.type === "credit" || c.cardType === "credit"));
    } else if (activeTab === "debit") {
      filteredAccounts = [];
      filteredCards = cards.filter(c => (c.type === "debit" || c.cardType === "debit"));
    }

    // 1. Render Cards Grid (Fintech 3D Cards)
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
        const isCredit = (c.type === "credit" || c.cardType === "credit");
        const limit = Number(c.limit != null ? c.limit : c.creditLimit) || 0;
        const outstanding = Number(c.outstanding != null ? c.outstanding : c.currentBalance) || 0;
        const available = Math.max(0, limit - outstanding);
        const utilPercent = limit > 0 ? Math.min(100, Math.round((outstanding / limit) * 100)) : 0;
        const utilColor = utilPercent > 70 ? "bg-danger" : utilPercent > 40 ? "bg-warning" : "bg-success";

        cardsHtml += `
          <div class="col-12 col-md-6 col-xl-4 mb-4">
            <div class="fintech-card life-card-3d p-4 rounded-4 text-white shadow-lg position-relative overflow-hidden" style="background: ${c.gradient || "linear-gradient(135deg, #1E1E2F 0%, #2D3748 100%)"}; min-height: 220px;">
              <div class="d-flex justify-content-between align-items-start mb-4">
                <div>
                  <span class="badge bg-white bg-opacity-20 text-white text-uppercase tracking-wider small mb-1">${isCredit ? "ক্রেডিট" : "ডেবিট"} কার্ড</span>
                  <div class="fw-bold fs-16">${LifeUtils.escapeHtml(c.name)}</div>
                  <div class="fs-12 text-white text-opacity-75">${LifeUtils.escapeHtml(c.institution || "সিটি ব্যাংক")}</div>
                </div>
                <div class="fs-4 text-white opacity-75">
                  <i class="bi ${c.brand === "visa" ? "bi-credit-card-2-front" : "bi-credit-card"}"></i>
                </div>
              </div>

              <div class="chip-graphic mb-3">
                <div class="card-chip"></div>
              </div>

              <div class="card-number font-monospace fs-18 letter-spacing-2 mb-3">${c.number || `•••• •••• •••• ${c.cardNumberLast4 || "3004"}`}</div>

              <div class="d-flex justify-content-between align-items-end mt-auto">
                <div>
                  <div class="text-uppercase text-white text-opacity-50 fs-10">কার্ডহোল্ডার</div>
                  <div class="fw-semibold fs-13 text-truncate" style="max-width: 140px;">${LifeUtils.escapeHtml(c.cardHolder || c.cardholderName || "মেহেদী হাসান")}</div>
                </div>
                <div>
                  <div class="text-uppercase text-white text-opacity-50 fs-10">মেয়াদ</div>
                  <div class="fw-semibold fs-13">${c.expiry || c.expiryDate || "12/28"}</div>
                </div>
                <div class="text-end">
                  <div class="text-uppercase text-white text-opacity-50 fs-10">${isCredit ? "বর্তমান বকেয়া" : "সংযুক্ত অ্যাকাউন্ট"}</div>
                  <div class="fw-bold fs-14">${isCredit ? LifeUtils.formatCurrency(outstanding) : (c.linkedAccountName || "প্রাইম ব্যাংক")}</div>
                </div>
              </div>
            </div>

            <!-- Card Actions & Utilization Bar -->
            <div class="card border rounded-3 mt-2 p-3 shadow-sm bg-white">
              ${isCredit ? `
                <div class="d-flex justify-content-between align-items-center mb-1">
                  <span class="small text-muted">ক্রেডিট লিমিট: ${LifeUtils.formatCurrency(limit)}</span>
                  <span class="badge bg-light text-dark border">ব্যবহৃত: ${utilPercent}%</span>
                </div>
                <div class="progress mb-2" style="height: 6px;">
                  <div class="progress-bar ${utilColor}" role="progressbar" style="width: ${utilPercent}%;"></div>
                </div>
                <div class="d-flex justify-content-between align-items-center mb-3">
                  <span class="small text-success fw-semibold">উপলব্ধ ক্রেডিট: ${LifeUtils.formatCurrency(available)}</span>
                  <span class="small text-muted">বিলিং সাইকেল: প্রতি মাসের ${c.billingCycleDay || 15} তারিখ</span>
                </div>
                <div class="d-flex gap-2">
                  <button class="btn btn-sm btn-primary flex-grow-1 btn-pay-card" data-id="${c.id}">
                    <i class="bi bi-credit-card-2-front me-1"></i> কার্ড বিল পরিশোধ করুন
                  </button>
                  <button class="btn btn-sm btn-outline-danger btn-delete-card" data-id="${c.id}" title="কার্ড সরিয়ে নিন">
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              ` : `
                <div class="d-flex justify-content-between align-items-center">
                  <span class="small text-muted"><i class="bi bi-shield-check text-success me-1"></i>ডেবিট কার্ড সরাসরি ব্যাংক ব্যালেন্সের সাথে সংযুক্ত</span>
                  <button class="btn btn-sm btn-link text-danger p-0 btn-delete-card" data-id="${c.id}" title="কার্ড সরিয়ে নিন"><i class="bi bi-trash"></i></button>
                </div>
              `}
            </div>
          </div>
        `;
      });
    }

    // 2. Render Bank Accounts, DPS, Loans & Wallets
    let dpsHtml = "";
    let loanHtml = "";
    let regularAccountsHtml = "";

    const dpsAccounts = filteredAccounts.filter(a => a.type === "dps");
    const loanAccounts = filteredAccounts.filter(a => a.type === "loan");
    const regularAccounts = filteredAccounts.filter(a => a.type !== "dps" && a.type !== "loan");

    // DPS Schemes Grid
    if (dpsAccounts.length > 0) {
      dpsHtml = `
        <div class="col-12 mt-2 mb-3">
          <div class="d-flex justify-content-between align-items-center">
            <h5 class="fw-bold mb-0 text-dark"><i class="bi bi-piggy-bank text-primary me-2"></i>ডিপিএস স্কিম ও সঞ্চয় (${dpsAccounts.length})</h5>
            <button class="btn btn-sm btn-outline-primary" data-bs-toggle="modal" data-bs-target="#modal-account">
              <i class="bi bi-plus-lg"></i> নতুন ডিপিএস যোগ
            </button>
          </div>
        </div>
      `;

      dpsAccounts.forEach(a => {
        const balance = Number(a.balance) || 0;
        const monthly = Number(a.monthlyDeposit) || 10000;
        const maturity = Number(a.maturityAmount) || 680000;
        const tenure = Number(a.tenureMonths) || 60;
        const paidCount = Number(a.paidInstallments) || 0;
        const progressPercent = maturity > 0 ? Math.min(100, Math.round((balance / maturity) * 100)) : 0;
        const tenureProgressPercent = tenure > 0 ? Math.min(100, Math.round((paidCount / tenure) * 100)) : 0;

        dpsHtml += `
          <div class="col-12 col-md-6 col-xl-4 mb-4">
            <div class="card h-100 border shadow-sm rounded-4 overflow-hidden" style="border-top: 4px solid ${a.color || "#0D9488"} !important;">
              <div class="card-body p-4">
                <div class="d-flex justify-content-between align-items-start mb-3">
                  <div class="d-flex align-items-center gap-3">
                    <div class="rounded-3 p-3 text-white shadow-sm" style="background-color: ${a.color || "#0D9488"}">
                      <i class="bi bi-piggy-bank fs-4"></i>
                    </div>
                    <div>
                      <h6 class="fw-bold mb-0 text-dark">${LifeUtils.escapeHtml(a.name)}</h6>
                      <div class="text-muted small">${LifeUtils.escapeHtml(a.institution)} • ${a.number || "ডিপিএস"}</div>
                    </div>
                  </div>
                  <span class="badge bg-teal-subtle text-teal border">ডিপিএস স্কিম</span>
                </div>

                <div class="row g-2 my-3 p-3 bg-light rounded-3">
                  <div class="col-6">
                    <div class="text-muted fs-11">বর্তমানে সঞ্চিত অর্থ</div>
                    <div class="fs-4 fw-bold text-teal">${LifeUtils.formatCurrency(balance)}</div>
                  </div>
                  <div class="col-6">
                    <div class="text-muted fs-11">মেয়াদান্তে প্রদেয় (টার্গেট)</div>
                    <div class="fs-4 fw-bold text-dark">${LifeUtils.formatCurrency(maturity)}</div>
                  </div>
                </div>

                <div class="mb-3">
                  <div class="d-flex justify-content-between text-muted fs-11 mb-1">
                    <span>মেয়াদ অগ্রগতি: <strong>${paidCount}/${tenure} মাস</strong></span>
                    <span>সঞ্চিত: <strong>${progressPercent}%</strong></span>
                  </div>
                  <div class="progress" style="height: 6px;">
                    <div class="progress-bar bg-teal" role="progressbar" style="width: ${tenureProgressPercent}%;"></div>
                  </div>
                </div>

                <div class="p-2 border rounded-3 bg-white mb-3">
                  <div class="d-flex justify-content-between align-items-center text-muted small">
                    <span><i class="bi bi-cash-stack me-1 text-primary"></i>মাসিক কিস্তি: <strong class="text-dark">${LifeUtils.formatCurrency(monthly)}</strong></span>
                    <span><i class="bi bi-calendar-event me-1 text-muted"></i>কিস্তির তারিখ: প্রতি মাসের <strong>${a.installmentDay || 10}</strong> তারিখ</span>
                  </div>
                </div>

                <div class="d-flex gap-2">
                  <button class="btn btn-sm btn-primary flex-grow-1 btn-pay-dps" data-id="${a.id}">
                    <i class="bi bi-plus-circle me-1"></i> কিস্তি জমা দিন
                  </button>
                  <button class="btn btn-sm btn-outline-secondary btn-quick-transfer" data-id="${a.id}" title="অ্যাকাউন্ট স্থানান্তর">
                    <i class="bi bi-arrow-left-right"></i>
                  </button>
                  <button class="btn btn-sm btn-outline-danger btn-delete-account" data-id="${a.id}" title="মুছুন">
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        `;
      });
    }

    // Loans Grid
    if (loanAccounts.length > 0) {
      loanHtml = `
        <div class="col-12 mt-2 mb-3">
          <div class="d-flex justify-content-between align-items-center">
            <h5 class="fw-bold mb-0 text-danger"><i class="bi bi-bank2 me-2"></i>ঋণ ও পার্সোনাল লোন ব্যবস্থাপনা (${loanAccounts.length})</h5>
            <button class="btn btn-sm btn-outline-danger" data-bs-toggle="modal" data-bs-target="#modal-account">
              <i class="bi bi-plus-lg"></i> নতুন লোন যোগ
            </button>
          </div>
        </div>
      `;

      loanAccounts.forEach(a => {
        const remaining = Number(a.remainingPrincipal != null ? a.remainingPrincipal : a.balance) || 0;
        const totalLoan = Number(a.totalLoanAmount) || (remaining > 0 ? remaining * 1.3 : 500000);
        const emi = Number(a.monthlyEmi) || 15500;
        const interest = Number(a.interestRate) || 9.5;
        const tenure = Number(a.loanTenureMonths) || 36;
        const paidEmis = Number(a.paidEmis) || 0;
        const repaidAmount = Math.max(0, totalLoan - remaining);
        const repaidPercent = totalLoan > 0 ? Math.min(100, Math.round((repaidAmount / totalLoan) * 100)) : 0;

        loanHtml += `
          <div class="col-12 col-md-6 col-xl-4 mb-4">
            <div class="card h-100 border shadow-sm rounded-4 overflow-hidden" style="border-top: 4px solid ${a.color || "#E11D48"} !important;">
              <div class="card-body p-4">
                <div class="d-flex justify-content-between align-items-start mb-3">
                  <div class="d-flex align-items-center gap-3">
                    <div class="rounded-3 p-3 text-white shadow-sm" style="background-color: ${a.color || "#E11D48"}">
                      <i class="bi bi-bank2 fs-4"></i>
                    </div>
                    <div>
                      <h6 class="fw-bold mb-0 text-dark">${LifeUtils.escapeHtml(a.name)}</h6>
                      <div class="text-muted small">${LifeUtils.escapeHtml(a.institution)} • ${a.number || "লোন"}</div>
                    </div>
                  </div>
                  <span class="badge bg-danger-subtle text-danger border">${LifeUtils.escapeHtml(a.loanType || "ঋণ / লোন")}</span>
                </div>

                <div class="row g-2 my-3 p-3 bg-light rounded-3">
                  <div class="col-6">
                    <div class="text-muted fs-11">অবশিষ্ট মূল ঋণ / বকেয়া</div>
                    <div class="fs-4 fw-bold text-danger">${LifeUtils.formatCurrency(remaining)}</div>
                  </div>
                  <div class="col-6">
                    <div class="text-muted fs-11">মোট গৃহীত ঋণ</div>
                    <div class="fs-4 fw-bold text-dark">${LifeUtils.formatCurrency(totalLoan)}</div>
                  </div>
                </div>

                <div class="mb-3">
                  <div class="d-flex justify-content-between text-muted fs-11 mb-1">
                    <span>পরিশোধিত ইএমআই: <strong>${paidEmis}/${tenure} মাস</strong></span>
                    <span>পরিশোধের অগ্রগতি: <strong>${repaidPercent}%</strong></span>
                  </div>
                  <div class="progress" style="height: 6px;">
                    <div class="progress-bar bg-success" role="progressbar" style="width: ${repaidPercent}%;"></div>
                  </div>
                </div>

                <div class="p-2 border rounded-3 bg-white mb-3">
                  <div class="d-flex justify-content-between align-items-center text-muted small">
                    <span><i class="bi bi-cash me-1 text-danger"></i>মাসিক EMI: <strong class="text-danger">${LifeUtils.formatCurrency(emi)}</strong></span>
                    <span><i class="bi bi-percent me-1 text-muted"></i>সুদ: <strong>${interest}%</strong> • প্রতি মাসের <strong>${a.emiDueDay || 15}</strong> তারিখ</span>
                  </div>
                </div>

                <div class="d-flex gap-2">
                  <button class="btn btn-sm btn-danger flex-grow-1 btn-pay-loan" data-id="${a.id}">
                    <i class="bi bi-check2-circle me-1"></i> ইএমআই পরিশোধ করুন
                  </button>
                  <button class="btn btn-sm btn-outline-danger btn-delete-account" data-id="${a.id}" title="মুছুন">
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        `;
      });
    }

    // Regular Bank Accounts & Wallets
    if (regularAccounts.length > 0) {
      regularAccountsHtml = `
        <div class="col-12 mt-2 mb-3">
          <div class="d-flex justify-content-between align-items-center">
            <h5 class="fw-bold mb-0">ব্যাংক অ্যাকাউন্ট ও ওয়ালেট (${regularAccounts.length})</h5>
            <button class="btn btn-sm btn-outline-primary" data-bs-toggle="modal" data-bs-target="#modal-account">
              <i class="bi bi-plus-lg"></i> নতুন অ্যাকাউন্ট যোগ করুন
            </button>
          </div>
        </div>
      `;

      regularAccounts.forEach(a => {
        regularAccountsHtml += `
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

    $("#accounts-grid-container").html(cardsHtml + dpsHtml + loanHtml + regularAccountsHtml);

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
    const activeAccs = accounts.filter(a => a.type !== "loan");
    let opts = "";
    activeAccs.forEach(a => {
      opts += `<option value="${a.id}">${a.name} (${LifeUtils.formatCurrency(a.balance)})</option>`;
    });

    $("#transfer-from-account").html(opts);
    $("#transfer-to-account").html(opts);

    if (defaultSourceId) {
      $("#transfer-from-account").val(defaultSourceId);
      const other = activeAccs.find(a => a.id !== defaultSourceId);
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
    const srcAcc = accounts.find(a => a.id === src || a.id == src);
    if (srcAcc && srcAcc.balance < amount) {
      window.Swal.fire({ icon: "warning", title: "অপর্যাপ্ত ব্যালেন্স", text: `আপনার ${srcAcc.name}-এ পর্যাপ্ত ব্যালেন্স নেই (বর্তমান: ${LifeUtils.formatCurrency(srcAcc.balance)})।` });
      return;
    }

    const destAcc = accounts.find(a => a.id === dest || a.id == dest) || {};
    const tx = {
      id: LifeUtils.generateId("tx"),
      date: LifeUtils.CURRENT_DEMO_DATE,
      type: "transfer",
      description: `স্থানান্তর: ${srcAcc.name} থেকে ${destAcc.name || "অন্য অ্যাকাউন্ট"}`,
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

  // Open Pay DPS Modal
  function openPayDpsModal(dpsId) {
    const accounts = LifeStorage.get("accounts") || [];
    const dps = accounts.find(a => a.id === dpsId || a.id == dpsId);
    if (!dps) return;

    $("#pay-dps-account-id").val(dps.id);
    $("#pay-dps-target-name").text(dps.name);
    $("#pay-dps-target-details").text(`${dps.institution} • কিস্তি: ${LifeUtils.formatCurrency(dps.monthlyDeposit || 10000)} • সঞ্চিত: ${LifeUtils.formatCurrency(dps.balance)}`);

    // Source accounts: liquid bank/wallets
    const sourceAccs = accounts.filter(a => (a.type === "bank" || a.type === "wallet" || a.type === "cash") && a.id !== dpsId);
    let opts = "";
    sourceAccs.forEach(a => {
      opts += `<option value="${a.id}">${a.name} (${LifeUtils.formatCurrency(a.balance)})</option>`;
    });
    $("#pay-dps-source-account").html(opts);

    $("#pay-dps-amount").val(dps.monthlyDeposit || 10000);
    $("#pay-dps-date").val(LifeUtils.CURRENT_DEMO_DATE || new Date().toISOString().split("T")[0]);
    $("#pay-dps-notes").val(`${(dps.paidInstallments || 0) + 1}তম মাসিক কিস্তি জমা`);

    const modal = new bootstrap.Modal(document.getElementById("modal-pay-dps"));
    modal.show();
  }

  // Save DPS Payment
  async function saveDpsPayment() {
    const dpsId = $("#pay-dps-account-id").val();
    const srcId = $("#pay-dps-source-account").val();
    const amount = Number($("#pay-dps-amount").val());
    const date = $("#pay-dps-date").val();
    const notes = $("#pay-dps-notes").val().trim();

    if (!amount || amount <= 0) {
      window.Swal.fire({ icon: "warning", title: "সঠিক পরিমাণ দিন", text: "কিস্তির সঠিক পরিমাণ লিখুন।" });
      return;
    }

    const accounts = LifeStorage.get("accounts") || [];
    const srcAcc = accounts.find(a => a.id === srcId || a.id == srcId);
    const dpsAcc = accounts.find(a => a.id === dpsId || a.id == dpsId);

    if (srcAcc && srcAcc.balance < amount) {
      window.Swal.fire({ icon: "warning", title: "অপর্যাপ্ত ব্যালেন্স", text: `${srcAcc.name}-এ পর্যাপ্ত ব্যালেন্স নেই (বর্তমান: ${LifeUtils.formatCurrency(srcAcc.balance)})।` });
      return;
    }

    // Call backend API if available
    if (window.LifeApiClient && !isNaN(parseInt(dpsId))) {
      await LifeApiClient.payDpsInstallment(parseInt(dpsId), {
        sourceAccountId: parseInt(srcId),
        amount,
        date: date ? new Date(date).toISOString() : new Date().toISOString(),
        notes
      });
    }

    // Add transaction to state & double-entry impact
    const tx = {
      id: LifeUtils.generateId("tx"),
      date: date || LifeUtils.CURRENT_DEMO_DATE,
      type: "transfer",
      description: `ডিপিএস কিস্তি জমা: ${srcAcc.name} থেকে ${dpsAcc.name}`,
      amount: amount,
      category: "ডিপিএস সঞ্চয়",
      accountId: srcId,
      destinationAccountId: dpsId,
      method: "ব্যাংক ট্রান্সফার",
      merchant: dpsAcc.institution,
      notes: notes || "ডিপিএস কিস্তি পরিশোধ"
    };

    LifeStorage.addTransaction(tx);
    bootstrap.Modal.getInstance(document.getElementById("modal-pay-dps")).hide();

    window.Swal.fire({
      icon: "success",
      title: "কিস্তি জমা সম্পন্ন!",
      text: `${dpsAcc.name}-এ ${LifeUtils.formatCurrency(amount)} সফলভাবে জমা হয়েছে।`,
      timer: 2000,
      showConfirmButton: false,
      toast: true,
      position: "top-end"
    });
  }

  // Open Pay Loan Modal
  function openPayLoanModal(loanId) {
    const accounts = LifeStorage.get("accounts") || [];
    const loan = accounts.find(a => a.id === loanId || a.id == loanId);
    if (!loan) return;

    const remaining = loan.remainingPrincipal != null ? loan.remainingPrincipal : loan.balance;
    $("#pay-loan-account-id").val(loan.id);
    $("#pay-loan-target-name").text(loan.name);
    $("#pay-loan-target-details").text(`অবশিষ্ট বকেয়া: ${LifeUtils.formatCurrency(remaining)} • মাসিক EMI: ${LifeUtils.formatCurrency(loan.monthlyEmi || 15500)}`);

    const sourceAccs = accounts.filter(a => (a.type === "bank" || a.type === "wallet" || a.type === "cash") && a.id !== loanId);
    let opts = "";
    sourceAccs.forEach(a => {
      opts += `<option value="${a.id}">${a.name} (${LifeUtils.formatCurrency(a.balance)})</option>`;
    });
    $("#pay-loan-source-account").html(opts);

    $("#pay-loan-amount").val(loan.monthlyEmi || 15500);
    $("#pay-loan-date").val(LifeUtils.CURRENT_DEMO_DATE || new Date().toISOString().split("T")[0]);
    $("#pay-loan-notes").val(`${(loan.paidEmis || 0) + 1}তম মাসিক ইএমআই পরিশোধ`);

    const modal = new bootstrap.Modal(document.getElementById("modal-pay-loan"));
    modal.show();
  }

  // Save Loan Payment
  async function saveLoanPayment() {
    const loanId = $("#pay-loan-account-id").val();
    const srcId = $("#pay-loan-source-account").val();
    const amount = Number($("#pay-loan-amount").val());
    const date = $("#pay-loan-date").val();
    const notes = $("#pay-loan-notes").val().trim();

    if (!amount || amount <= 0) {
      window.Swal.fire({ icon: "warning", title: "সঠিক পরিমাণ দিন", text: "ইএমআই পরিশোধের সঠিক পরিমাণ লিখুন।" });
      return;
    }

    const accounts = LifeStorage.get("accounts") || [];
    const srcAcc = accounts.find(a => a.id === srcId || a.id == srcId);
    const loanAcc = accounts.find(a => a.id === loanId || a.id == loanId);

    if (srcAcc && srcAcc.balance < amount) {
      window.Swal.fire({ icon: "warning", title: "অপর্যাপ্ত ব্যালেন্স", text: `${srcAcc.name}-এ পর্যাপ্ত ব্যালেন্স নেই (বর্তমান: ${LifeUtils.formatCurrency(srcAcc.balance)})।` });
      return;
    }

    // Call backend API if available
    if (window.LifeApiClient && !isNaN(parseInt(loanId))) {
      await LifeApiClient.payLoanEmi(parseInt(loanId), {
        sourceAccountId: parseInt(srcId),
        amount,
        date: date ? new Date(date).toISOString() : new Date().toISOString(),
        notes
      });
    }

    // Add transaction to state & double-entry impact
    const tx = {
      id: LifeUtils.generateId("tx"),
      date: date || LifeUtils.CURRENT_DEMO_DATE,
      type: "transfer",
      description: `লোন ইএমআই পরিশোধ: ${loanAcc.name} (${srcAcc.name} হতে)`,
      amount: amount,
      category: "ঋণ / লোন পরিশোধ",
      accountId: srcId,
      destinationAccountId: loanId,
      method: "ব্যাংক ট্রান্সফার",
      merchant: loanAcc.institution,
      notes: notes || "লোন ইএমআই পরিশোধ"
    };

    LifeStorage.addTransaction(tx);
    bootstrap.Modal.getInstance(document.getElementById("modal-pay-loan")).hide();

    window.Swal.fire({
      icon: "success",
      title: "ইএমআই পরিশোধ সম্পন্ন!",
      text: `${loanAcc.name}-এর জন্য ${LifeUtils.formatCurrency(amount)} সফলভাবে পরিশোধ হয়েছে।`,
      timer: 2000,
      showConfirmButton: false,
      toast: true,
      position: "top-end"
    });
  }

  // Open Pay Card Modal
  function openPayCardModal(cardId) {
    const cards = LifeStorage.get("cards") || [];
    const card = cards.find(c => c.id === cardId || c.id == cardId);
    if (!card) return;

    const outstanding = Number(card.outstanding != null ? card.outstanding : card.currentBalance) || 0;
    $("#pay-card-id").val(card.id);
    $("#pay-card-target-name").text(card.name);
    $("#pay-card-target-details").text(`বর্তমান মোট বকেয়া: ${LifeUtils.formatCurrency(outstanding)} • ক্রেডিট লিমিট: ${LifeUtils.formatCurrency(card.limit || card.creditLimit || 0)}`);

    const accounts = LifeStorage.get("accounts") || [];
    const sourceAccs = accounts.filter(a => a.type === "bank" || a.type === "wallet");
    let opts = "";
    sourceAccs.forEach(a => {
      opts += `<option value="${a.id}">${a.name} (${LifeUtils.formatCurrency(a.balance)})</option>`;
    });
    $("#pay-card-source-account").html(opts);

    $("#pay-card-amount").val(outstanding);
    $("#pay-card-date").val(LifeUtils.CURRENT_DEMO_DATE || new Date().toISOString().split("T")[0]);
    $("#pay-card-notes").val(`${card.name}-এর বিল পরিশোধ`);

    const modal = new bootstrap.Modal(document.getElementById("modal-pay-card"));
    modal.show();
  }

  // Save Card Payment
  async function saveCardPayment() {
    const cardId = $("#pay-card-id").val();
    const srcId = $("#pay-card-source-account").val();
    const amount = Number($("#pay-card-amount").val());
    const date = $("#pay-card-date").val();
    const notes = $("#pay-card-notes").val().trim();

    if (!amount || amount <= 0) {
      window.Swal.fire({ icon: "warning", title: "সঠিক পরিমাণ দিন", text: "বিল পরিশোধের সঠিক পরিমাণ লিখুন।" });
      return;
    }

    const accounts = LifeStorage.get("accounts") || [];
    const cards = LifeStorage.get("cards") || [];
    const srcAcc = accounts.find(a => a.id === srcId || a.id == srcId);
    const card = cards.find(c => c.id === cardId || c.id == cardId);

    if (srcAcc && srcAcc.balance < amount) {
      window.Swal.fire({ icon: "warning", title: "অপর্যাপ্ত ব্যালেন্স", text: `${srcAcc.name}-এ পর্যাপ্ত ব্যালেন্স নেই (বর্তমান: ${LifeUtils.formatCurrency(srcAcc.balance)})।` });
      return;
    }

    // Call backend API if available
    if (window.LifeApiClient && !isNaN(parseInt(cardId))) {
      await LifeApiClient.payCardBill(parseInt(cardId), {
        sourceAccountId: parseInt(srcId),
        amount,
        date: date ? new Date(date).toISOString() : new Date().toISOString(),
        notes
      });
    }

    // Add transaction to state & double-entry impact
    const tx = {
      id: LifeUtils.generateId("tx"),
      date: date || LifeUtils.CURRENT_DEMO_DATE,
      type: "debt_payment",
      description: `ক্রেডিট কার্ড বিল পরিশোধ: ${card.name} (${srcAcc.name} হতে)`,
      amount: amount,
      category: "ক্রেডিট কার্ড বিল",
      accountId: srcId,
      cardId: cardId,
      destinationAccountId: cardId,
      method: "অনলাইন পেমেন্ট",
      merchant: card.institution || "সিটি ব্যাংক পিএলসি",
      notes: notes || "কার্ড বিল পরিশোধ"
    };

    LifeStorage.addTransaction(tx);
    bootstrap.Modal.getInstance(document.getElementById("modal-pay-card")).hide();

    window.Swal.fire({
      icon: "success",
      title: "কার্ড বিল পরিশোধ সম্পন্ন!",
      text: `${card.name}-এর ${LifeUtils.formatCurrency(amount)} বিল সফলভাবে পরিশোধ হয়েছে।`,
      timer: 2000,
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
    const branch = $("#acc-form-branch").val().trim() || "ঢাকা";

    if (!name || !institution) {
      window.Swal.fire({ icon: "warning", title: "যাচাইকরণ ত্রুটি", text: "অনুগ্রহ করে অ্যাকাউন্টের নাম ও প্রতিষ্ঠানের নাম দিন।" });
      return;
    }

    const newAcc = {
      name,
      institution,
      type,
      number,
      balance,
      currency: "BDT",
      color,
      icon: type === "bank" ? "bi-bank" : type === "wallet" ? "bi-wallet2" : type === "dps" ? "bi-piggy-bank" : type === "loan" ? "bi-bank2" : "bi-cash",
      isPreferred: false,
      status: "active",
      branch
    };

    if (type === "dps") {
      newAcc.monthlyDeposit = Number($("#acc-form-dps-monthly").val()) || 10000;
      newAcc.tenureMonths = Number($("#acc-form-dps-tenure").val()) || 60;
      newAcc.maturityAmount = Number($("#acc-form-dps-maturity").val()) || (newAcc.monthlyDeposit * newAcc.tenureMonths * 1.15);
      newAcc.installmentDay = Number($("#acc-form-dps-day").val()) || 10;
      newAcc.paidInstallments = Number($("#acc-form-dps-paid-count").val()) || 0;
      newAcc.icon = "bi-piggy-bank";
      newAcc.color = color || "#0D9488";
    } else if (type === "loan") {
      newAcc.loanType = $("#acc-form-loan-type").val() || "পার্সোনাল লোন";
      newAcc.totalLoanAmount = Number($("#acc-form-loan-total").val()) || balance;
      newAcc.remainingPrincipal = balance;
      newAcc.monthlyEmi = Number($("#acc-form-loan-emi").val()) || 15000;
      newAcc.interestRate = Number($("#acc-form-loan-interest").val()) || 9.5;
      newAcc.emiDueDay = Number($("#acc-form-loan-day").val()) || 15;
      newAcc.paidEmis = Number($("#acc-form-loan-paid-count").val()) || 0;
      newAcc.icon = "bi-bank2";
      newAcc.color = color || "#E11D48";
    }

    LifeStorage.addAccount(newAcc);

    bootstrap.Modal.getInstance(document.getElementById("modal-account")).hide();
    window.Swal.fire({ icon: "success", title: "হিসাব যুক্ত হয়েছে!", timer: 1500, showConfirmButton: false, toast: true });
  }

  function saveCardForm() {
    const name = $("#card-form-name").val().trim();
    const brand = $("#card-form-brand").val();
    const type = $("#card-form-type").val();
    const number = $("#card-form-number").val().trim() || "•••• •••• •••• 1234";
    const cardHolder = $("#card-form-holder").val() ? $("#card-form-holder").val().trim() : "মেহেদী হাসান";
    const expiry = $("#card-form-expiry").val().trim() || "12/28";
    const limit = Number($("#card-form-limit").val()) || 100000;

    if (!name) {
      window.Swal.fire({ icon: "warning", title: "যাচাইকরণ ত্রুটি", text: "অনুগ্রহ করে কার্ডের নাম দিন।" });
      return;
    }

    LifeStorage.addCard({
      name,
      institution: "সিটি ব্যাংক পিএলসি",
      brand,
      type,
      cardType: type,
      number,
      cardHolder,
      cardholderName: cardHolder,
      expiry,
      expiryDate: expiry,
      limit,
      creditLimit: limit,
      outstanding: 0,
      currentBalance: 0,
      availableCredit: limit,
      billingCycleDay: 15,
      paymentDueDay: 5,
      gradient: "linear-gradient(135deg, #1E1E2F 0%, #2D3748 100%)",
      status: "active"
    });

    bootstrap.Modal.getInstance(document.getElementById("modal-card")).hide();
    window.Swal.fire({ icon: "success", title: "কার্ড যুক্ত হয়েছে!", timer: 1500, showConfirmButton: false, toast: true });
  }

  return {
    init,
    render,
    openTransferModal,
    openPayDpsModal,
    openPayLoanModal,
    openPayCardModal
  };
})();

if (typeof window !== "undefined") {
  window.LifeAccounts = LifeAccounts;
}
