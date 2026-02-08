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

    // --- 1. Home Page Product List & Advanced Filtering ---
    
    // State Variables
    let currentPage = 1;
    const itemsPerPage = 8;
    let currentCategory = 'all';
    let searchQuery = '';
    let minPrice = null;
    let maxPrice = null;
    let sortBy = 'default';

    if ($('#product-list').length) {
        loadProducts(function(products) {
            filterAndRender();
        });
    }

    // Core Logic: Filter, Sort, Paginate, Render
    function filterAndRender() {
        let filtered = [...allProducts];

        // 1. Category Filter
        if (currentCategory !== 'all') {
            filtered = filtered.filter(p => p.category === currentCategory);
        }

        // 2. Search Filter
        if (searchQuery) {
            const lowerQuery = searchQuery.toLowerCase();
            filtered = filtered.filter(p => 
                p.name.toLowerCase().includes(lowerQuery) || 
                p.category.toLowerCase().includes(lowerQuery)
            );
        }

        // 3. Price Filter
        if (minPrice !== null) {
            filtered = filtered.filter(p => p.price >= minPrice);
        }
        if (maxPrice !== null) {
            filtered = filtered.filter(p => p.price <= maxPrice);
        }

        // 4. Sorting
        if (sortBy === 'priceLow') {
            filtered.sort((a, b) => a.price - b.price);
        } else if (sortBy === 'priceHigh') {
            filtered.sort((a, b) => b.price - a.price);
        } else if (sortBy === 'name') {
            filtered.sort((a, b) => a.name.localeCompare(b.name));
        }

        // 5. Pagination
        const totalItems = filtered.length;
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        
        // Ensure current page is valid
        if (currentPage > totalPages) currentPage = 1;
        if (currentPage < 1) currentPage = 1;

        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedItems = filtered.slice(startIndex, endIndex);

        // Render
        renderProducts(paginatedItems);
        renderPagination(totalPages);
    }

    // Render Products Function
    function renderProducts(products) {
        const productList = $('#product-list');
        productList.empty();

        if (products.length === 0) {
            productList.html('<div class="col-12 text-center py-5"><h5 class="text-muted">কোন পণ্য পাওয়া যায়নি।</h5></div>');
            return;
        }

        products.forEach(product => {
            const html = `
                <div class="col-md-3 col-sm-6 product-item">
                    <div class="card product-card h-100 border-0 shadow-sm">
                        <div class="position-relative cursor-pointer" onclick="window.location.href='product-details.html?id=${product.id}'">
                            <img src="${product.image}" class="card-img-top" alt="${product.name}" style="height: 250px; object-fit: cover;">
                            <span class="badge bg-danger position-absolute top-0 start-0 m-2">ছাড়</span>
                        </div>
                        <div class="card-body text-center">
                            <h5 class="card-title fw-bold text-dark cursor-pointer" onclick="window.location.href='product-details.html?id=${product.id}'">${product.name}</h5>
                            <p class="text-muted small">${product.category}</p>
                            <div class="mb-2">
                                ${renderStars(product.rating)}
                            </div>
                            <div class="price mb-3">
                                <span class="text-decoration-line-through text-muted me-2">৳${product.original_price}</span>
                                <span class="fw-bold text-success fs-5">৳${product.price}</span>
                            </div>
                            <div class="d-grid gap-2">
                                <button class="btn btn-outline-success rounded-pill add-to-cart" 
                                    data-id="${product.id}" 
                                    data-name="${product.name}" 
                                    data-price="${product.price}">
                                    <i class="fas fa-shopping-cart me-1"></i> কার্টে যোগ করুন
                                </button>
                                <a href="product-details.html?id=${product.id}" class="btn btn-link text-success text-decoration-none small fw-bold">বিস্তারিত দেখুন</a>
                            </div>
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

    // Render Pagination Function
    function renderPagination(totalPages) {
        const pagination = $('#pagination');
        pagination.empty();

        if (totalPages <= 1) return;

        // Previous
        pagination.append(`
            <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                <a class="page-link text-success" href="#" data-page="${currentPage - 1}">পূর্ববর্তী</a>
            </li>
        `);

        // Page Numbers
        for (let i = 1; i <= totalPages; i++) {
            pagination.append(`
                <li class="page-item ${i === currentPage ? 'active' : ''}">
                    <a class="page-link ${i === currentPage ? 'bg-success border-success' : 'text-success'}" href="#" data-page="${i}">${i}</a>
                </li>
            `);
        }

        // Next
        pagination.append(`
            <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
                <a class="page-link text-success" href="#" data-page="${currentPage + 1}">পরবর্তী</a>
            </li>
        `);
    }

    // --- Event Listeners ---

    // Pagination Click
    $(document).on('click', '.page-link', function(e) {
        e.preventDefault();
        const page = $(this).data('page');
        if (page) {
            currentPage = page;
            filterAndRender();
            // Scroll to top of products
            $('html, body').animate({
                scrollTop: $("#products").offset().top - 100
            }, 500);
        }
    });

    // Category Filter Click
    $('.category-badge').on('click', function() {
        $('.category-badge').removeClass('active');
        $(this).addClass('active');
        currentCategory = $(this).data('filter');
        currentPage = 1; // Reset to page 1
        filterAndRender();
    });

    // Search Input
    $('#searchInput').on('keyup', function() {
        searchQuery = $(this).val();
        currentPage = 1;
        filterAndRender();
    });

    // Price Inputs
    $('#minPrice, #maxPrice').on('input', function() {
        minPrice = $('#minPrice').val() ? parseFloat($('#minPrice').val()) : null;
        maxPrice = $('#maxPrice').val() ? parseFloat($('#maxPrice').val()) : null;
        currentPage = 1;
        filterAndRender();
    });

    // Sort Select
    $('#sortBy').on('change', function() {
        sortBy = $(this).val();
        currentPage = 1;
        filterAndRender();
    });

    // Clear Filters
    $('#clearFilters').on('click', function() {
        // Reset Variables
        currentCategory = 'all';
        searchQuery = '';
        minPrice = null;
        maxPrice = null;
        sortBy = 'default';
        currentPage = 1;

        // Reset UI
        $('.category-badge').removeClass('active');
        $('.category-badge[data-filter="all"]').addClass('active');
        $('#searchInput').val('');
        $('#minPrice').val('');
        $('#maxPrice').val('');
        $('#sortBy').val('default');

        filterAndRender();
    });

    // --- 3. SweetAlert for Add to Cart ---
    $(document).on('click', '.add-to-cart', function() {
        const id = $(this).data('id');
        const name = $(this).data('name');
        const price = $(this).data('price');
        
        // Find product in allProducts to get image and category
        const product = allProducts.find(p => p.id === id);
        
        // Get existing cart
        let cart = JSON.parse(localStorage.getItem('appxen_cart')) || [];
        
        // Check if already in cart
        const existingItem = cart.find(item => item.id === id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: id,
                name: name,
                price: price,
                image: product ? product.image : '',
                category: product ? product.category : '',
                quantity: 1
            });
        }
        
        // Save back to localStorage
        localStorage.setItem('appxen_cart', JSON.stringify(cart));

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