/**
 * DEENQUEST - Theme Controller (Dark / Light Mode)
 * Respects system preference and persists in LocalStorage
 */

const ThemeManager = {
  STORAGE_KEY: "deenquest_theme",

  init() {
    const savedTheme = localStorage.getItem(this.STORAGE_KEY);
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialTheme = savedTheme || (prefersDark ? "dark" : "light");

    this.applyTheme(initialTheme);

    // Bind event listeners to all theme toggles on the page
    document.querySelectorAll(".theme-toggle-btn").forEach((btn) => {
      btn.addEventListener("click", () => this.toggleTheme());
    });
  },

  applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(this.STORAGE_KEY, theme);
    this.updateToggleIcons(theme);
  },

  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute("data-theme") || "light";
    const nextTheme = currentTheme === "dark" ? "light" : "dark";
    this.applyTheme(nextTheme);

    if (window.DeenApp && window.DeenApp.showToast) {
      const msg = nextTheme === "dark" ? "Dark Mode Enabled" : "Light Mode Enabled";
      window.DeenApp.showToast(msg);
    }
  },

  updateToggleIcons(theme) {
    const moonIcon = `<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>`;
    const sunIcon = `<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>`;

    document.querySelectorAll(".theme-toggle-btn").forEach((btn) => {
      btn.innerHTML = theme === "dark" ? sunIcon : moonIcon;
      btn.setAttribute("title", theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode");
      btn.setAttribute("aria-label", "Toggle color theme");
    });
  }
};

document.addEventListener("DOMContentLoaded", () => {
  ThemeManager.init();
});
