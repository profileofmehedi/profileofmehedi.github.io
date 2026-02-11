const Tenant = {
    init: function(page) {
        App.renderLayout('tenant', page);
        this.user = App.getUser();
        // Tenant user has tenantId
        
        if (page === 'dashboard') this.loadDashboard();
    },

    loadDashboard: function() {
        const myTenantId = this.user.tenantId;
        const bills = App.get(App.KEYS.BILLS).filter(b => b.tenantId === myTenantId);

        // Stats
        const unpaid = bills.filter(b => b.status === 'Unpaid');
        const dueAmount = unpaid.reduce((sum, b) => sum + b.total, 0);
        
        $('#due-amount').text(App.formatMoney(dueAmount));
        $('#last-payment').text(bills.filter(b=>b.status==='Paid').length > 0 ? 'Recently' : 'Never');

        // History Table
        const tableData = bills.map(b => [
            b.month,
            App.formatMoney(b.total),
            `<span class="badge bg-${b.status === 'Paid' ? 'success' : 'danger'}">${b.status}</span>`,
            b.status === 'Paid' ? (b.paidDate || '-') : '-'
        ]);

        $('#historyTable').DataTable({
            data: tableData,
            columns: [
                { title: "Month" },
                { title: "Amount" },
                { title: "Status" },
                { title: "Paid Date" }
            ],
            order: [[0, 'desc']]
        });
    }
};
