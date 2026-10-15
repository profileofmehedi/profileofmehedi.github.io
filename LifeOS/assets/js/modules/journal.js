/**
 * LifeOS — Journal & Daily Reflection Module
 * Distraction-free reflective journaling with mood tracking, gratitude prompts, and search.
 */

const LifeJournal = (() => {
  let activeSearch = "";

  function init() {
    $(document).on("input", "#journal-search-input", function () {
      activeSearch = $(this).val().toLowerCase().trim();
      render();
    });

    $(document).on("submit", "#form-journal-entry", function (e) {
      e.preventDefault();
      saveJournalForm();
    });

    $(document).on("click", ".btn-delete-journal-entry", function () {
      const jId = $(this).data("id");
      window.Swal.fire({
        title: "Delete Journal Entry?",
        text: "Remove this reflection from your journal archive?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#EF4444",
        confirmButtonText: "Yes, delete"
      }).then(res => {
        if (res.isConfirmed) {
          LifeStorage.deleteJournalEntry(jId);
          window.Swal.fire({ icon: "success", title: "Entry Deleted", timer: 1500, showConfirmButton: false, toast: true });
        }
      });
    });

    LifeStorage.on("change", (e) => {
      if (window.LifeApp && window.LifeApp.getCurrentPage() === "journal") {
        render();
      }
    });
  }

  function render() {
    const entries = LifeStorage.get("journalEntries") || [];
    let list = [...entries];

    if (activeSearch) {
      list = list.filter(j =>
        (j.title || "").toLowerCase().includes(activeSearch) ||
        (j.content || "").toLowerCase().includes(activeSearch) ||
        (j.gratitude || "").toLowerCase().includes(activeSearch) ||
        (j.tags || []).some(t => t.toLowerCase().includes(activeSearch))
      );
    }

    if (list.length === 0) {
      $("#journal-entries-container").html(`
        <div class="p-5 text-center text-muted bg-white border rounded-4">
          <i class="bi bi-journal-text fs-1 d-block mb-3 text-secondary opacity-50"></i>
          <h5>No journal entries found</h5>
          <p class="small">Capture today's thoughts, lessons, and gratitude by clicking "New Reflection".</p>
        </div>
      `);
      return;
    }

    const moodIcons = {
      great: { icon: "bi-emoji-laughing text-success", label: "Great" },
      good: { icon: "bi-emoji-smile text-primary", label: "Good" },
      neutral: { icon: "bi-emoji-neutral text-warning", label: "Neutral" },
      tired: { icon: "bi-battery text-secondary", label: "Tired" },
      stressed: { icon: "bi-emoji-dizzy text-danger", label: "Stressed" }
    };

    const html = list.map(j => {
      const mood = moodIcons[j.mood] || moodIcons.good;
      return `
        <div class="card border shadow-sm rounded-4 mb-4 overflow-hidden">
          <div class="card-body p-4">
            <div class="d-flex justify-content-between align-items-start mb-3">
              <div>
                <div class="d-flex align-items-center gap-2 mb-1">
                  <i class="bi ${mood.icon} fs-5"></i>
                  <span class="badge bg-light text-secondary border">${mood.label}</span>
                  <span class="text-muted small">• ${LifeUtils.formatDate(j.date, "Day, DD MMM YYYY")} at ${j.time || "21:00"}</span>
                </div>
                <h5 class="fw-bold text-dark mb-0">${LifeUtils.escapeHtml(j.title)}</h5>
              </div>
              <button class="btn btn-sm btn-link text-danger p-0 btn-delete-journal-entry" data-id="${j.id}" title="Delete Entry">
                <i class="bi bi-trash fs-5"></i>
              </button>
            </div>

            <p class="fs-15 text-secondary leading-relaxed mb-4">${LifeUtils.escapeHtml(j.content)}</p>

            ${j.gratitude ? `
              <div class="p-3 rounded-3 bg-light-subtle border-start border-3 border-success mb-3">
                <span class="fw-bold fs-13 text-success d-block mb-1"><i class="bi bi-heart me-1"></i> Gratitude Note:</span>
                <span class="text-secondary small">${LifeUtils.escapeHtml(j.gratitude)}</span>
              </div>
            ` : ""}

            ${j.prioritiesTomorrow ? `
              <div class="p-3 rounded-3 bg-light-subtle border-start border-3 border-primary mb-3">
                <span class="fw-bold fs-13 text-primary d-block mb-1"><i class="bi bi-arrow-right-circle me-1"></i> Priorities for Tomorrow:</span>
                <span class="text-secondary small">${LifeUtils.escapeHtml(j.prioritiesTomorrow)}</span>
              </div>
            ` : ""}

            <div class="d-flex gap-1 flex-wrap mt-2">
              ${(j.tags || []).map(t => `<span class="badge bg-light text-muted border">#${LifeUtils.escapeHtml(t)}</span>`).join("")}
            </div>
          </div>
        </div>
      `;
    }).join("");

    $("#journal-entries-container").html(html);
  }

  function saveJournalForm() {
    const title = $("#journal-form-title").val().trim();
    const content = $("#journal-form-content").val().trim();
    const mood = $("#journal-form-mood").val() || "good";
    const date = $("#journal-form-date").val() || LifeUtils.CURRENT_DEMO_DATE;
    const gratitude = $("#journal-form-gratitude").val().trim();
    const prioritiesTomorrow = $("#journal-form-priorities").val().trim();
    const rawTags = $("#journal-form-tags").val().trim();
    const tags = rawTags ? rawTags.split(",").map(t => t.trim()) : ["DailyReflection"];

    if (!title || !content) {
      window.Swal.fire({ icon: "warning", title: "Validation Error", text: "Please provide a title and journal entry text." });
      return;
    }

    LifeStorage.addJournalEntry({
      title,
      content,
      mood,
      date,
      time: "21:30",
      gratitude,
      prioritiesTomorrow,
      tags
    });

    bootstrap.Modal.getInstance(document.getElementById("modal-journal-entry")).hide();
    window.Swal.fire({ icon: "success", title: "Journal Entry Saved!", timer: 1500, showConfirmButton: false, toast: true });
  }

  return {
    init,
    render
  };
})();

if (typeof window !== "undefined") {
  window.LifeJournal = LifeJournal;
}
