$(document).ready(function() {
    // Sidebar Toggle
    $('#sidebarCollapse').on('click', function() {
        $('.sidebar').toggleClass('open');
        $('.content').toggleClass('full-width'); // Add css for full width if needed or rely on marginLeft: 0
    });

    // Logout
    $('#logoutBtn').on('click', function(e) {
        e.preventDefault();
        Swal.fire({
            title: 'Are you sure?',
            text: "You will be logged out!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, logout!'
        }).then((result) => {
            if (result.isConfirmed) {
                DB.logout();
            }
        });
    });

    // Load User Info in Sidebar/Navbar
    const user = JSON.parse(localStorage.getItem('user_session'));
    if (user) {
        $('.user-name-display').text(user.name);
    }
});
