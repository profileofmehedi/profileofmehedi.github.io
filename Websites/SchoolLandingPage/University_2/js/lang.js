const translations = {
    bn: {
        // Topbar & Nav
        "top_apply": "ভর্তি ফর্ম",
        "top_portal": "পোর্টাল",
        "top_alumni": "অ্যালামনাই",
        "nav_home": "হোম",
        "nav_about": "সম্পর্কে",
        "nav_academics": "একাডেমিকস",
        "nav_admissions": "ভর্তি",
        "nav_contact": "যোগাযোগ",
        
        // Hero
        "hero_title": "নতুন পৃথিবী আবিষ্কার করুন",
        "hero_desc": "আমাদের প্রিমিয়াম শিক্ষা ব্যবস্থার মাধ্যমে আপনার স্বপ্নের ক্যারিয়ার গড়ুন।",
        "hero_btn_explore": "কোর্সসমূহ দেখুন",
        "hero_btn_apply": "আবেদন করুন",
        
        // Info Grid
        "info_1_title": "বিশ্বমানের ক্যাম্পাস",
        "info_1_desc": "অত্যাধুনিক সুবিধা সম্পন্ন ক্যাম্পাস।",
        "info_2_title": "গবেষণা ও উন্নয়ন",
        "info_2_desc": "আন্তর্জাতিক মানের গবেষণা কেন্দ্র।",
        "info_3_title": "লাইব্রেরি সুবিধা",
        "info_3_desc": "১ লক্ষেরও বেশি বইয়ের বিশাল সংগ্রহ।",
        "info_4_title": "স্পোর্টস ক্লাব",
        "info_4_desc": "জাতীয় মানের খেলাধুলার সুযোগ।",
        
        // About Section
        "about_title": "সেরা শিক্ষা নিশ্চিতকরণে আমরা প্রতিশ্রুতিবদ্ধ",
        "about_desc": "১৯২০ সালে প্রতিষ্ঠিত কিংস্টার বিশ্ববিদ্যালয় দেশের শীর্ষস্থানীয় শিক্ষা প্রতিষ্ঠান। আমরা সৃজনশীলতা ও উদ্ভাবনকে উৎসাহিত করি। আমাদের লক্ষ্য হচ্ছে শিক্ষার্থীদের এমনভাবে প্রস্তুত করা যাতে তারা বিশ্বের যেকোনো স্থানে সফল হতে পারে।",
        
        // New Sections (News & Stats)
        "stats_title": "আমাদের সাফল্য",
        "stats_desc": "সংখ্যাতেই আমাদের সাফল্যের প্রমাণ।",
        "stat_1_val": "৫০+",
        "stat_1_lbl": "মেজর প্রোগ্রাম",
        "stat_2_val": "৯৮%",
        "stat_2_lbl": "কর্মসংস্থান হার",
        "stat_3_val": "২০,০০০+",
        "stat_3_lbl": "শিক্ষার্থী",
        
        // Footer
        "footer_desc": "উন্নত গবেষণাগার, অভিজ্ঞ শিক্ষকমণ্ডলী এবং আধুনিক পাঠ্যক্রম নিয়ে কিংস্টার বিশ্ববিদ্যালয় আপনার অপেক্ষায়।",
        "footer_rights": "© ২০২৬ কিংস্টার বিশ্ববিদ্যালয়। সর্বস্বত্ব সংরক্ষিত।"
    },
    en: {
        // Topbar & Nav
        "top_apply": "Apply Now",
        "top_portal": "Portal",
        "top_alumni": "Alumni",
        "nav_home": "Home",
        "nav_about": "About Us",
        "nav_academics": "Academics",
        "nav_admissions": "Admissions",
        "nav_contact": "Contact",
        
        // Hero
        "hero_title": "Discover a New World",
        "hero_desc": "Build your dream career through our premium education system.",
        "hero_btn_explore": "Explore Courses",
        "hero_btn_apply": "Apply Now",
        
        // Info Grid
        "info_1_title": "World-Class Campus",
        "info_1_desc": "Campus with state-of-the-art facilities.",
        "info_2_title": "Research & Development",
        "info_2_desc": "International standard research center.",
        "info_3_title": "Library Facilities",
        "info_3_desc": "Huge collection of over 100,000 books.",
        "info_4_title": "Sports Clubs",
        "info_4_desc": "National level sports opportunities.",
        
        // About Section
        "about_title": "Committed to Ensuring the Best Education",
        "about_desc": "Established in 1920, Kingster University is the country's leading educational institution. We encourage creativity and innovation. Our goal is to prepare students to succeed anywhere in the world.",
        
        // New Sections (News & Stats)
        "stats_title": "Our Success",
        "stats_desc": "Our numbers prove our success.",
        "stat_1_val": "50+",
        "stat_1_lbl": "Major Programs",
        "stat_2_val": "98%",
        "stat_2_lbl": "Employment Rate",
        "stat_3_val": "20,000+",
        "stat_3_lbl": "Students",
        
        // Footer
        "footer_desc": "Kingster University awaits you with advanced laboratories, experienced faculty and modern curriculum.",
        "footer_rights": "© 2026 Kingster University. All Rights Reserved."
    }
};

$(document).ready(function() {
    // Default language is Bengali
    let currentLang = localStorage.getItem('site_lang') || 'bn';
    setLanguage(currentLang);

    // Language Switcher Click Event
    $('.lang-switch').click(function(e) {
        e.preventDefault();
        let lang = $(this).attr('data-lang');
        setLanguage(lang);
    });

    function setLanguage(lang) {
        // Update active class on switcher
        $('.lang-switch').removeClass('active');
        $(`.lang-switch[data-lang="${lang}"]`).addClass('active');

        // Save to local storage so it persists across pages
        localStorage.setItem('site_lang', lang);

        // Update all elements with data-i18n
        $('[data-i18n]').each(function() {
            let key = $(this).attr('data-i18n');
            if (translations[lang] && translations[lang][key]) {
                if($(this).is('input') && $(this).attr('placeholder')) {
                    $(this).attr('placeholder', translations[lang][key]);
                } else if($(this).is('textarea') && $(this).attr('placeholder')) {
                    $(this).attr('placeholder', translations[lang][key]);
                } else {
                    $(this).html(translations[lang][key]);
                }
            }
        });
    }
});
