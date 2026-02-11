const App = {
    // Keys for LocalStorage
    KEYS: {
        USERS: 'ngo_users',
        CLIENTS: 'ngo_clients',
        PLANS: 'ngo_plans',
        PROPERTIES: 'ngo_properties',
        UNITS: 'ngo_units',
        TENANTS: 'ngo_tenants',
        BILLS: 'ngo_bills',
        PAYMENTS: 'ngo_payments',
        SESSION: 'ngo_session'
    },

    // Initialize the application
    init: function() {
        this.seedData();
        this.checkAuth();
    },

    // Seed Data if empty
    seedData: function() {
        if (!localStorage.getItem(this.KEYS.USERS)) {
            console.log("Seeding Demo Data...");

            // 1. Users
            const users = [
                { id: 1, name: "Super Admin", email: "super@saas.com", password: "123", role: "super-admin" },
                { id: 2, name: "House Owner", email: "owner@demo.com", password: "123", role: "client-admin", clientId: 1 },
                { id: 3, name: "Manager", email: "manager@demo.com", password: "123", role: "manager", clientId: 1 },
                { id: 4, name: "Tenant User", email: "tenant@demo.com", password: "123", role: "tenant", tenantId: 1 }
            ];
            localStorage.setItem(this.KEYS.USERS, JSON.stringify(users));

            // 2. Plans
            const plans = [
                { id: 1, name: "Basic", price: 500, limit: 1 },
                { id: 2, name: "Standard", price: 1000, limit: 5 },
                { id: 3, name: "Premium", price: 2000, limit: 50 }
            ];
            localStorage.setItem(this.KEYS.PLANS, JSON.stringify(plans));

            // 3. Clients (SaaS Customers)
            const clients = [
                { id: 1, name: "Demo Housing", ownerId: 2, planId: 2, status: "Active", validTill: "2026-12-31" }
            ];
            localStorage.setItem(this.KEYS.CLIENTS, JSON.stringify(clients));

            // 4. Properties (Houses)
            const properties = [
                { id: 1, clientId: 1, name: "Green Villa", address: "Dhaka, Bangladesh", floors: 2, totalUnits: 4 }
            ];
            localStorage.setItem(this.KEYS.PROPERTIES, JSON.stringify(properties));

            // 5. Units (Flats/Rooms)
            const units = [
                { id: 1, propertyId: 1, name: "1A", floor: "1st", rent: 15000, status: "Occupied" },
                { id: 2, propertyId: 1, name: "1B", floor: "1st", rent: 15000, status: "Vacant" },
                { id: 3, propertyId: 1, name: "2A", floor: "2nd", rent: 16000, status: "Vacant" },
                { id: 4, propertyId: 1, name: "2B", floor: "2nd", rent: 16000, status: "Vacant" }
            ];
            localStorage.setItem(this.KEYS.UNITS, JSON.stringify(units));

            // 6. Tenants
            const tenants = [
                { id: 1, clientId: 1, name: "Rahim Ahmed", phone: "01700000000", email: "tenant@demo.com", unitId: 1, moveInDate: "2024-01-01", status: "Active" }
            ];
            localStorage.setItem(this.KEYS.TENANTS, JSON.stringify(tenants));
            
            // 7. Bills & Payments (Empty initially or add some history)
            localStorage.setItem(this.KEYS.BILLS, JSON.stringify([]));
            localStorage.setItem(this.KEYS.PAYMENTS, JSON.stringify([]));
        }
    },

    // Authentication Logic
    login: function(email, password) {
        const users = JSON.parse(localStorage.getItem(this.KEYS.USERS) || '[]');
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            localStorage.setItem(this.KEYS.SESSION, JSON.stringify(user));
            return { success: true, user: user };
        }
        return { success: false, message: "Invalid email or password" };
    },

    logout: function() {
        localStorage.removeItem(this.KEYS.SESSION);
        window.location.href = '../../pages/login.html';
    },

    checkAuth: function() {
        const session = localStorage.getItem(this.KEYS.SESSION);
        const path = window.location.pathname;
        const isLoginPage = path.includes('login.html');
        const isIndex = path.endsWith('/') || path.endsWith('index.html');

        if (!session && !isLoginPage) {
             // If not logged in and not on login page, redirect to login
             // Adjust path logic depending on where the user is
             if (path.includes('/pages/')) {
                 window.location.href = '../login.html'; 
             } else {
                 window.location.href = 'pages/login.html';
             }
        } else if (session && (isLoginPage || isIndex)) {
            // Already logged in, redirect to dashboard
            const user = JSON.parse(session);
            this.redirectUser(user);
        }
    },

    redirectUser: function(user) {
        const path = window.location.pathname;
        const inPages = path.includes('/pages/');
        const prefix = inPages ? '' : 'pages/';
        
        let target = '';
        if (user.role === 'super-admin') target = 'super-admin/dashboard.html';
        else if (user.role === 'client-admin') target = 'client-admin/dashboard.html';
        else if (user.role === 'manager') target = 'manager/dashboard.html';
        else if (user.role === 'tenant') target = 'tenant/dashboard.html';

        window.location.href = prefix + target;
    },

    getUser: function() {
        return JSON.parse(localStorage.getItem(this.KEYS.SESSION));
    },

    // Data Helpers
    get: function(key) {
        return JSON.parse(localStorage.getItem(key) || '[]');
    },
    
    save: function(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    },

    formatMoney: function(amount) {
        return new Intl.NumberFormat('en-BD', { style: 'currency', currency: 'BDT' }).format(amount);
    },

    renderLayout: function(role, activePage) {
        let menuItems = '';
        const user = this.getUser();

        if (role === 'super-admin') {
            menuItems = `
                <a href="dashboard.html" class="${activePage === 'dashboard' ? 'active' : ''}"><i class="fa-solid fa-gauge me-2"></i> Dashboard</a>
                <a href="clients.html" class="${activePage === 'clients' ? 'active' : ''}"><i class="fa-solid fa-users me-2"></i> Clients</a>
                <a href="plans.html" class="${activePage === 'plans' ? 'active' : ''}"><i class="fa-solid fa-list-check me-2"></i> Plans</a>
                <a href="#" onclick="App.logout()"><i class="fa-solid fa-right-from-bracket me-2"></i> Logout</a>
            `;
        } else if (role === 'client-admin') {
             menuItems = `
                <a href="dashboard.html" class="${activePage === 'dashboard' ? 'active' : ''}"><i class="fa-solid fa-gauge me-2"></i> Dashboard</a>
                <a href="properties.html" class="${activePage === 'properties' ? 'active' : ''}"><i class="fa-solid fa-building me-2"></i> Properties</a>
                <a href="tenants.html" class="${activePage === 'tenants' ? 'active' : ''}"><i class="fa-solid fa-user-group me-2"></i> Tenants</a>
                <a href="billing.html" class="${activePage === 'billing' ? 'active' : ''}"><i class="fa-solid fa-file-invoice-dollar me-2"></i> Billing</a>
                <a href="reports.html" class="${activePage === 'reports' ? 'active' : ''}"><i class="fa-solid fa-chart-line me-2"></i> Reports</a>
                <a href="#" onclick="App.logout()"><i class="fa-solid fa-right-from-bracket me-2"></i> Logout</a>
            `;
        } else if (role === 'manager') {
            menuItems = `
                <a href="dashboard.html" class="${activePage === 'dashboard' ? 'active' : ''}"><i class="fa-solid fa-gauge me-2"></i> Dashboard</a>
                <a href="#" onclick="App.logout()"><i class="fa-solid fa-right-from-bracket me-2"></i> Logout</a>
            `;
        } else if (role === 'tenant') {
            menuItems = `
                <a href="dashboard.html" class="${activePage === 'dashboard' ? 'active' : ''}"><i class="fa-solid fa-gauge me-2"></i> Dashboard</a>
                <a href="#" onclick="App.logout()"><i class="fa-solid fa-right-from-bracket me-2"></i> Logout</a>
            `;
        }

        const sidebar = `
            <div class="sidebar text-white">
                <div class="brand">
                    <i class="fa-solid fa-house-chimney"></i> NGO RMS
                </div>
                ${menuItems}
            </div>
        `;

        const navbar = `
            <div class="top-navbar">
                <div class="d-flex align-items-center">
                   <h4 class="mb-0 text-capitalize">${activePage.replace('-', ' ')}</h4>
                </div>
                <div class="user-info">
                    <span class="me-2 fw-bold">${user ? user.name : 'User'}</span>
                    <span class="badge bg-secondary">${user ? user.role : ''}</span>
                </div>
            </div>
        `;

        document.getElementById('layout-sidebar').innerHTML = sidebar;
        document.getElementById('layout-navbar').innerHTML = navbar;
    }
};

// Auto-init on load
document.addEventListener('DOMContentLoaded', () => {
    // Only init if not explicitly prevented (some pages might want manual control)
    App.init();
});
