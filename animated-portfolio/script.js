/* -------------------------------------------------------------
   Mehedi Hasan - Interactive Portfolio Script
   Senior Full-Stack .NET Developer & AI Integration Architect
   ------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {

    // ---------------------------------------------------------
    // 1. Mobile Navigation Menu Toggle & Body Scroll Lock
    // ---------------------------------------------------------
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    const closeNavMenu = () => {
        if (navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
            const icon = navToggle ? navToggle.querySelector('i') : null;
            if (icon) icon.className = 'fas fa-bars';
        }
    };

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const isActive = navMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open', isActive);
            const icon = navToggle.querySelector('i');
            if (icon) {
                icon.className = isActive ? 'fas fa-times' : 'fas fa-bars';
            }
        });

        // Close menu on link click
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                closeNavMenu();
            });
        });

        // Close menu on clicking outside
        document.addEventListener('click', (e) => {
            if (navMenu.classList.contains('active') && !navMenu.contains(e.target) && !navToggle.contains(e.target)) {
                closeNavMenu();
            }
        });

        // Close menu on Escape key
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeNavMenu();
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
            if (link.getAttribute('href') && link.getAttribute('href').substring(1) === current) {
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
    }, { passive: true });


    // ---------------------------------------------------------
    // 2. Custom Cursor Tracking (Desktop Only)
    // ---------------------------------------------------------
    const cursor = document.querySelector('.custom-cursor');
    const follower = document.querySelector('.custom-cursor-follower');

    if (cursor && follower && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
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
            const ease = 0.15;
            followerX += (mouseX - followerX) * ease;
            followerY += (mouseY - followerY) * ease;

            follower.style.left = `${followerX}px`;
            follower.style.top = `${followerY}px`;

            requestAnimationFrame(updateFollower);
        };
        updateFollower();

        // Hover Effect Listeners
        const attachHoverListeners = () => {
            const hoverables = document.querySelectorAll('a, button, .project-card, .social-icon, .filter-btn, .timeline-content, .skill-category, .highlight-box');
            hoverables.forEach(el => {
                el.addEventListener('mouseenter', () => {
                    document.body.classList.add('hovered-link');
                });
                el.addEventListener('mouseleave', () => {
                    document.body.classList.remove('hovered-link');
                });
            });
        };
        attachHoverListeners();
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
                // Alternate between cyan and purple
                this.baseColor = Math.random() > 0.3 ? 'rgba(0, 242, 254, 0.45)' : 'rgba(191, 85, 236, 0.45)';
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                // Bounce off edges
                if (this.x < 0 || this.x > width) this.speedX *= -1;
                if (this.y < 0 || this.y > height) this.speedY *= -1;

                // React to mouse repulsion
                if (mouse.x !== null) {
                    const dx = mouse.x - this.x;
                    const dy = mouse.y - this.y;
                    const distance = Math.hypot(dx, dy);
                    if (distance < mouse.radius) {
                        const force = (mouse.radius - distance) / mouse.radius;
                        const angle = Math.atan2(dy, dx);
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
            const density = Math.floor((width * height) / 10000);
            const count = Math.min(density, 110);
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
                        const alpha = (100 - distance) / 100 * 0.16;
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
    const words = [
        "Lead .NET Developer",
        "AI Integration Specialist",
        "Enterprise Solutions Architect",
        "RAG & Agentic Systems Engineer",
        "Full-Stack Engineer"
    ];
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
                typingSpeed = 45;
            } else {
                typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
                typingSpeed = 110;
            }

            if (!isDeleting && charIndex === currentWord.length) {
                isDeleting = true;
                typingSpeed = 2200; // Pause when full word is typed
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                typingSpeed = 450;
            }

            setTimeout(type, typingSpeed);
        };

        setTimeout(type, 1200);
    }


    // ---------------------------------------------------------
    // 5. Hero CLI Terminal Simulation (.NET + AI Integration)
    // ---------------------------------------------------------
    const terminalLines = [
        { type: 'input', text: 'dotnet run MehediHasan.Engine.dll --mode=Enterprise --with-ai' },
        { type: 'output', text: 'Hosting environment: Production (High-Availability)' },
        { type: 'output', text: 'Framework: .NET 8 / ASP.NET Core & Angular' },
        { type: 'output', text: 'Database: SQL Server & Oracle 12c (EF Core)' },
        { type: 'output', text: 'AI Kernel: Microsoft Semantic Kernel loaded' },
        { type: 'output', text: 'LLM Connectors: OpenAI & Google Gemini APIs [Active]' },
        { type: 'output', text: 'Vector Store: PostgreSQL (pgvector) RAG Index [Ready]' },
        { type: 'output', text: 'Message Broker: RabbitMQ distributed event channels opened' },
        { type: 'output', text: 'Distributed Cache: Redis Cache (Connected - < 1ms)' },
        { type: 'output', text: 'Application live at: https://profileofmehedi.github.io' },
        { type: 'prompt', text: 'AI.DotNet.Architect ready > ' }
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
                        setTimeout(typeChar, 35);
                    } else {
                        lineIndex++;
                        setTimeout(renderTerminal, 500);
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
                setTimeout(renderTerminal, 240);
            }

            terminalBody.scrollTop = terminalBody.scrollHeight;
        };

        setTimeout(renderTerminal, 400);
    }


    // ---------------------------------------------------------
    // 6. Interactive Projects Grid & Filtering
    // ---------------------------------------------------------
    const projectsData = [
        {
            id: 'proj-ai-1',
            category: 'ai-apps',
            title: 'Enterprise AI Copilot & RAG Knowledge Engine',
            description: 'An enterprise-grade Retrieval-Augmented Generation (RAG) copilot built with ASP.NET Core, Semantic Kernel, and vector embeddings. Enables natural language semantic search and automated question answering over vast corporate banking, HR, and compliance repositories with source citations.',
            tags: ['ASP.NET Core', 'Semantic Kernel', 'OpenAI API', 'pgvector', 'Angular', 'Redis'],
            company: 'Enterprise FinTech Solutions',
            period: 'Jan 2024 - Present',
            details: [
                'Architected high-throughput RAG pipeline in .NET using Microsoft Semantic Kernel and OpenAI embeddings.',
                'Integrated PostgreSQL pgvector for hybrid semantic and keyword search across thousands of policy documents.',
                'Engineered automated document chunking, token budgeting, and guardrails to eliminate LLM hallucinations.',
                'Developed secure Angular frontend with real-time streaming responses (Server-Sent Events) and citation link badges.',
                'Configured Redis caching to store frequent prompt responses and slash API token consumption by 45%.'
            ],
            links: { demo: 'https://github.com/mehedihasan9339', code: 'https://github.com/mehedihasan9339' },
            isProprietary: false
        },
        {
            id: 'proj-ai-2',
            category: 'ai-apps',
            title: 'Autonomous KYC & Financial Document Agent',
            description: 'An AI-powered document extraction and customer verification pipeline using multimodal LLMs and .NET microservices. Automates NID, passport, and bank statement verification with human-in-the-loop audit logging.',
            tags: ['C#.NET', 'Gemini Vision', 'LLM Function Calling', 'RabbitMQ', 'SQL Server'],
            company: 'FinTech Innovation Lab',
            period: 'Oct 2023 - Jun 2024',
            details: [
                'Integrated Gemini Vision and OCR models with ASP.NET Core Web API for multi-format document verification.',
                'Implemented autonomous LLM tool calling to match OCR data against National Registry APIs.',
                'Designed RabbitMQ asynchronous queue architecture to handle parallel document processing without throttling.',
                'Built custom confidence scoring algorithms to route suspicious records to human compliance officers.',
                'Reduced customer verification turnaround time from 24 hours to under 30 seconds.'
            ],
            links: { demo: '#', code: '#' },
            isProprietary: true
        },
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
            id: 'proj-ai-3',
            category: 'ai-apps',
            title: 'Evercare AI Healthcare Chatbot Service',
            description: 'An intelligent medical assistant microservice integrated with the hospital core database for booking appointments, checking doctor schedules, and natural language symptom triage.',
            tags: ['.NET Core', 'SignalR', 'OpenAI API', 'SQL Server', 'REST API'],
            company: 'Evercare Hospital of Bangladesh',
            period: 'May 2020 - Nov 2020',
            details: [
                'Designed relational schemas in SQL Server to handle chat records and doctor roster mappings.',
                'Integrated OpenAI API with custom intent classification to understand patient scheduling requests.',
                'Built a SignalR real-time communications channel to map patient questions dynamically.',
                'Created an embeddable widget script for external hospital portals to load the intelligent assistant seamlessly.',
                'Integrated doctor schedules by calling core hospital REST endpoints securely.'
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
            : projectsData.filter(p => {
                if (filterCategory === 'ai-apps') return p.category === 'ai-apps';
                if (filterCategory === 'apis') return p.category === 'apis' || p.id === 'proj-ai-3';
                return p.category === filterCategory;
            });

        filtered.forEach((p, idx) => {
            const card = document.createElement('div');
            card.className = 'project-card glass-card reveal';
            card.style.transitionDelay = `${(idx % 3) * 0.08}s`;

            let cardIconClass = 'fas fa-laptop-code';
            if (p.category === 'ai-apps') cardIconClass = 'fas fa-brain';
            else if (p.category === 'apis') cardIconClass = 'fas fa-server';

            // Build demo & code links or lock icons if proprietary
            let linksHtml = '';
            if (p.isProprietary) {
                linksHtml = `
                    <span class="prop-link-lock" title="Proprietary App - Details inside"><i class="fas fa-shield-alt"></i></span>
                `;
            } else {
                if (p.links.demo && p.links.demo !== '#') {
                    linksHtml += `<a href="${p.links.demo}" target="_blank" rel="noopener" title="Live Demo"><i class="fas fa-external-link-alt"></i></a>`;
                }
                if (p.links.code && p.links.code !== '#') {
                    linksHtml += `<a href="${p.links.code}" target="_blank" rel="noopener" title="Source Code"><i class="fab fa-github"></i></a>`;
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
                <button class="project-more-btn" data-id="${p.id}" aria-label="View details for ${p.title}">
                    Learn More <i class="fas fa-arrow-right"></i>
                </button>
            `;
            projectsContainer.appendChild(card);
        });

        // Trigger reveal immediately for filtered projects
        setTimeout(() => {
            const revealedCards = projectsContainer.querySelectorAll('.reveal');
            revealedCards.forEach(c => c.classList.add('revealed'));
            initCardTilt();
        }, 80);
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
                detailsHtml += `<li style="position:relative; padding-left:22px; margin-bottom:10px; line-height:1.6; color:var(--text-muted)">
                    <span style="position:absolute; left:0; color:var(--primary); font-weight:bold;">✓</span> ${detail}
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
                    <i class="fas fa-lock"></i> Enterprise closed codebase system.
                </span>
                <button class="btn btn-secondary modal-close-btn-cta">Close</button>
            `;
        } else {
            let footerLinks = '';
            if (project.links.demo && project.links.demo !== '#') {
                footerLinks += `<a href="${project.links.demo}" target="_blank" rel="noopener" class="btn btn-primary"><i class="fas fa-external-link-alt"></i> View Demo</a>`;
            }
            if (project.links.code && project.links.code !== '#') {
                footerLinks += `<a href="${project.links.code}" target="_blank" rel="noopener" class="btn btn-secondary"><i class="fab fa-github"></i> Source Code</a>`;
            }
            footerLinks += `<button class="btn btn-secondary modal-close-btn-cta">Close</button>`;
            modalFooter.innerHTML = footerLinks;
        }

        const innerClose = modalFooter.querySelector('.modal-close-btn-cta');
        if (innerClose) {
            innerClose.addEventListener('click', closeModal);
        }

        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        if (!modalOverlay) return;
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
    };

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
    // 8. 3D Card Tilt & Interactive Cursor Spotlight
    // ---------------------------------------------------------
    const initCardTilt = () => {
        if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

        const cards = document.querySelectorAll('.glass-card, .project-card, .skill-category');
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = ((y - centerY) / centerY) * -4.5;
                const rotateY = ((x - centerX) / centerX) * 4.5;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    };
    initCardTilt();


    // ---------------------------------------------------------
    // 9. Animated Stats Counter
    // ---------------------------------------------------------
    const animateStatsCounter = () => {
        const counters = document.querySelectorAll('.highlight-box .number');
        if (!counters.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = parseInt(el.getAttribute('data-target'), 10);
                    const suffix = el.getAttribute('data-suffix') || '';
                    if (isNaN(target)) return;

                    let current = 0;
                    const duration = 1800;
                    const startTime = performance.now();

                    const updateCounter = (now) => {
                        const elapsed = now - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        const easeOut = 1 - Math.pow(1 - progress, 3);
                        current = Math.floor(easeOut * target);
                        el.textContent = `${current}${suffix}`;

                        if (progress < 1) {
                            requestAnimationFrame(updateCounter);
                        } else {
                            el.textContent = `${target}${suffix}`;
                        }
                    };

                    requestAnimationFrame(updateCounter);
                    observer.unobserve(el);
                }
            });
        }, { threshold: 0.4 });

        counters.forEach(c => observer.observe(c));
    };
    animateStatsCounter();


    // ---------------------------------------------------------
    // 10. Scroll Entrance Animations (Intersection Observer)
    // ---------------------------------------------------------
    const revealElements = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window && revealElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -40px 0px'
        });

        revealElements.forEach(el => observer.observe(el));
    } else {
        revealElements.forEach(el => el.classList.add('revealed'));
    }


    // ---------------------------------------------------------
    // 11. Floating Back To Top Button with Circular Scroll Progress
    // ---------------------------------------------------------
    const initBackToTop = () => {
        const btn = document.getElementById('backToTopBtn');
        if (!btn) return;
        const circle = btn.querySelector('.progress-ring__circle');
        if (!circle) return;

        const radius = circle.r.baseVal.value;
        const circumference = 2 * Math.PI * radius;
        circle.style.strokeDasharray = `${circumference} ${circumference}`;
        circle.style.strokeDashoffset = `${circumference}`;

        const updateProgress = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = docHeight > 0 ? scrollTop / docHeight : 0;
            const offset = circumference - (scrollPercent * circumference);
            circle.style.strokeDashoffset = offset;

            if (scrollTop > 350) {
                btn.classList.add('visible');
            } else {
                btn.classList.remove('visible');
            }
        };

        window.addEventListener('scroll', updateProgress, { passive: true });
        btn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    };
    initBackToTop();


    // ---------------------------------------------------------
    // 12. Contact Form Interactive Feedback
    // ---------------------------------------------------------
    const contactForm = document.getElementById('portfolio-contact-form');
    const formStatus = document.getElementById('form-status-message');

    if (contactForm && formStatus) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;

            submitBtn.disabled = true;
            submitBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Transmitting...`;

            setTimeout(() => {
                formStatus.textContent = "Thank you! Your message was transmitted successfully. Mehedi will get back to you promptly.";
                formStatus.className = "form-status success";

                contactForm.reset();

                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;

                setTimeout(() => {
                    formStatus.style.display = 'none';
                }, 6000);
            }, 1400);
        });
    }


    // ---------------------------------------------------------
    // 13. Dynamic Homepage Blog Section
    // ---------------------------------------------------------
    const homepageBlogGrid = document.getElementById('homepage-blog-grid');
    if (homepageBlogGrid && typeof POSTS !== 'undefined' && POSTS.length > 0) {
        const shuffled = [...POSTS].sort(() => Math.random() - 0.5);
        const picks = shuffled.slice(0, 2);

        function getCategoryLabel(cat) {
            if (typeof CATEGORIES !== 'undefined' && CATEGORIES[cat]) {
                return CATEGORIES[cat].label;
            }
            return cat.charAt(0).toUpperCase() + cat.slice(1);
        }

        homepageBlogGrid.innerHTML = picks.map((post, i) => `
            <article class="blog-card glass-card reveal" style="transition-delay:${i * 0.12}s; cursor:pointer;"
                     onclick="window.location.href='blog/post.html?slug=${post.slug}'"
                     role="button" tabindex="0"
                     aria-label="Read: ${post.title.en || post.title.bn || post.title}">
                <span class="blog-card-meta">
                    <i class="${post.icon || 'fas fa-pen-nib'}" style="margin-right:6px;opacity:0.8;"></i>
                    ${getCategoryLabel(post.category)}
                </span>
                <h3 class="blog-card-title">${post.title.en || post.title.bn || post.title}</h3>
                <p class="blog-card-desc">${post.excerpt.en || post.excerpt.bn || post.excerpt}</p>
                <span class="project-more-btn" style="display:inline-flex;align-items:center;gap:8px;margin-top:12px;">
                    Read Article <i class="fas fa-arrow-right"></i>
                </span>
            </article>
        `).join('');

        const newCards = homepageBlogGrid.querySelectorAll('.reveal');
        newCards.forEach(el => {
            requestAnimationFrame(() => el.classList.add('revealed'));
        });
        initCardTilt();
    }
});
