$(document).ready(function () {
  const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
  if (!loggedInUser) {
    window.location.href = "login.html";
    return;
  }

  const currentPage = window.location.pathname.split("/").pop();

  const navLinks = {
    admin: [
      { href: "admin_dashboard.html", icon: "fa-columns", text: "Dashboard" },
      { href: "admin_user_management.html", icon: "fa-users", text: "Users" },
      {
        href: "admin_project_management.html",
        icon: "fa-folder",
        text: "Projects",
      },
    ],
    lead: [
      { href: "lead_dashboard.html", icon: "fa-chart-bar", text: "Dashboard" },
      {
        href: "project_board.html",
        icon: "fa-clipboard-list",
        text: "Project Board",
      },
      {
        href: "lead_team_view.html",
        icon: "fa-user-friends",
        text: "Team View",
      },
    ],
    user: [
      { href: "user_dashboard.html", icon: "fa-columns", text: "Dashboard" },
      {
        href: "project_board.html",
        icon: "fa-clipboard-list",
        text: "Project Board",
      },
    ],
  };

  const roleConfig = {
    admin: { logo: "Admin Panel", bg: "var(--admin-sidebar-bg)" },
    lead: { logo: "Team Lead", bg: "var(--lead-sidebar-bg)" },
    user: { logo: "User Panel", bg: "var(--user-sidebar-bg)" },
  };

  const userRole = loggedInUser.role;
  const links = navLinks[userRole];
  const config = roleConfig[userRole];

  let navLinksHtml = links
    .map(
      (link) => `
        <li class="nav-item">
            <a class="nav-link ${
              currentPage === link.href ? "active" : ""
            }" href="${link.href}">
                <i class="fas ${
                  link.icon
                } nav-icon"></i><span class="nav-text">${link.text}</span>
            </a>
        </li>`
    )
    .join("");

  const layoutHtml = `
        <div class="sidebar" style="background-color: ${config.bg};">
            <div class="logo-details"><i class="fab fa-jira logo-icon"></i><span class="logo_name">${config.logo}</span></div>
            <ul class="nav flex-column">${navLinksHtml}</ul>
        </div>
        <div class="main-content">
            <nav class="top-nav">
                <div class="nav-left">
                    <div class="sidebar-button"><i class="fas fa-bars sidebarBtn"></i></div>
                    <div class="search-container">
                        <input type="text" id="global-task-search" class="form-control form-control-sm" placeholder="Search tasks...">
                    </div>
                </div>
                <div class="user-profile">
                    <span class="me-2">${loggedInUser.name}</span>
                    <button id="logout-btn" class="btn btn-sm btn-outline-danger">Logout</button>
                </div>
            </nav>
            <div class="content-area container-fluid" id="page-content"></div>
        </div>
        <div class="toast-container position-fixed bottom-0 end-0 p-3"></div>`;

  $("body").prepend(layoutHtml).css("visibility", "visible");
  $("#app-content").appendTo("#page-content");

  // Sidebar toggle
  $(".sidebarBtn").on("click", () => $(".sidebar").toggleClass("active"));

  // Logout
  $("#logout-btn").on("click", () => {
    sessionStorage.removeItem("loggedInUser");
    window.location.href = "login.html";
  });

  // Global Search
  $("#global-task-search").on("keyup", function () {
    const searchTerm = $(this).val().toLowerCase();
    $(".task-card").each(function () {
      const cardText = $(this).text().toLowerCase();
      $(this).toggle(cardText.includes(searchTerm));
    });
  });
});

function showToast(message, type = "success") {
  const toastId = "toast-" + Date.now();
  const toastBg = type === "success" ? "bg-success" : "bg-danger";
  const toastHtml = `
        <div id="${toastId}" class="toast align-items-center text-white ${toastBg} border-0" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="d-flex"><div class="toast-body">${message}</div><button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button></div>
        </div>`;
  $(".toast-container").append(toastHtml);
  new bootstrap.Toast($(`#${toastId}`)).show();
}
