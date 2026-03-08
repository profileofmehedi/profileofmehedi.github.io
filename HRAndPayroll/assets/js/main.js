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
        const urlParams = new URLSearchParams(window.location.search);
        const empId = urlParams.get('id');
        if (!empId) return;

        const e = AppServices.getEmployeeById(empId);
        if (!e) {
            Swal.fire('Error', 'Employee not found', 'error');
            return;
        }

        $('#display-emp-code').text(e.id);
        $('#name-en').val((e.firstName || '') + ' ' + (e.lastName || ''));
        $('#dob').val(e.dob);
        $('#gender').val(e.gender);
        $('#email-personal').val(e.email);
        $('#mobile-personal').val(e.phone);
        
        $('#join-date').val(e.start ? e.start.replace(/\//g, '-') : '');
        $('#department').val(e.dept);
        $('#designation').val(e.position || e.designation);
        $('#emp-type').val(e.type || 'Permanent');
        $('#work-station').val(e.location || 'HQ');

        // Update progress bar
        $('#form-progress').css('width', '50%');

        $('#updateEmployeeBtn').click(function() {
            const nameParts = $('#name-en').val().trim().split(' ');
            const fName = nameParts[0];
            const lName = nameParts.slice(1).join(' ');

            const updatedEmp = {
                ...e,
                firstName: fName,
                lastName: lName,
                dob: $('#dob').val(),
                gender: $('#gender').val(),
                email: $('#email-personal').val(),
                phone: $('#mobile-personal').val(),
                start: $('#join-date').val(),
                dept: $('#department').val(),
                position: $('#designation').val(),
                type: $('#emp-type').val(),
                location: $('#work-station').val()
            };

            AppServices.updateEmployee(updatedEmp);
            Swal.fire('Success', 'Employee information updated', 'success').then(() => {
                window.location.href = 'employees.html';
            });
        });
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

    // --- PAYROLL (Refactored) ---
    initPayroll: function() {
        // Load Periods
        const periods = AppServices.getPeriods(); // .sort not strictly needed if ordered in DB
        let pOpt = '<option value="">-- Select Period --</option>';
        periods.forEach(p => pOpt += `<option value="${p.id}">${p.name}</option>`);
        $('#processPeriodSelect').html(pOpt);
        
        $('#processPeriodSelect').change(function() {
            const pId = $(this).val();
            const p = periods.find(x => x.id === pId);
            if(p) {
                $('#infoPeriodName').text(p.name);
                $('#infoPeriodMonth').text(`${p.month} ${p.year}`);
                $('#infoTaxYear').text(p.taxYear);
                $('#infoStatus').text(p.status).attr('class', p.status==='Locked'?'badge bg-danger':'badge bg-success');
                $('#periodInfoBox').slideDown();
                renderProcessedPayroll(AppServices.getPayrollByPeriod(pId));
            } else {
                $('#periodInfoBox').slideUp();
                renderProcessedPayroll([]);
            }
        });

        $('#btnProcessSalary').click(() => {
            const pId = $('#processPeriodSelect').val();
            if(!pId) return Swal.fire('Error', 'Select a period first', 'error');
            
            Swal.fire({
                title: 'Process Salary?',
                text: `Are you sure you want to process for ${pId}? This will overwrite existing calculations for this period.`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, Process'
            }).then((result) => {
                if(result.isConfirmed) {
                    Swal.fire({ title: 'Processing...', timer: 1000, didOpen: () => Swal.showLoading() }).then(() => {
                        const records = AppServices.processPayrollBatch(pId);
                        renderProcessedPayroll(records);
                        Swal.fire('Done', `Processed ${records.length} employees.`, 'success');
                    });
                }
            });
        });
        
        $(document).on('click', '.btn-view-breakdown', function() {
             const id = $(this).data('id');
             const r = AppServices.getPayrollRecord(id);
             if(!r) return;
             
             let eHtml='', dHtml='';
             r.earnings.forEach(x => eHtml += `<tr><td>${x.name}</td><td class="text-end">৳${x.amount.toLocaleString()}</td></tr>`);
             r.deductions.forEach(x => dHtml += `<tr><td>${x.name}</td><td class="text-end">৳${x.amount.toLocaleString()}</td></tr>`);
             $('#breakdownEarnings').html(eHtml);
             $('#breakdownDeductions').html(dHtml);
             $('#breakdownNetPay').text('৳' + r.net.toLocaleString());
             new bootstrap.Modal('#salaryBreakdownModal').show();
        });
    },

    initPayrollSetup: function() {
        // --- 1. HEADS TAB ---
        renderSalaryHeadsTable();
        
        $('#btnSaveHead').click(() => {
            const head = {
                name: $('#headName').val(),
                code: $('#headCode').val(),
                type: $('#headType').val(),
                sortOrder: parseInt($('#headSort').val()) || 99,
                isIncomeTax: $('#headTax').val(),
                isInvestment: $('#headInvest').val(),
                // Defaults
                category: 'Non-Statutory', calcType: 'Fixed Amount', value: 0, taxable: 'Yes' 
            };
            if(!head.name || !head.code) return Swal.fire('Error', 'Name and Code are required', 'error');
            
            AppServices.addComponent(head);
            renderSalaryHeadsTable();
            $('#formSalaryHead')[0].reset();
            Swal.fire('Saved', 'Salary Head Added', 'success');
        });

        // --- 2. STRUCTURE TAB ---
        const emps = AppServices.getEmployees();
        let empOpt = '<option value="">Choose Employee...</option>';
        emps.forEach(e => empOpt += `<option value="${e.id}">${e.firstName} ${e.lastName} (${e.id})</option>`);
        $('#structEmpSelect').html(empOpt);

        $('#btnLoadStruct').click(() => {
            const empId = $('#structEmpSelect').val();
            if(!empId) return;
            loadEmployeeStructureEditor(empId);
        });

        $('#btnSaveStructure').click(() => {
            const empId = $('#structEmpSelect').val();
            if(!empId) return;
            
            const headsData = {};
            $('.struct-amount').each(function() {
                const id = $(this).data('head-id');
                const val = parseFloat($(this).val()) || 0;
                headsData[id] = val;
            });
            
            const struct = {
                empId: empId,
                grade: $('#structGrade').val(),
                effectiveDate: $('#structDate').val(),
                bank: $('#structBank').val(),
                heads: headsData
            };
            
            AppServices.saveEmpSalaryStructure(struct);
            Swal.fire('Success', 'Structure Updated', 'success');
        });
        
        // Calc live total in structure editor
        $(document).on('input', '.struct-amount', function() {
            let tAdd=0, tDed=0;
            $('.struct-amount').each(function() {
                const type = $(this).data('type');
                const val = parseFloat($(this).val()) || 0;
                if(type === 'Earning') tAdd += val; else tDed += val;
            });
            $('#totalAdditions').text(tAdd.toFixed(2));
            $('#totalDeductions').text(tDed.toFixed(2));
            $('#netSalary').text((tAdd - tDed).toFixed(2));
        });
        
        // --- 3. PERIOD TAB ---
        renderPeriodsTable();
        $('#periodMonth, #periodYear').change(() => {
            $('#periodName').val(`Salary-${$('#periodMonth').val()}-${$('#periodYear').val()}`);
        });
        $('#periodMonth').trigger('change');

        $('#btnSavePeriod').click(() => {
            const period = {
                id: $('#periodName').val(),
                name: $('#periodName').val(),
                month: $('#periodMonth').val(),
                year: $('#periodYear').val(),
                taxYear: $('#periodTaxYear').val(),
                workingDays: parseInt($('#periodDays').val()) || 30,
                status: 'Open',
                processedDate: null
            };
            
            if(AppServices.createPeriod(period)) {
                renderPeriodsTable();
                Swal.fire('Success', 'Period Created', 'success');
            } else {
                Swal.fire('Error', 'Period ID already exists', 'error');
            }
        });
    },

    initPayslipGenerator: function() {
        // Populate Employees
        const emps = AppServices.getEmployees();
        let html = '<option value="">Select Employee</option>';
        emps.forEach(e => html += `<option value="${e.id}">${e.firstName} ${e.lastName} (${e.id})</option>`);
        $('#selectEmployee').html(html);
        
        $('#btnGeneratePayslip').click(() => {
            const empId = $('#selectEmployee').val();
            const month = $('#selectMonth').val();
            const year = $('#selectYear').val();
            
            if(!empId) return Swal.fire('Error', 'Please select an employee', 'error');
            
            const monthNames = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            const pName = monthNames[parseInt(month)] + " " + year;
            const pId = pName.substring(0,3).toUpperCase() + "-" + year;
            
            let record = AppServices.getPayrollByPeriod(pId).find(r => r.empId === empId);
            
            if(!record) {
                 const emp = AppServices.getEmployeeById(empId);
                 record = AppServices.calculatePayroll(emp, "PREVIEW");
                 Swal.fire({
                     icon: 'info',
                     title: 'Preview Mode',
                     text: 'No processed payroll found for this period. Showing a preview based on current settings.',
                     timer: 3000
                 });
            }
            
            // Fill Preview
            const emp = AppServices.getEmployeeById(empId);
            $('#payslipEmpName').text(emp.firstName + ' ' + emp.lastName);
            $('#payslipEmpId').text(emp.id);
            $('#payslipDesignation').text(emp.position);
            $('#payslipDepartment').text(emp.dept);
            $('#payslipJoinDate').text(emp.start);
            $('#payslipBank').text(emp.bankName || 'N/A');
            $('#payslipAccount').text(emp.bankAccount || 'N/A');
            $('#payslipTIN').text(emp.tin || 'N/A');
            
            $('#payslipMonth').text(pName);
            $('#payslipDate').text(new Date().toLocaleDateString());
            
            // Table
            let eHtml = '', dHtml = '';
            record.earnings.forEach(e => eHtml += `<tr><td>${e.name}</td><td class="text-end">৳${e.amount.toLocaleString()}</td></tr>`);
            record.deductions.forEach(d => dHtml += `<tr><td>${d.name}</td><td class="text-end">৳${d.amount.toLocaleString()}</td></tr>`);
            
            $('#earningsTable').html(eHtml);
            $('#totalEarnings').text('৳' + record.gross.toLocaleString());
            $('#deductionsTable').html(dHtml);
            $('#totalDeductions').text('৳' + record.totalDeduction.toLocaleString());
            
            $('#netPayAmount').text('৳' + record.net.toLocaleString());
            $('#amountInWords').text(convertNumberToWords(record.net) + ' Taka Only');
            
            $('#payslipPreview').fadeIn();
            $('#payslipPreview').get(0).scrollIntoView({behavior: 'smooth'});
        });
        
        $('#btnPrintPayslip').click(() => window.print());
        $('#btnDownloadPDF').click(() => {
             Swal.fire('Info', 'PDF Download functionality would integrate with a library like html2pdf or jsPDF here.', 'info');
        });
        $('#btnEmailPayslip').click(() => Swal.fire('Sent', 'Payslip emailed to employee.', 'success'));
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
        $('#btnApplyLeave').click(() => window.location.href = 'leave-application.html');
        $(document).on('click', '.btn-leave-action', function() { AppServices.updateLeaveStatus($(this).data('id'), $(this).data('action')); renderLeaves(); });
    },
    
    initLeaveApplication: function() {
        const emps = AppServices.getEmployees();
        let html = '<option value="">Select Employee</option>';
        emps.forEach(e => html += `<option value="${e.id}">${e.firstName} ${e.lastName} (${e.id})</option>`);
        $('#applyEmpId').html(html);
        
        $('#applyFromDate, #applyToDate').change(function() {
            const start = new Date($('#applyFromDate').val());
            const end = new Date($('#applyToDate').val());
            if(start && end && !isNaN(start) && !isNaN(end)) {
                const diffTime = Math.abs(end - start);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; 
                $('#applyTotalDays').val(diffDays > 0 ? diffDays : 0);
            }
        });
        
        $('#applyEmpId, #applyLeaveType').change(function() {
            const empId = $('#applyEmpId').val();
            const type = $('#applyLeaveType').val();
            if(empId && type) {
                const bal = AppServices.getLeaveBalanceByEmp(empId, new Date().getFullYear(), type);
                if(bal) {
                    $('#applyBalance').val(`${bal.allocated - bal.used} Remaining (Allocated: ${bal.allocated})`);
                } else {
                    $('#applyBalance').val('No allocation found');
                }
            }
        });

        $('#btnSubmitApplication').click(() => {
            const empId = $('#applyEmpId').val();
            if(!empId) return Swal.fire('Error', 'Select Employee', 'error');
            
            AppServices.addLeave({
                empId: empId,
                emp: $('#applyEmpId option:selected').text(),
                type: $('#applyLeaveType').val(),
                from: $('#applyFromDate').val(),
                to: $('#applyToDate').val(),
                reason: $('#applyReason').val(),
                status: 'Pending'
            });
            Swal.fire('Success', 'Leave Request Submitted', 'success').then(() => window.location.href = 'leave.html');
        });
    },

    initLeaveBalanceAdd: function() {
        const emps = AppServices.getEmployees();
        let html = '<option value="">Select Employee</option><option value="ALL">ALL EMPLOYEES (Bulk Allocation)</option>';
        emps.forEach(e => html += `<option value="${e.id}">${e.firstName} ${e.lastName} (${e.id})</option>`);
        $('#balanceEmpId').html(html);

        $('#btnSaveBalance').click(() => {
            const year = parseInt($('#balanceYear').val());
            const targetId = $('#balanceEmpId').val();
            if(!targetId) return Swal.fire('Error', 'Select Target', 'error');
            
            const allocations = [];
            $('.balance-input').each(function() {
                allocations.push({ type: $(this).data('type'), val: parseInt($(this).val()) || 0 });
            });

            const targets = targetId === 'ALL' ? emps.map(e => e.id) : [targetId];
            targets.forEach(eid => {
                allocations.forEach(a => {
                    AppServices.addLeaveBalance({ empId: eid, year: year, type: a.type, allocated: a.val });
                });
            });
            Swal.fire('Success', `Allocated balances for ${targets.length} employee(s)`, 'success');
        });
    },

    initLeaveBalanceView: function() {
        renderLeaveBalances();
        $('#btnRefreshBalances, #viewYear').click(() => renderLeaveBalances());
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

    // --- COMMUNICATION ---
    initCommunication: function() {
        // Compose Tab
        $('input[name="commChannel"]').change(function() {
            $(this).val() === 'Email' ? $('#subjectWrapper').removeClass('d-none') : $('#subjectWrapper').addClass('d-none');
        });

        $('#targetType').change(function() {
            const val = $(this).val();
            $('#targetDept, #targetIndividual, #targetAllDisplay').addClass('d-none');
            if(val === 'All') $('#targetAllDisplay').removeClass('d-none');
            else if(val === 'Department') $('#targetDept').removeClass('d-none');
            else if(val === 'Individual') $('#targetIndividual').removeClass('d-none');
        });

        const emps = AppServices.getEmployees();
        let empHtml = '<option value="">Select Employee...</option>';
        emps.forEach(e => empHtml += `<option value="${e.id}">${e.firstName} ${e.lastName}</option>`);
        $('#targetIndividual').html(empHtml);

        $('#scheduleCheck').change(function() {
            $(this).is(':checked') ? $('#scheduleInput').removeClass('d-none') : $('#scheduleInput').addClass('d-none');
        });

        function refreshTemplateDropdown() {
            const tmpls = AppServices.getCommTemplates();
            let html = '<option value="">Insert Template...</option>';
            tmpls.forEach(t => html += `<option value="${t.id}">[${t.channel}] ${t.name}</option>`);
            $('#insertTemplate').html(html);
        }
        refreshTemplateDropdown();

        $('#insertTemplate').change(function() {
            const id = parseInt($(this).val());
            const t = AppServices.getCommTemplates().find(x => x.id === id);
            if(t) {
                $('#commMessage').val(t.content);
                if(t.channel === 'Email' && t.subject) $('#commSubject').val(t.subject);
                $(`input[name="commChannel"][value="${t.channel}"]`).prop('checked', true).trigger('change');
            }
            $(this).val('');
        });

        $('#btnSendComm').click(() => {
            const channel = $('input[name="commChannel"]:checked').val();
            const targetType = $('#targetType').val();
            let target = '';
            if(targetType === 'All') target = 'All Employees';
            else if(targetType === 'Department') target = $('#targetDept').val();
            else target = $('#targetIndividual option:selected').text();

            const msg = $('#commMessage').val();
            if(!msg) return Swal.fire('Error', 'Message content required', 'error');

            const isScheduled = $('#scheduleCheck').is(':checked');
            const scheduleTime = isScheduled ? $('#scheduleTime').val() : null;
            if(isScheduled && !scheduleTime) return Swal.fire('Error', 'Select schedule time', 'error');

            const log = {
                date: new Date().toLocaleString(),
                channel: channel,
                target: target,
                subject: $('#commSubject').val() || '',
                msg: msg,
                status: isScheduled ? 'Scheduled' : 'Sent',
                scheduledFor: scheduleTime
            };

            AppServices.addCommLog(log);
            Swal.fire(isScheduled ? 'Scheduled' : 'Sent', 'Message processed successfully', 'success');
            $('#commMessage').val(''); $('#commSubject').val('');
        });

        $('#btnSaveTemplateDraft').click(() => {
            $('#tmplName').val('');
            $('#tmplChannel').val($('input[name="commChannel"]:checked').val());
            $('#tmplSubject').val($('#commSubject').val());
            $('#tmplContent').val($('#commMessage').val());
            new bootstrap.Modal('#templateModal').show();
        });

        // Templates Tab
        function renderCommTemplates() {
            const tmpls = AppServices.getCommTemplates();
            let html = '';
            tmpls.forEach(t => {
                html += `<tr>
                    <td>${t.name}</td>
                    <td><span class="badge bg-secondary">${t.channel}</span></td>
                    <td><div class="text-truncate" style="max-width: 300px;">${t.content}</div></td>
                    <td><button class="btn btn-sm btn-outline-danger" onclick="if(confirm('Delete?')) { AppServices.deleteCommTemplate(${t.id}); AppController.initCommunication(); }"><i class="fas fa-trash"></i></button></td>
                </tr>`;
            });
            destroyAndInitTable('#tableTemplates', html);
        }
        renderCommTemplates();

        $('#btnSaveTemplate').click(() => {
            const t = {
                name: $('#tmplName').val(),
                channel: $('#tmplChannel').val(),
                subject: $('#tmplSubject').val(),
                content: $('#tmplContent').val()
            };
            if(!t.name || !t.content) return Swal.fire('Error', 'Name and Content required', 'error');
            AppServices.addCommTemplate(t);
            bootstrap.Modal.getInstance('#templateModal').hide();
            renderCommTemplates();
            refreshTemplateDropdown();
            Swal.fire('Saved', 'Template added', 'success');
        });
        
        // Modal Trigger
        $('#btnNewTemplateModal').click(() => new bootstrap.Modal('#templateModal').show());
    },

    initCommunicationReport: function() {
        const logs = AppServices.getCommLogs();
        function renderLogs(data) {
            let html = '';
            data.forEach(l => {
                let badge = 'bg-success';
                if(l.status === 'Failed') badge = 'bg-danger';
                if(l.status === 'Scheduled') badge = 'bg-warning';
                
                html += `<tr>
                    <td><div class="fw-bold">${l.date}</div><div class="small text-muted">${l.scheduledFor ? 'Sch: '+l.scheduledFor : ''}</div></td>
                    <td><span class="badge bg-light text-dark border">${l.channel}</span></td>
                    <td>${l.target}</td>
                    <td><div class="fw-bold">${l.subject||''}</div><div class="small text-muted text-truncate" style="max-width:250px">${l.msg}</div></td>
                    <td><span class="badge ${badge}">${l.status}</span></td>
                    <td><button class="btn btn-sm btn-info text-white"><i class="fas fa-eye"></i></button></td>
                </tr>`;
            });
            destroyAndInitTable('#tableLogs', html);
        }
        renderLogs(logs);

        $('#filterChannel, #filterStatus, #filterSearch').on('input change', function() {
            const ch = $('#filterChannel').val();
            const st = $('#filterStatus').val();
            const q = $('#filterSearch').val().toLowerCase();
            const filtered = logs.filter(l => {
                return (!ch || l.channel === ch) &&
                       (!st || l.status === st) &&
                       (!q || l.target.toLowerCase().includes(q) || l.msg.toLowerCase().includes(q));
            });
            renderLogs(filtered);
        });
    },

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
function renderEmployees() { let h=''; AppServices.getEmployees().forEach(e=>h+=`<tr><td>${e.id}</td><td><div class="d-flex align-items-center"><div class="rounded-circle bg-light d-flex justify-content-center align-items-center me-2 border" style="width:35px;height:35px;"><span class="fw-bold text-primary">${e.firstName.charAt(0)}</span></div><div><div class="fw-bold">${e.firstName} ${e.lastName}</div><div class="small text-muted">${e.email}</div></div></div></td><td><div>${e.position}</div><div class="small text-muted">${e.dept}</div></td><td><span class="badge bg-success bg-opacity-10 text-success">${e.status}</span></td><td>${e.location||'HQ'}</td><td class="text-nowrap"><button class="btn btn-sm btn-outline-primary btn-view-profile" data-id="${e.id}" title="View"><i class="fa-solid fa-address-card"></i></button> <a href="employee-edit.html?id=${e.id}" class="btn btn-sm btn-outline-warning" title="Edit"><i class="fa-solid fa-pen-to-square"></i></a> <button class="btn btn-sm btn-outline-success btn-setup-salary" data-id="${e.id}" title="Salary"><i class="fa-solid fa-money-bill"></i></button> <button class="btn btn-sm btn-outline-danger btn-delete-emp" data-id="${e.id}" title="Delete"><i class="fa-solid fa-trash"></i></button></td></tr>`); destroyAndInitTable('#tableEmployees',h); }
function renderAttendance() { let h=''; AppServices.getAttendance().forEach(a=>h+=`<tr><td>${a.emp}</td><td>${a.date}</td><td>${a.in}</td><td>${a.out}</td><td>${a.hours}</td><td><span class="badge ${a.status==='Late'?'bg-danger':'bg-success'}">${a.status}</span></td></tr>`); destroyAndInitTable('#tableAttendance',h); }
function renderLeaves() { let h=''; AppServices.getLeaves().forEach(l=>{ let b=l.status==='Pending'?`<button class="btn btn-sm btn-success btn-leave-action" data-id="${l.id}" data-action="Approved"><i class="fa-check"></i></button> <button class="btn btn-sm btn-danger btn-leave-action" data-id="${l.id}" data-action="Rejected"><i class="fa-xmark"></i></button>`:''; h+=`<tr><td>${l.emp}</td><td>${l.type}</td><td>${l.from}</td><td>${l.to}</td><td>${l.status}</td><td>${b}</td></tr>`; }); destroyAndInitTable('#tableLeave',h); }
function renderSMS() { let h=''; AppServices.getSMSLogs().forEach(l=>h+=`<tr><td>${l.date}</td><td>${l.group}</td><td>${l.msg}</td><td>${l.status}</td></tr>`); destroyAndInitTable('#tableSMS',h); }
function renderUsers() { let h=''; AppServices.getUsers().forEach(u=>h+=`<tr><td>${u.email}</td><td>${u.role}</td><td>${u.lastLogin}</td><td>${u.status}</td><td></td></tr>`); destroyAndInitTable('#tableUsers',h); }
function renderAudit() { let h=''; AppServices.getAuditLogs().forEach(l=>h+=`<tr><td>${l.time}</td><td>${l.user}</td><td>${l.action}</td><td>${l.details}</td><td>${l.ip}</td></tr>`); destroyAndInitTable('#tableAudit',h); }
function renderPayrollTable(r) { let h=''; r.forEach(x=>h+=`<tr><td>${x.empName}</td><td>${x.dept}</td><td class="text-success">$${x.gross}</td><td class="text-danger">$${x.totalDeduction}</td><td class="fw-bold">$${x.netPay}</td><td>Paid</td><td><button class="btn btn-sm btn-outline-dark"><i class="fa-file-pdf"></i></button></td></tr>`); $('#tablePayroll tbody').html(h); }
function renderHeads() { let h=''; AppServices.getSalaryHeads().forEach(x=>h+=`<tr><td>${x.name}</td><td>${x.type}</td><td>Fixed</td></tr>`); $('#tableHeads tbody').html(h); }
function initPayrollPeriods() { let h=''; AppServices.getPeriods().forEach(p=>h+=`<option value="${p.id}">${p.name}</option>`); $('#payrollPeriodSelect').html(h).trigger('change'); }
function destroyAndInitTable(s,h) { if($.fn.DataTable.isDataTable(s)) $(s).DataTable().destroy(); $(s+' tbody').html(h); $(s).DataTable({responsive:true,pageLength:5}); }
function showProfileDrawer(id) {
    const e = AppServices.getEmployeeById(id);
    if (!e) return;
    const statusBadge = e.status === 'Active' ? 'bg-success' : (e.status === 'On Leave' ? 'bg-warning' : 'bg-secondary');
    
    const html = `
        <div class="drawer-header bg-primary text-white p-4">
            <div class="d-flex justify-content-between align-items-start">
                <h5 class="mb-0 text-white-50">Profile Details</h5>
                <button type="button" class="btn-close btn-close-white btn-close-drawer"></button>
            </div>
            <div class="text-center mt-4">
                <div class="bg-white rounded-circle d-inline-flex align-items-center justify-content-center text-primary fw-bold border border-4 border-white shadow-sm mb-3" style="width: 100px; height: 100px; font-size: 40px;">
                    ${e.firstName.charAt(0)}
                </div>
                <h3 class="mb-1 fw-bold">${e.firstName} ${e.lastName}</h3>
                <p class="mb-2 opacity-75">${e.position} <span class="mx-2">&bull;</span> ${e.dept}</p>
                <span class="badge ${statusBadge} bg-opacity-25 border border-white border-opacity-25 px-3 py-2">${e.status}</span>
            </div>
        </div>
        <div class="p-4">
            <div class="row g-4">
                <div class="col-md-6">
                    <div class="p-3 bg-light rounded h-100">
                        <h6 class="text-uppercase text-muted small fw-bold mb-3"><i class="fa-solid fa-address-card me-2"></i>Contact Info</h6>
                        <div class="mb-2">
                            <label class="small text-muted d-block">Email Address</label>
                            <span class="fw-medium text-break">${e.email}</span>
                        </div>
                        <div class="mb-2">
                            <label class="small text-muted d-block">Phone Number</label>
                            <span class="fw-medium">${e.phone || 'N/A'}</span>
                        </div>
                        <div>
                            <label class="small text-muted d-block">Location</label>
                            <span class="fw-medium">${e.location || 'Head Office'}</span>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="p-3 bg-light rounded h-100">
                        <h6 class="text-uppercase text-muted small fw-bold mb-3"><i class="fa-solid fa-briefcase me-2"></i>Employment</h6>
                        <div class="mb-2">
                            <label class="small text-muted d-block">Employee ID</label>
                            <span class="fw-medium font-monospace">${e.id}</span>
                        </div>
                        <div class="mb-2">
                            <label class="small text-muted d-block">Joining Date</label>
                            <span class="fw-medium">${e.start || e.joiningDate}</span>
                        </div>
                        <div>
                            <label class="small text-muted d-block">Type</label>
                            <span class="fw-medium">${e.type || 'Full-Time'}</span>
                        </div>
                    </div>
                </div>
                <div class="col-12">
                    <div class="p-3 bg-light rounded">
                        <h6 class="text-uppercase text-muted small fw-bold mb-3"><i class="fa-solid fa-user me-2"></i>Personal Info</h6>
                        <div class="row">
                            <div class="col-md-4 mb-2">
                                <label class="small text-muted d-block">Date of Birth</label>
                                <span class="fw-medium">${e.dob || '-'}</span>
                            </div>
                            <div class="col-md-4 mb-2">
                                <label class="small text-muted d-block">Gender</label>
                                <span class="fw-medium">${e.gender || '-'}</span>
                            </div>
                            <div class="col-md-4 mb-2">
                                <label class="small text-muted d-block">Blood Group</label>
                                <span class="fw-medium">${e.bloodGroup || '-'}</span>
                            </div>
                            <div class="col-12">
                                <label class="small text-muted d-block">Address</label>
                                <span class="fw-medium">${e.address || '-'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="mt-4 pt-3 border-top d-flex gap-2 justify-content-end">
                 <a href="employee-edit.html?id=${e.id}" class="btn btn-outline-primary"><i class="fa-solid fa-pen-to-square me-1"></i> Edit Profile</a>
                 <button class="btn btn-secondary btn-close-drawer">Close</button>
            </div>
        </div>
    `;

    $('#profileDrawer').html(html).addClass('open');
    $('#drawerOverlay').fadeIn();
}
function showSalarySetup(id) { const e=AppServices.getEmployeeById(id); const s=AppServices.getEmpStructure(id)||{breakdown:{}}; const h=AppServices.getSalaryHeads(); let html=''; h.forEach(x=>html+=`<div class="row mb-2"><label class="col-6">${x.name}</label><div class="col-6"><input type="number" class="form-control struct-val" data-head="${x.name}" value="${s.breakdown[x.name]||0}"></div></div>`); $('#struct-inputs').html(html); $('#btnSaveStruct').data('id',id); new bootstrap.Modal('#structureModal').show(); }
function saveSalaryStructure(id) { const b={}; $('.struct-val').each(function(){b[$(this).data('head')]=parseInt($(this).val())||0;}); AppServices.saveEmpStructure(id,b); bootstrap.Modal.getInstance('#structureModal').hide(); Swal.fire('Saved','','success'); }
function handleAiChat() { $('#aiChatBox').append(`<div class="text-end mb-2"><span class="bg-primary text-white p-2 rounded">Msg</span></div>`); $('#aiInput').val(''); }

// --- New Renders ---
function renderJobs() { let h=''; AppServices.getJobs().forEach(j=>h+=`<div class="col-md-4 mb-3"><div class="card shadow-sm"><div class="card-body"><h5>${j.title}</h5><p class="text-muted">${j.dept} | ${j.type}</p><div class="d-flex justify-content-between"><span>${j.applicants} Applicants</span><span class="badge bg-success">${j.status}</span></div></div></div></div>`); $('#jobsContainer').html(h); }
function renderCandidates() { let h=''; AppServices.getCandidates().forEach(c=>h+=`<tr><td>${c.name}</td><td>${c.job}</td><td>${c.email}</td><td>${c.date}</td><td><span class="badge bg-info">${c.status}</span></td></tr>`); destroyAndInitTable('#tableCandidates',h); }
function renderReviews() { let h=''; AppServices.getReviews().forEach(r=>h+=`<tr><td>${r.empId}</td><td>${r.period}</td><td>${r.rating}/5</td><td>${r.reviewer}</td><td>${r.status}</td></tr>`); destroyAndInitTable('#tableReviews',h); }
function renderAssets() { let h=''; AppServices.getAssets().forEach(a=>h+=`<tr><td>${a.name}</td><td>${a.type}</td><td>${a.serial}</td><td>${a.assignedTo}</td><td>${a.status}</td></tr>`); destroyAndInitTable('#tableAssets',h); }
function renderHolidays() { let h=''; AppServices.getHolidays().forEach(x=>h+=`<tr><td>${x.name}</td><td>${x.date}</td><td>${x.type}</td></tr>`); destroyAndInitTable('#tableHolidays',h); }

// --- Advanced Payroll Helpers ---
function renderSalaryComponents() {
    let html = '';
    const comps = AppServices.getSalaryComponents();
    if(comps.length === 0) html = '<tr><td colspan="8" class="text-center">No components defined</td></tr>';
    else comps.forEach(c => {
        html += `<tr>
            <td><span class="fw-bold">${c.name}</span><div class="small text-muted">${c.description||''}</div></td>
            <td><span class="badge ${c.type==='Earning'?'bg-success':'bg-danger'}">${c.type}</span></td>
            <td>${c.category}</td>
            <td>${c.calcType}</td>
            <td>${c.value}</td>
            <td>${c.taxable}</td>
            <td><span class="badge bg-success">Active</span></td>
            <td><button class="btn btn-sm btn-outline-danger" onclick="if(confirm('Delete?')) { AppServices.deleteComponent(${c.id}); renderSalaryComponents(); updateSetupSummary(); }"><i class="fas fa-trash"></i></button></td>
        </tr>`;
    });
    destroyAndInitTable('#tableComponents', html);
}

function renderSalaryTemplates() {
    let html = '';
    const temps = AppServices.getSalaryTemplates();
    if(temps.length === 0) html = '<tr><td colspan="7" class="text-center">No templates defined</td></tr>';
    else temps.forEach(t => {
        html += `<tr>
            <td>${t.name}</td>
            <td>${t.dept||'All'}</td>
            <td>${t.designation||'All'}</td>
            <td>${t.basicMin} - ${t.basicMax}</td>
            <td><span class="badge bg-info">${t.earnings.length + t.deductions.length} Components</span></td>
            <td><span class="badge bg-success">Active</span></td>
            <td><button class="btn btn-sm btn-outline-danger" onclick="if(confirm('Delete?')) { AppServices.deleteTemplate(${t.id}); renderSalaryTemplates(); updateSetupSummary(); }"><i class="fas fa-trash"></i></button></td>
        </tr>`;
    });
    destroyAndInitTable('#tableTemplates', html);
}

function renderTaxSlabs() {
    let html = '';
    AppServices.getTaxSlabs().forEach(s => {
        html += `<tr>
            <td>${s.id}</td>
            <td>${s.min.toLocaleString()}</td>
            <td>${s.max > 1000000000 ? 'Above' : s.max.toLocaleString()}</td>
            <td>${s.rate}%</td>
            <td><button class="btn btn-sm btn-outline-primary"><i class="fas fa-edit"></i></button></td>
        </tr>`;
    });
    $('#tableTaxSlabs tbody').html(html);
}

function initPFSettings() {
    const pf = AppServices.getPFSettings();
    if(pf) {
        $('#pfEmployeePercent').val(pf.employeeContribution);
        $('#pfEmployerPercent').val(pf.employerContribution);
        $('#pfCeiling').val(pf.ceiling);
    }
}

function updateSetupSummary() {
    const comps = AppServices.getSalaryComponents();
    $('#summaryTotalComponents').text(comps.length);
    $('#summaryEarningComponents').text(comps.filter(c=>c.type==='Earning').length);
    $('#summaryDeductionComponents').text(comps.filter(c=>c.type==='Deduction').length);
    $('#summaryActiveTemplates').text(AppServices.getSalaryTemplates().length);
}

function renderAdvancedPayrollTable(records) {
    let html = '';
    let tBasic=0, tAllow=0, tGross=0, tDed=0, tTax=0, tNet=0;
    
    if(!records || records.length === 0) {
        html = '';
    } else {
        records.forEach(r => {
            const allowances = r.gross - r.basic;
            tBasic += r.basic; tAllow += allowances; tGross += r.gross;
            tDed += r.totalDeduction; tTax += r.tax; tNet += r.net;
            
            html += `<tr>
                <td><input type="checkbox" class="payroll-check" value="${r.id}"></td>
                <td>${r.empId}</td>
                <td><div class="fw-bold">${r.empName}</div><div class="small text-muted">${r.dept}</div></td>
                <td>${r.dept}</td>
                <td>${r.basic.toLocaleString()}</td>
                <td>${allowances.toLocaleString()}</td>
                <td class="text-success fw-bold">${r.gross.toLocaleString()}</td>
                <td class="text-danger">${r.totalDeduction.toLocaleString()}</td>
                <td>${r.tax.toLocaleString()}</td>
                <td class="fw-bolder text-primary">${r.net.toLocaleString()}</td>
                <td><span class="badge ${r.status==='Paid'?'bg-success':'bg-warning'}">${r.status}</span></td>
                <td>
                    <button class="btn btn-sm btn-outline-info btn-view-breakdown" data-id="${r.id}" title="Breakdown"><i class="fas fa-list"></i></button>
                    <button class="btn btn-sm btn-outline-primary"><i class="fas fa-file-pdf"></i></button>
                </td>
            </tr>`;
        });
    }
    
    // Update footer
    $('#totalBasic').text('৳'+tBasic.toLocaleString());
    $('#totalAllowances').text('৳'+tAllow.toLocaleString());
    $('#totalGross').text('৳'+tGross.toLocaleString());
    $('#totalDeductions').text('৳'+tDed.toLocaleString());
    $('#totalTax').text('৳'+tTax.toLocaleString());
    $('#totalNet').text('৳'+tNet.toLocaleString());
    
    // Summary Cards in Payroll Page
    $('#summaryTotalEmployees').text(records ? records.length : 0);
    $('#summaryTotalEarnings').text('৳'+tGross.toLocaleString());
    $('#summaryTotalDeductions').text('৳'+tDed.toLocaleString());
    $('#summaryNetPayable').text('৳'+tNet.toLocaleString());

    destroyAndInitTable('#tablePayroll', html);
}

function convertNumberToWords(amount) {
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];

    function convertGroup(n) {
        if (n === 0) return '';
        if (n < 10) return ones[n];
        if (n < 20) return teens[n - 10];
        if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + ones[n % 10] : '');
        return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' ' + convertGroup(n % 100) : '');
    }

    if (amount === 0) return 'Zero';
    let str = '';
    if(amount >= 1000) return amount.toLocaleString() + " (In Words)"; 
    return convertGroup(amount);
}

// --- New Payroll Helpers (Refactored Workflow) ---

function renderSalaryHeadsTable() {
    const heads = AppServices.getSalaryComponents().sort((a,b) => a.sortOrder - b.sortOrder);
    let html = '';
    if(heads.length === 0) html = '<tr><td colspan="6" class="text-center">No heads defined</td></tr>';
    else heads.forEach(h => {
        html += `<tr>
            <td>${h.code || '-'}</td>
            <td><span class="fw-bold">${h.name}</span></td>
            <td><span class="badge ${h.type==='Earning'?'bg-success':'bg-danger'}">${h.type}</span></td>
            <td>${h.isIncomeTax || 'No'}</td>
            <td>${h.sortOrder}</td>
            <td><button class="btn btn-sm btn-outline-danger" onclick="if(confirm('Delete?')) { AppServices.deleteComponent(${h.id}); renderSalaryHeadsTable(); }"><i class="fas fa-trash"></i></button></td>
        </tr>`;
    });
    destroyAndInitTable('#tableHeads', html);
}

function loadEmployeeStructureEditor(empId) {
    const emp = AppServices.getEmployeeById(empId);
    if(!emp) return;
    
    $('#infoName').text(emp.firstName + ' ' + emp.lastName);
    $('#infoDesig').text(emp.position);
    $('#infoDept').text(emp.dept);
    
    const struct = AppServices.getEmpSalaryStructure(empId) || {};
    $('#structGrade').val(struct.grade || '');
    $('#structDate').val(struct.effectiveDate || '');
    $('#structBank').val(struct.bank || emp.bankName || '');
    
    // Render Heads
    const heads = AppServices.getSalaryComponents().sort((a,b) => a.sortOrder - b.sortOrder);
    let addHtml = '', dedHtml = '';
    let tAdd = 0, tDed = 0;
    
    heads.forEach(h => {
        const val = struct.heads ? (struct.heads[h.id] || 0) : 0;
        const inputHtml = `<input type="number" class="form-control form-control-sm text-end struct-amount" data-head-id="${h.id}" data-type="${h.type}" value="${val}">`;
        
        const row = `<tr><td>${h.name}</td><td>${inputHtml}</td></tr>`;
        
        if(h.type === 'Earning') {
            addHtml += row;
            tAdd += val;
        } else {
            dedHtml += row;
            tDed += val;
        }
    });
    
    $('#bodyAdditions').html(addHtml);
    $('#bodyDeductions').html(dedHtml);
    $('#totalAdditions').text(tAdd.toFixed(2));
    $('#totalDeductions').text(tDed.toFixed(2));
    $('#netSalary').text((tAdd - tDed).toFixed(2));
    
    $('#structureEditor').slideDown();
}

function renderPeriodsTable() {
    const periods = AppServices.getPeriods(); // .sort((a,b) => b.year - a.year);
    let html = '';
    if(periods.length === 0) html = '<tr><td colspan="4" class="text-center">No periods created</td></tr>';
    else periods.forEach(p => {
        html += `<tr>
            <td>${p.name}</td>
            <td>${p.month} ${p.year}</td>
            <td>${p.workingDays}</td>
            <td><span class="badge ${p.status==='Open'?'bg-success':'bg-secondary'}">${p.status}</span></td>
        </tr>`;
    });
    destroyAndInitTable('#tablePeriods', html);
}

function renderLeaveBalances() {
    const year = $('#viewYear').val() || new Date().getFullYear();
    const emps = AppServices.getEmployees();
    const balances = AppServices.getLeaveBalances().filter(b => b.year == year);
    
    let html = '';
    emps.forEach(e => {
        // Find balances
        const casual = balances.find(b => b.empId === e.id && b.type === 'Casual') || { allocated: '-', used: '-' };
        const medical = balances.find(b => b.empId === e.id && b.type === 'Medical') || { allocated: '-', used: '-' };
        const earned = balances.find(b => b.empId === e.id && b.type === 'Earned') || { allocated: '-', used: '-' };
        const maternity = balances.find(b => b.empId === e.id && b.type === 'Maternity') || { allocated: '-', used: '-' };
        
        html += `<tr>
            <td>${e.id}</td>
            <td><div class="fw-bold">${e.firstName} ${e.lastName}</div></td>
            <td>${e.dept}</td>
            <td>${casual.used} / ${casual.allocated}</td>
            <td>${medical.used} / ${medical.allocated}</td>
            <td>${earned.used} / ${earned.allocated}</td>
            <td>${maternity.used} / ${maternity.allocated}</td>
            <td><button class="btn btn-sm btn-outline-primary"><i class="fas fa-edit"></i></button></td>
        </tr>`;
    });
    destroyAndInitTable('#tableBalances', html);
}