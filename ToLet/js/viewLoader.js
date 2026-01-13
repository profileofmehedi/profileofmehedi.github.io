/**
 * View Loader - Dynamically loads HTML views
 */

const ViewLoader = {
  cache: {},

  async load(viewName) {
    // Return cached view if available
    if (this.cache[viewName]) {
      return this.cache[viewName];
    }

    try {
      const response = await fetch(`views/${viewName}.html`);
      if (!response.ok) {
        throw new Error(`Failed to load view: ${viewName}`);
      }
      const html = await response.text();
      this.cache[viewName] = html;
      return html;
    } catch (error) {
      console.error("View loading error:", error);
      return `<div class="alert alert-danger">Failed to load view: ${viewName}</div>`;
    }
  },

  async loadComponent(componentName) {
    try {
      const response = await fetch(`components/${componentName}.html`);
      if (!response.ok) {
        throw new Error(`Failed to load component: ${componentName}`);
      }
      return await response.text();
    } catch (error) {
      console.error("Component loading error:", error);
      return "";
    }
  },

  async initialize() {
    // Load navbar
    const navbarHtml = await this.loadComponent("navbar");
    document.getElementById("navbar-container").innerHTML = navbarHtml;

    // Load modals
    const modalsHtml = await this.loadComponent("modals");
    document.getElementById("modals-container").innerHTML = modalsHtml;

    // Load all views
    const views = ["home", "dashboard", "post-ad", "details"];
    for (const view of views) {
      const html = await this.load(view);
      const container = document.getElementById("views-container");
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = html;
      container.appendChild(tempDiv.firstElementChild);
    }
  },
};
