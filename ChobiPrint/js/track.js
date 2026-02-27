$(document).ready(function() {
    let currentOrder = null;

    $('#track-btn').on('click', function() {
        const trackId = $('#tracking-id-input').val().trim().toUpperCase();
        if (!trackId) return;

        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        currentOrder = orders.find(o => o.id === trackId);

        if (currentOrder) {
            showTrackingInfo(currentOrder);
        } else {
            Swal.fire({
                icon: 'error',
                title: 'দুঃখিত',
                text: 'এই আইডি দিয়ে কোনো অর্ডার খুঁজে পাওয়া যায়নি।',
                background: '#fff',
                color: '#000'
            });
        }
    });

    function showTrackingInfo(order) {
        $('#tracking-result').removeClass('d-none');
        $('#res-id').text(order.id);
        $('#res-date').text('তারিখ: ' + order.date);
        
        // Reset steps
        $('.timeline-item').removeClass('active');
        $('#step-pending').addClass('active');
        
        let statusText = 'পেন্ডিং';
        let badgeClass = 'bg-primary';

        if (order.status === 'pending') {
            statusText = 'অর্ডার গ্রহণ করা হয়েছে';
        } else if (order.status === 'edited') {
            statusText = 'এডিট করা হয়েছে - অনুমোদন প্রয়োজন';
            badgeClass = 'bg-warning text-dark';
            $('#step-edited').addClass('active');
            showApprovalSection(order);
        } else if (order.status === 'confirmed') {
            statusText = 'অনুমোদিত - প্রিন্টিং চলছে';
            badgeClass = 'bg-success';
            $('#step-edited').addClass('active');
            $('#approval-section').addClass('d-none');
        } else if (order.status === 'shipped') {
            statusText = 'কুরিয়ারে পাঠানো হয়েছে';
            badgeClass = 'bg-info text-dark';
            $('#step-edited').addClass('active');
            $('#step-shipped').addClass('active');
            $('#approval-section').addClass('d-none');
        }

        $('#res-status-badge').text(statusText).removeClass().addClass('badge rounded-pill p-2 px-3 ' + badgeClass);
        
        // Scroll to result
        $('html, body').animate({
            scrollTop: $("#tracking-result").offset().top - 100
        }, 500);
    }

    function showApprovalSection(order) {
        $('#approval-section').removeClass('d-none');
        $('#edited-previews').empty();
        
        order.items.forEach(item => {
            const html = `
                <div class="col-6 col-md-4">
                    <div class="card border-0 shadow-sm">
                        <img src="${item.currentSrc}" class="card-img-top rounded" style="height: 150px; object-fit: cover;">
                        <div class="p-2 text-center small text-muted">এডিট করা ভার্সন</div>
                    </div>
                </div>
            `;
            $('#edited-previews').append(html);
        });
    }

    // Confirm Order
    $('#confirm-order-btn').on('click', function() {
        updateOrderStatus('confirmed');
        Swal.fire({
            icon: 'success',
            title: 'ধন্যবাদ!',
            text: 'আপনি অর্ডারটি নিশ্চিত করেছেন। আমরা এখনই প্রিন্টিং শুরু করছি।',
            confirmButtonText: 'ঠিক আছে'
        });
    });

    // Demo: Simulate Admin Action
    $('#demo-mark-edited').on('click', function() {
        if (!currentOrder) return;
        updateOrderStatus('edited');
        showTrackingInfo(currentOrder);
        Swal.fire('সিমুলেশন', 'অর্ডারটি এখন "Edited" স্ট্যাটাসে আছে।', 'info');
    });

    function updateOrderStatus(newStatus) {
        let orders = JSON.parse(localStorage.getItem('orders')) || [];
        const index = orders.findIndex(o => o.id === currentOrder.id);
        if (index > -1) {
            orders[index].status = newStatus;
            localStorage.setItem('orders', JSON.stringify(orders));
            currentOrder = orders[index];
            showTrackingInfo(currentOrder);
        }
    }
});
