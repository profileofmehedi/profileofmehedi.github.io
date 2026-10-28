/**
 * Experience 1: My Name Story (আমার নামের গল্প)
 * Generates personalized aesthetic name artwork with verified meanings, particles, and styles.
 */

const NameStoryExperience = (function () {
  // Built-in verified local dictionary of authentic Bengali/Arabic/Sanskrit names & meanings
  const NAME_MEANINGS_DB = {
    'mehedi': { bn: 'মেহেদী', meaning: 'সৌন্দর্য ও আনন্দের প্রতীক (হেনা)', origin: 'Arabic' },
    'mehdi': { bn: 'মেহদী', meaning: 'সৎপথে পরিচালিত, পথপ্রদর্শক', origin: 'Arabic' },
    'ayan': { bn: 'অয়ন', meaning: 'গতিপথ, সূর্যের উত্তরায়ণ, ঈশ্বরের উপহার', origin: 'Bengali/Sanskrit' },
    'tanvir': { bn: 'তানভীর', meaning: 'আলোকিত, দীপ্তিমান', origin: 'Arabic' },
    'nabila': { bn: 'নাবিলা', meaning: 'অভিজাত, মহীয়সী ও বুদ্ধিমতী', origin: 'Arabic' },
    'joy': { bn: 'জয়', meaning: 'বিজয়, সাফল্য ও আনন্দ', origin: 'Bengali' },
    'tahmid': { bn: 'তাহমিদ', meaning: 'আল্লাহর প্রশংসাকারী', origin: 'Arabic' },
    'ananya': { bn: 'অনন্যা', meaning: 'অনুপম, যার কোনো তুলনা নেই', origin: 'Bengali' },
    'sarah': { bn: 'সারা', meaning: 'রাজকুমারী, আনন্দদায়িনী', origin: 'Hebrew/Arabic' },
    'kabir': { bn: 'কবীর', meaning: 'মহান, গৌরবময় ও প্রজ্ঞাবান', origin: 'Arabic' },
    'rahim': { bn: 'রহিম', meaning: 'পরম দয়ালু ও স্নেহশীল', origin: 'Arabic' },
    'sakib': { bn: 'সাকিব', meaning: 'উজ্জ্বল নক্ষত্র, তীক্ষ্ণ দৃষ্টিসম্পন্ন', origin: 'Arabic' },
    'farhan': { bn: 'ফারহান', meaning: 'প্রফুল্ল, সদাহাস্যোজ্জ্বল', origin: 'Arabic' },
    'shafiq': { bn: 'শফিক', meaning: 'মমতাময়, সহানুভূতিশীল', origin: 'Arabic' },
    'sadia': { bn: 'সাদিয়া', meaning: 'সৌভাগ্যবতী, সুখী ও আশীর্বাদধন্য', origin: 'Arabic' },
    'sami': { bn: 'সামি', meaning: 'উচ্চমর্যাদাপূর্ণ, শ্রবণকারী', origin: 'Arabic' },
    'arif': { bn: 'আরিফ', meaning: 'জ্ঞানী, প্রাজ্ঞ ও তত্ত্বদর্শী', origin: 'Arabic' },
    'hasan': { bn: 'হাসান', meaning: 'সুদর্শন, সদাচারী ও উত্তম', origin: 'Arabic' },
    'zayan': { bn: 'জায়ান', meaning: 'সৌন্দর্যমণ্ডিত, অলংকৃত', origin: 'Arabic' },
    'fatima': { bn: 'ফাতিমা', meaning: 'নিষ্পাপ, সংযমী ও মহীয়সী', origin: 'Arabic' },
    'nusrat': { bn: 'নুসরাত', meaning: 'বিজয়, ঐশ্বরিক সহায়তা', origin: 'Arabic' },
    'rubayet': { bn: 'রুবায়েত', meaning: 'কবিতার ছন্দ, চতুষ্পদী কবিতা', origin: 'Persian' },
    'muntaha': { bn: 'মুনতাহা', meaning: 'চূড়ান্ত গন্তব্য, পরম প্রাপ্তি', origin: 'Arabic' },
    'priya': { bn: 'প্রিয়া', meaning: 'স্নেহময়ী, ভালোবাসার পাত্রী', origin: 'Bengali' },
    'rohit': { bn: 'রোহিত', meaning: 'প্রথম রক্তিম কিরণ, সূর্য', origin: 'Sanskrit' },
    'neel': { bn: 'নীল', meaning: 'অনন্ত আকাশ, উদারতা', origin: 'Bengali' },
    'arman': { bn: 'আরমান', meaning: 'আকাঙ্ক্ষা, অন্তরের ইচ্ছা', origin: 'Persian' },
    'fariha': { bn: 'ফারিহা', meaning: 'আনন্দময়ী, প্রফুল্ল চিত্তের অধিকারী', origin: 'Arabic' },
    'sumaiya': { bn: 'সুমাইয়া', meaning: 'উচ্চ মর্যাদা, অনন্য ব্যক্তিত্ব', origin: 'Arabic' },
    'alif': { bn: 'আলিফ', meaning: 'ঐক্য, বন্ধুভাবাপন্ন, প্রারম্ভ', origin: 'Arabic' }
  };

  const GRADIENTS = [
    { id: 'cosmic', name: 'Cosmic Nebula', bg: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #701a75 100%)' },
    { id: 'aurora', name: 'Aurora Sky', bg: 'linear-gradient(135deg, #022c22 0%, #065f46 45%, #0e7490 100%)' },
    { id: 'sunset', name: 'Sunset Magic', bg: 'linear-gradient(135deg, #4c0519 0%, #831843 45%, #ea580c 100%)' },
    { id: 'royal', name: 'Royal Velvet', bg: 'linear-gradient(135deg, #18181b 0%, #3b0764 50%, #4c1d95 100%)' },
    { id: 'cyber', name: 'Cyber Indigo', bg: 'linear-gradient(135deg, #09090b 0%, #1e1b4b 55%, #0284c7 100%)' },
    { id: 'emerald', name: 'Emerald Glow', bg: 'linear-gradient(135deg, #022c22 0%, #064e3b 50%, #059669 100%)' },
    { id: 'gold', name: 'Golden Sun', bg: 'linear-gradient(135deg, #451a03 0%, #78350f 50%, #d97706 100%)' }
  ];

  const TAGLINES = [
    'স্বপ্নের পথে অবিচল পদযাত্রা',
    'Chasing dreams and creating wonder',
    'নক্ষত্রের মতো আলো ছড়ানোর প্রত্যয়',
    'Living with purpose, passion and grace',
    'নিজের গল্প নিজেই লিখব সুন্দর করে',
    'Curious mind, humble heart, limitless soul'
  ];

  let currentSettings = {
    nameBn: 'মেহেদী',
    nameEn: 'Mehedi',
    style: 'cosmic',
    layout: 'monogram',
    gradient: GRADIENTS[0].bg,
    tagline: TAGLINES[0],
    showParticles: true
  };

  /**
   * Find meaning from local dictionary safely
   */
  const lookupMeaning = (name) => {
    if (!name) return null;
    const clean = name.trim().toLowerCase();
    return NAME_MEANINGS_DB[clean] || null;
  };

  /**
   * Update the live preview card DOM
   */
  const renderPreview = () => {
    const card = document.getElementById('name-story-art-card');
    if (!card) return;

    // Apply background gradient
    card.style.background = currentSettings.gradient;

    // Monogram
    const initial = (currentSettings.nameBn || currentSettings.nameEn || 'M').charAt(0);
    const monoEl = card.querySelector('.name-monogram-circle');
    if (monoEl) monoEl.textContent = initial;

    // Names
    const titleEl = card.querySelector('.name-display-title');
    if (titleEl) titleEl.textContent = currentSettings.nameBn || currentSettings.nameEn;

    const translitEl = card.querySelector('.name-translit-text');
    if (translitEl) translitEl.textContent = currentSettings.nameEn ? currentSettings.nameEn.toUpperCase() : '';

    // Meaning lookup
    const found = lookupMeaning(currentSettings.nameEn) || lookupMeaning(currentSettings.nameBn);
    const meaningEl = card.querySelector('.name-meaning-badge');
    if (meaningEl) {
      if (found) {
        meaningEl.innerHTML = `<span style="color:#facc15">✦</span> <strong>অর্থ:</strong> ${Utils.escapeHTML(found.meaning)}`;
        meaningEl.style.display = 'inline-flex';
      } else {
        meaningEl.innerHTML = `<span style="opacity:0.7">✦ অর্থ অভিধানে নেই — আপনার ব্যক্তিত্বই আপনার পরিচয়</span>`;
        meaningEl.style.display = 'inline-flex';
      }
    }

    // Tagline
    const quoteEl = card.querySelector('.name-tagline-quote');
    if (quoteEl) quoteEl.textContent = `“${currentSettings.tagline}”`;

    // Particles
    const particles = card.querySelector('.bg-particles');
    if (particles) {
      particles.style.display = currentSettings.showParticles ? 'block' : 'none';
    }
  };

  return {
    init: function () {
      const $form = $('#name-story-form');
      if (!$form.length) return;

      // Inputs
      $('#ns-name-bn').on('input', function () {
        currentSettings.nameBn = $(this).val() || '';
        renderPreview();
      });

      $('#ns-name-en').on('input', function () {
        currentSettings.nameEn = $(this).val() || '';
        renderPreview();
      });

      $('#ns-tagline').on('input', function () {
        currentSettings.tagline = $(this).val() || '';
        renderPreview();
      });

      // Gradient swatches click
      $('.ns-gradient-swatch').on('click', function () {
        $('.ns-gradient-swatch').removeClass('active');
        $(this).addClass('active');
        currentSettings.gradient = $(this).data('bg');
        renderPreview();
      });

      // Particles toggle
      $('#ns-particles-toggle').on('change', function () {
        currentSettings.showParticles = $(this).is(':checked');
        renderPreview();
      });

      // Randomize button
      $('#ns-random-btn').on('click', function () {
        const randGrad = GRADIENTS[Math.floor(Math.random() * GRADIENTS.length)];
        const randTag = TAGLINES[Math.floor(Math.random() * TAGLINES.length)];
        currentSettings.gradient = randGrad.bg;
        currentSettings.tagline = randTag;
        $('#ns-tagline').val(randTag);
        $('.ns-gradient-swatch').removeClass('active');
        $(`.ns-gradient-swatch[data-id="${randGrad.id}"]`).addClass('active');
        renderPreview();
        AnimationEngine.triggerConfetti({ particleCount: 30 });
      });

      // Download Artwork Button
      $('#ns-download-btn').on('click', async function () {
        const card = document.getElementById('name-story-art-card');
        const filename = `wonderlab-name-${(currentSettings.nameEn || 'story').toLowerCase()}.png`;
        await ImageExporter.exportElementToPNG(card, {
          filename: filename
        });
      });

      // Share Button
      $('#ns-share-btn').on('click', function () {
        const card = document.getElementById('name-story-art-card');
        ImageExporter.openResultModal({
          title: `${currentSettings.nameBn || currentSettings.nameEn}-এর নামের গল্প`,
          element: card,
          filename: `wonderlab-name-${(currentSettings.nameEn || 'story').toLowerCase()}.png`,
          shareText: `WonderLab-এ আমার নামের গল্প দিয়ে চমৎকার এই পোস্টার তৈরি করলাম!`
        });
      });

      // Initial render
      renderPreview();
    },

    update: renderPreview
  };
})();

window.NameStoryExperience = NameStoryExperience;
