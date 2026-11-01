/**
 * DEENQUEST - Questions & Answers Controller
 * Manages Q&A Explorer, Category filtering, Search, Sorting,
 * and renders the 11-part rigorous answer layout on question-details.html
 */

const QuestionsManager = {
  currentCategory: "all",
  currentSort: "popular",
  searchKeyword: "",

  init() {
    this.initExplorer();
    this.initDetailsPage();
  },

  // 1. Q&A Explorer Page (questions.html)
  initExplorer() {
    const listContainer = document.getElementById("questionsListContainer");
    if (!listContainer) return;

    this.bindExplorerFilters();
    this.renderExplorerList();

    window.addEventListener("deenquest:langChange", () => {
      this.renderExplorerList();
    });

    window.addEventListener("deenquest:bookmarksUpdated", () => {
      this.updateBookmarkButtons();
    });
  },

  bindExplorerFilters() {
    const filterButtons = document.querySelectorAll(".filter-tag-btn");
    filterButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        filterButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        this.currentCategory = btn.getAttribute("data-category") || "all";
        this.renderExplorerList();
      });
    });

    const sortSelect = document.getElementById("questionSortSelect");
    if (sortSelect) {
      sortSelect.addEventListener("change", (e) => {
        this.currentSort = e.target.value;
        this.renderExplorerList();
      });
    }

    const searchInput = document.getElementById("questionSearchInput");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.searchKeyword = e.target.value.toLowerCase().trim();
        this.renderExplorerList();
      });
    }
  },

  renderExplorerList() {
    const container = document.getElementById("questionsListContainer");
    if (!container || !window.DEEN_DATA || !window.DEEN_DATA.questions) return;

    const isBn = window.LangManager && window.LangManager.currentLang === "bn";
    let list = [...window.DEEN_DATA.questions];

    // Filter by category
    if (this.currentCategory !== "all") {
      list = list.filter((q) => q.category === this.currentCategory);
    }

    // Filter by search keyword
    if (this.searchKeyword) {
      list = list.filter((q) => 
        q.title.toLowerCase().includes(this.searchKeyword) ||
        q.titleBn.toLowerCase().includes(this.searchKeyword) ||
        q.shortPreview.toLowerCase().includes(this.searchKeyword) ||
        q.tags.some(t => t.toLowerCase().includes(this.searchKeyword))
      );
    }

    // Sort
    if (this.currentSort === "views") {
      list.sort((a, b) => b.views - a.views);
    } else if (this.currentSort === "time") {
      list.sort((a, b) => parseInt(b.readTime) - parseInt(a.readTime));
    }

    if (list.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; color: var(--text-muted);">
          <h3>${isBn ? "কোনো প্রশ্ন পাওয়া যায়নি" : "No Questions Found"}</h3>
          <p>${isBn ? "অন্য কোনো শব্দ দিয়ে অনুসন্ধান করার চেষ্টা করুন।" : "Try clearing filters or searching with different keywords."}</p>
        </div>
      `;
      return;
    }

    const isInsidePages = window.location.pathname.includes("/pages/");
    const detailsPrefix = isInsidePages ? "question-details.html" : "pages/question-details.html";

    container.innerHTML = list.map((q) => {
      const isBookmarked = window.BookmarkManager ? window.BookmarkManager.isBookmarked(q.id) : false;
      const title = isBn ? q.titleBn : q.title;
      const category = isBn ? q.categoryBn : q.category;

      return `
        <article class="card question-card">
          <div>
            <div class="question-card-head">
              <span class="badge badge-emerald">${category}</span>
              <span class="badge">${q.difficulty}</span>
            </div>
            <a href="${detailsPrefix}?id=${q.id}">
              <h3 class="question-card-title">${title}</h3>
            </a>
            <p class="question-card-snippet">${q.shortPreview}</p>
          </div>
          <div class="question-card-footer">
            <span>⏱️ ${q.readTime} • 👁️ ${q.views.toLocaleString()}</span>
            <div style="display: flex; gap: 0.4rem;">
              <button class="icon-btn q-bookmark-btn ${isBookmarked ? 'active' : ''}" 
                data-id="${q.id}" 
                data-title="${this.escapeQuotes(title)}"
                title="Bookmark">
                <svg width="16" height="16" fill="${isBookmarked ? 'currentColor' : 'none'}" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                </svg>
              </button>
            </div>
          </div>
        </article>
      `;
    }).join("");

    this.bindBookmarkButtons();
  },

  bindBookmarkButtons() {
    document.querySelectorAll(".q-bookmark-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const id = btn.getAttribute("data-id");
        const title = btn.getAttribute("data-title");
        const q = window.DEEN_DATA.questions.find((item) => item.id === id);

        if (window.BookmarkManager && q) {
          const isInsidePages = window.location.pathname.includes("/pages/");
          const link = isInsidePages ? `question-details.html?id=${q.id}` : `pages/question-details.html?id=${q.id}`;

          const added = window.BookmarkManager.toggle({
            id: q.id,
            type: "question",
            title: title,
            subtitle: q.category,
            link: link
          });

          btn.classList.toggle("active", added);
          const svg = btn.querySelector("svg");
          if (svg) svg.setAttribute("fill", added ? "currentColor" : "none");
        }
      });
    });
  },

  updateBookmarkButtons() {
    document.querySelectorAll(".q-bookmark-btn").forEach((btn) => {
      const id = btn.getAttribute("data-id");
      if (window.BookmarkManager) {
        const isBm = window.BookmarkManager.isBookmarked(id);
        btn.classList.toggle("active", isBm);
        const svg = btn.querySelector("svg");
        if (svg) svg.setAttribute("fill", isBm ? "currentColor" : "none");
      }
    });
  },

  // 2. Question Details Page (question-details.html)
  // Implements the 11-step structured answer layout requested
  initDetailsPage() {
    const detailContainer = document.getElementById("questionDetailContainer");
    if (!detailContainer) return;

    const urlParams = new URLSearchParams(window.location.search);
    const qId = urlParams.get("id") || "q-suffering-evil";
    const q = window.DEEN_DATA.questions.find((item) => item.id === qId) || window.DEEN_DATA.questions[0];

    const isBn = window.LangManager && window.LangManager.currentLang === "bn";
    const title = isBn ? q.titleBn : q.title;
    const category = isBn ? q.categoryBn : q.category;
    const isBookmarked = window.BookmarkManager ? window.BookmarkManager.isBookmarked(q.id) : false;

    // Render 11-part structured answer layout
    detailContainer.innerHTML = `
      <div class="answer-detail-header">
        <div style="display: flex; gap: 0.5rem; margin-bottom: 1rem; align-items: center; flex-wrap: wrap;">
          <a href="questions.html" class="badge">← Back to Questions</a>
          <span class="badge badge-emerald">${category}</span>
          <span class="badge badge-gold">${q.difficulty}</span>
          <span class="badge">⏱️ ${q.readTime}</span>
        </div>
        <h1 style="font-size: 2.4rem; margin-bottom: 1.25rem;">${title}</h1>
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
          <span style="font-size: 0.9rem; color: var(--text-subtle);">Authentic Islamic Research • Verified Primary Sources</span>
          <div style="display: flex; gap: 0.5rem;">
            <button id="detailBookmarkBtn" class="btn btn-secondary btn-sm ${isBookmarked ? 'active' : ''}">
              <svg width="16" height="16" fill="${isBookmarked ? 'currentColor' : 'none'}" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path></svg>
              <span>${isBookmarked ? 'Saved' : 'Bookmark'}</span>
            </button>
            <button id="detailShareBtn" class="btn btn-secondary btn-sm">
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
              <span>Share</span>
            </button>
            <button id="detailCopyBtn" class="btn btn-gold btn-sm">
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
              <span>Copy Answer</span>
            </button>
          </div>
        </div>
      </div>

      <!-- 1. Direct Answer -->
      <section class="answer-section-block">
        <span class="section-num-tag">Section 01</span>
        <h2 class="answer-section-title">1. Direct Answer</h2>
        <p style="font-size: 1.15rem; font-weight: 500; color: var(--text-main); line-height: 1.85;">${q.directAnswer}</p>
      </section>

      <!-- VISUAL INFOGRAPHIC SECTION -->
      ${this.generateInfographicHTML(q, isBn)}

      <!-- 2. Understanding the Question -->
      <section class="answer-section-block">
        <span class="section-num-tag">Section 02</span>
        <h2 class="answer-section-title">2. Understanding the Question</h2>
        <p style="font-size: 1.05rem; line-height: 1.75;">${q.understandingQuestion}</p>
      </section>

      <!-- 3. Quranic Evidence -->
      <section class="answer-section-block">
        <span class="section-num-tag">Section 03</span>
        <h2 class="answer-section-title">3. Quranic Evidence</h2>
        ${q.quranicEvidence.map(item => `
          <div class="evidence-quote-box">
            <div class="arabic-text">${item.arabic}</div>
            <p style="font-size: 1.05rem; color: var(--text-main); margin-top: 0.5rem;">"${item.translation}"</p>
            <span class="ref-tag">— ${item.reference}</span>
          </div>
        `).join("")}
      </section>

      <!-- 4. Authentic Hadith Evidence -->
      <section class="answer-section-block">
        <span class="section-num-tag">Section 04</span>
        <h2 class="answer-section-title">4. Authentic Hadith Evidence</h2>
        ${q.hadithEvidence.map(item => `
          <div class="evidence-quote-box" style="border-left-color: var(--gold-500);">
            <div class="arabic-text" style="font-size: 1.5rem;">${item.arabic}</div>
            <p style="font-size: 1.05rem; color: var(--text-main); margin-top: 0.5rem;">"${isBn ? item.bangla : item.english}"</p>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.75rem;">
              <span class="badge badge-emerald">${item.grading}</span>
              <span class="ref-tag" style="margin: 0;">— ${item.source}</span>
            </div>
          </div>
        `).join("")}
      </section>

      <!-- 5. Explanation from Recognized Tafsir -->
      <section class="answer-section-block">
        <span class="section-num-tag">Section 05</span>
        <h2 class="answer-section-title">5. Explanation from Recognized Tafsir</h2>
        <p>${q.tafsirExplanation}</p>
      </section>

      <!-- 6. Scholarly Opinions -->
      <section class="answer-section-block">
        <span class="section-num-tag">Section 06</span>
        <h2 class="answer-section-title">6. Scholarly Opinions</h2>
        <p>${q.scholarlyOpinions}</p>
      </section>

      <!-- 7. Logical Reasoning -->
      <section class="answer-section-block">
        <span class="section-num-tag">Section 07</span>
        <h2 class="answer-section-title">7. Logical Reasoning</h2>
        <div style="white-space: pre-line; line-height: 1.8;">${q.logicalReasoning}</div>
      </section>

      <!-- 8. Different Perspectives -->
      <section class="answer-section-block">
        <span class="section-num-tag">Section 08</span>
        <h2 class="answer-section-title">8. Different Perspectives</h2>
        <p>${q.perspectives}</p>
      </section>

      <!-- 9. Common Misunderstandings -->
      <section class="answer-section-block">
        <span class="section-num-tag">Section 09</span>
        <h2 class="answer-section-title">9. Common Misunderstandings</h2>
        <p>${q.misunderstandings}</p>
      </section>

      <!-- 10. Conclusion -->
      <section class="answer-section-block">
        <span class="section-num-tag">Section 10</span>
        <h2 class="answer-section-title">10. Conclusion</h2>
        <p style="font-weight: 500; color: var(--text-main);">${q.conclusion}</p>
      </section>

      <!-- 11. References & Sources -->
      <section class="answer-section-block" style="border-top: 3px solid var(--primary-600);">
        <span class="section-num-tag">Section 11</span>
        <h2 class="answer-section-title">11. References & Verified Sources</h2>
        <ul style="list-style-type: square; margin-left: 1.5rem; color: var(--text-muted); line-height: 1.9;">
          ${q.references.map(ref => `<li>${ref}</li>`).join("")}
        </ul>
      </section>
    `;

    // Bind Detail page actions
    const bmBtn = document.getElementById("detailBookmarkBtn");
    if (bmBtn) {
      bmBtn.addEventListener("click", () => {
        if (window.BookmarkManager) {
          const added = window.BookmarkManager.toggle({
            id: q.id,
            type: "question",
            title: title,
            subtitle: q.category,
            link: `question-details.html?id=${q.id}`
          });
          bmBtn.classList.toggle("active", added);
          bmBtn.querySelector("span").textContent = added ? "Saved" : "Bookmark";
        }
      });
    }

    const shareBtn = document.getElementById("detailShareBtn");
    if (shareBtn) {
      shareBtn.addEventListener("click", () => {
        if (window.DeenApp) window.DeenApp.share(title, q.directAnswer);
      });
    }

    const copyBtn = document.getElementById("detailCopyBtn");
    if (copyBtn) {
      copyBtn.addEventListener("click", () => {
        const fullAnswerText = `${title}\n\nDIRECT ANSWER:\n${q.directAnswer}\n\nREFERENCES:\n${q.references.join('\n')}\n\nSourced via DEENQUEST (Authentic Islamic Knowledge Platform)`;
        if (window.DeenApp) window.DeenApp.copyText(fullAnswerText, "Full structured answer copied!");
      });
    }
  },

  generateInfographicHTML(q, isBn) {
    if (q.id === "q-suffering-evil") {
      return `
        <div class="infographic-wrapper">
          <div class="infographic-badge-header">
            <span class="badge badge-gold">Visual Infographic Analysis</span>
            <span style="font-size: 0.85rem; color: var(--gold-600); font-weight: 700;">Mobile Responsive • Verified Primary Texts</span>
          </div>

          <h3 class="infographic-banner-title">
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
            ${isBn ? "ইনফোগ্রাফিক: দুঃখ ও পরীক্ষার ৫টি আধ্যাত্মিক দিক" : "Infographic: The 5 Spiritual Dimensions of Earthly Trials"}
          </h3>
          <p style="color: var(--text-muted); margin-bottom: 1.5rem; font-size: 0.95rem;">
            ${isBn ? "ইসলামে দুঃখ ও কষ্ট কোনো অর্থহীন অবিচার নয়, বরং এটি আত্মিক উত্তরণ ও চরিত্র গঠনের এক সুনির্দিষ্ট প্রক্রিয়া।" : "In Islamic theology, earthly suffering is not arbitrary cruelty; it serves clear spiritual and moral functions in an eternal framework."}
          </p>

          <div class="infographic-img-box">
            <img src="../assets/images/hero-knowledge.jpg" alt="Islamic Wisdom and Patience" loading="lazy">
          </div>

          <div class="infographic-grid-5">
            <div class="infographic-step-card">
              <div class="step-number-bubble">1</div>
              <h4 class="step-card-heading">${isBn ? "আত্মিক পরিশুদ্ধি" : "Spiritual Purification"}</h4>
              <p class="step-card-text">
                ${isBn ? "সামান্য কাঁটার আঘাত বা ক্লান্তিও মুমিনের অতীতের গুনাহ মোচন করে এবং আত্মাকে পাপমুক্ত করে।" : "Even the prick of a thorn expiates sins and cleanses the soul from spiritual transgressions."}
              </p>
              <a href="javascript:void(0)" class="ref-verify-tag" onclick="DeenApp.copyText('Sahih al-Bukhari 5641, Sahih Muslim 2573', 'Reference copied!')">
                🔍 Sahih Bukhari 5641
              </a>
            </div>

            <div class="infographic-step-card">
              <div class="step-number-bubble">2</div>
              <h4 class="step-card-heading">${isBn ? "ধৈর্য ও আত্মশক্তি" : "Sabr & Resilience"}</h4>
              <p class="step-card-text">
                ${isBn ? "ভয়, ক্ষুধা ও ধন-সম্পদের ক্ষতির মধ্য দিয়ে প্রকৃত ধৈর্যশীল ও সৎকর্মশীলদের বাছাই করা হয়।" : "Hardship acts as a crucible, testing patience and forging unwavering moral strength."}
              </p>
              <a href="javascript:void(0)" class="ref-verify-tag" onclick="DeenApp.copyText('Surah Al-Baqarah 2:155', 'Reference copied!')">
                🔍 Quran 2:155
              </a>
            </div>

            <div class="infographic-step-card">
              <div class="step-number-bubble">3</div>
              <h4 class="step-card-heading">${isBn ? "স্বাধীন ইচ্ছার পরীক্ষা" : "Moral Free Will"}</h4>
              <p class="step-card-text">
                ${isBn ? "জীবন ও মৃত্যু সৃষ্টির মূল উদ্দেশ্য হলো কে সৎকাজে সর্বোত্তম—তার বাস্তব মূল্যায়ন করা।" : "Without genuine consequences and moral challenges, human free will would be an illusion."}
              </p>
              <a href="javascript:void(0)" class="ref-verify-tag" onclick="DeenApp.copyText('Surah Al-Mulk 67:2', 'Reference copied!')">
                🔍 Quran 67:2
              </a>
            </div>

            <div class="infographic-step-card">
              <div class="step-number-bubble">4</div>
              <h4 class="step-card-heading">${isBn ? "সহমর্মিতার বিকাশ" : "Empathy Awakening"}</h4>
              <p class="step-card-text">
                ${isBn ? "নিজে ক্ষুধা ও অসুস্থতার স্বাদ না পেলে অসহায় মানুষের কষ্ট অনুভব করা ও সেবা করা অসম্ভব।" : "Experiencing personal vulnerability opens the heart to deep compassion for others in pain."}
              </p>
              <a href="javascript:void(0)" class="ref-verify-tag" onclick="DeenApp.copyText('Sahih Muslim 2586', 'Reference copied!')">
                🔍 Sahih Muslim 2586
              </a>
            </div>

            <div class="infographic-step-card">
              <div class="step-number-bubble">5</div>
              <h4 class="step-card-heading">${isBn ? "অনন্ত পুরস্কার" : "Infinite Reward"}</h4>
              <p class="step-card-text">
                ${isBn ? "অনন্ত পরকালের অসীম শান্তির তুলনায় ক্ষণস্থায়ী পৃথিবীর কয়েক মুহূর্তের কষ্ট শূন্যের সমান।" : "In light of infinite eternity in Paradise, earthly suffering mathematically approaches zero."}
              </p>
              <a href="javascript:void(0)" class="ref-verify-tag" onclick="DeenApp.copyText('Surah Az-Zumar 39:10', 'Reference copied!')">
                🔍 Quran 39:10
              </a>
            </div>
          </div>
        </div>
      `;
    }

    if (q.id === "q-science-islam") {
      return `
        <div class="infographic-wrapper">
          <div class="infographic-badge-header">
            <span class="badge badge-emerald">Science & Quran Infographic</span>
            <span style="font-size: 0.85rem; color: var(--gold-600); font-weight: 700;">Empirical Scientific Legacy</span>
          </div>

          <h3 class="infographic-banner-title">
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
            ${isBn ? "ইনফোগ্রাফিক: কুরআন ও মহাজাগতিক অনুসন্ধান" : "Infographic: Cosmic Harmony & Empirical Method"}
          </h3>

          <div class="infographic-img-box">
            <img src="../assets/images/science-islam.jpg" alt="Islamic Astronomy and Scientific Method" loading="lazy">
          </div>

          <div class="infographic-grid-3">
            <div class="infographic-step-card">
              <div class="step-number-bubble">✦</div>
              <h4 class="step-card-heading">${isBn ? "মহাবিশ্বের বিস্তার ও মহাবিস্ফোরণ" : "Cosmic Origins (Big Bang & Expansion)"}</h4>
              <p class="step-card-text">
                ${isBn ? "আকাশমণ্ডল ও পৃথিবী একীভূত ছিল, অতঃপর আল্লাহ তাদের পৃথক করেন এবং মহাশূন্য প্রতিনিয়ত সম্প্রসারিত হচ্ছে।" : "The heavens and earth were joined together before separation, and the cosmos continues expanding."}
              </p>
              <a href="javascript:void(0)" class="ref-verify-tag" onclick="DeenApp.copyText('Surah Al-Anbiya 21:30 & Adh-Dhariyat 51:47', 'Reference copied!')">
                🔍 Quran 21:30, 51:47
              </a>
            </div>

            <div class="infographic-step-card">
              <div class="step-number-bubble">✦</div>
              <h4 class="step-card-heading">${isBn ? "জীবনের ভিত্তি পানি" : "Water as Biological Foundation"}</h4>
              <p class="step-card-text">
                ${isBn ? "কুরআনে ১৪০০ বছর পূর্বে স্পষ্ট ঘোষণা করা হয়েছে যে প্রতিটি জীবন্ত সত্তা পানির মাধ্যমে সৃষ্ট ও জীবিত।" : "Every living organism is fundamentally water-based, revealed centuries before modern cytology."}
              </p>
              <a href="javascript:void(0)" class="ref-verify-tag" onclick="DeenApp.copyText('Surah Al-Anbiya 21:30', 'Reference copied!')">
                🔍 Quran 21:30
              </a>
            </div>

            <div class="infographic-step-card">
              <div class="step-number-bubble">✦</div>
              <h4 class="step-card-heading">${isBn ? "পরীক্ষামূলক আধুনিক বিজ্ঞান" : "Modern Scientific Method"}</h4>
              <p class="step-card-text">
                ${isBn ? "ইবনে আল-হাইসাম ও আল-বিরুনী অন্ধ অনুকরণ ত্যাগ করে নিয়ন্ত্রিত পরীক্ষা ও পর্যবেক্ষণের পদ্ধতি প্রবর্তন করেন।" : "Muslim polymaths (Ibn al-Haytham) founded empirical optics and controlled experimentation."}
              </p>
              <a href="javascript:void(0)" class="ref-verify-tag" onclick="DeenApp.copyText('Ibn al-Haytham, Kitab al-Manazir', 'Reference copied!')">
                🔍 Kitab al-Manazir (Optics)
              </a>
            </div>
          </div>
        </div>
      `;
    }

    if (q.id === "q-women-rights") {
      return `
        <div class="infographic-wrapper">
          <div class="infographic-badge-header">
            <span class="badge badge-gold">Human Rights Infographic</span>
            <span style="font-size: 0.85rem; color: var(--gold-600); font-weight: 700;">14-Century Revolutionary Protections</span>
          </div>

          <h3 class="infographic-banner-title">
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
            ${isBn ? "ইনফোগ্রাফিক: ইসলামপূর্ব যুগ বনাম ইসলামে নারীর আইনি অধিকার" : "Infographic: Pre-Islamic Era vs Islamic Protections for Women"}
          </h3>

          <div class="infographic-img-box">
            <img src="../assets/images/women-islam.jpg" alt="Women in Islamic Scholarship" loading="lazy">
          </div>

          <div class="comparison-table-wrap">
            <table class="comparison-table">
              <thead>
                <tr>
                  <th>${isBn ? "অধিকারের ক্ষেত্র" : "Legal Domain"}</th>
                  <th>${isBn ? "ইসলামপূর্ব জাহেলিয়াত ও ঐতিহাসিক পশ্চিমি আইন" : "Historical Coverture / Pre-Islam"}</th>
                  <th>${isBn ? "ইসলামি শরীয়াহ প্রদত্ত স্থায়ী অধিকার" : "Islamic Canonical Protections"}</th>
                  <th>${isBn ? "দলিল যাচাই" : "Verify Source"}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>${isBn ? "সম্পত্তির স্বাধীন মালিকানা" : "Financial Ownership"}</strong></td>
                  <td>নারীর নিজস্ব অর্থ থাকত না; বিবাহের পর সমস্ত সম্পদ স্বামীর হস্তগত হতো।</td>
                  <td>সম্পূর্ণ নিজস্ব ব্যাংক একাউন্ট ও সম্পদের একক মালিকানা; ব্যয় করার কোনো বাধ্যবাধকতা নেই।</td>
                  <td><a href="javascript:void(0)" class="ref-verify-tag" onclick="DeenApp.copyText('Surah An-Nisa 4:32', 'Copied!')">Quran 4:32</a></td>
                </tr>
                <tr>
                  <td><strong>${isBn ? "বিবাহে স্বাধীন সম্মতি" : "Consent to Marriage"}</strong></td>
                  <td>পণ্য হিসেবে জোরপূর্বক বিবাহ দেওয়া হতো বা উত্তরাধিকার সূত্রে বণ্টন করা হতো।</td>
                  <td>নারীর স্পষ্ট এবং স্বাধীন সম্মতি ব্যতীত কোনো বিবাহ ইসলামে বৈধ নয়।</td>
                  <td><a href="javascript:void(0)" class="ref-verify-tag" onclick="DeenApp.copyText('Sahih al-Bukhari 5136', 'Copied!')">Bukhari 5136</a></td>
                </tr>
                <tr>
                  <td><strong>${isBn ? "পরিবারের আর্থিক ভরণপোষণ" : "Household Maintenance"}</strong></td>
                  <td>নারীকে বাধ্যতামূলক শারীরিক ও অর্থনৈতিক শ্রম দিতে হতো।</td>
                  <td>১০০% ভরণপোষণ (খাবার, বাসা, চিকিৎসা) বহন করা স্বামীর আইনি দায়িত্ব; স্ত্রীর অর্থ স্ত্রীরই।</td>
                  <td><a href="javascript:void(0)" class="ref-verify-tag" onclick="DeenApp.copyText('Surah An-Nisa 4:34', 'Copied!')">Quran 4:34</a></td>
                </tr>
                <tr>
                  <td><strong>${isBn ? "শিক্ষা ও জ্ঞানচর্চা" : "Higher Education"}</strong></td>
                  <td>নারীদের বিদ্যালয় ও উচ্চশিক্ষায় প্রবেশাধিকার শতাব্দীর পর শতাব্দী নিষিদ্ধ ছিল।</td>
                  <td>জ্ঞান অন্বেষণ নারী-পুরুষ উভয়ের ওপর ফরজ। আয়েশা (রা.) ছিলেন সর্বোচ্চ পর্যায়ের স্কলার।</td>
                  <td><a href="javascript:void(0)" class="ref-verify-tag" onclick="DeenApp.copyText('Sunan Ibn Majah 224', 'Copied!')">Ibn Majah 224</a></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      `;
    }

    // Default authentic visual infographic breakdown for other questions
    return `
      <div class="infographic-wrapper">
        <div class="infographic-badge-header">
          <span class="badge badge-gold">Analytical Infographic Breakdown</span>
          <span style="font-size: 0.85rem; color: var(--gold-600); font-weight: 700;">Structured Primary Evidence</span>
        </div>

        <h3 class="infographic-banner-title">
          <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          ${isBn ? "ইনফোগ্রাফিক: মৌলিক প্রামাণ্য বিশ্লেষণ ও সূত্র যাচাই" : "Infographic: Canonical Analysis & Source Verification"}
        </h3>

        <div class="infographic-grid-3">
          <div class="infographic-step-card">
            <div class="step-number-bubble">01</div>
            <h4 class="step-card-heading">${isBn ? "ঐশী ওহীর সরাসরি ভিত্তি" : "Direct Quranic Mandate"}</h4>
            <p class="step-card-text">
              ${isBn ? "পবিত্র কুরআনের মুহকাম (সুস্পষ্ট) আয়াতের আলোকে সমস্যার মূল দিক ব্যাখ্যা করা হয়েছে।" : "Established directly through unambiguous categorical verses of the Holy Quran."}
            </p>
            <a href="javascript:void(0)" class="ref-verify-tag" onclick="DeenApp.copyText('${q.quranicEvidence[0] ? q.quranicEvidence[0].reference : "Quran"}', 'Copied!')">
              🔍 ${q.quranicEvidence[0] ? q.quranicEvidence[0].reference : "Quran"}
            </a>
          </div>

          <div class="infographic-step-card">
            <div class="step-number-bubble">02</div>
            <h4 class="step-card-heading">${isBn ? "সহীহ সুন্নাহর বাস্তব প্রয়োগ" : "Prophetic Sunnah Model"}</h4>
            <p class="step-card-text">
              ${isBn ? "রাসূলুল্লাহ (সা.)-এর সহীহ হাদিস ও সাহাবাদের আমলের মাধ্যমে বাস্তবায়ন নির্দেশিত।" : "Validated through mass-transmitted authentic Sunnah recorded in Kutub al-Sittah."}
            </p>
            <a href="javascript:void(0)" class="ref-verify-tag" onclick="DeenApp.copyText('${q.hadithEvidence[0] ? q.hadithEvidence[0].source : "Hadith"}', 'Copied!')">
              🔍 ${q.hadithEvidence[0] ? q.hadithEvidence[0].source : "Hadith"}
            </a>
          </div>

          <div class="infographic-step-card">
            <div class="step-number-bubble">03</div>
            <h4 class="step-card-heading">${isBn ? "যৌক্তিক ভারসাম্য ও প্রজ্ঞা" : "Rational & Ethical Wisdom"}</h4>
            <p class="step-card-text">
              ${isBn ? "মানব স্বভাব (ফিতরাত) ও বুদ্ধিবৃত্তিক যুক্তির সাথে শরীয়াহর পূর্ণাঙ্গ সামঞ্জস্য।" : "Harmonizing human nature (Fitrah) with sound rational contemplation and moral welfare."}
            </p>
            <span class="ref-verify-tag">
              ⚖️ Maqasid al-Shariah
            </span>
          </div>
        </div>
      </div>
    `;
  },

  escapeQuotes(str) {
    if (!str) return "";
    return str.replace(/"/g, '&quot;');
  }
};

document.addEventListener("DOMContentLoaded", () => {
  QuestionsManager.init();
});
