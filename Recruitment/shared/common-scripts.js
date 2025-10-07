// Common JavaScript functionality for all dashboard pages
$(document).ready(function () {
  // Sidebar toggle
  $("#sidebarToggle").on("click", function () {
    $("#sidebar").toggleClass("collapsed");
  });

  // Update active navigation state
  function setActiveNavItem(activePageName) {
    $(".nav-link").removeClass("active");
    $(`.nav-link[href*="${activePageName}"]`).addClass("active");
  }

  // Get current page name from URL
  function getCurrentPageName() {
    const path = window.location.pathname;
    const filename = path.split("/").pop();
    return filename.replace(".html", "").replace("dashboard_", "");
  }

  // Set active navigation on page load
  const currentPage = getCurrentPageName();
  if (currentPage === "organization_dashboard" || currentPage === "dashboard") {
    setActiveNavItem("dashboard_overview");
  } else {
    setActiveNavItem(`dashboard_${currentPage}`);
  }

  // Global search functionality
  $("#globalSearch").on("input", function () {
    const searchTerm = $(this).val().toLowerCase();
    // Implement search logic here
    console.log("Searching for:", searchTerm);
  });

  // Notification handler
  $("#notificationBtn").on("click", function () {
    Swal.fire({
      title: "Notifications",
      html: `
                <div class="text-start">
                    <div class="mb-3 p-3 rounded" style="background: #f8f9fa;">
                        <div class="fw-medium">New Application Received</div>
                        <small class="text-muted">Data Analyst position - 2 minutes ago</small>
                    </div>
                    <div class="mb-3 p-3 rounded" style="background: #f8f9fa;">
                        <div class="fw-medium">Interview Scheduled</div>
                        <small class="text-muted">John Smith - Research Assistant - 15 minutes ago</small>
                    </div>
                    <div class="mb-3 p-3 rounded" style="background: #f8f9fa;">
                        <div class="fw-medium">Deadline Reminder</div>
                        <small class="text-muted">Field Officer position expires in 3 days</small>
                    </div>
                </div>
            `,
      showConfirmButton: false,
      showCloseButton: true,
      width: 500,
    });
  });

  // Responsive sidebar for mobile
  $(window).on("resize", function () {
    if ($(window).width() < 768) {
      $("#sidebar").addClass("collapsed");
    }
  });

  // Utility function to animate counters
  function animateCounters() {
    $(".stat-value").each(function () {
      const $this = $(this);
      const countTo = parseInt($this.text().replace(/,/g, ""));

      $({ countNum: 0 }).animate(
        {
          countNum: countTo,
        },
        {
          duration: 2000,
          easing: "swing",
          step: function () {
            $this.text(Math.floor(this.countNum).toLocaleString());
          },
          complete: function () {
            $this.text(countTo.toLocaleString());
          },
        }
      );
    });
  }

  // Utility function to show loading skeleton
  function showLoadingSkeleton(targetElement, count = 3) {
    let skeletonHtml = "";
    for (let i = 0; i < count; i++) {
      skeletonHtml += `
                <div class="loading-skeleton mb-3" style="height: 60px; border-radius: 8px;"></div>
            `;
    }
    $(targetElement).html(skeletonHtml);
  }

  // Utility function to format date
  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString();
  }

  // Utility function to create status badge
  function createStatusBadge(status) {
    return `<span class="status-badge ${status.toLowerCase()}">${status.charAt(0).toUpperCase() + status.slice(1)}</span>`;
  }

  // Export common functions to global scope
  window.dashboardUtils = {
    animateCounters,
    showLoadingSkeleton,
    formatDate,
    createStatusBadge,
    setActiveNavItem,
  };
});
