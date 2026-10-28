# WonderLab — Interactive Personal Experience Studio
*নিজেকে নতুনভাবে জানুন, নিজের গল্পকে সুন্দরভাবে সাজান, আর শেয়ার করুন সবার সঙ্গে।*

[![License: MIT](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)
[![Static Web](https://img.shields.io/badge/Platform-Static%20Web-blue.svg)](https://profileofmehedi.github.io/wonderlab/)
[![No Backend](https://img.shields.io/badge/Backend-Zero%20Server-green.svg)](https://profileofmehedi.github.io/wonderlab/)

**WonderLab** is an all-in-one interactive creative studio where users can explore their identity, generate personalized Bengali artwork, create quote cards, discover their names in 8 world languages, challenge friends, visualize their life timeline in weeks, and build a professional portfolio website in 1 minute.

---

## ✨ Features & 8 Interactive Experiences

1. **My Name Story (`#name-story`)**:
   - Generates personalized royal name poster with monogram, Bengali & English calligraphy.
   - Built-in authentic dictionary of Bengali/Arabic/Sanskrit name meanings with verified lookup.
   - Customizable gradients, floating particles, and high-DPI poster download.

2. **My Digital Fingerprint (`#fingerprint`)**:
   - Generative biometric-style digital fingerprint artwork based on personality archetypes (*The Luminary Creator, The Serene Anchor, The Knowledge Seeker, etc.*).
   - Intricate undulating SVG ridges with animated scanning laser.
   - Deterministic seeded pseudo-random engine for reproducible art.

3. **Friendship Challenge (`#friendship`)**:
   - Fun friendship quiz builder with harmless everyday questions.
   - Solver mode for friends via URL-safe hash fragment encoding (`#friendship?quiz=...`).
   - Instant score calculator with confetti celebration and shareable scorecard.

4. **Your Life in Weeks (`#life-timeline`)**:
   - Interactive HTML5 Canvas week matrix based on birth date (52 weeks × assumed horizon).
   - Precise breakdown of elapsed weeks, percentage lived, and hypothetical time horizon.
   - Respectful, inspirational design emphasizing time awareness.

5. **My Quote Card (`#quote-card`)**:
   - Curated library of 40+ inspiring Bengali & English quotes categorized by Motivation, Friendship, Life, and Dreams.
   - Aspect ratio switcher: 4:5 Portrait (Post), 9:16 Story, 1:1 Square, 16:9 Banner.
   - Custom background presets, font alignment, and custom photo uploader with brightness/dimming slider.

6. **Your Name in Different Languages (`#name-languages`)**:
   - Displays names in 8 major world scripts: Bengali, English, Arabic, Japanese Katakana, Korean Hangul, Hindi Devanagari, Greek, and Russian Cyrillic.
   - Authentic phonetic transliterations with readings and copy buttons.
   - Multilingual museum poster layout.

7. **Bangla Poster Studio (`#poster-studio`)**:
   - Lightweight browser-based social poster creator for birthday greetings, festival greetings (Eid), study motivation, and announcements.
   - Font size slider, text alignment, gradient presets, undo/redo history stack, and instant export.

8. **One-Minute Portfolio (`#portfolio`)**:
   - Instant personal portfolio builder with bio, skills, featured projects, and education.
   - 4 sleek themes (Neo-Glass Dark, Slate Light, Sunset Studio, Cyberpunk).
   - **Standalone HTML Download**: exports a self-contained, responsive single-file website with embedded CSS ready to upload directly to GitHub Pages or Netlify.
   - Summary image card and Markdown resume copy.

---

## 🛠️ Technology Stack

- **HTML5 & CSS3**: Glassmorphism, CSS Custom Properties, Responsive Grid, Ambient Orbs.
- **Vanilla JavaScript & jQuery 3.7.1**: Smooth DOM interactions, client-side routing, and event delegation.
- **HTML5 Canvas & SVG**: Fast week grid rendering, deterministic generative fingerprint vectors.
- **html2canvas**: High-DPI (2x scale) client-side image exporter with Bengali font readiness verification.
- **Google Fonts**: *Hind Siliguri* (Bengali), *Inter* (English), *Playfair Display*.
- **Lucide Icons**: Crisp SVG icons.
- **canvas-confetti**: Celebratory micro-interactions.

---

## 🔒 Privacy & Zero Backend Guarantee

- **No Backend**: WonderLab is a 100% client-side static web application.
- **No Database**: No passwords, accounts, or user data are stored on any server.
- **Safe LocalStorage**: Only user theme preference and non-sensitive options are kept in the browser, with a one-click **"Reset Local Data"** option in the About section.
- **No Paid APIs or Server Keys**: Works anywhere, anytime, completely offline-compatible.

---

## 🚀 Running Locally

You do not need Node.js or any build tool!

### Option 1: Double-click
Simply double click `index.html` in any modern web browser (Chrome, Edge, Firefox, Safari).

### Option 2: Local HTTP Server (Optional)
If you prefer running with a local static server:
```bash
# Using Python
python -m http.server 8000

# Using Node / npx
npx serve .
```
Then open `http://localhost:8000` in your browser.

---

## 🌐 Deploying to Cloudflare Pages / GitHub Pages / Netlify

### Cloudflare Pages:
1. Log into your Cloudflare dashboard and go to **Pages**.
2. Connect your GitHub repository `wonderlab` (or upload the folder directly).
3. Set **Build command** to empty (None) and **Build output directory** to `/` (root).
4. Click **Deploy**. Your site will be live across Cloudflare's global edge network in seconds!

### GitHub Pages:
1. Push the code to your GitHub repository (e.g. `https://github.com/profileofmehedi/wonderlab`).
2. Go to **Settings > Pages**.
3. Under **Build and deployment > Source**, select `Deploy from a branch` and choose `main` / `root`.
4. Click **Save**.

---

## 📄 License
MIT License. Free to use, adapt, and share.
