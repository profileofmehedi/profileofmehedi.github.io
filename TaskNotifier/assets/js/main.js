/* 
   ==========================================================================
   Corporate Smart Assistant - Main JS (jQuery)
   ==========================================================================
*/

$(document).ready(function() {
    // Sidebar Toggle
    $('#sidebarToggle').on('click', function() {
        $('.sidebar').toggleClass('active');
    });

    // Smooth Scrolling
    $('a.nav-link').on('click', function(event) {
        if (this.hash !== "") {
            event.preventDefault();
            var hash = this.hash;
            $('html, body').animate({
                scrollTop: $(hash).offset().top - 70
            }, 800);
        }
    });

    // Task Completion Toggle
    $(document).on('change', '.task-checkbox', function() {
        $(this).closest('.task-item').toggleClass('completed');
    });

    // AI Assistant Chat Interaction
    $('#chat-form').on('submit', function(e) {
        e.preventDefault();
        const input = $('#chat-input').val();
        if (input.trim() !== "") {
            // Add user message
            $('.chat-container').append(`
                <div class="chat-bubble user">
                    ${input}
                </div>
            `);
            $('#chat-input').val('');
            
            // Auto-scroll
            $('.chat-container').animate({ scrollTop: $('.chat-container')[0].scrollHeight }, 500);

            // Simulate AI response
            setTimeout(function() {
                $('.chat-container').append(`
                    <div class="chat-bubble bot">
                        I'm processing your request for "${input}". How else can I assist you today?
                    </div>
                `);
                $('.chat-container').animate({ scrollTop: $('.chat-container')[0].scrollHeight }, 500);
            }, 1000);
        }
    });

    // Animated Counters for Dashboard
    $('.counter').each(function () {
        $(this).prop('Counter',0).animate({
            Counter: $(this).text()
        }, {
            duration: 2000,
            easing: 'swing',
            step: function (now) {
                $(this).text(Math.ceil(now));
            }
        });
    });

    // Form Validation (Simple visual feedback)
    $('.needs-validation').on('submit', function(e) {
        if (!this.checkValidity()) {
            e.preventDefault();
            e.stopPropagation();
        }
        $(this).addClass('was-validated');
    });

    // Button Click Animation (Scaling effect handled via CSS, but adding feedback here)
    $('.btn').on('mousedown', function() {
        $(this).css('transform', 'scale(0.95)');
    }).on('mouseup mouseleave', function() {
        $(this).css('transform', 'scale(1)');
    });
});
