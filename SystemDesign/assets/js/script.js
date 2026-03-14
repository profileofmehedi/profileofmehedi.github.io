document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('sidebar-toggle');
    const mobileBtn = document.getElementById('mobile-toggle');
    const themeBtn = document.getElementById('theme-toggle');
    const content = document.querySelector('.main-content');
    const header = document.querySelector('.top-header');

    // Sidebar Collapse Logic
    function toggleSidebar() {
        sidebar.classList.toggle('collapsed');
        content.classList.toggle('expanded');
        header.classList.toggle('expanded');
        
        // Save state
        localStorage.setItem('sidebar-collapsed', sidebar.classList.contains('collapsed'));
    }

    if (toggleBtn) toggleBtn.addEventListener('click', toggleSidebar);
    if (mobileBtn) mobileBtn.addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });

    // Theme Logic
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        themeBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
    }

    themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        themeBtn.innerHTML = isDark ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
    });

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 1024 && !sidebar.contains(e.target) && !mobileBtn.contains(e.target)) {
            sidebar.classList.remove('open');
        }
    });
});