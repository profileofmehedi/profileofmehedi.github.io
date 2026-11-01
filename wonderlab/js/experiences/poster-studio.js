/**
 * Experience 7: Bangla Poster Studio (পোস্টার স্টুডিও)
 * Lightweight intuitive social media banner & poster creator with ready-made templates.
 */

const PosterStudioExperience = (function () {
  const TEMPLATES = {
    motivational: {
      badge: 'অনুপ্রেরণা ও লক্ষ্য',
      heading: 'কঠিন পথই সুন্দর গন্তব্যে নিয়ে যায়',
      body: 'প্রতিটি সূর্যাস্ত নতুন এক প্রত্যুষের পূর্বাভাস। নিজের লক্ষ্যের দিকে অবিচল থাকুন, জয় আপনার হবেই।',
      footer: 'WonderLab Studio ✦ @BanglaQuotes',
      bg: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #701a75 100%)'
    },
    birthday: {
      badge: 'শুভ জন্মদিন 🎂',
      heading: 'জীবনের প্রতিটি ক্ষণ ভরে উঠুক আনন্দে!',
      body: 'তোমার আগামী দিনগুলো কাটুক সীমাহীন ভালোবাসায়, হাসিতে আর অর্জনে। অনেক অনেক শুভকামনা!',
      footer: 'Warmest Wishes From Friends & Family',
      bg: 'linear-gradient(135deg, #4c0519 0%, #831843 45%, #ea580c 100%)'
    },
    festival: {
      badge: 'উৎসবের শুভেচ্ছা 🌙',
      heading: 'ঈদ মোবারক!',
      body: 'পবিত্র ঈদের অপার আনন্দ ও শান্তি আপনার এবং আপনার পরিবারের মাঝে ছড়িয়ে পড়ুক। সকলের জীবন আলোকময় হোক।',
      footer: 'WonderLab Greetings ✦ উৎসব ও আনন্দ',
      bg: 'linear-gradient(135deg, #022c22 0%, #065f46 45%, #0e7490 100%)'
    },
    study: {
      badge: 'লক্ষ্য ও প্রস্তুতি 📚',
      heading: 'আজকের পরিশ্রম, আগামীর গর্ব',
      body: 'অন্যরা যখন বিশ্রাম নিচ্ছে, তুমি তখন নিজেকে গড়ে তোল। সফলতা একদিন নিজে এসে ধরা দেবে।',
      footer: 'Study & Grow ✦ Never Stop Learning',
      bg: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
    },
    announcement: {
      badge: 'বিশেষ ঘোষণা 📢',
      heading: 'আমাদের নতুন যাত্রার সূচনা',
      body: 'অত্যন্ত আনন্দের সাথে জানাচ্ছি যে আমরা নতুন এক মাইলফলক স্পর্শ করেছি। পাশে থাকার জন্য সকলকে আন্তরিক ধন্যবাদ।',
      footer: 'Official Announcement ✦ Stay Connected',
      bg: 'linear-gradient(135deg, #18181b 0%, #3b0764 50%, #4c1d95 100%)'
    }
  };

  let currentState = { ...TEMPLATES.motivational, align: 'center', fontSize: 2.2 };
  let historyStack = [];
  let historyIndex = -1;

  const pushState = () => {
    // If not at the end of stack, discard future redo branch
    if (historyIndex < historyStack.length - 1) {
      historyStack = historyStack.slice(0, historyIndex + 1);
    }
    historyStack.push(JSON.parse(JSON.stringify(currentState)));
    historyIndex++;
  };

  const renderCanvas = () => {
    const canvas = document.getElementById('poster-studio-canvas');
    if (!canvas) return;

    canvas.style.background = currentState.bg;

    const badgeEl = canvas.querySelector('.studio-badge-element');
    if (badgeEl) badgeEl.textContent = currentState.badge;

    const headingEl = canvas.querySelector('.studio-heading-element');
    if (headingEl) {
      headingEl.textContent = currentState.heading;
      headingEl.style.fontSize = `${currentState.fontSize}rem`;
      headingEl.style.textAlign = currentState.align;
    }

    const bodyEl = canvas.querySelector('.studio-body-element');
    if (bodyEl) {
      bodyEl.textContent = currentState.body;
      bodyEl.style.textAlign = currentState.align;
    }

    const footerEl = canvas.querySelector('.studio-footer-element');
    if (footerEl) footerEl.textContent = currentState.footer;
  };

  return {
    init: function () {
      const $canvas = $('#poster-studio-canvas');
      if (!$canvas.length) return;

      pushState();

      // Text Input bindings
      $('#ps-badge-input').on('input', function () {
        currentState.badge = $(this).val();
        renderCanvas();
      });

      $('#ps-heading-input').on('input', function () {
        currentState.heading = $(this).val();
        renderCanvas();
      });

      $('#ps-body-input').on('input', function () {
        currentState.body = $(this).val();
        renderCanvas();
      });

      $('#ps-footer-input').on('input', function () {
        currentState.footer = $(this).val();
        renderCanvas();
      });

      // Template pills
      $('.ps-template-pill').on('click', function () {
        $('.ps-template-pill').removeClass('active');
        $(this).addClass('active');

        const key = $(this).data('tpl');
        if (TEMPLATES[key]) {
          currentState = { ...currentState, ...TEMPLATES[key] };
          $('#ps-badge-input').val(currentState.badge);
          $('#ps-heading-input').val(currentState.heading);
          $('#ps-body-input').val(currentState.body);
          $('#ps-footer-input').val(currentState.footer);
          pushState();
          renderCanvas();
        }
      });

      // Align buttons
      $('.ps-align-btn').on('click', function () {
        $('.ps-align-btn').removeClass('active');
        $(this).addClass('active');
        currentState.align = $(this).data('align');
        pushState();
        renderCanvas();
      });

      // Gradient swatches
      $('.ps-swatch').on('click', function () {
        $('.ps-swatch').removeClass('active');
        $(this).addClass('active');
        currentState.bg = $(this).data('bg');
        pushState();
        renderCanvas();
      });

      // Font size slider
      $('#ps-size-slider').on('input', function () {
        currentState.fontSize = parseFloat($(this).val());
        renderCanvas();
      });

      // Undo button
      $('#ps-undo-btn').on('click', function () {
        if (historyIndex > 0) {
          historyIndex--;
          currentState = JSON.parse(JSON.stringify(historyStack[historyIndex]));
          $('#ps-badge-input').val(currentState.badge);
          $('#ps-heading-input').val(currentState.heading);
          $('#ps-body-input').val(currentState.body);
          $('#ps-footer-input').val(currentState.footer);
          renderCanvas();
          Utils.showToast('পূর্বের অবস্থায় ফিরিয়ে নেওয়া হয়েছে (Undo)', 'info');
        }
      });

      // Redo button
      $('#ps-redo-btn').on('click', function () {
        if (historyIndex < historyStack.length - 1) {
          historyIndex++;
          currentState = JSON.parse(JSON.stringify(historyStack[historyIndex]));
          $('#ps-badge-input').val(currentState.badge);
          $('#ps-heading-input').val(currentState.heading);
          $('#ps-body-input').val(currentState.body);
          $('#ps-footer-input').val(currentState.footer);
          renderCanvas();
          Utils.showToast('পুনরায় প্রয়োগ করা হয়েছে (Redo)', 'info');
        }
      });

      // Reset canvas button
      $('#ps-reset-btn').on('click', function () {
        currentState = { ...TEMPLATES.motivational, align: 'center', fontSize: 2.2 };
        $('#ps-badge-input').val(currentState.badge);
        $('#ps-heading-input').val(currentState.heading);
        $('#ps-body-input').val(currentState.body);
        $('#ps-footer-input').val(currentState.footer);
        pushState();
        renderCanvas();
        Utils.showToast('ক্যানভাস রিসেট করা হয়েছে', 'info');
      });

      // Download Button
      $('#ps-download-btn').on('click', async function () {
        const canvas = document.getElementById('poster-studio-canvas');
        await ImageExporter.exportElementToPNG(canvas, {
          filename: `bangla-poster-${Date.now()}.png`
        });
      });

      // Share Button
      $('#ps-share-btn').on('click', function () {
        const canvas = document.getElementById('poster-studio-canvas');
        ImageExporter.openResultModal({
          title: 'আমার তৈরি পোস্টার',
          element: canvas,
          filename: `bangla-poster-${Date.now()}.png`,
          shareText: `${currentState.heading} — WonderLab পোস্টার স্টুডিওতে তৈরি!`
        });
      });

      renderCanvas();
    },

    update: renderCanvas
  };
})();

window.PosterStudioExperience = PosterStudioExperience;
