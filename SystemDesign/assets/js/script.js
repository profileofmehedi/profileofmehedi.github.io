document.addEventListener('DOMContentLoaded', () => {
    const themeBtn = document.getElementById('theme-toggle');
    const body = document.body;
    
    // Check saved theme
    if(localStorage.getItem('theme') === 'dark') {
        body.classList.add('dark-mode');
        if(themeBtn) themeBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
    }

    // Toggle Theme
    if(themeBtn) {
        themeBtn.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            if(body.classList.contains('dark-mode')) {
                localStorage.setItem('theme', 'dark');
                themeBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
            } else {
                localStorage.setItem('theme', 'light');
                themeBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
            }
        });
    }

    // Mobile Sidebar Toggle
    const mobileBtn = document.getElementById('mobile-toggle');
    const sidebar = document.getElementById('sidebar');
    
    if(mobileBtn && sidebar) {
        mobileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            sidebar.classList.toggle('open');
            if(sidebar.classList.contains('open')) {
                mobileBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
            } else {
                mobileBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
            }
        });

        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', (e) => {
            if(window.innerWidth <= 992 && sidebar.classList.contains('open') && !sidebar.contains(e.target) && e.target !== mobileBtn) {
                sidebar.classList.remove('open');
                mobileBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
            }
        });
    }
});