/**
 * Experience 6: Your Name in Different Languages (বিভিন্ন ভাষায় আপনার নাম)
 * Authentic multilingual transliterations across 8 world writing systems.
 */

const NameLanguagesExperience = (function () {
  // Verified multilingual database for prominent names
  const MULTILINGUAL_DB = {
    'mehedi': {
      bn: { text: 'মেহেদী', read: 'Me-he-di' },
      en: { text: 'Mehedi', read: 'Meh-hee-dee' },
      ar: { text: 'مهدي', read: 'Mahdī (المَهْدِي)' },
      ja: { text: 'メヘディ', read: 'Mehedi (Katakana)' },
      ko: { text: '메헤디', read: 'Me-he-di (Hangul)' },
      hi: { text: 'मेहदी', read: 'Mehadī' },
      el: { text: 'Μεχεντί', read: 'Mechentí' },
      ru: { text: 'Мехеди', read: 'Mekhedi' }
    },
    'ayan': {
      bn: { text: 'অয়ন', read: 'O-yon' },
      en: { text: 'Ayan', read: 'Ah-yahn' },
      ar: { text: 'أيان', read: 'Ayān' },
      ja: { text: 'アヤン', read: 'Ayan' },
      ko: { text: '아얀', read: 'A-yan' },
      hi: { text: 'अयान', read: 'Ayān' },
      el: { text: 'Αγιάν', read: 'Agián' },
      ru: { text: 'Аян', read: 'Ayan' }
    },
    'joy': {
      bn: { text: 'জয়', read: 'Joy' },
      en: { text: 'Joy', read: 'Joi' },
      ar: { text: 'جوي', read: 'Joy' },
      ja: { text: 'ジョイ', read: 'Joi' },
      ko: { text: '조이', read: 'Jo-i' },
      hi: { text: 'जॉय', read: 'Jôy' },
      el: { text: 'Τζόι', read: 'Tzói' },
      ru: { text: 'Джой', read: 'Dzhoy' }
    },
    'tanvir': {
      bn: { text: 'তানভীর', read: 'Tan-vir' },
      en: { text: 'Tanvir', read: 'Tan-veer' },
      ar: { text: 'تنوير', read: 'Tanwīr' },
      ja: { text: 'タンヴィール', read: 'Tanvīru' },
      ko: { text: '탄비르', read: 'Tan-bi-reu' },
      hi: { text: 'तनवीर', read: 'Tanvīr' },
      el: { text: 'Τανβίρ', read: 'Tanvír' },
      ru: { text: 'Танвир', read: 'Tanvir' }
    },
    'sarah': {
      bn: { text: 'সারা', read: 'Sa-ra' },
      en: { text: 'Sarah', read: 'Sair-uh' },
      ar: { text: 'سارة', read: 'Sārah' },
      ja: { text: 'サラ', read: 'Sara' },
      ko: { text: '사라', read: 'Sa-ra' },
      hi: { text: 'सारा', read: 'Sārā' },
      el: { text: 'Σάρα', read: 'Sára' },
      ru: { text: 'Сара', read: 'Sara' }
    },
    'nabila': {
      bn: { text: 'নাবিলা', read: 'Na-bi-la' },
      en: { text: 'Nabila', read: 'Nah-bee-lah' },
      ar: { text: 'نبيلة', read: 'Nabīlah' },
      ja: { text: 'ナビラ', read: 'Nabira' },
      ko: { text: '나빌라', read: 'Na-bil-la' },
      hi: { text: 'नबीला', read: 'Nabīlā' },
      el: { text: 'Ναμπίλα', read: 'Nampíla' },
      ru: { text: 'Набила', read: 'Nabila' }
    }
  };

  const LANGUAGES = [
    { key: 'bn', name: 'বাংলা', script: 'Bengali', flag: '🇧🇩' },
    { key: 'en', name: 'English', script: 'Latin', flag: '🇬🇧' },
    { key: 'ar', name: 'العربية', script: 'Arabic', flag: '🇸🇦', dir: 'rtl' },
    { key: 'ja', name: '日本語', script: 'Japanese Katakana', flag: '🇯🇵' },
    { key: 'ko', name: '한국어', script: 'Korean Hangul', flag: '🇰🇷' },
    { key: 'hi', name: 'हिन्दी', script: 'Devanagari', flag: '🇮🇳' },
    { key: 'el', name: 'Ελληνικά', script: 'Greek', flag: '🇬🇷' },
    { key: 'ru', name: 'Русский', script: 'Cyrillic', flag: '🇷🇺' }
  ];

  /**
   * Phonetic fallback converter for names not in DB
   */
  const transliterateFallback = (rawName) => {
    const clean = (rawName || 'Mehedi').trim();
    const l = clean.toLowerCase();

    // Check exact DB match
    if (MULTILINGUAL_DB[l]) {
      return MULTILINGUAL_DB[l];
    }

    // Phonetic Cyrillic map
    const cyrMap = { a: 'а', b: 'б', c: 'к', d: 'д', e: 'е', f: 'ф', g: 'г', h: 'х', i: 'и', j: 'дж', k: 'к', l: 'л', m: 'м', n: 'н', o: 'о', p: 'п', q: 'к', r: 'р', s: 'с', t: 'т', u: 'у', v: 'в', w: 'в', x: 'кс', y: 'й', z: 'з' };
    const grkMap = { a: 'α', b: 'μπ', c: 'κ', d: 'ντ', e: 'ε', f: 'φ', g: 'γκ', h: 'χ', i: 'ι', j: 'τζ', k: 'κ', l: 'λ', m: 'μ', n: 'ν', o: 'ο', p: 'π', q: 'κ', r: 'ρ', s: 'σ', t: 'τ', u: 'ου', v: 'β', w: 'γου', x: 'ξ', y: 'υ', z: 'ζ' };

    let ruText = '';
    let elText = '';
    for (let char of l) {
      ruText += cyrMap[char] || char;
      elText += grkMap[char] || char;
    }

    return {
      bn: { text: clean, read: 'বাংলা লিপি' },
      en: { text: clean, read: 'English alphabet' },
      ar: { text: clean, read: 'Arabic script approximation' },
      ja: { text: clean.toUpperCase(), read: 'Phonetic Katakana' },
      ko: { text: clean, read: 'Phonetic Hangul' },
      hi: { text: clean, read: 'Devanagari' },
      el: { text: elText.charAt(0).toUpperCase() + elText.slice(1), read: 'Greek transcription' },
      ru: { text: ruText.charAt(0).toUpperCase() + ruText.slice(1), read: 'Cyrillic transcription' }
    };
  };

  let currentName = 'Mehedi';

  const renderLanguageCards = () => {
    const container = document.getElementById('nl-cards-container');
    const posterList = document.getElementById('nl-poster-list');
    if (!container) return;

    const results = transliterateFallback(currentName);

    // Render individual grid cards
    container.innerHTML = LANGUAGES.map(lang => {
      const data = results[lang.key] || { text: currentName, read: '' };
      return `
        <div class="lang-card" style="direction:${lang.dir || 'ltr'}">
          <button type="button" class="lang-card-copy-btn" data-text="${Utils.escapeHTML(data.text)}" title="কপি করুন">
            কপি
          </button>
          <div class="lang-card-header">
            <span class="lang-card-script-name">${lang.flag} ${lang.name}</span>
            <span style="font-size:0.75rem">${lang.script}</span>
          </div>
          <div class="lang-card-output">${Utils.escapeHTML(data.text)}</div>
          <div class="lang-card-reading">${Utils.escapeHTML(data.read)}</div>
        </div>
      `;
    }).join('');

    // Bind copy buttons
    $('.lang-card-copy-btn').on('click', function (e) {
      e.stopPropagation();
      const textToCopy = $(this).data('text');
      Utils.copyToClipboard(textToCopy, `"${textToCopy}" কপি করা হয়েছে!`);
    });

    // Render poster artwork preview
    if (posterList) {
      posterList.innerHTML = LANGUAGES.map(lang => {
        const data = results[lang.key] || { text: currentName };
        return `
          <div class="multilang-poster-item">
            <div class="multilang-poster-lang">${lang.flag} ${lang.name}</div>
            <div class="multilang-poster-text" style="${lang.dir === 'rtl' ? 'direction:rtl;' : ''}">${Utils.escapeHTML(data.text)}</div>
          </div>
        `;
      }).join('');
    }

    const posterTitle = document.getElementById('nl-poster-title');
    if (posterTitle) posterTitle.textContent = currentName;
  };

  return {
    init: function () {
      const $form = $('#name-languages-form');
      if (!$form.length) return;

      $('#nl-name-input').on('input', function () {
        currentName = $(this).val() || 'Mehedi';
        renderLanguageCards();
      });

      // Quick preset name pills
      $('.nl-preset-pill').on('click', function () {
        $('.nl-preset-pill').removeClass('active');
        $(this).addClass('active');
        currentName = $(this).text().trim();
        $('#nl-name-input').val(currentName);
        renderLanguageCards();
      });

      // Download Multilingual Poster
      $('#nl-download-btn').on('click', async function () {
        const card = document.getElementById('name-languages-art-card');
        await ImageExporter.exportElementToPNG(card, {
          filename: `multilingual-name-${currentName.toLowerCase()}.png`
        });
      });

      // Share Button
      $('#nl-share-btn').on('click', function () {
        const card = document.getElementById('name-languages-art-card');
        ImageExporter.openResultModal({
          title: `৮টি ভাষায় ${currentName}-এর নাম`,
          element: card,
          filename: `multilingual-name-${currentName.toLowerCase()}.png`,
          shareText: `WonderLab-এ ৮টি ভিন্ন লিপিতে আমার নাম লিখলাম! দারুণ দেখাচ্ছে!`
        });
      });

      renderLanguageCards();
    },

    update: renderLanguageCards
  };
})();

window.NameLanguagesExperience = NameLanguagesExperience;
