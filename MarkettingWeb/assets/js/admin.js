$(document).ready(function() {
    
    // --- 1. Authentication Logic ---
    const path = window.location.pathname;
    const page = path.split("/").pop();
    const isLoginPage = page.includes('admin-login.html');
    const isAdminPage = page.includes('admin');

    // Check Auth
    if (isAdminPage && !isLoginPage) {
        if (localStorage.getItem('adminLoggedIn') !== 'true') {
            window.location.href = 'admin-login.html';
            return; // Stop execution
        }
    }

    // Login Handler
    if (isLoginPage) {
        $('#login-form').submit(function(e) {
            e.preventDefault();
            const email = $('#email').val();
            const password = $('#password').val();
            
            // Demo Credentials
            if (email === 'admin@naturo.com' && password === 'admin123') {
                localStorage.setItem('adminLoggedIn', 'true');
                
                // Initialize Data if empty
                if (!localStorage.getItem('naturo_products')) {
                    localStorage.setItem('naturo_products', JSON.stringify(demoProducts));
                }
                if (!localStorage.getItem('naturo_orders')) {
                    localStorage.setItem('naturo_orders', JSON.stringify(demoOrders));
                }

                Swal.fire({
                    icon: 'success',
                    title: 'লগইন সফল',
                    showConfirmButton: false,
                    timer: 1500
                }).then(() => {
                    window.location.href = 'admin.html';
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'লগইন ব্যর্থ',
                    text: 'ভুল ইমেইল বা পাসওয়ার্ড।'
                });
            }
        });
        return; // Don't run dashboard logic on login page
    }

    // Logout Handler
    $(document).on('click', '#logout-btn', function(e) {
        e.preventDefault();
        localStorage.removeItem('adminLoggedIn');
        window.location.href = 'admin-login.html';
    });


    // --- 2. Data Initialization (Persistence) ---
    function getProducts() {
        const stored = localStorage.getItem('naturo_products');
        let products = stored ? JSON.parse(stored) : demoProducts;
        products = products.map(p => ({ ...p, stock: p.stock !== undefined ? p.stock : 20 }));
        return products;
    }

    function saveProducts(products) {
        localStorage.setItem('naturo_products', JSON.stringify(products));
        updateDashboardStats(); 
    }

    function getOrders() {
        const stored = localStorage.getItem('naturo_orders');
        return stored ? JSON.parse(stored) : demoOrders;
    }

    function saveOrders(orders) {
        localStorage.setItem('naturo_orders', JSON.stringify(orders));
        updateDashboardStats();
    }
    
    // Ensure data exists
    if (!localStorage.getItem('naturo_products')) saveProducts(demoProducts);
    if (!localStorage.getItem('naturo_orders')) saveOrders(demoOrders);


    // --- Helper: Update Stats (Shared across admin pages) ---
    function updateDashboardStats() {
        const products = getProducts();
        const orders = getOrders();

        // Product Stats
        if ($('#stat-total-products').length) $('#stat-total-products').text(products.length);
        if ($('#stat-low-stock').length) $('#stat-low-stock').text(products.filter(p => p.stock < 10).length);
        if ($('#stat-inventory-value').length) {
            const val = products.reduce((acc, p) => acc + (p.price * p.stock), 0);
            $('#stat-inventory-value').text('৳' + val.toLocaleString());
        }

        // Order Stats (admin-orders.html)
        if ($('#stat-total-orders').length) $('#stat-total-orders').text(orders.length);
        if ($('#stat-pending-orders').length) $('#stat-pending-orders').text(orders.filter(o => o.status === 'Pending').length);
        if ($('#stat-completed-orders').length) $('#stat-completed-orders').text(orders.filter(o => o.status === 'Delivered').length);

        // Dashboard Main Stats (admin.html)
        if ($('#admin-dashboard-stats').length) {
            const totalRevenue = orders.reduce((acc, curr) => acc + parseFloat(curr.total), 0);
            $('#total-products').text(products.length);
            $('#total-orders').text(orders.length);
            $('#total-revenue').text('৳' + totalRevenue.toLocaleString());
            $('#pending-orders').text(orders.filter(o => o.status === 'Pending').length);
        }
    }

    // --- 3. Dashboard Charts (admin.html) ---
    if ($('#salesChart').length) {
        updateDashboardStats();
        
        // Sales Chart
        const ctxSales = document.getElementById('salesChart').getContext('2d');
        new Chart(ctxSales, {
            type: 'line',
            data: {
                labels: ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
                datasets: [{
                    label: 'বিক্রয় (৳)',
                    data: [1200, 1900, 3000, 5000, 2000, 3000, 4500],
                    borderColor: '#4CAF50',
                    backgroundColor: 'rgba(76, 175, 80, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true } }
            }
        });

        // Order Status Chart
        const ctxStatus = document.getElementById('orderStatusChart').getContext('2d');
        const orders = getOrders();
        const statusCounts = {
            'Delivered': orders.filter(o => o.status === 'Delivered').length,
            'Pending': orders.filter(o => o.status === 'Pending').length,
            'Processing': orders.filter(o => o.status === 'Processing').length,
            'Cancelled': orders.filter(o => o.status === 'Cancelled').length
        };

        new Chart(ctxStatus, {
            type: 'doughnut',
            data: {
                labels: ['Delivered', 'Pending', 'Processing', 'Cancelled'],
                datasets: [{
                    data: [statusCounts.Delivered, statusCounts.Pending, statusCounts.Processing, statusCounts.Cancelled],
                    backgroundColor: ['#198754', '#ffc107', '#0dcaf0', '#dc3545'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom' }
                }
            }
        });
    }

    // --- 4. Admin Products Page Logic (Preserved) ---
    if ($('#admin-products-table').length) {
        updateDashboardStats();
        const products = getProducts();
        
        const table = $('#admin-products-table').DataTable({
            data: products,
            dom: 'rtip',
            language: {
                search: "_INPUT_", searchPlaceholder: "অনুসন্ধান...",
                paginate: { next: '<i class="fas fa-chevron-right"></i>', previous: '<i class="fas fa-chevron-left"></i>' },
                zeroRecords: "কোন পণ্য পাওয়া যায়নি", infoEmpty: "কোন পণ্য নেই", info: "মোট _TOTAL_ টি পণ্যের মধ্যে _START_ থেকে _END_ দেখানো হচ্ছে"
            },
            columns: [
                { data: 'id', className: "ps-4 fw-bold text-secondary" },
                { data: 'image', render: data => `<img src="${data}" width="40" height="40" class="rounded-3 shadow-sm object-fit-cover">` },
                { data: null, render: (data, type, row) => `<div><span class="d-block fw-bold text-dark">${row.name}</span><small class="text-muted">${row.category}</small></div>` },
                { data: 'price', render: data => '<span class="fw-bold text-success">৳' + data + '</span>' },
                { data: 'stock', render: data => {
                    let badgeClass = 'bg-success', text = 'ইন স্টক';
                    if (data < 5) { badgeClass = 'bg-danger'; text = 'স্টক আউট প্রায়'; }
                    else if (data < 15) { badgeClass = 'bg-warning text-dark'; text = 'লো স্টক'; }
                    return `<div><span class="badge ${badgeClass} mb-1">${text}</span><small class="d-block text-muted">${data} ইউনিট</small></div>`;
                }},
                { data: null, className: "text-end pe-4", render: (data, type, row) => `<button class="btn btn-sm btn-light text-primary edit-product shadow-sm me-1" data-id="${row.id}"><i class="fas fa-edit"></i></button><button class="btn btn-sm btn-light text-danger delete-product shadow-sm" data-id="${row.id}"><i class="fas fa-trash"></i></button>` }
            ],
            columnDefs: [{ targets: 2, searchable: true }]
        });

        $('#categoryFilter').on('change', function() { table.column(2).search($(this).val() || '', true, false).draw(); });

        $('#save-product-btn').click(function() {
            const name = $('#productName').val(); 
            const category = $('#productCategory').val();
            const price = parseFloat($('#productPrice').val());
            const stock = parseInt($('#productStock').val()) || 0;
            const image = $('#productImage').val() || 'https://placehold.co/300x300?text=New+Product'; 

            if (!name || !price) { Swal.fire('ত্রুটি', 'নাম এবং মূল্য আবশ্যক', 'error'); return; }

            const newProduct = {
                id: getProducts().length > 0 ? Math.max(...getProducts().map(p => p.id)) + 1 : 1,
                name: name, category: category, price: price, original_price: price * 1.2, 
                image: image, rating: 0, stock: stock
            };
            const currentProducts = getProducts();
            currentProducts.push(newProduct);
            saveProducts(currentProducts);
            table.row.add(newProduct).draw();
            Swal.fire('সফল!', 'পণ্য সফলভাবে যোগ করা হয়েছে।', 'success');
            $('#addProductModal').modal('hide'); $('#addProductForm')[0].reset();
        });

        $(document).on('click', '.delete-product', function() {
            const id = $(this).data('id');
            const row = $(this).closest('tr');
            Swal.fire({
                title: 'আপনি কি নিশ্চিত?', text: "আপনি এটি ফিরিয়ে আনতে পারবেন না!", icon: 'warning',
                showCancelButton: true, confirmButtonColor: '#d33', cancelButtonColor: '#3085d6', confirmButtonText: 'হ্যাঁ, ডিলিট করুন!', cancelButtonText: 'বাতিল'
            }).then((result) => {
                if (result.isConfirmed) {
                    let currentProducts = getProducts();
                    currentProducts = currentProducts.filter(p => p.id !== id);
                    saveProducts(currentProducts);
                    table.row(row).remove().draw();
                    Swal.fire('ডিলিট হয়েছে!', 'পণ্যটি ডিলিট করা হয়েছে।', 'success');
                }
            });
        });
    }

    // --- 5. Admin Order Table (Advanced) ---
    if ($('#admin-orders-table').length) {
        updateDashboardStats();
        const orders = getOrders();
        
        const table = $('#admin-orders-table').DataTable({
            data: orders,
            order: [[ 0, "desc" ]], // Order by ID desc
            dom: 'rtip',
            language: {
                search: "_INPUT_", searchPlaceholder: "অনুসন্ধান...",
                paginate: { next: '<i class="fas fa-chevron-right"></i>', previous: '<i class="fas fa-chevron-left"></i>' },
                zeroRecords: "কোন অর্ডার পাওয়া যায়নি", infoEmpty: "কোন অর্ডার নেই", info: "মোট _TOTAL_ টি অর্ডারের মধ্যে _START_ থেকে _END_ দেখানো হচ্ছে"
            },
            columns: [
                { data: 'id', className: "ps-4 fw-bold text-primary" },
                { data: 'customer', className: "fw-bold" },
                { data: 'date', className: "text-muted small" },
                { data: 'total', render: data => '<span class="fw-bold">৳' + data + '</span>' },
                { data: 'status', render: data => {
                    let color = 'secondary';
                    if (data === 'Delivered') color = 'success';
                    if (data === 'Pending') color = 'warning';
                    if (data === 'Cancelled') color = 'danger';
                    if (data === 'Processing') color = 'info';
                    return `<span class="badge bg-${color} rounded-pill">${data}</span>`;
                }},
                { data: null, className: "text-end pe-4", render: (data, type, row) => `<button class="btn btn-sm btn-outline-primary rounded-pill px-3 view-order" data-id="${row.id}">বিস্তারিত</button>` }
            ]
        });

        // Filter
        $('#statusFilter').on('change', function() { table.column(4).search($(this).val() || '', true, false).draw(); });

        // View Order Details Logic
        let currentOrderId = null;
        $(document).on('click', '.view-order', function() {
            const id = $(this).data('id');
            const order = getOrders().find(o => o.id === id);
            
            if (order) {
                currentOrderId = id;
                $('#modal-order-id').text(order.id);
                $('#modal-order-status').text(order.status)
                    .removeClass('bg-success bg-warning bg-danger bg-info bg-secondary')
                    .addClass(order.status === 'Delivered' ? 'bg-success' : order.status === 'Pending' ? 'bg-warning' : order.status === 'Cancelled' ? 'bg-danger' : 'bg-info');
                
                $('#modal-customer-name').text(order.customer);
                $('#modal-order-date').text(order.date);
                $('#modal-order-total').text('৳' + order.total);
                $('#modal-order-grand-total').text('৳' + (order.total + 60)); // +60 delivery charge mock
                
                $('#updateStatusSelect').val(order.status);
                
                $('#viewOrderModal').modal('show');
            }
        });

        // Update Status Logic
        $('#updateStatusBtn').click(function() {
            const newStatus = $('#updateStatusSelect').val();
            if (currentOrderId && newStatus) {
                let currentOrders = getOrders();
                const index = currentOrders.findIndex(o => o.id === currentOrderId);
                if (index !== -1) {
                    currentOrders[index].status = newStatus;
                    saveOrders(currentOrders);
                    
                    // Update Table Row without reload
                    table.clear().rows.add(currentOrders).draw();
                    
                    Swal.fire({
                        icon: 'success', title: 'আপডেট হয়েছে',
                        text: `অর্ডার স্ট্যাটাস ${newStatus}-এ পরিবর্তন করা হয়েছে`,
                        timer: 1500, showConfirmButton: false
                    });
                    $('#viewOrderModal').modal('hide');
                }
            }
        });
    }

});