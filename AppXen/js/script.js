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

    // =========================================
    // 2026 ADVANCED MARKETING & INTERACTIVE ENGINE
    // =========================================

    // 1. Audio Chime Synthesizer (Micro-interaction)
    function playSoftChime() {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const now = ctx.currentTime;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(587.33, now); // D5
            osc.frequency.exponentialRampToValueAtTime(880, now + 0.15); // A5
            gain.gain.setValueAtTime(0.08, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.35);
        } catch(e) {}
    }

    // 2. Interactive SaaS Showcase Playground
    const saasProductsData = {
        edusync: {
            badge: "এডুকেশন ম্যানেজমেন্ট",
            title: "EduSync - আধুনিক স্কুল ও শিক্ষা প্রতিষ্ঠান ERP",
            tagline: "স্টুডেন্ট, প্যারেন্ট ও টিচারদের জন্য সমন্বিত ক্লাউড ইকোসিস্টেম",
            desc: "ভর্তি প্রক্রিয়া, ডিজিটাল হাজিরা, অনলাইন ফি কালেকশন, রেজাল্ট শিট ও এসএমএস নোটিফিকেশন সহ যেকোনো শিক্ষা প্রতিষ্ঠান পরিচালনার জন্য একটি নির্ভরযোগ্য অল-ইন-ওয়ান সমাধান।",
            metric1: "৮৫%", metric1Lbl: "সময় সাশ্রয়",
            metric2: "১০০%", metric2Lbl: "ডিজিটাল কালেকশন",
            metric3: "২৪/৭", metric3Lbl: "ক্লাউড অটোমেশন",
            features: [
                "ডিজিটাল স্টুডেন্ট ও প্যারেন্ট পোর্টাল",
                "বিকাশ/নগদ অটো ফি কালেকশন গেটওয়ে",
                "১-ক্লিকে রেজাল্ট কার্ড ও গ্রেডিং শিট",
                "স্বয়ংক্রিয় বাল্ক এসএমএস এলার্ট"
            ],
            demoUrl: "https://edusync.nextxenit.com",
            frameUrl: "https://edusync.nextxenit.com",
            img: "images/app/edusync-1.webp"
        },
        hr: {
            badge: "হিউম্যান রিসোর্স ও পেরোল",
            title: "NextXen HR & Payroll - স্মার্ট কর্মী ব্যবস্থাপনা",
            tagline: "হাজিরা ট্র্যাকিং, বায়োমেট্রিক ও অটোমেটেড স্যালারি প্রসেসিং",
            desc: "ম্যানুয়াল পেরোল ও হাজিরা খাতার ঝামেলা দূর করে সম্পূর্ণ স্বয়ংক্রিয় কর্মী তথ্য, ছুটি অনুমোদন, ওভারটাইম ক্যালকুলেশন ও পে-স্লিপ জেনারেট করুন।",
            metric1: "৯০%", metric1Lbl: "এইচআর সময় সাশ্রয়",
            metric2: "১০০%", metric2Lbl: "নির্ভুল স্যালারি",
            metric3: "রিয়েল-টাইম", metric3Lbl: "বায়োমেট্রিক সিঙ্ক",
            features: [
                "বায়োমেট্রিক ডিভাইস ও জিও-ফেন্সিং হাজিরা",
                "১-ক্লিকে বোনাস ও ট্যাক্সসহ বেতন শিট",
                "মোবাইল অ্যাপ থেকে ছুটি আবেদন ও অনুমোদন",
                "ব্যাংক ট্রান্সফার স্টেটমেন্ট এক্সপোর্ট"
            ],
            demoUrl: "https://hr.nextxenit.com",
            frameUrl: "https://hr.nextxenit.com",
            img: "images/app/hr-payroll-1.webp"
        },
        drhour: {
            badge: "হেলথকেয়ার ও বুকিং",
            title: "Dr Hour - ডাক্তার অ্যাপয়েন্টমেন্ট ও স্মার্ট ক্লিনিক ইআরপি",
            tagline: "অনলাইন সিরিয়াল, ডিজিটাল প্রেসক্রিপশন ও ফার্মেসি বিলিং",
            desc: "রোগীদের দীর্ঘ লাইনে দাঁড়িয়ে থাকার দিন শেষ। এসএমএস ও কিউআর কোড সিরিয়াল, চেম্বার টিভি ডিসপ্লে এবং ডিজিটাল রোগী হিস্ট্রি ম্যানেজমেন্ট।",
            metric1: "০ মিনিট", metric1Lbl: "অনাকাঙ্ক্ষিত অপেক্ষা",
            metric2: "১০০%", metric2Lbl: "ডিজিটাল হিস্ট্রি",
            metric3: "লাইভ", metric3Lbl: "টিভি কিউ ডিসপ্লে",
            features: [
                "অনলাইন স্মার্ট পেশেন্ট সিরিয়াল বুকিং",
                "চেম্বার ওয়েটিং ডিসপ্লে কিউ বোর্ড",
                "১-মিনিটে প্রফেশনাল ডিজিটাল প্রেসক্রিপশন",
                "ইনভেস্টিগেশন ও ফার্মেসি সমন্বিত বিলিং"
            ],
            demoUrl: "https://dr-hour.nextxenit.com",
            frameUrl: "https://dr-hour.nextxenit.com",
            img: "images/app/dr-hour-1.webp"
        },
        dinepos: {
            badge: "রেস্টুরেন্ট, ক্যাফে ও POS",
            title: "DinePOS - স্মার্ট রেস্টুরেন্ট ও ক্যাফে ম্যানেজমেন্ট POS",
            tagline: "ক্লাউড পয়েন্ট অব সেল, কিচেন ডিসপ্লে (KDS), টেবিল বুকিং ও বিলিং",
            desc: "দ্রুততম বিলিং, টেবিল ম্যানেজমেন্ট, অটোমেটেড স্টক ইনভেন্টরি এবং লাভ-ক্ষতির লাইভ হিসাবের জন্য সেরা রেস্টুরেন্ট POS সমাধান।",
            metric1: "৩ সেকেন্ড", metric1Lbl: "প্রতি বিলিং সময়",
            metric2: "লাইভ", metric2Lbl: "স্টক এলার্ট",
            metric3: "১০০%", metric3Lbl: "সঠিক হিসাব",
            features: [
                "টাচ পিওএস ও কিচেন অর্ডার ডিসপ্লে (KDS)",
                "বারকোড স্ক্যানার ও থার্মাল প্রিন্ট সাপোর্ট",
                "স্টক অ্যালার্ট ও অটোমেটেড সাপ্লায়ার লেজার",
                "দৈনিক বিক্রয় ও ভ্যাট রিটার্ন রিপোর্ট"
            ],
            demoUrl: "https://dinepos.nextxenit.com",
            frameUrl: "https://dinepos.nextxenit.com",
            img: "images/app/dinepos-1.webp"
        },
        rinshiri: {
            badge: "ক্ষুদ্রঋণ ও সমিতি ম্যানেজমেন্ট",
            title: "Rinshiri - ক্ষুদ্রঋণ ও সমবায় সমিতি ম্যানেজমেন্ট ERP",
            tagline: "মাঠ পর্যায়ের রিয়েলটাইম কিস্তি কালেকশন ও হিসাব খাতা",
            desc: "সমবায় সমিতি ও ক্ষুদ্রঋণ প্রতিষ্ঠানের সদস্য হিসাব, ঋণ অনুমোদন, সাপ্তাহিক/মাসিক কিস্তি কালেকশন এবং অটো পাসবুক আপডেট।",
            metric1: "১০০%", metric1Lbl: "মাঠ পর্যায়ের স্বচ্ছতা",
            metric2: "ইনস্ট্যান্ট", metric2Lbl: "এসএমএস রিসিপ্ট",
            metric3: "অফলাইন", metric3Lbl: "মোবাইল কালেকশন",
            features: [
                "মাঠকর্মীদের জন্য অ্যান্ড্রয়েড কালেকশন অ্যাপ",
                "সঞ্চয় ও ঋণ কিস্তির তাৎক্ষণিক ডিজিটাল রশিদ",
                "অটোমেটেড ডিউ ও রিকভারি এনালাইসিস",
                "পিকেএসএফ (PKSF) ও এনজিও ব্যুরো স্ট্যান্ডার্ড"
            ],
            demoUrl: "https://rinshiri.nextxenit.com",
            frameUrl: "https://rinshiri.nextxenit.com",
            img: "images/app/rinshiri-1.webp"
        }
    };
    saasProductsData.billify = saasProductsData.dinepos;
    saasProductsData.ngo = saasProductsData.rinshiri;

    const playgroundTabBtns = document.querySelectorAll('.playground-tab-btn');
    if (playgroundTabBtns.length) {
        playgroundTabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const productKey = btn.dataset.product;
                const data = saasProductsData[productKey];
                if (!data) return;

                playgroundTabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Animate info updates
                const titleEl = document.getElementById('pgTitle');
                if (titleEl) {
                    titleEl.textContent = data.title;
                    document.getElementById('pgBadge').textContent = data.badge;
                    document.getElementById('pgTagline').textContent = data.tagline;
                    document.getElementById('pgDesc').textContent = data.desc;
                    document.getElementById('pgMetric1').textContent = data.metric1;
                    document.getElementById('pgMetric1Lbl').textContent = data.metric1Lbl;
                    document.getElementById('pgMetric2').textContent = data.metric2;
                    document.getElementById('pgMetric2Lbl').textContent = data.metric2Lbl;
                    document.getElementById('pgMetric3').textContent = data.metric3;
                    document.getElementById('pgMetric3Lbl').textContent = data.metric3Lbl;

                    // Features list
                    const featUl = document.getElementById('pgFeatures');
                    if (featUl) {
                        featUl.innerHTML = data.features.map(f => `<li><i class="fas fa-circle-check"></i> <span>${f}</span></li>`).join('');
                    }

                    // URLs and Mockup
                    const demoBtn = document.getElementById('pgLiveDemoBtn');
                    if (demoBtn) demoBtn.href = data.demoUrl;
                    const frameUrl = document.getElementById('pgFrameUrl');
                    if (frameUrl) frameUrl.textContent = data.frameUrl;
                    const frameImg = document.getElementById('pgFrameImg');
                    if (frameImg) {
                        frameImg.style.opacity = '0.4';
                        frameImg.src = data.img;
                        setTimeout(() => { frameImg.style.opacity = '1'; }, 150);
                    }
                }
            });
        });
    }

    // 3. Interactive ROI & Solution Finder Calculator
    const roiIndustry = document.getElementById('roiIndustry');
    const roiTeamSize = document.getElementById('roiTeamSize');
    const roiTier = document.getElementById('roiTier');

    function updateRoiCalculator() {
        if (!roiIndustry) return;
        const ind = roiIndustry.value;
        const size = roiTeamSize.value;
        const tier = roiTier.value;

        let solTitle = "EduSync School ERP";
        let solSub = "সমন্বিত শিক্ষা প্রতিষ্ঠান ম্যানেজমেন্ট ও অটোমেটেড ফি কালেকশন স্যুট।";
        let hours = "৪০+ ঘণ্টা";
        let setup = "২৪ ঘণ্টা";

        if (ind === 'school') {
            solTitle = "EduSync School ERP";
            solSub = "স্কুল ও শিক্ষা প্রতিষ্ঠানের শিক্ষার্থী, অভিভাবক ও অ্যাকাডেমিক ইকোসিস্টেম।";
            hours = size === 'enterprise' ? "১২০+ ঘণ্টা" : (size === 'large' ? "৮০+ ঘণ্টা" : "৪০+ ঘণ্টা");
        } else if (ind === 'corporate') {
            solTitle = "NextXen HR & Payroll";
            solSub = "বায়োমেট্রিক হাজিরা, ছুটি ব্যবস্থাপনা ও ১-ক্লিকে ১০০% নির্ভুল স্যালারি শিট।";
            hours = size === 'enterprise' ? "১০০+ ঘণ্টা" : (size === 'large' ? "৬০+ ঘণ্টা" : "৩০+ ঘণ্টা");
        } else if (ind === 'clinic') {
            solTitle = "Dr Hour Clinic Management";
            solSub = "অনলাইন সিরিয়াল বুকিং, চেম্বার টিভি কিউ এবং ডিজিটাল প্রেসক্রিপশন।";
            hours = "৫০+ ঘণ্টা";
        } else if (ind === 'restaurant') {
            solTitle = "DinePOS Restaurant POS";
            solSub = "টাচ পিওএস, কিচেন ডিসপ্লে (KDS), টেবিল অর্ডার ও লাইভ ইনভেন্টরি।";
            hours = "৪৫+ ঘণ্টা";
        } else if (ind === 'ngo') {
            solTitle = "Rinshiri Microfinance ERP";
            solSub = "ক্ষুদ্রঋণ, সমবায় সমিতি ও মাঠ পর্যায়ের কিস্তি কালেকশন অটোমেশন।";
            hours = size === 'enterprise' ? "১৫০+ ঘণ্টা" : "৭০+ ঘণ্টা";
        } else if (ind === 'custom') {
            solTitle = "NextXen কাস্টম ক্লাউড সল্যুশন";
            solSub = "আপনার ব্যবসার নির্দিষ্ট প্রয়োজন অনুযায়ী কাস্টমাইজড সফটওয়্যার ও এন্টারপ্রাইজ সিস্টেম।";
            hours = "৮০+ ঘণ্টা";
        }

        if (tier === 'pro') {
            setup = "৪৮ ঘণ্টা (কাস্টমাইজড)";
        }

        const titleEl = document.getElementById('roiSolutionTitle');
        if (titleEl) {
            titleEl.textContent = solTitle;
            document.getElementById('roiSolutionSubtitle').textContent = solSub;
            document.getElementById('roiTimeSaved').textContent = hours;
            document.getElementById('roiSetupTime').textContent = setup;
        }
    }

    if (roiIndustry && roiTeamSize && roiTier) {
        roiIndustry.addEventListener('change', updateRoiCalculator);
        roiTeamSize.addEventListener('change', updateRoiCalculator);
        roiTier.addEventListener('change', updateRoiCalculator);
    }

    // 4. Floating Conversion Dock Visibility
    const floatingDock = document.getElementById('floatingDock');
    if (floatingDock) {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            const contactSection = document.getElementById('contact');
            const contactTop = contactSection ? contactSection.offsetTop - 400 : 999999;

            if (scrollY > 300 && scrollY < contactTop) {
                floatingDock.classList.add('visible');
            } else {
                floatingDock.classList.remove('visible');
            }
        }, { passive: true });
    }

    // 5. Quick Demo Request Modal
    const quickDemoModal = document.getElementById('quickDemoModal');
    const quickDemoOverlay = document.getElementById('quickDemoOverlay');
    const quickDemoClose = document.getElementById('quickDemoClose');
    const quickDemoSelect = document.getElementById('quickDemoProductSelect');

    function openQuickDemoModal(productCode = '') {
        if (!quickDemoModal) return;
        if (quickDemoSelect && productCode) {
            quickDemoSelect.value = productCode;
        }
        quickDemoModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeQuickDemoModal() {
        if (!quickDemoModal) return;
        quickDemoModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    document.querySelectorAll('.btn-open-demo-modal').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const prod = btn.dataset.product || 'edusync';
            openQuickDemoModal(prod);
        });
    });

    if (quickDemoOverlay) quickDemoOverlay.addEventListener('click', closeQuickDemoModal);
    if (quickDemoClose) quickDemoClose.addEventListener('click', closeQuickDemoModal);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && quickDemoModal && quickDemoModal.classList.contains('active')) {
            closeQuickDemoModal();
        }
    });

    // Handle Quick Demo Form submission
    const quickDemoForm = document.getElementById('quickDemoForm');
    if (quickDemoForm) {
        handleForm(quickDemoForm, 'ProjectRequest', (f) => {
            const select = f.elements.project;
            const projectName = select && select.tagName === 'SELECT'
                ? select.options[select.selectedIndex].text
                : (field(f, 'project') || 'SaaS Demo');
            return {
                name: field(f, 'name'),
                email: field(f, 'email'),
                mobile: field(f, 'mobile'),
                projectName: `${projectName} (Demo Request)`,
                body: field(f, 'message') || 'Demo requested via Quick Demo Modal',
            };
        }, 'ধন্যবাদ! আপনার ফ্রি ডেমো রিকোয়েস্টটি গৃহীত হয়েছে। আমাদের টিম ৩০ মিনিটের মধ্যে আপনার সাথে যোগাযোগ করবে।');
        
        quickDemoForm.addEventListener('form:success', () => {
            playSoftChime();
            setTimeout(closeQuickDemoModal, 800);
        });
    }

    // 6. Realtime Telemetry Tracking Beacon
    (function initVisitorTelemetry() {
        try {
            const pCode = 'APPXEN_PORTAL';
            const k = '_nx_vid', s = '_nx_sid';
            let vid = localStorage.getItem(k);
            if (!vid) {
                vid = 'v_' + Math.random().toString(36).substring(2, 12) + Date.now().toString(36);
                localStorage.setItem(k, vid);
            }
            let sid = sessionStorage.getItem(s);
            if (!sid) {
                sid = 's_' + Math.random().toString(36).substring(2, 12) + Date.now().toString(36);
                sessionStorage.setItem(s, sid);
            }
            const ua = navigator.userAgent || '';
            const isTab = /iPad|Tablet/i.test(ua);
            const isMob = !isTab && /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
            const dev = isTab ? 'Tablet' : (isMob ? 'Mobile' : 'Desktop');
            let brw = 'Other';
            if (ua.includes('Edg')) brw = 'Edge';
            else if (ua.includes('Chrome')) brw = 'Chrome';
            else if (ua.includes('Safari')) brw = 'Safari';
            else if (ua.includes('Firefox')) brw = 'Firefox';
            let os = 'Other';
            if (ua.includes('Win')) os = 'Windows';
            else if (ua.includes('Android')) os = 'Android';
            else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';
            else if (ua.includes('Mac')) os = 'macOS';
            else if (ua.includes('Linux')) os = 'Linux';

            const payload = JSON.stringify({
                productCode: pCode,
                visitorId: vid,
                sessionId: sid,
                path: window.location.pathname || '/',
                pageTitle: document.title || 'Next Xen IT Portal',
                referrer: document.referrer || '',
                deviceType: dev,
                browser: brw,
                operatingSystem: os,
                screenResolution: (window.screen ? window.screen.width + 'x' + window.screen.height : ''),
                language: navigator.language || ''
            });

            const endpoint = 'https://master.nextxenit.com/api/v1/saas-hub/track-visitor';
            try {
                if (navigator.sendBeacon) {
                    const blob = new Blob([payload], { type: 'text/plain' });
                    navigator.sendBeacon(endpoint, blob);
                } else {
                    fetch(endpoint, { method: 'POST', mode: 'cors', headers: { 'Content-Type': 'text/plain' }, body: payload, keepalive: true }).catch(() => {});
                }
            } catch (err) {
                fetch(endpoint, { method: 'POST', mode: 'cors', headers: { 'Content-Type': 'text/plain' }, body: payload, keepalive: true }).catch(() => {});
            }
        } catch (e) {}
    })();
});
