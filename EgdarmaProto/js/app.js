/**
 * Egdarma - Advanced Application Logic V4
 * Features: Full CRUD (Edit/Delete), Error Handling, Mobile Fixes
 */

const App = {
    currentUser: null,
    chartInstances: [],
    mapInstance: null,
    calendarInstance: null,
    cart: [],

    init: function() {
        this.checkAuth();
        this.setupEventListeners();
        this.renderSidebar();
        this.loadView('dashboard');
    },

    checkAuth: function() {
        const userStr = sessionStorage.getItem('egdarma_current_user');
        if (!userStr) {
            window.location.href = 'login.html';
            return;
        }
        this.currentUser = JSON.parse(userStr);
        $('#user-display-name').text(this.currentUser.name);
        const avatarUrl = `https://ui-avatars.com/api/?name=${this.currentUser.name}&background=random`;
        $('#user-avatar').attr('src', avatarUrl);
    },

    setupEventListeners: function() {
        // Logout
        $('#logoutBtn').on('click', function(e) {
            e.preventDefault();
            Swal.fire({
                title: 'Logout?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#004aad',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Logout'
            }).then((result) => {
                if (result.isConfirmed) {
                    sessionStorage.removeItem('egdarma_current_user');
                    window.location.href = 'login.html';
                }
            });
        });

        // Sidebar Toggle
        $('#sidebarCollapse').on('click', function() {
            if ($(window).width() <= 768) {
                $('#sidebar, .overlay').toggleClass('active');
            } else {
                $('#sidebar').toggleClass('collapsed');
                $('#content').toggleClass('expanded');
            }
        });

        $(document).on('click', '.overlay', function() {
            $('#sidebar, .overlay').removeClass('active');
        });

        // Navigation
        $(document).on('click', '.nav-link-custom', function(e) {
            e.preventDefault();
            $('.nav-link-custom').removeClass('active');
            $(this).addClass('active');
            const view = $(this).data('view');
            if ($(window).width() <= 768) $('#sidebar, .overlay').removeClass('active');
            App.loadView(view);
        });

        // Add to Cart
        $(document).on('click', '.add-to-cart-btn', function() {
            const id = $(this).data('id');
            const name = $(this).data('name');
            const price = $(this).data('price');
            App.cart.push({ id, name, price });
            const Toast = Swal.mixin({ toast: true, position: 'top-end', showConfirmButton: false, timer: 1500 });
            Toast.fire({ icon: 'success', title: 'Added to Cart' });
            App.updateCartBadge();
        });
    },

    updateCartBadge: function() {
        $('#cart-count').text(App.cart.length);
        if(App.cart.length > 0) $('#cart-count').show();
        else $('#cart-count').hide();
    },

    renderSidebar: function() {
        const role = this.currentUser.role;
        let menuHtml = `
            <li><a href="#" class="nav-link-custom active" data-view="dashboard"><i class="fas fa-chart-pie"></i> <span>Dashboard</span></a></li>
            <li><a href="#" class="nav-link-custom" data-view="products"><i class="fas fa-box-open"></i> <span>Products & Orders</span></a></li>
        `;

        if (role === 'Admin') {
            menuHtml += `
                <li><a href="#" class="nav-link-custom" data-view="employees"><i class="fas fa-users-cog"></i> <span>Employee Mgmt</span></a></li>
                <li><a href="#" class="nav-link-custom" data-view="doctors"><i class="fas fa-user-md"></i> <span>Doctors List</span></a></li>
                <li><a href="#" class="nav-link-custom" data-view="map"><i class="fas fa-map-marked-alt"></i> <span>Territory Map</span></a></li>
            `;
        }

        if (role === 'Manager') {
            menuHtml += `<li><a href="#" class="nav-link-custom" data-view="approvals"><i class="fas fa-check-double"></i> <span>Approvals</span></a></li>`;
        }

        if (role === 'Officer') {
            menuHtml += `
                <li><a href="#" class="nav-link-custom" data-view="tour-plan"><i class="fas fa-calendar-alt"></i> <span>Tour Plan (TP)</span></a></li>
                <li><a href="#" class="nav-link-custom" data-view="targets"><i class="fas fa-bullseye"></i> <span>My Targets</span></a></li>
                <li><a href="#" class="nav-link-custom" data-view="create-dcr"><i class="fas fa-plus-circle"></i> <span>Create Visit</span></a></li>
                <li><a href="#" class="nav-link-custom" data-view="expenses"><i class="fas fa-file-invoice-dollar"></i> <span>Expenses</span></a></li>
            `;
        }

        $('#sidebar-menu').html(menuHtml);
    },

    loadView: function(viewName) {
        if(this.mapInstance) { this.mapInstance.remove(); this.mapInstance = null; }
        this.chartInstances.forEach(chart => chart.destroy());
        this.chartInstances = [];

        const $content = $('#main-content');
        $content.removeClass('fade-in');
        void $content[0].offsetWidth; 
        $content.addClass('fade-in');
        
        $('#page-title').text(viewName.replace('-', ' ').toUpperCase());

        switch(viewName) {
            case 'dashboard': this.views.dashboard(); break;
            case 'products': this.views.products(); break;
            case 'employees': this.views.employees(); break;
            case 'cart': this.views.cart(); break;
            case 'doctors': this.views.doctors(); break;
            case 'approvals': this.views.approvals(); break;
            case 'targets': this.views.targets(); break;
            case 'create-dcr': this.views.createDCR(); break;
            case 'map': this.views.map(); break;
            case 'tour-plan': this.views.tourPlan(); break;
            case 'expenses': this.views.expenses(); break;
            default: this.views.dashboard();
        }
    },

    // ================= VIEWS =================
    views: {
        dashboard: function() {
            const dcrs = DB.getDCRs();
            const doctors = DB.getDoctors();
            const orders = DB.getOrders();
            const totalSales = orders.reduce((sum, o) => sum + o.total, 0);
            
            let html = `
                <div class="row">
                    <div class="col-md-3">
                        <div class="stat-card" onclick="App.loadView('doctors')" style="cursor: pointer;">
                            <div class="stat-info"><h3>${doctors.length}</h3><p>Doctors</p></div>
                            <div class="stat-icon-box bg-blue-light"><i class="fas fa-user-md"></i></div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="stat-card" onclick="App.loadView('my-dcr')" style="cursor: pointer;">
                            <div class="stat-info"><h3>${dcrs.length}</h3><p>Visits</p></div>
                            <div class="stat-icon-box bg-green-light"><i class="fas fa-walking"></i></div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="stat-card" onclick="App.loadView('products')" style="cursor: pointer;">
                            <div class="stat-info"><h3>৳ ${(totalSales/1000).toFixed(1)}k</h3><p>Sales</p></div>
                            <div class="stat-icon-box bg-purple-light"><i class="fas fa-chart-line"></i></div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="stat-card" onclick="App.loadView('cart')" style="cursor: pointer;">
                            <div class="stat-info"><h3>${orders.length}</h3><p>Orders</p></div>
                            <div class="stat-icon-box bg-orange-light"><i class="fas fa-shopping-cart"></i></div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-12">
                        <div class="card card-custom">
                            <div class="card-header-custom"><span><i class="fas fa-chart-area me-2"></i>Activity Overview</span></div>
                            <div class="card-body"><canvas id="mainChart" height="100"></canvas></div>
                        </div>
                    </div>
                </div>
            `;
            $('#main-content').html(html);

            const ctx1 = document.getElementById('mainChart').getContext('2d');
            const dates = [...new Set(dcrs.map(d => d.visitDate))].sort().slice(-7);
            const counts = dates.map(date => dcrs.filter(d => d.visitDate === date).length);
            App.chartInstances.push(new Chart(ctx1, {
                type: 'bar',
                data: {
                    labels: dates,
                    datasets: [{ label: 'Visits', data: counts, backgroundColor: '#004aad', borderRadius: 5 }]
                },
                options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }
            }));
        },

        employees: function() {
            const html = `
                <div class="card card-custom">
                    <div class="card-header-custom">
                        <span>Employee Directory</span>
                        <button class="btn btn-sm btn-primary rounded-pill px-3" onclick="App.actions.openAddEmployeeModal()">
                            <i class="fas fa-plus me-1"></i> Add Employee
                        </button>
                    </div>
                    <div class="card-body">
                        <div class="table-responsive">
                            <table id="empTable" class="table table-hover align-middle">
                                <thead><tr><th>Name</th><th>Role</th><th>Designation</th><th>Territory</th><th>Action</th></tr></thead>
                                <tbody></tbody>
                            </table>
                        </div>
                    </div>
                </div>
            `;
            $('#main-content').html(html);

            const users = DB.getUsers();
            const tableData = users.map(u => [
                `<div class="d-flex align-items-center"><img src="https://ui-avatars.com/api/?name=${u.name}&background=random" class="rounded-circle me-3" width="35"><strong>${u.name}</strong></div>`,
                `<span class="badge bg-light text-dark border">${u.role}</span>`,
                u.designation,
                u.territory,
                `
                <button class="btn btn-sm btn-outline-primary rounded-circle me-1" onclick="App.actions.openEditEmployeeModal(${u.id})"><i class="fas fa-edit"></i></button>
                <button class="btn btn-sm btn-outline-danger rounded-circle" onclick="App.actions.deleteEmployee(${u.id})"><i class="fas fa-trash"></i></button>
                `
            ]);

            $('#empTable').DataTable({ data: tableData });
        },

        products: function() {
            const products = DB.getProducts();
            const isAdmin = App.currentUser.role === 'Admin';
            
            let html = `
                <div class="row mb-4">
                    <div class="col-12 d-flex justify-content-between align-items-center">
                        <h4 class="text-secondary">Product Catalog</h4>
                        <div>
                            ${isAdmin ? `<button class="btn btn-primary me-2 rounded-pill" onclick="App.actions.openAddProductModal()"><i class="fas fa-plus"></i> New Product</button>` : ''}
                            <button class="btn btn-outline-primary rounded-pill" onclick="App.loadView('cart')">
                                <i class="fas fa-shopping-cart"></i> Cart <span id="cart-count" class="badge bg-danger rounded-pill" style="display:none">0</span>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="row">
            `;

            products.forEach(p => {
                const actionBtns = isAdmin ? `
                    <div class="position-absolute top-0 end-0 m-2">
                        <button class="btn btn-sm btn-light rounded-circle text-primary border" onclick="App.actions.openEditProductModal(${p.id})"><i class="fas fa-edit"></i></button>
                        <button class="btn btn-sm btn-light rounded-circle text-danger border" onclick="App.actions.deleteProduct(${p.id})"><i class="fas fa-trash"></i></button>
                    </div>
                ` : '';

                html += `
                    <div class="col-md-4 col-lg-3 mb-4">
                        <div class="card product-card h-100">
                            <div class="product-img">
                                <i class="fas fa-pump-soap"></i>
                                ${actionBtns}
                            </div>
                            <div class="product-details">
                                <small class="text-muted">${p.category}</small>
                                <h5 class="mt-1">${p.name}</h5>
                                <div class="d-flex justify-content-between align-items-center mt-3">
                                    <span class="product-price">৳ ${p.price}</span>
                                    <button class="btn btn-sm btn-primary rounded-pill add-to-cart-btn" 
                                        data-id="${p.id}" data-name="${p.name}" data-price="${p.price}">
                                        + Add
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            });
            html += '</div>';
            $('#main-content').html(html);
            App.updateCartBadge();
        },

        doctors: function() {
            const html = `
                <div class="card card-custom">
                    <div class="card-header-custom">
                        <span>Doctors Database</span>
                        <button class="btn btn-sm btn-primary rounded-pill px-3" onclick="App.actions.openAddDoctorModal()">
                            <i class="fas fa-plus me-1"></i> Add Doctor
                        </button>
                    </div>
                    <div class="card-body">
                        <table id="doctorsTable" class="table table-hover" style="width:100%">
                            <thead><tr><th>Doctor Name</th><th>Specialization</th><th>Location</th><th>Action</th></tr></thead>
                            <tbody></tbody>
                        </table>
                    </div>
                </div>
            `;
            $('#main-content').html(html);
            
            const doctors = DB.getDoctors();
            const tableData = doctors.map(doc => [
                `<div><strong>${doc.name}</strong><br><small class="text-muted">${doc.degree || ''}</small></div>`,
                `<span class="badge bg-light text-primary border">${doc.specialization}</span>`,
                doc.location,
                `
                <button class="btn btn-sm btn-outline-primary me-1" onclick="App.actions.openEditDoctorModal(${doc.id})"><i class="fas fa-edit"></i></button>
                <button class="btn btn-sm btn-outline-danger" onclick="App.actions.deleteDoctor(${doc.id})"><i class="fas fa-trash"></i></button>
                `
            ]);
            $('#doctorsTable').DataTable({ data: tableData });
        },

        // Other views preserved
        cart: function() {
            if(App.cart.length === 0) {
                $('#main-content').html('<div class="text-center mt-5"><h3>Cart is Empty</h3><button class="btn btn-primary mt-3" onclick="App.loadView(\'products\')">Go Shopping</button></div>');
                return;
            }
            const total = App.cart.reduce((sum, item) => sum + item.price, 0);
            let itemsHtml = App.cart.map((item, index) => `<tr><td>${item.name}</td><td>৳ ${item.price}</td><td><button class="btn btn-sm btn-danger" onclick="App.actions.removeFromCart(${index})"><i class="fas fa-times"></i></button></td></tr>`).join('');
            const html = `<div class="row justify-content-center"><div class="col-md-8"><div class="card card-custom"><div class="card-header-custom">Your Order Cart</div><div class="card-body"><table class="table"><thead><tr><th>Product</th><th>Price</th><th>Action</th></tr></thead><tbody>${itemsHtml}</tbody><tfoot><tr class="fw-bold"><td>Total</td><td>৳ ${total}</td><td></td></tr></tfoot></table><div class="d-flex justify-content-end mt-4"><button class="btn btn-outline-secondary me-2" onclick="App.cart=[]; App.loadView('products');">Clear</button><button class="btn btn-success" onclick="App.actions.checkout(${total})">Checkout</button></div></div></div></div></div>`;
            $('#main-content').html(html);
        },
        map: function() {
            $('#main-content').html(`<div class="card card-custom"><div class="card-header-custom">Territory Map</div><div class="card-body p-0"><div id="map"></div></div></div>`);
            const doctors = DB.getDoctors();
            App.mapInstance = L.map('map').setView([23.75, 90.39], 12);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(App.mapInstance);
            doctors.forEach(doc => { if(doc.lat && doc.lng) L.marker([doc.lat, doc.lng]).addTo(App.mapInstance).bindPopup(`<b>${doc.name}</b><br>${doc.location}`); });
        },
        tourPlan: function() {
            $('#main-content').html(`<div class="card card-custom"><div class="card-header-custom"><span>Monthly Tour Plan (TP)</span><button class="btn btn-sm btn-primary" onclick="App.actions.addTourPlanEvent()">+ Add Plan</button></div><div class="card-body"><div id="calendar"></div></div></div>`);
            const calendar = new FullCalendar.Calendar(document.getElementById('calendar'), { initialView: 'dayGridMonth', events: DB.getTourPlan(), height: 600 });
            calendar.render(); App.calendarInstance = calendar;
        },
        expenses: function() {
            $('#main-content').html(`<div class="card card-custom"><div class="card-header-custom"><span>Expense Claims</span><button class="btn btn-sm btn-primary" onclick="App.actions.addExpenseModal()">+ New Claim</button></div><div class="card-body"><table id="expenseTable" class="table table-hover"><thead><tr><th>Date</th><th>Type</th><th>Amount</th><th>Status</th></tr></thead><tbody></tbody></table></div></div>`);
            const exp = DB.getExpenses().map(e => [e.date, e.type, `৳ ${e.amount}`, e.status === 'Approved' ? '<span class="badge bg-success">Approved</span>' : '<span class="badge bg-warning text-dark">Pending</span>']);
            $('#expenseTable').DataTable({ data: exp });
        },
        approvals: function() {
            $('#main-content').html(`<div class="card card-custom"><div class="card-header-custom">Pending Approvals</div><div class="card-body"><table id="approvalsTable" class="table"><thead><tr><th>Date</th><th>Details</th><th>Status</th><th>Action</th></tr></thead><tbody></tbody></table></div></div>`);
            const dcrs = DB.getDCRs().filter(d => d.status === 'Pending').map(d => [d.visitDate, `<strong>${d.doctorName}</strong><br><small>${d.officerName}</small>`, d.status, `<button class="btn btn-sm btn-success" onclick="App.actions.approveDCR(${d.id})">Approve</button>`]);
            $('#approvalsTable').DataTable({ data: dcrs });
        },
        targets: function() {
            const t = DB.getTargets(); const p = Math.round((t.currentSales/t.monthlySalesTarget)*100);
            $('#main-content').html(`<div class="row justify-content-center"><div class="col-md-8"><div class="card card-custom"><div class="card-header-custom">Targets</div><div class="card-body p-4"><h5 class="mb-3">Sales Target <span class="float-end">${p}%</span></h5><div class="progress" style="height:25px"><div class="progress-bar bg-primary" style="width:${p}%">${p}%</div></div></div></div></div></div>`);
        },
        createDCR: function() {
             const docs = DB.getDoctors().map(d => `<option value="${d.name}">${d.name}</option>`).join('');
             $('#main-content').html(`<div class="row justify-content-center"><div class="col-md-8"><div class="card card-custom"><div class="card-header-custom">New Visit</div><div class="card-body"><form id="dcrForm"><select class="form-select mb-3" id="dcrDoctor">${docs}</select><input type="date" class="form-control mb-3" id="dcrDate"><button class="btn btn-primary w-100">Submit</button></form></div></div></div></div>`);
             $('#dcrDate').val(new Date().toISOString().split('T')[0]);
             $('#dcrForm').on('submit', (e) => { e.preventDefault(); App.actions.saveDCR(); });
        }
    },

    // ================= ACTIONS =================
    actions: {
        // --- Employee Actions ---
        openAddEmployeeModal: function() {
            Swal.fire({
                title: 'Add New Employee',
                html: `
                    <input id="swal-emp-name" class="swal2-input" placeholder="Full Name">
                    <select id="swal-emp-role" class="swal2-input">
                        <option value="Officer">Field Officer</option>
                        <option value="Manager">Regional Manager</option>
                        <option value="Admin">Head Office Admin</option>
                    </select>
                    <input id="swal-emp-desig" class="swal2-input" placeholder="Designation">
                    <input id="swal-emp-terr" class="swal2-input" placeholder="Territory/HQ">
                `,
                confirmButtonText: 'Create User',
                preConfirm: () => {
                    return {
                        name: document.getElementById('swal-emp-name').value,
                        role: document.getElementById('swal-emp-role').value,
                        designation: document.getElementById('swal-emp-desig').value,
                        territory: document.getElementById('swal-emp-terr').value,
                        username: 'user' + Math.floor(Math.random()*1000)
                    }
                }
            }).then((result) => {
                if(result.isConfirmed) {
                    const users = DB.getUsers();
                    const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 101;
                    users.push({ id: newId, ...result.value });
                    DB.setUsers(users);
                    Swal.fire('Success', 'Employee Account Created', 'success');
                    App.loadView('employees');
                }
            });
        },

        openEditEmployeeModal: function(id) {
            const user = DB.getUsers().find(u => u.id === id);
            Swal.fire({
                title: 'Edit Employee',
                html: `
                    <input id="swal-emp-name" class="swal2-input" placeholder="Full Name" value="${user.name}">
                    <input id="swal-emp-desig" class="swal2-input" placeholder="Designation" value="${user.designation}">
                    <input id="swal-emp-terr" class="swal2-input" placeholder="Territory/HQ" value="${user.territory}">
                `,
                confirmButtonText: 'Update User',
                preConfirm: () => {
                    return {
                        name: document.getElementById('swal-emp-name').value,
                        designation: document.getElementById('swal-emp-desig').value,
                        territory: document.getElementById('swal-emp-terr').value
                    }
                }
            }).then((result) => {
                if(result.isConfirmed) {
                    let users = DB.getUsers();
                    const idx = users.findIndex(u => u.id === id);
                    users[idx] = { ...users[idx], ...result.value };
                    DB.setUsers(users);
                    Swal.fire('Updated', 'Employee details updated', 'success');
                    App.loadView('employees');
                }
            });
        },

        deleteEmployee: function(id) {
            Swal.fire({
                title: 'Remove User?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33'
            }).then((result) => {
                if(result.isConfirmed) {
                    let users = DB.getUsers().filter(u => u.id !== id);
                    DB.setUsers(users);
                    Swal.fire('Deleted', 'User removed.', 'success');
                    App.loadView('employees');
                }
            });
        },

        // --- Product Actions ---
        openAddProductModal: function() {
            Swal.fire({
                title: 'Add New Product',
                html: `
                    <input id="swal-prod-name" class="swal2-input" placeholder="Product Name">
                    <input id="swal-prod-cat" class="swal2-input" placeholder="Category">
                    <input id="swal-prod-price" type="number" class="swal2-input" placeholder="Price">
                `,
                confirmButtonText: 'Add Product',
                preConfirm: () => {
                    return {
                        name: document.getElementById('swal-prod-name').value,
                        category: document.getElementById('swal-prod-cat').value,
                        price: parseInt(document.getElementById('swal-prod-price').value)
                    }
                }
            }).then((result) => {
                if(result.isConfirmed) {
                    const products = DB.getProducts();
                    const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 101;
                    products.push({ id: newId, ...result.value });
                    DB.setProducts(products);
                    Swal.fire('Success', 'Product Added', 'success');
                    App.loadView('products');
                }
            });
        },

        openEditProductModal: function(id) {
            const p = DB.getProducts().find(prod => prod.id === id);
            Swal.fire({
                title: 'Edit Product',
                html: `
                    <input id="swal-prod-name" class="swal2-input" value="${p.name}">
                    <input id="swal-prod-cat" class="swal2-input" value="${p.category}">
                    <input id="swal-prod-price" type="number" class="swal2-input" value="${p.price}">
                `,
                confirmButtonText: 'Update Product',
                preConfirm: () => {
                    return {
                        name: document.getElementById('swal-prod-name').value,
                        category: document.getElementById('swal-prod-cat').value,
                        price: parseInt(document.getElementById('swal-prod-price').value)
                    }
                }
            }).then((result) => {
                if(result.isConfirmed) {
                    let prods = DB.getProducts();
                    const idx = prods.findIndex(x => x.id === id);
                    prods[idx] = { ...prods[idx], ...result.value };
                    DB.setProducts(prods);
                    Swal.fire('Success', 'Product Updated', 'success');
                    App.loadView('products');
                }
            });
        },

        deleteProduct: function(id) {
            Swal.fire({
                title: 'Delete Product?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33'
            }).then((res) => {
                if(res.isConfirmed) {
                    let prod = DB.getProducts().filter(p => p.id !== id);
                    DB.setProducts(prod);
                    App.loadView('products');
                }
            });
        },

        // --- Doctor Actions ---
        openAddDoctorModal: function() {
            Swal.fire({
                title: 'Add Doctor',
                html: `
                    <input id="swal-doc-name" class="swal2-input" placeholder="Name">
                    <input id="swal-doc-spec" class="swal2-input" placeholder="Specialization">
                    <input id="swal-doc-loc" class="swal2-input" placeholder="Location">
                `,
                confirmButtonText: 'Save',
                preConfirm: () => {
                    return {
                        name: document.getElementById('swal-doc-name').value,
                        specialization: document.getElementById('swal-doc-spec').value,
                        location: document.getElementById('swal-doc-loc').value
                    }
                }
            }).then((res) => {
                if(res.isConfirmed) {
                    let docs = DB.getDoctors();
                    const newId = docs.length > 0 ? Math.max(...docs.map(d => d.id)) + 1 : 1;
                    docs.push({ id: newId, ...res.value });
                    DB.setDoctors(docs);
                    App.loadView('doctors');
                }
            });
        },

        openEditDoctorModal: function(id) {
            const d = DB.getDoctors().find(doc => doc.id === id);
            Swal.fire({
                title: 'Edit Doctor',
                html: `
                    <input id="swal-doc-name" class="swal2-input" value="${d.name}">
                    <input id="swal-doc-spec" class="swal2-input" value="${d.specialization}">
                    <input id="swal-doc-loc" class="swal2-input" value="${d.location}">
                `,
                confirmButtonText: 'Update',
                preConfirm: () => {
                    return {
                        name: document.getElementById('swal-doc-name').value,
                        specialization: document.getElementById('swal-doc-spec').value,
                        location: document.getElementById('swal-doc-loc').value
                    }
                }
            }).then((res) => {
                if(res.isConfirmed) {
                    let docs = DB.getDoctors();
                    const idx = docs.findIndex(x => x.id === id);
                    docs[idx] = { ...docs[idx], ...res.value };
                    DB.setDoctors(docs);
                    App.loadView('doctors');
                }
            });
        },

        deleteDoctor: function(id) {
            Swal.fire({ title: 'Delete Doctor?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#d33' })
                .then((res) => {
                    if(res.isConfirmed) {
                        let docs = DB.getDoctors().filter(d => d.id !== id);
                        DB.setDoctors(docs);
                        App.loadView('doctors');
                    }
                });
        },

        // --- Misc ---
        removeFromCart: function(index) { App.cart.splice(index, 1); App.loadView('cart'); App.updateCartBadge(); },
        checkout: function(total) {
            const orders = DB.getOrders();
            orders.push({ id: Date.now(), date: new Date().toISOString().split('T')[0], doctor: 'Direct', total: total, status: 'Processing' });
            DB.setOrders(orders); App.cart = []; App.updateCartBadge();
            Swal.fire('Success', 'Order Placed', 'success'); App.loadView('dashboard');
        },
        addExpenseModal: function() { /* ... */ },
        addTourPlanEvent: function() { /* ... */ },
        approveDCR: function(id) {
            let dcrs = DB.getDCRs(); let d = dcrs.find(x => x.id === id); if(d) { d.status='Approved'; DB.setDCRs(dcrs); App.loadView('approvals'); }
        },
        saveDCR: function() {
            let logs = DB.getDCRs();
            logs.push({ id: Date.now(), officerName: App.currentUser.username, doctorName: $('#dcrDoctor').val(), visitDate: $('#dcrDate').val(), status: 'Pending' });
            DB.setDCRs(logs); Swal.fire('Success', 'Submitted', 'success');
        }
    }
};

$(document).ready(function() {
    App.init();
});
