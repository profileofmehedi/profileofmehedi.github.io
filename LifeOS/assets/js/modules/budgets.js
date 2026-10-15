/**
 * LifeOS — Budget Management Module
 * Computes live actual spending vs planned budget dynamically from transactions with alert thresholds.
 */

const LifeBudgets = (() => {
  let selectedMonth = "2026-10";

  function init() {
    $(document).on("change", "#budget-month-select", function () {
      selectedMonth = $(this).val();
      render();
    });

    $(document).on("submit", "#form-budget", function (e) {
      e.preventDefault();
      saveBudgetForm();
    });

    $(document).on("click", ".btn-delete-budget", function () {
      const bId = $(this).data("id");
      window.Swal.fire({
        title: "Delete Budget?",
        text: "Remove this category budget limit?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#EF4444",
        confirmButtonText: "Yes, delete"
      }).then(res => {
        if (res.isConfirmed) {
          LifeStorage.deleteBudget(bId);
          window.Swal.fire({ icon: "success", title: "Budget Removed", timer: 1500, showConfirmButton: false, toast: true });
        }
      });
    });

    LifeStorage.on("change", (e) => {
      if (window.LifeApp && window.LifeApp.getCurrentPage() === "budgets") {
        render();
      }
    });
  }

  function render() {
    const budgets = LifeStorage.get("budgets") || [];
    const transactions = LifeStorage.get("transactions") || [];
    const spendingMap = LifeUtils.getCategorySpending(transactions, selectedMonth);

    let totalBudget = 0;
    let totalSpent = 0;

    const cardsHtml = budgets.map(b => {
      const limit = Number(b.limit) || 0;
      const spent = spendingMap[b.category] || 0;
      const remaining = limit - spent;
      const percent = limit > 0 ? Math.round((spent / limit) * 100) : 0;

      totalBudget += limit;
      totalSpent += spent;

      let statusBadge = `<span class="badge bg-success-subtle text-success border">On Track</span>`;
      let barColor = "bg-success";

      if (percent >= 100) {
        statusBadge = `<span class="badge bg-danger text-white">Over Budget (${percent}%)</span>`;
        barColor = "bg-danger";
      } else if (percent >= 80) {
        statusBadge = `<span class="badge bg-warning text-dark">Near Limit (${percent}%)</span>`;
        barColor = "bg-warning";
      }

      return `
        <div class="col-12 col-md-6 col-xl-4 mb-4">
          <div class="card h-100 border shadow-sm rounded-4">
            <div class="card-body p-4">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <div class="d-flex align-items-center gap-2">
                  <div class="p-2 rounded-3 text-white" style="background-color: ${b.color || "#635BFF"}">
                    <i class="bi ${b.icon || "bi-tag"} fs-5"></i>
                  </div>
                  <h6 class="fw-bold mb-0">${LifeUtils.escapeHtml(b.category)}</h6>
                </div>
                ${statusBadge}
              </div>

              <div class="d-flex justify-content-between align-items-baseline my-3">
                <div>
                  <div class="text-muted small">Spent</div>
                  <div class="fs-4 fw-bold ${percent >= 100 ? "text-danger" : "text-dark"}">${LifeUtils.formatCurrency(spent)}</div>
                </div>
                <div class="text-end">
                  <div class="text-muted small">Budget Limit</div>
                  <div class="fs-5 fw-semibold text-secondary">${LifeUtils.formatCurrency(limit)}</div>
                </div>
              </div>

              <div class="progress mb-2" style="height: 8px;">
                <div class="progress-bar ${barColor}" style="width: ${Math.min(100, percent)}%"></div>
              </div>

              <div class="d-flex justify-content-between align-items-center small text-muted">
                <span>${remaining >= 0 ? `${LifeUtils.formatCurrency(remaining)} remaining` : `${LifeUtils.formatCurrency(Math.abs(remaining))} overspent`}</span>
                <span class="fw-semibold">${percent}% used</span>
              </div>
            </div>
            <div class="card-footer bg-transparent border-top px-4 py-2 text-end">
              <button class="btn btn-sm btn-link text-danger p-0 btn-delete-budget" data-id="${b.id}">
                <i class="bi bi-trash"></i> Delete
              </button>
            </div>
          </div>
        </div>
      `;
    }).join("");

    $("#budgets-grid-container").html(cardsHtml);

    // Summary Banner
    const totalRemaining = totalBudget - totalSpent;
    const overallPercent = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;

    $("#budget-total-planned").text(LifeUtils.formatCurrency(totalBudget));
    $("#budget-total-spent").text(LifeUtils.formatCurrency(totalSpent));
    $("#budget-total-remaining").text(LifeUtils.formatCurrency(totalRemaining));
    $("#budget-overall-bar").css("width", `${Math.min(100, overallPercent)}%`);
    $("#budget-overall-bar").removeClass("bg-success bg-warning bg-danger")
      .addClass(overallPercent >= 100 ? "bg-danger" : overallPercent >= 80 ? "bg-warning" : "bg-success");
    $("#budget-overall-percentage").text(`${overallPercent}%`);
  }

  function saveBudgetForm() {
    const category = $("#budget-form-category").val().trim();
    const limit = Number($("#budget-form-limit").val());
    const color = $("#budget-form-color").val() || "#635BFF";

    if (!category || !limit || limit <= 0) {
      window.Swal.fire({ icon: "warning", title: "Validation Error", text: "Please enter category and a positive budget limit." });
      return;
    }

    LifeStorage.addBudget({
      category,
      limit,
      month: selectedMonth,
      icon: "bi-wallet2",
      color
    });

    bootstrap.Modal.getInstance(document.getElementById("modal-budget")).hide();
    window.Swal.fire({ icon: "success", title: "Budget Added", timer: 1500, showConfirmButton: false, toast: true });
  }

  return {
    init,
    render
  };
})();

if (typeof window !== "undefined") {
  window.LifeBudgets = LifeBudgets;
}
