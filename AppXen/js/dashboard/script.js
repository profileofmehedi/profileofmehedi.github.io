document.addEventListener('DOMContentLoaded', () => {
    
    // Toggle Sidebar
    const sidebarToggle = document.getElementById('sidebarToggle');
    const layout = document.querySelector('.dashboard-layout');
    
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            layout.classList.toggle('collapsed');
        });
    }

    // Active Link Highlight
    const currentPath = window.location.pathname;
    const menuLinks = document.querySelectorAll('.menu-item a');
    
    menuLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });

});
