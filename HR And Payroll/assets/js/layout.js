const AppLayout = {
    // Page-specific Help Content
    instructions: {
        'dashboard': "<h5><i class='fa-solid fa-gauge-high'></i> Executive Dashboard</h5><p>This is your command center. Monitor real-time metrics:</p><ul><li><b>Stats Cards:</b> Click cards to drill down into details.</li><li><b>Charts:</b> Hover over charts for exact numbers.</li><li><b>Activity Feed:</b> Shows the latest system actions.</li></ul>",
        'employees': "<h5><i class='fa-solid fa-users'></i> Employee Directory</h5><p>Manage your workforce.</p><ul><li><b>Add Employee:</b> Opens the onboarding wizard.</li><li><b>Profile:</b> Click the blue ID button to view full details.</li><li><b>Salary Setup:</b> Click the green dollar icon to configure pay structure.</li></ul>",
        'employee-add': "<h5>Onboarding Wizard</h5><p>Enter new hire details across 3 tabs:</p><ol><li><b>Personal:</b> Basic contact info.</li><li><b>Professional:</b> Role, Dept, Salary.</li><li><b>Financial:</b> Bank details for payroll.</li></ol>",
        'employee-edit': "<h5>Edit Employee</h5><p>Update existing employee information. Ensure all mandatory fields are filled before saving.</p>",
        'payroll': "<h5><i class='fa-solid fa-money-check-dollar'></i> Payroll Processor</h5><p>Calculate monthly salaries.</p><ul><li><b>Select Month:</b> Choose the period to process.</li><li><b>Run Calculation:</b> Engine calculates Gross - Deductions = Net.</li><li><b>PDF:</b> Download payslips after processing.</li></ul>",
        'payroll-setup': "<h5>Salary Configuration</h5><p>Define the components of a salary (e.g., Basic, HRA). Set them as 'Earnings' or 'Deductions'.</p>",
        'payslip-generator': "<h5>Payslip Generator</h5><p>Generate and download bulk payslips for a selected month.</p>",
        'attendance': "<h5><i class='fa-solid fa-calendar-check'></i> Daily Logs</h5><p>View raw check-in/out times. The system auto-calculates 'Late' status based on 9:00 AM start time.</p>",
        'manual-attendance': "<h5>Manual Attendance</h5><p>Manually log or correct attendance records for employees who forgot to check in/out.</p>",
        'leave': "<h5><i class='fa-solid fa-mug-hot'></i> Leave Management</h5><p>Review pending requests.</p><ul><li><b>Approve/Reject:</b> Actions notify the employee and update their balance.</li></ul>",
        'leave-dashboard': "<h5>Leave Dashboard</h5><p>Overview of leave statistics, trends, and upcoming leaves.</p>",
        'leave-calendar': "<h5>Leave Calendar</h5><p>Visual calendar view of employee leaves to help with resource planning.</p>",
        'leave-policy': "<h5>Leave Policy</h5><p>View and configure leave policies and types (Casual, Medical, Earned).</p>",
        'sms': "<h5><i class='fa-solid fa-comment-sms'></i> Broadcast System</h5><p>Send urgent alerts. Select a target group (e.g., 'Engineering') to filter recipients.</p>",
        'recruitment': "<h5>ATS - Job Board</h5><p>Manage open positions. Posting a job makes it visible to the public career page (mock).</p>",
        'performance': "<h5>Appraisals</h5><p>Log quarterly performance reviews. Ratings are on a 1-5 scale.</p>",
        'admin-assets': "<h5>Asset Tracker</h5><p>Manage company inventory. Assign laptops/phones to specific employees to track custody.</p>",
        'emp-dashboard': "<h5>My Dashboard</h5><p>Your personal overview. Check your leave balance and next pay date here.</p>",
        'default': "<h5>System Help</h5><p>Use the sidebar to navigate modules. Contact IT for permission changes.</p>"
    },

    render: function(activePage) {
        const userRole = localStorage.getItem('userRole') || 'Admin';
        const userName = localStorage.getItem('userName') || 'User';

        let sidebarHtml = '';

        if (userRole === 'Employee') {
            // --- EMPLOYEE SIDEBAR ---
            sidebarHtml = `
                <div class="sidebar-header">
                    <i class="fa-solid fa-user-tie me-2"></i> My Portal
                </div>
                <div class="sidebar-menu">
                    <ul>
                        <li><a href="emp-dashboard.html" class="${activePage === 'emp-dashboard' ? 'active' : ''}"><i class="fa-solid fa-gauge-high"></i> Dashboard</a></li>
                        <li><a href="emp-profile.html" class="${activePage === 'emp-profile' ? 'active' : ''}"><i class="fa-solid fa-id-card"></i> My Profile</a></li>
                        <li><a href="emp-attendance.html" class="${activePage === 'emp-attendance' ? 'active' : ''}"><i class="fa-solid fa-calendar-check"></i> My Attendance</a></li>
                        <li><a href="emp-leave.html" class="${activePage === 'emp-leave' ? 'active' : ''}"><i class="fa-solid fa-mug-hot"></i> Leave Request</a></li>
                        <li><a href="emp-payroll.html" class="${activePage === 'emp-payroll' ? 'active' : ''}"><i class="fa-solid fa-file-invoice-dollar"></i> My Payslips</a></li>
                        <li><a href="emp-holidays.html" class="${activePage === 'emp-holidays' ? 'active' : ''}"><i class="fa-solid fa-umbrella-beach"></i> Holidays</a></li>
                    </ul>
                </div>
            `;
        } else {
            // --- ADMIN SIDEBAR ---
            sidebarHtml = `
            <div class="sidebar-header">
                <i class="fa-solid fa-users-gear me-2"></i> HR Pro
            </div>
            <div class="sidebar-menu">
                <ul>
                    <li><a href="dashboard.html" class="${activePage === 'dashboard' ? 'active' : ''}"><i class="fa-solid fa-gauge-high"></i> Dashboard</a></li>
                    
                    <!-- Employees Module -->
                    <li class="has-submenu">
                        <a href="#" class="submenu-toggle ${activePage.startsWith('employee') ? 'active' : ''}">
                            <i class="fa-solid fa-users"></i> Employees <i class="fa-solid fa-chevron-down ms-auto"></i>
                        </a>
                        <ul class="submenu-list ${activePage.startsWith('employee') ? 'open' : ''}">
                            <li><a href="employees.html" class="${activePage === 'employees' ? 'active' : ''}">All Employees</a></li>
                            <li><a href="employee-add.html" class="${activePage === 'employee-add' ? 'active' : ''}">Onboarding</a></li>
                            <li><a href="employee-report.html" class="${activePage === 'employee-report' ? 'active' : ''}">Headcount Report</a></li>
                        </ul>
                    </li>

                    <!-- Recruitment Module -->
                    <li class="has-submenu">
                        <a href="#" class="submenu-toggle ${activePage.startsWith('recruitment') ? 'active' : ''}">
                            <i class="fa-solid fa-briefcase"></i> Recruitment <i class="fa-solid fa-chevron-down ms-auto"></i>
                        </a>
                        <ul class="submenu-list ${activePage.startsWith('recruitment') ? 'open' : ''}">
                            <li><a href="recruitment.html" class="${activePage === 'recruitment' ? 'active' : ''}">Job Board</a></li>
                            <li><a href="recruitment-candidates.html" class="${activePage === 'recruitment-candidates' ? 'active' : ''}">Candidates</a></li>
                        </ul>
                    </li>

                    <!-- Performance Module -->
                    <li class="has-submenu">
                        <a href="#" class="submenu-toggle ${activePage.startsWith('performance') ? 'active' : ''}">
                            <i class="fa-solid fa-star"></i> Performance <i class="fa-solid fa-chevron-down ms-auto"></i>
                        </a>
                        <ul class="submenu-list ${activePage.startsWith('performance') ? 'open' : ''}">
                            <li><a href="performance.html" class="${activePage === 'performance' ? 'active' : ''}">Reviews</a></li>
                            <li><a href="performance-kpi.html" class="${activePage === 'performance-kpi' ? 'active' : ''}">KPI Goals</a></li>
                        </ul>
                    </li>

                    <!-- Payroll Module -->
                    <li class="has-submenu">
                        <a href="#" class="submenu-toggle ${activePage.startsWith('payroll') || activePage === 'payslip-generator' ? 'active' : ''}">
                            <i class="fa-solid fa-money-check-dollar"></i> Payroll <i class="fa-solid fa-chevron-down ms-auto"></i>
                        </a>
                        <ul class="submenu-list ${activePage.startsWith('payroll') || activePage === 'payslip-generator' ? 'open' : ''}">
                            <li><a href="payroll.html" class="${activePage === 'payroll' ? 'active' : ''}">Run Payroll</a></li>
                            <li><a href="payroll-setup.html" class="${activePage === 'payroll-setup' ? 'active' : ''}">Salary Setup</a></li>
                            <li><a href="payslip-generator.html" class="${activePage === 'payslip-generator' ? 'active' : ''}">Payslip Generator</a></li>
                            <li><a href="payroll-report.html" class="${activePage === 'payroll-report' ? 'active' : ''}">Salary Sheet Report</a></li>
                        </ul>
                    </li>

                    <!-- Attendance Module -->
                    <li class="has-submenu">
                        <a href="#" class="submenu-toggle ${activePage.startsWith('attendance') || activePage === 'manual-attendance' ? 'active' : ''}">
                            <i class="fa-solid fa-calendar-check"></i> Attendance <i class="fa-solid fa-chevron-down ms-auto"></i>
                        </a>
                        <ul class="submenu-list ${activePage.startsWith('attendance') || activePage === 'manual-attendance' ? 'open' : ''}">
                            <li><a href="attendance.html" class="${activePage === 'attendance' ? 'active' : ''}">Daily Log</a></li>
                            <li><a href="manual-attendance.html" class="${activePage === 'manual-attendance' ? 'active' : ''}">Manual Entry</a></li>
                            <li><a href="attendance-report.html" class="${activePage === 'attendance-report' ? 'active' : ''}">Monthly Report</a></li>
                        </ul>
                    </li>

                    <!-- Leave Module -->
                    <li class="has-submenu">
                        <a href="#" class="submenu-toggle ${activePage.startsWith('leave') ? 'active' : ''}">
                            <i class="fa-solid fa-mug-hot"></i> Leave <i class="fa-solid fa-chevron-down ms-auto"></i>
                        </a>
                        <ul class="submenu-list ${activePage.startsWith('leave') ? 'open' : ''}">
                            <li><a href="leave-dashboard.html" class="${activePage === 'leave-dashboard' ? 'active' : ''}">Dashboard</a></li>
                            <li><a href="leave-application.html" class="${activePage === 'leave-application' ? 'active' : ''}">Apply Leave</a></li>
                            <li><a href="leave.html" class="${activePage === 'leave' ? 'active' : ''}">Manage Requests</a></li>
                            <li><a href="leave-balance-add.html" class="${activePage === 'leave-balance-add' ? 'active' : ''}">Add Balance</a></li>
                            <li><a href="leave-balance-view.html" class="${activePage === 'leave-balance-view' ? 'active' : ''}">View Balance</a></li>
                            <li><a href="leave-calendar.html" class="${activePage === 'leave-calendar' ? 'active' : ''}">Calendar</a></li>
                            <li><a href="leave-policy.html" class="${activePage === 'leave-policy' ? 'active' : ''}">Policies</a></li>
                        </ul>
                    </li>

                    <!-- Administration Module -->
                    <li class="has-submenu">
                        <a href="#" class="submenu-toggle ${activePage.startsWith('admin') ? 'active' : ''}">
                            <i class="fa-solid fa-building-columns"></i> Administration <i class="fa-solid fa-chevron-down ms-auto"></i>
                        </a>
                        <ul class="submenu-list ${activePage.startsWith('admin') ? 'open' : ''}">
                            <li><a href="admin-assets.html" class="${activePage === 'admin-assets' ? 'active' : ''}">Asset Mgmt</a></li>
                            <li><a href="admin-holidays.html" class="${activePage === 'admin-holidays' ? 'active' : ''}">Holiday Calendar</a></li>
                        </ul>
                    </li>

                    <!-- Communication Module -->
                    <li class="has-submenu">
                        <a href="#" class="submenu-toggle ${activePage.startsWith('sms') ? 'active' : ''}">
                            <i class="fa-solid fa-comment-dots"></i> Communication <i class="fa-solid fa-chevron-down ms-auto"></i>
                        </a>
                        <ul class="submenu-list ${activePage.startsWith('sms') ? 'open' : ''}">
                            <li><a href="sms.html" class="${activePage === 'sms' ? 'active' : ''}">Compose Message</a></li>
                            <li><a href="sms-report.html" class="${activePage === 'sms-report' ? 'active' : ''}">Communication Logs</a></li>
                        </ul>
                    </li>

                    <!-- Users Module -->
                    <li class="has-submenu">
                        <a href="#" class="submenu-toggle ${activePage.startsWith('user') ? 'active' : ''}">
                            <i class="fa-solid fa-user-shield"></i> System Users <i class="fa-solid fa-chevron-down ms-auto"></i>
                        </a>
                        <ul class="submenu-list ${activePage.startsWith('user') ? 'open' : ''}">
                            <li><a href="users.html" class="${activePage === 'users' ? 'active' : ''}">User List</a></li>
                            <li><a href="users-report.html" class="${activePage === 'users-report' ? 'active' : ''}">Access Logs</a></li>
                        </ul>
                    </li>

                    <!-- Audit Module -->
                    <li class="has-submenu">
                        <a href="#" class="submenu-toggle ${activePage.startsWith('audit') ? 'active' : ''}">
                            <i class="fa-solid fa-file-waveform"></i> Audit & Security <i class="fa-solid fa-chevron-down ms-auto"></i>
                        </a>
                        <ul class="submenu-list ${activePage.startsWith('audit') ? 'open' : ''}">
                            <li><a href="audit.html" class="${activePage === 'audit' ? 'active' : ''}">Activity Log</a></li>
                            <li><a href="audit-report.html" class="${activePage === 'audit-report' ? 'active' : ''}">Security Report</a></li>
                        </ul>
                    </li>

                    <!-- AI Module -->
                    <li class="has-submenu">
                        <a href="#" class="submenu-toggle ${activePage.startsWith('ai') ? 'active' : ''}">
                            <i class="fa-solid fa-robot"></i> AI Insights <i class="fa-solid fa-chevron-down ms-auto"></i>
                        </a>
                        <ul class="submenu-list ${activePage.startsWith('ai') ? 'open' : ''}">
                            <li><a href="ai.html" class="${activePage === 'ai' ? 'active' : ''}">Chat Assistant</a></li>
                            <li><a href="ai-report.html" class="${activePage === 'ai-report' ? 'active' : ''}">Predictive Analytics</a></li>
                        </ul>
                    </li>
                </ul>
            </div>
            `;
        }
        
        // Inject Sidebar
        if(!document.getElementById('sidebar')) {
            const sidebar = document.createElement('div');
            sidebar.id = 'sidebar';
            sidebar.className = 'sidebar';
            sidebar.innerHTML = sidebarHtml;
            document.body.prepend(sidebar);
        } else {
            document.getElementById('sidebar').innerHTML = sidebarHtml;
        }

        // Inject Topbar
        const topbarHtml = `
            <div class="toggle-sidebar-btn" id="sidebarToggle" style="cursor: pointer; padding: 10px;">
                <i class="fa-solid fa-bars"></i>
            </div>
            
            <div class="topbar-right">
                <div class="user-profile dropdown">
                    <div class="user-avatar">
                        <i class="fa-solid fa-user"></i>
                    </div>
                    <span class="d-none d-md-block dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                        ${userName}
                    </span>
                    <ul class="dropdown-menu dropdown-menu-end">
                        <li><a class="dropdown-item text-danger" href="login.html"><i class="fa-solid fa-right-from-bracket me-2"></i> Logout</a></li>
                    </ul>
                </div>
            </div>
        `;

        if(!document.querySelector('.topbar')) {
            const topbar = document.createElement('div');
            topbar.className = 'topbar';
            topbar.innerHTML = topbarHtml;
            const mainContent = document.querySelector('.main-content');
            if(mainContent) {
                document.body.insertBefore(topbar, mainContent);
            } else {
                document.body.appendChild(topbar);
            }
        }

        // Help Button
        const pageHeader = document.querySelector('.page-header');
        if (pageHeader && !pageHeader.querySelector('.btn-show-instructions')) {
            const btn = document.createElement('button');
            btn.className = 'btn btn-instruction btn-show-instructions';
            btn.innerHTML = '<i class="fa-solid fa-circle-info"></i> Help';
            btn.dataset.instruction = this.instructions[activePage] || this.instructions['default'];
            pageHeader.appendChild(btn);
        }

        // Instructions Modal
        if(!document.getElementById('instructionModal')) {
             $('body').append(`
                <div class="modal fade" id="instructionModal" tabindex="-1">
                    <div class="modal-dialog"><div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Page Guide</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body" id="instructionBody"></div>
                    </div></div>
                </div>
             `);
        }
        
        // AI Widget
        if(!$('.ai-widget').length) {
            $('body').append('<div class="ai-widget" title="Ask AI Assistant"><i class="fa-solid fa-wand-magic-sparkles"></i></div>');
        }

        this.bindEvents();
    },

    bindEvents: function() {
        $(document).off('click', '#sidebarToggle'); 
        $(document).on('click', '#sidebarToggle', function(e) {
            e.stopPropagation();
            $('.sidebar').toggleClass('active');
            $('.main-content').toggleClass('active');
            $('.topbar').toggleClass('active');
        });

        $(document).on('click', function(e) {
            if ($(window).width() < 768) {
                if (!$(e.target).closest('.sidebar').length && !$(e.target).closest('#sidebarToggle').length) {
                    $('.sidebar').removeClass('active');
                }
            }
        });

        $(document).off('click', '.submenu-toggle').on('click', '.submenu-toggle', function(e) {
            e.preventDefault();
            $(this).next('.submenu-list').slideToggle(200);
            $(this).find('.fa-chevron-down').toggleClass('fa-rotate-180');
        });

        $(document).on('click', '.btn-show-instructions', function() {
            $('#instructionBody').html($(this).data('instruction'));
            new bootstrap.Modal(document.getElementById('instructionModal')).show();
        });
        
        $(document).off('click', '.ai-widget').on('click', '.ai-widget', function() {
            window.location.href = 'ai.html';
        });
    }
};

$(document).ready(function() {
    const path = window.location.pathname;
    let page = 'dashboard';
    
    // --- ADMIN MODULES ---
    
    // Employees
    if(path.includes('employee-add')) page = 'employee-add';
    else if(path.includes('employee-report')) page = 'employee-report';
    else if(path.includes('employee-edit')) page = 'employee-edit';
    else if(path.includes('employees')) page = 'employees';
    
    // Payroll
    else if(path.includes('payroll-setup')) page = 'payroll-setup';
    else if(path.includes('payroll-report')) page = 'payroll-report';
    else if(path.includes('payslip-generator')) page = 'payslip-generator';
    else if(path.includes('payroll')) page = 'payroll';
    
    // Attendance
    else if(path.includes('attendance-report')) page = 'attendance-report';
    else if(path.includes('manual-attendance')) page = 'manual-attendance';
    else if(path.includes('attendance')) page = 'attendance';
    
    // Leave
    else if(path.includes('leave-dashboard')) page = 'leave-dashboard';
    else if(path.includes('leave-application')) page = 'leave-application';
    else if(path.includes('leave-balance-add')) page = 'leave-balance-add';
    else if(path.includes('leave-balance-view')) page = 'leave-balance-view';
    else if(path.includes('leave-calendar')) page = 'leave-calendar';
    else if(path.includes('leave-policy')) page = 'leave-policy';
    else if(path.includes('leave-report')) page = 'leave-report';
    else if(path.includes('leave')) page = 'leave';
    
    // SMS
    else if(path.includes('sms-report')) page = 'sms-report';
    else if(path.includes('sms')) page = 'sms';
    
    // User
    else if(path.includes('users-report')) page = 'users-report';
    else if(path.includes('users')) page = 'users';
    
    // Audit
    else if(path.includes('audit-report')) page = 'audit-report';
    else if(path.includes('audit')) page = 'audit';
    
    // AI
    else if(path.includes('ai-report')) page = 'ai-report';
    else if(path.includes('ai')) page = 'ai';
    
    // Recruitment
    else if(path.includes('recruitment-candidates')) page = 'recruitment-candidates';
    else if(path.includes('recruitment')) page = 'recruitment';
    
    // Performance
    else if(path.includes('performance-kpi')) page = 'performance-kpi';
    else if(path.includes('performance')) page = 'performance';
    
    // Admin
    else if(path.includes('admin-assets')) page = 'admin-assets';
    else if(path.includes('admin-holidays')) page = 'admin-holidays';

    // --- EMPLOYEE MODULES ---
    else if(path.includes('emp-dashboard')) page = 'emp-dashboard';
    else if(path.includes('emp-profile')) page = 'emp-profile';
    else if(path.includes('emp-attendance')) page = 'emp-attendance';
    else if(path.includes('emp-leave')) page = 'emp-leave';
    else if(path.includes('emp-payroll')) page = 'emp-payroll';
    else if(path.includes('emp-holidays')) page = 'emp-holidays';

    AppLayout.render(page);
});