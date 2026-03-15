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
        pages: [] 
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
        html += `<div class="sidebar-section">
            <div class="sidebar-heading">${sec.title} <span>▼</span></div>
            <ul class="sidebar-links">`;
        sec.pages.forEach(page => {
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
    clientServer: `
        <div class="diagram-container">
            <svg viewBox="0 0 600 200" xmlns="http://www.w3.org/2000/svg">
                <rect x="50" y="60" width="100" height="80" rx="10" fill="var(--primary)" class="anim-pulse"/>
                <text x="100" y="105" text-anchor="middle" fill="#fff">Client</text>
                <path d="M 160 90 L 440 90" stroke="var(--accent)" stroke-width="3" fill="none" class="anim-path"/>
                <text x="300" y="80" text-anchor="middle" fill="var(--text)" font-size="12">Request</text>
                <path d="M 440 110 L 160 110" stroke="var(--primary)" stroke-width="3" fill="none" class="anim-path"/>
                <text x="300" y="130" text-anchor="middle" fill="var(--text)" font-size="12">Response</text>
                <rect x="450" y="60" width="100" height="80" rx="10" fill="var(--secondary)"/>
                <text x="500" y="105" text-anchor="middle" fill="#fff">Server</text>
            </svg>
        </div>
    `,
    loadBalancer: `
        <div class="diagram-container">
            <svg viewBox="0 0 600 300" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="150" r="20" fill="var(--primary)" class="anim-pulse"/>
                <rect x="250" y="110" width="100" height="80" rx="10" fill="var(--accent)" />
                <text x="300" y="155" text-anchor="middle" fill="#fff" font-weight="bold">LB</text>
                <rect x="480" y="40" width="80" height="50" rx="5" fill="var(--secondary)" />
                <rect x="480" y="125" width="80" height="50" rx="5" fill="var(--secondary)" />
                <rect x="480" y="210" width="80" height="50" rx="5" fill="var(--secondary)" />
                <path d="M 70 150 L 250 150" stroke="var(--primary)" stroke-width="3" fill="none" class="anim-path"/>
                <path d="M 350 130 L 480 70" stroke="var(--accent)" stroke-width="3" fill="none" class="anim-path"/>
                <path d="M 350 150 L 480 150" stroke="var(--accent)" stroke-width="3" fill="none" class="anim-path"/>
                <path d="M 350 170 L 480 230" stroke="var(--accent)" stroke-width="3" fill="none" class="anim-path"/>
            </svg>
        </div>
    `,
    caching: `
        <div class="diagram-container">
            <svg viewBox="0 0 600 250" xmlns="http://www.w3.org/2000/svg">
                <rect x="50" y="100" width="80" height="60" rx="5" fill="var(--primary)" />
                <rect x="260" y="40" width="100" height="60" rx="5" fill="var(--accent)" class="anim-pulse" />
                <text x="310" y="75" text-anchor="middle" fill="#fff">Cache</text>
                <rect x="470" y="100" width="80" height="80" rx="5" fill="var(--secondary)" />
                <text x="510" y="145" text-anchor="middle" fill="#fff">DB</text>
                <path d="M 130 110 L 260 80" stroke="var(--primary)" stroke-width="3" fill="none" class="anim-path"/>
                <path d="M 360 80 L 470 120" stroke="var(--accent)" stroke-width="3" fill="none" class="anim-path"/>
            </svg>
        </div>
    `,
    capTheorem: `
        <div class="diagram-container">
            <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
                <path d="M 200 50 L 50 250 L 350 250 Z" fill="none" stroke="var(--primary)" stroke-width="5" />
                <circle cx="200" cy="50" r="30" fill="var(--accent)" />
                <text x="200" y="20" text-anchor="middle" fill="var(--text)">Consistency</text>
                <circle cx="50" cy="250" r="30" fill="var(--primary)" />
                <text x="50" y="290" text-anchor="middle" fill="var(--text)">Availability</text>
                <circle cx="350" cy="250" r="30" fill="var(--secondary)" />
                <text x="350" y="290" text-anchor="middle" fill="var(--text)">Partition Tolerance</text>
            </svg>
        </div>
    `,
    cdn: `
        <div class="diagram-container">
            <svg viewBox="0 0 600 300" xmlns="http://www.w3.org/2000/svg">
                <circle cx="300" cy="150" r="40" fill="var(--primary)" />
                <text x="300" y="155" text-anchor="middle" fill="#fff">Origin Server</text>
                <circle cx="100" cy="100" r="25" fill="var(--accent)" class="anim-pulse" />
                <text x="100" y="140" text-anchor="middle" fill="var(--text)" font-size="10">Edge Node 1</text>
                <circle cx="500" cy="100" r="25" fill="var(--accent)" class="anim-pulse" />
                <text x="500" y="140" text-anchor="middle" fill="var(--text)" font-size="10">Edge Node 2</text>
                <path d="M 260 130 L 125 105" stroke="var(--primary)" stroke-dasharray="5,5" fill="none" />
                <path d="M 340 130 L 475 105" stroke="var(--primary)" stroke-dasharray="5,5" fill="none" />
            </svg>
        </div>
    `,
    messageQueue: `
        <div class="diagram-container">
            <svg viewBox="0 0 600 200" xmlns="http://www.w3.org/2000/svg">
                <rect x="50" y="70" width="80" height="60" fill="var(--primary)" />
                <text x="90" y="105" text-anchor="middle" fill="#fff">Producer</text>
                <rect x="200" y="70" width="200" height="60" fill="var(--accent)" stroke="var(--text)" />
                <rect x="210" y="80" width="30" height="40" fill="#fff" class="anim-path" />
                <rect x="250" y="80" width="30" height="40" fill="#fff" />
                <rect x="290" y="80" width="30" height="40" fill="#fff" />
                <rect x="470" y="70" width="80" height="60" fill="var(--secondary)" />
                <text x="510" y="105" text-anchor="middle" fill="#fff">Consumer</text>
                <path d="M 130 100 L 200 100" stroke="var(--primary)" stroke-width="3" fill="none" class="anim-path"/>
                <path d="M 400 100 L 470 100" stroke="var(--accent)" stroke-width="3" fill="none" class="anim-path"/>
            </svg>
        </div>
    `,
    microservices: `
        <div class="diagram-container">
            <svg viewBox="0 0 600 250" xmlns="http://www.w3.org/2000/svg">
                <rect x="50" y="50" width="100" height="150" fill="var(--primary)" />
                <text x="100" y="130" text-anchor="middle" fill="#fff">Monolith</text>
                <line x1="200" y1="20" x2="200" y2="230" stroke="var(--border-color)" stroke-width="2" />
                <rect x="250" y="50" width="60" height="60" fill="var(--accent)" />
                <rect x="350" y="50" width="60" height="60" fill="var(--accent)" />
                <rect x="450" y="50" width="60" height="60" fill="var(--accent)" />
                <rect x="250" y="140" width="60" height="60" fill="var(--accent)" />
                <rect x="350" y="140" width="60" height="60" fill="var(--accent)" />
                <rect x="450" y="140" width="60" height="60" fill="var(--accent)" />
            </svg>
        </div>
    `,
    databaseSharding: `
        <div class="diagram-container">
            <svg viewBox="0 0 600 200" xmlns="http://www.w3.org/2000/svg">
                <rect x="250" y="20" width="100" height="40" fill="var(--primary)" />
                <text x="300" y="45" text-anchor="middle" fill="#fff">Router</text>
                <rect x="100" y="120" width="80" height="60" fill="var(--secondary)" />
                <text x="140" y="155" text-anchor="middle" fill="#fff">Shard 1</text>
                <rect x="260" y="120" width="80" height="60" fill="var(--secondary)" />
                <text x="300" y="155" text-anchor="middle" fill="#fff">Shard 2</text>
                <rect x="420" y="120" width="80" height="60" fill="var(--secondary)" />
                <text x="460" y="155" text-anchor="middle" fill="#fff">Shard 3</text>
                <path d="M 280 60 L 140 120" stroke="var(--accent)" stroke-width="2" fill="none" class="anim-path"/>
                <path d="M 300 60 L 300 120" stroke="var(--accent)" stroke-width="2" fill="none" class="anim-path"/>
                <path d="M 320 60 L 460 120" stroke="var(--accent)" stroke-width="2" fill="none" class="anim-path"/>
            </svg>
        </div>
    `,
    apiGateway: `
        <div class="diagram-container">
            <svg viewBox="0 0 600 300" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="150" r="20" fill="var(--primary)" />
                <rect x="200" y="80" width="100" height="140" fill="var(--accent)" />
                <text x="250" y="155" text-anchor="middle" fill="#fff" font-weight="bold">API Gateway</text>
                <rect x="450" y="40" width="80" height="50" fill="var(--secondary)" />
                <rect x="450" y="125" width="80" height="50" fill="var(--secondary)" />
                <rect x="450" y="210" width="80" height="50" fill="var(--secondary)" />
                <path d="M 70 150 L 200 150" stroke="var(--primary)" stroke-width="2" class="anim-path" />
                <path d="M 300 120 L 450 65" stroke="var(--accent)" stroke-width="2" />
                <path d="M 300 150 L 450 150" stroke="var(--accent)" stroke-width="2" />
                <path d="M 300 180 L 450 235" stroke="var(--accent)" stroke-width="2" />
            </svg>
        </div>
    `,
    circuitBreaker: `
        <div class="diagram-container">
            <svg viewBox="0 0 600 200" xmlns="http://www.w3.org/2000/svg">
                <circle cx="100" cy="100" r="40" fill="#22C55E" />
                <text x="100" y="105" text-anchor="middle" fill="#fff">Closed</text>
                <circle cx="300" cy="100" r="40" fill="#EF4444" class="anim-pulse" />
                <text x="300" y="105" text-anchor="middle" fill="#fff">Open</text>
                <circle cx="500" cy="100" r="40" fill="#F59E0B" />
                <text x="500" y="105" text-anchor="middle" fill="#fff">Half-Open</text>
                <path d="M 140 100 L 260 100" stroke="var(--text)" stroke-width="2" />
                <path d="M 340 100 L 460 100" stroke="var(--text)" stroke-width="2" />
            </svg>
        </div>
    `,
    rateLimiter: `
        <div class="diagram-container">
            <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
                <path d="M 100 100 L 300 100 L 250 250 L 150 250 Z" fill="none" stroke="var(--primary)" stroke-width="5" />
                <circle cx="200" cy="150" r="10" fill="var(--accent)" class="anim-pulse" />
                <circle cx="200" cy="180" r="10" fill="var(--accent)" />
                <circle cx="200" cy="210" r="10" fill="var(--accent)" />
                <path d="M 200 50 L 200 90" stroke="var(--primary)" stroke-width="3" class="anim-path" />
                <text x="200" y="40" text-anchor="middle" fill="var(--text)">Token Bucket</text>
            </svg>
        </div>
    `,
    consistentHashing: `
        <div class="diagram-container">
            <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
                <circle cx="200" cy="200" r="150" fill="none" stroke="var(--primary)" stroke-width="5" />
                <circle cx="200" cy="50" r="15" fill="var(--secondary)" />
                <circle cx="350" cy="200" r="15" fill="var(--secondary)" />
                <circle cx="200" cy="350" r="15" fill="var(--secondary)" />
                <circle cx="50" cy="200" r="15" fill="var(--secondary)" />
                <circle cx="306" cy="100" r="10" fill="var(--accent)" class="anim-pulse" />
                <text x="200" y="200" text-anchor="middle" fill="var(--text)">Hash Ring</text>
            </svg>
        </div>
    `,
    latencyThroughput: `
        <div class="diagram-container">
            <svg viewBox="0 0 600 200" xmlns="http://www.w3.org/2000/svg">
                <line x1="50" y1="150" x2="550" y2="150" stroke="var(--text)" stroke-width="2" />
                <line x1="50" y1="150" x2="50" y2="50" stroke="var(--text)" stroke-width="2" />
                <path d="M 50 130 Q 300 120 550 80" stroke="var(--primary)" stroke-width="3" fill="none" class="anim-path" />
                <text x="300" y="180" text-anchor="middle" fill="var(--text)">Time / Load</text>
                <text x="30" y="100" text-anchor="middle" fill="var(--text)" transform="rotate(-90, 30, 100)">Performance</text>
            </svg>
        </div>
    `,
    availability: `
        <div class="diagram-container">
            <svg viewBox="0 0 600 300" xmlns="http://www.w3.org/2000/svg">
                <rect x="50" y="100" width="120" height="80" fill="var(--primary)" />
                <rect x="240" y="100" width="120" height="80" fill="var(--primary)" />
                <rect x="430" y="100" width="120" height="80" fill="var(--primary)" />
                <path d="M 110 80 L 110 100" stroke="var(--accent)" stroke-width="3" class="anim-path" />
                <path d="M 300 80 L 300 100" stroke="var(--accent)" stroke-width="3" />
                <path d="M 490 80 L 490 100" stroke="var(--accent)" stroke-width="3" />
                <text x="300" y="50" text-anchor="middle" fill="var(--text)">Redundant Servers (Active-Active)</text>
            </svg>
        </div>
    `,
    replication: `
        <div class="diagram-container">
            <svg viewBox="0 0 600 300" xmlns="http://www.w3.org/2000/svg">
                <rect x="250" y="40" width="100" height="80" fill="var(--primary)" />
                <text x="300" y="85" text-anchor="middle" fill="#fff">Master</text>
                <rect x="100" y="200" width="100" height="80" fill="var(--secondary)" />
                <text x="150" y="245" text-anchor="middle" fill="#fff">Slave 1</text>
                <rect x="400" y="200" width="100" height="80" fill="var(--secondary)" />
                <text x="450" y="245" text-anchor="middle" fill="#fff">Slave 2</text>
                <path d="M 280 120 L 170 190" stroke="var(--accent)" stroke-width="2" class="anim-path" />
                <path d="M 320 120 L 430 190" stroke="var(--accent)" stroke-width="2" class="anim-path" />
            </svg>
        </div>
    `,
    distributedLock: `
        <div class="diagram-container">
            <svg viewBox="0 0 600 200" xmlns="http://www.w3.org/2000/svg">
                <rect x="250" y="70" width="100" height="60" fill="var(--accent)" />
                <text x="300" y="105" text-anchor="middle" fill="#fff">Resource Lock</text>
                <circle cx="100" cy="100" r="30" fill="var(--primary)" />
                <circle cx="500" cy="100" r="30" fill="var(--secondary)" />
                <path d="M 135 100 L 245 100" stroke="var(--primary)" stroke-width="3" class="anim-path" />
                <path d="M 465 100 L 355 100" stroke="var(--secondary)" stroke-width="3" stroke-dasharray="5,5" />
            </svg>
        </div>
    `,
    searchSystem: `
        <div class="diagram-container">
            <svg viewBox="0 0 600 300" xmlns="http://www.w3.org/2000/svg">
                <rect x="50" y="50" width="100" height="50" fill="var(--primary)" />
                <text x="100" y="80" text-anchor="middle" fill="#fff">Crawler</text>
                <rect x="250" y="50" width="100" height="50" fill="var(--accent)" />
                <text x="300" y="80" text-anchor="middle" fill="#fff">Indexer</text>
                <rect x="450" y="50" width="100" height="200" fill="var(--secondary)" />
                <text x="500" y="150" text-anchor="middle" fill="#fff">Inverted Index</text>
                <path d="M 150 75 L 250 75" stroke="var(--text)" stroke-width="2" class="anim-path" />
                <path d="M 350 75 L 450 75" stroke="var(--text)" stroke-width="2" class="anim-path" />
            </svg>
        </div>
    `,
    realTime: `
        <div class="diagram-container">
            <svg viewBox="0 0 600 200" xmlns="http://www.w3.org/2000/svg">
                <circle cx="100" cy="100" r="30" fill="var(--primary)" />
                <rect x="250" y="70" width="100" height="60" fill="var(--accent)" />
                <circle cx="500" cy="100" r="30" fill="var(--primary)" />
                <path d="M 135 90 L 245 90" stroke="var(--accent)" stroke-width="2" class="anim-path" />
                <path d="M 245 110 L 135 110" stroke="var(--accent)" stroke-width="2" class="anim-path" />
                <path d="M 355 100 L 465 100" stroke="var(--accent)" stroke-width="2" class="anim-path" />
                <text x="300" y="150" text-anchor="middle" fill="var(--text)">WebSocket / Pub-Sub</text>
            </svg>
        </div>
    `,
    notification: `
        <div class="diagram-container">
            <svg viewBox="0 0 600 300" xmlns="http://www.w3.org/2000/svg">
                <rect x="50" y="125" width="100" height="50" fill="var(--primary)" />
                <rect x="250" y="50" width="100" height="200" fill="var(--accent)" />
                <text x="300" y="155" text-anchor="middle" fill="#fff">Notifier</text>
                <rect x="450" y="50" width="80" height="40" fill="var(--secondary)" />
                <text x="490" y="75" text-anchor="middle" fill="#fff" font-size="10">SMS</text>
                <rect x="450" y="130" width="80" height="40" fill="var(--secondary)" />
                <text x="490" y="155" text-anchor="middle" fill="#fff" font-size="10">Email</text>
                <rect x="450" y="210" width="80" height="40" fill="var(--secondary)" />
                <text x="490" y="235" text-anchor="middle" fill="#fff" font-size="10">Push</text>
            </svg>
        </div>
    `,
    urlShortener: `
        <div class="diagram-container">
            <svg viewBox="0 0 600 200" xmlns="http://www.w3.org/2000/svg">
                <text x="100" y="105" text-anchor="middle" fill="var(--text)">Long URL</text>
                <rect x="250" y="70" width="100" height="60" fill="var(--accent)" />
                <text x="300" y="105" text-anchor="middle" fill="#fff">Hash Fn</text>
                <text x="500" y="105" text-anchor="middle" fill="var(--text)">Short URL</text>
                <path d="M 160 100 L 250 100" stroke="var(--primary)" stroke-width="2" class="anim-path" />
                <path d="M 350 100 L 440 100" stroke="var(--primary)" stroke-width="2" class="anim-path" />
            </svg>
        </div>
    `,
    videoStreaming: `
        <div class="diagram-container">
            <svg viewBox="0 0 600 200" xmlns="http://www.w3.org/2000/svg">
                <rect x="50" y="70" width="100" height="60" fill="var(--primary)" />
                <text x="100" y="105" text-anchor="middle" fill="#fff">Server</text>
                <rect x="200" y="90" width="40" height="20" fill="var(--accent)" class="anim-path" />
                <rect x="260" y="90" width="40" height="20" fill="var(--accent)" />
                <rect x="320" y="90" width="40" height="20" fill="var(--accent)" />
                <rect x="450" y="70" width="100" height="60" fill="var(--secondary)" />
                <text x="500" y="105" text-anchor="middle" fill="#fff">Player</text>
                <text x="300" y="150" text-anchor="middle" fill="var(--text)">Adaptive Streaming (Chunks)</text>
            </svg>
        </div>
    `,
    rideSharing: `
        <div class="diagram-container">
            <svg viewBox="0 0 600 300" xmlns="http://www.w3.org/2000/svg">
                <rect x="50" y="50" width="500" height="200" fill="none" stroke="var(--border-color)" />
                <circle cx="150" cy="150" r="10" fill="var(--primary)" class="anim-pulse" />
                <text x="150" y="170" text-anchor="middle" fill="var(--text)" font-size="10">Rider</text>
                <circle cx="400" cy="100" r="10" fill="var(--accent)" />
                <text x="400" y="120" text-anchor="middle" fill="var(--text)" font-size="10">Driver 1</text>
                <circle cx="450" cy="220" r="10" fill="var(--accent)" />
                <text x="450" y="240" text-anchor="middle" fill="var(--text)" font-size="10">Driver 2</text>
                <path d="M 160 150 L 390 105" stroke="var(--primary)" stroke-dasharray="5,5" />
                <text x="300" y="280" text-anchor="middle" fill="var(--text)">Geospatial Matching (Quadtree/S2)</text>
            </svg>
        </div>
    `,
    payment: `
        <div class="diagram-container">
            <svg viewBox="0 0 600 300" xmlns="http://www.w3.org/2000/svg">
                <rect x="50" y="125" width="100" height="50" fill="var(--primary)" />
                <rect x="250" y="125" width="100" height="50" fill="var(--accent)" />
                <rect x="450" y="125" width="100" height="50" fill="var(--secondary)" />
                <path d="M 150 150 L 250 150" stroke="var(--text)" stroke-width="2" class="anim-path" />
                <path d="M 350 150 L 450 150" stroke="var(--text)" stroke-width="2" class="anim-path" />
                <text x="100" y="190" text-anchor="middle" fill="var(--text)" font-size="10">User</text>
                <text x="300" y="190" text-anchor="middle" fill="var(--text)" font-size="10">Payment Gateway</text>
                <text x="500" y="190" text-anchor="middle" fill="var(--text)" font-size="10">Bank/PSP</text>
            </svg>
        </div>
    `,
    newsFeed: `
        <div class="diagram-container">
            <svg viewBox="0 0 600 300" xmlns="http://www.w3.org/2000/svg">
                <circle cx="100" cy="150" r="30" fill="var(--primary)" />
                <rect x="250" y="100" width="100" height="100" fill="var(--accent)" />
                <circle cx="500" cy="80" r="20" fill="var(--secondary)" />
                <circle cx="500" cy="150" r="20" fill="var(--secondary)" />
                <circle cx="500" cy="220" r="20" fill="var(--secondary)" />
                <path d="M 130 150 L 250 150" stroke="var(--text)" stroke-width="2" class="anim-path" />
                <path d="M 350 140 L 480 90" stroke="var(--text)" stroke-width="2" class="anim-path" />
                <path d="M 350 150 L 480 150" stroke="var(--text)" stroke-width="2" class="anim-path" />
                <path d="M 350 160 L 480 210" stroke="var(--text)" stroke-width="2" class="anim-path" />
                <text x="300" y="230" text-anchor="middle" fill="var(--text)">Fan-out / Feed Gen</text>
            </svg>
        </div>
    `,
    loggingMonitoring: `
        <div class="diagram-container">
            <svg viewBox="0 0 600 300" xmlns="http://www.w3.org/2000/svg">
                <rect x="50" y="50" width="80" height="50" fill="var(--primary)" />
                <rect x="50" y="125" width="80" height="50" fill="var(--primary)" />
                <rect x="50" y="200" width="80" height="50" fill="var(--primary)" />
                <rect x="250" y="100" width="100" height="100" fill="var(--accent)" />
                <rect x="450" y="100" width="100" height="100" fill="var(--secondary)" />
                <path d="M 130 75 L 250 140" stroke="var(--text)" stroke-width="2" class="anim-path" />
                <path d="M 130 150 L 250 150" stroke="var(--text)" stroke-width="2" class="anim-path" />
                <path d="M 130 225 L 250 160" stroke="var(--text)" stroke-width="2" class="anim-path" />
                <text x="500" y="220" text-anchor="middle" fill="var(--text)">Dashboard</text>
            </svg>
        </div>
    `,
    dataPipeline: `
        <div class="diagram-container">
            <svg viewBox="0 0 600 200" xmlns="http://www.w3.org/2000/svg">
                <rect x="50" y="70" width="80" height="60" fill="var(--primary)" />
                <rect x="180" y="70" width="100" height="60" fill="var(--accent)" />
                <rect x="330" y="70" width="100" height="60" fill="var(--accent)" />
                <rect x="470" y="70" width="80" height="60" fill="var(--secondary)" />
                <path d="M 130 100 L 180 100" stroke="var(--text)" stroke-width="2" class="anim-path" />
                <path d="M 280 100 L 330 100" stroke="var(--text)" stroke-width="2" class="anim-path" />
                <path d="M 430 100 L 470 100" stroke="var(--text)" stroke-width="2" class="anim-path" />
                <text x="300" y="160" text-anchor="middle" fill="var(--text)">ETL Pipeline</text>
            </svg>
        </div>
    `,
    batchProcessing: `
        <div class="diagram-container">
            <svg viewBox="0 0 600 300" xmlns="http://www.w3.org/2000/svg">
                <rect x="50" y="125" width="80" height="50" fill="var(--primary)" />
                <rect x="200" y="50" width="80" height="50" fill="var(--accent)" />
                <rect x="200" y="200" width="80" height="50" fill="var(--accent)" />
                <rect x="350" y="125" width="80" height="50" fill="var(--secondary)" />
                <path d="M 130 150 L 200 75" stroke="var(--text)" stroke-width="2" />
                <path d="M 130 150 L 200 225" stroke="var(--text)" stroke-width="2" />
                <text x="300" y="280" text-anchor="middle" fill="var(--text)">MapReduce (Split-Map-Shuffle-Reduce)</text>
            </svg>
        </div>
    `,
    indexing: `
        <div class="diagram-container">
            <svg viewBox="0 0 600 300" xmlns="http://www.w3.org/2000/svg">
                <rect x="250" y="20" width="100" height="40" fill="var(--primary)" />
                <rect x="150" y="100" width="100" height="40" fill="var(--accent)" />
                <rect x="350" y="100" width="100" height="40" fill="var(--accent)" />
                <rect x="80" y="180" width="60" height="30" fill="var(--secondary)" />
                <rect x="180" y="180" width="60" height="30" fill="var(--secondary)" />
                <rect x="300" y="180" width="60" height="30" fill="var(--secondary)" />
                <rect x="420" y="180" width="60" height="30" fill="var(--secondary)" />
                <path d="M 300 60 L 200 100" stroke="var(--text)" stroke-width="2" />
                <path d="M 300 60 L 400 100" stroke="var(--text)" stroke-width="2" />
                <text x="300" y="250" text-anchor="middle" fill="var(--text)">B-Tree Index Visualization</text>
            </svg>
        </div>
    `,
    architecture: `
        <div class="diagram-container">
            <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg">
                <rect x="20" y="180" width="60" height="40" fill="var(--primary)" />
                <rect x="150" y="150" width="80" height="100" fill="var(--accent)" />
                <rect x="300" y="100" width="100" height="50" fill="var(--secondary)" />
                <rect x="300" y="250" width="100" height="50" fill="var(--secondary)" />
                <rect x="500" y="175" width="80" height="50" fill="#6366F1" />
                <rect x="700" y="150" width="60" height="100" fill="#EC4899" />
                <path d="M 80 200 L 150 200" stroke="var(--text)" stroke-width="2" class="anim-path" />
                <path d="M 230 180 L 300 130" stroke="var(--text)" stroke-width="2" />
                <path d="M 230 220 L 300 270" stroke="var(--text)" stroke-width="2" />
                <text x="300" y="50" text-anchor="middle" fill="var(--text)" font-weight="bold">High Level Architecture</text>
            </svg>
        </div>
    `,
    generic: `
        <div class="diagram-container">
            <svg viewBox="0 0 600 200" xmlns="http://www.w3.org/2000/svg">
                <rect x="100" y="60" width="120" height="80" rx="8" fill="var(--primary)" class="anim-pulse" />
                <rect x="380" y="60" width="120" height="80" rx="8" fill="var(--secondary)" />
                <path d="M 220 100 L 380 100" stroke="var(--accent)" stroke-width="4" fill="none" class="anim-path"/>
            </svg>
        </div>
    `
};

function generateContent(title, type) {
    let svg = svgSnippets.generic;
    const t = title.toLowerCase();
    
    if (t.includes('load balancer')) svg = svgSnippets.loadBalancer;
    else if (t.includes('client-server')) svg = svgSnippets.clientServer;
    else if (t.includes('cach')) svg = svgSnippets.caching;
    else if (t.includes('cap theorem')) svg = svgSnippets.capTheorem;
    else if (t.includes('cdn')) svg = svgSnippets.cdn;
    else if (t.includes('message queue') || t.includes('kafka')) svg = svgSnippets.messageQueue;
    else if (t.includes('microservices') || t.includes('monolith')) svg = svgSnippets.microservices;
    else if (t.includes('sharding')) svg = svgSnippets.databaseSharding;
    else if (t.includes('replication')) svg = svgSnippets.replication;
    else if (t.includes('api gateway')) svg = svgSnippets.apiGateway;
    else if (t.includes('circuit breaker')) svg = svgSnippets.circuitBreaker;
    else if (t.includes('rate limit')) svg = svgSnippets.rateLimiter;
    else if (t.includes('consistent hashing')) svg = svgSnippets.consistentHashing;
    else if (t.includes('latency') || t.includes('throughput')) svg = svgSnippets.latencyThroughput;
    else if (t.includes('availability')) svg = svgSnippets.availability;
    else if (t.includes('lock')) svg = svgSnippets.distributedLock;
    else if (t.includes('search system')) svg = svgSnippets.searchSystem;
    else if (t.includes('real-time') || t.includes('chat')) svg = svgSnippets.realTime;
    else if (t.includes('notification')) svg = svgSnippets.notification;
    else if (t.includes('url shortener')) svg = svgSnippets.urlShortener;
    else if (t.includes('video streaming')) svg = svgSnippets.videoStreaming;
    else if (t.includes('ride sharing') || t.includes('uber')) svg = svgSnippets.rideSharing;
    else if (t.includes('payment')) svg = svgSnippets.payment;
    else if (t.includes('news feed')) svg = svgSnippets.newsFeed;
    else if (t.includes('logging') || t.includes('monitoring')) svg = svgSnippets.loggingMonitoring;
    else if (t.includes('data pipeline')) svg = svgSnippets.dataPipeline;
    else if (t.includes('batch') || t.includes('map reduce')) svg = svgSnippets.batchProcessing;
    else if (t.includes('indexing')) svg = svgSnippets.indexing;
    else if (t.includes('design') || type === 'interview') svg = svgSnippets.architecture;

    const baseIntro = type === 'interview' 
        ? `<h2>Problem Statement: ${title}</h2><p>আজকের ইন্টারভিউ প্রশ্নে আমরা শিখবো কিভাবে <strong>${title}</strong> সিস্টেম তৈরি করতে হয়। এটি সিস্টেম ডিজাইন ইন্টারভিউয়ের একটি অন্যতম জনপ্রিয় প্রশ্ন।</p>` 
        : `<h1>${title}</h1><p>সিস্টেম ডিজাইনের এই পর্বে আমরা <strong>${title}</strong> নিয়ে বিস্তারিত আলোচনা করবো।</p>`;

    const story = `
        <div class="story-box">
            "ধরো তুমি একটি ছোট অনলাইন দোকান খুলেছ। শুরুতে তোমার দোকানে দিনে মাত্র ১০-১৫ জন ক্রেতা আসতো। তুমি একাই সব ম্যানেজ করতে পারতে। 
            কিন্তু কিছুদিন পর তোমার দোকানের বিক্রি অনেক বেড়ে গেল। দিনে হাজার হাজার মানুষ আসতে শুরু করল। 
            এখন তুমি একা আর সামলাতে পারছো না। তোমার এখন নতুন লোক লাগবে, দোকানের জায়গা বড় করতে হবে, আর জিনিসপত্র গুছিয়ে রাখার নতুন সিস্টেম করতে হবে।"
        </div>
    `;

    const body = `
        <h2>${title} কী? (What is it?)</h2>
        <p>${title} হলো এমন একটি মেকানিজম বা আর্কিটেকচারাল প্যাটার্ন যা ডিস্ট্রিবিউটেড সিস্টেমে পারফরম্যান্স, স্কেলেবিলিটি এবং রিলায়াবিলিটি বাড়াতে সাহায্য করে।</p>
        
        ${svg}

        <h2>কিভাবে কাজ করে? (How it works)</h2>
        <p>এর কাজের ধরন খুব সহজভাবে বুঝতে গেলে কিছু ধাপ মাথায় রাখতে হবে:</p>
        <ol>
            <li>প্রথমে ক্লায়েন্ট থেকে রিকোয়েস্ট আসে।</li>
            <li>সিস্টেম চেক করে যে এই রিকোয়েস্টটি কীভাবে সবচেয়ে দ্রুত প্রসেস করা যায়।</li>
            <li>তারপর উপযুক্ত সার্ভার বা ডেটাবেসে রিকোয়েস্টটি পাঠানো হয়।</li>
        </ol>
    `;

    const interviewExtras = `
        <h2>Requirements</h2>
        <ul>
            <li>High Availability</li>
            <li>Scalability</li>
            <li>Low Latency</li>
        </ul>
        <h2>High Level Design (HLD)</h2>
        <p>প্রথমে আমরা একটি বেসিক আর্কিটেকচার দাঁড় করাবো। ক্লায়েন্ট থেকে রিকোয়েস্ট Load Balancer হয়ে Application Server এ যাবে এবং সেখান থেকে Database এ ডেটা সেভ হবে।</p>
    `;

    return baseIntro + story + body + (type === 'interview' ? interviewExtras : '');
}

const indexHtml = getTemplate("Home", `
    <h1>System Design বাংলায় শিখুন</h1>
    <div class="story-box">
        "সিস্টেম ডিজাইন শেখাটা অনেকটা একটি বিশাল বিল্ডিং তৈরি করার মতো। কোথায় কতটুকু রড সিমেন্ট লাগবে তা যেমন একজন ইঞ্জিনিয়ার হিসাব করেন, তেমনি একজন সফটওয়্যার আর্কিটেক্ট ঠিক করেন কোথায় লোড ব্যালেন্সার বসবে, কোথায় ডেটাবেস শার্ডিং হবে।"
    </div>
    ${svgSnippets.architecture}
`, 0);

fs.writeFileSync(path.join(rootDir, 'index.html'), indexHtml);

sections.forEach(sec => {
    if (sec.folder === 'pages' || sec.folder === 'interview') {
        sec.pages.forEach(page => {
            const content = generateContent(page.title, sec.folder);
            const html = getTemplate(page.title, content, 1);
            fs.writeFileSync(path.join(rootDir, sec.folder, page.file), html);
        });
    }
});

console.log("Website updated successfully with topic-specific diagrams!");
