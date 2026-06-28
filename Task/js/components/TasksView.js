// Tasks View Component (UI Module)
// Implements robust List, Grid, Kanban, Timeline, and Calendar boards.
// Globally Scoped.

window.TasksView = class TasksView {
  constructor(app) {
    this.app = app;
    this.activeSubView = 'list';
    this.filters = {
      search: '',
      due: '',
      priority: '',
      status: '',
      category: '',
      sortBy: 'dueDate'
    };
    this.selectedTasks = new Set();
  }

  render(container) {
    const list = window.taskService.getFilteredTasks(this.filters);
    
    container.innerHTML = `
      <div class="container-fluid py-4">
        <!-- Dashboard title area -->
        <div class="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
          <div>
            <h2 class="font-bold mb-1">Task Board</h2>
            <p class="text-muted text-sm mb-0">Organize and manage your targets using advanced boards.</p>
          </div>
          
          <div class="d-flex gap-2">
            <!-- View Mode selector tabs -->
            <div class="btn-group" role="group">
              <button class="btn btn-outline-secondary btn-sm active-tab-btn" data-subview="list" title="List View"><i class="bi bi-list-task"></i></button>
              <button class="btn btn-outline-secondary btn-sm active-tab-btn" data-subview="grid" title="Grid View"><i class="bi bi-grid-3x3-gap-fill"></i></button>
              <button class="btn btn-outline-secondary btn-sm active-tab-btn" data-subview="kanban" title="Kanban Board"><i class="bi bi-kanban"></i></button>
              <button class="btn btn-outline-secondary btn-sm active-tab-btn" data-subview="timeline" title="Timeline Tree"><i class="bi bi-clock-history"></i></button>
              <button class="btn btn-outline-secondary btn-sm active-tab-btn" data-subview="calendar" title="Calendar View"><i class="bi bi-calendar3"></i></button>
            </div>
            
            <button class="btn btn-primary btn-sm font-semibold px-3" id="task-add-new-btn">
              <i class="bi bi-plus-lg"></i> New Task
            </button>
          </div>
        </div>

        <!-- Filter / Search controls -->
        <div class="premium-card p-3 mb-4">
          <div class="row g-3 align-items-center">
            <div class="col-md-3">
              <div class="input-group input-group-sm">
                <span class="input-group-text bg-transparent border-end-0"><i class="bi bi-search text-muted"></i></span>
                <input type="text" id="task-search-input" class="form-control border-start-0" placeholder="Search tasks..." value="${this.filters.search}">
              </div>
            </div>
            <div class="col-md-2">
              <select id="task-filter-due" class="form-select form-select-sm">
                <option value="">All Deadlines</option>
                <option value="today" ${this.filters.due === 'today' ? 'selected' : ''}>Due Today</option>
                <option value="tomorrow" ${this.filters.due === 'tomorrow' ? 'selected' : ''}>Due Tomorrow</option>
                <option value="upcoming" ${this.filters.due === 'upcoming' ? 'selected' : ''}>Upcoming</option>
                <option value="overdue" ${this.filters.due === 'overdue' ? 'selected' : ''}>Overdue</option>
              </select>
            </div>
            <div class="col-md-2">
              <select id="task-filter-priority" class="form-select form-select-sm">
                <option value="">All Priorities</option>
                <option value="low" ${this.filters.priority === 'low' ? 'selected' : ''}>Low</option>
                <option value="medium" ${this.filters.priority === 'medium' ? 'selected' : ''}>Medium</option>
                <option value="high" ${this.filters.priority === 'high' ? 'selected' : ''}>High</option>
              </select>
            </div>
            <div class="col-md-2">
              <select id="task-filter-category" class="form-select form-select-sm">
                <option value="">All Categories</option>
                <option value="work" ${this.filters.category === 'work' ? 'selected' : ''}>Work</option>
                <option value="personal" ${this.filters.category === 'personal' ? 'selected' : ''}>Personal</option>
                <option value="learning" ${this.filters.category === 'learning' ? 'selected' : ''}>Learning</option>
              </select>
            </div>
            <div class="col-md-2">
              <select id="task-sort-by" class="form-select form-select-sm">
                <option value="dueDate" ${this.filters.sortBy === 'dueDate' ? 'selected' : ''}>Sort by Due Date</option>
                <option value="priority" ${this.filters.sortBy === 'priority' ? 'selected' : ''}>Sort by Priority</option>
                <option value="title" ${this.filters.sortBy === 'title' ? 'selected' : ''}>Sort by Name</option>
              </select>
            </div>
            <div class="col-md-1 text-end">
              <button class="btn btn-outline-secondary btn-sm w-100" id="task-filters-clear-btn" title="Reset Filters"><i class="bi bi-arrow-counterclockwise"></i></button>
            </div>
          </div>
        </div>

        <!-- Bulk Action Panel -->
        <div id="task-bulk-bar" class="alert alert-primary py-2 px-3 mb-4 align-items-center justify-content-between" style="display: none; border-radius:10px;">
          <div class="text-sm font-semibold">
            <span id="task-bulk-count">0</span> tasks selected
          </div>
          <div class="d-flex gap-2">
            <button class="btn btn-xs btn-light text-primary font-semibold text-xs task-bulk-action" data-action="status-completed">Mark Completed</button>
            <button class="btn btn-xs btn-light text-primary font-semibold text-xs task-bulk-action" data-action="status-todo">Move to To-do</button>
            <button class="btn btn-xs btn-light text-danger font-semibold text-xs task-bulk-action" data-action="delete">Delete Selected</button>
          </div>
        </div>

        <!-- Sub-view content mount frame -->
        <div id="tasks-board-viewport"></div>
      </div>
    `;

    this.renderSubView(container, list);
  }

  init(container) {
    // 1. Hook Subviews buttons clicks
    container.querySelectorAll('.active-tab-btn').forEach(btn => {
      const subview = btn.getAttribute('data-subview');
      if (subview === this.activeSubView) {
        btn.classList.replace('btn-outline-secondary', 'btn-secondary');
      }
      btn.addEventListener('click', () => {
        container.querySelectorAll('.active-tab-btn').forEach(b => b.classList.replace('btn-secondary', 'btn-outline-secondary'));
        btn.classList.replace('btn-outline-secondary', 'btn-secondary');
        this.activeSubView = subview;
        const list = window.taskService.getFilteredTasks(this.filters);
        this.renderSubView(container, list);
        this.initSubViewBehaviors(container, list);
      });
    });

    // 2. Add New Task click
    container.querySelector('#task-add-new-btn').addEventListener('click', () => {
      this.openTaskEditDrawer(null);
    });

    // 3. Filters triggers
    const search = container.querySelector('#task-search-input');
    search.addEventListener('input', () => {
      this.filters.search = search.value;
      this.refreshBoard(container);
    });

    const due = container.querySelector('#task-filter-due');
    due.addEventListener('change', () => {
      this.filters.due = due.value;
      this.refreshBoard(container);
    });

    const prio = container.querySelector('#task-filter-priority');
    prio.addEventListener('change', () => {
      this.filters.priority = prio.value;
      this.refreshBoard(container);
    });

    const cat = container.querySelector('#task-filter-category');
    cat.addEventListener('change', () => {
      this.filters.category = cat.value;
      this.refreshBoard(container);
    });

    const sort = container.querySelector('#task-sort-by');
    sort.addEventListener('change', () => {
      this.filters.sortBy = sort.value;
      this.refreshBoard(container);
    });

    // Clear filters
    container.querySelector('#task-filters-clear-btn').addEventListener('click', () => {
      this.filters = { search: '', due: '', priority: '', status: '', category: '', sortBy: 'dueDate' };
      this.render(container);
      this.init(container);
    });

    const list = window.taskService.getFilteredTasks(this.filters);
    this.initSubViewBehaviors(container, list);
  }

  refreshBoard(container) {
    const list = window.taskService.getFilteredTasks(this.filters);
    this.renderSubView(container, list);
    this.initSubViewBehaviors(container, list);
  }

  renderSubView(container, list) {
    const viewport = container.querySelector('#tasks-board-viewport');
    
    if (list.length === 0) {
      viewport.innerHTML = `
        <div class="text-center py-5">
          <i class="bi bi-inbox text-muted" style="font-size: 3.5rem;"></i>
          <h5 class="font-bold text-muted mt-3">No tasks matching filters.</h5>
          <p class="text-muted text-xs">Create a new task to get started.</p>
        </div>
      `;
      return;
    }

    if (this.activeSubView === 'list') {
      viewport.innerHTML = `
        <div class="premium-card p-0 overflow-hidden">
          <table class="table table-hover align-middle mb-0 text-sm">
            <thead class="table-light">
              <tr>
                <th width="40" class="ps-3"><input type="checkbox" id="bulk-toggle-all"></th>
                <th>Task Title</th>
                <th>Due Date</th>
                <th>Priority</th>
                <th>Category</th>
                <th>Progress</th>
                <th>Status</th>
                <th width="80" class="pe-3">Action</th>
              </tr>
            </thead>
            <tbody>
              ${list.map(t => {
                const checked = this.selectedTasks.has(t.id) ? 'checked' : '';
                const progressClass = t.status === 'completed' ? 'bg-success' : 'bg-primary';
                const statusBadge = {
                  todo: '<span class="badge bg-secondary text-capitalize">To-do</span>',
                  'in-progress': '<span class="badge bg-primary text-capitalize">In Progress</span>',
                  review: '<span class="badge bg-warning text-capitalize">In Review</span>',
                  completed: '<span class="badge bg-success text-capitalize">Completed</span>'
                }[t.status] || `<span class="badge bg-secondary">${t.status}</span>`;

                return `
                  <tr class="task-row cursor-pointer" data-id="${t.id}">
                    <td class="ps-3 select-cell" onclick="event.stopPropagation()">
                      <input type="checkbox" class="task-select-chk" data-id="${t.id}" ${checked}>
                    </td>
                    <td>
                      <div class="font-semibold text-main">${t.title}</div>
                      <div class="text-xs text-muted text-truncate" style="max-width:320px;">${t.description || 'No description added'}</div>
                    </td>
                    <td class="text-muted">${t.dueDate ? t.dueDate + (t.dueTime ? ' ' + t.dueTime : '') : 'No date'}</td>
                    <td><span class="badge badge-priority-${t.priority} text-capitalize">${t.priority}</span></td>
                    <td><span class="badge bg-light text-dark text-capitalize border">${t.category}</span></td>
                    <td width="150">
                      <div class="d-flex align-items-center gap-2">
                        <div class="progress flex-grow-1" style="height: 6px; border-radius:3px;">
                          <div class="progress-bar ${progressClass}" style="width:${t.progress || 0}%;"></div>
                        </div>
                        <span class="text-xs font-semibold text-muted">${t.progress || 0}%</span>
                      </div>
                    </td>
                    <td>${statusBadge}</td>
                    <td class="pe-3 action-cell" onclick="event.stopPropagation()">
                      <div class="d-flex gap-1">
                        <button class="btn btn-sm btn-outline-secondary p-1 task-row-edit" data-id="${t.id}"><i class="bi bi-pencil-fill"></i></button>
                        <button class="btn btn-sm btn-outline-danger p-1 task-row-delete" data-id="${t.id}"><i class="bi bi-trash-fill"></i></button>
                      </div>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      `;
    } else if (this.activeSubView === 'grid') {
      viewport.innerHTML = `
        <div class="row g-4">
          ${list.map(t => {
            const statusClass = {
              todo: 'border-secondary',
              'in-progress': 'border-primary',
              review: 'border-warning',
              completed: 'border-success'
            }[t.status] || 'border-light';

            return `
              <div class="col-md-4">
                <div class="premium-card h-100 d-flex flex-column task-card border-top border-4 ${statusClass}" data-id="${t.id}" style="cursor:pointer;">
                  <div class="d-flex justify-content-between align-items-start mb-2">
                    <span class="badge text-capitalize badge-priority-${t.priority}">${t.priority}</span>
                    <span class="badge bg-light text-dark text-capitalize border">${t.category}</span>
                  </div>
                  <h5 class="font-bold text-main mb-2">${t.title}</h5>
                  <p class="text-muted text-xs flex-grow-1" style="display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden;">${t.description || 'No description.'}</p>
                  
                  <div class="d-flex align-items-center justify-content-between mt-3 pt-2 border-top text-xs text-muted">
                    <span><i class="bi bi-calendar-event"></i> ${t.dueDate || 'No Date'}</span>
                    <span><i class="bi bi-diagram-3"></i> ${t.checklist.length} items</span>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `;
    } else if (this.activeSubView === 'kanban') {
      const cols = ['todo', 'in-progress', 'review', 'completed'];
      const getColTitle = (c) => ({ todo: 'To Do', 'in-progress': 'In Progress', review: 'In Review', completed: 'Completed' }[c]);
      
      viewport.innerHTML = `
        <div class="kanban-board">
          ${cols.map(col => {
            const cards = list.filter(t => t.status === col);
            return `
              <div class="kanban-col">
                <div class="kanban-col-header">
                  <span class="kanban-col-title">${getColTitle(col)}</span>
                  <span class="kanban-count">${cards.length}</span>
                </div>
                <div class="kanban-cards" data-status="${col}">
                  ${cards.map(t => `
                    <div class="kanban-card" data-id="${t.id}">
                      <div class="d-flex justify-content-between mb-2">
                        <span class="badge text-xs badge-priority-${t.priority}">${t.priority}</span>
                        <span class="badge bg-light text-dark text-xs border text-capitalize">${t.category}</span>
                      </div>
                      <div class="kanban-card-title text-main">${t.title}</div>
                      ${t.dueDate ? `<div class="text-2xs text-muted"><i class="bi bi-calendar-event"></i> ${t.dueDate}</div>` : ''}
                      <div class="kanban-card-meta">
                        <span><i class="bi bi-check2-all"></i> ${t.checklist.filter(i => i.checked).length}/${t.checklist.length}</span>
                        <div class="progress" style="width: 60px; height: 4px; border-radius:2px;">
                          <div class="progress-bar bg-success" style="width:${t.progress}%"></div>
                        </div>
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `;
    } else if (this.activeSubView === 'timeline') {
      const grouped = {};
      list.forEach(t => {
        const d = t.dueDate || 'No Target Date';
        if (!grouped[d]) grouped[d] = [];
        grouped[d].push(t);
      });
      const sortedKeys = Object.keys(grouped).sort();

      viewport.innerHTML = `
        <div class="container py-2">
          <div class="timeline" style="border-left: 2px solid var(--border-card); margin-left: 20px; padding-left: 20px; position:relative;">
            ${sortedKeys.map(dateKey => `
              <div class="timeline-date-group mb-4" style="position:relative;">
                <div style="position:absolute; left:-31px; top:4px; width:20px; height:20px; border-radius:50%; background:var(--primary-color); border:4px solid var(--bg-card); box-shadow:var(--shadow-sm);"></div>
                <h5 class="font-bold text-primary mb-3">${dateKey === 'No Target Date' ? dateKey : new Date(dateKey).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}</h5>
                
                <div class="row g-3">
                  ${grouped[dateKey].map(t => `
                    <div class="col-md-6">
                      <div class="premium-card p-3 task-row" data-id="${t.id}" style="cursor:pointer;">
                        <div class="d-flex justify-content-between mb-2">
                          <span class="badge badge-priority-${t.priority}">${t.priority}</span>
                          <span class="text-muted text-xs">${t.status.toUpperCase()}</span>
                        </div>
                        <h6 class="font-bold text-main mb-1">${t.title}</h6>
                        <p class="text-muted text-xs mb-0 text-truncate">${t.description || 'No description'}</p>
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    } else if (this.activeSubView === 'calendar') {
      viewport.innerHTML = `
        <div class="premium-card p-3">
          <div id="tasks-mini-calendar" class="row text-center font-semibold text-sm"></div>
        </div>
      `;
    }
  }

  initSubViewBehaviors(container, list) {
    container.querySelectorAll('.task-row, .task-card, .kanban-card').forEach(el => {
      el.addEventListener('click', (e) => {
        if (e.target.closest('.action-cell') || e.target.closest('.select-cell')) return;
        const id = el.getAttribute('data-id');
        this.openTaskEditDrawer(id);
      });
    });

    container.querySelectorAll('.task-row-edit').forEach(btn => {
      btn.addEventListener('click', () => {
        this.openTaskEditDrawer(btn.getAttribute('data-id'));
      });
    });

    container.querySelectorAll('.task-row-delete').forEach(btn => {
      btn.addEventListener('click', () => {
        if (confirm("Are you sure you want to delete this task?")) {
          window.taskService.deleteTask(btn.getAttribute('data-id'));
          window.notificationService.showToast('Task deleted successfully', 'success');
          this.render(container);
          this.init(container);
        }
      });
    });

    const selectAll = container.querySelector('#bulk-toggle-all');
    if (selectAll) {
      selectAll.addEventListener('change', () => {
        const checks = container.querySelectorAll('.task-select-chk');
        checks.forEach(chk => {
          chk.checked = selectAll.checked;
          const id = chk.getAttribute('data-id');
          if (selectAll.checked) this.selectedTasks.add(id);
          else this.selectedTasks.delete(id);
        });
        this.updateBulkPanel(container);
      });
    }

    container.querySelectorAll('.task-select-chk').forEach(chk => {
      chk.addEventListener('change', () => {
        const id = chk.getAttribute('data-id');
        if (chk.checked) this.selectedTasks.add(id);
        else this.selectedTasks.delete(id);
        this.updateBulkPanel(container);
      });
    });

    container.querySelectorAll('.task-bulk-action').forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.getAttribute('data-action');
        if (action === 'delete') {
          if (confirm(`Delete ${this.selectedTasks.size} selected tasks?`)) {
            this.selectedTasks.forEach(id => window.taskService.deleteTask(id));
            window.notificationService.showToast('Bulk tasks deleted', 'success');
          }
        } else if (action === 'status-completed') {
          this.selectedTasks.forEach(id => window.taskService.updateTask(id, { status: 'completed', progress: 100 }));
          window.notificationService.showToast('Bulk tasks marked completed', 'success');
        } else if (action === 'status-todo') {
          this.selectedTasks.forEach(id => window.taskService.updateTask(id, { status: 'todo', progress: 0 }));
          window.notificationService.showToast('Bulk tasks moved to To-do', 'success');
        }

        this.selectedTasks.clear();
        this.render(container);
        this.init(container);
      });
    });

    if (this.activeSubView === 'kanban' && window.Sortable) {
      container.querySelectorAll('.kanban-cards').forEach(el => {
        new Sortable(el, {
          group: 'kanban',
          animation: 150,
          ghostClass: 'kanban-ghost-card',
          onEnd: (evt) => {
            const taskId = evt.item.getAttribute('data-id');
            const newStatus = evt.to.getAttribute('data-status');
            window.taskService.updateTask(taskId, { status: newStatus });
            this.refreshBoard(container);
          }
        });
      });
    }

    if (this.activeSubView === 'calendar') {
      this.renderMiniTasksCalendar(container, list);
    }
  }

  updateBulkPanel(container) {
    const bar = container.querySelector('#task-bulk-bar');
    const count = container.querySelector('#task-bulk-count');
    if (!bar) return;

    if (this.selectedTasks.size > 0) {
      bar.style.display = 'flex';
      count.textContent = this.selectedTasks.size;
    } else {
      bar.style.display = 'none';
    }
  }

  renderMiniTasksCalendar(container, list) {
    const gridEl = container.querySelector('#tasks-mini-calendar');
    if (!gridEl) return;

    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();

    let gridHtml = `
      <div class="col-12 mb-3">
        <h5 class="font-bold text-primary mb-0">${today.toLocaleString('default', { month: 'long' })} ${currentYear}</h5>
      </div>
      <div class="col-12">
        <div class="row g-1 text-muted text-xs mb-2">
          <div class="col" style="width:14%">Sun</div><div class="col" style="width:14%">Mon</div>
          <div class="col" style="width:14%">Tue</div><div class="col" style="width:14%">Wed</div>
          <div class="col" style="width:14%">Thu</div><div class="col" style="width:14%">Fri</div>
          <div class="col" style="width:14%">Sat</div>
        </div>
      </div>
    `;

    gridHtml += '<div class="col-12"><div class="row g-1">';
    
    for (let i = 0; i < firstDay; i++) {
      gridHtml += `<div class="col p-2 text-muted text-2xs" style="width:14%; min-height:80px; background-color:var(--bg-hover); opacity:0.3;"></div>`;
    }

    for (let day = 1; day <= totalDays; day++) {
      const dateStr = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      const dayTasks = list.filter(t => t.dueDate === dateStr);
      
      const isToday = day === today.getDate() ? 'border border-primary' : '';
      const dotHtml = dayTasks.map(t => `<div style="width:5px; height:5px; border-radius:50%; background-color:${t.color || '#3b82f6'}; margin: 1px auto 0;"></div>`).join('');

      gridHtml += `
        <div class="col p-2 border-end border-bottom mini-cal-day cursor-pointer ${isToday}" data-date="${dateStr}" style="width:14%; min-height:80px; background-color:var(--bg-card);">
          <div class="font-bold text-xs">${day}</div>
          <div class="mt-1">${dotHtml}</div>
        </div>
      `;
    }

    gridHtml += '</div></div>';
    gridEl.innerHTML = gridHtml;

    gridEl.querySelectorAll('.mini-cal-day').forEach(cell => {
      cell.addEventListener('click', () => {
        const d = cell.getAttribute('data-date');
        this.openTaskEditDrawer(null, { dueDate: d });
      });
    });
  }

  openTaskEditDrawer(taskId, prefilledFields = {}) {
    const isNew = !taskId;
    const task = isNew ? {
      title: '', description: '', priority: 'medium', status: 'todo', category: 'work',
      tags: [], estimatedTime: '', dueDate: prefilledFields.dueDate || '', dueTime: '', progress: 0,
      checklist: [], subtasks: [], attachments: [], color: '#3b82f6', repeat: 'none', notes: '', history: []
    } : window.taskService.getTaskById(taskId);

    if (!task) return;

    const titleText = isNew ? "Create New Task" : "Edit Task Configurations";
    const historyLogsHtml = task.history.map(h => `
      <div class="py-1 border-bottom text-xs">
        <span class="text-muted font-semibold">${new Date(h.timestamp).toLocaleString()}</span> - <span>${h.text}</span>
      </div>
    `).join('');

    const checklistHtml = task.checklist.map(item => `
      <div class="d-flex align-items-center gap-2 mb-2 checklist-item-row" data-id="${item.id}">
        <input type="checkbox" class="form-check-input check-sub-item-chk" ${item.checked ? 'checked' : ''}>
        <input type="text" class="form-control form-control-sm border-0 bg-transparent flex-grow-1" value="${item.text}">
        <button type="button" class="btn btn-sm btn-link text-danger p-0 delete-chk-row"><i class="bi bi-x-lg"></i></button>
      </div>
    `).join('');

    const subtasksHtml = task.subtasks.map(sub => `
      <div class="d-flex align-items-center gap-2 mb-2 subtask-item-row" data-id="${sub.id}">
        <input type="checkbox" class="form-check-input subtask-chk" ${sub.checked ? 'checked' : ''}>
        <input type="text" class="form-control form-control-sm border-0 bg-transparent flex-grow-1" value="${sub.title}">
        <button type="button" class="btn btn-sm btn-link text-danger p-0 delete-sub-row"><i class="bi bi-x-lg"></i></button>
      </div>
    `).join('');

    const html = `
      <form id="drawer-task-edit-form" class="text-sm">
        <div class="mb-3">
          <label class="form-label font-semibold text-xs text-uppercase">Task Title</label>
          <input type="text" id="edit-task-title" class="form-control font-bold" value="${task.title}" required placeholder="Name this task...">
        </div>
        
        <div class="mb-3">
          <label class="form-label font-semibold text-xs text-uppercase">Description</label>
          <textarea id="edit-task-desc" class="form-control text-xs" rows="3" placeholder="Provide description...">${task.description || ''}</textarea>
        </div>

        <div class="row g-2 mb-3">
          <div class="col-6">
            <label class="form-label font-semibold text-xs text-uppercase">Priority</label>
            <select id="edit-task-priority" class="form-select text-xs">
              <option value="low" ${task.priority === 'low' ? 'selected' : ''}>Low</option>
              <option value="medium" ${task.priority === 'medium' ? 'selected' : ''}>Medium</option>
              <option value="high" ${task.priority === 'high' ? 'selected' : ''}>High</option>
            </select>
          </div>
          <div class="col-6">
            <label class="form-label font-semibold text-xs text-uppercase">Status</label>
            <select id="edit-task-status" class="form-select text-xs">
              <option value="todo" ${task.status === 'todo' ? 'selected' : ''}>To-do</option>
              <option value="in-progress" ${task.status === 'in-progress' ? 'selected' : ''}>In Progress</option>
              <option value="review" ${task.status === 'review' ? 'selected' : ''}>In Review</option>
              <option value="completed" ${task.status === 'completed' ? 'selected' : ''}>Completed</option>
            </select>
          </div>
        </div>

        <div class="row g-2 mb-3">
          <div class="col-6">
            <label class="form-label font-semibold text-xs text-uppercase">Due Date</label>
            <input type="date" id="edit-task-date" class="form-control text-xs" value="${task.dueDate || ''}">
          </div>
          <div class="col-6">
            <label class="form-label font-semibold text-xs text-uppercase">Due Time</label>
            <input type="time" id="edit-task-time" class="form-control text-xs" value="${task.dueTime || ''}">
          </div>
        </div>

        <div class="row g-2 mb-3">
          <div class="col-6">
            <label class="form-label font-semibold text-xs text-uppercase">Category</label>
            <select id="edit-task-category" class="form-select text-xs">
              <option value="work" ${task.category === 'work' ? 'selected' : ''}>Work</option>
              <option value="personal" ${task.category === 'personal' ? 'selected' : ''}>Personal</option>
              <option value="learning" ${task.category === 'learning' ? 'selected' : ''}>Learning</option>
            </select>
          </div>
          <div class="col-6">
            <label class="form-label font-semibold text-xs text-uppercase">Estimated Time</label>
            <input type="text" id="edit-task-est" class="form-control text-xs" placeholder="e.g. 2h, 45m" value="${task.estimatedTime || ''}">
          </div>
        </div>

        <div class="mb-3">
          <label class="form-label font-semibold text-xs text-uppercase">Color Label</label>
          <div class="d-flex gap-2">
            ${['#3b82f6', '#8b5cf6', '#10b981', '#f97316', '#ef4444', '#64748b'].map(c => `
              <div class="color-picker-dot cursor-pointer" data-color="${c}" style="width:24px; height:24px; border-radius:50%; background-color:${c}; border: ${task.color === c ? '3px solid #000' : 'none'};"></div>
            `).join('')}
          </div>
        </div>

        <div class="mb-3 premium-card p-3">
          <label class="form-label font-semibold text-xs text-uppercase mb-2">Checklist items</label>
          <div id="edit-checklist-container">${checklistHtml}</div>
          <button type="button" class="btn btn-xs btn-outline-secondary font-semibold text-xs mt-2" id="add-chk-row-btn">+ Add Item</button>
        </div>

        <div class="mb-3 premium-card p-3">
          <label class="form-label font-semibold text-xs text-uppercase mb-2">Subtasks</label>
          <div id="edit-subtasks-container">${subtasksHtml}</div>
          <button type="button" class="btn btn-xs btn-outline-secondary font-semibold text-xs mt-2" id="add-subtask-row-btn">+ Add Subtask</button>
        </div>

        <div class="mb-3 premium-card p-3">
          <label class="form-label font-semibold text-xs text-uppercase mb-1">Attachments</label>
          <div id="edit-attachments-list" class="mb-2">
            ${task.attachments.map(a => `<div class="text-xs border p-1 rounded mb-1 d-flex justify-content-between"><span>${a.name} (${a.size})</span> <button class="btn btn-link p-0 text-danger text-xs delete-att-btn" type="button"><i class="bi bi-trash"></i></button></div>`).join('')}
          </div>
          <input type="file" id="edit-task-file" class="form-control form-control-sm text-xs">
        </div>

        <div class="mb-3">
          <label class="form-label font-semibold text-xs text-uppercase">Internal Notes</label>
          <textarea id="edit-task-notes" class="form-control text-xs" rows="2" placeholder="Private annotations...">${task.notes || ''}</textarea>
        </div>

        <button type="submit" class="btn btn-primary w-100 font-semibold mb-3">Save Configurations</button>
        ${!isNew ? `<button type="button" class="btn btn-outline-danger w-100 font-semibold mb-4" id="drawer-delete-task-btn">Delete Task</button>` : ''}

        ${!isNew ? `
          <div class="mt-4">
            <h6 class="font-bold text-xs text-uppercase mb-2 border-top pt-3">Change log history</h6>
            <div class="overflow-y-auto" style="max-height:150px;">${historyLogsHtml}</div>
          </div>
        ` : ''}
      </form>
    `;

    this.app.openDrawer(titleText, html, (content) => {
      let selectedColor = task.color;

      content.querySelectorAll('.color-picker-dot').forEach(dot => {
        dot.addEventListener('click', () => {
          content.querySelectorAll('.color-picker-dot').forEach(d => d.style.border = 'none');
          dot.style.border = '3px solid #000';
          selectedColor = dot.getAttribute('data-color');
        });
      });

      const chkContainer = content.querySelector('#edit-checklist-container');
      content.querySelector('#add-chk-row-btn').addEventListener('click', () => {
        const row = document.createElement('div');
        row.className = 'd-flex align-items-center gap-2 mb-2 checklist-item-row';
        row.setAttribute('data-id', 'chk_' + Date.now());
        row.innerHTML = `
          <input type="checkbox" class="form-check-input check-sub-item-chk">
          <input type="text" class="form-control form-control-sm border-0 bg-transparent flex-grow-1" placeholder="Task item checklist details..." required>
          <button type="button" class="btn btn-sm btn-link text-danger p-0 delete-chk-row"><i class="bi bi-x-lg"></i></button>
        `;
        chkContainer.appendChild(row);
        row.querySelector('.delete-chk-row').addEventListener('click', () => row.remove());
      });

      const subContainer = content.querySelector('#edit-subtasks-container');
      content.querySelector('#add-subtask-row-btn').addEventListener('click', () => {
        const row = document.createElement('div');
        row.className = 'd-flex align-items-center gap-2 mb-2 subtask-item-row';
        row.setAttribute('data-id', 'sub_' + Date.now());
        row.innerHTML = `
          <input type="checkbox" class="form-check-input subtask-chk">
          <input type="text" class="form-control form-control-sm border-0 bg-transparent flex-grow-1" placeholder="Subtask name..." required>
          <button type="button" class="btn btn-sm btn-link text-danger p-0 delete-sub-row"><i class="bi bi-x-lg"></i></button>
        `;
        subContainer.appendChild(row);
        row.querySelector('.delete-sub-row').addEventListener('click', () => row.remove());
      });

      content.querySelectorAll('.delete-chk-row').forEach(b => b.addEventListener('click', () => b.closest('.checklist-item-row').remove()));
      content.querySelectorAll('.delete-sub-row').forEach(b => b.addEventListener('click', () => b.closest('.subtask-item-row').remove()));

      const fileInput = content.querySelector('#edit-task-file');
      const attachmentsList = content.querySelector('#edit-attachments-list');
      const uploadedAttachments = [...task.attachments];

      fileInput.addEventListener('change', () => {
        const file = fileInput.files[0];
        if (file) {
          const item = { name: file.name, size: Math.round(file.size / 1024) + ' KB', type: file.type };
          uploadedAttachments.push(item);
          
          const div = document.createElement('div');
          div.className = 'text-xs border p-1 rounded mb-1 d-flex justify-content-between';
          div.innerHTML = `<span>${item.name} (${item.size})</span> <button class="btn btn-link p-0 text-danger text-xs delete-att-btn" type="button"><i class="bi bi-trash"></i></button>`;
          attachmentsList.appendChild(div);

          div.querySelector('.delete-att-btn').addEventListener('click', () => {
            const index = uploadedAttachments.indexOf(item);
            if (index > -1) uploadedAttachments.splice(index, 1);
            div.remove();
          });
        }
      });

      const deleteBtn = content.querySelector('#drawer-delete-task-btn');
      if (deleteBtn) {
        deleteBtn.addEventListener('click', () => {
          if (confirm("Delete this task?")) {
            window.taskService.deleteTask(taskId);
            window.notificationService.showToast('Task removed', 'success');
            this.app.closeDrawer();
            this.refreshBoard(document.getElementById('app-view-container'));
          }
        });
      }

      content.querySelector('#drawer-task-edit-form').addEventListener('submit', (e) => {
        e.preventDefault();

        const checklist = [];
        content.querySelectorAll('.checklist-item-row').forEach(row => {
          checklist.push({
            id: row.getAttribute('data-id'),
            checked: row.querySelector('.check-sub-item-chk').checked,
            text: row.querySelector('input[type="text"]').value
          });
        });

        const subtasks = [];
        content.querySelectorAll('.subtask-item-row').forEach(row => {
          subtasks.push({
            id: row.getAttribute('data-id'),
            checked: row.querySelector('.subtask-chk').checked,
            title: row.querySelector('input[type="text"]').value
          });
        });

        const updatedFields = {
          title: content.querySelector('#edit-task-title').value,
          description: content.querySelector('#edit-task-desc').value,
          priority: content.querySelector('#edit-task-priority').value,
          status: content.querySelector('#edit-task-status').value,
          dueDate: content.querySelector('#edit-task-date').value,
          dueTime: content.querySelector('#edit-task-time').value,
          category: content.querySelector('#edit-task-category').value,
          estimatedTime: content.querySelector('#edit-task-est').value,
          notes: content.querySelector('#edit-task-notes').value,
          color: selectedColor,
          checklist,
          subtasks,
          attachments: uploadedAttachments
        };

        const completedChecklist = checklist.filter(c => c.checked).length;
        updatedFields.progress = checklist.length > 0 ? Math.round((completedChecklist / checklist.length) * 100) : (updatedFields.status === 'completed' ? 100 : task.progress);

        if (isNew) {
          window.taskService.addTask(updatedFields);
          window.notificationService.showToast('New task created', 'success');
        } else {
          window.taskService.updateTask(taskId, updatedFields);
          window.notificationService.showToast('Task details saved', 'success');
        }

        this.app.closeDrawer();
        this.refreshBoard(document.getElementById('app-view-container'));
      });
    });
  }

  destroy() {}
}
