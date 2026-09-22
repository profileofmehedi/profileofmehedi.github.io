const translations = {
    bn: {
        "nav_home": "হোম",
        "nav_about": "সম্পর্কে",
        "nav_academics": "একাডেমিকস",
        "nav_admissions": "ভর্তি",
        "nav_contact": "যোগাযোগ",
        
        "hero_subtitle": "কিংস্টার হাই স্কুল",
        "hero_title": "আমরা সেরা শিক্ষা নিশ্চিত করি",
        "hero_desc": "বিশ্বমানের শিক্ষা ও সুযোগ-সুবিধার মাধ্যমে আমরা আগামী দিনের নেতৃত্ব তৈরি করছি।",
        "hero_btn": "ভর্তি তথ্য",
        
        "cta_1_title": "সেরা শিক্ষক",
        "cta_1_desc": "অভিজ্ঞ ও নিবেদিতপ্রাণ শিক্ষকমণ্ডলী।",
        "cta_2_title": "আধুনিক ল্যাব",
        "cta_2_desc": "অত্যাধুনিক বিজ্ঞান ও আইসিটি ল্যাব।",
        "cta_3_title": "ক্রীড়া ও সংস্কৃতি",
        "cta_3_desc": "খেলাধুলা ও সাংস্কৃতিক কর্মকাণ্ডের বিশাল সুযোগ।",
        
        // About Section
        "about_subtitle": "আমাদের ইতিহাস",
        "about_title": "কিংস্টার হাই স্কুল সম্পর্কে",
        "about_desc": "কিংস্টার হাই স্কুল একটি ঐতিহ্যবাহী শিক্ষাপ্রতিষ্ঠান যেখানে আধুনিক ও নৈতিক শিক্ষার অপূর্ব সমন্বয় ঘটেছে। আমাদের লক্ষ্য হলো ছাত্রদের মধ্যে শৃঙ্খলা ও মেধার বিকাশ ঘটানো।",
        "about_p1": "উন্নত পাঠ্যক্রম এবং সৃজনশীল শিক্ষাদান পদ্ধতি।",
        "about_p2": "নিরাপদ ও শিক্ষার্থীবান্ধব পরিবেশ।",
        "about_p3": "আন্তর্জাতিক মানের সুযোগ-সুবিধা।",
        
        // Footer
        "footer_about": "কিংস্টার হাই স্কুল একটি ঐতিহ্যবাহী শিক্ষাপ্রতিষ্ঠান।",
        "footer_quick": "প্রয়োজনীয় লিঙ্ক",
        "footer_contact": "যোগাযোগ",
        "footer_rights": "© ২০২৬ কিংস্টার হাই স্কুল। সর্বস্বত্ব সংরক্ষিত।"
    },
    en: {
        "nav_home": "Home",
        "nav_about": "About Us",
        "nav_academics": "Academics",
        "nav_admissions": "Admissions",
        "nav_contact": "Contact",
        
        "hero_subtitle": "Kingster High School",
        "hero_title": "We Ensure the Best Education",
        "hero_desc": "We are creating future leaders through world-class education and facilities.",
        "hero_btn": "Admission Info",
        
        "cta_1_title": "Best Teachers",
        "cta_1_desc": "Experienced and dedicated faculty.",
        "cta_2_title": "Modern Labs",
        "cta_2_desc": "State-of-the-art science and ICT labs.",
        "cta_3_title": "Sports & Culture",
        "cta_3_desc": "Great opportunities for sports and cultural activities.",
        
        // About Section
        "about_subtitle": "Our History",
        "about_title": "About Kingster High School",
        "about_desc": "Kingster High School is a traditional educational institution where a wonderful combination of modern and moral education has taken place. Our goal is to develop discipline and talent among students.",
        "about_p1": "Advanced curriculum and creative teaching methods.",
        "about_p2": "Safe and student-friendly environment.",
        "about_p3": "International standard facilities.",
        
        // Footer
        "footer_about": "Kingster High School is a traditional educational institution.",
        "footer_quick": "Quick Links",
        "footer_contact": "Contact Info",
        "footer_rights": "© 2026 Kingster High School. All Rights Reserved."
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
