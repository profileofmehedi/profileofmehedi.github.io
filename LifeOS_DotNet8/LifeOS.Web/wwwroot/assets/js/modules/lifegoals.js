/**
 * LifeOS — Personal Life Goals Module
 * Long-term vision planner with categorized milestones, dynamic progress calculation, and status tracking.
 */

const LifeGoals = (() => {
  let activeFilter = "all";

  function init() {
    $(document).on("click", ".life-goal-cat-filter", function (e) {
      e.preventDefault();
      $(".life-goal-cat-filter").removeClass("active");
      $(this).addClass("active");
      activeFilter = $(this).data("category");
      render();
    });

    // Milestone checkbox toggle
    $(document).on("click", ".milestone-checkbox", function () {
      const goalId = $(this).data("goal-id");
      const idx = $(this).data("idx");
      LifeStorage.toggleMilestone(goalId, idx);
      render();
    });

    // Delete life goal
    $(document).on("click", ".btn-delete-life-goal", function () {
      const gId = $(this).data("id");
      window.Swal.fire({
        title: "লাইফ গোল মুছবেন?",
        text: "আপনার ভবিষ্যৎ পরিকল্পনা থেকে এই লক্ষ্যটি মুছে ফেলতে চান?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#EF4444",
        confirmButtonText: "হ্যাঁ, মুছুন",
        cancelButtonText: "বাতিল"
      }).then(res => {
        if (res.isConfirmed) {
          LifeStorage.deleteLifeGoal(gId);
          window.Swal.fire({ icon: "success", title: "লক্ষ্য মুছে ফেলা হয়েছে", timer: 1500, showConfirmButton: false, toast: true });
        }
      });
    });

    // Save goal form
    $(document).on("submit", "#form-life-goal", function (e) {
      e.preventDefault();
      saveLifeGoalForm();
    });

    LifeStorage.on("change", (e) => {
      if (window.LifeApp && window.LifeApp.getCurrentPage() === "lifegoals") {
        render();
      }
    });
  }

  function render() {
    const goals = LifeStorage.get("lifeGoals") || [];
    let filtered = [...goals];

    if (activeFilter !== "all") {
      filtered = goals.filter(g => (g.category || "").toLowerCase().includes(activeFilter.toLowerCase()));
    }

    const priorityMap = {
      High: "উচ্চ",
      Medium: "মধ্যম",
      Low: "সাধারণ",
      Urgent: "জরুরি",
      Critical: "জরুরি"
    };

    const catMap = {
      Career: "ক্যারিয়ার",
      Finance: "অর্থ ও সঞ্চয়",
      Health: "স্বাস্থ্য ও ফিটনেস",
      Personal: "ব্যক্তিগত উন্নয়ন",
      Lifestyle: "জীবনযাত্রা",
      Education: "শিক্ষা ও দক্ষতা"
    };

    const html = filtered.map(g => {
      const milestones = g.milestones || [];
      const doneCount = milestones.filter(m => m.done).length;
      const progress = milestones.length > 0 ? Math.round((doneCount / milestones.length) * 100) : (g.progress || 0);
      const catLabel = catMap[g.category] || g.category;
      const prioLabel = priorityMap[g.priority] || g.priority;

      return `
        <div class="col-12 col-lg-6 mb-4">
          <div class="card h-100 border shadow-sm rounded-4 overflow-hidden">
            <div class="card-body p-4">
              <div class="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <span class="badge bg-primary-subtle text-primary border mb-1">${LifeUtils.escapeHtml(catLabel)}</span>
                  <h5 class="fw-bold mb-1">${LifeUtils.escapeHtml(g.title)}</h5>
                  <div class="text-muted small">টার্গেট: ${LifeUtils.formatDate(g.targetDate, "MMM YYYY")} • অগ্রাধিকার: <strong>${prioLabel}</strong></div>
                </div>
                <span class="badge ${progress >= 80 ? "bg-success" : progress >= 50 ? "bg-primary" : "bg-warning text-dark"} fs-12">${LifeUtils.toBnNumber(progress)}%</span>
              </div>

              <p class="text-muted small mb-3">${LifeUtils.escapeHtml(g.description || "")}</p>

              <div class="progress mb-4" style="height: 8px;">
                <div class="progress-bar ${progress >= 80 ? "bg-success" : "bg-primary"}" style="width: ${progress}%"></div>
              </div>

              <!-- Milestones Checklist -->
              <h6 class="fw-bold fs-13 text-secondary text-uppercase mb-2">মাইলফলক (${LifeUtils.toBnNumber(doneCount)}/${LifeUtils.toBnNumber(milestones.length)})</h6>
              <div class="d-flex flex-column gap-2 mb-3">
                ${milestones.map((m, idx) => `
                  <div class="form-check small">
                    <input class="form-check-input milestone-checkbox cursor-pointer" type="checkbox" data-goal-id="${g.id}" data-idx="${idx}" ${m.done ? "checked" : ""}>
                    <label class="form-check-label ${m.done ? "text-decoration-line-through text-muted" : "fw-medium"}">${LifeUtils.escapeHtml(m.title)}</label>
                  </div>
                `).join("")}
              </div>

              ${g.notes ? `<div class="p-2 rounded bg-light-subtle border small text-muted"><i class="bi bi-info-circle me-1"></i> ${LifeUtils.escapeHtml(g.notes)}</div>` : ""}
            </div>

            <div class="card-footer bg-transparent border-top px-4 py-2 text-end">
              <button class="btn btn-sm btn-link text-danger p-0 btn-delete-life-goal" data-id="${g.id}">
                <i class="bi bi-trash"></i> লক্ষ্য মুছুন
              </button>
            </div>
          </div>
        </div>
      `;
    }).join("");

    $("#lifegoals-grid-container").html(html);
  }

  function saveLifeGoalForm() {
    const title = $("#lg-form-title").val().trim();
    const category = $("#lg-form-category").val();
    const targetDate = $("#lg-form-date").val() || "2027-12-31";
    const priority = $("#lg-form-priority").val();
    const description = $("#lg-form-desc").val().trim();
    const rawMilestones = $("#lg-form-milestones").val().trim();

    if (!title) {
      window.Swal.fire({ icon: "warning", title: "ভুল তথ্য", text: "অনুগ্রহ করে লক্ষ্যের শিরোনাম লিখুন।" });
      return;
    }

    const milestones = rawMilestones.split("\n").filter(l => l.trim()).map(line => ({
      title: line.trim(),
      done: false
    }));

    LifeStorage.addLifeGoal({
      title,
      category,
      targetDate,
      priority,
      status: "in_progress",
      progress: 0,
      description,
      milestones
    });

    bootstrap.Modal.getInstance(document.getElementById("modal-life-goal")).hide();
    window.Swal.fire({ icon: "success", title: "নতুন লক্ষ্য যোগ হয়েছে!", timer: 1500, showConfirmButton: false, toast: true });
  }

  return {
    init,
    render
  };
})();

if (typeof window !== "undefined") {
  window.LifeGoals = LifeGoals;
}
