/**
 * FCommerce SPA App Controller - Advanced Command Center & Activity System
 */
const App = {
    activityLogs: [],
    
    init() {
        $(window).on('hashchange', () => this.handleRoute());
        this.handleRoute();
        this.initLiveSimulation();
        this.initCommandCenter();
        this.logActivity('System', 'Application initialized', 'info');
    },

    async handleRoute() {
        const hash = window.location.hash || '#dashboard';
        const viewName = hash.replace('#', '');
        this.showSkeleton();
        await new Promise(r => setTimeout(r, 400));
        
        if (ViewRegistry[viewName]) {
            $('#main-content').html(ViewRegistry[viewName].render());
            ViewRegistry[viewName].init();
            this.logActivity('Navigation', `Navigated to ${viewName}`, 'primary');
        } else {
            $('#main-content').html('<div class="p-4 text-center"><h4>View coming soon</h4></div>');
        }
        $('.sidebar-menu li').removeClass('active');
        $(`.sidebar-menu li a[href="#${viewName}"]`).parent().addClass('active');
    },

    // --- Command Center (CMD+K) Logic ---
    initCommandCenter() {
        $(document).on('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                $('#commandCenter').modal('show');
            }
        });

        $('#commandCenter').on('shown.bs.modal', () => $('#commandInput').focus());

        $('#commandInput').on('input', (e) => {
            const query = e.target.value.toLowerCase();
            this.renderCommandResults(query);
        });
    },

    renderCommandResults(query) {
        const commands = [
            { icon: 'fa-th-large', text: 'Go to Dashboard', action: () => window.location.hash = '#dashboard' },
            { icon: 'fa-shopping-cart', text: 'Go to Orders', action: () => window.location.hash = '#orders' },
            { icon: 'fa-moon', text: 'Toggle Dark Mode', action: () => UI.toggleTheme() },
            { icon: 'fa-plus', text: 'Create New Order', action: () => window.location.hash = '#orders' },
            { icon: 'fa-robot', text: 'Ask AI Assistant', action: () => window.location.hash = '#ai' },
            { icon: 'fa-sign-out-alt', text: 'Logout System', action: () => StorageManager.logout() }
        ];

        const filtered = commands.filter(c => c.text.toLowerCase().includes(query));
        let html = '';
        filtered.forEach((c, i) => {
            html += `<div class="command-item" onclick="App.execCommand(${i})">
                <i class="fas ${c.icon} me-3"></i> <span>${c.text}</span>
            </div>`;
        });
        
        // Add dynamic search results from data (optional expansion)
        if (query.length > 1) {
            const products = StorageManager.getCollection('products').filter(p => p.name.toLowerCase().includes(query));
            products.forEach(p => {
                html += `<div class="command-item" onclick="window.location.hash='#inventory'">
                    <i class="fas fa-box me-3 text-muted"></i> <span>Product: ${p.name}</span>
                </div>`;
            });
        }

        $('#commandResults').html(html || '<div class="p-3 text-center text-muted">No results found</div>');
        this.currentCommands = filtered;
    },

    execCommand(index) {
        const cmd = this.currentCommands[index];
        if (cmd) {
            cmd.action();
            $('#commandCenter').modal('hide');
            $('#commandInput').val('');
        }
    },

    // --- Activity Feed Logic ---
    toggleActivityFeed() {
        $('#activityFeed').toggleClass('active');
        $('#content').toggleClass('feed-active');
    },

    logActivity(user, message, type) {
        const log = { user, message, type, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
        this.activityLogs.unshift(log);
        if (this.activityLogs.length > 20) this.activityLogs.pop();
        this.renderActivityFeed();
    },

    renderActivityFeed() {
        let html = '';
        this.activityLogs.forEach(l => {
            html += `<div class="mb-3 border-start border-${l.type} border-3 ps-2">
                <div class="d-flex justify-content-between">
                    <span class="fw-bold smaller">${l.user}</span>
                    <span class="text-muted" style="font-size: 0.7rem;">${l.time}</span>
                </div>
                <div class="text-muted smaller">${l.message}</div>
            </div>`;
        });
        $('#activityList').html(html);
    },

    // --- UI Helpers ---
    showSkeleton() {
        $('#main-content').html(`
            <div class="p-4 animate__animated animate__fadeIn">
                <div class="skeleton mb-4" style="height: 40px; width: 200px;"></div>
                <div class="row g-4 mb-4">${'<div class="col-md-3"><div class="card skeleton" style="height: 100px;"></div></div>'.repeat(4)}</div>
                <div class="card skeleton" style="height: 400px;"></div>
            </div>
        `);
    },

    showPageInstructions() {
        const hash = window.location.hash || '#dashboard';
        const viewName = hash.replace('#', '');
        const view = ViewRegistry[viewName];
        if (view && view.instructions) {
            $('#modalTitle').text(`${viewName.charAt(0).toUpperCase() + viewName.slice(1)} Instructions`);
            $('#modalBody').html(view.instructions);
            new bootstrap.Modal(document.getElementById('instructionModal')).show();
        }
    },

    initLiveSimulation() {
        setInterval(() => {
            const events = [
                { t: 'New Order', m: 'Order #ORD-998 confirmed for $499', s: 'success', user: 'System' },
                { t: 'Stock Alert', m: 'iPhone 15 Pro stock low', s: 'danger', user: 'Inventory' },
                { t: 'Customer Chat', m: 'Emma Watson sent a message', s: 'info', user: 'ChatBot' }
            ];
            const e = events[Math.floor(Math.random() * events.length)];
            UI.showToast(e.t, e.m, e.s);
            this.logActivity(e.user, e.m, e.s);
        }, 45000);
    }
};

const ViewRegistry = {
    dashboard: {
        instructions: `<ul class="list-group list-group-flush small">
            <li class="list-group-item"><i class="fas fa-check-circle text-success me-2"></i><b>KPI Overview:</b> Track real-time revenue and orders.</li>
            <li class="list-group-item"><i class="fas fa-keyboard text-primary me-2"></i><b>Shortcut:</b> Press <kbd>Ctrl+K</kbd> to open the Command Center.</li>
        </ul>`,
        render: () => `
            <div class="p-4 animate__animated animate__fadeIn">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h4 class="fw-bold m-0">Dashboard Overview</h4>
                    <button class="btn btn-outline-dark btn-sm" onclick="App.toggleActivityFeed()">
                        <i class="fas fa-list-ul me-1"></i> Activity Feed
                    </button>
                </div>
                <div class="row g-4 mb-4">
                    <div class="col-md-3"><div class="card stat-card border-start border-primary border-4"><div class="stat-icon bg-primary bg-opacity-10 text-primary"><i class="fas fa-dollar-sign"></i></div><div><h6 class="text-muted small mb-1">Total Revenue</h6><h4 class="fw-bold mb-0">$12,450</h4></div></div></div>
                    <div class="col-md-3"><div class="card stat-card border-start border-success border-4"><div class="stat-icon bg-success bg-opacity-10 text-success"><i class="fas fa-shopping-cart"></i></div><div><h6 class="text-muted small mb-1">Total Orders</h6><h4 class="fw-bold mb-0">1,240</h4></div></div></div>
                    <div class="col-md-3"><div class="card stat-card border-start border-warning border-4"><div class="stat-icon bg-warning bg-opacity-10 text-warning"><i class="fas fa-clock"></i></div><div><h6 class="text-muted small mb-1">Pending Orders</h6><h4 class="fw-bold mb-0">18</h4></div></div></div>
                    <div class="col-md-3"><div class="card stat-card border-start border-info border-4"><div class="stat-icon bg-info bg-opacity-10 text-info"><i class="fas fa-users"></i></div><div><h6 class="text-muted small mb-1">Active Users</h6><h4 class="fw-bold mb-0">48</h4></div></div></div>
                </div>
                <div class="row g-4">
                    <div class="col-lg-8"><div class="card p-4"><h6>Sales Performance</h6><canvas id="salesChart"></canvas></div></div>
                    <div class="col-lg-4"><div class="card p-4"><h6>Quick Insights</h6><div id="ai-insight"></div></div></div>
                </div>
            </div>
        `,
        init: () => {
            const ctx = document.getElementById('salesChart').getContext('2d');
            new Chart(ctx, {
                type: 'line',
                data: { labels: ['Oct 21', 'Oct 22', 'Oct 23', 'Oct 24', 'Oct 25', 'Oct 26', 'Oct 27'], datasets: [{ label: 'Revenue', data: [800, 1200, 950, 1700, 1400, 2100, 1900], borderColor: '#6366f1', tension: 0.4, fill: true, backgroundColor: 'rgba(99, 102, 241, 0.05)' }] },
                options: { responsive: true, maintainAspectRatio: false }
            });
            setTimeout(() => $('#ai-insight').html('<div class="alert alert-info py-2 small"><b>AI Tip:</b> MacBook sales are up 20% today.</div>'), 1000);
        }
    },
    orders: {
        instructions: `<p>Manage your orders and export data to CSV.</p>`,
        render: () => `<div class="p-4"><h4>Orders</h4><div id="orders-list"></div></div>`,
        init: () => { /* Render logic */ }
    },
    // ... other views (omitted for brevity, assume they are there)
    ai: {
        render: () => `<div class="p-4"><h4>AI Assistant</h4></div>`,
        init: () => {}
    }
};

$(document).ready(() => App.init());
