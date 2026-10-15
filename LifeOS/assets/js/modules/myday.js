/**
 * LifeOS — My Day Daily Command Center Module
 */

const LifeMyDay = (() => {
  let selectedDate = LifeUtils.CURRENT_DEMO_DATE;

  function init() {
    // Date navigation
    $(document).on("click", "#btn-myday-prev", function () {
      shiftDate(-1);
    });
    $(document).on("click", "#btn-myday-next", function () {
      shiftDate(1);
    });
    $(document).on("change", "#myday-date-picker", function () {
      selectedDate = $(this).val();
      render();
    });

    // Routine step toggle
    $(document).on("click", ".routine-step-checkbox", function () {
      const routineId = $(this).data("routine-id");
      const stepId = $(this).data("step-id");
      LifeStorage.toggleRoutineStep(routineId, stepId);
      render();
    });

    // Daily reflection save
    $(document).on("click", "#btn-save-daily-reflection", function () {
      const text = $("#myday-reflection-input").val().trim();
      if (!text) return;

      const journal = LifeStorage.get("journalEntries") || [];
      const existing = journal.find(j => j.date === selectedDate);
      if (existing) {
        existing.content = text;
        LifeStorage.updateJournalEntry(existing);
      } else {
        LifeStorage.addJournalEntry({
          date: selectedDate,
          time: "21:00",
          mood: "good",
          title: `Daily Reflection for ${LifeUtils.formatDate(selectedDate, "DD MMM")}`,
          content: text,
          tags: ["DailyReflection"],
          gratitude: "Grateful for today's learnings.",
          prioritiesTomorrow: "Maintain focus and stay disciplined."
        });
      }

      window.Swal.fire({
        icon: "success",
        title: "Reflection Saved",
        timer: 1500,
        showConfirmButton: false,
        toast: true,
        position: "top-end"
      });
    });

    LifeStorage.on("change", (e) => {
      if (window.LifeApp && window.LifeApp.getCurrentPage() === "myday") {
        render();
      }
    });
  }

  function shiftDate(days) {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + days);
    selectedDate = d.toISOString().split("T")[0];
    render();
  }

  function render() {
    $("#myday-date-picker").val(selectedDate);
    $("#myday-display-date").text(LifeUtils.formatDate(selectedDate, "Day, DD MMM YYYY"));

    renderSummaryRing();
    renderTasks();
    renderHabits();
    renderRoutines();
    renderFinancials();
    renderReflection();
  }

  function renderSummaryRing() {
    const tasks = (LifeStorage.get("tasks") || []).filter(t => t.dueDate === selectedDate);
    const habits = LifeStorage.get("habits") || [];
    const routines = LifeStorage.get("routines") || [];

    const totalTasks = tasks.length;
    const doneTasks = tasks.filter(t => t.status === "completed").length;

    const totalHabits = habits.length;
    const doneHabits = habits.filter(h => (h.completedDates || []).includes(selectedDate)).length;

    let totalSteps = 0, doneSteps = 0;
    routines.forEach(r => {
      (r.steps || []).forEach(s => {
        totalSteps++;
        if (s.completed) doneSteps++;
      });
    });

    const grandTotal = totalTasks + totalHabits + totalSteps;
    const grandDone = doneTasks + doneHabits + doneSteps;
    const percent = grandTotal > 0 ? Math.round((grandDone / grandTotal) * 100) : 0;

    $("#myday-progress-bar").css("width", `${percent}%`);
    $("#myday-progress-percentage").text(`${percent}%`);
    $("#myday-progress-stats").text(`${grandDone} of ${grandTotal} items completed`);
  }

  function renderTasks() {
    const tasks = (LifeStorage.get("tasks") || []).filter(t => t.dueDate === selectedDate);
    let html = "";
    if (tasks.length === 0) {
      html = `<div class="p-3 text-muted text-center border rounded-3 bg-light-subtle">No tasks scheduled for this day. <a href="#" class="btn-quick-add-task text-primary text-decoration-none">Add one</a></div>`;
    } else {
      html = tasks.map(t => {
        const isDone = t.status === "completed";
        return `
          <div class="d-flex align-items-center justify-content-between p-3 mb-2 rounded-3 border bg-light-subtle">
            <div class="d-flex align-items-center gap-3">
              <input type="checkbox" class="form-check-input task-toggle-checkbox cursor-pointer" data-id="${t.id}" ${isDone ? "checked" : ""}>
              <div>
                <h6 class="mb-0 fs-14 ${isDone ? "text-decoration-line-through text-muted" : "fw-semibold"}">${LifeUtils.escapeHtml(t.title)}</h6>
                <div class="small text-muted"><i class="bi bi-clock"></i> ${t.dueTime || "All Day"} • <span class="badge bg-secondary-subtle text-secondary-emphasis">${LifeUtils.escapeHtml(t.category)}</span></div>
              </div>
            </div>
            <div class="d-flex align-items-center gap-2">
              <span class="badge ${t.priority === "Urgent" ? "bg-danger" : t.priority === "High" ? "bg-warning text-dark" : "bg-light text-dark border"}">${t.priority}</span>
              <button class="btn btn-sm btn-light border btn-edit-task" data-id="${t.id}"><i class="bi bi-pencil"></i></button>
            </div>
          </div>
        `;
      }).join("");
    }
    $("#myday-tasks-list").html(html);
  }

  function renderHabits() {
    const habits = LifeStorage.get("habits") || [];
    let html = habits.map(h => {
      const isDone = (h.completedDates || []).includes(selectedDate);
      const streak = LifeUtils.calculateHabitStreak(h.completedDates, selectedDate);
      return `
        <div class="d-flex align-items-center justify-content-between p-2 mb-2 rounded-2 border ${isDone ? "bg-success-subtle border-success" : "bg-light-subtle"}">
          <div class="d-flex align-items-center gap-3">
            <button class="btn btn-sm ${isDone ? "btn-success" : "btn-outline-secondary"} habit-check-btn rounded-circle p-1 px-2" data-id="${h.id}" data-date="${selectedDate}">
              <i class="bi ${isDone ? "bi-check-lg" : "bi-circle"}"></i>
            </button>
            <div>
              <div class="fs-14 ${isDone ? "fw-bold text-success-emphasis" : "fw-medium"}">${LifeUtils.escapeHtml(h.name)}</div>
              <div class="small text-muted"><i class="bi bi-fire text-danger"></i> ${streak.currentStreak}d streak</div>
            </div>
          </div>
          <span class="badge bg-light text-secondary border">${LifeUtils.escapeHtml(h.category)}</span>
        </div>
      `;
    }).join("");
    $("#myday-habits-list").html(html);
  }

  function renderRoutines() {
    const routines = LifeStorage.get("routines") || [];
    let html = routines.map(r => {
      const total = (r.steps || []).length;
      const done = (r.steps || []).filter(s => s.completed).length;
      const progress = total > 0 ? Math.round((done / total) * 100) : 0;

      return `
        <div class="card mb-3 border shadow-sm">
          <div class="card-header bg-transparent d-flex justify-content-between align-items-center py-2">
            <div class="d-flex align-items-center gap-2">
              <i class="bi ${r.icon || "bi-check-circle"} fs-5" style="color: ${r.color || "#635BFF"}"></i>
              <span class="fw-semibold fs-14">${LifeUtils.escapeHtml(r.name)}</span>
            </div>
            <span class="badge bg-light text-dark border small">${r.period}</span>
          </div>
          <div class="card-body p-3">
            <div class="progress mb-3" style="height: 5px;">
              <div class="progress-bar" style="width: ${progress}%; background-color: ${r.color || "#635BFF"}"></div>
            </div>
            <div class="d-flex flex-column gap-2">
              ${(r.steps || []).map(s => `
                <div class="d-flex align-items-center justify-content-between small">
                  <div class="form-check mb-0">
                    <input class="form-check-input routine-step-checkbox cursor-pointer" type="checkbox" data-routine-id="${r.id}" data-step-id="${s.id}" ${s.completed ? "checked" : ""}>
                    <label class="form-check-label ${s.completed ? "text-decoration-line-through text-muted" : "fw-medium"}">${LifeUtils.escapeHtml(s.title)}</label>
                  </div>
                  <span class="text-muted fs-11">${s.duration}</span>
                </div>
              `).join("")}
            </div>
          </div>
        </div>
      `;
    }).join("");
    $("#myday-routines-container").html(html);
  }

  function renderFinancials() {
    const txs = (LifeStorage.get("transactions") || []).filter(t => t.date === selectedDate);
    const dayIncome = txs.filter(t => t.type === "income").reduce((s, t) => s + (Number(t.amount) || 0), 0);
    const dayExpense = txs.filter(t => t.type === "expense").reduce((s, t) => s + (Number(t.amount) || 0), 0);

    $("#myday-income-val").text(LifeUtils.formatCurrency(dayIncome));
    $("#myday-expense-val").text(LifeUtils.formatCurrency(dayExpense));
  }

  function renderReflection() {
    const journal = LifeStorage.get("journalEntries") || [];
    const entry = journal.find(j => j.date === selectedDate);
    $("#myday-reflection-input").val(entry ? entry.content : "");
  }

  return {
    init,
    render,
    shiftDate
  };
})();

if (typeof window !== "undefined") {
  window.LifeMyDay = LifeMyDay;
}
