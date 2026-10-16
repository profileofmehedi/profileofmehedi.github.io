/**
 * LifeOS — Routines Management Module
 * Ordered routine steps, duration tracking, and completion percentage bars.
 */

const LifeRoutines = (() => {
  function init() {
    // Step completion toggle
    $(document).on("click", ".routine-page-step-checkbox", function () {
      const routineId = $(this).data("routine-id");
      const stepId = $(this).data("step-id");
      LifeStorage.toggleRoutineStep(routineId, stepId);
      render();
    });

    // Reset routine steps
    $(document).on("click", ".btn-reset-routine", function () {
      const rId = $(this).data("id");
      const routines = LifeStorage.get("routines") || [];
      const routine = routines.find(r => r.id === rId);
      if (routine) {
        (routine.steps || []).forEach(s => (s.completed = false));
        LifeStorage.set("routines", routines);
        render();
      }
    });

    // Save routine modal
    $(document).on("submit", "#form-routine", function (e) {
      e.preventDefault();
      saveRoutineForm();
    });

    LifeStorage.on("change", (e) => {
      if (window.LifeApp && window.LifeApp.getCurrentPage() === "routines") {
        render();
      }
    });
  }

  function render() {
    const routines = LifeStorage.get("routines") || [];

    const periodMap = {
      "Morning (07:00 - 08:30)": "সকাল (০৭:০০ - ০৮:৩০)",
      "Evening (21:30 - 22:30)": "সন্ধ্যা (২১:৩০ - ২২:৩০)",
      "Morning": "সকাল",
      "Evening": "সন্ধ্যা",
      "Night": "রাত",
      "Daily": "দৈনিক"
    };

    const html = routines.map(r => {
      const steps = r.steps || [];
      const totalSteps = steps.length;
      const completedSteps = steps.filter(s => s.completed).length;
      const percent = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;
      const periodText = periodMap[r.period] || r.period;

      return `
        <div class="col-12 col-lg-6 mb-4">
          <div class="card h-100 border shadow-sm rounded-4 overflow-hidden">
            <div class="card-header bg-transparent p-4 pb-2 border-0">
              <div class="d-flex justify-content-between align-items-start mb-2">
                <div class="d-flex align-items-center gap-3">
                  <div class="rounded-3 p-3 text-white" style="background-color: ${r.color || "#635BFF"}">
                    <i class="bi ${r.icon || "bi-lightning"} fs-4"></i>
                  </div>
                  <div>
                    <h5 class="fw-bold mb-0">${LifeUtils.escapeHtml(r.name)}</h5>
                    <div class="text-muted small">${periodText}</div>
                  </div>
                </div>
                <span class="badge ${percent === 100 ? "bg-success" : "bg-primary-subtle text-primary"} fs-12">${LifeUtils.toBnNumber(percent)}% সম্পন্ন</span>
              </div>
              <p class="text-muted small mt-2 mb-0">${LifeUtils.escapeHtml(r.description || "")}</p>
            </div>

            <div class="card-body px-4 py-3">
              <div class="progress mb-4" style="height: 8px;">
                <div class="progress-bar" style="width: ${percent}%; background-color: ${r.color || "#635BFF"}"></div>
              </div>

              <div class="d-flex flex-column gap-3">
                ${steps.map((s, idx) => `
                  <div class="d-flex align-items-center justify-content-between p-3 rounded-3 border ${s.completed ? "bg-success-subtle border-success" : "bg-light-subtle"}">
                    <div class="d-flex align-items-center gap-3">
                      <span class="badge bg-secondary-subtle text-dark rounded-circle">${LifeUtils.toBnNumber(idx + 1)}</span>
                      <div class="form-check mb-0">
                        <input class="form-check-input routine-page-step-checkbox cursor-pointer" type="checkbox" data-routine-id="${r.id}" data-step-id="${s.id}" ${s.completed ? "checked" : ""}>
                        <label class="form-check-label ${s.completed ? "text-decoration-line-through text-muted" : "fw-semibold"} fs-14">
                          ${LifeUtils.escapeHtml(s.title)}
                        </label>
                      </div>
                    </div>
                    <span class="badge bg-light text-muted border small"><i class="bi bi-stopwatch"></i> ${LifeUtils.toBnNumber(s.duration)}</span>
                  </div>
                `).join("")}
              </div>
            </div>

            <div class="card-footer bg-transparent border-top px-4 py-3 d-flex justify-content-between align-items-center">
              <span class="small text-muted">${LifeUtils.toBnNumber(totalSteps)} টির মধ্যে ${LifeUtils.toBnNumber(completedSteps)} টি ধাপ সম্পন্ন</span>
              <button class="btn btn-sm btn-outline-secondary btn-reset-routine" data-id="${r.id}">
                <i class="bi bi-arrow-clockwise"></i> ধাপ রিসেট
              </button>
            </div>
          </div>
        </div>
      `;
    }).join("");

    $("#routines-grid-container").html(html);
  }

  function saveRoutineForm() {
    const name = $("#routine-form-name").val().trim();
    const period = $("#routine-form-period").val().trim();
    const description = $("#routine-form-desc").val().trim();
    const color = $("#routine-form-color").val() || "#635BFF";
    const rawSteps = $("#routine-form-steps").val().trim();

    if (!name || !rawSteps) {
      window.Swal.fire({ icon: "warning", title: "ভুল তথ্য", text: "অনুগ্রহ করে রুটিনের নাম এবং কমপক্ষে একটি ধাপ লিখুন।" });
      return;
    }

    const steps = rawSteps.split("\n").filter(line => line.trim()).map((line, idx) => ({
      id: `s-custom-${idx + 1}`,
      title: line.trim(),
      duration: "১৫ মিনিট",
      completed: false
    }));

    const routines = LifeStorage.get("routines") || [];
    routines.push({
      id: LifeUtils.generateId("rou"),
      name,
      period: period || "দৈনিক",
      icon: "bi-check2-circle",
      color,
      steps
    });
    LifeStorage.set("routines", routines);

    bootstrap.Modal.getInstance(document.getElementById("modal-routine")).hide();
    window.Swal.fire({ icon: "success", title: "রুটিন তৈরি সম্পন্ন হয়েছে!", timer: 1500, showConfirmButton: false, toast: true });
  }

  return {
    init,
    render
  };
})();

if (typeof window !== "undefined") {
  window.LifeRoutines = LifeRoutines;
}
