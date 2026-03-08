// Persistent Simulated Database (LocalStorage)

const defaultDb = {
  // --- Payroll Setup (Advanced) ---
  salaryComponents: [
    { id: 1, name: "Basic Salary", code: "1001", type: "Earning", category: "Statutory", calcType: "Fixed Amount", value: 0, taxable: "Yes", isIncomeTax: "Yes", isInvestment: "No", sortOrder: 1, description: "Base salary" },
    { id: 2, name: "House Rent Allowance (HRA)", code: "1002", type: "Earning", category: "Non-Statutory", calcType: "Percentage of Basic", value: 50, taxable: "Yes", isIncomeTax: "Yes", isInvestment: "No", sortOrder: 2, description: "50% of Basic" },
    { id: 3, name: "Transport Allowance", code: "1003", type: "Earning", category: "Non-Statutory", calcType: "Fixed Amount", value: 3000, taxable: "No", isIncomeTax: "No", isInvestment: "No", sortOrder: 3, description: "Fixed transport allowance" },
    { id: 4, name: "Medical Allowance", code: "1004", type: "Earning", category: "Non-Statutory", calcType: "Fixed Amount", value: 2000, taxable: "No", isIncomeTax: "No", isInvestment: "No", sortOrder: 4, description: "Fixed medical allowance" },
    { id: 5, name: "Provident Fund (PF)", code: "2001", type: "Deduction", category: "Statutory", calcType: "Percentage of Basic", value: 10, taxable: "No", isIncomeTax: "No", isInvestment: "Yes", sortOrder: 5, description: "10% of Basic" },
    { id: 6, name: "Tax (TDS)", code: "2002", type: "Deduction", category: "Statutory", calcType: "Formula", value: 0, taxable: "No", isIncomeTax: "No", isInvestment: "No", sortOrder: 6, description: "Calculated based on Tax Slabs" },
  ],
  
  // Stores specific breakdown per employee
  employeeSalaryStructures: [
      // Example: { empId: 'EMP001', effectiveDate: '2025-01-01', grade: 'Grade 3', slab: 66120, heads: { '1001': 50000, '1002': 25000 ... } }
  ],

  salaryPeriods: [
    { id: "Salary-January-2026", name: "Salary-January-2026", month: "January", year: "2026", taxYear: "2025-2026", workingDays: 31, status: "Open", processedDate: null },
  ],
  
  taxSlabs: [
    { id: 1, min: 0, max: 350000, rate: 0 },
    { id: 2, min: 350001, max: 450000, rate: 5 },
    { id: 3, min: 450001, max: 750000, rate: 10 },
    { id: 4, min: 750001, max: 1150000, rate: 15 },
    { id: 5, min: 1150001, max: 1650000, rate: 20 },
    { id: 6, min: 1650001, max: 9999999999, rate: 25 }
  ],
  
  pfSettings: {
    employeeContribution: 10,
    employerContribution: 10,
    ceiling: 0
  },
  
  payrollRecords: [], // Stores calculated payroll data
  
  employees: [], // Will be seeded if empty

  leaveRequests: [],
  leaveBalances: [
      // Seed some balances
      { id: 1, empId: 'EMP001', year: 2026, type: 'Casual', allocated: 14, used: 2 },
      { id: 2, empId: 'EMP001', year: 2026, type: 'Medical', allocated: 10, used: 0 },
      { id: 3, empId: 'EMP001', year: 2026, type: 'Earned', allocated: 15, used: 5 },
      { id: 4, empId: 'EMP002', year: 2026, type: 'Casual', allocated: 14, used: 0 },
      { id: 5, empId: 'EMP002', year: 2026, type: 'Medical', allocated: 10, used: 1 },
  ],
  attendance: [],
  communicationLogs: [
      { id: 1, date: "2025-10-20 10:00 AM", channel: "SMS", target: "All Employees", subject: "", msg: "Office closed on Friday.", status: "Sent" },
      { id: 2, date: "2025-10-18 09:30 AM", channel: "Email", target: "Engineering", subject: "Server Migration", msg: "Server migration tonight...", status: "Sent" },
  ],
  communicationTemplates: [
      { id: 1, name: "Holiday Notice", channel: "SMS", subject: "", content: "Office will remain closed tomorrow due to public holiday." },
      { id: 2, name: "Meeting Reminder", channel: "Email", subject: "Meeting Reminder", content: "Dear Team,\n\nThis is a reminder for the upcoming meeting at 3 PM.\n\nRegards,\nHR" }
  ],
  smsLogs: [], // Legacy/Deprecated
  users: [],
  auditLogs: [],
  jobs: [],
  candidates: [],
  reviews: [],
  assets: [],
  holidays: [],
  salaryTemplates: [], // Legacy/Optional
  salaryHeads: [] // Legacy
};

// --- Storage Engine ---
const StorageKey = "HR_PAYROLL_DB_V5"; // Upgraded Version

function loadDb() {
  const saved = localStorage.getItem(StorageKey);
  if (saved) {
      const parsed = JSON.parse(saved);
      if(!parsed.communicationLogs) parsed.communicationLogs = defaultDb.communicationLogs;
      if(!parsed.communicationTemplates) parsed.communicationTemplates = defaultDb.communicationTemplates;
      return parsed;
  }
  return JSON.parse(JSON.stringify(defaultDb));
}

function saveDb() {
  localStorage.setItem(StorageKey, JSON.stringify(db));
}

// Initialize
let db = loadDb();

// --- Seed Data for Demo (Preserved from original) ---
if (db.employees.length < 5) {
    const demoDepts = ['Engineering', 'Sales', 'Marketing', 'HR', 'Finance', 'Support'];
    const demoPos = ['Manager', 'Associate', 'Senior Lead', 'Intern'];
    const demoNames = ['John', 'Jane', 'Michael', 'Emily', 'David', 'Sarah', 'Robert', 'Jessica', 'William', 'Ashley'];
    
    for(let i=0; i<15; i++) {
        const randDept = demoDepts[Math.floor(Math.random() * demoDepts.length)];
        const randName = demoNames[Math.floor(Math.random() * demoNames.length)];
        const randSal = 40000 + Math.floor(Math.random() * 80000);
        
        db.employees.push({
            id: 'EMP' + (100 + i),
            firstName: randName,
            lastName: 'Doe',
            email: `${randName.toLowerCase()}${i}@company.com`,
            dept: randDept,
            position: demoPos[Math.floor(Math.random() * demoPos.length)],
            start: '2023-01-' + (10 + i),
            salary: randSal,
            status: Math.random() > 0.8 ? 'On Leave' : 'Active',
            location: Math.random() > 0.7 ? 'Remote' : 'HQ',
            gender: Math.random() > 0.5 ? 'Male' : 'Female'
        });
    }
    saveDb();
}

// --- Service Functions ---

const AppServices = {
  // Basic CRUD Helpers
  getEmployees: () => db.employees,
  getEmployeeById: (id) => db.employees.find((e) => e.id === id),
  addEmployee: (emp) => { db.employees.push(emp); saveDb(); },
  updateEmployee: (emp) => { const idx = db.employees.findIndex((e) => e.id === emp.id); if (idx !== -1) db.employees[idx] = emp; saveDb(); },
  deleteEmployee: (id) => { db.employees = db.employees.filter((e) => e.id !== id); saveDb(); },

  getStats: () => {
    const totalSalary = db.employees.reduce((acc, curr) => acc + curr.salary / 12, 0);
    return {
      totalEmp: db.employees.length,
      monthlyPayroll: Math.round(totalSalary),
      pendingLeaves: db.leaveRequests.filter((l) => l.status === "Pending").length,
    };
  },

  getLeaves: () => db.leaveRequests,
  addLeave: (leave) => { 
      leave.id = db.leaveRequests.length + 1; 
      leave.status = "Pending"; 
      db.leaveRequests.push(leave); 
      saveDb(); 
  },
  updateLeaveStatus: (id, status) => { 
      const req = db.leaveRequests.find((l) => l.id === id); 
      if (req) {
          req.status = status;
          // If approved, deduct balance
          if (status === 'Approved') {
              const bal = AppServices.getLeaveBalanceByEmp(req.empId, new Date(req.from).getFullYear(), req.type);
              if (bal) {
                  // Calculate days (simple diff)
                  const diff = new Date(req.to) - new Date(req.from);
                  const days = Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
                  bal.used += days;
              }
          }
          saveDb();
      }
  },

  // --- Communication Services ---
  getCommLogs: () => db.communicationLogs,
  addCommLog: (log) => { log.id = db.communicationLogs.length + 1; db.communicationLogs.unshift(log); saveDb(); },
  
  getCommTemplates: () => db.communicationTemplates,
  addCommTemplate: (temp) => { temp.id = db.communicationTemplates.length + 1; db.communicationTemplates.push(temp); saveDb(); },
  deleteCommTemplate: (id) => { db.communicationTemplates = db.communicationTemplates.filter(t => t.id !== id); saveDb(); },

  // --- Leave Balance Services ---
  getLeaveBalances: () => db.leaveBalances,
  getLeaveBalanceByEmp: (empId, year, type) => {
      if (type) return db.leaveBalances.find(b => b.empId === empId && b.year == year && b.type === type);
      return db.leaveBalances.filter(b => b.empId === empId && b.year == year);
  },
  addLeaveBalance: (bal) => {
      const existing = db.leaveBalances.find(b => b.empId === bal.empId && b.year == bal.year && b.type === bal.type);
      if (existing) { existing.allocated = bal.allocated; } 
      else { bal.id = db.leaveBalances.length + 1; bal.used = 0; db.leaveBalances.push(bal); }
  getSalaryComponents: () => db.salaryComponents,
  addComponent: (comp) => { comp.id = db.salaryComponents.length + 1; db.salaryComponents.push(comp); saveDb(); },
  deleteComponent: (id) => { db.salaryComponents = db.salaryComponents.filter(c => c.id !== id); saveDb(); },
  
  // Specific Structure per Employee
  getEmpSalaryStructure: (empId) => db.employeeSalaryStructures.find(s => s.empId === empId),
  saveEmpSalaryStructure: (structure) => {
      const idx = db.employeeSalaryStructures.findIndex(s => s.empId === structure.empId);
      if(idx !== -1) db.employeeSalaryStructures[idx] = structure;
      else db.employeeSalaryStructures.push(structure);
      saveDb();
  },

  getSalaryTemplates: () => db.salaryTemplates, // Kept for reference
  addTemplate: (temp) => { temp.id = db.salaryTemplates.length + 1; db.salaryTemplates.push(temp); saveDb(); },
  deleteTemplate: (id) => { db.salaryTemplates = db.salaryTemplates.filter(t => t.id !== id); saveDb(); },
  
  getTaxSlabs: () => db.taxSlabs,
  updateTaxSlabs: (slabs) => { db.taxSlabs = slabs; saveDb(); },
  
  getPFSettings: () => db.pfSettings,
  updatePFSettings: (settings) => { db.pfSettings = settings; saveDb(); },

  getPeriods: () => db.salaryPeriods,
  createPeriod: (period) => {
      // Ensure unique ID
      const exists = db.salaryPeriods.find(p => p.id === period.id);
      if(exists) return false;
      db.salaryPeriods.push(period);
      saveDb();
      return true;
  },
  
  // Advanced Calculation Logic (Updated for Employee Structure)
  calculatePayroll: (emp, periodId) => {
      // 1. Get Employee Structure
      const struct = AppServices.getEmpSalaryStructure(emp.id);
      
      let totalEarnings = 0;
      let totalDeductions = 0;
      let earningsList = [];
      let deductionsList = [];
      
      // If no structure, fallback to Basic assumption (old logic) or 0
      if (!struct || !struct.heads) {
           // Fallback logic
           const annualSalary = emp.salary || 0;
           const monthlyGross = annualSalary / 12;
           const basicSalary = Math.round(monthlyGross * 0.6);
           
           // Basic
           earningsList.push({ name: 'Basic Salary (Auto)', amount: basicSalary });
           totalEarnings += basicSalary;
      } else {
          // Use specific heads
          const components = db.salaryComponents;
          
          components.forEach(c => {
               // Get amount from structure using Head Code or ID. Let's use ID for consistency.
               // But demo uses Head Code. I'll check both or key by ID.
               // Assuming structure.heads is keyed by Component ID for simplicity in code, or Code.
               // Let's use Component ID in the DB for stability.
               const amount = parseFloat(struct.heads[c.id]) || 0;
               if (amount > 0) {
                   if (c.type === 'Earning') {
                       earningsList.push({ name: c.name, amount: amount });
                       totalEarnings += amount;
                   } else {
                       deductionsList.push({ name: c.name, amount: amount });
                       totalDeductions += amount;
                   }
               }
          });
      }

      const netPay = totalEarnings - totalDeductions;

      return {
          id: 'PAY-' + Math.floor(Math.random() * 100000),
          empId: emp.id,
          empName: emp.firstName + ' ' + emp.lastName,
          dept: emp.dept,
          periodId: periodId,
          basic: 0, // Need to identify Basic specifically if needed for reporting
          gross: Math.round(totalEarnings),
          totalDeduction: Math.round(totalDeductions),
          tax: 0, // Included in deductionsList if configured
          net: Math.round(netPay),
          earnings: earningsList,
          deductions: deductionsList,
          status: 'Processed'
      };
  },

  processPayrollBatch: (periodId) => {
      // clear old for this period
      db.payrollRecords = db.payrollRecords.filter(r => r.periodId !== periodId);
      
      const activeEmps = db.employees.filter(e => e.status === 'Active' || e.status === 'Probation');
      const results = activeEmps.map(emp => AppServices.calculatePayroll(emp, periodId));
      
      db.payrollRecords.push(...results);
      saveDb();
      return results;
  },
  
  getPayrollByPeriod: (periodId) => db.payrollRecords.filter(r => r.periodId === periodId),
  
  getPayrollRecord: (id) => db.payrollRecords.find(r => r.id === id || r.empId === id), 

  // --- Other Existing Services ---
  getAttendance: () => db.attendance,
  getSMSLogs: () => db.smsLogs,
  getUsers: () => db.users,
  getAuditLogs: () => db.auditLogs,
  getJobs: () => db.jobs,
  getCandidates: () => db.candidates,
  getReviews: () => db.reviews,
  getAssets: () => db.assets,
  getHolidays: () => db.holidays,
};

// Seed Attendance if empty
if(db.attendance.length === 0) AppServices.loadDemoAttendance = () => {}; 
