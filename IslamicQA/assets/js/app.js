/**
 * DEENQUEST - Core Application Framework
 * Provides Toast notifications, Clipboard copy, Web Share API,
 * Font size scalers, Scroll reveal observers, and Newsletter handler.
 */

const DeenApp = {
  toastContainer: null,

  init() {
    this.createToastContainer();
    this.initScrollReveal();
    this.initNewsletterForms();
  },

  createToastContainer() {
    if (document.getElementById("deenToastContainer")) {
      this.toastContainer = document.getElementById("deenToastContainer");
      return;
    }
    const el = document.createElement("div");
    el.id = "deenToastContainer";
    el.className = "toast-container";
    document.body.appendChild(el);
    this.toastContainer = el;
  },

  showToast(message, type = "info") {
    if (!this.toastContainer) this.createToastContainer();

    const toast = document.createElement("div");
    toast.className = "toast";
    
    const iconSVG = `
      <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color: var(--gold-400); flex-shrink: 0;">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
    `;

    toast.innerHTML = `${iconSVG}<span>${message}</span>`;
    this.toastContainer.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.add("show");
    });

    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  },

  async copyText(text, successMsg = "Copied to clipboard!") {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      this.showToast(successMsg);
      return true;
    } catch (err) {
      console.error("Failed to copy", err);
      this.showToast("Could not copy text.");
      return false;
    }
  },

  async share(title, text, url = window.location.href) {
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
      } catch (e) {
        if (e.name !== "AbortError") {
          this.copyText(url, "Link copied to clipboard!");
        }
      }
    } else {
      this.copyText(url, "Link copied to clipboard!");
    }
  },

  initScrollReveal() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    document.querySelectorAll(".reveal-init").forEach((el) => observer.observe(el));
  },

  initNewsletterForms() {
    document.querySelectorAll(".newsletter-form").forEach((form) => {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const input = form.querySelector("input[type='email']");
        if (input && input.value) {
          this.showToast("Jazakallahu Khayran! Subscribed to weekly knowledge updates.");
          input.value = "";
        }
      });
    });
  }
};

document.addEventListener("DOMContentLoaded", () => {
  DeenApp.init();
});
