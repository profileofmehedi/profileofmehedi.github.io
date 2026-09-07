// Shared Data for all 10 FreelancePro Themes

const portfolioData = {
    profile: {
        name: "FreelancePro",
        title: "Senior Full-Stack Developer & UI/UX Designer",
        tagline: "I Help Businesses Build Better Digital Experiences",
        description: "Specializing in scalable SaaS applications, high-converting landing pages, and robust digital solutions.",
        image: "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=600&q=80",
        stats: [
            { value: "5+", label: "Years Exp." },
            { value: "50+", label: "Projects" },
            { value: "12", label: "Countries" },
            { value: "<24h", label: "Response" }
        ],
        social: {
            github: "https://github.com",
            linkedin: "https://linkedin.com",
            twitter: "https://twitter.com",
            dribbble: "https://dribbble.com"
        },
        email: "hello@freelancepro.dev",
        location: "Remote / Worldwide"
    },

    services: [
        {
            id: "dev",
            icon: "fa-solid fa-code",
            title: "Full-Stack Development",
            description: "Custom web applications built with modern frameworks (React, Node.js, Next.js) for speed and scalability.",
            features: ["Custom Web Apps", "API Development", "Database Architecture"],
            price: "$1,500"
        },
        {
            id: "design",
            icon: "fa-solid fa-wand-magic-sparkles",
            title: "UI/UX Design",
            description: "User-centric, conversion-optimized interfaces that look stunning and feel intuitive to navigate.",
            features: ["Wireframing & Prototyping", "High-Fidelity Mockups", "Design Systems"],
            price: "$800"
        },
        {
            id: "seo",
            icon: "fa-solid fa-chart-line",
            title: "SEO & Performance",
            description: "Technical optimization to ensure your site ranks higher, loads in milliseconds, and retains users.",
            features: ["Technical SEO Audits", "Core Web Vitals Fixes", "Conversion Rate Opt."],
            price: "$500"
        }
    ],

    portfolio: [
        {
            id: "p1",
            category: "web",
            title: "FinTech SaaS Dashboard",
            tech: ["React", "Node.js"],
            description: "A comprehensive financial analytics dashboard handling real-time data visualization.",
            metric: "+150% User Engagement",
            image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80"
        },
        {
            id: "p2",
            category: "design",
            title: "Creative Agency Rebrand",
            tech: ["Figma", "Webflow"],
            description: "Complete UI/UX overhaul and implementation for an award-winning creative agency.",
            metric: "3x Lead Generation",
            image: "https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=800&q=80"
        },
        {
            id: "p3",
            category: "ecommerce",
            title: "UrbanWear Store",
            tech: ["Next.js", "Shopify Plus"],
            description: "High performance headless e-commerce build.",
            metric: "0.8s Load Time",
            image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=600&q=80"
        },
        {
            id: "p4",
            category: "design",
            title: "HealthTrack App",
            tech: ["Figma", "React Native"],
            description: "Mobile app UI/UX design system.",
            metric: "10k+ Downloads",
            image: "https://images.unsplash.com/photo-1618761714954-0b8cd0026356?auto=format&fit=crop&w=600&q=80"
        },
        {
            id: "p5",
            category: "web",
            title: "Nexus CRM",
            tech: ["Vue.js", "Laravel"],
            description: "Custom enterprise CRM dashboard.",
            metric: "Enterprise Client",
            image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80"
        }
    ],

    caseStudies: [
        {
            id: "c1",
            title: "Scaling EduTech to 100k Active Users",
            client: "E-Learning Platform",
            problem: "The client's legacy WordPress LMS was crashing during peak traffic hours, causing high bounce rates and lost revenue.",
            solution: "Migrated the platform to a headless architecture (Next.js + headless CMS). Implemented Redis caching, optimized database queries, and redesigned the student dashboard for better UX.",
            metric1: { value: "400%", label: "Faster Load Times" },
            metric2: { value: "8 Weeks", label: "From concept to launch" },
            techTags: ["Next.js", "Node.js", "PostgreSQL"],
            image: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=800&q=80"
        }
    ],

    pricing: [
        {
            id: "starter",
            title: "Starter",
            subtitle: "Perfect for landing pages & simple sites.",
            price: "$999",
            features: ["Up to 3 Pages", "Responsive Design", "Basic SEO Setup", "Contact Form"],
            missing: ["Custom CMS Integration", "Complex Animations"],
            isPopular: false
        },
        {
            id: "pro",
            title: "Professional",
            subtitle: "Ideal for growing businesses & SaaS.",
            price: "$2,499",
            features: ["Up to 8 Pages", "Advanced Animations & UI", "CMS Integration (Sanity/WP)", "Technical SEO Optimization", "Fast Performance (90+ Score)"],
            missing: ["Complex Web App Logic"],
            isPopular: true
        },
        {
            id: "premium",
            title: "Premium",
            subtitle: "Full-scale web applications & portals.",
            price: "$5,000+",
            features: ["Unlimited Pages", "Complex Web App Logic", "Custom Database Architecture", "API Integrations & Auth", "Priority Support (1 month)", "Source Code Delivery"],
            missing: [],
            isPopular: false
        }
    ],

    testimonials: [
        {
            text: "Working with FreelancePro was a game-changer for our SaaS product. The new dashboard design is intuitive, and the codebase is impeccable. Our user retention increased by 40% in the first month alone.",
            name: "David Miller",
            role: "CTO at FinScale",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80"
        },
        {
            text: "The level of professionalism and speed of delivery was outstanding. Not only did we get a beautiful website, but the technical SEO optimizations instantly boosted our organic traffic.",
            name: "Sarah Jenkins",
            role: "Founder, CreativeEdge",
            image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80"
        },
        {
            text: "Clear communication, sharp execution, and a product our customers actually enjoy using. FreelancePro felt like an in-house senior hire.",
            name: "Amira Hassan",
            role: "Head of Product, Northline",
            image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&q=80"
        }
    ],

    faq: [
        {
            q: "How does the process work?",
            a: "Our process is streamlined into 4 phases: Discovery (understanding your goals), Design (wireframes & mockups), Development (coding & integration), and Launch (testing & deployment)."
        },
        {
            q: "How long does a project take?",
            a: "A standard 5-page business website typically takes 2-3 weeks. A complex SaaS application or custom e-commerce platform can take anywhere from 6 to 12 weeks."
        },
        {
            q: "What information do you need to get started?",
            a: "I need a clear understanding of your business goals, target audience, preferred design style (or brand guidelines), and the specific functionalities you require."
        },
        {
            q: "Do you provide support after launch?",
            a: "Yes! All projects come with 30 days of bug-fixing and minor adjustments post-launch."
        },
        {
            q: "Do you work internationally?",
            a: "Absolutely. I work with clients globally via Slack, Email, and Zoom/Google Meet."
        }
    ],

    // Additional Data for new sections
    skills: [
        { name: "React", level: 95 },
        { name: "Node.js", level: 90 },
        { name: "TypeScript", level: 85 },
        { name: "Python", level: 80 },
        { name: "Figma", level: 95 },
        { name: "AWS", level: 75 }
    ],

    experience: [
        {
            role: "Senior Frontend Engineer",
            company: "TechFlow Solutions",
            period: "2021 - Present",
            description: "Lead developer for enterprise SaaS platform. Mentored junior developers and established CI/CD pipelines."
        },
        {
            role: "Full Stack Developer",
            company: "Creative Digital Agency",
            period: "2018 - 2021",
            description: "Built high-performance marketing websites and custom e-commerce solutions for 30+ clients."
        }
    ]
};
