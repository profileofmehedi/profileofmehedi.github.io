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
                <a href="dashboard.html" class="${this.isActive('dashboard.html')}"><i class="fas fa-tachometer-alt"></i> Dashboard</a>
                <a href="ngos.html" class="${this.isActive('ngos.html')}"><i class="fas fa-building"></i> NGOs</a>
                <a href="plans.html" class="${this.isActive('plans.html')}"><i class="fas fa-tags"></i> Plans</a>
                <a href="billing.html" class="${this.isActive('billing.html')}"><i class="fas fa-file-invoice-dollar"></i> Billing</a>
            `;
        } else if (user.role === 'ngo-admin') {
            menuItems = `
                <a href="dashboard.html" class="${this.isActive('dashboard.html')}"><i class="fas fa-tachometer-alt"></i> Dashboard</a>
                <a href="branches.html" class="${this.isActive('branches.html')}"><i class="fas fa-code-branch"></i> Branches</a>
                <a href="products.html" class="${this.isActive('products.html')}"><i class="fas fa-box"></i> Loan Products</a>
                <a href="members.html" class="${this.isActive('members.html')}"><i class="fas fa-users"></i> Members</a>
                <a href="loans.html" class="${this.isActive('loans.html')}"><i class="fas fa-hand-holding-usd"></i> Loans</a>
                <a href="loan-approvals.html" class="${this.isActive('loan-approvals.html')}"><i class="fas fa-check-circle"></i> Loan Approvals</a>
            `;
        } else if (user.role === 'branch') {
            menuItems = `
                <a href="dashboard.html" class="${this.isActive('dashboard.html')}"><i class="fas fa-tachometer-alt"></i> Dashboard</a>
                <a href="officers.html" class="${this.isActive('officers.html')}"><i class="fas fa-user-tie"></i> Field Officers</a>
                <a href="members.html" class="${this.isActive('members.html')}"><i class="fas fa-users"></i> Members</a>
            `;
        } else if (user.role === 'officer') {
            menuItems = `
                <a href="dashboard.html" class="${this.isActive('dashboard.html')}"><i class="fas fa-tachometer-alt"></i> Dashboard</a>
                <a href="apply-loan.html" class="${this.isActive('apply-loan.html')}"><i class="fas fa-file-signature"></i> Apply Loan</a>
                <a href="pending-disbursement.html" class="${this.isActive('pending-disbursement.html')}"><i class="fas fa-hand-holding-usd"></i> Disbursement</a>
                <a href="collection.html" class="${this.isActive('collection.html')}"><i class="fas fa-money-bill-wave"></i> Collection</a>
            `;
        } else if (user.role === 'member') {
            menuItems = `
                <a href="dashboard.html" class="${this.isActive('dashboard.html')}"><i class="fas fa-tachometer-alt"></i> Dashboard</a>
            `;
        }

        const sidebarContent = `
            <div class="brand"><i class="fas fa-hands-helping"></i> NGO SaaS</div>
            ${menuItems}
        `;
        $('.sidebar').html(sidebarContent);

        // Render Navbar
        const navbarContent = `
            <div class="toggle-btn" onclick="$('.sidebar').toggleClass('open')">
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
