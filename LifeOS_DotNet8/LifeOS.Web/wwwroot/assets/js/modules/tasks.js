/**
 * LifeOS — Tasks Management Module
 * Supports dual views (List Table and Interactive Kanban Board), filters, priority badges, and status progression.
 */

const LifeTasks = (() => {
  let currentView = "list"; // 'list' | 'kanban'
  let activeFilter = "all"; // 'all' | 'todo' | 'in_progress' | 'completed'

  function init() {
    // View mode toggle
    $(document).on("click", ".tasks-view-btn", function (e) {
      e.preventDefault();
      $(".tasks-view-btn").removeClass("active");
      $(this).addClass("active");
      currentView = $(this).data("view");
      render();
    });

    // Filter toggle
    $(document).on("click", ".tasks-filter-btn", function (e) {
      e.preventDefault();
      $(".tasks-filter-btn").removeClass("active");
      $(this).addClass("active");
      activeFilter = $(this).data("filter");
      render();
    });

    // Task toggle status checkbox
    $(document).on("change", ".task-toggle-checkbox", function () {
      const taskId = $(this).data("id");
      LifeStorage.toggleTaskStatus(taskId);
    });

    // Move status forward in Kanban
    $(document).on("click", ".btn-move-task-status", function () {
      const taskId = $(this).data("id");
      const targetStatus = $(this).data("status");
      const task = (LifeStorage.get("tasks") || []).find(t => t.id === taskId);
      if (task) {
        task.status = targetStatus;
        LifeStorage.updateTask(task);
      }
    });

    // Delete task
    $(document).on("click", ".btn-delete-task", function () {
      const taskId = $(this).data("id");
      window.Swal.fire({
        title: "টাস্ক মুছবেন?",
        text: "আপনার তালিকা থেকে এই টাস্কটি মুছে ফেলতে চান?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#EF4444",
        confirmButtonText: "হ্যাঁ, মুছুন",
        cancelButtonText: "বাতিল"
      }).then(res => {
        if (res.isConfirmed) {
          LifeStorage.deleteTask(taskId);
          window.Swal.fire({ icon: "success", title: "টাস্ক মুছে ফেলা হয়েছে", timer: 1500, showConfirmButton: false, toast: true });
        }
      });
    });

    // Save task form
    $(document).on("submit", "#form-task", function (e) {
      e.preventDefault();
      saveTaskForm();
    });

    LifeStorage.on("change", (e) => {
      if (window.LifeApp && window.LifeApp.getCurrentPage() === "tasks") {
        render();
      }
    });
  }

  function render() {
    const tasks = LifeStorage.get("tasks") || [];

    // Header counters
    const total = tasks.length;
    const todo = tasks.filter(t => t.status === "todo").length;
    const inProg = tasks.filter(t => t.status === "in_progress").length;
    const completed = tasks.filter(t => t.status === "completed").length;

    $("#tasks-stat-total").text(LifeUtils.toBnNumber(total));
    $("#tasks-stat-todo").text(LifeUtils.toBnNumber(todo));
    $("#tasks-stat-inprog").text(LifeUtils.toBnNumber(inProg));
    $("#tasks-stat-completed").text(LifeUtils.toBnNumber(completed));

    if (currentView === "list") {
      $("#tasks-list-view").removeClass("d-none");
      $("#tasks-kanban-view").addClass("d-none");
      renderListView(tasks);
    } else {
      $("#tasks-list-view").addClass("d-none");
      $("#tasks-kanban-view").removeClass("d-none");
      renderKanbanView(tasks);
    }
  }

  function renderListView(tasks) {
    let list = [...tasks];
    if (activeFilter !== "all") {
      list = list.filter(t => t.status === activeFilter);
    }

    if (list.length === 0) {
      $("#tasks-table-body").html(`
        <tr>
          <td colspan="6" class="text-center py-5 text-muted">
            <i class="bi bi-check2-circle fs-1 d-block mb-2 text-success opacity-50"></i>
            <div>এই ফিল্টারে কোনো টাস্ক পাওয়া যায়নি।</div>
          </td>
        </tr>
      `);
      return;
    }

    const prioMap = { Urgent: "জরুরি", High: "উচ্চ", Medium: "মধ্যম", Low: "সাধারণ" };

    const html = list.map(t => {
      const isDone = t.status === "completed";
      const priorityClass = t.priority === "Urgent" ? "bg-danger" : t.priority === "High" ? "bg-warning text-dark" : "bg-light text-dark border";
      const prioText = prioMap[t.priority] || t.priority;

      return `
        <tr>
          <td style="width: 40px;">
            <input type="checkbox" class="form-check-input task-toggle-checkbox cursor-pointer" data-id="${t.id}" ${isDone ? "checked" : ""}>
          </td>
          <td>
            <div class="fw-semibold fs-14 ${isDone ? "text-decoration-line-through text-muted" : "text-dark"}">${LifeUtils.escapeHtml(t.title)}</div>
            ${t.description ? `<div class="text-muted small text-truncate" style="max-width: 320px;">${LifeUtils.escapeHtml(t.description)}</div>` : ""}
          </td>
          <td>
            <span class="badge bg-light text-secondary border">${LifeUtils.escapeHtml(t.category || "সাধারণ")}</span>
          </td>
          <td>
            <span class="badge ${priorityClass}">${prioText}</span>
          </td>
          <td>
            <div class="fs-13 text-muted"><i class="bi bi-calendar3"></i> ${LifeUtils.formatDate(t.dueDate, "DD MMM")}</div>
            <div class="fs-11 text-muted"><i class="bi bi-clock"></i> ${t.dueTime ? LifeUtils.toBnNumber(t.dueTime) : "দিনের শেষ"}</div>
          </td>
          <td class="text-end">
            <button class="btn btn-sm btn-outline-danger btn-delete-task" data-id="${t.id}"><i class="bi bi-trash"></i></button>
          </td>
        </tr>
      `;
    }).join("");

    $("#tasks-table-body").html(html);
  }

  function renderKanbanView(tasks) {
    const todoTasks = tasks.filter(t => t.status === "todo");
    const inProgTasks = tasks.filter(t => t.status === "in_progress");
    const doneTasks = tasks.filter(t => t.status === "completed");
    const prioMap = { Urgent: "জরুরি", High: "উচ্চ", Medium: "মধ্যম", Low: "সাধারণ" };

    const renderColumnCards = (colTasks, currentCol) => {
      if (colTasks.length === 0) {
        return `<div class="p-3 text-center text-muted small bg-light-subtle rounded-3 border border-dashed">কোনো টাস্ক নেই</div>`;
      }
      return colTasks.map(t => {
        const priorityBadge = t.priority === "Urgent" ? "bg-danger" : t.priority === "High" ? "bg-warning text-dark" : "bg-secondary";
        const prioText = prioMap[t.priority] || t.priority;
        return `
          <div class="card border shadow-sm rounded-3 mb-3 p-3 kanban-card">
            <div class="d-flex justify-content-between align-items-start mb-2">
              <span class="badge ${priorityBadge} fs-11">${prioText}</span>
              <span class="badge bg-light text-secondary border fs-11">${LifeUtils.escapeHtml(t.category || "সাধারণ")}</span>
            </div>
            <h6 class="fw-bold fs-14 mb-1">${LifeUtils.escapeHtml(t.title)}</h6>
            ${t.description ? `<p class="text-muted small mb-2">${LifeUtils.escapeHtml(t.description)}</p>` : ""}
            <div class="d-flex justify-content-between align-items-center text-muted small mt-2 pt-2 border-top">
              <span><i class="bi bi-calendar"></i> ${LifeUtils.formatDate(t.dueDate, "DD MMM")}</span>
              <div class="btn-group btn-group-sm">
                ${currentCol !== "todo" ? `<button class="btn btn-link text-secondary p-0 me-2 btn-move-task-status" data-id="${t.id}" data-status="todo" title="করতে হবে-তে সরান"><i class="bi bi-arrow-left-circle"></i></button>` : ""}
                ${currentCol !== "in_progress" ? `<button class="btn btn-link text-primary p-0 me-2 btn-move-task-status" data-id="${t.id}" data-status="in_progress" title="চলমান-এ সরান"><i class="bi bi-arrow-right-circle"></i></button>` : ""}
                ${currentCol !== "completed" ? `<button class="btn btn-link text-success p-0 btn-move-task-status" data-id="${t.id}" data-status="completed" title="সম্পন্ন করুন"><i class="bi bi-check-circle"></i></button>` : ""}
              </div>
            </div>
          </div>
        `;
      }).join("");
    };

    $("#kanban-col-todo").html(renderColumnCards(todoTasks, "todo"));
    $("#kanban-col-inprog").html(renderColumnCards(inProgTasks, "in_progress"));
    $("#kanban-col-done").html(renderColumnCards(doneTasks, "completed"));
  }

  function saveTaskForm() {
    const title = $("#task-form-title").val().trim();
    const description = $("#task-form-desc").val().trim();
    const dueDate = $("#task-form-date").val() || LifeUtils.CURRENT_DEMO_DATE;
    const dueTime = $("#task-form-time").val() || "17:00";
    const priority = $("#task-form-priority").val();
    const category = $("#task-form-category").val();
    const status = $("#task-form-status").val() || "todo";
    const notes = $("#task-form-notes").val().trim();

    if (!title) {
      window.Swal.fire({ icon: "warning", title: "ভুল তথ্য", text: "অনুগ্রহ করে টাস্কের শিরোনাম লিখুন।" });
      return;
    }

    LifeStorage.addTask({
      title,
      description,
      dueDate,
      dueTime,
      priority,
      category,
      status,
      notes
    });

    bootstrap.Modal.getInstance(document.getElementById("modal-task")).hide();
    window.Swal.fire({ icon: "success", title: "টাস্ক তৈরি হয়েছে!", timer: 1500, showConfirmButton: false, toast: true });
  }

  return {
    init,
    render
  };
})();

if (typeof window !== "undefined") {
  window.LifeTasks = LifeTasks;
}
