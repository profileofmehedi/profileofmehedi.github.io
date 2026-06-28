// Main Application Coordinator & Orchestrator (SPA Controller)
// Manages global themes, authentication blocks, keyboard inputs, and view mounting.
// Globally Scoped (Non-module).

class App {
  constructor() {
    this.currentViewName = null;
    this.currentViewInstance = null;
    
    // View Classes mapped to global window instances (No bookmarks, leetcode, aws study)
    this.viewMap = {
      dashboard: window.DashboardView,
      tasks: window.TasksView,
      reminders: window.RemindersView,
      calendar: window.CalendarView,
      notes: window.NotesView,
      habits: window.HabitsView,
      pomodoro: window.PomodoroView,
      expense: window.ExpenseView,
      analytics: window.AnalyticsView,
      journal: window.JournalView,
      settings: window.SettingsView
    };

    // DOM Bindings
    this.authContainer = document.getElementById('auth-container');
    this.appContainer = document.getElementById('main-app-container');
    this.loginForm = document.getElementById('login-form');
    this.viewFrame = document.getElementById('app-view-container');
    
    // UI Drawer
    this.drawer = document.getElementById('right-drawer-panel');
    this.drawerBackdrop = document.getElementById('drawer-backdrop');
    this.drawerClose = document.getElementById('drawer-close-btn');
    
    // Search Overlay
    this.searchOverlay = document.getElementById('search-overlay-modal');
    this.searchInput = document.getElementById('universal-search-input');
    this.searchResults = document.getElementById('universal-search-results');
  }

  // Kickstart LifeOS
  init() {
    // 1. Storage Seeding
    window.storageService.initialize(window.demoData);

    // 2. Authentication Router Check for Multi-page Application
    const path = window.location.pathname;
    const isAuthPage = path.endsWith('index.html') || path.endsWith('/') || path === '';
    
    if (window.authService.isAuthenticated()) {
      if (isAuthPage) {
        window.location.href = 'dashboard.html';
      } else {
        this.launchApp();
      }
    } else {
      if (!isAuthPage) {
        window.location.href = 'index.html';
      } else {
        this.showAuth();
      }
    }

    // 3. Register Global Event Handlers
    this.registerGlobalEvents();
  }

  showAuth() {
    this.appContainer.style.display = 'none';
    this.authContainer.style.display = 'flex';
    
    // Clean old event listeners by replacing form node
    const oldForm = this.loginForm;
    const newForm = oldForm.cloneNode(true);
    oldForm.parentNode.replaceChild(newForm, oldForm);
    this.loginForm = newForm;

    this.loginForm.addEventListener('submit', (e) => this.handleLogin(e));

    // Bind password visibility toggler
    const toggleBtn = this.loginForm.querySelector('#toggle-password-btn');
    const passInput = this.loginForm.querySelector('#login-password');
    if (toggleBtn && passInput) {
      toggleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const isPass = passInput.type === 'password';
        passInput.type = isPass ? 'text' : 'password';
        toggleBtn.innerHTML = `<i class="bi ${isPass ? 'bi-eye-slash' : 'bi-eye'}"></i>`;
      });
    }
  }

  handleLogin(e) {
    e.preventDefault();
    const u = document.getElementById('login-username').value;
    const p = document.getElementById('login-password').value;
    const remember = document.getElementById('login-remember').checked;

    const res = window.authService.login(u, p, remember);
    if (res.success) {
      window.notificationService.showToast('Login successful! Welcome back.', 'success');
      window.location.href = 'dashboard.html';
    } else {
      window.notificationService.showToast(res.message, 'danger');
    }
  }

  launchApp() {
    this.authContainer.style.display = 'none';
    this.appContainer.style.display = 'flex';

    // Apply Saved Theme Modifiers
    const settings = window.settingsService.getSettings();
    window.settingsService.applyTheme(settings.themeColor, settings.themeMode);
    
    // Sync display mode icon
    this.syncThemeModeIcon(settings.themeMode);

    // Populate Sidebar profile elements
    this.syncProfileUI();
    this.refreshNotificationDropdown();

    // Default View Selection from the current file name (MPA)
    const path = window.location.pathname;
    const filename = path.split('/').pop().replace('.html', '') || 'dashboard';
    const initialView = this.viewMap[filename] ? filename : 'dashboard';
    this.switchView(initialView);

    // Launch Reminders Check Loop (Checks alarms every 5 seconds)
    if (this.remindersInterval) clearInterval(this.remindersInterval);
    this.remindersInterval = setInterval(() => {
      window.reminderService.checkPendingReminders();
    }, 5000);
    
    // Immediate initial check
    window.reminderService.checkPendingReminders();
  }

  syncProfileUI() {
    const user = window.authService.getCurrentUser();
    if (!user) return;
    
    const elements = {
      'user-avatar-sidebar': user.avatar,
      'user-avatar-header': user.avatar,
      'user-name-sidebar': user.displayName,
      'header-user-name': user.displayName
    };

    Object.entries(elements).forEach(([id, val]) => {
      const el = document.getElementById(id);
      if (el) {
        if (el.tagName === 'IMG') el.src = val;
        else el.textContent = val;
      }
    });
  }

  syncThemeModeIcon(mode) {
    const icon = document.getElementById('theme-toggle-mode-icon');
    if (!icon) return;
    
    if (mode === 'dark') {
      icon.className = 'bi bi-sun-fill';
    } else {
      icon.className = 'bi bi-moon-stars-fill';
    }
  }

  refreshSidebarFooter() {
    this.syncProfileUI();
  }

  // Central SPA View Switcher
  switchView(viewName) {
    if (!this.viewMap[viewName]) return;

    // Destroy existing active view timers if any
    if (this.currentViewInstance && typeof this.currentViewInstance.destroy === 'function') {
      this.currentViewInstance.destroy();
    }

    this.currentViewName = viewName;
    const ViewClass = this.viewMap[viewName];
    
    // Highlight sidebar active item
    document.querySelectorAll('.sidebar-menu-item, .mobile-nav-item').forEach(el => {
      if (el.getAttribute('data-view') === viewName) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    });

    // Close mobile offcanvas if open
    document.getElementById('sidebar-panel').classList.remove('show-mobile');
    const sidebarBackdrop = document.getElementById('sidebar-backdrop');
    if (sidebarBackdrop) sidebarBackdrop.classList.remove('show');

    // Mount Skeleton Loader to look professional
    this.viewFrame.innerHTML = `
      <div class="container py-4">
        <div class="row g-4">
          <div class="col-12"><div class="skeleton" style="height: 60px; border-radius: 12px; margin-bottom: 2rem;"></div></div>
          <div class="col-md-4"><div class="skeleton" style="height: 180px; border-radius: 12px;"></div></div>
          <div class="col-md-8"><div class="skeleton" style="height: 180px; border-radius: 12px;"></div></div>
        </div>
      </div>
    `;

    setTimeout(() => {
      this.currentViewInstance = new ViewClass(this);
      this.currentViewInstance.render(this.viewFrame);
      this.currentViewInstance.init(this.viewFrame);
    }, 200); // Gentle lag simulation for skeleton transitions
  }

  // Sliding Drawer Controls
  openDrawer(title, htmlContent, onInitCallback = null) {
    document.getElementById('drawer-title').textContent = title;
    const content = document.getElementById('drawer-content-container');
    content.innerHTML = htmlContent;

    this.drawer.classList.add('open');
    this.drawerBackdrop.classList.add('show');

    if (onInitCallback) {
      onInitCallback(content);
    }
  }

  closeDrawer() {
    this.drawer.classList.remove('open');
    this.drawerBackdrop.classList.remove('show');
  }

  // Global Key listeners & theme selectors
  registerGlobalEvents() {
    // 1. Sidebar Toggle Button
    const toggleBtn = document.getElementById('sidebar-toggle-btn');
    const sidebarBackdrop = document.getElementById('sidebar-backdrop');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        const sidebar = document.getElementById('sidebar-panel');
        // Desktop collapse vs mobile sliding drawer
        if (window.innerWidth <= 768) {
          sidebar.classList.toggle('show-mobile');
          if (sidebarBackdrop) {
            sidebarBackdrop.classList.toggle('show', sidebar.classList.contains('show-mobile'));
          }
        } else {
          sidebar.classList.toggle('collapsed');
        }
      });
    }

    if (sidebarBackdrop) {
      sidebarBackdrop.addEventListener('click', () => {
        document.getElementById('sidebar-panel').classList.remove('show-mobile');
        sidebarBackdrop.classList.remove('show');
      });
    }

    // 2. Sidebar Navigation clicks are handled natively via <a> href links to separate HTML files.

    // Mobile FAB Click -> Opens Quick Add Task modal
    const mobileFab = document.getElementById('mobile-fab-trigger');
    const mobileAdd = document.getElementById('mobile-add-btn-trigger');
    const quickAddTrigger = () => {
      this.openQuickAddDrawer();
    };
    if (mobileFab) mobileFab.addEventListener('click', quickAddTrigger);
    if (mobileAdd) mobileAdd.addEventListener('click', quickAddTrigger);

    // 3. User Menu Logouts
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        window.authService.logout();
        window.notificationService.showToast('Logged out successfully.', 'info');
        window.location.href = 'index.html';
      });
    }

    // 4. Color Theme selector dropdown buttons
    document.querySelectorAll('.color-theme-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const value = btn.getAttribute('data-color');
        window.settingsService.updateSettings({ themeColor: value });
        window.notificationService.showToast('Accent theme color updated', 'success');
      });
    });

    // Dedicated Light/Dark Toggle Button in Top Bar
    const modeToggleBtn = document.getElementById('theme-toggle-mode-btn');
    if (modeToggleBtn) {
      modeToggleBtn.addEventListener('click', () => {
        const settings = window.settingsService.getSettings();
        const currentMode = settings.themeMode || 'dark';
        const newMode = currentMode === 'dark' ? 'light' : 'dark';
        
        window.settingsService.updateSettings({ themeMode: newMode });
        this.syncThemeModeIcon(newMode);
        window.notificationService.showToast(`Switched to ${newMode === 'dark' ? 'Dark' : 'Light'} Mode`, 'info');

        // Also check if current view is settings to sync checkbox state
        const toggleChk = document.getElementById('settings-darkmode-toggle');
        if (toggleChk) {
          toggleChk.checked = (newMode === 'dark');
        }
      });
    }

    // 5. Drawer click closes
    if (this.drawerClose) this.drawerClose.addEventListener('click', () => this.closeDrawer());
    if (this.drawerBackdrop) this.drawerBackdrop.addEventListener('click', () => this.closeDrawer());

    // 6. Keyboard Shortcuts (Ctrl + K, Alt + N, Alt + P)
    window.addEventListener('keydown', (e) => {
      // Escape closes overlays
      if (e.key === 'Escape') {
        this.closeSearch();
        this.closeDrawer();
      }

      // Ctrl + K
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        this.toggleSearch();
      }

      // Alt + N (Quick Task Add)
      if (e.altKey && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        this.openQuickAddDrawer();
      }

      // Alt + P (Switch Pomodoro)
      if (e.altKey && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        window.location.href = 'pomodoro.html';
      }
    });

    // 7. Universal Search events
    const triggerSearch = document.getElementById('search-trigger-btn');
    if (triggerSearch) triggerSearch.addEventListener('click', () => this.toggleSearch());
    
    const searchClose = document.getElementById('search-close-btn');
    if (searchClose) searchClose.addEventListener('click', () => this.closeSearch());

    if (this.searchInput) {
      this.searchInput.addEventListener('input', () => this.executeUniversalSearch());
    }

    // Refresh notifications count listener
    window.addEventListener('lifeos-reminders-updated', () => {
      this.refreshNotificationDropdown();
    });
  }

  // Open Universal Search Overlay
  toggleSearch() {
    this.searchOverlay.style.display = 'flex';
    this.searchInput.value = '';
    this.searchResults.innerHTML = '<p class="text-muted text-center text-sm py-4 my-0">Type to search tasks, notes, reminders, etc...</p>';
    this.searchInput.focus();
  }

  closeSearch() {
    this.searchOverlay.style.display = 'none';
  }

  // Execute unified search over all data arrays
  executeUniversalSearch() {
    const query = this.searchInput.value.toLowerCase().trim();
    if (!query) {
      this.searchResults.innerHTML = '<p class="text-muted text-center text-sm py-4 my-0">Type to search...</p>';
      return;
    }

    const results = [];

    // Search tasks
    const tasks = window.storageService.get('tasks') || [];
    tasks.filter(t => t.title.toLowerCase().includes(query) || t.description.toLowerCase().includes(query)).forEach(t => {
      results.push({ title: t.title, sub: `Task | Priority: ${t.priority}`, icon: 'bi-check2-square', view: 'tasks', id: t.id });
    });

    // Search notes
    const notes = window.storageService.get('notes') || [];
    notes.filter(n => n.title.toLowerCase().includes(query) || n.content.toLowerCase().includes(query)).forEach(n => {
      results.push({ title: n.title, sub: 'Note Details', icon: 'bi-sticky-fill', view: 'notes', id: n.id });
    });

    // Search reminders
    const reminders = window.storageService.get('reminders') || [];
    reminders.filter(r => r.title.toLowerCase().includes(query)).forEach(r => {
      results.push({ title: r.title, sub: `Reminder | ${r.dateTime}`, icon: 'bi-bell-fill', view: 'reminders', id: r.id });
    });

    // Render results
    if (results.length === 0) {
      this.searchResults.innerHTML = '<p class="text-muted text-center text-sm py-4 my-0">No matching search results found.</p>';
      return;
    }

    this.searchResults.innerHTML = results.map(item => `
      <div class="search-result-item" data-view="${item.view}" data-id="${item.id}">
        <div class="search-result-icon"><i class="bi ${item.icon}"></i></div>
        <div class="search-result-info">
          <div class="search-result-title">${item.title}</div>
          <div class="search-result-sub">${item.sub}</div>
        </div>
      </div>
    `).join('');

    // Bind clicks to navigate to views
    this.searchResults.querySelectorAll('.search-result-item').forEach(el => {
      el.addEventListener('click', () => {
        const view = el.getAttribute('data-view');
        window.location.href = view + '.html';
        this.closeSearch();
      });
    });
  }

  // Quick Add Drawer Panel Layout
  openQuickAddDrawer() {
    const html = `
      <form id="quick-add-form">
        <div class="mb-3">
          <label class="form-label font-semibold text-sm">Quick Add Item Type</label>
          <select id="quick-add-type" class="form-select">
            <option value="task">Task</option>
            <option value="reminder">Reminder</option>
            <option value="expense">Expense Transaction</option>
            <option value="note">Sticky Note</option>
          </select>
        </div>
        
        <div class="mb-3">
          <label class="form-label font-semibold text-sm">Title / Label</label>
          <input type="text" id="quick-add-title" class="form-control" placeholder="What needs to be done?" required>
        </div>

        <div id="quick-add-dynamic-fields">
          <!-- Task inputs by default -->
          <div class="mb-3">
            <label class="form-label font-semibold text-sm">Due Date</label>
            <input type="date" id="quick-add-date" class="form-control" value="${new Date().toISOString().split('T')[0]}">
          </div>
          <div class="mb-3">
            <label class="form-label font-semibold text-sm">Priority</label>
            <select id="quick-add-priority" class="form-select">
              <option value="low">Low</option>
              <option value="medium" selected>Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <button type="submit" class="btn btn-primary w-100 font-semibold mt-3">Add Item</button>
      </form>
    `;

    this.openDrawer('Quick Add Something', html, (content) => {
      const typeSelect = content.querySelector('#quick-add-type');
      const dynamicFields = content.querySelector('#quick-add-dynamic-fields');

      typeSelect.addEventListener('change', () => {
        const val = typeSelect.value;
        if (val === 'task') {
          dynamicFields.innerHTML = `
            <div class="mb-3">
              <label class="form-label font-semibold text-sm">Due Date</label>
              <input type="date" id="quick-add-date" class="form-control" value="${new Date().toISOString().split('T')[0]}">
            </div>
            <div class="mb-3">
              <label class="form-label font-semibold text-sm">Priority</label>
              <select id="quick-add-priority" class="form-select">
                <option value="low">Low</option>
                <option value="medium" selected>Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          `;
        } else if (val === 'reminder') {
          dynamicFields.innerHTML = `
            <div class="mb-3">
              <label class="form-label font-semibold text-sm">Trigger Date & Time</label>
              <input type="datetime-local" id="quick-add-datetime" class="form-control" required>
            </div>
            <div class="mb-3">
              <label class="form-label font-semibold text-sm">Category</label>
              <select id="quick-add-category" class="form-select">
                <option value="health">Health</option>
                <option value="finance">Finance</option>
                <option value="work">Work</option>
              </select>
            </div>
          `;
        } else if (val === 'expense') {
          dynamicFields.innerHTML = `
            <div class="mb-3">
              <label class="form-label font-semibold text-sm">Transaction Type</label>
              <select id="quick-add-ex-type" class="form-select">
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
            <div class="mb-3">
              <label class="form-label font-semibold text-sm">Amount ($)</label>
              <input type="number" id="quick-add-amount" class="form-control" step="0.01" min="0.01" required>
            </div>
            <div class="mb-3">
              <label class="form-label font-semibold text-sm">Category</label>
              <input type="text" id="quick-add-ex-cat" class="form-control" placeholder="e.g. Groceries, Rent, Salary">
            </div>
          `;
        } else if (val === 'note') {
          dynamicFields.innerHTML = `
            <div class="mb-3">
              <label class="form-label font-semibold text-sm">Note Background Color</label>
              <select id="quick-add-note-color" class="form-select">
                <option value="#fef3c7" selected>Yellow</option>
                <option value="#dbeafe">Blue</option>
                <option value="#d1fae5">Green</option>
                <option value="#f3e8ff">Purple</option>
                <option value="#fee2e2">Red</option>
              </select>
            </div>
          `;
        }
      });

      // Submit Form
      content.querySelector('#quick-add-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const type = typeSelect.value;
        const title = content.querySelector('#quick-add-title').value;

        if (type === 'task') {
          const d = content.querySelector('#quick-add-date').value;
          const p = content.querySelector('#quick-add-priority').value;
          window.taskService.addTask({ title, dueDate: d, priority: p });
          window.notificationService.showToast('Task added successfully', 'success');
        } else if (type === 'reminder') {
          const dt = content.querySelector('#quick-add-datetime').value;
          const cat = content.querySelector('#quick-add-category').value;
          window.reminderService.addReminder({ title, dateTime: dt, category: cat });
          window.notificationService.showToast('Reminder alarm set', 'success');
        } else if (type === 'expense') {
          const ety = content.querySelector('#quick-add-ex-type').value;
          const amt = content.querySelector('#quick-add-amount').value;
          const cat = content.querySelector('#quick-add-ex-cat').value || 'Other';
          window.expenseService.addTransaction({ type: ety, amount: amt, category: cat, description: title });
          window.notificationService.showToast('Transaction logged', 'success');
        } else if (type === 'note') {
          const notes = window.storageService.get('notes') || [];
          const col = content.querySelector('#quick-add-note-color').value;
          notes.push({
            id: 'n_' + Date.now(),
            title,
            content: 'Write details here...',
            color: col,
            pinned: false,
            archived: false,
            updatedAt: new Date().toISOString()
          });
          window.storageService.set('notes', notes);
          window.notificationService.showToast('Note card created', 'success');
        }

        this.closeDrawer();
        
        // Refresh current active view state
        if (this.currentViewInstance) {
          this.currentViewInstance.render(this.viewFrame);
          this.currentViewInstance.init(this.viewFrame);
        }
        
        this.refreshNotificationDropdown();
      });
    });
  }

  // Load and refresh alarms in header dropdown list
  refreshNotificationDropdown() {
    const listEl = document.getElementById('notif-items-container');
    const dot = document.getElementById('header-notif-dot');
    if (!listEl) return;

    const list = window.reminderService.getReminders().filter(r => !r.completed);
    if (list.length > 0) {
      if (dot) dot.style.display = 'block';
      
      listEl.innerHTML = list.map(item => `
        <div class="d-flex align-items-center justify-content-between border-bottom py-2">
          <div class="text-start">
            <div class="font-semibold text-sm text-main" style="max-width:180px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${item.title}</div>
            <div class="text-xs text-muted">${new Date(item.dateTime).toLocaleString()}</div>
          </div>
          <button class="btn btn-xs btn-outline-success py-0 px-2 text-xs check-notif-btn" data-id="${item.id}"><i class="bi bi-check-lg"></i></button>
        </div>
      `).join('');

      listEl.querySelectorAll('.check-notif-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const id = btn.getAttribute('data-id');
          window.reminderService.updateReminder(id, { completed: true });
          window.notificationService.showToast('Reminder checked off', 'success');
          this.refreshNotificationDropdown();
          
          if (this.currentViewName === 'reminders') {
            this.switchView('reminders');
          }
        });
      });
    } else {
      if (dot) dot.style.display = 'none';
      listEl.innerHTML = '<p class="text-muted text-center text-xs py-3 my-0">No pending reminders</p>';
    }
  }
}

// Instantiate and initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.appInstance = new App();
  window.appInstance.init();
});
