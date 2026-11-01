/**
 * DEENQUEST - Global Search & Discovery Engine
 * Real-time fast fuzzy matching across Questions, Quran Surahs, Hadith, and Topics.
 * Supports keyboard shortcut (Ctrl+K or Cmd+K).
 */

const GlobalSearch = {
  modalEl: null,
  inputEl: null,
  resultsEl: null,

  init() {
    this.createSearchModalDOM();
    this.bindEvents();
  },

  createSearchModalDOM() {
    if (document.getElementById("globalSearchModal")) return;

    const modalHTML = `
      <div id="globalSearchModal" class="modal-backdrop" role="dialog" aria-modal="true" aria-label="Search DEENQUEST">
        <div class="search-modal-box">
          <div class="modal-search-input-wrap">
            <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color: var(--text-muted); flex-shrink: 0;">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            <input type="text" id="globalSearchInput" class="modal-search-input" placeholder="Search questions, Quran, Hadith, topics..." autocomplete="off">
            <button id="closeSearchModalBtn" class="icon-btn" aria-label="Close search">
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
          <div id="globalSearchResults" class="modal-search-results">
            <div style="padding: 1.5rem; text-align: center; color: var(--text-subtle);">
              Type keywords such as <em>suffering</em>, <em>science</em>, <em>women</em>, <em>Bukhari</em>, <em>Fatihah</em>...
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML("beforeend", modalHTML);

    this.modalEl = document.getElementById("globalSearchModal");
    this.inputEl = document.getElementById("globalSearchInput");
    this.resultsEl = document.getElementById("globalSearchResults");
  },

  bindEvents() {
    // Open on search triggers
    document.querySelectorAll(".search-trigger-btn").forEach((btn) => {
      btn.addEventListener("click", () => this.open());
    });

    // Close button
    const closeBtn = document.getElementById("closeSearchModalBtn");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => this.close());
    }

    // Backdrop click
    if (this.modalEl) {
      this.modalEl.addEventListener("click", (e) => {
        if (e.target === this.modalEl) this.close();
      });
    }

    // Keyboard Shortcuts (Ctrl+K or Cmd+K, Escape)
    document.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        this.open();
      } else if (e.key === "Escape" && this.isOpen()) {
        this.close();
      }
    });

    // Real-time input searching
    if (this.inputEl) {
      this.inputEl.addEventListener("input", (e) => {
        this.executeSearch(e.target.value.trim());
      });
    }
  },

  isOpen() {
    return this.modalEl && this.modalEl.classList.contains("open");
  },

  open() {
    if (!this.modalEl) return;
    this.modalEl.classList.add("open");
    document.body.style.overflow = "hidden";
    setTimeout(() => {
      if (this.inputEl) this.inputEl.focus();
    }, 100);
  },

  close() {
    if (!this.modalEl) return;
    this.modalEl.classList.remove("open");
    document.body.style.overflow = "";
    if (this.inputEl) this.inputEl.value = "";
  },

  executeSearch(term) {
    if (!term || term.length < 2) {
      this.resultsEl.innerHTML = `
        <div style="padding: 1.5rem; text-align: center; color: var(--text-subtle);">
          Type keywords such as <em>suffering</em>, <em>science</em>, <em>women</em>, <em>Bukhari</em>, <em>Fatihah</em>...
        </div>
      `;
      return;
    }

    const lower = term.toLowerCase();
    const results = [];

    // Search in Questions
    if (window.DEEN_DATA && window.DEEN_DATA.questions) {
      window.DEEN_DATA.questions.forEach((q) => {
        if (
          q.title.toLowerCase().includes(lower) ||
          q.titleBn.toLowerCase().includes(lower) ||
          q.category.toLowerCase().includes(lower) ||
          q.shortPreview.toLowerCase().includes(lower) ||
          q.tags.some((t) => t.toLowerCase().includes(lower))
        ) {
          results.push({
            type: "Question",
            title: window.LangManager && window.LangManager.currentLang === "bn" ? q.titleBn : q.title,
            category: q.category,
            link: `question-details.html?id=${q.id}`
          });
        }
      });
    }

    // Search in Surahs
    if (window.DEEN_DATA && window.DEEN_DATA.surahs) {
      window.DEEN_DATA.surahs.forEach((s) => {
        if (
          s.name.toLowerCase().includes(lower) ||
          s.bangla.toLowerCase().includes(lower) ||
          s.arabic.includes(term) ||
          s.englishMeaning.toLowerCase().includes(lower) ||
          String(s.number) === term
        ) {
          results.push({
            type: "Surah",
            title: `Surah ${s.name} (${s.arabic}) - ${s.englishMeaning}`,
            category: `Ayahs: ${s.ayahs} • ${s.type}`,
            link: `surah-details.html?surah=${s.number}`
          });
        }
      });
    }

    // Search in Hadiths
    if (window.DEEN_DATA && window.DEEN_DATA.hadiths) {
      window.DEEN_DATA.hadiths.forEach((h) => {
        if (
          h.collection.toLowerCase().includes(lower) ||
          h.english.toLowerCase().includes(lower) ||
          h.bangla.toLowerCase().includes(lower) ||
          h.chapter.toLowerCase().includes(lower) ||
          String(h.number) === term
        ) {
          results.push({
            type: "Hadith",
            title: `${h.collection} #${h.number} (${h.grade})`,
            category: h.chapter,
            link: `hadith.html?search=${encodeURIComponent(term)}`
          });
        }
      });
    }

    // Render results
    if (results.length === 0) {
      this.resultsEl.innerHTML = `
        <div style="padding: 2rem; text-align: center; color: var(--text-muted);">
          No results found for "<strong>${this.escapeHTML(term)}</strong>". Try searching for topics, questions, or surah names.
        </div>
      `;
      return;
    }

    // Fix relative links depending on if current page is in root or pages/
    const isInsidePages = window.location.pathname.includes("/pages/");
    
    let html = "";
    results.slice(0, 8).forEach((item) => {
      const fixedLink = isInsidePages ? item.link : `pages/${item.link}`;
      html += `
        <a href="${fixedLink}" class="search-result-item" onclick="GlobalSearch.close()">
          <div class="search-result-item-category">${item.type} • ${this.escapeHTML(item.category)}</div>
          <div class="search-result-item-title">${this.escapeHTML(item.title)}</div>
        </a>
      `;
    });

    this.resultsEl.innerHTML = html;
  },

  escapeHTML(str) {
    if (!str) return "";
    return str.replace(/[&<>'"]/g, 
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  }
};

document.addEventListener("DOMContentLoaded", () => {
  GlobalSearch.init();
});
