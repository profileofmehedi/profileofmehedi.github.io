/**
 * LifeOS — Calendar Module
 * Responsive monthly and weekly calendar grid displaying bills, meetings, habits, and tasks.
 */

const LifeCalendar = (() => {
  let currentYear = 2026;
  let currentMonth = 9; // 0-indexed: 9 = October

  function init() {
    $(document).on("click", "#btn-cal-prev", function () {
      currentMonth--;
      if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
      }
      render();
    });

    $(document).on("click", "#btn-cal-next", function () {
      currentMonth++;
      if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
      }
      render();
    });

    $(document).on("click", "#btn-cal-today", function () {
      currentYear = 2026;
      currentMonth = 9; // October 2026
      render();
    });

    // Save event form
    $(document).on("submit", "#form-calendar-event", function (e) {
      e.preventDefault();
      saveCalendarEventForm();
    });

    // Delete event
    $(document).on("click", ".btn-delete-cal-event", function () {
      const evtId = $(this).data("id");
      LifeStorage.deleteCalendarEvent(evtId);
      render();
    });

    LifeStorage.on("change", (e) => {
      if (window.LifeApp && window.LifeApp.getCurrentPage() === "calendar") {
        render();
      }
    });
  }

  function render() {
    const monthNames = [
      "জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন",
      "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"
    ];
    $("#cal-current-month-label").text(`${monthNames[currentMonth]} ${currentYear}`);

    const events = LifeStorage.get("calendarEvents") || [];
    const tasks = LifeStorage.get("tasks") || [];

    // Calculate days in month
    const firstDay = new Date(currentYear, currentMonth, 1).getDay(); // 0 is Sunday
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    let gridHtml = "";

    // Blank cells before month starts
    for (let i = 0; i < firstDay; i++) {
      gridHtml += `<div class="calendar-day-cell disabled bg-light-subtle opacity-50 p-2 border"></div>`;
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const isToday = dateKey === LifeUtils.CURRENT_DEMO_DATE;

      // Filter events and tasks for this day
      const dayEvents = events.filter(e => e.date === dateKey);
      const dayTasks = tasks.filter(t => t.dueDate === dateKey);

      gridHtml += `
        <div class="calendar-day-cell p-2 border ${isToday ? "border-primary bg-primary-subtle bg-opacity-25" : "bg-white"} position-relative">
          <div class="d-flex justify-content-between align-items-center mb-1">
            <span class="day-number fw-bold fs-13 ${isToday ? "badge bg-primary rounded-circle" : "text-secondary"}">${day}</span>
            ${isToday ? `<span class="badge bg-primary-subtle text-primary fs-10">আজ</span>` : ""}
          </div>
          <div class="events-stack d-flex flex-column gap-1 overflow-y-auto" style="max-height: 90px;">
            ${dayEvents.map(e => `
              <div class="cal-event-pill small px-2 py-1 rounded text-white text-truncate cursor-pointer" style="background-color: ${e.badgeColor || "#635BFF"}" title="${LifeUtils.escapeHtml(e.title)} (${e.time || ""})">
                ${LifeUtils.escapeHtml(e.title)}
              </div>
            `).join("")}
            ${dayTasks.map(t => `
              <div class="cal-event-pill small px-2 py-1 rounded bg-secondary text-white text-truncate" title="টাস্ক: ${LifeUtils.escapeHtml(t.title)}">
                <i class="bi bi-check2"></i> ${LifeUtils.escapeHtml(t.title)}
              </div>
            `).join("")}
          </div>
        </div>
      `;
    }

    $("#calendar-month-grid").html(gridHtml);
    renderUpcomingEventList(events);
  }

  function renderUpcomingEventList(events) {
    const sorted = [...events].sort((a, b) => new Date(a.date) - new Date(b.date));
    const html = sorted.map(e => `
      <div class="d-flex align-items-center justify-content-between p-3 mb-2 rounded-3 border bg-light-subtle">
        <div class="d-flex align-items-center gap-3">
          <div class="rounded-circle p-2 text-white" style="background-color: ${e.badgeColor || "#635BFF"}">
            <i class="bi bi-calendar-event"></i>
          </div>
          <div>
            <h6 class="mb-0 fs-14 fw-semibold">${LifeUtils.escapeHtml(e.title)}</h6>
            <div class="small text-muted"><i class="bi bi-clock"></i> ${LifeUtils.formatDate(e.date, "DD MMM")} • ${e.time || "সারাদিন"} • <span class="badge bg-light text-secondary border">${e.category}</span></div>
          </div>
        </div>
        <button class="btn btn-sm btn-link text-danger p-0 btn-delete-cal-event" data-id="${e.id}"><i class="bi bi-trash"></i></button>
      </div>
    `).join("");

    $("#calendar-agenda-list").html(html);
  }

  function saveCalendarEventForm() {
    const title = $("#cal-form-title").val().trim();
    const date = $("#cal-form-date").val() || LifeUtils.CURRENT_DEMO_DATE;
    const time = $("#cal-form-time").val() || "12:00";
    const category = $("#cal-form-category").val();
    const badgeColor = $("#cal-form-color").val() || "#635BFF";

    if (!title) {
      window.Swal.fire({ icon: "warning", title: "যাচাইকরণ ত্রুটি", text: "অনুগ্রহ করে ইভেন্টের শিরোনাম লিখুন।" });
      return;
    }

    LifeStorage.addCalendarEvent({
      title,
      date,
      time,
      category,
      type: category === "Bills" || category === "বিল" ? "bill" : "event",
      badgeColor
    });

    bootstrap.Modal.getInstance(document.getElementById("modal-calendar-event")).hide();
    window.Swal.fire({ icon: "success", title: "ইভেন্ট যুক্ত হয়েছে!", timer: 1500, showConfirmButton: false, toast: true });
  }

  return {
    init,
    render
  };
})();

if (typeof window !== "undefined") {
  window.LifeCalendar = LifeCalendar;
}
