/**
 * DEENQUEST - Navigation Controller
 * Manages sticky header, mobile drawer menu, reading progress indicator,
 * active link state, and back-to-top button.
 */

const NavigationManager = {
  headerEl: null,
  progressBarEl: null,
  backToTopBtn: null,
  mobileDrawer: null,

  init() {
    this.headerEl = document.querySelector(".site-header");
    this.progressBarEl = document.querySelector(".reading-progress-bar");
    this.backToTopBtn = document.querySelector(".back-to-top-btn");

    this.initMobileDrawer();
    this.bindScrollEvents();
    this.highlightActivePage();
  },

  initMobileDrawer() {
    const toggleBtn = document.querySelector(".mobile-nav-toggle");
    const drawerOverlay = document.querySelector(".mobile-drawer-overlay");
    const closeBtn = document.querySelector(".close-drawer-btn");

    if (toggleBtn && drawerOverlay) {
      toggleBtn.addEventListener("click", () => {
        drawerOverlay.classList.add("open");
        document.body.style.overflow = "hidden";
      });
    }

    if (closeBtn && drawerOverlay) {
      closeBtn.addEventListener("click", () => {
        drawerOverlay.classList.remove("open");
        document.body.style.overflow = "";
      });
    }

    if (drawerOverlay) {
      drawerOverlay.addEventListener("click", (e) => {
        if (e.target === drawerOverlay) {
          drawerOverlay.classList.remove("open");
          document.body.style.overflow = "";
        }
      });
    }
  },

  bindScrollEvents() {
    window.addEventListener("scroll", () => {
      const scrollY = window.scrollY;

      // Header scrolled shadow
      if (this.headerEl) {
        if (scrollY > 20) {
          this.headerEl.classList.add("scrolled");
        } else {
          this.headerEl.classList.remove("scrolled");
        }
      }

      // Reading progress
      if (this.progressBarEl) {
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (docHeight > 0) {
          const progress = (scrollY / docHeight) * 100;
          this.progressBarEl.style.width = `${Math.min(100, Math.max(0, progress))}%`;
        }
      }

      // Back to top visibility
      if (this.backToTopBtn) {
        if (scrollY > 300) {
          this.backToTopBtn.classList.add("visible");
        } else {
          this.backToTopBtn.classList.remove("visible");
        }
      }
    }, { passive: true });

    if (this.backToTopBtn) {
      this.backToTopBtn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }
  },

  highlightActivePage() {
    const currentPath = window.location.pathname;
    const links = document.querySelectorAll(".nav-link, .mobile-nav-item, .mobile-drawer-link");

    links.forEach((link) => {
      const href = link.getAttribute("href");
      if (!href) return;

      const cleanHref = href.split("?")[0].split("#")[0];
      const isHome = (currentPath.endsWith("/") || currentPath.endsWith("index.html")) && (cleanHref === "index.html" || cleanHref === "../index.html" || cleanHref === "/");

      if (isHome || (cleanHref && currentPath.endsWith(cleanHref) && cleanHref !== "index.html" && cleanHref !== "../index.html")) {
        link.classList.add("active");
      }
    });
  }
};

document.addEventListener("DOMContentLoaded", () => {
  NavigationManager.init();
});
