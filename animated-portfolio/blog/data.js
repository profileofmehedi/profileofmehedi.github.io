/* =====================================================
   CODING DROP — SHARED BLOG DATA (Lightweight Metadata)
   ===================================================== */

const UI_TEXT = {
    bn: {
        allArticles: "সব আর্টিকেল",
        backToArticles: "সব আর্টিকেল",
        readTimeSuffix: "পড়ার সময়",
        views: "ভিউ",
        share: "শেয়ার করুন:",
        copyLink: "লিঙ্ক কপি করুন",
        linkCopied: "লিঙ্ক কপি হয়েছে!",
        authorRole: "লেখক",
        relatedArticles: "সম্পর্কিত আর্টিকেল",
        moreArticles: "আরও পড়ুন",
        rateArticle: "এই আর্টিকেলে রেটিং দিন",
        leaveComment: "আপনার মতামত লিখুন...",
        postComment: "কমেন্ট পোস্ট করুন",
        comments: "কমেন্টস",
        notFoundTitle: "আর্টিকেল পাওয়া যায়নি",
        notFoundDesc: "কাঙ্ক্ষিত আর্টিকেলটি খুঁজে পাওয়া যায়নি বা সরিয়ে ফেলা হয়েছে।",
        hireMe: "হায়ার মি",
        allAtAGlance: "এক নজরে সব"
    },
    en: {
        allArticles: "All Articles",
        backToArticles: "All Articles",
        readTimeSuffix: "read",
        views: "views",
        share: "Share:",
        copyLink: "Copy Link",
        linkCopied: "Link copied!",
        authorRole: "Author",
        relatedArticles: "Related Articles",
        moreArticles: "Read More",
        rateArticle: "Rate this article",
        leaveComment: "Write a comment...",
        postComment: "Post Comment",
        comments: "Comments",
        notFoundTitle: "Article Not Found",
        notFoundDesc: "This article doesn't exist or may have been moved.",
        hireMe: "Hire Me",
        allAtAGlance: "All at a Glance"
    }
};

function getLangText(val, lang = 'bn') {
    if (!val) return '';
    if (typeof val === 'string') return val;
    if (typeof val === 'object') {
        return val[lang] || val.bn || val.en || '';
    }
    return String(val);
}

const CATEGORIES = {
    "all": {
        "label": "All Articles",
        "colorClass": "cat-all"
    },
    "architecture": {
        "label": "Architecture",
        "colorClass": "cat-architecture"
    },
    "performance": {
        "label": "Performance",
        "colorClass": "cat-performance"
    },
    "frontend": {
        "label": "Front-End",
        "colorClass": "cat-frontend"
    },
    "backend": {
        "label": "Back-End",
        "colorClass": "cat-backend"
    },
    "database": {
        "label": "Database",
        "colorClass": "cat-database"
    },
    "devops": {
        "label": "DevOps",
        "colorClass": "cat-devops"
    },
    "sqa": {
        "label": "SQA",
        "colorClass": "cat-sqa"
    }
};

const POSTS = [
    {
        "id": 10,
        "slug": "cloudflare-web-security-performance",
        "title": {
            "bn": "Cloudflare: Web Application Security and Performance",
            "en": "Cloudflare: Web Application Security and Performance"
        },
        "excerpt": {
            "bn": "একজন .NET Developer হিসেবে Production-Ready Application তৈরি করতে গেলে শুধু Business Logic যথেষ্ট নয়। Cloudflare কীভাবে DNS, CDN, SSL, DDoS Protection, WAF, Rate Limiting, Bot Protection এবং Zero Trust Security দিয়ে আপনার Application-কে পূর্ণ সুরক্ষা দেয় — সব কিছু এক জায়গায়।",
            "en": "Detailed guide on web application security, DDoS protection, edge caching, and global CDN performance optimization with Cloudflare."
        },
        "category": "devops",
        "tags": [
            "Cloudflare",
            "Security",
            "CDN",
            "WAF",
            "DevOps"
        ],
        "date": "Jul 06, 2026",
        "readTime": {
            "bn": "10 min",
            "en": "8 min"
        },
        "icon": "fas fa-shield-halved",
        "thumbnail": "posts/cloudflare-web-security-performance/cloud-flare-blog-1.png",
        "featured": false
    },
    {
        "id": 11,
        "slug": "owasp-top-10-web-security",
        "title": {
            "bn": "OWASP Top 10: Web Application Security-এর ১০টি অতি গুরুত্বপূর্ণ ঝুঁকি ও সমাধান",
            "en": "OWASP Top 10: Crucial Web Application Security Risks & Remediation"
        },
        "excerpt": {
            "bn": "Software System-কে Hacker-দের হাত থেকে সুরক্ষিত রাখতে OWASP Top 10-এর গুরুত্ব অপরিসীম। SQL Injection, Broken Access Control, SSRF-এর মতো ঝুঁকিগুলো কীভাবে আপনার Application-কে ঝুঁকির মুখে ফেলে এবং কীভাবে কোড লেভেলে এর প্রতিরোধ গড়ে তুলবেন, তা নিয়ে আলোচনা।",
            "en": "Comprehensive guide to understanding the OWASP Top 10 vulnerabilities, attack vectors, and practical defense strategies."
        },
        "category": "backend",
        "tags": [
            "Security",
            "OWASP",
            "WebSecurity",
            "Backend",
            "SecureCoding",
            "SystemDesign"
        ],
        "date": "Jul 07, 2026",
        "readTime": {
            "bn": "12 min",
            "en": "12 min"
        },
        "icon": "fas fa-shield-halved",
        "thumbnail": "posts/owasp-top-10-web-security/owasp-thumbnail.png",
        "featured": false
    },
    {
        "id": 12,
        "slug": "sql-injection-prevention-aspnet-core",
        "title": {
            "bn": "SQL Injection Prevention in ASP.NET Core: সুরক্ষার সর্বোত্তম উপায়",
            "en": "SQL Injection Prevention in ASP.NET Core: Best Practices"
        },
        "excerpt": {
            "bn": "ডাটাবেজ সিকিউরিটির ক্ষেত্রে SQL Injection (SQLi) একটি বড় ঝুঁকি। .NET Core-এ Entity Framework এবং Dapper ব্যবহার করে কীভাবে এপিআই স্তর থেকে ডাটাবেজ সুরক্ষিত রাখা যায় তার বিস্তারিত আলোচনা ও কোড উদাহরণ।",
            "en": "SQL Injection is a major risk for database security. Learn how to secure your APIs and databases using Entity Framework Core and Dapper."
        },
        "category": "database",
        "tags": [
            "Security",
            "SQLi",
            "DotNet",
            "Database",
            "EFCore",
            "Dapper"
        ],
        "date": "Jul 07, 2026",
        "readTime": {
            "bn": "8 min",
            "en": "8 min"
        },
        "icon": "fas fa-database",
        "thumbnail": "posts/sql-injection-prevention-aspnet-core/thumbnail.png",
        "featured": false
    },
    {
        "id": 13,
        "slug": "xss-vs-csrf-vs-ssrf",
        "title": {
            "bn": "XSS vs CSRF vs SSRF: ওয়েব সিকিউরিটির তিন চিরশত্রু",
            "en": "XSS vs CSRF vs SSRF: The Three Arch-Enemies of Web Security"
        },
        "excerpt": {
            "bn": "Cross-Site Scripting (XSS), Cross-Site Request Forgery (CSRF) এবং Server-Side Request Forgery (SSRF) এর পার্থক্য, আক্রমণ পদ্ধতি এবং ব্রাউজার ও ব্যাকএন্ড স্তরে তাদের প্রতিকারের তুলনামূলক গাইড।",
            "en": "Comparing Cross-Site Scripting (XSS), Cross-Site Request Forgery (CSRF), and Server-Side Request Forgery (SSRF), including attack methods and browser/backend mitigations."
        },
        "category": "backend",
        "tags": [
            "WebSecurity",
            "XSS",
            "CSRF",
            "SSRF",
            "BackendSecurity"
        ],
        "date": "Jul 07, 2026",
        "readTime": {
            "bn": "10 min",
            "en": "10 min"
        },
        "icon": "fas fa-shield-virus",
        "thumbnail": "posts/xss-vs-csrf-vs-ssrf/thumbnail.png",
        "featured": false
    },
    {
        "id": 14,
        "slug": "jwt-authentication-best-practices",
        "title": {
            "bn": "JWT Authentication Best Practices: টোকেন সিকিউরিটির বাস্তব গাইড",
            "en": "JWT Authentication Best Practices: Real-World Token Security Guide"
        },
        "excerpt": {
            "bn": "জেসন ওয়েব টোকেন (JWT) বর্তমান অথেনটিকেশনের মূল ভিত্তি। তবে সিক্রেট কি সিলেকশন, টোকেন এক্সপাইরি, রিফ্রেশ টোকেন এবং ক্লাইম ভ্যালিডেশনে নিরাপত্তা ত্রুটি এড়ানোর সর্বোত্তম প্র্যাকটিসসমূহ।",
            "en": "JSON Web Tokens (JWT) are fundamental to modern authentication. Best practices for key selection, token expiration, refresh tokens, and claim validation."
        },
        "category": "backend",
        "tags": [
            "JWT",
            "Authentication",
            "Security",
            "Token",
            "ASPNETCore"
        ],
        "date": "Jul 07, 2026",
        "readTime": {
            "bn": "9 min",
            "en": "9 min"
        },
        "icon": "fas fa-key",
        "thumbnail": "posts/jwt-authentication-best-practices/thumbnail.png",
        "featured": false
    },
    {
        "id": 15,
        "slug": "api-security-checklist",
        "title": {
            "bn": "REST API Security Checklist: প্রোডাকশন-রেডি এপিআই সিকিউরিটি",
            "en": "REST API Security Checklist: Production-Ready Security"
        },
        "excerpt": {
            "bn": "আপনার ওয়েব সার্ভিস বা মোবাইল এপিআই রিলিজ করার আগে যে সিকিউরিটি প্র্যাকটিসগুলো জানা আবশ্যক। HTTPS, প্রপার রিকোয়েস্ট অথরাইজেশন, রেট লিমিটিং এবং এক্সপোজার এড়ানোর গাইড।",
            "en": "Essential security practices before releasing web services or mobile APIs to production. A guide covering HTTPS, authorization, rate limiting, and leak prevention."
        },
        "category": "devops",
        "tags": [
            "API",
            "Security",
            "Checklist",
            "REST",
            "DevOps"
        ],
        "date": "Jul 07, 2026",
        "readTime": {
            "bn": "১২ মিনিট",
            "en": "12 min"
        },
        "icon": "fas fa-list-check",
        "thumbnail": "posts/api-security-checklist/thumbnail.png",
        "featured": false
    },
    {
        "id": 16,
        "slug": "secure-password-storage-bcrypt-argon2",
        "title": {
            "bn": "Secure Password Storage: BCrypt vs Argon2 কোনটি সেরা?",
            "en": "Secure Password Storage: BCrypt vs Argon2 Compared"
        },
        "excerpt": {
            "bn": "ডাটাবেজে পাসওয়ার্ড হ্যাশিং ও সল্টিংয়ের জন্য কোন অ্যালগরিদমটি আদর্শ? ক্লাসিক্যাল BCrypt এবং আধুনিক Argon2id এর মধ্যকার পার্থক্য, পারফরম্যান্স তুলনা এবং .NET কোডে তার ব্যবহার।",
            "en": "Which algorithm is ideal for password hashing and salting? Comparing classical BCrypt with modern Argon2id, performance benchmarks, and .NET integration."
        },
        "category": "database",
        "tags": [
            "Password",
            "Hashing",
            "Argon2",
            "BCrypt",
            "Security",
            "DotNet"
        ],
        "date": "Jul 07, 2026",
        "readTime": {
            "bn": "8 min",
            "en": "8 min"
        },
        "icon": "fas fa-vault",
        "thumbnail": "posts/secure-password-storage-bcrypt-argon2/thumbnail.png",
        "featured": false
    },
    {
        "id": 17,
        "slug": "oauth2-openid-connect-guide",
        "title": {
            "bn": "OAuth2 & OpenID Connect: আধুনিক অথেনটিকেশন আর্কিটেকচার",
            "en": "OAuth2 & OpenID Connect: Modern Authentication Architecture"
        },
        "excerpt": {
            "bn": "অনুমোদন ফ্রেমওয়ার্ক OAuth 2.0 এবং আইডেন্টিটি প্রোটোকল OIDC এর কাজ করার পদ্ধতি। সিঙ্গেল সাইন-অন (SSO) এবং Duende IdentityServer এর ব্যবহারিক গাইড।",
            "en": "Understanding Authorization Grant Types, Access Tokens, ID Tokens, PKCE Flow, and SSO implementation with OpenID Connect."
        },
        "category": "architecture",
        "tags": [
            "OAuth2",
            "OIDC",
            "Authentication",
            "Architecture",
            "SSO"
        ],
        "date": "Jul 07, 2026",
        "readTime": {
            "bn": "11 min",
            "en": "11 min"
        },
        "icon": "fas fa-user-lock",
        "thumbnail": "posts/oauth2-openid-connect-guide/thumbnail.png",
        "featured": false
    },
    {
        "id": 18,
        "slug": "rate-limiting-aspnet-core",
        "title": {
            "bn": "Rate Limiting in ASP.NET Core: ডস আক্রমণ প্রতিরোধ গাইড",
            "en": "Clean Architecture in .NET Core: Scalable Project Structure"
        },
        "excerpt": {
            "bn": "ASP.NET Core এ যুক্ত হওয়া বিল্ট-ইন রেট লিমিটিং মিডলওয়্যার কনফিগারেশন। Fixed Window, Sliding Window, Token Bucket পলিসি বাস্তবায়নের মাধ্যমে এপিআই অপব্যবহার রোধের গাইড।",
            "en": "Detailed blueprint for structuring scalable enterprise applications using Clean Architecture, Separation of Concerns, Domain-Driven Design, and Dependency Injection."
        },
        "category": "performance",
        "tags": [
            "RateLimiting",
            "ASPNETCore",
            "Performance",
            "Security",
            "DDoS"
        ],
        "date": "Jul 07, 2026",
        "readTime": {
            "bn": "8 min",
            "en": "12 min"
        },
        "icon": "fas fa-gauge-high",
        "thumbnail": "posts/rate-limiting-aspnet-core/thumbnail.png",
        "featured": false
    },
    {
        "id": 19,
        "slug": "cors-explained-web-developers",
        "title": {
            "bn": "CORS Explained: ডোমেন শেয়ারিং ও ব্রাউজার সিকিউরিটি",
            "en": "CQRS Pattern with MediatR: Decoupling Read and Write Operations"
        },
        "excerpt": {
            "bn": "ওয়েব ডেভেলপমেন্টে CORS ত্রুটি এড়াতে ব্রাউজারের Same-Origin Policy এবং Preflight (OPTIONS) রিকোয়েস্ট মেকানিজম বোঝার সহজ উপায়। .NET-এ নিরাপদ CORS পলিসি কনফিগারেশন।",
            "en": "Implementing Command Query Responsibility Segregation (CQRS) in .NET Core using MediatR for clean event-driven architecture."
        },
        "category": "frontend",
        "tags": [
            "CORS",
            "Security",
            "WebDev",
            "Backend",
            "Frontend"
        ],
        "date": "Jul 07, 2026",
        "readTime": {
            "bn": "7 min",
            "en": "9 min"
        },
        "icon": "fas fa-network-wired",
        "thumbnail": "posts/cors-explained-web-developers/thumbnail.png",
        "featured": false
    },
    {
        "id": 20,
        "slug": "secure-file-upload-web-apps",
        "title": {
            "bn": "Secure File Upload in Web Apps: ম্যালওয়্যার ও সাইবার থ্রেট রোধ",
            "en": "Repository & Unit of Work Pattern in EF Core: Maintainable Data Access"
        },
        "excerpt": {
            "bn": "ওয়েব অ্যাপ্লিকেশনে ব্যবহারকারীদের ফাইল আপলোডের ক্ষেত্রে Remote Code Execution (RCE) ঝুঁকি এড়াতে এক্সটেনশন ভ্যালিডেশন, ম্যাজিক নাম্বার ভেরিফিকেশন এবং ক্লাউড স্টোরেজ সিকিউরিটি।",
            "en": "Decoupling data access logic from business rules using Repository and Unit of Work patterns in Entity Framework Core."
        },
        "category": "devops",
        "tags": [
            "FileUpload",
            "Security",
            "RCE",
            "Cloud",
            "DevOps"
        ],
        "date": "Jul 07, 2026",
        "readTime": {
            "bn": "9 min",
            "en": "10 min"
        },
        "icon": "fas fa-file-shield",
        "thumbnail": "posts/secure-file-upload-web-apps/thumbnail.png",
        "featured": false
    },
    {
        "id": 21,
        "slug": "aspnet-core-roadmap-2026",
        "title": {
            "bn": "Complete ASP.NET Core Roadmap (2026)",
            "en": "Domain-Driven Design (DDD) Introduction: Modeling Complex Enterprise Domains"
        },
        "excerpt": {
            "bn": "২০ চেয়ে আধুনিক .NET ১০ ও C# ১৪ রোডম্যাপ। এপিআই ডিজাইন, মাইক্রোসার্ভিস প্যাটার্ন, ডেটা অ্যাক্সেস ও ক্লাউড ডেপ্লয়মেন্টের পূর্ণাঙ্গ গাইডলাইন।",
            "en": "Key concepts of Domain-Driven Design including Entities, Value Objects, Aggregates, Bounded Contexts, and Domain Events."
        },
        "category": "architecture",
        "tags": [
            "DotNet",
            "Roadmap",
            "ASPNETCore",
            "Backend",
            "Career"
        ],
        "date": "Jul 07, 2026",
        "readTime": {
            "bn": "12 min",
            "en": "14 min"
        },
        "icon": "fas fa-road",
        "thumbnail": "posts/aspnet-core-roadmap-2026/thumbnail.png",
        "featured": false
    },
    {
        "id": 22,
        "slug": "minimal-api-vs-controller-api",
        "title": {
            "bn": "Minimal API vs Controller API: কোনটি কখন ব্যবহার করবেন?",
            "en": "SOLID Principles in .NET: Writing Maintainable & Testable Code"
        },
        "excerpt": {
            "bn": ".NET-এর Minimal API এবং ঐতিহ্যবাহী Controller API এর তুলনা, গঠনগত পার্থক্য ও পারফরম্যান্স বিশ্লেষণ নিয়ে বিস্তারিত আলোচনা।",
            "en": "In-depth guide to Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion with C# examples."
        },
        "category": "backend",
        "tags": [
            "MinimalAPI",
            "ControllerAPI",
            "ASPNETCore",
            "Performance",
            "WebAPI"
        ],
        "date": "Jul 07, 2026",
        "readTime": {
            "bn": "9 min",
            "en": "11 min"
        },
        "icon": "fas fa-network-wired",
        "thumbnail": "posts/minimal-api-vs-controller-api/thumbnail.png",
        "featured": false
    },
    {
        "id": 23,
        "slug": "repository-pattern-best-practices",
        "title": {
            "bn": "Repository Pattern Best Practices: ভুল ধারণা ও সঠিক সমাধান",
            "en": "Factory Pattern in C#: Creation Patterns for Flexible Architectures"
        },
        "excerpt": {
            "bn": "ডেটা অ্যাক্সেস লেয়ারে রিপোজিটরি প্যাটার্নের জেনেরিক অপব্যবহার এড়ানো, IQueryable এক্সপোজার রোধ এবং Unit of Work এর সঠিক ব্যবহার গাইড।",
            "en": "Understanding Simple Factory, Factory Method, and Abstract Factory patterns in C# with real-world enterprise scenarios."
        },
        "category": "database",
        "tags": [
            "RepositoryPattern",
            "Database",
            "EFCore",
            "CleanCode",
            "DesignPatterns"
        ],
        "date": "Jul 07, 2026",
        "readTime": {
            "bn": "8 min",
            "en": "7 min"
        },
        "icon": "fas fa-database",
        "thumbnail": "posts/repository-pattern-best-practices/thumbnail.png",
        "featured": false
    },
    {
        "id": 24,
        "slug": "clean-architecture-dotnet",
        "title": {
            "bn": "Clean Architecture in .NET: একটি পূর্ণাঙ্গ দিকনির্দেশনা",
            "en": "Singleton Pattern & Thread Safety in C#: Avoiding Race Conditions"
        },
        "excerpt": {
            "bn": "ডিপেন্ডেন্সি রুলস মেনে প্রজেক্টের Domain, Application, Infrastructure এবং Presentation লেয়ার ডিজাইন করার প্রফেশনাল গাইড।",
            "en": "Implementing thread-safe Singleton instances in C# using Lazy<T>, Double-Check Locking, and static initializers."
        },
        "category": "architecture",
        "tags": [
            "CleanArchitecture",
            "DotNet",
            "DomainDrivenDesign",
            "Architecture",
            "Patterns"
        ],
        "date": "Jul 07, 2026",
        "readTime": {
            "bn": "11 min",
            "en": "6 min"
        },
        "icon": "fas fa-sitemap",
        "thumbnail": "posts/clean-architecture-dotnet/thumbnail.png",
        "featured": false
    },
    {
        "id": 25,
        "slug": "cqrs-with-mediatr-dotnet",
        "title": {
            "bn": "CQRS with MediatR: জটিল কুয়েরি ও কমান্ড ডিজাইন",
            "en": "Observer Pattern & Events in C#: Building Reactive Workflows"
        },
        "excerpt": {
            "bn": "সিস্টেমের রিড ও রাইট অপারেশন আলাদা করার প্যাটার্ন CQRS। .NET Core-এ MediatR মেসেজ বাস ইন্টিগ্রেশন করে কমান্ড হ্যান্ডলিংয়ের কোড উদাহরণ।",
            "en": "Mastering events, delegates, and IObservable in C# to implement decoupled Observer pattern architectures."
        },
        "category": "architecture",
        "tags": [
            "CQRS",
            "MediatR",
            "DesignPatterns",
            "ASPNETCore",
            "CleanCode"
        ],
        "date": "Jul 07, 2026",
        "readTime": {
            "bn": "10 min",
            "en": "8 min"
        },
        "icon": "fas fa-exchange-alt",
        "thumbnail": "posts/cqrs-with-mediatr-dotnet/thumbnail.png",
        "featured": false
    },
    {
        "id": 26,
        "slug": "dependency-injection-deep-dive",
        "title": {
            "bn": "Dependency Injection Deep Dive: লাইফটাইম ও টিপস",
            "en": "Microservices Architecture Patterns: Essential Design Blueprints"
        },
        "excerpt": {
            "bn": "Transient, Scoped, এবং Singleton লাইফটাইমের ইন-ডিপথ গাইড। ভুল কনফিগারেশনের কারণে Captive Dependency এবং মেমরি লিক ডিবাগিংয়ের কৌশল।",
            "en": "Proven architecture patterns for building resilient microservices: Service Discovery, API Gateway, Circuit Breaker, Outbox, and Saga."
        },
        "category": "backend",
        "tags": [
            "DependencyInjection",
            "ASPNETCore",
            "IoC",
            "MemoryManagement",
            "DotNet"
        ],
        "date": "Jul 07, 2026",
        "readTime": {
            "bn": "9 min",
            "en": "15 min"
        },
        "icon": "fas fa-plug",
        "thumbnail": "posts/dependency-injection-deep-dive/thumbnail.png",
        "featured": false
    },
    {
        "id": 27,
        "slug": "global-exception-handling-dotnet",
        "title": {
            "bn": "Global Exception Handling in ASP.NET Core: আধুনিক নিয়ম",
            "en": "Dependency Injection Lifetimes in .NET: Transient vs Scoped vs Singleton"
        },
        "excerpt": {
            "bn": ".NET 8-এর IExceptionHandler এবং RFC 7807 Standard Problem Details ব্যবহার করে গ্লোবাল এরর হ্যান্ডলিংয়ের কোড উদাহরণ।",
            "en": "Understanding service lifetimes in .NET Dependency Injection container to avoid memory leaks and captive dependencies."
        },
        "category": "backend",
        "tags": [
            "ExceptionHandling",
            "ASPNETCore",
            "ProblemDetails",
            "DotNet8",
            "CleanCode"
        ],
        "date": "Jul 07, 2026",
        "readTime": {
            "bn": "8 min",
            "en": "8 min"
        },
        "icon": "fas fa-triangle-exclamation",
        "thumbnail": "posts/global-exception-handling-dotnet/thumbnail.png",
        "featured": false
    },
    {
        "id": 28,
        "slug": "logging-with-serilog-dotnet",
        "title": {
            "bn": "Structured Logging with Serilog: প্রোডাকশন লেভেল মনিটরিং",
            "en": "Structured Logging with Serilog: Production-Grade Monitoring"
        },
        "excerpt": {
            "bn": "র-টেক্সট লগের বদলে সিরিলগ ব্যবহার করে ক্যাটাগরাইজড ও সার্চেবল জেসন লগিং সিঙ্ক কনফিগারেশন করার গাইড।",
            "en": "Setting up structured JSON logging in .NET with Serilog, sinks, enrichment, and log aggregation in Seq and ElasticSearch."
        },
        "category": "devops",
        "tags": [
            "Logging",
            "Serilog",
            "StructuredLogging",
            "DevOps",
            "Monitoring"
        ],
        "date": "Jul 07, 2026",
        "readTime": {
            "bn": "10 min",
            "en": "8 min"
        },
        "icon": "fas fa-receipt",
        "thumbnail": "posts/logging-with-serilog-dotnet/thumbnail.png",
        "featured": false
    },
    {
        "id": 29,
        "slug": "background-jobs-hangfire",
        "title": {
            "bn": "Background Jobs with Hangfire: ব্যাকগ্রাউন্ড টাস্ক প্রসেসিং",
            "en": "Background Jobs with Hangfire: Async Task Processing in .NET"
        },
        "excerpt": {
            "bn": "ইমেইল, রিপোর্ট তৈরি বা ডেটা সিঙ্ক অপারেশনের দীর্ঘ প্রসেস এড়াতে হ্যাংফায়ার কনফিগারেশন ও ড্যাশবোর্ড সিকিউরিটি গাইড।",
            "en": "Orchestrating background tasks, recurring jobs, delayed jobs, and batch queues reliably using Hangfire."
        },
        "category": "performance",
        "tags": [
            "BackgroundJobs",
            "Hangfire",
            "Performance",
            "ASPNETCore",
            "Queue"
        ],
        "date": "Jul 07, 2026",
        "readTime": {
            "bn": "9 min",
            "en": "9 min"
        },
        "icon": "fas fa-tasks",
        "thumbnail": "posts/background-jobs-hangfire/thumbnail.png",
        "featured": false
    },
    {
        "id": 30,
        "slug": "health-checks-aspnet-core",
        "title": {
            "bn": "Health Checks in ASP.NET Core: সার্ভিস মনিটরিং গাইড",
            "en": "Health Checks in ASP.NET Core: Live Monitoring Guide"
        },
        "excerpt": {
            "bn": "ডাটাবেজ, ক্যাশ ও এক্সটার্নাল এপিআইর লাইভ কানেক্টিভিটি সার্বক্ষণিকভাবে অটোমেটিক ট্র্যাক করতে হেলথ চেক এন্ডপয়েন্ট তৈরির নিয়ম।",
            "en": "Monitoring application, database, and external service health using ASP.NET Core Health Checks middleware and UI dashboards."
        },
        "category": "devops",
        "tags": [
            "HealthChecks",
            "ASPNETCore",
            "DevOps",
            "Monitoring",
            "Kubernetes"
        ],
        "date": "Jul 07, 2026",
        "readTime": {
            "bn": "8 min",
            "en": "7 min"
        },
        "icon": "fas fa-heartbeat",
        "thumbnail": "posts/health-checks-aspnet-core/thumbnail.png",
        "featured": false
    },
    {
        "id": 31,
        "slug": "caching-with-redis-dotnet",
        "title": {
            "bn": "Caching with Redis: এপিআই পারফরম্যান্স বৃদ্ধির কৌশল",
            "en": "Caching with Redis: Boosting API Performance in .NET"
        },
        "excerpt": {
            "bn": "Library analogy, IMemoryCache vs Redis, Cache-Aside pattern, Absolute/Sliding expiration, service layer code, cache invalidation, key naming, common mistakes এবং production tips।",
            "en": "Implementing high-performance distributed caching in ASP.NET Core using Redis, cache invalidation strategies, and response caching."
        },
        "category": "performance",
        "tags": [
            "Redis",
            "Caching",
            "DistributedCache",
            "Performance",
            "NoSQL",
            "CacheAside",
            "ASPNETCore"
        ],
        "date": "Jul 07, 2026",
        "readTime": {
            "bn": "16 min",
            "en": "9 min"
        },
        "icon": "fas fa-bolt",
        "thumbnail": "posts/caching-with-redis-dotnet/thumbnail.png",
        "featured": false
    },
    {
        "id": 32,
        "slug": "api-versioning-aspnet-core",
        "title": {
            "bn": "API Versioning in ASP.NET Core: সংস্করণ নিয়ন্ত্রণের সেরা উপায়",
            "en": "API Versioning in ASP.NET Core: Best Practices & Strategies"
        },
        "excerpt": {
            "bn": "ইউআরএল, কোয়েরি প্যারামিটার এবং হেডারের মাধ্যমে এপিআই সংস্করণ নিয়ন্ত্রণ করার এন্টারপ্রাইজ গ্রেড কনফিগারেশন গাইড।",
            "en": "Versioning REST APIs using URL Path, Query String, and Header versioning without breaking client applications."
        },
        "category": "backend",
        "tags": [
            "APIVersioning",
            "ASPNETCore",
            "REST",
            "Routing",
            "WebAPI"
        ],
        "date": "Jul 07, 2026",
        "readTime": {
            "bn": "8 min",
            "en": "7 min"
        },
        "icon": "fas fa-code-branch",
        "thumbnail": "posts/api-versioning-aspnet-core/thumbnail.png",
        "featured": false
    },
    {
        "id": 33,
        "slug": "validation-with-fluentvalidation",
        "title": {
            "bn": "Validation with FluentValidation: মডেল ভ্যালিডেশনের স্মার্ট উপায়",
            "en": "Validation with FluentValidation: Smart Model Validation in .NET"
        },
        "excerpt": {
            "bn": "ডেক্লারেティブ ভ্যালিডেশন রুলস ডিজাইন করে এপিআই ইনপুট স্যানিটাইজেশন এবং টেস্টেবল মডেল আর্কিটেকচার গাইড।",
            "en": "Building strongly-typed validation rules, custom validators, and async validation using FluentValidation in ASP.NET Core."
        },
        "category": "backend",
        "tags": [
            "FluentValidation",
            "Validation",
            "ASPNETCore",
            "CleanCode",
            "DTOs"
        ],
        "date": "Jul 07, 2026",
        "readTime": {
            "bn": "8 min",
            "en": "8 min"
        },
        "icon": "fas fa-clipboard-check",
        "thumbnail": "posts/validation-with-fluentvalidation/thumbnail.png",
        "featured": false
    },
    {
        "id": 34,
        "slug": "signalr-real-time-applications",
        "title": {
            "bn": "SignalR Real-time Applications: দ্বিমুখী যোগাযোগের আধুনিক গাইড",
            "en": "SignalR Real-Time Applications: WebSockets & Bi-Directional Communication"
        },
        "excerpt": {
            "bn": "SignalR এর বিভিন্ন ট্রান্সপোর্ট (WebSocket, SSE, Long Polling) মেকানিজম এবং লাইভ পুশ নোটিফিকেশন ক্লায়েন্ট হাব তৈরির কোড।",
            "en": "Building real-time web applications, chat systems, and live dashboards using ASP.NET Core SignalR and WebSockets."
        },
        "category": "backend",
        "tags": [
            "SignalR",
            "WebSockets",
            "RealTime",
            "ASPNETCore",
            "ChatApp"
        ],
        "date": "Jul 07, 2026",
        "readTime": {
            "bn": "10 min",
            "en": "10 min"
        },
        "icon": "fas fa-tower-broadcast",
        "thumbnail": "posts/signalr-real-time-applications/thumbnail.png",
        "featured": false
    },
    {
        "id": 35,
        "slug": "microservices-vs-monolith",
        "title": {
            "bn": "Microservices vs Monolith: কোনটি আপনার প্রজেক্টের জন্য সঠিক?",
            "en": "Microservices vs Monolith: Choosing the Right Architecture"
        },
        "excerpt": {
            "bn": "Monolith থেকে Microservices-এ যাওয়ার সঠিক সময় কখন? বাস্তব ট্রেড-অফ, ডিপ্লয়মেন্ট কমপ্লেক্সিটি এবং কখন Monolith-ই যথেষ্ট — এই সব নিয়ে বিশেষজ্ঞ দৃষ্টিকোণ থেকে বিশ্লেষণ।",
            "en": "Architectural comparison, trade-offs, complexity, and criteria for deciding between Monolithic and Microservice architectures."
        },
        "category": "architecture",
        "tags": [
            "Microservices",
            "Monolith",
            "SystemDesign",
            "Architecture",
            "CloudNative"
        ],
        "date": "Jul 07, 2026",
        "readTime": {
            "bn": "11 min",
            "en": "11 min"
        },
        "icon": "fas fa-cubes",
        "thumbnail": "posts/microservices-vs-monolith/thumbnail.png",
        "featured": false
    },
    {
        "id": 36,
        "slug": "api-gateway-explained",
        "title": {
            "bn": "API Gateway Explained: মাইক্রোসার্ভিসের প্রবেশদ্বার",
            "en": "API Gateway Explained: The Front Door to Microservices"
        },
        "excerpt": {
            "bn": "API Gateway কেন দরকার, কীভাবে কাজ করে এবং Authentication, Rate Limiting, Routing, Load Balancing একসাথে কীভাবে পরিচালনা করা যায় তার বিস্তারিত ব্যাখ্যা।",
            "en": "Understanding the role of API Gateway in routing, rate limiting, SSL termination, authentication, and request aggregation."
        },
        "category": "architecture",
        "tags": [
            "APIGateway",
            "Microservices",
            "Routing",
            "LoadBalancing",
            "SystemDesign"
        ],
        "date": "Jul 07, 2026",
        "readTime": {
            "bn": "9 min",
            "en": "9 min"
        },
        "icon": "fas fa-network-wired",
        "thumbnail": "posts/api-gateway-explained/thumbnail.png",
        "featured": false
    },
    {
        "id": 37,
        "slug": "rabbitmq-complete-guide",
        "title": {
            "bn": "RabbitMQ Complete Guide: মেসেজ ব্রোকারের পরিপূর্ণ গাইড",
            "en": "RabbitMQ Complete Guide: Message Broker Fundamentals & Integration"
        },
        "excerpt": {
            "bn": "Exchange, Queue, Binding এর মূল ধারণা থেকে শুরু করে Dead Letter Queue, Message Durability এবং .NET-এ RabbitMQ Consumer তৈরির হাতে-কলমে গাইড।",
            "en": "Mastering exchanges, queues, bindings, pub/sub messaging, and message persistence with RabbitMQ in .NET."
        },
        "category": "backend",
        "tags": [
            "RabbitMQ",
            "MessageBroker",
            "AMQP",
            "Queuing",
            "AsyncMessaging"
        ],
        "date": "Jul 07, 2026",
        "readTime": {
            "bn": "13 min",
            "en": "12 min"
        },
        "icon": "fas fa-comments",
        "thumbnail": "posts/rabbitmq-complete-guide/thumbnail.png",
        "featured": false
    },
    {
        "id": 38,
        "slug": "masstransit-aspnet-core",
        "title": {
            "bn": "MassTransit in ASP.NET Core: মেসেজিং অ্যাবস্ট্র্যাকশনের সেরা লাইব্রেরি",
            "en": "MassTransit in ASP.NET Core: High-Level Messaging Abstraction"
        },
        "excerpt": {
            "bn": "RabbitMQ বা Azure Service Bus-এর উপরে MassTransit-এর শক্তিশালী অ্যাবস্ট্র্যাকশন লেয়ার ব্যবহার করে Consumer, Saga এবং Request/Response প্যাটার্ন ইমপ্লিমেন্টেশন।",
            "en": "Simplifying asynchronous message processing and event handling over RabbitMQ and Azure Service Bus using MassTransit."
        },
        "category": "backend",
        "tags": [
            "MassTransit",
            "RabbitMQ",
            "ASPNETCore",
            "Messaging",
            "Consumer"
        ],
        "date": "Jul 07, 2026",
        "readTime": {
            "bn": "11 min",
            "en": "9 min"
        },
        "icon": "fas fa-shuffle",
        "thumbnail": "posts/masstransit-aspnet-core/thumbnail.png",
        "featured": false
    },
    {
        "id": 39,
        "slug": "saga-pattern-microservices",
        "title": {
            "bn": "Saga Pattern: ডিস্ট্রিবিউটেড ট্রানজেকশনের আধুনিক সমাধান",
            "en": "Saga Pattern: Managing Distributed Transactions in Microservices"
        },
        "excerpt": {
            "bn": "Choreography এবং Orchestration — দুটি Saga ইমপ্লিমেন্টেশন পদ্ধতির পার্থক্য এবং MassTransit Saga State Machine দিয়ে Order Processing বাস্তবায়নের কোড।",
            "en": "Orchestration vs Choreography based Saga implementations for maintaining data consistency across distributed microservices."
        },
        "category": "architecture",
        "tags": [
            "SagaPattern",
            "Microservices",
            "DistributedTransactions",
            "MassTransit",
            "CQRS"
        ],
        "date": "Jul 07, 2026",
        "readTime": {
            "bn": "12 min",
            "en": "13 min"
        },
        "icon": "fas fa-diagram-project",
        "thumbnail": "posts/saga-pattern-microservices/thumbnail.png",
        "featured": false
    },
    {
        "id": 40,
        "slug": "event-driven-architecture",
        "title": {
            "bn": "Event-Driven Architecture: ইভেন্ট দিয়ে সার্ভিস কানেক্ট করার দর্শন",
            "en": "Event-Driven Architecture: Connecting Services Asynchronously"
        },
        "excerpt": {
            "bn": "Event Sourcing, Event Bus এবং Domain Events-এর মধ্যে পার্থক্য এবং কীভাবে ঢিলেঢালা সংযুক্ত (Loosely Coupled) ব্যাকএন্ড সিস্টেম ডিজাইন করতে হয়।",
            "en": "Designing loosely-coupled systems using Event Sourcing, Domain Events, Integration Events, and Event-Driven workflows."
        },
        "category": "architecture",
        "tags": [
            "EventDriven",
            "DomainEvents",
            "EventSourcing",
            "Microservices",
            "Architecture"
        ],
        "date": "Jul 07, 2026",
        "readTime": {
            "bn": "10 min",
            "en": "11 min"
        },
        "icon": "fas fa-bolt",
        "thumbnail": "posts/event-driven-architecture/thumbnail.png",
        "featured": false
    },
    {
        "id": 41,
        "slug": "outbox-pattern-dotnet",
        "title": {
            "bn": "Outbox Pattern: মেসেজ না হারানোর নির্ভরযোগ্য কৌশল",
            "en": "Outbox Pattern: Reliable Asynchronous Messaging Without Data Loss"
        },
        "excerpt": {
            "bn": "ডাটাবেজ ট্রানজেকশন এবং মেসেজ পাবলিশিং একসাথে অ্যাটমিকভাবে নিশ্চিত করতে Outbox Pattern এবং .NET-এ Hangfire বা MassTransit দিয়ে এর ইমপ্লিমেন্টেশন।",
            "en": "Guaranteeing dual-write transactional consistency between database updates and message publishing using the Outbox pattern."
        },
        "category": "architecture",
        "tags": [
            "OutboxPattern",
            "AtomicOperations",
            "Reliability",
            "MassTransit",
            "DotNet"
        ],
        "date": "Jul 07, 2026",
        "readTime": {
            "bn": "10 min",
            "en": "8 min"
        },
        "icon": "fas fa-inbox",
        "thumbnail": "posts/outbox-pattern-dotnet/thumbnail.png",
        "featured": false
    },
    {
        "id": 42,
        "slug": "distributed-transactions",
        "title": {
            "bn": "Distributed Transactions: ডিস্ট্রিবিউটেড সিস্টেমে ডেটা সামঞ্জস্যের চ্যালেঞ্জ",
            "en": "Distributed Transactions: Data Consistency Challenges in Distributed Systems"
        },
        "excerpt": {
            "bn": "2PC (Two-Phase Commit) কেন প্রোডাকশনে বিপজ্জনক এবং Eventual Consistency, Saga ও Compensating Transactions দিয়ে কীভাবে ব্যবহারিক সমাধান করা যায়।",
            "en": "Why 2PC fails in cloud environments and how to handle eventual consistency, idempotency, and compensating transactions."
        },
        "category": "architecture",
        "tags": [
            "DistributedTransactions",
            "2PC",
            "EventualConsistency",
            "Saga",
            "CAP"
        ],
        "date": "Jul 07, 2026",
        "readTime": {
            "bn": "12 min",
            "en": "10 min"
        },
        "icon": "fas fa-database",
        "thumbnail": "posts/distributed-transactions/thumbnail.png",
        "featured": false
    },
    {
        "id": 43,
        "slug": "service-discovery-microservices",
        "title": {
            "bn": "Service Discovery: মাইক্রোসার্ভিস একে অপরকে কীভাবে খোঁজে?",
            "en": "Service Discovery: How Microservices Locate Each Other Dynamically"
        },
        "excerpt": {
            "bn": "Client-Side Discovery, Server-Side Discovery এবং Consul বা Kubernetes DNS দিয়ে সার্ভিস রেজিস্ট্রি ও হেলথচেক সেটআপের ব্যবহারিক গাইড।",
            "en": "Server-side vs Client-side service discovery using Consul, Eureka, and Kubernetes DNS for dynamic endpoint resolution."
        },
        "category": "devops",
        "tags": [
            "ServiceDiscovery",
            "Consul",
            "Kubernetes",
            "Microservices",
            "LoadBalancing"
        ],
        "date": "Jul 07, 2026",
        "readTime": {
            "bn": "9 min",
            "en": "8 min"
        },
        "icon": "fas fa-magnifying-glass-location",
        "thumbnail": "posts/service-discovery-microservices/thumbnail.png",
        "featured": false
    },
    {
        "id": 44,
        "slug": "circuit-breaker-pattern",
        "title": {
            "bn": "Circuit Breaker Pattern: ডাউনস্ট্রিম ব্যর্থতা থেকে সার্ভিস রক্ষার কৌশল",
            "en": "Circuit Breaker Pattern: Protecting Services from Downstream Failures"
        },
        "excerpt": {
            "bn": "Closed, Open এবং Half-Open — তিনটি স্টেটের Circuit Breaker কীভাবে কাসকেড ফেইলার ঠেকায় এবং Polly লাইব্রেরি দিয়ে .NET-এ Retry, Timeout ও Circuit Breaker পলিসি তৈরির কোড।",
            "en": "Preventing cascading failures in distributed systems using Polly Circuit Breaker, fallback policies, and retry mechanisms."
        },
        "category": "backend",
        "tags": [
            "CircuitBreaker",
            "Polly",
            "Resilience",
            "Microservices",
            "FaultTolerance"
        ],
        "date": "Jul 07, 2026",
        "readTime": {
            "bn": "10 min",
            "en": "9 min"
        },
        "icon": "fas fa-circle-half-stroke",
        "thumbnail": "posts/circuit-breaker-pattern/thumbnail.png",
        "featured": false
    },
    {
        "id": 45,
        "slug": "sdlc-vs-stlc",
        "title": {
            "bn": "SDLC vs STLC: সফটওয়্যার ডেভেলপমেন্ট ও টেস্টিং লাইফসাইকেলের মূল পার্থক্য",
            "en": "SDLC vs STLC: Core Differences Between Development & Testing Lifecycles"
        },
        "excerpt": {
            "bn": "Book analogy, SDLC/STLC বিস্তারিত, phase mapping table, shift-left, Agile perspective, real e-commerce example, common misconceptions এবং interview answers।",
            "en": "Understanding the distinction, phases, deliverables, and integration between Software Development Life Cycle (SDLC) and Software Testing Life Cycle (STLC)."
        },
        "category": "sqa",
        "tags": [
            "SDLC",
            "STLC",
            "SoftwareTesting",
            "QA",
            "SQA",
            "ShiftLeft",
            "TestingPhases"
        ],
        "date": "Jul 07, 2026",
        "readTime": {
            "bn": "14 min",
            "en": "8 min"
        },
        "icon": "fas fa-rotate",
        "thumbnail": "posts/sdlc-vs-stlc/thumbnail.png",
        "featured": false
    },
    {
        "id": 46,
        "slug": "software-testing-life-cycle",
        "title": {
            "bn": "Software Testing Life Cycle (STLC): টেস্টিংয়ের প্রতিটি ধাপ বিস্তারিত",
            "en": "Software Testing Life Cycle (STLC): Step-by-Step Guide"
        },
        "excerpt": {
            "bn": "Factory analogy, ৬টি phase বিস্তারিত (entry/exit, deliverables), e-commerce real example, Agile STLC, common mistakes এবং interview answers — STLC সম্পূর্ণ Bangla guide।",
            "en": "Detailed breakdown of STLC phases: Requirement Analysis, Test Planning, Test Case Development, Environment Setup, Execution, and Test Closure."
        },
        "category": "sqa",
        "tags": [
            "STLC",
            "TestingPhases",
            "QA",
            "SQA",
            "TestPlanning",
            "RTM",
            "TestClosure"
        ],
        "date": "Jul 07, 2026",
        "readTime": {
            "bn": "15 min",
            "en": "10 min"
        },
        "icon": "fas fa-list-check",
        "thumbnail": "posts/software-testing-life-cycle/thumbnail.png",
        "featured": false
    },
    {
        "id": 47,
        "slug": "test-plan-guide",
        "title": {
            "bn": "Test Plan: একটি কার্যকর টেস্ট পরিকল্পনা তৈরির সম্পূর্ণ গাইড",
            "en": "Test Plan Guide: Creating an Effective Software Testing Strategy"
        },
        "excerpt": {
            "bn": "Road trip analogy, IEEE 829 সব ১৫টি section, Entry/Exit criteria, Agile vs Waterfall, Sprint test plan example, risk table, template checklist এবং interview answers।",
            "en": "Comprehensive guide to writing enterprise test plans covering scope, objectives, schedule, deliverables, risks, and resource allocation."
        },
        "category": "sqa",
        "tags": [
            "TestPlan",
            "QA",
            "SQA",
            "IEEE829",
            "TestManagement",
            "Scope",
            "EntryExitCriteria"
        ],
        "date": "Jul 07, 2026",
        "readTime": {
            "bn": "17 min",
            "en": "9 min"
        },
        "icon": "fas fa-file-contract",
        "thumbnail": "posts/test-plan-guide/thumbnail.png",
        "featured": false
    },
    {
        "id": 48,
        "slug": "test-strategy-guide",
        "title": {
            "bn": "Test Strategy: সামগ্রিক টেস্টিং পদ্ধতির উচ্চ-স্তরের পরিকল্পনা",
            "en": "Test Strategy: High-Level Roadmap for Quality Assurance"
        },
        "excerpt": {
            "bn": "War analogy, Strategy vs Plan table, 10 document sections, 6 strategy types (Risk-Based, Analytical, Reactive...), decision guide, e-commerce example, template এবং interview answers।",
            "en": "Defining high-level QA strategy, testing levels, automation approach, defect management, and compliance frameworks."
        },
        "category": "sqa",
        "tags": [
            "TestStrategy",
            "QA",
            "SQA",
            "RiskBased",
            "TestManagement",
            "TestPlan",
            "Agile"
        ],
        "date": "Jul 07, 2026",
        "readTime": {
            "bn": "16 min",
            "en": "8 min"
        },
        "icon": "fas fa-chess",
        "thumbnail": "posts/test-strategy-guide/thumbnail.png",
        "featured": false
    },
    {
        "id": 49,
        "slug": "test-case-writing",
        "title": {
            "bn": "Test Case Writing: ত্রুটিহীন টেস্ট কেস লেখার কৌশল ও কাঠামো",
            "en": "Test Case Writing: Best Practices & Structure for Defect-Free Testing"
        },
        "excerpt": {
            "bn": "Recipe analogy, field-by-field guide, Positive/Negative/Boundary examples, BVA, Equivalence Partitioning, Login test suite, 8 golden rules, good vs bad comparison এবং interview answers।",
            "en": "Writing clear, reusable, and structured test cases with preconditions, test steps, expected results, and execution status."
        },
        "category": "sqa",
        "tags": [
            "TestCase",
            "QA",
            "SQA",
            "BoundaryValue",
            "ManualTesting",
            "TestDesign",
            "BVA"
        ],
        "date": "Jul 07, 2026",
        "readTime": {
            "bn": "15 min",
            "en": "9 min"
        },
        "icon": "fas fa-pencil",
        "thumbnail": "posts/test-case-writing/thumbnail.png",
        "featured": false
    },
    {
        "id": 50,
        "slug": "bug-life-cycle",
        "title": {
            "bn": "Bug Life Cycle: একটি বাগের জন্ম থেকে মৃত্যু পর্যন্ত",
            "en": "Bug Life Cycle: From Defect Discovery to Resolution"
        },
        "excerpt": {
            "bn": "Hospital analogy, status table, real e-commerce example, Jira tips, 5 golden rules of bug report, common mistakes এবং interview answers — Bug Life Cycle সম্পূর্ণ Bangla guide।",
            "en": "Complete walkthrough of bug states: New, Assigned, Open, Fixed, Pending Retest, Verified, Reopened, and Closed."
        },
        "category": "sqa",
        "tags": [
            "BugLifeCycle",
            "Defect",
            "QA",
            "SQA",
            "BugTracking",
            "Jira",
            "DefectManagement"
        ],
        "date": "Jul 07, 2026",
        "readTime": {
            "bn": "14 min",
            "en": "7 min"
        },
        "icon": "fas fa-bug",
        "thumbnail": "posts/bug-life-cycle/thumbnail.png",
        "featured": false
    },
    {
        "id": 51,
        "slug": "severity-vs-priority",
        "title": {
            "bn": "Severity vs Priority: বাগের গুরুত্ব নির্ধারণের সঠিক পদ্ধতি",
            "en": "Severity vs Priority: Accurate Defect Classification Methodologies"
        },
        "excerpt": {
            "bn": "4 combination examples, severity levels, triage meeting, decision matrix, interview answers — Severity vs Priority practical Bangla guide।",
            "en": "Understanding the critical distinction between Bug Severity (technical impact) and Priority (business urgency) with matrix examples."
        },
        "category": "sqa",
        "tags": [
            "Severity",
            "Priority",
            "BugTriage",
            "DefectManagement",
            "Interview",
            "QA",
            "SQA"
        ],
        "date": "Jul 07, 2026",
        "readTime": {
            "bn": "16 min",
            "en": "7 min"
        },
        "icon": "fas fa-triangle-exclamation",
        "thumbnail": "posts/severity-vs-priority/thumbnail.png",
        "featured": false
    },
    {
        "id": 52,
        "slug": "regression-testing",
        "title": {
            "bn": "Regression Testing: নতুন পরিবর্তন পুরনো ফিচার ভাঙেনি তো?",
            "en": "Regression Testing: Ensuring New Changes Don't Break Existing Features"
        },
        "excerpt": {
            "bn": "Full vs partial regression, suite building, CI/CD automation, smoke-sanity-regression flow — Regression Testing-এর সম্পূর্ণ practical Bangla guide।",
            "en": "Strategies for regression testing, test suite maintenance, automation selection, and impact analysis during sprint cycles."
        },
        "category": "sqa",
        "tags": [
            "RegressionTesting",
            "TestAutomation",
            "CI",
            "SmokeTesting",
            "AgileTesting",
            "QA",
            "SQA"
        ],
        "date": "Jul 07, 2026",
        "readTime": {
            "bn": "18 min",
            "en": "8 min"
        },
        "icon": "fas fa-arrows-rotate",
        "thumbnail": "posts/regression-testing/thumbnail.png",
        "featured": false
    },
    {
        "id": 53,
        "slug": "smoke-vs-sanity-testing",
        "title": {
            "bn": "Smoke vs Sanity Testing: দুটো কুইক চেকের মধ্যে পার্থক্য",
            "en": "Smoke vs Sanity Testing: Key Differences Explained"
        },
        "excerpt": {
            "bn": "Smoke vs Sanity vs Regression, checklists, Agile flow, automation tips — দুটো quick test-এর পার্থক্য practical Bangla guide with real examples।",
            "en": "Comparing build verification (Smoke) testing with component verification (Sanity) testing in fast-paced release cycles."
        },
        "category": "sqa",
        "tags": [
            "SmokeTesting",
            "SanityTesting",
            "RegressionTesting",
            "BuildVerification",
            "AgileTesting",
            "QA",
            "SQA"
        ],
        "date": "Jul 07, 2026",
        "readTime": {
            "bn": "16 min",
            "en": "6 min"
        },
        "icon": "fas fa-flask-vial",
        "thumbnail": "posts/smoke-vs-sanity-testing/thumbnail.png",
        "featured": false
    },
    {
        "id": 54,
        "slug": "exploratory-testing",
        "title": {
            "bn": "Exploratory Testing: স্ক্রিপ্ট ছাড়া বাগ খোঁজার শিল্প",
            "en": "Exploratory Testing: The Art of Unscripted Defect Discovery"
        },
        "excerpt": {
            "bn": "Session-Based ET, charter template, SFDIPOT heuristic, tours, Agile integration — Exploratory Testing-এর সম্পূর্ণ practical Bangla guide (ET ≠ random testing)।",
            "en": "How to perform structured exploratory testing using charters, mind maps, heuristics, and domain expertise."
        },
        "category": "sqa",
        "tags": [
            "ExploratoryTesting",
            "SessionBased",
            "TestCharter",
            "ManualTesting",
            "AgileTesting",
            "QA",
            "SQA"
        ],
        "date": "Jul 07, 2026",
        "readTime": {
            "bn": "18 min",
            "en": "7 min"
        },
        "icon": "fas fa-magnifying-glass",
        "thumbnail": "posts/exploratory-testing/thumbnail.png",
        "featured": false
    },
    {
        "id": 55,
        "slug": "login-api-test-cases",
        "title": {
            "bn": "Login API Test Cases: সম্পূর্ণ Authentication Testing গাইড",
            "en": "Login API Test Cases: Complete Authentication Testing Guide"
        },
        "excerpt": {
            "bn": "JWT validation, account lockout, user enumeration, SQL injection, multi-device session — Login API-এর 31টি test case সহজ Bangla guide (কী করবেন + কী expect করবেন)।",
            "en": "Comprehensive test scenarios for Login APIs including valid credentials, invalid passwords, rate limiting, SQLi/XSS payloads, and JWT validation."
        },
        "category": "sqa",
        "tags": [
            "APITesting",
            "LoginAPI",
            "Authentication",
            "JWT",
            "AccountLockout",
            "SecurityTesting",
            "QA",
            "SQA"
        ],
        "date": "Jul 07, 2026",
        "readTime": {
            "bn": "18 min",
            "en": "9 min"
        },
        "icon": "fas fa-key",
        "thumbnail": "posts/login-api-test-cases/thumbnail.png",
        "featured": false
    },
    {
        "id": 56,
        "slug": "registration-api-test-cases",
        "title": {
            "bn": "Registration API Test Cases: ইউজার সাইনআপ ফ্লো টেস্টিং গাইড",
            "en": "Registration API Test Cases: User Signup Workflow Testing"
        },
        "excerpt": {
            "bn": "Field validation, duplicate email, password policy, email verification, SQL/XSS — Registration API-এর 31টি test case সহজ Bangla guide (কী করবেন + কী expect করবেন)।",
            "en": "Test cases for User Registration APIs covering duplicate emails, password complexity, input sanitization, OTP verification, and error responses."
        },
        "category": "sqa",
        "tags": [
            "APITesting",
            "RegistrationAPI",
            "InputValidation",
            "EmailVerification",
            "SecurityTesting",
            "QA",
            "SQA"
        ],
        "date": "Jul 07, 2026",
        "readTime": {
            "bn": "18 min",
            "en": "9 min"
        },
        "icon": "fas fa-user-plus",
        "thumbnail": "posts/registration-api-test-cases/thumbnail.png",
        "featured": false
    },
    {
        "id": 57,
        "slug": "payment-api-testing",
        "title": {
            "bn": "Payment API Testing: লেনদেন যাচাইয়ের সম্পূর্ণ কৌশল",
            "en": "Payment API Testing: Complete Transaction Verification Strategy"
        },
        "excerpt": {
            "bn": "Idempotency, gateway timeout, amount tampering, bKash/Nagad, refund, webhook — Payment API-এর 34টি test case সহজ Bangla guide (কী করবেন + কী expect করবেন)।",
            "en": "Testing payment gateways for double-spend prevention, currency conversion, idempotency keys, webhook callbacks, and failure recovery."
        },
        "category": "sqa",
        "tags": [
            "APITesting",
            "PaymentAPI",
            "Idempotency",
            "FinTech",
            "Refund",
            "QA",
            "SQA"
        ],
        "date": "Jul 07, 2026",
        "readTime": {
            "bn": "20 min",
            "en": "10 min"
        },
        "icon": "fas fa-credit-card",
        "thumbnail": "posts/payment-api-testing/thumbnail.png",
        "featured": false
    },
    {
        "id": 58,
        "slug": "otp-api-testing",
        "title": {
            "bn": "OTP API Testing: এককালীন পাসওয়ার্ড টেস্টিংয়ের সম্পূর্ণ গাইড",
            "en": "OTP API Testing: One-Time Password Verification Guide"
        },
        "excerpt": {
            "bn": "Send/verify flow, expiry, replay attack, brute force, resend limit, OTP leak check — OTP API-এর 33টি test case সহজ Bangla guide (কী করবেন + কী expect করবেন)।",
            "en": "Test scenarios for OTP generation, expiration time, max retry attempts, brute force prevention, and SMS gateway failover."
        },
        "category": "sqa",
        "tags": [
            "APITesting",
            "OTP",
            "SecurityTesting",
            "2FA",
            "BruteForce",
            "QA",
            "SQA"
        ],
        "date": "Jul 07, 2026",
        "readTime": {
            "bn": "18 min",
            "en": "8 min"
        },
        "icon": "fas fa-mobile-screen",
        "thumbnail": "posts/otp-api-testing/thumbnail.png",
        "featured": false
    },
    {
        "id": 59,
        "slug": "file-upload-api-testing",
        "title": {
            "bn": "File Upload API Testing: ফাইল আপলোড ফিচারের নির্ভরযোগ্য পরীক্ষা",
            "en": "File Upload API Testing: Robust File Attachment Verification"
        },
        "excerpt": {
            "bn": "Multipart upload, magic byte check, MIME spoofing, path traversal, size limit — File Upload API-এর 36টি test case সহজ Bangla guide (কী করবেন + কী expect করবেন)।",
            "en": "Testing file upload endpoints for MIME-type validation, max file size limits, malicious file extension blocking, and virus scanning."
        },
        "category": "sqa",
        "tags": [
            "APITesting",
            "FileUpload",
            "SecurityTesting",
            "MIMESpoofing",
            "MagicBytes",
            "QA",
            "SQA"
        ],
        "date": "Jul 07, 2026",
        "readTime": {
            "bn": "18 min",
            "en": "8 min"
        },
        "icon": "fas fa-file-arrow-up",
        "thumbnail": "posts/file-upload-api-testing/thumbnail.png",
        "featured": false
    },
    {
        "id": 60,
        "slug": "search-api-testing",
        "title": {
            "bn": "Search API Testing: সার্চ ফিচারের সব কোণ থেকে পরীক্ষা",
            "en": "Search API Testing: Testing Endpoints From Every Angle"
        },
        "excerpt": {
            "bn": "Relevance ranking, fuzzy match, injection, Bengali/Unicode, autocomplete, search+filter combo — Search API-এর 48টি production-ready test case professional Bangla guide।",
            "en": "Testing search APIs for exact match, partial match, special characters, SQL injection, performance under heavy query load, and zero-results fallback."
        },
        "category": "sqa",
        "tags": [
            "APITesting",
            "SearchAPI",
            "SQLInjection",
            "RelevanceRanking",
            "PerformanceTesting",
            "QA",
            "SQA"
        ],
        "date": "Jul 07, 2026",
        "readTime": {
            "bn": "20 min",
            "en": "8 min"
        },
        "icon": "fas fa-magnifying-glass",
        "thumbnail": "posts/search-api-testing/thumbnail.png",
        "featured": false
    },
    {
        "id": 61,
        "slug": "pagination-testing",
        "title": {
            "bn": "Pagination Testing: পেজিনেশন API-এর সম্পূর্ণ পরীক্ষা গাইড",
            "en": "Pagination Testing: Complete API Pagination Test Guide"
        },
        "excerpt": {
            "bn": "Offset vs cursor pagination, partial last page, duplicate/missing records, sort+filter combo, deep offset performance — Pagination API-এর 49টি production-ready test case professional Bangla guide।",
            "en": "Verifying page index, page size, total record counts, boundary conditions (page 0, negative index, out of range), and performance."
        },
        "category": "sqa",
        "tags": [
            "APITesting",
            "Pagination",
            "BoundaryValue",
            "DataIntegrity",
            "CursorPagination",
            "QA",
            "SQA"
        ],
        "date": "Jul 07, 2026",
        "readTime": {
            "bn": "20 min",
            "en": "7 min"
        },
        "icon": "fas fa-table-list",
        "thumbnail": "posts/pagination-testing/thumbnail.png",
        "featured": false
    },
    {
        "id": 62,
        "slug": "filtering-testing",
        "title": {
            "bn": "Filtering Testing: API Filter প্যারামিটারের নির্ভুল পরীক্ষা",
            "en": "Filtering Testing: Accurate Verification of API Filter Parameters"
        },
        "excerpt": {
            "bn": "Filter leak, multi-filter AND/OR, injection, cross-tenant bypass, facet count, pagination consistency — Filtering API-এর 55টি production-ready test case professional Bangla guide।",
            "en": "Testing single-field, multi-field, date range, and boolean filters on REST API endpoints to ensure accurate query generation."
        },
        "category": "sqa",
        "tags": [
            "APITesting",
            "Filtering",
            "QueryParams",
            "FilterLeak",
            "SecurityTesting",
            "QA",
            "SQA"
        ],
        "date": "Jul 07, 2026",
        "readTime": {
            "bn": "20 min",
            "en": "7 min"
        },
        "icon": "fas fa-filter",
        "thumbnail": "posts/filtering-testing/thumbnail.png",
        "featured": false
    },
    {
        "id": 63,
        "slug": "sorting-testing",
        "title": {
            "bn": "Sorting Testing: API Data Sorting-এর নির্ভরযোগ্য যাচাই পদ্ধতি",
            "en": "Sorting Testing: Reliable API Data Sorting Validation"
        },
        "excerpt": {
            "bn": "Locale collation, NULL tie-breaking, multi-column sort, pagination continuity, SQL injection, UI sync — Sorting API-এর 53টি production-ready test case professional Bangla guide।",
            "en": "Validating ascending, descending, multi-column sorting, null handling, and invalid field sorting parameters on API responses."
        },
        "category": "sqa",
        "tags": [
            "APITesting",
            "Sorting",
            "Pagination",
            "DataIntegrity",
            "LocaleSorting",
            "QA",
            "SQA"
        ],
        "date": "Jul 07, 2026",
        "readTime": {
            "bn": "20 min",
            "en": "7 min"
        },
        "icon": "fas fa-arrow-up-wide-short",
        "thumbnail": "posts/sorting-testing/thumbnail.png",
        "featured": false
    },
    {
        "id": 64,
        "slug": "report-download-testing",
        "title": {
            "bn": "Report Download Testing: রিপোর্ট ডাউনলোড API-এর সম্পূর্ণ পরীক্ষা",
            "en": "Report Download Testing: Comprehensive Report Generation Testing"
        },
        "excerpt": {
            "bn": "Sync vs Async export, data accuracy, authorization, timezone, async job lifecycle, PII masking, performance load — Report Download API-এর 42টি production-ready test case (text format)।",
            "en": "Testing PDF, CSV, and Excel export APIs for data accuracy, header formatting, large dataset streaming, and download timeout handling."
        },
        "category": "sqa",
        "tags": [
            "APITesting",
            "ReportExport",
            "PDF",
            "Excel",
            "DataAccuracy",
            "PerformanceTesting",
            "QA"
        ],
        "date": "Jul 07, 2026",
        "readTime": {
            "bn": "22 min",
            "en": "8 min"
        },
        "icon": "fas fa-file-export",
        "thumbnail": "posts/report-download-testing/thumbnail.png",
        "featured": false
    },
    {
        "id": 65,
        "slug": "jwt-complete-guide",
        "title": {
            "bn": "JWT (JSON Web Token) সম্পূর্ণ বিশ্লেষণ: এটি কী, কীভাবে কাজ করে, আক্রমণকারীরা কীভাবে দুর্বলতা খুঁজে বের করে এবং কীভাবে নিরাপদভাবে ব্যবহার করবেন",
            "en": "JWT (JSON Web Token) Complete Analysis: How It Works, Common Vulnerabilities, and Secure Usage"
        },
        "excerpt": {
            "bn": "JWT-এর Structure, Login Flow, Signature Verification, Access/Refresh Token, আক্রমণের ধরন এবং Best Practices — Authentication ও Authorization বুঝতে সম্পূর্ণ বাংলা গাইড।",
            "en": "Complete guide to JWT structure, login flow, signature verification, access/refresh tokens, common attack vectors, and security best practices."
        },
        "category": "backend",
        "tags": [
            "JWT",
            "Authentication",
            "Security",
            "Token",
            "ASPNETCore",
            "Backend"
        ],
        "date": "Jul 31, 2026",
        "readTime": {
            "bn": "28 min",
            "en": "28 min"
        },
        "icon": "fas fa-shield-halved",
        "thumbnail": "posts/jwt-complete-guide/thumbnail.png",
        "featured": false
    },
    {
        "id": 66,
        "slug": "web-application-testing",
        "title": {
            "bn": "Web Application Testing: ওয়েব অ্যাপ টেস্টিংয়ের High-Level গাইড",
            "en": "Web Application Testing: A High-Level Guide for Beginners"
        },
        "excerpt": {
            "bn": "দোকান analogy, E-commerce/bKash/Admin panel real scenario, negative test table, beginner checklist, DevTools tip, Agile sprint flow — Web Application Testing সহজ Bangla guide with real-world examples।",
            "en": "Shop analogy, e-commerce/banking/admin real scenarios, negative test tables, beginner checklist, DevTools tips, Agile sprint flow — an easy Web Application Testing guide with real-world examples."
        },
        "category": "sqa",
        "tags": [
            "WebApplicationTesting",
            "WebTesting",
            "QA",
            "SQA",
            "ManualTesting",
            "TestAutomation",
            "FunctionalTesting",
            "CrossBrowser"
        ],
        "date": "Aug 01, 2026",
        "readTime": {
            "bn": "১৮ মিনিট",
            "en": "16 min"
        },
        "icon": "fas fa-globe",
        "thumbnail": "posts/web-application-testing/thumbnail.png",
        "featured": false
    },
    {
        "id": 67,
        "slug": "ssl-tls-file-formats",
        "title": {
            "bn": "SSL/TLS ফাইল ফরম্যাট গাইড: কোন ফাইলের কী কাজ এবং কীভাবে বানাবেন?",
            "en": "SSL/TLS File Format Guide: What Each File Does and How to Create Them"
        },
        "excerpt": {
            "bn": "`.crt`, `.pem`, `.key`, `.pfx`, `.csr`, `.der` — এক্সটেনশন বনাম এনকোডিং, সার্টিফিকেট চেইন, NGINX/Apache/IIS/Kestrel কনফিগ, OpenSSL কনভার্শন ও প্রোডাকশন ভেরিফিকেশন।",
            "en": "Deep guide to .crt, .pem, .key, .pfx, .csr and .der — encoding vs extension, certificate chains, NGINX/Apache/IIS/Kestrel setup, OpenSSL conversion, and production verification."
        },
        "category": "devops",
        "tags": [
            "SSL",
            "TLS",
            "OpenSSL",
            "NGINX",
            "IIS",
            "Certificates",
            "DevOps"
        ],
        "date": "Aug 15, 2026",
        "readTime": {
            "bn": "২২ মিনিট",
            "en": "22 min"
        },
        "icon": "fas fa-lock",
        "thumbnail": "posts/ssl-tls-file-formats/thumbnail.png",
        "featured": false
    }
];
