$(document).ready(function() {
    
    // Sticky Header
    $(window).scroll(function() {
        if ($(this).scrollTop() > 50) {
            $('.header').addClass('sticky');
        } else {
            $('.header').removeClass('sticky');
        }
    });
    
    // Mobile Menu Toggle
    $('.mobile-toggle').click(function() {
        $(this).toggleClass('active');
        if($(this).hasClass('active')){
            $(this).html('<i class="fa-solid fa-xmark"></i>');
        } else {
            $(this).html('<i class="fa-solid fa-bars"></i>');
        }
    });

    // Scroll Animation Logic
    function checkVisibility() {
        var windowHeight = $(window).height();
        var windowTopPosition = $(window).scrollTop();
        var windowBottomPosition = (windowTopPosition + windowHeight);

        $('.slide-up').each(function() {
            var element = $(this);
            var elementHeight = element.outerHeight();
            var elementTopPosition = element.offset().top;
            var elementBottomPosition = (elementTopPosition + elementHeight);

            if ((elementBottomPosition >= windowTopPosition) &&
                (elementTopPosition <= windowBottomPosition)) {
                element.addClass('visible');
            }
        });
    }

    setTimeout(checkVisibility, 100);
    $(window).on('scroll resize', checkVisibility);
});
