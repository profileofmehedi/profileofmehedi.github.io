// Initialize AOS Animation
$(document).ready(function() {
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false
    });

    updateCartCount();
});

// Update Cart Count in Navbar
function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let count = cart.length;
    $('#cart-count').text(count);
    
    // Animate badge if count changes
    if(count > 0) {
        $('#cart-count').addClass('animate__animated animate__bounceIn');
        setTimeout(() => {
            $('#cart-count').removeClass('animate__animated animate__bounceIn');
        }, 1000);
    }
}
