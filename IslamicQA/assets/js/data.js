/**
 * DEENQUEST - Authentic Islamic Knowledge Platform Data Store
 * All Quranic verses, Hadiths, Tafsir excerpts, and historical records are strictly sourced from
 * authenticated Islamic literature (Quran, Kutub al-Sittah, Tafsir Ibn Kathir, classical history).
 */

const DEEN_DATA = {
  // Brand Information
  brand: {
    name: "DEENQUEST",
    tagline: "Explore. Understand. Discover the Truth.",
    taglineBn: "অনুসন্ধান করুন। জানুন। সত্য আবিষ্কার করুন।",
    established: "2026",
    mission: "To provide authentic, verified, and intellectually grounded Islamic knowledge through modern digital design."
  },

  // 114 Surahs of the Holy Quran
  surahs: [
    { number: 1, name: "Al-Fatihah", arabic: "الفاتحة", bangla: "আল-ফাতিহা", englishMeaning: "The Opener", ayahs: 7, type: "Makki", revelationOrder: 5, juz: 1 },
    { number: 2, name: "Al-Baqarah", arabic: "البقرة", bangla: "আল-বাকারা", englishMeaning: "The Cow", ayahs: 286, type: "Madani", revelationOrder: 87, juz: 1 },
    { number: 3, name: "Ali 'Imran", arabic: "آل عمران", bangla: "আলে ইমরান", englishMeaning: "Family of Imran", ayahs: 200, type: "Madani", revelationOrder: 89, juz: 3 },
    { number: 4, name: "An-Nisa", arabic: "النساء", bangla: "আন-নিসা", englishMeaning: "The Women", ayahs: 176, type: "Madani", revelationOrder: 92, juz: 4 },
    { number: 5, name: "Al-Ma'idah", arabic: "المائدة", bangla: "আল-মায়েদা", englishMeaning: "The Table Spread", ayahs: 120, type: "Madani", revelationOrder: 112, juz: 6 },
    { number: 6, name: "Al-An'am", arabic: "الأنعام", bangla: "আল-আনআম", englishMeaning: "The Cattle", ayahs: 165, type: "Makki", revelationOrder: 55, juz: 7 },
    { number: 7, name: "Al-A'raf", arabic: "الأعراف", bangla: "আল-আরাফ", englishMeaning: "The Heights", ayahs: 206, type: "Makki", revelationOrder: 39, juz: 8 },
    { number: 8, name: "Al-Anfal", arabic: "الأنفال", bangla: "আল-আনফাল", englishMeaning: "The Spoils of War", ayahs: 75, type: "Madani", revelationOrder: 88, juz: 9 },
    { number: 9, name: "At-Tawbah", arabic: "التوبة", bangla: "আত-তাওবা", englishMeaning: "The Repentance", ayahs: 129, type: "Madani", revelationOrder: 113, juz: 10 },
    { number: 10, name: "Yunus", arabic: "يونس", bangla: "ইউনুস", englishMeaning: "Jonah", ayahs: 109, type: "Makki", revelationOrder: 51, juz: 11 },
    { number: 11, name: "Hud", arabic: "هود", bangla: "হুদ", englishMeaning: "Hud", ayahs: 123, type: "Makki", revelationOrder: 52, juz: 11 },
    { number: 12, name: "Yusuf", arabic: "يوسف", bangla: "ইউসুফ", englishMeaning: "Joseph", ayahs: 111, type: "Makki", revelationOrder: 53, juz: 12 },
    { number: 13, name: "Ar-Ra'd", arabic: "الرعد", bangla: "আর-রাদ", englishMeaning: "The Thunder", ayahs: 43, type: "Madani", revelationOrder: 96, juz: 13 },
    { number: 14, name: "Ibrahim", arabic: "إبراهيم", bangla: "ইব্রাহিম", englishMeaning: "Abraham", ayahs: 52, type: "Makki", revelationOrder: 72, juz: 13 },
    { number: 15, name: "Al-Hijr", arabic: "الحجر", bangla: "আল-হিজর", englishMeaning: "The Rocky Tract", ayahs: 99, type: "Makki", revelationOrder: 54, juz: 14 },
    { number: 16, name: "An-Nahl", arabic: "النحل", bangla: "আন-নাহল", englishMeaning: "The Bee", ayahs: 128, type: "Makki", revelationOrder: 70, juz: 14 },
    { number: 17, name: "Al-Isra", arabic: "الإسراء", bangla: "আল-ইসরা", englishMeaning: "The Night Journey", ayahs: 111, type: "Makki", revelationOrder: 50, juz: 15 },
    { number: 18, name: "Al-Kahf", arabic: "الكهف", bangla: "আল-কাহফ", englishMeaning: "The Cave", ayahs: 110, type: "Makki", revelationOrder: 69, juz: 15 },
    { number: 19, name: "Maryam", arabic: "مريم", bangla: "মারইয়াম", englishMeaning: "Mary", ayahs: 98, type: "Makki", revelationOrder: 44, juz: 16 },
    { number: 20, name: "Ta-Ha", arabic: "طه", bangla: "ত্বা-হা", englishMeaning: "Ta-Ha", ayahs: 135, type: "Makki", revelationOrder: 45, juz: 16 },
    { number: 21, name: "Al-Anbiya", arabic: "الأنبياء", bangla: "আল-আম্বিয়া", englishMeaning: "The Prophets", ayahs: 112, type: "Makki", revelationOrder: 73, juz: 17 },
    { number: 22, name: "Al-Hajj", arabic: "الحج", bangla: "আল-হাজ্জ", englishMeaning: "The Pilgrimage", ayahs: 78, type: "Madani", revelationOrder: 103, juz: 17 },
    { number: 23, name: "Al-Mu'minun", arabic: "المؤمنون", bangla: "আল-মুমিনুন", englishMeaning: "The Believers", ayahs: 118, type: "Makki", revelationOrder: 74, juz: 18 },
    { number: 24, name: "An-Nur", arabic: "النور", bangla: "আন-নূর", englishMeaning: "The Light", ayahs: 64, type: "Madani", revelationOrder: 102, juz: 18 },
    { number: 25, name: "Al-Furqan", arabic: "الفرقان", bangla: "আল-ফুরকান", englishMeaning: "The Criterion", ayahs: 77, type: "Makki", revelationOrder: 42, juz: 18 },
    { number: 26, name: "Ash-Shu'ara", arabic: "الشعراء", bangla: "আশ-শুয়ারা", englishMeaning: "The Poets", ayahs: 227, type: "Makki", revelationOrder: 47, juz: 19 },
    { number: 27, name: "An-Naml", arabic: "النمل", bangla: "আন-নামল", englishMeaning: "The Ant", ayahs: 93, type: "Makki", revelationOrder: 48, juz: 19 },
    { number: 28, name: "Al-Qasas", arabic: "القصص", bangla: "আল-কাসাস", englishMeaning: "The Stories", ayahs: 88, type: "Makki", revelationOrder: 49, juz: 20 },
    { number: 29, name: "Al-'Ankabut", arabic: "العنكبوت", bangla: "আল-আনকাবুত", englishMeaning: "The Spider", ayahs: 69, type: "Makki", revelationOrder: 85, juz: 20 },
    { number: 30, name: "Ar-Rum", arabic: "الروم", bangla: "আর-রুম", englishMeaning: "The Romans", ayahs: 60, type: "Makki", revelationOrder: 84, juz: 21 },
    { number: 31, name: "Luqman", arabic: "لقمان", bangla: "লুকমান", englishMeaning: "Luqman", ayahs: 34, type: "Makki", revelationOrder: 57, juz: 21 },
    { number: 32, name: "As-Sajdah", arabic: "السجدة", bangla: "আস-সাজদাহ", englishMeaning: "The Prostration", ayahs: 30, type: "Makki", revelationOrder: 75, juz: 21 },
    { number: 33, name: "Al-Ahzab", arabic: "الأحزاب", bangla: "আল-আহযাব", englishMeaning: "The Combined Forces", ayahs: 73, type: "Madani", revelationOrder: 90, juz: 21 },
    { number: 34, name: "Saba", arabic: "سبأ", bangla: "সাবা", englishMeaning: "Sheba", ayahs: 54, type: "Makki", revelationOrder: 58, juz: 22 },
    { number: 35, name: "Fatir", arabic: "فاطر", bangla: "ফাতির", englishMeaning: "Originator", ayahs: 45, type: "Makki", revelationOrder: 43, juz: 22 },
    { number: 36, name: "Ya-Sin", arabic: "يس", bangla: "ইয়া-সিন", englishMeaning: "Ya-Sin", ayahs: 83, type: "Makki", revelationOrder: 41, juz: 22 },
    { number: 37, name: "As-Saffat", arabic: "الصافات", bangla: "আস-সাফফাত", englishMeaning: "Those Ranks", ayahs: 182, type: "Makki", revelationOrder: 56, juz: 23 },
    { number: 38, name: "Sad", arabic: "ص", bangla: "সোয়াদ", englishMeaning: "The Letter Sad", ayahs: 88, type: "Makki", revelationOrder: 38, juz: 23 },
    { number: 39, name: "Az-Zumar", arabic: "الزمر", bangla: "আজ-জুমার", englishMeaning: "The Troops", ayahs: 75, type: "Makki", revelationOrder: 59, juz: 23 },
    { number: 40, name: "Ghafir", arabic: "غافر", bangla: "গাফির", englishMeaning: "The Forgiver", ayahs: 85, type: "Makki", revelationOrder: 60, juz: 24 },
    { number: 41, name: "Fussilat", arabic: "فصلت", bangla: "ফুসসিলাত", englishMeaning: "Explained in Detail", ayahs: 54, type: "Makki", revelationOrder: 61, juz: 24 },
    { number: 42, name: "Ash-Shura", arabic: "الشورى", bangla: "আশ-শুরা", englishMeaning: "The Consultation", ayahs: 53, type: "Makki", revelationOrder: 62, juz: 25 },
    { number: 43, name: "Az-Zukhruf", arabic: "الزخرف", bangla: "আজ-জুখরুফ", englishMeaning: "The Ornaments of Gold", ayahs: 89, type: "Makki", revelationOrder: 63, juz: 25 },
    { number: 44, name: "Ad-Dukhan", arabic: "الدخان", bangla: "আদ-দুখান", englishMeaning: "The Smoke", ayahs: 59, type: "Makki", revelationOrder: 64, juz: 25 },
    { number: 45, name: "Al-Jathiyah", arabic: "الجاثية", bangla: "আল-জাসিয়া", englishMeaning: "The Crouching", ayahs: 37, type: "Makki", revelationOrder: 65, juz: 25 },
    { number: 46, name: "Al-Ahqaf", arabic: "الأحقاف", bangla: "আল-আহকাফ", englishMeaning: "The Wind-Curved Sandhills", ayahs: 35, type: "Makki", revelationOrder: 66, juz: 26 },
    { number: 47, name: "Muhammad", arabic: "محمد", bangla: "মুহাম্মদ", englishMeaning: "Muhammad", ayahs: 38, type: "Madani", revelationOrder: 95, juz: 26 },
    { number: 48, name: "Al-Fath", arabic: "الفتح", bangla: "আল-ফাতহ", englishMeaning: "The Victory", ayahs: 29, type: "Madani", revelationOrder: 111, juz: 26 },
    { number: 49, name: "Al-Hujurat", arabic: "الحجرات", bangla: "আল-হুজুরাত", englishMeaning: "The Rooms", ayahs: 18, type: "Madani", revelationOrder: 106, juz: 26 },
    { number: 50, name: "Qaf", arabic: "ق", bangla: "কাফ", englishMeaning: "The Letter Qaf", ayahs: 45, type: "Makki", revelationOrder: 34, juz: 26 },
    { number: 51, name: "Adh-Dhariyat", arabic: "الذاريات", bangla: "আয-যারিয়াত", englishMeaning: "The Winnowing Winds", ayahs: 60, type: "Makki", revelationOrder: 67, juz: 26 },
    { number: 52, name: "At-Tur", arabic: "الطور", bangla: "আত-তূর", englishMeaning: "The Mount", ayahs: 49, type: "Makki", revelationOrder: 76, juz: 27 },
    { number: 53, name: "An-Najm", arabic: "النجم", bangla: "আন-নাজম", englishMeaning: "The Star", ayahs: 62, type: "Makki", revelationOrder: 23, juz: 27 },
    { number: 54, name: "Al-Qamar", arabic: "القمر", bangla: "আল-কামার", englishMeaning: "The Moon", ayahs: 55, type: "Makki", revelationOrder: 37, juz: 27 },
    { number: 55, name: "Ar-Rahman", arabic: "الرحمن", bangla: "আর-রহমান", englishMeaning: "The Beneficent", ayahs: 78, type: "Madani", revelationOrder: 97, juz: 27 },
    { number: 56, name: "Al-Waqi'ah", arabic: "الواقعة", bangla: "আল-ওয়াকিয়া", englishMeaning: "The Inevitable", ayahs: 96, type: "Makki", revelationOrder: 46, juz: 27 },
    { number: 57, name: "Al-Hadid", arabic: "الحديد", bangla: "আল-হাদিদ", englishMeaning: "The Iron", ayahs: 29, type: "Madani", revelationOrder: 94, juz: 27 },
    { number: 58, name: "Al-Mujadila", arabic: "المجادلة", bangla: "আল-মুজাদালাহ", englishMeaning: "The Pleading Woman", ayahs: 22, type: "Madani", revelationOrder: 105, juz: 28 },
    { number: 59, name: "Al-Hashr", arabic: "الحشر", bangla: "আল-হাশর", englishMeaning: "The Exile", ayahs: 24, type: "Madani", revelationOrder: 101, juz: 28 },
    { number: 60, name: "Al-Mumtahanah", arabic: "الممتحنة", bangla: "আল-মুমতাহানা", englishMeaning: "She that is to be examined", ayahs: 13, type: "Madani", revelationOrder: 91, juz: 28 },
    { number: 61, name: "As-Saff", arabic: "الصف", bangla: "আস-সাফ", englishMeaning: "The Ranks", ayahs: 14, type: "Madani", revelationOrder: 109, juz: 28 },
    { number: 62, name: "Al-Jumu'ah", arabic: "الجمعة", bangla: "আল-জুমুআহ", englishMeaning: "Friday", ayahs: 11, type: "Madani", revelationOrder: 110, juz: 28 },
    { number: 63, name: "Al-Munafiqun", arabic: "المنافقون", bangla: "আল-মুনাফিকুন", englishMeaning: "The Hypocrites", ayahs: 11, type: "Madani", revelationOrder: 104, juz: 28 },
    { number: 64, name: "At-Taghabun", arabic: "التغابن", bangla: "আত-তাগাবুন", englishMeaning: "Mutual Disillusion", ayahs: 18, type: "Madani", revelationOrder: 108, juz: 28 },
    { number: 65, name: "At-Talaq", arabic: "الطلاق", bangla: "আত-তালাক", englishMeaning: "The Divorce", ayahs: 12, type: "Madani", revelationOrder: 99, juz: 28 },
    { number: 66, name: "At-Tahrim", arabic: "التحريم", bangla: "আত-তাহরিম", englishMeaning: "The Prohibition", ayahs: 12, type: "Madani", revelationOrder: 107, juz: 28 },
    { number: 67, name: "Al-Mulk", arabic: "الملك", bangla: "আল-মুলক", englishMeaning: "The Sovereignty", ayahs: 30, type: "Makki", revelationOrder: 77, juz: 29 },
    { number: 68, name: "Al-Qalam", arabic: "القلم", bangla: "আল-কলম", englishMeaning: "The Pen", ayahs: 52, type: "Makki", revelationOrder: 2, juz: 29 },
    { number: 69, name: "Al-Haqqah", arabic: "الحاقة", bangla: "আল-হাক্কাহ", englishMeaning: "The Reality", ayahs: 52, type: "Makki", revelationOrder: 78, juz: 29 },
    { number: 70, name: "Al-Ma'arij", arabic: "المعارج", bangla: "আল-মাআরিজ", englishMeaning: "The Ascending Stairways", ayahs: 44, type: "Makki", revelationOrder: 79, juz: 29 },
    { number: 71, name: "Nuh", arabic: "نوح", bangla: "নূহ", englishMeaning: "Noah", ayahs: 28, type: "Makki", revelationOrder: 71, juz: 29 },
    { number: 72, name: "Al-Jinn", arabic: "الجن", bangla: "আল-জ্বিন", englishMeaning: "The Jinn", ayahs: 28, type: "Makki", revelationOrder: 40, juz: 29 },
    { number: 73, name: "Al-Muzzammil", arabic: "المزمل", bangla: "আল-মুযযাম্মিল", englishMeaning: "The Enshrouded One", ayahs: 20, type: "Makki", revelationOrder: 3, juz: 29 },
    { number: 74, name: "Al-Muddaththir", arabic: "المدثر", bangla: "আল-মুদ্দাসসির", englishMeaning: "The Cloaked One", ayahs: 56, type: "Makki", revelationOrder: 4, juz: 29 },
    { number: 75, name: "Al-Qiyamah", arabic: "القيامة", bangla: "আল-কিয়ামাহ", englishMeaning: "The Resurrection", ayahs: 40, type: "Makki", revelationOrder: 31, juz: 29 },
    { number: 76, name: "Al-Insan", arabic: "الإنسان", bangla: "আল-ইনসান", englishMeaning: "Man", ayahs: 31, type: "Madani", revelationOrder: 98, juz: 29 },
    { number: 77, name: "Al-Mursalat", arabic: "المرسلات", bangla: "আল-মুরসালাত", englishMeaning: "The Emissaries", ayahs: 50, type: "Makki", revelationOrder: 33, juz: 29 },
    { number: 78, name: "An-Naba", arabic: "النبأ", bangla: "আন-নাবা", englishMeaning: "The Tidings", ayahs: 40, type: "Makki", revelationOrder: 80, juz: 30 },
    { number: 79, name: "An-Nazi'at", arabic: "النازعات", bangla: "আন-নাযিআত", englishMeaning: "Those who drag forth", ayahs: 46, type: "Makki", revelationOrder: 81, juz: 30 },
    { number: 80, name: "'Abasa", arabic: "عبس", bangla: "আবাসা", englishMeaning: "He Frowned", ayahs: 42, type: "Makki", revelationOrder: 24, juz: 30 },
    { number: 81, name: "At-Takwir", arabic: "التكوير", bangla: "আত-তাকউইর", englishMeaning: "The Overthrowing", ayahs: 29, type: "Makki", revelationOrder: 7, juz: 30 },
    { number: 82, name: "Al-Infitar", arabic: "الانفطار", bangla: "আল-ইনফিতার", englishMeaning: "The Cleaving", ayahs: 19, type: "Makki", revelationOrder: 82, juz: 30 },
    { number: 83, name: "Al-Mutaffifin", arabic: "المطففين", bangla: "আল-মুতাফফিফিন", englishMeaning: "The Defrauding", ayahs: 36, type: "Makki", revelationOrder: 86, juz: 30 },
    { number: 84, name: "Al-Inshiqaq", arabic: "الانشقاق", bangla: "আল-ইনশিকাক", englishMeaning: "The Splitting Open", ayahs: 25, type: "Makki", revelationOrder: 83, juz: 30 },
    { number: 85, name: "Al-Buruj", arabic: "البروج", bangla: "আল-বুরুজ", englishMeaning: "The Mansions of the Stars", ayahs: 22, type: "Makki", revelationOrder: 27, juz: 30 },
    { number: 86, name: "At-Tariq", arabic: "الطارق", bangla: "আত-তারিক", englishMeaning: "The Morning Star", ayahs: 17, type: "Makki", revelationOrder: 36, juz: 30 },
    { number: 87, name: "Al-A'la", arabic: "الأعلى", bangla: "আল-আলা", englishMeaning: "The Most High", ayahs: 19, type: "Makki", revelationOrder: 8, juz: 30 },
    { number: 88, name: "Al-Ghashiyah", arabic: "الغاشية", bangla: "আল-গাশিয়াহ", englishMeaning: "The Overwhelming", ayahs: 26, type: "Makki", revelationOrder: 68, juz: 30 },
    { number: 89, name: "Al-Fajr", arabic: "الفجر", bangla: "আল-ফজর", englishMeaning: "The Dawn", ayahs: 30, type: "Makki", revelationOrder: 10, juz: 30 },
    { number: 90, name: "Al-Balad", arabic: "البلد", bangla: "আল-বালাদ", englishMeaning: "The City", ayahs: 20, type: "Makki", revelationOrder: 35, juz: 30 },
    { number: 91, name: "Ash-Shams", arabic: "الشمس", bangla: "আশ-শামস", englishMeaning: "The Sun", ayahs: 15, type: "Makki", revelationOrder: 26, juz: 30 },
    { number: 92, name: "Al-Layl", arabic: "الليل", bangla: "আল-লাইল", englishMeaning: "The Night", ayahs: 21, type: "Makki", revelationOrder: 9, juz: 30 },
    { number: 93, name: "Ad-Duha", arabic: "الضحى", bangla: "আদ-দুহা", englishMeaning: "The Morning Hours", ayahs: 11, type: "Makki", revelationOrder: 11, juz: 30 },
    { number: 94, name: "Ash-Sharh", arabic: "الشرح", bangla: "আল-ইনশিরাহ", englishMeaning: "The Relief", ayahs: 8, type: "Makki", revelationOrder: 12, juz: 30 },
    { number: 95, name: "At-Tin", arabic: "التين", bangla: "আত-তীন", englishMeaning: "The Fig", ayahs: 8, type: "Makki", revelationOrder: 28, juz: 30 },
    { number: 96, name: "Al-'Alaq", arabic: "العلق", bangla: "আল-আলাক", englishMeaning: "The Clot", ayahs: 19, type: "Makki", revelationOrder: 1, juz: 30 },
    { number: 97, name: "Al-Qadr", arabic: "القدر", bangla: "আল-কদর", englishMeaning: "The Power", ayahs: 5, type: "Makki", revelationOrder: 25, juz: 30 },
    { number: 98, name: "Al-Bayyinah", arabic: "البينة", bangla: "আল-বায়্যিনাহ", englishMeaning: "The Clear Proof", ayahs: 8, type: "Madani", revelationOrder: 100, juz: 30 },
    { number: 99, name: "Az-Zalzalah", arabic: "الزلزلة", bangla: "আল-যালযালায়", englishMeaning: "The Earthquake", ayahs: 8, type: "Madani", revelationOrder: 93, juz: 30 },
    { number: 100, name: "Al-'Adiyat", arabic: "العاديات", bangla: "আল-আদিয়াত", englishMeaning: "The Courser", ayahs: 11, type: "Makki", revelationOrder: 14, juz: 30 },
    { number: 101, name: "Al-Qari'ah", arabic: "القارعة", bangla: "আল-কারিয়াহ", englishMeaning: "The Calamity", ayahs: 11, type: "Makki", revelationOrder: 30, juz: 30 },
    { number: 102, name: "At-Takathur", arabic: "التكاثر", bangla: "আত-তাকাসুর", englishMeaning: "The Rivalry in world increase", ayahs: 8, type: "Makki", revelationOrder: 16, juz: 30 },
    { number: 103, name: "Al-'Asr", arabic: "العصر", bangla: "আল-আসর", englishMeaning: "The Declining Day", ayahs: 3, type: "Makki", revelationOrder: 13, juz: 30 },
    { number: 104, name: "Al-Humazah", arabic: "الهمزة", bangla: "আল-হুমাযাহ", englishMeaning: "The Traducer", ayahs: 9, type: "Makki", revelationOrder: 32, juz: 30 },
    { number: 105, name: "Al-Fil", arabic: "الفيل", bangla: "আল-ফীল", englishMeaning: "The Elephant", ayahs: 5, type: "Makki", revelationOrder: 19, juz: 30 },
    { number: 106, name: "Quraysh", arabic: "قريش", bangla: "কুরাইশ", englishMeaning: "Quraysh", ayahs: 4, type: "Makki", revelationOrder: 29, juz: 30 },
    { number: 107, name: "Al-Ma'un", arabic: "الماعون", bangla: "আল-মাউন", englishMeaning: "The Small Kindness", ayahs: 7, type: "Makki", revelationOrder: 17, juz: 30 },
    { number: 108, name: "Al-Kawthar", arabic: "الكوثر", bangla: "আল-কাউসার", englishMeaning: "The Abundance", ayahs: 3, type: "Makki", revelationOrder: 15, juz: 30 },
    { number: 109, name: "Al-Kafirun", arabic: "الكافرون", bangla: "আল-কাফিরুন", englishMeaning: "The Disbelievers", ayahs: 6, type: "Makki", revelationOrder: 18, juz: 30 },
    { number: 110, name: "An-Nasr", arabic: "النصر", bangla: "আন-নাসর", englishMeaning: "The Divine Support", ayahs: 3, type: "Madani", revelationOrder: 114, juz: 30 },
    { number: 111, name: "Al-Masad", arabic: "المسد", bangla: "আল-লাহাব", englishMeaning: "The Palm Fiber", ayahs: 5, type: "Makki", revelationOrder: 6, juz: 30 },
    { number: 112, name: "Al-Ikhlas", arabic: "الإخلاص", bangla: "আল-ইখলাস", englishMeaning: "The Sincerity", ayahs: 4, type: "Makki", revelationOrder: 22, juz: 30 },
    { number: 113, name: "Al-Falaq", arabic: "الفلق", bangla: "আল-ফালাক", englishMeaning: "The Daybreak", ayahs: 5, type: "Makki", revelationOrder: 20, juz: 30 },
    { number: 114, name: "An-Nas", arabic: "الناس", bangla: "আন-নাস", englishMeaning: "Mankind", ayahs: 6, type: "Makki", revelationOrder: 21, juz: 30 }
  ],

  // Detailed Verses with Tashkeel, Accurate Translations and Ibn Kathir Commentary
  detailedSurahs: {
    1: {
      number: 1,
      name: "Al-Fatihah",
      arabic: "الفاتحة",
      bangla: "আল-ফাতিহা",
      englishMeaning: "The Opener",
      revelationPlace: "Mecca",
      theme: "The essence of the Holy Quran, supplication for guidance, affirmation of Tawhid and dependence on Allah.",
      themeBn: "কুরআনের মূল সারসংক্ষেপ, হেদায়েতের প্রার্থনা, তাওহীদ প্রতিষ্ঠা এবং আল্লাহর উপর পূর্ণ নির্ভরতা।",
      ayahs: [
        {
          number: 1,
          arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
          transliteration: "Bismillāhir-Raḥmānir-Raḥīm",
          english: "In the name of Allah, the Entirely Merciful, the Especially Merciful.",
          bangla: "শুরু করছি আল্লাহর নামে যিনি পরম করুণাময়, অতি দয়ালু।",
          tafsir: "Commencing every action in the Name of Allah brings divine blessing. 'Ar-Rahman' signifies vast, universal mercy encompassing all creation in this world; 'Ar-Rahim' denotes specific, enduring mercy bestowed upon the righteous believers in the Hereafter (Tafsir Ibn Kathir)."
        },
        {
          number: 2,
          arabic: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
          transliteration: "Al-ḥamdu lillāhi Rabbil-'ālamīn",
          english: "[All] praise is [due] to Allah, Lord of the worlds -",
          bangla: "যাবতীয় প্রশংসা শুধুমাত্র আল্লাহর জন্য, যিনি সমগ্র বিশ্বজগতের পালনকর্তা।",
          tafsir: "Hamd is praise united with love and veneration. 'Rabb' implies the Creator, Sovereign, Sustainer, and Caregiver of all beings ('al-alamin' meaning everything besides Allah)."
        },
        {
          number: 3,
          arabic: "الرَّحْمَٰنِ الرَّحِيمِ",
          transliteration: "Ar-Raḥmānir-Raḥīm",
          english: "The Entirely Merciful, the Especially Merciful,",
          bangla: "যিনি পরম করুণাময় ও অসীম দয়ালু,",
          tafsir: "Reiterating divine mercy after mentioning sovereign authority reassures the human soul that Allah's dominion is administered through compassion rather than harsh despotism."
        },
        {
          number: 4,
          arabic: "مَالِكِ يَوْمِ الدِّينِ",
          transliteration: "Māliki Yawmid-Dīn",
          english: "Sovereign of the Day of Recompense.",
          bangla: "যিনি বিচার দিবসের অধিপতি।",
          tafsir: "Day of Recompense (Yawm ad-Din) refers to the Day of Judgment when all souls will be rewarded or held accountable with absolute justice without partiality."
        },
        {
          number: 5,
          arabic: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
          transliteration: "Iyyāka na'budu wa iyyāka nasta'īn",
          english: "It is You we worship and You we ask for help.",
          bangla: "আমরা কেবল আপনারই ইবাদত করি এবং কেবল আপনারই সাহায্য প্রার্থনা করি।",
          tafsir: "The pinnacle of monotheism (Tawhid). Shifting from third-person praise to direct second-person address ('You alone') demonstrates profound closeness and sincere submission."
        },
        {
          number: 6,
          arabic: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ",
          transliteration: "Ihdinaṣ-ṣirāṭal-mustaqīm",
          english: "Guide us to the straight path -",
          bangla: "আমাদের সরল ও সঠিক পথ প্রদর্শন করুন -",
          tafsir: "The most consequential supplication. 'Sirat al-Mustaqim' is the clear, unambiguous path of Islam, truth, and obedience revealed through Prophet Muhammad (PBUH)."
        },
        {
          number: 7,
          arabic: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ",
          transliteration: "Ṣirāṭalladhīna an'amta 'alayhim ghayril-maghḍūbi 'alayhim wa laḍ-ḍāllīn",
          english: "The path of those upon whom You have bestowed favor, not of those who have evoked [Your] anger or of those who are astray.",
          bangla: "তাদের পথ, যাদের আপনি পুরস্কৃত করেছেন; তাদের পথ নয় যারা ক্রোধের শিকার হয়েছে এবং যারা পথভ্রষ্ট হয়েছে।",
          tafsir: "Those bestowed with favor are the Prophets, the truthful, the martyrs, and the righteous (Quran 4:69). Those who evoke wrath are those who know truth yet deliberately reject it; the astray are those who worship without sound knowledge."
        }
      ]
    },
    2: {
      number: 2,
      name: "Al-Baqarah (Selected Verses)",
      arabic: "البقرة",
      bangla: "আল-বাকারা (নির্বাচিত আয়াতসমূহ)",
      englishMeaning: "The Cow",
      revelationPlace: "Medina",
      theme: "Foundational laws, covenant with believers, Ayat al-Kursi (the Greatest Verse), and conclusion of faith.",
      ayahs: [
        {
          number: 255,
          verseKey: "Ayat al-Kursi (The Throne Verse)",
          arabic: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ",
          transliteration: "Allāhu lā ilāha illā huwal-Ḥayyul-Qayyūm...",
          english: "Allah - there is no deity except Him, the Ever-Living, the Sustainer of all existence. Neither drowsiness overtakes Him nor sleep. To Him belongs whatever is in the heavens and whatever is on the earth. Who is it that can intercede with Him except by His permission? He knows what is before them and what will be after them, and they encompass not a thing of His knowledge except for what He wills. His Kursi extends over the heavens and the earth, and their preservation tires Him not. And He is the Most High, the Most Great.",
          bangla: "আল্লাহ, তিনি ব্যতীত কোনো সত্য উপাস্য নেই; তিনি চিরঞ্জীব, সবকিছুর ধারক। তন্দ্রা বা নিদ্রা তাঁকে স্পর্শ করে না। আকাশমণ্ডলী ও পৃথিবীতে যা কিছু আছে সবই তাঁর। কে আছে যে তাঁর অনুমতি ব্যতীত তাঁর নিকট সুপারিশ করবে? তাদের সম্মুখে ও পশ্চাতে যা আছে তিনি তা জানেন। আর তাঁর ইচ্ছানুযায়ী ব্যতীত তারা তাঁর জ্ঞানের কিছুই আয়ত্ত করতে পারে না। তাঁর কুরসি আকাশ ও পৃথিবীব্যাপী বিস্তৃত; এদের রক্ষণাবেক্ষণ তাঁকে বিন্দুমাত্র ক্লান্ত করে না। তিনি সর্বোচ্চ, মহান।",
          tafsir: "Ubiyy ibn Ka'b narrated that the Prophet (PBUH) confirmed this is the greatest single verse in the Quran (Sahih Muslim 810). It encompasses ten distinct divine attributes demonstrating Allah's absolute self-sufficiency and timeless dominion."
        },
        {
          number: 256,
          verseKey: "Freedom of Conscience",
          arabic: "لَا إِكْرَاهَ فِي الدِّينِ ۖ قَدْ تَبَيَّنَ الرُّشْدُ مِنَ الْغَيِّ ۚ فَمَنْ يَكْفُرْ بِالطَّاغُوتِ وَيُؤْمِنْ بِاللَّهِ فَقَدِ اسْتَمْسَكَ بِالْعُرْوَةِ الْوُثْقَىٰ لَا انْفِصَامَ لَهَا ۗ وَاللَّهُ سَمِيعٌ عَلِيمٌ",
          transliteration: "Lā ikrāha fid-dīn, qad tabayyanar-rushdu minal-ghayy...",
          english: "There shall be no compulsion in [acceptance of] the religion. The right course has become clear from the wrong. So whoever disbelieves in Taghut and believes in Allah has grasped the most trustworthy handhold with no break in it. And Allah is Hearing and Knowing.",
          bangla: "দ্বীনের ব্যাপারে কোনো জবরদস্তি নেই; নিশ্চয় সত্য পথ ভ্রান্ত পথ থেকে সুস্পষ্ট হয়ে গিয়েছে। সুতরাং যে তাগুতকে অস্বীকার করবে এবং আল্লাহর প্রতি ঈমান আনবে, সে দৃঢ়তম রজ্জু ধারণ করল যা কখনো ছিন্ন হবার নয়। আল্লাহ সর্বশ্রোতা, সর্বজ্ঞ।",
          tafsir: "Ibn Kathir notes that faith cannot be valid when forced into human hearts against free will. True conviction requires voluntary recognition of divine clarity and intellectual conviction."
        },
        {
          number: 285,
          verseKey: "The Messenger Believed",
          arabic: "آمَنَ الرَّسُولُ بِمَا أُنْزِلَ إِلَيْهِ مِنْ رَبِّهِ وَالْمُؤْمِنُونَ ۚ كُلٌّ آمَنَ بِاللَّهِ وَمَلَائِكَتِهِ وَكُتُبِهِ وَرُسُلِهِ لَا نُفَرِّقُ بَيْنَ أَحَدٍ مِنْ رُسُلِهِ ۚ وَقَالُوا سَمِعْنَا وَأَطَعْنَا ۖ غُفْرَانَكَ رَبَّنَا وَإِلَيْكَ الْمَصِيرُ",
          transliteration: "Āmanar-Rasūlu bimā unzila ilayhi mir-Rabbihi wal-mu'minūn...",
          english: "The Messenger has believed in what was revealed to him from his Lord, and [so have] the believers. All of them have believed in Allah and His angels and His books and His messengers, [saying], 'We make no distinction between any of His messengers.' And they say, 'We hear and we obey. [We seek] Your forgiveness, our Lord, and to You is the [final] destination.'",
          bangla: "রাসূল তাঁর প্রতি তাঁর রবের পক্ষ থেকে যা নাজিল হয়েছে তার প্রতি ঈমান এনেছেন এবং মুমিনগণও। প্রত্যেকেই ঈমান এনেছে আল্লাহর প্রতি, তাঁর ফেরেশতাগণের প্রতি, তাঁর কিতাবসমূহের প্রতি এবং তাঁর রাসূলগণের প্রতি। তারা বলে, 'আমরা তাঁর রাসূলদের কারো মধ্যে কোনো পার্থক্য করি না।' এবং তারা বলে, 'আমরা শুনলাম ও আনুগত্য করলাম। হে আমাদের প্রতিপালক! আমরা আপনার ক্ষমা প্রার্থনা করি এবং আপনারই কাছে আমাদের প্রত্যাবর্তন।'",
          tafsir: "The Prophet (PBUH) stated: 'Whoever recites the last two verses of Surah Al-Baqarah at night, they will suffice him' (Sahih al-Bukhari 5009)."
        },
        {
          number: 286,
          verseKey: "Divine Mercy and Relief",
          arabic: "لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا ۚ لَهَا مَا كَسَبَتْ وَعَلَيْهَا مَا اكْتَسَبَتْ ۗ رَبَّنَا لَا تُؤَاخِذْنَا إِنْ نَسِينَا أَوْ أَخْطَأْنَا ۚ رَبَّنَا وَلَا تَحْمِلْ عَلَيْنَا إِصْرًا كَمَا حَمَلْتَهُ عَلَى الَّذِينَ مِنْ قَبْلِنَا ۚ رَبَّنَا وَلَا تُحَمِّلْنَا مَا لَا طَاقَةَ لَنَا بِهِ ۖ وَاعْفُ عَنَّا وَاغْفِرْ لَنَا وَارْحَمْنَا ۚ أَنْتَ مَوْلَانَا فَانْصُرْنَا عَلَى الْقَوْمِ الْكَافِرِينَ",
          transliteration: "Lā yukallifullāhu nafsan illā wus'ahā...",
          english: "Allah does not charge a soul except [with that within] its capacity. It will have [the consequence of] what [good] it has gained, and it will bear [the consequence of] what [evil] it has earned. 'Our Lord, do not impose blame upon us if we have forgotten or erred. Our Lord, and lay not upon us a burden like that which You laid upon those before us. Our Lord, and burden us not with that which we have no ability to bear. And pardon us; and forgive us; and have mercy upon us. You are our protector, so give us victory over the disbelieving people.'",
          bangla: "আল্লাহ কোনো আত্মাকে তার সামর্থ্যের অতিরিক্ত বোঝা চাপিয়ে দেন না। সে যা ভালো অর্জন করেছে তা তারই জন্য এবং সে যা মন্দ কামাই করেছে তাও তারই উপর বর্তাবে। 'হে আমাদের রব! আমরা যদি বিস্মৃত হই বা ভুল করি, তবে আপনি আমাদের পাকড়াও করবেন না। হে আমাদের রব! আমাদের পূর্ববর্তীদের ওপর যেমন ভারী বোঝা অর্পণ করেছিলেন, আমাদের ওপর তেমন বোঝা চাপাবেন না। হে আমাদের রব! যার সামর্থ্য আমাদের নেই, এমন ভার আমাদের বহন করাবেন না। আমাদের মার্জনা করুন, আমাদের ক্ষমা করুন এবং আমাদের প্রতি দয়া করুন। আপনিই আমাদের অভিভাবক; অতএব অবিশ্বাসী সম্প্রদায়ের বিরুদ্ধে আমাদের সাহায্য করুন।'",
          tafsir: "Affirms the fundamental Islamic jurisprudential principle: divine commandments never exceed human biological and mental capability."
        }
      ]
    },
    67: {
      number: 67,
      name: "Al-Mulk",
      arabic: "الملك",
      bangla: "আল-মুলক",
      englishMeaning: "The Sovereignty",
      revelationPlace: "Mecca",
      theme: "The wonder of creation, cosmic harmony, death and life as a test of deeds, and salvation.",
      ayahs: [
        {
          number: 1,
          arabic: "تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ",
          transliteration: "Tabārakalladhī biyadihil-mulku wa huwa 'alā kulli shay'in Qadīr",
          english: "Blessed is He in whose hand is dominion, and He is over all things competent -",
          bangla: "মহিমান্বিত তিনি, যাঁর হাতে সর্বময় কর্তৃত্ব এবং তিনি সবকিছুর ওপর ক্ষমতাবান।",
          tafsir: "Tabaraka expresses the infinite, exalted abundance of Allah's blessings and supreme sovereign control over all matter and spirit."
        },
        {
          number: 2,
          arabic: "الَّذِي خَلَقَ الْمَوْتَ وَالْحَيَاةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا ۚ وَهُوَ الْعَزِيزُ الْغَفُورُ",
          transliteration: "Alladhī khalaqal-mawta wal-ḥayāta liyabluwakum ayyukum aḥsanu 'amalā, wa huwal-'Azīzul-Ghafūr",
          english: "[He] who created death and life to test you [as to] which of you is best in deed - and He is the Exalted in Might, the Forgiving -",
          bangla: "যিনি সৃষ্টি করেছেন মৃত্যু ও জীবন, তোমাদের পরীক্ষা করার জন্য—কে তোমাদের মধ্যে আমলের দিক থেকে উত্তম? আর তিনি পরাক্রমশালী, পরম ক্ষমাশীল।",
          tafsir: "Death is mentioned before life because non-existence precedes worldly existence. The purpose of earthly life is not accumulation of material surplus, but excellence of moral conduct (Ahsanu 'Amala) performed sincerely for Allah alone."
        },
        {
          number: 3,
          arabic: "الَّذِي خَلَقَ سَبْعَ سَمَاوَاتٍ طِبَاقًا ۖ مَّا تَرَىٰ فِي خَلْقِ الرَّحْمَٰنِ مِن تَفَاوُتٍ ۖ فَارْجِعِ الْبَصَرَ هَلْ تَرَىٰ مِن فُطُورٍ",
          transliteration: "Alladhī khalaqa sab'a samāwātin ṭibāqan...",
          english: "[And] who created seven heavens in layers. You do not see in the creation of the Most Merciful any inconsistency. So return [your] vision [to the sky]; do you see any breaks?",
          bangla: "যিনি স্তরে স্তরে সাত আসমান সৃষ্টি করেছেন। পরম করুণাময়ের সৃষ্টিতে তুমি কোনো অসামঞ্জস্য দেখতে পাবে না। আবার চোখ তুলে তাকাও—কোনো ত্রুটি দেখতে পাও কি?",
          tafsir: "Invites human intellect to reflect empirically on cosmic balance, mathematical symmetry, and astronomical regularity."
        }
      ]
    },
    112: {
      number: 112,
      name: "Al-Ikhlas",
      arabic: "الإخلاص",
      bangla: "আল-ইখলাস",
      englishMeaning: "The Sincerity",
      revelationPlace: "Mecca",
      theme: "The definitive definition of monotheism (Tawhid), refuting anthropomorphism, dualism, and polytheism.",
      ayahs: [
        {
          number: 1,
          arabic: "قُلْ هُوَ اللَّهُ أَحَدٌ",
          transliteration: "Qul huwallāhu Aḥad",
          english: "Say, 'He is Allah, [who is] One,",
          bangla: "বলুন, তিনিই আল্লাহ, একক,",
          tafsir: "'Ahad' denotes unique absolute oneness, without partner, competitor, subdivision, or constituent parts."
        },
        {
          number: 2,
          arabic: "اللَّهُ الصَّمَدُ",
          transliteration: "Allāhuṣ-Ṣamad",
          english: "Allah, the Eternal Refuge.",
          bangla: "আল্লাহ কারো মুখাপেক্ষী নন, সকলেই তাঁর মুখাপেক্ষী।",
          tafsir: "As-Samad signifies the Master upon whom all creation depends for every need, while He Himself depends on nothing."
        },
        {
          number: 3,
          arabic: "لَمْ يَلِدْ وَلَمْ يُولَدْ",
          transliteration: "Lam yalid wa lam yūlad",
          english: "He neither begets nor is born,",
          bangla: "তিনি কাউকে জন্ম দেননি এবং কেউ তাঁকে জন্ম দেয়নি,",
          tafsir: "Categorically negates lineage, progeny, parenthood, or anthropomorphic biology from the Divine essence."
        },
        {
          number: 4,
          arabic: "وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ",
          transliteration: "Wa lam yakul-lahū kufuwan aḥad",
          english: "Nor is there to Him any equivalent.'",
          bangla: "এবং তাঁর সমকক্ষ কেউই নেই।",
          tafsir: "Concludes with the absolute transcendence: nothing in physical or metaphysical reality resembles Allah in His attributes or majesty."
        }
      ]
    },
    113: {
      number: 113,
      name: "Al-Falaq",
      arabic: "الفلق",
      bangla: "আল-ফালাক",
      englishMeaning: "The Daybreak",
      revelationPlace: "Mecca",
      theme: "Seeking sanctuary with the Lord of Dawn against external malevolent forces, envious eyes, and occult harms.",
      ayahs: [
        { number: 1, arabic: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ", transliteration: "Qul a'ūdhu birabbil-falaq", english: "Say, 'I seek refuge in the Lord of daybreak", bangla: "বলুন, আমি আশ্রয় প্রার্থনা করছি উষার প্রতিপালকের কাছে,", tafsir: "Seeking refuge with the Creator who cracks the dawn out of darkness." },
        { number: 2, arabic: "مِن شَرِّ مَا خَلَقَ", transliteration: "Min sharri mā khalaq", english: "From the evil of that which He created", bangla: "তিনি যা সৃষ্টি করেছেন তার অনিষ্ট থেকে,", tafsir: "Protection from harms created within the universe." },
        { number: 3, arabic: "وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ", transliteration: "Wa min sharri ghāsiqin idhā waqab", english: "And from the evil of darkness when it settles", bangla: "এবং রাতের অন্ধকারের অনিষ্ট থেকে যখন তা গাঢ় হয়,", tafsir: "Refuge from hidden dangers that emerge under cover of night." },
        { number: 4, arabic: "وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ", transliteration: "Wa min sharrin-naffāthāti fil-'uqad", english: "And from the evil of the blowers in knots", bangla: "এবং গিরায় ফুঁকদানকারিণীদের অনিষ্ট থেকে,", tafsir: "Seeking divine shield against destructive witchcraft and occult practices." },
        { number: 5, arabic: "وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ", transliteration: "Wa min sharri ḥāsidin idhā ḥasad", english: "And from the evil of an envier when he envies.'", bangla: "এবং হিংসুকের অনিষ্ট থেকে যখন সে হিংসা করে।", tafsir: "Protection from malicious jealousy and toxic resentment." }
      ]
    },
    114: {
      number: 114,
      name: "An-Nas",
      arabic: "الناس",
      bangla: "আন-নাস",
      englishMeaning: "Mankind",
      revelationPlace: "Mecca",
      theme: "Seeking sanctuary in the Lord, King, and God of Humanity against internal insidious whisperings of Shaytan.",
      ayahs: [
        { number: 1, arabic: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ", transliteration: "Qul a'ūdhu birabbin-nās", english: "Say, 'I seek refuge in the Lord of mankind,", bangla: "বলুন, আমি আশ্রয় প্রার্থনা করছি মানুষের প্রতিপালকের,", tafsir: "Acknowledging Allah as Sustainer of all people." },
        { number: 2, arabic: "مَلِكِ النَّاسِ", transliteration: "Malikin-nās", english: "The Sovereign of mankind,", bangla: "মানুষের অধিপতির,", tafsir: "Acknowledging His sovereign authority over kings and subjects." },
        { number: 3, arabic: "إِلَٰهِ النَّاسِ", transliteration: "Ilāhin-nās", english: "The God of mankind,", bangla: "মানুষের উপাস্যের,", tafsir: "Sole object of authentic worship and reverence." },
        { number: 4, arabic: "مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ", transliteration: "Min sharril-waswāsil-khannās", english: "From the evil of the retreating whisperer -", bangla: "গোপন কুন্ত্রণাদাতার অনিষ্ট থেকে—যে বারবার প্ররোচনা দেয় ও পিছু হটে,", tafsir: "Shaytan whispers doubts when human remembrance of God is negligent, but retreats immediately upon sincere Dhikr." },
        { number: 5, arabic: "الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ", transliteration: "Alladhī yuwaswisu fī ṣudūrin-nās", english: "Who whispers into the breasts of mankind -", bangla: "যে মানুষের অন্তরে কুমন্ত্রণা দেয়,", tafsir: "Targeting human psychology with moral doubt and temptation." },
        { number: 6, arabic: "مِنَ الْجِنَّةِ وَالنَّاسِ", transliteration: "Minal-jinnati wan-nās", english: "From among the jinn and mankind.'", bangla: "জ্বিনদের মধ্য থেকে এবং মানুষের মধ্য থেকে।", tafsir: "Clarifies that malicious whisperers may be unseen spirits or human instigators." }
      ]
    }
  },

  // 11-Part Rigorously Structured Questions and Answers
  questions: [
    {
      id: "q-suffering-evil",
      title: "Why does Allah allow suffering, disease, and tragedy in the world?",
      titleBn: "আল্লাহ কেন পৃথিবীতে দুঃখ, কষ্ট ও বিপর্যয় ঘটতে দেন?",
      slug: "why-allah-allows-suffering",
      category: "Philosophy & Existence",
      categoryBn: "দর্শন ও অস্তিত্ব",
      difficulty: "Advanced",
      readTime: "8 min read",
      tags: ["Aqidah", "Theodicy", "Philosophy", "Suffering", "Free Will"],
      featured: true,
      popular: true,
      views: 14250,
      shortPreview: "In Islamic theology, earthly existence is intentionally designed as an arena of moral trial (Bala'), not eternal paradise. Suffering cultivates resilience, tests gratitude and patience, cleanses transgressions, and elevates spiritual rank in an eternal paradigm.",
      
      // The 11 Strict Structured Sections Required:
      directAnswer: "Islam views worldly life not as the ultimate destination of unblemished bliss, but as a deliberate, temporary testing ground (Dar al-Imtihan). Suffering, pain, and trials exist within a profound divine wisdom (Hikmah) to test human free will, refine moral character, inspire empathy, awaken humility, and grant immense compensation in the eternal Hereafter. Without challenges, virtues such as patience, compassion, bravery, and sacrifice could not exist.",
      
      understandingQuestion: "The question of suffering—known in Western philosophy as the 'problem of evil'—often assumes that if a Creator is all-powerful and all-merciful, human life should be free of physical pain and moral sorrow. The Islamic paradigm reframes this foundation: worldly comfort is not the ultimate purpose of human existence; moral growth, spiritual awakening, and eternal salvation are.",
      
      quranicEvidence: [
        {
          arabic: "الَّذِي خَلَقَ الْمَوْتَ وَالْحَيَاةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا",
          translation: "[He] who created death and life to test you [as to] which of you is best in deed.",
          reference: "Surah Al-Mulk (67:2)"
        },
        {
          arabic: "وَلَنَبْلُوَنَّكُمْ بِشَيْءٍ مِنَ الْخَوْفِ وَالْجُوعِ وَنَقْصٍ مِنَ الْأَمْوَالِ وَالْأَنْفُسِ وَالثَّمَرَاتِ ۗ وَبَشِّرِ الصَّابِرِينَ",
          translation: "And We will surely test you with something of fear and hunger and a loss of wealth and lives and fruits, but give good tidings to the patient.",
          reference: "Surah Al-Baqarah (2:155)"
        },
        {
          arabic: "وَعَسَىٰ أَنْ تَكْرَهُوا شَيْئًا وَهُوَ خَيْرٌ لَكُمْ ۖ وَعَسَىٰ أَنْ تُحِبُّوا شَيْئًا وَهُوَ شَرٌّ لَكُمْ ۗ وَاللَّهُ يَعْلَمُ وَأَنْتُمْ لَا تَعْلَمُونَ",
          translation: "Perhaps you dislike a thing and it is good for you; and perhaps you love a thing and it is bad for you. And Allah knows, while you know not.",
          reference: "Surah Al-Baqarah (2:216)"
        }
      ],
      
      hadithEvidence: [
        {
          arabic: "مَا يُصِيبُ الْمُسْلِمَ مِنْ نَصَبٍ وَلاَ وَصَبٍ وَلاَ هَمٍّ وَلاَ حُزْنٍ وَلاَ أَذًى وَلاَ غَمٍّ حَتَّى الشَّوْكَةِ يُشَاكُهَا، إِلاَّ كَفَّرَ اللَّهُ بِهَا مِنْ خَطَايَاهُ",
          english: "No fatigue, nor disease, nor sorrow, nor sadness, nor hurt, nor distress befalls a Muslim, even if it were the prick he receives from a thorn, but that Allah expiates some of his sins for that.",
          bangla: "কোনো মুসলিম যখন ক্লান্তি, ব্যাধি, উদ্বেগ, শোক, কষ্ট বা যন্ত্রণায় পতিত হয়—এমনকি একটি কাটার আঘাতও পায়—আল্লাহ তার মাধ্যমে তার গুনাহ মোচন করেন।",
          source: "Sahih al-Bukhari 5641, Sahih Muslim 2573",
          grading: "Sahih (Muttafaq 'Alayh)"
        },
        {
          arabic: "عَجَبًا لأَمْرِ الْمُؤْمِنِ إِنَّ أَمْرَهُ كُلَّهُ خَيْرٌ... إِنْ أَصَابَتْهُ سَرَّاءُ شَكَرَ فَكَانَ خَيْرًا لَهُ وَإِنْ أَصَابَتْهُ ضَرَّاءُ صَبَرَ فَكَانَ خَيْرًا لَهُ",
          english: "How wonderful is the case of a believer; there is good for him in everything and this applies only to a believer. If prosperity attends him, he expresses gratitude to Allah and that is good for him; and if adversity befalls him, he endures it patiently and that is good for him.",
          bangla: "মুমিনের অবস্থা কতই না চমৎকার! তার প্রতিটি কাজেই কল্যাণ নিহিত থাকে। যদি তার স্বাচ্ছন্দ্য আসে সে শুকরিয়া আদায় করে, যা তার জন্য কল্যাণকর; আর যদি বিপদ আসে সে ধৈর্য ধারণ করে, যা তার জন্য কল্যাণকর।",
          source: "Sahih Muslim 2999",
          grading: "Sahih"
        }
      ],
      
      tafsirExplanation: "In his commentary on Surah Al-Kahf (18:65-82) regarding the journey of Prophet Musa and Al-Khidr, Imam Ibn Kathir highlights that human beings judge occurrences based solely on immediate visual perception. Al-Khidr scuttled the ship, ended a tyrant's future, and rebuilt a collapsing wall—each action seemed unjust or tragic at the exact moment of observation, but revealed profound divine protection, mercy, and wisdom once the broader unseen realities were unveiled.",
      
      scholarlyOpinions: "Imam Al-Ghazali (in Ihya Ulum al-Din) explains that true wisdom requires recognizing that the finite human intellect cannot grasp the infinite scope of Allah's cosmic tapestry. Imam Ibn al-Qayyim (in Shifa' al-'Alil) categorizes trials into three: retribution for the arrogant, spiritual purification for the remorseful, and elevation of eternal station for the pious (such as the intense hardships endured by the Prophets).",
      
      logicalReasoning: "1. Contrast is necessary for appreciation: without darkness, light is unrecognized; without thirst, quenching has no sweetness; without illness, the blessing of health is taken for granted.\n2. Genuine moral choice requires real consequences: if every time a human attempted malice or injustice, divine intervention physically paralyzed the act, free will would become meaningless theater.\n3. Worldly life is finite (e.g., 70-80 years), whereas the Hereafter is infinite. Any ratio of finite hardship compared to infinite reward mathematically approaches zero.",
      
      perspectives: "While the Mu'tazilah historically debated whether Allah was obligated to decree what was best for humans in this world (Al-Salah wal-Aslah), orthodox Sunni scholarship (Ash'ari and Maturidi) affirmed that Allah's actions proceed from absolute Wisdom and Sovereignty, transcending human utilitarian measuring sticks.",
      
      misunderstandings: "Common Myth: 'Suffering is always a punishment from Allah for being bad.' Islamic Reality: The Prophets—the most beloved beings to Allah—experienced the greatest hardships, persecutions, and physical losses. Hardship is an examination, not a definitive sign of divine displeasure.",
      
      conclusion: "Suffering in Islam is neither meaningless cruelty nor arbitrary tragedy. It is a crucible for spiritual elevation, an invitation to turn toward Allah in heartfelt humility, a means of sins expiation, and a prelude to boundless, unending justice and bliss in the Hereafter.",
      
      references: [
        "Quran: Surah Al-Mulk (67:1-2), Surah Al-Baqarah (2:155, 2:216), Surah Al-Kahf (18:65-82)",
        "Hadith: Sahih al-Bukhari (5641, 5642), Sahih Muslim (2573, 2999), Jami' at-Tirmidhi (2398)",
        "Classical Tafsir: Tafsir Ibn Kathir (Vol. 5, p. 182-194)",
        "Scholarly Works: Al-Ghazali, 'Ihya Ulum al-Din'; Ibn al-Qayyim, 'Shifa' al-'Alil fi Masa'il al-Qada' wal-Qadar'"
      ]
    },
    {
      id: "q-science-islam",
      title: "Is scientific inquiry and discovery compatible with Islamic theology?",
      titleBn: "বিজ্ঞানের অনুসন্ধান ও আবিষ্কার কি ইসলামি ধর্মতত্ত্বের সাথে সামঞ্জস্যপূর্ণ?",
      slug: "is-science-compatible-with-islam",
      category: "Science & Islam",
      categoryBn: "বিজ্ঞান ও ইসলাম",
      difficulty: "Intermediate",
      readTime: "7 min read",
      tags: ["Science", "Astronomy", "Reason", "Quran", "Golden Age"],
      featured: true,
      popular: true,
      views: 18920,
      shortPreview: "Islamic theology fundamentally encourages rigorous empirical observation of the cosmos as a primary form of worship and contemplation (Tafakkur). During the Islamic Golden Age, science and faith flourished in harmony.",
      
      directAnswer: "Yes, Islamic theology not only permits but explicitly commands scientific exploration, rational observation, and empirical inquiry into the natural universe. The Quran refers over 750 times to the natural order, urging humanity to reflect upon celestial bodies, biological development, geology, and atmospheric dynamics as signs (Ayat) of the Creator.",
      
      understandingQuestion: "Modern discourse often frames science and religion as inherently combative, projecting Western medieval conflicts (such as Galileo's trial) onto world history. In contrast, the Islamic world witnessed science as an act of divine contemplation, birthing the modern scientific method.",
      
      quranicEvidence: [
        {
          arabic: "إِنَّ فِي خَلْقِ السَّمَاوَاتِ وَالْأَرْضِ وَاخْتِلَافِ اللَّيْلِ وَالنَّهَارِ لَآيَاتٍ لِأُولِي الْأَلْبَابِ",
          translation: "Indeed, in the creation of the heavens and the earth and the alternation of the night and the day are signs for those of understanding.",
          reference: "Surah Ali 'Imran (3:190)"
        },
        {
          arabic: "سَنُرِيهِمْ آيَاتِنَا فِي الْآفَاقِ وَفِي أَنْفُسِهِمْ حَتَّىٰ يَتَبَيَّنَ لَهُمْ أَنَّهُ الْحَقُّ",
          translation: "We will show them Our signs in the horizons and within themselves until it becomes clear to them that it is the truth.",
          reference: "Surah Fussilat (41:53)"
        },
        {
          arabic: "أَوَلَمْ يَرَ الَّذِينَ كَفَرُوا أَنَّ السَّمَاوَاتِ وَالْأَرْضَ كَانَتَا رَتْقًا فَفَتَقْنَاهُمَا ۖ وَجَعَلْنَا مِنَ الْمَاءِ كُلَّ شَيْءٍ حَيٍّ",
          translation: "Have those who disbelieved not considered that the heavens and the earth were a joined entity, and then We separated them and made from water every living thing?",
          reference: "Surah Al-Anbiya (21:30)"
        }
      ],
      
      hadithEvidence: [
        {
          arabic: "مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ",
          english: "Whoever treads a path in search of knowledge, Allah will make easy for him the path to Paradise.",
          bangla: "যে ব্যক্তি জ্ঞান অর্জনের উদ্দেশ্যে কোনো পথ অবলম্বন করে, আল্লাহ তার জন্য জান্নাতের পথ সুগম করে দেন।",
          source: "Sahih Muslim 2699",
          grading: "Sahih"
        },
        {
          arabic: "أَنْتُمْ أَعْلَمُ بِأَمْرِ دُنْيَاكُمْ",
          english: "You have better knowledge in the technical matters of your world.",
          bangla: "তোমাদের পার্থিব বিষয়ে তোমরাই অধিক অবগত।",
          source: "Sahih Muslim 2363",
          grading: "Sahih"
        }
      ],
      
      tafsirExplanation: "Imam Fakhr al-Din al-Razi (in Mafatih al-Ghayb) combined profound theological mastery with astronomical and mathematical inquiry. He argued that deeper empirical understanding of cosmic mechanics expands the believer's reverence for the boundless genius of Allah.",
      
      scholarlyOpinions: "Historical luminaries who were devout Muslim scholars and pioneering scientists include Ibn al-Haytham (Alhazen, father of modern optics and empirical methodology), Al-Biruni (geodesy, earth circumference), Ibn Sina (medicine), and Al-Khwarizmi (algebra and algorithms). They operated on the principle that the 'Book of Nature' (Kitab al-Kawn) and the 'Book of Revelation' (Kitab al-Wahy) originate from the same Divine Author and cannot inherently contradict when correctly comprehended.",
      
      logicalReasoning: "The Quran is a book of spiritual guidance, moral law, and theological orientation—not an exhaustive textbook of secular biology or astrophysics. Scientific theories are continually revised as new empirical data emerges, whereas theological verities are immutable. Harmonization should respect this epistemological difference without force-fitting shifting scientific hypotheses onto timeless sacred scripture.",
      
      perspectives: "Scholars emphasize epistemic humility: when an apparent tension arises between a scientific consensus and a religious text, scholars investigate whether the scientific finding is proven beyond reasonable doubt or hypothetical, and whether the textual interpretation is categorical (Qat'i) or speculative (Zanni).",
      
      misunderstandings: "Misconception: 'Islam rejects evolution or the scientific method.' Reality: Muslim scholars pioneered empirical methodology centuries before the European Renaissance. With regards to human origins, Islamic orthodoxy affirms the miraculous divine creation of Prophet Adam as revealed in scripture, while maintaining neutrality regarding natural adaptations and biological variety across non-human animal and plant kingdoms.",
      
      conclusion: "Science and Islam are complementary partners in discovering truth. Science answers 'how' natural phenomena function; Islam illuminates 'why' existence exists and how human beings ought to live ethically within it.",
      
      references: [
        "Quran: Surah Ali 'Imran (3:190-191), Surah Al-Anbiya (21:30), Surah Fussilat (41:53)",
        "Hadith: Sahih Muslim (2699, 2363), Sunan Abi Dawood (3641)",
        "Scholarly Works: Fakhr al-Din al-Razi, 'Mafatih al-Ghayb'; George Saliba, 'Islamic Science and the Making of the European Renaissance'"
      ]
    },
    {
      id: "q-women-rights",
      title: "What are the genuine rights, status, and legal protections of women in Islam?",
      titleBn: "ইসলামে নারীদের প্রকৃত অধিকার, মর্যাদা ও আইনি সুরক্ষা কী?",
      slug: "womens-rights-and-status-in-islam",
      category: "Women in Islam",
      categoryBn: "ইসলামে নারী",
      difficulty: "Intermediate",
      readTime: "9 min read",
      tags: ["Women", "Human Rights", "Family", "Fiqh", "Society"],
      featured: true,
      popular: true,
      views: 22100,
      shortPreview: "Fourteen centuries ago, Islam revolutionized women's rights by establishing independent financial ownership, inheritance, legal consent in marriage, the right to divorce, and spiritual equality before God.",
      
      directAnswer: "Islam granted women complete spiritual equality, independent property and financial rights, the right to choose their spouse, inheritance shares, education, and legal personhood over 1,400 years ago—at a time when pre-Islamic Arabian society buried infant girls alive and European common law treated women as property under coverture.",
      
      understandingQuestion: "Contemporary discussions often confound cultural traditions in patriarchal societies with Islamic canonical jurisprudence. An accurate assessment requires examining the foundational Islamic texts rather than regional cultural abuses.",
      
      quranicEvidence: [
        {
          arabic: "مَنْ عَمِلَ صَالِحًا مِنْ ذَكَرٍ أَوْ أُنْثَىٰ وَهُوَ مُؤْمِنٌ فَلَنُحْيِيَنَّهُ حَيَاةً طَيِّبَةً ۖ وَلَنَجْزِيَنَّهُمْ أَجْرَهُمْ بِأَحْسَنِ مَا كَانُوا يَعْمَلُونَ",
          translation: "Whoever does righteousness, whether male or female, while he is a believer - We will surely cause him to live a good life, and We will surely give them their reward according to the best of what they used to do.",
          reference: "Surah An-Nahl (16:97)"
        },
        {
          arabic: "وَلَهُنَّ مِثْلُ الَّذِي عَلَيْهِنَّ بِالْمَعْرُوفِ",
          translation: "And women have rights similar to those over them in kindness.",
          reference: "Surah Al-Baqarah (2:228)"
        },
        {
          arabic: "يَا أَيُّهَا الَّذِينَ آمَنُوا لَا يَحِلُّ لَكُمْ أَنْ تَرِثُوا النِّسَاءَ كَرْهًا",
          translation: "O you who have believed, it is not lawful for you to inherit women by compulsion.",
          reference: "Surah An-Nisa (4:19)"
        }
      ],
      
      hadithEvidence: [
        {
          arabic: "اسْتَوْصُوا بِالنِّسَاءِ خَيْرًا",
          english: "Treat women kindly and with good counsel.",
          bangla: "তোমরা নারীদের সাথে উত্তম আচরণের উপদেশ গ্রহণ করো।",
          source: "Sahih al-Bukhari 5186, Sahih Muslim 1468",
          grading: "Sahih"
        },
        {
          arabic: "أَكْمَلُ الْمُؤْمِنِينَ إِيمَانًا أَحْسَنُهُمْ خُلُقًا، وَخِيَارُكُمْ خِيَارُكُمْ لِنِسَائِهِمْ",
          english: "The most complete believer in faith is the one with the best character, and the best among you are those who are best to their wives.",
          bangla: "ঈমানের দিক থেকে সবচেয়ে পূর্ণাঙ্গ মুমিন সে, যার চরিত্র সবচেয়ে সুন্দর; আর তোমাদের মধ্যে সর্বোত্তম তারা, যারা নিজেদের স্ত্রীদের কাছে সর্বোত্তম।",
          source: "Jami' at-Tirmidhi 1162",
          grading: "Hasan Sahih"
        },
        {
          arabic: "جَاءَ رَجُلٌ إِلَى رَسُولِ اللَّهِ صلى الله عليه وسلم فَقَالَ يَا رَسُولَ اللَّهِ مَنْ أَحَقُّ النَّاسِ بِحُسْنِ صَحَابَتِي قَالَ: أُمُّكَ. قَالَ ثُمَّ مَنْ قَالَ: أُمُّكَ. قَالَ ثُمَّ مَنْ قَالَ: أُمُّكَ. قَالَ ثُمَّ مَنْ قَالَ: أَبُوكَ",
          english: "A man asked the Messenger of Allah (PBUH): 'Who among people is most deserving of my fine companionship?' He replied: 'Your mother.' He asked: 'Then who?' He replied: 'Your mother.' He asked: 'Then who?' He replied: 'Your mother.' He asked: 'Then who?' He replied: 'Then your father.'",
          bangla: "এক ব্যক্তি রাসূলুল্লাহ (সা.)-এর নিকট এসে জিজ্ঞেস করল: 'আমার সর্বোত্তম সাহচর্য ও সদাচরণের সবচেয়ে বেশি হকদার কে?' তিনি বললেন: 'তোমার মা।' সে বলল: 'তারপর কে?' বললেন: 'তোমার মা।' সে বলল: 'তারপর কে?' বললেন: 'তোমার মা।' সে বলল: 'তারপর কে?' বললেন: 'তারপর তোমার পিতা।'",
          source: "Sahih al-Bukhari 5971, Sahih Muslim 2548",
          grading: "Sahih (Muttafaq 'Alayh)"
        }
      ],
      
      tafsirExplanation: "Imam Al-Qurtubi explains on Surah An-Nisa (4:19) that treating women with Ma'ruf (equity, gentleness, honor) is an absolute legal mandate. If a husband feels emotional aversion, he must remember that Allah places enduring goodness in patience and companionship.",
      
      scholarlyOpinions: "In classical Islamic jurisprudence: A Muslim woman retains her own family surname upon marriage; her wealth, income, and dowry (Mahr) belong exclusively to her with zero obligation to spend on family upkeep; the financial responsibility for housing, food, clothing, and medical care rests entirely upon the husband/father. Aisha bint Abi Bakr (RA) was one of the foremost jurists and teachers of the Sahaba, transmitting over 2,200 Hadiths.",
      
      logicalReasoning: "Equating 'equality' with identical functional roles ignores socio-biological dynamics. Islam balances complementary responsibilities: it relieves women from mandatory financial provision for the household while legally tasking men with financial maintenance (Qawwamun), while guaranteeing equal spiritual rewards and human dignity.",
      
      perspectives: "Regarding inheritance: While critics often cite that a daughter receives half of a son's share in certain specific estates, scholars note that in over 30 inheritance scenarios in Islamic Fiqh, a woman inherits equal to or more than a man, or inherits where a male relative receives nothing. Where a brother receives double, he is legally bound to financially provide for all his sisters and mother, whereas the sister's inheritance is strictly personal wealth with zero financial obligations.",
      
      misunderstandings: "Common Myth: 'Islam condones forced marriage and honor killings.' Reality: The Prophet (PBUH) explicitly decreed that a virgin or previously married woman cannot be married without her explicit consent (Sahih al-Bukhari 5136). Honor killings are severe criminal murder in Shariah and strictly condemned with the death penalty or severe Qisas.",
      
      conclusion: "Islam established women as autonomous human beings, noble mothers, cherished daughters, equal partners, and spiritual champions. Where injustice against women exists in Muslim societies, it stems from cultural ignorance in defiance of Islamic law.",
      
      references: [
        "Quran: Surah An-Nisa (4:19, 4:32), Surah An-Nahl (16:97), Surah Al-Baqarah (2:228)",
        "Hadith: Sahih al-Bukhari (5186, 5971, 5136), Sahih Muslim (1468, 2548), Jami' at-Tirmidhi (1162)",
        "Classical Tafsir: Al-Jami' li-Ahkam al-Quran by Al-Qurtubi",
        "Academic Literature: Dr. Jamal Badawi, 'Gender Equity in Islam'"
      ]
    },
    {
      id: "q-prayer-times",
      title: "Why do Muslims pray five times every single day (Salah)?",
      titleBn: "মুসলিমরা কেন প্রতিদিন পাঁচ ওয়াক্ত সালাত আদায় করে?",
      slug: "why-do-muslims-pray-five-times-a-day",
      category: "Daily Life & Fiqh",
      categoryBn: "দৈনন্দিন জীবন ও ফিকহ",
      difficulty: "Beginner",
      readTime: "6 min read",
      tags: ["Salah", "Prayer", "Spirituality", "Pillars", "Mental Health"],
      featured: true,
      popular: true,
      views: 11400,
      shortPreview: "Salah is the direct spiritual umbilical cord between the mortal soul and the Divine Creator. Spaced strategically throughout the circadian cycle, it pauses worldly stress, cleanses moral slip-ups, and anchors mindfulness.",
      
      directAnswer: "Muslims pray five times daily because it is a direct divine command instituted during the miraculous Ascension (Al-Isra wal-Mi'raj). Functioning as a periodic spiritual recharge, Salah breaks the relentless treadmill of worldly anxiety, realigns human priorities with eternity, unifies the global community in equal brotherhood, and cleanses sins like a river flowing at one's doorstep.",
      
      understandingQuestion: "Why five times? Why not once a week or solely when one feels spontaneous inspiration? Structured daily discipline recognizes that the human mind naturally drifts into heedlessness (Ghaflah) when left without consistent spiritual anchors.",
      
      quranicEvidence: [
        {
          arabic: "إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَوْقُوتًا",
          translation: "Indeed, prayer has been decreed upon the believers a decree of specified times.",
          reference: "Surah An-Nisa (4:103)"
        },
        {
          arabic: "وَأَقِمِ الصَّلَاةَ لِذِكْرِي",
          translation: "And establish prayer for My remembrance.",
          reference: "Surah Ta-Ha (20:14)"
        },
        {
          arabic: "إِنَّ الصَّلَاةَ تَنْهَىٰ عَنِ الْفَحْشَاءِ وَالْمُنْكَرِ ۗ وَلَذِكْرُ اللَّهِ أَكْبَرُ",
          translation: "Indeed, prayer prohibits immorality and wrongdoing, and the remembrance of Allah is greater.",
          reference: "Surah Al-Ankabut (29:45)"
        }
      ],
      
      hadithEvidence: [
        {
          arabic: "أَرَأَيْتُمْ لَوْ أَنَّ نَهَرًا بِبَابِ أَحَدِكُمْ يَغْتَسِلُ مِنْهُ كُلَّ يَوْمٍ خَمْسَ مَرَّاتٍ، هَلْ يَبْقَى مِنْ دَرَنِهِ شَيْءٌ؟ قَالُوا: لاَ يَبْقَى مِنْ دَرَنِهِ شَيْءٌ. قَالَ: فَذَلِكَ مَثَلُ الصَّلَوَاتِ الْخَمْسِ، يَمْحُو اللَّهُ بِهِنَّ الْخَطَايَا",
          english: "Consider if there were a river at the door of one of you in which he bathed five times a day, would any dirt remain upon him? They said: 'None of his dirt would remain.' The Prophet (PBUH) said: 'That is the example of the five daily prayers, through which Allah wipes away sins.'",
          bangla: "তোমাদের কারো বাড়ির সামনে যদি একটি নদী প্রবাহিত থাকে এবং সে তাতে দৈনিক পাঁচবার গোসল করে, তবে কি তার শরীরে কোনো ময়লা অবশিষ্ট থাকবে? সাহাবীগণ বললেন: 'না, কোনো ময়লা অবশিষ্ট থাকবে না।' নবীজী (সা.) বললেন: 'এ হলো পাঁচ ওয়াক্ত সালাতের দৃষ্টান্ত, যার মাধ্যমে আল্লাহ গুনাহসমূহ মুছে দেন।'",
          source: "Sahih al-Bukhari 528, Sahih Muslim 667",
          grading: "Sahih (Muttafaq 'Alayh)"
        }
      ],
      
      tafsirExplanation: "Ibn Kathir expounds on Surah Al-Ankabut (29:45) that authentic Salah produces a profound restraining effect on human psychology. When a person bows and places their forehead on the dust in sincere prostration (Sujud), ego dissolves, and subconscious moral accountability takes root.",
      
      scholarlyOpinions: "Scholars emphasize that the five prayer windows map seamlessly to human circadian physiology: Fajr before dawn transitions waking consciousness with remembrance; Dhuhr breaks the midday rat-race; Asr revitalizes waning afternoon energy; Maghrib sanctifies the close of the workday; Isha closes the waking hours in peaceful submission before sleep.",
      
      logicalReasoning: "Physical health requires regular meals rather than eating once a month; dental hygiene requires brushing twice daily. Similarly, human spiritual integrity requires recurring psychological cleansings. Prayer transforms life into a rhythmic rhythm where work serves the soul, rather than the soul being consumed by work.",
      
      perspectives: "All four Sunni schools of jurisprudence (Hanafi, Maliki, Shafi'i, Hanbali) agree unanimously that Salah is the supreme pillar of faith after the Shahadah, the first act to be audited on the Day of Resurrection.",
      
      misunderstandings: "Misconception: 'Prayer is just ritualistic repetitive gymnastic motions.' Reality: The outward physical postures (standing, bowing, prostrating) are vessels for internal presence of heart (Khushu'). Without contemplation of the words, prayer lacks its vibrant transformative essence.",
      
      conclusion: "Salah is Allah's greatest gift of daily sanctuary: an open, cost-free direct audience with the Creator of the Universe five times a day, bringing calmness to hearts in a chaotic world.",
      
      references: [
        "Quran: Surah An-Nisa (4:103), Surah Ta-Ha (20:14), Surah Al-Ankabut (29:45)",
        "Hadith: Sahih al-Bukhari (528), Sahih Muslim (667, 162)",
        "Tafsir: Tafsir al-Qurtubi and Tafsir Ibn Kathir on Surah 29:45"
      ]
    },
    {
      id: "q-compulsion-religion",
      title: "Does Islam allow forced conversion or compulsion in faith?",
      titleBn: "ইসলাম কি ধর্মে জোর-জবরদস্তি বা বলপ্রয়োগ সমর্থন করে?",
      slug: "does-islam-allow-forced-conversion",
      category: "Islamic Beliefs (Aqidah)",
      categoryBn: "ইসলামি আকীদা",
      difficulty: "Intermediate",
      readTime: "7 min read",
      tags: ["Freedom", "Tolerance", "Jihad", "Quran", "History"],
      featured: false,
      popular: true,
      views: 9800,
      shortPreview: "The Quran establishes an unequivocal legal and theological prohibition: 'There is no compulsion in religion.' Faith cannot be coerced, because coerced belief is hypocrisy (Nifaq), which Islam completely rejects.",
      
      directAnswer: "No. Islam strictly and categorically forbids forcing anyone to accept Islam. Under Islamic theological jurisprudence, forced conversion is legally invalid, null, and sinful. Genuine belief (Iman) fundamentally requires willing conviction of the mind and heart (Tasdiq bil-Qalb).",
      
      understandingQuestion: "Critics frequently ask whether historic Islamic empires forced conquered populations to convert to Islam by the sword. Historical reality and theological canons prove the exact opposite.",
      
      quranicEvidence: [
        {
          arabic: "لَا إِكْرَاهَ فِي الدِّينِ ۖ قَدْ تَبَيَّنَ الرُّشْدُ مِنَ الْغَيِّ",
          translation: "There shall be no compulsion in [acceptance of] the religion. The right course has become clear from the wrong.",
          reference: "Surah Al-Baqarah (2:256)"
        },
        {
          arabic: "وَلَوْ شَاءَ رَبُّكَ لَآمَنَ مَنْ فِي الْأَرْضِ كُلُّهُمْ جَمِيعًا ۚ أَفَأَنْتَ تُكْرِهُ النَّاسَ حَتَّىٰ يَكُونُوا مُؤْمِنِينَ",
          translation: "And had your Lord willed, those on earth would have believed - all of them entirely. Then, [O Muhammad], would you compel the people in order that they become believers?",
          reference: "Surah Yunus (10:99)"
        },
        {
          arabic: "وَقُلِ الْحَقُّ مِنْ رَبِّكُمْ ۖ فَمَنْ شَاءَ فَلْيُؤْمِنْ وَمَنْ شَاءَ فَلْيَكْفُرْ",
          translation: "And say, 'The truth is from your Lord, so whoever wills - let him believe; and whoever wills - let him disbelieve.'",
          reference: "Surah Al-Kahf (18:29)"
        }
      ],
      
      hadithEvidence: [
        {
          arabic: "مَنْ قَتَلَ مُعَاهَدًا لَمْ يَرِحْ رَائِحَةَ الْجَنَّةِ، وَإِنَّ رِيحَهَا تُوجَدُ مِنْ مَسِيرَةِ أَرْبَعِينَ عَامًا",
          english: "Whoever kills a non-Muslim protected by a covenant (Mu'ahad) will not smell the fragrance of Paradise, even though its fragrance can be smelled from forty years away.",
          bangla: "যে ব্যক্তি কোনো অমুসলিম নাগরিক বা চুক্তিবদ্ধ ব্যক্তিকে অন্যায়ভাবে হত্যা করবে, সে জান্নাতের সুঘ্রাণও পাবে না; অথচ জান্নাতের সুবাস চল্লিশ বছরের দূরত্ব থেকেও পাওয়া যায়।",
          source: "Sahih al-Bukhari 3166",
          grading: "Sahih"
        }
      ],
      
      tafsirExplanation: "Imam Ibn Kathir records in his Tafsir on Surah Al-Baqarah (2:256) that this verse was revealed when an Ansari father in Medina tried to compel his sons—who had previously converted to Christianity—to accept Islam. The Prophet (PBUH) prohibited the father from forcing them, declaring that conviction cannot be coerced.",
      
      scholarlyOpinions: "Renowned British historian Sir Thomas Arnold in 'The Preaching of Islam' noted that had Muslim rulers adopted a policy of forced conversion, Christianity in the Levant, Egypt, and Spain would have been wiped out overnight, as happened to Muslims during the Spanish Inquisition. Instead, ancient Christian communities (Copts, Maronites, Syrian Orthodox) and Jewish communities flourished for centuries under Islamic rule.",
      
      logicalReasoning: "From a theological standpoint, forced conversion defeats the fundamental purpose of creation: moral accountability under free will. If someone proclaims the Shahadah under threat of a sword, they are simply an involuntary actor whose faith is null and void in the sight of God.",
      
      perspectives: "Islamic law created the legal status of Ahl al-Dhimmah (Protected Citizens) guaranteeing non-Muslim minorities complete religious autonomy, protection of synagogues and churches, and internal family law jurisdiction.",
      
      misunderstandings: "Misconception: 'Islam spread by the sword.' Reality: Indonesia, Malaysia, and Bangladesh—the largest Muslim-majority populations on Earth—never saw an invading Arab army; Islam arrived there through maritime traders, Sufi spiritual teachers, and ethical merchants.",
      
      conclusion: "Freedom of conscience is an irrevocable pillar of Quranic doctrine. Conviction must be cultivated through evidence, intellectual dialogue, and moral example—never coercion.",
      
      references: [
        "Quran: Surah Al-Baqarah (2:256), Surah Yunus (10:99), Surah Al-Kahf (18:29)",
        "Hadith: Sahih al-Bukhari (3166)",
        "Historical Literature: Sir Thomas Arnold, 'The Preaching of Islam'; Hugh Kennedy, 'The Great Arab Conquests'"
      ]
    },
    {
      id: "q-meaning-jihad",
      title: "What is the true definition, jurisprudence, and scope of Jihad in Islam?",
      titleBn: "ইসলামে জিহাদের প্রকৃত সংজ্ঞা, আইন ও পরিধি কী?",
      slug: "true-meaning-and-rules-of-jihad",
      category: "Islamic Beliefs (Aqidah)",
      categoryBn: "ইসলামি আকীদা",
      difficulty: "Advanced",
      readTime: "8 min read",
      tags: ["Jihad", "Warfare", "Peace", "Ethics", "Fiqh"],
      featured: true,
      popular: false,
      views: 13500,
      shortPreview: "Linguistically meaning 'striving with utmost effort', Jihad encompasses internal spiritual discipline, intellectual defense of truth, social justice, and strictly regulated defensive warfare that strictly forbids terrorism.",
      
      directAnswer: "Jihad is an Arabic term originating from the root J-H-D, meaning 'to exert one's utmost effort or struggle'. It is not synonymous with 'holy war' (an orientalist term from the Crusades). While it includes legitimate defensive warfare conducted by a legitimate state against external tyranny, its primary and continuous dimension is the internal struggle against ego and temptation (Jihad al-Nafs). Terrorism and civilian slaughter violate every canon of Islamic law.",
      
      understandingQuestion: "Terrorist groups and anti-Muslim polemicists ironically use the same skewed, out-of-context misinterpretations to justify violence. Shariah jurisprudence contains strict, codified rules of engagement that outlaw harm to non-combatants.",
      
      quranicEvidence: [
        {
          arabic: "وَقَاتِلُوا فِي سَبِيلِ اللَّهِ الَّذِينَ يُقَاتِلُونَكُمْ وَلَا تَعْتَدُوا ۚ إِنَّ اللَّهَ لَا يُحِبُّ الْمُعْتَدِينَ",
          translation: "Fight in the way of Allah those who fight you but do not transgress. Indeed. Allah does not like transgressors.",
          reference: "Surah Al-Baqarah (2:190)"
        },
        {
          arabic: "مَنْ قَتَلَ نَفْسًا بِغَيْرِ نَفْسٍ أَوْ فَسَادٍ فِي الْأَرْضِ فَكَأَنَّمَا قَتَلَ النَّاسَ جَمِيعًا وَمَنْ أَحْيَاهَا فَكَأَنَّمَا أَحْيَا النَّاسَ جَمِيعًا",
          translation: "Whoever kills a soul unless for a soul or for corruption [done] in the land - it is as if he had slain mankind entirely. And whoever saves one - it is as if he had saved mankind entirely.",
          reference: "Surah Al-Ma'idah (5:32)"
        },
        {
          arabic: "وَإِنْ جَنَحُوا لِلسَّلْمِ فَاجْنَحْ لَهَا وَتَوَكَّلْ عَلَى اللَّهِ",
          translation: "And if they incline to peace, then incline to it [also] and rely upon Allah.",
          reference: "Surah Al-Anfal (8:61)"
        }
      ],
      
      hadithEvidence: [
        {
          arabic: "الْمُجَاهِدُ مَنْ جَاهَدَ نَفْسَهُ فِي طَاعَةِ اللَّهِ",
          english: "The true Mujahid (one who strives in Jihad) is the one who strives against his own desires in obedience to Allah.",
          bangla: "প্রকৃত মুজাহিদ সে-ই, যে আল্লাহর আনুগত্যের জন্য নিজের নফস বা প্রবৃত্তি বিরুদ্ধে সংগ্রাম করে।",
          source: "Jami' at-Tirmidhi 1621, Musnad Ahmad 23967",
          grading: "Sahih"
        },
        {
          arabic: "عَنْ أَبِي بَكْرٍ الصِّدِّيقِ: لَا تَقْتُلُوا صَبِيًّا، وَلَا امْرَأَةً، وَلَا شَيْخًا كَبِيرًا، وَلَا تَعْقِرُوا نَخْلًا، وَلَا تُحَرِّقُوهُ، وَلَا تَقْطَعُوا شَجَرَةً مُثْمِرَةً...",
          english: "Abu Bakr as-Siddiq commanded the Muslim army: 'Do not kill a child, nor a woman, nor an aged person. Do not fell fruit-bearing trees, do not burn palms, do not slaughter sheep or cattle except for sustenance, and you will find monks in their cloisters—leave them alone.'",
          bangla: "খলিফা আবু বকর (রা.) সেনাবাহিনীকে নির্দেশ দেন: 'কোনো শিশু, নারী কিংবা বৃদ্ধকে হত্যা করবে না। কোনো ফলবতী গাছ কাটবে না, শস্যক্ষেত ধ্বংস করবে না, কোনো গবাদিপশু অন্যায়ভাবে জবাই করবে না; আর তোমরা গির্জায় অবস্থানরত পাদ্রি ও প্রার্থনারত মানুষদের তাদের উপাসনায় বিঘ্ন না ঘটিয়ে ছেড়ে দেবে।'",
          source: "Muwatta Imam Malik 982",
          grading: "Sahih"
        }
      ],
      
      tafsirExplanation: "Imam Al-Tabari and Ibn Kathir clarify that verses permitting warfare were revealed in Medina only after 13 consecutive years of horrific torture, boycotts, and persecution against the Muslim minority in Mecca. Permission to fight was granted strictly to preserve religious liberty and halt violent oppression (Surah Al-Hajj 22:39-40).",
      
      scholarlyOpinions: "Classical jurists codified that military Jihad: 1. Can only be declared by legitimate governmental authority, never private rogue vigilante cells. 2. Non-combatants (women, children, monks, medics, farmers, emissaries) are unconditionally protected. 3. Scorched-earth destruction and biological poisoning are illegal. 4. If the adversary seeks peace, warfare must instantly cease.",
      
      logicalReasoning: "Every civilized constitutional democracy maintains a military to defend citizens against invasion. Islamic jurisprudence recognized this necessity over 1,400 years ago, creating the world's first codified humanitarian international law and Geneva-style military conventions.",
      
      perspectives: "Contemporary scholars (such as Shaykh Muhammad Abu Zahrah and Wahbah al-Zuhayli) demonstrate that the default relationship in Islamic international jurisprudence between Muslims and others is peaceful coexistence (Al-Silm), while armed struggle is exceptional and strictly defensive (Daf' al-Udwan).",
      
      misunderstandings: "Common Myth: 'Jihad authorizes suicide bombings.' Reality: Suicide (Intihar) is an express, major sin in Islam (Surah An-Nisa 4:29), and deliberate slaughter of innocent civilians is considered 'Hirabah' (terrorism/treason), carrying the harshest capital penalty under Shariah.",
      
      conclusion: "Jihad is a multifaceted quest for excellence: mastering one's lower desires, speaking truth to tyranny, building a just society, and defending the innocent with strict moral honor.",
      
      references: [
        "Quran: Surah Al-Baqarah (2:190), Surah Al-Ma'idah (5:32), Surah Al-Hajj (22:39-40)",
        "Hadith: Jami' at-Tirmidhi (1621), Muwatta Imam Malik (982), Sahih Muslim (1731)",
        "Scholarly Works: Wahbah al-Zuhayli, 'Athar al-Harb fil-Fiqh al-Islami'; Muhammad Abu Zahrah, 'Al-'Alaqat al-Dawliyyah fil-Islam'"
      ]
    }
  ],

  // Hadith Database Across the 6 Canonical Collections (Kutub al-Sittah)
  hadiths: [
    {
      id: "hadith-bukhari-1",
      collection: "Sahih al-Bukhari",
      collectionBn: "সহীহ আল-বুখারী",
      collectionKey: "bukhari",
      number: 1,
      chapter: "Revelation / Sincerity",
      arabic: "إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى، فَمَنْ كَانَتْ هِجْرَتُهُ إِلَى دُنْيَا يُصِيبُهَا أَوْ إِلَى امْرَأَةٍ يَنْكِحُهَا فَهِجْرَتُهُ إِلَى مَا هَاجَرَ إِلَيْهِ",
      english: "Actions are but by intention and every man shall have only that which he intended. Thus he whose migration was for the world or to marry a woman, his migration was for what he migrated for.",
      bangla: "প্রত্যেক কাজের ফলাফল নিয়তের উপর নির্ভরশীল। মানুষ যা নিয়ত করে তা-ই পায়। যার হিজরত পার্থিব লাভের উদ্দেশ্যে অথবা কোনো নারীকে বিবাহের উদ্দেশ্যে হয়েছে, তার হিজরত সেই উদ্দেশ্যেই পরিগণিত হবে।",
      grade: "Sahih",
      gradeBn: "সহীহ",
      narrator: "Umar ibn al-Khattab (RA)",
      commentary: "Regarded by scholars like Imam ash-Shafi'i as encompassing one-third of all Islamic knowledge, because every inward and outward deed depends entirely on pure intention (Ikhlas)."
    },
    {
      id: "hadith-muslim-2564",
      collection: "Sahih Muslim",
      collectionBn: "সহীহ মুসলিম",
      collectionKey: "muslim",
      number: 2564,
      chapter: "Virtue, Good Manners & Kinship",
      arabic: "إِنَّ اللَّهَ لاَ يَنْظُرُ إِلَى صُوَرِكُمْ وَأَمْوَالِكُمْ وَلَكِنْ يَنْظُرُ إِلَى قُلُوبِكُمْ وَأَعْمَالِكُمْ",
      english: "Verily, Allah does not look at your outward appearances or your wealth, but rather He looks at your hearts and your deeds.",
      bangla: "নিশ্চয়ই আল্লাহ তোমাদের বাহ্যিক চেহারা বা ধন-সম্পদের দিকে তাকান না; বরং তিনি তাকান তোমাদের অন্তর এবং কর্মের দিকে।",
      grade: "Sahih",
      gradeBn: "সহীহ",
      narrator: "Abu Hurairah (RA)",
      commentary: "Dismantles racism, elitism, and superficial vanity. True nobility in the presence of God is strictly rooted in sincerity and righteous conduct."
    },
    {
      id: "hadith-bukhari-13",
      collection: "Sahih al-Bukhari",
      collectionBn: "সহীহ আল-বুখারী",
      collectionKey: "bukhari",
      number: 13,
      chapter: "Belief (Iman)",
      arabic: "لاَ يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ",
      english: "None of you truly believes until he loves for his brother what he loves for himself.",
      bangla: "তোমাদের কেউ প্রকৃত মুমিন হতে পারবে না, যতক্ষণ না সে তার ভাইয়ের জন্য তা-ই পছন্দ করে যা সে নিজের জন্য পছন্দ করে।",
      grade: "Sahih",
      gradeBn: "সহীহ",
      narrator: "Anas ibn Malik (RA)",
      commentary: "The golden rule of universal empathy. Spiritual maturity necessitates rejoicing in others' success and wishing the best for all human beings."
    },
    {
      id: "hadith-abudawood-4941",
      collection: "Sunan Abu Dawood",
      collectionBn: "সুনান আবু দাউদ",
      collectionKey: "abudawood",
      number: 4941,
      chapter: "Manners (Adab)",
      arabic: "الرَّاحِمُونَ يَرْحَمُهُمُ الرَّحْمَنُ، ارْحَمُوا مَنْ فِي الأَرْضِ يَرْحَمْكُمْ مَنْ فِي السَّمَاءِ",
      english: "The merciful will be shown mercy by the Most Merciful. Show mercy to those who are on earth, and He who is in the heavens will show mercy to you.",
      bangla: "দয়াশীলদের প্রতি পরম করুণাময় আল্লাহ দয়া প্রদর্শন করেন। তোমরা জমিনে যারা আছে তাদের প্রতি দয়া করো, তাহলে যিনি আকাশে রয়েছেন তিনি তোমাদের প্রতি দয়া করবেন।",
      grade: "Sahih",
      gradeBn: "সহীহ",
      narrator: "Abdullah ibn Amr (RA)",
      commentary: "Known classically as 'Hadith al-Musalsal bil-Awwaliyyah', often the very first Hadith scholars teach their students to instill compassion before theological debate."
    },
    {
      id: "hadith-tirmidhi-2516",
      collection: "Jami' at-Tirmidhi",
      collectionBn: "জামে আত-তিরমিযী",
      collectionKey: "tirmidhi",
      number: 2516,
      chapter: "Description of the Day of Judgment",
      arabic: "احْفَظِ اللَّهَ يَحْفَظْكَ، احْفَظِ اللَّهَ تَجِدْهُ تُجَاهَكَ، إِذَا سَأَلْتَ فَاسْأَلِ اللَّهَ، وَإِذَا اسْتَعَنْتَ فَاسْتَعِنْ بِاللَّهِ",
      english: "Be mindful of Allah and He will protect you. Be mindful of Allah and you will find Him before you. If you ask, ask from Allah; and if you seek help, seek help from Allah.",
      bangla: "আল্লাহর বিধানসমূহ সংরক্ষণ করো, আল্লাহ তোমাকে রক্ষা করবেন। আল্লাহকে স্মরণ রাখো, তুমি তাঁকে তোমার সম্মুখে পাবে। যখন কিছু চাইবে, কেবল আল্লাহর কাছেই চাও; আর যখন সাহায্য প্রার্থনা করবে, কেবল আল্লাহর কাছেই প্রার্থনা করো।",
      grade: "Sahih",
      gradeBn: "সহীহ",
      narrator: "Ibn Abbas (RA)",
      commentary: "Foundational lesson delivered by the Prophet (PBUH) to the young Ibn Abbas, teaching unwavering psychological resilience and reliance on Allah alone."
    },
    {
      id: "hadith-nasai-3104",
      collection: "Sunan an-Nasa'i",
      collectionBn: "সুনান আন-নাসায়ী",
      collectionKey: "nasai",
      number: 3104,
      chapter: "Jihad / Mother's Honor",
      arabic: "جَاءَ رَجُلٌ إِلَى النَّبِيِّ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ يُرِيدُ الْجِهَادَ فَقَالَ: أَحَيَّةٌ أُمُّكَ؟ قَالَ: نَعَمْ. قَالَ: فَالْزَمْهَا فَإِنَّ الْجَنَّةَ تَحْتَ رِجْلَيْهَا",
      english: "A man came to the Prophet (PBUH) seeking to participate in expedition. The Prophet asked: 'Is your mother alive?' He said: 'Yes.' The Prophet said: 'Then stay with her and serve her, for Paradise is at her feet.'",
      bangla: "এক ব্যক্তি নবীজী (সা.)-এর দরবারে এসে জিহাদে অংশগ্রহণের আগ্রহ প্রকাশ করল। নবীজী জিজ্ঞেস করলেন: 'তোমার মা কি বেঁচে আছেন?' সে বলল: 'হ্যাঁ।' তিনি বললেন: 'তবে তাঁর সেবায় লেগে থাকো, কেননা জান্নাত তাঁর পদতলে রয়েছে।'",
      grade: "Sahih",
      gradeBn: "সহীহ",
      narrator: "Mu'awiyah ibn Jahima (RA)",
      commentary: "Explicitly prioritizes filial care and serving aging parents over non-defensive voluntary missions."
    },
    {
      id: "hadith-ibnmajah-224",
      collection: "Sunan Ibn Majah",
      collectionBn: "সুনান ইবনে মাজাহ",
      collectionKey: "ibnmajah",
      number: 224,
      chapter: "The Book of the Sunnah",
      arabic: "طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَى كُلِّ مُسْلِمٍ",
      english: "Seeking knowledge is an obligation upon every Muslim (male and female).",
      bangla: "জ্ঞান অন্বেষণ করা প্রত্যেক মুসলিমের (নর-নারী) ওপর অবশ্য পালনীয় কর্তব্য (ফরজ)।",
      grade: "Hasan / Sahih",
      gradeBn: "হাসান / সহীহ",
      narrator: "Anas ibn Malik (RA)",
      commentary: "Universal mandate for intellectual education. Knowledge of spiritual duties, moral principles, and beneficial sciences is mandatory regardless of gender."
    }
  ],

  // Islamic Myth vs Reality Section
  myths: [
    {
      id: "myth-force-faith",
      myth: "Islam was spread exclusively by the sword and forces non-Muslims to convert.",
      mythBn: "ইসলাম তরবারির জোরে প্রসারিত হয়েছে এবং অমুসলিমদের জোরপূর্বক ধর্মান্তরিত করে।",
      reality: "The Quran strictly prohibits religious compulsion: 'There is no compulsion in religion' (2:256). Forced conversion is legally null and void in Shariah.",
      realityBn: "কুরআনে ধর্মে বলপ্রয়োগ কঠোরভাবে নিষিদ্ধ: 'দ্বীনের ব্যাপারে কোনো জবরদস্তি নেই' (২:২৫৬)। ইসলামি শরীয়াহে জোরপূর্বক ধর্মান্তর সম্পূর্ণরূপে অবৈধ ও বাতিল।",
      historyContext: "Indonesia, Malaysia, Bangladesh, and West Africa—holding the world's largest Muslim populations—embraced Islam through trade and peaceful scholars. Historical Christian communities thrived under Islamic rule for over a millennium.",
      sources: ["Quran 2:256, 10:99", "Sir Thomas Arnold, 'The Preaching of Islam'"]
    },
    {
      id: "myth-women-oppression",
      myth: "Islam treats women as second-class citizens with inferior rights.",
      mythBn: "ইসলাম নারীদের দ্বিতীয় শ্রেণীর নাগরিক মনে করে এবং তাদের অধিকার ক্ষুণ্ণ করে।",
      reality: "1,400 years ago, Islam established independent financial property rights, choice in marriage, inheritance, education, and spiritual equality before God.",
      realityBn: "১৪০০ বছর পূর্বে ইসলাম নারীদের নিজস্ব সম্পত্তির মালিকানা, স্বাধীন সম্মতি, উত্তরাধিকার, শিক্ষা এবং আল্লাহর দরবারে সম মর্যাদার অধিকার দান করেছে।",
      historyContext: "While 19th-century European women lost their property rights upon marriage under coverture, Muslim women have maintained independent wealth and identities since the 7th century.",
      sources: ["Quran 16:97, 4:19, 2:228", "Sahih al-Bukhari 5186, 5971"]
    },
    {
      id: "myth-anti-science",
      myth: "Islam is anti-intellectual, dogmatic, and hostile to scientific inquiry.",
      mythBn: "ইসলাম বিজ্ঞান ও মুক্তবুদ্ধির বিরোধী এবং যুক্তি ও আবিষ্কারকে নিরুৎসাহিত করে।",
      reality: "The Quran contains over 750 verses directing humans to observe, reflect, and empirically investigate nature. Observation is a profound form of worship.",
      realityBn: "কুরআনের ৭৫০টিরও বেশি আয়াতে মহাবিশ্ব ও প্রকৃতির নিয়ম নিয়ে গভীর চিন্তা, গবেষণা ও পর্যবেক্ষণ করার নির্দেশ দেওয়া হয়েছে।",
      historyContext: "Muslim scholars created modern optics (Ibn al-Haytham), algebra (Al-Khwarizmi), experimental pharmacology (Ibn Sina), and spherical astronomy during Europe's Dark Ages.",
      sources: ["Quran 3:190-191, 21:30", "George Saliba, 'Islamic Science & European Renaissance'"]
    },
    {
      id: "myth-jihad-terrorism",
      myth: "Jihad is synonymous with terrorism and random violence against non-believers.",
      mythBn: "জিহাদ মানেই সন্ত্রাসবাদ এবং নিরীহ অমুসলিমদের ওপর নির্বিচার সহিংসতা।",
      reality: "Jihad means moral and physical exertion. Armed combat is permitted solely for self-defense and halting oppression under strict humanitarian rules.",
      realityBn: "জিহাদ অর্থ সত্য ও ন্যায়ের জন্য আত্মিক ও নৈতিক সাধনা। যুদ্ধ কেবল আত্মরক্ষা ও জুলুম প্রতিরোধের জন্য কঠোর মানবিক নিয়মাবলি মেনে অনুমোদিত।",
      historyContext: "Abu Bakr (RA) outlawed harm to women, children, monks, animals, and trees during military defense. Terrorism is classified as 'Hirabah' (capital crime) in Shariah.",
      sources: ["Quran 2:190, 5:32", "Muwatta Imam Malik 982", "Sahih Muslim 1731"]
    },
    {
      id: "myth-moon-god",
      myth: "Muslims worship a pagan moon god or the Kaaba.",
      mythBn: "মুসলিমরা কোনো চন্দ্র-দেবতা বা কাবার উপাসনা করে।",
      reality: "Muslims worship the solitary, uncreated Creator of the Universe (Allah), the God of Abraham, Moses, and Jesus. The Kaaba is solely a unified direction of prayer (Qiblah).",
      realityBn: "মুসলিমরা এক ও অদ্বিতীয় স্রষ্টার ইবাদত করেন, যিনি ইব্রাহিম, মূসা ও ঈসা (আ.)-এর উপাস্য। কাবা কেবল ঐক্যবদ্ধ নামাজের দিকনির্দেশক (কিবলা), কোনো উপাস্য নয়।",
      historyContext: "Arabic-speaking Christians and Jews also use the word 'Allah' for God. The Quran states explicitly: 'Do not prostrate to the sun or to the moon, but prostrate to Allah, who created them' (41:37).",
      sources: ["Quran 41:37, 112:1-4"]
    },
    {
      id: "myth-fatwa-law",
      myth: "Every Fatwa is an irrevocable death sentence or mandatory legal decree.",
      mythBn: "প্রতিটি ফতোয়া মানেই কোনো মৃত্যুদণ্ড বা অলঙ্ঘনীয় সরকারি আইন।",
      reality: "A Fatwa is simply a qualified scholar's non-binding jurisprudential advisory opinion answering a specific question on Islamic ethical guidance.",
      realityBn: "ফতোয়া হলো একজন যোগ্য আলেমের শরীয়াহ ভিত্তিক পরামর্শমূলক মতামত; এটি কোনো অননুমোদিত শাস্তি বা আইনি পরোয়ানা নয়।",
      historyContext: "Throughout Islamic history, Muftis provided advisory guidance for individuals, while judicial courts (Qada) handled civil and criminal enforcement.",
      sources: ["Ibn al-Qayyim, 'I'lam al-Muwaqqi'in'"]
    },
    {
      id: "myth-sect-hatred",
      myth: "All differences between Islamic schools of thought (Madhabs) represent bitter sectarian hostility.",
      mythBn: "মাযহাবসমূহের মধ্যকার মতপার্থক্য তীব্র সাম্প্রদায়িক বিদ্বেষের প্রতিফলন।",
      reality: "The four Sunni schools (Hanafi, Maliki, Shafi'i, Hanbali) share 100% agreement on core creed (Aqidah) and view subsidiary legal differences as mercy and intellectual richness.",
      realityBn: "চারটি প্রধান সুন্নি মাযহাব মৌলিক বিশ্বাস ও স্তম্ভের ক্ষেত্রে সম্পূর্ণ একমত; শাখা-প্রশাখাগত বিষয়ে মতভিন্নতাকে গবেষণার স্বাধীনতা ও রহমত হিসেবে গণ্য করা হয়।",
      historyContext: "Imam Malik refused Caliph Al-Mansur's offer to force his book 'Al-Muwatta' upon the entire Muslim world, insisting that differing legal opinions of the Companions must be respected.",
      sources: ["Ibn Taymiyyah, 'Raf' al-Malam 'an al-A'immat al-A'lam'"]
    }
  ],

  // Islamic History Timeline
  history: [
    {
      id: "hist-1",
      year: "570 CE",
      era: "Prophetic Era",
      eraBn: "নবুওয়াতী যুগ",
      title: "Birth of Prophet Muhammad (PBUH)",
      titleBn: "মহানবী মুহাম্মদ (সা.)-এর জন্ম",
      desc: "Born in Mecca during the Year of the Elephant in the noble Banu Hashim clan of Quraysh.",
      importance: "Marked the dawn of moral transformation across Arabia and the wider world."
    },
    {
      id: "hist-2",
      year: "610 CE",
      era: "Prophetic Era",
      eraBn: "নবুওয়াতী যুগ",
      title: "First Quranic Revelation in Cave Hira",
      titleBn: "হেরা গুহায় প্রথম ওহী অবতরণ",
      desc: "Archangel Jibril appeared with the first five verses of Surah Al-'Alaq: 'Read in the name of your Lord who created.'",
      importance: "Began 23 years of divine revelation and the restoration of monotheism."
    },
    {
      id: "hist-3",
      year: "622 CE",
      era: "Prophetic Era",
      eraBn: "নবুওয়াতী যুগ",
      title: "The Hijrah to Medina & Constitution of Medina",
      titleBn: "মদিনায় হিজরত ও মদিনা সনদ",
      desc: "Emigration to Yathrib (Medina); establishment of the first multi-religious constitutional state protecting Jewish and Muslim citizens.",
      importance: "The inception of the Islamic Hijri calendar and civil society."
    },
    {
      id: "hist-4",
      year: "630 CE",
      era: "Prophetic Era",
      eraBn: "নবুওয়াতী যুগ",
      title: "The Bloodless Conquest of Mecca",
      titleBn: "মক্কা বিজয় (রক্তপাতহীন)",
      desc: "Quraysh surrendered without a battle. The Prophet (PBUH) granted universal amnesty to his former persecutors: 'Go, for you are free.'",
      importance: "Cleansing of the Kaaba from 360 idols and a legendary example of forgiveness."
    },
    {
      id: "hist-5",
      year: "632 CE",
      era: "Prophetic Era",
      eraBn: "নবুওয়াতী যুগ",
      title: "Farewell Pilgrimage & Passing of the Prophet",
      titleBn: "বিদায় হজ ও মহানবী (সা.)-এর ওফাত",
      desc: "Delivered the historic Farewell Sermon abolishing racial superiority and usury, protecting women's rights.",
      importance: "Completion of the Quranic revelation: 'Today I have perfected your religion for you' (5:3)."
    },
    {
      id: "hist-6",
      year: "632–661 CE",
      era: "Rashidun Caliphate",
      eraBn: "খোলাফায়ে রাশেদীন",
      title: "The Four Rightly Guided Caliphs",
      titleBn: "চার খলিফার যুগ",
      desc: "Abu Bakr compiled the Quran into a single codex; Umar established administrative welfare, pensions, and justice; Uthman standardized the Quranic mushaf; Ali upheld judicial equality.",
      importance: "Golden model of righteous governance and welfare statecraft."
    },
    {
      id: "hist-7",
      year: "661–750 CE",
      era: "Umayyad Caliphate",
      eraBn: "উমাইয়া খেলাফত",
      title: "Expansion to Spain and Central Asia",
      titleBn: "স্পেন ও মধ্য এশিয়ায় সাম্রাজ্যের বিস্তার",
      desc: "Capital moved to Damascus; construction of the Dome of the Rock in Jerusalem and the Great Mosque of Damascus; entry into Andalusia (Spain) under Tariq ibn Ziyad (711 CE).",
      importance: "Rapid expansion across three continents and introduction of standardized Arabic coinage."
    },
    {
      id: "hist-8",
      year: "750–1258 CE",
      era: "Islamic Golden Age",
      eraBn: "ইসলামি স্বর্ণযুগ",
      title: "The Abbasid Era & House of Wisdom (Bayt al-Hikmah)",
      titleBn: "আব্বাসীয় যুগ ও বায়তুল হিকমাহ",
      desc: "Baghdad became the intellectual hub of humanity. Scholars translated Greek, Persian, and Sanskrit scientific texts, pioneering astronomy, algebra, medicine, optics, and philosophy.",
      importance: "Laying the foundations of modern empirical sciences and Western Renaissance."
    },
    {
      id: "hist-9",
      year: "900–1200 CE",
      era: "Islamic Golden Age",
      eraBn: "ইসলামি স্বর্ণযুগ",
      title: "Luminaries: Al-Khwarizmi, Ibn Sina, Al-Biruni, Ibn al-Haytham",
      titleBn: "মহীয়ান বিজ্ঞানী ও মনীষীবৃন্দ",
      desc: "Al-Khwarizmi invents algebra; Ibn Sina writes 'The Canon of Medicine'; Ibn al-Haytham pioneers the camera obscura and modern scientific method; Al-Biruni calculates Earth's circumference.",
      importance: "Science integrated with theological reverence for the cosmos."
    },
    {
      id: "hist-10",
      year: "1453 CE",
      era: "Ottoman Era",
      eraBn: "উসমানীয় যুগ",
      title: "Conquest of Constantinople (Istanbul)",
      titleBn: "কনস্টান্টিনোপল বিজয়",
      desc: "Sultan Mehmed II opened Constantinople, ending the Byzantine Empire and fulfilling the prophetic tidings. Non-Muslims were guaranteed religious freedoms under the millet system.",
      importance: "Establishment of the Ottoman Empire as a major global power bridge between East and West."
    }
  ],

  // Knowledge Quiz (Beginner, Intermediate, Advanced)
  quizQuestions: [
    {
      id: "quiz-1",
      level: "beginner",
      levelLabel: "Beginner",
      levelLabelBn: "প্রাথমিক",
      question: "What is the primary, overarching theme of the Holy Quran?",
      questionBn: "পবিত্র কুরআনের মূল এবং প্রধান বার্তা কী?",
      options: [
        "Historical accounts of ancient kingdoms",
        "Tawhid: The Absolute Oneness and Worship of Allah alone",
        "Detailed astronomical maps of the universe",
        "Commercial trade regulations"
      ],
      correct: 1,
      explanation: "Tawhid (the pure monotheistic worship of Allah without partners) is the bedrock and central thesis of the entire Quranic revelation.",
      reference: "Surah Al-Ikhlas (112:1-4)"
    },
    {
      id: "quiz-2",
      level: "beginner",
      levelLabel: "Beginner",
      levelLabelBn: "প্রাথমিক",
      question: "Which Surah is described in prophetic traditions as 'The Mother of the Book' (Umm al-Kitab)?",
      questionBn: "হাদিসের বর্ণনানুযায়ী কোন সূরাকে 'উম্মুল কিতাব' বা কুরআনের জননী বলা হয়?",
      options: [
        "Surah Al-Baqarah",
        "Surah Ya-Sin",
        "Surah Al-Fatihah",
        "Surah Al-Mulk"
      ],
      correct: 2,
      explanation: "Surah Al-Fatihah is known as Umm al-Kitab because it encapsulates the essential themes of the entire Quran: praise, divine attributes, Day of Judgment, and petition for guidance.",
      reference: "Sahih al-Bukhari 4704"
    },
    {
      id: "quiz-3",
      level: "beginner",
      levelLabel: "Beginner",
      levelLabelBn: "প্রাথমিক",
      question: "How many daily obligatory prayers (Fard Salah) are mandated upon every sane adult Muslim?",
      questionBn: "প্রত্যেক প্রাপ্তবয়স্ক মুসলিমের ওপর দৈনিক কয় ওয়াক্ত ফরজ নামাজ নির্ধারিত?",
      options: [
        "Three times",
        "Five times",
        "Seven times",
        "Once every Friday"
      ],
      correct: 1,
      explanation: "The five daily prayers (Fajr, Dhuhr, Asr, Maghrib, Isha) were ordained during the Night Journey (Mi'raj) as one of the Five Pillars of Islam.",
      reference: "Sahih al-Bukhari 349"
    },
    {
      id: "quiz-4",
      level: "intermediate",
      levelLabel: "Intermediate",
      levelLabelBn: "মধ্যবর্তী",
      question: "What is the key differentiator between a Makki and a Madani Surah?",
      questionBn: "মাক্কী ও মাদানী সূরার মূল পার্থক্যকারী মাপকাঠি কোনটি?",
      options: [
        "Whether it mentions the Kaaba or not",
        "Whether it was revealed before or after the Hijrah (migration) to Medina",
        "The physical geographical boundary where the verse was spoken",
        "The number of ayahs contained in the surah"
      ],
      correct: 1,
      explanation: "In classical Ulum al-Quran (Quranic Sciences), Makki surahs are those revealed prior to the Hijrah to Medina, while Madani surahs are those revealed following the Hijrah, regardless of exact physical location.",
      reference: "Al-Suyuti, 'Al-Itqan fi 'Ulum al-Qur'an'"
    },
    {
      id: "quiz-5",
      level: "intermediate",
      levelLabel: "Intermediate",
      levelLabelBn: "মধ্যবর্তী",
      question: "Which canon of Hadith is unanimously recognized by Sunni Islamic scholarship as the most authentic collection?",
      questionBn: "সুন্নি ইসলামি গবেষকদের সর্বসম্মত মতে সর্বাধিক বিশুদ্ধ হাদিস গ্রন্থ কোনটি?",
      options: [
        "Sunan Ibn Majah",
        "Sahih al-Bukhari",
        "Musnad Ahmad",
        "Muwatta Imam Malik"
      ],
      correct: 1,
      explanation: "Imam Muhammad ibn Isma'il al-Bukhari applied the most rigorous criteria for transmission chains and narrator trustworthiness, rendering Sahih al-Bukhari the most authentic book after the Quran.",
      reference: "Ibn Hajar al-Asqalani, 'Fath al-Bari'"
    },
    {
      id: "quiz-6",
      level: "intermediate",
      levelLabel: "Intermediate",
      levelLabelBn: "মধ্যবর্তী",
      question: "Which Caliph ordered the standardized preservation and unified compilation of the Quranic Mushaf sent to major Islamic capitals?",
      questionBn: "কোন খলিফার আমলে পবিত্র কুরআনের প্রামাণ্য পান্ডুলিপি (মুসহাফ) সংকলন করে বিভিন্ন প্রদেশে পাঠানো হয়?",
      options: [
        "Abu Bakr as-Siddiq (RA)",
        "Umar ibn al-Khattab (RA)",
        "Uthman ibn Affan (RA)",
        "Ali ibn Abi Talib (RA)"
      ],
      correct: 2,
      explanation: "Caliph Uthman ibn Affan (RA) oversaw the committee led by Zaid ibn Thabit to produce master standard copies of the Quran to prevent dialectal disputes across expanding territories.",
      reference: "Sahih al-Bukhari 4987"
    },
    {
      id: "quiz-7",
      level: "advanced",
      levelLabel: "Advanced",
      levelLabelBn: "উচ্চতর",
      question: "In Usul al-Fiqh (Islamic Jurisprudence), what does the term 'Maqasid al-Shariah' refer to?",
      questionBn: "ইসলামি আইনতত্ত্ব বা উসুল আল-ফিকহে 'মাকাসিদ আশ-শরীয়াহ' বলতে কী বোঝায়?",
      options: [
        "The historical chronology of prophetic military campaigns",
        "The higher essential objectives and human welfare protections behind divine laws (Faith, Life, Intellect, Lineage, Property)",
        "The exact grammatical rules of classical Arabic poetry",
        "The administrative rules for selecting a caliph"
      ],
      correct: 1,
      explanation: "Maqasid al-Shariah, formulated systematically by Imam Al-Shatibi and Al-Ghazali, represents the universal higher aims of Islamic law: the preservation of Religion (Din), Life (Nafs), Intellect ('Aql), Lineage/Honor (Nasl), and Property (Mal).",
      reference: "Al-Shatibi, 'Al-Muwafaqat fi Usul al-Shari'ah'"
    },
    {
      id: "quiz-8",
      level: "advanced",
      levelLabel: "Advanced",
      levelLabelBn: "উচ্চতর",
      question: "What is the primary epistemological difference between a Hadith Sahih and a Hadith Da'eef?",
      questionBn: "সহীহ এবং যঈফ হাদিসের মধ্যে মৌলিক পার্থক্য কোনটি?",
      options: [
        "A Sahih Hadith was written in Mecca, while a Da'eef was written in Medina",
        "A Sahih Hadith fulfills continuous chain (Ittisal), righteous narrators ('Adalah), precise memory (Dabt), and lacks hidden defects ('Illah) or anomalies (Shudhudh)",
        "A Da'eef Hadith is proven to be an intentional fabrication by enemies",
        "A Sahih Hadith must be confirmed by at least 100 companions simultaneously"
      ],
      correct: 1,
      explanation: "A Sahih Hadith meets five rigorous criteria: unbroken chain of narrators, integrity of every narrator, precision of retention, freedom from irregularities, and freedom from detrimental hidden flaws. (Note: A Da'eef Hadith is simply weak in transmission, distinct from a Mawdu' which is fabricated).",
      reference: "Ibn al-Salah, 'Muqaddimah fi 'Ulum al-Hadith'"
    }
  ],

  // Daily Reflections (Quranic Gem, Hadith, Practical Lesson)
  reflections: [
    {
      id: "ref-1",
      day: "Sunday",
      dayBn: "রবিবার",
      theme: "Patience and Inner Peace (Sabr)",
      themeBn: "ধৈর্য ও আত্মিক প্রশান্তি",
      quranVerse: {
        arabic: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا • إِنَّ مَعَ الْعُسْرِ يُسْرًا",
        transliteration: "Fa inna ma'al-'usri yusrā • Inna ma'al-'usri yusrā",
        translation: "For indeed, with hardship [will be] ease. Indeed, with hardship [will be] ease.",
        translationBn: "নিশ্চয় কষ্টের সাথেই স্বস্তি রয়েছে। নিঃসন্দেহে কষ্টের সাথেই রয়েছে স্বস্তি।",
        reference: "Surah Ash-Sharh (94:5-6)"
      },
      hadithGem: {
        arabic: "وَاعْلَمْ أَنَّ فِي الصَّبْرِ عَلَى مَا تَكْرَهُ خَيْرًا كَثِيرًا، وَأَنَّ النَّصْرَ مَعَ الصَّبْرِ، وَأَنَّ الْفَرَجَ مَعَ الْكَرْبِ، وَأَنَّ مَعَ الْعُسْرِ يُسْرًا",
        translation: "Know that in patiently enduring what you dislike is abundant goodness; and that victory comes with patience, relief comes with distress, and with hardship comes ease.",
        translationBn: "জেনে রাখো, তোমার অপছন্দনীয় বিষয়ে ধৈর্য ধারণের মধ্যে প্রচুর কল্যাণ রয়েছে; ধৈর্যের সাথেই বিজয় আসে, কষ্টের পরই মুক্তি আসে আর কাঠিন্যের সাথেই সহজতা আসে।",
        reference: "Musnad Ahmad 2803, Jami' at-Tirmidhi (Hasan)"
      },
      practicalLesson: "Today, when faced with an unexpected delay, minor frustration, or anxious thought, pause before reacting. Remind yourself that discomfort is impermanent and designed to cultivate resilience. Take three deep breaths, utter 'Alhamdulillah 'ala kulli hal' (Praise be to Allah in all circumstances), and focus on constructive solutions.",
      practicalLessonBn: "আজকের দিনে কোনো অনাকাঙ্ক্ষিত বিলম্ব, মানসিক চাপ বা বিরক্তির সম্মুখীন হলে সাথে সাথে প্রতিক্রিয়া না দেখিয়ে এক মুহূর্ত থামুন। নিজেকে মনে করিয়ে দিন যে কষ্ট সাময়িক এবং এটি মানসিক শক্তির উন্মেষ ঘটায়। শান্তভাবে বলুন 'আলহামদুলিল্লাহ আলা কুল্লি হাল' এবং ইতিবাচক পদক্ষেপে মনোযোগ দিন।"
    },
    {
      id: "ref-2",
      day: "Monday",
      dayBn: "সোমবার",
      theme: "Integrity and Truthfulness (Sidq)",
      themeBn: "সততা ও সত্যবাদিতা",
      quranVerse: {
        arabic: "يَا أَيُّهَا الَّذِينَ آمَنُوا اتَّقُوا اللَّهَ وَكُونُوا مَعَ الصَّادِقِينَ",
        transliteration: "Yā ayyuhalladhīna āmanuttaqullāha wa kūnū ma'aṣ-ṣādiqīn",
        translation: "O you who have believed, fear Allah and be with those who are true.",
        translationBn: "হে ঈমানদারগণ! তোমরা আল্লাহকে ভয় করো এবং সত্যবাদীদের সঙ্গী হও।",
        reference: "Surah At-Tawbah (9:119)"
      },
      hadithGem: {
        arabic: "عَلَيْكُمْ بِالصِّدْقِ، فَإِنَّ الصِّدْقَ يَهْدِي إِلَى الْبِرِّ، وَإِنَّ الْبِرَّ يَهْدِي إِلَى الْجَنَّةِ",
        translation: "You must adhere to truthfulness, for truthfulness leads to righteousness, and righteousness leads to Paradise.",
        translationBn: "তোমরা অবশ্যই সততা অবলম্বন করো; কেননা সততা পুণ্যের পথে পরিচালিত করে আর পুণ্য জান্নাতের পথে নিয়ে যায়।",
        reference: "Sahih al-Bukhari 6094, Sahih Muslim 2607"
      },
      practicalLesson: "Audit your speech today. Eliminate even tiny exaggerations, casual white lies, or broken promises made to children or colleagues. Sincerity of tongue directly illuminates the spiritual clarity of the heart.",
      practicalLessonBn: "আজ আপনার কথার ওপর বিশেষ খেয়াল রাখুন। যেকোনো ধরনের অতিশয়োক্তি, অসত্য বা দেওয়া প্রতিশ্রুতি ভঙ্গ করা থেকে বিরত থাকুন। মুখের সততা মানুষের অন্তরে প্রশান্তি ও আলো সৃষ্টি করে।"
    }
  ],

  // Topics for Explore
  topics: [
    { id: "quran-tafsir", name: "Quran & Tafsir", nameBn: "কুরআন ও তাফসীর", icon: "book-open", count: 42, desc: "Explore linguistic beauty, context of revelation, and classical commentaries." },
    { id: "hadith-sunnah", name: "Hadith & Sunnah", nameBn: "হাদিস ও সুন্নাহ", icon: "scroll", count: 38, desc: "Examine verified sayings, legal traditions, and authentic chains of transmission." },
    { id: "aqidah", name: "Islamic Beliefs (Aqidah)", nameBn: "ইসলামি আকীদা", icon: "heart", count: 56, desc: "Understanding Tawhid, divine attributes, destiny, and foundational creed." },
    { id: "history", name: "Islamic History", nameBn: "ইসলামের ইতিহাস", icon: "landmark", count: 34, desc: "From the Prophetic era and Caliphates to the Islamic Golden Age." },
    { id: "science-islam", name: "Science & Islam", nameBn: "বিজ্ঞান ও ইসলাম", icon: "atom", count: 29, desc: "Empirical observation, cosmic harmony, and Islamic contributions to science." },
    { id: "women-islam", name: "Women in Islam", nameBn: "ইসলামে নারী", icon: "users", count: 27, desc: "Spiritual status, financial rights, historical scholarship, and family justice." },
    { id: "philosophy", name: "Philosophy & Existence", nameBn: "দর্শন ও অস্তিত্ব", icon: "compass", count: 31, desc: "The purpose of life, free will, suffering, and existential questions." },
    { id: "fiqh-daily", name: "Daily Life & Fiqh", nameBn: "দৈনন্দিন জীবন ও ফিকহ", icon: "sun", count: 48, desc: "Practical guidance for worship, modern finance, ethics, and lifestyle." },
    { id: "morality-ethics", name: "Morality & Ethics", nameBn: "নীতিশাস্ত্র ও চরিত্র", icon: "feather", count: 25, desc: "Islamic manners (Adab), character refinement, and social compassion." },
    { id: "hereafter", name: "Afterlife & Hereafter", nameBn: "পরকাল ও আখেরাত", icon: "infinity", count: 22, desc: "The soul's journey, Day of Judgment, accountability, and eternal salvation." },
    { id: "prophet-muhammad", name: "Prophet Muhammad (PBUH)", nameBn: "মহানবী (সা.)", icon: "star", count: 35, desc: "The life, character, leadership, and timeless mercy of the Messenger." },
    { id: "comparative-religion", name: "Comparative Religion", nameBn: "তুলনামূলক ধর্মতত্ত্ব", icon: "layers", count: 19, desc: "Monotheistic heritage, Abrahamic connections, and respectful dialogue." }
  ]
};

// Simulated Islamic AI Assistant Knowledge Engine
// Rules: Never issues binding fatwas; always quotes sources; recommends qualified local muftis for personal fiqh.
const AI_SIMULATOR = {
  disclaimer: "DEENQUEST Assistant is an educational AI research tool designed for exploratory study. It does not issue authoritative Fatwas, nor does it replace qualified Islamic scholars and legal Muftis. For complex personal jurisprudence or matrimonial rulings, consult trusted scholars.",
  disclaimerBn: "দীনকোয়েস্ট সহকারী একটি শিক্ষামূলক এআই গবেষণা টুল। এটি কোনো বাধ্যতামূলক ফতোয়া প্রদান করে না এবং বিজ্ঞ মুফতি ও আলেমদের বিকল্প নয়। ব্যক্তিগত ফিকহ বা জটিল শরয়ী বিষয়ে সর্বদা বিজ্ঞ আলেমের পরামর্শ নিন।",
  
  matchQuery(userQuery) {
    const query = userQuery.toLowerCase();
    
    if (query.includes("suffer") || query.includes("evil") || query.includes("pain") || query.includes("কষ্ট") || query.includes("দুঃখ")) {
      return {
        title: "Why does Allah allow suffering?",
        summary: "Worldly existence is not intended as an eternal paradise, but as a temporary testing ground (Dar al-Imtihan). Suffering tests human patience, purifies shortcomings, cultivates empathy, and earns boundless compensation in the Hereafter.",
        sources: ["Quran 67:2", "Quran 2:155", "Sahih al-Bukhari 5641"],
        link: "question-details.html?id=q-suffering-evil"
      };
    }
    
    if (query.includes("science") || query.includes("evolution") || query.includes("big bang") || query.includes("বিজ্ঞান")) {
      return {
        title: "Science and Islamic Theology",
        summary: "The Quran contains over 750 verses directing humanity to observe the cosmos empirically. Islamic theology views scientific inquiry as an act of contemplation (Tafakkur) revealing the signs of the Creator.",
        sources: ["Quran 3:190-191", "Quran 21:30", "Sahih Muslim 2699"],
        link: "question-details.html?id=q-science-islam"
      };
    }
    
    if (query.includes("women") || query.includes("wife") || query.includes("mother") || query.includes("female") || query.includes("নারী")) {
      return {
        title: "Status and Rights of Women in Islam",
        summary: "Islam granted women complete spiritual equality, independent property rights, marital consent, and inheritance over 14 centuries ago. The Prophet (PBUH) emphasized that the best believers are those who treat their wives with the utmost kindness.",
        sources: ["Quran 16:97", "Quran 4:19", "Sahih al-Bukhari 5971"],
        link: "question-details.html?id=q-women-rights"
      };
    }
    
    if (query.includes("pray") || query.includes("salah") || query.includes("namaz") || query.includes("নামাজ") || query.includes("সালাত")) {
      return {
        title: "The Purpose of the Five Daily Prayers",
        summary: "Salah acts as a daily spiritual recharge that breaks worldly anxiety, anchors the believer's consciousness in God, cleanses sins, and instills humility and moral discipline.",
        sources: ["Quran 4:103", "Quran 20:14", "Sahih al-Bukhari 528"],
        link: "question-details.html?id=q-prayer-times"
      };
    }
    
    if (query.includes("jihad") || query.includes("war") || query.includes("peace") || query.includes("জিহাদ")) {
      return {
        title: "The True Concept of Jihad in Islam",
        summary: "Linguistically meaning 'utmost effort', Jihad primarily denotes the internal struggle against selfish desires and injustice. Military defense is strictly regulated under Shariah, outlawing harm to civilians, women, children, and property.",
        sources: ["Quran 2:190", "Quran 5:32", "Jami' at-Tirmidhi 1621"],
        link: "question-details.html?id=q-meaning-jihad"
      };
    }

    if (query.includes("force") || query.includes("compulsion") || query.includes("জোর") || query.includes("বাধ্য")) {
      return {
        title: "Freedom of Faith in Islam",
        summary: "The Quran declares: 'There shall be no compulsion in religion' (2:256). Coerced belief is invalid in Islamic law, because genuine faith requires free, sincere conviction of the heart.",
        sources: ["Quran 2:256", "Quran 10:99", "Sahih al-Bukhari 3166"],
        link: "question-details.html?id=q-compulsion-religion"
      };
    }

    // Default authentic fallback
    return {
      title: "Authentic Islamic Guidance on Your Query",
      summary: "In Islam, every inquiry should be grounded in authentic sources: the Quran, the authentic Sunnah, and recognized scholarly consensus. Knowledge is pursued with humility, sincerity, and intellectual honesty.",
      sources: ["Quran 16:43 ('Ask the people of knowledge if you do not know')", "Sahih Muslim 2699"],
      link: "questions.html"
    };
  }
};
