/**
 * Experience 2: My Digital Fingerprint (ডিজিটাল ফিঙ্গারপ্রিন্ট)
 * Generates deterministic generative biometric-style digital artwork with animated laser scanning.
 */

const FingerprintExperience = (function () {
  const THEMES = {
    creative: {
      name: 'Creative (সৃজনশীল)',
      archetype: 'The Luminary Creator',
      desc: 'আপনার চিন্তার গভীরতা সীমাহীন। রঙ, রূপ আর কল্পনার মেলবন্ধনে আপনি নতুন দিগন্ত সৃষ্টি করতে ভালোবাসেন।',
      glow: '#8b5cf6',
      accent: '#ec4899',
      traits: { 'কল্পনাশক্তি': '৯৬%', 'মৌলিকতা': '৯১%', 'আবেগ': '৮৮%', 'বিশ্লেষণ': '৭৫%' }
    },
    calm: {
      name: 'Calm (শান্ত ও ধীরস্থির)',
      archetype: 'The Serene Anchor',
      desc: 'ঝড়ঝাপটার মাঝেও আপনি স্থির ও অবিচল। আপনার উপস্থিতি চারপাশের মানুষকে শান্ত ও নির্ভর করে তোলে।',
      glow: '#06b6d4',
      accent: '#10b981',
      traits: { 'ধৈর্য': '৯৮%', 'স্থিরতা': '৯৪%', 'সহানুভূতি': '৯২%', 'নমনীয়তা': '৮৫%' }
    },
    curious: {
      name: 'Curious (অনুসন্ধিৎসু)',
      archetype: 'The Knowledge Seeker',
      desc: 'প্রতিটি নতুন জিনিসে আপনি রহস্য খুঁজে পান। জানার অদম্য কৌতূহল আপনাকে প্রতিনিয়ত নতুন পথে চালিত করে।',
      glow: '#f59e0b',
      accent: '#f43f5e',
      traits: { 'কৌতূহল': '৯৯%', 'পর্যবেক্ষণ': '৯২%', 'চিন্তাশক্তি': '৮৯%', 'উদ্যম': '৮৬%' }
    },
    bold: {
      name: 'Bold (সাহসী ও অপ্রতিরোধ্য)',
      archetype: 'The Brave Trailblazer',
      desc: 'চ্যালেঞ্জ গ্রহণ করা আপনার স্বভাব। সিদ্ধান্ত নিতে আপনি পিছপা হন না, নেতৃত্ব দেওয়াই আপনার স্বভাবজাত গুণ।',
      glow: '#ef4444',
      accent: '#f97316',
      traits: { 'সাহসিকতা': '৯৭%', 'দৃঢ়তা': '৯৫%', 'নেতৃত্ব': '৯৩%', 'কর্মক্ষমতা': '৯০%' }
    },
    explorer: {
      name: 'Explorer (অভিযাত্রী)',
      archetype: 'The Cosmic Nomad',
      desc: 'সীমানা পেরিয়ে নতুনের সন্ধানে আপনি সবসময় প্রস্তুত। অজানা পথ আপনাকে ডাকে, স্বাধীনতা আপনার প্রাণ।',
      glow: '#059669',
      accent: '#06b6d4',
      traits: { 'অভিযানপ্রিয়তা': '৯৬%', 'অভিযোজন': '৯২%', 'মুক্তমনা': '৯৪%', 'দূরদৃষ্টি': '৮৭%' }
    }
  };

  let currentConfig = {
    userName: 'Mehedi',
    themeKey: 'creative',
    pattern: 'whorl',
    primaryColor: '#06b6d4',
    secondaryColor: '#8b5cf6',
    density: 28,
    seed: 'mehedi_creative'
  };

  /**
   * Generates deterministic SVG fingerprint ridges
   */
  const generateFingerprintSVG = (seedStr, numRidges, strokeColor1, strokeColor2) => {
    const rng = Utils.createRNG(seedStr);
    const width = 240;
    const height = 240;
    const cx = width / 2;
    const cy = height / 2;

    let svg = `<svg viewBox="0 0 ${width} ${height}" class="fp-svg-element" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="fp-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${strokeColor1}" />
          <stop offset="100%" stop-color="${strokeColor2}" />
        </linearGradient>
      </defs>`;

    // Generate concentric undulating ridges
    for (let r = 8; r < numRidges * 4; r += 4) {
      const radiusX = r * 0.9;
      const radiusY = r * 1.25;
      const points = [];
      const steps = 36;
      const startAngle = (rng() * 0.6) - 0.3; // subtle tilt

      for (let i = 0; i <= steps; i++) {
        const theta = (i / steps) * Math.PI * 2;
        // Wavy modulation using sine waves and seeded jitter
        const noise = Math.sin(theta * 3 + r * 0.4) * (2.5 + rng() * 1.5);
        const currentRx = radiusX + noise;
        const currentRy = radiusY + noise;

        const x = cx + currentRx * Math.cos(theta + startAngle);
        const y = cy + currentRy * Math.sin(theta + startAngle);
        points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
      }

      // Random breaks in lines to mimic natural fingerprint delta/loop fissures
      const hasBreak = rng() > 0.4;
      const dashArray = hasBreak ? `${40 + rng() * 80} ${12 + rng() * 20}` : 'none';
      const strokeWidth = (1.5 + rng() * 0.8).toFixed(1);

      svg += `<path d="M ${points.join(' L ')} Z" fill="none" stroke="url(#fp-gradient)" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-dasharray="${dashArray}" opacity="${0.65 + rng() * 0.35}" />`;
    }

    svg += `</svg>`;
    return svg;
  };

  /**
   * Render the digital fingerprint card
   */
  const renderPreview = () => {
    const card = document.getElementById('fingerprint-art-card');
    if (!card) return;

    const theme = THEMES[currentConfig.themeKey] || THEMES.creative;

    // Apply glow color
    card.style.setProperty('--fp-glow', theme.glow);

    // Render generative SVG
    const svgWrap = card.querySelector('.fp-canvas-inner');
    if (svgWrap) {
      svgWrap.innerHTML = generateFingerprintSVG(
        currentConfig.seed,
        currentConfig.density,
        theme.glow,
        theme.accent
      );
    }

    // Name & Archetype
    const nameEl = card.querySelector('.fp-user-name');
    if (nameEl) nameEl.textContent = currentConfig.userName || 'ডিজিটাল পথিক';

    const archEl = card.querySelector('.fp-archetype-tag');
    if (archEl) archEl.textContent = theme.archetype;

    // Summary description
    const descEl = card.querySelector('.fp-desc-text');
    if (descEl) descEl.textContent = theme.desc;

    // Traits breakdown
    const traitsEl = card.querySelector('.fp-traits-grid');
    if (traitsEl) {
      traitsEl.innerHTML = Object.entries(theme.traits).map(([lbl, val]) => `
        <div class="fp-trait-item">
          <span class="fp-trait-label">${lbl}</span>
          <span class="fp-trait-val" style="color:${theme.glow}">${val}</span>
        </div>
      `).join('');
    }
  };

  return {
    init: function () {
      const $form = $('#fingerprint-form');
      if (!$form.length) return;

      $('#fp-name-input').on('input', function () {
        currentConfig.userName = $(this).val() || '';
        currentConfig.seed = `${currentConfig.userName}_${currentConfig.themeKey}`;
        renderPreview();
      });

      // Personality themes click
      $('.fp-theme-btn').on('click', function () {
        $('.fp-theme-btn').removeClass('active');
        $(this).addClass('active');
        currentConfig.themeKey = $(this).data('theme');
        currentConfig.seed = `${currentConfig.userName}_${currentConfig.themeKey}_${Date.now()}`;
        renderPreview();
      });

      // Regenerate button
      $('#fp-regenerate-btn').on('click', function () {
        currentConfig.seed = `${currentConfig.userName}_${currentConfig.themeKey}_${Math.random()}`;
        renderPreview();
        AnimationEngine.triggerConfetti({ particleCount: 25 });
        Utils.showToast('নতুন প্যাটার্ন তৈরি হয়েছে!', 'info');
      });

      // Download Button
      $('#fp-download-btn').on('click', async function () {
        const card = document.getElementById('fingerprint-art-card');
        const filename = `wonderlab-fingerprint-${(currentConfig.userName || 'art').toLowerCase()}.png`;
        await ImageExporter.exportElementToPNG(card, {
          filename: filename
        });
      });

      // Share Button
      $('#fp-share-btn').on('click', function () {
        const card = document.getElementById('fingerprint-art-card');
        ImageExporter.openResultModal({
          title: `${currentConfig.userName}-এর ডিজিটাল ফিঙ্গারপ্রিন্ট`,
          element: card,
          filename: `wonderlab-fingerprint-${(currentConfig.userName || 'art').toLowerCase()}.png`,
          shareText: `WonderLab-এ আমার ডিজিটাল ফিঙ্গারপ্রিন্ট তৈরি করলাম! আমার আর্কিটাইপ: ${THEMES[currentConfig.themeKey].archetype}`
        });
      });

      renderPreview();
    },

    update: renderPreview
  };
})();

window.FingerprintExperience = FingerprintExperience;
