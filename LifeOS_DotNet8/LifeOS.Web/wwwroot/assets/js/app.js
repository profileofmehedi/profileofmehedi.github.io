/**
 * LifeOS — Core Application Orchestrator & SPA Router
 * Coordinates all feature modules, responsive shell navigation, notifications center, and quick-add actions.
 */

const LifeApp = (() => {
  let currentPage = "dashboard";

  function init() {
    // Initialize state & storage
    const settings = LifeStorage.get("settings") || {};
    if (settings.theme === "dark") {
      LifeSettings.applyTheme("dark");
    }

    // Connect to ASP.NET Core 8 & SQL Server database
    if (window.LifeApiClient) {
      LifeApiClient.syncFromDatabase().then(() => {
        updateUserInfo();
        if (typeof LifeDashboard !== "undefined") LifeDashboard.render();
      });
    }

    // Initialize all modules
    LifeAuth.init();
    LifeDashboard.init();
    LifeMyDay.init();
    LifeCalendar.init();
    LifeTransactions.init();
    LifeAccounts.init();
    LifeConveyance.init();
    LifeBudgets.init();
    LifeSavings.init();
    LifeHabits.init();
    LifeTasks.init();
    LifeRoutines.init();
    LifeGoals.init();
    LifeJournal.init();
    LifeAnalytics.init();
    LifeSearch.init();
    LifeSettings.init();

    // Bind shell navigation
    bindNavigation();
    bindSidebarToggle();
    bindQuickAddMenu();
    bindNotificationCenter();

    // Check user session
    const isAuthed = LifeAuth.checkSession();
    if (isAuthed) {
      updateUserInfo();
      const defaultPage = settings.defaultPage || "dashboard";
      navigateTo(defaultPage);
    }

    // Hash change routing
    window.addEventListener("hashchange", () => {
      const hash = window.location.hash.replace("#", "");
      if (hash && hash !== currentPage) {
        navigateTo(hash);
      }
    });

    renderNotificationDropdown();
  }

  function bindNavigation() {
    // Sidebar & bottom nav item click
    $(document).on("click", ".nav-link-item", function (e) {
      e.preventDefault();
      const targetPage = $(this).data("page");
      if (targetPage) {
        navigateTo(targetPage);
        // Close mobile drawer if open
        $("#sidebar").removeClass("mobile-open");
        $("#sidebar-backdrop").addClass("d-none");
      }
    });
  }

  function bindSidebarToggle() {
    // Desktop sidebar collapse/expand toggle
    $(document).on("click", "#btn-toggle-sidebar", function () {
      $("#sidebar").toggleClass("collapsed");
      $("#main-wrapper").toggleClass("sidebar-collapsed");
    });

    // Mobile drawer toggle
    $(document).on("click", "#btn-mobile-menu-toggle", function () {
      $("#sidebar").addClass("mobile-open");
      $("#sidebar-backdrop").removeClass("d-none");
    });

    // Mobile backdrop click closes drawer
    $(document).on("click", "#sidebar-backdrop", function () {
      $("#sidebar").removeClass("mobile-open");
      $("#sidebar-backdrop").addClass("d-none");
    });
  }

  function bindQuickAddMenu() {
    $(document).on("click", ".quick-add-action", function (e) {
      e.preventDefault();
      const action = $(this).data("action");

      if (action === "expense") {
        LifeTransactions.openAddModal("expense");
      } else if (action === "income") {
        LifeTransactions.openAddModal("income");
      } else if (action === "transfer") {
        LifeAccounts.openTransferModal();
      } else if (action === "conveyance") {
        LifeConveyance.openNewTripModal();
      } else if (action === "task") {
        const modal = new bootstrap.Modal(document.getElementById("modal-task"));
        modal.show();
      } else if (action === "habit") {
        const modal = new bootstrap.Modal(document.getElementById("modal-habit"));
        modal.show();
      } else if (action === "goal") {
        const modal = new bootstrap.Modal(document.getElementById("modal-savings-goal"));
        modal.show();
      } else if (action === "journal") {
        const modal = new bootstrap.Modal(document.getElementById("modal-journal-entry"));
        modal.show();
      }
    });
  }

  function bindNotificationCenter() {
    $(document).on("click", "#btn-mark-all-notifications", function (e) {
      e.preventDefault();
      e.stopPropagation();
      LifeStorage.markAllNotificationsRead();
      renderNotificationDropdown();
    });

    $(document).on("click", "#btn-clear-notifications", function (e) {
      e.preventDefault();
      e.stopPropagation();
      LifeStorage.clearAllNotifications();
      renderNotificationDropdown();
    });

    $(document).on("click", ".notification-item", function () {
      const notifId = $(this).data("id");
      const actionUrl = $(this).data("target");
      LifeStorage.markNotificationRead(notifId);
      renderNotificationDropdown();

      if (actionUrl && actionUrl.startsWith("#")) {
        const page = actionUrl.replace("#", "");
        navigateTo(page);
      }
    });

    LifeStorage.on("change", (e) => {
      if (e.key === "notifications") {
        renderNotificationDropdown();
      }
    });
  }

  function renderNotificationDropdown() {
    const notifs = LifeStorage.get("notifications") || [];
    const unreadCount = notifs.filter(n => !n.read).length;

    if (unreadCount > 0) {
      $("#notification-badge").text(unreadCount).removeClass("d-none");
    } else {
      $("#notification-badge").addClass("d-none");
    }

    if (notifs.length === 0) {
      $("#notification-list").html(`
        <div class="p-4 text-center text-muted small">
          <i class="bi bi-bell-slash fs-4 d-block mb-1 text-secondary opacity-50"></i>
          বর্তমানে কোনো নতুন বিজ্ঞপ্তি নেই।
        </div>
      `);
      return;
    }

    const html = notifs.slice(0, 6).map(n => {
      const iconClass = n.type === "warning" ? "bi-exclamation-triangle text-warning" :
                        n.type === "success" ? "bi-check-circle text-success" :
                        n.type === "alert" ? "bi-exclamation-circle text-danger" : "bi-info-circle text-primary";
      return `
        <div class="notification-item p-3 border-bottom cursor-pointer ${n.read ? "bg-transparent opacity-75" : "bg-light-subtle"}" data-id="${n.id}" data-target="${n.actionUrl || "#dashboard"}">
          <div class="d-flex align-items-start gap-3">
            <i class="bi ${iconClass} fs-5 mt-1"></i>
            <div class="flex-grow-1">
              <div class="d-flex justify-content-between align-items-center">
                <h6 class="mb-0 fs-13 ${n.read ? "fw-normal" : "fw-bold"}">${LifeUtils.escapeHtml(n.title)}</h6>
                ${!n.read ? `<span class="badge bg-primary rounded-circle p-1"></span>` : ""}
              </div>
              <p class="text-muted small mb-1 mt-1 leading-normal">${LifeUtils.escapeHtml(n.message)}</p>
              <div class="fs-10 text-muted">${n.timestamp}</div>
            </div>
          </div>
        </div>
      `;
    }).join("");

    $("#notification-list").html(html);
  }

  function updateUserInfo() {
    const user = LifeStorage.get("user") || window.SEED_DATA.user;
    $(".user-display-name").text(user.name);
    $(".user-display-role").text(user.role);
    $(".user-display-email").text(user.email);
  }

  function navigateTo(pageName) {
    if (!pageName) pageName = "dashboard";
    currentPage = pageName;
    window.location.hash = pageName;

    // Update active nav links
    $(".nav-link-item").removeClass("active");
    $(`.nav-link-item[data-page="${pageName}"]`).addClass("active");

    // Hide all page containers
    $(".page-container").addClass("d-none");

    // Show target page
    const targetPageEl = $(`#page-${pageName}`);
    if (targetPageEl.length) {
      targetPageEl.removeClass("d-none");
    } else {
      // Fallback to dashboard
      $("#page-dashboard").removeClass("d-none");
      currentPage = "dashboard";
    }

    // Update contextual header title & breadcrumb
    const pageTitles = {
      dashboard: "কমান্ড সেন্টার (ড্যাশবোর্ড)",
      myday: "আজকের পরিকল্পনা",
      calendar: "ক্যালেন্ডার ও সময়সূচি",
      transactions: "লেনদেনের খতিয়ান",
      accounts: "অ্যাকাউন্ট ও কার্ড",
      conveyance: "যাতায়াত ও অফিস বিল",
      budgets: "মাসিক বাজেট",
      savings: "সঞ্চয় ও লক্ষ্য",
      reports: "আর্থিক রিপোর্ট",
      habits: "অভ্যাস ট্র্যাকার",
      tasks: "টাস্ক ও কাজের তালিকা",
      routines: "দৈনিক রুটিন",
      lifegoals: "জীবনের দীর্ঘমেয়াদী লক্ষ্য",
      journal: "জার্নাল ও স্মৃতিচারণ",
      analytics: "লাইফ অ্যানালিটিক্স",
      settings: "সেটিংস ও পছন্দসমূহ"
    };

    $("#header-page-title").text(pageTitles[currentPage] || "LifeOS");
    $("#header-breadcrumb-current").text(pageTitles[currentPage] || "ওভারভিউ");

    // Trigger page renderer
    switch (currentPage) {
      case "dashboard":
        LifeDashboard.render();
        break;
      case "myday":
        LifeMyDay.render();
        break;
      case "calendar":
        LifeCalendar.render();
        break;
      case "transactions":
        LifeTransactions.render();
        break;
      case "accounts":
        LifeAccounts.render();
        break;
      case "conveyance":
        LifeConveyance.render();
        break;
      case "budgets":
        LifeBudgets.render();
        break;
      case "savings":
        LifeSavings.render();
        break;
      case "habits":
        LifeHabits.render();
        break;
      case "tasks":
        LifeTasks.render();
        break;
      case "routines":
        LifeRoutines.render();
        break;
      case "lifegoals":
        LifeGoals.render();
        break;
      case "journal":
        LifeJournal.render();
        break;
      case "reports":
      case "analytics":
        LifeAnalytics.render();
        break;
      case "settings":
        LifeSettings.render();
        break;
    }

    // Scroll main viewport to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function getCurrentPage() {
    return currentPage;
  }

  return {
    init,
    navigateTo,
    getCurrentPage,
    updateUserInfo
  };
})();

// Initialize on DOM Ready
$(document).ready(() => {
  LifeApp.init();
});

if (typeof window !== "undefined") {
  window.LifeApp = LifeApp;
}
