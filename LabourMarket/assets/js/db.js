const DB = {
    key: 'labour_market_db',
    
    init: function() {
        if (!localStorage.getItem(this.key)) {
            const initialData = {
                users: [
                    { id: 1, name: 'Super Admin', email: 'super@worker.com', password: '123', role: 'super-admin' },
                    { id: 2, name: 'Client Admin', email: 'client@worker.com', password: '123', role: 'client-admin', clientId: 1 },
                    { id: 3, name: 'Rahim Worker', email: 'worker@demo.com', password: '123', role: 'worker', workerId: 1 },
                    { id: 4, name: 'Karim Customer', email: 'customer@demo.com', password: '123', role: 'customer' }
                ],
                clients: [
                    { id: 1, name: 'Dhaka Contractors Ltd', email: 'client@worker.com', phone: '01711111111', address: 'Gulshan, Dhaka', status: 'Active', plan: 'Gold', validTill: '2026-12-31' },
                    { id: 2, name: 'Chittagong Builders', email: 'ctg@worker.com', phone: '01811111111', address: 'Agrabad, Chittagong', status: 'Suspended', plan: 'Silver', validTill: '2025-10-10' }
                ],
                workers: [
                    { id: 1, clientId: 1, name: 'Rahim Worker', category: 'Electrician', area: 'Mirpur', rate: 800, type: 'Daily', status: 'Approved', availability: true, image: 'https://placehold.co/100', phone: '01900000001', experience: '5 Years' },
                    { id: 2, clientId: 1, name: 'Abdul Mason', category: 'Mason', area: 'Dhanmondi', rate: 1000, type: 'Daily', status: 'Pending', availability: false, image: 'https://placehold.co/100', phone: '01900000002', experience: '8 Years' },
                    { id: 3, clientId: 2, name: 'Salam Plumber', category: 'Plumber', area: 'Uttara', rate: 600, type: 'Hourly', status: 'Approved', availability: true, image: 'https://placehold.co/100', phone: '01900000003', experience: '3 Years' }
                ],
                calls: [
                    { id: 101, workerId: 1, customerId: 4, customerName: 'Karim Customer', date: '2026-02-10', time: '10:00 AM', status: 'Completed', amount: 800 },
                    { id: 102, workerId: 1, customerId: 4, customerName: 'Karim Customer', date: '2026-02-08', time: '02:00 PM', status: 'Completed', amount: 800 },
                    { id: 103, workerId: 3, customerId: 4, customerName: 'Karim Customer', date: '2026-02-09', time: '09:00 AM', status: 'Missed', amount: 0 }
                ],
                plans: [
                    { id: 1, name: 'Silver', price: 2000, duration: 'Monthly', workerLimit: 10 },
                    { id: 2, name: 'Gold', price: 15000, duration: 'Yearly', workerLimit: 50 },
                    { id: 3, name: 'Platinum', price: 25000, duration: 'Yearly', workerLimit: 200 }
                ]
            };
            this.save(initialData);
            console.log('Database seeded.');
        }
    },

    getData: function() {
        return JSON.parse(localStorage.getItem(this.key));
    },

    save: function(data) {
        localStorage.setItem(this.key, JSON.stringify(data));
    },

    login: function(email, password) {
        const data = this.getData();
        const user = data.users.find(u => u.email === email && u.password === password);
        if (user) {
            localStorage.setItem('user_session', JSON.stringify(user));
            return user;
        }
        return null;
    },

    logout: function() {
        localStorage.removeItem('user_session');
        window.location.href = '../../pages/login.html';
    },

    checkAuth: function(requiredRole) {
        const session = JSON.parse(localStorage.getItem('user_session'));
        if (!session) {
            window.location.href = '../../pages/login.html';
            return null;
        }
        if (requiredRole && session.role !== requiredRole) {
            alert('Unauthorized access');
            this.logout(); // Or redirect to their dashboard
            return null;
        }
        return session;
    },

    // --- Helpers ---
    
    getAll: function(collection) {
        return this.getData()[collection] || [];
    },

    add: function(collection, item) {
        const data = this.getData();
        if (!data[collection]) data[collection] = [];
        // Auto ID
        const maxId = data[collection].reduce((max, p) => (p.id > max ? p.id : max), 0);
        item.id = maxId + 1;
        
        data[collection].push(item);
        this.save(data);
        return item;
    },

    update: function(collection, id, updates) {
        const data = this.getData();
        const index = data[collection].findIndex(i => i.id == id);
        if (index !== -1) {
            data[collection][index] = { ...data[collection][index], ...updates };
            this.save(data);
            return true;
        }
        return false;
    },

    delete: function(collection, id) {
        const data = this.getData();
        data[collection] = data[collection].filter(i => i.id != id);
        this.save(data);
    }
};

// Initialize on load
DB.init();
