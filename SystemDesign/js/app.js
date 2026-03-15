document.addEventListener('DOMContentLoaded', () => {
    // Theme Toggle
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;
    
    // Check local storage for theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        themeToggleBtn.textContent = '☀️';
    } else {
        themeToggleBtn.textContent = '🌙';
    }

    themeToggleBtn.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        if (body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
            themeToggleBtn.textContent = '☀️';
        } else {
            localStorage.setItem('theme', 'light');
            themeToggleBtn.textContent = '🌙';
        }
    });

    // Mobile Sidebar Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const sidebar = document.getElementById('sidebar');

    mobileMenuBtn.addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            if (!sidebar.contains(e.target) && e.target !== mobileMenuBtn) {
                sidebar.classList.remove('open');
            }
        }
    });

    // Scroll Progress Bar
    const progressBar = document.getElementById('progress-bar');
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + '%';
    });

    // Accordion Sidebar Sections
    const sidebarHeadings = document.querySelectorAll('.sidebar-heading');
    sidebarHeadings.forEach(heading => {
        heading.addEventListener('click', () => {
            const section = heading.parentElement;
            section.classList.toggle('active');
            
            // Optional: Close other sections
            // sidebarHeadings.forEach(otherHeading => {
            //     if (otherHeading !== heading) {
            //         otherHeading.parentElement.classList.remove('active');
            //     }
            // });
        });
    });

    // Search functionality
    const searchInput = document.querySelector('.search-box input');
    if(searchInput) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            const links = document.querySelectorAll('.sidebar-links li a');
            
            links.forEach(link => {
                const text = link.textContent.toLowerCase();
                if (text.includes(term)) {
                    link.parentElement.style.display = 'block';
                    // Open parent section if match found
                    link.closest('.sidebar-section').classList.add('active');
                } else {
                    link.parentElement.style.display = 'none';
                }
            });
            
            if(term === '') {
                links.forEach(link => {
                    link.parentElement.style.display = 'block';
                });
            }
        });
    }

    // Highlight Active Link and open its section
    const currentUrl = window.location.pathname.split('/').pop() || 'index.html';
    const sidebarLinks = document.querySelectorAll('.sidebar-links li a');
    let foundActive = false;
    
    sidebarLinks.forEach(link => {
        const href = link.getAttribute('href');
        // Handle case where we are in a subfolder or root
        if (href && (href.endsWith(currentUrl) || (currentUrl === '' && href.endsWith('index.html')))) {
            link.classList.add('active');
            const parentSection = link.closest('.sidebar-section');
            if (parentSection) {
                parentSection.classList.add('active');
            }
            foundActive = true;
        }
    });

    // Fallback if no exact match (e.g., just opened root)
    if (!foundActive && currentUrl === 'index.html') {
        const firstLink = document.querySelector('.sidebar-links li a');
        if (firstLink) {
            firstLink.closest('.sidebar-section').classList.add('active');
        }
    }

    // Copy Code Button
    const preBlocks = document.querySelectorAll('pre');
    preBlocks.forEach(pre => {
        const button = document.createElement('button');
        button.className = 'copy-btn';
        button.innerText = 'Copy';
        pre.appendChild(button);

        button.addEventListener('click', () => {
            const code = pre.querySelector('code');
            if (code) {
                navigator.clipboard.writeText(code.innerText).then(() => {
                    button.innerText = 'Copied!';
                    setTimeout(() => {
                        button.innerText = 'Copy';
                    }, 2000);
                });
            }
        });
    });
    
    // Smooth scrolling for anchor links inside content
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if(target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
});
