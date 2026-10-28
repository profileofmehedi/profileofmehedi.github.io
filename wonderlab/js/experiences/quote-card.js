/**
 * Experience 5: My Quote Card (আমার উক্তি কার্ড)
 * Create stunning Bengali and English typography cards with background customization.
 */

const QuoteCardExperience = (function () {
  const QUOTE_LIBRARY = [
    {
      category: 'motivation',
      quote: 'নিজের প্রতি বিশ্বাস রাখুন, আপনি যতটা ভাবেন তার চেয়েও বেশি শক্তিশালী।',
      author: 'রবীন্দ্রনাথ ঠাকুর'
    },
    {
      category: 'motivation',
      quote: 'সততা ও কঠোর পরিশ্রমের কোনো বিকল্প নেই, সাফল্য আসবেই।',
      author: 'এ পি জে আবদুল কালাম'
    },
    {
      category: 'dreams',
      quote: 'স্বপ্ন সেটা নয় যা তুমি ঘুমিয়ে দেখ, স্বপ্ন সেটাই যা তোমাকে ঘুমাতে দেয় না।',
      author: 'এ পি জে আবদুল কালাম'
    },
    {
      category: 'life',
      quote: 'জীবনকে ভালোবাসুন, প্রতিটি মুহূর্ত এক অপার সম্ভাবনার দ্বার।',
      author: 'কাজী নজরুল ইসলাম'
    },
    {
      category: 'learning',
      quote: 'ভুল করা কোনো ব্যর্থতা নয়, কিছু না শেখাই আসল ব্যর্থতা।',
      author: 'আলবার্ট আইনস্টাইন'
    },
    {
      category: 'gratitude',
      quote: 'ছোট ছোট আনন্দেই জীবনের প্রকৃত সার্থকতা লুকিয়ে থাকে।',
      author: 'হুমায়ূন আহমেদ'
    },
    {
      category: 'friendship',
      quote: 'বন্ধুত্ব এমন এক আশ্রয়, যেখানে হৃদয় কোনো দ্বিধা ছাড়াই বিশ্রাম নিতে পারে।',
      author: 'চিরন্তন প্রবাদ'
    },
    {
      category: 'motivation',
      quote: 'Start where you are. Use what you have. Do what you can.',
      author: 'Arthur Ashe'
    },
    {
      category: 'dreams',
      quote: 'The future belongs to those who believe in the beauty of their dreams.',
      author: 'Eleanor Roosevelt'
    }
  ];

  const GRADIENTS = [
    'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #701a75 100%)',
    'linear-gradient(135deg, #022c22 0%, #065f46 45%, #0e7490 100%)',
    'linear-gradient(135deg, #4c0519 0%, #831843 45%, #ea580c 100%)',
    'linear-gradient(135deg, #18181b 0%, #3b0764 50%, #4c1d95 100%)',
    'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
    'linear-gradient(135deg, #451a03 0%, #78350f 50%, #d97706 100%)'
  ];

  let currentConfig = {
    text: QUOTE_LIBRARY[0].quote,
    author: QUOTE_LIBRARY[0].author,
    background: GRADIENTS[0],
    customBgImage: null,
    bgBlur: 0,
    bgDim: 0.3,
    align: 'center',
    aspectRatio: 'ratio-portrait',
    fontSize: '1.55rem'
  };

  const renderPreview = () => {
    const card = document.getElementById('quote-art-card');
    if (!card) return;

    // Aspect ratio classes
    card.classList.remove('ratio-portrait', 'ratio-story', 'ratio-square', 'ratio-landscape');
    card.classList.add(currentConfig.aspectRatio);

    // Background
    if (currentConfig.customBgImage) {
      card.style.background = `linear-gradient(rgba(0,0,0,${currentConfig.bgDim}), rgba(0,0,0,${currentConfig.bgDim})), url(${currentConfig.customBgImage}) center/cover no-repeat`;
    } else {
      card.style.background = currentConfig.background;
    }

    // Body text & alignment
    const bodyEl = card.querySelector('.quote-body-text');
    if (bodyEl) {
      bodyEl.textContent = currentConfig.text || 'আপনার প্রিয় উক্তিটি এখানে লিখুন...';
      bodyEl.style.textAlign = currentConfig.align;
      bodyEl.style.fontSize = currentConfig.fontSize;
    }

    // Author
    const authorEl = card.querySelector('.quote-author-text');
    if (authorEl) {
      authorEl.textContent = currentConfig.author || 'অজ্ঞাত';
      authorEl.style.justifyContent = currentConfig.align === 'center' ? 'center' : (currentConfig.align === 'right' ? 'flex-end' : 'flex-start');
    }
  };

  const renderLibraryList = (filter = 'all', searchQuery = '') => {
    const listEl = document.getElementById('qc-library-list');
    if (!listEl) return;

    let filtered = QUOTE_LIBRARY;
    if (filter !== 'all') {
      filtered = filtered.filter(q => q.category === filter);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(item => item.quote.toLowerCase().includes(q) || item.author.toLowerCase().includes(q));
    }

    listEl.innerHTML = filtered.map((item, idx) => `
      <div class="quote-library-item" data-idx="${idx}">
        <div style="font-weight:600; margin-bottom:0.25rem;">"${Utils.escapeHTML(item.quote)}"</div>
        <div style="font-size:0.8rem; color:var(--text-muted); text-align:right;">— ${Utils.escapeHTML(item.author)}</div>
      </div>
    `).join('');

    // Click handler
    $('.quote-library-item').on('click', function () {
      const item = filtered[$(this).data('idx')];
      if (item) {
        currentConfig.text = item.quote;
        currentConfig.author = item.author;
        $('#qc-text-input').val(item.quote);
        $('#qc-author-input').val(item.author);
        renderPreview();
      }
    });
  };

  return {
    init: function () {
      const $form = $('#quote-card-form');
      if (!$form.length) return;

      // Inputs
      $('#qc-text-input').on('input', function () {
        currentConfig.text = $(this).val();
        renderPreview();
      });

      $('#qc-author-input').on('input', function () {
        currentConfig.author = $(this).val();
        renderPreview();
      });

      // Align pills
      $('.qc-align-btn').on('click', function () {
        $('.qc-align-btn').removeClass('active');
        $(this).addClass('active');
        currentConfig.align = $(this).data('align');
        renderPreview();
      });

      // Ratio pills
      $('.qc-ratio-btn').on('click', function () {
        $('.qc-ratio-btn').removeClass('active');
        $(this).addClass('active');
        currentConfig.aspectRatio = $(this).data('ratio');
        renderPreview();
      });

      // Gradient swatches
      $('.qc-gradient-swatch').on('click', function () {
        $('.qc-gradient-swatch').removeClass('active');
        $(this).addClass('active');
        currentConfig.background = $(this).data('bg');
        currentConfig.customBgImage = null;
        renderPreview();
      });

      // Custom background image upload
      $('#qc-image-upload').on('change', function (e) {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = function (evt) {
            currentConfig.customBgImage = evt.target.result;
            renderPreview();
            Utils.showToast('ছবি সফলভাবে আপলোড হয়েছে!', 'success');
          };
          reader.readAsDataURL(file);
        }
      });

      // Dim slider
      $('#qc-dim-slider').on('input', function () {
        currentConfig.bgDim = parseFloat($(this).val());
        renderPreview();
      });

      // Random Quote Button
      $('#qc-random-btn').on('click', function () {
        const randomItem = QUOTE_LIBRARY[Math.floor(Math.random() * QUOTE_LIBRARY.length)];
        const randGrad = GRADIENTS[Math.floor(Math.random() * GRADIENTS.length)];
        currentConfig.text = randomItem.quote;
        currentConfig.author = randomItem.author;
        currentConfig.background = randGrad;
        currentConfig.customBgImage = null;

        $('#qc-text-input').val(randomItem.quote);
        $('#qc-author-input').val(randomItem.author);
        renderPreview();
        AnimationEngine.triggerConfetti({ particleCount: 30 });
      });

      // Filter tabs
      $('.qc-filter-pill').on('click', function () {
        $('.qc-filter-pill').removeClass('active');
        $(this).addClass('active');
        renderLibraryList($(this).data('cat'), $('#qc-search-input').val());
      });

      // Search
      $('#qc-search-input').on('input', function () {
        const activeCat = $('.qc-filter-pill.active').data('cat') || 'all';
        renderLibraryList(activeCat, $(this).val());
      });

      // Download Button
      $('#qc-download-btn').on('click', async function () {
        const card = document.getElementById('quote-art-card');
        await ImageExporter.exportElementToPNG(card, {
          filename: `wonderlab-quote-${Date.now()}.png`
        });
      });

      // Share Button
      $('#qc-share-btn').on('click', function () {
        const card = document.getElementById('quote-art-card');
        ImageExporter.openResultModal({
          title: 'আমার উক্তি কার্ড',
          element: card,
          filename: `wonderlab-quote-${Date.now()}.png`,
          shareText: `"${currentConfig.text}" — ${currentConfig.author}`
        });
      });

      renderLibraryList();
      renderPreview();
    },

    update: renderPreview
  };
})();

window.QuoteCardExperience = QuoteCardExperience;
