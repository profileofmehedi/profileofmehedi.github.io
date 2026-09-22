$(document).ready(function() {
    
    // Sticky Header
    $(window).scroll(function() {
        if ($(this).scrollTop() > 100) {
            $('.header').addClass('sticky');
        } else {
            $('.header').removeClass('sticky');
        }
    });
    
    // Mobile Menu Toggle (Simple visual effect for now)
    $('.mobile-toggle').click(function() {
        $(this).toggleClass('active');
        if($(this).hasClass('active')){
            $(this).html('<i class="fa-solid fa-xmark"></i>');
            // Normally you would slide down a mobile menu here
        } else {
            $(this).html('<i class="fa-solid fa-bars"></i>');
        }
    });

    // Scroll Animation Logic
    function checkVisibility() {
        var windowHeight = $(window).height();
        var windowTopPosition = $(window).scrollTop();
        var windowBottomPosition = (windowTopPosition + windowHeight);

        $('.slide-up, .fade-in, .slide-left, .slide-right').each(function() {
            var element = $(this);
            var elementHeight = element.outerHeight();
            var elementTopPosition = element.offset().top;
            var elementBottomPosition = (elementTopPosition + elementHeight);

            // Check to see if this current container is within viewport
            if ((elementBottomPosition >= windowTopPosition) &&
                (elementTopPosition <= windowBottomPosition)) {
                element.addClass('visible');
            }
        });
    }

    // Trigger on load
    setTimeout(checkVisibility, 100);

    // Trigger on scroll
    $(window).on('scroll resize', checkVisibility);
});
