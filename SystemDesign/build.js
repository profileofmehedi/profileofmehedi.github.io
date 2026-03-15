const fs = require('fs');
const path = require('path');
const https = require('https');

const rootDir = __dirname;
const dirs = ['css', 'js', 'svg/diagrams', 'pages', 'interview', 'fonts'];
dirs.forEach(d => fs.mkdirSync(path.join(rootDir, d), { recursive: true }));

// Download Font
const fontUrl = 'https://raw.githubusercontent.com/hasan08/bengali-fonts/master/Kalpurush.ttf';
const fontPath = path.join(rootDir, 'fonts', 'kalpurush.ttf');
if (!fs.existsSync(fontPath)) {
    https.get(fontUrl, (res) => {
        const fileStream = fs.createWriteStream(fontPath);
        res.pipe(fileStream);
    }).on('error', (err) => {
        console.error('Error downloading font:', err);
    });
}

const sections = [
    {
        title: "Introduction",
        folder: "pages",
        pages: [
            { file: "01-introduction.html", title: "Introduction" },
            { file: "02-what-is-system-design.html", title: "What is System Design?" },
            { file: "03-client-server.html", title: "Client-Server Model" },
            { file: "04-latency-vs-throughput.html", title: "Latency vs Throughput" }
        ]
    },
    {
        title: "Fundamentals",
        folder: "pages",
        pages: [
            { file: "05-availability.html", title: "High Availability" },
            { file: "06-cap-theorem.html", title: "CAP Theorem" },
            { file: "07-load-balancer.html", title: "Load Balancer" },
            { file: "08-caching.html", title: "Caching" }
        ]
    },
    {
        title: "Data Management",
        folder: "pages",
        pages: [
            { file: "09-database-sharding.html", title: "Database Sharding" },
            { file: "10-replication.html", title: "Database Replication" },
            { file: "11-cdn.html", title: "Content Delivery Network (CDN)" },
            { file: "12-message-queue.html", title: "Message Queue" }
        ]
    },
    {
        title: "Architecture Patterns",
        folder: "pages",
        pages: [
            { file: "13-microservices.html", title: "Microservices" },
            { file: "14-monolith.html", title: "Monolith" },
            { file: "15-api-gateway.html", title: "API Gateway" },
            { file: "16-rate-limiting.html", title: "Rate Limiting" }
        ]
    },
    {
        title: "Advanced Topics",
        folder: "pages",
        pages: [
            { file: "17-consistent-hashing.html", title: "Consistent Hashing" },
            { file: "18-distributed-lock.html", title: "Distributed Lock" },
            { file: "19-search-system.html", title: "Search System" },
            { file: "20-real-time-system.html", title: "Real-time System" },
            { file: "21-notification-system.html", title: "Notification System" },
            { file: "22-url-shortener.html", title: "URL Shortener" },
            { file: "23-chat-system.html", title: "Chat System" },
            { file: "24-video-streaming-system.html", title: "Video Streaming" },
            { file: "25-ride-sharing-system.html", title: "Ride Sharing System" },
            { file: "26-payment-system.html", title: "Payment System" },
            { file: "27-news-feed-system.html", title: "News Feed System" },
            { file: "28-recommendation-system.html", title: "Recommendation System" },
            { file: "29-file-storage-system.html", title: "File Storage System" },
            { file: "30-logging-system.html", title: "Logging System" },
            { file: "31-monitoring-system.html", title: "Monitoring System" },
            { file: "32-circuit-breaker.html", title: "Circuit Breaker" },
            { file: "33-event-driven-architecture.html", title: "Event Driven Arch" },
            { file: "34-kafka-system.html", title: "Kafka System" },
            { file: "35-data-pipeline.html", title: "Data Pipeline" },
            { file: "36-map-reduce.html", title: "Map Reduce" },
            { file: "37-batch-processing.html", title: "Batch Processing" },
            { file: "38-stream-processing.html", title: "Stream Processing" },
            { file: "39-indexing.html", title: "Database Indexing" },
            { file: "40-system-design-best-practices.html", title: "Best Practices" }
        ]
    },
    {
        title: "Interview Questions",
        folder: "interview",
        pages: [] // We will dynamically add 50 questions
    }
];

const interviewTopics = [
    "Design Twitter", "Design Facebook News Feed", "Design WhatsApp", "Design URL Shortener",
    "Design Uber", "Design Instagram", "Design YouTube", "Design Distributed Cache",
    "Design Payment System", "Design Notification System", "Design Search Engine",
    "Design Google Docs", "Design Netflix", "Design Dropbox", "Design Rate Limiter",
    "Design Ticketmaster", "Design Amazon E-commerce", "Design Tinder", "Design Google Maps",
    "Design Zoom", "Design Slack", "Design Discord", "Design Key-Value Store",
    "Design Web Crawler", "Design API Rate Limiter", "Design Yelp", "Design Pastebin",
    "Design Online Code Editor", "Design Hotel Booking System", "Design Parking Lot",
    "Design Elevator System", "Design Vending Machine", "Design Library Management",
    "Design Chess Game", "Design Tic Tac Toe", "Design ATM", "Design Blackjack",
    "Design Online Shopping", "Design Email System (Gmail)", "Design Redis",
    "Design Cassandra", "Design Zookeeper", "Design Distributed Job Scheduler",
    "Design Ad Click Event Aggregation", "Design Metrics Collection System",
    "Design Location Based Service", "Design Stock Exchange", "Design Leaderboard",
    "Design Collaborative Whiteboard", "Design Flight Booking System"
];

interviewTopics.forEach((topic, index) => {
    sections[5].pages.push({
        file: `question-${String(index + 1).padStart(2, '0')}.html`,
        title: topic
    });
});

function getSidebarHtml(depth = 1) {
    const rootPath = depth === 0 ? '' : '../';
    let html = '';
    sections.forEach((sec, idx) => {
        const isActive = idx === 0 ? 'active' : ''; // Default open first
        html += `<div class="sidebar-section">
            <div class="sidebar-heading">${sec.title} <span>▼</span></div>
            <ul class="sidebar-links">`;
        sec.pages.forEach(page => {
            const linkPath = (depth === 0) ? `${sec.folder}/${page.file}` : (sec.folder === (depth===1 && 'pages' ? 'pages' : 'interview') ? (depth===1 ? (sec.folder=== 'pages' ? '' : '../interview/') : '') + page.file : `../${sec.folder}/${page.file}`);
            
            // Simplification for path logic:
            let finalHref = '';
            if (depth === 0) {
                finalHref = `${sec.folder}/${page.file}`;
            } else {
                if (sec.folder === 'pages') finalHref = `../pages/${page.file}`;
                else finalHref = `../interview/${page.file}`;
            }

            html += `<li><a href="${finalHref}">${page.title}</a></li>`;
        });
        html += `</ul></div>`;
    });
    return html;
}

function getTemplate(title, content, depth = 1) {
    const rootPath = depth === 0 ? '' : '../';
    return `<!DOCTYPE html>
<html lang="bn">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="${title} - System Design Bangla">
    <title>${title} - System Design Bangla</title>
    <link rel="stylesheet" href="${rootPath}css/style.css">
</head>
<body class="light-mode">
    <div id="progress-bar"></div>
    <header class="topbar">
        <div class="logo">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
            System Design Bangla
        </div>
        <div class="search-box">
            <input type="text" placeholder="Topics খুঁজুন...">
        </div>
        <div class="actions">
            <button id="theme-toggle">🌙</button>
            <a href="https://github.com/profileofmehedi" class="github-btn" target="_blank">GitHub</a>
            <button id="mobile-menu-btn">☰</button>
        </div>
    </header>
    <div class="app-container">
        <aside class="sidebar" id="sidebar">
            ${getSidebarHtml(depth)}
        </aside>
        <main class="main-content">
            <div class="content-box">
                ${content}
            </div>
        </main>
    </div>
    <script src="${rootPath}js/app.js"></script>
</body>
</html>`;
}

const svgSnippets = {
    loadBalancer: `
        <div class="diagram-container">
            <svg viewBox="0 0 600 300" xmlns="http://www.w3.org/2000/svg">
                <!-- Users -->
                <circle cx="50" cy="150" r="20" fill="var(--primary)" class="anim-pulse"/>
                <text x="50" y="190" text-anchor="middle" fill="var(--text)">Users</text>
                
                <!-- Load Balancer -->
                <rect x="250" y="110" width="100" height="80" rx="10" fill="var(--accent)" />
                <text x="300" y="155" text-anchor="middle" fill="#fff" font-weight="bold">Load Balancer</text>
                
                <!-- Servers -->
                <rect x="500" y="40" width="80" height="60" rx="5" fill="var(--secondary)" />
                <text x="540" y="75" text-anchor="middle" fill="#fff">Server 1</text>
                
                <rect x="500" y="120" width="80" height="60" rx="5" fill="var(--secondary)" />
                <text x="540" y="155" text-anchor="middle" fill="#fff">Server 2</text>
                
                <rect x="500" y="200" width="80" height="60" rx="5" fill="var(--secondary)" />
                <text x="540" y="235" text-anchor="middle" fill="#fff">Server 3</text>
                
                <!-- Lines -->
                <path d="M 80 150 L 240 150" stroke="var(--primary)" stroke-width="3" fill="none" class="anim-path"/>
                <path d="M 360 140 L 490 70" stroke="var(--accent)" stroke-width="3" fill="none" class="anim-path"/>
                <path d="M 360 150 L 490 150" stroke="var(--accent)" stroke-width="3" fill="none" class="anim-path"/>
                <path d="M 360 160 L 490 230" stroke="var(--accent)" stroke-width="3" fill="none" class="anim-path"/>
            </svg>
        </div>
    `,
    caching: `
        <div class="diagram-container">
            <svg viewBox="0 0 600 250" xmlns="http://www.w3.org/2000/svg">
                <rect x="50" y="100" width="80" height="60" rx="5" fill="var(--primary)" />
                <text x="90" y="135" text-anchor="middle" fill="#fff">Server</text>
                
                <rect x="260" y="40" width="80" height="60" rx="5" fill="var(--accent)" class="anim-pulse" />
                <text x="300" y="75" text-anchor="middle" fill="#fff">Cache (Redis)</text>
                
                <rect x="470" y="100" width="80" height="80" rx="5" fill="var(--secondary)" />
                <text x="510" y="145" text-anchor="middle" fill="#fff">Database</text>
                
                <path d="M 140 120 L 250 80" stroke="var(--primary)" stroke-width="3" fill="none" class="anim-path"/>
                <text x="195" y="90" fill="var(--text)" font-size="12">1. Check Cache</text>
                
                <path d="M 350 80 L 460 120" stroke="var(--accent)" stroke-width="3" fill="none" class="anim-path"/>
                <text x="405" y="90" fill="var(--text)" font-size="12">2. If Miss, DB</text>
                
                <path d="M 140 140 L 460 140" stroke="var(--secondary)" stroke-width="2" stroke-dasharray="5,5" fill="none"/>
                <text x="300" y="160" text-anchor="middle" fill="var(--text)" font-size="12">Direct DB query (Cache Miss)</text>
            </svg>
        </div>
    `,
    databaseReplication: `
        <div class="diagram-container">
            <svg viewBox="0 0 600 300" xmlns="http://www.w3.org/2000/svg">
                <!-- Master DB -->
                <rect x="250" y="40" width="100" height="80" rx="10" fill="var(--primary)" class="anim-pulse" />
                <text x="300" y="85" text-anchor="middle" fill="#fff" font-weight="bold">Master DB</text>
                <text x="300" y="105" text-anchor="middle" fill="#fff" font-size="12">(Writes)</text>

                <!-- Slave DB 1 -->
                <rect x="100" y="200" width="100" height="80" rx="10" fill="var(--secondary)" />
                <text x="150" y="245" text-anchor="middle" fill="#fff" font-weight="bold">Slave DB 1</text>
                <text x="150" y="265" text-anchor="middle" fill="#fff" font-size="12">(Reads)</text>

                <!-- Slave DB 2 -->
                <rect x="400" y="200" width="100" height="80" rx="10" fill="var(--secondary)" />
                <text x="450" y="245" text-anchor="middle" fill="#fff" font-weight="bold">Slave DB 2</text>
                <text x="450" y="265" text-anchor="middle" fill="#fff" font-size="12">(Reads)</text>

                <!-- Lines -->
                <path d="M 280 130 L 170 190" stroke="var(--accent)" stroke-width="3" fill="none" class="anim-path"/>
                <text x="210" y="150" fill="var(--text)" font-size="12">Async Sync</text>
                
                <path d="M 320 130 L 430 190" stroke="var(--accent)" stroke-width="3" fill="none" class="anim-path"/>
                <text x="390" y="150" fill="var(--text)" font-size="12">Async Sync</text>
            </svg>
        </div>
    `,
    generic: `
        <div class="diagram-container">
            <svg viewBox="0 0 600 200" xmlns="http://www.w3.org/2000/svg">
                <rect x="100" y="60" width="120" height="80" rx="8" fill="var(--primary)" class="anim-pulse" />
                <text x="160" y="105" text-anchor="middle" fill="#fff" font-weight="bold">Component A</text>
                
                <rect x="380" y="60" width="120" height="80" rx="8" fill="var(--secondary)" />
                <text x="440" y="105" text-anchor="middle" fill="#fff" font-weight="bold">Component B</text>
                
                <path d="M 230 100 L 370 100" stroke="var(--accent)" stroke-width="4" fill="none" class="anim-path"/>
                <polygon points="370,100 360,95 360,105" fill="var(--accent)" />
            </svg>
        </div>
    `
};

function generateContent(title, type) {
    let svg = svgSnippets.generic;
    if (title.toLowerCase().includes('load balancer')) svg = svgSnippets.loadBalancer;
    else if (title.toLowerCase().includes('cach')) svg = svgSnippets.caching;
    else if (title.toLowerCase().includes('replication')) svg = svgSnippets.databaseReplication;

    const baseIntro = type === 'interview' 
        ? `<h2>Problem Statement: ${title}</h2><p>আজকের ইন্টারভিউ প্রশ্নে আমরা শিখবো কিভাবে <strong>${title}</strong> সিস্টেম তৈরি করতে হয়। এটি সিস্টেম ডিজাইন ইন্টারভিউয়ের একটি অন্যতম জনপ্রিয় প্রশ্ন।</p>` 
        : `<h1>${title}</h1><p>সিস্টেম ডিজাইনের এই পর্বে আমরা <strong>${title}</strong> নিয়ে বিস্তারিত আলোচনা করবো।</p>`;

    const story = `
        <div class="story-box">
            "ধরো তুমি একটি ছোট অনলাইন দোকান খুলেছ। শুরুতে তোমার দোকানে দিনে মাত্র ১০-১৫ জন ক্রেতা আসতো। তুমি একাই সব ম্যানেজ করতে পারতে। 
            কিন্তু কিছুদিন পর তোমার দোকানের বিক্রি অনেক বেড়ে গেল। দিনে হাজার হাজার মানুষ আসতে শুরু করল। 
            এখন তুমি একা আর সামলাতে পারছো না। তোমার এখন নতুন লোক লাগবে, দোকানের জায়গা বড় করতে হবে, আর জিনিসপত্র গুছিয়ে রাখার নতুন সিস্টেম করতে হবে।"
        </div>
        <p>সফটওয়্যার ইঞ্জিনিয়ারিংয়ের ক্ষেত্রেও ঠিক একই ঘটনা ঘটে। যখন ইউজার বাড়ে, তখন আমাদের সিস্টেমকে স্কেল করতে হয়। আর এখানেই <strong>${title}</strong>-এর ধারণাটি আসে।</p>
    `;

    const body = `
        <h2>${title} কী? (What is it?)</h2>
        <p>${title} হলো এমন একটি মেকানিজম বা আর্কিটেকচারাল প্যাটার্ন যা ডিস্ট্রিবিউটেড সিস্টেমে পারফরম্যান্স, স্কেলেবিলিটি এবং রিলায়াবিলিটি বাড়াতে সাহায্য করে। বড় বড় কোম্পানি যেমন Facebook, Google বা Amazon তাদের সিস্টেমে এটি ব্যাপকভাবে ব্যবহার করে।</p>
        
        ${svg}

        <h2>কিভাবে কাজ করে? (How it works)</h2>
        <p>এর কাজের ধরন খুব সহজভাবে বুঝতে গেলে কিছু ধাপ মাথায় রাখতে হবে:</p>
        <ol>
            <li>প্রথমে ক্লায়েন্ট থেকে রিকোয়েস্ট আসে।</li>
            <li>সিস্টেম চেক করে যে এই রিকোয়েস্টটি কীভাবে সবচেয়ে দ্রুত প্রসেস করা যায়।</li>
            <li>তারপর উপযুক্ত সার্ভার বা ডেটাবেসে রিকোয়েস্টটি পাঠানো হয়।</li>
            <li>সফলভাবে কাজ শেষ হলে রেসপন্স ইউজারকে ফেরত দেওয়া হয়।</li>
        </ol>

        <h2>সুবিধা (Advantages)</h2>
        <ul>
            <li><strong>High Availability:</strong> সিস্টেম সবসময় সচল থাকে।</li>
            <li><strong>Scalability:</strong> ট্রাফিক বাড়লেও সিস্টেম ক্র্যাশ করে না।</li>
            <li><strong>Better Performance:</strong> ইউজার খুব দ্রুত রেসপন্স পায়।</li>
        </ul>

        <h2>কখন ব্যবহার করবেন? (When to use)</h2>
        <p>যখন আপনার সিস্টেমে প্রচুর পরিমাণ ইউজার থাকবে এবং আপনি চান না যে কোনো একটি কম্পোনেন্ট ফেইল করলে পুরো সিস্টেম ডাউন হয়ে যাক, তখন <strong>${title}</strong> ব্যবহার করা বাধ্যতামূলক।</p>
    `;

    const interviewExtras = `
        <h2>Requirements (শর্তসমূহ)</h2>
        <p>যেকোনো সিস্টেম ডিজাইনের শুরুতে Requirements বুঝে নেওয়া খুব জরুরি।</p>
        <ul>
            <li><strong>Functional:</strong> ইউজার কি কি করতে পারবে? (যেমন: পোস্ট করা, লাইক দেওয়া)</li>
            <li><strong>Non-Functional:</strong> সিস্টেম কতটা ফাস্ট হবে? কতজন ইউজার সামলাতে পারবে? (High Availability, Low Latency)</li>
        </ul>

        <h2>High Level Design (HLD)</h2>
        <p>প্রথমে আমরা একটি বেসিক আর্কিটেকচার দাঁড় করাবো। ক্লায়েন্ট থেকে রিকোয়েস্ট Load Balancer হয়ে Application Server এ যাবে এবং সেখান থেকে Database এ ডেটা সেভ হবে।</p>

        <h2>Trade-offs (ট্রেড-অফ)</h2>
        <p>কোনো সিস্টেমই নিখুঁত নয়। Consistency এবং Availability এর মাঝে ব্যালেন্স করতে হয় (CAP Theorem)।</p>
    `;

    return baseIntro + story + body + (type === 'interview' ? interviewExtras : '');
}

// Generate Index Page
const indexHtml = getTemplate("Home", `
    <h1>System Design বাংলায় শিখুন</h1>
    <div class="story-box">
        "সিস্টেম ডিজাইন শেখাটা অনেকটা একটি বিশাল বিল্ডিং তৈরি করার মতো। প্রথমে ফাউন্ডেশন, তারপর পিলার, তারপর ছাদ। 
        কোথায় কতটুকু রড সিমেন্ট লাগবে তা যেমন একজন ইঞ্জিনিয়ার হিসাব করেন, তেমনি একজন সফটওয়্যার আর্কিটেক্ট ঠিক করেন কোথায় লোড ব্যালেন্সার বসবে, কোথায় ডেটাবেস শার্ডিং হবে।"
    </div>
    <p>এই ওয়েবসাইটে আমরা সম্পূর্ণ বাংলায় গল্পের ছলে সিস্টেম ডিজাইনের কঠিন সব বিষয় খুব সহজে শিখবো। বাম দিকের মেনু থেকে আপনার পছন্দের টপিক বেছে নিন।</p>
    
    <h2>কেন সিস্টেম ডিজাইন শিখবেন?</h2>
    <ul>
        <li>বড় স্কেলের অ্যাপ্লিকেশন (Facebook, YouTube) কিভাবে কাজ করে তা বোঝার জন্য।</li>
        <li>Tech Lead বা Senior Software Engineer হওয়ার জন্য।</li>
        <li>Top Tech Company (FAANG) এর ইন্টারভিউ ক্র্যাক করার জন্য।</li>
    </ul>

    <div class="diagram-container">
        <svg viewBox="0 0 600 200" xmlns="http://www.w3.org/2000/svg">
            <rect x="50" y="80" width="80" height="40" rx="5" fill="var(--primary)" />
            <text x="90" y="105" text-anchor="middle" fill="#fff">Client</text>
            
            <path d="M 130 100 L 230 100" stroke="var(--accent)" stroke-width="3" fill="none" class="anim-path"/>
            
            <circle cx="280" cy="100" r="40" fill="var(--secondary)" class="anim-pulse"/>
            <text x="280" y="105" text-anchor="middle" fill="#fff">API</text>
            
            <path d="M 320 100 L 420 100" stroke="var(--accent)" stroke-width="3" fill="none" class="anim-path"/>
            
            <path d="M 420 60 L 520 60 L 520 140 L 420 140 Z" fill="var(--primary)"/>
            <text x="470" y="105" text-anchor="middle" fill="#fff">DB</text>
        </svg>
    </div>
    
    <h3>কোথা থেকে শুরু করবেন?</h3>
    <p>আপনি যদি নতুন হন, তবে <strong>Introduction</strong> থেকে শুরু করুন। তারপর <strong>Load Balancer</strong>, <strong>Caching</strong> ইত্যাদি শিখুন। এরপর <strong>Interview Questions</strong> অংশে গিয়ে রিয়েল-ওয়ার্ল্ড প্রজেক্টের ডিজাইন দেখুন।</p>
`, 0);

fs.writeFileSync(path.join(rootDir, 'index.html'), indexHtml);

// Generate Pages & Interviews
sections.forEach(sec => {
    if (sec.folder === 'pages' || sec.folder === 'interview') {
        sec.pages.forEach(page => {
            const content = generateContent(page.title, sec.folder);
            const html = getTemplate(page.title, content, 1);
            fs.writeFileSync(path.join(rootDir, sec.folder, page.file), html);
        });
    }
});

console.log("Website generated successfully!");
