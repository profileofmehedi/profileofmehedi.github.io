/**
 * Egdarma - Mock Database Layer (Enhanced V3)
 * Features: Employee Management, Product Management
 */

const DB_KEYS = {
    USERS: 'egdarma_users',
    DOCTORS: 'egdarma_doctors',
    PRODUCTS: 'egdarma_products',
    DCR: 'egdarma_dcr_logs',
    TARGETS: 'egdarma_targets',
    ORDERS: 'egdarma_orders',
    EXPENSES: 'egdarma_expenses',
    TOUR_PLAN: 'egdarma_tour_plan'
};

const DB = {
    init: function() {
        // 1. Users (Enhanced with Employee Details)
        if (!localStorage.getItem(DB_KEYS.USERS)) {
            const users = [
                { id: 101, username: 'admin', role: 'Admin', name: 'System Administrator', designation: 'Head of IT', phone: '01700000000', territory: 'HQ', avatar: 'admin.png' },
                { id: 102, username: 'manager', role: 'Manager', name: 'Sarah Connor', designation: 'Regional Manager', phone: '01700000001', territory: 'North Division', avatar: 'manager.png' },
                { id: 103, username: 'officer', role: 'Officer', name: 'John Doe', designation: 'Medical Promotion Officer', phone: '01700000002', territory: 'Gulshan-Banani', avatar: 'officer.png' }
            ];
            localStorage.setItem(DB_KEYS.USERS, JSON.stringify(users));
        }

        // 2. Doctors (Existing)
        if (!localStorage.getItem(DB_KEYS.DOCTORS)) {
            const doctors = [
                { id: 1, name: 'Dr. Rubina Haque', specialization: 'Dermatology', degree: 'MBBS, DDV', phone: '01711000001', location: 'Labaid Specialized', lat: 23.7416, lng: 90.3854, potential: 'High' },
                { id: 2, name: 'Dr. Tahsin Ahmed', specialization: 'Aesthetic Medicine', degree: 'MBBS, MSc (Derma)', phone: '01711000002', location: 'Evercare Hospital', lat: 23.8103, lng: 90.4125, potential: 'High' }
            ];
            localStorage.setItem(DB_KEYS.DOCTORS, JSON.stringify(doctors));
        }

        // 3. Products (Existing)
        if (!localStorage.getItem(DB_KEYS.PRODUCTS)) {
            const products = [
                { id: 101, name: 'GlowMax Serum', category: 'Skincare', price: 1200, stock: 500, description: 'Vitamin C Brightening Serum' },
                { id: 102, name: 'DermaSafe SPF50', category: 'Sun Protection', price: 850, stock: 200, description: 'Broad spectrum sunscreen' },
                { id: 103, name: 'AgeRewind Night Cream', category: 'Anti-Aging', price: 2500, stock: 150, description: 'Retinol enriched night repair' },
                { id: 104, name: 'HydraBoost Gel', category: 'Moisturizer', price: 900, stock: 800, description: 'Hyaluronic acid water gel' },
                { id: 105, name: 'AcneClear Face Wash', category: 'Cleanser', price: 450, stock: 1000, description: 'Salicylic acid cleanser' }
            ];
            localStorage.setItem(DB_KEYS.PRODUCTS, JSON.stringify(products));
        }

        // 4. Targets, DCR, Orders, Expenses, TourPlan (Keep existing logic if needed, simplified here for update)
        if (!localStorage.getItem(DB_KEYS.DCR)) localStorage.setItem(DB_KEYS.DCR, '[]');
        if (!localStorage.getItem(DB_KEYS.ORDERS)) localStorage.setItem(DB_KEYS.ORDERS, '[]');
        if (!localStorage.getItem(DB_KEYS.EXPENSES)) localStorage.setItem(DB_KEYS.EXPENSES, '[]');
        if (!localStorage.getItem(DB_KEYS.TOUR_PLAN)) localStorage.setItem(DB_KEYS.TOUR_PLAN, '[]');
    },

    // Getters with Safety Checks
    getUsers: function() {
        const users = JSON.parse(localStorage.getItem(DB_KEYS.USERS) || '[]');
        // Migration: Ensure V3 fields exist
        return users.map(u => ({
            ...u,
            designation: u.designation || 'N/A',
            territory: u.territory || 'N/A',
            phone: u.phone || 'N/A'
        }));
    },
    getDoctors: () => JSON.parse(localStorage.getItem(DB_KEYS.DOCTORS) || '[]'),
    getProducts: () => JSON.parse(localStorage.getItem(DB_KEYS.PRODUCTS) || '[]'),
    getDCRs: () => JSON.parse(localStorage.getItem(DB_KEYS.DCR) || '[]'),
    getOrders: () => JSON.parse(localStorage.getItem(DB_KEYS.ORDERS) || '[]'),
    getExpenses: () => JSON.parse(localStorage.getItem(DB_KEYS.EXPENSES) || '[]'),
    getTourPlan: () => JSON.parse(localStorage.getItem(DB_KEYS.TOUR_PLAN) || '[]'),

    // Setters
    setUsers: (data) => localStorage.setItem(DB_KEYS.USERS, JSON.stringify(data)),
    setDoctors: (data) => localStorage.setItem(DB_KEYS.DOCTORS, JSON.stringify(data)),
    setProducts: (data) => localStorage.setItem(DB_KEYS.PRODUCTS, JSON.stringify(data)),
    setDCRs: (data) => localStorage.setItem(DB_KEYS.DCR, JSON.stringify(data)),
    setOrders: (data) => localStorage.setItem(DB_KEYS.ORDERS, JSON.stringify(data)),
    setExpenses: (data) => localStorage.setItem(DB_KEYS.EXPENSES, JSON.stringify(data)),
    setTourPlan: (data) => localStorage.setItem(DB_KEYS.TOUR_PLAN, JSON.stringify(data)),
    
    getUserByRole: function(role) {
        return this.getUsers().find(u => u.role === role);
    }
};

DB.init();