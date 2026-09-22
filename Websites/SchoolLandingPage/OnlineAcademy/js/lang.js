const translations = {
    bn: {
        "nav_home": "হোম",
        "nav_about": "সম্পর্কে",
        "nav_courses": "কোর্সসমূহ",
        "nav_admissions": "ভর্তি",
        "nav_contact": "যোগাযোগ",
        
        "hero_subtitle": "কিংস্টার অনলাইন একাডেমি",
        "hero_title": "ভবিষ্যতের শিক্ষা, আজই শুরু করুন",
        "hero_desc": "আধুনিক প্রযুক্তি ও সেরা মেন্টরদের সমন্বয়ে আমরা দিচ্ছি যুগোপযোগী ই-লার্নিং অভিজ্ঞতা। যেকোনো স্থান থেকে আপনার ক্যারিয়ার গড়ুন।",
        "hero_btn_1": "ভর্তি শুরু করুন",
        "hero_btn_2": "কিভাবে কাজ করে",
        
        "stat_1": "সক্রিয় শিক্ষার্থী",
        "stat_2": "অভিজ্ঞ মেন্টর",
        
        "cat_title": "জনপ্রিয় ক্যাটাগরি",
        "cat_1_title": "প্রোগ্রামিং ও সফটওয়্যার",
        "cat_2_title": "ডিজাইন ও ক্রিয়েটিভ",
        "cat_3_title": "বিজনেস ও ম্যানেজমেন্ট",
        "cat_4_title": "মার্কেটিং ও এসইও",
        
        // About Section
        "about_subtitle": "আমাদের সম্পর্কে",
        "about_title": "কিংস্টার অনলাইন একাডেমি",
        "about_desc": "কিংস্টার অনলাইন একাডেমি হলো একটি প্রিমিয়াম এড-টেক প্ল্যাটফর্ম। আমাদের লক্ষ্য হলো বিশ্বমানের দক্ষতা উন্নয়নের সুযোগ সবার দোরগোড়ায় পৌঁছে দেওয়া।",
        
        // Footer
        "footer_about": "কিংস্টার অনলাইন একাডেমি একটি আধুনিক প্রযুক্তি নির্ভর শিক্ষাপ্রতিষ্ঠান।",
        "footer_quick": "প্রয়োজনীয় লিঙ্ক",
        "footer_contact": "যোগাযোগ",
        "footer_rights": "© ২০২৬ কিংস্টার অনলাইন একাডেমি। সর্বস্বত্ব সংরক্ষিত।"
    },
    en: {
        "nav_home": "Home",
        "nav_about": "About Us",
        "nav_courses": "Courses",
        "nav_admissions": "Admissions",
        "nav_contact": "Contact",
        
        "hero_subtitle": "Kingster Online Academy",
        "hero_title": "Education of the Future, Start Today",
        "hero_desc": "With the combination of modern technology and the best mentors, we provide a contemporary e-learning experience. Build your career from anywhere.",
        "hero_btn_1": "Start Admission",
        "hero_btn_2": "How it Works",
        
        "stat_1": "Active Students",
        "stat_2": "Expert Mentors",
        
        "cat_title": "Popular Categories",
        "cat_1_title": "Programming & Software",
        "cat_2_title": "Design & Creative",
        "cat_3_title": "Business & Management",
        "cat_4_title": "Marketing & SEO",
        
        // About Section
        "about_subtitle": "About Us",
        "about_title": "Kingster Online Academy",
        "about_desc": "Kingster Online Academy is a premium ed-tech platform. Our goal is to bring world-class skill development opportunities to everyone's doorstep.",
        
        // Footer
        "footer_about": "Kingster Online Academy is a modern technology-driven educational institution.",
        "footer_quick": "Quick Links",
        "footer_contact": "Contact Info",
        "footer_rights": "© 2026 Kingster Online Academy. All Rights Reserved."
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
