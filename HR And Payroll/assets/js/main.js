// Main Application Logic (MPA Version)

const AppController = {
    initDashboard: function() { refreshDashboard(); },
    
    // --- EMPLOYEES ---
    initEmployees: function() {
        renderEmployees();
        $(document).on('click', '.btn-delete-emp', function() { if(confirm('Terminate?')) { AppServices.deleteEmployee($(this).data('id')); renderEmployees(); }});
        $(document).on('click', '.btn-view-profile', function() { showProfileDrawer($(this).data('id')); });
        $(document).on('click', '.drawer-overlay, .btn-close-drawer', function() { $('#profileDrawer').removeClass('open'); $('#drawerOverlay').fadeOut(); });
        $(document).on('click', '.btn-setup-salary', function() { showSalarySetup($(this).data('id')); });
        $('#btnSaveStruct').click(function() { saveSalaryStructure($(this).data('id')); });
    },
    
    initEmployeeAdd: function() {
        $('#saveEmployeeBtn').click(function() {
            const emp = {
                id: 'EMP' + (Math.floor(Math.random()*9000)+1000),
                firstName: $('#add-fname').val(), lastName: $('#add-lname').val(),
                email: $('#add-email').val(), phone: $('#add-phone').val(),
                dept: $('#add-dept').val(), position: $('#add-pos').val(),
                start: $('#add-join').val() || new Date().toISOString().split('T')[0],
                salary: parseInt($('#add-salary').val()) || 0,
                status: 'Active', bankName: $('#add-bank').val(), accountNo: $('#add-acc').val(),
                dob: $('#add-dob').val(), gender: $('#add-gender').val()
            };
            if(!emp.firstName) return Swal.fire('Error', 'Name required', 'error');
            AppServices.addEmployee(emp);
            Swal.fire({ title: 'Success', text: 'Employee Onboarded', icon: 'success' }).then(() => window.location.href = 'employees.html');
        });
    },

    initEmployeeEdit: function() {
        // Placeholder for Edit Logic
        console.log("Init Employee Edit");
    },

    initEmployeeReport: function() {
        const emps = AppServices.getEmployees();
        const depts = {};
        
        if (!emps || emps.length === 0) {
            $('#tableHeadcount tbody').html('<tr><td colspan="3" class="text-center">No data available</td></tr>');
            return;
        }

        emps.forEach(e => {
            const d = e.dept || 'Unassigned';
            depts[d] = (depts[d] || 0) + 1;
        });

        let html = '';
        Object.keys(depts).forEach(d => {
            const count = depts[d];
            const ratio = ((count / emps.length) * 100).toFixed(1);
            html += `<tr>
                <td>${d}</td>
                <td class="fw-bold">${count}</td>
                <td>
                    <div class="d-flex align-items-center">
                        <div class="progress flex-grow-1 me-2" style="height:10px;">
                            <div class="progress-bar bg-primary" style="width:${ratio}%"></div>
                        </div>
                        <small>${ratio}%</small>
                    </div>
                </td>
            </tr>`;
        });
        $('#tableHeadcount tbody').html(html);

        // Chart
        const ctx = document.getElementById('chartHeadcount');
        if (ctx) {
            // Destroy existing chart if any
            if (window.empReportChart) {
                window.empReportChart.destroy();
            }
            
            window.empReportChart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: Object.keys(depts),
                    datasets: [{
                        data: Object.values(depts),
                        backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', '#e74a3b', '#858796'],
                        hoverOffset: 4
                    }]
                },
                options: {
                    maintainAspectRatio: false,
                    responsive: true,
                    plugins: {
                        legend: { position: 'bottom' }
                    }
                }
            });
        }
    },

    // --- RECRUITMENT ---
    initRecruitment: function() {
        renderJobs();
        $('#btnPostJob').click(() => new bootstrap.Modal('#postJobModal').show());
        $('#btnSaveJob').click(() => {
            AppServices.addJob({
                title: $('#job-title').val(), dept: $('#job-dept').val(),
                type: $('#job-type').val(), location: $('#job-loc').val(),
                status: 'Open', applicants: 0
            });
            renderJobs(); bootstrap.Modal.getInstance('#postJobModal').hide();
        });
    },
    initCandidates: function() {
        renderCandidates();
    },

    // --- PERFORMANCE ---
    initPerformance: function() {
        renderReviews();
        $('#btnNewReview').click(() => new bootstrap.Modal('#reviewModal').show());
        $('#btnSaveReview').click(() => {
            AppServices.addReview({
                empId: $('#review-emp').val(), period: $('#review-period').val(),
                rating: $('#review-rating').val(), reviewer: 'Admin', status: 'Completed',
                comments: $('#review-comment').val()
            });
            renderReviews(); bootstrap.Modal.getInstance('#reviewModal').hide();
        });
    },
    initKPI: function() { /* Placeholder */ },

    // --- PAYROLL ---
    initPayroll: function() {
        initPayrollPeriods();
        $('#btnRunPayroll').click(() => { Swal.fire({ title: 'Processing...', timer: 1000, didOpen: () => Swal.showLoading() }).then(() => { renderPayrollTable(AppServices.processPayroll($('#payrollPeriodSelect').val())); Swal.fire('Done', 'Calculated', 'success'); }); });
        $('#payrollPeriodSelect').change(function() { renderPayrollTable(AppServices.getPayrollRecords($(this).val())); });
        $('#btnNewPeriod').click(() => { const n = prompt("Month Name:"); if(n) { AppServices.createPeriod(n); initPayrollPeriods(); }});
    },

    initPayrollSetup: function() {
        renderHeads();
        $('#btnAddHead').click(() => new bootstrap.Modal('#addHeadModal').show());
        $('#btnSaveHead').click(() => { AppServices.addSalaryHead({ name: $('#head-name').val(), type: $('#head-type').val() }); renderHeads(); bootstrap.Modal.getInstance('#addHeadModal').hide(); });
    },

    initPayslipGenerator: function() {
        console.log("Init Payslip Generator");
    },

    initPayrollReport: function() {
        const ctx = document.getElementById('chartPayrollTrend');
        new Chart(ctx, { type: 'line', data: { labels: ['Jan','Feb','Mar','Apr','May','Jun'], datasets: [{ label: 'Total Cost', data: [400000, 410000, 405000, 420000, 425000, 450000], borderColor: '#1cc88a', tension: 0.4 }] } });
    },

    // --- ATTENDANCE ---
    initAttendance: function() { renderAttendance(); },
    
    initManualAttendance: function() {
        console.log("Init Manual Attendance");
    },

    initAttendanceReport: function() {
        const emps = AppServices.getEmployees();
        let html = '';
        emps.forEach(e => {
            const present = Math.floor(Math.random() * 5) + 20;
            const late = Math.floor(Math.random() * 5);
            html += `<tr><td>${e.firstName} ${e.lastName}</td><td>30</td><td class="text-success fw-bold">${present}</td><td class="text-warning fw-bold">${late}</td><td class="text-danger fw-bold">${30-present-late}</td><td><span class="badge bg-success">Good</span></td></tr>`;
        });
        destroyAndInitTable('#tableAttReport', html);
    },

    // --- LEAVE ---
    initLeave: function() {
        renderLeaves();
        $('#btnApplyLeave').click(() => new bootstrap.Modal('#applyLeaveModal').show());
        $('#submitLeaveBtn').click(() => { AppServices.addLeave({ emp: 'Current User', type: $('#leaveType').val(), from: $('#leaveFrom').val(), to: $('#leaveTo').val(), reason: $('#leaveReason').val(), status: 'Pending' }); renderLeaves(); bootstrap.Modal.getInstance('#applyLeaveModal').hide(); });
        $(document).on('click', '.btn-leave-action', function() { AppServices.updateLeaveStatus($(this).data('id'), $(this).data('action')); renderLeaves(); });
    },
    
    initLeaveDashboard: function() { console.log("Init Leave Dashboard"); },
    initLeaveCalendar: function() { console.log("Init Leave Calendar"); },
    initLeavePolicy: function() { console.log("Init Leave Policy"); },

    initLeaveReport: function() {
        const emps = AppServices.getEmployees();
        let html = '';
        emps.forEach(e => html += `<tr><td>${e.firstName} ${e.lastName}</td><td>12</td><td>8</td><td>4</td><td>10</td><td>2</td></tr>`);
        destroyAndInitTable('#tableLeaveBalance', html);
    },

    // --- ADMIN ---
    initAssets: function() {
        renderAssets();
        $('#btnAddAsset').click(() => new bootstrap.Modal('#assetModal').show());
        $('#btnSaveAsset').click(() => {
            AppServices.addAsset({
                id: 'AST'+Math.floor(Math.random()*1000),
                name: $('#asset-name').val(), type: $('#asset-type').val(),
                assignedTo: $('#asset-assign').val(), serial: $('#asset-serial').val(), status: 'Deployed'
            });
            renderAssets(); bootstrap.Modal.getInstance('#assetModal').hide();
        });
    },
    initHolidays: function() {
        renderHolidays();
        $('#btnAddHoliday').click(() => new bootstrap.Modal('#holidayModal').show());
        $('#btnSaveHoliday').click(() => {
            AppServices.addHoliday({ name: $('#holiday-name').val(), date: $('#holiday-date').val(), type: 'Public' });
            renderHolidays(); bootstrap.Modal.getInstance('#holidayModal').hide();
        });
    },

    // --- SMS ---
    initSMS: function() {
        $('#btnSendSMS').click(() => { if(!$('#smsMsg').val()) return; AppServices.addSMSLog({ date: new Date().toLocaleString(), group: $('#smsGroup').val(), msg: $('#smsMsg').val(), status: 'Sent' }); $('#smsMsg').val(''); Swal.fire('Sent', 'Broadcasted', 'success'); });
    },
    initSMSReport: function() { renderSMS(); },

    // --- USERS ---
    initUsers: function() {
        renderUsers();
        $('#btnAddUser').click(() => new bootstrap.Modal('#addUserModal').show());
        $('#btnSaveUser').click(() => { AppServices.addUser({ email: $('#new-user-email').val(), role: $('#new-user-role').val(), status: 'Active', lastLogin: 'Never' }); renderUsers(); bootstrap.Modal.getInstance('#addUserModal').hide(); });
    },
    initUsersReport: function() { renderUsers(); },

    // --- AUDIT ---
    initAudit: function() { renderAudit(); },
    initAuditReport: function() { renderAudit(); },

    // --- AI ---
    initAI: function() { $('#btnAiSend').click(handleAiChat); $('#aiInput').keypress((e) => { if(e.which == 13) handleAiChat(); }); },
    initAIReport: function() {
        new Chart(document.getElementById('chartAttrition'), { type: 'doughnut', data: { labels: ['Low Risk', 'Medium Risk', 'High Risk'], datasets: [{ data: [70, 20, 10], backgroundColor: ['#1cc88a', '#f6c23e', '#e74a3b'] }] } });
    },

    // --- EMPLOYEE PANEL LOGIC ---
    initEmpProfile: function() {
        const empId = localStorage.getItem('empId');
        const e = AppServices.getEmployeeById(empId);
        if(!e) return $('#myProfileContent').html('<p class="text-danger">Profile not found. Please contact admin.</p>');
        const html = `
            <div class="row">
                <div class="col-md-4 text-center">
                    <div class="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width:100px;height:100px;font-size:40px;color:#0d6efd;"><i class="fa-solid fa-user"></i></div>
                    <h4>${e.firstName} ${e.lastName}</h4>
                    <p class="text-muted">${e.position}</p>
                    <span class="badge bg-success mb-3">${e.status}</span>
                </div>
                <div class="col-md-8">
                    <h5>Details</h5>
                    <table class="table">
                        <tr><th>Department</th><td>${e.dept}</td></tr>
                        <tr><th>Email</th><td>${e.email}</td></tr>
                        <tr><th>Phone</th><td>${e.phone || '-'}</td></tr>
                        <tr><th>Location</th><td>${e.location || 'HQ'}</td></tr>
                        <tr><th>Joined</th><td>${e.start}</td></tr>
                    </table>
                </div>
            </div>`;
        $('#myProfileContent').html(html);
    },
    initEmpAttendance: function() {
        const name = localStorage.getItem('userName');
        const list = AppServices.getAttendance().filter(a => a.emp.includes(name));
        let html = '';
        list.forEach(a => html += `<tr><td>${a.date}</td><td>${a.in}</td><td>${a.out}</td><td>${a.hours}</td><td><span class="badge ${a.status==='Late'?'bg-danger':'bg-success'}">${a.status}</span></td></tr>`);
        destroyAndInitTable('#tableEmpAtt', html);
    },
    initEmpLeave: function() {
        const name = localStorage.getItem('userName');
        const list = AppServices.getLeaves().filter(l => l.emp.includes(name));
        let html = '';
        list.forEach(l => html += `<tr><td>${l.type}</td><td>${l.from}</td><td>${l.to}</td><td>${l.reason}</td><td><span class="badge ${l.status==='Approved'?'bg-success':(l.status==='Rejected'?'bg-danger':'bg-warning')}">${l.status}</span></td></tr>`);
        destroyAndInitTable('#tableEmpLeave', html);

        $('#btnEmpApply').click(() => new bootstrap.Modal('#empLeaveModal').show());
        $('#btnEmpSubmit').click(() => {
            AppServices.addLeave({ 
                emp: name, // Using logged in name
                type: $('#e-leaveType').val(), from: $('#e-leaveFrom').val(), to: $('#e-leaveTo').val(), 
                reason: $('#e-leaveReason').val(), status: 'Pending' 
            });
            AppController.initEmpLeave(); // Refresh
            bootstrap.Modal.getInstance('#empLeaveModal').hide();
            Swal.fire('Success', 'Request Sent', 'success');
        });
    }
};

// --- Shared Renderers & Helpers ---
function refreshDashboard() {
    const stats = AppServices.getStats(); $('#statTotalEmp').text(stats.totalEmp); $('#statPayroll').text('$' + stats.monthlyPayroll.toLocaleString());
    $('#statLate').text(AppServices.getAttendance().filter(a => a.status === 'Late').length);
    $('#statOnLeave').text(AppServices.getLeaves().filter(l => l.status === 'Approved').length);
    let feed = ''; AppServices.getAuditLogs().slice(0,5).forEach(l => feed += `<div class="feed-item"><div class="text-dark fw-bold">${l.action}</div><div class="small text-muted">${l.time}</div><div class="small">${l.details}</div></div>`); $('#activityFeed').html(feed||'No activity');
    const m = new Date().getMonth()+1; let bday=''; AppServices.getEmployees().filter(e=>e.dob&&parseInt(e.dob.split('-')[1])===m).forEach(e=>bday+=`<div class="birthday-item"><div class="rounded-circle bg-warning bg-opacity-25 text-warning p-2"><i class="fa-solid fa-cake-candles"></i></div><div><div class="fw-bold">${e.firstName} ${e.lastName}</div><div class="small text-muted">${e.dob}</div></div></div>`); $('#celebrationList').html(bday||'<p class="text-muted p-3">No celebrations.</p>');
    $('#currentDateDisplay').text(new Date().toLocaleDateString('en-US',{weekday:'long',year:'numeric',month:'short',day:'numeric'})); initDashboardCharts();
}
function initDashboardCharts() {
    const e = AppServices.getEmployees(); const dc = {}, gc = {Male:0,Female:0}; e.forEach(x => { dc[x.dept]=(dc[x.dept]||0)+1; if(x.gender) gc[x.gender]=(gc[x.gender]||0)+1; });
    const c1=document.getElementById('deptChart'); if(c1) new Chart(c1,{type:'bar',data:{labels:Object.keys(dc),datasets:[{label:'Count',data:Object.values(dc),backgroundColor:'#4e73df'}]},options:{maintainAspectRatio:false}});
    const c2=document.getElementById('genderChart'); if(c2) new Chart(c2,{type:'doughnut',data:{labels:['Male','Female'],datasets:[{data:[gc.Male,gc.Female],backgroundColor:['#4e73df','#36b9cc']}]},options:{maintainAspectRatio:false,cutout:'70%'}});
    const c3=document.getElementById('attendanceChart'); if(c3) new Chart(c3,{type:'line',data:{labels:['M','T','W','T','F','S','S'],datasets:[{label:'%',data:[98,95,96,99,92,40,0],borderColor:'#1cc88a',fill:true,backgroundColor:'rgba(28,200,138,0.1)'}]},options:{maintainAspectRatio:false}});
}
function renderEmployees() { let h=''; AppServices.getEmployees().forEach(e=>h+=`<tr><td>${e.id}</td><td><div class="d-flex align-items-center"><div class="rounded-circle bg-light d-flex justify-content-center align-items-center me-2 border" style="width:35px;height:35px;"><span class="fw-bold text-primary">${e.firstName.charAt(0)}</span></div><div><div class="fw-bold">${e.firstName} ${e.lastName}</div><div class="small text-muted">${e.email}</div></div></div></td><td><div>${e.position}</div><div class="small text-muted">${e.dept}</div></td><td><span class="badge bg-success bg-opacity-10 text-success">${e.status}</span></td><td>${e.location||'HQ'}</td><td><button class="btn btn-sm btn-outline-primary btn-view-profile" data-id="${e.id}"><i class="fa-address-card"></i></button> <button class="btn btn-sm btn-outline-success btn-setup-salary" data-id="${e.id}"><i class="fa-money-bill"></i></button> <button class="btn btn-sm btn-outline-danger btn-delete-emp" data-id="${e.id}"><i class="fa-trash"></i></button></td></tr>`); destroyAndInitTable('#tableEmployees',h); }
function renderAttendance() { let h=''; AppServices.getAttendance().forEach(a=>h+=`<tr><td>${a.emp}</td><td>${a.date}</td><td>${a.in}</td><td>${a.out}</td><td>${a.hours}</td><td><span class="badge ${a.status==='Late'?'bg-danger':'bg-success'}">${a.status}</span></td></tr>`); destroyAndInitTable('#tableAttendance',h); }
function renderLeaves() { let h=''; AppServices.getLeaves().forEach(l=>{ let b=l.status==='Pending'?`<button class="btn btn-sm btn-success btn-leave-action" data-id="${l.id}" data-action="Approved"><i class="fa-check"></i></button> <button class="btn btn-sm btn-danger btn-leave-action" data-id="${l.id}" data-action="Rejected"><i class="fa-xmark"></i></button>`:''; h+=`<tr><td>${l.emp}</td><td>${l.type}</td><td>${l.from}</td><td>${l.to}</td><td>${l.status}</td><td>${b}</td></tr>`; }); destroyAndInitTable('#tableLeave',h); }
function renderSMS() { let h=''; AppServices.getSMSLogs().forEach(l=>h+=`<tr><td>${l.date}</td><td>${l.group}</td><td>${l.msg}</td><td>${l.status}</td></tr>`); destroyAndInitTable('#tableSMS',h); }
function renderUsers() { let h=''; AppServices.getUsers().forEach(u=>h+=`<tr><td>${u.email}</td><td>${u.role}</td><td>${u.lastLogin}</td><td>${u.status}</td><td></td></tr>`); destroyAndInitTable('#tableUsers',h); }
function renderAudit() { let h=''; AppServices.getAuditLogs().forEach(l=>h+=`<tr><td>${l.time}</td><td>${l.user}</td><td>${l.action}</td><td>${l.details}</td><td>${l.ip}</td></tr>`); destroyAndInitTable('#tableAudit',h); }
function renderPayrollTable(r) { let h=''; r.forEach(x=>h+=`<tr><td>${x.empName}</td><td>${x.dept}</td><td class="text-success">$${x.gross}</td><td class="text-danger">$${x.totalDeduction}</td><td class="fw-bold">$${x.netPay}</td><td>Paid</td><td><button class="btn btn-sm btn-outline-dark"><i class="fa-file-pdf"></i></button></td></tr>`); $('#tablePayroll tbody').html(h); }
function renderHeads() { let h=''; AppServices.getSalaryHeads().forEach(x=>h+=`<tr><td>${x.name}</td><td>${x.type}</td><td>Fixed</td></tr>`); $('#tableHeads tbody').html(h); }
function initPayrollPeriods() { let h=''; AppServices.getPeriods().forEach(p=>h+=`<option value="${p.id}">${p.name}</option>`); $('#payrollPeriodSelect').html(h).trigger('change'); }
function destroyAndInitTable(s,h) { if($.fn.DataTable.isDataTable(s)) $(s).DataTable().destroy(); $(s+' tbody').html(h); $(s).DataTable({responsive:true,pageLength:5}); }
function showProfileDrawer(id) { const e=AppServices.getEmployeeById(id); $('#profileDrawer').html(`<div class="p-4"><h3>${e.firstName} ${e.lastName}</h3><p>${e.dept}</p><p>Email: ${e.email}</p><button class="btn btn-secondary btn-close-drawer">Close</button></div>`).addClass('open'); $('#drawerOverlay').fadeIn(); }
function showSalarySetup(id) { const e=AppServices.getEmployeeById(id); const s=AppServices.getEmpStructure(id)||{breakdown:{}}; const h=AppServices.getSalaryHeads(); let html=''; h.forEach(x=>html+=`<div class="row mb-2"><label class="col-6">${x.name}</label><div class="col-6"><input type="number" class="form-control struct-val" data-head="${x.name}" value="${s.breakdown[x.name]||0}"></div></div>`); $('#struct-inputs').html(html); $('#btnSaveStruct').data('id',id); new bootstrap.Modal('#structureModal').show(); }
function saveSalaryStructure(id) { const b={}; $('.struct-val').each(function(){b[$(this).data('head')]=parseInt($(this).val())||0;}); AppServices.saveEmpStructure(id,b); bootstrap.Modal.getInstance('#structureModal').hide(); Swal.fire('Saved','','success'); }
function handleAiChat() { $('#aiChatBox').append(`<div class="text-end mb-2"><span class="bg-primary text-white p-2 rounded">Msg</span></div>`); $('#aiInput').val(''); }

// --- New Renders ---
function renderJobs() { let h=''; AppServices.getJobs().forEach(j=>h+=`<div class="col-md-4 mb-3"><div class="card shadow-sm"><div class="card-body"><h5>${j.title}</h5><p class="text-muted">${j.dept} | ${j.type}</p><div class="d-flex justify-content-between"><span>${j.applicants} Applicants</span><span class="badge bg-success">${j.status}</span></div></div></div></div>`); $('#jobsContainer').html(h); }
function renderCandidates() { let h=''; AppServices.getCandidates().forEach(c=>h+=`<tr><td>${c.name}</td><td>${c.job}</td><td>${c.email}</td><td>${c.date}</td><td><span class="badge bg-info">${c.status}</span></td></tr>`); destroyAndInitTable('#tableCandidates',h); }
function renderReviews() { let h=''; AppServices.getReviews().forEach(r=>h+=`<tr><td>${r.empId}</td><td>${r.period}</td><td>${r.rating}/5</td><td>${r.reviewer}</td><td>${r.status}</td></tr>`); destroyAndInitTable('#tableReviews',h); }
function renderAssets() { let h=''; AppServices.getAssets().forEach(a=>h+=`<tr><td>${a.name}</td><td>${a.type}</td><td>${a.serial}</td><td>${a.assignedTo}</td><td>${a.status}</td></tr>`); destroyAndInitTable('#tableAssets',h); }
function renderHolidays() { let h=''; AppServices.getHolidays().forEach(x=>h+=`<tr><td>${x.name}</td><td>${x.date}</td><td>${x.type}</td></tr>`); destroyAndInitTable('#tableHolidays',h); }