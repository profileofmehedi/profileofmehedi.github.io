// Persistent Simulated Database (LocalStorage)

const defaultDb = {
  salaryHeads: [
    { id: 1, name: "Basic Salary", type: "Earning", isFixed: false },
    {
      id: 2,
      name: "House Rent Allowance (HRA)",
      type: "Earning",
      isFixed: false,
    },
    { id: 3, name: "Transport Allowance", type: "Earning", isFixed: true },
    { id: 4, name: "Medical Allowance", type: "Earning", isFixed: true },
    { id: 5, name: "Provident Fund (PF)", type: "Deduction", isFixed: false },
    { id: 6, name: "Tax (TDS)", type: "Deduction", isFixed: false },
  ],
  employeeSalaryStructures: [
    {
      empId: "EMP001",
      breakdown: {
        "Basic Salary": 5000,
        HRA: 2000,
        "Transport Allowance": 500,
        "Medical Allowance": 500,
        "Provident Fund (PF)": 600,
        "Tax (TDS)": 200,
      },
    },
    {
      empId: "EMP002",
      breakdown: {
        "Basic Salary": 4000,
        HRA: 1500,
        "Transport Allowance": 500,
        "Medical Allowance": 500,
        "Provident Fund (PF)": 480,
        "Tax (TDS)": 100,
      },
    },
  ],
  salaryPeriods: [
    {
      id: "JUL-2025",
      name: "July 2025",
      status: "Locked",
      processedDate: "2025-07-31",
    },
    {
      id: "AUG-2025",
      name: "August 2025",
      status: "Locked",
      processedDate: "2025-08-31",
    },
    {
      id: "SEP-2025",
      name: "September 2025",
      status: "Locked",
      processedDate: "2025-09-30",
    },
    {
      id: "OCT-2025",
      name: "October 2025",
      status: "Locked",
      processedDate: "2025-10-31",
    },
    {
      id: "NOV-2025",
      name: "November 2025",
      status: "Locked",
      processedDate: "2025-11-30",
    },
    {
      id: "DEC-2025",
      name: "December 2025",
      status: "Locked",
      processedDate: "2025-12-31",
    },
    {
      id: "JAN-2026",
      name: "January 2026",
      status: "Open",
      processedDate: null,
    },
  ],
  payrollRecords: [],
  employees: [
    {
      id: "EMP001",
      employeeId: "EMP001",
      firstName: "Md. Abdul",
      lastName: "Karim",
      email: "abdul.karim@company.com",
      phone: "01712345678",
      position: "Senior Officer",
      designation: "Senior Officer",
      department: "Finance",
      dept: "Finance",
      start: "2018/06/15",
      joiningDate: "15-Jun-2018",
      salary: 80000,
      status: "Active",
      dob: "1990-05-15",
      gender: "Male",
      address: "House 45, Road 12, Dhanmondi, Dhaka",
      type: "Full-Time",
      location: "Head Office",
      bankName: "Sonali Bank",
      bankAccount: "1234567890",
    },
    {
      id: "EMP002",
      employeeId: "EMP002",
      firstName: "Fatema",
      lastName: "Akter",
      email: "fatema.akter@company.com",
      phone: "01823456789",
      position: "Accountant",
      designation: "Accountant",
      department: "Finance",
      dept: "Finance",
      start: "2019/03/20",
      joiningDate: "20-Mar-2019",
      salary: 55000,
      status: "Active",
      dob: "1992-08-10",
      gender: "Female",
      address: "Flat 3B, Bashundhara R/A, Dhaka",
      type: "Full-Time",
      location: "Head Office",
      bankName: "Dutch-Bangla Bank",
      bankAccount: "2345678901",
    },
    {
      id: "EMP003",
      employeeId: "EMP003",
      firstName: "Mohammad",
      lastName: "Hasan",
      email: "mohammad.hasan@company.com",
      phone: "01934567890",
      position: "Manager",
      designation: "Manager",
      department: "HR",
      dept: "HR",
      start: "2016/01/10",
      joiningDate: "10-Jan-2016",
      salary: 95000,
      status: "Active",
      dob: "1985-03-22",
      gender: "Male",
      address: "House 12, Gulshan-2, Dhaka",
      type: "Full-Time",
      location: "Head Office",
      bankName: "BRAC Bank",
      bankAccount: "3456789012",
    },
    {
      id: "EMP004",
      employeeId: "EMP004",
      firstName: "Nusrat",
      lastName: "Jahan",
      email: "nusrat.jahan@company.com",
      phone: "01645678901",
      position: "Software Engineer",
      designation: "Software Engineer",
      department: "Engineering",
      dept: "Engineering",
      start: "2020/09/01",
      joiningDate: "01-Sep-2020",
      salary: 65000,
      status: "Active",
      dob: "1995-11-05",
      gender: "Female",
      address: "West Rampura, Dhaka",
      type: "Full-Time",
      location: "Head Office",
      bankName: "City Bank",
      bankAccount: "4567890123",
    },
    {
      id: "EMP005",
      employeeId: "EMP005",
      firstName: "Rakibul",
      lastName: "Islam",
      email: "rakibul.islam@company.com",
      phone: "01756789012",
      position: "Marketing Executive",
      designation: "Marketing Executive",
      department: "Marketing",
      dept: "Marketing",
      start: "2021/02/15",
      joiningDate: "15-Feb-2021",
      salary: 45000,
      status: "Active",
      dob: "1993-07-18",
      gender: "Male",
      address: "Mirpur DOHS, Dhaka",
      type: "Full-Time",
      location: "Head Office",
      bankName: "Islami Bank",
      bankAccount: "5678901234",
    },
    {
      id: "EMP006",
      employeeId: "EMP006",
      firstName: "Sharmin",
      lastName: "Sultana",
      email: "sharmin.sultana@company.com",
      phone: "01867890123",
      position: "HR Officer",
      designation: "HR Officer",
      department: "HR",
      dept: "HR",
      start: "2019/11/20",
      joiningDate: "20-Nov-2019",
      salary: 50000,
      status: "On Leave",
      dob: "1991-04-12",
      gender: "Female",
      address: "Mohammadpur, Dhaka",
      type: "Full-Time",
      location: "Head Office",
      bankName: "Standard Chartered",
      bankAccount: "6789012345",
    },
    {
      id: "EMP007",
      employeeId: "EMP007",
      firstName: "Kamrul",
      lastName: "Haque",
      email: "kamrul.haque@company.com",
      phone: "01978901234",
      position: "Sales Manager",
      designation: "Sales Manager",
      department: "Sales",
      dept: "Sales",
      start: "2017/05/10",
      joiningDate: "10-May-2017",
      salary: 85000,
      status: "Active",
      dob: "1987-09-25",
      gender: "Male",
      address: "Uttara Sector 7, Dhaka",
      type: "Full-Time",
      location: "Chittagong Branch",
      bankName: "Mutual Trust Bank",
      bankAccount: "7890123456",
    },
    {
      id: "EMP008",
      employeeId: "EMP008",
      firstName: "Taslima",
      lastName: "Khatun",
      email: "taslima.khatun@company.com",
      phone: "01589012345",
      position: "Junior Accountant",
      designation: "Junior Accountant",
      department: "Finance",
      dept: "Finance",
      start: "2022/01/05",
      joiningDate: "05-Jan-2022",
      salary: 35000,
      status: "Active",
      dob: "1996-12-08",
      gender: "Female",
      address: "Jatrabari, Dhaka",
      type: "Probation",
      location: "Head Office",
      bankName: "Agrani Bank",
      bankAccount: "8901234567",
    },
    {
      id: "EMP009",
      employeeId: "EMP009",
      firstName: "Shahriar",
      lastName: "Rahman",
      email: "shahriar.rahman@company.com",
      phone: "01690123456",
      position: "IT Support",
      designation: "IT Support Specialist",
      department: "Engineering",
      dept: "Engineering",
      start: "2020/07/15",
      joiningDate: "15-Jul-2020",
      salary: 42000,
      status: "Active",
      dob: "1994-06-30",
      gender: "Male",
      address: "Banani, Dhaka",
      type: "Full-Time",
      location: "Head Office",
      bankName: "Prime Bank",
      bankAccount: "9012345678",
    },
    {
      id: "EMP010",
      employeeId: "EMP010",
      firstName: "Salma",
      lastName: "Begum",
      email: "salma.begum@company.com",
      phone: "01701234567",
      position: "Office Assistant",
      designation: "Office Assistant",
      department: "HR",
      dept: "HR",
      start: "2021/08/20",
      joiningDate: "20-Aug-2021",
      salary: 28000,
      status: "Active",
      dob: "1997-02-14",
      gender: "Female",
      address: "Khilgaon, Dhaka",
      type: "Full-Time",
      location: "Head Office",
      bankName: "Sonali Bank",
      bankAccount: "0123456789",
    },
  ],
  leaveRequests: [
    {
      id: 1,
      emp: "Cedric Kelly",
      type: "Casual",
      from: "2025-11-01",
      to: "2025-11-02",
      days: 2,
      reason: "Family Function",
      status: "Pending",
    },
    {
      id: 2,
      emp: "Tiger Nixon",
      type: "Medical",
      from: "2025-10-20",
      to: "2025-10-22",
      days: 3,
      reason: "Viral Fever",
      status: "Approved",
    },
    {
      id: 3,
      emp: "Garrett Winters",
      type: "Vacation",
      from: "2025-12-20",
      to: "2025-12-30",
      days: 10,
      reason: "Annual Trip",
      status: "Rejected",
    },
    {
      id: 4,
      emp: "Ashton Cox",
      type: "Maternity",
      from: "2025-11-01",
      to: "2026-02-01",
      days: 90,
      reason: "Maternity Leave",
      status: "Approved",
    },
  ],
  attendance: [
    {
      emp: "Tiger Nixon",
      date: "2025-10-25",
      in: "08:55",
      out: "17:00",
      status: "On Time",
      hours: "8h 5m",
    },
    {
      emp: "Garrett Winters",
      date: "2025-10-25",
      in: "09:15",
      out: "17:10",
      status: "Late",
      hours: "7h 55m",
    },
    {
      emp: "Ashton Cox",
      date: "2025-10-25",
      in: "-",
      out: "-",
      status: "Absent",
      hours: "0h",
    },
    {
      emp: "Colleen Hurst",
      date: "2025-10-25",
      in: "08:45",
      out: "18:00",
      status: "On Time",
      hours: "9h 15m",
    },
    {
      emp: "Dai Rios",
      date: "2025-10-25",
      in: "09:00",
      out: "17:00",
      status: "On Time",
      hours: "8h 0m",
    },
    {
      emp: "Tiger Nixon",
      date: "2025-10-24",
      in: "08:50",
      out: "17:05",
      status: "On Time",
      hours: "8h 15m",
    },
    {
      emp: "Garrett Winters",
      date: "2025-10-24",
      in: "09:00",
      out: "17:00",
      status: "On Time",
      hours: "8h 0m",
    },
  ],
  smsLogs: [
    {
      id: 1,
      date: "2025-10-20 10:00 AM",
      group: "All Employees",
      msg: "Office closed on Friday due to maintenance.",
      status: "Sent (125/125)",
    },
    {
      id: 2,
      date: "2025-10-18 09:30 AM",
      group: "Engineering",
      msg: "Server migration tonight at 10 PM.",
      status: "Sent (45/45)",
    },
    {
      id: 3,
      date: "2025-10-15 11:15 AM",
      group: "Managers",
      msg: "Meeting rescheduled to 3 PM.",
      status: "Failed (Network Error)",
    },
  ],
  users: [
    {
      id: 1,
      email: "admin@company.com",
      role: "Super Admin",
      lastLogin: "2025-10-25 09:00",
      status: "Active",
    },
    {
      id: 2,
      email: "hr@company.com",
      role: "HR Manager",
      lastLogin: "2025-10-24 14:30",
      status: "Active",
    },
    {
      id: 3,
      email: "finance@company.com",
      role: "Accountant",
      lastLogin: "2025-10-25 10:15",
      status: "Active",
    },
    {
      id: 4,
      email: "employee@company.com",
      role: "Employee",
      linkedEmpId: "EMP001",
      lastLogin: "Never",
      status: "Active",
    },
  ],
  auditLogs: [
    {
      id: 101,
      time: "2025-10-25 10:30:00",
      user: "admin@company.com",
      action: "Process Payroll",
      ip: "192.168.1.10",
      details: "Processed Oct 2025 Payroll",
    },
    {
      id: 102,
      time: "2025-10-25 09:45:12",
      user: "hr@company.com",
      action: "Add Employee",
      ip: "192.168.1.15",
      details: "Added Emp: Dai Rios",
    },
    {
      id: 103,
      time: "2025-10-24 16:20:00",
      user: "admin@company.com",
      action: "Update Settings",
      ip: "192.168.1.10",
      details: "Changed tax bracket config",
    },
    {
      id: 104,
      time: "2025-10-24 11:00:00",
      user: "hr@company.com",
      action: "Approve Leave",
      ip: "192.168.1.15",
      details: "Approved Leave #2",
    },
    {
      id: 105,
      time: "2025-10-23 09:00:00",
      user: "finance@company.com",
      action: "Export Report",
      ip: "192.168.1.20",
      details: "Exported Q3 Financials",
    },
  ],
  // --- Recruitment ---
  jobs: [
    {
      id: 1,
      title: "Senior React Developer",
      dept: "Engineering",
      type: "Full-Time",
      location: "Remote",
      status: "Open",
      applicants: 12,
    },
    {
      id: 2,
      title: "HR Generalist",
      dept: "HR",
      type: "Full-Time",
      location: "HQ",
      status: "Closed",
      applicants: 45,
    },
  ],
  candidates: [
    {
      id: 1,
      name: "Alice Smith",
      job: "Senior React Developer",
      email: "alice@test.com",
      status: "Interview",
      date: "2025-10-20",
    },
    {
      id: 2,
      name: "Bob Johnson",
      job: "Senior React Developer",
      email: "bob@test.com",
      status: "New",
      date: "2025-10-22",
    },
  ],
  // --- Performance ---
  reviews: [
    {
      id: 1,
      empId: "EMP001",
      period: "Q3 2025",
      rating: 4.5,
      reviewer: "Admin",
      status: "Completed",
      comments: "Excellent leadership on the new project.",
    },
    {
      id: 2,
      empId: "EMP004",
      period: "Q3 2025",
      rating: 3.8,
      reviewer: "Tiger Nixon",
      status: "Completed",
      comments: "Good coding skills, needs to improve communication.",
    },
  ],
  // --- Admin/Assets ---
  assets: [
    {
      id: "AST001",
      name: "MacBook Pro M2",
      type: "Laptop",
      assignedTo: "Tiger Nixon",
      serial: "MBP-9988",
      status: "Deployed",
    },
    {
      id: "AST002",
      name: "Dell XPS 15",
      type: "Laptop",
      assignedTo: "Available",
      serial: "DXP-1122",
      status: "In Stock",
    },
  ],
  holidays: [
    { id: 1, name: "New Year", date: "2025-01-01", type: "Public" },
    { id: 2, name: "Labor Day", date: "2025-05-01", type: "Public" },
    { id: 3, name: "Christmas", date: "2025-12-25", type: "Public" },
  ],
};

// --- Storage Engine ---
const StorageKey = "HR_PAYROLL_DB_V1";

function loadDb() {
  const saved = localStorage.getItem(StorageKey);
  if (saved) return JSON.parse(saved);
  return JSON.parse(JSON.stringify(defaultDb)); // Deep copy default
}

function saveDb() {
  localStorage.setItem(StorageKey, JSON.stringify(db));
}

// Initialize
let db = loadDb();

// --- Seed Data for Demo ---
if (db.employees.length < 10) {
    const demoDepts = ['Engineering', 'Sales', 'Marketing', 'HR', 'Finance', 'Support', 'Legal'];
    const demoPos = ['Manager', 'Associate', 'Senior Lead', 'Intern', 'Director'];
    const demoNames = ['John', 'Jane', 'Michael', 'Emily', 'David', 'Sarah', 'Robert', 'Jessica', 'William', 'Ashley', 'James', 'Linda', 'George', 'Karen', 'Thomas', 'Nancy'];
    
    for(let i=0; i<25; i++) {
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
  addEmployee: (emp) => {
    db.employees.push(emp);
    saveDb();
  },
  updateEmployee: (emp) => {
    const idx = db.employees.findIndex((e) => e.id === emp.id);
    if (idx !== -1) db.employees[idx] = emp;
    saveDb();
  },
  deleteEmployee: (id) => {
    db.employees = db.employees.filter((e) => e.id !== id);
    saveDb();
  },

  // Stats
  getStats: () => {
    const totalSalary = db.employees.reduce(
      (acc, curr) => acc + curr.salary / 12,
      0,
    );
    return {
      totalEmp: db.employees.length,
      monthlyPayroll: Math.round(totalSalary),
      pendingLeaves: db.leaveRequests.filter((l) => l.status === "Pending")
        .length,
    };
  },

  // Leaves
  getLeaves: () => db.leaveRequests,
  addLeave: (leave) => {
    leave.id = db.leaveRequests.length + 1;
    leave.status = "Pending";
    db.leaveRequests.push(leave);
    saveDb();
  },
  updateLeaveStatus: (id, status) => {
    const req = db.leaveRequests.find((l) => l.id === id);
    if (req) req.status = status;
    saveDb();
  },

  // Payroll
  getSalaryHeads: () => db.salaryHeads,
  addSalaryHead: (head) => {
    head.id = db.salaryHeads.length + 1;
    db.salaryHeads.push(head);
    saveDb();
  },
  getEmpStructure: (empId) =>
    db.employeeSalaryStructures.find((s) => s.empId === empId),
  saveEmpStructure: (empId, breakdown) => {
    const existing = db.employeeSalaryStructures.find((s) => s.empId === empId);
    if (existing) existing.breakdown = breakdown;
    else db.employeeSalaryStructures.push({ empId, breakdown });
    saveDb();
  },
  getPeriods: () => db.salaryPeriods,
  createPeriod: (name) => {
    db.salaryPeriods.push({
      id: name.replace(/\s/g, "-"),
      name,
      status: "Open",
      processedDate: null,
    });
    saveDb();
  },
  getPayrollRecords: (periodId) =>
    db.payrollRecords.filter((r) => r.periodId === periodId),
  processPayroll: (periodId) => {
    db.payrollRecords = db.payrollRecords.filter(
      (r) => r.periodId !== periodId,
    ); // clear old
    const records = db.employees.map((emp) => {
      const struct = AppServices.getEmpStructure(emp.id) || {
        breakdown: { "Basic Salary": Math.round(emp.salary / 12) },
      };
      let gross = 0,
        ded = 0;
      Object.entries(struct.breakdown).forEach(([k, v]) => {
        const head = db.salaryHeads.find((h) => h.name === k);
        if (head && head.type === "Deduction") ded += v;
        else gross += v;
      });
      return {
        id: Math.random(),
        periodId,
        empName: emp.firstName + " " + emp.lastName,
        dept: emp.dept,
        gross,
        totalDeduction: ded,
        netPay: gross - ded,
        status: "Processed",
      };
    });
    db.payrollRecords.push(...records);
    saveDb();
    return records;
  },

  // New Services
  getAttendance: () => db.attendance,
  getAttendanceById: (id) => db.attendance.find((a) => a.id == id),
  addAttendance: (record) => {
    record.id = db.attendance.length + 1;
    db.attendance.push(record);
    saveDb();
  },
  updateAttendance: (id, updates) => {
    const record = db.attendance.find((a) => a.id == id);
    if (record) {
      Object.assign(record, updates);
      saveDb();
    }
  },
  deleteAttendance: (id) => {
    db.attendance = db.attendance.filter((a) => a.id != id);
    saveDb();
  },
  getAttendanceByDate: (date) => db.attendance.filter((a) => a.date === date),
  getAttendanceByEmployee: (empName) =>
    db.attendance.filter((a) => a.emp === empName),
  getAttendanceStats: () => {
    const total = db.attendance.length;
    const present = db.attendance.filter((a) => a.status === "Present").length;
    const late = db.attendance.filter((a) => a.status === "Late").length;
    const absent = db.attendance.filter((a) => a.status === "Absent").length;
    return {
      total,
      present,
      late,
      absent,
      attendanceRate: total ? ((present + late) / total) * 100 : 0,
    };
  },

  // Load demo attendance data
  loadDemoAttendance: () => {
    const employees = db.employees;
    const statuses = [
      "Present",
      "Present",
      "Present",
      "Present",
      "Late",
      "Absent",
      "On Leave",
      "Half Day",
    ];
    const startDate = new Date("2026-01-01");
    const endDate = new Date("2026-01-31");

    db.attendance = [];
    let idCounter = 1;

    // Generate attendance for each day
    for (
      let d = new Date(startDate);
      d <= endDate;
      d.setDate(d.getDate() + 1)
    ) {
      const dayOfWeek = d.getDay();
      // Skip weekends (Saturday=6, Sunday=0)
      if (dayOfWeek === 0 || dayOfWeek === 6) continue;

      const dateStr = d.toISOString().split("T")[0];

      // Generate attendance for each employee
      employees.forEach((emp) => {
        // Random chance to have attendance record (95% probability)
        if (Math.random() < 0.95) {
          const status = statuses[Math.floor(Math.random() * statuses.length)];

          // Generate realistic check-in/out times
          let checkIn, checkOut, hours;

          if (status === "Absent") {
            checkIn = "-";
            checkOut = "-";
            hours = "0:00";
          } else if (status === "On Leave") {
            checkIn = "-";
            checkOut = "-";
            hours = "0:00";
          } else {
            // Check-in between 8:30 AM - 9:30 AM
            const inHour =
              status === "Late" ? 9 + Math.floor(Math.random() * 2) : 8;
            const inMin = Math.floor(Math.random() * 60);
            checkIn = `${inHour.toString().padStart(2, "0")}:${inMin.toString().padStart(2, "0")}`;

            // Check-out between 5:00 PM - 7:00 PM
            const outHour = 17 + Math.floor(Math.random() * 3);
            const outMin = Math.floor(Math.random() * 60);
            checkOut = `${outHour.toString().padStart(2, "0")}:${outMin.toString().padStart(2, "0")}`;

            // Calculate hours
            const inTotal = inHour * 60 + inMin;
            const outTotal = outHour * 60 + outMin;
            const totalMins = outTotal - inTotal;

            if (status === "Half Day") {
              hours = `${Math.floor(totalMins / 120)}:${(totalMins % 60).toString().padStart(2, "0")}`;
            } else {
              hours = `${Math.floor(totalMins / 60)}:${(totalMins % 60).toString().padStart(2, "0")}`;
            }
          }

          db.attendance.push({
            id: idCounter++,
            emp: `${emp.firstName} ${emp.lastName}`,
            empId: emp.employeeId || emp.id,
            dept: emp.dept,
            date: dateStr,
            in: checkIn,
            out: checkOut,
            hours: hours,
            status: status,
            source: "demo",
          });
        }
      });
    }

    saveDb();
    console.log(
      `Generated ${db.attendance.length} attendance records for January 2026`,
    );
  },

  getSMSLogs: () => db.smsLogs,
  addSMSLog: (log) => {
    log.id = db.smsLogs.length + 1;
    db.smsLogs.unshift(log);
    saveDb();
  },
  getUsers: () => db.users,
  addUser: (user) => {
    user.id = db.users.length + 1;
    db.users.push(user);
    saveDb();
  },
  getAuditLogs: () => db.auditLogs,

  // Recruitment
  getJobs: () => db.jobs,
  addJob: (job) => {
    job.id = db.jobs.length + 1;
    db.jobs.push(job);
    saveDb();
  },
  getCandidates: () => db.candidates,
  addCandidate: (c) => {
    c.id = db.candidates.length + 1;
    db.candidates.push(c);
    saveDb();
  },

  // Performance
  getReviews: () => db.reviews,
  addReview: (r) => {
    r.id = db.reviews.length + 1;
    db.reviews.push(r);
    saveDb();
  },

  // Admin
  getAssets: () => db.assets,
  addAsset: (a) => {
    db.assets.push(a);
    saveDb();
  },
  getHolidays: () => db.holidays,
  addHoliday: (h) => {
    h.id = db.holidays.length + 1;
    db.holidays.push(h);
    saveDb();
  },

  // Payroll Setup - Salary Components
  getSalaryComponents: () => {
    const components = localStorage.getItem("salaryComponents");
    return components ? JSON.parse(components) : [];
  },
  addSalaryComponent: (component) => {
    const components = AppServices.getSalaryComponents();
    components.push(component);
    localStorage.setItem("salaryComponents", JSON.stringify(components));
  },
  updateSalaryComponent: (index, component) => {
    const components = AppServices.getSalaryComponents();
    components[index] = component;
    localStorage.setItem("salaryComponents", JSON.stringify(components));
  },
  deleteSalaryComponent: (index) => {
    const components = AppServices.getSalaryComponents();
    components.splice(index, 1);
    localStorage.setItem("salaryComponents", JSON.stringify(components));
  },

  // Payroll Setup - Salary Templates
  getSalaryTemplates: () => {
    const templates = localStorage.getItem("salaryTemplates");
    return templates ? JSON.parse(templates) : [];
  },
  addSalaryTemplate: (template) => {
    const templates = AppServices.getSalaryTemplates();
    templates.push(template);
    localStorage.setItem("salaryTemplates", JSON.stringify(templates));
  },
  updateSalaryTemplate: (index, template) => {
    const templates = AppServices.getSalaryTemplates();
    templates[index] = template;
    localStorage.setItem("salaryTemplates", JSON.stringify(templates));
  },
  deleteSalaryTemplate: (index) => {
    const templates = AppServices.getSalaryTemplates();
    templates.splice(index, 1);
    localStorage.setItem("salaryTemplates", JSON.stringify(templates));
  },
};
