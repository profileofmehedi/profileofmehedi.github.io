document.addEventListener('DOMContentLoaded', () => {
    
    // =========================================
    // 1. SUBTLE PARTICLE BACKGROUND
    // =========================================
    const canvas = document.getElementById('hero-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];
        
        const particleCount = 60;
        const connectionDistance = 140;
        const mouseDistance = 180;

        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        }

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.4;
                this.vy = (Math.random() - 0.5) * 0.4;
                this.size = Math.random() * 2 + 1;
                this.color = `rgba(37, 99, 235, ${Math.random() * 0.15 + 0.05})`; 
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
            }
        }

        function initParticles() {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }

        let mouse = { x: null, y: null };
        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        function animate() {
            ctx.clearRect(0, 0, width, height);
            particles.forEach((p, index) => {
                p.update();
                p.draw();
                for (let j = index + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < connectionDistance) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(37, 99, 235, ${0.1 * (1 - distance / connectionDistance)})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }
                if (mouse.x != null) {
                    const dx = p.x - mouse.x;
                    const dy = p.y - mouse.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < mouseDistance) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(124, 58, 237, ${0.2 * (1 - distance / mouseDistance)})`; 
                        ctx.lineWidth = 0.8;
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(mouse.x, mouse.y);
                        ctx.stroke();
                    }
                }
            });
            requestAnimationFrame(animate);
        }

        window.addEventListener('resize', () => {
            resize();
            initParticles();
        });

        resize();
        initParticles();
        animate();
    }

    // =========================================
    // 2. NAVBAR SCROLL & SCROLLSPY
    // =========================================
    const navbar = document.querySelector('.navbar');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function scrollActive() {
        const scrollY = window.pageYOffset;

        // Navbar scrolled state
        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // ScrollSpy
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 100;
            const sectionId = current.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                document.querySelector('.nav-links a[href*=' + sectionId + ']')?.classList.add('active');
            } else {
                document.querySelector('.nav-links a[href*=' + sectionId + ']')?.classList.remove('active');
            }
        });
    }

    window.addEventListener('scroll', scrollActive);
    scrollActive(); // Initial check

    // =========================================
    // 3. MOBILE MENU
    // =========================================
    const menuBtn = document.querySelector('.menu-btn');
    const navLinksContainer = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-link');

    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            const isOpen = navLinksContainer.classList.contains('active');
            if (isOpen) {
                navLinksContainer.classList.remove('active');
                menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                document.body.style.overflow = 'auto';
            } else {
                navLinksContainer.classList.add('active');
                menuBtn.innerHTML = '<i class="fas fa-times"></i>';
                document.body.style.overflow = 'hidden'; // Prevent scroll when menu is open
            }
        });
    }

    // Close menu when clicking a link
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navLinksContainer.classList.remove('active');
            if (menuBtn) {
                menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                document.body.style.overflow = 'auto';
            }
        });
    });

    // =========================================
    // 4. INTERSECTION OBSERVER (REVEAL)
    // =========================================
    const observerOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    // =========================================
    // 5. FAQ ACCORDION
    // =========================================
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const header = item.querySelector('.faq-header');
                header.addEventListener('click', () => {
                    const isActive = item.classList.contains('active');
                    faqItems.forEach(i => i.classList.remove('active'));
                    if (!isActive) item.classList.add('active');
                });
            });
        
            // =========================================
            // 6. BACK TO TOP
            // =========================================
            const backToTopBtn = document.getElementById('backToTop');
        
            function toggleBackToTop() {
                if (window.pageYOffset > 300) {
                    backToTopBtn.classList.add('show');
                } else {
                    backToTopBtn.classList.remove('show');
                }
            }
        
            window.addEventListener('scroll', toggleBackToTop);
        
            backToTopBtn.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        
        });
        