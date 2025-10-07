/* Professional Admin Sidebar Component */
class AdminSidebar {
  constructor() {
    this.collapsed = localStorage.getItem("sidebarCollapsed") === "true";
    this.init();
  }

  init() {
    this.createSidebar();
    this.bindEvents();
    this.setActivePage();
    this.restoreSidebarState();
  }

  createSidebar() {
    const sidebar = document.createElement("div");
    sidebar.className = "admin-sidebar";
    sidebar.innerHTML = `
            <div class="sidebar-header">
                <a href="admin_dashboard.html" class="sidebar-brand">
                    <i class="bi bi-shield-check"></i>
                    <span class="brand-text">Admin Panel</span>
                </a>
            </div>
            <nav class="sidebar-nav">
                <div class="nav-item">
                    <a href="dashboard_overview.html" class="nav-link" data-page="overview">
                        <i class="bi bi-speedometer2"></i>
                        <span>Dashboard Overview</span>
                    </a>
                </div>
                <div class="nav-item">
                    <a href="admin_dashboard.html" class="nav-link" data-page="dashboard">
                        <i class="bi bi-grid-1x2"></i>
                        <span>Admin Dashboard</span>
                    </a>
                </div>
                <div class="nav-item">
                    <a href="dashboard_jobs.html" class="nav-link" data-page="jobs">
                        <i class="bi bi-briefcase"></i>
                        <span>Job Management</span>
                    </a>
                </div>
                <div class="nav-item">
                    <a href="dashboard_applicants.html" class="nav-link" data-page="applicants">
                        <i class="bi bi-people"></i>
                        <span>Applicants</span>
                    </a>
                </div>
                <div class="nav-item">
                    <a href="dashboard_interviews.html" class="nav-link" data-page="interviews">
                        <i class="bi bi-calendar-check"></i>
                        <span>Interviews</span>
                    </a>
                </div>
                <div class="nav-item">
                    <a href="admin_users.html" class="nav-link" data-page="users">
                        <i class="bi bi-person-gear"></i>
                        <span>User Management</span>
                    </a>
                </div>
                <div class="nav-item">
                    <a href="admin_analytics.html" class="nav-link" data-page="admin-analytics">
                        <i class="bi bi-bar-chart"></i>
                        <span>Admin Analytics</span>
                    </a>
                </div>
                <div class="nav-item">
                    <a href="dashboard_analytics.html" class="nav-link" data-page="analytics">
                        <i class="bi bi-graph-up"></i>
                        <span>Dashboard Analytics</span>
                    </a>
                </div>
                <div class="nav-item">
                    <a href="dashboard_reports.html" class="nav-link" data-page="reports">
                        <i class="bi bi-file-earmark-text"></i>
                        <span>Reports</span>
                    </a>
                </div>
                <div class="nav-item">
                    <a href="admin_settings.html" class="nav-link" data-page="admin-settings">
                        <i class="bi bi-sliders"></i>
                        <span>Admin Settings</span>
                    </a>
                </div>
                <div class="nav-item">
                    <a href="dashboard_settings.html" class="nav-link" data-page="settings">
                        <i class="bi bi-gear"></i>
                        <span>Settings</span>
                    </a>
                </div>
                <div class="nav-item" style="margin-top: 2rem; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 1rem;">
                    <a href="login.html" class="nav-link" data-page="logout">
                        <i class="bi bi-box-arrow-right"></i>
                        <span>Logout</span>
                    </a>
                </div>
            </nav>
        `;

    document.body.insertBefore(sidebar, document.body.firstChild);
  }

  bindEvents() {
    // Wait for sidebar to be fully injected
    setTimeout(() => {
      // Toggle sidebar - use more robust event binding
      document.addEventListener("click", (e) => {
        if (e.target.closest(".sidebar-toggle")) {
          e.preventDefault();
          this.toggleSidebar();
        }
      });

      // Alternative event binding for direct button clicks
      const toggleButtons = document.querySelectorAll(".sidebar-toggle");
      toggleButtons.forEach((button) => {
        button.addEventListener("click", (e) => {
          e.preventDefault();
          this.toggleSidebar();
        });
      });

      // Logout confirmation
      const logoutLink = document.querySelector('[data-page="logout"]');
      if (logoutLink) {
        logoutLink.addEventListener("click", (e) => {
          e.preventDefault();
          this.showLogoutConfirmation();
        });
      }
    }, 100);
  }

  toggleSidebar() {
    const sidebar = document.querySelector(".admin-sidebar");
    const mainContent = document.querySelector(".main-content");

    if (!sidebar || !mainContent) {
      console.warn("Sidebar or main content not found");
      return;
    }

    this.collapsed = !this.collapsed;

    if (this.collapsed) {
      sidebar.classList.add("collapsed");
      mainContent.classList.add("expanded");
    } else {
      sidebar.classList.remove("collapsed");
      mainContent.classList.remove("expanded");
    }

    // Store state in localStorage
    localStorage.setItem("sidebarCollapsed", this.collapsed);
  }

  restoreSidebarState() {
    if (this.collapsed) {
      const sidebar = document.querySelector(".admin-sidebar");
      const mainContent = document.querySelector(".main-content");

      if (sidebar && mainContent) {
        sidebar.classList.add("collapsed");
        mainContent.classList.add("expanded");
      }
    }
  }

  setActivePage() {
    const currentPage = window.location.pathname.split("/").pop();
    const navLinks = document.querySelectorAll(".nav-link");

    navLinks.forEach((link) => {
      link.classList.remove("active");

      // Get the href without path
      const linkPage = link.getAttribute("href");
      if (linkPage === currentPage) {
        link.classList.add("active");
      }
    });

    // Set active based on data-page attribute for special cases
    const pageMap = {
      "dashboard_overview.html": "overview",
      "admin_dashboard.html": "dashboard",
      "dashboard_jobs.html": "jobs",
      "dashboard_applicants.html": "applicants",
      "dashboard_interviews.html": "interviews",
      "admin_users.html": "users",
      "admin_analytics.html": "admin-analytics",
      "dashboard_analytics.html": "analytics",
      "dashboard_reports.html": "reports",
      "admin_settings.html": "admin-settings",
      "dashboard_settings.html": "settings",
    };

    const activePage = pageMap[currentPage];
    if (activePage) {
      const activeLink = document.querySelector(`[data-page="${activePage}"]`);
      if (activeLink) {
        activeLink.classList.add("active");
      }
    }
  }

  showLogoutConfirmation() {
    if (typeof showNotification === "function") {
      const confirmed = confirm("Are you sure you want to logout?");
      if (confirmed) {
        showNotification("Logging out...", "info");
        setTimeout(() => {
          window.location.href = "login.html";
        }, 1000);
      }
    } else {
      const confirmed = confirm("Are you sure you want to logout?");
      if (confirmed) {
        window.location.href = "login.html";
      }
    }
  }
}

// Professional Notification System
function showNotification(message, type = "info", duration = 4000) {
  // Create container if it doesn't exist
  let container = document.querySelector(".notification-container");
  if (!container) {
    container = document.createElement("div");
    container.className = "notification-container";
    document.body.appendChild(container);
  }

  // Create notification element
  const notification = document.createElement("div");
  notification.className = `notification ${type}`;

  // Create icon based on type
  let icon = "";
  switch (type) {
    case "success":
      icon = '<i class="bi bi-check-circle"></i>';
      break;
    case "error":
      icon = '<i class="bi bi-exclamation-circle"></i>';
      break;
    case "warning":
      icon = '<i class="bi bi-exclamation-triangle"></i>';
      break;
    default:
      icon = '<i class="bi bi-info-circle"></i>';
  }

  notification.innerHTML = `
        <div style="padding: 1rem; display: flex; align-items: center;">
            <div style="margin-right: 0.75rem; color: #64748b; font-size: 1.25rem;">
                ${icon}
            </div>
            <div style="flex: 1;">
                <div style="color: #1e293b; font-weight: 500;">${message}</div>
            </div>
            <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: #64748b; font-size: 1.25rem; cursor: pointer; margin-left: 0.5rem;">
                <i class="bi bi-x"></i>
            </button>
        </div>
    `;

  container.appendChild(notification);

  // Trigger animation
  setTimeout(() => {
    notification.classList.add("show");
  }, 100);

  // Auto remove
  setTimeout(() => {
    if (notification.parentElement) {
      notification.classList.remove("show");
      setTimeout(() => {
        if (notification.parentElement) {
          notification.remove();
        }
      }, 300);
    }
  }, duration);
}

// Professional Loading System
function showLoading(message = "Loading...") {
  const loading = document.createElement("div");
  loading.id = "professional-loading";
  loading.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        backdrop-filter: blur(5px);
    `;

  loading.innerHTML = `
        <div style="background: white; padding: 2rem; border-radius: 15px; text-align: center; box-shadow: 0 20px 40px rgba(0,0,0,0.3);">
            <div style="width: 40px; height: 40px; margin: 0 auto 1rem; border: 4px solid #e2e8f0; border-top: 4px solid #3b82f6; border-radius: 50%; animation: spin 1s linear infinite;"></div>
            <div style="color: #1e293b; font-weight: 500;">${message}</div>
        </div>
        <style>
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        </style>
    `;

  document.body.appendChild(loading);
  return loading;
}

function hideLoading() {
  const loading = document.getElementById("professional-loading");
  if (loading) {
    loading.remove();
  }
}

// Initialize sidebar when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  // Only initialize sidebar on admin pages
  const currentPage = window.location.pathname.split("/").pop();
  const adminPages = [
    "dashboard_overview.html",
    "admin_dashboard.html",
    "dashboard_jobs.html",
    "dashboard_applicants.html",
    "dashboard_interviews.html",
    "admin_users.html",
    "admin_analytics.html",
    "dashboard_analytics.html",
    "dashboard_reports.html",
    "admin_settings.html",
    "dashboard_settings.html",
  ];

  if (adminPages.includes(currentPage)) {
    new AdminSidebar();
  }
});

// Export for use in other scripts
if (typeof module !== "undefined" && module.exports) {
  module.exports = { AdminSidebar, showNotification, showLoading, hideLoading };
}
