/**
 * DEENQUEST - Hadith Library Controller
 * Manages Kutub al-Sittah canonical collections, authenticity gradings (Sahih, Hasan),
 * chapter filtering, search, copying, and bookmarking.
 */

const HadithManager = {
  activeCollection: "all",
  activeGrade: "all",
  searchQuery: "",

  init() {
    this.bindFilters();
    this.renderHadithList();

    window.addEventListener("deenquest:langChange", () => {
      this.renderHadithList();
    });
  },

  bindFilters() {
    const colBtns = document.querySelectorAll(".hadith-col-btn");
    colBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        colBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        this.activeCollection = btn.getAttribute("data-col") || "all";
        this.renderHadithList();
      });
    });

    const gradeSelect = document.getElementById("hadithGradeSelect");
    if (gradeSelect) {
      gradeSelect.addEventListener("change", (e) => {
        this.activeGrade = e.target.value;
        this.renderHadithList();
      });
    }

    const searchInput = document.getElementById("hadithSearchInput");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        this.renderHadithList();
      });
    }
  },

  renderHadithList() {
    const container = document.getElementById("hadithListContainer");
    if (!container || !window.DEEN_DATA || !window.DEEN_DATA.hadiths) return;

    const isBn = window.LangManager && window.LangManager.currentLang === "bn";
    let list = [...window.DEEN_DATA.hadiths];

    if (this.activeCollection !== "all") {
      list = list.filter((h) => h.collectionKey === this.activeCollection);
    }

    if (this.activeGrade !== "all") {
      list = list.filter((h) => h.grade.toLowerCase().includes(this.activeGrade.toLowerCase()));
    }

    if (this.searchQuery) {
      list = list.filter((h) =>
        h.collection.toLowerCase().includes(this.searchQuery) ||
        h.english.toLowerCase().includes(this.searchQuery) ||
        h.bangla.toLowerCase().includes(this.searchQuery) ||
        h.chapter.toLowerCase().includes(this.searchQuery) ||
        h.narrator.toLowerCase().includes(this.searchQuery) ||
        String(h.number) === this.searchQuery
      );
    }

    if (list.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 4rem 1rem; color: var(--text-muted);">
          <h3>${isBn ? "কোনো হাদিস পাওয়া যায়নি" : "No Hadith Found"}</h3>
          <p>${isBn ? "অনুসন্ধানের শর্ত পরিবর্তন করে আবার চেষ্টা করুন।" : "Try clearing filters or searching another keyword."}</p>
        </div>
      `;
      return;
    }

    container.innerHTML = list.map((h) => {
      const isBookmarked = window.BookmarkManager ? window.BookmarkManager.isBookmarked(h.id) : false;
      const colName = isBn ? h.collectionBn : h.collection;
      const gradeName = isBn ? h.gradeBn : h.grade;

      return `
        <article class="hadith-card" id="${h.id}">
          <div class="hadith-meta-row">
            <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
              <span class="badge badge-gold">${colName} #${h.number}</span>
              <span class="hadith-grade-badge ${h.grade.includes('Sahih') ? 'grade-sahih' : 'grade-hasan'}">
                ● ${gradeName}
              </span>
              <span class="badge">Chapter: ${h.chapter}</span>
            </div>
            <div style="display: flex; gap: 0.4rem;">
              <button class="icon-btn hadith-bm-btn ${isBookmarked ? 'active' : ''}"
                data-id="${h.id}"
                data-title="${this.escapeQuotes(h.collection + ' #' + h.number)}"
                data-sub="${this.escapeQuotes(h.chapter)}"
                title="Bookmark Hadith">
                <svg width="15" height="15" fill="${isBookmarked ? 'currentColor' : 'none'}" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path></svg>
              </button>
              <button class="icon-btn hadith-copy-btn"
                data-text="${this.escapeQuotes(h.arabic + '\n\n' + h.english + '\n\n[' + h.collection + ' #' + h.number + ' - ' + h.grade + ']')}"
                title="Copy Hadith">
                <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
              </button>
            </div>
          </div>

          <div style="font-size: 0.9rem; color: var(--gold-600); margin-bottom: 0.75rem; font-weight: 600;">
            Narrated by: ${h.narrator}
          </div>

          <div class="arabic-text" style="font-size: 1.65rem; margin-bottom: 1.25rem;">
            ${h.arabic}
          </div>

          <p style="font-size: 1.1rem; color: var(--text-main); line-height: 1.7; margin-bottom: 0.75rem;">
            "${h.english}"
          </p>

          <p class="bangla-text" style="font-size: 1.02rem; color: var(--text-muted); line-height: 1.7; margin-bottom: 1.25rem;">
            "${h.bangla}"
          </p>

          <div class="evidence-quote-box" style="margin: 0; background: var(--bg-secondary);">
            <strong style="color: var(--primary-700); display: block; margin-bottom: 0.35rem; font-size: 0.88rem;">Scholarly Commentary:</strong>
            <p style="font-size: 0.93rem; color: var(--text-muted); line-height: 1.6;">${h.commentary}</p>
          </div>
        </article>
      `;
    }).join("");

    this.bindHadithActions();
  },

  bindHadithActions() {
    // Copy button
    document.querySelectorAll(".hadith-copy-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const text = btn.getAttribute("data-text");
        if (window.DeenApp) window.DeenApp.copyText(text, "Hadith text copied!");
      });
    });

    // Bookmark button
    document.querySelectorAll(".hadith-bm-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        const title = btn.getAttribute("data-title");
        const sub = btn.getAttribute("data-sub");

        if (window.BookmarkManager) {
          const isInsidePages = window.location.pathname.includes("/pages/");
          const link = isInsidePages ? `hadith.html#${id}` : `pages/hadith.html#${id}`;

          const added = window.BookmarkManager.toggle({
            id: id,
            type: "hadith",
            title: title,
            subtitle: sub,
            link: link
          });

          btn.classList.toggle("active", added);
          const svg = btn.querySelector("svg");
          if (svg) svg.setAttribute("fill", added ? "currentColor" : "none");
        }
      });
    });
  },

  escapeQuotes(str) {
    if (!str) return "";
    return str.replace(/"/g, '&quot;');
  }
};

document.addEventListener("DOMContentLoaded", () => {
  HadithManager.init();
});
