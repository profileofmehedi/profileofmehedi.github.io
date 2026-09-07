/*
 * MediCare Profile - Main JS
 */

$(document).ready(function() {
    
    // 1. Sticky Navbar on scroll
    $(window).scroll(function() {
        if ($(this).scrollTop() > 50) {
            $('.navbar').addClass('scrolled');
        } else {
            $('.navbar').removeClass('scrolled');
        }
    });

    // Initialize state if loaded not at top
    if ($(window).scrollTop() > 50) {
        $('.navbar').addClass('scrolled');
    }

    // 2. Smooth Scrolling for Anchor Links
    $('a[href^="#"]').on('click', function(event) {
        var target = $(this.getAttribute('href'));
        if( target.length ) {
            event.preventDefault();
            // Close mobile menu if open
            if ($('.navbar-collapse').hasClass('show')) {
                $('.navbar-toggler').click();
            }
            $('html, body').stop().animate({
                scrollTop: target.offset().top - 80 // offset for fixed header
            }, 800, 'swing');
        }
    });

    // Active state in navbar on scroll
    $(window).on('scroll', function() {
        var scrollPos = $(document).scrollTop();
        $('.nav-link').each(function () {
            var currLink = $(this);
            var refElement = $(currLink.attr("href"));
            if (refElement.length && refElement.position().top - 100 <= scrollPos && refElement.position().top + refElement.height() > scrollPos) {
                $('.nav-link').removeClass("active");
                currLink.addClass("active");
            }
        });
    });

    // 3. Appointment Form Validation & Submission Mock
    $('#appointmentForm').on('submit', function(e) {
        e.preventDefault();
        
        let isValid = true;
        const name = $('#patientName').val().trim();
        const phone = $('#patientPhone').val().trim();
        const date = $('#prefDate').val().trim();
        const service = $('#serviceSelect').val();

        // Simple validation
        if(!name) {
            $('#patientName').addClass('is-invalid');
            isValid = false;
        } else {
            $('#patientName').removeClass('is-invalid');
        }

        if(!phone) {
            $('#patientPhone').addClass('is-invalid');
            isValid = false;
        } else {
            $('#patientPhone').removeClass('is-invalid');
        }

        if(!date) {
            $('#prefDate').addClass('is-invalid');
            isValid = false;
        } else {
            $('#prefDate').removeClass('is-invalid');
        }

        if(!service) {
            $('#serviceSelect').addClass('is-invalid');
            isValid = false;
        } else {
            $('#serviceSelect').removeClass('is-invalid');
        }

        if(isValid) {
            // Show loading state
            const btn = $(this).find('button[type="submit"]');
            const originalText = btn.html();
            btn.html('<i class="fas fa-spinner fa-spin me-2"></i>Booking...').prop('disabled', true);

            // Mock API Call Delay
            setTimeout(() => {
                // Success State
                $('#formMessage').html(`
                    <div class="alert alert-success alert-dismissible fade show" role="alert">
                        <strong><i class="fas fa-check-circle me-2"></i>Appointment Requested!</strong><br>
                        Thank you, ${name}. Your request for ${service} on ${date} has been received. Our team will contact you shortly to confirm the time.
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                `);
                
                // Reset form
                $('#appointmentForm')[0].reset();
                btn.html(originalText).prop('disabled', false);
            }, 1500);
        }
    });

    // Remove is-invalid class on input
    $('.form-control, .form-select').on('input change', function() {
        $(this).removeClass('is-invalid');
    });

});
