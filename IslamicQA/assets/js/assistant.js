/**
 * DEENQUEST - Islamic AI Assistant Simulator
 * Intelligent simulated research assistant adhering strictly to Islamic research ethics:
 * Never claims to issue fatwas; cites sources; acknowledges limitations.
 */

const AssistantEngine = {
  chatMessagesEl: null,
  inputEl: null,
  sendBtn: null,
  history: [],

  init() {
    this.chatMessagesEl = document.getElementById("aiChatMessages");
    this.inputEl = document.getElementById("aiChatInput");
    this.sendBtn = document.getElementById("aiSendBtn");

    if (!this.chatMessagesEl || !this.inputEl) return;

    this.bindEvents();
    this.renderWelcomeMessage();
  },

  bindEvents() {
    if (this.sendBtn) {
      this.sendBtn.addEventListener("click", () => this.handleSendMessage());
    }

    if (this.inputEl) {
      this.inputEl.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          this.handleSendMessage();
        }
      });
    }

    // Suggested question buttons
    document.querySelectorAll(".suggested-query-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const text = btn.textContent.trim();
        if (this.inputEl) {
          this.inputEl.value = text;
          this.handleSendMessage();
        }
      });
    });

    const clearBtn = document.getElementById("clearChatBtn");
    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        this.history = [];
        this.chatMessagesEl.innerHTML = "";
        this.renderWelcomeMessage();
      });
    }
  },

  renderWelcomeMessage() {
    const isBn = window.LangManager && window.LangManager.currentLang === "bn";
    const welcomeText = isBn
      ? "আসসালামু আলাইকুম। আমি দ্বীনকোয়েস্টের শিক্ষামূলক এআই সহকারী। ইসলামি ধর্মতত্ত্ব, বিজ্ঞান ও বিশ্বাস, নারীদের অধিকার, কিংবা দৈনন্দিন ফিকহ সম্পর্কে যেকোনো প্রশ্ন করতে পারেন। আমি নির্ভরযোগ্য ও প্রামাণ্য দলিলের ভিত্তিতে উত্তর উপস্থাপনের চেষ্টা করব।"
      : "As-salamu alaykum. I am the DEENQUEST Educational Research Assistant. Ask any question regarding Islamic theology, suffering, science, women's rights, prayer, or history. All insights are cross-referenced with authentic Quranic verses, Sahih Hadiths, and recognized classical scholarship.";

    this.appendMessage("ai", welcomeText, [
      "Quran & Sunnah Grounded",
      "Non-Fatwa Educational Tool"
    ]);
  },

  handleSendMessage() {
    const text = this.inputEl.value.trim();
    if (!text) return;

    this.appendMessage("user", text);
    this.inputEl.value = "";
    this.inputEl.focus();

    // Show simulated typing indicator
    const typingId = this.showTypingIndicator();

    setTimeout(() => {
      this.removeTypingIndicator(typingId);
      const response = window.AI_SIMULATOR.matchQuery(text);

      let body = `<strong>${response.title}</strong><br><br>${response.summary}`;
      if (response.link) {
        body += `<br><br><a href="${response.link}" style="font-weight: 600; text-decoration: underline;">Read Full 11-Part Research Document →</a>`;
      }

      this.appendMessage("ai", body, response.sources);
    }, 700);
  },

  appendMessage(sender, content, citations = []) {
    const bubble = document.createElement("div");
    bubble.className = `chat-bubble ${sender === "user" ? "bubble-user" : "bubble-ai"}`;

    let html = `<div>${content}</div>`;

    if (citations && citations.length > 0) {
      html += `
        <div class="citation-chip-row">
          <span style="font-size: 0.72rem; color: var(--gold-600); font-weight: 700;">Sources:</span>
          ${citations.map(c => `<span class="citation-chip">${c}</span>`).join("")}
        </div>
      `;
    }

    bubble.innerHTML = html;
    this.chatMessagesEl.appendChild(bubble);
    this.chatMessagesEl.scrollTop = this.chatMessagesEl.scrollHeight;
  },

  showTypingIndicator() {
    const id = "typing-" + Date.now();
    const typingEl = document.createElement("div");
    typingEl.id = id;
    typingEl.className = "chat-bubble bubble-ai";
    typingEl.style.display = "flex";
    typingEl.style.alignItems = "center";
    typingEl.style.gap = "6px";
    typingEl.innerHTML = `
      <span style="font-size: 0.85rem; color: var(--text-subtle);">Searching verified sources...</span>
    `;
    this.chatMessagesEl.appendChild(typingEl);
    this.chatMessagesEl.scrollTop = this.chatMessagesEl.scrollHeight;
    return id;
  },

  removeTypingIndicator(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
  }
};

document.addEventListener("DOMContentLoaded", () => {
  AssistantEngine.init();
});
