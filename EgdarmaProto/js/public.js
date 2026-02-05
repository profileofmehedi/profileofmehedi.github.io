/**
 * Egdarma - Public Homepage Logic
 * Features: Product Listing, Guest Cart, Checkout
 */

const PublicApp = {
    cart: [],

    init: function() {
        this.renderProducts();
        this.updateCartUI();
        
        // Setup Form
        $('#paymentForm').on('submit', function(e) {
            e.preventDefault();
            PublicApp.processOrder();
        });
    },

    renderProducts: function() {
        const products = DB.getProducts();
        let html = '';
        
        products.forEach(p => {
            html += `
                <div class="col-md-4 col-lg-3 mb-4">
                    <div class="card h-100 border-0 shadow-sm product-hover">
                        <div class="card-img-top bg-light d-flex align-items-center justify-content-center" style="height: 200px;">
                            <i class="fas fa-pump-soap fa-3x text-secondary"></i>
                        </div>
                        <div class="card-body">
                            <small class="text-primary fw-bold">${p.category}</small>
                            <h5 class="card-title mt-1">${p.name}</h5>
                            <p class="card-text text-muted small">${p.description || 'Clinical grade skincare.'}</p>
                            <div class="d-flex justify-content-between align-items-center mt-3">
                                <span class="fw-bold fs-5">৳ ${p.price}</span>
                                <button class="btn btn-outline-primary rounded-pill btn-sm" onclick="PublicApp.addToCart(${p.id})">
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
        
        $('#public-product-list').html(html);
    },

    addToCart: function(id) {
        const products = DB.getProducts();
        const product = products.find(p => p.id === id);
        
        if (product) {
            this.cart.push(product);
            this.updateCartUI();
            
            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 1500
            });
            Toast.fire({
                icon: 'success',
                title: 'Added to cart'
            });
        }
    },

    removeFromCart: function(index) {
        this.cart.splice(index, 1);
        this.updateCartUI();
    },

    updateCartUI: function() {
        const count = this.cart.length;
        const $badge = $('#public-cart-count');
        
        if (count > 0) {
            $badge.text(count).show();
            $badge.addClass('animate__animated animate__pulse');
        } else {
            $badge.hide();
        }

        // Render Modal Items
        let itemsHtml = '';
        let total = 0;
        
        if (count === 0) {
            itemsHtml = '<div class="text-center py-4 text-muted"><i class="fas fa-shopping-basket fa-2x mb-2"></i><br>Your cart is empty</div>';
        } else {
            this.cart.forEach((item, index) => {
                total += item.price;
                itemsHtml += `
                    <div class="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                        <div>
                            <h6 class="mb-0">${item.name}</h6>
                            <small class="text-muted">৳ ${item.price}</small>
                        </div>
                        <button class="btn btn-sm text-danger" onclick="PublicApp.removeFromCart(${index})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `;
            });
        }
        
        $('#cart-items-container').html(itemsHtml);
        $('#cart-total').text('৳ ' + total);
    },

    toggleCart: function() {
        const modal = new bootstrap.Modal(document.getElementById('cartModal'));
        modal.show();
    },

    checkout: function() {
        if (this.cart.length === 0) {
            Swal.fire('Empty Cart', 'Please add items first.', 'info');
            return;
        }
        // Hide Cart Modal, Show Payment Modal
        $('#cartModal').modal('hide');
        const payModal = new bootstrap.Modal(document.getElementById('paymentModal'));
        payModal.show();
    },

    processOrder: function() {
        // Simulate Processing
        $('#paymentModal').modal('hide');
        
        Swal.fire({
            title: 'Processing Order',
            html: 'Please wait while we confirm your details...',
            timer: 2000,
            timerProgressBar: true,
            didOpen: () => {
                Swal.showLoading();
            }
        }).then(() => {
            // Save Order to DB (Simulated Guest Order)
            const orders = DB.getOrders();
            const total = this.cart.reduce((sum, i) => sum + i.price, 0);
            
            orders.push({
                id: Date.now(),
                date: new Date().toISOString().split('T')[0],
                doctor: 'Guest Customer', // Marking as guest
                total: total,
                status: 'New Order',
                items: `${this.cart.length} Items`
            });
            DB.setOrders(orders);
            
            // Clear Cart
            this.cart = [];
            this.updateCartUI();
            
            Swal.fire({
                icon: 'success',
                title: 'Order Confirmed!',
                text: 'Your order has been placed successfully. Use Order ID #' + Date.now() + ' for tracking.',
                confirmButtonColor: '#004aad'
            });
        });
    }
};

$(document).ready(function() {
    PublicApp.init();
});
