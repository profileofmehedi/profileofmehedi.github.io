let masteredNotes = JSON.parse(localStorage.getItem('masteredNotes')) || [];

$(document).ready(function() {
    initSidebarState();
    renderLayout();
    initTheme();
    updateDashboardStats();

    // Desktop Toggle
    $(document).on('click', '#desktopSidebarToggle', function(e) {
        e.preventDefault();
        $('body').toggleClass('sidebar-collapsed');
        localStorage.setItem('sidebarState', $('body').hasClass('sidebar-collapsed') ? 'collapsed' : 'expanded');
    });

    // Theme Toggle
    $(document).on('change', '#themeToggle', function() {
        const isDark = $(this).is(':checked');
        $('body').toggleClass('theme-dark', isDark).toggleClass('theme-light', !isDark);
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });

    // Search
    $(document).on('input', '#noteSearch', function() {
        const query = $(this).val().toLowerCase();
        $('.accordion-item').each(function() {
            const text = $(this).text().toLowerCase();
            $(this).toggle(text.includes(query));
        });
    });

    // Mastered Toggle
    $(document).on('click', '.btn-mastered', function(e) {
        e.stopPropagation();
        const id = $(this).data('id');
        if (masteredNotes.includes(id)) {
            masteredNotes = masteredNotes.filter(m => m !== id);
        } else {
            masteredNotes.push(id);
        }
        localStorage.setItem('masteredNotes', JSON.stringify(masteredNotes));
        
        $(this).closest('.accordion-item').toggleClass('is-mastered');
        $(this).toggleClass('btn-outline-success btn-success').text(masteredNotes.includes(id) ? 'Mastered!' : 'Mark as Mastered');
        
        updateProgress();
        updateDashboardStats();
    });

    if (typeof CURRENT_CATEGORY !== 'undefined') {
        renderNotes(CURRENT_CATEGORY);
    }
});

function initSidebarState() {
    if (localStorage.getItem('sidebarState') === 'collapsed') {
        $('body').addClass('sidebar-collapsed');
    }
}

function initTheme() {
    const isDark = localStorage.getItem('theme') === 'dark';
    $('body').toggleClass('theme-dark', isDark).toggleClass('theme-light', !isDark);
    $('#themeToggle').prop('checked', isDark);
}

function renderLayout() {
    const isRoot = !window.location.pathname.includes('/pages/');
    const logoPath = isRoot ? '#' : '../index.html';
    const basePath = isRoot ? 'pages/' : '';

    const navbarHtml = `
    <nav class="navbar navbar-expand-lg main-nav shadow-sm">
        <div class="container-fluid">
            <div class="d-flex align-items-center">
                <button class="btn btn-link me-2 d-none d-lg-block p-0 text-decoration-none" id="desktopSidebarToggle">
                    <i class="bi bi-list fs-3" style="color: var(--accent-color);"></i>
                </button>
                <a class="navbar-brand fw-bold" href="${logoPath}">
                    <span style="color: var(--accent-color);"><i class="bi bi-journal-code"></i> SE</span> Notes
                </a>
            </div>
            <div class="d-flex align-items-center">
                <div class="form-check form-switch me-3">
                    <input class="form-check-input" type="checkbox" id="themeToggle">
                    <label class="form-check-label small" for="themeToggle"><i class="bi bi-moon-stars-fill"></i></label>
                </div>
                <button class="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#sidebarOffcanvas">
                    <span class="navbar-toggler-icon"></span>
                </button>
            </div>
            <div class="collapse navbar-collapse">
                <div class="ms-auto d-flex align-items-center">
                    <div class="progress me-3" style="width: 150px; height: 8px;">
                        <div id="overallProgress" class="progress-bar bg-success" role="progressbar"></div>
                    </div>
                    <span id="overallProgressText" class="small fw-bold opacity-75">0%</span>
                </div>
            </div>
        </div>
    </nav>`;

    let categoriesHtml = '';
    Object.keys(interviewData).forEach(cat => {
        const item = interviewData[cat];
        const isActive = typeof CURRENT_CATEGORY !== 'undefined' && CURRENT_CATEGORY === cat;
        const linkPath = isRoot ? `pages/${item.path}` : item.path;

        categoriesHtml += `
            <li class="nav-item">
                <a class="nav-link ${isActive ? 'active' : ''}" href="${linkPath}" style="--cat-color: ${item.color}">
                    <i class="bi ${item.icon} me-2"></i> <span>${cat}</span>
                </a>
            </li>`;
    });

    const sidebarHtml = `
    <nav id="sidebar">
        <div class="pt-3">
            <h6 class="sidebar-heading px-3 mb-3 text-muted text-uppercase small">Expertise</h6>
            <ul class="nav flex-column">${categoriesHtml}</ul>
        </div>
    </nav>
    <div class="offcanvas offcanvas-start" tabindex="-1" id="sidebarOffcanvas">
        <div class="offcanvas-header border-bottom">
            <h5 class="offcanvas-title fw-bold">Menu</h5>
            <button type="button" class="btn-close" data-bs-dismiss="offcanvas"></button>
        </div>
        <div class="offcanvas-body p-0">
            <ul class="nav flex-column mt-2">${categoriesHtml}</ul>
        </div>
    </div>`;

    $('#nav-container').html(navbarHtml);
    $('#sidebar-container').html(sidebarHtml);
    updateProgress();
}

function renderNotes(category) {
    const notes = interviewData[category].notes;
    const $container = $('#notesContainer');
    let html = '<div class="accordion" id="notesAccordion">';
    notes.forEach((note, i) => {
        const isMastered = masteredNotes.includes(note.id);
        html += `
            <div class="accordion-item ${isMastered ? 'is-mastered' : ''} fade-in-up" style="animation-delay: ${i*0.05}s">
                <h2 class="accordion-header">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#c-${i}">
                        ${note.title} ${isMastered ? '<span class="ms-2 badge bg-success">Mastered</span>' : ''}
                    </button>
                </h2>
                <div id="c-${i}" class="accordion-collapse collapse" data-bs-parent="#notesAccordion">
                    <div class="accordion-body">
                        <p style="white-space: pre-line;">${note.content}</p>
                        ${note.code ? `<pre><code>${escapeHtml(note.code)}</code></pre>` : ''}
                        <div class="mt-3 text-end">
                            <button class="btn btn-sm ${isMastered ? 'btn-success' : 'btn-outline-success'} btn-mastered" data-id="${note.id}">
                                ${isMastered ? 'Mastered!' : 'Mark as Mastered'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>`;
    });
    $container.html(html + '</div>');
}

function updateProgress() {
    let total = 0;
    Object.keys(interviewData).forEach(c => total += interviewData[c].notes.length);
    const mastered = masteredNotes.length;
    const percent = Math.round((mastered / total) * 100);
    $('#overallProgress').css('width', percent + '%');
    $('#overallProgressText').text(percent + '%');
}

function updateDashboardStats() {
    let total = 0;
    Object.keys(interviewData).forEach(c => total += interviewData[c].notes.length);
    $('#dashTotalNotes').text(total);
    $('#dashMasteredNotes').text(masteredNotes.length);
}

function escapeHtml(text) {
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
