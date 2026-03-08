// Initialize AOS (Animate On Scroll)
AOS.init({
    duration: 800,
    once: true,
    offset: 100
});

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
