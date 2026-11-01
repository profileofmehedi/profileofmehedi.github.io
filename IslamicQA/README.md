# DEENQUEST — Islamic Knowledge & Discovery Platform

> **"Explore. Understand. Discover the Truth."**

A world-class, modern, authentic, and responsive Islamic Knowledge & Question-Answer web platform developed strictly with **HTML5, CSS3, and Vanilla JavaScript** (Zero frameworks, zero external build tools, zero external runtime dependencies).

---

## 🌟 Key Features

1. **Brand Identity & Modern Islamic Aesthetics**:
   - Palette: Deep Emerald Green (`#064e3b`), Dark Navy (`#0f172a`), Warm Ivory (`#fbf9f5`), and Subtle Gold accents (`#c5a059`).
   - Authentic geometric Islamic pattern background via SVG.
   - Elegant typography with Google Fonts: *Inter* (English), *Noto Sans Bengali* (Bangla), and *Amiri* (Arabic with full vowel marks/tashkeel).
   - Custom SVG Islamic 8-point star logo.

2. **11-Part Rigorous Structured Answers**:
   Every answer adheres to a strict 11-part analytical structure:
   1. Direct Answer
   2. Understanding the Question
   3. Quranic Evidence (Arabic + translations + references)
   4. Authentic Hadith Evidence (Kutub al-Sittah + authenticity gradings)
   5. Explanation from Recognized Tafsir (Ibn Kathir, Al-Qurtubi)
   6. Scholarly Opinions (Four Sunni Madhabs)
   7. Logical Reasoning
   8. Different Perspectives
   9. Common Misunderstandings
   10. Conclusion
   11. Verified Primary References

3. **Quran Explorer & Ayah-by-Ayah Reader**:
   - Complete directory of all **114 Surahs** with Arabic calligraphy, English meaning, Bengali title, Ayah count, and Makki/Madani classification.
   - Interactive Ayah-by-Ayah reader with Arabic font size controls (`A+` / `A-`), English (Sahih International), Bengali (Mohiuddin Khan), transliteration, expandable classical Tafsir excerpts, copy, and bookmarking.

4. **Hadith Library (Kutub al-Sittah)**:
   - Canonical collections: Sahih al-Bukhari, Sahih Muslim, Sunan Abu Dawood, Jami' at-Tirmidhi, Sunan an-Nasa'i, Sunan Ibn Majah.
   - Authenticity gradings (*Sahih*, *Hasan*).
   - Search by keyword, narrator, chapter, or number.

5. **Islamic Myth vs Reality**:
   - Evidence-based analysis of 7 widespread stereotypes (e.g. compulsion in religion, status of women, science vs Islam, Jihad vs terrorism).
   - Misconception vs Canonical Reality with historical and juridical context.

6. **Interactive History Timeline**:
   - 1,400+ years of civilizational history across 5 eras: Prophetic Era, Rashidun Caliphate, Umayyad, Abbasid / Islamic Golden Age luminaries (Al-Khwarizmi, Ibn al-Haytham, Ibn Sina, Al-Biruni), and Ottoman Era.

7. **Multi-Level Knowledge Quiz Engine**:
   - Beginner, Intermediate, and Advanced tiers.
   - Multiple choice questions, immediate visual/sound feedback, scriptural references, running progress bar, and final scorecard with retry option.

8. **Islamic AI Assistant Simulator**:
   - Conversational research partner answering queries with cross-referenced citations.
   - Strict ethical guardrails: clearly labeled as educational research, disclaiming fatwa authority, recommending qualified local Muftis.

9. **Daily Reflection Sanctuary**:
   - Rotating Quranic gem, Hadith gem, daily moral lesson, and practical action advice.

10. **Universal Platform Enhancements**:
    - **Global Search Modal** (accessible anywhere via `Ctrl+K` or search button).
    - **Dark Mode / Light Mode** toggle with persistent `localStorage`.
    - **Bangla / English Language** switcher with live UI translation dictionary.
    - **Unified Bookmark Manager** (save questions, verses, hadiths, reflections; export to JSON).
    - **Reading Progress Bar** and **Back to Top** button with smooth scrolling.
    - Mobile Slide-out Drawer and Mobile Bottom App Navigation Bar.

---

## 📁 Project Structure

```
/IslamicQA
  index.html                    # Homepage (Hero, Search, Featured Q&A, Quran/Hadith of Day, Topics)
  /pages
    questions.html              # Q&A Explorer with Category Filters & Search
    question-details.html       # 11-Part Detailed Answer Page
    ask.html                    # Interactive Question Submission & Verification
    quran.html                  # 114 Surahs Directory & Search
    surah-details.html          # Interactive Ayah-by-Ayah Reader & Tafsir
    tafsir.html                 # Classical Exegesis Explorer
    hadith.html                 # Kutub al-Sittah Hadith Library
    hadith-details.html         # Hadith Deep Narrator View
    myths.html                  # Myth vs Reality Misconceptions Section
    history.html                # 1,400-Year Interactive History Timeline
    quiz.html                   # Multi-Level Interactive Knowledge Quiz
    reflections.html            # Daily Islamic Reflection & Practical Advice
    assistant.html              # Ask the Scholar / Islamic AI Assistant
    bookmarks.html              # Saved Bookmarks Manager (LocalStorage)
    about.html                  # Mission, Vision & Scholarly Ethos
    sources.html                # Sources & Methodology Standards
  /assets
    /css
      style.css                 # Master Design System (Colors, CSS Variables, Cards, Layouts)
      animations.css            # Keyframes, Scroll Reveals, Shimmer, Floats
      responsive.css            # Mobile Drawer, Bottom Bar, Breakpoints
    /js
      data.js                   # Canonical Data Store (114 Surahs, Hadiths, Q&A, Myths, Quiz, History)
      app.js                    # Toasts, Clipboard, Share API, Scroll Observer, Common Utils
      navigation.js             # Sticky Header, Mobile Drawer, Reading Progress, Active Link State
      search.js                 # Global Search Modal (Ctrl+K Fuzzy Matcher)
      theme.js                  # Dark/Light Mode Controller
      language.js               # English / Bengali Localization System
      bookmarks.js              # Unified LocalStorage Bookmark Engine
      questions.js              # Q&A Filtering, Sorting & 11-Part Answer Renderer
      quran.js                  # 114 Surahs Grid, Ayah Reader, Font Sizer & Tafsir
      hadith.js                 # Hadith Library Collections & Search
      quiz.js                   # Interactive Quiz Logic, Progress & Scoring
      assistant.js              # Islamic AI Assistant Simulated Knowledge Engine
  prompt.txt                    # Project Specification
  README.md                     # Documentation & Setup Guide
```

---

## 🚀 How to Run

Because DEENQUEST is built using **pure standards-compliant HTML5, CSS3, and Vanilla JavaScript**, no `npm install`, Node.js, or compilation build step is needed!

### Method 1: Direct File Opening
Double-click `index.html` in your file explorer to open it in any modern browser (Chrome, Firefox, Safari, Edge).

### Method 2: Local HTTP Server (Recommended)
Using Python or any static web server:

```bash
# Python 3
python -m http.server 8000
```

Then visit:
```
http://localhost:8000
```

---

## 📜 Content Integrity & Islamic Research Standards

The platform prioritizes **authenticity over quantity**:
- **Primary Canonical Sources**: Holy Quran (with full tashkeel vowelization) and the *Kutub al-Sittah* (Sahih al-Bukhari, Sahih Muslim, Abu Dawood, at-Tirmidhi, an-Nasa'i, Ibn Majah).
- **Recognized Tafsir**: Tafsir Ibn Kathir (*Tafsir al-Qur'an al-'Azim*), Tafsir al-Qurtubi (*Al-Jami' li-Ahkam al-Qur'an*), and Tafsir al-Tabari.
- **Epistemic Transparency**: Direct scriptural text is clearly demarcated from scholarly exegesis, historical accounts, and contemporary scientific findings.
- **Non-Fatwa Educational Scope**: Clearly advises users that personal jurisprudence matters require consultation with qualified local Muftis.

---

© 2026 DEENQUEST. Dedicated to authentic Islamic research and intellectual clarity.
