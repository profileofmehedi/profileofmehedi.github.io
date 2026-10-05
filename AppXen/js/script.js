document.addEventListener('DOMContentLoaded', () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const API_BASE = 'https://master.nextxenit.com/api';

    // Directory URLs like "./" don't resolve to index.html when opened via file://
    if (location.protocol === 'file:') {
        document.querySelectorAll('a[href="./"], a[href^="./#"]').forEach(a => {
            a.setAttribute('href', 'index.html' + a.getAttribute('href').slice(2));
        });
    }

    // =========================================
    // TOAST NOTIFICATIONS
    // =========================================
    let toastContainer = null;
    function showToast(message, type = 'success') {
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.className = 'toast-container';
            toastContainer.setAttribute('role', 'status');
            toastContainer.setAttribute('aria-live', 'polite');
            document.body.appendChild(toastContainer);
        }
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        const icon = type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation';
        toast.innerHTML = `<i class="fas ${icon}" aria-hidden="true"></i><span></span>`;
        toast.querySelector('span').textContent = message;
        toastContainer.appendChild(toast);
        requestAnimationFrame(() => toast.classList.add('show'));
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 400);
        }, 5000);
    }

    // =========================================
    // THEME TOGGLE
    // =========================================
    const themeToggle = document.querySelector('.theme-toggle');
    const setThemeIcon = () => {
        if (!themeToggle) return;
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        themeToggle.innerHTML = `<i class="fas ${isDark ? 'fa-sun' : 'fa-moon'}" aria-hidden="true"></i>`;
        themeToggle.setAttribute('aria-label', isDark ? 'লাইট মোড চালু করুন' : 'ডার্ক মোড চালু করুন');
    };
    setThemeIcon();

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            const targetTheme = isDark ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', targetTheme);
            localStorage.setItem('theme', targetTheme);
            setThemeIcon();
        });
    }

    // =========================================
    // MOBILE MENU
    // =========================================
    const menuBtn = document.querySelector('.menu-btn');
    const navLinksContainer = document.querySelector('.nav-links');

    function setMenu(open) {
        if (!menuBtn || !navLinksContainer) return;
        navLinksContainer.classList.toggle('active', open);
        document.body.classList.toggle('menu-open', open);
        menuBtn.setAttribute('aria-expanded', String(open));
        menuBtn.innerHTML = `<i class="fas ${open ? 'fa-times' : 'fa-bars'}" aria-hidden="true"></i>`;
    }

    if (menuBtn && navLinksContainer) {
        menuBtn.addEventListener('click', () => setMenu(!navLinksContainer.classList.contains('active')));
        navLinksContainer.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') setMenu(false);
        });
    }

    // =========================================
    // SCROLL: NAVBAR, PROGRESS, BACK TO TOP, SCROLLSPY
    // =========================================
    const navbar = document.querySelector('.navbar');
    const backToTopBtn = document.getElementById('backToTop');
    const progressBar = document.getElementById('scrollProgress');
    const spySections = [...document.querySelectorAll('section[id]')]
        .map(section => ({ section, link: document.querySelector(`.nav-links a[href$="#${section.id}"]`) }))
        .filter(item => item.link);

    let scrollTicking = false;
    function onScroll() {
        const scrollY = window.scrollY;

        if (navbar && !navbar.classList.contains('navbar-solid')) {
            navbar.classList.toggle('scrolled', scrollY > 50);
        }
        if (backToTopBtn) backToTopBtn.classList.toggle('show', scrollY > 400);

        if (progressBar) {
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            progressBar.style.width = totalHeight > 0 ? `${(scrollY / totalHeight) * 100}%` : '0%';
        }

        spySections.forEach(({ section, link }) => {
            const top = section.offsetTop - 120;
            const isActive = scrollY >= top && scrollY < top + section.offsetHeight;
            link.classList.toggle('active', isActive);
        });
        scrollTicking = false;
    }
    window.addEventListener('scroll', () => {
        if (!scrollTicking) {
            requestAnimationFrame(onScroll);
            scrollTicking = true;
        }
    }, { passive: true });
    onScroll();

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
        });
    }

    // =========================================
    // REVEAL ON SCROLL
    // =========================================
    const revealEls = document.querySelectorAll('.reveal');
    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
        revealEls.forEach(el => el.classList.add('active'));
    } else {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
        revealEls.forEach(el => revealObserver.observe(el));
    }

    // =========================================
    // POINTER EFFECTS (desktop only)
    // =========================================
    if (finePointer && !prefersReducedMotion) {
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const deltaX = (e.clientX - rect.left - rect.width / 2) / 8;
                const deltaY = (e.clientY - rect.top - rect.height / 2) / 8;
                btn.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = '';
            });
        });

        document.querySelectorAll('.mockup-container, .bento-item').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const rotateX = ((e.clientY - rect.top - rect.height / 2) / (rect.height / 2)) * -4;
                const rotateY = ((e.clientX - rect.left - rect.width / 2) / (rect.width / 2)) * 4;
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    // =========================================
    // TESTIMONIALS CAROUSEL
    // =========================================
    const slider = document.querySelector('.testimonial-slider');
    const testimonialItems = document.querySelectorAll('.testimonial-item');
    const dots = document.querySelectorAll('.testimonial-dots .dot');
    let currentIndex = 0;
    let autoSlideInterval;

    function showTestimonial(index) {
        if (!slider || !testimonialItems.length) return;
        slider.style.transform = `translateX(-${index * 100}%)`;
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
            if (i === index) dot.setAttribute('aria-current', 'true');
            else dot.removeAttribute('aria-current');
        });
        currentIndex = index;
    }

    function startAutoSlide() {
        if (prefersReducedMotion) return;
        clearInterval(autoSlideInterval);
        autoSlideInterval = setInterval(() => {
            showTestimonial((currentIndex + 1) % testimonialItems.length);
        }, 6000);
    }

    if (slider && testimonialItems.length) {
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                showTestimonial(index);
                startAutoSlide();
            });
        });
        showTestimonial(0);
        startAutoSlide();
    }

    // =========================================
    // ANIMATED STATISTICS
    // =========================================
    const stats = document.querySelectorAll('.stat-number');
    const statsSection = document.querySelector('.stats-container');

    function animateStats() {
        stats.forEach(stat => {
            const target = +stat.getAttribute('data-target');
            const suffix = stat.getAttribute('data-suffix') ?? '+';
            if (prefersReducedMotion) {
                stat.textContent = target + suffix;
                return;
            }
            const duration = 1800;
            const start = performance.now();
            const tick = (now) => {
                const progress = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                stat.textContent = Math.round(target * eased) + (progress === 1 ? suffix : '');
                if (progress < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
        });
    }

    if (statsSection && stats.length) {
        const statsObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                animateStats();
                statsObserver.disconnect();
            }
        });
        statsObserver.observe(statsSection);
    }

    // =========================================
    // HERO PARTICLE BACKGROUND
    // =========================================
    const canvas = document.getElementById('hero-canvas');
    if (canvas && !prefersReducedMotion && window.innerWidth >= 768) {
        const ctx = canvas.getContext('2d');
        const hero = canvas.parentElement;
        let width, height, particles = [], rafId = null, isVisible = true;
        const connectionDistance = 140;
        const mouseDistance = 180;
        const mouse = { x: null, y: null };

        function resize() {
            const rect = hero.getBoundingClientRect();
            width = canvas.width = rect.width;
            height = canvas.height = rect.height;
        }

        function initParticles() {
            const count = Math.min(55, Math.round((width * height) / 22000));
            particles = Array.from({ length: count }, () => ({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4,
                size: Math.random() * 2 + 1,
            }));
        }

        function animate() {
            ctx.clearRect(0, 0, width, height);
            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0 || p.x > width) p.vx *= -1;
                if (p.y < 0 || p.y > height) p.vy *= -1;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(59, 130, 246, 0.25)';
                ctx.fill();

                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const distSq = dx * dx + dy * dy;
                    if (distSq < connectionDistance * connectionDistance) {
                        const distance = Math.sqrt(distSq);
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(59, 130, 246, ${0.1 * (1 - distance / connectionDistance)})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }

                if (mouse.x !== null) {
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
            }
            rafId = requestAnimationFrame(animate);
        }

        function start() {
            if (rafId === null && isVisible && !document.hidden) rafId = requestAnimationFrame(animate);
        }
        function stop() {
            if (rafId !== null) cancelAnimationFrame(rafId);
            rafId = null;
        }

        hero.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        });
        hero.addEventListener('mouseleave', () => {
            mouse.x = mouse.y = null;
        });

        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                resize();
                initParticles();
            }, 200);
        });

        new IntersectionObserver((entries) => {
            isVisible = entries[0].isIntersecting;
            isVisible ? start() : stop();
        }).observe(hero);
        document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));

        resize();
        initParticles();
        start();
    }

    // =========================================
    // FAQ ACCORDION
    // =========================================
    document.querySelectorAll('.faq-header').forEach(header => {
        header.addEventListener('click', () => {
            const item = header.closest('.faq-item');
            const wasActive = item.classList.contains('active');
            item.parentElement.querySelectorAll('.faq-item').forEach(i => {
                i.classList.remove('active');
                i.querySelector('.faq-header')?.setAttribute('aria-expanded', 'false');
            });
            if (!wasActive) {
                item.classList.add('active');
                header.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // =========================================
    // FORM SUBMISSION
    // =========================================
    async function postJson(endpoint, data) {
        const response = await fetch(`${API_BASE}/${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result.message || `HTTP ${response.status}`);
        return result;
    }

    function handleForm(form, endpoint, buildPayload, successMessage) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"]');
            const originalContent = btn.innerHTML;
            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin" aria-hidden="true"></i> প্রসেসিং হচ্ছে...';

            try {
                const result = await postJson(endpoint, buildPayload(form));
                showToast(result.message || successMessage, 'success');
                form.reset();
                form.dispatchEvent(new CustomEvent('form:success'));
            } catch (error) {
                console.error(`${endpoint} submission error:`, error);
                showToast('দুঃখিত, একটি সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন অথবা হোয়াটসঅ্যাপে যোগাযোগ করুন।', 'error');
            } finally {
                btn.disabled = false;
                btn.innerHTML = originalContent;
            }
        });
    }

    const field = (form, name) => (form.elements[name]?.value || '').trim();

    const affiliateForm = document.getElementById('affiliateForm');
    if (affiliateForm) {
        handleForm(affiliateForm, 'NextXenAffiliate', (f) => ({
            name: field(f, 'name'),
            email: field(f, 'email'),
            phone: field(f, 'phone'),
            details: field(f, 'details'),
        }), 'ধন্যবাদ! আপনার অ্যাফিলিয়েট আবেদনটি জমা হয়েছে। আমাদের টিম শীঘ্রই যোগাযোগ করবে।');
    }

    document.querySelectorAll('form[data-form="project"]').forEach(form => {
        handleForm(form, 'ProjectRequest', (f) => {
            const select = f.elements.project;
            const projectName = select && select.tagName === 'SELECT'
                ? select.options[select.selectedIndex].text
                : field(f, 'project');
            return {
                name: field(f, 'name'),
                email: field(f, 'email'),
                mobile: field(f, 'mobile'),
                projectName,
                body: field(f, 'message'),
            };
        }, 'ধন্যবাদ! আপনার রিকোয়েস্টটি জমা হয়েছে। আমাদের টিম শীঘ্রই আপনার সাথে যোগাযোগ করবে।');
    });

    // =========================================
    // FEEDBACK POPUP
    // Shown at most once per visit, only after real engagement,
    // and not again for 14 days after dismissal or submission.
    // =========================================
    const FEEDBACK_SNOOZE_MS = 14 * 24 * 60 * 60 * 1000;

    function feedbackAllowed() {
        if (localStorage.getItem('feedbackSubmitted') === 'true') return false;
        if (sessionStorage.getItem('feedbackShown') === 'true') return false;
        const dismissedAt = +localStorage.getItem('feedbackDismissedAt') || 0;
        return Date.now() - dismissedAt > FEEDBACK_SNOOZE_MS;
    }

    function initFeedbackPopup() {
        if (!document.body.hasAttribute('data-feedback') || !feedbackAllowed()) return;

        const feedbackHtml = `
            <div id="feedbackModal" class="feedback-modal" role="dialog" aria-modal="true" aria-labelledby="feedbackTitle">
                <div class="feedback-overlay"></div>
                <div class="feedback-container">
                    <button type="button" class="feedback-close" aria-label="বন্ধ করুন"><i class="fas fa-times" aria-hidden="true"></i></button>
                    <div class="feedback-header">
                        <h2 id="feedbackTitle">আপনার মতামত আমাদের শক্তি</h2>
                        <p>মাত্র ৩০ সেকেন্ডে আমাদের উন্নত করতে সাহায্য করুন।</p>
                    </div>
                    <form id="feedbackForm">
                        <div class="feedback-form-group">
                            <div class="rating-group" id="starRating" role="radiogroup" aria-label="রেটিং দিন">
                                ${[5, 4, 3, 2, 1].map(n => `<button type="button" class="star-btn" data-rating="${n}" role="radio" aria-checked="false" aria-label="${n} স্টার"><i class="fas fa-star" aria-hidden="true"></i></button>`).join('')}
                            </div>
                        </div>
                        <div class="feedback-grid">
                            <div class="feedback-form-group full-width">
                                <label for="fbProblem">সফটওয়্যার দিয়ে সমাধানযোগ্য কোনো সমস্যা?</label>
                                <textarea id="fbProblem" name="problem" rows="2" placeholder="সংক্ষেপে লিখুন..."></textarea>
                            </div>
                            <div class="feedback-form-group">
                                <label for="fbSoftware">কি সফটওয়্যার খুঁজছেন?</label>
                                <input type="text" id="fbSoftware" name="software" placeholder="যেমন: ইনভেন্টরি">
                            </div>
                            <div class="feedback-form-group">
                                <label for="fbBudget">আপনার বাজেট কত?</label>
                                <input type="text" id="fbBudget" name="budget" placeholder="যেমন: ২০,০০০/-">
                            </div>
                            <div class="feedback-form-group full-width">
                                <label for="fbAdvice">আমাদের জন্য কোনো পরামর্শ?</label>
                                <textarea id="fbAdvice" name="advice" rows="2" placeholder="আপনার মূল্যবান পরামর্শ..."></textarea>
                            </div>
                        </div>
                        <button type="submit" class="btn btn-primary feedback-btn">
                            জমা দিন <i class="fas fa-paper-plane" aria-hidden="true"></i>
                        </button>
                    </form>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', feedbackHtml);

        const modal = document.getElementById('feedbackModal');
        const form = document.getElementById('feedbackForm');
        const stars = modal.querySelectorAll('.star-btn');
        let rating = 0;
        let lastFocused = null;

        function show() {
            if (!feedbackAllowed() || document.body.classList.contains('menu-open')) return;
            sessionStorage.setItem('feedbackShown', 'true');
            lastFocused = document.activeElement;
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            modal.querySelector('.feedback-close').focus();
        }

        function hide(dismissed = true) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
            if (dismissed) localStorage.setItem('feedbackDismissedAt', String(Date.now()));
            lastFocused?.focus?.();
        }

        stars.forEach(star => {
            star.addEventListener('click', () => {
                rating = +star.dataset.rating;
                stars.forEach(s => {
                    const on = +s.dataset.rating <= rating;
                    s.classList.toggle('active', on);
                    s.setAttribute('aria-checked', String(+s.dataset.rating === rating));
                });
            });
        });

        modal.querySelector('.feedback-close').addEventListener('click', () => hide());
        modal.querySelector('.feedback-overlay').addEventListener('click', () => hide());
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) hide();
        });

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!rating) {
                showToast('দয়া করে একটি রেটিং দিন।', 'error');
                return;
            }
            const btn = form.querySelector('button[type="submit"]');
            const originalContent = btn.innerHTML;
            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin" aria-hidden="true"></i> প্রসেসিং হচ্ছে...';
            try {
                const result = await postJson('NextXenFeedback', {
                    rating: rating + '.0',
                    problem: field(form, 'problem'),
                    software: field(form, 'software'),
                    budget: field(form, 'budget'),
                    advice: field(form, 'advice'),
                });
                localStorage.setItem('feedbackSubmitted', 'true');
                showToast(result.message || 'আপনার মূল্যবান মতামতের জন্য ধন্যবাদ!', 'success');
                hide(false);
            } catch (error) {
                console.error('Feedback submission error:', error);
                showToast('দুঃখিত, একটি সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।', 'error');
            } finally {
                btn.disabled = false;
                btn.innerHTML = originalContent;
            }
        });

        // Trigger after 45s on page or once the visitor has scrolled 60% of the page.
        let triggered = false;
        const trigger = () => {
            if (triggered) return;
            triggered = true;
            window.removeEventListener('scroll', onScrollTrigger);
            show();
        };
        const onScrollTrigger = () => {
            const total = document.documentElement.scrollHeight - window.innerHeight;
            if (total > 0 && window.scrollY / total > 0.6) trigger();
        };
        window.addEventListener('scroll', onScrollTrigger, { passive: true });
        setTimeout(trigger, 45000);
    }

    initFeedbackPopup();

    // =========================================
    // FOOTER YEAR
    // =========================================
    const yearEl = document.getElementById('currentYear');
    if (yearEl) yearEl.textContent = new Date().getFullYear().toLocaleString('bn-BD', { useGrouping: false });
});
