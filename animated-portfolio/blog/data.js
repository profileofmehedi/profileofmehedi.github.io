/* =====================================================
   CODING DROP — SHARED BLOG DATA (Lightweight Metadata)
   ===================================================== */

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
        "title": "Cloudflare: Web Application Security and Performance",
        "excerpt": "একজন .NET Developer হিসেবে Production-Ready Application তৈরি করতে গেলে শুধু Business Logic যথেষ্ট নয়। Cloudflare কীভাবে DNS, CDN, SSL, DDoS Protection, WAF, Rate Limiting, Bot Protection এবং Zero Trust Security দিয়ে আপনার Application-কে পূর্ণ সুরক্ষা দেয় — সব কিছু এক জায়গায়।",
        "category": "devops",
        "tags": [
            "Cloudflare",
            "Security",
            "CDN",
            "WAF",
            "DevOps"
        ],
        "date": "Jul 06, 2026",
        "readTime": "10 min",
        "icon": "fas fa-shield-halved",
        "thumbnail": "posts/cloudflare-web-security-performance/cloud-flare-blog-1.png",
        "featured": false
    },
    {
        "id": 11,
        "slug": "owasp-top-10-web-security",
        "title": "OWASP Top 10: Web Application Security-এর ১০টি অতি গুরুত্বপূর্ণ ঝুঁকি ও সমাধান",
        "excerpt": "Software System-কে Hacker-দের হাত থেকে সুরক্ষিত রাখতে OWASP Top 10-এর গুরুত্ব অপরিসীম। SQL Injection, Broken Access Control, SSRF-এর মতো ঝুঁকিগুলো কীভাবে আপনার Application-কে ঝুঁকির মুখে ফেলে এবং কীভাবে কোড লেভেলে এর প্রতিরোধ গড়ে তুলবেন, তা নিয়ে আলোচনা।",
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
        "readTime": "12 min",
        "icon": "fas fa-shield-halved",
        "thumbnail": "posts/owasp-top-10-web-security/owasp-thumbnail.png",
        "featured": false
    },
    {
        "id": 12,
        "slug": "sql-injection-prevention-aspnet-core",
        "title": "SQL Injection Prevention in ASP.NET Core: সুরক্ষার সর্বোত্তম উপায়",
        "excerpt": "ডাটাবেজ সিকিউরিটির ক্ষেত্রে SQL Injection (SQLi) একটি বড় ঝুঁকি। .NET Core-এ Entity Framework এবং Dapper ব্যবহার করে কীভাবে এপিআই স্তর থেকে ডাটাবেজ সুরক্ষিত রাখা যায় তার বিস্তারিত আলোচনা ও কোড উদাহরণ।",
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
        "readTime": "8 min",
        "icon": "fas fa-database",
        "thumbnail": "posts/sql-injection-prevention-aspnet-core/thumbnail.png",
        "featured": false
    },
    {
        "id": 13,
        "slug": "xss-vs-csrf-vs-ssrf",
        "title": "XSS vs CSRF vs SSRF: ওয়েব সিকিউরিটির তিন চিরশত্রু",
        "excerpt": "Cross-Site Scripting (XSS), Cross-Site Request Forgery (CSRF) এবং Server-Side Request Forgery (SSRF) এর পার্থক্য, আক্রমণ পদ্ধতি এবং ব্রাউজার ও ব্যাকএন্ড স্তরে তাদের প্রতিকারের তুলনামূলক গাইড।",
        "category": "backend",
        "tags": [
            "WebSecurity",
            "XSS",
            "CSRF",
            "SSRF",
            "BackendSecurity"
        ],
        "date": "Jul 07, 2026",
        "readTime": "10 min",
        "icon": "fas fa-shield-virus",
        "thumbnail": "posts/xss-vs-csrf-vs-ssrf/thumbnail.png",
        "featured": false
    },
    {
        "id": 14,
        "slug": "jwt-authentication-best-practices",
        "title": "JWT Authentication Best Practices: টোকেন সিকিউরিটির বাস্তব গাইড",
        "excerpt": "জেসন ওয়েব টোকেন (JWT) বর্তমান অথেনটিকেশনের মূল ভিত্তি। তবে সিক্রেট কি সিলেকশন, টোকেন এক্সপাইরি, রিফ্রেশ টোকেন এবং ক্লাইম ভ্যালিডেশনে নিরাপত্তা ত্রুটি এড়ানোর সর্বোত্তম প্র্যাকটিসসমূহ।",
        "category": "backend",
        "tags": [
            "JWT",
            "Authentication",
            "Security",
            "Token",
            "ASPNETCore"
        ],
        "date": "Jul 07, 2026",
        "readTime": "9 min",
        "icon": "fas fa-key",
        "thumbnail": "posts/jwt-authentication-best-practices/thumbnail.png",
        "featured": false
    },
    {
        "id": 15,
        "slug": "api-security-checklist",
        "title": "REST API Security Checklist: প্রোডাকশন-রেডি এপিআই সিকিউরিটি",
        "excerpt": "আপনার ওয়েব সার্ভিস বা মোবাইল এপিআই রিলিজ করার আগে যে সিকিউরিটি প্র্যাকটিসগুলো জানা আবশ্যক। HTTPS, প্রপার রিকোয়েস্ট অথরাইজেশন, রেট লিমিটিং এবং এক্সপোজার এড়ানোর গাইড।",
        "category": "devops",
        "tags": [
            "API",
            "Security",
            "Checklist",
            "REST",
            "DevOps"
        ],
        "date": "Jul 07, 2026",
        "readTime": "7 min",
        "icon": "fas fa-list-check",
        "thumbnail": "posts/api-security-checklist/thumbnail.png",
        "featured": false
    },
    {
        "id": 16,
        "slug": "secure-password-storage-bcrypt-argon2",
        "title": "Secure Password Storage: BCrypt vs Argon2 কোনটি সেরা?",
        "excerpt": "ডাটাবেজে পাসওয়ার্ড হ্যাশিং ও সল্টিংয়ের জন্য কোন অ্যালগরিদমটি আদর্শ? ক্লাসিক্যাল BCrypt এবং আধুনিক Argon2id এর মধ্যকার পার্থক্য, পারফরম্যান্স তুলনা এবং .NET কোডে তার ব্যবহার।",
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
        "readTime": "8 min",
        "icon": "fas fa-vault",
        "thumbnail": "posts/secure-password-storage-bcrypt-argon2/thumbnail.png",
        "featured": false
    },
    {
        "id": 17,
        "slug": "oauth2-openid-connect-guide",
        "title": "OAuth2 & OpenID Connect: আধুনিক অথেনটিকেশন আর্কিটেকচার",
        "excerpt": "অনুমোদন ফ্রেমওয়ার্ক OAuth 2.0 এবং আইডেন্টিটি প্রোটোকল OIDC এর কাজ করার পদ্ধতি। সিঙ্গেল সাইন-অন (SSO) এবং Duende IdentityServer এর ব্যবহারিক গাইড।",
        "category": "architecture",
        "tags": [
            "OAuth2",
            "OIDC",
            "Authentication",
            "Architecture",
            "SSO"
        ],
        "date": "Jul 07, 2026",
        "readTime": "11 min",
        "icon": "fas fa-user-lock",
        "thumbnail": "posts/oauth2-openid-connect-guide/thumbnail.png",
        "featured": false
    },
    {
        "id": 18,
        "slug": "rate-limiting-aspnet-core",
        "title": "Rate Limiting in ASP.NET Core: ডস আক্রমণ প্রতিরোধ গাইড",
        "excerpt": "ASP.NET Core এ যুক্ত হওয়া বিল্ট-ইন রেট লিমিটিং মিডলওয়্যার কনফিগারেশন। Fixed Window, Sliding Window, Token Bucket পলিসি বাস্তবায়নের মাধ্যমে এপিআই অপব্যবহার রোধের গাইড।",
        "category": "performance",
        "tags": [
            "RateLimiting",
            "ASPNETCore",
            "Performance",
            "Security",
            "DDoS"
        ],
        "date": "Jul 07, 2026",
        "readTime": "8 min",
        "icon": "fas fa-gauge-high",
        "thumbnail": "posts/rate-limiting-aspnet-core/thumbnail.png",
        "featured": false
    },
    {
        "id": 19,
        "slug": "cors-explained-web-developers",
        "title": "CORS Explained: ডোমেন শেয়ারিং ও ব্রাউজার সিকিউরিটি",
        "excerpt": "ওয়েব ডেভেলপমেন্টে CORS ত্রুটি এড়াতে ব্রাউজারের Same-Origin Policy এবং Preflight (OPTIONS) রিকোয়েস্ট মেকানিজম বোঝার সহজ উপায়। .NET-এ নিরাপদ CORS পলিসি কনফিগারেশন।",
        "category": "frontend",
        "tags": [
            "CORS",
            "Security",
            "WebDev",
            "Backend",
            "Frontend"
        ],
        "date": "Jul 07, 2026",
        "readTime": "7 min",
        "icon": "fas fa-network-wired",
        "thumbnail": "posts/cors-explained-web-developers/thumbnail.png",
        "featured": false
    },
    {
        "id": 20,
        "slug": "secure-file-upload-web-apps",
        "title": "Secure File Upload in Web Apps: ম্যালওয়্যার ও সাইবার থ্রেট রোধ",
        "excerpt": "ওয়েব অ্যাপ্লিকেশনে ব্যবহারকারীদের ফাইল আপলোডের ক্ষেত্রে Remote Code Execution (RCE) ঝুঁকি এড়াতে এক্সটেনশন ভ্যালিডেশন, ম্যাজিক নাম্বার ভেরিফিকেশন এবং ক্লাউড স্টোরেজ সিকিউরিটি।",
        "category": "devops",
        "tags": [
            "FileUpload",
            "Security",
            "RCE",
            "Cloud",
            "DevOps"
        ],
        "date": "Jul 07, 2026",
        "readTime": "9 min",
        "icon": "fas fa-file-shield",
        "thumbnail": "posts/secure-file-upload-web-apps/thumbnail.png",
        "featured": false
    },
    {
        "id": 21,
        "slug": "aspnet-core-roadmap-2026",
        "title": "Complete ASP.NET Core Roadmap (2026)",
        "excerpt": "২০ চেয়ে আধুনিক .NET ১০ ও C# ১৪ রোডম্যাপ। এপিআই ডিজাইন, মাইক্রোসার্ভিস প্যাটার্ন, ডেটা অ্যাক্সেস ও ক্লাউড ডেপ্লয়মেন্টের পূর্ণাঙ্গ গাইডলাইন।",
        "category": "architecture",
        "tags": [
            "DotNet",
            "Roadmap",
            "ASPNETCore",
            "Backend",
            "Career"
        ],
        "date": "Jul 07, 2026",
        "readTime": "12 min",
        "icon": "fas fa-road",
        "thumbnail": "posts/aspnet-core-roadmap-2026/thumbnail.png",
        "featured": false
    },
    {
        "id": 22,
        "slug": "minimal-api-vs-controller-api",
        "title": "Minimal API vs Controller API: কোনটি কখন ব্যবহার করবেন?",
        "excerpt": ".NET-এর Minimal API এবং ঐতিহ্যবাহী Controller API এর তুলনা, গঠনগত পার্থক্য ও পারফরম্যান্স বিশ্লেষণ নিয়ে বিস্তারিত আলোচনা।",
        "category": "backend",
        "tags": [
            "MinimalAPI",
            "ControllerAPI",
            "ASPNETCore",
            "Performance",
            "WebAPI"
        ],
        "date": "Jul 07, 2026",
        "readTime": "9 min",
        "icon": "fas fa-network-wired",
        "thumbnail": "posts/minimal-api-vs-controller-api/thumbnail.png",
        "featured": false
    },
    {
        "id": 23,
        "slug": "repository-pattern-best-practices",
        "title": "Repository Pattern Best Practices: ভুল ধারণা ও সঠিক সমাধান",
        "excerpt": "ডেটা অ্যাক্সেস লেয়ারে রিপোজিটরি প্যাটার্নের জেনেরিক অপব্যবহার এড়ানো, IQueryable এক্সপোজার রোধ এবং Unit of Work এর সঠিক ব্যবহার গাইড।",
        "category": "database",
        "tags": [
            "RepositoryPattern",
            "Database",
            "EFCore",
            "CleanCode",
            "DesignPatterns"
        ],
        "date": "Jul 07, 2026",
        "readTime": "8 min",
        "icon": "fas fa-database",
        "thumbnail": "posts/repository-pattern-best-practices/thumbnail.png",
        "featured": false
    },
    {
        "id": 24,
        "slug": "clean-architecture-dotnet",
        "title": "Clean Architecture in .NET: একটি পূর্ণাঙ্গ দিকনির্দেশনা",
        "excerpt": "ডিপেন্ডেন্সি রুলস মেনে প্রজেক্টের Domain, Application, Infrastructure এবং Presentation লেয়ার ডিজাইন করার প্রফেশনাল গাইড।",
        "category": "architecture",
        "tags": [
            "CleanArchitecture",
            "DotNet",
            "DomainDrivenDesign",
            "Architecture",
            "Patterns"
        ],
        "date": "Jul 07, 2026",
        "readTime": "11 min",
        "icon": "fas fa-sitemap",
        "thumbnail": "posts/clean-architecture-dotnet/thumbnail.png",
        "featured": false
    },
    {
        "id": 25,
        "slug": "cqrs-with-mediatr-dotnet",
        "title": "CQRS with MediatR: জটিল কুয়েরি ও কমান্ড ডিজাইন",
        "excerpt": "সিস্টেমের রিড ও রাইট অপারেশন আলাদা করার প্যাটার্ন CQRS। .NET Core-এ MediatR মেসেজ বাস ইন্টিগ্রেশন করে কমান্ড হ্যান্ডলিংয়ের কোড উদাহরণ।",
        "category": "architecture",
        "tags": [
            "CQRS",
            "MediatR",
            "DesignPatterns",
            "ASPNETCore",
            "CleanCode"
        ],
        "date": "Jul 07, 2026",
        "readTime": "10 min",
        "icon": "fas fa-exchange-alt",
        "thumbnail": "posts/cqrs-with-mediatr-dotnet/thumbnail.png",
        "featured": false
    },
    {
        "id": 26,
        "slug": "dependency-injection-deep-dive",
        "title": "Dependency Injection Deep Dive: লাইফটাইম ও টিপস",
        "excerpt": "Transient, Scoped, এবং Singleton লাইফটাইমের ইন-ডিপথ গাইড। ভুল কনফিগারেশনের কারণে Captive Dependency এবং মেমরি লিক ডিবাগিংয়ের কৌশল।",
        "category": "backend",
        "tags": [
            "DependencyInjection",
            "ASPNETCore",
            "IoC",
            "MemoryManagement",
            "DotNet"
        ],
        "date": "Jul 07, 2026",
        "readTime": "9 min",
        "icon": "fas fa-plug",
        "thumbnail": "posts/dependency-injection-deep-dive/thumbnail.png",
        "featured": false
    },
    {
        "id": 27,
        "slug": "global-exception-handling-dotnet",
        "title": "Global Exception Handling in ASP.NET Core: আধুনিক নিয়ম",
        "excerpt": ".NET 8-এর IExceptionHandler এবং RFC 7807 Standard Problem Details ব্যবহার করে গ্লোবাল এরর হ্যান্ডলিংয়ের কোড উদাহরণ।",
        "category": "backend",
        "tags": [
            "ExceptionHandling",
            "ASPNETCore",
            "ProblemDetails",
            "DotNet8",
            "CleanCode"
        ],
        "date": "Jul 07, 2026",
        "readTime": "8 min",
        "icon": "fas fa-triangle-exclamation",
        "thumbnail": "posts/global-exception-handling-dotnet/thumbnail.png",
        "featured": false
    },
    {
        "id": 28,
        "slug": "logging-with-serilog-dotnet",
        "title": "Structured Logging with Serilog: প্রোডাকশন লেভেল মনিটরিং",
        "excerpt": "র-টেক্সট লগের বদলে সিরিলগ ব্যবহার করে ক্যাটাগরাইজড ও সার্চেবল জেসন লগিং সিঙ্ক কনফিগারেশন করার গাইড।",
        "category": "devops",
        "tags": [
            "Logging",
            "Serilog",
            "StructuredLogging",
            "DevOps",
            "Monitoring"
        ],
        "date": "Jul 07, 2026",
        "readTime": "10 min",
        "icon": "fas fa-receipt",
        "thumbnail": "posts/logging-with-serilog-dotnet/thumbnail.png",
        "featured": false
    },
    {
        "id": 29,
        "slug": "background-jobs-hangfire",
        "title": "Background Jobs with Hangfire: ব্যাকগ্রাউন্ড টাস্ক প্রসেসিং",
        "excerpt": "ইমেইল, রিপোর্ট তৈরি বা ডেটা সিঙ্ক অপারেশনের দীর্ঘ প্রসেস এড়াতে হ্যাংফায়ার কনফিগারেশন ও ড্যাশবোর্ড সিকিউরিটি গাইড।",
        "category": "performance",
        "tags": [
            "BackgroundJobs",
            "Hangfire",
            "Performance",
            "ASPNETCore",
            "Queue"
        ],
        "date": "Jul 07, 2026",
        "readTime": "9 min",
        "icon": "fas fa-tasks",
        "thumbnail": "posts/background-jobs-hangfire/thumbnail.png",
        "featured": false
    },
    {
        "id": 30,
        "slug": "health-checks-aspnet-core",
        "title": "Health Checks in ASP.NET Core: সার্ভিস মনিটরিং গাইড",
        "excerpt": "ডাটাবেজ, ক্যাশ ও এক্সটার্নাল এপিআইর লাইভ কানেক্টিভিটি সার্বক্ষণিকভাবে অটোমেটিক ট্র্যাক করতে হেলথ চেক এন্ডপয়েন্ট তৈরির নিয়ম।",
        "category": "devops",
        "tags": [
            "HealthChecks",
            "ASPNETCore",
            "DevOps",
            "Monitoring",
            "Kubernetes"
        ],
        "date": "Jul 07, 2026",
        "readTime": "8 min",
        "icon": "fas fa-heartbeat",
        "thumbnail": "posts/health-checks-aspnet-core/thumbnail.png",
        "featured": false
    },
    {
        "id": 31,
        "slug": "caching-with-redis-dotnet",
        "title": "Caching with Redis: এপিআই পারফরম্যান্স বৃদ্ধির কৌশল",
        "excerpt": "ডিস্ট্রিবিউটেড ক্যাশিং প্যাটার্নে রেডিস স্টোর কনফিগারেশন এবং এপিআই রেসপন্স মিলি-সেকেন্ডে নামিয়ে আনার প্রাকটিক্যাল কোড গাইড।",
        "category": "performance",
        "tags": [
            "Redis",
            "Caching",
            "DistributedCache",
            "Performance",
            "NoSQL"
        ],
        "date": "Jul 07, 2026",
        "readTime": "9 min",
        "icon": "fas fa-bolt",
        "thumbnail": "posts/caching-with-redis-dotnet/thumbnail.png",
        "featured": false
    },
    {
        "id": 32,
        "slug": "api-versioning-aspnet-core",
        "title": "API Versioning in ASP.NET Core: সংস্করণ নিয়ন্ত্রণের সেরা উপায়",
        "excerpt": "ইউআরএল, কোয়েরি প্যারামিটার এবং হেডারের মাধ্যমে এপিআই সংস্করণ নিয়ন্ত্রণ করার এন্টারপ্রাইজ গ্রেড কনফিগারেশন গাইড।",
        "category": "backend",
        "tags": [
            "APIVersioning",
            "ASPNETCore",
            "REST",
            "Routing",
            "WebAPI"
        ],
        "date": "Jul 07, 2026",
        "readTime": "8 min",
        "icon": "fas fa-code-branch",
        "thumbnail": "posts/api-versioning-aspnet-core/thumbnail.png",
        "featured": false
    },
    {
        "id": 33,
        "slug": "validation-with-fluentvalidation",
        "title": "Validation with FluentValidation: মডেল ভ্যালিডেশনের স্মার্ট উপায়",
        "excerpt": "ডেক্লারেティブ ভ্যালিডেশন রুলস ডিজাইন করে এপিআই ইনপুট স্যানিটাইজেশন এবং টেস্টেবল মডেল আর্কিটেকচার গাইড।",
        "category": "backend",
        "tags": [
            "FluentValidation",
            "Validation",
            "ASPNETCore",
            "CleanCode",
            "DTOs"
        ],
        "date": "Jul 07, 2026",
        "readTime": "8 min",
        "icon": "fas fa-clipboard-check",
        "thumbnail": "posts/validation-with-fluentvalidation/thumbnail.png",
        "featured": false
    },
    {
        "id": 34,
        "slug": "signalr-real-time-applications",
        "title": "SignalR Real-time Applications: দ্বিমুখী যোগাযোগের আধুনিক গাইড",
        "excerpt": "SignalR এর বিভিন্ন ট্রান্সপোর্ট (WebSocket, SSE, Long Polling) মেকানিজম এবং লাইভ পুশ নোটিফিকেশন ক্লায়েন্ট হাব তৈরির কোড।",
        "category": "backend",
        "tags": [
            "SignalR",
            "WebSockets",
            "RealTime",
            "ASPNETCore",
            "ChatApp"
        ],
        "date": "Jul 07, 2026",
        "readTime": "10 min",
        "icon": "fas fa-tower-broadcast",
        "thumbnail": "posts/signalr-real-time-applications/thumbnail.png",
        "featured": false
    },
    {
        "id": 35,
        "slug": "microservices-vs-monolith",
        "title": "Microservices vs Monolith: কোনটি আপনার প্রজেক্টের জন্য সঠিক?",
        "excerpt": "Monolith থেকে Microservices-এ যাওয়ার সঠিক সময় কখন? বাস্তব ট্রেড-অফ, ডিপ্লয়মেন্ট কমপ্লেক্সিটি এবং কখন Monolith-ই যথেষ্ট — এই সব নিয়ে বিশেষজ্ঞ দৃষ্টিকোণ থেকে বিশ্লেষণ।",
        "category": "architecture",
        "tags": ["Microservices", "Monolith", "SystemDesign", "Architecture", "CloudNative"],
        "date": "Jul 07, 2026",
        "readTime": "11 min",
        "icon": "fas fa-cubes",
        "thumbnail": "posts/microservices-vs-monolith/thumbnail.png",
        "featured": false
    },
    {
        "id": 36,
        "slug": "api-gateway-explained",
        "title": "API Gateway Explained: মাইক্রোসার্ভিসের প্রবেশদ্বার",
        "excerpt": "API Gateway কেন দরকার, কীভাবে কাজ করে এবং Authentication, Rate Limiting, Routing, Load Balancing একসাথে কীভাবে পরিচালনা করা যায় তার বিস্তারিত ব্যাখ্যা।",
        "category": "architecture",
        "tags": ["APIGateway", "Microservices", "Routing", "LoadBalancing", "SystemDesign"],
        "date": "Jul 07, 2026",
        "readTime": "9 min",
        "icon": "fas fa-network-wired",
        "thumbnail": "posts/api-gateway-explained/thumbnail.png",
        "featured": false
    },
    {
        "id": 37,
        "slug": "rabbitmq-complete-guide",
        "title": "RabbitMQ Complete Guide: মেসেজ ব্রোকারের পরিপূর্ণ গাইড",
        "excerpt": "Exchange, Queue, Binding এর মূল ধারণা থেকে শুরু করে Dead Letter Queue, Message Durability এবং .NET-এ RabbitMQ Consumer তৈরির হাতে-কলমে গাইড।",
        "category": "backend",
        "tags": ["RabbitMQ", "MessageBroker", "AMQP", "Queuing", "AsyncMessaging"],
        "date": "Jul 07, 2026",
        "readTime": "13 min",
        "icon": "fas fa-comments",
        "thumbnail": "posts/rabbitmq-complete-guide/thumbnail.png",
        "featured": false
    },
    {
        "id": 38,
        "slug": "masstransit-aspnet-core",
        "title": "MassTransit in ASP.NET Core: মেসেজিং অ্যাবস্ট্র্যাকশনের সেরা লাইব্রেরি",
        "excerpt": "RabbitMQ বা Azure Service Bus-এর উপরে MassTransit-এর শক্তিশালী অ্যাবস্ট্র্যাকশন লেয়ার ব্যবহার করে Consumer, Saga এবং Request/Response প্যাটার্ন ইমপ্লিমেন্টেশন।",
        "category": "backend",
        "tags": ["MassTransit", "RabbitMQ", "ASPNETCore", "Messaging", "Consumer"],
        "date": "Jul 07, 2026",
        "readTime": "11 min",
        "icon": "fas fa-shuffle",
        "thumbnail": "posts/masstransit-aspnet-core/thumbnail.png",
        "featured": false
    },
    {
        "id": 39,
        "slug": "saga-pattern-microservices",
        "title": "Saga Pattern: ডিস্ট্রিবিউটেড ট্রানজেকশনের আধুনিক সমাধান",
        "excerpt": "Choreography এবং Orchestration — দুটি Saga ইমপ্লিমেন্টেশন পদ্ধতির পার্থক্য এবং MassTransit Saga State Machine দিয়ে Order Processing বাস্তবায়নের কোড।",
        "category": "architecture",
        "tags": ["SagaPattern", "Microservices", "DistributedTransactions", "MassTransit", "CQRS"],
        "date": "Jul 07, 2026",
        "readTime": "12 min",
        "icon": "fas fa-diagram-project",
        "thumbnail": "posts/saga-pattern-microservices/thumbnail.png",
        "featured": false
    },
    {
        "id": 40,
        "slug": "event-driven-architecture",
        "title": "Event-Driven Architecture: ইভেন্ট দিয়ে সার্ভিস কানেক্ট করার দর্শন",
        "excerpt": "Event Sourcing, Event Bus এবং Domain Events-এর মধ্যে পার্থক্য এবং কীভাবে ঢিলেঢালা সংযুক্ত (Loosely Coupled) ব্যাকএন্ড সিস্টেম ডিজাইন করতে হয়।",
        "category": "architecture",
        "tags": ["EventDriven", "DomainEvents", "EventSourcing", "Microservices", "Architecture"],
        "date": "Jul 07, 2026",
        "readTime": "10 min",
        "icon": "fas fa-bolt",
        "thumbnail": "posts/event-driven-architecture/thumbnail.png",
        "featured": false
    },
    {
        "id": 41,
        "slug": "outbox-pattern-dotnet",
        "title": "Outbox Pattern: মেসেজ না হারানোর নির্ভরযোগ্য কৌশল",
        "excerpt": "ডাটাবেজ ট্রানজেকশন এবং মেসেজ পাবলিশিং একসাথে অ্যাটমিকভাবে নিশ্চিত করতে Outbox Pattern এবং .NET-এ Hangfire বা MassTransit দিয়ে এর ইমপ্লিমেন্টেশন।",
        "category": "architecture",
        "tags": ["OutboxPattern", "AtomicOperations", "Reliability", "MassTransit", "DotNet"],
        "date": "Jul 07, 2026",
        "readTime": "10 min",
        "icon": "fas fa-inbox",
        "thumbnail": "posts/outbox-pattern-dotnet/thumbnail.png",
        "featured": false
    },
    {
        "id": 42,
        "slug": "distributed-transactions",
        "title": "Distributed Transactions: ডিস্ট্রিবিউটেড সিস্টেমে ডেটা সামঞ্জস্যের চ্যালেঞ্জ",
        "excerpt": "2PC (Two-Phase Commit) কেন প্রোডাকশনে বিপজ্জনক এবং Eventual Consistency, Saga ও Compensating Transactions দিয়ে কীভাবে ব্যবহারিক সমাধান করা যায়।",
        "category": "architecture",
        "tags": ["DistributedTransactions", "2PC", "EventualConsistency", "Saga", "CAP"],
        "date": "Jul 07, 2026",
        "readTime": "12 min",
        "icon": "fas fa-database",
        "thumbnail": "posts/distributed-transactions/thumbnail.png",
        "featured": false
    },
    {
        "id": 43,
        "slug": "service-discovery-microservices",
        "title": "Service Discovery: মাইক্রোসার্ভিস একে অপরকে কীভাবে খোঁজে?",
        "excerpt": "Client-Side Discovery, Server-Side Discovery এবং Consul বা Kubernetes DNS দিয়ে সার্ভিস রেজিস্ট্রি ও হেলথচেক সেটআপের ব্যবহারিক গাইড।",
        "category": "devops",
        "tags": ["ServiceDiscovery", "Consul", "Kubernetes", "Microservices", "LoadBalancing"],
        "date": "Jul 07, 2026",
        "readTime": "9 min",
        "icon": "fas fa-magnifying-glass-location",
        "thumbnail": "posts/service-discovery-microservices/thumbnail.png",
        "featured": false
    },
    {
        "id": 44,
        "slug": "circuit-breaker-pattern",
        "title": "Circuit Breaker Pattern: ডাউনস্ট্রিম ব্যর্থতা থেকে সার্ভিস রক্ষার কৌশল",
        "excerpt": "Closed, Open এবং Half-Open — তিনটি স্টেটের Circuit Breaker কীভাবে কাসকেড ফেইলার ঠেকায় এবং Polly লাইব্রেরি দিয়ে .NET-এ Retry, Timeout ও Circuit Breaker পলিসি তৈরির কোড।",
        "category": "backend",
        "tags": ["CircuitBreaker", "Polly", "Resilience", "Microservices", "FaultTolerance"],
        "date": "Jul 07, 2026",
        "readTime": "10 min",
        "icon": "fas fa-circle-half-stroke",
        "thumbnail": "posts/circuit-breaker-pattern/thumbnail.png",
        "featured": false
    },
    {
        "id": 45,
        "slug": "sdlc-vs-stlc",
        "title": "SDLC vs STLC: সফটওয়্যার ডেভেলপমেন্ট ও টেস্টিং লাইফসাইকেলের মূল পার্থক্য",
        "excerpt": "Software Development Life Cycle এবং Software Testing Life Cycle — দুটো আলাদা প্রক্রিয়া যেগুলো একসাথে কাজ করে। কোথায় মিল, কোথায় ভেদ এবং কীভাবে একটি আরেকটিকে সাপোর্ট করে সে নিয়ে বিস্তারিত।",
        "category": "sqa",
        "tags": ["SDLC", "STLC", "SoftwareTesting", "QA", "SQA"],
        "date": "Jul 07, 2026",
        "readTime": "9 min",
        "icon": "fas fa-rotate",
        "thumbnail": "posts/sdlc-vs-stlc/thumbnail.png",
        "featured": false
    },
    {
        "id": 46,
        "slug": "software-testing-life-cycle",
        "title": "Software Testing Life Cycle (STLC): টেস্টিংয়ের প্রতিটি ধাপ বিস্তারিত",
        "excerpt": "Requirement Analysis থেকে Test Closure পর্যন্ত STLC-এর ৬টি ধাপ, প্রতিটিতে কী করণীয়, কী ডেলিভারেবল তৈরি হয় এবং Entry-Exit Criteria কীভাবে নির্ধারণ করা হয়।",
        "category": "sqa",
        "tags": ["STLC", "TestingPhases", "QA", "SQA", "TestPlanning"],
        "date": "Jul 07, 2026",
        "readTime": "10 min",
        "icon": "fas fa-list-check",
        "thumbnail": "posts/software-testing-life-cycle/thumbnail.png",
        "featured": false
    },
    {
        "id": 47,
        "slug": "test-plan-guide",
        "title": "Test Plan: একটি কার্যকর টেস্ট পরিকল্পনা তৈরির সম্পূর্ণ গাইড",
        "excerpt": "Test Plan কী, কেন দরকার এবং IEEE 829 স্ট্যান্ডার্ড অনুযায়ী Scope, Objectives, Resources, Schedule ও Risk Analysis সহ একটি পূর্ণাঙ্গ Test Plan ডকুমেন্ট কীভাবে তৈরি করবেন।",
        "category": "sqa",
        "tags": ["TestPlan", "QA", "SQA", "IEEE829", "TestManagement"],
        "date": "Jul 07, 2026",
        "readTime": "11 min",
        "icon": "fas fa-file-contract",
        "thumbnail": "posts/test-plan-guide/thumbnail.png",
        "featured": false
    },
    {
        "id": 48,
        "slug": "test-strategy-guide",
        "title": "Test Strategy: সামগ্রিক টেস্টিং পদ্ধতির উচ্চ-স্তরের পরিকল্পনা",
        "excerpt": "Test Strategy এবং Test Plan-এর পার্থক্য কী? Risk-Based, Reactive এবং Analytical স্ট্র্যাটেজি পদ্ধতিগুলো কীভাবে আলাদা এবং একটি QA টিম কীভাবে সঠিক স্ট্র্যাটেজি বেছে নেয়।",
        "category": "sqa",
        "tags": ["TestStrategy", "QA", "SQA", "RiskBased", "TestManagement"],
        "date": "Jul 07, 2026",
        "readTime": "9 min",
        "icon": "fas fa-chess",
        "thumbnail": "posts/test-strategy-guide/thumbnail.png",
        "featured": false
    },
    {
        "id": 49,
        "slug": "test-case-writing",
        "title": "Test Case Writing: ত্রুটিহীন টেস্ট কেস লেখার কৌশল ও কাঠামো",
        "excerpt": "Test Case ID, Preconditions, Test Steps, Expected Result, Actual Result — প্রতিটি উপাদানের ভূমিকা এবং Positive, Negative ও Boundary Value Test Case লেখার বাস্তব উদাহরণ।",
        "category": "sqa",
        "tags": ["TestCase", "QA", "SQA", "BoundaryValue", "ManualTesting"],
        "date": "Jul 07, 2026",
        "readTime": "10 min",
        "icon": "fas fa-pencil",
        "thumbnail": "posts/test-case-writing/thumbnail.png",
        "featured": false
    },
    {
        "id": 50,
        "slug": "bug-life-cycle",
        "title": "Bug Life Cycle: একটি বাগের জন্ম থেকে মৃত্যু পর্যন্ত",
        "excerpt": "New, Assigned, Open, Fixed, Retest, Verified, Closed, Reopened — বাগের প্রতিটি স্টেটের অর্থ, কখন কোন স্টেটে যাবে এবং Defect Management-এ কমন ভুলগুলো কী।",
        "category": "sqa",
        "tags": ["BugLifeCycle", "Defect", "QA", "SQA", "BugTracking"],
        "date": "Jul 07, 2026",
        "readTime": "8 min",
        "icon": "fas fa-bug",
        "thumbnail": "posts/bug-life-cycle/thumbnail.png",
        "featured": false
    },
    {
        "id": 51,
        "slug": "severity-vs-priority",
        "title": "Severity vs Priority: বাগের গুরুত্ব নির্ধারণের সঠিক পদ্ধতি",
        "excerpt": "Severity মানে বাগের প্রযুক্তিগত প্রভাব, Priority মানে ব্যবসায়িক জরুরিতা — দুটো ভিন্ন বিষয়। High Severity কিন্তু Low Priority বা Low Severity কিন্তু High Priority-এর বাস্তব উদাহরণ ও পার্থক্য।",
        "category": "sqa",
        "tags": ["Severity", "Priority", "BugTriage", "QA", "SQA"],
        "date": "Jul 07, 2026",
        "readTime": "8 min",
        "icon": "fas fa-triangle-exclamation",
        "thumbnail": "posts/severity-vs-priority/thumbnail.png",
        "featured": false
    },
    {
        "id": 52,
        "slug": "regression-testing",
        "title": "Regression Testing: নতুন পরিবর্তন পুরনো ফিচার ভাঙেনি তো?",
        "excerpt": "Regression Testing কী, কখন চালাতে হয়, Full Regression বনাম Partial Regression-এর পার্থক্য এবং Automation দিয়ে Regression Suite তৈরির কার্যকর পদ্ধতি।",
        "category": "sqa",
        "tags": ["RegressionTesting", "QA", "SQA", "TestAutomation", "CI"],
        "date": "Jul 07, 2026",
        "readTime": "9 min",
        "icon": "fas fa-arrows-rotate",
        "thumbnail": "posts/regression-testing/thumbnail.png",
        "featured": false
    },
    {
        "id": 53,
        "slug": "smoke-vs-sanity-testing",
        "title": "Smoke vs Sanity Testing: দুটো কুইক চেকের মধ্যে পার্থক্য",
        "excerpt": "Smoke Testing মানে 'Build কি চালু হয়?' এবং Sanity Testing মানে 'নির্দিষ্ট ফিচার কি ঠিক আছে?' — কখন কোনটি করবেন, কোনটি Regression-এর আগে আসে এবং কোনটি Build Acceptance Test।",
        "category": "sqa",
        "tags": ["SmokeTesting", "SanityTesting", "QA", "SQA", "BuildVerification"],
        "date": "Jul 07, 2026",
        "readTime": "7 min",
        "icon": "fas fa-flask-vial",
        "thumbnail": "posts/smoke-vs-sanity-testing/thumbnail.png",
        "featured": false
    },
    {
        "id": 54,
        "slug": "exploratory-testing",
        "title": "Exploratory Testing: স্ক্রিপ্ট ছাড়া বাগ খোঁজার শিল্প",
        "excerpt": "Test Case না লিখে অভিজ্ঞতা ও কৌতূহল দিয়ে সফটওয়্যার পরীক্ষা করার পদ্ধতি। Session-Based Testing, Charter তৈরি এবং Exploratory Testing কখন সবচেয়ে কার্যকর তা নিয়ে বিস্তারিত।",
        "category": "sqa",
        "tags": ["ExploratoryTesting", "SessionBased", "QA", "SQA", "ManualTesting"],
        "date": "Jul 07, 2026",
        "readTime": "9 min",
        "icon": "fas fa-magnifying-glass",
        "thumbnail": "posts/exploratory-testing/thumbnail.png",
        "featured": false
    },
    {
        "id": 55,
        "slug": "login-api-test-cases",
        "title": "Login API Test Cases: সম্পূর্ণ Authentication Testing গাইড",
        "excerpt": "Valid login, invalid password, account lockout, JWT token validation, Remember Me — একটি Login API-কে সব কোণ থেকে পরীক্ষা করার বিস্তারিত Test Case তালিকা।",
        "category": "sqa",
        "tags": ["APITesting", "LoginAPI", "Authentication", "JWT", "QA"],
        "date": "Jul 07, 2026",
        "readTime": "10 min",
        "icon": "fas fa-key",
        "thumbnail": "posts/login-api-test-cases/thumbnail.png",
        "featured": false
    },
    {
        "id": 56,
        "slug": "registration-api-test-cases",
        "title": "Registration API Test Cases: ইউজার সাইনআপ ফ্লো টেস্টিং গাইড",
        "excerpt": "Duplicate email, weak password, missing required fields, email verification, SQL Injection — Registration API টেস্টিংয়ের সব গুরুত্বপূর্ণ Positive ও Negative Test Case।",
        "category": "sqa",
        "tags": ["APITesting", "RegistrationAPI", "Validation", "Security", "QA"],
        "date": "Jul 07, 2026",
        "readTime": "10 min",
        "icon": "fas fa-user-plus",
        "thumbnail": "posts/registration-api-test-cases/thumbnail.png",
        "featured": false
    },
    {
        "id": 57,
        "slug": "payment-api-testing",
        "title": "Payment API Testing: লেনদেন যাচাইয়ের সম্পূর্ণ কৌশল",
        "excerpt": "Successful payment, insufficient balance, gateway timeout, duplicate transaction, refund flow — Payment API-এর প্রতিটি সংকটজনক পরিস্থিতি কীভাবে টেস্ট করবেন।",
        "category": "sqa",
        "tags": ["APITesting", "PaymentAPI", "FinTech", "GatewayTesting", "QA"],
        "date": "Jul 07, 2026",
        "readTime": "12 min",
        "icon": "fas fa-credit-card",
        "thumbnail": "posts/payment-api-testing/thumbnail.png",
        "featured": false
    },
    {
        "id": 58,
        "slug": "otp-api-testing",
        "title": "OTP API Testing: এককালীন পাসওয়ার্ড টেস্টিংয়ের সম্পূর্ণ গাইড",
        "excerpt": "OTP generation, expiry time, resend limit, brute force prevention, wrong OTP handling — OTP API-এর প্রতিটি edge case টেস্ট করার বিস্তারিত Test Case।",
        "category": "sqa",
        "tags": ["APITesting", "OTP", "Security", "2FA", "QA"],
        "date": "Jul 07, 2026",
        "readTime": "9 min",
        "icon": "fas fa-mobile-screen",
        "thumbnail": "posts/otp-api-testing/thumbnail.png",
        "featured": false
    },
    {
        "id": 59,
        "slug": "file-upload-api-testing",
        "title": "File Upload API Testing: ফাইল আপলোড ফিচারের নির্ভরযোগ্য পরীক্ষা",
        "excerpt": "Valid file, oversized file, unsupported format, empty file, malicious file upload — File Upload API-এর প্রতিটি ঝুঁকিপূর্ণ পরিস্থিতি এবং Security Test Case।",
        "category": "sqa",
        "tags": ["APITesting", "FileUpload", "Security", "Validation", "QA"],
        "date": "Jul 07, 2026",
        "readTime": "9 min",
        "icon": "fas fa-file-arrow-up",
        "thumbnail": "posts/file-upload-api-testing/thumbnail.png",
        "featured": false
    },
    {
        "id": 60,
        "slug": "search-api-testing",
        "title": "Search API Testing: সার্চ ফিচারের সব কোণ থেকে পরীক্ষা",
        "excerpt": "Exact match, partial match, case sensitivity, special characters, empty query, no results — Search API-এর Functional এবং Performance দুটো দিক থেকে পূর্ণাঙ্গ Test Case।",
        "category": "sqa",
        "tags": ["APITesting", "SearchAPI", "Performance", "Validation", "QA"],
        "date": "Jul 07, 2026",
        "readTime": "8 min",
        "icon": "fas fa-magnifying-glass",
        "thumbnail": "posts/search-api-testing/thumbnail.png",
        "featured": false
    },
    {
        "id": 61,
        "slug": "pagination-testing",
        "title": "Pagination Testing: পেজিনেশন API-এর সম্পূর্ণ পরীক্ষা গাইড",
        "excerpt": "First page, last page, beyond last page, negative page number, page size boundary — Pagination API টেস্টিংয়ে কোনো edge case মিস না করার জন্য সম্পূর্ণ চেকলিস্ট।",
        "category": "sqa",
        "tags": ["APITesting", "Pagination", "BoundaryValue", "QA", "SQA"],
        "date": "Jul 07, 2026",
        "readTime": "8 min",
        "icon": "fas fa-table-list",
        "thumbnail": "posts/pagination-testing/thumbnail.png",
        "featured": false
    },
    {
        "id": 62,
        "slug": "filtering-testing",
        "title": "Filtering Testing: API Filter প্যারামিটারের নির্ভুল পরীক্ষা",
        "excerpt": "Single filter, multiple filters, invalid filter value, case-insensitive filter — API Filtering-এর Functional এবং Boundary Test Case এবং কীভাবে Filter Response যাচাই করবেন।",
        "category": "sqa",
        "tags": ["APITesting", "Filtering", "QueryParams", "QA", "SQA"],
        "date": "Jul 07, 2026",
        "readTime": "8 min",
        "icon": "fas fa-filter",
        "thumbnail": "posts/filtering-testing/thumbnail.png",
        "featured": false
    },
    {
        "id": 63,
        "slug": "sorting-testing",
        "title": "Sorting Testing: API Data Sorting-এর নির্ভরযোগ্য যাচাই পদ্ধতি",
        "excerpt": "Ascending, descending, invalid sort field, multi-column sort, sort with filter combination — Sorting API-এর প্রতিটি পরিস্থিতি এবং Data Integrity যাচাইয়ের Test Case।",
        "category": "sqa",
        "tags": ["APITesting", "Sorting", "DataIntegrity", "QA", "SQA"],
        "date": "Jul 07, 2026",
        "readTime": "8 min",
        "icon": "fas fa-arrow-up-wide-short",
        "thumbnail": "posts/sorting-testing/thumbnail.png",
        "featured": false
    },
    {
        "id": 64,
        "slug": "report-download-testing",
        "title": "Report Download Testing: রিপোর্ট ডাউনলোড API-এর সম্পূর্ণ পরীক্ষা",
        "excerpt": "PDF/Excel generation, large data export, date range filter, empty report, concurrent download — Report Download API-এর Functional, Performance এবং Boundary Test Case।",
        "category": "sqa",
        "tags": ["APITesting", "ReportExport", "PDF", "Excel", "QA"],
        "date": "Jul 07, 2026",
        "readTime": "10 min",
        "icon": "fas fa-file-export",
        "thumbnail": "posts/report-download-testing/thumbnail.png",
        "featured": false
    }
];
