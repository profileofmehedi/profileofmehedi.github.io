const App = {
    init: function() {
        this.renderLayout();
        this.setupEvents();
    },

    renderLayout: function() {
        // Only render if .sidebar container exists (i.e., not login page)
        if ($('.sidebar').length === 0) return;

        const user = DB.getCurrentUser();
        if (!user) return;

        // Render Sidebar Menu based on Role
        let menuItems = '';
        
        if (user.role === 'super-admin') {
            menuItems = `
                <a href="dashboard.html" class="${this.isActive('dashboard.html')}"><i class="fas fa-tachometer-alt"></i> <span>Dashboard</span></a>
                <a href="ngos.html" class="${this.isActive('ngos.html')}"><i class="fas fa-building"></i> <span>NGOs</span></a>
                <a href="plans.html" class="${this.isActive('plans.html')}"><i class="fas fa-tags"></i> <span>Plans</span></a>
                <a href="billing.html" class="${this.isActive('billing.html')}"><i class="fas fa-file-invoice-dollar"></i> <span>Billing</span></a>
            `;
        } else if (user.role === 'ngo-admin') {
            menuItems = `
                <a href="dashboard.html" class="${this.isActive('dashboard.html')}"><i class="fas fa-tachometer-alt"></i> <span>Dashboard</span></a>
                <a href="branches.html" class="${this.isActive('branches.html')}"><i class="fas fa-code-branch"></i> <span>Branches</span></a>
                <a href="products.html" class="${this.isActive('products.html')}"><i class="fas fa-box"></i> <span>Loan Products</span></a>
                <a href="members.html" class="${this.isActive('members.html')}"><i class="fas fa-users"></i> <span>Members</span></a>
                <a href="loans.html" class="${this.isActive('loans.html')}"><i class="fas fa-hand-holding-usd"></i> <span>Loans</span></a>
                <a href="loan-approvals.html" class="${this.isActive('loan-approvals.html')}"><i class="fas fa-check-circle"></i> <span>Loan Approvals</span></a>
            `;
        } else if (user.role === 'branch') {
            menuItems = `
                <a href="dashboard.html" class="${this.isActive('dashboard.html')}"><i class="fas fa-tachometer-alt"></i> <span>Dashboard</span></a>
                <a href="officers.html" class="${this.isActive('officers.html')}"><i class="fas fa-user-tie"></i> <span>Field Officers</span></a>
                <a href="members.html" class="${this.isActive('members.html')}"><i class="fas fa-users"></i> <span>Members</span></a>
            `;
        } else if (user.role === 'officer') {
            menuItems = `
                <a href="dashboard.html" class="${this.isActive('dashboard.html')}"><i class="fas fa-tachometer-alt"></i> <span>Dashboard</span></a>
                <a href="apply-loan.html" class="${this.isActive('apply-loan.html')}"><i class="fas fa-file-signature"></i> <span>Apply Loan</span></a>
                <a href="pending-disbursement.html" class="${this.isActive('pending-disbursement.html')}"><i class="fas fa-hand-holding-usd"></i> <span>Disbursement</span></a>
                <a href="collection.html" class="${this.isActive('collection.html')}"><i class="fas fa-money-bill-wave"></i> <span>Collection</span></a>
            `;
        } else if (user.role === 'member') {
            menuItems = `
                <a href="dashboard.html" class="${this.isActive('dashboard.html')}"><i class="fas fa-tachometer-alt"></i> <span>Dashboard</span></a>
            `;
        }

        const sidebarContent = `
            <div class="brand"><i class="fas fa-hand-holding-heart"></i> <span>NGO CLOUD</span></div>
            <div class="sidebar-nav">
                ${menuItems}
            </div>
            <div class="sidebar-footer">
                <div class="d-flex align-items-center text-white-50 small">
                    <i class="fas fa-shield-alt"></i> <span class="ms-2">Secure</span>
                </div>
            </div>
        `;
        $('.sidebar').html(sidebarContent);

        // Render Navbar
        const navbarContent = `
            <div class="toggle-btn" id="sidebarToggle">
                <i class="fas fa-bars"></i>
            </div>
            <h5>${this.getPageTitle()}</h5>
            <div class="user-menu dropdown">
                <a href="#" class="text-dark text-decoration-none dropdown-toggle" data-bs-toggle="dropdown">
                    <i class="fas fa-user-circle"></i> ${user.name} (${user.role})
                </a>
                <ul class="dropdown-menu dropdown-menu-end">
                    <li><a class="dropdown-item" href="#" id="logoutBtn">Logout</a></li>
                </ul>
            </div>
        `;
        $('#topNavbar').html(navbarContent);
    },

    isActive: function(page) {
        return window.location.pathname.includes(page) ? 'active' : '';
    },

    getPageTitle: function() {
        // Simple title extractor
        return document.title.split('-')[0].trim();
    },

    setupEvents: function() {
        // Sidebar Toggle Logic
        $(document).on('click', '#sidebarToggle', function() {
            if (window.innerWidth > 992) {
                $('.sidebar').toggleClass('collapsed');
                $('.main-content').toggleClass('expanded');
            } else {
                $('.sidebar').toggleClass('open');
            }
        });

        // Re-bind logout because it was dynamically added
        $(document).on('click', '#logoutBtn', function(e) {
            e.preventDefault();
            DB.logout();
        });
    }
};

$(document).ready(function() {
    App.init();
});
