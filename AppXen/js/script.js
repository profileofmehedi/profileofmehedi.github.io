document.addEventListener('DOMContentLoaded', () => {
    
    // =========================================
    // 1. THEME TOGGLE
    // =========================================
    const themeToggle = document.querySelector('.theme-toggle');
    const storedTheme = localStorage.getItem('theme');
    
    // Check local storage or system preference
    if (storedTheme === 'dark' || (!storedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.setAttribute('data-theme', 'dark');
        if(themeToggle) themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            let targetTheme = 'light';
            
            if (currentTheme !== 'dark') {
                targetTheme = 'dark';
                themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            } else {
                themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            }
            
            document.documentElement.setAttribute('data-theme', targetTheme);
            localStorage.setItem('theme', targetTheme);
        });
    }

    // =========================================
    // 2. MAGNETIC BUTTONS
    // =========================================
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const deltaX = (x - centerX) / 8; // Adjust strength
            const deltaY = (y - centerY) / 8;

            btn.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });

    // =========================================
    // 7. PRE-LOADER
    // =========================================
    const loader = document.getElementById('preloader');
    if (loader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                loader.style.opacity = '0';
                loader.style.visibility = 'hidden';
            }, 500); // Small delay for polish
        });
    }

    // =========================================
    // 8. TESTIMONIALS CAROUSEL
    // =========================================
    const slider = document.querySelector('.testimonial-slider');
    const items = document.querySelectorAll('.testimonial-item');
    const dots = document.querySelectorAll('.testimonial-dots .dot');
    let currentIndex = 0;
    let autoSlideInterval;

    function showTestimonial(index) {
        if (slider) {
            slider.style.transform = `translateX(-${index * 100}%)`;
            dots.forEach(dot => dot.classList.remove('active'));
            dots[index].classList.add('active');
            currentIndex = index;
        }
    }

    function startAutoSlide() {
        autoSlideInterval = setInterval(() => {
            let nextIndex = (currentIndex + 1) % items.length;
            showTestimonial(nextIndex);
        }, 5000); // 5 seconds
    }

    if (slider) {
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                showTestimonial(index);
                clearInterval(autoSlideInterval);
                startAutoSlide();
            });
        });
        startAutoSlide();
    }
                    // =========================================
    // 3. ANIMATED STATISTICS
    // =========================================
    const stats = document.querySelectorAll('.stat-number');
    let hasAnimatedStats = false;

    function animateStats() {
        stats.forEach(stat => {
            const target = +stat.getAttribute('data-target');
            const duration = 2000; // 2 seconds
            const increment = target / (duration / 16); // 60fps

            let current = 0;
            const updateCount = () => {
                current += increment;
                if (current < target) {
                    stat.innerText = Math.ceil(current);
                    requestAnimationFrame(updateCount);
                } else {
                    stat.innerText = target + "+"; // Add suffix
                }
            };
            updateCount();
        });
    }

    const statsSection = document.querySelector('.stats-container');
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !hasAnimatedStats) {
                animateStats();
                hasAnimatedStats = true;
            }
        });
        statsObserver.observe(statsSection);
    }

    // =========================================
    // 4. PARTICLE BACKGROUND
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
                // Use CSS variable for color adaptation
                this.color = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() || '#3b82f6';
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
                ctx.fillStyle = `rgba(59, 130, 246, 0.2)`; // Hardcoded subtle blue for consistency
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
                        ctx.strokeStyle = `rgba(59, 130, 246, ${0.1 * (1 - distance / connectionDistance)})`;
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
    // 5. UTILITIES (Scroll, Menu, Reveal)
    // =========================================
    const navbar = document.querySelector('.navbar');
    const backToTopBtn = document.getElementById('backToTop');
    const progressBar = document.getElementById('scrollProgress');
    const menuBtn = document.querySelector('.menu-btn');
    const navLinksContainer = document.querySelector('.nav-links');
    
    // Scroll Handler
    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;
        
        // Navbar
        if (scrollY > 50) navbar.classList.add('scrolled');
        else navbar.classList.remove('scrolled');

        // Back to Top
        if (scrollY > 300) backToTopBtn.classList.add('show');
        else backToTopBtn.classList.remove('show');

        // Progress Bar
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollY / totalHeight) * 100;
        if (progressBar) progressBar.style.width = progress + '%';

        // ScrollSpy
        document.querySelectorAll('section[id]').forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 100;
            const sectionId = current.getAttribute('id');
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                document.querySelector('.nav-links a[href*=' + sectionId + ']')?.classList.add('active');
            } else {
                document.querySelector('.nav-links a[href*=' + sectionId + ']')?.classList.remove('active');
            }
        });
    });

    // Mobile Menu
    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            navLinksContainer.classList.toggle('active');
            menuBtn.innerHTML = navLinksContainer.classList.contains('active') ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
        });
    }
    
    document.querySelectorAll('.nav-link').forEach(item => {
        item.addEventListener('click', () => {
            navLinksContainer.classList.remove('active');
            if(menuBtn) menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });

    // 3D Tilt for Cards
    document.querySelectorAll('.glass-card, .mockup-container, .stat-item, .bento-item').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -5;
            const rotateY = ((x - centerX) / centerX) * 5;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        });
    });

    // Reveal Animation
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    // Back to Top Click
    if(backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // FAQ Accordion
    document.querySelectorAll('.faq-header').forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const isActive = item.classList.contains('active');
            document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
            if (!isActive) item.classList.add('active');
        });
    });

    // =========================================
    // 6. AFFILIATE FORM SUBMISSION
    // =========================================
    const affiliateForm = document.getElementById('affiliateForm');
    if (affiliateForm) {
        affiliateForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = affiliateForm.querySelector('button');
            const originalContent = btn.innerHTML;
            
            const formData = {
                name: document.getElementById('affName').value,
                email: document.getElementById('affEmail').value,
                phone: document.getElementById('affPhone').value,
                details: document.getElementById('affExp').value
            };
            
            // Show loading state
            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> প্রসেসিং হচ্ছে...';
            
            try {
                const response = await fetch('https://master.nextxenit.com/api/NextXenAffiliate', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });
                
                const result = await response.json();
                
                if (response.ok) {
                    btn.innerHTML = '<i class="fas fa-check"></i> আবেদন সফল হয়েছে!';
                    btn.style.background = '#16a34a'; // Success color
                    
                    alert('ধন্যবাদ! ' + (result.message || 'আপনার অ্যাফিলিয়েট আবেদনটি সফলভাবে জমা হয়েছে।') + ' আমাদের টিম খুব শীঘ্রই আপনার সাথে যোগাযোগ করবে।');
                    
                    affiliateForm.reset();
                } else {
                    throw new Error(result.message || 'Error occurred');
                }
            } catch (error) {
                console.error('Affiliate submission error:', error);
                btn.innerHTML = '<i class="fas fa-times"></i> ত্রুটি হয়েছে!';
                btn.style.background = '#ef4444'; // Error color
                alert('দুঃখিত, একটি সমস্যা হয়েছে। দয়া করে পুনরায় চেষ্টা করুন।');
            } finally {
                // Reset button after 3 seconds
                setTimeout(() => {
                    btn.disabled = false;
                    btn.innerHTML = originalContent;
                    btn.style.background = ''; // Reset to default
                }, 3000);
            }
        });
    }

    // =========================================
    // 9. PROJECT REQUEST FORM SUBMISSION
    // =========================================
    const projectForm = document.getElementById('projectForm');
    if (projectForm) {
        projectForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = projectForm.querySelector('button');
            const originalContent = btn.innerHTML;
            
            const formData = {
                name: document.getElementById('contactName').value,
                email: document.getElementById('contactEmail').value,
                mobile: document.getElementById('contactMobile').value,
                projectName: document.getElementById('projectSelect').options[document.getElementById('projectSelect').selectedIndex].text,
                body: document.getElementById('contactMessage').value
            };
            
            // Show loading state
            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> প্রসেসিং হচ্ছে...';
            
            try {
                const response = await fetch('https://master.nextxenit.com/api/ProjectRequest', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });
                
                const result = await response.json();
                
                if (response.ok) {
                    btn.innerHTML = '<i class="fas fa-check"></i> বার্তা সফলভাবে পাঠানো হয়েছে!';
                    btn.style.background = '#16a34a'; // Success color
                    
                    alert('ধন্যবাদ! ' + (result.message || 'আপনার প্রজেক্ট রিকোয়েস্টটি সফলভাবে জমা হয়েছে।') + ' আমাদের টিম খুব শীঘ্রই আপনার সাথে যোগাযোগ করবে।');
                    
                    projectForm.reset();
                } else {
                    throw new Error(result.message || 'Error occurred');
                }
            } catch (error) {
                console.error('Project request error:', error);
                btn.innerHTML = '<i class="fas fa-times"></i> ত্রুটি হয়েছে!';
                btn.style.background = '#ef4444'; // Error color
                alert('দুঃখিত, একটি সমস্যা হয়েছে। দয়া করে পুনরায় চেষ্টা করুন।');
            } finally {
                // Reset button after 3 seconds
                setTimeout(() => {
                    btn.disabled = false;
                    btn.innerHTML = originalContent;
                    btn.style.background = ''; // Reset to default
                }, 3000);
            }
        });
    }
});