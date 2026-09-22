const translations = {
    bn: {
        "nav_home": "হোম",
        "nav_about": "সম্পর্কে",
        "nav_academics": "ক্লাসসমূহ",
        "nav_admissions": "ভর্তি",
        "nav_contact": "যোগাযোগ",
        
        "hero_subtitle": "কিংস্টার কিন্ডারগার্টেন",
        "hero_title": "খেলাচ্ছলে শিক্ষা, আনন্দের শুরু",
        "hero_desc": "শিশুদের জন্য একটি সুন্দর, নিরাপদ এবং আনন্দময় শিক্ষার পরিবেশ। আমরা শিশুদের ভবিষ্যতের সুন্দর ভিত্তি তৈরি করি।",
        "hero_btn_1": "ভর্তি তথ্য",
        "hero_btn_2": "আমাদের সম্পর্কে জানুন",
        
        "feat_1_title": "আনন্দময় শিক্ষা",
        "feat_1_desc": "খেলাধুলার মাধ্যমে সৃজনশীল শিক্ষার অপূর্ব সমন্বয়।",
        "feat_2_title": "নিরাপদ পরিবেশ",
        "feat_2_desc": "শিশুদের জন্য ১০০% নিরাপদ ও স্বাস্থ্যকর ক্যাম্পাস।",
        "feat_3_title": "যত্নশীল শিক্ষক",
        "feat_3_desc": "অভিজ্ঞ এবং শিশুদের প্রতি বিশেষ যত্নশীল শিক্ষক।",
        
        // About Section
        "about_subtitle": "আমাদের লক্ষ্য",
        "about_title": "কিংস্টার কিন্ডারগার্টেন সম্পর্কে",
        "about_desc": "কিংস্টার কিন্ডারগার্টেন শিশুদের জন্য একটি আদর্শ স্থান যেখানে তারা আনন্দের সাথে শিখতে পারে। আমাদের লক্ষ্য হলো শিশুদের সুপ্ত প্রতিভার বিকাশ ঘটানো।",
        
        // Footer
        "footer_about": "কিংস্টার কিন্ডারগার্টেন শিশুদের জন্য একটি আনন্দময় শিক্ষাপ্রতিষ্ঠান।",
        "footer_quick": "প্রয়োজনীয় লিঙ্ক",
        "footer_contact": "যোগাযোগ",
        "footer_rights": "© ২০২৬ কিংস্টার কিন্ডারগার্টেন। সর্বস্বত্ব সংরক্ষিত।"
    },
    en: {
        "nav_home": "Home",
        "nav_about": "About Us",
        "nav_academics": "Classes",
        "nav_admissions": "Admissions",
        "nav_contact": "Contact",
        
        "hero_subtitle": "Kingster Kindergarten",
        "hero_title": "Learning Through Play",
        "hero_desc": "A beautiful, safe and joyful learning environment for children. We build a beautiful foundation for children's future.",
        "hero_btn_1": "Admission Info",
        "hero_btn_2": "Learn About Us",
        
        "feat_1_title": "Joyful Learning",
        "feat_1_desc": "A wonderful combination of creative learning through play.",
        "feat_2_title": "Safe Environment",
        "feat_2_desc": "100% safe and healthy campus for children.",
        "feat_3_title": "Caring Teachers",
        "feat_3_desc": "Experienced and specially caring teachers for children.",
        
        // About Section
        "about_subtitle": "Our Mission",
        "about_title": "About Kingster Kindergarten",
        "about_desc": "Kingster Kindergarten is an ideal place for children where they can learn with joy. Our goal is to develop the hidden talents of children.",
        
        // Footer
        "footer_about": "Kingster Kindergarten is a joyful educational institution for children.",
        "footer_quick": "Quick Links",
        "footer_contact": "Contact Info",
        "footer_rights": "© 2026 Kingster Kindergarten. All Rights Reserved."
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
