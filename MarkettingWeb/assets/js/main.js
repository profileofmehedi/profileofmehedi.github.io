$(document).ready(function() {
    
    // Global products array to store fetched data
    let allProducts = [];

    // --- Helper: Load Products (LocalStorage > JSON > Demo) ---
    function loadProducts(callback) {
        const stored = localStorage.getItem('naturo_products');
        if (stored) {
            allProducts = JSON.parse(stored);
            callback(allProducts);
        } else {
            // Fetch from JSON
            $.ajax({
                url: 'assets/data/products.json',
                method: 'GET',
                dataType: 'json',
                success: function(data) {
                    allProducts = data;
                    // Persist for future consistency with Admin
                    localStorage.setItem('naturo_products', JSON.stringify(data)); 
                    callback(allProducts);
                },
                error: function() {
                    console.warn('AJAX failed/local file. Using demo data.');
                    allProducts = (typeof demoProducts !== 'undefined') ? demoProducts : [];
                    localStorage.setItem('naturo_products', JSON.stringify(allProducts));
                    callback(allProducts);
                }
            });
        }
    }

    // --- 1. Home Page Product List ---
    if ($('#product-list').length) {
        loadProducts(function(products) {
            renderProducts(products);
        });
    }

    // Render Products Function
    function renderProducts(products) {
        const productList = $('#product-list');
        productList.empty();

        if (products.length === 0) {
            productList.html('<div class="col-12 text-center">কোন পণ্য পাওয়া যায়নি।</div>');
            return;
        }

        products.forEach(product => {
            const html = `
                <div class="col-md-3 col-sm-6 product-item" data-category="${product.category}">
                    <div class="card product-card h-100 border-0 shadow-sm">
                        <div class="position-relative">
                            <img src="${product.image}" class="card-img-top" alt="${product.name}" style="height: 250px; object-fit: cover;">
                            <span class="badge bg-danger position-absolute top-0 start-0 m-2">ছাড়</span>
                        </div>
                        <div class="card-body text-center">
                            <h5 class="card-title fw-bold text-dark">${product.name}</h5>
                            <p class="text-muted small">${product.category}</p>
                            <div class="mb-2">
                                ${renderStars(product.rating)}
                            </div>
                            <div class="price mb-3">
                                <span class="text-decoration-line-through text-muted me-2">৳${product.original_price}</span>
                                <span class="fw-bold text-success fs-5">৳${product.price}</span>
                            </div>
                            <button class="btn btn-outline-success rounded-pill w-100 add-to-cart" 
                                data-id="${product.id}" 
                                data-name="${product.name}" 
                                data-price="${product.price}">
                                <i class="fas fa-shopping-cart me-1"></i> কার্টে যোগ করুন
                            </button>
                        </div>
                    </div>
                </div>
            `;
            productList.append(html);
        });
    }

    // Helper: Render Stars
    function renderStars(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars += '<i class="fas fa-star text-warning"></i>';
            } else if (i - 0.5 === rating) {
                stars += '<i class="fas fa-star-half-alt text-warning"></i>';
            } else {
                stars += '<i class="far fa-star text-warning"></i>';
            }
        }
        return stars;
    }

    // --- 2. Category Filtering ---
    $('.category-badge').on('click', function() {
        // Active class management
        $('.category-badge').removeClass('active');
        $(this).addClass('active');

        const category = $(this).data('filter');
        
        if (category === 'all') {
            renderProducts(allProducts);
        } else {
            const filtered = allProducts.filter(p => p.category === category);
            renderProducts(filtered);
        }
    });

    // --- 3. SweetAlert for Add to Cart ---
    $(document).on('click', '.add-to-cart', function() {
        const name = $(this).data('name');
        const price = $(this).data('price');

        Swal.fire({
            title: 'কার্টে যোগ হয়েছে!',
            text: `${name} আপনার কার্টে ৳${price} মূল্যে যোগ হয়েছে।`,
            icon: 'success',
            showCancelButton: true,
            confirmButtonColor: '#4CAF50',
            cancelButtonColor: '#d33',
            confirmButtonText: 'কার্টে যান',
            cancelButtonText: 'কেনাকাটা চালিয়ে যান'
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = 'cart.html';
            }
        });
    });

    // --- 4. Products Page (DataTable) ---
    if ($('#products-table').length) {
        // Initialize empty table first
        const table = $('#products-table').DataTable({
            language: {
                search: "অনুসন্ধান:",
                lengthMenu: "_MENU_ টি রেকর্ড দেখান",
                info: "_TOTAL_ টির মধ্যে _START_ থেকে _END_ দেখাচ্ছে",
                paginate: {
                    first: "প্রথম",
                    last: "শেষ",
                    next: "পরবর্তী",
                    previous: "পূর্ববর্তী"
                },
                zeroRecords: "কোন রেকর্ড পাওয়া যায়নি",
                infoEmpty: "কোন রেকর্ড উপলব্ধ নেই",
                infoFiltered: "(মোট _MAX_ রেকর্ড থেকে ফিল্টার করা হয়েছে)"
            },
            columns: [
                { data: 'id' },
                { 
                    data: 'image',
                    render: function(data) {
                        return `<img src="${data}" width="50" class="rounded">`;
                    }
                },
                { data: 'name' },
                { data: 'category' },
                { 
                    data: 'price',
                    render: function(data) { return '৳' + data; }
                },
                { 
                    data: null,
                    render: function(data, type, row) {
                        return `<button class="btn btn-sm btn-success add-to-cart" 
                                data-id="${row.id}" 
                                data-name="${row.name}" 
                                data-price="${row.price}">কিনুন</button>`;
                    }
                }
            ]
        });

        // Load data and populate
        loadProducts(function(products) {
            table.clear().rows.add(products).draw();
        });
    }

});