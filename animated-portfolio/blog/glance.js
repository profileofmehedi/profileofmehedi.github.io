/* =====================================================
   CODING DROP — ALL AT A GLANCE DRAWER
   ===================================================== */

const GLANCE_CAT_COLORS = {
    architecture: '#58e6c8',
    performance: '#fb923c',
    frontend: '#38bdf8',
    backend: '#a78bfa',
    database: '#4ade80',
    devops: '#f472b6',
    sqa: '#f59e0b',
};

let glanceCurrentSlug = null;
let glanceExpandedCategories = null;

function getGlanceCurrentSlug() {
    if (!window.location.pathname.includes('post.html')) return null;
    return new URLSearchParams(window.location.search).get('slug');
}

function initGlanceDrawer() {
    if (typeof POSTS === 'undefined' || !POSTS.length) return;

    glanceCurrentSlug = getGlanceCurrentSlug();
    glanceExpandedCategories = new Set(
        POSTS.length > 35
            ? (glanceCurrentSlug
                ? [POSTS.find(p => p.slug === glanceCurrentSlug)?.category].filter(Boolean)
                : [])
            : [...new Set(POSTS.map(p => p.category))]
    );

    const toggleBtn = document.getElementById('glance-toggle-btn');
    const closeBtn = document.getElementById('glance-close-btn');
    const backdrop = document.getElementById('glance-backdrop');
    const filterInput = document.getElementById('glance-filter-input');

    if (!toggleBtn) return;

    renderGlanceDrawer(POSTS);

    toggleBtn.addEventListener('click', () => {
        if (typeof closeSearch === 'function') closeSearch();
        openGlanceDrawer();
    });

    closeBtn?.addEventListener('click', closeGlanceDrawer);
    backdrop?.addEventListener('click', closeGlanceDrawer);

    filterInput?.addEventListener('input', () => {
        const q = filterInput.value.trim().toLowerCase();
        if (!q) {
            renderGlanceDrawer(POSTS);
            return;
        }

        const filtered = POSTS.filter(p =>
            p.title.toLowerCase().includes(q) ||
            p.tags.some(t => t.toLowerCase().includes(q)) ||
            (CATEGORIES[p.category]?.label || '').toLowerCase().includes(q)
        );

        if (filtered.length) {
            filtered.forEach(p => glanceExpandedCategories.add(p.category));
        }
        renderGlanceDrawer(filtered, q);
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeGlanceDrawer();
    });
}

function openGlanceDrawer() {
    const drawer = document.getElementById('glance-drawer');
    const backdrop = document.getElementById('glance-backdrop');
    if (!drawer || !backdrop) return;

    drawer.classList.add('active');
    backdrop.classList.add('active');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.classList.add('glance-open');

    const input = document.getElementById('glance-filter-input');
    if (input) {
        input.value = '';
        renderGlanceDrawer(POSTS);
        setTimeout(() => input.focus(), 200);
    }

    if (glanceCurrentSlug) {
        const active = drawer.querySelector('.glance-link.active');
        active?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
}

function closeGlanceDrawer() {
    const drawer = document.getElementById('glance-drawer');
    const backdrop = document.getElementById('glance-backdrop');
    if (!drawer || !backdrop) return;

    drawer.classList.remove('active');
    backdrop.classList.remove('active');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('glance-open');
}

function toggleGlanceCategory(cat) {
    if (glanceExpandedCategories.has(cat)) {
        glanceExpandedCategories.delete(cat);
    } else {
        glanceExpandedCategories.add(cat);
    }
    const q = document.getElementById('glance-filter-input')?.value.trim().toLowerCase() || '';
    const posts = q
        ? POSTS.filter(p =>
            p.title.toLowerCase().includes(q) ||
            p.tags.some(t => t.toLowerCase().includes(q)) ||
            (CATEGORIES[p.category]?.label || '').toLowerCase().includes(q)
        )
        : POSTS;
    renderGlanceDrawer(posts, q);
}

function renderGlanceDrawer(posts, query = '') {
    const body = document.getElementById('glance-body');
    const countEl = document.getElementById('glance-count');
    if (!body) return;

    if (countEl) countEl.textContent = posts.length;

    if (posts.length === 0) {
        body.innerHTML = `
            <div class="glance-empty">
                <i class="fas fa-ghost"></i>
                <p>No articles found${query ? ` for "<strong>${escapeGlanceHtml(query)}</strong>"` : ''}</p>
            </div>`;
        return;
    }

    const grouped = {};
    posts.forEach(post => {
        if (!grouped[post.category]) grouped[post.category] = [];
        grouped[post.category].push(post);
    });

    Object.keys(grouped).forEach(cat => {
        grouped[cat].sort((a, b) => b.id - a.id);
    });

    const catOrder = Object.keys(grouped).sort((a, b) => {
        const labelA = CATEGORIES[a]?.label || a;
        const labelB = CATEGORIES[b]?.label || b;
        return labelA.localeCompare(labelB);
    });

    body.innerHTML = catOrder.map(cat => {
        const info = CATEGORIES[cat] || { label: cat };
        const color = GLANCE_CAT_COLORS[cat] || '#58e6c8';
        const expanded = glanceExpandedCategories.has(cat);
        const items = grouped[cat].map(post => {
            const active = post.slug === glanceCurrentSlug ? ' active' : '';
            const title = query ? highlightGlanceMatch(post.title, query) : escapeGlanceHtml(post.title);
            return `
                <a href="post.html?slug=${post.slug}" class="glance-link${active}">
                    <span class="glance-link-dot" style="background:${color}"></span>
                    <span class="glance-link-title">${title}</span>
                    <span class="glance-link-date">${post.date}</span>
                </a>`;
        }).join('');

        return `
            <div class="glance-category${expanded ? ' expanded' : ''}">
                <button type="button" class="glance-category-header" onclick="toggleGlanceCategory('${cat}')" aria-expanded="${expanded}">
                    <span class="glance-category-label" style="border-left-color:${color}">
                        ${escapeGlanceHtml(info.label)}
                        <span class="glance-category-count">${grouped[cat].length}</span>
                    </span>
                    <i class="fas fa-chevron-down glance-category-chevron"></i>
                </button>
                <div class="glance-category-items">${items}</div>
            </div>`;
    }).join('');
}

function highlightGlanceMatch(text, query) {
    const safe = escapeGlanceHtml(text);
    if (!query) return safe;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return safe.replace(regex, '<mark>$1</mark>');
}

function escapeGlanceHtml(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

document.addEventListener('DOMContentLoaded', initGlanceDrawer);
