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
        key: "interview-generic"
    });
});

const svgSnippets = {
    realTime: `<div class="diagram-container"><svg viewBox="0 0 600 250"><circle cx="100" cy="125" r="30" fill="var(--primary)"/><path d="M 130 125 L 470 125" stroke="var(--accent)" stroke-width="4" class="anim-path"/><circle cx="500" cy="125" r="30" fill="var(--secondary)"/><text x="300" y="100" text-anchor="middle" fill="var(--text)">WebSocket (Full Duplex)</text></svg></div>`,
    notification: `<div class="diagram-container"><svg viewBox="0 0 600 300"><rect x="50" y="125" width="100" height="50" fill="var(--primary)"/><rect x="250" y="50" width="100" height="200" fill="var(--accent)"/><text x="300" y="155" text-anchor="middle" fill="#fff">Notifier</text><circle cx="500" cy="75" r="20" fill="var(--secondary)"/><circle cx="500" cy="150" r="20" fill="var(--secondary)"/><circle cx="500" cy="225" r="20" fill="var(--secondary)"/></svg></div>`,
    urlShortener: `<div class="diagram-container"><svg viewBox="0 0 600 200"><text x="100" y="105" text-anchor="middle" fill="var(--text)">Long URL</text><path d="M 160 100 L 250 100" stroke="var(--primary)" stroke-width="2"/><rect x="250" y="70" width="100" height="60" fill="var(--accent)"/><text x="300" y="105" text-anchor="middle" fill="#fff">Hash</text><path d="M 350 100 L 440 100" stroke="var(--primary)" stroke-width="2"/><text x="500" y="105" text-anchor="middle" fill="var(--text)">Short URL</text></svg></div>`,
    chatSystem: `<div class="diagram-container"><svg viewBox="0 0 600 250"><rect x="50" y="100" width="80" height="60" fill="var(--primary)"/><rect x="250" y="50" width="100" height="150" fill="var(--accent)"/><text x="300" y="130" text-anchor="middle" fill="#fff">Chat Server</text><rect x="470" y="100" width="80" height="60" fill="var(--primary)"/><path d="M 130 130 L 250 130" stroke="var(--primary)" stroke-width="2" class="anim-path"/><path d="M 350 130 L 470 130" stroke="var(--primary)" stroke-width="2" class="anim-path"/></svg></div>`,
    videoStreaming: `<div class="diagram-container"><svg viewBox="0 0 600 250"><rect x="50" y="100" width="100" height="60" fill="var(--primary)"/><rect x="200" y="120" width="40" height="20" fill="var(--accent)" class="anim-path"/><rect x="260" y="120" width="40" height="20" fill="var(--accent)"/><rect x="320" y="120" width="40" height="20" fill="var(--accent)"/><rect x="450" y="100" width="100" height="60" fill="var(--secondary)"/><text x="300" y="90" text-anchor="middle" fill="var(--text)">Video Chunks (ABS)</text></svg></div>`,
    rideSharing: `<div class="diagram-container"><svg viewBox="0 0 600 300"><rect x="50" y="50" width="500" height="200" fill="none" stroke="var(--border-color)"/><circle cx="150" cy="150" r="10" fill="var(--primary)" class="anim-pulse"/><circle cx="400" cy="100" r="8" fill="var(--accent)"/><circle cx="450" cy="200" r="8" fill="var(--accent)"/><path d="M 160 150 L 390 105" stroke="var(--primary)" stroke-dasharray="5,5"/></svg></div>`,
    searchSystem: `<div class="diagram-container"><svg viewBox="0 0 600 250"><rect x="50" y="100" width="100" height="50" fill="var(--primary)"/><path d="M 150 125 L 450 125" stroke="var(--accent)" stroke-width="2" class="anim-path"/><rect x="450" y="50" width="100" height="150" fill="var(--secondary)"/><text x="500" y="130" text-anchor="middle" fill="#fff">Index</text></svg></div>`,
    generic: `<div class="diagram-container"><svg viewBox="0 0 600 200"><rect x="100" y="60" width="120" height="80" rx="8" fill="var(--primary)"/><rect x="380" y="60" width="120" height="80" rx="8" fill="var(--secondary)"/><path d="M 220 100 L 380 100" stroke="var(--accent)" stroke-width="4" fill="none" class="anim-path"/></svg></div>`
};

const topicDetails = {
    "real-time-system": {
        story: `"ধরো তুমি স্টেডিয়ামে খেলা দেখছো। প্রতিবার যখন ব্যাটসম্যান চার মারছে, তুমি সাথে সাথেই চিৎকার করে উঠছো। তোমার এই তাৎক্ষণিক প্রতিক্রিয়া হলো রিয়েল-টাইম সিস্টেম।"`,
        details: `রিয়েল-টাইম সিস্টেম এমন একটি সিস্টেম যা ডেটা জেনারেট হওয়ার সাথে সাথেই তা ইউজারের কাছে পৌঁছে দেয়। এটি সাধারণত WebSocket বা SSE ব্যবহার করে।`,
        advantages: ["Instant updates", "Interactive experience"],
        svg: svgSnippets.realTime
    },
    "notification-system": {
        story: `"ধরো তোমার বাসায় একজন পোস্টম্যান এলো। সে তোমাকে জানালো যে তোমার একটি পার্সেল এসেছে। এই খবর দেওয়াটাই হলো নোটিফিকেশন।"`,
        details: `নোটিফিকেশন সিস্টেম এসএমএস, ইমেল বা পুশ নোটিফিকেশন ম্যানেজ করে। এটি ইউজারের কাছে গুরুত্বপূর্ণ তথ্য সময়মতো পৌঁছে দেয়।`,
        advantages: ["User engagement", "Timely info"],
        svg: svgSnippets.notification
    },
    "url-shortener": {
        story: `"ধরো তোমার বাড়ির ঠিকানা অনেক বড়। তুমি কাউকে সেটি না বলে শুধু বললে 'আমার বাড়ি নীল গেট'। এই নীল গেট কোডটিই হলো ইউআরএল শর্টেনার।"`,
        details: `ইউআরএল শর্টেনার বড় লিঙ্ককে ছোট লিঙ্কে রূপান্তর করে এবং রিডাইরেক্ট করে। এটি ডাটাবেসে ম্যাপ করে রাখে।`,
        advantages: ["Clean links", "Easy sharing"],
        svg: svgSnippets.urlShortener
    },
    "chat-system": {
        story: `"ধরো তুমি এবং তোমার বন্ধু একটি মাঠে বসে কথা বলছো। তুমি যা বলছো সে সাথে সাথে শুনছে। এটিই হলো চ্যাট সিস্টেমের মূল মন্ত্র।"`,
        details: `চ্যাট সিস্টেম রিয়েল-টাইম মেসেজিং নিশ্চিত করে। এটি সাধারণত WebSocket ব্যবহার করে একটি খোলা কানেকশন বজায় রাখে।`,
        advantages: ["Real-time", "Persistent history"],
        svg: svgSnippets.chatSystem
    },
    "video-streaming": {
        story: `"ধরো তুমি একটি বড় বালতি থেকে পানি খাচ্ছো। তুমি পুরো বালতিটা একবারে না গিলে মগ দিয়ে অল্প অল্প করে খাচ্ছো। এটিই হলো ভিডিও স্ট্রিমিং।"`,
        details: `ভিডিও স্ট্রিমিং Adaptive Bitrate এবং চ্যাঙ্কিং ব্যবহার করে ভিডিও দেখায়। পুরো ভিডিও ফাইল ডাউনলোড না করেই ভিডিও দেখা শুরু করা যায়।`,
        advantages: ["Instant play", "Bandwidth efficiency"],
        svg: svgSnippets.videoStreaming
    },
    "ride-sharing": {
        story: `"ধরো তুমি একটি মাঠে দাঁড়িয়ে আছো। তুমি চিৎকার করে বললে 'আমার একটা বাইক লাগবে'। তোমার ১ কিমি এর মধ্যে যারা আছে তারা সবাই শুনতে পেল। এটিই হলো রাইড শেয়ারিং ম্যাচিং।"`,
        details: `রাইড শেয়ারিং সিস্টেম Geo-spatial ইনডেক্সিং ব্যবহার করে ম্যাচিং করে। এটি Quadtree বা S2 ব্যবহার করে দ্রুততম ড্রাইভার খুঁজে বের করে।`,
        advantages: ["Fast matching", "Location tracking"],
        svg: svgSnippets.rideSharing
    },
    "search-system": {
        story: `"ধরো তুমি একটি বিশাল লাইব্রেরিতে গিয়েছো একটি বই খুঁজতে। তুমি যদি প্রতিটি আলমারি চেক করো তবে কয়েকদিন লেগে যাবে। কিন্তু লাইব্রেরিয়ানের কাছে একটি রেজিস্টার আছে যেখানে সব বইয়ের নাম আর লোকেশন লেখা আছে।"`,
        details: `সার্চ ইঞ্জিন সিস্টেম ইনভার্টেড ইনডেক্স ব্যবহার করে ডেটা দ্রুত খুঁজে বের করে। এটি কিউওয়ার্ড দিয়ে সাথে সাথেই রেজাল্ট প্রদান করে।`,
        advantages: ["Fast lookup", "Advanced filtering"],
        svg: svgSnippets.searchSystem
    }
};

// Fill missing default topicDetails if needed
sections.forEach(sec => {
    sec.pages.forEach(p => {
        if (!topicDetails[p.key]) {
            topicDetails[p.key] = {
                story: `"সিস্টেম ডিজাইনের এই পর্বে আমরা শিখবো কিভাবে '${p.title}' কাজ করে।"`,
                details: `${p.title} হলো বড় স্কেলের অ্যাপ্লিকেশনের একটি অবিচ্ছেদ্য অংশ।`,
                advantages: ["Scalability", "Reliability"],
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
            const path = depth === 0 ? `${sec.folder}/${page.file}` : (sec.folder === 'pages' ? page.file : `../interview/${page.file}`);
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

// Generate pages
sections.forEach(sec => {
    sec.pages.forEach(page => {
        const data = topicDetails[page.key];
        const content = `<h1>${page.title}</h1><div class="story-box">${data.story}</div><h2>বিস্তারিত</h2><p>${data.details}</p>${data.svg}<h2>সুবিধা</h2><ul>${data.advantages.map(a => `<li>${a}</li>`).join('')}</ul>`;
        const finalHtml = getTemplate(page.title, content, depth = (sec.folder === 'pages' || sec.folder === 'interview' ? 1 : 0));
        fs.writeFileSync(path.join(rootDir, sec.folder, page.file), finalHtml);
    });
});

// Write Index
const indexContent = `<h1>System Design বাংলায় শিখুন</h1><div class="story-box">"গল্পের ছলে শিখুন সিস্টেম ডিজাইন।"</div>${svgSnippets.generic}`;
fs.writeFileSync(path.join(rootDir, 'index.html'), getTemplate("Home", indexContent, 0));

console.log("Pages 20-25 and others fixed with unique content!");
