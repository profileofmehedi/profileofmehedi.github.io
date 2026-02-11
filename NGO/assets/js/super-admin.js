const SuperAdmin = {
    init: function(page) {
        App.renderLayout('super-admin', page);
        
        if (page === 'dashboard') this.loadDashboard();
        if (page === 'clients') this.loadClients();
        if (page === 'plans') this.loadPlans();
    },

    loadDashboard: function() {
        const clients = App.get(App.KEYS.CLIENTS);
        const plans = App.get(App.KEYS.PLANS);
        
        // Stats
        $('#total-clients').text(clients.length);
        $('#active-subs').text(clients.filter(c => c.status === 'Active').length);
        
        // Fake Revenue Calculation (sum of plan prices for active clients)
        let revenue = 0;
        clients.forEach(c => {
            const plan = plans.find(p => p.id === c.planId);
            if(plan && c.status === 'Active') revenue += plan.price;
        });
        $('#monthly-revenue').text(App.formatMoney(revenue));
        
        $('#expired-clients').text(clients.filter(c => c.status === 'Expired').length);
    },

    loadClients: function() {
        const clients = App.get(App.KEYS.CLIENTS);
        const plans = App.get(App.KEYS.PLANS);

        const tableData = clients.map(c => {
            const plan = plans.find(p => p.id === c.planId);
            return [
                c.id,
                c.name,
                plan ? plan.name : 'Unknown',
                c.validTill,
                `<span class="badge bg-${c.status === 'Active' ? 'success' : 'danger'}">${c.status}</span>`,
                `<button class="btn btn-sm btn-info" onclick="SuperAdmin.editClient(${c.id})"><i class="fa fa-edit"></i></button>
                 <button class="btn btn-sm btn-danger" onclick="SuperAdmin.deleteClient(${c.id})"><i class="fa fa-trash"></i></button>`
            ];
        });

        $('#clientsTable').DataTable({
            data: tableData,
            columns: [
                { title: "ID" },
                { title: "Client Name" },
                { title: "Plan" },
                { title: "Expiry" },
                { title: "Status" },
                { title: "Actions" }
            ]
        });
    },

    saveClient: function() {
        // Logic to save client from modal
        const name = $('#clientName').val();
        const planId = parseInt($('#clientPlan').val());
        const status = $('#clientStatus').val();
        const email = $('#clientEmail').val(); // Create a user login too
        const password = $('#clientPassword').val();

        if(!name || !email || !password) return Swal.fire('Error', 'All fields required', 'error');

        const clients = App.get(App.KEYS.CLIENTS);
        const users = App.get(App.KEYS.USERS);
        
        // 1. Create User
        const newUser = {
            id: Date.now(),
            name: name,
            email: email,
            password: password,
            role: 'client-admin',
            clientId: null // will update
        };
        
        // 2. Create Client
        const newClient = {
            id: clients.length + 1,
            name: name,
            ownerId: newUser.id,
            planId: planId,
            status: status,
            validTill: '2026-12-31' // Demo fixed date
        };

        newUser.clientId = newClient.id;

        users.push(newUser);
        clients.push(newClient);

        App.save(App.KEYS.USERS, users);
        App.save(App.KEYS.CLIENTS, clients);

        Swal.fire('Success', 'Client created successfully', 'success').then(() => location.reload());
    },

    loadPlans: function() {
        const plans = App.get(App.KEYS.PLANS);
        const tableData = plans.map(p => [
            p.id,
            p.name,
            App.formatMoney(p.price),
            p.limit,
            `<button class="btn btn-sm btn-secondary" disabled>Edit</button>`
        ]);

        $('#plansTable').DataTable({
            data: tableData,
            columns: [
                { title: "ID" },
                { title: "Plan Name" },
                { title: "Price" },
                { title: "Prop Limit" },
                { title: "Actions" }
            ]
        });
    }
};
