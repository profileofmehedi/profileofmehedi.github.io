/**
 * Experience 3: Friendship Challenge (বন্ধুত্ব পরীক্ষা)
 * Create and solve fun friendship challenges completely client-side.
 */

const FriendshipExperience = (function () {
  const QUESTION_BANK = [
    {
      id: 1,
      q: 'আমি বেশি রাত জাগি নাকি সকালে উঠি?',
      options: ['রাতজাগা প্যাঁচা 🦉', 'ভোরের পাখি 🌅', 'যখন ইচ্ছা তখন ঘুম 😴', 'কখনোই ঠিক সময়ে না ⏰']
    },
    {
      id: 2,
      q: 'আমার সবচেয়ে পছন্দের পানীয় কোনটি?',
      options: ['গরম চা ☕', 'কোল্ড কফি 🥤', 'লেবুর শরবত 🍋', 'শুধু ঠাণ্ডা পানি 🧊']
    },
    {
      id: 3,
      q: 'রাগ হলে আমি সাধারণত কী করি?',
      options: ['চুপচাপ থাকি 🤐', 'চিৎকার করে রাগ ঝাড়ি 😠', 'খাবার খাই 🍔', 'গান শুনে ঘুমিয়ে পড়ি 🎧']
    },
    {
      id: 4,
      q: 'আমার পছন্দের ছুটির দিন কেমন?',
      options: ['বিছানায় শুয়ে সিনেমা 🎬', 'বন্ধুদের সাথে আড্ডা 🍕', 'ঘুরতে বের হওয়া 🚗', 'বই পড়া বা গান শোনা 📖']
    },
    {
      id: 5,
      q: 'যদি একটি সুপারপাওয়ার পেতাম, কোনটা নিতাম?',
      options: ['অদৃশ্য হওয়া 👻', 'মনের কথা পড়া 🧠', 'উড়ে বেড়ানো 🦅', 'টাইম ট্রাভেল ⏳']
    },
    {
      id: 6,
      q: 'আমার পছন্দের ঋতু কোনটি?',
      options: ['শীতকাল ❄️', 'বর্ষাকাল 🌧️', 'বসন্ত 🌸', 'শরৎ 🌾']
    },
    {
      id: 7,
      q: 'কোন বিষয়ে আমি সবচেয়ে বেশি সময় ব্যয় করি?',
      options: ['সোশ্যাল মিডিয়ায় স্ক্রল 📱', 'কাজ বা পড়াশোনায় 💻', 'গল্প আর আড্ডায় 🗣️', 'নতুন কিছু শিখতে 📚']
    }
  ];

  let creatorName = 'Mehedi';
  let selectedAnswers = {
    1: 0,
    2: 0,
    3: 0,
    4: 1,
    5: 3
  };

  let solverState = {
    isSolving: false,
    solverName: '',
    answers: {},
    score: 0
  };

  /**
   * Encode quiz into URL-safe base64 string
   */
  const encodeQuizData = () => {
    const data = {
      n: creatorName,
      a: selectedAnswers
    };
    try {
      return btoa(unescape(encodeURIComponent(JSON.stringify(data))));
    } catch (e) {
      return '';
    }
  };

  /**
   * Decode quiz from URL string
   */
  const decodeQuizData = (encoded) => {
    try {
      const json = decodeURIComponent(escape(atob(encoded)));
      return JSON.parse(json);
    } catch (e) {
      return null;
    }
  };

  /**
   * Render creator's questions list
   */
  const renderQuestionList = () => {
    const container = document.getElementById('friendship-questions-container');
    if (!container) return;

    let html = '';
    QUESTION_BANK.slice(0, 5).forEach((item) => {
      const currentAns = selectedAnswers[item.id] !== undefined ? selectedAnswers[item.id] : 0;
      html += `
        <div class="quiz-question-card" data-qid="${item.id}">
          <div style="font-weight:700; font-size:1rem; margin-bottom:0.5rem; color:var(--text-primary)">
            ${Utils.toBengaliNumerals(item.id)}. ${item.q}
          </div>
          <div class="quiz-options-grid">
            ${item.options.map((opt, idx) => `
              <button type="button" class="quiz-option-btn ${currentAns === idx ? 'selected' : ''}" data-qid="${item.id}" data-opt="${idx}">
                ${opt}
              </button>
            `).join('')}
          </div>
        </div>
      `;
    });
    container.innerHTML = html;

    // Bind clicks
    $('.quiz-option-btn').on('click', function () {
      const qid = $(this).data('qid');
      const opt = $(this).data('opt');
      selectedAnswers[qid] = opt;
      $(`.quiz-option-btn[data-qid="${qid}"]`).removeClass('selected');
      $(this).addClass('selected');
      renderCardPreview();
    });
  };

  /**
   * Render the visual challenge card preview
   */
  const renderCardPreview = () => {
    const card = document.getElementById('friendship-art-card');
    if (!card) return;

    const nameEl = card.querySelector('.friendship-creator-title');
    if (nameEl) nameEl.textContent = `${creatorName}-এর ফ্রেন্ডশিপ চ্যালেঞ্জ!`;

    const summaryCount = card.querySelector('.friendship-q-count');
    if (summaryCount) summaryCount.textContent = `${Utils.toBengaliNumerals(Object.keys(selectedAnswers).length)}টি প্রশ্ন`;
  };

  return {
    init: function () {
      const $form = $('#friendship-form');
      if (!$form.length) return;

      // Check if URL has incoming quiz challenge
      const hash = window.location.hash;
      if (hash.includes('quiz=')) {
        const encoded = hash.split('quiz=')[1];
        const incoming = decodeQuizData(encoded);
        if (incoming && incoming.n) {
          this.initSolverMode(incoming);
          return;
        }
      }

      $('#fc-creator-name').on('input', function () {
        creatorName = $(this).val() || 'আমার';
        renderCardPreview();
      });

      // Render questions
      renderQuestionList();
      renderCardPreview();

      // Download Challenge Card
      $('#fc-download-btn').on('click', async function () {
        const card = document.getElementById('friendship-art-card');
        await ImageExporter.exportElementToPNG(card, {
          filename: `friendship-challenge-${creatorName.toLowerCase()}.png`
        });
      });

      // Share Link Button
      $('#fc-share-link-btn').on('click', function () {
        const encoded = encodeQuizData();
        const fullUrl = `${window.location.origin}${window.location.pathname}#friendship?quiz=${encoded}`;
        Utils.copyToClipboard(fullUrl, 'কুইজ লিংক কপি করা হয়েছে! বন্ধুদের পাঠিয়ে দিন 🎉');
      });

      // Share Image & Dialog
      $('#fc-share-btn').on('click', function () {
        const card = document.getElementById('friendship-art-card');
        ImageExporter.openResultModal({
          title: `${creatorName}-এর ফ্রেন্ডশিপ চ্যালেঞ্জ`,
          element: card,
          filename: `friendship-challenge-${creatorName.toLowerCase()}.png`,
          shareText: `${creatorName}-কে আপনি কতটা চেনেন? এই কুইজ খেলে দেখুন!`
        });
      });
    },

    /**
     * Solver mode when someone opens a challenge link
     */
    initSolverMode: function (quizData) {
      $('#fc-creator-mode').hide();
      $('#fc-solver-mode').show();

      $('#fc-incoming-creator-name').text(quizData.n);

      let currentStep = 0;
      const qIds = Object.keys(quizData.a).map(Number);
      let userScore = 0;

      const renderSolverStep = () => {
        if (currentStep >= qIds.length) {
          // Finished quiz!
          $('#fc-solver-step-box').hide();
          $('#fc-solver-result-box').show();

          const total = qIds.length;
          $('#fc-solver-score-display').text(`${Utils.toBengaliNumerals(userScore)} / ${Utils.toBengaliNumerals(total)}`);

          let remarks = 'দারুণ বন্ধুত্ব!';
          if (userScore === total) remarks = 'অবিশ্বাস্য! আপনারা আত্মার আত্মীয় (Soulmate)! 🌟';
          else if (userScore >= total * 0.7) remarks = 'আপনি একজন অসাধারণ বন্ধু! ❤️';
          else remarks = 'একটু বেশি সময় আড্ডা দিতে হবে! 😉';

          $('#fc-solver-remarks').text(remarks);
          AnimationEngine.celebrate();
          return;
        }

        const qid = qIds[currentStep];
        const qObj = QUESTION_BANK.find(q => q.id === qid) || QUESTION_BANK[0];

        $('#fc-solver-q-text').text(`${Utils.toBengaliNumerals(currentStep + 1)}. ${qObj.q}`);
        const optsContainer = $('#fc-solver-options');
        optsContainer.empty();

        qObj.options.forEach((opt, idx) => {
          const btn = $(`<button type="button" class="btn btn-secondary" style="width:100%; text-align:left; justify-content:flex-start; margin-bottom:0.5rem">${opt}</button>`);
          btn.on('click', () => {
            const correctAns = quizData.a[qid];
            if (idx === correctAns) {
              userScore++;
            }
            currentStep++;
            renderSolverStep();
          });
          optsContainer.append(btn);
        });
      };

      $('#fc-start-solve-btn').on('click', function () {
        $('#fc-solver-welcome').hide();
        $('#fc-solver-step-box').show();
        renderSolverStep();
      });

      $('#fc-create-own-btn').on('click', function () {
        window.location.hash = '#friendship';
        window.location.reload();
      });
    }
  };
})();

window.FriendshipExperience = FriendshipExperience;
