/**
 * DEENQUEST - Language & Localization Controller (Bangla / English)
 * Persists in LocalStorage, applies UI translations, and triggers content updates.
 */

const LangManager = {
  STORAGE_KEY: "deenquest_lang",
  currentLang: "bn", // Bangla is DEFAULT

  translations: {
    bn: {
      siteTitle: "দ্বীনকোয়েস্ট",
      siteTagline: "অনুসন্ধান করুন। জানুন। সত্য আবিষ্কার করুন।",
      navHome: "হোম",
      navExplore: "বিষয়সমূহ",
      navQuestions: "প্রশ্ন ও উত্তর",
      navQuran: "কুরআন অভিধান",
      navHadith: "হাদিস লাইব্রেরি",
      navMyths: "ভুল ধারণা ও সত্য",
      navHistory: "ইতিহাস টাইমলাইন",
      navQuiz: "জ্ঞান কুইজ",
      navReflections: "দৈনিক আত্মচিন্তা",
      navAssistant: "এআই সহকারী",
      navBookmarks: "বুকমার্কস",
      navAbout: "আমাদের সম্পর্কে",
      navSources: "উৎস ও পদ্ধতি",
      searchPlaceholder: "ইসলাম সম্পর্কে যে কোনো প্রশ্ন করুন...",
      searchQuickPrompt: "প্রশ্ন, সূরা, হাদিস অনুসন্ধান করুন (Ctrl+K)...",
      exploreBtn: "জ্ঞান অনুসন্ধান",
      askBtn: "প্রশ্ন করুন",
      featuredQuestions: "বাছাইকৃত গুরুত্বপূর্ণ প্রশ্নসমূহ",
      exploreTopics: "প্রধান ইসলামি বিষয়সমূহ",
      quranOfDay: "আজকের নির্বাচিত কুরআন আয়াত",
      hadithOfDay: "আজকের নির্বাচিত হাদিস",
      viewAll: "সবগুলো দেখুন",
      readMore: "সম্পূর্ণ উত্তর পড়ুন",
      bookmarkBtn: "বুকমার্ক",
      shareBtn: "শেয়ার",
      copyBtn: "কপি",
      copiedToast: "ক্লিপবোর্ডে কপি করা হয়েছে!",
      bookmarkedToast: "বুকমার্কে সংরক্ষণ করা হয়েছে!",
      bookmarkRemovedToast: "বুকমার্ক থেকে মুছে ফেলা হয়েছে।",
      newsletterTitle: "সাপ্তাহিক ইসলামি জ্ঞান ও গবেষণা",
      newsletterSub: "প্রামাণ্য এবং বিশুদ্ধ ইসলামি গবেষণা সরাসরি আপনার ইনবক্সে পেতে সাবস্ক্রাইব করুন।",
      subscribeBtn: "সাবস্ক্রাইব",
      rightsReserved: "সর্বস্বত্ব সংরক্ষিত। প্রামাণ্য ইসলামি গবেষণার জন্য নিবেদিত।"
    },
    en: {
      siteTitle: "DEENQUEST",
      siteTagline: "Explore. Understand. Discover the Truth.",
      navHome: "Home",
      navExplore: "Explore Topics",
      navQuestions: "Questions & Answers",
      navQuran: "Quran Explorer",
      navHadith: "Hadith Library",
      navMyths: "Myth vs Reality",
      navHistory: "History Timeline",
      navQuiz: "Knowledge Quiz",
      navReflections: "Daily Reflection",
      navAssistant: "AI Assistant",
      navBookmarks: "Bookmarks",
      navAbout: "About Us",
      navSources: "Sources & Methodology",
      searchPlaceholder: "Ask anything about Islam...",
      searchQuickPrompt: "Search questions, surahs, hadiths (Ctrl+K)...",
      exploreBtn: "Explore Knowledge",
      askBtn: "Ask a Question",
      featuredQuestions: "Featured Questions",
      exploreTopics: "Explore Core Topics",
      quranOfDay: "Quran Verse of the Day",
      hadithOfDay: "Hadith of the Day",
      viewAll: "View All",
      readMore: "Read Full Answer",
      bookmarkBtn: "Bookmark",
      shareBtn: "Share",
      copyBtn: "Copy",
      copiedToast: "Copied to clipboard!",
      bookmarkedToast: "Saved to your bookmarks!",
      bookmarkRemovedToast: "Removed from bookmarks.",
      newsletterTitle: "Weekly Islamic Knowledge & Research",
      newsletterSub: "Receive authentic, well-researched Islamic articles and reflections directly in your inbox.",
      subscribeBtn: "Subscribe",
      rightsReserved: "All rights reserved. Dedicated to authentic Islamic research."
    }
  },

  init() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    // Bangla by default unless user previously explicitly selected English
    this.currentLang = saved === "en" ? "en" : "bn";
    this.applyLanguage(this.currentLang);

    document.querySelectorAll(".lang-toggle-btn").forEach((btn) => {
      btn.addEventListener("click", () => this.toggleLanguage());
    });
  },

  applyLanguage(lang) {
    this.currentLang = lang;
    localStorage.setItem(this.STORAGE_KEY, lang);
    document.documentElement.setAttribute("lang", lang);

    // Update toggle buttons text
    document.querySelectorAll(".lang-toggle-btn").forEach((btn) => {
      btn.textContent = lang === "en" ? "বাংলা" : "English";
    });

    // Translate DOM elements marked with data-i18n
    const dict = this.translations[lang] || this.translations.en;
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (dict[key]) {
        el.textContent = dict[key];
      }
    });

    // Translate placeholders
    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      if (dict[key]) {
        el.setAttribute("placeholder", dict[key]);
      }
    });

    // Dispatch event for dynamic page components
    window.dispatchEvent(new CustomEvent("deenquest:langChange", { detail: { lang } }));
  },

  toggleLanguage() {
    const nextLang = this.currentLang === "en" ? "bn" : "en";
    this.applyLanguage(nextLang);

    if (window.DeenApp && window.DeenApp.showToast) {
      window.DeenApp.showToast(nextLang === "bn" ? "ভাষা পরিবর্তন: বাংলা" : "Language switched to English");
    }
  },

  get(key) {
    const dict = this.translations[this.currentLang] || this.translations.en;
    return dict[key] || key;
  }
};

document.addEventListener("DOMContentLoaded", () => {
  LangManager.init();
});
