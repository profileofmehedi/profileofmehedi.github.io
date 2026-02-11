const DB = {
    // Keys
    KEYS: {
        USERS: 'ngo_users',
        NGOS: 'ngo_list',
        PLANS: 'ngo_plans',
        BRANCHES: 'ngo_branches',
        PRODUCTS: 'ngo_products',
        MEMBERS: 'ngo_members',
        LOANS: 'ngo_loans',
        COLLECTIONS: 'ngo_collections',
        CURRENT_USER: 'ngo_current_user'
    },

    // Initialize Database with Demo Data
    init: function() {
        const version = '1.2'; // Increment this to force re-seed
        if (!localStorage.getItem(this.KEYS.USERS) || localStorage.getItem('db_version') !== version) {
            console.log("Seeding Database...");
            this.seedData();
            localStorage.setItem('db_version', version);
        }
    },

    seedData: function() {
        // 1. Users
        const users = [
            { id: 1, name: 'Super Admin', email: 'super@ngo.com', password: '123456', role: 'super-admin', ngoId: null, branchId: null },
            { id: 2, name: 'NGO Admin', email: 'admin@ngo.com', password: '123456', role: 'ngo-admin', ngoId: 1, branchId: null },
            { id: 3, name: 'Branch Manager', email: 'branch@ngo.com', password: '123456', role: 'branch', ngoId: 1, branchId: 1 },
            { id: 4, name: 'Field Officer', email: 'officer@ngo.com', password: '123456', role: 'officer', ngoId: 1, branchId: 1 },
            { id: 5, name: 'Rahim Member', email: 'member@ngo.com', password: '123456', role: 'member', ngoId: 1, branchId: 1, memberId: 1 }
        ];
        localStorage.setItem(this.KEYS.USERS, JSON.stringify(users));

        // 2. Plans
        const plans = [
            { id: 1, name: 'Basic', price: 1000, memberLimit: 100, loanLimit: 500000 },
            { id: 2, name: 'Pro', price: 5000, memberLimit: 10000, loanLimit: 50000000 }
        ];
        localStorage.setItem(this.KEYS.PLANS, JSON.stringify(plans));

        // 3. NGOs
        const ngos = [
            { id: 1, name: 'Grameen Pro', planId: 2, status: 'Active', expiryDate: '2026-12-31' },
            { id: 2, name: 'Small Hope NGO', planId: 1, status: 'Active', expiryDate: '2025-12-31' }
        ];
        localStorage.setItem(this.KEYS.NGOS, JSON.stringify(ngos));

        // 4. Branches
        const branches = [
            { id: 1, name: 'Dhaka Main Branch', code: 'DHK-01', ngoId: 1, address: 'Mirpur, Dhaka' },
            { id: 2, name: 'Chittagong Branch', code: 'CTG-01', ngoId: 1, address: 'Agrabad, Ctg' }
        ];
        localStorage.setItem(this.KEYS.BRANCHES, JSON.stringify(branches));

        // 5. Loan Products
        const products = [
            { 
                id: 1, name: 'Micro Credit', interestRate: 10, duration: 12, type: 'Weekly', 
                interestMethod: 'Flat', minAmount: 5000, maxAmount: 50000, 
                processingFee: 1, insuranceFee: 0.5, lateFee: 50, gracePeriod: 0, 
                status: 'Active', ngoId: 1 
            },
            { 
                id: 2, name: 'Agriculture Loan', interestRate: 8, duration: 6, type: 'Monthly', 
                interestMethod: 'Reducing', minAmount: 10000, maxAmount: 100000, 
                processingFee: 1.5, insuranceFee: 1, lateFee: 100, gracePeriod: 7, 
                status: 'Active', ngoId: 1 
            }
        ];
        localStorage.setItem(this.KEYS.PRODUCTS, JSON.stringify(products));

        // 6. Members
        const members = [
            { id: 1, name: 'Rahim Uddin', phone: '01700000001', nid: '1234567890', address: 'Village A', ngoId: 1, branchId: 1, status: 'Active' },
            { id: 2, name: 'Karim Mia', phone: '01700000002', nid: '1234567891', address: 'Village B', ngoId: 1, branchId: 1, status: 'Active' },
            { id: 3, name: 'Fatema Begum', phone: '01700000003', nid: '1234567892', address: 'Village A', ngoId: 1, branchId: 1, status: 'Active' }
        ];
        localStorage.setItem(this.KEYS.MEMBERS, JSON.stringify(members));

        // 7. Loans & Installments
        // Helper to generate schedule
        const generateSchedule = (amount, rate, duration, startDate) => {
            let totalInterest = amount * (rate / 100);
            let totalPayable = amount + totalInterest;
            let installmentAmount = Math.ceil(totalPayable / duration);
            let schedule = [];
            let date = new Date(startDate);

            for (let i = 1; i <= duration; i++) {
                date.setDate(date.getDate() + 7); // Weekly
                schedule.push({
                    no: i,
                    date: date.toISOString().split('T')[0],
                    amount: installmentAmount,
                    paid: 0,
                    status: 'Pending' // Pending, Paid, Partial
                });
            }
            return schedule;
        };

        const loans = [
            { 
                id: 1, memberId: 1, productId: 1, principal: 10000, interest: 1000, total: 11000, 
                paid: 2750, due: 8250, status: 'Active', startDate: '2026-01-01',
                schedule: generateSchedule(10000, 10, 12, '2026-01-01')
            },
            { 
                id: 2, memberId: 2, productId: 1, principal: 20000, interest: 2000, total: 22000, 
                paid: 0, due: 22000, status: 'Active', startDate: '2026-02-01',
                schedule: generateSchedule(20000, 10, 12, '2026-02-01')
            }
        ];
        
        // Mock some payments for Loan 1
        loans[0].schedule[0].paid = loans[0].schedule[0].amount;
        loans[0].schedule[0].status = 'Paid';
        loans[0].schedule[1].paid = loans[0].schedule[1].amount;
        loans[0].schedule[1].status = 'Paid';
        loans[0].schedule[2].paid = loans[0].schedule[2].amount;
        loans[0].schedule[2].status = 'Paid';

        localStorage.setItem(this.KEYS.LOANS, JSON.stringify(loans));

        // 8. Collections (Logs)
        const collections = [
            { id: 1, loanId: 1, memberId: 1, amount: loans[0].schedule[0].amount, date: loans[0].schedule[0].date, collectedBy: 4 },
            { id: 2, loanId: 1, memberId: 1, amount: loans[0].schedule[1].amount, date: loans[0].schedule[1].date, collectedBy: 4 },
            { id: 3, loanId: 1, memberId: 1, amount: loans[0].schedule[2].amount, date: loans[0].schedule[2].date, collectedBy: 4 }
        ];
        localStorage.setItem(this.KEYS.COLLECTIONS, JSON.stringify(collections));
    },

    // Generic Getters
    getAll: function(key) {
        return JSON.parse(localStorage.getItem(key)) || [];
    },
    
    // Generic Setter
    save: function(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    },

    // Auth Helpers
    login: function(email, password) {
        const users = this.getAll(this.KEYS.USERS);
        const user = users.find(u => u.email === email && u.password === password); // Simple check
        if (user) {
            localStorage.setItem(this.KEYS.CURRENT_USER, JSON.stringify(user));
            return user;
        }
        return null;
    },

    logout: function() {
        localStorage.removeItem(this.KEYS.CURRENT_USER);
        window.location.href = '../../pages/login.html';
    },

    getCurrentUser: function() {
        return JSON.parse(localStorage.getItem(this.KEYS.CURRENT_USER));
    },

    addProduct: function(productData) {
        let products = this.getAll(this.KEYS.PRODUCTS);
        productData.id = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
        products.push(productData);
        this.save(this.KEYS.PRODUCTS, products);
    },

    applyLoan: function(loanData) {
        let loans = this.getAll(this.KEYS.LOANS);
        loanData.id = loans.length > 0 ? Math.max(...loans.map(l => l.id)) + 1 : 1;
        loanData.status = 'Applied';
        loans.push(loanData);
        this.save(this.KEYS.LOANS, loans);
    },

    approveLoan: function(loanId) {
        let loans = this.getAll(this.KEYS.LOANS);
        let loan = loans.find(l => l.id == loanId);
        if (loan) {
            loan.status = 'Approved';
            this.save(this.KEYS.LOANS, loans);
        }
    },

    disburseLoan: function(loanId) {
        let loans = this.getAll(this.KEYS.LOANS);
        let loan = loans.find(l => l.id == loanId);
        if (loan) {
            loan.status = 'Active';
            loan.disbursedAt = new Date().toISOString().split('T')[0];
            this.save(this.KEYS.LOANS, loans);
        }
    },

    // Specific Helpers
    createLoan: function(loanData) {
        let loans = this.getAll(this.KEYS.LOANS);
        // logic to generate schedule would be here in real app, simplistic for now
        // For the demo, we assume schedule is passed or generated
        loanData.id = loans.length > 0 ? Math.max(...loans.map(l => l.id)) + 1 : 1;
        loans.push(loanData);
        this.save(this.KEYS.LOANS, loans);
    },

    addCollection: function(collectionData) {
        let collections = this.getAll(this.KEYS.COLLECTIONS);
        let loans = this.getAll(this.KEYS.LOANS);
        
        // Update Loan
        let loan = loans.find(l => l.id == collectionData.loanId);
        if (loan) {
            loan.paid += parseFloat(collectionData.amount);
            loan.due -= parseFloat(collectionData.amount);
            
            // Update Schedule
            // Find first unpaid or partial schedule
            for(let sch of loan.schedule) {
                if (sch.status !== 'Paid') {
                    // Simple logic: apply amount to this schedule
                    // In real world, split across multiple if amount > inst amount
                    sch.paid += parseFloat(collectionData.amount);
                    if(sch.paid >= sch.amount) sch.status = 'Paid';
                    else sch.status = 'Partial';
                    break; // Just pay one for this demo simplicity
                }
            }

            this.save(this.KEYS.LOANS, loans);
        }

        collectionData.id = collections.length + 1;
        collections.push(collectionData);
        this.save(this.KEYS.COLLECTIONS, collections);
    }
};

DB.init();
