/**
 * db.js - Mock Backend and Database Simulation using LocalStorage
 * Handles data for Users, Products, Customers, Sales, etc.
 */

const DB = {
    init: function() {
        if (!localStorage.getItem('pos_initialized')) {
            console.log('Initializing Demo Data...');
            this.seed();
            localStorage.setItem('pos_initialized', 'true');
        }
    },

    seed: function() {
        // 1. Users
        const users = [
            { id: 1, name: "Super Admin", username: "superadmin", password: "123", role: "Super Admin", phone: "01700000000", status: "Active" },
            { id: 2, name: "Admin User", username: "admin", password: "123", role: "Admin", phone: "01700000001", status: "Active" },
            { id: 3, name: "Manager Bhai", username: "manager", password: "123", role: "Manager", phone: "01700000002", status: "Active" },
            { id: 4, name: "Cashier Karim", username: "cashier", password: "123", role: "Cashier", phone: "01700000003", status: "Active" }
        ];
        localStorage.setItem('pos_users', JSON.stringify(users));

        // 2. Products (Bangladeshi Context)
        const products = [
            { id: 101, name: "Pran Frooto 250ml", category: "Beverage", brand: "Pran", cost: 18, price: 25, stock: 100, barcode: "880123456789", image: "https://placehold.co/100x100?text=Frooto" },
            { id: 102, name: "Ruchi Chanachur 150g", category: "Snacks", brand: "Ruchi", cost: 35, price: 45, stock: 50, barcode: "880987654321", image: "https://placehold.co/100x100?text=Chanachur" },
            { id: 103, name: "Aarong Milk 1L", category: "Dairy", brand: "Aarong", cost: 85, price: 95, stock: 20, barcode: "880112233445", image: "https://placehold.co/100x100?text=Milk" },
            { id: 104, name: "Bashundhara Tissue Box", category: "Household", brand: "Bashundhara", cost: 55, price: 70, stock: 200, barcode: "880556677889", image: "https://placehold.co/100x100?text=Tissue" },
            { id: 105, name: "Rupchanda Soyabean Oil 5L", category: "Cooking", brand: "Rupchanda", cost: 850, price: 920, stock: 10, barcode: "880998877665", image: "https://placehold.co/100x100?text=Oil" },
            { id: 106, name: "Radhuni Turmeric Powder 200g", category: "Spices", brand: "Radhuni", cost: 110, price: 135, stock: 60, barcode: "880443322110", image: "https://placehold.co/100x100?text=Turmeric" },
            { id: 107, name: "Lifebuoy Soap Total", category: "Personal Care", brand: "Unilever", cost: 40, price: 55, stock: 150, barcode: "880667788990", image: "https://placehold.co/100x100?text=Soap" },
            { id: 108, name: "Coca Cola 2.25L", category: "Beverage", brand: "Coca Cola", cost: 120, price: 140, stock: 40, barcode: "880111222333", image: "https://placehold.co/100x100?text=Coke" }
        ];
        localStorage.setItem('pos_products', JSON.stringify(products));

        // 3. Customers
        const customers = [
            { id: 1, name: "Walk-in Customer", phone: "N/A", address: "Dhaka", due: 0 },
            { id: 2, name: "Rahim Uddin", phone: "01811223344", address: "Mirpur 10, Dhaka", due: 500 },
            { id: 3, name: "Salma Begum", phone: "01999887766", address: "Gulshan 1, Dhaka", due: 0 }
        ];
        localStorage.setItem('pos_customers', JSON.stringify(customers));

        // 3.1 Suppliers
        const suppliers = [
            { id: 1, name: "Pran-RFL Group", contact: "Kamal Hossain", phone: "01711223344", address: "Badda, Dhaka" },
            { id: 2, name: "Unilever BD", contact: "Sabbir Ahmed", phone: "01711556677", address: "Gulshan, Dhaka" },
            { id: 3, name: "Bashundhara Group", contact: "Mehedi Hasan", phone: "01888112233", address: "Bashundhara R/A, Dhaka" }
        ];
        localStorage.setItem('pos_suppliers', JSON.stringify(suppliers));

        // 4. Sales History
        localStorage.setItem('pos_sales', JSON.stringify([]));

        // 5. Purchase History
        localStorage.setItem('pos_purchases', JSON.stringify([]));

        // 6. Expenses
        const expenses = [
            { id: 1, date: "2026-02-19", category: "Rent", amount: 20000, note: "Shop monthly rent" },
            { id: 2, date: "2026-02-20", category: "Electricity", amount: 1500, note: "February Bill" }
        ];
        localStorage.setItem('pos_expenses', JSON.stringify(expenses));
    },

    // Generic CRUD wrappers
    getAll: function(table) {
        return JSON.parse(localStorage.getItem(table) || '[]');
    },

    add: function(table, data) {
        const items = this.getAll(table);
        // Auto Increment ID: if items exist, max id + 1, else 1
        // Special case for empty arrays to ensure we start at 1
        let nextId = 1;
        if (items.length > 0) {
            nextId = Math.max(...items.map(i => i.id)) + 1;
        }
        data.id = nextId; 
        items.push(data);
        localStorage.setItem(table, JSON.stringify(items));
        return data;
    },

    update: function(table, id, data) {
        const items = this.getAll(table);
        const index = items.findIndex(i => i.id == id);
        if (index !== -1) {
            // Merge existing data with new data
            items[index] = { ...items[index], ...data };
            localStorage.setItem(table, JSON.stringify(items));
            return true;
        }
        return false;
    },

    delete: function(table, id) {
        let items = this.getAll(table);
        items = items.filter(i => i.id != id);
        localStorage.setItem(table, JSON.stringify(items));
    },

    login: function(username, password) {
        const users = this.getAll('pos_users');
        // Simple plain text check for demo
        return users.find(u => u.username === username && u.password === password);
    }
};

DB.init();
