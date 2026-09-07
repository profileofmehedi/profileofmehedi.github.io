$(document).ready(function() {
    
    // Set Current Year in Footer
    $('#year').text(new Date().getFullYear());

    // Navbar Scroll Effect
    $(window).scroll(function() {
        if ($(this).scrollTop() > 50) {
            $('.custom-nav').addClass('scrolled');
        } else {
            $('.custom-nav').removeClass('scrolled');
        }
    });

    // Smooth Scrolling for Nav Links
    $('a.nav-link, .btn[href^="#"]').on('click', function(event) {
        if (this.hash !== "") {
            event.preventDefault();
            var hash = this.hash;
            
            // Close mobile menu if open
            if ($('.navbar-collapse').hasClass('show')) {
                $('.navbar-toggler').click();
            }

            $('html, body').animate({
                scrollTop: $(hash).offset().top - 80 // Offset for sticky navbar
            }, 800);
        }
    });

    // Lead Generation Form Submit (Mock)
    $('#growthForm').on('submit', function(e) {
        e.preventDefault();
        
        // Change button state to show loading
        const btn = $(this).find('button[type="submit"]');
        const originalText = btn.html();
        btn.html('<i class="fa-solid fa-circle-notch fa-spin"></i> Submitting Request...');
        btn.prop('disabled', true);

        // Simulate API call
        setTimeout(function() {
            btn.removeClass('btn-accent').addClass('bg-success text-white border-0');
            btn.html('Audit Request Received! <i class="fa-solid fa-check ms-2"></i>');
            $('#growthForm')[0].reset();
            
            // Revert button after 4 seconds
            setTimeout(function() {
                btn.removeClass('bg-success text-white border-0').addClass('btn-accent');
                btn.html(originalText);
                btn.prop('disabled', false);
            }, 4000);
            
        }, 1500);
    });

    // Number Counter Animation
    function animateCounters() {
        $('.counter').each(function () {
            var $this = $(this);
            var target = parseInt($this.attr('data-target'));
            
            // Only animate once
            if (!$this.hasClass('counted')) {
                $({ Counter: 0 }).animate({ Counter: target }, {
                    duration: 2000,
                    easing: 'swing',
                    step: function () {
                        $this.text(Math.ceil(this.Counter));
                    },
                    complete: function() {
                        $this.text(target);
                        $this.addClass('counted');
                    }
                });
            }
        });
    }

    // Scroll Reveal Animation
    function reveal() {
        var reveals = document.querySelectorAll(".reveal");
        var windowHeight = window.innerHeight;

        for (var i = 0; i < reveals.length; i++) {
            var elementTop = reveals[i].getBoundingClientRect().top;
            var elementVisible = 50; // pixels visible before triggering

            if (elementTop < windowHeight - elementVisible) {
                reveals[i].classList.add("active");
                
                // Trigger counter animation if stats section is revealed
                if ($(reveals[i]).find('.counter').length > 0) {
                    animateCounters();
                }
            }
        }
    }
    
    // Initial check
    reveal();
    
    // Check on scroll
    window.addEventListener("scroll", reveal);
});
