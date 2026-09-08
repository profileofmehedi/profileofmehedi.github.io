// Shared Application Logic for FreelancePro Themes

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    injectConversionSections();
    renderData();
    renderCaseStudies();
    renderTestimonials();
    renderContactForm();
    renderFooter();
    initThemeSwitcher();
    initBackToTop();
    initNavbarScroll();
    initScrollAnimations();
    initTestimonialSlider();
    initPortfolioFilters();
    initContactForm();

    // Advanced UI Init
    initPreloader();
    initCustomCursor();
    initAdvancedAnimations();
    initTypewriter();
    initCounters();
});

/* ==========================================================================
   Data Rendering
   ========================================================================== */
function renderData() {
    // We will render data if the specific container exists in the HTML.
    
    // 1. Profile Info
    setText('.data-profile-name', portfolioData.profile.name);
    setText('.data-profile-title', portfolioData.profile.title);
    // setText('.data-profile-tagline', portfolioData.profile.tagline); // Handled by TypewriterJS now
    setText('.data-profile-desc', portfolioData.profile.description);
    setImage('.data-profile-img', portfolioData.profile.image);
    setText('.data-profile-email', portfolioData.profile.email);
    setText('.data-profile-location', portfolioData.profile.location);

    // Profile Stats
    // Profile Stats - Replaced with Animated Counters
    const statsContainer = document.querySelector('.data-stats-container');
    if (statsContainer) {
        statsContainer.innerHTML = portfolioData.profile.stats.map(s => `
            <div class="stat-item" data-aos="fade-up" data-aos-delay="100">
                <h3 class="stat-value" data-target="${s.value.replace(/[^0-9]/g, '')}">0</h3>
                <span class="stat-label">${s.label}</span>
            </div>
        `).join('');
    }

    // 2. Services
    const servicesContainer = document.querySelector('.data-services-container');
    if (servicesContainer) {
        servicesContainer.innerHTML = portfolioData.services.map((s, index) => `
            <div class="col-lg-4 col-md-6 mb-4">
                <div class="service-card p-4 h-100" data-tilt data-tilt-max="10" data-tilt-speed="400" data-tilt-glare data-tilt-max-glare="0.3" data-aos="fade-up" data-aos-delay="${index * 100}">
                    <div class="service-icon mb-3"><i class="${s.icon}"></i></div>
                    <h4 class="service-title mb-3">${s.title}</h4>
                    <p class="service-desc mb-4">${s.description}</p>
                    <ul class="service-features list-unstyled mb-4">
                        ${s.features.map(f => `<li><i class="fa-solid fa-check me-2"></i>${f}</li>`).join('')}
                    </ul>
                    <div class="mt-auto d-flex justify-content-between align-items-center">
                        <span class="service-price small">Starts at <strong>${s.price}</strong></span>
                        <a href="#contact" class="service-link">Let's Talk <i class="fa-solid fa-arrow-right"></i></a>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // 3. Portfolio
    const portfolioContainer = document.querySelector('.data-portfolio-container');
    const filterWrap = document.querySelector('.data-portfolio-filters');
    if (filterWrap && !filterWrap.dataset.ready) {
        const cats = ['*', ...new Set(portfolioData.portfolio.map(p => p.category))];
        filterWrap.innerHTML = cats.map((c, i) => `
            <button class="filter-btn ${i === 0 ? 'active' : ''}" data-filter="${c === '*' ? '*' : '.' + c}">
                ${c === '*' ? 'All Work' : c.charAt(0).toUpperCase() + c.slice(1)}
            </button>
        `).join('');
        filterWrap.dataset.ready = 'true';
    }

    if (portfolioContainer) {
        portfolioContainer.innerHTML = portfolioData.portfolio.map(p => `
            <div class="col-lg-6 col-md-6 portfolio-item ${p.category} mb-4">
                <div class="portfolio-card overflow-hidden position-relative" data-aos="fade-up" data-tilt data-tilt-max="5" data-tilt-speed="400">
                    <img src="${p.image}" alt="${p.title}" class="img-fluid w-100">
                    <div class="portfolio-overlay p-4 d-flex flex-column justify-content-end">
                        <div class="portfolio-tech mb-2">
                            ${p.tech.map(t => `<span class="badge me-2">${t}</span>`).join('')}
                        </div>
                        <h3 class="portfolio-title text-white mb-2">${p.title}</h3>
                        <p class="portfolio-desc text-white-50 mb-3">${p.description}</p>
                        <div class="d-flex justify-content-between align-items-center">
                            <span class="portfolio-metric fw-bold">${p.metric}</span>
                            <a href="#" class="portfolio-btn btn btn-sm">View Details</a>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // 4. Skills
    const skillsContainer = document.querySelector('.data-skills-container');
    if (skillsContainer) {
        skillsContainer.innerHTML = portfolioData.skills.map(skill => `
            <div class="skill-item mb-3 animate-on-scroll">
                <div class="d-flex justify-content-between mb-1">
                    <span class="skill-name fw-bold">${skill.name}</span>
                    <span class="skill-percent">${skill.level}%</span>
                </div>
                <div class="progress" style="height: 8px;">
                    <div class="progress-bar" role="progressbar" style="width: ${skill.level}%;" aria-valuenow="${skill.level}" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
            </div>
        `).join('');
    }

    // 5. Experience Timeline
    const experienceContainer = document.querySelector('.data-experience-container');
    if (experienceContainer) {
        experienceContainer.innerHTML = portfolioData.experience.map(exp => `
            <div class="timeline-item pb-4 animate-on-scroll">
                <div class="timeline-dot"></div>
                <h5 class="fw-bold mb-1">${exp.role}</h5>
                <h6 class="text-primary mb-2">${exp.company} | ${exp.period}</h6>
                <p class="text-muted mb-0">${exp.description}</p>
            </div>
        `).join('');
    }

    // 6. Pricing
    const pricingContainer = document.querySelector('.data-pricing-container');
    if (pricingContainer) {
        pricingContainer.innerHTML = portfolioData.pricing.map((p, index) => `
            <div class="col-lg-4 col-md-6 mb-4">
                <div class="pricing-card p-4 p-xl-5 text-center h-100 ${p.isPopular ? 'popular' : ''}" data-aos="fade-up" data-aos-delay="${index * 100}" data-tilt data-tilt-max="5" data-tilt-scale="1.02">
                    ${p.isPopular ? '<span class="popular-badge">Most Popular</span>' : ''}
                    <h4 class="fw-bold mb-2">${p.title}</h4>
                    <p class="small mb-4 opacity-75">${p.subtitle}</p>
                    <h2 class="display-5 fw-bold mb-4">${p.price}</h2>
                    <ul class="list-unstyled text-start mb-4">
                        ${p.features.map(f => `<li><i class="fa-solid fa-check text-success me-2"></i> ${f}</li>`).join('')}
                        ${p.missing.map(m => `<li class="opacity-50"><i class="fa-solid fa-xmark me-2"></i> ${m}</li>`).join('')}
                    </ul>
                    <a href="#contact" class="btn ${p.isPopular ? 'btn-primary' : 'btn-outline'} w-100 mt-auto">Choose ${p.title}</a>
                </div>
            </div>
        `).join('');
    }

    // 7. FAQ
    const faqContainer = document.querySelector('.data-faq-container');
    if (faqContainer) {
        faqContainer.innerHTML = portfolioData.faq.map((item, index) => `
            <div class="accordion-item mb-3 border-0 rounded animate-on-scroll">
                <h2 class="accordion-header">
                    <button class="accordion-button ${index === 0 ? '' : 'collapsed'} fw-bold" type="button" data-bs-toggle="collapse" data-bs-target="#faq${index}">
                        ${item.q}
                    </button>
                </h2>
                <div id="faq${index}" class="accordion-collapse collapse ${index === 0 ? 'show' : ''}" data-bs-parent=".data-faq-container">
                    <div class="accordion-body opacity-75">
                        ${item.a}
                    </div>
                </div>
            </div>
        `).join('');
    }
}

function setText(selector, text) {
    document.querySelectorAll(selector).forEach(el => el.textContent = text);
}

function setImage(selector, src) {
    document.querySelectorAll(selector).forEach(el => el.src = src);
}


/* ==========================================================================
   Dark / Light Mode
   ========================================================================== */
function initTheme() {
    const savedTheme = localStorage.getItem('freelanceProTheme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
        document.documentElement.setAttribute('data-theme', 'dark'); // Default
    }
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('freelanceProTheme', newTheme);
}


/* ==========================================================================
   Theme Switcher UI
   ========================================================================== */
function initThemeSwitcher() {
    // Inject Theme Switcher HTML
    const switcherHtml = `
        <div id="theme-switcher-widget">
            <button id="theme-switcher-toggle"><i class="fa-solid fa-palette"></i></button>
            <div id="theme-switcher-panel">
                <h6 class="mb-3 fw-bold border-bottom pb-2">Select Theme</h6>
                <div class="theme-list">
                    <a href="index.html" class="theme-link">Theme 1 (Dark Tech)</a>
                    <a href="index2.html" class="theme-link">Theme 2 (Minimal White)</a>
                    <a href="index3.html" class="theme-link">Theme 3 (Neo-brutalism)</a>
                    <a href="index4.html" class="theme-link">Theme 4 (Editorial)</a>
                    <a href="index5.html" class="theme-link">Theme 5 (Glassmorphism)</a>
                    <a href="index6.html" class="theme-link">Theme 6 (Cyberpunk)</a>
                    <a href="index7.html" class="theme-link">Theme 7 (Soft Pastel)</a>
                    <a href="index8.html" class="theme-link">Theme 8 (Brutalist Grid)</a>
                    <a href="index9.html" class="theme-link">Theme 9 (Corporate)</a>
                    <a href="index10.html" class="theme-link">Theme 10 (Playful)</a>
                </div>
                <hr>
                <div class="d-flex justify-content-between align-items-center">
                    <span class="small fw-bold">Dark Mode</span>
                    <label class="switch">
                        <input type="checkbox" id="darkModeToggle" ${document.documentElement.getAttribute('data-theme') === 'dark' ? 'checked' : ''}>
                        <span class="slider round"></span>
                    </label>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', switcherHtml);

    // Highlight current theme
    const currentFile = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.theme-link').forEach(link => {
        if (link.getAttribute('href') === currentFile) {
            link.classList.add('active');
        }
    });

    // Events
    document.getElementById('theme-switcher-toggle').addEventListener('click', () => {
        document.getElementById('theme-switcher-panel').classList.toggle('open');
    });

    document.getElementById('darkModeToggle').addEventListener('change', () => {
        toggleTheme();
    });
}


/* ==========================================================================
   Back To Top
   ========================================================================== */
function initBackToTop() {
    const btnHtml = `<button id="backToTopBtn" title="Go to top"><i class="fa-solid fa-arrow-up"></i></button>`;
    document.body.insertAdjacentHTML('beforeend', btnHtml);

    const btn = document.getElementById('backToTopBtn');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            btn.classList.add('show');
        } else {
            btn.classList.remove('show');
        }
    });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}


/* ==========================================================================
   Scroll Animations
   ========================================================================== */
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    // Elements with class .animate-on-scroll will animate when in view
    setTimeout(() => {
        document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
    }, 100);
}


/* ==========================================================================
   Misc Interactions
   ========================================================================== */
function initTestimonialSlider() {
    // Extremely basic array-based slider for demo purposes if elements exist
    const sliderContainer = document.querySelector('.data-testimonial-container');
    if (!sliderContainer) return;

    let currentIndex = 0;
    
    function renderTestimonial() {
        const t = portfolioData.testimonials[currentIndex];
        sliderContainer.innerHTML = `
            <div class="testimonial-slide text-center animate-on-scroll animated">
                <i class="fa-solid fa-quote-left fs-1 opacity-25 mb-4"></i>
                <p class="fs-4 fst-italic mb-4">"${t.text}"</p>
                <div class="d-flex align-items-center justify-content-center">
                    <img src="${t.image}" alt="${t.name}" class="rounded-circle me-3" style="width:60px; height:60px; object-fit:cover;">
                    <div class="text-start">
                        <h6 class="fw-bold mb-0">${t.name}</h6>
                        <span class="small opacity-75">${t.role}</span>
                    </div>
                </div>
            </div>
        `;
    }

    renderTestimonial();

    // Bind next/prev buttons if they exist
    const nextBtn = document.getElementById('next-test');
    const prevBtn = document.getElementById('prev-test');

    if(nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % portfolioData.testimonials.length;
            renderTestimonial();
        });
    }
    if(prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + portfolioData.testimonials.length) % portfolioData.testimonials.length;
            renderTestimonial();
        });
    }
}

function initPortfolioFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    if(filterBtns.length === 0) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Remove active class from all
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked
            e.target.classList.add('active');
            
            const filterValue = e.target.getAttribute('data-filter');
            const items = document.querySelectorAll('.portfolio-item');
            
            items.forEach(item => {
                if (filterValue === '*' || item.classList.contains(filterValue.substring(1))) {
                    item.style.display = 'block';
                    setTimeout(() => item.style.opacity = '1', 50);
                } else {
                    item.style.opacity = '0';
                    setTimeout(() => item.style.display = 'none', 300);
                }
            });
        });
    });
}

function insertAfter(referenceNode, html) {
    referenceNode.insertAdjacentHTML('afterend', html);
}

function injectConversionSections() {
    const portfolioSection = document.getElementById('portfolio');
    if (portfolioSection && !document.querySelector('.data-portfolio-filters')) {
        const header = portfolioSection.querySelector('.container > .text-center, .container > h2, .fp-section-header');
        const filters = `<div class="data-portfolio-filters text-center mb-4"></div>`;
        if (header) {
            header.insertAdjacentHTML('afterend', filters);
        } else {
            const container = portfolioSection.querySelector('.container');
            if (container) container.insertAdjacentHTML('afterbegin', filters);
        }
    }

    if (!document.querySelector('.data-casestudy-container')) {
        const afterEl = document.getElementById('portfolio') || document.getElementById('services');
        if (afterEl) {
            insertAfter(afterEl, `
            <section id="case-studies" class="py-5">
                <div class="container py-5">
                    <div class="fp-section-header text-center mb-5 animate-on-scroll">
                        <span class="fp-eyebrow">Results</span>
                        <h2 class="fw-bold">Case Study</h2>
                        <p>How strategy, design, and engineering turn into measurable growth.</p>
                    </div>
                    <div class="data-casestudy-container"></div>
                </div>
            </section>`);
        }
    }

    if (!document.querySelector('.data-testimonial-container') && !document.querySelector('.data-testimonials-grid')) {
        const afterEl = document.getElementById('about') || document.getElementById('pricing') || document.getElementById('case-studies');
        if (afterEl) {
            insertAfter(afterEl, `
            <section id="testimonials" class="py-5">
                <div class="container py-5">
                    <div class="fp-section-header text-center mb-5 animate-on-scroll">
                        <span class="fp-eyebrow">Social proof</span>
                        <h2 class="fw-bold">Clients say it best</h2>
                        <p>Trusted by founders and product teams who care about craft and conversion.</p>
                    </div>
                    <div class="row data-testimonials-grid"></div>
                </div>
            </section>`);
        }
    }

    const contact = document.getElementById('contact');
    if (contact && !document.querySelector('.data-contact-form')) {
        const inner = contact.querySelector('.container') || contact;
        inner.insertAdjacentHTML('beforeend', `
            <div class="row justify-content-center mt-5">
                <div class="col-lg-8">
                    <form class="contact-panel data-contact-form animate-on-scroll">
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label>Name</label>
                                <input class="form-control" name="name" required placeholder="Your name">
                            </div>
                            <div class="col-md-6">
                                <label>Email</label>
                                <input type="email" class="form-control" name="email" required placeholder="you@company.com">
                            </div>
                            <div class="col-md-6">
                                <label>Service</label>
                                <select class="form-select" name="service" required>
                                    <option value="">Select a service</option>
                                    <option>Full-Stack Development</option>
                                    <option>UI/UX Design</option>
                                    <option>SEO & Performance</option>
                                </select>
                            </div>
                            <div class="col-md-6">
                                <label>Budget range</label>
                                <select class="form-select" name="budget" required>
                                    <option value="">Select a range</option>
                                    <option>$1k – $2.5k</option>
                                    <option>$2.5k – $5k</option>
                                    <option>$5k+</option>
                                </select>
                            </div>
                            <div class="col-12">
                                <label>Project description</label>
                                <textarea class="form-control" name="message" rows="4" required placeholder="Tell me about the problem you're solving."></textarea>
                            </div>
                            <div class="col-12 d-flex align-items-center gap-3">
                                <button type="submit" class="btn btn-primary px-4 py-2">Send inquiry</button>
                                <span class="form-success">Thanks — I’ll reply within 24 hours.</span>
                            </div>
                        </div>
                    </form>
                </div>
            </div>`);
    }

    if (!document.querySelector('.site-footer')) {
        document.body.insertAdjacentHTML('beforeend', `
        <footer class="site-footer">
            <div class="container d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
                <div>
                    <strong class="data-profile-name">FreelancePro</strong>
                    <span class="ms-2"> · Available worldwide</span>
                </div>
                <div class="social-links">
                    <a href="https://github.com" aria-label="GitHub"><i class="fa-brands fa-github"></i></a>
                    <a href="https://linkedin.com" aria-label="LinkedIn"><i class="fa-brands fa-linkedin-in"></i></a>
                    <a href="https://dribbble.com" aria-label="Dribbble"><i class="fa-brands fa-dribbble"></i></a>
                </div>
            </div>
        </footer>`);
    }

    if (!document.getElementById('stickyHireMe')) {
        document.body.insertAdjacentHTML('beforeend', `<a href="#contact" id="stickyHireMe"><i class="fa-solid fa-handshake me-2"></i>Hire Me</a>`);
    }
}

function renderCaseStudies() {
    const el = document.querySelector('.data-casestudy-container');
    if (!el) return;
    el.innerHTML = portfolioData.caseStudies.map(c => `
        <div class="case-study-card rounded-4 animate-on-scroll">
            <div class="row g-0">
                <div class="col-lg-5">
                    <img src="${c.image}" alt="${c.title}">
                </div>
                <div class="col-lg-7 p-4 p-lg-5">
                    <span class="fp-eyebrow">${c.client}</span>
                    <h3 class="fw-bold mb-3">${c.title}</h3>
                    <p class="mb-2"><strong>Problem.</strong> ${c.problem}</p>
                    <p class="mb-4"><strong>Solution.</strong> ${c.solution}</p>
                    <div class="d-flex flex-wrap gap-3 mb-4">
                        <div class="case-metric"><strong>${c.metric1.value}</strong><span class="small">${c.metric1.label}</span></div>
                        <div class="case-metric"><strong>${c.metric2.value}</strong><span class="small">${c.metric2.label}</span></div>
                    </div>
                    <div>${c.techTags.map(t => `<span class="badge me-2 mb-1" style="background:var(--primary)">${t}</span>`).join('')}</div>
                </div>
            </div>
        </div>
    `).join('');
}

function renderTestimonials() {
    const grid = document.querySelector('.data-testimonials-grid');
    if (!grid) return;
    grid.innerHTML = portfolioData.testimonials.map(t => `
        <div class="col-lg-4 col-md-6 mb-4">
            <div class="testimonial-card animate-on-scroll">
                <i class="fa-solid fa-quote-left mb-3" style="color:var(--primary);opacity:.7"></i>
                <p class="testimonial-quote mb-4">"${t.text}"</p>
                <div class="d-flex align-items-center">
                    <img src="${t.image}" alt="${t.name}" class="rounded-circle me-3">
                    <div>
                        <h6 class="fw-bold mb-0">${t.name}</h6>
                        <span class="small" style="color:var(--text-muted)">${t.role}</span>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function renderContactForm() {}

function renderFooter() {
    setText('.site-footer .data-profile-name', portfolioData.profile.name);
}

function initNavbarScroll() {
    const nav = document.querySelector('.navbar');
    if (!nav) return;
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}

function initContactForm() {
    const form = document.querySelector('.data-contact-form');
    if (!form) return;
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const success = form.querySelector('.form-success');
        if (success) success.style.display = 'inline';
        form.reset();
    });
}

/* ==========================================================================
   Advanced UI & Animations Impl
   ========================================================================== */

function initPreloader() {
    const preloader = document.getElementById('preloader');
    if(preloader) {
        window.addEventListener('load', () => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.visibility = 'hidden';
            }, 500);
        });
    }
}

function initCustomCursor() {
    const cursor = document.querySelector('.custom-cursor');
    const follower = document.querySelector('.custom-cursor-follower');
    if(!cursor || !follower) return;

    let mouseX = 0, mouseY = 0, followerX = 0, followerY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';
    });

    function animateFollower() {
        followerX += (mouseX - followerX) * 0.1;
        followerY += (mouseY - followerY) * 0.1;
        follower.style.left = followerX + 'px';
        follower.style.top = followerY + 'px';
        requestAnimationFrame(animateFollower);
    }
    animateFollower();

    document.querySelectorAll('a, button, .service-card, .portfolio-card').forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
}

function initAdvancedAnimations() {
    if(typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
            offset: 50,
            easing: 'ease-out-cubic'
        });
    }

    if(typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(document.querySelectorAll("[data-tilt]"));
    }
}

function initTypewriter() {
    const el = document.querySelector('.data-profile-tagline');
    if (el && typeof Typewriter !== 'undefined') {
        el.innerHTML = ''; // clear loading text
        new Typewriter(el, {
            strings: [portfolioData.profile.tagline, portfolioData.profile.title, "UI/UX Enthusiast"],
            autoStart: true,
            loop: true,
            delay: 50,
            deleteSpeed: 30
        });
    }
}

function initCounters() {
    const counters = document.querySelectorAll('.stat-value');
    const speed = 200; 

    const animateCounters = () => {
        counters.forEach(counter => {
            const updateCount = () => {
                const targetStr = counter.getAttribute('data-target');
                if(!targetStr) return;
                
                const target = +targetStr;
                const count = +counter.innerText;
                const inc = target / speed;

                if (count < target) {
                    counter.innerText = Math.ceil(count + inc);
                    setTimeout(updateCount, 10);
                } else {
                    counter.innerText = target + "+"; // assuming original values had +
                }
            };
            updateCount();
        });
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                animateCounters();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const statsContainer = document.querySelector('.data-stats-container');
    if(statsContainer) {
        observer.observe(statsContainer);
    }
}
