/**
 * LifeOS — Savings & Goals Module
 * Interactive savings tracker with goal progress, milestone timeline, contribution deposits, and account linking.
 */

const LifeSavings = (() => {
  function init() {
    // Contribute modal open
    $(document).on("click", ".btn-contribute-goal", function () {
      const goalId = $(this).data("id");
      openContributeModal(goalId);
    });

    // Delete goal
    $(document).on("click", ".btn-delete-goal", function () {
      const goalId = $(this).data("id");
      window.Swal.fire({
        title: "Delete Savings Goal?",
        text: "Remove this goal from your savings tracker?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#EF4444",
        confirmButtonText: "Yes, delete"
      }).then(res => {
        if (res.isConfirmed) {
          LifeStorage.deleteSavingsGoal(goalId);
          window.Swal.fire({ icon: "success", title: "Goal Deleted", timer: 1500, showConfirmButton: false, toast: true });
        }
      });
    });

    // Save Goal form
    $(document).on("submit", "#form-savings-goal", function (e) {
      e.preventDefault();
      saveSavingsGoalForm();
    });

    // Save Contribution form
    $(document).on("submit", "#form-contribute-goal", function (e) {
      e.preventDefault();
      saveContributionForm();
    });

    LifeStorage.on("change", (e) => {
      if (window.LifeApp && window.LifeApp.getCurrentPage() === "savings") {
        render();
      }
    });
  }

  function render() {
    const goals = LifeStorage.get("savingsGoals") || [];
    let totalTarget = 0;
    let totalSaved = 0;

    const cardsHtml = goals.map(g => {
      const target = Number(g.targetAmount) || 0;
      const current = Number(g.currentAmount) || 0;
      const remaining = Math.max(0, target - current);
      const percent = target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0;

      totalTarget += target;
      totalSaved += current;

      // Calculate suggested monthly contribution
      const targetDate = new Date(g.targetDate || "2027-01-01");
      const today = new Date(LifeUtils.CURRENT_DEMO_DATE);
      const diffMonths = Math.max(1, Math.round((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24 * 30)));
      const suggestedMonthly = remaining > 0 ? Math.round(remaining / diffMonths) : 0;

      return `
        <div class="col-12 col-md-6 col-xl-4 mb-4">
          <div class="card h-100 border shadow-sm rounded-4 overflow-hidden">
            <div class="card-body p-4">
              <div class="d-flex justify-content-between align-items-start mb-3">
                <div class="d-flex align-items-center gap-3">
                  <div class="rounded-3 p-3 text-white" style="background-color: ${g.color || "#10B981"}">
                    <i class="bi ${g.icon || "bi-piggy-bank"} fs-4"></i>
                  </div>
                  <div>
                    <h6 class="fw-bold mb-0">${LifeUtils.escapeHtml(g.name)}</h6>
                    <div class="text-muted small">${LifeUtils.escapeHtml(g.category)} • Due ${LifeUtils.formatDate(g.targetDate, "MMM YYYY")}</div>
                  </div>
                </div>
                <span class="badge ${g.priority === "High" ? "bg-danger" : "bg-primary"}">${g.priority}</span>
              </div>

              <p class="text-muted small mb-4">${LifeUtils.escapeHtml(g.description || "")}</p>

              <div class="d-flex justify-content-between align-items-baseline mb-2">
                <span class="fs-4 fw-bold text-dark">${LifeUtils.formatCurrency(current)}</span>
                <span class="text-muted small">Target: <strong class="text-dark">${LifeUtils.formatCurrency(target)}</strong></span>
              </div>

              <div class="progress mb-3" style="height: 10px;">
                <div class="progress-bar progress-bar-striped progress-bar-animated" style="width: ${percent}%; background-color: ${g.color || "#10B981"}"></div>
              </div>

              <div class="d-flex justify-content-between small text-muted mb-4">
                <span>${percent}% completed</span>
                <span>${remaining > 0 ? `${LifeUtils.formatCurrency(remaining)} to go` : "Goal Achieved! 🎉"}</span>
              </div>

              <div class="p-3 rounded-3 bg-light-subtle border small mb-3">
                <div class="d-flex justify-content-between">
                  <span class="text-muted">Target Timeline:</span>
                  <span class="fw-semibold">${diffMonths} months remaining</span>
                </div>
                <div class="d-flex justify-content-between mt-1">
                  <span class="text-muted">Suggested Deposit:</span>
                  <span class="fw-bold text-primary">${LifeUtils.formatCurrency(suggestedMonthly)} / month</span>
                </div>
              </div>

              <div class="d-flex gap-2">
                <button class="btn btn-sm btn-primary flex-grow-1 btn-contribute-goal" data-id="${g.id}">
                  <i class="bi bi-plus-lg me-1"></i> Add Deposit
                </button>
                <button class="btn btn-sm btn-outline-danger btn-delete-goal" data-id="${g.id}">
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </div>

            <!-- Recent Contributions Accordion Preview -->
            <div class="card-footer bg-transparent border-top px-4 py-2 small text-muted">
              <span>${(g.contributions || []).length} past contributions recorded</span>
            </div>
          </div>
        </div>
      `;
    }).join("");

    $("#savings-grid-container").html(cardsHtml);

    // Header metrics
    const totalRemaining = Math.max(0, totalTarget - totalSaved);
    const overallPercent = totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0;

    $("#savings-stat-total-saved").text(LifeUtils.formatCurrency(totalSaved));
    $("#savings-stat-target").text(LifeUtils.formatCurrency(totalTarget));
    $("#savings-stat-remaining").text(LifeUtils.formatCurrency(totalRemaining));
    $("#savings-stat-percent").text(`${overallPercent}%`);
  }

  function openContributeModal(goalId) {
    const goals = LifeStorage.get("savingsGoals") || [];
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;

    $("#modal-contribute-goal-id").val(goal.id);
    $("#modal-contribute-goal-name").text(goal.name);

    // Populate source account dropdown
    const accounts = LifeStorage.get("accounts") || [];
    let opts = "";
    accounts.forEach(a => {
      opts += `<option value="${a.id}">${a.name} (${LifeUtils.formatCurrency(a.balance)})</option>`;
    });
    $("#contribute-source-account").html(opts);
    $("#contribute-amount").val("");
    $("#contribute-notes").val("");

    const modal = new bootstrap.Modal(document.getElementById("modal-contribute-goal"));
    modal.show();
  }

  function saveContributionForm() {
    const goalId = $("#modal-contribute-goal-id").val();
    const amount = Number($("#contribute-amount").val());
    const sourceAccId = $("#contribute-source-account").val();
    const notes = $("#contribute-notes").val().trim();

    if (!amount || amount <= 0) {
      window.Swal.fire({ icon: "warning", title: "Invalid Amount", text: "Please enter a valid deposit amount." });
      return;
    }

    const accounts = LifeStorage.get("accounts") || [];
    const acc = accounts.find(a => a.id === sourceAccId);
    if (acc && acc.balance < amount) {
      window.Swal.fire({
        icon: "warning",
        title: "Insufficient Account Balance",
        text: `Your ${acc.name} only has ${LifeUtils.formatCurrency(acc.balance)}.`
      });
      return;
    }

    LifeStorage.contributeToGoal(goalId, amount, notes, sourceAccId);
    bootstrap.Modal.getInstance(document.getElementById("modal-contribute-goal")).hide();

    window.Swal.fire({
      icon: "success",
      title: "Deposit Added!",
      text: `Successfully added ${LifeUtils.formatCurrency(amount)} to your goal.`,
      timer: 1800,
      showConfirmButton: false,
      toast: true,
      position: "top-end"
    });
  }

  function saveSavingsGoalForm() {
    const name = $("#goal-form-name").val().trim();
    const targetAmount = Number($("#goal-form-target").val());
    const currentAmount = Number($("#goal-form-current").val()) || 0;
    const targetDate = $("#goal-form-date").val();
    const priority = $("#goal-form-priority").val();
    const category = $("#goal-form-category").val();
    const description = $("#goal-form-desc").val().trim();
    const color = $("#goal-form-color").val() || "#10B981";

    if (!name || !targetAmount || targetAmount <= 0) {
      window.Swal.fire({ icon: "warning", title: "Validation Error", text: "Please provide goal name and valid target amount." });
      return;
    }

    LifeStorage.addSavingsGoal({
      name,
      targetAmount,
      currentAmount,
      targetDate: targetDate || "2027-12-31",
      priority,
      category,
      description,
      color,
      icon: "bi-piggy-bank",
      contributions: currentAmount > 0 ? [{ date: LifeUtils.CURRENT_DEMO_DATE, amount: currentAmount, note: "Initial setup" }] : []
    });

    bootstrap.Modal.getInstance(document.getElementById("modal-savings-goal")).hide();
    window.Swal.fire({ icon: "success", title: "Savings Goal Created", timer: 1500, showConfirmButton: false, toast: true });
  }

  return {
    init,
    render,
    openContributeModal
  };
})();

if (typeof window !== "undefined") {
  window.LifeSavings = LifeSavings;
}
