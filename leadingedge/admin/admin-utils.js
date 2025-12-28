// Admin Authentication
function checkAdminAuth() {
  if (localStorage.getItem("adminLoggedIn") !== "true") {
    window.location.href = "login.html";
    return false;
  }
  return true;
}

function logout() {
  localStorage.removeItem("adminLoggedIn");
  localStorage.removeItem("adminUsername");
  window.location.href = "login.html";
}

// Get admin username
function getAdminUsername() {
  return localStorage.getItem("adminUsername") || "Admin";
}

// Index.html Content Management
const IndexHTMLManager = {
  // Get current index.html content from localStorage
  getContent() {
    return localStorage.getItem("indexHTMLContent") || null;
  },

  // Save updated content
  saveContent(content) {
    localStorage.setItem("indexHTMLContent", content);
  },

  // Get specific section
  getSection(sectionId) {
    const content = this.getContent();
    if (!content) return null;

    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");
    const section = doc.querySelector(`#${sectionId}`);
    return section ? section.outerHTML : null;
  },

  // Update specific section
  updateSection(sectionId, newHTML) {
    let content = this.getContent();
    if (!content) return false;

    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");
    const section = doc.querySelector(`#${sectionId}`);

    if (section) {
      section.outerHTML = newHTML;
      this.saveContent(doc.documentElement.outerHTML);
      return true;
    }
    return false;
  },

  // Update text content within section
  updateText(selector, newText) {
    let content = this.getContent();
    if (!content) return false;

    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");
    const element = doc.querySelector(selector);

    if (element) {
      element.textContent = newText;
      this.saveContent(doc.documentElement.outerHTML);
      return true;
    }
    return false;
  },

  // Update HTML content within selector
  updateHTML(selector, newHTML) {
    let content = this.getContent();
    if (!content) return false;

    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");
    const element = doc.querySelector(selector);

    if (element) {
      element.innerHTML = newHTML;
      this.saveContent(doc.documentElement.outerHTML);
      return true;
    }
    return false;
  },

  // Add/Update meta tag
  updateMetaTag(name, content) {
    let indexContent = this.getContent();
    if (!indexContent) return false;

    const parser = new DOMParser();
    const doc = parser.parseFromString(indexContent, "text/html");

    let metaTag = doc.querySelector(`meta[name="${name}"]`);
    if (!metaTag) {
      metaTag = doc.createElement("meta");
      metaTag.setAttribute("name", name);
      doc.head.appendChild(metaTag);
    }
    metaTag.setAttribute("content", content);
    this.saveContent(doc.documentElement.outerHTML);
    return true;
  },

  // Get meta tag value
  getMetaTag(name) {
    const content = this.getContent();
    if (!content) return null;

    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");
    const metaTag = doc.querySelector(`meta[name="${name}"]`);
    return metaTag ? metaTag.getAttribute("content") : null;
  },
};

// Show notification
function showNotification(message, type = "success", duration = 3000) {
  const notificationContainer =
    document.getElementById("notificationContainer") ||
    createNotificationContainer();

  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
        <i class="ri-${
          type === "success" ? "check-double" : "close-circle"
        }-line"></i>
        <span>${message}</span>
    `;

  notificationContainer.appendChild(notification);

  // Auto remove
  setTimeout(() => {
    notification.classList.add("fade-out");
    setTimeout(() => notification.remove(), 300);
  }, duration);
}

function createNotificationContainer() {
  const container = document.createElement("div");
  container.id = "notificationContainer";
  container.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
    `;
  document.body.appendChild(container);
  return container;
}
