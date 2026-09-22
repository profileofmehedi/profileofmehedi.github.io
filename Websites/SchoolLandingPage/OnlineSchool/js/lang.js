const translations = {
    bn: {
        "nav_home": "হোম",
        "nav_about": "সম্পর্কে",
        "nav_courses": "কোর্সসমূহ",
        "nav_admissions": "ভর্তি",
        "nav_contact": "যোগাযোগ",
        
        "hero_subtitle": "কিংস্টার অনলাইন স্কুল",
        "hero_title": "ডিজিটাল শিক্ষায় স্বাগতম",
        "hero_desc": "ঘরে বসেই বিশ্বমানের শিক্ষা গ্রহণের সুযোগ। আধুনিক প্রযুক্তির সহায়তায় আমরা দিচ্ছি সেরা অনলাইন এডুকেশন।",
        "hero_btn_1": "ভর্তি তথ্য",
        "hero_btn_2": "কোর্সগুলো দেখুন",
        "hero_search": "কোর্স খুঁজুন...",
        "hero_search_btn": "খুঁজুন",
        
        "stat_1": "১০,০০০+ শিক্ষার্থী",
        "stat_2": "৫০০+ কোর্স",
        
        "float_title": "সেরা শিক্ষক",
        "float_desc": "অভিজ্ঞ মেন্টর",
        
        "cat_title": "জনপ্রিয় ক্যাটাগরি",
        "cat_1_title": "ওয়েব ডেভেলপমেন্ট",
        "cat_2_title": "গ্রাফিক্স ডিজাইন",
        "cat_3_title": "ডিজিটাল মার্কেটিং",
        "cat_4_title": "ডাটা সায়েন্স",
        
        // About Section
        "about_subtitle": "আমাদের সম্পর্কে",
        "about_title": "কিংস্টার অনলাইন স্কুল সম্পর্কে",
        "about_desc": "কিংস্টার অনলাইন স্কুল হলো একটি আধুনিক ই-লার্নিং প্ল্যাটফর্ম। আমাদের উদ্দেশ্য হলো ঘরে বসে সবার জন্য মানসম্মত শিক্ষা নিশ্চিত করা।",
        
        // Footer
        "footer_about": "কিংস্টার অনলাইন স্কুল একটি ডিজিটাল শিক্ষাপ্রতিষ্ঠান।",
        "footer_quick": "প্রয়োজনীয় লিঙ্ক",
        "footer_contact": "যোগাযোগ",
        "footer_rights": "© ২০২৬ কিংস্টার অনলাইন স্কুল। সর্বস্বত্ব সংরক্ষিত।"
    },
    en: {
        "nav_home": "Home",
        "nav_about": "About Us",
        "nav_courses": "Courses",
        "nav_admissions": "Admissions",
        "nav_contact": "Contact",
        
        "hero_subtitle": "Kingster Online School",
        "hero_title": "Welcome to Digital Education",
        "hero_desc": "Opportunity to get world-class education from home. With the help of modern technology, we provide the best online education.",
        "hero_btn_1": "Admission Info",
        "hero_btn_2": "Explore Courses",
        "hero_search": "Search courses...",
        "hero_search_btn": "Search",
        
        "stat_1": "10,000+ Students",
        "stat_2": "500+ Courses",
        
        "float_title": "Top Instructors",
        "float_desc": "Experienced Mentors",
        
        "cat_title": "Popular Categories",
        "cat_1_title": "Web Development",
        "cat_2_title": "Graphics Design",
        "cat_3_title": "Digital Marketing",
        "cat_4_title": "Data Science",
        
        // About Section
        "about_subtitle": "About Us",
        "about_title": "About Kingster Online School",
        "about_desc": "Kingster Online School is a modern e-learning platform. Our aim is to ensure quality education for everyone from home.",
        
        // Footer
        "footer_about": "Kingster Online School is a digital educational institution.",
        "footer_quick": "Quick Links",
        "footer_contact": "Contact Info",
        "footer_rights": "© 2026 Kingster Online School. All Rights Reserved."
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
