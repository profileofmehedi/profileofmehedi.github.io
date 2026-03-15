const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const dirs = ['css', 'js', 'svg/diagrams', 'pages', 'interview', 'fonts'];
dirs.forEach(d => fs.mkdirSync(path.join(rootDir, d), { recursive: true }));

const sections = [
    {
        title: "ভূমিকা (Introduction)",
        folder: "pages",
        pages: [
            { file: "01-introduction.html", title: "ভূমিকা (Introduction)", key: "introduction" },
            { file: "02-what-is-system-design.html", title: "সিস্টেম ডিজাইন কি?", key: "what-is-system-design" },
            { file: "03-client-server.html", title: "ক্লায়েন্ট-সার্ভার মডেল", key: "client-server" },
            { file: "04-latency-vs-throughput.html", title: "ল্যাটেন্সি বনাম থ্রুটপুট", key: "latency-vs-throughput" }
        ]
    },
    {
        title: "মৌলিক ধারণা (Fundamentals)",
        folder: "pages",
        pages: [
            { file: "05-availability.html", title: "অ্যাভেইল্যাবিলিটি (Availability)", key: "availability" },
            { file: "06-cap-theorem.html", title: "ক্যাপ থিওরেম (CAP Theorem)", key: "cap-theorem" },
            { file: "07-load-balancer.html", title: "লোড ব্যালেন্সার", key: "load-balancer" },
            { file: "08-caching.html", title: "ক্যাশিং (Caching)", key: "caching" }
        ]
    },
    {
        title: "ডেটা ম্যানেজমেন্ট (Data Management)",
        folder: "pages",
        pages: [
            { file: "09-database-sharding.html", title: "ডেটাবেস শার্ডিং", key: "database-sharding" },
            { file: "10-replication.html", title: "ডেটাবেস রেপ্লিকেশন", key: "database-replication" },
            { file: "11-cdn.html", title: "সিডিএন (CDN)", key: "cdn" },
            { file: "12-message-queue.html", title: "মেসেজ কিউ (Message Queue)", key: "message-queue" }
        ]
    },
    {
        title: "আর্কিটেকচার প্যাটার্নস (Patterns)",
        folder: "pages",
        pages: [
            { file: "13-microservices.html", title: "মাইক্রোসার্ভিসেস", key: "microservices" },
            { file: "14-monolith.html", title: "মনোলিথিক আর্কিটেকচার", key: "monolith" },
            { file: "15-api-gateway.html", title: "এপিআই গেটওয়ে", key: "api-gateway" },
            { file: "16-rate-limiting.html", title: "রেট লিমিটিং", key: "rate-limiting" }
        ]
    },
    {
        title: "উন্নত টপিক (Advanced Topics)",
        folder: "pages",
        pages: [
            { file: "17-consistent-hashing.html", title: "কনসিস্টেন্ট হ্যাশিং", key: "consistent-hashing" },
            { file: "18-distributed-lock.html", title: "ডিস্ট্রিবিউটেড লক", key: "distributed-lock" },
            { file: "19-search-system.html", title: "সার্চ ইঞ্জিন সিস্টেম", key: "search-system" },
            { file: "20-real-time-system.html", title: "রিয়েল-টাইম সিস্টেম", key: "real-time-system" },
            { file: "21-notification-system.html", title: "নোটিফিকেশন সিস্টেম", key: "notification-system" },
            { file: "22-url-shortener.html", title: "ইউআরএল শর্টেনার", key: "url-shortener" },
            { file: "23-chat-system.html", title: "চ্যাট সিস্টেম", key: "chat-system" },
            { file: "24-video-streaming-system.html", title: "ভিডিও স্ট্রিমিং", key: "video-streaming" },
            { file: "25-ride-sharing-system.html", title: "রাইড শেয়ারিং সিস্টেম", key: "ride-sharing" },
            { file: "26-payment-system.html", title: "পেমেন্ট সিস্টেম", key: "payment-system" },
            { file: "27-news-feed-system.html", title: "নিউজ ফিড সিস্টেম", key: "news-feed" },
            { file: "28-recommendation-system.html", title: "রিকমেন্ডেশন সিস্টেম", key: "recommendation-system" },
            { file: "29-file-storage-system.html", title: "ফাইল স্টোরেজ সিস্টেম", key: "file-storage" },
            { file: "30-logging-system.html", title: "লগিং সিস্টেম", key: "logging-system" },
            { file: "31-monitoring-system.html", title: "মনিটরিং সিস্টেম", key: "monitoring-system" },
            { file: "32-circuit-breaker.html", title: "সার্কিট ব্রেকার", key: "circuit-breaker" },
            { file: "33-event-driven-architecture.html", title: "ইভেন্ট ড্রিভেন আর্কিটেকচার", key: "event-driven" },
            { file: "34-kafka-system.html", title: "কাফকা (Kafka) সিস্টেম", key: "kafka" },
            { file: "35-data-pipeline.html", title: "ডেটা পাইপলাইন", key: "data-pipeline" },
            { file: "36-map-reduce.html", title: "ম্যাপ রিডিউস (MapReduce)", key: "map-reduce" },
            { file: "37-batch-processing.html", title: "ব্যাচ প্রসেসিং", key: "batch-processing" },
            { file: "38-stream-processing.html", title: "স্ট্রিম প্রসেসিং", key: "stream-processing" },
            { file: "39-indexing.html", title: "ডেটাবেস ইনডেক্সিং", key: "indexing" },
            { file: "40-system-design-best-practices.html", title: "সেরা অনুশীলন (Best Practices)", key: "best-practices" }
        ]
    },
    {
        title: "ইন্টারভিউ প্রশ্ন (Interview)",
        folder: "interview",
        pages: [] 
    }
];

const interviewTopicsBangla = [
    "টুইটার ডিজাইন", "ফেসবুক নিউজ ফিড ডিজাইন", "হোয়াটসঅ্যাপ ডিজাইন", "ইউআরএল শর্টেনার ডিজাইন",
    "উবার (Uber) ডিজাইন", "ইনস্টাগ্রাম ডিজাইন", "ইউটিউব ডিজাইন", "ডিস্ট্রিবিউটেড ক্যাশ ডিজাইন",
    "পেমেন্ট সিস্টেম ডিজাইন", "নোটিফিকেশন সিস্টেম ডিজাইন", "সার্চ ইঞ্জিন ডিজাইন",
    "গুগল ডক্স ডিজাইন", "নেটফ্লিক্স ডিজাইন", "ড্রপবক্স ডিজাইন", "রেট লিমিটার ডিজাইন",
    "টিকিটমাস্টার ডিজাইন", "অ্যামাজন ই-কমার্স ডিজাইন", "টিন্ডার ডিজাইন", "গুগল ম্যাপস ডিজাইন",
    "জুম (Zoom) ডিজাইন", "স্ল্যাক (Slack) ডিজাইন", "ডিসকর্ড ডিজাইন", "কী-ভ্যালু স্টোর ডিজাইন",
    "ওয়েব ক্রলার ডিজাইন", "এপিআই রেট লিমিটার ডিজাইন", "ইয়েল্প (Yelp) ডিজাইন", "পেস্টবিন ডিজাইন",
    "অনলাইন কোড এডিটর ডিজাইন", "হোটেল বুকিং সিস্টেম ডিজাইন", "পার্কিং লট ডিজাইন",
    "এলিভেটর সিস্টেম ডিজাইন", "ভেন্ডিং মেশিন ডিজাইন", "লাইব্রেরি ম্যানেজমেন্ট ডিজাইন",
    "চেস গেম ডিজাইন", "টিক ট্যাক টো ডিজাইন", "এটিএম (ATM) ডিজাইন", "ব্ল্যাকজ্যাক ডিজাইন",
    "অনলাইন শপিং ডিজাইন", "ইমেইল সিস্টেম ডিজাইন", "রেডিস (Redis) ডিজাইন",
    "ক্যাসান্ড্রা ডিজাইন", "জুকিপার (Zookeeper) ডিজাইন", "ডিস্ট্রিবিউটেড জব সিডিউলার",
    "অ্যাড ক্লিক ইভেন্ট এগ্রিগেশন", "মেট্রিক্স কালেকশন সিস্টেম",
    "লোকেশন বেসড সার্ভিস ডিজাইন", "স্টক এক্সচেঞ্জ ডিজাইন", "লিডারবোর্ড ডিজাইন",
    "কোলাবোরেটিভ হোয়াইটবোর্ড", "ফ্লাইট বুকিং সিস্টেম ডিজাইন"
];

interviewTopicsBangla.forEach((topic, index) => {
    sections[5].pages.push({
        file: `question-${String(index + 1).padStart(2, '0')}.html`,
        title: topic,
        key: `interview-${index}`
    });
});

const svgSnippets = {
    clientServer: `<div class="diagram-container"><svg viewBox="0 0 600 250"><rect x="50" y="80" width="120" height="90" rx="10" fill="var(--primary)" class="anim-pulse"/><text x="110" y="130" text-anchor="middle" fill="#fff" font-weight="bold">Client (You)</text><path d="M 170 110 L 430 110" stroke="var(--accent)" stroke-width="4" fill="none" class="anim-path"/><text x="300" y="100" text-anchor="middle" fill="var(--text)" font-size="14" font-weight="bold">Request</text><path d="M 430 140 L 170 140" stroke="var(--primary)" stroke-width="4" fill="none" class="anim-path"/><text x="300" y="170" text-anchor="middle" fill="var(--text)" font-size="14" font-weight="bold">Response</text><rect x="430" y="80" width="120" height="90" rx="10" fill="var(--secondary)"/><text x="490" y="130" text-anchor="middle" fill="#fff" font-weight="bold">Server</text></svg></div>`,
    latencyThroughput: `<div class="diagram-container"><svg viewBox="0 0 600 300">
        <!-- Pipe Analogy -->
        <rect x="50" y="100" width="500" height="60" rx="5" fill="none" stroke="var(--border-color)" stroke-width="2"/>
        <circle cx="80" cy="130" r="15" fill="var(--primary)" class="anim-path">
            <animate attributeName="cx" from="80" to="520" dur="2s" repeatCount="indefinite" />
        </circle>
        <text x="300" y="90" text-anchor="middle" fill="var(--text)" font-weight="bold">Latency (Travel Time)</text>
        <rect x="50" y="200" width="500" height="60" rx="5" fill="none" stroke="var(--border-color)" stroke-width="2"/>
        <circle cx="80" cy="230" r="10" fill="var(--accent)"/><circle cx="110" cy="230" r="10" fill="var(--accent)"/><circle cx="140" cy="230" r="10" fill="var(--accent)"/><circle cx="170" cy="230" r="10" fill="var(--accent)"/>
        <text x="300" y="190" text-anchor="middle" fill="var(--text)" font-weight="bold">Throughput (Volume/Time)</text>
    </svg></div>`,
    loadBalancer: `<div class="diagram-container"><svg viewBox="0 0 600 300"><circle cx="50" cy="150" r="20" fill="var(--primary)" class="anim-pulse"/><rect x="250" y="110" width="100" height="80" rx="10" fill="var(--accent)"/><rect x="480" y="40" width="80" height="50" rx="5" fill="var(--secondary)"/><rect x="480" y="125" width="80" height="50" rx="5" fill="var(--secondary)"/><rect x="480" y="210" width="80" height="50" rx="5" fill="var(--secondary)"/><path d="M 70 150 L 250 150" stroke="var(--primary)" stroke-width="3" fill="none" class="anim-path"/></svg></div>`,
    caching: `<div class="diagram-container"><svg viewBox="0 0 600 250"><rect x="50" y="100" width="80" height="60" rx="5" fill="var(--primary)"/><rect x="260" y="40" width="100" height="60" rx="5" fill="var(--accent)" class="anim-pulse"/><rect x="470" y="100" width="80" height="80" rx="5" fill="var(--secondary)"/><path d="M 130 110 L 260 80" stroke="var(--primary)" stroke-width="3" fill="none" class="anim-path"/></svg></div>`,
    generic: `<div class="diagram-container"><svg viewBox="0 0 600 200"><rect x="100" y="60" width="120" height="80" rx="8" fill="var(--primary)"/><rect x="380" y="60" width="120" height="80" rx="8" fill="var(--secondary)"/><path d="M 220 100 L 380 100" stroke="var(--accent)" stroke-width="4" fill="none" class="anim-path"/></svg></div>`
};

const topicDetails = {
    "introduction": {
        story: `"সিস্টেম ডিজাইন শেখা মানে হলো একটি বিশাল শহরের ম্যাপ তৈরি করা। কোথায় রাস্তা হবে, কোথায় ব্রিজ হবে আর কোথায় ড্রেন হবে - তা আগে থেকে প্ল্যান করা।"`,
        details: `সিস্টেম ডিজাইন হলো একটি জটিল সমস্যার সমাধান করার জন্য বিভিন্ন সফটওয়্যার এবং হার্ডওয়্যার কম্পোনেন্টগুলোকে সাজানোর প্রক্রিয়া।`,
        advantages: ["Efficiency", "Scalability", "Reliability"],
        svg: svgSnippets.generic
    },
    "what-is-system-design": {
        story: `"ধরো তোমাকে বলা হলো একটি লাইব্রেরি বানাতে। তুমি কি শুধু বই কিনে এনে স্তূপ করে রাখবে? নাকি তাকে তাক অনুযায়ী সাজাবে যাতে সবাই সহজে খুঁজে পায়?"`,
        details: `সিস্টেম ডিজাইন আমাদের শেখায় কিভাবে ইউজার বাড়লে অ্যাপ ভেঙে না পড়ে এবং সবাই যেন দ্রুত সার্ভিস পায়।`,
        advantages: ["Better architecture", "Less technical debt"],
        svg: svgSnippets.generic
    },
    "client-server": {
        story: `"রেস্টুরেন্টে গিয়ে খাবার অর্ডার করার গল্পের মাধ্যমে Client (আপনি) এবং Server (বাবুর্চি) এর ভূমিকা বোঝানো হয়েছে।"`,
        details: `ক্লায়েন্ট-সার্ভার মডেলে ইউজার রিকোয়েস্ট পাঠায় এবং সার্ভার রেসপন্স দেয়।`,
        advantages: ["Centralized control", "Easy updates"],
        svg: svgSnippets.clientServer
    },
    "latency-vs-throughput": {
        story: `"ধরো তোমার বাসায় একটি পানির পাইপ আছে। পাইপটি ছাড়ার পর পানি তোমার মগ পর্যন্ত পৌঁছাতে কত সময় লাগছে সেটা হলো Latency। আর এক মিনিটে কত লিটার পানি পড়ছে সেটা হলো Throughput। যদি পাইপ লম্বা হয় তবে ল্যাটেন্সি বাড়বে, আর পাইপ মোটা হলে থ্রুটপুট বাড়বে।"`,
        details: `সিস্টেম ডিজাইনে 'Latency' হলো একটি রিকোয়েস্টের রেসপন্স পেতে কত সময় লাগছে। আর 'Throughput' হলো একটি নির্দিষ্ট সময়ে সিস্টেম কতগুলো রিকোয়েস্ট প্রসেস করতে পারে।`,
        advantages: ["Performance metric", "Capacity planning", "User experience balancing"],
        svg: svgSnippets.latencyThroughput
    },
    "availability": {
        story: `"ধরো একটি দোকান ২৪ ঘণ্টা খোলা থাকে। যেকোনো সময় গেলেই তুমি সেখানে জিনিস পাচ্ছ। এটিই হলো Availability।"`,
        details: `হাই অ্যাভেইল্যাবিলিটি নিশ্চিত করে যে সিস্টেমের কোনো একটি অংশ নষ্ট হলেও পুরো সিস্টেম ডাউন হবে না।`,
        advantages: ["Reliability", "Trustworthy system"],
        svg: svgSnippets.generic
    },
    "load-balancer": {
        story: `"ধরো একটি ব্যাংকে অনেক লাইন। সেখানে একজন ম্যানেজার সবাইকে বিভিন্ন কাউন্টার পাঠিয়ে দিচ্ছেন যাতে কোনো একটি কাউন্টারে ভিড় না হয়।"`,
        details: `লোড ব্যালেন্সার ইনকামিং ট্রাফিককে বিভিন্ন সার্ভারের মধ্যে ডিস্ট্রিবিউট করে দেয়।`,
        advantages: ["Scalability", "Fault tolerance"],
        svg: svgSnippets.loadBalancer
    },
    "caching": {
        story: `"লাইব্রেরিয়ান বার বার স্টোর রুমে না গিয়ে সবচেয়ে বেশি পড়া বইটি নিজের কাছেই রেখে দিচ্ছেন। এটিই হলো ক্যাশিং।"`,
        details: `ক্যাশিং মেমোরিতে ডেটা জমা রাখে যাতে ডেটাবেস থেকে বার বার আনতে না হয়।`,
        advantages: ["Low latency", "Fast response"],
        svg: svgSnippets.caching
    }
};

// Fallback
sections.forEach(sec => {
    sec.pages.forEach(p => {
        if (!topicDetails[p.key]) {
            topicDetails[p.key] = {
                story: `"গল্পের ছলে শিখুন ${p.title}।"`,
                details: `${p.title} হলো সিস্টেম ডিজাইনের একটি গুরুত্বপূর্ণ অংশ।`,
                advantages: ["Scalability", "Performance"],
                svg: svgSnippets.generic
            };
        }
    });
});

function getSidebarHtml(depth = 1) {
    let html = '';
    sections.forEach((sec) => {
        html += `<div class="sidebar-section"><div class="sidebar-heading">${sec.title} <span>▼</span></div><ul class="sidebar-links">`;
        sec.pages.forEach(page => {
            const path = depth === 0 ? `pages/${page.file}` : (sec.folder === 'pages' ? page.file : `../interview/${page.file}`);
            html += `<li><a href="${path}">${page.title}</a></li>`;
        });
        html += `</ul></div>`;
    });
    return html;
}

function getTemplate(title, content, depth = 1) {
    const rootPath = depth === 0 ? '' : '../';
    return `<!DOCTYPE html><html lang="bn"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${title}</title><link rel="stylesheet" href="${rootPath}css/style.css"></head><body class="light-mode"><header class="topbar"><div class="logo">System Design Bangla</div><div class="actions"><button id="theme-toggle">🌙</button><a href="#" class="github-btn">GitHub</a><button id="mobile-menu-btn">☰</button></div></header><div class="app-container"><aside class="sidebar" id="sidebar">${getSidebarHtml(depth)}</aside><main class="main-content"><div class="content-box">${content}</div></main></div><script src="${rootPath}js/app.js"></script></body></html>`;
}

// Generate
sections.forEach(sec => {
    sec.pages.forEach(page => {
        const data = topicDetails[page.key];
        const content = `<h1>${page.title}</h1><div class="story-box">${data.story}</div><h2>বিস্তারিত</h2><p>${data.details}</p>${data.svg}<h2>সুবিধা</h2><ul>${data.advantages.map(a => `<li>${a}</li>`).join('')}</ul>`;
        fs.writeFileSync(path.join(rootDir, sec.folder, page.file), getTemplate(page.title, content, 1));
    });
});

// Write Index
fs.writeFileSync(path.join(rootDir, 'index.html'), getTemplate("Home", `<h1>System Design বাংলায় শিখুন</h1><div class="story-box">"গল্পের ছলে শিখুন সিস্টেম ডিজাইন।"</div>${svgSnippets.generic}`, 0));

console.log("04-latency-vs-throughput fixed with unique content and SVG!");
