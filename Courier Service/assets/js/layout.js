const Layout = {
    activePage: '', // Store active page state

    init: function(activePage) {
        this.activePage = activePage;
        Localization.init().then(() => {
            this.renderSidebar(activePage);
            this.renderNavbar();
        });
    },

    renderSidebar: function(activePage) {
        // Helper to get text safely
        const t = (key) => Localization.getText(key);

        const sidebar = `
        <div class="sidebar" id="sidebar">
            <div class="sidebar-header">
                <a href="dashboard.html" class="sidebar-brand">
                    <i class="fas fa-shipping-fast"></i> ${t('app_name')}
                </a>
            </div>
            <ul class="sidebar-menu">
                <li><a href="dashboard.html" class="${activePage === 'dashboard' ? 'active' : ''}"><i class="fas fa-tachometer-alt"></i> ${t('dashboard')}</a></li>
                <li><a href="booking.html" class="${activePage === 'booking' ? 'active' : ''}"><i class="fas fa-box-open"></i> ${t('book_parcel')}</a></li>
                <li><a href="pickups.html" class="${activePage === 'pickups' ? 'active' : ''}"><i class="fas fa-truck-pickup"></i> ${t('pickup_requests')}</a></li>
                <li><a href="parcel_list.html" class="${activePage === 'parcels' ? 'active' : ''}"><i class="fas fa-list"></i> ${t('all_shipments')}</a></li>
                <li><a href="tracking.html" class="${activePage === 'tracking' ? 'active' : ''}"><i class="fas fa-map-marker-alt"></i> ${t('track_parcel')}</a></li>
                <li><a href="riders.html" class="${activePage === 'riders' ? 'active' : ''}"><i class="fas fa-biking"></i> ${t('riders_force')}</a></li>
                <li><a href="rider_payroll.html" class="${activePage === 'payroll' ? 'active' : ''}"><i class="fas fa-money-check-alt"></i> ${t('rider_payroll')}</a></li>
                <li><a href="hub_management.html" class="${activePage === 'hub' ? 'active' : ''}"><i class="fas fa-building"></i> ${t('hub_management')}</a></li>
                <li><a href="fleet.html" class="${activePage === 'fleet' ? 'active' : ''}"><i class="fas fa-truck-moving"></i> ${t('fleet_manager')}</a></li>
                <li><a href="sms_logs.html" class="${activePage === 'sms' ? 'active' : ''}"><i class="fas fa-sms"></i> ${t('sms_logs')}</a></li>
                <li><a href="merchant_portal.html" class="${activePage === 'merchant' ? 'active' : ''}"><i class="fas fa-store"></i> ${t('merchants')}</a></li>
                <li><a href="marketing.html" class="${activePage === 'marketing' ? 'active' : ''}"><i class="fas fa-tags"></i> ${t('marketing')}</a></li>
                <li><a href="accounts.html" class="${activePage === 'accounts' ? 'active' : ''}"><i class="fas fa-file-invoice-dollar"></i> ${t('accounts_cod')}</a></li>
                <li><a href="returns.html" class="${activePage === 'returns' ? 'active' : ''}"><i class="fas fa-undo"></i> ${t('return_management')}</a></li>
                <li><a href="reports.html" class="${activePage === 'reports' ? 'active' : ''}"><i class="fas fa-chart-bar"></i> ${t('reports')}</a></li>
                <li><a href="fraud_check.html" class="${activePage === 'fraud' ? 'active' : ''}"><i class="fas fa-user-shield"></i> ${t('fraud_check')}</a></li>
                <li><a href="tickets.html" class="${activePage === 'tickets' ? 'active' : ''}"><i class="fas fa-headset"></i> ${t('support_tickets')}</a></li>
                <li><a href="api_docs.html" class="${activePage === 'api' ? 'active' : ''}"><i class="fas fa-code"></i> ${t('developer_api')}</a></li>
                <li><a href="settings.html" class="${activePage === 'settings' ? 'active' : ''}"><i class="fas fa-cogs"></i> ${t('settings')}</a></li>
                <li style="margin-top: 20px; border-top: 1px solid rgba(255,255,255,0.1);">
                    <a href="index.html"><i class="fas fa-sign-out-alt"></i> ${t('logout')}</a>
                </li>
            </ul>
        </div>`;
        
        // Remove existing sidebar if any (re-rendering)
        const existingSidebar = document.getElementById('sidebar');
        if (existingSidebar) existingSidebar.remove();

        document.body.insertAdjacentHTML('afterbegin', sidebar);
        
        // Ensure main-content wrapper exists
        const content = document.querySelector('.container-fluid') || document.querySelector('.content-wrapper');
        if(content && !content.parentNode.classList.contains('main-content')) {
             const wrapper = document.createElement('div');
             wrapper.className = 'main-content';
             content.parentNode.insertBefore(wrapper, content);
             wrapper.appendChild(content);
        }
    },

    renderNavbar: function() {
        const mainContent = document.querySelector('.main-content');
        if(!mainContent || document.querySelector('.top-navbar')) return; // Avoid duplicate navbar

        const navbar = `
        <div class="top-navbar">
            <div class="d-flex align-items-center">
                <button class="btn btn-light d-md-none me-2" id="sidebarToggle"><i class="fas fa-bars"></i></button>
                <h5 class="mb-0 text-muted">Courier Management System (BD)</h5>
            </div>
            <div class="d-flex align-items-center gap-3">
                <button class="btn btn-sm btn-outline-primary" id="langToggleBtn" onclick="Localization.toggle()">বাংলা</button>
                <div class="dropdown">
                    <a href="#" class="text-secondary position-relative me-3">
                        <i class="fas fa-bell fa-lg"></i>
                        <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style="font-size: 0.5rem;">3</span>
                    </a>
                </div>
                <div class="d-flex align-items-center">
                    <img src="https://ui-avatars.com/api/?name=Admin+User&background=random" class="rounded-circle me-2" width="35">
                    <div>
                        <small class="d-block fw-bold">Admin</small>
                        <small class="text-muted" style="font-size: 0.7rem;">Head Office</small>
                    </div>
                </div>
            </div>
        </div>`;
        mainContent.insertAdjacentHTML('afterbegin', navbar);

        // Toggle logic
        document.getElementById('sidebarToggle')?.addEventListener('click', () => {
            document.getElementById('sidebar').classList.toggle('active');
        });
    }
};