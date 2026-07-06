/* =====================================================
   CODING DROP — BLOG JAVASCRIPT
   ===================================================== */

// ============================================================
//  STATE
// ============================================================
let activeCategory = 'all';
let currentPosts = [...POSTS];
let currentPage = 1;
const POSTS_PER_PAGE = 6;

// ============================================================
//  INIT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initHeader();
    initReadingProgress();
    renderFeaturedPost();
    renderCategoryPills();
    renderBlogGrid(POSTS);
    renderFooterCategories();
    initSearch();
    initScrollTop();
    updateArticleCount();
});

// ============================================================
//  HEADER SCROLL
// ============================================================
function initHeader() {
    const header = document.getElementById('blog-header');
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 30);
    }, { passive: true });
}

// ============================================================
//  READING PROGRESS BAR
// ============================================================
function initReadingProgress() {
    const bar = document.getElementById('reading-progress');
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        bar.style.width = `${pct}%`;
    }, { passive: true });
}

// ============================================================
//  FEATURED POST
// ============================================================
function renderFeaturedPost() {
    const featured = POSTS.find(p => p.featured) || POSTS[0];
    const catInfo = CATEGORIES[featured.category] || CATEGORIES.all;
    const container = document.getElementById('featured-post');

    const catColorMap = {
        architecture: '#58e6c8', performance: '#fb923c', frontend: '#38bdf8',
        backend: '#a78bfa', database: '#4ade80', devops: '#f472b6',
    };
    const catColor = catColorMap[featured.category] || '#58e6c8';

    const rightPanel = featured.thumbnail
        ? `<div class="featured-illustration" style="padding:0;overflow:hidden;border-radius:var(--radius-lg);background:none;border:1px solid var(--border);position:relative;">
               <img src="${featured.thumbnail}" alt="${featured.title}"
                    style="position:absolute;top:0;left:0;width:100%;height:100%;object-fit:fill;display:block;border-radius:var(--radius-lg);">
           </div>`
        : `<div class="featured-illustration bg-${featured.category}">
               <i class="${featured.featuredIcon || featured.icon} fi-icon"></i>
               <span class="fi-label">// featured_post.${featured.category}</span>
           </div>`;

    container.innerHTML = `
        <div class="featured-post-left">
            <span class="featured-badge"><i class="fas fa-star"></i> Featured Article</span>
            <h2>${featured.title}</h2>
            <p>${featured.excerpt}</p>
            <div class="featured-meta">
                <span><i class="fas fa-calendar-alt"></i> ${featured.date}</span>
                <span><i class="fas fa-clock"></i> ${featured.readTime} read</span>
                <span style="color:${catColor};"><i class="fas fa-tag"></i> ${catInfo.label}</span>
            </div>
            <a href="#" class="read-btn" onclick="openPost('${featured.slug}'); return false;">
                Read Article <i class="fas fa-arrow-right"></i>
            </a>
        </div>
        ${rightPanel}
    `;
}


// ============================================================
//  CATEGORY PILLS
// ============================================================
function renderCategoryPills() {
    const container = document.getElementById('category-pills');
    container.innerHTML = '';

    // Collect categories from posts
    const usedCats = ['all', ...new Set(POSTS.map(p => p.category))];

    usedCats.forEach(cat => {
        const info = CATEGORIES[cat];
        if (!info) return;
        const count = cat === 'all' ? POSTS.length : POSTS.filter(p => p.category === cat).length;
        const btn = document.createElement('button');
        btn.className = `pill${cat === activeCategory ? ' active' : ''}`;
        btn.dataset.cat = cat;
        btn.textContent = `${info.label} (${count})`;
        btn.addEventListener('click', () => filterByCategory(cat));
        container.appendChild(btn);
    });
}

// ============================================================
//  FILTER
// ============================================================
function filterByCategory(cat) {
    activeCategory = cat;
    currentPage = 1; // Reset to page 1 on filter change

    // Update pills
    document.querySelectorAll('.pill').forEach(p => {
        p.classList.toggle('active', p.dataset.cat === cat);
    });

    const filtered = cat === 'all' ? POSTS : POSTS.filter(p => p.category === cat);
    renderBlogGrid(filtered);
}

function resetFilters() {
    filterByCategory('all');
}

// ============================================================
//  BLOG GRID
// ============================================================
function renderBlogGrid(posts) {
    const grid = document.getElementById('blog-grid');
    const empty = document.getElementById('empty-state');
    const info = document.getElementById('results-count');
    const pagination = document.getElementById('pagination-container');

    if (posts.length === 0) {
        grid.innerHTML = '';
        empty.style.display = 'block';
        info.innerHTML = `<strong>0</strong> articles found`;
        pagination.innerHTML = '';
        return;
    }

    empty.style.display = 'none';

    // Calculate pagination values
    const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
    if (currentPage > totalPages) currentPage = totalPages;
    if (currentPage < 1) currentPage = 1;

    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    const paginatedPosts = posts.slice(startIndex, startIndex + POSTS_PER_PAGE);

    const label = activeCategory === 'all' ? 'total' : `in <strong>${CATEGORIES[activeCategory]?.label}</strong>`;
    info.innerHTML = `Showing <strong>${startIndex + 1} - ${Math.min(startIndex + paginatedPosts.length, posts.length)}</strong> of <strong>${posts.length}</strong> article${posts.length !== 1 ? 's' : ''} ${label}`;

    grid.innerHTML = paginatedPosts.map((post, idx) => buildCard(post, idx)).join('');

    // Stagger animation
    const cards = grid.querySelectorAll('.blog-card');
    cards.forEach((card, i) => {
        card.style.animationDelay = `${i * 0.06}s`;
    });

    // Render controls
    renderPaginationControls(posts.length, totalPages);
}

function renderPaginationControls(totalItems, totalPages) {
    const container = document.getElementById('pagination-container');
    if (totalPages <= 1) {
        container.innerHTML = '';
        return;
    }

    let html = '';

    // Prev
    html += `<button class="pagination-btn" ${currentPage === 1 ? 'disabled' : ''} onclick="changePage(${currentPage - 1})"><i class="fas fa-chevron-left"></i> Prev</button>`;

    // Page Numbers
    for (let i = 1; i <= totalPages; i++) {
        html += `<button class="pagination-btn pagination-number ${currentPage === i ? 'active' : ''}" onclick="changePage(${i})">${i}</button>`;
    }

    // Next
    html += `<button class="pagination-btn" ${currentPage === totalPages ? 'disabled' : ''} onclick="changePage(${currentPage + 1})">Next <i class="fas fa-chevron-right"></i></button>`;

    container.innerHTML = html;
}

function changePage(page) {
    currentPage = page;
    const filtered = activeCategory === 'all' ? POSTS : POSTS.filter(p => p.category === activeCategory);
    renderBlogGrid(filtered);

    // Smooth scroll to blog filter/content area
    const filterBar = document.querySelector('.filters-bar');
    if (filterBar) {
        filterBar.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function buildCard(post, idx) {
    const catInfo = CATEGORIES[post.category] || CATEGORIES.all;
    const tagsHTML = post.tags.map(t => `<span class="tag">${t}</span>`).join('');

    const catColorMap = {
        architecture: '#58e6c8',
        performance: '#fb923c',
        frontend: '#38bdf8',
        backend: '#a78bfa',
        database: '#4ade80',
        devops: '#f472b6',
    };
    const catColor = catColorMap[post.category] || '#58e6c8';

    const cardTop = post.thumbnail
        ? `<div class="card-top card-top-img" style="background:none;padding:0;overflow:hidden;position:relative;">
               <img src="${post.thumbnail}" alt="${post.title}" style="position:absolute;top:0;left:0;width:100%;height:100%;object-fit:fill;display:block;">
               <span style="position:absolute;top:12px;left:12px;background:rgba(10,13,20,0.88);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);padding:5px 12px;border-radius:20px;font-size:0.72rem;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:#ffffff;border:1px solid rgba(255,255,255,0.15);border-left:3px solid ${catColor};z-index:2;">
                   ${catInfo.label}
               </span>
           </div>`
        : `<div class="card-top bg-${post.category}">
               <i class="${post.icon} card-top-icon ${catInfo.colorClass}"></i>
           </div>`;

    return `
        <article class="blog-card glass-card" onclick="openPost('${post.slug}')" tabindex="0" role="button" aria-label="Read: ${post.title}" style="position:relative;">
            ${cardTop}
            <div class="card-body">
                <span class="card-cat ${catInfo.colorClass}">${catInfo.label}</span>
                <h3 class="card-title">${post.title}</h3>
                <p class="card-excerpt">${post.excerpt}</p>
                <div class="card-tags">${tagsHTML}</div>
                <div class="card-footer">
                    <div class="card-meta">
                        <span><i class="fas fa-calendar-alt"></i> ${post.date}</span>
                        <span><i class="fas fa-clock"></i> ${post.readTime}</span>
                    </div>
                    <span class="card-read-btn">
                        Read <i class="fas fa-arrow-right"></i>
                    </span>
                </div>
            </div>
        </article>
    `;
}


// ============================================================
//  OPEN POST — Navigate to post details page
// ============================================================
function openPost(slug) {
    window.location.href = `post.html?slug=${slug}`;
}

// ============================================================
//  TOAST NOTIFICATION
// ============================================================
function showToast(msg) {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = msg;
    toast.style.cssText = `
        position: fixed;
        bottom: 80px;
        left: 50%;
        transform: translateX(-50%) translateY(20px);
        background: rgba(22, 27, 38, 0.95);
        border: 1px solid rgba(88, 230, 200, 0.3);
        color: #e6edf3;
        padding: 14px 24px;
        border-radius: 50px;
        font-size: 0.88rem;
        font-weight: 500;
        z-index: 9999;
        backdrop-filter: blur(20px);
        box-shadow: 0 8px 32px rgba(0,0,0,0.4);
        opacity: 0;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        white-space: nowrap;
        font-family: 'Inter', sans-serif;
    `;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(-50%) translateY(0)';
    });

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(10px)';
        setTimeout(() => toast.remove(), 300);
    }, 3200);
}

// ============================================================
//  SEARCH
// ============================================================
function initSearch() {
    const toggleBtn = document.getElementById('search-toggle-btn');
    const closeBtn = document.getElementById('search-close-btn');
    const overlay = document.getElementById('search-overlay');
    const input = document.getElementById('search-input');
    const results = document.getElementById('search-results');

    toggleBtn.addEventListener('click', () => {
        overlay.classList.add('active');
        setTimeout(() => input.focus(), 100);
    });

    closeBtn.addEventListener('click', closeSearch);

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeSearch();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeSearch();
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            overlay.classList.add('active');
            setTimeout(() => input.focus(), 100);
        }
    });

    input.addEventListener('input', () => {
        const q = input.value.trim().toLowerCase();
        if (!q) { results.innerHTML = ''; return; }

        const matches = POSTS.filter(p =>
            p.title.toLowerCase().includes(q) ||
            p.excerpt.toLowerCase().includes(q) ||
            p.tags.some(t => t.toLowerCase().includes(q)) ||
            (CATEGORIES[p.category]?.label || '').toLowerCase().includes(q)
        );

        if (matches.length === 0) {
            results.innerHTML = `<div class="search-no-results"><i class="fas fa-ghost" style="font-size:2rem;margin-bottom:12px;display:block;"></i>No articles found for "<strong>${input.value}</strong>"</div>`;
            return;
        }

        results.innerHTML = matches.map(p => `
            <div class="search-result-item" onclick="closeSearch(); openPost('${p.slug}')">
                <span class="sri-cat">${CATEGORIES[p.category]?.label || p.category}</span>
                <div>
                    <h4>${highlightMatch(p.title, q)}</h4>
                    <p>${highlightMatch(p.excerpt.substring(0, 100), q)}...</p>
                </div>
            </div>
        `).join('');
    });
}

function closeSearch() {
    const overlay = document.getElementById('search-overlay');
    const input = document.getElementById('search-input');
    const results = document.getElementById('search-results');
    overlay.classList.remove('active');
    input.value = '';
    results.innerHTML = '';
}

function highlightMatch(text, query) {
    if (!query) return text;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<mark style="background:rgba(88,230,200,0.2);color:#58e6c8;border-radius:3px;padding:0 2px;">$1</mark>');
}

// ============================================================
//  FOOTER CATEGORIES
// ============================================================
function renderFooterCategories() {
    const container = document.getElementById('footer-cats');
    const cats = [...new Set(POSTS.map(p => p.category))];
    container.innerHTML = cats.map(cat => {
        const info = CATEGORIES[cat];
        return `<li><a href="#" onclick="filterByCategory('${cat}'); closeSearch(); return false;">${info?.label || cat}</a></li>`;
    }).join('');
}

// ============================================================
//  SCROLL TO TOP
// ============================================================
function initScrollTop() {
    const btn = document.getElementById('scroll-top');
    window.addEventListener('scroll', () => {
        btn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ============================================================
//  THEME TOGGLE
// ============================================================
function initTheme() {
    const html = document.documentElement;
    const btn = document.getElementById('theme-toggle-btn');

    // Load saved preference, default to 'dark'
    const saved = localStorage.getItem('blog-theme') || 'dark';
    html.setAttribute('data-theme', saved);

    if (!btn) return;

    btn.addEventListener('click', () => {
        const current = html.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', next);
        localStorage.setItem('blog-theme', next);

        // Update toast colors dynamically
        const label = next === 'light' ? '☀️ Light mode on' : '🌙 Dark mode on';
        showToast(label);
    });
}

// ============================================================
//  NEWSLETTER
// ============================================================
function handleNewsletter(e) {
    e.preventDefault();
    const form = document.getElementById('newsletter-form');
    const success = document.getElementById('newsletter-success');
    const email = document.getElementById('newsletter-email').value;

    if (!email) return;

    form.style.display = 'none';
    success.style.display = 'block';
    showToast('✅ You\'re subscribed! Welcome aboard.');
}

// ============================================================
//  ARTICLE COUNT STAT
// ============================================================
function updateArticleCount() {
    const el = document.getElementById('total-articles');
    if (!el) return;
    const target = POSTS.length;
    let count = 0;
    const step = Math.ceil(target / 20);
    const timer = setInterval(() => {
        count = Math.min(count + step, target);
        el.textContent = count;
        if (count >= target) clearInterval(timer);
    }, 50);
}
