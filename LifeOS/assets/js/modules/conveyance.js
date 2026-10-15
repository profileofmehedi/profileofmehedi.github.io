/**
 * LifeOS — Conveyance & Official Reimbursement Management Module
 * Tracks official meeting trips, transport & lunch expenses, actual vs submitted variance,
 * multi-trip batch claim submissions, and company disbursement settlement with account integration.
 */

const LifeConveyance = (() => {
  let activeTab = "trips"; // 'trips' | 'claims' | 'analytics'
  let filterStatus = "all"; // 'all' | 'unsubmitted' | 'submitted' | 'settled'

  function init() {
    // Tab switching
    $(document).on("click", ".conveyance-tab-btn", function (e) {
      e.preventDefault();
      $(".conveyance-tab-btn").removeClass("active");
      $(this).addClass("active");
      activeTab = $(this).data("tab");
      render();
    });

    // Filter status
    $(document).on("click", ".conveyance-filter-btn", function (e) {
      e.preventDefault();
      $(".conveyance-filter-btn").removeClass("active");
      $(this).addClass("active");
      filterStatus = $(this).data("status");
      render();
    });

    // Auto-calculate Total Actual Cost and Pocket Gap in Trip Modal
    $(document).on("input", "#trip-form-transport, #trip-form-lunch, #trip-form-claimed", function () {
      updateModalCalculations();
    });

    // Delete trip
    $(document).on("click", ".btn-delete-conveyance-trip", function () {
      const tripId = $(this).data("id");
      window.Swal.fire({
        title: "Delete Conveyance Record?",
        text: "Remove this trip and official expense entry?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#EF4444",
        confirmButtonText: "Yes, delete"
      }).then(res => {
        if (res.isConfirmed) {
          LifeStorage.deleteConveyanceTrip(tripId);
          window.Swal.fire({ icon: "success", title: "Trip Deleted", timer: 1500, showConfirmButton: false, toast: true });
        }
      });
    });

    // Open Settle / Disburse Claim Modal
    $(document).on("click", ".btn-settle-claim", function () {
      const claimId = $(this).data("id");
      openSettleModal(claimId);
    });

    // Auto-calculate Deduction in Settle Modal
    $(document).on("input", "#settle-disbursed-amount", function () {
      const claimed = Number($("#settle-claimed-amount").val()) || 0;
      const disbursed = Number($(this).val()) || 0;
      const deduction = Math.max(0, claimed - disbursed);
      $("#settle-deduction-amount").val(deduction);
      $("#settle-deduction-badge").text(`Company Deduction: ${LifeUtils.formatCurrency(deduction)}`);
      $("#settle-deduction-badge").toggleClass("text-danger", deduction > 0).toggleClass("text-success", deduction === 0);
    });

    // Submit Trip Form
    $(document).on("submit", "#form-conveyance-trip", function (e) {
      e.preventDefault();
      saveTripForm();
    });

    // Submit Claim Batch Form
    $(document).on("submit", "#form-conveyance-claim", function (e) {
      e.preventDefault();
      saveClaimBatchForm();
    });

    // Submit Settlement Form
    $(document).on("submit", "#form-conveyance-settle", function (e) {
      e.preventDefault();
      saveSettlementForm();
    });

    // Recalculate batch modal total when trip checkboxes toggle
    $(document).on("change", ".batch-trip-checkbox", function () {
      updateBatchModalSummary();
    });

    LifeStorage.on("change", (e) => {
      if (window.LifeApp && window.LifeApp.getCurrentPage() === "conveyance") {
        render();
      }
    });
  }

  function updateModalCalculations() {
    const transport = Number($("#trip-form-transport").val()) || 0;
    const lunch = Number($("#trip-form-lunch").val()) || 0;
    const actual = transport + lunch;
    $("#trip-form-actual").val(actual);

    const claimed = Number($("#trip-form-claimed").val()) || 0;
    const gap = Math.max(0, actual - claimed);
    $("#trip-pocket-gap-preview").text(LifeUtils.formatCurrency(gap));
    $("#trip-pocket-gap-preview").parent().toggleClass("text-danger", gap > 0).toggleClass("text-success", gap === 0);
  }

  function render() {
    renderSummaryMetrics();

    if (activeTab === "trips") {
      $("#conveyance-trips-view").removeClass("d-none");
      $("#conveyance-claims-view").addClass("d-none");
      $("#conveyance-analytics-view").addClass("d-none");
      renderTripsView();
    } else if (activeTab === "claims") {
      $("#conveyance-trips-view").addClass("d-none");
      $("#conveyance-claims-view").removeClass("d-none");
      $("#conveyance-analytics-view").addClass("d-none");
      renderClaimsView();
    } else {
      $("#conveyance-trips-view").addClass("d-none");
      $("#conveyance-claims-view").addClass("d-none");
      $("#conveyance-analytics-view").removeClass("d-none");
      renderAnalyticsView();
    }
  }

  function renderSummaryMetrics() {
    const trips = LifeStorage.get("conveyanceTrips") || [];
    const claims = LifeStorage.get("conveyanceClaims") || [];
    const m = LifeUtils.calculateConveyanceMetrics(trips, claims);

    $("#conv-stat-actual-spent").text(LifeUtils.formatCurrency(m.totalActualSpent));
    $("#conv-stat-claimed").text(LifeUtils.formatCurrency(m.totalClaimed));
    $("#conv-stat-disbursed").text(LifeUtils.formatCurrency(m.totalDisbursed));
    $("#conv-stat-pocket-loss").text(LifeUtils.formatCurrency(m.overallLoss));
    $("#conv-stat-pending").text(LifeUtils.formatCurrency(m.pendingDisbursement));
  }

  function renderTripsView() {
    const trips = LifeStorage.get("conveyanceTrips") || [];
    let list = [...trips];

    if (filterStatus !== "all") {
      list = list.filter(t => t.status === filterStatus);
    }

    if (list.length === 0) {
      $("#conveyance-trips-table-body").html(`
        <tr>
          <td colspan="8" class="text-center py-5 text-muted">
            <i class="bi bi-briefcase fs-1 d-block mb-2 text-secondary opacity-50"></i>
            <div class="fw-semibold">No conveyance trips under this filter.</div>
            <div class="small">Click "Log Meeting Trip" to record client/office visits.</div>
          </td>
        </tr>
      `);
      return;
    }

    const html = list.map(t => {
      let statusBadge = "";
      if (t.status === "unsubmitted") {
        statusBadge = `<span class="badge bg-secondary-subtle text-secondary-emphasis border">Unsubmitted</span>`;
      } else if (t.status === "submitted") {
        statusBadge = `<span class="badge bg-warning-subtle text-warning-emphasis border">In Claim</span>`;
      } else if (t.status === "settled") {
        statusBadge = `<span class="badge bg-success-subtle text-success-emphasis border">Settled</span>`;
      }

      return `
        <tr>
          <td>
            <div class="fw-semibold fs-14">${LifeUtils.formatDate(t.date, "DD MMM YYYY")}</div>
            <div class="text-muted fs-11">${LifeUtils.formatRelativeDate(t.date)}</div>
          </td>
          <td>
            <div class="fw-bold fs-14 text-dark">${LifeUtils.escapeHtml(t.clientOrPurpose)}</div>
            <div class="text-muted small"><i class="bi bi-geo-alt"></i> ${LifeUtils.escapeHtml(t.location || "Dhaka")}</div>
            <div class="text-muted fs-11">${LifeUtils.escapeHtml(t.route || "")}</div>
          </td>
          <td>
            <div class="badge bg-light text-dark border mb-1">${LifeUtils.escapeHtml(t.transportMode)}</div>
            <div class="small text-muted">Transport: ${LifeUtils.formatCurrency(t.transportCost)}</div>
            ${t.lunchOrSnacksCost > 0 ? `<div class="small text-muted">Lunch: ${LifeUtils.formatCurrency(t.lunchOrSnacksCost)}</div>` : ""}
          </td>
          <td>
            <div class="fw-bold text-dark fs-15">${LifeUtils.formatCurrency(t.actualCost)}</div>
            <div class="text-muted fs-11">Total Incurred</div>
          </td>
          <td>
            <div class="fw-semibold text-primary fs-15">${LifeUtils.formatCurrency(t.claimedCost)}</div>
            <div class="text-muted fs-11">On Company Voucher</div>
          </td>
          <td>
            <div class="fw-bold fs-15 ${t.pocketGap > 0 ? "text-danger" : "text-success"}">
              ${t.pocketGap > 0 ? `-${LifeUtils.formatCurrency(t.pocketGap)}` : "৳0"}
            </div>
            <div class="fs-11 text-muted">${t.pocketGap > 0 ? "Personal Pocket Gap" : "Fully Claimed"}</div>
          </td>
          <td>${statusBadge}</td>
          <td class="text-end">
            <button class="btn btn-sm btn-outline-danger btn-delete-conveyance-trip" data-id="${t.id}" title="Delete Record">
              <i class="bi bi-trash"></i>
            </button>
          </td>
        </tr>
      `;
    }).join("");

    $("#conveyance-trips-table-body").html(html);
  }

  function renderClaimsView() {
    const claims = LifeStorage.get("conveyanceClaims") || [];

    if (claims.length === 0) {
      $("#conveyance-claims-grid").html(`
        <div class="col-12 text-center py-5 text-muted bg-white border rounded-4">
          <i class="bi bi-receipt fs-1 d-block mb-2 text-secondary opacity-50"></i>
          <div class="fw-semibold">No conveyance claims created yet.</div>
          <div class="small">Click "Batch & Submit Claim" to group meeting trips into an official voucher.</div>
        </div>
      `);
      return;
    }

    const html = claims.map(c => {
      let statusBadge = "";
      if (c.status === "pending_approval") {
        statusBadge = `<span class="badge bg-warning text-dark">Pending Accounts Approval</span>`;
      } else if (c.status === "partially_disbursed") {
        statusBadge = `<span class="badge bg-info-subtle text-info-emphasis border">Partially Disbursed</span>`;
      } else if (c.status === "fully_disbursed") {
        statusBadge = `<span class="badge bg-success text-white">Fully Settled</span>`;
      }

      const totalLossOnThisBatch = (c.totalActualSpent - (c.disbursedAmount || 0));

      return `
        <div class="col-12 col-lg-6 mb-4">
          <div class="card h-100 border shadow-sm rounded-4 overflow-hidden">
            <div class="card-header bg-transparent p-4 pb-2 border-0">
              <div class="d-flex justify-content-between align-items-start mb-2">
                <div>
                  <span class="badge bg-light text-secondary border font-monospace mb-1">${c.voucherNumber}</span>
                  <h5 class="fw-bold mb-1">${LifeUtils.escapeHtml(c.title)}</h5>
                  <div class="text-muted small">Submitted: ${LifeUtils.formatDate(c.submissionDate, "DD MMM YYYY")} • ${c.period || ""}</div>
                </div>
                ${statusBadge}
              </div>
            </div>

            <div class="card-body px-4 py-2">
              <div class="row g-2 text-center bg-light-subtle rounded-3 p-3 border mb-3">
                <div class="col-4 border-end">
                  <div class="text-muted fs-11">Total Incurred</div>
                  <div class="fw-bold fs-15 text-dark">${LifeUtils.formatCurrency(c.totalActualSpent)}</div>
                </div>
                <div class="col-4 border-end">
                  <div class="text-muted fs-11">Submitted / Claimed</div>
                  <div class="fw-bold fs-15 text-primary">${LifeUtils.formatCurrency(c.totalClaimed)}</div>
                </div>
                <div class="col-4">
                  <div class="text-muted fs-11">Disbursed by Co.</div>
                  <div class="fw-bold fs-15 text-success">${LifeUtils.formatCurrency(c.disbursedAmount || 0)}</div>
                </div>
              </div>

              <!-- Loss Breakdown Alert -->
              <div class="p-3 rounded-3 mb-3 border ${c.companyDeduction > 0 ? "bg-danger-subtle border-danger" : "bg-light-subtle"}">
                <div class="d-flex justify-content-between small mb-1">
                  <span class="text-muted">Unsubmitted Pocket Gap:</span>
                  <span class="fw-semibold">${LifeUtils.formatCurrency(c.initialPocketGap)}</span>
                </div>
                ${c.companyDeduction > 0 ? `
                  <div class="d-flex justify-content-between small text-danger mb-1">
                    <span>Company Accounts Cut / Deduction:</span>
                    <span class="fw-bold">-${LifeUtils.formatCurrency(c.companyDeduction)}</span>
                  </div>
                ` : ""}
                <div class="d-flex justify-content-between small pt-1 border-top fw-bold">
                  <span>Net Pocket Loss for Me:</span>
                  <span class="text-danger">${LifeUtils.formatCurrency(totalLossOnThisBatch)}</span>
                </div>
              </div>

              ${c.disbursementNote ? `
                <div class="small text-muted p-2 rounded bg-light border mb-2">
                  <i class="bi bi-chat-left-text me-1"></i> ${LifeUtils.escapeHtml(c.disbursementNote)}
                </div>
              ` : ""}

              <div class="small text-muted">Includes ${(c.tripIds || []).length} meeting trips</div>
            </div>

            <div class="card-footer bg-transparent border-top px-4 py-3 d-flex justify-content-between align-items-center">
              <span class="small text-muted">${c.disbursementDate ? `Settled on ${LifeUtils.formatDate(c.disbursementDate, "DD MMM")}` : "Awaiting disbursement"}</span>
              ${c.status === "pending_approval" ? `
                <button class="btn btn-sm btn-success btn-settle-claim" data-id="${c.id}">
                  <i class="bi bi-cash-coin me-1"></i> Record Disbursement
                </button>
              ` : `
                <span class="text-success small fw-semibold"><i class="bi bi-check-circle-fill"></i> Disbursed</span>
              `}
            </div>
          </div>
        </div>
      `;
    }).join("");

    $("#conveyance-claims-grid").html(html);
  }

  function renderAnalyticsView() {
    const trips = LifeStorage.get("conveyanceTrips") || [];
    const claims = LifeStorage.get("conveyanceClaims") || [];
    const m = LifeUtils.calculateConveyanceMetrics(trips, claims);

    $("#analytics-conv-total-spent").text(LifeUtils.formatCurrency(m.totalActualSpent));
    $("#analytics-conv-total-claimed").text(LifeUtils.formatCurrency(m.totalClaimed));
    $("#analytics-conv-total-disbursed").text(LifeUtils.formatCurrency(m.totalDisbursed));
    $("#analytics-conv-company-cuts").text(LifeUtils.formatCurrency(m.totalCompanyDeductions));
    $("#analytics-conv-total-loss").text(LifeUtils.formatCurrency(m.overallLoss));

    // Recovery rate %: Disbursed / Actual Spent
    const recoveryRate = m.totalActualSpent > 0 ? Math.round((m.totalDisbursed / m.totalActualSpent) * 100) : 0;
    $("#analytics-conv-recovery-rate").text(`${recoveryRate}%`);
    $("#analytics-conv-recovery-bar").css("width", `${recoveryRate}%`);

    // Top client destinations
    const locationMap = {};
    trips.forEach(t => {
      const loc = t.location || "Dhaka Client";
      locationMap[loc] = (locationMap[loc] || 0) + t.actualCost;
    });

    const sortedLocs = Object.entries(locationMap).sort((a, b) => b[1] - a[1]);
    const locHtml = sortedLocs.map(([loc, amt]) => `
      <div class="d-flex justify-content-between align-items-center p-3 border-bottom">
        <div class="d-flex align-items-center gap-2">
          <i class="bi bi-geo-alt-fill text-danger"></i>
          <span class="fw-semibold fs-14">${LifeUtils.escapeHtml(loc)}</span>
        </div>
        <span class="fw-bold text-dark">${LifeUtils.formatCurrency(amt)}</span>
      </div>
    `).join("");

    $("#conveyance-top-locations-list").html(locHtml);
  }

  function openNewTripModal() {
    $("#form-conveyance-trip")[0].reset();
    $("#trip-form-date").val(LifeUtils.CURRENT_DEMO_DATE);

    // Populate account dropdown
    const accounts = LifeStorage.get("accounts") || [];
    let opts = "";
    accounts.forEach(a => {
      opts += `<option value="${a.id}">${a.name} (${LifeUtils.formatCurrency(a.balance)})</option>`;
    });
    $("#trip-form-account").html(opts);
    $("#trip-pocket-gap-preview").text("৳0");

    const modal = new bootstrap.Modal(document.getElementById("modal-conveyance-trip"));
    modal.show();
  }

  function saveTripForm() {
    const clientOrPurpose = $("#trip-form-purpose").val().trim();
    const location = $("#trip-form-location").val().trim();
    const route = $("#trip-form-route").val().trim();
    const date = $("#trip-form-date").val() || LifeUtils.CURRENT_DEMO_DATE;
    const transportMode = $("#trip-form-mode").val();
    const transportCost = Number($("#trip-form-transport").val()) || 0;
    const lunchOrSnacksCost = Number($("#trip-form-lunch").val()) || 0;
    const claimedCost = Number($("#trip-form-claimed").val()) || 0;
    const accountId = $("#trip-form-account").val();
    const notes = $("#trip-form-notes").val().trim();

    if (!clientOrPurpose || (!transportCost && !lunchOrSnacksCost)) {
      window.Swal.fire({
        icon: "warning",
        title: "Validation Error",
        text: "Please provide meeting purpose and at least transport or lunch expense."
      });
      return;
    }

    const actualCost = transportCost + lunchOrSnacksCost;

    LifeStorage.addConveyanceTrip({
      clientOrPurpose,
      location,
      route,
      date,
      transportMode,
      transportCost,
      lunchOrSnacksCost,
      actualCost,
      claimedCost,
      pocketGap: Math.max(0, actualCost - claimedCost),
      accountId,
      notes
    });

    bootstrap.Modal.getInstance(document.getElementById("modal-conveyance-trip")).hide();
    window.Swal.fire({
      icon: "success",
      title: "Conveyance Logged!",
      text: `Logged ${LifeUtils.formatCurrency(actualCost)} (${LifeUtils.formatCurrency(claimedCost)} claimed).`,
      timer: 1800,
      showConfirmButton: false,
      toast: true,
      position: "top-end"
    });
  }

  function openBatchModal() {
    const trips = (LifeStorage.get("conveyanceTrips") || []).filter(t => t.status === "unsubmitted");

    if (trips.length === 0) {
      window.Swal.fire({
        icon: "info",
        title: "No Unsubmitted Trips",
        text: "All your conveyance trips have already been added to claim batches.",
        confirmButtonColor: "#635BFF"
      });
      return;
    }

    $("#batch-form-title").val(`Conveyance Bill - ${LifeUtils.formatDate(LifeUtils.CURRENT_DEMO_DATE, "MMM YYYY")}`);
    $("#batch-form-date").val(LifeUtils.CURRENT_DEMO_DATE);

    const checklistHtml = trips.map(t => `
      <div class="form-check p-2 border-bottom">
        <input class="form-check-input batch-trip-checkbox cursor-pointer" type="checkbox" value="${t.id}" data-actual="${t.actualCost}" data-claimed="${t.claimedCost}" id="chk-${t.id}" checked>
        <label class="form-check-label w-100 cursor-pointer" for="chk-${t.id}">
          <div class="d-flex justify-content-between align-items-center">
            <span class="fw-semibold fs-13">${LifeUtils.escapeHtml(t.clientOrPurpose)}</span>
            <span class="badge bg-primary-subtle text-primary">Claim: ${LifeUtils.formatCurrency(t.claimedCost)}</span>
          </div>
          <div class="d-flex justify-content-between small text-muted">
            <span>${LifeUtils.formatDate(t.date, "DD MMM")} • ${t.transportMode}</span>
            <span>Actual: ${LifeUtils.formatCurrency(t.actualCost)} (Gap: -${LifeUtils.formatCurrency(t.pocketGap)})</span>
          </div>
        </label>
      </div>
    `).join("");

    $("#batch-trips-checklist").html(checklistHtml);
    updateBatchModalSummary();

    const modal = new bootstrap.Modal(document.getElementById("modal-conveyance-claim"));
    modal.show();
  }

  function updateBatchModalSummary() {
    let totalActual = 0, totalClaimed = 0;
    $(".batch-trip-checkbox:checked").each(function () {
      totalActual += Number($(this).data("actual")) || 0;
      totalClaimed += Number($(this).data("claimed")) || 0;
    });

    const gap = Math.max(0, totalActual - totalClaimed);
    $("#batch-summary-actual").text(LifeUtils.formatCurrency(totalActual));
    $("#batch-summary-claimed").text(LifeUtils.formatCurrency(totalClaimed));
    $("#batch-summary-gap").text(`-${LifeUtils.formatCurrency(gap)}`);
  }

  function saveClaimBatchForm() {
    const title = $("#batch-form-title").val().trim();
    const submissionDate = $("#batch-form-date").val() || LifeUtils.CURRENT_DEMO_DATE;
    const selectedTripIds = [];
    let totalActualSpent = 0;
    let totalClaimed = 0;

    $(".batch-trip-checkbox:checked").each(function () {
      selectedTripIds.push($(this).val());
      totalActualSpent += Number($(this).data("actual")) || 0;
      totalClaimed += Number($(this).data("claimed")) || 0;
    });

    if (!title || selectedTripIds.length === 0) {
      window.Swal.fire({
        icon: "warning",
        title: "Validation Error",
        text: "Please provide a title and select at least one trip to batch."
      });
      return;
    }

    LifeStorage.addConveyanceClaim({
      title,
      submissionDate,
      tripIds: selectedTripIds,
      totalActualSpent,
      totalClaimed,
      initialPocketGap: Math.max(0, totalActualSpent - totalClaimed)
    });

    bootstrap.Modal.getInstance(document.getElementById("modal-conveyance-claim")).hide();
    window.Swal.fire({
      icon: "success",
      title: "Claim Batch Created!",
      text: `Submitted voucher for ${LifeUtils.formatCurrency(totalClaimed)} to company.`,
      timer: 1800,
      showConfirmButton: false,
      toast: true,
      position: "top-end"
    });
  }

  function openSettleModal(claimId) {
    const claims = LifeStorage.get("conveyanceClaims") || [];
    const claim = claims.find(c => c.id === claimId);
    if (!claim) return;

    $("#settle-claim-id").val(claim.id);
    $("#settle-claim-title").text(`${claim.voucherNumber}: ${claim.title}`);
    $("#settle-claimed-amount").val(claim.totalClaimed);
    $("#settle-disbursed-amount").val(claim.totalClaimed); // default full
    $("#settle-deduction-amount").val(0);
    $("#settle-deduction-badge").text("Company Deduction: ৳0").removeClass("text-danger").addClass("text-success");
    $("#settle-deduction-notes").val("");

    // Populate receiving account
    const accounts = LifeStorage.get("accounts") || [];
    let opts = "";
    accounts.forEach(a => {
      opts += `<option value="${a.id}">${a.name} (${LifeUtils.formatCurrency(a.balance)})</option>`;
    });
    $("#settle-target-account").html(opts);
    // Prefer bKash or BRAC Bank
    const bKash = accounts.find(a => a.name.toLowerCase().includes("bkash"));
    if (bKash) $("#settle-target-account").val(bKash.id);

    const modal = new bootstrap.Modal(document.getElementById("modal-conveyance-settle"));
    modal.show();
  }

  function saveSettlementForm() {
    const claimId = $("#settle-claim-id").val();
    const disbursed = Number($("#settle-disbursed-amount").val()) || 0;
    const note = $("#settle-deduction-notes").val().trim();
    const targetAccountId = $("#settle-target-account").val();

    LifeStorage.disburseConveyanceClaim(claimId, disbursed, note, targetAccountId);

    bootstrap.Modal.getInstance(document.getElementById("modal-conveyance-settle")).hide();
    window.Swal.fire({
      icon: "success",
      title: "Disbursement Recorded!",
      text: `Reimbursement of ${LifeUtils.formatCurrency(disbursed)} credited to account.`,
      timer: 2000,
      showConfirmButton: false,
      toast: true,
      position: "top-end"
    });
  }

  return {
    init,
    render,
    openNewTripModal,
    openBatchModal,
    openSettleModal
  };
})();

if (typeof window !== "undefined") {
  window.LifeConveyance = LifeConveyance;
}
