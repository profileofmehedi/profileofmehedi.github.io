const fs = require('fs');
const path = require('path');

const qDotnet = require('./questions_dotnet');
const qDatabase = require('./questions_database');
const qFrontend = require('./questions_frontend');
const qSystem = require('./questions_systemdesign');
const qDevops = require('./questions_devops');
const qLeadership = require('./questions_leadership');

const allQuestions = [
  ...qDotnet,
  ...qDatabase,
  ...qFrontend,
  ...qSystem,
  ...qDevops,
  ...qLeadership
];

console.log(`Loaded ${allQuestions.length} total master questions.`);

const juniorCount = allQuestions.filter(q => q.level === 'junior').length;
const midCount = allQuestions.filter(q => q.level === 'mid').length;
const seniorCount = allQuestions.filter(q => q.level === 'senior').length;

const topicHeadersMap = {
  dotnet: {
    icon: 'bi-hash',
    color: 'text-primary',
    title: '১. C# ও .NET কোর এন্টারপ্রাইজ ইঞ্জিনিয়ারিং (CLR, Memory, Concurrency, PGO, SIMD)',
    count: qDotnet.length
  },
  database: {
    icon: 'bi-database-fill-gear',
    color: 'text-info',
    title: '২. এন্টারপ্রাইজ ডাটাবেজ আর্কিটেকচার (SQL Server B-Trees, Postgres MVCC, Oracle, Redis)',
    count: qDatabase.length
  },
  frontend: {
    icon: 'bi-palette-fill',
    color: 'text-danger',
    title: '৩. ফ্রন্টএন্ড এন্টারপ্রাইজ মাস্টারি (Modern CSS3, jQuery Maintenance, Angular 18 Signals)',
    count: qFrontend.length
  },
  systemdesign: {
    icon: 'bi-diagram-3-fill',
    color: 'text-success',
    title: '৪. সিস্টেম ডিজাইন ও হাই-স্কেল ডিস্ট্রিবিউটেড আর্কিটেকচার (Microservices, Kafka, Saga, Outbox)',
    count: qSystem.length
  },
  devops: {
    icon: 'bi-hdd-rack-fill',
    color: 'text-warning',
    title: '৫. সার্ভার ম্যানেজমেন্ট, DevOps ও প্রোডাকশন ক্র্যাশ ডায়াগনস্টিকস (IIS, Linux, Nginx, Docker, K8s)',
    count: qDevops.length
  },
  leadership: {
    icon: 'bi-people-fill',
    color: 'text-dark',
    title: '৬. টেক লিডারশিপ, ইঞ্জিনিয়ারিং স্ট্র্যাটেজি ও STAR ফরম্যাট ইন্টারভিউ (ADR, DORA, FinOps)',
    count: qLeadership.length
  }
};

function generateHtml() {
  let lastTopic = null;
  const cardsHtml = allQuestions.map((item, idx) => {
    let headerHtml = '';
    if (item.topic !== lastTopic) {
      const info = topicHeadersMap[item.topic];
      headerHtml = `                <!-- ======================================================== -->
                <!-- TOPIC: ${item.topic.toUpperCase()} (${info.count} Questions) -->
                <!-- ======================================================== -->
                <div class="topic-heading-group mb-4 ${lastTopic ? 'mt-5 pt-3' : ''}" data-topic-header="${item.topic}">
                    <div class="d-flex align-items-center justify-content-between border-bottom pb-2 mb-3">
                        <div class="d-flex align-items-center gap-2">
                            <i class="bi ${info.icon} fs-3 ${info.color}"></i>
                            <h3 class="fw-bold mb-0 text-primary">${info.title}</h3>
                        </div>
                        <span class="badge bg-primary-subtle text-primary border">${info.count}টি প্রশ্ন</span>
                    </div>
                </div>\n\n`;
      lastTopic = item.topic;
    }

    const levelTagHtml = item.level === 'junior' 
      ? '<span class="level-tag tag-junior">🟢 Junior (0-2 Yrs)</span>'
      : (item.level === 'mid' 
          ? '<span class="level-tag tag-mid">🟡 Mid-Level (2-5 Yrs)</span>'
          : '<span class="level-tag tag-senior">🔴 Senior / Lead (5-7+ Yrs)</span>');

    return `${headerHtml}                <!-- Q${idx + 1} (${item.level}) -->
                <div class="qa-card-box level-${item.level}" data-level="${item.level}" data-topic="${item.topic}">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <span class="topic-badge-pill bg-primary-subtle text-primary border">${item.badge}</span>
                        ${levelTagHtml}
                    </div>
                    <div class="qa-header-row">
                        <h5 class="qa-question-title">${item.q}</h5>
                        <i class="bi bi-chevron-down qa-toggle-icon"></i>
                    </div>
                    <div class="qa-answer-content">
                        ${item.a}
                    </div>
                </div>`;
  }).join('\n\n');

  return `<!DOCTYPE html>
<html lang="bn">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="জুনিয়র, মিড-লেভেল থেকে ৭+ বছরের অভিজ্ঞ সিনিয়র আর্কিটেক্ট ও টেক লিড পদের জন্য সম্পূর্ণ সফটওয়্যার ইঞ্জিনিয়ারিং ইন্টারভিউ ক্র্যাকিং মাস্টার ভল্ট। C# .NET 8/9, SQL, Postgres, Oracle, CSS3, jQuery, Angular 18, System Design ও DevOps।">
    <title>মাস্টার ইঞ্জিনিয়ারিং ইন্টারভিউ ভল্ট (Junior to Senior 7+ Years) | Codex</title>
    <!-- Bootstrap 5 CSS CDN -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Bootstrap Icons CDN -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" rel="stylesheet">
    <!-- Custom CSS -->
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="css/responsive.css">
    
    <style>
        .topic-badge-pill {
            font-size: 0.75rem;
            font-weight: 700;
            padding: 4px 10px;
            border-radius: 6px;
            display: inline-block;
        }
        .level-tag {
            font-size: 0.72rem;
            font-weight: 700;
            padding: 3px 8px;
            border-radius: 4px;
            text-transform: uppercase;
        }
        .tag-junior {
            background: rgba(16, 185, 129, 0.12);
            color: #059669;
            border: 1px solid rgba(16, 185, 129, 0.3);
        }
        .tag-mid {
            background: rgba(245, 158, 11, 0.12);
            color: #d97706;
            border: 1px solid rgba(245, 158, 11, 0.3);
        }
        .tag-senior {
            background: rgba(124, 58, 237, 0.12);
            color: #7c3aed;
            border: 1px solid rgba(124, 58, 237, 0.3);
        }
        .star-box {
            background: rgba(124, 58, 237, 0.05);
            border: 1px dashed var(--primary);
            border-radius: 10px;
            padding: 1rem;
            margin-top: 0.75rem;
        }
        .vault-stat-badge {
            background: rgba(99, 102, 241, 0.1);
            color: var(--primary);
            border: 1px solid rgba(99, 102, 241, 0.2);
            font-size: 0.85rem;
            font-weight: 700;
            padding: 6px 14px;
            border-radius: 20px;
        }
    </style>
</head>
<body>

    <!-- Theme Toggle Input -->
    <input type="checkbox" id="theme-toggle" class="d-none">

    <div class="app-container">

        <!-- Navigation Bar -->
        <nav class="navbar navbar-expand-lg custom-navbar py-3 sticky-top">
            <div class="container">
                <a class="navbar-brand d-flex align-items-center fs-3 fw-bold text-primary text-decoration-none" href="index.html">
                    <span style="background: var(--primary-grad); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                        <i class="bi bi-code-slash me-2"></i>Codex
                    </span>
                </a>
                <div class="collapse navbar-collapse d-none d-lg-block ms-5">
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0 gap-3">
                        <li class="nav-item"><a class="nav-link" href="index.html">হোম</a></li>
                        <li class="nav-item"><a class="nav-link" href="courses.html">টিউটোরিয়ালসমূহ</a></li>
                        <li class="nav-item"><a class="nav-link" href="dashboard.html">ড্যাশবোর্ড</a></li>
                        <li class="nav-item"><a class="nav-link active" href="senior-interview-vault.html">ইন্টারভিউ ভল্ট</a></li>
                        <li class="nav-item"><a class="nav-link" href="blog.html">ব্লগ</a></li>
                    </ul>
                </div>
                <div class="d-flex align-items-center gap-3 ms-auto">
                    <label for="theme-toggle" class="theme-switch-label">
                        <i class="bi bi-sun"></i>
                        <i class="bi bi-moon-stars"></i>
                    </label>
                    <a href="dashboard.html" class="btn btn-premium-outline d-none d-lg-inline-block">ড্যাশবোর্ড</a>
                </div>
            </div>
        </nav>

        <!-- Header Hero Section -->
        <section class="py-5 text-center fade-in-up bg-light-subtle border-bottom">
            <div class="container">
                <div class="d-inline-flex align-items-center gap-2 px-3 py-1.5 rounded-pill border bg-primary-subtle text-primary border-primary-subtle mb-3">
                    <i class="bi bi-patch-check-fill"></i>
                    <span class="fs-7 fw-bold">১৫৫টি প্রোডাকশন ইন্টারভিউ মাস্টার প্রশ্নোত্তর (Junior • Mid • Senior 7+ Years)</span>
                </div>
                <h1 class="display-4 fw-extrabold mb-3">মাস্টার ইঞ্জিনিয়ারিং ইন্টারভিউ ভল্ট</h1>
                <p class="text-muted fs-5 max-w-800 mx-auto mb-4">
                    ফ্রেশার থেকে শুরু করে ৭+ বছরের অভিজ্ঞ সিনিয়র ফুল-স্ট্যাক ইঞ্জিনিয়ার, টেক লিড ও সলিউশন আর্কিটেক্ট পদের সমস্ত লো-লেভেল ইন্টারনালস, প্রোডাকশন ক্র্যাশ ডায়াগনস্টিকস এবং আর্কিটেকচারাল ফ্রেমওয়ার্ক।
                </p>

                <!-- Search Input Bar -->
                <div class="vault-search-container">
                    <i class="bi bi-search vault-search-icon"></i>
                    <input type="text" id="vaultSearchInput" class="vault-search-input" placeholder="যেকোনো বিষয় বা প্রশ্ন খুঁজুন... (যেমন: GC, PGO, SIMD, Deadlock, MVCC, Signals, Kafka, Outbox, dotnet-dump, ADR)">
                    <button id="vaultClearBtn" class="vault-clear-btn" title="মুছে ফেলুন"><i class="bi bi-x-circle-fill"></i></button>
                </div>

                <!-- Level Filter Pills -->
                <div class="level-filter-bar">
                    <button class="level-btn active" data-level="all"><i class="bi bi-grid-fill"></i>সব লেভেল (<span id="count-all">${allQuestions.length}</span>)</button>
                    <button class="level-btn btn-junior" data-level="junior"><i class="bi bi-check-circle-fill"></i>🟢 জুনিয়র (${juniorCount})</button>
                    <button class="level-btn btn-mid" data-level="mid"><i class="bi bi-lightning-fill"></i>🟡 মিড-লেভেল (${midCount})</button>
                    <button class="level-btn btn-senior" data-level="senior"><i class="bi bi-stars"></i>🔴 সিনিয়র ও লিড (${seniorCount})</button>
                </div>

                <!-- Topic Category Badges -->
                <div class="d-flex justify-content-center gap-2 flex-wrap mb-2">
                    <button class="topic-btn badge bg-secondary-subtle text-secondary border px-3 py-2 active" data-topic="all">সব টপিক (${allQuestions.length})</button>
                    <button class="topic-btn badge bg-primary-subtle text-primary border px-3 py-2" data-topic="dotnet">C# ও .NET (${qDotnet.length})</button>
                    <button class="topic-btn badge bg-info-subtle text-info border px-3 py-2" data-topic="database">ডাটাবেজসমূহ (${qDatabase.length})</button>
                    <button class="topic-btn badge bg-danger-subtle text-danger border px-3 py-2" data-topic="frontend">ফ্রন্টএন্ড (${qFrontend.length})</button>
                    <button class="topic-btn badge bg-success-subtle text-success border px-3 py-2" data-topic="systemdesign">সিস্টেম ডিজাইন (${qSystem.length})</button>
                    <button class="topic-btn badge bg-warning-subtle text-warning border px-3 py-2" data-topic="devops">সার্ভার ও DevOps (${qDevops.length})</button>
                    <button class="topic-btn badge bg-dark-subtle text-dark border px-3 py-2" data-topic="leadership">লিডারশিপ ও STAR (${qLeadership.length})</button>
                </div>

                <!-- Expand / Collapse All Controls -->
                <div class="d-flex justify-content-center gap-3 mt-4">
                    <button id="btnExpandAll" class="btn btn-sm btn-premium-outline py-1 px-3"><i class="bi bi-arrows-expand me-1"></i>সব উত্তর উন্মুক্ত করুন</button>
                    <button id="btnCollapseAll" class="btn btn-sm btn-premium-outline py-1 px-3"><i class="bi bi-arrows-collapse me-1"></i>সব উত্তর বন্ধ করুন (সেলফ টেস্ট)</button>
                </div>
            </div>
        </section>

        <!-- Main Questions Container -->
        <main class="container py-5">
            <div class="max-w-900 mx-auto">
                <div id="noResultsMsg" class="alert alert-info text-center py-4 d-none">
                    <i class="bi bi-info-circle display-4 mb-2 d-block text-primary"></i>
                    <h5 class="fw-bold">কোনো প্রশ্ন পাওয়া যায়নি!</h5>
                    <p class="text-muted mb-0">অনুগ্রহ করে ভিন্ন কোনো কি-ওয়ার্ড দিয়ে সার্চ করুন অথবা ফিল্টার পরিবর্তন করুন।</p>
                </div>

${cardsHtml}

            </div>
        </main>

        <!-- Floating Back To Top Button -->
        <button id="btnBackToTop" class="floating-back-to-top" title="উপরে যান">
            <i class="bi bi-arrow-up"></i>
        </button>

        <!-- Mobile App Bottom Navigation Bar (App-Like Experience for Phone Users) -->
        <div class="mobile-bottom-nav">
            <a href="index.html" class="mobile-nav-link">
                <i class="bi bi-house-door"></i>
                <span>হোম</span>
            </a>
            <a href="courses.html" class="mobile-nav-link">
                <i class="bi bi-grid"></i>
                <span>ট্র্যাকসমূহ</span>
            </a>
            <a href="senior-interview-vault.html" class="mobile-nav-link active">
                <i class="bi bi-trophy-fill"></i>
                <span>ইন্টারভিউ</span>
            </a>
            <a href="dashboard.html" class="mobile-nav-link">
                <i class="bi bi-speedometer2"></i>
                <span>ড্যাশবোর্ড</span>
            </a>
            <label for="theme-toggle" class="mobile-nav-link cursor-pointer m-0">
                <i class="bi bi-moon-stars"></i>
                <span>থিম</span>
            </label>
        </div>

        <!-- Footer -->
        <footer class="footer mt-auto">
            <div class="container text-center pt-4 border-top">
                <p class="text-muted mb-0">&copy; 2026 Codex Ltd. সর্বস্বত্ব সংরক্ষিত।</p>
            </div>
        </footer>

    </div>

    <!-- Client-Side Instant Search, Level Filter & Expand Engine (Zero-Dependency) -->
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const searchInput = document.getElementById('vaultSearchInput');
            const clearBtn = document.getElementById('vaultClearBtn');
            const levelBtns = document.querySelectorAll('.level-btn');
            const topicBtns = document.querySelectorAll('.topic-btn');
            const qaCards = document.querySelectorAll('.qa-card-box');
            const topicHeaders = document.querySelectorAll('[data-topic-header]');
            const noResultsMsg = document.getElementById('noResultsMsg');
            const btnExpandAll = document.getElementById('btnExpandAll');
            const btnCollapseAll = document.getElementById('btnCollapseAll');
            const btnBackToTop = document.getElementById('btnBackToTop');

            let currentLevel = 'all';
            let currentTopic = 'all';

            // Floating Back to Top Button
            window.addEventListener('scroll', function() {
                if (window.scrollY > 300) {
                    btnBackToTop.classList.add('visible');
                } else {
                    btnBackToTop.classList.remove('visible');
                }
            });

            btnBackToTop.addEventListener('click', function() {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });

            // Toggle Individual Card on click
            qaCards.forEach(card => {
                const header = card.querySelector('.qa-header-row');
                header.addEventListener('click', () => {
                    card.classList.toggle('expanded');
                });
            });

            // Expand / Collapse All
            btnExpandAll.addEventListener('click', () => {
                qaCards.forEach(c => c.classList.add('expanded'));
            });
            btnCollapseAll.addEventListener('click', () => {
                qaCards.forEach(c => c.classList.remove('expanded'));
            });

            // Search filter logic
            function filterVault() {
                const query = searchInput.value.toLowerCase().trim();
                let visibleCount = 0;

                qaCards.forEach(card => {
                    const cardLevel = card.getAttribute('data-level');
                    const cardTopic = card.getAttribute('data-topic');
                    const text = card.textContent.toLowerCase();

                    const matchesLevel = (currentLevel === 'all' || cardLevel === currentLevel);
                    const matchesTopic = (currentTopic === 'all' || cardTopic === currentTopic);
                    const matchesSearch = (!query || text.includes(query));

                    if (matchesLevel && matchesTopic && matchesSearch) {
                        card.style.display = 'block';
                        visibleCount++;
                    } else {
                        card.style.display = 'none';
                    }
                });

                // Handle topic section headers visibility
                topicHeaders.forEach(header => {
                    const topic = header.getAttribute('data-topic-header');
                    const matchingVisible = Array.from(qaCards).some(c => c.getAttribute('data-topic') === topic && c.style.display !== 'none');
                    header.style.display = matchingVisible ? 'block' : 'none';
                });

                // No results message
                if (visibleCount === 0) {
                    noResultsMsg.classList.remove('d-none');
                } else {
                    noResultsMsg.classList.add('d-none');
                }

                // Clear button visibility
                if (query.length > 0) {
                    clearBtn.style.display = 'block';
                } else {
                    clearBtn.style.display = 'none';
                }
            }

            // Search input listeners
            searchInput.addEventListener('input', filterVault);
            clearBtn.addEventListener('click', () => {
                searchInput.value = '';
                searchInput.focus();
                filterVault();
            });

            // Level Buttons listener
            levelBtns.forEach(btn => {
                btn.addEventListener('click', function() {
                    levelBtns.forEach(b => b.classList.remove('active'));
                    this.classList.add('active');
                    currentLevel = this.getAttribute('data-level');
                    filterVault();
                });
            });

            // Topic Buttons listener
            topicBtns.forEach(btn => {
                btn.addEventListener('click', function() {
                    topicBtns.forEach(b => b.classList.remove('active'));
                    this.classList.add('active');
                    currentTopic = this.getAttribute('data-topic');
                    filterVault();
                });
            });

            // Initial count
            document.getElementById('count-all').textContent = qaCards.length;
        });
    </script>

</body>
</html>`;
}

// Generate senior-interview-vault.html and interview-vault.html
const content = generateHtml();
fs.writeFileSync(path.join(__dirname, '..', 'senior-interview-vault.html'), content, 'utf8');
fs.writeFileSync(path.join(__dirname, '..', 'interview-vault.html'), content, 'utf8');

console.log(`Successfully generated senior-interview-vault.html and interview-vault.html with ${allQuestions.length} master questions!`);
