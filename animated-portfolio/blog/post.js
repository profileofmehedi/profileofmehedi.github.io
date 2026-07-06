/* =====================================================
   CODING DROP — POST PAGE JAVASCRIPT
   ===================================================== */

// ============================================================
//  STATE
// ============================================================
let currentPostId = null;
let currentPost = null;

const AVATAR_COLORS = [
    'linear-gradient(135deg,#58e6c8,#a78bfa)',
    'linear-gradient(135deg,#38bdf8,#818cf8)',
    'linear-gradient(135deg,#f472b6,#fb923c)',
    'linear-gradient(135deg,#4ade80,#38bdf8)',
    'linear-gradient(135deg,#fb923c,#f472b6)',
    'linear-gradient(135deg,#a78bfa,#38bdf8)',
];

// ============================================================
//  INIT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initHeader();
    initReadingProgress();
    initScrollTop();
    loadPost();
});

// ============================================================
//  LOAD POST FROM URL PARAM
// ============================================================
function loadPost() {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get('slug');

    if (!slug) {
        showNotFound();
        return;
    }

    const post = POSTS.find(p => p.slug === slug);
    if (!post) {
        showNotFound();
        return;
    }

    currentPostId = post.id;
    currentPost = post;

    // Fetch dynamic content on-demand from separate JSON file
    fetch(`posts/${slug}/post.json`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load content for slug: ${slug}`);
            }
            return response.json();
        })
        .then(data => {
            post.content = data.content;
            renderPost(post);
            incrementViewCount(post.id);
            initRating(post.id);
            initComments(post.id);
            renderRelatedPosts(post);
            renderMoreArticles(post);
            updateShareLinks(post);
        })
        .catch(err => {
            console.error('Error loading post content:', err);
            showNotFound();
        });
}

function showNotFound() {
    document.getElementById('post-wrapper').style.display = 'none';
    document.getElementById('post-not-found').style.display = 'block';
}

// ============================================================
//  RENDER POST
// ============================================================
function renderPost(post) {
    const cat = CATEGORIES[post.category] || CATEGORIES.all;

    // Meta tags
    document.getElementById('page-title').textContent = `${post.title} | CodingDrop`;
    document.getElementById('page-desc').setAttribute('content', post.excerpt);

    // SEO, Open Graph & Canonical
    const url = window.location.href;
    const imageUrl = new URL(post.thumbnail, window.location.href).href;
    
    document.getElementById('page-canonical').href = url;
    document.getElementById('og-title').setAttribute('content', post.title);
    document.getElementById('og-desc').setAttribute('content', post.excerpt);
    document.getElementById('og-url').setAttribute('content', url);
    document.getElementById('og-image').setAttribute('content', imageUrl);
    
    document.getElementById('tw-title').setAttribute('content', post.title);
    document.getElementById('tw-desc').setAttribute('content', post.excerpt);
    document.getElementById('tw-image').setAttribute('content', imageUrl);

    // Inject JSON-LD Schema
    const schema = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": post.title,
        "image": imageUrl,
        "datePublished": new Date(post.date).toISOString(),
        "author": {
            "@type": "Person",
            "name": "Mehedi Hasan",
            "url": "https://linkedin.com/in/mehedi9339"
        },
        "publisher": {
            "@type": "Organization",
            "name": "CodingDrop",
            "logo": {
                "@type": "ImageObject",
                "url": new URL("../mehedi.png", window.location.href).href
            }
        },
        "description": post.excerpt
    };

    let script = document.getElementById('schema-jsonld');
    if (!script) {
        script = document.createElement('script');
        script.id = 'schema-jsonld';
        script.type = 'application/ld+json';
        document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(schema);

    // Hero
    document.getElementById('bc-category').textContent = cat.label;

    const badge = document.getElementById('post-category-badge');
    badge.textContent = cat.label;
    badge.className = `post-category-badge ${cat.colorClass}`;
    badge.style.background = getCatBgColor(post.category);
    badge.style.borderColor = getCatBorderColor(post.category);
    badge.style.color = getCatTextColor(post.category);

    document.getElementById('post-title').textContent = post.title;
    document.getElementById('post-excerpt').textContent = post.excerpt;
    document.getElementById('post-date').textContent = post.date;
    document.getElementById('post-readtime').textContent = post.readTime;

    // Icon
    const iconEl = document.getElementById('post-icon-el');
    iconEl.className = `${post.icon} post-hero-icon-i`;
    document.getElementById('post-hero-icon').className = `post-hero-icon bg-${post.category}`;

    // Tags
    const tagsHTML = post.tags.map(t => `<span class="tag">${t}</span>`).join('');
    document.getElementById('post-tags').innerHTML = tagsHTML;
    document.getElementById('article-footer-tags').innerHTML = tagsHTML;

    // Article body
    document.getElementById('article-body').innerHTML = post.content || '<p>Full article coming soon...</p>';
}

// ============================================================
//  VIEW COUNT
// ============================================================
function incrementViewCount(id) {
    const key = `blog_views_${id}`;
    const current = parseInt(localStorage.getItem(key) || '0');
    const next = current + 1;
    localStorage.setItem(key, next);
    document.getElementById('post-views').textContent = formatNumber(next);
}

function formatNumber(n) {
    if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
    return n.toString();
}

// ============================================================
//  RATING SYSTEM
// ============================================================
function initRating(postId) {
    const ratingsKey = `blog_ratings_${postId}`;
    const userRatingKey = `blog_user_rating_${postId}`;

    let ratings = JSON.parse(localStorage.getItem(ratingsKey) || '[]');
    const userRating = parseInt(localStorage.getItem(userRatingKey) || '0');

    const stars = document.querySelectorAll('.star-btn');

    // If user already rated, show their rating
    if (userRating > 0) {
        setStarDisplay(userRating);
        showUserRatedMsg(userRating);
        disableStars();
    }

    // Hover effects
    stars.forEach(star => {
        star.addEventListener('mouseenter', () => {
            if (userRating > 0) return;
            const val = parseInt(star.dataset.rating);
            highlightStars(val);
        });

        star.addEventListener('mouseleave', () => {
            if (userRating > 0) return;
            clearStarHighlight();
        });

        star.addEventListener('click', () => {
            if (userRating > 0) return;
            const val = parseInt(star.dataset.rating);

            // Save rating
            ratings.push(val);
            localStorage.setItem(ratingsKey, JSON.stringify(ratings));
            localStorage.setItem(userRatingKey, val.toString());

            setStarDisplay(val);
            showUserRatedMsg(val);
            disableStars();
            renderRatingSummary(ratings);

            showToast(`⭐ Thank you for rating ${val} star${val > 1 ? 's' : ''}!`);
        });
    });

    renderRatingSummary(ratings);
}

function highlightStars(upTo) {
    document.querySelectorAll('.star-btn').forEach(s => {
        const val = parseInt(s.dataset.rating);
        s.classList.toggle('hovered', val <= upTo);
    });
}

function clearStarHighlight() {
    document.querySelectorAll('.star-btn').forEach(s => s.classList.remove('hovered'));
}

function setStarDisplay(rating) {
    document.querySelectorAll('.star-btn').forEach(s => {
        const val = parseInt(s.dataset.rating);
        s.classList.toggle('rated', val <= rating);
    });
}

function disableStars() {
    document.querySelectorAll('.star-btn').forEach(s => {
        s.style.cursor = 'default';
        s.addEventListener('mouseenter', e => e.stopPropagation(), true);
    });
}

function showUserRatedMsg(rating) {
    const msg = document.getElementById('user-rated-msg');
    document.getElementById('user-rating-val').textContent = rating;
    document.getElementById('user-rating-plural').textContent = rating > 1 ? 's' : '';
    msg.style.display = 'block';
}

function renderRatingSummary(ratings) {
    const avgEl = document.getElementById('rating-avg');
    const countEl = document.getElementById('rating-count');
    const barsEl = document.getElementById('rating-bars');

    if (ratings.length === 0) {
        avgEl.textContent = '—';
        countEl.textContent = 'No ratings yet';
        barsEl.innerHTML = '';
        return;
    }

    const avg = ratings.reduce((a, b) => a + b, 0) / ratings.length;
    avgEl.textContent = avg.toFixed(1);
    countEl.textContent = `${ratings.length} rating${ratings.length > 1 ? 's' : ''}`;

    // Distribution bars (5 down to 1)
    barsEl.innerHTML = [5, 4, 3, 2, 1].map(star => {
        const count = ratings.filter(r => r === star).length;
        const pct = ratings.length > 0 ? (count / ratings.length) * 100 : 0;
        return `
            <div class="rating-bar-row">
                <span class="bar-label">${star}★</span>
                <div class="rating-bar-track">
                    <div class="rating-bar-fill" style="width:${pct}%"></div>
                </div>
                <span class="bar-count">${count}</span>
            </div>
        `;
    }).join('');
}

// ============================================================
//  COMMENTS SYSTEM
// ============================================================
function initComments(postId) {
    const textarea = document.getElementById('comment-text');
    const charCount = document.getElementById('char-count');

    // Char counter
    textarea.addEventListener('input', () => {
        const len = textarea.value.length;
        charCount.textContent = `${len} / 1000`;
        charCount.classList.toggle('over', len > 1000);
    });

    loadComments(postId);
}

function loadComments(postId) {
    const key = `blog_comments_${postId}`;
    const comments = JSON.parse(localStorage.getItem(key) || '[]');
    renderComments(comments);
}

function renderComments(comments) {
    const list = document.getElementById('comments-list');
    const noComments = document.getElementById('no-comments');
    const badge = document.getElementById('comment-count-badge');

    badge.textContent = comments.length;

    if (comments.length === 0) {
        list.innerHTML = '';
        noComments.style.display = 'block';
        return;
    }

    noComments.style.display = 'none';
    list.innerHTML = comments.map((c, i) => {
        const initials = c.name.split(' ').map(w => w[0]).join('').toUpperCase().substring(0, 2);
        const color = AVATAR_COLORS[i % AVATAR_COLORS.length];
        const timeAgo = getTimeAgo(c.timestamp);

        return `
            <div class="comment-item" style="animation-delay:${i * 0.06}s">
                <div class="comment-header">
                    <div class="comment-author">
                        <div class="comment-avatar" style="background:${color};">${initials}</div>
                        <div>
                            <div class="comment-name">${escapeHtml(c.name)}</div>
                            <div class="comment-date">${timeAgo}</div>
                        </div>
                    </div>
                </div>
                <p class="comment-text">${escapeHtml(c.text)}</p>
            </div>
        `;
    }).join('');
}

function submitComment(e) {
    e.preventDefault();

    const name = document.getElementById('comment-name').value.trim();
    const text = document.getElementById('comment-text').value.trim();
    const btn = document.getElementById('comment-submit-btn');

    if (!name || !text) return;
    if (text.length > 1000) {
        showToast('⚠️ Comment must be under 1000 characters.');
        return;
    }

    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Posting...';

    setTimeout(() => {
        const key = `blog_comments_${currentPostId}`;
        const comments = JSON.parse(localStorage.getItem(key) || '[]');

        const newComment = {
            name,
            text,
            timestamp: Date.now()
        };

        comments.unshift(newComment); // newest first
        localStorage.setItem(key, JSON.stringify(comments));

        // Reset form
        document.getElementById('comment-form').reset();
        document.getElementById('char-count').textContent = '0 / 1000';

        // Re-render
        renderComments(comments);

        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-paper-plane"></i> Post Comment';

        showToast('💬 Comment posted successfully!');

        // Scroll to comment list
        document.getElementById('comments-list').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 600);
}

// ============================================================
//  RELATED POSTS
// ============================================================
function renderRelatedPosts(post) {
    const related = POSTS
        .filter(p => p.id !== post.id && p.category === post.category)
        .slice(0, 3);

    const fallback = POSTS
        .filter(p => p.id !== post.id)
        .slice(0, 3 - related.length);

    const all = [...related, ...fallback].slice(0, 3);
    const container = document.getElementById('related-list');

    if (all.length === 0) {
        container.innerHTML = '<p style="font-size:0.82rem;color:var(--text-muted);">No related articles yet.</p>';
        return;
    }

    container.innerHTML = all.map(p => {
        const cat = CATEGORIES[p.category] || CATEGORIES.all;
        return `
            <div class="related-item" onclick="goToPost('${p.slug}')">
                <div class="related-icon bg-${p.category}">
                    <i class="${p.icon} ${cat.colorClass}"></i>
                </div>
                <div class="related-text">
                    <h4>${p.title}</h4>
                    <span>${p.readTime} read · ${cat.label}</span>
                </div>
            </div>
        `;
    }).join('');
}

// ============================================================
//  MORE ARTICLES
// ============================================================
function renderMoreArticles(post) {
    const others = POSTS
        .filter(p => p.id !== post.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);

    const grid = document.getElementById('more-articles-grid');

    const catColorMap = {
        all: '#58e6c8',
        architecture: '#58e6c8',
        performance: '#fb923c',
        frontend: '#38bdf8',
        backend: '#a78bfa',
        database: '#4ade80',
        devops: '#f472b6',
    };

    grid.innerHTML = others.map((p, i) => {
        const cat = CATEGORIES[p.category] || CATEGORIES.all;
        const tagsHTML = p.tags.slice(0, 2).map(t => `<span class="tag">${t}</span>`).join('');
        const catColor = catColorMap[p.category] || '#58e6c8';

        const cardTop = p.thumbnail
            ? `<div class="card-top card-top-img" style="background:none;padding:0;overflow:hidden;position:relative;">
                   <img src="${p.thumbnail}" alt="${p.title}" style="position:absolute;top:0;left:0;width:100%;height:100%;object-fit:fill;display:block;">
                   <span style="position:absolute;top:12px;left:12px;background:rgba(10,13,20,0.88);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);padding:5px 12px;border-radius:20px;font-size:0.72rem;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:#ffffff;border:1px solid rgba(255,255,255,0.15);border-left:3px solid ${catColor};z-index:2;">
                       ${cat.label}
                   </span>
               </div>`
            : `<div class="card-top bg-${p.category}">
                   <i class="${p.icon} card-top-icon ${cat.colorClass}"></i>
               </div>`;

        return `
            <article class="blog-card glass-card" onclick="goToPost('${p.slug}')" tabindex="0" role="button" style="animation-delay:${i*0.08}s">
                ${cardTop}
                <div class="card-body">
                    <span class="card-cat ${cat.colorClass}">${cat.label}</span>
                    <h3 class="card-title">${p.title}</h3>
                    <p class="card-excerpt">${p.excerpt}</p>
                    <div class="card-tags">${tagsHTML}</div>
                    <div class="card-footer">
                        <div class="card-meta">
                            <span><i class="fas fa-calendar-alt"></i> ${p.date}</span>
                            <span><i class="fas fa-clock"></i> ${p.readTime}</span>
                        </div>
                        <span class="card-read-btn">Read <i class="fas fa-arrow-right"></i></span>
                    </div>
                </div>
            </article>
        `;
    }).join('');
}

// ============================================================
//  SHARE LINKS
// ============================================================
function updateShareLinks(post) {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(post.title);
    document.getElementById('share-twitter').href = `https://twitter.com/intent/tweet?text=${title}&url=${url}`;
    document.getElementById('share-linkedin').href = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
}

function copyLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
        showToast('🔗 Link copied to clipboard!');
    });
}

// ============================================================
//  NAVIGATION
// ============================================================
function goToPost(slug) {
    window.location.href = `post.html?slug=${slug}`;
}

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
//  SCROLL TO TOP
// ============================================================
function initScrollTop() {
    const btn = document.getElementById('scroll-top');
    if (!btn) return;
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
    const saved = localStorage.getItem('blog-theme') || 'dark';
    html.setAttribute('data-theme', saved);
    if (!btn) return;
    btn.addEventListener('click', () => {
        const current = html.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', next);
        localStorage.setItem('blog-theme', next);
        showToast(next === 'light' ? '☀️ Light mode on' : '🌙 Dark mode on');
    });
}

// ============================================================
//  TOAST
// ============================================================
function showToast(msg) {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = msg;
    toast.style.cssText = `
        position:fixed; bottom:80px; left:50%;
        transform:translateX(-50%) translateY(20px);
        background:rgba(22,27,38,0.97);
        border:1px solid rgba(88,230,200,0.3);
        color:#e6edf3; padding:12px 24px;
        border-radius:50px; font-size:0.88rem;
        font-weight:500; z-index:9999;
        backdrop-filter:blur(20px);
        box-shadow:0 8px 32px rgba(0,0,0,0.4);
        opacity:0; transition:all 0.3s cubic-bezier(0.4,0,0.2,1);
        white-space:nowrap; font-family:'Inter',sans-serif;
        pointer-events:none;
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
    }, 3000);
}

// ============================================================
//  HELPERS
// ============================================================
function escapeHtml(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function getTimeAgo(timestamp) {
    const diff = Date.now() - timestamp;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins} min ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} hr${hrs > 1 ? 's' : ''} ago`;
    const days = Math.floor(hrs / 24);
    if (days < 30) return `${days} day${days > 1 ? 's' : ''} ago`;
    return new Date(timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function getCatBgColor(cat) {
    const map = {
        architecture: 'rgba(88,230,200,0.1)',
        performance:  'rgba(251,146,60,0.1)',
        frontend:     'rgba(56,189,248,0.1)',
        backend:      'rgba(167,139,250,0.1)',
        database:     'rgba(74,222,128,0.1)',
        devops:       'rgba(244,114,182,0.1)',
    };
    return map[cat] || 'rgba(88,230,200,0.1)';
}

function getCatBorderColor(cat) {
    const map = {
        architecture: 'rgba(88,230,200,0.25)',
        performance:  'rgba(251,146,60,0.25)',
        frontend:     'rgba(56,189,248,0.25)',
        backend:      'rgba(167,139,250,0.25)',
        database:     'rgba(74,222,128,0.25)',
        devops:       'rgba(244,114,182,0.25)',
    };
    return map[cat] || 'rgba(88,230,200,0.25)';
}

function getCatTextColor(cat) {
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    const map = {
        architecture: isDark ? '#58e6c8' : '#0ea5a0',
        performance:  isDark ? '#fb923c' : '#ea580c',
        frontend:     isDark ? '#38bdf8' : '#0284c7',
        backend:      isDark ? '#a78bfa' : '#7c3aed',
        database:     isDark ? '#4ade80' : '#16a34a',
        devops:       isDark ? '#f472b6' : '#db2777',
    };
    return map[cat] || (isDark ? '#58e6c8' : '#0ea5a0');
}
