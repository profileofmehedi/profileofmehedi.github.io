/**
 * layout.js - Handles common layout interactions (Sidebar, Logout, Auth Check)
 */

// 1. Auth Check (Immediate)
const currentUser = JSON.parse(localStorage.getItem('pos_current_user'));
if (!currentUser) {
    // If we are in a subfolder (pages/), we need to go up one level
    if (window.location.pathname.includes('/pages/')) {
        window.location.href = '../index.html';
    } else {
        window.location.href = 'index.html';
    }
}

$(document).ready(function() {
    // 2. Sidebar Toggle
    $("#menu-toggle").click(function(e) {
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
    });

    // 3. Logout Logic
    $("#logout-btn").click(function(e) {
        e.preventDefault();
        Swal.fire({
            title: 'Ready to Leave?',
            text: "Select 'Logout' below if you are ready to end your current session.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#4e73df',
            cancelButtonColor: '#858796',
            confirmButtonText: 'Logout'
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem('pos_current_user');
                if (window.location.pathname.includes('/pages/')) {
                    window.location.href = '../index.html';
                } else {
                    window.location.href = 'index.html';
                }
            }
        });
    });

    // 4. Update Profile Info
    if (currentUser) {
        $("#user-name-display").text(currentUser.name);
        $("#user-role-display").text(currentUser.role);
    }
    
    // 5. Highlight Active Menu
    const path = window.location.pathname;
    const page = path.split("/").pop();
    $('.list-group-item').removeClass('active');
    
    // Simple matching
    $('.list-group-item').each(function() {
        const href = $(this).attr('href');
        // Handle ../ logic or direct logic
        if (href === page || href.endsWith(page)) {
            $(this).addClass('active');
        }
    });
});
