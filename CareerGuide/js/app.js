$(document).ready(function () {
    // --- Theme Management ---
    const body = $('body');
    const themeToggle = $('#themeToggle');
    const themeIcon = themeToggle.find('i');
    const prismTheme = $('#prism-theme');

    const themes = {
        light: 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism.min.css',
        dark: 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css'
    };

    function setTheme(theme) {
        if (theme === 'dark') {
            body.addClass('dark-mode').removeClass('light-mode');
            themeIcon.removeClass('fa-moon').addClass('fa-sun');
            prismTheme.attr('href', themes.dark);
        } else {
            body.addClass('light-mode').removeClass('dark-mode');
            themeIcon.removeClass('fa-sun').addClass('fa-moon');
            prismTheme.attr('href', themes.light);
        }
        localStorage.setItem('theme', theme);
    }

    // Load saved theme
    const currentTheme = localStorage.getItem('theme') || 'light';
    setTheme(currentTheme);

    themeToggle.on('click', function () {
        const newTheme = body.hasClass('light-mode') ? 'dark' : 'light';
        setTheme(newTheme);
    });

    // --- Sidebar Toggle ---
    const sidebar = $('#sidebar');
    const wrapper = $('.wrapper');
    const sidebarToggle = $('#sidebarToggle');

    const sidebarState = localStorage.getItem('sidebarState') || 'expanded';
    if (sidebarState === 'collapsed' && $(window).width() >= 992) {
        wrapper.addClass('sidebar-collapsed');
    }

    sidebarToggle.on('click', function () {
        if ($(window).width() < 992) {
            sidebar.toggleClass('show');
        } else {
            wrapper.toggleClass('sidebar-collapsed');
            const state = wrapper.hasClass('sidebar-collapsed') ? 'collapsed' : 'expanded';
            localStorage.setItem('sidebarState', state);
        }
    });

    $(document).on('click', function (e) {
        if ($(window).width() < 992) {
            if (!$(e.target).closest('#sidebar').length && !$(e.target).closest('#sidebarToggle').length) {
                sidebar.removeClass('show');
            }
        }
    });

    // --- Scroll Progress ---
    $(window).on('scroll', function() {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        $('#scrollProgress').css('width', scrolled + '%');
    });

    // --- Utility Functions ---
    function addCopyButtons() {
        $('pre').each(function () {
            const pre = $(this);
            if (pre.find('.copy-btn').length === 0) {
                const btn = $('<button class="btn btn-sm btn-outline-secondary copy-btn"><i class="far fa-copy"></i></button>');
                pre.prepend(btn);

                btn.on('click', function () {
                    const code = pre.find('code').text();
                    navigator.clipboard.writeText(code).then(() => {
                        btn.html('<i class="fas fa-check"></i>').addClass('btn-success').removeClass('btn-outline-secondary');
                        setTimeout(() => {
                            btn.html('<i class="far fa-copy"></i>').removeClass('btn-success').addClass('btn-outline-secondary');
                        }, 2000);
                    });
                });
            }
        });
    }

    addCopyButtons();

    // --- Search Logic (Per Page) ---
    $('#searchInput').on('keyup', function () {
        const value = $(this).val().toLowerCase();
        // Filter sections on the current page
        $('.topic-sections section').filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });
        // Also filter sidebar links
        $('#topicList .nav-item').filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });
    });
});
