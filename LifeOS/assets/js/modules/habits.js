/**
 * LifeOS — Habit Tracker Module
 * Comprehensive habit system with real streak tracking, 30-day activity heatmap, and weekly scores.
 */

const LifeHabits = (() => {
  let activeCategory = "all";

  function init() {
    // Habit category filter
    $(document).on("click", ".habit-cat-filter", function (e) {
      e.preventDefault();
      $(".habit-cat-filter").removeClass("active");
      $(this).addClass("active");
      activeCategory = $(this).data("category");
      renderHabitList();
    });

    // Toggle habit completion (works across dashboard, myday, and habits page)
    $(document).on("click", ".habit-check-btn", function () {
      const habitId = $(this).data("id");
      const date = $(this).data("date") || LifeUtils.CURRENT_DEMO_DATE;
      LifeStorage.toggleHabitCompletion(habitId, date);

      // Play soft sound or feedback toast if sound enabled
      const habit = (LifeStorage.get("habits") || []).find(h => h.id === habitId);
      const isCompleted = (habit.completedDates || []).includes(date);

      if (isCompleted && window.Swal) {
        const streak = LifeUtils.calculateHabitStreak(habit.completedDates, date);
        const Toast = window.Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 1500
        });
        Toast.fire({
          icon: "success",
          title: `ধারাবাহিকতা: ${streak.currentStreak} দিন! 🔥`
        });
      }
    });

    // Delete habit
    $(document).on("click", ".btn-delete-habit", function () {
      const hId = $(this).data("id");
      window.Swal.fire({
        title: "অভ্যাস মুছে ফেলতে চান?",
        text: "এই অভ্যাস এবং এর পূর্বের রেকর্ড কি মুছে ফেলবেন?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#EF4444",
        cancelButtonColor: "#64748B",
        confirmButtonText: "হ্যাঁ, মুছে ফেলুন",
        cancelButtonText: "বাতিল"
      }).then(res => {
        if (res.isConfirmed) {
          LifeStorage.deleteHabit(hId);
          window.Swal.fire({ icon: "success", title: "অভ্যাস মুছে ফেলা হয়েছে", timer: 1500, showConfirmButton: false, toast: true });
        }
      });
    });

    // Save habit form
    $(document).on("submit", "#form-habit", function (e) {
      e.preventDefault();
      saveHabitForm();
    });

    LifeStorage.on("change", (e) => {
      if (window.LifeApp && window.LifeApp.getCurrentPage() === "habits") {
        render();
      }
    });
  }

  function render() {
    renderScoreSummary();
    renderHabitList();
  }

  function renderScoreSummary() {
    const habits = LifeStorage.get("habits") || [];
    let totalScore = 0;
    let totalStreaks = 0;
    let completedToday = 0;

    habits.forEach(h => {
      const stats = LifeUtils.calculateHabitStreak(h.completedDates);
      totalScore += stats.completionRate;
      totalStreaks += stats.currentStreak;
      if ((h.completedDates || []).includes(LifeUtils.CURRENT_DEMO_DATE)) {
        completedToday++;
      }
    });

    const avgScore = habits.length > 0 ? Math.round(totalScore / habits.length) : 0;
    const avgStreak = habits.length > 0 ? Math.round(totalStreaks / habits.length) : 0;

    $("#habit-stat-score").text(`${avgScore}%`);
    $("#habit-stat-active-count").text(habits.length);
    $("#habit-stat-completed-today").text(`${completedToday} / ${habits.length}`);
    $("#habit-stat-avg-streak").text(`${avgStreak} দিন`);
  }

  function renderHabitList() {
    const habits = LifeStorage.get("habits") || [];
    let filtered = [...habits];
    if (activeCategory !== "all") {
      filtered = habits.filter(h => h.category === activeCategory);
    }

    // Generate last 30 days labels for heatmap
    const days30 = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(LifeUtils.CURRENT_DEMO_DATE);
      d.setDate(d.getDate() - i);
      days30.push(d.toISOString().split("T")[0]);
    }

    const html = filtered.map(h => {
      const isDoneToday = (h.completedDates || []).includes(LifeUtils.CURRENT_DEMO_DATE);
      const streakInfo = LifeUtils.calculateHabitStreak(h.completedDates);

      // Render 30-day heatmap squares
      const heatmapBoxes = days30.map(dStr => {
        const isDone = (h.completedDates || []).includes(dStr);
        const dayLabel = LifeUtils.formatDate(dStr, "DD MMM");
        return `<div class="heatmap-cell ${isDone ? "completed" : ""}" title="${dayLabel}: ${isDone ? "সম্পন্ন" : "মিস হয়েছে"}" style="${isDone ? `background-color: ${h.color || "#10B981"};` : ""}"></div>`;
      }).join("");

      return `
        <div class="col-12 mb-4">
          <div class="card border shadow-sm rounded-4 p-4">
            <div class="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-3">
              <div class="d-flex align-items-center gap-3">
                <button class="btn btn-lg ${isDoneToday ? "btn-success" : "btn-outline-secondary"} habit-check-btn rounded-circle p-2 px-3" data-id="${h.id}" title="আজকের অগ্রগতি চিহ্নিত করুন">
                  <i class="bi ${isDoneToday ? "bi-check-lg fs-4" : "bi-circle fs-4"}"></i>
                </button>
                <div>
                  <h5 class="fw-bold mb-0 ${isDoneToday ? "text-success-emphasis" : ""}">${LifeUtils.escapeHtml(h.name)}</h5>
                  <div class="text-muted small mt-1">
                    <span class="badge bg-light text-secondary border me-2">${LifeUtils.escapeHtml(h.category)}</span>
                    <i class="bi bi-bell"></i> ${h.reminderTime || "দৈনিক"} • শুরু: ${LifeUtils.formatDate(h.startDate, "MMM YYYY")}
                  </div>
                </div>
              </div>

              <!-- Streak & Score Badges -->
              <div class="d-flex align-items-center gap-3">
                <div class="text-end">
                  <div class="fs-18 fw-bold text-danger"><i class="bi bi-fire"></i> ${streakInfo.currentStreak} দিনের ধারাবাহিকতা</div>
                  <div class="text-muted small">সর্বোচ্চ: ${streakInfo.longestStreak} দিন • সাফল্যের হার: ${streakInfo.completionRate}%</div>
                </div>
                <button class="btn btn-sm btn-link text-danger p-0 ms-2 btn-delete-habit" data-id="${h.id}">
                  <i class="bi bi-trash fs-5"></i>
                </button>
              </div>
            </div>

            <!-- Notes -->
            ${h.notes ? `<p class="text-muted small mb-3">${LifeUtils.escapeHtml(h.notes)}</p>` : ""}

            <!-- 30-Day Heatmap Section -->
            <div class="p-3 bg-light-subtle rounded-3 border">
              <div class="d-flex justify-content-between align-items-center small text-muted mb-2">
                <span>৩০ দিনের ধারাবাহিকতা হিটম্যাপ</span>
                <span class="fw-medium">৩০ দিনের স্কোর: ${streakInfo.completionRate}%</span>
              </div>
              <div class="d-flex gap-1 overflow-x-auto pb-1">
                ${heatmapBoxes}
              </div>
            </div>
          </div>
        </div>
      `;
    }).join("");

    $("#habits-list-container").html(html);
  }

  function saveHabitForm() {
    const name = $("#habit-form-name").val().trim();
    const category = $("#habit-form-category").val();
    const reminderTime = $("#habit-form-reminder").val() || "08:00";
    const color = $("#habit-form-color").val() || "#10B981";
    const notes = $("#habit-form-notes").val().trim();

    if (!name) {
      window.Swal.fire({ icon: "warning", title: "যাচাইকরণ ত্রুটি", text: "অনুগ্রহ করে অভ্যাসের নাম লিখুন।" });
      return;
    }

    LifeStorage.addHabit({
      name,
      category,
      reminderTime,
      startDate: LifeUtils.CURRENT_DEMO_DATE,
      active: true,
      color,
      notes,
      completedDates: [LifeUtils.CURRENT_DEMO_DATE]
    });

    bootstrap.Modal.getInstance(document.getElementById("modal-habit")).hide();
    window.Swal.fire({ icon: "success", title: "অভ্যাস তৈরি হয়েছে!", timer: 1500, showConfirmButton: false, toast: true });
  }

  return {
    init,
    render
  };
})();

if (typeof window !== "undefined") {
  window.LifeHabits = LifeHabits;
}
