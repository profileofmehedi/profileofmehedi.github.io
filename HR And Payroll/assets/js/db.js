// Persistent Simulated Database (LocalStorage)

const defaultDb = {
    salaryHeads: [
        { id: 1, name: 'Basic Salary', type: 'Earning', isFixed: false },
        { id: 2, name: 'House Rent Allowance (HRA)', type: 'Earning', isFixed: false },
        { id: 3, name: 'Transport Allowance', type: 'Earning', isFixed: true },
        { id: 4, name: 'Medical Allowance', type: 'Earning', isFixed: true },
        { id: 5, name: 'Provident Fund (PF)', type: 'Deduction', isFixed: false },
        { id: 6, name: 'Tax (TDS)', type: 'Deduction', isFixed: false }
    ],
    employeeSalaryStructures: [
        { empId: 'EMP001', breakdown: { 'Basic Salary': 5000, 'HRA': 2000, 'Transport Allowance': 500, 'Medical Allowance': 500, 'Provident Fund (PF)': 600, 'Tax (TDS)': 200 } },
        { empId: 'EMP002', breakdown: { 'Basic Salary': 4000, 'HRA': 1500, 'Transport Allowance': 500, 'Medical Allowance': 500, 'Provident Fund (PF)': 480, 'Tax (TDS)': 100 } }
    ],
    salaryPeriods: [
        { id: 'OCT-2025', name: 'October 2025', status: 'Locked', processedDate: '2025-10-31' },
        { id: 'NOV-2025', name: 'November 2025', status: 'Open', processedDate: null }
    ],
    payrollRecords: [],
    employees: [
        { id: 'EMP001', firstName: 'Tiger', lastName: 'Nixon', email: 'tiger@company.com', phone: '+1 555-0101', position: 'System Architect', dept: 'Engineering', start: '2011/04/25', salary: 320000, status: 'Active', dob: '1985-05-15', gender: 'Male', address: '123 Tech Park Ave', type: 'Full-Time', location: 'HQ' },
        { id: 'EMP002', firstName: 'Garrett', lastName: 'Winters', email: 'garrett@company.com', phone: '+1 555-0202', position: 'Accountant', dept: 'Finance', start: '2011/07/25', salary: 170000, status: 'Active', dob: '1988-11-20', gender: 'Male', address: '456 Money Lane', type: 'Full-Time', location: 'NY' },
        { id: 'EMP003', firstName: 'Ashton', lastName: 'Cox', email: 'ashton@company.com', phone: '+1 555-0303', position: 'Tech Lead', dept: 'Engineering', start: '2009/01/12', salary: 286000, status: 'On Leave', dob: '1990-02-10', gender: 'Female', address: '789 Creative Blvd', type: 'Full-Time', location: 'Remote' },
        { id: 'EMP004', firstName: 'Colleen', lastName: 'Hurst', email: 'colleen@company.com', phone: '+1 555-0404', position: 'Javascript Dev', dept: 'Engineering', start: '2015/09/13', salary: 205000, status: 'Active', dob: '1992-08-05', gender: 'Female', address: '101 Code Way', type: 'Contract', location: 'HQ' },
        { id: 'EMP005', firstName: 'Dai', lastName: 'Rios', email: 'dai@company.com', phone: '+1 555-0505', position: 'HR Manager', dept: 'HR', start: '2018/10/22', salary: 180000, status: 'Active', dob: '1989-03-15', gender: 'Male', address: '202 People St', type: 'Full-Time', location: 'HQ' }
    ],
    leaveRequests: [
        { id: 1, emp: 'Cedric Kelly', type: 'Casual', from: '2025-11-01', to: '2025-11-02', days: 2, reason: 'Family Function', status: 'Pending' },
        { id: 2, emp: 'Tiger Nixon', type: 'Medical', from: '2025-10-20', to: '2025-10-22', days: 3, reason: 'Viral Fever', status: 'Approved' },
        { id: 3, emp: 'Garrett Winters', type: 'Vacation', from: '2025-12-20', to: '2025-12-30', days: 10, reason: 'Annual Trip', status: 'Rejected' },
        { id: 4, emp: 'Ashton Cox', type: 'Maternity', from: '2025-11-01', to: '2026-02-01', days: 90, reason: 'Maternity Leave', status: 'Approved' }
    ],
    attendance: [
        { emp: 'Tiger Nixon', date: '2025-10-25', in: '08:55', out: '17:00', status: 'On Time', hours: '8h 5m' },
        { emp: 'Garrett Winters', date: '2025-10-25', in: '09:15', out: '17:10', status: 'Late', hours: '7h 55m' },
        { emp: 'Ashton Cox', date: '2025-10-25', in: '-', out: '-', status: 'Absent', hours: '0h' },
        { emp: 'Colleen Hurst', date: '2025-10-25', in: '08:45', out: '18:00', status: 'On Time', hours: '9h 15m' },
        { emp: 'Dai Rios', date: '2025-10-25', in: '09:00', out: '17:00', status: 'On Time', hours: '8h 0m' },
        { emp: 'Tiger Nixon', date: '2025-10-24', in: '08:50', out: '17:05', status: 'On Time', hours: '8h 15m' },
        { emp: 'Garrett Winters', date: '2025-10-24', in: '09:00', out: '17:00', status: 'On Time', hours: '8h 0m' }
    ],
    smsLogs: [
        { id: 1, date: '2025-10-20 10:00 AM', group: 'All Employees', msg: 'Office closed on Friday due to maintenance.', status: 'Sent (125/125)' },
        { id: 2, date: '2025-10-18 09:30 AM', group: 'Engineering', msg: 'Server migration tonight at 10 PM.', status: 'Sent (45/45)' },
        { id: 3, date: '2025-10-15 11:15 AM', group: 'Managers', msg: 'Meeting rescheduled to 3 PM.', status: 'Failed (Network Error)' }
    ],
    users: [
        { id: 1, email: 'admin@company.com', role: 'Super Admin', lastLogin: '2025-10-25 09:00', status: 'Active' },
        { id: 2, email: 'hr@company.com', role: 'HR Manager', lastLogin: '2025-10-24 14:30', status: 'Active' },
        { id: 3, email: 'finance@company.com', role: 'Accountant', lastLogin: '2025-10-25 10:15', status: 'Active' },
        { id: 4, email: 'employee@company.com', role: 'Employee', linkedEmpId: 'EMP001', lastLogin: 'Never', status: 'Active' }
    ],
    auditLogs: [
        { id: 101, time: '2025-10-25 10:30:00', user: 'admin@company.com', action: 'Process Payroll', ip: '192.168.1.10', details: 'Processed Oct 2025 Payroll' },
        { id: 102, time: '2025-10-25 09:45:12', user: 'hr@company.com', action: 'Add Employee', ip: '192.168.1.15', details: 'Added Emp: Dai Rios' },
        { id: 103, time: '2025-10-24 16:20:00', user: 'admin@company.com', action: 'Update Settings', ip: '192.168.1.10', details: 'Changed tax bracket config' },
        { id: 104, time: '2025-10-24 11:00:00', user: 'hr@company.com', action: 'Approve Leave', ip: '192.168.1.15', details: 'Approved Leave #2' },
        { id: 105, time: '2025-10-23 09:00:00', user: 'finance@company.com', action: 'Export Report', ip: '192.168.1.20', details: 'Exported Q3 Financials' }
    ],
    // --- Recruitment ---
    jobs: [
        { id: 1, title: 'Senior React Developer', dept: 'Engineering', type: 'Full-Time', location: 'Remote', status: 'Open', applicants: 12 },
        { id: 2, title: 'HR Generalist', dept: 'HR', type: 'Full-Time', location: 'HQ', status: 'Closed', applicants: 45 }
    ],
    candidates: [
        { id: 1, name: 'Alice Smith', job: 'Senior React Developer', email: 'alice@test.com', status: 'Interview', date: '2025-10-20' },
        { id: 2, name: 'Bob Johnson', job: 'Senior React Developer', email: 'bob@test.com', status: 'New', date: '2025-10-22' }
    ],
    // --- Performance ---
    reviews: [
        { id: 1, empId: 'EMP001', period: 'Q3 2025', rating: 4.5, reviewer: 'Admin', status: 'Completed', comments: 'Excellent leadership on the new project.' },
        { id: 2, empId: 'EMP004', period: 'Q3 2025', rating: 3.8, reviewer: 'Tiger Nixon', status: 'Completed', comments: 'Good coding skills, needs to improve communication.' }
    ],
    // --- Admin/Assets ---
    assets: [
        { id: 'AST001', name: 'MacBook Pro M2', type: 'Laptop', assignedTo: 'Tiger Nixon', serial: 'MBP-9988', status: 'Deployed' },
        { id: 'AST002', name: 'Dell XPS 15', type: 'Laptop', assignedTo: 'Available', serial: 'DXP-1122', status: 'In Stock' }
    ],
    holidays: [
        { id: 1, name: 'New Year', date: '2025-01-01', type: 'Public' },
        { id: 2, name: 'Labor Day', date: '2025-05-01', type: 'Public' },
        { id: 3, name: 'Christmas', date: '2025-12-25', type: 'Public' }
    ]
};

// --- Storage Engine ---
const StorageKey = 'HR_PAYROLL_DB_V1';

function loadDb() {
    const saved = localStorage.getItem(StorageKey);
    if(saved) return JSON.parse(saved);
    return JSON.parse(JSON.stringify(defaultDb)); // Deep copy default
}

function saveDb() {
    localStorage.setItem(StorageKey, JSON.stringify(db));
}

// Initialize
const db = loadDb();

// --- Service Functions ---

const AppServices = {
    // Basic CRUD Helpers
    getEmployees: () => db.employees,
    getEmployeeById: (id) => db.employees.find(e => e.id === id),
    addEmployee: (emp) => { db.employees.push(emp); saveDb(); },
    deleteEmployee: (id) => { db.employees = db.employees.filter(e => e.id !== id); saveDb(); },
    
    // Stats
    getStats: () => {
        const totalSalary = db.employees.reduce((acc, curr) => acc + (curr.salary / 12), 0); 
        return { totalEmp: db.employees.length, monthlyPayroll: Math.round(totalSalary), pendingLeaves: db.leaveRequests.filter(l => l.status === 'Pending').length };
    },

    // Leaves
    getLeaves: () => db.leaveRequests,
    addLeave: (leave) => { leave.id = db.leaveRequests.length + 1; leave.status = 'Pending'; db.leaveRequests.push(leave); saveDb(); },
    updateLeaveStatus: (id, status) => { const req = db.leaveRequests.find(l => l.id === id); if(req) req.status = status; saveDb(); },

    // Payroll
    getSalaryHeads: () => db.salaryHeads,
    addSalaryHead: (head) => { head.id = db.salaryHeads.length + 1; db.salaryHeads.push(head); saveDb(); },
    getEmpStructure: (empId) => db.employeeSalaryStructures.find(s => s.empId === empId),
    saveEmpStructure: (empId, breakdown) => {
        const existing = db.employeeSalaryStructures.find(s => s.empId === empId);
        if(existing) existing.breakdown = breakdown; else db.employeeSalaryStructures.push({ empId, breakdown });
        saveDb();
    },
    getPeriods: () => db.salaryPeriods,
    createPeriod: (name) => { db.salaryPeriods.push({ id: name.replace(/\s/g,'-'), name, status: 'Open', processedDate: null }); saveDb(); },
    getPayrollRecords: (periodId) => db.payrollRecords.filter(r => r.periodId === periodId),
    processPayroll: (periodId) => {
        db.payrollRecords = db.payrollRecords.filter(r => r.periodId !== periodId); // clear old
        const records = db.employees.map(emp => {
            const struct = AppServices.getEmpStructure(emp.id) || { breakdown: { 'Basic Salary': Math.round(emp.salary/12) } };
            let gross = 0, ded = 0;
            Object.entries(struct.breakdown).forEach(([k,v]) => {
                const head = db.salaryHeads.find(h => h.name === k);
                if(head && head.type === 'Deduction') ded += v; else gross += v;
            });
            return { id: Math.random(), periodId, empName: emp.firstName + ' ' + emp.lastName, dept: emp.dept, gross, totalDeduction: ded, netPay: gross - ded, status: 'Processed' };
        });
        db.payrollRecords.push(...records);
        saveDb();
        return records;
    },

    // New Services
    getAttendance: () => db.attendance,
    getSMSLogs: () => db.smsLogs,
    addSMSLog: (log) => { log.id = db.smsLogs.length + 1; db.smsLogs.unshift(log); saveDb(); },
    getUsers: () => db.users,
    addUser: (user) => { user.id = db.users.length + 1; db.users.push(user); saveDb(); },
    getAuditLogs: () => db.auditLogs,

    // Recruitment
    getJobs: () => db.jobs,
    addJob: (job) => { job.id = db.jobs.length + 1; db.jobs.push(job); saveDb(); },
    getCandidates: () => db.candidates,
    addCandidate: (c) => { c.id = db.candidates.length + 1; db.candidates.push(c); saveDb(); },

    // Performance
    getReviews: () => db.reviews,
    addReview: (r) => { r.id = db.reviews.length + 1; db.reviews.push(r); saveDb(); },

    // Admin
    getAssets: () => db.assets,
    addAsset: (a) => { db.assets.push(a); saveDb(); },
    getHolidays: () => db.holidays,
    addHoliday: (h) => { h.id = db.holidays.length + 1; db.holidays.push(h); saveDb(); }
};
