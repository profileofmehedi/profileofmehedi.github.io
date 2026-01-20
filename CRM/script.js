// script.js - Enterprise Logic (Multi-Page Architecture)

const app = {
    // Determine current view from body ID
    currentView: $('body').attr('id')?.replace('page-', '') || 'dashboard',

    // --- HELP CONTENT ---
    helpContent: {
        dashboard: "This is your command center. Charts update in real-time based on closed deals.",
        leads: "Leads are potential customers. Click a row to view full details including activity history.",
        deals: "This is a Kanban board. Drag cards from 'New' to 'Won' as you progress. Drop on 'Lost' to close.",
        users: "Manage system access here. Only Admins can see this page.",
        settings: "Global system configuration.",
        tasks: "Manage your personal and assigned tasks. Click the status circle to complete items.",
        calendar: "View upcoming events and deadlines."
    },

    // --- INIT ---
    init: function() {
        // Initialize logic based on current page
        if (this.currentView === 'dashboard') this.initDashboard();
        if (this.currentView === 'leads') this.initLeads();
        if (this.currentView === 'deals') this.initDeals();
        if (this.currentView === 'users') this.initUsers();
        if (this.currentView === 'tasks') this.initTasks();
    },

    // --- VIEW LOGIC: DASHBOARD ---
    initDashboard: function() {
        // Common Chart Defaults
        Chart.defaults.font.family = "'Nunito', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif";
        Chart.defaults.color = '#858796';

        // 1. REVENUE AREA CHART (Gradient)
        const canvas = document.getElementById("revenueChart");
        if (!canvas) return; 
        
        const ctxRevenue = canvas.getContext('2d');
        const gradientRevenue = ctxRevenue.createLinearGradient(0, 0, 0, 400);
        gradientRevenue.addColorStop(0, 'rgba(78, 115, 223, 0.5)'); 
        gradientRevenue.addColorStop(1, 'rgba(78, 115, 223, 0.05)'); 

        new Chart(ctxRevenue, {
            type: 'line',
            data: {
                labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                datasets: [{
                    label: "Earnings",
                    tension: 0.3,
                    backgroundColor: gradientRevenue,
                    borderColor: "rgba(78, 115, 223, 1)",
                    pointRadius: 3,
                    pointBackgroundColor: "rgba(78, 115, 223, 1)",
                    pointBorderColor: "rgba(78, 115, 223, 1)",
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: "#fff",
                    pointHoverBorderColor: "rgba(78, 115, 223, 1)",
                    pointHitRadius: 10,
                    pointBorderWidth: 2,
                    fill: true,
                    data: MockData.chartData.revenueByMonth,
                }],
            },
            options: {
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: "rgb(255,255,255)",
                        bodyColor: "#858796",
                        titleColor: '#6e707e',
                        borderColor: '#dddfeb',
                        borderWidth: 1,
                        padding: 15,
                        displayColors: false,
                        callbacks: {
                            label: function(context) {
                                return (context.dataset.label || '') + ': $' + context.parsed.y.toLocaleString();
                            }
                        }
                    }
                },
                scales: {
                    x: { grid: { display: false, drawBorder: false }, ticks: { maxTicksLimit: 7 } },
                    y: { 
                        ticks: { maxTicksLimit: 5, padding: 10, callback: (v)=>'$'+v },
                        grid: { color: "rgb(234, 236, 244)", drawBorder: false, borderDash: [2] }
                    }
                }
            }
        });

        // 2. SOURCES DOUGHNUT CHART
        new Chart(document.getElementById("sourcesPieChart"), {
            type: 'doughnut',
            data: {
                labels: ["Web", "LinkedIn", "Referral", "Conference", "Cold Call"],
                datasets: [{
                    data: MockData.chartData.leadSources,
                    backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', '#e74a3b'],
                    hoverBackgroundColor: ['#2e59d9', '#17a673', '#2c9faf', '#dda20a', '#be2617'],
                    hoverBorderColor: "rgba(234, 236, 244, 1)",
                    borderWidth: 5
                }],
            },
            options: {
                maintainAspectRatio: false,
                cutout: '80%',
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: "rgb(255,255,255)",
                        bodyColor: "#858796",
                        borderColor: '#dddfeb',
                        borderWidth: 1,
                        padding: 15
                    }
                }
            }
        });

        // 3. SALES BAR CHART
        new Chart(document.getElementById("salesBarChart"), {
            type: 'bar',
            data: {
                labels: ["Alice", "Bob", "Charlie", "Diana", "Evan"],
                datasets: [{
                    label: "Revenue",
                    backgroundColor: "#4e73df",
                    hoverBackgroundColor: "#2e59d9",
                    borderColor: "#4e73df",
                    data: MockData.chartData.salesByRep,
                    borderRadius: 4,
                    barThickness: 25
                }],
            },
            options: {
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: "rgb(255,255,255)",
                        bodyColor: "#858796",
                        titleColor: '#6e707e',
                        borderColor: '#dddfeb',
                        borderWidth: 1,
                        padding: 15,
                        callbacks: { label: (c) => '$' + c.parsed.y.toLocaleString() }
                    }
                },
                scales: {
                    x: { grid: { display: false, drawBorder: false } },
                    y: { 
                        ticks: { maxTicksLimit: 5, padding: 10, callback: (v)=>'$'+v },
                        grid: { color: "rgb(234, 236, 244)", drawBorder: false, borderDash: [2] }
                    }
                }
            }
        });
    },

    refreshDashboard: function() {
        const toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true
        });
        toast.fire({ icon: 'success', title: 'Data Refreshed' });
        // In a real app, this would fetch new data
        this.initDashboard();
    },

    // --- VIEW LOGIC: LEADS ---
    initLeads: function() {
        $('#leadsTable').DataTable({
            data: MockData.leads,
            columns: [
                { data: 'name', render: (data) => `<strong>${data}</strong>` },
                { data: 'contact', render: (d,t,r) => `<div>${d}</div><small class="text-muted">${r.email}</small>` },
                { data: 'source' },
                { 
                    data: 'status', 
                    render: (data) => {
                        let cls = 'secondary';
                        if(data==='New') cls='primary';
                        if(data==='Qualified') cls='success';
                        return `<span class="badge bg-${cls}">${data}</span>`;
                    }
                },
                { data: 'owner' },
                {
                    data: null,
                    render: (d,t,r) => `
                        <button class="btn btn-sm btn-outline-info" onclick="app.viewLeadDetails(${r.id})"><i class="fas fa-eye"></i></button>
                        <button class="btn btn-sm btn-outline-danger" onclick="Swal.fire('Delete?')"><i class="fas fa-trash"></i></button>
                    `
                }
            ]
        });
    },

    // --- VIEW LOGIC: KANBAN ---
    initDeals: function() {
        const stages = [
            { id: 'new', title: 'New Opportunity', color: 'border-left-primary' },
            { id: 'qualification', title: 'Qualification', color: 'border-left-info' },
            { id: 'negotiation', title: 'Negotiation', color: 'border-left-warning' },
            { id: 'won', title: 'Closed Won', color: 'border-left-success' },
            { id: 'lost', title: 'Closed Lost', color: 'border-left-danger' }
        ];

        const board = $('#kanbanBoard');
        stages.forEach(stage => {
            let cardsHtml = '';
            const stageDeals = MockData.deals.filter(d => d.stage === stage.id);
            
            stageDeals.forEach(deal => {
                cardsHtml += `
                    <div class="kanban-item ${stage.color}" data-id="${deal.id}">
                        <div class="d-flex justify-content-between">
                            <strong>${deal.title}</strong>
                            <small>$${deal.amount.toLocaleString()}</small>
                        </div>
                        <div class="mt-2 text-muted small">
                            <i class="far fa-clock"></i> ${deal.closeDate}
                        </div>
                    </div>
                `;
            });

            board.append(`
                <div class="kanban-column" id="stage-${stage.id}">
                    <div class="kanban-column-header">
                        <span>${stage.title}</span>
                        <span class="badge bg-secondary rounded-pill">${stageDeals.length}</span>
                    </div>
                    <div class="kanban-items-container" style="min-height: 100px;">
                        ${cardsHtml}
                    </div>
                </div>
            `);
            
            new Sortable(document.querySelector(`#stage-${stage.id} .kanban-items-container`), {
                group: 'deals',
                animation: 150,
                onEnd: function (evt) {
                    console.log('Moved item from ' + evt.from.parentElement.id + ' to ' + evt.to.parentElement.id);
                }
            });
        });
    },

    // --- VIEW LOGIC: USERS ---
    initUsers: function() {
        $('#usersTable').DataTable({
            data: MockData.users,
            columns: [
                { data: 'id' },
                { 
                    data: 'name',
                    render: (d,t,r) => `<div class="d-flex align-items-center"><img src="${r.avatar}" class="avatar-sm me-2"> ${d}</div>`
                },
                { data: 'role' },
                { data: 'status', render: (d) => `<span class="badge bg-success">${d}</span>` },
                { data: null, defaultContent: `<button class="btn btn-sm btn-outline-primary"><i class="fas fa-edit"></i></button>` }
            ]
        });
    },

    // --- VIEW LOGIC: TASKS ---
    initTasks: function() {
        const container = $('#taskListContainer');
        container.empty();
        
        MockData.tasks.forEach(task => {
            let priorityBadge = '';
            if(task.priority === 'High') priorityBadge = '<span class="badge bg-danger rounded-pill">High</span>';
            if(task.priority === 'Medium') priorityBadge = '<span class="badge bg-warning text-dark rounded-pill">Medium</span>';
            if(task.priority === 'Low') priorityBadge = '<span class="badge bg-info rounded-pill">Low</span>';

            let statusIcon = task.status === 'Pending' 
                ? '<i class="far fa-circle text-muted"></i>' 
                : '<i class="fas fa-check-circle text-success"></i>';

            container.append(`
                <div class="list-group-item list-group-item-action p-3">
                    <div class="d-flex w-100 justify-content-between align-items-center">
                        <div class="d-flex align-items-center">
                            <button class="btn btn-link p-0 me-3 fs-5" onclick="app.toggleTask(${task.id}, this)">
                                ${statusIcon}
                            </button>
                            <div>
                                <h6 class="mb-1 fw-bold ${task.status === 'Completed' ? 'text-decoration-line-through text-muted' : ''}">${task.title}</h6>
                                <small class="text-muted"><i class="far fa-clock me-1"></i> Due: ${task.due} • Assigned to: ${task.assignedTo}</small>
                            </div>
                        </div>
                        <div>
                            ${priorityBadge}
                            <button class="btn btn-link text-muted ms-2"><i class="fas fa-ellipsis-v"></i></button>
                        </div>
                    </div>
                </div>
            `);
        });
    },

    // --- ACTIONS ---
    showHelp: function() {
        const content = this.helpContent[this.currentView] || "Help information not available for this page.";
        $('#helpModalBody').text(content);
        new bootstrap.Modal('#helpModal').show();
    },

    viewLeadDetails: function(id) {
        // Just a simple modal or alert for this Multi-Page version to avoid complex DOM replacement
        const lead = MockData.leads.find(l => l.id === id);
        if(!lead) return;

        Swal.fire({
            title: lead.name,
            html: `
                <div class="text-start">
                    <p><strong>Contact:</strong> ${lead.contact}</p>
                    <p><strong>Email:</strong> ${lead.email}</p>
                    <p><strong>Status:</strong> ${lead.status}</p>
                    <hr>
                    <small class="text-muted">Full activity history available in full version.</small>
                </div>
            `
        });
    },

    toggleTask: function(id, btn) {
        const task = MockData.tasks.find(t => t.id === id);
        if(task) {
            task.status = task.status === 'Pending' ? 'Completed' : 'Pending';
            this.initTasks(); // Re-render
        }
    },

    createUser: function() {
        Swal.fire({ title: 'Create User', input: 'text', inputLabel: 'Full Name', showCancelButton: true });
    },
    
    createLead: function() {
        Swal.fire({ title: 'New Lead', html: '<input class="swal2-input" placeholder="Company Name">', showCancelButton: true });
    },

    createTask: function() {
        Swal.fire({
            title: 'New Task',
            html: '<input id="swal-task-title" class="swal2-input" placeholder="Task Title">',
            preConfirm: () => {
                const title = document.getElementById('swal-task-title').value;
                if(title) {
                    MockData.tasks.push({
                        id: MockData.tasks.length + 1,
                        title: title,
                        due: new Date().toISOString().split('T')[0],
                        priority: 'Medium',
                        status: 'Pending',
                        assignedTo: 'Me'
                    });
                    this.initTasks();
                }
            }
        });
    }
};

$(document).ready(function() {
    $("#sidebarToggle").on("click", function(e) {
        e.preventDefault();
        $("body").toggleClass("sb-sidenav-toggled");
    });
    app.init();
});
