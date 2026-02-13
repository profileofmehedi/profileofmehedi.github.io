$(document).ready(function() {
    // Initialize AOS
    AOS.init({
        duration: 1000,
        easing: 'ease-out-cubic',
        once: true,
        mirror: false
    });

    // Custom Cursor Logic
    const cursor = $('<div class="custom-cursor"></div>');
    const cursorDot = $('<div class="custom-cursor-dot"></div>');
    $('body').append(cursor, cursorDot);

    $(document).on('mousemove', function(e) {
        cursor.css({ left: e.clientX + 'px', top: e.clientY + 'px' });
        cursorDot.css({ left: e.clientX + 'px', top: e.clientY + 'px' });
    });

    $('a, button, .service-card').on('mouseenter', function() {
        cursor.css('transform', 'translate(-50%, -50%) scale(2)');
        cursor.css('background-color', 'rgba(13, 110, 253, 0.1)');
    }).on('mouseleave', function() {
        cursor.css('transform', 'translate(-50%, -50%) scale(1)');
        cursor.css('background-color', 'transparent');
    });

    // Navbar Scroll Effect
    $(window).scroll(function() {
        if ($(this).scrollTop() > 50) {
            $('.navbar').addClass('scrolled');
            $('.back-to-top').addClass('show');
        } else {
            $('.navbar').removeClass('scrolled');
            $('.back-to-top').removeClass('show');
        }
    });

    // Back to Top Click
    $('.back-to-top').click(function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Language Switcher Logic
    $('.lang-switch').click(function() {
        let currentLang = $('html').attr('lang');
        let nextLang = currentLang === 'bn' ? 'en' : 'bn';
        
        $('html').attr('lang', nextLang);
        $('body').toggleClass('en');
        $(this).text(nextLang === 'bn' ? 'English' : 'বাংলা');

        $('[data-bn]').each(function() {
            let bnContent = $(this).attr('data-bn');
            let enContent = $(this).attr('data-en');
            $(this).html(nextLang === 'en' ? enContent : bnContent);
        });

        // Re-trigger Typewriter if applicable
        initTypewriter(nextLang);
    });

    // Typewriter Effect
    function initTypewriter(lang) {
        const text = lang === 'bn' ? 'আপনার ব্যবসার জন্য হাই-কনভার্টিং ল্যান্ডিং পেজ' : 'High-Converting Landing Pages for Your Business';
        let i = 0;
        const target = $('.typewriter-text');
        target.text('');
        
        function type() {
            if (i < text.length) {
                target.append(text.charAt(i));
                i++;
                setTimeout(type, 50);
            }
        }
        type();
    }

    initTypewriter($('html').attr('lang'));

    // Smooth Scroll for Nav Links
    $('a.nav-link[href^="#"]').on('click', function(event) {
        event.preventDefault();
        $('html, body').animate({
            scrollTop: $($.attr(this, 'href')).offset().top - 80
        }, 800);
    });
});
