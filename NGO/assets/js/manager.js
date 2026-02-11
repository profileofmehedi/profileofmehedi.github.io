const Manager = {
    init: function(page) {
        App.renderLayout('manager', page);
        this.user = App.getUser();
        // Manager is linked to a client
        this.clientInfo = App.get(App.KEYS.CLIENTS).find(c => c.id === this.user.clientId);
        
        if (page === 'dashboard') this.loadDashboard();
    },

    loadDashboard: function() {
        const bills = App.get(App.KEYS.BILLS).filter(b => b.clientId === this.clientInfo.id);
        const tenants = App.get(App.KEYS.TENANTS);

        const tableData = bills.filter(b => b.status === 'Unpaid').map(b => {
            const tenant = tenants.find(t => t.id === b.tenantId);
            return [
                tenant ? tenant.name : 'Unknown',
                b.month,
                App.formatMoney(b.total),
                `<button class="btn btn-sm btn-success" onclick="Manager.collect(${b.id})">Receive Payment</button>`
            ];
        });

        $('#dueBillsTable').DataTable({
            data: tableData,
            columns: [
                { title: "Tenant" },
                { title: "Month" },
                { title: "Amount" },
                { title: "Action" }
            ]
        });

        // Today's collection
        const today = new Date().toISOString().slice(0, 10);
        const payments = App.get(App.KEYS.PAYMENTS).filter(p => p.date === today);
        const todayTotal = payments.reduce((sum, p) => sum + p.amount, 0);
        $('#today-collection').text(App.formatMoney(todayTotal));
    },

    collect: function(billId) {
        // Reuse logic? Or copy-paste for safety. 
        // Better to just call ClientAdmin method if I made it global, but I didn't. 
        // I'll re-implement simplified collection.
         Swal.fire({
            title: 'Confirm Payment?',
            text: 'Mark this bill as paid?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, Collect'
        }).then((result) => {
            if (result.isConfirmed) {
                const bills = App.get(App.KEYS.BILLS);
                const idx = bills.findIndex(b => b.id === billId);
                if (idx > -1) {
                    bills[idx].status = "Paid";
                    bills[idx].paidDate = new Date().toISOString().slice(0, 10);
                    App.save(App.KEYS.BILLS, bills);
                    
                    const payments = App.get(App.KEYS.PAYMENTS);
                    payments.push({
                        id: Date.now(),
                        billId: billId,
                        amount: bills[idx].total,
                        date: new Date().toISOString().slice(0, 10),
                        method: "Cash"
                    });
                    App.save(App.KEYS.PAYMENTS, payments);
                    
                    Swal.fire('Collected', 'Payment recorded.', 'success').then(() => location.reload());
                }
            }
        });
    }
};
