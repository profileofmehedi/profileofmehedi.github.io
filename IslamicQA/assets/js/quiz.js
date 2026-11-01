/**
 * DEENQUEST - Interactive Islamic Knowledge Quiz Engine
 * Multi-level (Beginner, Intermediate, Advanced), instant feedback,
 * evidence citations, score calculations, and review.
 */

const QuizEngine = {
  activeLevel: "all",
  questions: [],
  currentIndex: 0,
  score: 0,
  answered: false,

  init() {
    const container = document.getElementById("quizAppContainer");
    if (!container) return;

    this.bindLevelButtons();
    this.startQuiz("beginner");
  },

  bindLevelButtons() {
    const levelBtns = document.querySelectorAll(".quiz-level-btn");
    levelBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        levelBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        const level = btn.getAttribute("data-level") || "beginner";
        this.startQuiz(level);
      });
    });
  },

  startQuiz(level) {
    this.activeLevel = level;
    this.score = 0;
    this.currentIndex = 0;
    this.answered = false;

    if (level === "all") {
      this.questions = [...window.DEEN_DATA.quizQuestions];
    } else {
      this.questions = window.DEEN_DATA.quizQuestions.filter((q) => q.level === level);
    }

    this.renderQuestion();
  },

  renderQuestion() {
    const container = document.getElementById("quizAppContainer");
    if (!container) return;

    if (this.currentIndex >= this.questions.length) {
      this.renderResults();
      return;
    }

    const q = this.questions[this.currentIndex];
    const isBn = window.LangManager && window.LangManager.currentLang === "bn";
    const questionText = isBn ? q.questionBn : q.question;
    const progressPercent = ((this.currentIndex) / this.questions.length) * 100;

    this.answered = false;

    container.innerHTML = `
      <div class="quiz-container">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; font-size: 0.88rem;">
          <span class="badge badge-emerald">Question ${this.currentIndex + 1} of ${this.questions.length}</span>
          <span style="font-weight: 700; color: var(--gold-600);">Score: ${this.score} / ${this.questions.length}</span>
        </div>

        <div class="quiz-progress-bar">
          <div class="quiz-progress-fill" style="width: ${progressPercent}%;"></div>
        </div>

        <div class="quiz-question-box">
          <span class="badge badge-gold" style="margin-bottom: 1rem;">${isBn ? q.levelLabelBn : q.levelLabel}</span>
          <h2 style="font-size: 1.45rem; margin-bottom: 1.75rem; line-height: 1.4;">${questionText}</h2>

          <div class="quiz-options-list">
            ${q.options.map((opt, idx) => `
              <button class="quiz-opt-btn" data-index="${idx}">
                <strong style="margin-right: 0.5rem; color: var(--gold-600);">${String.fromCharCode(65 + idx)}.</strong> ${opt}
              </button>
            `).join("")}
          </div>

          <div id="quizExplanationBlock" class="quiz-explanation-box">
            <strong style="color: var(--primary-700); display: block; margin-bottom: 0.35rem;">Authentic Explanation:</strong>
            <p style="font-size: 0.95rem; margin-bottom: 0.65rem;">${q.explanation}</p>
            <span class="ref-tag" style="font-size: 0.85rem; color: var(--gold-600); font-weight: 700;">Reference: ${q.reference}</span>
            <div style="margin-top: 1.25rem;">
              <button id="nextQuestionBtn" class="btn btn-primary btn-sm">Next Question →</button>
            </div>
          </div>
        </div>
      </div>
    `;

    this.bindOptionClicks(q);
  },

  bindOptionClicks(q) {
    const optButtons = document.querySelectorAll(".quiz-opt-btn");
    const expBox = document.getElementById("quizExplanationBlock");

    optButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        if (this.answered) return;
        this.answered = true;

        const selectedIndex = parseInt(btn.getAttribute("data-index"));
        const isCorrect = selectedIndex === q.correct;

        if (isCorrect) {
          btn.classList.add("correct");
          this.score++;
        } else {
          btn.classList.add("incorrect");
          // Highlight correct answer
          optButtons[q.correct].classList.add("correct");
        }

        // Disable all buttons
        optButtons.forEach((b) => (b.disabled = true));

        // Show explanation
        if (expBox) expBox.style.display = "block";

        const nextBtn = document.getElementById("nextQuestionBtn");
        if (nextBtn) {
          nextBtn.addEventListener("click", () => {
            this.currentIndex++;
            this.renderQuestion();
          });
        }
      });
    });
  },

  renderResults() {
    const container = document.getElementById("quizAppContainer");
    if (!container) return;

    const percentage = Math.round((this.score / this.questions.length) * 100);
    let feedback = "";

    if (percentage === 100) {
      feedback = "Masha'Allah! Perfect score! Exceptional command of authentic Islamic knowledge.";
    } else if (percentage >= 70) {
      feedback = "Alhamdulillah! Very strong knowledge base with sound grasp of foundational principles.";
    } else {
      feedback = "A commendable effort. Keep exploring the Quran, Hadith, and scholarly texts to deepen your understanding.";
    }

    container.innerHTML = `
      <div class="quiz-container">
        <div class="quiz-question-box" style="text-align: center; padding: 3.5rem 2rem;">
          <div style="width: 80px; height: 80px; border-radius: 50%; background: rgba(5, 150, 105, 0.12); color: var(--primary-600); display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem;">
            <svg width="40" height="40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          <span class="badge badge-gold" style="margin-bottom: 0.75rem;">Quiz Completed</span>
          <h2 style="font-size: 2.2rem; margin-bottom: 0.75rem;">Your Score: ${this.score} / ${this.questions.length} (${percentage}%)</h2>
          <p style="font-size: 1.1rem; color: var(--text-muted); max-width: 520px; margin: 0 auto 2rem;">${feedback}</p>
          <div style="display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap;">
            <button id="retryQuizBtn" class="btn btn-primary">Try Again</button>
            <a href="questions.html" class="btn btn-secondary">Explore Q&A Library</a>
          </div>
        </div>
      </div>
    `;

    const retryBtn = document.getElementById("retryQuizBtn");
    if (retryBtn) {
      retryBtn.addEventListener("click", () => {
        this.startQuiz(this.activeLevel);
      });
    }
  }
};

document.addEventListener("DOMContentLoaded", () => {
  QuizEngine.init();
});
