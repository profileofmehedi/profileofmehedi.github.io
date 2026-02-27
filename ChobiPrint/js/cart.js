$(document).ready(function() {
    const prices = {
        '4x6': 10,
        '5x7': 15,
        '8x10': 30,
        '10x12': 50
    };

    renderCart();

    function renderCart() {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const cartItemsBody = $('#cart-items');
        const emptyMsg = $('#empty-cart-msg');
        const summary = $('#cart-summary');
        const table = $('.table-responsive');

        cartItemsBody.empty();

        if (cart.length === 0) {
            table.addClass('d-none');
            summary.addClass('d-none');
            emptyMsg.removeClass('d-none');
            $('#subtotal').text('০ ৳');
            $('#total-price').text('০ ৳');
            return;
        }

        table.removeClass('d-none');
        summary.removeClass('d-none');
        emptyMsg.addClass('d-none');

        let subtotal = 0;

        cart.forEach((item, index) => {
            const price = prices[item.printSize] || 10;
            const itemTotal = price * item.quantity;
            subtotal += itemTotal;

            const html = `
                <tr data-aos="fade-up" data-aos-delay="${index * 50}">
                    <td>
                        <img src="${item.currentSrc}" class="rounded" width="60" height="60" style="object-fit: cover;">
                    </td>
                    <td>
                        <small class="d-block text-truncate" style="max-width: 150px;">${item.name}</small>
                        <span class="badge bg-secondary">${item.printSize}</span>
                    </td>
                    <td>${item.printSize}</td>
                    <td>
                        <input type="number" class="form-control form-control-sm bg-white text-dark border-secondary qty-input" 
                               value="${item.quantity}" min="1" data-id="${item.id}" style="width: 70px;">
                    </td>
                    <td>${itemTotal} ৳</td>
                    <td>
                        <button class="btn btn-sm btn-outline-danger remove-btn" data-id="${item.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
            cartItemsBody.append(html);
        });

        $('#subtotal').text(subtotal + ' ৳');
        const deliveryCharge = 60;
        $('#total-price').text((subtotal + deliveryCharge) + ' ৳');
    }

    // Update Quantity
    $(document).on('change', '.qty-input', function() {
        const id = $(this).data('id');
        let newQty = parseInt($(this).val());
        if (newQty < 1) newQty = 1;

        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const item = cart.find(i => i.id === id);
        if (item) {
            item.quantity = newQty;
            localStorage.setItem('cart', JSON.stringify(cart));
            renderCart();
            updateCartCount(); // from app.js
        }
    });

    // Remove Item
    $(document).on('click', '.remove-btn', function() {
        const id = $(this).data('id');
        
        Swal.fire({
            title: 'নিশ্চিত?',
            text: "আপনি কি এই ছবিটি কার্ট থেকে মুছে ফেলতে চান?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'হ্যাঁ, মুছুন',
            cancelButtonText: 'না'
        }).then((result) => {
            if (result.isConfirmed) {
                let cart = JSON.parse(localStorage.getItem('cart')) || [];
                cart = cart.filter(item => item.id !== id);
                localStorage.setItem('cart', JSON.stringify(cart));
                renderCart();
                updateCartCount(); // from app.js
                
                Swal.fire({
                    title: 'মুছে ফেলা হয়েছে!',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                });
            }
        });
    });
});
