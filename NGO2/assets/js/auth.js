// Auth Guard
const checkAuth = () => {
    const user = DB.getCurrentUser();
    const path = window.location.pathname;

    // If on login page, redirect to dashboard if logged in
    if (path.includes('login.html')) {
        if (user) {
            redirectUser(user);
        }
        return;
    }

    // If not logged in and not on login page, go to login
    if (!user) {
        window.location.href = '../../pages/login.html';
        return;
    }

    // Role Based Access Control (Basic)
    if (path.includes('/super-admin/') && user.role !== 'super-admin') {
        alert('Access Denied');
        history.back();
    }
    // Add other checks as needed
};

const redirectUser = (user) => {
    const isLoginPage = window.location.pathname.includes('login.html');
    const prefix = isLoginPage ? '' : '../';
    
    switch(user.role) {
        case 'super-admin': window.location.href = prefix + 'super-admin/dashboard.html'; break;
        case 'ngo-admin': window.location.href = prefix + 'ngo-admin/dashboard.html'; break;
        case 'branch': window.location.href = prefix + 'branch/dashboard.html'; break;
        case 'officer': window.location.href = prefix + 'officer/dashboard.html'; break;
        case 'member': window.location.href = prefix + 'member/dashboard.html'; break;
        default: alert('Unknown Role');
    }
};

$(document).ready(function() {
    checkAuth();

    $('#loginForm').on('submit', function(e) {
        e.preventDefault();
        const email = $('#email').val();
        const password = $('#password').val();
        
        const user = DB.login(email, password);
        if (user) {
            redirectUser(user);
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Login Failed',
                text: 'Invalid email or password'
            });
        }
    });

    $('#logoutBtn').on('click', function(e) {
        e.preventDefault();
        DB.logout();
    });
});
