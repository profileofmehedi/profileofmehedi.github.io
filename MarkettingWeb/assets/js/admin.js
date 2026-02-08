$(document).ready(function() {
    
    // --- 0. Theme Toggle Logic ---
    const themeToggleBtn = $('#theme-toggle');
    const body = $('body');
    const icon = themeToggleBtn.find('i');

    // Check Preference
    const currentTheme = localStorage.getItem('theme') || 'light';
    body.attr('data-theme', currentTheme);
    updateIcon(currentTheme);

    themeToggleBtn.click(function() {
        let newTheme = body.attr('data-theme') === 'light' ? 'dark' : 'light';
        body.attr('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateIcon(newTheme);
        
        // Refresh charts if they exist to pick up new colors (optional but good)
        if (window.salesChartInstance) {
            window.salesChartInstance.options.scales.x.ticks.color = newTheme === 'dark' ? '#e0e0e0' : '#666';
            window.salesChartInstance.options.scales.y.ticks.color = newTheme === 'dark' ? '#e0e0e0' : '#666';
            window.salesChartInstance.update();
        }
    });

    function updateIcon(theme) {
        if (theme === 'dark') {
            icon.removeClass('fa-moon').addClass('fa-sun');
        } else {
            icon.removeClass('fa-sun').addClass('fa-moon');
        }
    }


    // --- 1. Authentication Logic ---
    const path = window.location.pathname;
    const page = path.split("/").pop();
    const isLoginPage = page.includes('admin-login.html');
    const isAdminPage = page.includes('admin');

    if (isAdminPage && !isLoginPage) {
        if (localStorage.getItem('adminLoggedIn') !== 'true') {
            window.location.href = 'admin-login.html';
            return;
        }
    }

    if (isLoginPage) {
        $('#login-form').submit(function(e) {
            e.preventDefault();
            const email = $('#email').val();
            const password = $('#password').val();
            if (email === 'admin@naturo.com' && password === 'admin123') {
                localStorage.setItem('adminLoggedIn', 'true');
                if (!localStorage.getItem('naturo_products')) localStorage.setItem('naturo_products', JSON.stringify(demoProducts));
                if (!localStorage.getItem('naturo_orders')) localStorage.setItem('naturo_orders', JSON.stringify(demoOrders));

                Swal.fire({ icon: 'success', title: 'লগইন সফল', showConfirmButton: false, timer: 1500 }).then(() => window.location.href = 'admin.html');
            } else {
                Swal.fire({ icon: 'error', title: 'লগইন ব্যর্থ', text: 'ভুল ইমেইল বা পাসওয়ার্ড।' });
            }
        });
        return;
    }

    $(document).on('click', '#logout-btn', function(e) {
        e.preventDefault();
        localStorage.removeItem('adminLoggedIn');
        window.location.href = 'admin-login.html';
    });


    // --- 2. Data Initialization ---
    function getProducts() {
        const stored = localStorage.getItem('naturo_products');
        let products = stored ? JSON.parse(stored) : demoProducts;
        return products.map(p => ({ ...p, stock: p.stock !== undefined ? p.stock : 20 }));
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
    
    if (!localStorage.getItem('naturo_products')) saveProducts(demoProducts);
    if (!localStorage.getItem('naturo_orders')) saveOrders(demoOrders);


    // --- Helper: Update Stats ---
    function updateDashboardStats() {
        const products = getProducts();
        const orders = getOrders();

        if ($('#stat-total-products').length) $('#stat-total-products').text(products.length);
        if ($('#stat-low-stock').length) $('#stat-low-stock').text(products.filter(p => p.stock < 10).length);
        if ($('#stat-inventory-value').length) {
            const val = products.reduce((acc, p) => acc + (p.price * p.stock), 0);
            $('#stat-inventory-value').text('৳' + val.toLocaleString());
        }

        if ($('#stat-total-orders').length) $('#stat-total-orders').text(orders.length);
        if ($('#stat-pending-orders').length) $('#stat-pending-orders').text(orders.filter(o => o.status === 'Pending').length);
        if ($('#stat-completed-orders').length) $('#stat-completed-orders').text(orders.filter(o => o.status === 'Delivered').length);

        if ($('#admin-dashboard-stats').length) {
            const totalRevenue = orders.reduce((acc, curr) => acc + parseFloat(curr.total), 0);
            $('#total-products').text(products.length);
            $('#total-orders').text(orders.length);
            $('#total-revenue').text('৳' + totalRevenue.toLocaleString());
            $('#pending-orders').text(orders.filter(o => o.status === 'Pending').length);
        }
    }

    // --- 3. Dashboard Charts ---
    if ($('#salesChart').length) {
        updateDashboardStats();
        
        const ctxSales = document.getElementById('salesChart').getContext('2d');
        window.salesChartInstance = new Chart(ctxSales, {
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
                scales: { 
                    y: { beginAtZero: true, ticks: { color: body.attr('data-theme') === 'dark' ? '#e0e0e0' : '#666' } },
                    x: { ticks: { color: body.attr('data-theme') === 'dark' ? '#e0e0e0' : '#666' } }
                }
            }
        });

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
                plugins: { legend: { position: 'bottom', labels: { color: body.attr('data-theme') === 'dark' ? '#e0e0e0' : '#666' } } }
            }
        });
    }

    // --- 4. Products Page ---
    if ($('#admin-products-table').length) {
        updateDashboardStats();
        const products = getProducts();
        
        const table = $('#admin-products-table').DataTable({
            data: products,
            dom: 'rtip',
            language: {
                search: "_INPUT_", searchPlaceholder: "অনুসন্ধান...",
                paginate: { next: '<i class="fas fa-chevron-right"></i>', previous: '<i class="fas fa-chevron-left"></i>' },
                zeroRecords: "কোন পণ্য পাওয়া যায়নি"
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
                title: 'নিশ্চিত?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#d33', confirmButtonText: 'হ্যাঁ'
            }).then((result) => {
                if (result.isConfirmed) {
                    let currentProducts = getProducts();
                    currentProducts = currentProducts.filter(p => p.id !== id);
                    saveProducts(currentProducts);
                    table.row(row).remove().draw();
                    Swal.fire('ডিলিট হয়েছে!', '', 'success');
                }
            });
        });
    }

    // --- 5. Orders Page (Excel/PDF Export Included) ---
    if ($('#admin-orders-table').length) {
        updateDashboardStats();
        const orders = getOrders();
        
        const table = $('#admin-orders-table').DataTable({
            data: orders,
            order: [[ 0, "desc" ]],
            dom: 'rtip',
            language: { search: "_INPUT_", searchPlaceholder: "অনুসন্ধান...", zeroRecords: "কোন অর্ডার পাওয়া যায়নি" },
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

        $('#statusFilter').on('change', function() { table.column(4).search($(this).val() || '', true, false).draw(); });

        // Export to Excel
        $('#exportExcel').click(function() {
            const ws = XLSX.utils.json_to_sheet(getOrders());
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Orders");
            XLSX.writeFile(wb, "Naturo_Orders.xlsx");
        });

        // Export to PDF (Simple List)
        $('#exportPDF').click(function() {
             const { jsPDF } = window.jspdf;
             const doc = new jsPDF();
             
             doc.text("NaturoBD Order Report", 14, 15);
             doc.autoTable({
                 head: [['ID', 'Customer', 'Date', 'Total', 'Status']],
                 body: getOrders().map(o => [o.id, o.customer, o.date, o.total, o.status]),
                 startY: 20
             });
             doc.save("Naturo_Orders.pdf");
        });


        // View Order & PDF Invoice
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
                $('#modal-order-grand-total').text('৳' + (order.total + 60));
                
                $('#updateStatusSelect').val(order.status);
                $('#viewOrderModal').modal('show');
            }
        });

        // Download Invoice PDF
        $('#downloadInvoiceBtn').click(function() {
             if(!currentOrderId) return;
             const order = getOrders().find(o => o.id === currentOrderId);
             const { jsPDF } = window.jspdf;
             const doc = new jsPDF();

             // Header
             doc.setFontSize(22);
             doc.setTextColor(76, 175, 80); // Naturo Green
             doc.text("NaturoBD", 14, 20);
             
             doc.setFontSize(12);
             doc.setTextColor(0, 0, 0);
             doc.text("INVOICE", 160, 20);
             doc.text(`Order ID: ${order.id}`, 160, 26);
             doc.text(`Date: ${order.date}`, 160, 32);

             // Customer Info
             doc.text("Bill To:", 14, 40);
             doc.setFont("helvetica", "bold");
             doc.text(order.customer, 14, 46);
             doc.setFont("helvetica", "normal");
             doc.text("Dhaka, Bangladesh", 14, 52);

             // Items Table (Mock items since we don't track per-order items in this simple demo)
             doc.autoTable({
                 startY: 60,
                 head: [['Item', 'Qty', 'Price', 'Total']],
                 body: [
                     ['Assorted Organic Products', '1', order.total, order.total]
                 ],
                 theme: 'striped',
                 headStyles: { fillColor: [76, 175, 80] }
             });

             // Totals
             const finalY = doc.lastAutoTable.finalY + 10;
             doc.text(`Subtotal: ${order.total} Taka`, 140, finalY, { align: 'right' });
             doc.text(`Delivery: 60 Taka`, 140, finalY + 6, { align: 'right' });
             doc.setFont("helvetica", "bold");
             doc.text(`Grand Total: ${order.total + 60} Taka`, 140, finalY + 14, { align: 'right' });

             doc.save(`Invoice_${order.id}.pdf`);
        });

        // Update Status & Deduct Stock
        $('#updateStatusBtn').click(function() {
            const newStatus = $('#updateStatusSelect').val();
            if (currentOrderId && newStatus) {
                let currentOrders = getOrders();
                const index = currentOrders.findIndex(o => o.id === currentOrderId);
                const oldStatus = currentOrders[index].status;

                if (index !== -1) {
                    currentOrders[index].status = newStatus;
                    saveOrders(currentOrders);
                    
                    // Stock Deduct Logic (Simple Simulation)
                    // If moving to Delivered from non-Delivered, reduce stock of a random product
                    if (newStatus === 'Delivered' && oldStatus !== 'Delivered') {
                        let products = getProducts();
                        // Deduct from first product just to show it working
                        if (products.length > 0) {
                            products[0].stock = Math.max(0, products[0].stock - 1);
                            saveProducts(products);
                            Swal.fire({ icon: 'info', title: 'স্টক আপডেট', text: 'একটি পণ্যের স্টক স্বয়ংক্রিয়ভাবে কমানো হয়েছে।', timer: 2000 });
                        }
                    }

                    table.clear().rows.add(currentOrders).draw();
                    Swal.fire({ icon: 'success', title: 'আপডেট হয়েছে', timer: 1500, showConfirmButton: false });
                    $('#viewOrderModal').modal('hide');
                }
            }
        });
    }

});