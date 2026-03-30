# Project Context: Keyamoter Alamot (কিয়ামতের আলামত)

This project is a comprehensive, professional Islamic portal focused on the signs of Qiyamah (Doomsday), afterlife, and daily spiritual practices. It serves as an educational resource for the Muslim Ummah, combining scriptural knowledge with a modern web experience.

## 🎯 Core Objectives
- Educate users on the Minor and Major signs of Qiyamah based on Quran and Sahih Hadith.
- Provide a modular library of essential Surahs and Duas with Bengali pronunciation and meaning.
- Offer functional tools like Zakat/Fitra calculators and a digital Tasbih.
- Guide users through the stages of death, the grave (Barzakh), and the afterlife (Hashr, Mizan, Jannah/Jahannam).

## 🛠 Tech Stack
- **Frontend:** HTML5, CSS3 (Vanilla), Bootstrap 5.3.0.
- **Typography:** 'Kalpurush' (Bengali) via Maateen Font and 'Amiri' (Arabic) via Google Fonts.
- **Icons:** FontAwesome 6.4.0.
- **Animations:** AOS (Animate on Scroll) for smooth transitions.
- **Interactivity:** Vanilla JavaScript for real-time calculations, filtering, and state management.
- **Persistence:** `localStorage` is used for the Tasbih counter and Dark Mode preference.

## 📂 Directory Structure
- `/` (Root): Main landing page (`index.html`) with navbar dropdowns and primary sections.
- `/library/`: Essential Surahs (Fatiha, Rahman, Mulk, etc.) with a live search filter.
- `/calculators/`: Real-time Islamic tools (Zakat, Fitra, Tasbih, Basic Miras).
- `/prayer/`: Detailed guides for special prayers (Tahajjud, Salatut Tasbih, Janaza, etc.).
- `/stories/`: Deep-dives into historic Islamic events (Miraj, Ashabul Kahf, Karbala, etc.).
- `/signs/`: Detailed analysis of Major Signs (Imam Mahdi, Dajjal, Isa AS, Yajuj-Majuj).
- `/afterlife/`: Comprehensive descriptions of the Grave, Hashr, Mizan, and Jannah/Jahannam.
- `/names/`: Asmaul Husna (99 Names of Allah) with meanings.
- `/adhkar/`: Daily morning/evening Masnun Adhkar.
- `/science/`: Scientific and contemporary analysis of Qiyamah signs.
- `/quiz/`: Interactive 10-question Islamic knowledge quiz.

## 🎨 Design Language
- **Primary Theme:** Emerald Dark (`#064e3b`) and Gold (`#d97706`).
- **UI Components:** Card-based layouts, info-boxes, and specialized `verse-card` styling for Quranic text.
- **User Experience:**
    - **Dark Mode:** System-wide dark theme toggle saved in `localStorage`.
    - **Responsive:** Mobile-first approach using Bootstrap grid.
    - **Audio:** Embedded audio players for Surah recitations (e.g., Surah Al-Fatiha).

## 💡 Key Logic & Implementations
1. **Real-time Calculations:** Zakat and Fitra calculators use `oninput` events to show results and Bengali word conversions instantly without page reloads.
2. **Search Filtering:** The library uses a client-side JS function to filter Surah cards based on title or description.
3. **Persisted Tasbih:** The digital Tasbih counter saves its state to `localStorage`, ensuring data isn't lost on refresh.
4. **Professional Navigation:** Multi-level dropdown menus categorize content into "Signs", "Afterlife", "Resources", and "More".

## 📜 Ethical & Content Standards
- **Authenticity:** Content must be backed by Sahih Hadith and Quranic references.
- **Safety:** No staged or sensitive data. Protecting user privacy.
- **Consistency:** Maintain the Emerald & Gold aesthetic across all new modules.
