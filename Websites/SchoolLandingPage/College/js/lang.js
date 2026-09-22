const translations = {
    bn: {
        "nav_home": "হোম",
        "nav_about": "সম্পর্কে",
        "nav_academics": "একাডেমিকস",
        "nav_admissions": "ভর্তি",
        "nav_contact": "যোগাযোগ",
        
        "hero_subtitle": "কিংস্টার কলেজে স্বাগতম",
        "hero_title": "আমরা সেরা শিক্ষা নিশ্চিত করি",
        "hero_desc": "বিশ্বমানের শিক্ষা ও সুযোগ-সুবিধার মাধ্যমে আমরা আগামী দিনের নেতৃত্ব তৈরি করছি।",
        "hero_btn": "ভর্তি তথ্য",
        
        "exp_title": "উচ্চশিক্ষা ও অভিজ্ঞতা",
        "exp_desc": "দীর্ঘ দুই দশকের বেশি সময় ধরে আমরা মানসম্মত শিক্ষা প্রদান করে আসছি। আমাদের শিক্ষার্থীরা আজ সারা বিশ্বে সফল।",
        "exp_btn": "আরও জানুন",
        
        "prog_title": "আমাদের প্রোগ্রামসমূহ",
        "prog_1": "বিজ্ঞান ও প্রযুক্তি",
        "prog_1_desc": "আধুনিক প্রযুক্তি ও বিজ্ঞানের সমন্বয়ে গড়া কোর্স।",
        "prog_2": "বাণিজ্য ও প্রশাসন",
        "prog_2_desc": "ব্যবসায়িক বিশ্বে নেতৃত্ব দেওয়ার প্রস্তুতি।",
        "prog_3": "মানবিক শাখা",
        "prog_3_desc": "শিল্প, সাহিত্য ও সমাজবিজ্ঞানের চমৎকার পাঠ।",
        
        // About Section
        "about_title": "কিংস্টার কলেজ সম্পর্কে",
        "about_desc": "কিংস্টার কলেজ একটি ঐতিহ্যবাহী শিক্ষাপ্রতিষ্ঠান যেখানে আধুনিক ও নৈতিক শিক্ষার অপূর্ব সমন্বয় ঘটেছে।",
        
        // News Section
        "news_title": "ক্যাম্পাস সংবাদ",
        "news_1_title": "বিজ্ঞান মেলা ২০২৬",
        "news_2_title": "বার্ষিক ক্রীড়া প্রতিযোগিতা",
        
        // Footer
        "footer_about": "কিংস্টার কলেজ একটি ঐতিহ্যবাহী শিক্ষাপ্রতিষ্ঠান।",
        "footer_quick": "প্রয়োজনীয় লিঙ্ক",
        "footer_contact": "যোগাযোগ",
        "footer_rights": "© ২০২৬ কিংস্টার কলেজ। সর্বস্বত্ব সংরক্ষিত।"
    },
    en: {
        "nav_home": "Home",
        "nav_about": "About Us",
        "nav_academics": "Academics",
        "nav_admissions": "Admissions",
        "nav_contact": "Contact",
        
        "hero_subtitle": "Welcome to Kingster College",
        "hero_title": "We Ensure the Best Education",
        "hero_desc": "We are creating future leaders through world-class education and facilities.",
        "hero_btn": "Admission Info",
        
        "exp_title": "Higher Education & Experience",
        "exp_desc": "For over two decades, we have been providing quality education. Our students are successful all over the world today.",
        "exp_btn": "Learn More",
        
        "prog_title": "Our Programs",
        "prog_1": "Science & Technology",
        "prog_1_desc": "Courses based on modern technology and science.",
        "prog_2": "Business & Admin",
        "prog_2_desc": "Preparation to lead the business world.",
        "prog_3": "Humanities",
        "prog_3_desc": "Excellent lessons in art, literature, and sociology.",
        
        // About Section
        "about_title": "About Kingster College",
        "about_desc": "Kingster College is a traditional educational institution where a wonderful combination of modern and moral education has taken place.",
        
        // News Section
        "news_title": "Campus News",
        "news_1_title": "Science Fair 2026",
        "news_2_title": "Annual Sports Competition",
        
        // Footer
        "footer_about": "Kingster College is a traditional educational institution.",
        "footer_quick": "Quick Links",
        "footer_contact": "Contact Info",
        "footer_rights": "© 2026 Kingster College. All Rights Reserved."
    }
};

$(document).ready(function() {
    let currentLang = localStorage.getItem('site_lang') || 'bn';
    setLanguage(currentLang);

    $('.lang-switch').click(function(e) {
        e.preventDefault();
        let lang = $(this).attr('data-lang');
        setLanguage(lang);
    });

    function setLanguage(lang) {
        $('.lang-switch').removeClass('active');
        $(`.lang-switch[data-lang="${lang}"]`).addClass('active');
        localStorage.setItem('site_lang', lang);

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
