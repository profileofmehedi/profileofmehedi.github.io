// Initialize AOS (Animate On Scroll)
AOS.init({
    duration: 800,
    once: true,
    offset: 100
});

// Force scroll to top on reload
if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Typed.js Initialization (Hero text typing effect)
if (document.getElementById('typed-text')) {
    new Typed('#typed-text', {
        strings: ['Lead .NET Developer.', 'System Architect.', 'FinTech Specialist.', 'Problem Solver.'],
        typeSpeed: 50,
        backSpeed: 30,
        backDelay: 2000,
        loop: true,
        cursorChar: '|',
        autoInsertCss: true
    });
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 70, // Adjust for fixed header
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            const navbarCollapse = document.querySelector('.navbar-collapse');
            if (navbarCollapse.classList.contains('show')) {
                document.querySelector('.navbar-toggler').click();
            }
        }
    });
});

// Number Counter Animation
const counters = document.querySelectorAll('.counter');
const speed = 200; // lower is slower

const animateCounters = () => {
    counters.forEach(counter => {
        const updateCount = () => {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText;
            const inc = target / speed;

            if (count < target) {
                counter.innerText = Math.ceil(count + inc);
                setTimeout(updateCount, 30);
            } else {
                counter.innerText = target;
            }
        };
        updateCount();
    });
};

// Trigger counter animation on scroll into view
let counterStarted = false;
window.addEventListener('scroll', () => {
    const statsSection = document.querySelector('.bg-primary.text-white');
    if (statsSection && !counterStarted) {
        const sectionPos = statsSection.getBoundingClientRect().top;
        const screenPos = window.innerHeight;
        
        if(sectionPos < screenPos - 50){
            animateCounters();
            counterStarted = true;
        }
    }
});

// Contact Form Handling
const contactForm = document.getElementById('portfolio-contact');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const btn = contactForm.querySelector('button');
        const originalText = btn.innerHTML;
        
        btn.innerHTML = '<i class="fas fa-circle-notch fa-spin me-2"></i>Sending...';
        btn.disabled = true;

        // Simulate API call
        setTimeout(() => {
            // Change button to success state temporarily
            btn.innerHTML = '<i class="fas fa-check me-2"></i>Message Sent!';
            btn.classList.remove('btn-primary');
            btn.classList.add('btn-success');
            
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.classList.remove('btn-success');
                btn.classList.add('btn-primary');
                btn.disabled = false;
                contactForm.reset();
            }, 3000);
            
        }, 1500);
    });
}

// Active Nav Link updating on Scroll
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= (sectionTop - 150)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Set current year in footer
const yearEl = document.getElementById('current-year');
if(yearEl) {
    yearEl.textContent = new Date().getFullYear();
}

// Back to Top Button Logic
const backToTopBtn = document.getElementById('back-to-top');
if (backToTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.style.display = 'flex';
        } else {
            backToTopBtn.style.display = 'none';
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Contact Speed Dial Logic
const speedDial = document.querySelector('.contact-speed-dial');
const dialMainBtn = document.querySelector('.dial-main-btn');

if (speedDial && dialMainBtn) {
    dialMainBtn.addEventListener('click', () => {
        speedDial.classList.toggle('active');
    });

    // Close speed dial when clicking outside
    document.addEventListener('click', (e) => {
        if (!speedDial.contains(e.target)) {
            speedDial.classList.remove('active');
        }
    });
}

// Session Timer Logic
const timerDisplay = document.getElementById('timer-display');
if (timerDisplay) {
    // Check if session start time exists, if not set it
    let startTime = sessionStorage.getItem('session_start_time');
    if (!startTime) {
        startTime = Date.now();
        sessionStorage.setItem('session_start_time', startTime);
    } else {
        startTime = parseInt(startTime);
    }
    
    function updateTimer() {
        const now = Date.now();
        const seconds = Math.floor((now - startTime) / 1000);
        
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        
        const display = [
            hrs.toString().padStart(2, '0'),
            mins.toString().padStart(2, '0'),
            secs.toString().padStart(2, '0')
        ].join(':');
        
        timerDisplay.textContent = display;
    }
    
    // Update immediately and then every second
    updateTimer();
    setInterval(updateTimer, 1000);
}

// 1. Theme Toggle Logic
const themeToggle = document.getElementById('theme-toggle');
const rootElement = document.documentElement;
const icon = themeToggle ? themeToggle.querySelector('i') : null;

// Check for saved theme preference or use system preference
const savedTheme = localStorage.getItem('theme');
const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

if (savedTheme === 'light' || (!savedTheme && prefersLight)) {
    rootElement.setAttribute('data-theme', 'light');
    if(icon) { icon.classList.remove('fa-moon'); icon.classList.add('fa-sun'); }
}

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        if (rootElement.getAttribute('data-theme') === 'light') {
            rootElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'dark');
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        } else {
            rootElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        }
    });
}

// 2. Terminal Overlay Logic
const terminalOverlay = document.getElementById('terminal-overlay');
const terminalInput = document.getElementById('terminal-input');
const terminalBody = document.getElementById('terminal-body');
const closeTerminal = document.getElementById('close-terminal');

if (terminalOverlay && terminalInput) {
    // Keyboard shortcut to open (Ctrl + ~ or Ctrl + `)
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && (e.key === '`' || e.key === '~')) {
            e.preventDefault();
            terminalOverlay.classList.toggle('active');
            if (terminalOverlay.classList.contains('active')) {
                setTimeout(() => terminalInput.focus(), 100);
            }
        }
    });

    closeTerminal.addEventListener('click', () => {
        terminalOverlay.classList.remove('active');
    });

    // Handle commands
    terminalInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const command = terminalInput.value.trim().toLowerCase();
            terminalInput.value = '';
            
            if (command) {
                printToTerminal(`<span class="text-white">$ ${command}</span>`);
                processCommand(command);
            }
        }
    });

    function printToTerminal(html) {
        const p = document.createElement('p');
        p.innerHTML = html;
        terminalBody.appendChild(p);
        terminalBody.scrollTop = terminalBody.scrollHeight;
    }

    function processCommand(cmd) {
        switch(cmd) {
            case 'help':
                printToTerminal('<span class="output">Available commands: help, whoami, skills, experience, projects, contact, resume, theme, clear, exit</span>');
                break;
            case 'whoami':
                printToTerminal('<span class="output">Mehedi Hasan - Lead .NET Developer & System Architect. I build high-performance, secure Fintech systems.</span>');
                break;
            case 'skills':
                printToTerminal('<span class="output">Backend: .NET Core, C#, Web API, Microservices<br>Frontend: Angular, React, TypeScript, Bootstrap<br>Database: SQL Server, Oracle 12c, Redis<br>Tools: Docker, Git, Jira, CI/CD</span>');
                break;
            case 'experience':
                printToTerminal('<span class="output">2023-Now: Lead Developer @ Digital Banking<br>2021-2023: Senior Engineer @ Core Banking API<br>2019-2021: Refactoring Specialist @ National Bank HR System</span>');
                break;
            case 'projects':
                printToTerminal('<span class="output">1. Architecting Microservices<br>2. Digital Banking System<br>3. HR & Payroll System<br>Type "help" for more.</span>');
                break;
            case 'contact':
                printToTerminal('<span class="output">Email: mehedihasan9339@gmail.com<br>WhatsApp: +8801735224039<br>LinkedIn: linkedin.com/in/mehedi9339</span>');
                break;
            case 'resume':
                printToTerminal('<span class="output">Opening resume...</span>');
                window.open('portfolio/resume-mehedi.html', '_blank');
                break;
            case 'theme':
                printToTerminal('<span class="output">Toggling system theme...</span>');
                if (themeToggle) themeToggle.click();
                break;
            case 'exit':
                printToTerminal('<span class="output">Terminating session...</span>');
                setTimeout(() => terminalOverlay.classList.remove('active'), 500);
                break;
            case 'clear':
                terminalBody.innerHTML = '<p>Welcome to Mehedi\'s System Terminal. Type \'help\' to see available commands.</p>';
                break;
            default:
                printToTerminal(`<span class="error">Command not found: ${cmd}. Type "help" for list.</span>`);
        }
    }
}

// 3. API Health Check Simulation
const apiPing = document.getElementById('api-ping');
const apiReqs = document.getElementById('api-reqs');

if (apiPing && apiReqs) {
    setInterval(() => {
        // Randomize ping between 20ms and 80ms
        const ping = Math.floor(Math.random() * 60) + 20;
        apiPing.textContent = `${ping}ms`;
        
        // Randomize requests around 1.2k - 1.5k
        const reqs = (Math.random() * (1.5 - 1.1) + 1.1).toFixed(1);
        apiReqs.textContent = `${reqs}k`;
        
        // Visual indicator ping
        const dot = document.querySelector('.status-dot');
        if (dot) {
            dot.style.transform = 'scale(1.5)';
            dot.style.boxShadow = '0 0 15px #2ecc71';
            setTimeout(() => {
                dot.style.transform = 'scale(1)';
                dot.style.boxShadow = '0 0 8px #2ecc71';
            }, 200);
        }
    }, 2000);
}

// 4. Mermaid.js Initialization
document.addEventListener('DOMContentLoaded', () => {
    if (typeof mermaid !== 'undefined') {
        mermaid.initialize({
            startOnLoad: true,
            theme: 'default',
            securityLevel: 'loose'
        });
        
        // Re-render when modals are opened to fix sizing issues
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.addEventListener('shown.bs.modal', () => {
                // Trigger window resize to force mermaid to redraw bounds if needed
                window.dispatchEvent(new Event('resize'));
            });
        });
    }
    
    // 5. Mock Technical Blog Fetching
    const blogContainer = document.getElementById('blog-container');
    if (blogContainer) {
        // Mock data representing latest articles
        const mockArticles = [
            {
                title: 'CQRS and Event Sourcing in .NET Core',
                date: 'Oct 12, 2024',
                excerpt: 'Exploring how separating read and write models can drastically improve the performance and scalability of complex FinTech applications.',
                link: 'https://coding-drop.github.io'
            },
            {
                title: 'Optimizing Oracle PL/SQL for High Throughput',
                date: 'Sep 28, 2024',
                excerpt: 'A case study on reducing legacy query execution times by 60% using advanced indexing and bulk processing techniques.',
                link: 'https://coding-drop.github.io'
            },
            {
                title: 'Implementing e-KYC Workflows Safely',
                date: 'Aug 15, 2024',
                excerpt: 'Security best practices when integrating third-party mobile banking and identity verification APIs into your core systems.',
                link: 'https://coding-drop.github.io'
            }
        ];

        // Simulate network delay
        setTimeout(() => {
            blogContainer.innerHTML = ''; // Clear loading spinner
            
            mockArticles.forEach((article, index) => {
                const col = document.createElement('div');
                col.className = 'col-lg-4 col-md-6';
                col.setAttribute('data-aos', 'fade-up');
                col.setAttribute('data-aos-delay', `${(index + 1) * 100}`);
                
                col.innerHTML = `
                    <div class="blog-card">
                        <div class="blog-date"><i class="far fa-calendar-alt me-2"></i>${article.date}</div>
                        <h4 class="blog-title">${article.title}</h4>
                        <p class="blog-excerpt">${article.excerpt}</p>
                        <a href="${article.link}" target="_blank" class="text-primary text-decoration-none fw-bold mt-auto">Read Full Article <i class="fas fa-long-arrow-alt-right ms-1"></i></a>
                    </div>
                `;
                blogContainer.appendChild(col);
            });
        }, 1500);
    }
});
