// TallyKhata App - Main JavaScript File
// This file handles all functionality including navigation, modals, forms, and data management

// Demo Data Structure
const AppData = {
  users: [
    {
      id: 1,
      businessName: "Ahmed Electronics",
      email: "ahmed@electronics.com",
      password: "123456", // In real app, this would be hashed
      role: "user",
      phone: "+880-1700-000001",
      address: "123 Main Street, Dhaka",
      created: "2024-01-15",
    },
    {
      id: 2,
      businessName: "Rahman Grocery",
      email: "rahman@grocery.com",
      password: "123456",
      role: "user",
      phone: "+880-1700-000002",
      address: "456 Commerce Ave, Chittagong",
      created: "2024-02-20",
    },
    {
      id: 3,
      businessName: "Admin User",
      email: "admin@tallykhata.com",
      password: "admin123",
      role: "admin",
      phone: "+880-1700-000000",
      address: "TallyKhata HQ, Dhaka",
      created: "2024-01-01",
    },
  ],

  customers: [
    {
      id: 1,
      name: "Mohammad Ali",
      email: "ali@email.com",
      phone: "+880-1700-111001",
      address: "House 12, Road 5, Dhanmondi, Dhaka",
      balance: 15000,
      totalPurchases: 45000,
      lastTransaction: "2024-09-25",
      userId: 1,
    },
    {
      id: 2,
      name: "Fatima Begum",
      email: "fatima@email.com",
      phone: "+880-1700-111002",
      address: "Flat 3B, Green View, Gulshan, Dhaka",
      balance: -5000,
      totalPurchases: 32000,
      lastTransaction: "2024-09-24",
      userId: 1,
    },
    {
      id: 3,
      name: "Karim Rahman",
      email: "karim@email.com",
      phone: "+880-1700-111003",
      address: "Village: Savar, Upazila: Savar, Dhaka",
      balance: 8500,
      totalPurchases: 28000,
      lastTransaction: "2024-09-23",
      userId: 1,
    },
    {
      id: 4,
      name: "Rashida Khatun",
      email: "rashida@email.com",
      phone: "+880-1700-111004",
      address: "House 45, Sector 7, Uttara, Dhaka",
      balance: 12000,
      totalPurchases: 38000,
      lastTransaction: "2024-09-26",
      userId: 2,
    },
    {
      id: 5,
      name: "Habib Ahmed",
      email: "habib@email.com",
      phone: "+880-1700-111005",
      address: "Shop 23, New Market, Chittagong",
      balance: -2000,
      totalPurchases: 25000,
      lastTransaction: "2024-09-22",
      userId: 2,
    },
  ],

  suppliers: [
    {
      id: 1,
      name: "Bangladesh Electronics Ltd",
      email: "contact@belbd.com",
      phone: "+880-2-9876543",
      address: "Electronics Plaza, Gulshan, Dhaka",
      balance: -25000,
      totalSupplied: 180000,
      lastTransaction: "2024-09-26",
      userId: 1,
    },
    {
      id: 2,
      name: "Dhaka Wholesale Market",
      email: "info@dhakawholesale.com",
      phone: "+880-2-8765432",
      address: "Wholesale Complex, Chawkbazar, Dhaka",
      balance: -18000,
      totalSupplied: 95000,
      lastTransaction: "2024-09-25",
      userId: 1,
    },
    {
      id: 3,
      name: "Chittagong Import Co.",
      email: "sales@ctgimport.com",
      phone: "+880-31-765432",
      address: "Port Road, Chittagong",
      balance: -12000,
      totalSupplied: 75000,
      lastTransaction: "2024-09-24",
      userId: 2,
    },
  ],

  transactions: [
    {
      id: 1,
      type: "sale",
      customerId: 1,
      amount: 5000,
      description: "Samsung Galaxy A14 Sale",
      date: "2024-09-25",
      paymentMethod: "cash",
      userId: 1,
    },
    {
      id: 2,
      type: "expense",
      supplierId: 1,
      amount: 25000,
      description: "Electronics Purchase - Mobile Phones",
      date: "2024-09-26",
      paymentMethod: "bank_transfer",
      userId: 1,
    },
    {
      id: 3,
      type: "sale",
      customerId: 2,
      amount: 3000,
      description: "iPhone Case and Accessories",
      date: "2024-09-24",
      paymentMethod: "digital_payment",
      userId: 1,
    },
    {
      id: 4,
      type: "expense",
      supplierId: 2,
      amount: 15000,
      description: "Monthly Inventory Purchase",
      date: "2024-09-23",
      paymentMethod: "cash",
      userId: 1,
    },
    {
      id: 5,
      type: "sale",
      customerId: 4,
      amount: 8000,
      description: "Rice and Grocery Items",
      date: "2024-09-26",
      paymentMethod: "cash",
      userId: 2,
    },
    {
      id: 6,
      type: "expense",
      supplierId: 3,
      amount: 12000,
      description: "Import Duties and Stock",
      date: "2024-09-24",
      paymentMethod: "bank_transfer",
      userId: 2,
    },
  ],

  currentUser: null,
  nextId: {
    customers: 6,
    suppliers: 4,
    transactions: 7,
    users: 4,
  },
};

// Language System
const Languages = {
  bn: {
    // Navigation
    dashboard: "ড্যাশবোর্ড",
    customers: "গ্রাহকগণ",
    suppliers: "সরবরাহকারী",
    reports: "রিপোর্ট",
    logout: "লগআউট",

    // Common
    name: "নাম",
    phone: "ফোন",
    email: "ইমেইল",
    address: "ঠিকানা",
    actions: "কার্যক্রম",
    save: "সংরক্ষণ",
    cancel: "বাতিল",
    close: "বন্ধ",
    add: "যোগ করুন",
    edit: "সম্পাদনা",
    delete: "মুছুন",
    view: "দেখুন",

    // Customer Page
    manageCustomers: "গ্রাহক পরিচালনা",
    addCustomer: "গ্রাহক যোগ করুন",
    addNewCustomer: "নতুন গ্রাহক যোগ করুন",
    dueAmount: "বকেয়া পরিমাণ",
    saveCustomer: "গ্রাহক সংরক্ষণ",

    // Supplier Page
    manageSuppliers: "সরবরাহকারী পরিচালনা",
    addSupplier: "সরবরাহকারী যোগ করুন",
    addNewSupplier: "নতুন সরবরাহকারী যোগ করুন",
    supplierName: "সরবরাহকারীর নাম",
    amountPayable: "প্রদেয় পরিমাণ",
    saveSupplier: "সরবরাহকারী সংরক্ষণ",

    // Dashboard
    welcomeBack: "স্বাগতম!",
    addTransaction: "লেনদেন যোগ করুন",
    totalSales: "মোট বিক্রয়",
    totalReceived: "মোট প্রাপ্ত",
    totalDues: "মোট বকেয়া",
    recentTransactions: "সাম্প্রতিক লেনদেন",

    // Reports
    businessReports: "ব্যবসায়িক রিপোর্ট",
    totalRevenue: "মোট আয়",
    totalExpenses: "মোট খরচ",
    netProfit: "নিট লাভ",
    profitMargin: "লাভের হার",
    thisMonth: "এই মাস",
    lastMonth: "গত মাস",
    custom: "কাস্টম",
    selectReportPeriod: "রিপোর্ট পিরিয়ড নির্বাচন করুন",
    startDate: "শুরুর তারিখ",
    endDate: "শেষের তারিখ",
    generateReport: "রিপোর্ট তৈরি করুন",

    // Supplier fields
    companyName: "কোম্পানির নাম",
    contactPerson: "যোগাযোগের ব্যক্তি",
    balance: "ব্যালেন্স",
  },

  en: {
    // Navigation
    dashboard: "Dashboard",
    customers: "Customers",
    suppliers: "Suppliers",
    reports: "Reports",
    logout: "Logout",

    // Common
    name: "Name",
    phone: "Phone",
    email: "Email",
    address: "Address",
    actions: "Actions",
    save: "Save",
    cancel: "Cancel",
    close: "Close",
    add: "Add",
    edit: "Edit",
    delete: "Delete",
    view: "View",

    // Customer Page
    manageCustomers: "Manage Customers",
    addCustomer: "Add Customer",
    addNewCustomer: "Add New Customer",
    dueAmount: "Due Amount",
    saveCustomer: "Save Customer",

    // Supplier Page
    manageSuppliers: "Manage Suppliers",
    addSupplier: "Add Supplier",
    addNewSupplier: "Add New Supplier",
    supplierName: "Supplier Name",
    amountPayable: "Amount Payable",
    saveSupplier: "Save Supplier",

    // Dashboard
    welcomeBack: "Welcome Back, Business Owner!",
    addTransaction: "Add Transaction",
    totalSales: "Total Sales",
    totalReceived: "Total Received",
    totalDues: "Total Dues",
    recentTransactions: "Recent Transactions",

    // Reports
    businessReports: "Business Reports",
    totalRevenue: "Total Revenue",
    totalExpenses: "Total Expenses",
    netProfit: "Net Profit",
    profitMargin: "Profit Margin",
    thisMonth: "This Month",
    lastMonth: "Last Month",
    custom: "Custom",
    selectReportPeriod: "Select Report Period",
    startDate: "Start Date",
    endDate: "End Date",
    generateReport: "Generate Report",

    // Supplier fields
    companyName: "Company Name",
    contactPerson: "Contact Person",
    balance: "Balance",
  },
};

const LanguageManager = {
  currentLanguage: "bn", // Default to Bangla

  init: () => {
    // Load saved language from localStorage
    const savedLang = localStorage.getItem("tallykhata_language");
    if (savedLang && (savedLang === "bn" || savedLang === "en")) {
      LanguageManager.currentLanguage = savedLang;
    }
    LanguageManager.updateLanguage();
  },

  setLanguage: (lang) => {
    if (lang === "bn" || lang === "en") {
      LanguageManager.currentLanguage = lang;
      localStorage.setItem("tallykhata_language", lang);
      LanguageManager.updateLanguage();
    }
  },

  getText: (key) => {
    return Languages[LanguageManager.currentLanguage][key] || key;
  },

  updateLanguage: () => {
    // Update all elements with data-lang attribute
    document.querySelectorAll("[data-lang]").forEach((element) => {
      const key = element.getAttribute("data-lang");
      const text = LanguageManager.getText(key);

      if (
        element.tagName === "INPUT" &&
        (element.type === "submit" || element.type === "button")
      ) {
        element.value = text;
      } else if (
        element.tagName === "INPUT" &&
        element.placeholder !== undefined
      ) {
        element.placeholder = text;
      } else {
        element.textContent = text;
      }
    });

    // Update language toggle buttons
    document.querySelectorAll(".lang-btn").forEach((btn) => {
      btn.classList.remove("active");
      if (
        btn.getAttribute("data-lang-code") === LanguageManager.currentLanguage
      ) {
        btn.classList.add("active");
      }
    });
  },
};

// Local Storage Management
const Storage = {
  save: () => {
    localStorage.setItem("tallykhata_data", JSON.stringify(AppData));
  },

  load: () => {
    const stored = localStorage.getItem("tallykhata_data");
    if (stored) {
      const data = JSON.parse(stored);
      Object.assign(AppData, data);
    }
  },

  clear: () => {
    localStorage.removeItem("tallykhata_data");
  },
};

// Authentication Functions
const Auth = {
  login: (email, password) => {
    const user = AppData.users.find(
      (u) => u.email === email && u.password === password
    );
    if (user) {
      AppData.currentUser = user;
      Storage.save();
      return user;
    }
    return null;
  },

  register: (userData) => {
    const existingUser = AppData.users.find((u) => u.email === userData.email);
    if (existingUser) {
      return { success: false, message: "Email already exists" };
    }

    const newUser = {
      id: AppData.nextId.users++,
      ...userData,
      role: "user",
      created: new Date().toISOString().split("T")[0],
    };

    AppData.users.push(newUser);
    AppData.currentUser = newUser;
    Storage.save();
    return { success: true, user: newUser };
  },

  logout: () => {
    AppData.currentUser = null;
    Storage.save();
    window.location.href = "index.html";
  },

  isLoggedIn: () => {
    return AppData.currentUser !== null;
  },

  requireAuth: () => {
    if (!Auth.isLoggedIn()) {
      window.location.href = "login.html";
      return false;
    }
    return true;
  },

  requireAdmin: () => {
    if (!Auth.isLoggedIn() || AppData.currentUser.role !== "admin") {
      window.location.href = "login.html";
      return false;
    }
    return true;
  },
};

// Data Management Functions
const DataManager = {
  // Customer operations
  getCustomers: () => {
    if (!AppData.currentUser) return [];
    if (AppData.currentUser.role === "admin") {
      return AppData.customers;
    }
    return AppData.customers.filter((c) => c.userId === AppData.currentUser.id);
  },

  addCustomer: (customerData) => {
    const newCustomer = {
      id: AppData.nextId.customers++,
      ...customerData,
      balance: 0,
      totalPurchases: 0,
      lastTransaction: new Date().toISOString().split("T")[0],
      userId: AppData.currentUser.id,
    };
    AppData.customers.push(newCustomer);
    Storage.save();
    return newCustomer;
  },

  updateCustomer: (id, customerData) => {
    const index = AppData.customers.findIndex((c) => c.id === id);
    if (index !== -1) {
      AppData.customers[index] = {
        ...AppData.customers[index],
        ...customerData,
      };
      Storage.save();
      return AppData.customers[index];
    }
    return null;
  },

  deleteCustomer: (id) => {
    const index = AppData.customers.findIndex((c) => c.id === id);
    if (index !== -1) {
      AppData.customers.splice(index, 1);
      Storage.save();
      return true;
    }
    return false;
  },

  getCustomer: (id) => {
    return AppData.customers.find((c) => c.id === id);
  },

  // Supplier operations
  getSuppliers: () => {
    if (!AppData.currentUser) return [];
    if (AppData.currentUser.role === "admin") {
      return AppData.suppliers;
    }
    return AppData.suppliers.filter((s) => s.userId === AppData.currentUser.id);
  },

  addSupplier: (supplierData) => {
    const newSupplier = {
      id: AppData.nextId.suppliers++,
      ...supplierData,
      balance: 0,
      totalSupplied: 0,
      lastTransaction: new Date().toISOString().split("T")[0],
      userId: AppData.currentUser.id,
    };
    AppData.suppliers.push(newSupplier);
    Storage.save();
    return newSupplier;
  },

  updateSupplier: (id, supplierData) => {
    const index = AppData.suppliers.findIndex((s) => s.id === id);
    if (index !== -1) {
      AppData.suppliers[index] = {
        ...AppData.suppliers[index],
        ...supplierData,
      };
      Storage.save();
      return AppData.suppliers[index];
    }
    return null;
  },

  deleteSupplier: (id) => {
    const index = AppData.suppliers.findIndex((s) => s.id === id);
    if (index !== -1) {
      AppData.suppliers.splice(index, 1);
      Storage.save();
      return true;
    }
    return false;
  },

  // Transaction operations
  getTransactions: () => {
    if (!AppData.currentUser) return [];
    if (AppData.currentUser.role === "admin") {
      return AppData.transactions;
    }
    return AppData.transactions.filter(
      (t) => t.userId === AppData.currentUser.id
    );
  },

  addTransaction: (transactionData) => {
    const newTransaction = {
      id: AppData.nextId.transactions++,
      ...transactionData,
      date: new Date().toISOString().split("T")[0],
      userId: AppData.currentUser.id,
    };
    AppData.transactions.push(newTransaction);

    // Update customer/supplier balances
    if (transactionData.type === "sale" && transactionData.customerId) {
      const customer = AppData.customers.find(
        (c) => c.id === transactionData.customerId
      );
      if (customer) {
        customer.balance += transactionData.amount;
        customer.totalPurchases += transactionData.amount;
        customer.lastTransaction = newTransaction.date;
      }
    } else if (
      transactionData.type === "expense" &&
      transactionData.supplierId
    ) {
      const supplier = AppData.suppliers.find(
        (s) => s.id === transactionData.supplierId
      );
      if (supplier) {
        supplier.balance -= transactionData.amount;
        supplier.totalSupplied += transactionData.amount;
        supplier.lastTransaction = newTransaction.date;
      }
    }

    Storage.save();
    return newTransaction;
  },

  // Dashboard statistics
  getDashboardStats: () => {
    const transactions = DataManager.getTransactions();
    const customers = DataManager.getCustomers();
    const suppliers = DataManager.getSuppliers();

    const totalSales = transactions
      .filter((t) => t.type === "sale")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalProfit = totalSales - totalExpenses;

    const totalReceivable = customers.reduce(
      (sum, c) => sum + Math.max(0, c.balance),
      0
    );
    const totalPayable = suppliers.reduce(
      (sum, s) => sum + Math.max(0, -s.balance),
      0
    );

    return {
      totalSales,
      totalExpenses,
      totalProfit,
      totalReceivable,
      totalPayable,
      customersCount: customers.length,
      suppliersCount: suppliers.length,
      transactionsCount: transactions.length,
    };
  },
};

// UI Helper Functions
const UI = {
  showAlert: (message, type = "success") => {
    const alertDiv = document.createElement("div");
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    alertDiv.style.cssText =
      "top: 20px; right: 20px; z-index: 9999; min-width: 300px;";
    alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
    document.body.appendChild(alertDiv);

    setTimeout(() => {
      if (alertDiv.parentElement) {
        alertDiv.remove();
      }
    }, 5000);
  },

  formatCurrency: (amount) => {
    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 0,
    }).format(amount);
  },

  formatDate: (dateString) => {
    return new Date(dateString).toLocaleDateString("en-BD");
  },

  updateActiveNavigation: () => {
    const currentPage = window.location.pathname.split("/").pop();
    const navLinks = document.querySelectorAll(".nav-link");

    navLinks.forEach((link) => {
      link.classList.remove("active");
      const href = link.getAttribute("href");
      if (
        href &&
        (href === currentPage || (currentPage === "" && href === "index.html"))
      ) {
        link.classList.add("active");
      }
    });
  },
};

// Form Handlers
const FormHandlers = {
  login: (event) => {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const user = Auth.login(email, password);
    if (user) {
      UI.showAlert("Login successful!", "success");
      setTimeout(() => {
        if (user.role === "admin") {
          window.location.href = "admin_dashboard.html";
        } else {
          window.location.href = "customer_dashboard.html";
        }
      }, 1000);
    } else {
      UI.showAlert("Invalid email or password!", "danger");
    }
  },

  register: (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const userData = {
      businessName: formData.get("businessName"),
      email: formData.get("email"),
      password: formData.get("password"),
      phone: formData.get("phone") || "",
    };

    const result = Auth.register(userData);
    if (result.success) {
      UI.showAlert("Registration successful!", "success");
      setTimeout(() => {
        window.location.href = "customer_dashboard.html";
      }, 1000);
    } else {
      UI.showAlert(result.message, "danger");
    }
  },

  forgotPassword: (event) => {
    event.preventDefault();
    const email = document.getElementById("email").value;
    // Simulate sending reset email
    UI.showAlert("Password reset link sent to your email!", "success");
    setTimeout(() => {
      window.location.href = "login.html";
    }, 2000);
  },

  addCustomer: (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const customerData = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      address: formData.get("address"),
    };

    DataManager.addCustomer(customerData);
    UI.showAlert("Customer added successfully!", "success");
    event.target.reset();

    // Close modal and refresh table
    const modal = bootstrap.Modal.getInstance(
      document.getElementById("addCustomerModal")
    );
    if (modal) modal.hide();

    if (typeof loadCustomers === "function") {
      loadCustomers();
    }
  },

  addSupplier: (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const supplierData = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      address: formData.get("address"),
    };

    DataManager.addSupplier(supplierData);
    UI.showAlert("Supplier added successfully!", "success");
    event.target.reset();

    // Close modal and refresh table
    const modal = bootstrap.Modal.getInstance(
      document.getElementById("addSupplierModal")
    );
    if (modal) modal.hide();

    if (typeof loadSuppliers === "function") {
      loadSuppliers();
    }
  },

  addTransaction: (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const activeTab = document.querySelector(
      "#transactionType .nav-link.active"
    ).id;
    const type = activeTab === "sale-tab" ? "sale" : "expense";

    const transactionData = {
      type: type,
      amount: parseFloat(formData.get("amount")),
      description: formData.get("description"),
      paymentMethod: formData.get("paymentMethod"),
    };

    if (type === "sale") {
      transactionData.customerId = parseInt(formData.get("customerId"));
    } else {
      transactionData.supplierId = parseInt(formData.get("supplierId"));
    }

    DataManager.addTransaction(transactionData);
    UI.showAlert("Transaction added successfully!", "success");
    event.target.reset();

    // Close modal and refresh data
    const modal = bootstrap.Modal.getInstance(
      document.getElementById("transactionModal")
    );
    if (modal) modal.hide();

    // Refresh dashboard if on dashboard page
    if (typeof loadDashboardData === "function") {
      loadDashboardData();
    }
  },
};

// Initialize app when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Load data from localStorage
  Storage.load();

  // Initialize language system
  LanguageManager.init();

  // Update navigation
  UI.updateActiveNavigation();

  // Initialize page-specific functionality
  const currentPage = window.location.pathname.split("/").pop();

  switch (currentPage) {
    case "login.html":
      initLoginPage();
      break;
    case "register.html":
      initRegisterPage();
      break;
    case "forgot_password.html":
      initForgotPasswordPage();
      break;
    case "customer_dashboard.html":
      initCustomerDashboard();
      break;
    case "admin_dashboard.html":
      initAdminDashboard();
      break;
    case "customers_page.html":
      initCustomersPage();
      break;
    case "suppliers_page.html":
      initSuppliersPage();
      break;
    case "reports_page.html":
      initReportsPage();
      break;
    case "settings.html":
      initSettingsPage();
      break;
    case "customer_details.html":
      initCustomerDetailsPage();
      break;
    case "admin_manage_users.html":
      initAdminManageUsers();
      break;
    case "admin_system_reports.html":
      initAdminSystemReports();
      break;
    default:
      // Index page or other pages
      break;
  }
});

// Page-specific initialization functions
function initLoginPage() {
  const form = document.getElementById("loginForm");
  if (form) {
    form.addEventListener("submit", FormHandlers.login);
  }
}

function initRegisterPage() {
  const form = document.getElementById("registerForm");
  if (form) {
    form.addEventListener("submit", FormHandlers.register);
  }
}

function initForgotPasswordPage() {
  const form = document.getElementById("forgotPasswordForm");
  if (form) {
    form.addEventListener("submit", FormHandlers.forgotPassword);
  }
}

function initCustomerDashboard() {
  if (!Auth.requireAuth()) return;
  loadDashboardData();
  initDashboardTransactionModal();
}

function initAdminDashboard() {
  if (!Auth.requireAdmin()) return;
  loadAdminDashboardData();
}

function initCustomersPage() {
  if (!Auth.requireAuth()) return;
  loadCustomers();
  initCustomerModal();
}

function initSuppliersPage() {
  if (!Auth.requireAuth()) return;
  loadSuppliers();
  initSupplierModal();
}

function initReportsPage() {
  if (!Auth.requireAuth()) return;
  loadReports();
}

function initSettingsPage() {
  if (!Auth.requireAuth()) return;
  loadSettings();
}

function initCustomerDetailsPage() {
  if (!Auth.requireAuth()) return;
  loadCustomerDetails();
}

function initAdminManageUsers() {
  if (!Auth.requireAdmin()) return;
  loadUsers();
}

function initAdminSystemReports() {
  if (!Auth.requireAdmin()) return;
  loadSystemReports();
}

// Dashboard data loading
function loadDashboardData() {
  const stats = DataManager.getDashboardStats();

  // Update stat cards - Updated for customer dashboard
  updateStatCard("totalSales", stats.totalSales);
  updateStatCard("totalReceived", stats.totalSales - stats.totalReceivable);
  updateStatCard("totalDues", stats.totalReceivable);

  // Load recent transactions
  loadRecentTransactions();
}

function loadAdminDashboardData() {
  const stats = DataManager.getDashboardStats();

  // Update admin stat cards
  updateStatCard("totalUsers", AppData.users.length);
  updateStatCard("totalRevenue", stats.totalSales);
  updateStatCard("totalTransactions", stats.transactionsCount);
  updateStatCard(
    "activeBusinesses",
    AppData.users.filter((u) => u.role === "user").length
  );
}

function updateStatCard(elementId, value) {
  const element = document.getElementById(elementId);
  if (element) {
    if (
      typeof value === "number" &&
      elementId.includes("total") &&
      !elementId.includes("Count")
    ) {
      element.textContent = UI.formatCurrency(value);
    } else {
      element.textContent =
        typeof value === "number" ? value.toLocaleString() : value;
    }
  }
}

function loadRecentTransactions() {
  const transactions = DataManager.getTransactions().slice(-5).reverse();
  const tbody = document.querySelector("#recentTransactionsTable");
  if (!tbody) return;

  if (transactions.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" class="text-center text-muted">
          <i class="bi bi-inbox"></i><br>
          No transactions yet
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = transactions
    .map((transaction) => {
      const isIncome =
        transaction.type === "sale" || transaction.type === "payment_received";
      const partner = isIncome
        ? DataManager.getCustomers().find(
            (c) => c.id === transaction.customerId
          )?.name || "Unknown Customer"
        : DataManager.getSuppliers().find(
            (s) => s.id === transaction.supplierId
          )?.name || "Unknown Supplier";

      const typeLabel =
        {
          sale: "Sale",
          expense: "Expense",
          payment_received: "Received",
          payment_made: "Payment",
        }[transaction.type] || transaction.type;

      return `
            <tr>
                <td>${UI.formatDate(transaction.date)}</td>
                <td>${partner}</td>
                <td>${transaction.description}</td>
                <td>
                    <span class="badge bg-${isIncome ? "success" : "danger"}">
                        ${typeLabel}
                    </span>
                </td>
                <td class="text-end text-${
                  isIncome ? "success" : "danger"
                } fw-bold">
                    ${isIncome ? "+" : "-"}${UI.formatCurrency(
        transaction.amount
      )}
                </td>
            </tr>
        `;
    })
    .join("");
}

// Customers page functions
function loadCustomers() {
  const customers = DataManager.getCustomers();
  const tbody = document.querySelector("#customersTable tbody");
  if (!tbody) return;

  tbody.innerHTML = customers
    .map(
      (customer) => `
        <tr>
            <td>
                <div class="d-flex align-items-center">
                    <div class="avatar bg-primary text-white rounded-circle me-3 d-flex align-items-center justify-content-center" style="width: 40px; height: 40px;">
                        ${customer.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h6 class="mb-0">${customer.name}</h6>
                        <small class="text-muted">${customer.email}</small>
                    </div>
                </div>
            </td>
            <td>${customer.phone}</td>
            <td class="text-${customer.balance >= 0 ? "success" : "danger"}">
                ${UI.formatCurrency(Math.abs(customer.balance))}
                ${customer.balance < 0 ? "(Due)" : ""}
            </td>
            <td>${UI.formatDate(customer.lastTransaction)}</td>
            <td>
                <div class="btn-group btn-group-sm">
                    <button class="btn btn-outline-primary" onclick="viewCustomer(${
                      customer.id
                    })">
                        <i class="bi bi-eye"></i>
                    </button>
                    <button class="btn btn-outline-success" onclick="editCustomer(${
                      customer.id
                    })" data-bs-toggle="modal" data-bs-target="#addCustomerModal">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-outline-danger" onclick="deleteCustomerConfirm(${
                      customer.id
                    })">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `
    )
    .join("");
}

function initCustomerModal() {
  const form = document.getElementById("addCustomerForm");
  if (form) {
    form.addEventListener("submit", FormHandlers.addCustomer);
  }

  // Add click handler for Save Customer button
  const saveButton = document.getElementById("saveCustomer");
  if (saveButton) {
    saveButton.addEventListener("click", () => {
      const form = document.getElementById("addCustomerForm");
      if (form) {
        form.dispatchEvent(new Event("submit"));
      }
    });
  }

  // Reset form when modal is closed
  const modal = document.getElementById("addCustomerModal");
  if (modal) {
    modal.addEventListener("hidden.bs.modal", () => {
      document.getElementById("addCustomerForm").reset();
      const modalLabel = document.querySelector(
        "#addCustomerModal .modal-title"
      );
      if (modalLabel) modalLabel.textContent = "Add New Customer";
    });
  }
}

function viewCustomer(customerId) {
  window.location.href = `customer_details.html?id=${customerId}`;
}

function editCustomer(customerId) {
  const customer = DataManager.getCustomer(customerId);
  if (!customer) return;

  // Fill form with customer data
  document.getElementById("customerName").value = customer.name;
  document.getElementById("customerEmail").value = customer.email;
  document.getElementById("customerPhone").value = customer.phone;
  document.getElementById("customerAddress").value = customer.address;

  // Change modal title
  document.getElementById("addCustomerModalLabel").textContent =
    "Edit Customer";

  // Update form handler to edit mode
  const form = document.getElementById("addCustomerForm");
  form.onsubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updatedData = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      address: formData.get("address"),
    };

    DataManager.updateCustomer(customerId, updatedData);
    UI.showAlert("Customer updated successfully!", "success");

    const modal = bootstrap.Modal.getInstance(
      document.getElementById("addCustomerModal")
    );
    modal.hide();
    loadCustomers();
  };
}

function deleteCustomerConfirm(customerId) {
  const customer = DataManager.getCustomer(customerId);
  if (!customer) return;

  if (confirm(`Are you sure you want to delete ${customer.name}?`)) {
    DataManager.deleteCustomer(customerId);
    UI.showAlert("Customer deleted successfully!", "success");
    loadCustomers();
  }
}

// Suppliers page functions
function loadSuppliers() {
  const suppliers = DataManager.getSuppliers();
  const tbody = document.querySelector("#suppliersTable tbody");
  if (!tbody) return;

  tbody.innerHTML = suppliers
    .map(
      (supplier) => `
        <tr>
            <td>
                <div class="d-flex align-items-center">
                    <div class="avatar bg-info text-white rounded-circle me-3 d-flex align-items-center justify-content-center" style="width: 40px; height: 40px;">
                        ${supplier.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h6 class="mb-0">${supplier.name}</h6>
                        <small class="text-muted">${supplier.email}</small>
                    </div>
                </div>
            </td>
            <td>${supplier.phone}</td>
            <td class="text-${supplier.balance <= 0 ? "danger" : "success"}">
                ${UI.formatCurrency(Math.abs(supplier.balance))}
                ${supplier.balance < 0 ? "(Payable)" : ""}
            </td>
            <td>${UI.formatDate(supplier.lastTransaction)}</td>
            <td>
                <div class="btn-group btn-group-sm">
                    <button class="btn btn-outline-primary" onclick="viewSupplier(${
                      supplier.id
                    })">
                        <i class="bi bi-eye"></i>
                    </button>
                    <button class="btn btn-outline-success" onclick="editSupplier(${
                      supplier.id
                    })" data-bs-toggle="modal" data-bs-target="#addSupplierModal">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-outline-danger" onclick="deleteSupplierConfirm(${
                      supplier.id
                    })">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `
    )
    .join("");
}

function initSupplierModal() {
  const form = document.getElementById("addSupplierForm");
  if (form) {
    form.addEventListener("submit", FormHandlers.addSupplier);
  }

  // Add click handler for Save Supplier button
  const saveButton = document.getElementById("saveSupplier");
  if (saveButton) {
    saveButton.addEventListener("click", () => {
      const form = document.getElementById("addSupplierForm");
      if (form) {
        form.dispatchEvent(new Event("submit"));
      }
    });
  }

  // Reset form when modal is closed
  const modal = document.getElementById("addSupplierModal");
  if (modal) {
    modal.addEventListener("hidden.bs.modal", () => {
      document.getElementById("addSupplierForm").reset();
      const modalLabel = document.querySelector(
        "#addSupplierModal .modal-title"
      );
      if (modalLabel) modalLabel.textContent = "Add New Supplier";
    });
  }
}

function editSupplier(supplierId) {
  const supplier = DataManager.getSuppliers().find((s) => s.id === supplierId);
  if (!supplier) return;

  // Fill form with supplier data
  document.getElementById("supplierName").value = supplier.name;
  document.getElementById("supplierEmail").value = supplier.email;
  document.getElementById("supplierPhone").value = supplier.phone;
  document.getElementById("supplierAddress").value = supplier.address;

  // Change modal title
  document.getElementById("addSupplierModalLabel").textContent =
    "Edit Supplier";

  // Update form handler to edit mode
  const form = document.getElementById("addSupplierForm");
  form.onsubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updatedData = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      address: formData.get("address"),
    };

    DataManager.updateSupplier(supplierId, updatedData);
    UI.showAlert("Supplier updated successfully!", "success");

    const modal = bootstrap.Modal.getInstance(
      document.getElementById("addSupplierModal")
    );
    modal.hide();
    loadSuppliers();
  };
}

function viewSupplier(supplierId) {
  window.location.href = `supplier_details.html?id=${supplierId}`;
}

function deleteSupplierConfirm(supplierId) {
  const supplier = DataManager.getSuppliers().find((s) => s.id === supplierId);
  if (!supplier) return;

  if (confirm(`Are you sure you want to delete ${supplier.name}?`)) {
    DataManager.deleteSupplier(supplierId);
    UI.showAlert("Supplier deleted successfully!", "success");
    loadSuppliers();
  }
}

// Dashboard transaction modal functions
function initDashboardTransactionModal() {
  const form = document.getElementById("addTransactionForm");
  if (form) {
    form.addEventListener("submit", handleDashboardTransaction);
  }

  // Load customers and suppliers for transaction dropdowns
  loadTransactionParties();

  // Set default date to today
  const dateInput = document.getElementById("transactionDate");
  if (dateInput) {
    dateInput.value = new Date().toISOString().split("T")[0];
  }

  // Update party dropdown based on transaction type
  const typeSelect = document.getElementById("transactionType");
  if (typeSelect) {
    typeSelect.addEventListener("change", updateTransactionParties);
  }

  // Add click handler for Save Transaction button
  const saveButton = document.getElementById("saveTransaction");
  if (saveButton) {
    saveButton.addEventListener("click", () => {
      const form = document.getElementById("addTransactionForm");
      if (form) {
        form.dispatchEvent(new Event("submit"));
      }
    });
  }
}

function loadTransactionParties() {
  const customers = DataManager.getCustomers();
  const suppliers = DataManager.getSuppliers();
  const partySelect = document.getElementById("transactionParty");

  if (!partySelect) return;

  let options = '<option value="">Select Customer/Supplier</option>';

  // Add customers
  customers.forEach((customer) => {
    options += `<option value="customer_${customer.id}">${customer.name} (Customer)</option>`;
  });

  // Add suppliers
  suppliers.forEach((supplier) => {
    options += `<option value="supplier_${supplier.id}">${supplier.name} (Supplier)</option>`;
  });

  partySelect.innerHTML = options;
}

function updateTransactionParties() {
  const typeSelect = document.getElementById("transactionType");
  const partySelect = document.getElementById("transactionParty");

  if (!typeSelect || !partySelect) return;

  const transactionType = typeSelect.value;
  const customers = DataManager.getCustomers();
  const suppliers = DataManager.getSuppliers();

  let options = '<option value="">Select ';

  if (transactionType === "sale" || transactionType === "payment_received") {
    options += "Customer</option>";
    customers.forEach((customer) => {
      options += `<option value="customer_${customer.id}">${customer.name}</option>`;
    });
  } else if (
    transactionType === "expense" ||
    transactionType === "payment_made"
  ) {
    options += "Supplier</option>";
    suppliers.forEach((supplier) => {
      options += `<option value="supplier_${supplier.id}">${supplier.name}</option>`;
    });
  } else {
    options += "Customer/Supplier</option>";
    customers.forEach((customer) => {
      options += `<option value="customer_${customer.id}">${customer.name} (Customer)</option>`;
    });
    suppliers.forEach((supplier) => {
      options += `<option value="supplier_${supplier.id}">${supplier.name} (Supplier)</option>`;
    });
  }

  partySelect.innerHTML = options;
}

function handleDashboardTransaction(event) {
  event.preventDefault();
  const formData = new FormData(event.target);

  const party = formData.get("party_id");
  const transactionData = {
    type: formData.get("type"),
    amount: parseFloat(formData.get("amount")),
    description: formData.get("description"),
    date: formData.get("date"),
  };

  // Parse party selection
  if (party) {
    const [partyType, partyId] = party.split("_");
    if (partyType === "customer") {
      transactionData.customerId = parseInt(partyId);
    } else if (partyType === "supplier") {
      transactionData.supplierId = parseInt(partyId);
    }
  }

  DataManager.addTransaction(transactionData);
  UI.showAlert("Transaction added successfully!", "success");

  // Reset form and close modal
  event.target.reset();
  const modal = bootstrap.Modal.getInstance(
    document.getElementById("addTransactionModal")
  );
  if (modal) modal.hide();

  // Refresh dashboard data
  loadDashboardData();
}

// Transaction modal functions
function initTransactionModal() {
  const form = document.getElementById("transactionForm");
  if (form) {
    form.addEventListener("submit", FormHandlers.addTransaction);
  }

  // Load customers and suppliers for dropdowns
  loadTransactionDropdowns();

  // Handle tab switching
  const tabs = document.querySelectorAll("#transactionType .nav-link");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      updateTransactionForm();
    });
  });
}

function loadTransactionDropdowns() {
  const customers = DataManager.getCustomers();
  const suppliers = DataManager.getSuppliers();

  const customerSelect = document.getElementById("customerId");
  const supplierSelect = document.getElementById("supplierId");

  if (customerSelect) {
    customerSelect.innerHTML =
      '<option value="">Select Customer</option>' +
      customers
        .map((c) => `<option value="${c.id}">${c.name}</option>`)
        .join("");
  }

  if (supplierSelect) {
    supplierSelect.innerHTML =
      '<option value="">Select Supplier</option>' +
      suppliers
        .map((s) => `<option value="${s.id}">${s.name}</option>`)
        .join("");
  }
}

function updateTransactionForm() {
  const activeTab = document.querySelector(
    "#transactionType .nav-link.active"
  ).id;
  const customerGroup = document.getElementById("customerGroup");
  const supplierGroup = document.getElementById("supplierGroup");

  if (activeTab === "sale-tab") {
    customerGroup.style.display = "block";
    supplierGroup.style.display = "none";
    document.getElementById("customerId").required = true;
    document.getElementById("supplierId").required = false;
  } else {
    customerGroup.style.display = "none";
    supplierGroup.style.display = "block";
    document.getElementById("customerId").required = false;
    document.getElementById("supplierId").required = true;
  }
}

// Reports page functions
function loadReports() {
  generateSalesReport();
  generateExpenseReport();
  generateProfitReport();
}

function generateSalesReport() {
  const transactions = DataManager.getTransactions().filter(
    (t) => t.type === "sale"
  );
  const totalSales = transactions.reduce((sum, t) => sum + t.amount, 0);

  document.getElementById("totalSales").textContent =
    UI.formatCurrency(totalSales);
  document.getElementById("salesCount").textContent = transactions.length;
}

function generateExpenseReport() {
  const transactions = DataManager.getTransactions().filter(
    (t) => t.type === "expense"
  );
  const totalExpenses = transactions.reduce((sum, t) => sum + t.amount, 0);

  document.getElementById("totalExpenses").textContent =
    UI.formatCurrency(totalExpenses);
  document.getElementById("expenseCount").textContent = transactions.length;
}

function generateProfitReport() {
  const stats = DataManager.getDashboardStats();
  document.getElementById("totalProfit").textContent = UI.formatCurrency(
    stats.totalProfit
  );

  const profitMargin =
    stats.totalSales > 0 ? (stats.totalProfit / stats.totalSales) * 100 : 0;
  document.getElementById("profitMargin").textContent =
    profitMargin.toFixed(1) + "%";
}

// Settings page functions
function loadSettings() {
  // Load current user settings
  if (AppData.currentUser) {
    const form = document.getElementById("settingsForm");
    if (form) {
      form.businessName.value = AppData.currentUser.businessName;
      form.email.value = AppData.currentUser.email;
      form.phone.value = AppData.currentUser.phone || "";
      form.address.value = AppData.currentUser.address || "";
    }
  }

  // Add form submit handler
  const form = document.getElementById("settingsForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);

      // Update current user
      AppData.currentUser.businessName = formData.get("businessName");
      AppData.currentUser.phone = formData.get("phone");
      AppData.currentUser.address = formData.get("address");

      Storage.save();
      UI.showAlert("Settings updated successfully!", "success");
    });
  }
}

// Customer details page functions
function loadCustomerDetails() {
  const urlParams = new URLSearchParams(window.location.search);
  const customerId = parseInt(urlParams.get("id"));

  if (!customerId) {
    window.location.href = "customers_page.html";
    return;
  }

  const customer = DataManager.getCustomer(customerId);
  if (!customer) {
    UI.showAlert("Customer not found!", "danger");
    window.location.href = "customers_page.html";
    return;
  }

  // Update customer info
  document.getElementById("customerName").textContent = customer.name;
  document.getElementById("customerEmail").textContent = customer.email;
  document.getElementById("customerPhone").textContent = customer.phone;
  document.getElementById("customerAddress").textContent = customer.address;
  document.getElementById("customerBalance").textContent = UI.formatCurrency(
    Math.abs(customer.balance)
  );
  document.getElementById("customerBalance").className =
    customer.balance >= 0 ? "text-success" : "text-danger";

  // Load customer transactions
  loadCustomerTransactions(customerId);
}

function loadCustomerTransactions(customerId) {
  const transactions = DataManager.getTransactions().filter(
    (t) => t.customerId === customerId
  );
  const tbody = document.querySelector("#customerTransactions tbody");

  if (!tbody) return;

  tbody.innerHTML = transactions
    .map(
      (transaction) => `
        <tr>
            <td>${UI.formatDate(transaction.date)}</td>
            <td>${transaction.description}</td>
            <td>
                <span class="badge bg-${
                  transaction.type === "sale" ? "success" : "warning"
                }">
                    ${
                      transaction.type.charAt(0).toUpperCase() +
                      transaction.type.slice(1)
                    }
                </span>
            </td>
            <td class="text-success">+${UI.formatCurrency(
              transaction.amount
            )}</td>
            <td>
                <span class="badge bg-secondary">
                    ${transaction.paymentMethod.replace("_", " ").toUpperCase()}
                </span>
            </td>
        </tr>
    `
    )
    .join("");
}

// Admin page functions
function loadUsers() {
  const users = AppData.users.filter((u) => u.role === "user");
  const tbody = document.querySelector("#usersTable tbody");
  if (!tbody) return;

  tbody.innerHTML = users
    .map(
      (user) => `
        <tr>
            <td>
                <div class="d-flex align-items-center">
                    <div class="avatar bg-success text-white rounded-circle me-3 d-flex align-items-center justify-content-center" style="width: 40px; height: 40px;">
                        ${user.businessName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h6 class="mb-0">${user.businessName}</h6>
                        <small class="text-muted">${user.email}</small>
                    </div>
                </div>
            </td>
            <td>${user.phone || "N/A"}</td>
            <td>
                <span class="badge bg-success">Active</span>
            </td>
            <td>${UI.formatDate(user.created)}</td>
            <td>
                <div class="btn-group btn-group-sm">
                    <button class="btn btn-outline-primary" onclick="viewUserDetails(${
                      user.id
                    })">
                        <i class="bi bi-eye"></i>
                    </button>
                    <button class="btn btn-outline-warning" onclick="suspendUser(${
                      user.id
                    })">
                        <i class="bi bi-pause"></i>
                    </button>
                </div>
            </td>
        </tr>
    `
    )
    .join("");
}

function loadSystemReports() {
  const stats = DataManager.getDashboardStats();

  // Update system statistics
  document.getElementById("totalSystemUsers").textContent =
    AppData.users.length;
  document.getElementById("totalSystemRevenue").textContent = UI.formatCurrency(
    stats.totalSales
  );
  document.getElementById("totalSystemTransactions").textContent =
    stats.transactionsCount;
  document.getElementById("activeBusinessAccounts").textContent =
    AppData.users.filter((u) => u.role === "user").length;
}

// Logout function
function logout() {
  if (confirm("Are you sure you want to logout?")) {
    Auth.logout();
  }
}

// Make functions globally available
window.logout = logout;
window.viewCustomer = viewCustomer;
window.editCustomer = editCustomer;
window.deleteCustomerConfirm = deleteCustomerConfirm;
window.editSupplier = editSupplier;
window.deleteSupplierConfirm = deleteSupplierConfirm;
window.loadCustomers = loadCustomers;
window.loadSuppliers = loadSuppliers;
window.loadDashboardData = loadDashboardData;
window.updateTransactionForm = updateTransactionForm;
window.handleDashboardTransaction = handleDashboardTransaction;
window.viewSupplier = viewSupplier;

// Initialize Language Manager when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  LanguageManager.init();
});
