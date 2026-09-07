const lexoraData = {
    practiceAreas: [
        {
            id: 'corporate',
            title: 'Corporate Law',
            icon: 'fa-solid fa-building',
            shortDesc: 'Comprehensive counsel for corporations including mergers, acquisitions, and corporate governance.',
            description: 'We advise boards of directors, executive management, and shareholders on the full spectrum of corporate matters. Our experience spans complex M&A, joint ventures, corporate restructuring, and compliance with fiduciary duties.'
        },
        {
            id: 'business',
            title: 'Business Law',
            icon: 'fa-solid fa-briefcase',
            shortDesc: 'Strategic legal guidance for business formation, operations, and commercial transactions.',
            description: 'From startups to established enterprises, we provide tailored legal solutions that protect your interests while facilitating growth. We draft and negotiate commercial agreements, vendor contracts, and partnership agreements.'
        },
        {
            id: 'civil',
            title: 'Civil Litigation',
            icon: 'fa-solid fa-scale-balanced',
            shortDesc: 'Aggressive and strategic representation in complex civil disputes and commercial litigation.',
            description: 'When disputes cannot be resolved through negotiation, our litigators are prepared to aggressively defend your interests in state and federal courts. We handle breach of contract, fraud, and complex commercial disputes.'
        },
        {
            id: 'family',
            title: 'Family Law',
            icon: 'fa-solid fa-users',
            shortDesc: 'Discreet, compassionate representation for high-net-worth divorce and family disputes.',
            description: 'We handle sensitive family matters with the utmost discretion and professionalism. Our expertise includes complex asset division, prenuptial agreements, and highly contested custody matters.'
        },
        {
            id: 'property',
            title: 'Property Law',
            icon: 'fa-solid fa-city',
            shortDesc: 'Expert navigation of commercial real estate transactions, zoning, and property disputes.',
            description: 'We represent developers, investors, and property owners in all aspects of real estate law, including purchase agreements, commercial leasing, land use, and title disputes.'
        },
        {
            id: 'employment',
            title: 'Employment Law',
            icon: 'fa-solid fa-user-tie',
            shortDesc: 'Defense of employers in workplace disputes and drafting of executive compensation agreements.',
            description: 'We provide proactive counsel to employers to ensure compliance with state and federal labor laws, and defend against claims of discrimination, wrongful termination, and wage disputes.'
        },
        {
            id: 'contract',
            title: 'Contract Law',
            icon: 'fa-solid fa-file-signature',
            shortDesc: 'Meticulous drafting, review, and enforcement of complex agreements.',
            description: 'A well-drafted contract is the foundation of any successful business relationship. We ensure your agreements are watertight, anticipating potential liabilities and protecting your core assets.'
        }
    ],
    
    attorneys: [
        {
            id: 'apendelton',
            name: 'Arthur Pendelton, Esq.',
            position: 'Founding Partner',
            image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
            bio: 'Arthur Pendelton is a formidable litigator and corporate strategist with over 25 years of experience. He has successfully represented Fortune 500 companies in high-stakes civil litigation and complex corporate restructuring.',
            education: [
                'J.D., Harvard Law School, magna cum laude',
                'B.A., Yale University'
            ],
            admissions: ['State Bar of New York', 'U.S. Supreme Court'],
            areas: ['Corporate Law', 'Civil Litigation'],
            memberships: ['American Bar Association', 'New York State Bar Association']
        },
        {
            id: 'eharper',
            name: 'Eleanor Harper',
            position: 'Partner',
            image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
            bio: 'Eleanor Harper heads our Business and Employment Law divisions. Known for her meticulous approach to contract negotiation, she routinely advises tech startups and established enterprises on compliance and growth strategies.',
            education: [
                'J.D., Stanford Law School',
                'B.S., University of Pennsylvania'
            ],
            admissions: ['State Bar of California', 'State Bar of New York'],
            areas: ['Business Law', 'Employment Law', 'Contract Law'],
            memberships: ['National Employment Lawyers Association']
        },
        {
            id: 'jsterling',
            name: 'Julian Sterling',
            position: 'Senior Associate',
            image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
            bio: 'Julian focuses on high-net-worth Family Law and Property disputes. He brings a unique blend of financial acumen and compassionate advocacy to sensitive domestic matters.',
            education: [
                'J.D., Columbia Law School',
                'B.A., Princeton University'
            ],
            admissions: ['State Bar of New York'],
            areas: ['Family Law', 'Property Law'],
            memberships: ['Family Law Section, NYSBA']
        }
    ],

    cases: [
        {
            category: 'Corporate Restructuring',
            challenge: 'A mid-sized manufacturing client faced imminent bankruptcy due to predatory lending practices and disrupted supply chains.',
            approach: 'Lexora initiated aggressive negotiations with creditors while simultaneously filing for Chapter 11 protection to halt asset seizure. We structured a comprehensive reorganization plan that divested non-core assets.',
            outcome: 'The client successfully exited bankruptcy within 14 months, preserving 80% of its workforce and retaining its core intellectual property.'
        },
        {
            category: 'Civil Litigation / Breach of Contract',
            challenge: 'A technology startup was sued by a former vendor for $5 million in alleged unpaid invoices and breach of a commercial agreement.',
            approach: 'During discovery, Lexora uncovered evidence that the vendor had materially breached the confidentiality clauses of the agreement prior to the payment dispute. We filed a rigorous countersuit for misappropriation of trade secrets.',
            outcome: 'The plaintiff withdrew their initial lawsuit, and the matter was settled out of court with the vendor paying our client a confidential sum for the IP breach.'
        },
        {
            category: 'High-Net-Worth Family Law',
            challenge: 'Our client, a successful entrepreneur, required representation in a highly contested divorce involving the valuation of a privately held company and complex trusts.',
            approach: 'We engaged top-tier forensic accountants to ensure an accurate business valuation and demonstrated that a significant portion of the business growth was non-marital property.',
            outcome: 'Secured a favorable settlement that protected the client\'s controlling interest in the company while ensuring a fair and equitable division of liquid assets without proceeding to trial.'
        }
    ],

    articles: [
        {
            title: 'Navigating Fiduciary Duties in Corporate Mergers',
            date: 'September 12, 2026',
            author: 'Arthur Pendelton, Esq.',
            summary: 'An analysis of recent Supreme Court rulings affecting board member liabilities during hostile takeovers.',
            category: 'Corporate Law'
        },
        {
            title: 'The Evolution of Non-Compete Clauses in Tech',
            date: 'August 28, 2026',
            author: 'Eleanor Harper',
            summary: 'How upcoming federal regulations may invalidate traditional restrictive covenants for software engineers and executives.',
            category: 'Employment Law'
        },
        {
            title: 'Protecting Assets Prior to Marriage',
            date: 'August 05, 2026',
            author: 'Julian Sterling',
            summary: 'Why modern prenuptial agreements are essential tools for entrepreneurs, not just the ultra-wealthy.',
            category: 'Family Law'
        }
    ]
};
