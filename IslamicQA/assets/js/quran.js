/**
 * DEENQUEST - Quran & Tafsir Explorer Controller
 * Manages 114 Surahs directory, search, Makki/Madani filters,
 * Ayah-by-Ayah interactive reader, Arabic font size adjuster, and Tafsir explorer.
 */

const QuranManager = {
  currentFilter: "all",
  searchKeyword: "",
  arabicFontSize: 28,

  init() {
    this.initSurahDirectory();
    this.initSurahReader();
    this.initTafsirExplorer();
  },

  // 1. Surah Directory (quran.html)
  initSurahDirectory() {
    const grid = document.getElementById("surahGridContainer");
    if (!grid) return;

    this.bindDirectoryFilters();
    this.renderSurahGrid();

    window.addEventListener("deenquest:langChange", () => {
      this.renderSurahGrid();
    });
  },

  bindDirectoryFilters() {
    const filterBtns = document.querySelectorAll(".surah-filter-btn");
    filterBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        filterBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        this.currentFilter = btn.getAttribute("data-type") || "all";
        this.renderSurahGrid();
      });
    });

    const searchInput = document.getElementById("surahSearchInput");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.searchKeyword = e.target.value.toLowerCase().trim();
        this.renderSurahGrid();
      });
    }
  },

  renderSurahGrid() {
    const grid = document.getElementById("surahGridContainer");
    if (!grid || !window.DEEN_DATA || !window.DEEN_DATA.surahs) return;

    const isBn = window.LangManager && window.LangManager.currentLang === "bn";
    let list = [...window.DEEN_DATA.surahs];

    if (this.currentFilter !== "all") {
      list = list.filter((s) => s.type.toLowerCase() === this.currentFilter.toLowerCase());
    }

    if (this.searchKeyword) {
      list = list.filter((s) => 
        s.name.toLowerCase().includes(this.searchKeyword) ||
        s.bangla.toLowerCase().includes(this.searchKeyword) ||
        s.arabic.includes(this.searchKeyword) ||
        s.englishMeaning.toLowerCase().includes(this.searchKeyword) ||
        String(s.number) === this.searchKeyword
      );
    }

    const isInsidePages = window.location.pathname.includes("/pages/");
    const readerPrefix = isInsidePages ? "surah-details.html" : "pages/surah-details.html";

    grid.innerHTML = list.map((s) => `
      <a href="${readerPrefix}?surah=${s.number}" class="surah-grid-card">
        <div class="surah-num-badge">${s.number}</div>
        <div class="surah-names">
          <div class="surah-en-name">${isBn ? s.bangla : s.name}</div>
          <div class="surah-en-meaning">${s.englishMeaning} • ${s.ayahs} Ayahs</div>
        </div>
        <div>
          <div class="surah-ar-name">${s.arabic}</div>
          <span class="badge ${s.type === 'Makki' ? 'badge-gold' : 'badge-emerald'}" style="font-size: 0.68rem; margin-top: 4px;">
            ${s.type}
          </span>
        </div>
      </a>
    `).join("");
  },

  // 2. Surah Reader (surah-details.html)
  initSurahReader() {
    const readerContainer = document.getElementById("surahReaderContainer");
    if (!readerContainer) return;

    const urlParams = new URLSearchParams(window.location.search);
    const surahNum = parseInt(urlParams.get("surah")) || 1;
    const surahMeta = window.DEEN_DATA.surahs.find((s) => s.number === surahNum) || window.DEEN_DATA.surahs[0];
    const surahDetails = window.DEEN_DATA.detailedSurahs[surahNum] || {
      number: surahMeta.number,
      name: surahMeta.name,
      arabic: surahMeta.arabic,
      bangla: surahMeta.bangla,
      englishMeaning: surahMeta.englishMeaning,
      theme: "Divine guidance, cosmic reflection, and sacred laws revealed for humanity.",
      ayahs: [
        {
          number: 1,
          arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
          transliteration: "Bismillāhir-Raḥmānir-Raḥīm",
          english: "In the name of Allah, the Entirely Merciful, the Especially Merciful.",
          bangla: "পরম করুণাময় ও অসীম দয়ালু আল্লাহর নামে শুরু করছি।",
          tafsir: "Commencing in the name of Allah brings divine light and blessing to the recitation."
        }
      ]
    };

    const isBn = window.LangManager && window.LangManager.currentLang === "bn";

    readerContainer.innerHTML = `
      <div class="card" style="margin-bottom: 2.5rem; text-align: center; padding: 2.5rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 0.75rem;">
          <a href="quran.html" class="btn btn-secondary btn-sm">← Back to Surah Directory</a>
          <div style="display: flex; gap: 0.5rem; align-items: center;">
            <button id="fontDecBtn" class="icon-btn" title="Decrease Arabic font">A-</button>
            <button id="fontIncBtn" class="icon-btn" title="Increase Arabic font">A+</button>
            <button id="surahShareBtn" class="btn btn-secondary btn-sm">Share Surah</button>
          </div>
        </div>

        <span class="badge badge-gold">${surahMeta.type} • Surah ${surahMeta.number} • ${surahMeta.ayahs} Verses • Juz ${surahMeta.juz}</span>
        <h1 class="arabic-text" style="font-size: 3.2rem; margin: 1rem 0 0.5rem; text-align: center;">${surahMeta.arabic}</h1>
        <h2 style="font-size: 1.8rem; margin-bottom: 0.5rem;">Surah ${isBn ? surahMeta.bangla : surahMeta.name} (${surahMeta.englishMeaning})</h2>
        <p style="max-width: 680px; margin: 0 auto; color: var(--text-muted);">${surahDetails.theme}</p>

        ${surahNum !== 9 ? `
          <div style="margin-top: 2rem; padding: 1.25rem; background: var(--bg-secondary); border-radius: var(--radius-md); display: inline-block;">
            <span class="arabic-text" style="font-size: 1.8rem; text-align: center;">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</span>
            <span style="font-size: 0.88rem; color: var(--text-subtle); display: block; margin-top: 4px;">In the name of Allah, the Entirely Merciful, the Especially Merciful</span>
          </div>
        ` : ''}
      </div>

      <!-- Ayahs List -->
      <div id="ayahListStream">
        ${surahDetails.ayahs.map((ayah) => {
          const ayahId = `ayah-${surahNum}-${ayah.number}`;
          const isBookmarked = window.BookmarkManager ? window.BookmarkManager.isBookmarked(ayahId) : false;

          return `
            <div class="ayah-row-box" id="${ayahId}">
              <div class="ayah-head">
                <span class="badge badge-emerald">Ayah ${ayah.number}</span>
                <div class="ayah-actions">
                  <button class="icon-btn ayah-bookmark-btn ${isBookmarked ? 'active' : ''}" 
                    data-id="${ayahId}"
                    data-surah="${surahMeta.name}"
                    data-num="${ayah.number}"
                    data-arabic="${this.escapeQuotes(ayah.arabic)}"
                    title="Bookmark Ayah">
                    <svg width="15" height="15" fill="${isBookmarked ? 'currentColor' : 'none'}" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path></svg>
                  </button>
                  <button class="icon-btn ayah-copy-btn" 
                    data-text="${this.escapeQuotes(ayah.arabic + '\n' + ayah.english + ' (Surah ' + surahMeta.name + ' ' + surahNum + ':' + ayah.number + ')')}"
                    title="Copy Ayah">
                    <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
                  </button>
                </div>
              </div>

              <div class="arabic-text ayah-arabic-line" style="font-size: ${this.arabicFontSize}px; margin-bottom: 1.25rem;">
                ${ayah.arabic}
              </div>

              ${ayah.transliteration ? `<div style="font-style: italic; color: var(--gold-600); margin-bottom: 0.75rem; font-size: 0.95rem;">${ayah.transliteration}</div>` : ''}

              <div style="font-size: 1.1rem; color: var(--text-main); line-height: 1.7; margin-bottom: 0.6rem;">
                ${ayah.english}
              </div>

              <div class="bangla-text" style="font-size: 1.02rem; color: var(--text-muted); line-height: 1.7; margin-bottom: 1rem;">
                ${ayah.bangla}
              </div>

              ${ayah.tafsir ? `
                <div class="tafsir-disclosure">
                  <button class="tafsir-toggle-btn" onclick="this.nextElementSibling.classList.toggle('expanded')">
                    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                    <span>Classical Commentary & Tafsir (Ibn Kathir)</span>
                  </button>
                  <div class="accordion-content">
                    <div class="accordion-inner">
                      <div class="tafsir-content-body">
                        ${ayah.tafsir}
                      </div>
                    </div>
                  </div>
                </div>
              ` : ''}
            </div>
          `;
        }).join("")}
      </div>
    `;

    this.bindReaderEvents(surahMeta);
  },

  bindReaderEvents(surahMeta) {
    // Font resize controls
    const incBtn = document.getElementById("fontIncBtn");
    const decBtn = document.getElementById("fontDecBtn");

    if (incBtn) {
      incBtn.addEventListener("click", () => {
        if (this.arabicFontSize < 44) {
          this.arabicFontSize += 3;
          document.querySelectorAll(".ayah-arabic-line").forEach((el) => {
            el.style.fontSize = `${this.arabicFontSize}px`;
          });
        }
      });
    }

    if (decBtn) {
      decBtn.addEventListener("click", () => {
        if (this.arabicFontSize > 20) {
          this.arabicFontSize -= 3;
          document.querySelectorAll(".ayah-arabic-line").forEach((el) => {
            el.style.fontSize = `${this.arabicFontSize}px`;
          });
        }
      });
    }

    // Share button
    const shareBtn = document.getElementById("surahShareBtn");
    if (shareBtn && window.DeenApp) {
      shareBtn.addEventListener("click", () => {
        window.DeenApp.share(`Surah ${surahMeta.name}`, `Explore Surah ${surahMeta.name} on DEENQUEST`);
      });
    }

    // Copy Ayah
    document.querySelectorAll(".ayah-copy-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const text = btn.getAttribute("data-text");
        if (window.DeenApp) window.DeenApp.copyText(text, "Ayah copied!");
      });
    });

    // Bookmark Ayah
    document.querySelectorAll(".ayah-bookmark-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        const sName = btn.getAttribute("data-surah");
        const aNum = btn.getAttribute("data-num");

        if (window.BookmarkManager) {
          const added = window.BookmarkManager.toggle({
            id: id,
            type: "ayah",
            title: `Surah ${sName} [${aNum}]`,
            subtitle: "Holy Quran",
            link: `surah-details.html?surah=${surahMeta.number}#${id}`
          });
          btn.classList.toggle("active", added);
          const svg = btn.querySelector("svg");
          if (svg) svg.setAttribute("fill", added ? "currentColor" : "none");
        }
      });
    });
  },

  // 3. Tafsir Explorer (tafsir.html)
  initTafsirExplorer() {
    const tafsirSelect = document.getElementById("tafsirSurahSelect");
    const displayBox = document.getElementById("tafsirDisplayContainer");
    if (!tafsirSelect || !displayBox) return;

    // Populate Surahs dropdown
    tafsirSelect.innerHTML = window.DEEN_DATA.surahs.map((s) => `
      <option value="${s.number}">Surah ${s.number}. ${s.name} (${s.englishMeaning})</option>
    `).join("");

    tafsirSelect.addEventListener("change", (e) => {
      this.renderTafsirForSurah(parseInt(e.target.value));
    });

    this.renderTafsirForSurah(1);
  },

  renderTafsirForSurah(surahNum) {
    const displayBox = document.getElementById("tafsirDisplayContainer");
    if (!displayBox) return;

    const surahMeta = window.DEEN_DATA.surahs.find((s) => s.number === surahNum);
    const surahData = window.DEEN_DATA.detailedSurahs[surahNum];

    if (!surahData || !surahData.ayahs) {
      displayBox.innerHTML = `
        <div class="card" style="text-align: center; padding: 3rem;">
          <h3>Surah ${surahMeta.name} (${surahMeta.englishMeaning})</h3>
          <p style="color: var(--text-muted); margin: 1rem 0 1.5rem;">
            Full Tafsir Ibn Kathir commentary for this Surah is available in our library index.
          </p>
          <a href="surah-details.html?surah=${surahNum}" class="btn btn-primary">Read Ayahs in Quran Reader</a>
        </div>
      `;
      return;
    }

    displayBox.innerHTML = `
      <div class="card" style="margin-bottom: 2rem; border-top: 4px solid var(--gold-500);">
        <span class="badge badge-gold">Classical Tafsir • Ibn Kathir</span>
        <h2 style="margin: 0.75rem 0 0.5rem;">Surah ${surahMeta.name} (${surahMeta.arabic})</h2>
        <p style="color: var(--text-muted);">${surahData.theme}</p>
      </div>

      ${surahData.ayahs.map(ayah => `
        <article class="card" style="margin-bottom: 1.5rem;">
          <span class="badge badge-emerald">Ayah ${ayah.number}</span>
          <div class="arabic-text" style="font-size: 1.6rem; margin: 1rem 0;">${ayah.arabic}</div>
          <p style="font-weight: 600; color: var(--text-main); margin-bottom: 0.5rem;">"${ayah.english}"</p>
          <p class="bangla-text" style="color: var(--text-muted); margin-bottom: 1.25rem;">"${ayah.bangla}"</p>
          
          <div class="evidence-quote-box" style="margin: 0; background: var(--bg-secondary);">
            <strong style="color: var(--gold-600); display: block; margin-bottom: 0.4rem;">Tafsir Excerpt (Ibn Kathir):</strong>
            <p style="font-size: 0.95rem; color: var(--text-main); line-height: 1.65;">${ayah.tafsir}</p>
          </div>
        </article>
      `).join("")}
    `;
  },

  escapeQuotes(str) {
    if (!str) return "";
    return str.replace(/"/g, '&quot;');
  }
};

document.addEventListener("DOMContentLoaded", () => {
  QuranManager.init();
});
