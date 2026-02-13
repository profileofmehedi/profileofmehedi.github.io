const DB = {
  // Keys
  KEYS: {
    USERS: "ngo_users",
    NGOS: "ngo_list",
    PLANS: "ngo_plans",
    BRANCHES: "ngo_branches",
    PRODUCTS: "ngo_products",
    MEMBERS: "ngo_members",
    LOANS: "ngo_loans",
    COLLECTIONS: "ngo_collections",
    CURRENT_USER: "ngo_current_user",
  },

  // Initialize Database with Demo Data
  init: function () {
    const version = "1.4"; // Increment for translation re-seed
    if (
      !localStorage.getItem(this.KEYS.USERS) ||
      localStorage.getItem("db_version") !== version
    ) {
      console.log("Seeding Database...");
      // Clear old keys to avoid conflicts
      Object.values(this.KEYS).forEach((k) => localStorage.removeItem(k));
      this.seedData();
      localStorage.setItem("db_version", version);
    }
  },

  seedData: function () {
    // 1. Users
    const users = [
      {
        id: 1,
        name: "সুপার এডমিন",
        email: "super@demo.com",
        password: "123",
        role: "super-admin",
        ngoId: null,
        branchId: null,
      },
      {
        id: 2,
        name: "এনজিও এডমিন",
        email: "admin@demo.com",
        password: "123",
        role: "ngo-admin",
        ngoId: 1,
        branchId: null,
      },
      {
        id: 3,
        name: "শাখা ব্যবস্থাপক",
        email: "manager@demo.com",
        password: "123",
        role: "branch",
        ngoId: 1,
        branchId: 1,
      },
      {
        id: 4,
        name: "ফিল্ড অফিসার",
        email: "officer@demo.com",
        password: "123",
        role: "officer",
        ngoId: 1,
        branchId: 1,
      },
      {
        id: 5,
        name: "রহিম মেম্বার",
        email: "member@demo.com",
        password: "123",
        role: "member",
        ngoId: 1,
        branchId: 1,
        memberId: 1,
      },
    ];
    localStorage.setItem(this.KEYS.USERS, JSON.stringify(users));

    // 2. Plans
    const plans = [
      {
        id: 1,
        name: "বেসিক প্ল্যান",
        price: 1000,
        memberLimit: 100,
        loanLimit: 500000,
      },
      {
        id: 2,
        name: "প্রো প্ল্যান",
        price: 5000,
        memberLimit: 10000,
        loanLimit: 50000000,
      },
    ];
    localStorage.setItem(this.KEYS.PLANS, JSON.stringify(plans));

    // 3. NGOs
    const ngos = [
      {
        id: 1,
        name: "গ্রামীণ প্রো এনজিও",
        planId: 2,
        status: "সক্রিয়",
        expiryDate: "2026-12-31",
      },
      {
        id: 2,
        name: "স্মল হোপ এনজিও",
        planId: 1,
        status: "সক্রিয়",
        expiryDate: "2025-12-31",
      },
    ];
    localStorage.setItem(this.KEYS.NGOS, JSON.stringify(ngos));

    // 4. Branches
    const branches = [
      {
        id: 1,
        name: "ঢাকা প্রধান শাখা",
        code: "DHK-01",
        ngoId: 1,
        address: "মিরপুর, ঢাকা",
      },
      {
        id: 2,
        name: "চট্টগ্রাম শাখা",
        code: "CTG-01",
        ngoId: 1,
        address: "আগ্রাবাদ, চট্টগ্রাম",
      },
    ];
    localStorage.setItem(this.KEYS.BRANCHES, JSON.stringify(branches));

    // 5. Loan Products
    const products = [
      {
        id: 1,
        name: "ক্ষুদ্র ঋণ",
        interestRate: 10,
        duration: 12,
        type: "সাপ্তাহিক",
        interestMethod: "ফ্ল্যাট",
        minAmount: 5000,
        maxAmount: 50000,
        processingFee: 1,
        insuranceFee: 0.5,
        lateFee: 50,
        gracePeriod: 0,
        status: "সক্রিয়",
        ngoId: 1,
      },
    ];
    localStorage.setItem(this.KEYS.PRODUCTS, JSON.stringify(products));

    // 6. Members
    const members = [
      {
        id: 1,
        name: "রহিম উদ্দিন",
        guardian: "আব্দুল করিম",
        phone: "01700000001",
        nid: "1234567890",
        address: "গ্রাম-এ",
        ngoId: 1,
        branchId: 1,
        status: "সক্রিয়",
      },
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
          date: date.toISOString().split("T")[0],
          amount: installmentAmount,
          paid: 0,
          status: "Pending", // Pending, Paid, Partial
        });
      }
      return schedule;
    };

    const loans = [
      {
        id: 1,
        memberId: 1,
        productId: 1,
        principal: 10000,
        interest: 1000,
        total: 11000,
        paid: 2750,
        due: 8250,
        status: "Active",
        startDate: "2026-01-01",
        schedule: generateSchedule(10000, 10, 12, "2026-01-01"),
      },
      {
        id: 2,
        memberId: 2,
        productId: 1,
        principal: 20000,
        interest: 2000,
        total: 22000,
        paid: 0,
        due: 22000,
        status: "Active",
        startDate: "2026-02-01",
        schedule: generateSchedule(20000, 10, 12, "2026-02-01"),
      },
    ];

    // Mock some payments for Loan 1
    loans[0].schedule[0].paid = loans[0].schedule[0].amount;
    loans[0].schedule[0].status = "Paid";
    loans[0].schedule[1].paid = loans[0].schedule[1].amount;
    loans[0].schedule[1].status = "Paid";
    loans[0].schedule[2].paid = loans[0].schedule[2].amount;
    loans[0].schedule[2].status = "Paid";

    localStorage.setItem(this.KEYS.LOANS, JSON.stringify(loans));

    // 8. Collections (Logs)
    const collections = [
      {
        id: 1,
        loanId: 1,
        memberId: 1,
        amount: loans[0].schedule[0].amount,
        date: loans[0].schedule[0].date,
        collectedBy: 4,
      },
      {
        id: 2,
        loanId: 1,
        memberId: 1,
        amount: loans[0].schedule[1].amount,
        date: loans[0].schedule[1].date,
        collectedBy: 4,
      },
      {
        id: 3,
        loanId: 1,
        memberId: 1,
        amount: loans[0].schedule[2].amount,
        date: loans[0].schedule[2].date,
        collectedBy: 4,
      },
    ];
    localStorage.setItem(this.KEYS.COLLECTIONS, JSON.stringify(collections));
  },

  // Generic Getters
  getAll: function (key) {
    return JSON.parse(localStorage.getItem(key)) || [];
  },

  // Generic Setter
  save: function (key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  },

  // Auth Helpers
  login: function (email, password) {
    const users = this.getAll(this.KEYS.USERS);
    const user = users.find(
      (u) => u.email === email && u.password === password,
    ); // Simple check
    if (user) {
      localStorage.setItem(this.KEYS.CURRENT_USER, JSON.stringify(user));
      return user;
    }
    return null;
  },

  logout: function () {
    localStorage.removeItem(this.KEYS.CURRENT_USER);
    window.location.href = "../../pages/login.html";
  },

  getCurrentUser: function () {
    return JSON.parse(localStorage.getItem(this.KEYS.CURRENT_USER));
  },

  addProduct: function (productData) {
    let products = this.getAll(this.KEYS.PRODUCTS);
    productData.id =
      products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1;
    products.push(productData);
    this.save(this.KEYS.PRODUCTS, products);
  },

  applyLoan: function (loanData) {
    let loans = this.getAll(this.KEYS.LOANS);
    loanData.id =
      loans.length > 0 ? Math.max(...loans.map((l) => l.id)) + 1 : 1;
    loanData.status = "Applied";
    loans.push(loanData);
    this.save(this.KEYS.LOANS, loans);
  },

  approveLoan: function (loanId) {
    let loans = this.getAll(this.KEYS.LOANS);
    let loan = loans.find((l) => l.id == loanId);
    if (loan) {
      loan.status = "Approved";
      this.save(this.KEYS.LOANS, loans);
    }
  },

  disburseLoan: function (loanId) {
    let loans = this.getAll(this.KEYS.LOANS);
    let loan = loans.find((l) => l.id == loanId);
    if (loan) {
      loan.status = "Active";
      loan.disbursedAt = new Date().toISOString().split("T")[0];
      this.save(this.KEYS.LOANS, loans);
    }
  },

  // Specific Helpers
  createLoan: function (loanData) {
    let loans = this.getAll(this.KEYS.LOANS);
    // logic to generate schedule would be here in real app, simplistic for now
    // For the demo, we assume schedule is passed or generated
    loanData.id =
      loans.length > 0 ? Math.max(...loans.map((l) => l.id)) + 1 : 1;
    loans.push(loanData);
    this.save(this.KEYS.LOANS, loans);
  },

  addCollection: function (collectionData) {
    let collections = this.getAll(this.KEYS.COLLECTIONS);
    let loans = this.getAll(this.KEYS.LOANS);

    // Update Loan
    let loan = loans.find((l) => l.id == collectionData.loanId);
    if (loan) {
      loan.paid += parseFloat(collectionData.amount);
      loan.due -= parseFloat(collectionData.amount);

      // Update Schedule
      // Find first unpaid or partial schedule
      for (let sch of loan.schedule) {
        if (sch.status !== "Paid") {
          // Simple logic: apply amount to this schedule
          // In real world, split across multiple if amount > inst amount
          sch.paid += parseFloat(collectionData.amount);
          if (sch.paid >= sch.amount) sch.status = "Paid";
          else sch.status = "Partial";
          break; // Just pay one for this demo simplicity
        }
      }

      this.save(this.KEYS.LOANS, loans);
    }

    collectionData.id = collections.length + 1;
    collections.push(collectionData);
    this.save(this.KEYS.COLLECTIONS, collections);
  },
};

DB.init();
