const ClientAdmin = {
    init: function(page) {
        App.renderLayout('client-admin', page);
        this.user = App.getUser();
        this.clientInfo = App.get(App.KEYS.CLIENTS).find(c => c.ownerId === this.user.id);

        if (page === 'dashboard') this.loadDashboard();
        if (page === 'properties') this.loadProperties();
        if (page === 'tenants') this.loadTenants();
        if (page === 'billing') this.loadBilling();
        if (page === 'reports') this.loadReports();
    },

    // --- DASHBOARD ---
    loadDashboard: function() {
        const props = App.get(App.KEYS.PROPERTIES).filter(p => p.clientId === this.clientInfo.id);
        const units = App.get(App.KEYS.UNITS).filter(u => props.some(p => p.id === u.propertyId));
        const tenants = App.get(App.KEYS.TENANTS).filter(t => t.clientId === this.clientInfo.id && t.status === 'Active');
        
        // Bills
        const bills = App.get(App.KEYS.BILLS).filter(b => b.clientId === this.clientInfo.id);
        const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
        
        const monthlyCollection = bills
            .filter(b => b.month === currentMonth && b.status === 'Paid')
            .reduce((sum, b) => sum + b.total, 0);

        const totalDue = bills
            .filter(b => b.status === 'Unpaid')
            .reduce((sum, b) => sum + b.total, 0);

        $('#total-properties').text(props.length);
        $('#total-units').text(units.length);
        $('#occupied-units').text(units.filter(u => u.status === 'Occupied').length);
        $('#vacant-units').text(units.filter(u => u.status === 'Vacant').length);
        $('#monthly-collection').text(App.formatMoney(monthlyCollection));
        $('#total-due').text(App.formatMoney(totalDue));
    },

    // --- PROPERTIES ---
    loadProperties: function() {
        const props = App.get(App.KEYS.PROPERTIES).filter(p => p.clientId === this.clientInfo.id);
        const units = App.get(App.KEYS.UNITS);

        const tableData = props.map(p => {
            const pUnits = units.filter(u => u.propertyId === p.id);
            return [
                p.id,
                p.name,
                p.address,
                p.floors,
                pUnits.length,
                `<button class="btn btn-sm btn-primary" onclick="ClientAdmin.viewUnits(${p.id})">Manage Units</button>`
            ];
        });

        $('#propertiesTable').DataTable({
            data: tableData,
            columns: [
                { title: "ID" },
                { title: "Name" },
                { title: "Address" },
                { title: "Floors" },
                { title: "Total Units" },
                { title: "Actions" }
            ]
        });
    },

    saveProperty: function() {
        const name = $('#propName').val();
        const address = $('#propAddress').val();
        const floors = $('#propFloors').val();

        if(!name) return;

        const props = App.get(App.KEYS.PROPERTIES);
        const newProp = {
            id: Date.now(),
            clientId: this.clientInfo.id,
            name, address, floors, totalUnits: 0
        };
        props.push(newProp);
        App.save(App.KEYS.PROPERTIES, props);
        Swal.fire('Saved', 'Property Added', 'success').then(() => location.reload());
    },
    
    viewUnits: function(propId) {
        // Simple alert for demo, ideally a modal or page
        const units = App.get(App.KEYS.UNITS).filter(u => u.propertyId === propId);
        let html = `<table class="table table-sm text-start"><thead><tr><th>Name</th><th>Rent</th><th>Status</th></tr></thead><tbody>`;
        units.forEach(u => {
            html += `<tr><td>${u.name}</td><td>${u.rent}</td><td>${u.status}</td></tr>`;
        });
        html += `</tbody></table>
        <hr>
        <h5>Add Unit</h5>
        <input id="newUnitName" class="form-control mb-2" placeholder="Unit Name (e.g. 1A)">
        <input id="newUnitRent" type="number" class="form-control mb-2" placeholder="Rent Amount">
        `;

        Swal.fire({
            title: 'Units Management',
            html: html,
            showCancelButton: true,
            confirmButtonText: 'Add Unit',
            preConfirm: () => {
                const name = Swal.getPopup().querySelector('#newUnitName').value;
                const rent = Swal.getPopup().querySelector('#newUnitRent').value;
                if (!name || !rent) Swal.showValidationMessage('Please enter name and rent');
                return { name, rent };
            }
        }).then((result) => {
            if (result.isConfirmed) {
                const allUnits = App.get(App.KEYS.UNITS);
                allUnits.push({
                    id: Date.now(),
                    propertyId: propId,
                    name: result.value.name,
                    floor: "N/A", // Simplified
                    rent: parseInt(result.value.rent),
                    status: "Vacant"
                });
                App.save(App.KEYS.UNITS, allUnits);
                Swal.fire('Added', '', 'success');
            }
        });
    },

    // --- TENANTS ---
    loadTenants: function() {
        const tenants = App.get(App.KEYS.TENANTS).filter(t => t.clientId === this.clientInfo.id);
        const units = App.get(App.KEYS.UNITS);
        const props = App.get(App.KEYS.PROPERTIES);

        const tableData = tenants.map(t => {
            const unit = units.find(u => u.id === t.unitId);
            const prop = unit ? props.find(p => p.id === unit.propertyId) : null;
            return [
                t.name,
                t.phone,
                prop ? prop.name : '-',
                unit ? unit.name : '-',
                t.status,
                `<button class="btn btn-sm btn-danger" onclick="ClientAdmin.moveOut(${t.id})">Move Out</button>`
            ];
        });

        $('#tenantsTable').DataTable({
            data: tableData,
            columns: [
                { title: "Name" },
                { title: "Phone" },
                { title: "Property" },
                { title: "Unit" },
                { title: "Status" },
                { title: "Actions" }
            ]
        });

        // Populate Unit Select for Add Modal
        const vacantUnits = units.filter(u => {
            const prop = props.find(p => p.id === u.propertyId);
            return prop && prop.clientId === this.clientInfo.id && u.status === 'Vacant';
        });
        
        const select = $('#tenantUnit');
        vacantUnits.forEach(u => {
            const prop = props.find(p => p.id === u.propertyId);
            select.append(new Option(`${prop.name} - ${u.name} (${u.rent} BDT)`, u.id));
        });
    },

    saveTenant: function() {
        const name = $('#tenantName').val();
        const phone = $('#tenantPhone').val();
        const email = $('#tenantEmail').val();
        const unitId = parseInt($('#tenantUnit').val());
        const password = "123"; // Default

        if(!name || !unitId) return;

        const tenants = App.get(App.KEYS.TENANTS);
        const users = App.get(App.KEYS.USERS);
        const units = App.get(App.KEYS.UNITS);

        // 1. Create User
        const newUser = {
            id: Date.now(),
            name, email, password, role: 'tenant', tenantId: null
        };

        // 2. Create Tenant
        const newTenant = {
            id: Date.now() + 1,
            clientId: this.clientInfo.id,
            name, phone, email, unitId, 
            moveInDate: new Date().toISOString().slice(0,10),
            status: "Active"
        };
        newUser.tenantId = newTenant.id;

        // 3. Update Unit Status
        const unitIndex = units.findIndex(u => u.id === unitId);
        if(unitIndex > -1) units[unitIndex].status = "Occupied";

        tenants.push(newTenant);
        users.push(newUser);

        App.save(App.KEYS.TENANTS, tenants);
        App.save(App.KEYS.USERS, users);
        App.save(App.KEYS.UNITS, units);

        Swal.fire('Success', 'Tenant Added', 'success').then(() => location.reload());
    },

    // --- BILLING ---
    loadBilling: function() {
        const bills = App.get(App.KEYS.BILLS).filter(b => b.clientId === this.clientInfo.id);
        const tenants = App.get(App.KEYS.TENANTS);

        const tableData = bills.map(b => {
            const tenant = tenants.find(t => t.id === b.tenantId);
            return [
                b.id,
                tenant ? tenant.name : 'Unknown',
                b.month,
                App.formatMoney(b.total),
                `<span class="badge bg-${b.status === 'Paid' ? 'success' : 'warning'}">${b.status}</span>`,
                b.status === 'Unpaid' 
                    ? `<button class="btn btn-sm btn-success" onclick="ClientAdmin.collectBill(${b.id})">Collect</button>` 
                    : '<button class="btn btn-sm btn-secondary" disabled>Paid</button>'
            ];
        });

        $('#billsTable').DataTable({
            data: tableData,
            columns: [
                { title: "Bill ID" },
                { title: "Tenant" },
                { title: "Month" },
                { title: "Total Amount" },
                { title: "Status" },
                { title: "Action" }
            ]
        });
    },

    generateBills: function() {
        const month = $('#billMonth').val(); // YYYY-MM
        if (!month) return Swal.fire('Error', 'Select Month', 'error');

        const tenants = App.get(App.KEYS.TENANTS).filter(t => t.clientId === this.clientInfo.id && t.status === 'Active');
        const units = App.get(App.KEYS.UNITS);
        const existingBills = App.get(App.KEYS.BILLS);
        
        let count = 0;

        tenants.forEach(t => {
            // Check if bill exists
            const exists = existingBills.find(b => b.tenantId === t.id && b.month === month);
            if (!exists) {
                const unit = units.find(u => u.id === t.unitId);
                const rent = unit ? unit.rent : 0;
                
                const newBill = {
                    id: Date.now() + Math.floor(Math.random() * 1000),
                    clientId: this.clientInfo.id,
                    tenantId: t.id,
                    month: month,
                    rent: rent,
                    utilities: 0, // Simplified for demo
                    fine: 0,
                    total: rent,
                    status: "Unpaid",
                    generatedDate: new Date().toISOString().slice(0, 10)
                };
                existingBills.push(newBill);
                count++;
            }
        });

        App.save(App.KEYS.BILLS, existingBills);
        Swal.fire('Success', `Generated ${count} bills for ${month}`, 'success').then(() => location.reload());
    },

    collectBill: function(billId) {
        Swal.fire({
            title: 'Confirm Payment?',
            text: 'Mark this bill as paid via Cash/Bank?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, Collect Payment'
        }).then((result) => {
            if (result.isConfirmed) {
                const bills = App.get(App.KEYS.BILLS);
                const idx = bills.findIndex(b => b.id === billId);
                if (idx > -1) {
                    bills[idx].status = "Paid";
                    bills[idx].paidDate = new Date().toISOString().slice(0, 10);
                    App.save(App.KEYS.BILLS, bills);
                    
                    // Add Payment Record
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
    },

    // --- REPORTS ---
    loadReports: function() {
        const bills = App.get(App.KEYS.BILLS).filter(b => b.clientId === this.clientInfo.id);
        // Simple collection log
        const tableData = bills.filter(b => b.status === 'Paid').map(b => [
            b.paidDate,
            `Bill #${b.id}`,
            b.month,
            App.formatMoney(b.total),
            "Cash"
        ]);
         $('#reportsTable').DataTable({
            data: tableData,
            columns: [
                { title: "Date" },
                { title: "Reference" },
                { title: "Bill Month" },
                { title: "Amount" },
                { title: "Method" }
            ]
        });
    }
};
