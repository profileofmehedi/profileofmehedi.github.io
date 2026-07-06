/* -------------------------------------------------------------
   Mehedi Hasan - Interactive Portfolio Script
   ------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
    // ---------------------------------------------------------
    // 1. Mobile Navigation Menu Toggle
    // ---------------------------------------------------------
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = navToggle.querySelector('i');
            if (icon) {
                if (navMenu.classList.contains('active')) {
                    icon.className = 'fas fa-times';
                } else {
                    icon.className = 'fas fa-bars';
                }
            }
        });

        // Close menu on link click
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                const icon = navToggle.querySelector('i');
                if (icon) icon.className = 'fas fa-bars';
            });
        });
    }

    // Scroll Active Link Indicator
    const sections = document.querySelectorAll('section');
    window.addEventListener('scroll', () => {
        let current = '';
        const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollPosition >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });

        // Header Background on Scroll
        const header = document.querySelector('header');
        if (header) {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
    });


    // ---------------------------------------------------------
    // 2. Custom Cursor Tracking
    // ---------------------------------------------------------
    const cursor = document.querySelector('.custom-cursor');
    const follower = document.querySelector('.custom-cursor-follower');

    if (cursor && follower) {
        let mouseX = 0, mouseY = 0;
        let followerX = 0, followerY = 0;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            // Instantly move the small pointer
            cursor.style.left = `${mouseX}px`;
            cursor.style.top = `${mouseY}px`;
        });

        // Smoothly animate the cursor follower
        const updateFollower = () => {
            const ease = 0.15; // Interpolation ease
            followerX += (mouseX - followerX) * ease;
            followerY += (mouseY - followerY) * ease;

            follower.style.left = `${followerX}px`;
            follower.style.top = `${followerY}px`;

            requestAnimationFrame(updateFollower);
        };
        updateFollower();

        // Hover Effect Listeners
        const hoverables = document.querySelectorAll('a, button, .project-card, .social-icon, .filter-btn, .timeline-content');
        hoverables.forEach(el => {
            el.addEventListener('mouseenter', () => {
                document.body.classList.add('hovered-link');
            });
            el.addEventListener('mouseleave', () => {
                document.body.classList.remove('hovered-link');
            });
        });
    }


    // ---------------------------------------------------------
    // 3. Interactive Particle Canvas Background
    // ---------------------------------------------------------
    const canvas = document.getElementById('particles-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        const mouse = { x: null, y: null, radius: 120 };

        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        window.addEventListener('mouseout', () => {
            mouse.x = null;
            mouse.y = null;
        });

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            initParticles();
        });

        class Particle {
            constructor(x, y) {
                this.x = x;
                this.y = y;
                this.size = Math.random() * 2 + 1;
                this.speedX = (Math.random() - 0.5) * 0.6;
                this.speedY = (Math.random() - 0.5) * 0.6;
                this.baseColor = 'rgba(79, 172, 254, 0.4)';
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                // Bounce off edges
                if (this.x < 0 || this.x > width) this.speedX *= -1;
                if (this.y < 0 || this.y > height) this.speedY *= -1;

                // React to mouse repulsion/pull
                if (mouse.x !== null) {
                    const dx = mouse.x - this.x;
                    const dy = mouse.y - this.y;
                    const distance = Math.hypot(dx, dy);
                    if (distance < mouse.radius) {
                        const force = (mouse.radius - distance) / mouse.radius;
                        const angle = Math.atan2(dy, dx);
                        // Repel
                        this.x -= Math.cos(angle) * force * 2;
                        this.y -= Math.sin(angle) * force * 2;
                    }
                }
            }

            draw() {
                ctx.fillStyle = this.baseColor;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        const initParticles = () => {
            particles = [];
            const density = Math.floor((width * height) / 9000);
            const count = Math.min(density, 120); // Cap particles to maintain speed
            for (let i = 0; i < count; i++) {
                particles.push(new Particle(Math.random() * width, Math.random() * height));
            }
        };

        const drawLines = () => {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.hypot(dx, dy);

                    if (distance < 100) {
                        const alpha = (100 - distance) / 100 * 0.15;
                        ctx.strokeStyle = `rgba(0, 242, 254, ${alpha})`;
                        ctx.lineWidth = 0.8;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
        };

        const animateParticles = () => {
            ctx.clearRect(0, 0, width, height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            drawLines();
            requestAnimationFrame(animateParticles);
        };

        initParticles();
        animateParticles();
    }


    // ---------------------------------------------------------
    // 4. Hero Section Typewriter Carousel
    // ---------------------------------------------------------
    const words = ["Lead .NET Developer", "Full-Stack Engineer", "Software Architect", "Technical Leader"];
    const typewriterElement = document.getElementById('typewriter-text');

    if (typewriterElement) {
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingSpeed = 100;

        const type = () => {
            const currentWord = words[wordIndex];
            if (isDeleting) {
                typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
                typingSpeed = 50; // Delete faster
            } else {
                typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
                typingSpeed = 120; // Normal typing speed
            }

            if (!isDeleting && charIndex === currentWord.length) {
                isDeleting = true;
                typingSpeed = 2000; // Pause at full word
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                typingSpeed = 500; // Pause before typing next word
            }

            setTimeout(type, typingSpeed);
        };

        setTimeout(type, 1500); // Start typewriter after terminal simulation
    }


    // ---------------------------------------------------------
    // 5. Hero CLI Terminal Mockup Simulation
    // ---------------------------------------------------------
    const terminalLines = [
        { type: 'input', text: 'dotnet run MehediHasan.dll --env Development' },
        { type: 'output', text: 'Hosting environment: Development' },
        { type: 'output', text: 'Content root path: E:\\Mehedi\\Portfolio' },
        { type: 'output', text: 'Database initialized: Microsoft SQL Server & Oracle 12c' },
        { type: 'output', text: 'Caching provider: Redis Cache (Connected)' },
        { type: 'output', text: 'Message broker: RabbitMQ channels opened.' },
        { type: 'output', text: 'Application started. Press Ctrl+C to shut down.' },
        { type: 'output', text: 'Now listening on: https://localhost:5001' },
        { type: 'prompt', text: 'Lead.NET.Dev.Console ready > ' }
    ];

    const terminalBody = document.getElementById('terminal-content');
    if (terminalBody) {
        let lineIndex = 0;

        const renderTerminal = () => {
            if (lineIndex >= terminalLines.length) return;

            const lineData = terminalLines[lineIndex];
            const div = document.createElement('div');
            div.className = 'terminal-line';

            if (lineData.type === 'input') {
                div.innerHTML = `<span class="terminal-prompt">$ </span><span class="typed-text"></span>`;
                terminalBody.appendChild(div);

                const textSpan = div.querySelector('.typed-text');
                let charPos = 0;
                const typeChar = () => {
                    if (charPos < lineData.text.length) {
                        textSpan.textContent += lineData.text.charAt(charPos);
                        charPos++;
                        setTimeout(typeChar, 40);
                    } else {
                        lineIndex++;
                        setTimeout(renderTerminal, 600);
                    }
                };
                typeChar();
            } else if (lineData.type === 'prompt') {
                div.innerHTML = `<span class="terminal-prompt">${lineData.text}</span><span class="typewrite-cursor"></span>`;
                terminalBody.appendChild(div);
                lineIndex++;
            } else {
                div.innerHTML = `<span class="terminal-output">${lineData.text}</span>`;
                terminalBody.appendChild(div);
                lineIndex++;
                setTimeout(renderTerminal, 300);
            }

            // Scroll to bottom of terminal
            terminalBody.scrollTop = terminalBody.scrollHeight;
        };

        setTimeout(renderTerminal, 500);
    }


    // ---------------------------------------------------------
    // 6. Interactive Projects Grid & Filtering
    // ---------------------------------------------------------
    const projectsData = [
        {
            id: 'proj1',
            category: 'web-apps',
            title: 'Digital Banking System',
            description: 'Developed a comprehensive microservice platform for customer registration, loan applications, and DPS management, supporting auto-generated payment schedules and mobile banking integration.',
            tags: ['ASP.NET Core', 'Angular 14', 'SQL Server', 'Redis', 'TypeScript'],
            company: 'LankaBangla Finance',
            period: 'Sep 2023 - Present',
            details: [
                'Developed the product design using Angular, SQL Server, and ASP.NET Core Web API.',
                'Integrated Nagad Mobile Payment Gateway using the Nagad .NET SDK.',
                'Built high-performance APIs for DPS Creation, Payments, and Encashments.',
                'Engineered backend logic for Close of Business Day processing with heavy SQL stored procedures and Angular notifications.',
                'Created microservices in .NET and RabbitMQ to handle email/SMS delivery queues.'
            ],
            links: { demo: '#', code: '#' },
            isProprietary: true
        },
        {
            id: 'proj2',
            category: 'web-apps',
            title: 'HR & Payroll for ICB Bank',
            description: 'An enterprise-grade system for employee management, staff loans, tax calculation, and ACR generation, built on a robust Oracle 12c database.',
            tags: ['.NET Core', 'Oracle 12c', 'MVC', 'JavaScript', 'jQuery'],
            company: 'ICB Bank Bangladesh PLC.',
            period: 'Jan 2023 - Aug 2023',
            details: [
                'Designed the backend database schemas in Oracle 12c for staff records and organization charts.',
                'Developed the core logic of Annual Confidential Reports (ACR) and approval routing pipelines.',
                'Built database structures for the "Transfer and Joining" workflow in Oracle 12c and MVC Core.',
                'Implemented automated income tax calculations according to National Board of Revenue (NBR) policies.'
            ],
            links: { demo: '#', code: '#' },
            isProprietary: true
        },
        {
            id: 'proj3',
            category: 'web-apps',
            title: 'Uganda Microfinance Solution',
            description: 'A comprehensive microfinance solution for UMOJA Microfinance (Uganda) to manage customer onboarding, loan collections, and accounting.',
            tags: ['.NET Core', 'SQL Server', 'Nginx', 'Redis', 'Razor Pages'],
            company: 'UMOJA Microfinance, Uganda',
            period: 'Apr 2021 - Dec 2022',
            details: [
                'Led the core developer team to plan and deliver the project on schedule.',
                'Implemented the member registry, payment scheduling, and loan collection parts with SQL Server.',
                'Developed complex stored procedures for financial reporting including Profit/Loss, Balance Sheets, and Cash Flow logs.',
                'Built bulk data migration UI using Razor Pages to upload historical Excel records.',
                'Deployed the application using Nginx reverse proxying to Kestrel servers.'
            ],
            links: { demo: '#', code: '#' },
            isProprietary: true
        },
        {
            id: 'proj4',
            category: 'web-apps',
            title: 'HR & Payroll for BDBL',
            description: 'HR operations system managing salary, attendance, benefits, and staff loans. Integrated with a Core Banking System (CBS) via SOAP APIs.',
            tags: ['.NET Core', 'SQL Server', 'SignalR', 'SOAP', 'Mailkit'],
            company: 'Bangladesh Development Bank PLC (BDBL)',
            period: 'May 2020 - Mar 2021',
            details: [
                'Worked on HRM and Payroll engines using SQL Server 2018 and ASP.NET Core.',
                'Implemented recruitment and resigning workflows with custom approval metrics.',
                'Linked external database servers for real-time attendance syncing using SQL Linked Servers.',
                'Integrated SignalR and AJAX for live leave notification alerts.',
                'Developed CBS staff loan integration via secure XML/SOAP API calls.'
            ],
            links: { demo: '#', code: '#' },
            isProprietary: true
        },
        {
            id: 'proj5',
            category: 'web-apps',
            title: 'Pro-Edge Pundit',
            description: 'An educational exam and course hosting platform for teachers and students with online tests and verifiable certificates.',
            tags: ['.NET Core', 'Razor Pages', 'SQL Server', 'jQuery', 'CSS3'],
            company: 'Independent Project',
            period: 'Dec 2020 - Apr 2021',
            details: [
                'Developed an authoring panel for teachers to publish courses and upload videos.',
                'Built the interactive exam module featuring multiple-choice and short-answer questions using JavaScript and Ajax.',
                'Created a verification engine to authenticate students certificates via a unique QR/serial code.'
            ],
            links: { demo: 'https://github.com/mehedihasan9339', code: 'https://github.com/mehedihasan9339' },
            isProprietary: false
        },
        {
            id: 'proj6',
            category: 'apis',
            title: 'Evercare Chatbot Service',
            description: 'A microservice chatbot integrated with the hospital core database for booking appointments and checking schedules.',
            tags: ['.NET Core', 'SignalR', 'REST API', 'SQL Server', 'JSON'],
            company: 'Evercare Hospital of Bangladesh',
            period: 'May 2020 - Nov 2020',
            details: [
                'Designed the relational tables in SQL Server to handle chat records and doctor rosters.',
                'Built a SignalR real-time communications channel to map patient questions dynamically.',
                'Created an embeddable iframe script tag for external websites to load the chatbot widget.',
                'Integrated doctor schedules by calling core hospital REST endpoints securely.'
            ],
            links: { demo: '#', code: '#' },
            isProprietary: true
        },
        {
            id: 'proj7',
            category: 'web-apps',
            title: 'Police Store Management',
            description: 'Inventory and requisitions system with a multi-level approval supply chain flow developed for Bangladesh Police.',
            tags: ['.NET Core', 'Razor Pages', 'SQL Server', 'DinkToPdf', 'Bootstrap'],
            company: 'Bangladesh Police',
            period: 'Jan 2020 - Apr 2020',
            details: [
                'Designed approval workflow roles (Raiser, Reviewer, Approver) using custom ASP.NET Core middleware.',
                'Created interactive UI using Bootstrap and Razor Pages to submit requisitions.',
                'Engineered PDF report generation using DinkToPdf to print invoices and delivery slips.'
            ],
            links: { demo: '#', code: '#' },
            isProprietary: true
        },
        {
            id: 'proj8',
            category: 'web-apps',
            title: 'e-Zone E-commerce Platform',
            description: 'A full-featured B2C platform with SSL Commerz gateway integration and automated shopping carts.',
            tags: ['.NET Core', 'SQL Server', 'JavaScript', 'SSL Commerz', 'bKash SDK'],
            company: 'e-Zone Limited',
            period: 'Sep 2019 - Dec 2019',
            details: [
                'Built client-side shopping cart utilities using vanilla JavaScript and CSS grid/flexbox.',
                'Integrated bKash and SSL Commerz payment gateways using official SDK modules.',
                'Optimized parent-child query speeds for deep category hierarchies in SQL Server.'
            ],
            links: { demo: 'https://github.com/mehedihasan9339', code: '#' },
            isProprietary: true
        },
        {
            id: 'proj9',
            category: 'apis',
            title: 'Engineering Club System',
            description: 'A portal managing membership entries, event reservations, and group messaging via SMTP/SMS protocols.',
            tags: ['.NET Core', 'MySQL', 'JavaScript', 'Mailkit SDK', 'SMS API'],
            company: 'Bangladesh Engineering Club',
            period: 'Jun 2019 - Aug 2019',
            details: [
                'Developed event administration views using MySQL databases.',
                'Integrated automated email notification updates using Mailkit SMTP configurations.',
                'Built SMS distribution lists for member announcements using generic HTTP SMS APIs.'
            ],
            links: { demo: 'https://github.com/mehedihasan9339', code: 'https://github.com/mehedihasan9339' },
            isProprietary: false
        }
    ];

    const projectsContainer = document.getElementById('projects-container');
    const filterButtons = document.querySelectorAll('.filter-btn');

    // Populate Projects Grid
    const displayProjects = (filterCategory = 'all') => {
        if (!projectsContainer) return;
        projectsContainer.innerHTML = '';

        const filtered = filterCategory === 'all'
            ? projectsData
            : projectsData.filter(p => p.category === filterCategory);

        filtered.forEach((p, idx) => {
            const card = document.createElement('div');
            card.className = 'project-card glass-card reveal';
            card.style.transitionDelay = `${(idx % 3) * 0.1}s`;

            const cardIconClass = p.category === 'apis' ? 'fas fa-server' : 'fas fa-laptop-code';

            // Build demo & code links or lock icons if proprietary
            let linksHtml = '';
            if (p.isProprietary) {
                linksHtml = `
                    <a href="#" class="prop-link-lock" title="Proprietary App - Details inside"><i class="fas fa-lock"></i></a>
                `;
            } else {
                if (p.links.demo && p.links.demo !== '#') {
                    linksHtml += `<a href="${p.links.demo}" target="_blank" title="Live Demo"><i class="fas fa-external-link-alt"></i></a>`;
                }
                if (p.links.code && p.links.code !== '#') {
                    linksHtml += `<a href="${p.links.code}" target="_blank" title="Source Code"><i class="fab fa-github"></i></a>`;
                }
            }

            const tagsHtml = p.tags.slice(0, 3).map(t => `<span class="project-card-tag">${t}</span>`).join('');

            card.innerHTML = `
                <div class="project-card-header">
                    <i class="${cardIconClass} project-icon"></i>
                    <div class="project-card-links">
                        ${linksHtml}
                    </div>
                </div>
                <h3 class="project-card-title">${p.title}</h3>
                <p class="project-card-desc">${p.description}</p>
                <div class="project-card-tags">
                    ${tagsHtml}
                    ${p.tags.length > 3 ? `<span class="project-card-tag">+${p.tags.length - 3}</span>` : ''}
                </div>
                <button class="project-more-btn" data-id="${p.id}">
                    Learn More <i class="fas fa-arrow-right"></i>
                </button>
            `;
            projectsContainer.appendChild(card);

            // Re-apply hover cursor effect to dynamically generated items
            card.addEventListener('mouseenter', () => document.body.classList.add('hovered-link'));
            card.addEventListener('mouseleave', () => document.body.classList.remove('hovered-link'));

            const moreBtn = card.querySelector('.project-more-btn');
            moreBtn.addEventListener('mouseenter', () => document.body.classList.add('hovered-link'));
            moreBtn.addEventListener('mouseleave', () => document.body.classList.remove('hovered-link'));
        });

        // Trigger reveal immediately for filtered projects
        setTimeout(() => {
            const revealedCards = projectsContainer.querySelectorAll('.reveal');
            revealedCards.forEach(c => c.classList.add('revealed'));
        }, 100);
    };

    // Initialize Grid
    displayProjects();

    // Filter Buttons Listeners
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            displayProjects(btn.getAttribute('data-filter'));
        });
    });


    // ---------------------------------------------------------
    // 7. Dynamic Project Modals Controller
    // ---------------------------------------------------------
    const modalOverlay = document.getElementById('project-modal');
    const modalCloseBtn = document.querySelector('.modal-close');

    const openModal = (projectId) => {
        const project = projectsData.find(p => p.id === projectId);
        if (!project || !modalOverlay) return;

        // Populate Modal Fields
        modalOverlay.querySelector('.modal-title').textContent = project.title;
        modalOverlay.querySelector('.modal-subtitle').textContent = project.company;

        let detailsHtml = '';
        if (project.period) {
            detailsHtml += `<p style="margin-bottom:15px; font-weight:600; color:var(--secondary)">Timeline: ${project.period}</p>`;
        }
        detailsHtml += `<p style="margin-bottom:20px; line-height:1.7; text-align:justify;">${project.description}</p>`;

        if (project.details && project.details.length > 0) {
            detailsHtml += `<h4 class="modal-section-title">Key Responsibilities & Contributions</h4>`;
            detailsHtml += `<ul style="list-style:none; padding-left:0; margin-bottom:20px;">`;
            project.details.forEach(detail => {
                detailsHtml += `<li style="position:relative; padding-left:20px; margin-bottom:8px; line-height:1.6; color:var(--text-muted)">
                    <span style="position:absolute; left:0; color:var(--primary)">✓</span> ${detail}
                </li>`;
            });
            detailsHtml += `</ul>`;
        }

        detailsHtml += `<h4 class="modal-section-title">Technology Stack</h4>`;
        detailsHtml += `<div class="modal-tags">`;
        project.tags.forEach(tag => {
            detailsHtml += `<span class="modal-tag">${tag}</span>`;
        });
        detailsHtml += `</div>`;

        modalOverlay.querySelector('.modal-body').innerHTML = detailsHtml;

        // Footer CTA
        const modalFooter = modalOverlay.querySelector('.modal-footer');
        modalFooter.innerHTML = '';
        if (project.isProprietary) {
            modalFooter.innerHTML = `
                <span style="font-size:0.85rem; color:var(--text-muted); display:flex; align-items:center; gap:6px;">
                    <i class="fas fa-info-circle"></i> Closed codebase/Enterprise system.
                </span>
                <button class="btn btn-secondary modal-close-btn-cta">Close</button>
            `;
        } else {
            let footerLinks = '';
            if (project.links.demo && project.links.demo !== '#') {
                footerLinks += `<a href="${project.links.demo}" target="_blank" class="btn btn-primary"><i class="fas fa-external-link-alt"></i> View Demo</a>`;
            }
            if (project.links.code && project.links.code !== '#') {
                footerLinks += `<a href="${project.links.code}" target="_blank" class="btn btn-secondary"><i class="fab fa-github"></i> Source Code</a>`;
            }
            footerLinks += `<button class="btn btn-secondary modal-close-btn-cta" style="border:none">Cancel</button>`;
            modalFooter.innerHTML = footerLinks;
        }

        // Add close listeners to inside footer buttons
        const innerClose = modalFooter.querySelector('.modal-close-btn-cta');
        if (innerClose) {
            innerClose.addEventListener('click', closeModal);
            innerClose.addEventListener('mouseenter', () => document.body.classList.add('hovered-link'));
            innerClose.addEventListener('mouseleave', () => document.body.classList.remove('hovered-link'));
        }

        // Activate Modal
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Stop background scrolling
    };

    const closeModal = () => {
        if (!modalOverlay) return;
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
    };

    // Event Delegation for dynamically built card button clicks
    if (projectsContainer) {
        projectsContainer.addEventListener('click', (e) => {
            const moreBtn = e.target.closest('.project-more-btn');
            if (moreBtn) {
                const projectId = moreBtn.getAttribute('data-id');
                openModal(projectId);
            }
        });
    }

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeModal);
    }

    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) closeModal();
        });
    }

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });


    // ---------------------------------------------------------
    // 8. Scroll Entrance Animations (Intersection Observer)
    // ---------------------------------------------------------
    const revealElements = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window && revealElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    // Stop observing once animated
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px' // Trigger slightly before element fits in viewport
        });

        revealElements.forEach(el => observer.observe(el));
    } else {
        // Fallback for older browsers
        revealElements.forEach(el => el.classList.add('revealed'));
    }


    // ---------------------------------------------------------
    // 9. Contact / Newsletter Form Validation
    // ---------------------------------------------------------
    const contactForm = document.getElementById('portfolio-contact-form');
    const formStatus = document.getElementById('form-status-message');

    if (contactForm && formStatus) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;

            // Simulating Sending State
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Sending...`;

            setTimeout(() => {
                // Simulating Success Response
                formStatus.textContent = "Thank you! Your message was sent successfully. Mehedi will get back to you shortly.";
                formStatus.className = "form-status success";

                // Clear inputs
                contactForm.reset();

                // Reset Button
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;

                // Hide success message after 5 seconds
                setTimeout(() => {
                    formStatus.style.display = 'none';
                }, 5000);
            }, 1800);
        });
    }
    // ---------------------------------------------------------
    // Dynamic Homepage Blog Section
    // Reads from global POSTS array (blog/data.js) and renders 2 random picks
    // ---------------------------------------------------------
    const homepageBlogGrid = document.getElementById('homepage-blog-grid');
    if (homepageBlogGrid && typeof POSTS !== 'undefined' && POSTS.length > 0) {

        // Pick 2 unique random posts
        const shuffled = [...POSTS].sort(() => Math.random() - 0.5);
        const picks = shuffled.slice(0, 2);

        // Map category key to readable label using CATEGORIES if available
        function getCategoryLabel(cat) {
            if (typeof CATEGORIES !== 'undefined' && CATEGORIES[cat]) {
                return CATEGORIES[cat].label;
            }
            return cat.charAt(0).toUpperCase() + cat.slice(1);
        }

        // Render cards
        homepageBlogGrid.innerHTML = picks.map((post, i) => `
            <article class="blog-card glass-card reveal" style="transition-delay:${i * 0.15}s; cursor:pointer;"
                     onclick="window.location.href='blog/post.html?slug=${post.slug}'"
                     role="button" tabindex="0"
                     aria-label="Read: ${post.title}">
                <span class="blog-card-meta">
                    <i class="${post.icon || 'fas fa-pen-nib'}" style="margin-right:6px;opacity:0.8;"></i>
                    ${getCategoryLabel(post.category)}
                </span>
                <h3 class="blog-card-title">${post.title}</h3>
                <p class="blog-card-desc">${post.excerpt}</p>
                <span class="project-more-btn" style="display:inline-flex;align-items:center;gap:8px;margin-top:12px;">
                    Read Article <i class="fas fa-arrow-right"></i>
                </span>
            </article>
        `).join('');

        // Trigger reveal animation on the newly inserted cards
        const newCards = homepageBlogGrid.querySelectorAll('.reveal');
        newCards.forEach(el => {
            // Small delay so CSS transition fires after paint
            requestAnimationFrame(() => el.classList.add('revealed'));
        });
    }
});
