const nexoraData = {
    services: [
        {
            id: 'custom-software',
            title: 'Custom Software Development',
            icon: 'fa-solid fa-laptop-code',
            colorClass: 'bg-primary-subtle text-primary',
            description: 'Bespoke enterprise applications engineered to solve complex business challenges with scalable, resilient architectures.'
        },
        {
            id: 'web-app',
            title: 'Web Application Development',
            icon: 'fa-solid fa-window-maximize',
            colorClass: 'bg-info-subtle text-info',
            description: 'High-performance, responsive web applications built with modern frontend frameworks and robust backend microservices.'
        },
        {
            id: 'mobile-app',
            title: 'Mobile App Development',
            icon: 'fa-solid fa-mobile-screen-button',
            colorClass: 'bg-success-subtle text-success',
            description: 'Native and cross-platform mobile experiences that engage users and extend your digital ecosystem.'
        },
        {
            id: 'saas',
            title: 'SaaS Development',
            icon: 'fa-solid fa-cloud',
            colorClass: 'bg-warning-subtle text-warning',
            description: 'End-to-end development of multi-tenant SaaS platforms with robust subscription and billing integrations.'
        },
        {
            id: 'api',
            title: 'API & Integration',
            icon: 'fa-solid fa-network-wired',
            colorClass: 'bg-danger-subtle text-danger',
            description: 'Secure RESTful and GraphQL APIs connecting disparate systems to streamline data flow and operational efficiency.'
        },
        {
            id: 'cloud',
            title: 'Cloud & DevOps',
            icon: 'fa-solid fa-server',
            colorClass: 'bg-secondary-subtle text-secondary',
            description: 'Cloud migration, infrastructure as code, and automated CI/CD pipelines to ensure rapid, reliable deployments.'
        },
        {
            id: 'ai',
            title: 'AI Solutions',
            icon: 'fa-solid fa-brain',
            colorClass: 'bg-primary-subtle text-primary',
            description: 'Integrating machine learning models and generative AI to automate workflows and unlock data insights.'
        },
        {
            id: 'ui-ux',
            title: 'UI/UX Design',
            icon: 'fa-solid fa-pen-nib',
            colorClass: 'bg-info-subtle text-info',
            description: 'User-centric design methodologies ensuring your digital products are intuitive, accessible, and visually stunning.'
        }
    ],

    cases: [
        {
            id: 'fintech-platform',
            title: 'Global Payments Platform',
            industry: 'Banking & Finance',
            challenge: 'A leading regional bank needed to modernize its legacy payment processing system to handle 10x transaction volume while reducing latency.',
            solution: 'Nexora engineered a highly scalable microservices architecture deployed on AWS Kubernetes (EKS).',
            tech: ['Node.js', 'Go', 'AWS EKS', 'PostgreSQL', 'Redis'],
            results: 'Achieved 99.99% uptime, reduced transaction latency by 40%, and scaled to process $2B+ in daily volume.',
            image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80'
        },
        {
            id: 'healthcare-portal',
            title: 'Telemedicine Patient Portal',
            industry: 'Healthcare',
            challenge: 'During a rapid expansion, a healthcare provider required a HIPAA-compliant, real-time video consultation platform with integrated EMR capabilities.',
            solution: 'We built a secure React-based web application with WebRTC for video streaming and a Python backend for data processing.',
            tech: ['React', 'Python/Django', 'WebRTC', 'AWS HIPAA-Eligible Services'],
            results: 'Onboarded 50,000+ patients in the first month with zero data breaches and highly positive UX feedback.',
            image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80'
        },
        {
            id: 'logistics-ai',
            title: 'AI-Driven Supply Chain Optimization',
            industry: 'Logistics',
            challenge: 'A global logistics firm struggled with inefficient route planning and unpredictable delivery times due to manual dispatching.',
            solution: 'Developed a custom ML model to predict optimal routing based on real-time traffic, weather, and fleet availability.',
            tech: ['Python', 'TensorFlow', 'Angular', 'Google Cloud Platform'],
            results: 'Reduced fuel consumption by 15% and improved on-time delivery rates to 98.5%.',
            image: 'https://images.unsplash.com/photo-1586528116311-ad8ed7c1590a?auto=format&fit=crop&w=800&q=80'
        }
    ],

    products: [
        {
            name: 'Nexora Core API',
            desc: 'A unified API gateway for enterprise systems.',
            icon: 'fa-solid fa-code'
        },
        {
            name: 'CloudManager Pro',
            desc: 'A dashboard to monitor multi-cloud infrastructure costs.',
            icon: 'fa-solid fa-cloud-arrow-up'
        },
        {
            name: 'DataSense AI',
            desc: 'Turn raw database logs into actionable business intelligence.',
            icon: 'fa-solid fa-database'
        }
    ],

    jobs: [
        {
            title: 'Senior Software Engineer (Backend)',
            type: 'Full-Time',
            location: 'Remote / San Francisco',
            desc: 'We are looking for an experienced backend engineer proficient in Node.js and Go to scale our high-throughput microservices.'
        },
        {
            title: 'Frontend Engineer (React)',
            type: 'Full-Time',
            location: 'Remote / London',
            desc: 'Join our UI team to build accessible, high-performance web applications using React and modern CSS architectures.'
        },
        {
            title: 'QA Automation Engineer',
            type: 'Full-Time',
            location: 'New York',
            desc: 'Ensure the quality of our enterprise deployments by designing and maintaining robust automated testing frameworks (Cypress, Selenium).'
        },
        {
            title: 'Cloud DevOps Engineer',
            type: 'Full-Time',
            location: 'Remote',
            desc: 'Manage our AWS infrastructure, optimize CI/CD pipelines, and ensure infrastructure resilience using Terraform and Kubernetes.'
        }
    ]
};
